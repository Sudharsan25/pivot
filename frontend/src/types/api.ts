export interface User {
  id: string;
  email: string;
}

export interface Habit {
  id: string;
  name: string;
  type: 'standard' | 'custom';
  userId: string | null;
  createdAt: string;
}

export interface Urge {
  id: string;
  userId: string;
  habitId: string; // required - reference to habit
  outcome: 'resisted' | 'gave_in' | 'delayed';
  trigger?: string;
  notes?: string;
  createdAt: string;
}

export interface UrgeStats {
  totalResisted: number;
  totalGaveIn: number;
  totalDelayed: number;
  totalUrges: number;
}

export interface UrgeStatsByType {
  habitId: string;
  habitName: string;
  totalResisted: number;
  totalGaveIn: number;
  totalDelayed: number;
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
  outcome: 'resisted' | 'gave_in' | 'delayed';
  habitId: string; // required - reference to habit
  trigger?: string;
  notes?: string;
  // optional client-provided timestamp; backend may auto-fill
  timestamp?: string | Date;
}

export interface CreateHabitRequest {
  name: string;
  type: 'standard' | 'custom';
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path?: string;
}
