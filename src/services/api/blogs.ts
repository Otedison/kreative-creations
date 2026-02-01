// Blog API Service - MongoDB
// All blog-related API calls go through this service

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
} 

// ============================================
// Blog API Types
// ============================================
export interface BlogPost {
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
// Blog API Functions
// ============================================

// Get all published blog posts
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  return apiRequest<BlogPost[]>('/blogs');
}

// Get all blog posts (admin)
export async function getAllBlogs(): Promise<BlogPost[]> {
  return apiRequest<BlogPost[]>('/blogs/all');
}

// Get blog post by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  return apiRequest<BlogPost | null>(`/blogs/${slug}`);
}

// Get blog post by ID
export async function getBlogById(id: string): Promise<BlogPost | null> {
  return apiRequest<BlogPost | null>(`/blogs/id/${id}`);
}

// Get featured blog post
export async function getFeaturedBlog(): Promise<BlogPost | null> {
  return apiRequest<BlogPost | null>('/blogs/featured');
}

// Get recent posts
export async function getRecentPosts(limit = 5, excludeId?: string): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (excludeId) {
    params.set('exclude', excludeId);
  }
  return apiRequest<BlogPost[]>(`/blogs/recent?${params.toString()}`);
}

// Search blog posts
export async function searchBlogs(query: string): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  params.set('q', query);
  return apiRequest<BlogPost[]>(`/blogs/search?${params.toString()}`);
}

// Create new blog post
export async function createBlog(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  return apiRequest<BlogPost>('/blogs', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}

// Update blog post
export async function updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  return apiRequest<BlogPost>(`/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// Delete blog post
export async function deleteBlog(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/blogs/${id}`, {
    method: 'DELETE',
  });
}

// Count total posts
export async function countBlogs(): Promise<number> {
  return apiRequest<number>('/blogs/count');
}

// Count drafts
export async function countDrafts(): Promise<number> {
  return apiRequest<number>('/blogs/drafts/count');
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

