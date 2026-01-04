import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import type {
  AuthResponse,
  CreateUrgeRequest,
  Urge,
  UrgeStats,
  UrgeStatsByType,
  PaginatedUrges,
  RegisterRequest,
  LoginRequest,
  ApiError,
  Habit,
  CreateHabitRequest,
} from '@/types/api';

// Get API URL from environment variable with fallback
// Vite requires VITE_ prefix for client-side env vars
// Use import.meta.env (Vite's way) instead of process.env
export const getApiUrl = (): string => {
  const envUrl =
    import.meta.env.VITE_API_URL || import.meta.env.VITE_PUBLIC_API_URL;
  // Check if env var exists and is not empty
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  // Fallback to localhost for development
  return 'http://localhost:3000';
};

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token from localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    // Debug: log outgoing request and token
    // eslint-disable-next-line no-console
    console.log(
      '[api] request:',
      config.method,
      config.url,
      'token present:',
      !!token
    );
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (redirect to login)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Debug: log 401 and response
      // eslint-disable-next-line no-console
      console.warn(
        '[api] 401 response, clearing token and redirecting',
        error.response?.data
      );
      // Clear token and redirect to login
      localStorage.removeItem('token');
      // Add delay so console logs are readable before redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 10000);
    }
    return Promise.reject(error);
  }
);

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    const apiError = error.response?.data;
    if (apiError?.message) {
      if (Array.isArray(apiError.message)) {
        return apiError.message.join(', ');
      }
      return apiError.message;
    }
    return error.message || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Auth API functions
export const authAPI = {
  /**
   * Register a new user
   */
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        email,
        password,
      } as RegisterRequest);

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      } as LoginRequest);

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout user (clear token)
   */
  logout(): void {
    localStorage.removeItem('token');
  },

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

// Urges API functions
export const urgesAPI = {
  /**
   * Log a new urge entry
   */
  async logUrge(payload: CreateUrgeRequest): Promise<Urge> {
    try {
      const response = await api.post<Urge>('/urges', payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get paginated urges for the current user
   */
  async getUrges(
    limit: number = 20,
    offset: number = 0
  ): Promise<PaginatedUrges> {
    try {
      const response = await api.get<PaginatedUrges>('/urges', {
        params: {
          limit,
          offset,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get urge statistics for the current user
   */
  async getStats(): Promise<UrgeStats> {
    try {
      const response = await api.get<UrgeStats>('/urges/stats');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get urge statistics grouped by habit for the current user
   */
  async getStatsByType(): Promise<UrgeStatsByType[]> {
    try {
      const response = await api.get<UrgeStatsByType[]>('/urges/stats/by-type');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get time-series counts per habit by hour for a specific date
   */
  async getTimeSeriesByDate(
    date: string // ISO date string (YYYY-MM-DD)
  ): Promise<Array<{ bucket: string; habitName: string; count: number }>> {
    try {
      console.log(`[urgesAPI.getTimeSeriesByDate] Fetching for date=${date}`);
      const response = await api.get<
        Array<{ bucket: string; habitName: string; count: number }>
      >('/urges/stats/time-series', {
        params: { date },
      });
      console.log(
        `[urgesAPI.getTimeSeriesByDate] Response received:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error('[urgesAPI.getTimeSeriesByDate] Error:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get time-series counts per urge type (deprecated - use getTimeSeriesByDate)
   */
  async getTimeSeries(
    bucket: 'day' | 'hour' = 'day',
    days: number = 30
  ): Promise<Array<{ bucket: string; urgeType: string; count: number }>> {
    try {
      console.log(
        `[urgesAPI.getTimeSeries] Fetching with bucket=${bucket}, days=${days}`
      );
      const response = await api.get<
        Array<{ bucket: string; urgeType: string; count: number }>
      >('/urges/stats/time-series', {
        params: { bucket, days },
      });
      console.log(`[urgesAPI.getTimeSeries] Response received:`, response.data);
      return response.data;
    } catch (error) {
      console.error('[urgesAPI.getTimeSeries] Error:', error);
      throw new Error(getErrorMessage(error));
    }
  },
};

// Habits API functions
export const habitsAPI = {
  /**
   * Get all habits available to the current user (standard + custom)
   */
  async getHabits(): Promise<Habit[]> {
    try {
      const response = await api.get<Habit[]>('/habits');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create a new habit
   */
  async createHabit(payload: CreateHabitRequest): Promise<Habit> {
    try {
      const response = await api.post<Habit>('/habits', payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

// Export the axios instance for custom requests if needed
export default api;
