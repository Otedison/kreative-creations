// Blog Database Operations for MongoDB
import { 
  getBlogsCollection, 
  toPlainObject, 
  toPlainObjects,
  BlogPost 
} from './client';

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
  const post = await collection.findOne({ _id: new (await import('mongodb')).ObjectId(id) });
  return toPlainObject(post);
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
  const posts = await collection
    .find({ 
      category, 
      is_published: true,
      _id: { $ne: new (await import('mongodb')).ObjectId(currentId) }
    })
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
    query._id = { $ne: new (await import('mongodb')).ObjectId(currentId) };
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
  const result = await collection.updateOne(
    { _id: new (await import('mongodb')).ObjectId(id) },
    { 
      $set: {
        ...updates,
        updated_at: new Date().toISOString()
      }
    }
  );
  return result.modifiedCount > 0;
}

// Delete blog post
export async function deleteBlog(id: string): Promise<boolean> {
  const collection = await getBlogsCollection();
  const result = await collection.deleteOne({ 
    _id: new (await import('mongodb')).ObjectId(id) 
  });
  return result.deletedCount > 0;
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

