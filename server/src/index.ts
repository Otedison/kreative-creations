import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Admin JWT helpers & endpoints (file-backed secrets + runtime rotation) ---
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Use a path relative to this source file so the admin data location is deterministic
const ADMIN_DATA_FILE = path.join(__dirname, '..', 'data', 'admin.json');
let adminPasswordHash = '';
let jwtSecret = '';

function ensureAdminDataDir() {
  const dir = path.dirname(ADMIN_DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveAdminSecrets() {
  ensureAdminDataDir();
  fs.writeFileSync(ADMIN_DATA_FILE, JSON.stringify({ passwordHash: adminPasswordHash, jwtSecret }, null, 2));
}

function loadAdminSecrets() {
  // Priority: in-memory file -> process.env -> generate defaults
  if (fs.existsSync(ADMIN_DATA_FILE)) {
    try {
      const raw = fs.readFileSync(ADMIN_DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      adminPasswordHash = parsed.passwordHash || '';
      jwtSecret = parsed.jwtSecret || '';
      return;
    } catch (err) {
      console.warn('Failed to load admin secrets file:', err);
    }
  }

  // Env fallback
  if (process.env.ADMIN_PASSWORD) {
    adminPasswordHash = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest('hex');
  }
  if (process.env.ADMIN_JWT_SECRET) {
    jwtSecret = process.env.ADMIN_JWT_SECRET;
  }

  // If nothing found, generate defaults and persist
  if (!adminPasswordHash) {
    const defaultPass = 'change-me-locally';
    adminPasswordHash = crypto.createHash('sha256').update(defaultPass).digest('hex');
  }
  if (!jwtSecret) {
    jwtSecret = crypto.randomBytes(32).toString('hex');
  }

  saveAdminSecrets();
}

loadAdminSecrets();

function passwordsMatch(hashedStored: string, plainPasswordCandidate: string) {
  const candidateHash = crypto.createHash('sha256').update(plainPasswordCandidate).digest('hex');
  const ah = Buffer.from(hashedStored, 'hex');
  const bh = Buffer.from(candidateHash, 'hex');
  if (ah.length !== bh.length) return false;
  return crypto.timingSafeEqual(ah, bh);
}

function verifyAdminToken(token: string) {
  try {
    jwt.verify(token, jwtSecret);
    return true;
  } catch {
    return false;
  }
}

// Simple file-backed collection helpers to use when MongoDB is not available (dev fallback)
function collectionFilePath(name: string) {
  // Use a deterministic path relative to this file so the server always looks
  // at `server/data` regardless of the current working directory.
  const dir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${name}.json`);
}

function readCollectionFile(name: string) {
  const p = collectionFilePath(name);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) || [];
  } catch {
    return [];
  }
}

function writeCollectionFile(name: string, data: any[]) {
  const p = collectionFilePath(name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function normalizeCategoryCode(category?: string) {
  if (!category) return 'GEN';
  const key = category.trim().toLowerCase();
  const map: Record<string, string> = {
    engineering: 'ENG',
    marketing: 'MKT',
    design: 'DES',
    product: 'PRD',
    sales: 'SAL',
    operations: 'OPS',
    finance: 'FIN',
    hr: 'HR',
    people: 'PEO',
    content: 'CON',
    strategy: 'STR',
  };
  if (map[key]) return map[key];
  const letters = category.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (!letters) return 'GEN';
  return letters.slice(0, 3).padEnd(3, 'X');
}

function nextReferenceFromJobs(jobs: any[], category?: string) {
  const code = normalizeCategoryCode(category);
  const prefix = `KC-${code}-`;
  let max = 0;
  for (const job of jobs) {
    const ref = job?.reference;
    if (typeof ref === 'string' && ref.startsWith(prefix)) {
      const num = parseInt(ref.slice(prefix.length), 10);
      if (!Number.isNaN(num)) max = Math.max(max, num);
    }
  }
  const next = String(max + 1).padStart(4, '0');
  return `${prefix}${next}`;
}

function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = (req.headers['authorization'] as string) || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = parts[1];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: 'Password required' });
  if (!adminPasswordHash || !jwtSecret) {
    return res.status(500).json({ message: 'Admin auth not configured' });
  }
  if (!passwordsMatch(adminPasswordHash, password)) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '8h' });
  res.json({ token });
});

// Verify current token
app.get('/api/admin/me', verifyAdmin, (req, res) => {
  res.json({ isAdmin: true });
});

// Admin rotate endpoint (rotate password and/or jwt secret)
app.post('/api/admin/rotate', verifyAdmin, async (req, res) => {
  try {
    const { newPassword, rotateSecret } = req.body || {};
    let returned: any = {};

    if (newPassword) {
      adminPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    }
    if (rotateSecret) {
      jwtSecret = crypto.randomBytes(32).toString('hex');
      returned.jwtSecret = jwtSecret;
    }

    saveAdminSecrets();
    res.json({ success: true, ...returned });
  } catch (err) {
    console.error('Failed to rotate admin secrets:', err);
    res.status(500).json({ message: 'Failed to rotate admin secrets' });
  }
});

// File upload / image upload (admin only)
const upload = multer({ storage: multer.memoryStorage() });

// Ensure uploads dir exists for local fallback
const UPLOADS_DIR = path.join(process.cwd(), 'server/public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

app.post('/api/admin/upload-image', verifyAdmin, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // If S3 configured, upload there
    const S3_BUCKET = process.env.S3_BUCKET || '';
    const S3_REGION = process.env.S3_REGION || '';
    const S3_KEY_PREFIX = process.env.S3_KEY_PREFIX || '';

    const ext = (file.originalname || '').split('.').pop() || 'bin';
    const key = `${S3_KEY_PREFIX}uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    if (S3_BUCKET && S3_REGION && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
      const s3 = new S3Client({ region: S3_REGION, credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! } });
      const put = new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: file.buffer, ContentType: file.mimetype, ACL: 'public-read' as any });
      await s3.send(put);

      const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
      return res.json({ url });
    }

    // Local fallback: write to server/public/uploads
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, file.buffer);
    const url = `/uploads/${filename}`;
    res.json({ url });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || '' /* set MONGODB_URI in environment */;  
// NOTE: embedded credentials removed for security.
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'kreative_db';

let db: any = null;
let inMemoryMongo: any = null;

async function connectToDatabase() {
  if (db) return db;

  try {
    // If no MONGODB_URI provided, spin up an in-memory MongoDB for dev/test
    let uri = MONGODB_URI;
    if (!uri) {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        inMemoryMongo = await MongoMemoryServer.create();
        uri = inMemoryMongo.getUri();
        console.log('Started in-memory MongoDB for development');
      } catch (err) {
        console.warn('Failed to start in-memory MongoDB (ensure mongodb-memory-server is installed):', err);
        throw err;
      }
    }

    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB');

    // Seed initial data from backup JSON files if collections are empty
    try {
      const blogsCount = await db.collection('blogs').countDocuments();
      if (blogsCount === 0) {
        const backupPath = path.join(process.cwd(), 'mongo-backup-2026-02-01', 'blogs.json');
        if (fs.existsSync(backupPath)) {
          const raw = fs.readFileSync(backupPath, 'utf-8');
          const arr = JSON.parse(raw);
          if (Array.isArray(arr) && arr.length) {
            // Remove any _id strings so Mongo can create ObjectIds
            const docs = arr.map((d: any) => {
              const copy = { ...d };
              delete copy._id;
              return copy;
            });
            await db.collection('blogs').insertMany(docs);
            console.log('Seeded blogs from backup');
          }
        }
      }

      const commentsCount = await db.collection('comments').countDocuments();
      if (commentsCount === 0) {
        const cb = path.join(process.cwd(), 'mongo-backup-2026-02-01', 'comments.json');
        if (fs.existsSync(cb)) {
          const raw = fs.readFileSync(cb, 'utf-8');
          const arr = JSON.parse(raw);
          if (Array.isArray(arr) && arr.length) {
            const docs = arr.map((d: any) => {
              const copy = { ...d };
              delete copy._id;
              return copy;
            });
            await db.collection('comments').insertMany(docs);
            console.log('Seeded comments from backup');
          }
        }
      }
    } catch (err) {
      console.warn('Seeding data failed:', err);
    }

    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// ============================================
// Blog Routes
// ============================================

// GET /api/blogs - Get all published blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const blogs = await database
      .collection('blogs')
      .find({ is_published: true })
      .sort({ published_at: -1 })
      .toArray();
    
    // Convert MongoDB documents to plain objects
    const plainBlogs = blogs.map(blog => {
      const { _id, ...rest } = blog;
      return { id: _id?.toString(), ...rest };
    });
    
    res.json(plainBlogs);
  } catch (error) {
    console.warn('MongoDB not available, falling back to file data for blogs:', error?.message || error);
    const blogs = readCollectionFile('blogs')
      .filter((b: any) => b.is_published)
      .sort((a: any, b: any) => (b.published_at || '') > (a.published_at || '') ? 1 : -1)
      .map((b: any) => ({ id: b.id, ...b }));
    res.json(blogs);
  }
});

// GET /api/blogs/all - Get all blogs (admin)
app.get('/api/blogs/all', verifyAdmin, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const blogs = await database
      .collection('blogs')
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    const plainBlogs = blogs.map(blog => {
      const { _id, ...rest } = blog;
      return { id: _id?.toString(), ...rest };
    });
    
    return res.json(plainBlogs);
  } catch (error) {
    console.warn('MongoDB not available, falling back to file data for admin blogs:', error?.message || error);
    const blogs = readCollectionFile('blogs')
      .sort((a: any, b: any) => (b.created_at || '') > (a.created_at || '') ? 1 : -1)
      .map((b: any) => ({ id: b.id, ...b }));
    return res.json(blogs);
  }
});

// GET /api/blogs/:slug - Get blog by slug
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    try {
      const database = await connectToDatabase();
      const blog = await database
        .collection('blogs')
        .findOne({ slug, is_published: true });
      
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      const { _id, ...rest } = blog;
      return res.json({ id: _id?.toString(), ...rest });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback for blog by slug:', err?.message || err);
      const blogs = readCollectionFile('blogs');
      const blog = blogs.find((b: any) => b.slug === slug && b.is_published);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.json(blog);
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
});

// POST /api/blogs - Create new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const blogData = req.body;
    const now = new Date().toISOString();

    try {
      const database = await connectToDatabase();
      const result = await database.collection('blogs').insertOne({
        ...blogData,
        is_published: blogData.is_published ?? false,
        is_featured: blogData.is_featured ?? false,
        created_at: now,
        updated_at: now,
      });
      return res.status(201).json({ id: result.insertedId.toString(), ...blogData });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to create blog:', err?.message || err);
      const blogs = readCollectionFile('blogs');
      const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      const doc = { id, ...blogData, is_published: blogData.is_published ?? false, is_featured: blogData.is_featured ?? false, created_at: now, updated_at: now };
      blogs.unshift(doc);
      writeCollectionFile('blogs', blogs);
      return res.status(201).json({ id, ...blogData });
    }
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
});

// PUT /api/blogs/:id - Update blog
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    try {
      const database = await connectToDatabase();
      const { ObjectId } = await import('mongodb');
      const result = await database.collection('blogs').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updated_at: new Date().toISOString() } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      return res.json({ success: true });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to update blog:', err?.message || err);
      const blogs = readCollectionFile('blogs');
      const idx = blogs.findIndex((b: any) => b.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Blog not found' });
      blogs[idx] = { ...blogs[idx], ...updates, updated_at: new Date().toISOString() };
      writeCollectionFile('blogs', blogs);
      return res.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
});

// DELETE /api/blogs/:id - Delete blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const database = await connectToDatabase();
      const { ObjectId } = await import('mongodb');
      const result = await database.collection('blogs').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      return res.json({ success: true });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to delete blog:', err?.message || err);
      const blogs = readCollectionFile('blogs');
      const newBlogs = blogs.filter((b: any) => b.id !== id);
      if (newBlogs.length === blogs.length) return res.status(404).json({ message: 'Blog not found' });
      writeCollectionFile('blogs', newBlogs);
      return res.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

// ============================================
// Jobs Routes
// ============================================

// GET /api/jobs - Get active jobs (public)
app.get('/api/jobs', async (req, res) => {
  try {
    const { category, type, location } = req.query;
    try {
      const database = await connectToDatabase();
      const query: any = { is_active: true };
      if (category && typeof category === 'string') query.category = category;
      if (type && typeof type === 'string') query.type = type;
      if (location && typeof location === 'string') query.location = location;
      const jobs = await database
        .collection('jobs')
        .find(query)
        .sort({ created_at: -1 })
        .toArray();
      const plainJobs = jobs.map(job => {
        const { _id, ...rest } = job;
        return { id: _id?.toString(), ...rest };
      });
      return res.json(plainJobs);
    } catch (err) {
      console.warn('MongoDB not available, using file fallback for jobs:', err?.message || err);
      const jobs = readCollectionFile('jobs')
        .filter((j: any) => j.is_active)
        .filter((j: any) => (category && typeof category === 'string') ? j.category === category : true)
        .filter((j: any) => (type && typeof type === 'string') ? j.type === type : true)
        .filter((j: any) => (location && typeof location === 'string') ? j.location === location : true)
        .sort((a: any, b: any) => (b.created_at || '') > (a.created_at || '') ? 1 : -1)
        .map((j: any) => ({ id: j.id, ...j }));
      return res.json(jobs);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/all - Get all jobs (admin)
app.get('/api/jobs/all', verifyAdmin, async (req, res) => {
  try {
    try {
      const database = await connectToDatabase();
      const jobs = await database
        .collection('jobs')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      const plainJobs = jobs.map(job => {
        const { _id, ...rest } = job;
        return { id: _id?.toString(), ...rest };
      });
      return res.json(plainJobs);
    } catch (err) {
      console.warn('MongoDB not available, using file fallback for admin jobs:', err?.message || err);
      const jobs = readCollectionFile('jobs')
        .sort((a: any, b: any) => (b.created_at || '') > (a.created_at || '') ? 1 : -1)
        .map((j: any) => ({ id: j.id, ...j }));
      return res.json(jobs);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// POST /api/jobs - Create job (admin)
app.post('/api/jobs', verifyAdmin, async (req, res) => {
  try {
    const jobData = req.body || {};
    const now = new Date().toISOString();

    if (!jobData.title || !jobData.type || !jobData.location) {
      return res.status(400).json({ message: 'Title, type, and location are required' });
    }

    try {
      const database = await connectToDatabase();
      const existingJobs = await database.collection('jobs').find({}).project({ reference: 1, category: 1 }).toArray();
      const reference = jobData.reference || nextReferenceFromJobs(existingJobs, jobData.category);
      const result = await database.collection('jobs').insertOne({
        ...jobData,
        reference,
        is_active: jobData.is_active ?? true,
        created_at: now,
        updated_at: now,
      });
      return res.status(201).json({ id: result.insertedId.toString(), ...jobData, reference });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to create job:', err?.message || err);
      const jobs = readCollectionFile('jobs');
      const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      const reference = jobData.reference || nextReferenceFromJobs(jobs, jobData.category);
      const doc = { id, ...jobData, reference, is_active: jobData.is_active ?? true, created_at: now, updated_at: now };
      jobs.unshift(doc);
      writeCollectionFile('jobs', jobs);
      return res.status(201).json({ id, ...jobData, reference });
    }
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Failed to create job' });
  }
});

// PUT /api/jobs/:id - Update job (admin)
app.put('/api/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    try {
      const database = await connectToDatabase();
      const { ObjectId } = await import('mongodb');
      const result = await database.collection('jobs').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updated_at: new Date().toISOString() } }
      );
      if (result.modifiedCount === 0) return res.status(404).json({ message: 'Job not found' });
      return res.json({ success: true });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to update job:', err?.message || err);
      const jobs = readCollectionFile('jobs');
      const idx = jobs.findIndex((j: any) => j.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Job not found' });
      jobs[idx] = { ...jobs[idx], ...updates, updated_at: new Date().toISOString() };
      writeCollectionFile('jobs', jobs);
      return res.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Failed to update job' });
  }
});

// DELETE /api/jobs/:id - Delete job (admin)
app.delete('/api/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const database = await connectToDatabase();
      const { ObjectId } = await import('mongodb');
      const result = await database.collection('jobs').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Job not found' });
      return res.json({ success: true });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to delete job:', err?.message || err);
      const jobs = readCollectionFile('jobs');
      const newJobs = jobs.filter((j: any) => j.id !== id);
      if (newJobs.length === jobs.length) return res.status(404).json({ message: 'Job not found' });
      writeCollectionFile('jobs', newJobs);
      return res.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

// POST /api/jobs/:id/apply - Submit job application (public)
app.post('/api/jobs/:id/apply', async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { name, email, phone, portfolio, cover_letter, resume_url, job_title } = req.body || {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Valid name and email are required' });
    }

    const now = new Date().toISOString();
    const application = {
      job_id: jobId,
      job_title: job_title || '',
      name,
      email,
      phone: phone || '',
      portfolio: portfolio || '',
      cover_letter: cover_letter || '',
      resume_url: resume_url || '',
      status: 'new',
      created_at: now,
      updated_at: now,
    };

    try {
      const database = await connectToDatabase();
      const result = await database.collection('job_applications').insertOne(application);
      return res.status(201).json({ id: result.insertedId.toString(), ...application });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to create application:', err?.message || err);
      const applications = readCollectionFile('job_applications');
      const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      const doc = { id, ...application };
      applications.unshift(doc);
      writeCollectionFile('job_applications', applications);
      return res.status(201).json({ id, ...application });
    }
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
});

// GET /api/applications/admin/all - Get all applications (admin)
app.get('/api/applications/admin/all', verifyAdmin, async (req, res) => {
  try {
    try {
      const database = await connectToDatabase();
      const applications = await database
        .collection('job_applications')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      const plainApps = applications.map(app => {
        const { _id, ...rest } = app;
        return { id: _id?.toString(), ...rest };
      });
      return res.json(plainApps);
    } catch (err) {
      console.warn('MongoDB not available, using file fallback for applications:', err?.message || err);
      const applications = readCollectionFile('job_applications')
        .sort((a: any, b: any) => (b.created_at || '') > (a.created_at || '') ? 1 : -1)
        .map((a: any) => ({ id: a.id, ...a }));
      return res.json(applications);
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// GET /api/applications/admin/job/:jobId - Get applications for a job (admin)
app.get('/api/applications/admin/job/:jobId', verifyAdmin, async (req, res) => {
  try {
    const { jobId } = req.params;
    try {
      const database = await connectToDatabase();
      const applications = await database
        .collection('job_applications')
        .find({ job_id: jobId })
        .sort({ created_at: -1 })
        .toArray();
      const plainApps = applications.map(app => {
        const { _id, ...rest } = app;
        return { id: _id?.toString(), ...rest };
      });
      return res.json(plainApps);
    } catch (err) {
      console.warn('MongoDB not available, using file fallback for job applications:', err?.message || err);
      const applications = readCollectionFile('job_applications')
        .filter((a: any) => a.job_id === jobId)
        .sort((a: any, b: any) => (b.created_at || '') > (a.created_at || '') ? 1 : -1)
        .map((a: any) => ({ id: a.id, ...a }));
      return res.json(applications);
    }
  } catch (error) {
    console.error('Error fetching applications by job:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// PUT /api/applications/admin/:id - Update application status (admin)
app.put('/api/applications/admin/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const safeUpdates = {
      status: updates.status,
      notes: updates.notes,
      updated_at: new Date().toISOString(),
    };

    try {
      const database = await connectToDatabase();
      const { ObjectId } = await import('mongodb');
      const result = await database.collection('job_applications').updateOne(
        { _id: new ObjectId(id) },
        { $set: safeUpdates }
      );
      if (result.modifiedCount === 0) return res.status(404).json({ message: 'Application not found' });
      return res.json({ success: true });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to update application:', err?.message || err);
      const applications = readCollectionFile('job_applications');
      const idx = applications.findIndex((a: any) => a.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Application not found' });
      applications[idx] = { ...applications[idx], ...safeUpdates };
      writeCollectionFile('job_applications', applications);
      return res.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
});

// DELETE /api/applications/admin/:id - Delete application (admin)
app.delete('/api/applications/admin/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const database = await connectToDatabase();
      const { ObjectId } = await import('mongodb');
      const result = await database.collection('job_applications').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Application not found' });
      return res.json({ success: true });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to delete application:', err?.message || err);
      const applications = readCollectionFile('job_applications');
      const newApps = applications.filter((a: any) => a.id !== id);
      if (newApps.length === applications.length) return res.status(404).json({ message: 'Application not found' });
      writeCollectionFile('job_applications', newApps);
      return res.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
});

// ============================================
// Comment Routes
// ============================================

// GET /api/comments - Get approved comments for a blog
app.get('/api/comments', async (req, res) => {
  try {
    const { blogId } = req.query;
    
    if (!blogId || typeof blogId !== 'string') {
      return res.status(400).json({ message: 'blogId query parameter required' });
    }
    
    try {
      const database = await connectToDatabase();
      const comments = await database
        .collection('comments')
        .find({ blog_id: blogId, is_approved: true })
        .sort({ created_at: -1 })
        .toArray();
      
      const plainComments = comments.map(comment => {
        const { _id, ...rest } = comment;
        return { id: _id?.toString(), ...rest };
      });
      
      return res.json(plainComments);
    } catch (err) {
      console.warn('MongoDB not available, falling back to file data for comments:', err?.message || err);
      const comments = readCollectionFile('comments').filter((c: any) => c.blog_id === blogId && c.is_approved).sort((a: any,b: any) => b.created_at > a.created_at ? 1 : -1).map((c: any) => ({ id: c.id, ...c }));
      return res.json(comments);
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// POST /api/comments - Submit new comment
app.post('/api/comments', async (req, res) => {
  try {
    const { blogId, authorName, authorEmail, content } = req.body;
    
    if (!blogId || !authorName || !authorEmail || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    const now = new Date().toISOString();
    try {
      const database = await connectToDatabase();
      const result = await database.collection('comments').insertOne({
        blog_id: blogId,
        author_name: authorName,
        author_email: authorEmail,
        content,
        is_approved: false, // Comments require approval
        created_at: now,
        updated_at: now,
      });
      return res.status(201).json({ 
        success: true, 
        message: 'Comment submitted successfully! It will appear after approval.',
        id: result.insertedId.toString()
      });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to save comment:', err?.message || err);
      const comments = readCollectionFile('comments');
      const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
      const doc = { id, blog_id: blogId, author_name: authorName, author_email: authorEmail, content, is_approved: false, created_at: now, updated_at: now };
      comments.unshift(doc);
      writeCollectionFile('comments', comments);
      return res.status(201).json({ success: true, message: 'Comment submitted successfully! It will appear after approval.', id });
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit comment' 
    });
  }
});

// GET /api/comments/admin/all - Get all comments (admin)
app.get('/api/comments/admin/all', verifyAdmin, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const comments = await database
      .collection('comments')
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    const plainComments = comments.map(comment => {
      const { _id, ...rest } = comment;
      return { id: _id?.toString(), ...rest };
    });
    
    return res.json(plainComments);
  } catch (error) {
    console.warn('MongoDB not available, falling back to file data for all comments:', error?.message || error);
    const comments = readCollectionFile('comments')
      .sort((a: any, b: any) => (b.created_at || '') > (a.created_at || '') ? 1 : -1)
      .map((c: any) => ({ id: c.id, ...c }));
    return res.json(comments);
  }
});

// GET /api/comments/admin/pending - Get pending comments (admin)
app.get('/api/comments/admin/pending', verifyAdmin, async (req, res) => {
  try {
    try {
      const database = await connectToDatabase();
      const comments = await database
        .collection('comments')
        .find({ is_approved: false })
        .sort({ created_at: -1 })
        .toArray();
      
      const plainComments = comments.map(comment => {
        const { _id, ...rest } = comment;
        return { id: _id?.toString(), ...rest };
      });
      
      return res.json(plainComments);
    } catch (err) {
      console.warn('MongoDB not available, using file fallback for pending comments:', err?.message || err);
      const comments = readCollectionFile('comments').filter((c: any) => !c.is_approved).sort((a: any,b: any) => b.created_at > a.created_at ? 1 : -1).map((c: any) => ({ id: c.id, ...c }));
      return res.json(comments);
    }
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    res.status(500).json({ message: 'Failed to fetch pending comments' });
  }
});

// GET /api/comments/admin/pending/count - Count pending comments (admin)
app.get('/api/comments/admin/pending/count', verifyAdmin, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const count = await database.collection('comments').countDocuments({ is_approved: false });
    return res.json(count);
  } catch (error) {
    console.warn('MongoDB not available, falling back to file data for pending count:', error?.message || error);
    const comments = readCollectionFile('comments').filter((c: any) => !c.is_approved);
    return res.json(comments.length);
  }
});

// PUT /api/comments/admin/:id/approve - Approve comment (admin)
app.put('/api/comments/admin/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const database = await connectToDatabase();
      const { ObjectId } = await import('mongodb');
      const result = await database.collection('comments').updateOne(
        { _id: new ObjectId(id) },
        { $set: { is_approved: true, updated_at: new Date().toISOString() } }
      );
      
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      
      return res.json({ success: true, message: 'Comment approved' });
    } catch (err) {
      console.warn('MongoDB not available, using file fallback to approve comment:', err?.message || err);
      const comments = readCollectionFile('comments');
      const idx = comments.findIndex((c: any) => c.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Comment not found' });
      comments[idx].is_approved = true;
      comments[idx].updated_at = new Date().toISOString();
      writeCollectionFile('comments', comments);
      return res.json({ success: true, message: 'Comment approved' });
    }
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ message: 'Failed to approve comment' });
  }
});

// PUT /api/comments/admin/:id/reject - Reject comment (admin)
app.put('/api/comments/admin/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const database = await connectToDatabase();
    
    const { ObjectId } = await import('mongodb');
    const result = await database.collection('comments').updateOne(
      { _id: new ObjectId(id) },
      { $set: { is_approved: false, updated_at: new Date().toISOString() } }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ success: true, message: 'Comment rejected' });
  } catch (error) {
    console.error('Error rejecting comment:', error);
    res.status(500).json({ message: 'Failed to reject comment' });
  }
});

// DELETE /api/comments/admin/:id - Delete comment (admin)
app.delete('/api/comments/admin/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const database = await connectToDatabase();
    
    const { ObjectId } = await import('mongodb');
    const result = await database.collection('comments').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

// ============================================
// Newsletter Routes
// ============================================

// POST /api/newsletter/subscribe - Subscribe to newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    const database = await connectToDatabase();
    
    // Check if email already exists
    const existingSubscriber = await database
      .collection('newsletter_subscribers')
      .findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return res.json({ 
          success: false, 
          message: 'This email is already subscribed!' 
        });
      } else {
        // Reactivate the subscription
        await database.collection('newsletter_subscribers').updateOne(
          { email },
          { $set: { is_active: true, subscribed_at: new Date().toISOString() } }
        );
        return res.json({ 
          success: true, 
          message: 'Your subscription has been reactivated!' 
        });
      }
    }
    
    // Create new subscriber
    const now = new Date().toISOString();
    await database.collection('newsletter_subscribers').insertOne({
      email,
      is_active: true,
      subscribed_at: now,
    });
    
    res.json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe' 
    });
  }
});

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const database = await connectToDatabase();
    const result = await database.collection('newsletter_subscribers').updateOne(
      { email },
      { $set: { is_active: false } }
    );
    
    res.json({ success: result.modifiedCount > 0, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ message: 'Failed to unsubscribe' });
  }
});

// GET /api/newsletter/admin/subscribers - Get all subscribers (admin)
app.get('/api/newsletter/admin/subscribers', verifyAdmin, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const subscribers = await database
      .collection('newsletter_subscribers')
      .find({})
      .sort({ subscribed_at: -1 })
      .toArray();
    
    const plainSubscribers = subscribers.map(sub => {
      const { _id, ...rest } = sub;
      return { id: _id?.toString(), ...rest };
    });
    
    res.json(plainSubscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

// GET /api/newsletter/admin/count - Count subscribers (admin)
app.get('/api/newsletter/admin/count', verifyAdmin, async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly === 'true';
    const database = await connectToDatabase();
    
    let query = {};
    if (activeOnly) {
      query = { is_active: true };
    }
    
    const count = await database.collection('newsletter_subscribers').countDocuments(query);
    res.json(count);
  } catch (error) {
    console.error('Error counting subscribers:', error);
    res.status(500).json({ message: 'Failed to count subscribers' });
  }
});

// DELETE /api/newsletter/admin/subscribers/:id - Delete subscriber (admin)
app.delete('/api/newsletter/admin/subscribers/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const database = await connectToDatabase();
    
    const { ObjectId } = await import('mongodb');
    const result = await database.collection('newsletter_subscribers').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'Failed to delete subscriber' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint for platform health checks
app.get('/', (req, res) => {
  res.status(200).send('Kreative API is running. See /api/health.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

export default app;
