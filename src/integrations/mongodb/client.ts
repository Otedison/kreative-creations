// MongoDB Database Integration
// Connection string: mongodb+srv://edisonneddy_db_user:KSHyLGZ3yrt1Z8P5@cluster0.jfnx0z4.mongodb.net/?appName=Cluster0
// Database: kreative_db

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || '' /* set in .env as VITE_MONGODB_URI */;  
// NOTE: any embedded credentials were removed for security.
const MONGODB_DB_NAME = import.meta.env.VITE_MONGODB_DB_NAME || 'kreative_db';

let client: MongoClient | null = null;
let db: Db | null = null;

// ============================================
// Blog Types
// ============================================
export interface BlogPost {
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

// ============================================
// Comment Types
// ============================================
export interface Comment {
  _id?: ObjectId;
  id?: string;
  blog_id: string;
  blog_slug?: string;
  author_name: string;
  author_email: string;
  author_avatar?: string | null;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  isAdmin?: boolean;
}

// ============================================
// Newsletter Subscriber Types
// ============================================
export interface NewsletterSubscriber {
  _id?: ObjectId;
  id?: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

// ============================================
// Database Connection
// ============================================
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// ============================================
// Collection Accessors
// ============================================
export async function getBlogsCollection(): Promise<Collection<BlogPost>> {
  const database = await connectToDatabase();
  return database.collection<BlogPost>('blogs');
}

export async function getCommentsCollection(): Promise<Collection<Comment>> {
  const database = await connectToDatabase();
  return database.collection<Comment>('comments');
}

export async function getNewsletterSubscribersCollection(): Promise<Collection<NewsletterSubscriber>> {
  const database = await connectToDatabase();
  return database.collection<NewsletterSubscriber>('newsletter_subscribers');
}

// ============================================
// Connection Management
// ============================================
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

// ============================================
// Helper Functions
// ============================================
export function toPlainObject<T>(doc: T | null): T | null {
  if (!doc) return null;
  const { _id, ...rest } = doc as any;
  return {
    id: _id?.toString() || undefined,
    ...rest,
  } as T;
}

export function toPlainObjects<T>(docs: T[]): T[] {
  return docs.map(doc => toPlainObject(doc)).filter(Boolean) as T[];
}

// ============================================
// Blog Operations
// ============================================

// Get all published blog posts
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const collection = await getBlogsCollection();
  const posts = await collection
    .find({ is_published: true })
    .sort({ published_at: -1 })
    .toArray();
  return toPlainObjects(posts);
}

// Get all blog posts (for admin)
export async function getAllBlogs(): Promise<BlogPost[]> {
  const collection = await getBlogsCollection();
  const posts = await collection
    .find({})
    .sort({ created_at: -1 })
    .toArray();
  return toPlainObjects(posts);
}

// Get blog post by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const collection = await getBlogsCollection();
  const post = await collection.findOne({ slug, is_published: true });
  return toPlainObject(post);
}

// Get blog post by ID
export async function getBlogById(id: string): Promise<BlogPost | null> {
  const collection = await getBlogsCollection();
  try {
    const post = await collection.findOne({ _id: new ObjectId(id) });
    return toPlainObject(post);
  } catch (error) {
    // If id is not a valid ObjectId, try searching by id field
    const post = await collection.findOne({ id });
    return toPlainObject(post);
  }
}

// Get featured blog post
export async function getFeaturedBlog(): Promise<BlogPost | null> {
  const collection = await getBlogsCollection();
  const post = await collection.findOne({ is_published: true, is_featured: true });
  return toPlainObject(post);
}

// Get related posts by category (excluding current post)
export async function getRelatedPosts(category: string, currentId: string, limit = 3): Promise<BlogPost[]> {
  const collection = await getBlogsCollection();
  let query: any = { 
    category, 
    is_published: true
  };
  
  try {
    query._id = { $ne: new ObjectId(currentId) };
  } catch (error) {
    query.id = { $ne: currentId };
  }
  
  const posts = await collection
    .find(query)
    .sort({ published_at: -1 })
    .limit(limit)
    .toArray();
  return toPlainObjects(posts);
}

// Get recent posts (excluding current)
export async function getRecentPosts(currentId?: string, limit = 5): Promise<BlogPost[]> {
  const collection = await getBlogsCollection();
  const query: any = { is_published: true };
  
  if (currentId) {
    try {
      query._id = { $ne: new ObjectId(currentId) };
    } catch (error) {
      query.id = { $ne: currentId };
    }
  }
  
  const posts = await collection
    .find(query)
    .sort({ published_at: -1 })
    .limit(limit)
    .toArray();
  return toPlainObjects(posts);
}

// Get all posts for navigation (previous/next)
export async function getAllPostsForNavigation(): Promise<BlogPost[]> {
  const collection = await getBlogsCollection();
  const posts = await collection
    .find({ is_published: true })
    .sort({ published_at: -1 })
    .toArray();
  return toPlainObjects(posts);
}

// Search blog posts
export async function searchBlogs(query: string): Promise<BlogPost[]> {
  const collection = await getBlogsCollection();
  const posts = await collection
    .find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ],
      is_published: true
    })
    .sort({ published_at: -1 })
    .toArray();
  return toPlainObjects(posts);
}

// Create new blog post
export async function createBlog(post: Omit<BlogPost, '_id' | 'id'>): Promise<string> {
  const collection = await getBlogsCollection();
  const now = new Date().toISOString();
  const result = await collection.insertOne({
    ...post,
    created_at: now,
    updated_at: now,
  });
  return result.insertedId.toString();
}

// Update blog post
export async function updateBlog(id: string, updates: Partial<BlogPost>): Promise<boolean> {
  const collection = await getBlogsCollection();
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    // If id is not a valid ObjectId, try searching by id field
    const result = await collection.updateOne(
      { id },
      { 
        $set: {
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}

// Delete blog post
export async function deleteBlog(id: string): Promise<boolean> {
  const collection = await getBlogsCollection();
  try {
    const result = await collection.deleteOne({ 
      _id: new ObjectId(id) 
    });
    return result.deletedCount > 0;
  } catch (error) {
    // If id is not a valid ObjectId, try searching by id field
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

// Count total posts
export async function countBlogs(): Promise<number> {
  const collection = await getBlogsCollection();
  return collection.countDocuments({ is_published: true });
}

// Count drafts
export async function countDrafts(): Promise<number> {
  const collection = await getBlogsCollection();
  return collection.countDocuments({ is_published: false });
}

// ============================================
// Comment Operations
// ============================================

// Get all approved comments for a blog post
export async function getApprovedComments(blogId: string): Promise<Comment[]> {
  const collection = await getCommentsCollection();
  const comments = await collection
    .find({ blog_id: blogId, is_approved: true })
    .sort({ created_at: -1 })
    .toArray();
  return toPlainObjects(comments);
}

// Get all comments (for admin)
export async function getAllComments(): Promise<Comment[]> {
  const collection = await getCommentsCollection();
  const comments = await collection
    .find({})
    .sort({ created_at: -1 })
    .toArray();
  return toPlainObjects(comments);
}

// Get pending comments (for admin)
export async function getPendingComments(): Promise<Comment[]> {
  const collection = await getCommentsCollection();
  const comments = await collection
    .find({ is_approved: false })
    .sort({ created_at: -1 })
    .toArray();
  return toPlainObjects(comments);
}

// Get comment by ID
export async function getCommentById(id: string): Promise<Comment | null> {
  const collection = await getCommentsCollection();
  try {
    const comment = await collection.findOne({ _id: new ObjectId(id) });
    return toPlainObject(comment);
  } catch (error) {
    const comment = await collection.findOne({ id });
    return toPlainObject(comment);
  }
}

// Create new comment
export async function createComment(comment: Omit<Comment, '_id' | 'id'>): Promise<string> {
  const collection = await getCommentsCollection();
  const now = new Date().toISOString();
  const result = await collection.insertOne({
    ...comment,
    is_approved: false, // Comments require approval by default
    created_at: now,
    updated_at: now,
  });
  return result.insertedId.toString();
}

// Approve comment
export async function approveComment(id: string): Promise<boolean> {
  const collection = await getCommentsCollection();
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          is_approved: true,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    const result = await collection.updateOne(
      { id },
      { 
        $set: {
          is_approved: true,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}

// Reject comment (unapprove)
export async function rejectComment(id: string): Promise<boolean> {
  const collection = await getCommentsCollection();
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          is_approved: false,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    const result = await collection.updateOne(
      { id },
      { 
        $set: {
          is_approved: false,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}

// Update comment
export async function updateComment(id: string, updates: Partial<Comment>): Promise<boolean> {
  const collection = await getCommentsCollection();
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    const result = await collection.updateOne(
      { id },
      { 
        $set: {
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}

// Delete comment
export async function deleteComment(id: string): Promise<boolean> {
  const collection = await getCommentsCollection();
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

// Count comments
export async function countComments(blogId?: string): Promise<number> {
  const collection = await getCommentsCollection();
  if (blogId) {
    return collection.countDocuments({ blog_id: blogId, is_approved: true });
  }
  return collection.countDocuments({ is_approved: true });
}

// Count pending comments
export async function countPendingComments(): Promise<number> {
  const collection = await getCommentsCollection();
  return collection.countDocuments({ is_approved: false });
}

// Search comments
export async function searchComments(query: string): Promise<Comment[]> {
  const collection = await getCommentsCollection();
  const comments = await collection
    .find({
      $or: [
        { author_name: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ created_at: -1 })
    .toArray();
  return toPlainObjects(comments);
}

// ============================================
// Newsletter Subscriber Operations
// ============================================

// Get all subscribers
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const collection = await getNewsletterSubscribersCollection();
  const subscribers = await collection
    .find({})
    .sort({ subscribed_at: -1 })
    .toArray();
  return toPlainObjects(subscribers);
}

// Get active subscribers
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const collection = await getNewsletterSubscribersCollection();
  const subscribers = await collection
    .find({ is_active: true })
    .sort({ subscribed_at: -1 })
    .toArray();
  return toPlainObjects(subscribers);
}

// Get subscriber by email
export async function getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  const collection = await getNewsletterSubscribersCollection();
  const subscriber = await collection.findOne({ email });
  return toPlainObject(subscriber);
}

// Check if email is subscribed
export async function isEmailSubscribed(email: string): Promise<boolean> {
  const collection = await getNewsletterSubscribersCollection();
  const subscriber = await collection.findOne({ 
    email, 
    is_active: true 
  });
  return subscriber !== null;
}

// Subscribe to newsletter
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const collection = await getNewsletterSubscribersCollection();
  
  // Check if email already exists
  const existingSubscriber = await collection.findOne({ email });
  
  if (existingSubscriber) {
    if (existingSubscriber.is_active) {
      return { success: false, message: 'This email is already subscribed!' };
    } else {
      // Reactivate the subscription
      await collection.updateOne(
        { email },
        { 
          $set: {
            is_active: true,
            subscribed_at: new Date().toISOString()
          }
        }
      );
      return { success: true, message: 'Your subscription has been reactivated!' };
    }
  }
  
  // Create new subscriber
  const now = new Date().toISOString();
  await collection.insertOne({
    email,
    is_active: true,
    subscribed_at: now,
  });
  
  return { success: true, message: 'Thank you for subscribing!' };
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  const collection = await getNewsletterSubscribersCollection();
  const result = await collection.updateOne(
    { email },
    { $set: { is_active: false } }
  );
  return result.modifiedCount > 0;
}

// Delete subscriber
export async function deleteSubscriber(id: string): Promise<boolean> {
  const collection = await getNewsletterSubscribersCollection();
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

// Count subscribers
export async function countSubscribers(activeOnly = false): Promise<number> {
  const collection = await getNewsletterSubscribersCollection();
  if (activeOnly) {
    return collection.countDocuments({ is_active: true });
  }
  return collection.countDocuments({});
}

// Update subscriber
export async function updateSubscriber(id: string, updates: Partial<NewsletterSubscriber>): Promise<boolean> {
  const collection = await getNewsletterSubscribersCollection();
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    const result = await collection.updateOne(
      { id },
      { $set: updates }
    );
    return result.modifiedCount > 0;
  }
}

