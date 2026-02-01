// Comment API Service - MongoDB
// All comment-related API calls go through this service

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
// Comment API Types
// ============================================
export interface Comment {
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

export interface CommentSubmission {
  blogId: string;
  authorName: string;
  authorEmail: string;
  content: string;
}

// ============================================
// Comment API Functions
// ============================================

// Get approved comments for a blog post
export async function getApprovedComments(blogId: string): Promise<Comment[]> {
  const params = new URLSearchParams();
  params.set('blogId', blogId);
  return apiRequest<Comment[]>(`/comments?${params.toString()}`);
}

// Get all comments (admin)
export async function getAllComments(): Promise<Comment[]> {
  return apiRequest<Comment[]>('/comments/admin/all');
}

// Get pending comments (admin)
export async function getPendingComments(): Promise<Comment[]> {
  return apiRequest<Comment[]>('/comments/admin/pending');
}

// Get comment by ID
export async function getCommentById(id: string): Promise<Comment | null> {
  return apiRequest<Comment | null>(`/comments/admin/${id}`);
}

// Submit a new comment
export async function submitComment(comment: CommentSubmission): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>('/comments', {
    method: 'POST',
    body: JSON.stringify(comment),
  });
}

// Approve a comment (admin)
export async function approveComment(id: string): Promise<Comment> {
  return apiRequest<Comment>(`/comments/admin/${id}/approve`, {
    method: 'PUT',
  });
}

// Reject a comment (admin)
export async function rejectComment(id: string): Promise<Comment> {
  return apiRequest<Comment>(`/comments/admin/${id}/reject`, {
    method: 'PUT',
  });
}

// Update a comment (admin)
export async function updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
  return apiRequest<Comment>(`/comments/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// Delete a comment (admin)
export async function deleteComment(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/comments/admin/${id}`, {
    method: 'DELETE',
  });
}

// Search comments (admin)
export async function searchComments(query: string): Promise<Comment[]> {
  const params = new URLSearchParams();
  params.set('q', query);
  return apiRequest<Comment[]>(`/comments/admin/search?${params.toString()}`);
}

// Count approved comments for a blog
export async function countComments(blogId?: string): Promise<number> {
  const params = new URLSearchParams();
  if (blogId) {
    params.set('blogId', blogId);
  }
  return apiRequest<number>(`/comments/count?${params.toString()}`);
}

// Count pending comments (admin)
export async function countPendingComments(): Promise<number> {
  return apiRequest<number>('/comments/admin/pending/count');
}

