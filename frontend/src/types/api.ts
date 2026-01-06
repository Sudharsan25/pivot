export interface User {
  id: string;
  email: string;
  name: string | null;
  profilePicture: string | null;
  authProvider: 'local' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
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
  user: User;
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

export interface SubstituteActivity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes (3-5)
  category: 'physical' | 'breathing' | 'mental' | 'creative' | 'sensory';
  icon: string; // lucide-react icon name
  integration_type?: 'spotify' | 'game' | 'video'; // Future expansion hook
  integration_data?: any; // Future expansion hook
}
