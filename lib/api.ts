import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string;
  confirmation_required?: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: {
    id: string;
    username: string;
    email: string;
    full_name: string;
    created_at: string;
    role: string;
  };
  // AWS Cognito specific fields
  id_token?: string;
  refresh_token?: string;
  user_info?: any;
}

// Store the access token in memory
let accessToken: string | null = null;

// Add request interceptor to add token to requests
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const auth = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    // Store the token
    accessToken = response.data.access_token;
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear token regardless of API call success
      accessToken = null;
    }
  },

  getToken: () => accessToken,
};

export default api; 