// MongoDB API Routes for Express Server
// Handles all blog, comment, and newsletter operations

import { Request, Response } from 'express';
import { 
  getPublishedBlogs, 
  getAllBlogs, 
  getBlogBySlug, 
  getBlogById,
  getFeaturedBlog,
  getRecentPosts,
  searchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  countBlogs,
  countDrafts
} from '../integrations/mongodb/blogs';
import { 
  getApprovedComments,
  getAllComments,
  getPendingComments,
  createComment,
  approveComment,
  rejectComment,
  updateComment,
  deleteComment,
  countComments,
  countPendingComments,
  searchComments
} from '../integrations/mongodb/client';
import { 
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  isEmailSubscribed,
  getAllSubscribers,
  getActiveSubscribers,
  countSubscribers,
  deleteSubscriber,
  updateSubscriber
} from '../integrations/mongodb/client';
import type { BlogPost, Comment, NewsletterSubscriber } from '../integrations/mongodb/client';

// ============================================
// Blog Routes
// ============================================

// GET /api/blogs - Get all published blogs
export async function getBlogs(req: Request, res: Response) {
  try {
    const blogs = await getPublishedBlogs();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
}

// GET /api/blogs/all - Get all blogs (admin)
export async function getAllBlogsHandler(req: Request, res: Response) {
  try {
    const blogs = await getAllBlogs();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
}

// GET /api/blogs/:slug - Get blog by slug
export async function getBlogBySlugHandler(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const blog = await getBlogBySlug(slug);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
}

// GET /api/blogs/id/:id - Get blog by ID
export async function getBlogByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const blog = await getBlogById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
}

// GET /api/blogs/featured - Get featured blog
export async function getFeaturedBlogHandler(req: Request, res: Response) {
  try {
    const blog = await getFeaturedBlog();
    res.json(blog);
  } catch (error) {
    console.error('Error fetching featured blog:', error);
    res.status(500).json({ message: 'Failed to fetch featured blog' });
  }
}

// GET /api/blogs/recent - Get recent posts
export async function getRecentPostsHandler(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const exclude = req.query.exclude as string;
    const posts = await getRecentPosts(exclude, limit);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    res.status(500).json({ message: 'Failed to fetch recent posts' });
  }
}

// GET /api/blogs/search - Search blogs
export async function searchBlogsHandler(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query required' });
    }
    const posts = await searchBlogs(q);
    res.json(posts);
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ message: 'Failed to search blogs' });
  }
}

// GET /api/blogs/count - Count published blogs
export async function countBlogsHandler(req: Request, res: Response) {
  try {
    const count = await countBlogs();
    res.json(count);
  } catch (error) {
    console.error('Error counting blogs:', error);
    res.status(500).json({ message: 'Failed to count blogs' });
  }
}

// GET /api/blogs/drafts/count - Count draft blogs
export async function countDraftsHandler(req: Request, res: Response) {
  try {
    const count = await countDrafts();
    res.json(count);
  } catch (error) {
    console.error('Error counting drafts:', error);
    res.status(500).json({ message: 'Failed to count drafts' });
  }
}

// POST /api/blogs - Create new blog
export async function createBlogHandler(req: Request, res: Response) {
  try {
    const blogData = req.body;
    
    // Validate required fields
    if (!blogData.title || !blogData.slug || !blogData.content || !blogData.author) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newBlog = await createBlog({
      ...blogData,
      is_published: blogData.is_published ?? false,
      is_featured: blogData.is_featured ?? false,
    });
    
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
}

// PUT /api/blogs/:id - Update blog
export async function updateBlogHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const success = await updateBlog(id, updates);
    
    if (!success) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const updatedBlog = await getBlogById(id);
    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
}

// DELETE /api/blogs/:id - Delete blog
export async function deleteBlogHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await deleteBlog(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
}

// ============================================
// Comment Routes
// ============================================

// GET /api/comments - Get approved comments for a blog
export async function getCommentsHandler(req: Request, res: Response) {
  try {
    const { blogId } = req.query;
    
    if (!blogId || typeof blogId !== 'string') {
      return res.status(400).json({ message: 'blogId query parameter required' });
    }
    
    const comments = await getApprovedComments(blogId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
}

// GET /api/comments/count - Count approved comments
export async function countCommentsHandler(req: Request, res: Response) {
  try {
    const { blogId } = req.query;
    const count = await countComments(blogId as string);
    res.json(count);
  } catch (error) {
    console.error('Error counting comments:', error);
    res.status(500).json({ message: 'Failed to count comments' });
  }
}

// POST /api/comments - Submit new comment
export async function createCommentHandler(req: Request, res: Response) {
  try {
    const { blogId, authorName, authorEmail, content } = req.body;
    
    // Validate required fields
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
    
    const newComment = await createComment({
      blog_id: blogId,
      author_name: authorName,
      author_email: authorEmail,
      content,
      is_approved: false, // Comments require approval
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Comment submitted successfully! It will appear after approval.',
      comment: newComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit comment' 
    });
  }
}

// GET /api/comments/admin/all - Get all comments (admin)
export async function getAllCommentsHandler(req: Request, res: Response) {
  try {
    const comments = await getAllComments();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching all comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
}

// GET /api/comments/admin/pending - Get pending comments (admin)
export async function getPendingCommentsHandler(req: Request, res: Response) {
  try {
    const comments = await getPendingComments();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    res.status(500).json({ message: 'Failed to fetch pending comments' });
  }
}

// GET /api/comments/admin/pending/count - Count pending comments (admin)
export async function countPendingCommentsHandler(req: Request, res: Response) {
  try {
    const count = await countPendingComments();
    res.json(count);
  } catch (error) {
    console.error('Error counting pending comments:', error);
    res.status(500).json({ message: 'Failed to count pending comments' });
  }
}

// GET /api/comments/admin/:id - Get comment by ID (admin)
export async function getCommentByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // We'll need to add this function to client.ts
    const { getCommentById } = await import('../integrations/mongodb/client');
    const comment = await getCommentById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
}

// PUT /api/comments/admin/:id/approve - Approve comment (admin)
export async function approveCommentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await approveComment(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ success: true, message: 'Comment approved' });
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ message: 'Failed to approve comment' });
  }
}

// PUT /api/comments/admin/:id/reject - Reject comment (admin)
export async function rejectCommentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await rejectComment(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ success: true, message: 'Comment rejected' });
  } catch (error) {
    console.error('Error rejecting comment:', error);
    res.status(500).json({ message: 'Failed to reject comment' });
  }
}

// PUT /api/comments/admin/:id - Update comment (admin)
export async function updateCommentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const success = await updateComment(id, updates);
    
    if (!success) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ success: true, message: 'Comment updated' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
}

// DELETE /api/comments/admin/:id - Delete comment (admin)
export async function deleteCommentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await deleteComment(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
}

// GET /api/comments/admin/search - Search comments (admin)
export async function searchCommentsHandler(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query required' });
    }
    const comments = await searchComments(q);
    res.json(comments);
  } catch (error) {
    console.error('Error searching comments:', error);
    res.status(500).json({ message: 'Failed to search comments' });
  }
}

// ============================================
// Newsletter Routes
// ============================================

// POST /api/newsletter/subscribe - Subscribe to newsletter
export async function subscribeHandler(req: Request, res: Response) {
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
    
    const result = await subscribeToNewsletter(email);
    res.json(result);
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe' 
    });
  }
}

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
export async function unsubscribeHandler(req: Request, res: Response) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const success = await unsubscribeFromNewsletter(email);
    res.json({ success, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ message: 'Failed to unsubscribe' });
  }
}

// GET /api/newsletter/check/:email - Check if email is subscribed
export async function checkSubscriptionHandler(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const subscribed = await isEmailSubscribed(decodeURIComponent(email));
    res.json(subscribed);
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ message: 'Failed to check subscription' });
  }
}

// GET /api/newsletter/admin/subscribers - Get all subscribers (admin)
export async function getAllSubscribersHandler(req: Request, res: Response) {
  try {
    const subscribers = await getAllSubscribers();
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
}

// GET /api/newsletter/admin/active - Get active subscribers (admin)
export async function getActiveSubscribersHandler(req: Request, res: Response) {
  try {
    const subscribers = await getActiveSubscribers();
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching active subscribers:', error);
    res.status(500).json({ message: 'Failed to fetch active subscribers' });
  }
}

// GET /api/newsletter/admin/count - Count subscribers (admin)
export async function countSubscribersHandler(req: Request, res: Response) {
  try {
    const activeOnly = req.query.activeOnly === 'true';
    const count = await countSubscribers(activeOnly);
    res.json(count);
  } catch (error) {
    console.error('Error counting subscribers:', error);
    res.status(500).json({ message: 'Failed to count subscribers' });
  }
}

// DELETE /api/newsletter/admin/subscribers/:id - Delete subscriber (admin)
export async function deleteSubscriberHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await deleteSubscriber(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'Failed to delete subscriber' });
  }
}

// PUT /api/newsletter/admin/subscribers/:id - Update subscriber (admin)
export async function updateSubscriberHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const success = await updateSubscriber(id, updates);
    
    if (!success) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    res.json({ success: true, message: 'Subscriber updated' });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    res.status(500).json({ message: 'Failed to update subscriber' });
  }
}

