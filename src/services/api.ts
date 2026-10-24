import { User, UserRole, Project } from '../types';

export const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Universal fetch wrapper that automatically:
 * 1. Attaches the JWT authentication token from localStorage
 * 2. Formats JSON request bodies
 * 3. Handles server errors with clear error messages
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('nexus_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// 🔐 Authentication API Methods
export const authApi = {
  // Login with email and password
  login: async (email: string, password?: string): Promise<LoginResponse> => {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current authenticated user profile
  getMe: async (): Promise<{ user: User }> => {
    return request<{ user: User }>('/auth/me');
  },

  // Switch active role for demo testing
  switchRole: async (role: UserRole): Promise<LoginResponse> => {
    return request<LoginResponse>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  // Logout current user and invalidate token
  logout: async (): Promise<{ message: string }> => {
    return request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};

// 📂 Projects API Methods
export const projectApi = {
  // Get all projects with live aggregated counts
  getAll: async (): Promise<Project[]> => {
    return request<Project[]>('/projects');
  },

  // Get a single project by ID
  getById: async (id: string): Promise<Project> => {
    return request<Project>(`/projects/${id}`);
  },

  // Create a new project (Super Admin or Admin)
  create: async (data: Partial<Project>): Promise<Project> => {
    return request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update existing project
  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    return request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete project and cascade delete all associated credentials, envs, documents
  delete: async (id: string): Promise<{ message: string; id: string }> => {
    return request<{ message: string; id: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
