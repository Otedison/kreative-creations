// Jobs & Applications API Service

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface JobPosting {
  id?: string;
  title: string;
  reference?: string | null;
  category?: string | null;
  type: string;
  location: string;
  summary?: string | null;
  description?: string | null;
  requirements?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JobApplication {
  id?: string;
  job_id: string;
  job_title?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  portfolio?: string | null;
  cover_letter?: string | null;
  resume_url?: string | null;
  status?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Public jobs
export async function getActiveJobs(filters?: { category?: string; type?: string; location?: string }): Promise<JobPosting[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.location) params.set("location", filters.location);
  const qs = params.toString();
  return apiRequest<JobPosting[]>(qs ? `/jobs?${qs}` : "/jobs");
}

// Admin jobs
export async function getAllJobs(): Promise<JobPosting[]> {
  return apiRequest<JobPosting[]>("/jobs/all");
}

export async function createJob(job: Omit<JobPosting, "id" | "created_at" | "updated_at">): Promise<JobPosting> {
  return apiRequest<JobPosting>("/jobs", {
    method: "POST",
    body: JSON.stringify(job),
  });
}

export async function updateJob(id: string, updates: Partial<JobPosting>): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteJob(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/jobs/${id}`, {
    method: "DELETE",
  });
}

// Applications
export async function applyToJob(jobId: string, application: Omit<JobApplication, "id" | "job_id" | "status" | "created_at" | "updated_at">): Promise<JobApplication> {
  return apiRequest<JobApplication>(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: JSON.stringify(application),
  });
}

export async function getAllApplications(): Promise<JobApplication[]> {
  return apiRequest<JobApplication[]>("/applications/admin/all");
}

export async function getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
  return apiRequest<JobApplication[]>(`/applications/admin/job/${jobId}`);
}

export async function updateApplication(id: string, updates: Partial<JobApplication>): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/applications/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteApplication(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/applications/admin/${id}`, {
    method: "DELETE",
  });
}
