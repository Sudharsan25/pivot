export interface User {
  id: string;
  email: string;
}

export interface Urge {
  id: string;
  userId: string;
  outcome: 'resisted' | 'gave_in';
  urgeType: string; // required
  trigger?: string;
  notes?: string;
  createdAt: string;
}

export interface UrgeStats {
  totalResisted: number;
  totalGaveIn: number;
  totalUrges: number;
}

export interface UrgeStatsByType {
  urgeType: string;
  totalResisted: number;
  totalGaveIn: number;
  totalUrges: number;
}

export interface AuthResponse {
  accessToken: string;
}

export interface PaginatedUrges {
  urges: Urge[];
  total: number;
  limit: number;
  offset: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUrgeRequest {
  outcome: 'resisted' | 'gave_in';
  urgeType: string; // required
  trigger?: string;
  notes?: string;
  // optional client-provided timestamp; backend may auto-fill
  timestamp?: string | Date;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path?: string;
}
