// ARCHIVED: Supabase-to-MongoDB migration script (kept for archive only).
// This project no longer uses Supabase for auth or runtime. Keep for historical reference / data export only.
// To run: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY and run with npx tsx migrate-supabase-to-mongodb.ts


import { MongoClient, ObjectId } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const MONGODB_URI = process.env.VITE_MONGODB_URI || '' /* set VITE_MONGODB_URI in your environment */;  
// NOTE: credentials were removed from source for security.
const MONGODB_DB = process.env.VITE_MONGODB_DB_NAME || 'kreative_db';

interface SupabaseBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  author: string;
  category: string | null;
  tags?: string[] | null;
  read_time: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SupabaseComment {
  id: string;
  blog_id: string;
  author_name: string;
  author_email: string;
  author_avatar: string | null;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

interface SupabaseSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

interface MongoDBBlog {
  _id?: ObjectId;
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  author: string;
  author_bio?: string | null;
  author_avatar?: string | null;
  author_twitter?: string | null;
  author_linkedin?: string | null;
  category: string | null;
  tags?: string[] | null;
  read_time: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  is_published: boolean;
}

interface MongoDBComment {
  _id?: ObjectId;
  id?: string;
  blog_id: string;
  blog_slug?: string | null;
  author_name: string;
  author_email: string;
  author_avatar?: string | null;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

interface MongoDBSubscriber {
  _id?: ObjectId;
  id?: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

async function migrate() {
  console.log('🚀 Starting migration from Supabase to MongoDB...\n');

  // Initialize clients
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
  const mongoClient = new MongoClient(MONGODB_URI);
  
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = mongoClient.db(MONGODB_DB);
    
    // Clear existing data in MongoDB collections
    console.log('🗑️  Clearing existing data from MongoDB collections...');
    await db.collection('blogs').deleteMany({});
    await db.collection('comments').deleteMany({});
    await db.collection('newsletter_subscribers').deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Migrate Blogs
    console.log('📝 Migrating blogs...');
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (blogsError) throw new Error(`Error fetching blogs: ${blogsError.message}`);

    const mongoBlogs: MongoDBBlog[] = blogs.map((blog: SupabaseBlog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      read_time: blog.read_time,
      is_published: blog.is_published,
      is_featured: blog.is_featured,
      published_at: blog.published_at,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
    }));

    if (mongoBlogs.length > 0) {
      await db.collection('blogs').insertMany(mongoBlogs);
      console.log(`   ✅ Migrated ${mongoBlogs.length} blogs`);
    } else {
      console.log('   ⚠️  No blogs to migrate');
    }

    // Migrate Comments
    console.log('\n💬 Migrating comments...');
    // Fetch comments; if the table doesn't exist, skip comments migration
    let comments: SupabaseComment[] = [];
    try {
      const { data: fetchedComments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (commentsError) {
        if (commentsError.message && commentsError.message.includes("Could not find the table")) {
          console.warn(`   ⚠️  Comments table not found in Supabase, skipping comments migration: ${commentsError.message}`);
          comments = [];
        } else {
          throw new Error(`Error fetching comments: ${commentsError.message}`);
        }
      } else {
        comments = fetchedComments || [];
      }
    } catch (err: any) {
      console.warn(`   ⚠️  Comments fetch failed, skipping comments migration: ${err.message || err}`);
      comments = [];
    }

    // Get blog slugs for mapping
    const blogSlugMap: Record<string, string> = {};
    blogs.forEach((blog: SupabaseBlog) => {
      blogSlugMap[blog.id] = blog.slug;
    });

    const mongoComments: MongoDBComment[] = comments.map((comment: SupabaseComment) => ({
      id: comment.id,
      blog_id: comment.blog_id,
      blog_slug: blogSlugMap[comment.blog_id] || null,
      author_name: comment.author_name,
      author_email: comment.author_email,
      author_avatar: comment.author_avatar,
      content: comment.content,
      is_approved: comment.is_approved,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
    }));

    if (mongoComments.length > 0) {
      await db.collection('comments').insertMany(mongoComments);
      console.log(`   ✅ Migrated ${mongoComments.length} comments`);
    } else {
      console.log('   ⚠️  No comments to migrate');
      // Ensure an empty collection exists and create indexes expected by the app
      try {
        const commentsCollection = db.collection('comments');
        // Common indexes used by queries: blog_id + is_approved, created_at (descending), author_email
        await commentsCollection.createIndex({ blog_id: 1 });
        await commentsCollection.createIndex({ is_approved: 1 });
        await commentsCollection.createIndex({ created_at: -1 });
        await commentsCollection.createIndex({ author_email: 1 });
        console.log('   ✅ Created empty `comments` collection with indexes');

        // Insert placeholder comments for each blog so app has sample data and relations
        if (blogs.length > 0) {
          const placeholders = blogs.map((b: SupabaseBlog) => ({
            id: `placeholder-${b.id}`,
            blog_id: b.id,
            blog_slug: b.slug,
            author_name: 'placeholder',
            author_email: '',
            author_avatar: null,
            content: 'No comments migrated — placeholder',
            is_approved: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          await commentsCollection.insertMany(placeholders);
          console.log(`   ✅ Inserted ${placeholders.length} placeholder comments`);
        } else {
          console.log('   ⚠️  No blogs available to attach placeholders to');
        }

      } catch (err: any) {
        console.warn(`   ⚠️  Failed to create comments indexes or placeholders: ${err.message || err}`);
      }
    }

    // Migrate Newsletter Subscribers
    console.log('\n📧 Migrating newsletter subscribers...');
    // Fetch subscribers; if the table doesn't exist, skip subscribers migration
    let subscribers: SupabaseSubscriber[] = [];
    try {
      const { data: fetchedSubscribers, error: subscribersError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (subscribersError) {
        if (subscribersError.message && subscribersError.message.includes("Could not find the table")) {
          console.warn(`   ⚠️  Subscribers table not found in Supabase, skipping subscribers migration: ${subscribersError.message}`);
          subscribers = [];
        } else {
          throw new Error(`Error fetching subscribers: ${subscribersError.message}`);
        }
      } else {
        subscribers = fetchedSubscribers || [];
      }
    } catch (err: any) {
      console.warn(`   ⚠️  Subscribers fetch failed, skipping subscribers migration: ${err.message || err}`);
      subscribers = [];
    }

    const mongoSubscribers: MongoDBSubscriber[] = subscribers.map((sub: SupabaseSubscriber) => ({
      id: sub.id,
      email: sub.email,
      is_active: sub.is_active,
      subscribed_at: sub.subscribed_at,
    }));

    if (mongoSubscribers.length > 0) {
      await db.collection('newsletter_subscribers').insertMany(mongoSubscribers);
      console.log(`   ✅ Migrated ${mongoSubscribers.length} subscribers`);
    } else {
      console.log('   ⚠️  No subscribers to migrate');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`\nSummary:`);
    console.log(`   - Blogs: ${mongoBlogs.length}`);
    console.log(`   - Comments: ${mongoComments.length}`);
    console.log(`   - Newsletter Subscribers: ${mongoSubscribers.length}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoClient.close();
    console.log('\n🔒 MongoDB connection closed');
  }
}

// Run migration
migrate();

