export type UserRole = 'Super Admin' | 'Admin' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  status: 'Active' | 'Invited' | 'Suspended';
  assignedProjectIds: string[];
  joinedAt: string;
}

export type ProjectStatus = 'active' | 'in_progress' | 'maintenance' | 'archived';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  leadName: string;
  leadAvatar: string;
  teamCount: number;
  credentialsCount: number;
  envCount: number;
  docsCount: number;
  repoUrl: string;
  color: string;
  category: string;
  createdAt: string;
}

export type CredentialCategory = 'Database' | 'Cloud Provider' | 'Payment Gateway' | 'OAuth/Auth0' | 'API Key' | 'Service Account' | 'Web Login' | 'General' | 'Other';

export interface CredentialItem {
  id: string;
  projectId: string;
  name: string;
  service?: string;
  category?: CredentialCategory | string;
  environment: 'Production' | 'Staging' | 'Development';
  username?: string;
  secretValue: string;
  endpoint?: string;
  notes?: string;
  updatedBy: string;
  updatedAt: string;
}

export type EnvStage = 'development' | 'staging' | 'production';

export interface EnvVariable {
  id: string;
  projectId: string;
  environment: EnvStage;
  key: string;
  value: string;
  isSecret: boolean;
  description: string;
  lastModified: string;
}

export type DocumentCategory =
  | 'Architecture'
  | 'API Specification'
  | 'Deployment Guide'
  | 'Security Policy'
  | 'Onboarding'
  | 'Uploaded File'
  | 'General Note'
  | 'Specification'
  | 'Other';

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: DocumentCategory | string;
  author: string;
  authorAvatar: string;
  updatedAt: string;
  readTime: string;
  tags: string[];
  content: string;
  fileName?: string;
  fileSize?: string;
  fileType?: 'pdf' | 'image' | 'text' | 'archive' | 'sheet' | 'doc' | 'other';
  fileDataUrl?: string;
  isUploaded?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}
