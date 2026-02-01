// Newsletter API Service - MongoDB
// All newsletter-related API calls go through this service

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
// Newsletter API Types
// ============================================
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

// ============================================
// Newsletter API Functions
// ============================================

// Subscribe to newsletter
export async function subscribeToNewsletter(email: string): Promise<SubscribeResponse> {
  return apiRequest<SubscribeResponse>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(email: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>('/newsletter/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Check if email is subscribed
export async function isEmailSubscribed(email: string): Promise<boolean> {
  return apiRequest<boolean>(`/newsletter/check/${encodeURIComponent(email)}`);
}

// Get all subscribers (admin)
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  return apiRequest<NewsletterSubscriber[]>('/newsletter/admin/subscribers');
}

// Get active subscribers (admin)
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  return apiRequest<NewsletterSubscriber[]>('/newsletter/admin/active');
}

// Count subscribers (admin)
export async function countSubscribers(activeOnly = false): Promise<number> {
  const params = new URLSearchParams();
  params.set('activeOnly', activeOnly.toString());
  return apiRequest<number>(`/newsletter/admin/count?${params.toString()}`);
}

// Delete subscriber (admin)
export async function deleteSubscriber(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/newsletter/admin/subscribers/${id}`, {
    method: 'DELETE',
  });
}

// Update subscriber (admin)
export async function updateSubscriber(id: string, updates: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber> {
  return apiRequest<NewsletterSubscriber>(`/newsletter/admin/subscribers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

