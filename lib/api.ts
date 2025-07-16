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

// Chat API interfaces
export interface ChatRequest {
  message: string;
  database_type?: string; // 'raw_database' or 'agg_database'
}

export interface ChatResponse {
  type: 'text' | 'table' | 'chart';
  content: string; // Human-readable message to user
  sql_query?: string; // SQL query if generated
  data?: Record<string, any>[]; // Query results if available
  execution_time?: number;
  rows_count?: number;
}

export interface ChatSessionResponse {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatMessageResponse {
  id: string;
  role: string;
  content: string;
  sql_query?: string;
  response_type?: string;
  execution_time?: number;
  rows_count?: number;
  created_at: string;
  has_data: boolean;
}

export interface NewChatResponse {
  chat_id: string;
  title: string;
  message_id: string;
  created_at: string;
  updated_at: string;
  response: ChatResponse;
}

export interface ChatHistoryResponse {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessageResponse[];
}

export interface MessageDataResponse {
  message_id: string;
  data: Record<string, any>[];
  columns: string[];
  shape: [number, number];
  sql_query?: string;
  response_type?: string;
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

// Chat API functions
export const chat = {
  // Create new chat and send first message
  newChat: async (data: ChatRequest): Promise<NewChatResponse> => {
    const response = await api.post('/chat/new', data);
    return response.data;
  },

  // Continue existing chat
  continueChat: async (chatId: string, data: ChatRequest): Promise<NewChatResponse> => {
    const response = await api.post(`/chat/continue/${chatId}`, data);
    return response.data;
  },

  // Get chat history (list of sessions)
  getChatHistory: async (): Promise<ChatSessionResponse[]> => {
    const response = await api.get('/chat/history');
    return response.data;
  },

  // Get specific chat with messages
  getChatById: async (chatId: string): Promise<ChatHistoryResponse> => {
    const response = await api.get(`/chat/history/${chatId}`);
    return response.data;
  },

  // Delete chat
  deleteChat: async (chatId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/chat/history/${chatId}`);
    return response.data;
  },

  // Get message data for preview
  getMessageData: async (messageId: string): Promise<MessageDataResponse> => {
    const response = await api.get(`/chat/data/${messageId}`);
    return response.data;
  },

  // Download message data
  downloadMessageData: async (messageId: string, format: 'json' | 'csv' | 'excel' | 'pdf') => {
    const response = await api.get(`/chat/download/${messageId}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Database Schema API
export async function listDatabases() {
  const response = await fetch('/api/db-info/databases', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch databases');
  }

  return await response.json();
}

export async function getDatabaseSchema(dbName: string) {
  const response = await fetch(`/api/db-info/schema/${dbName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch schema for database ${dbName}`);
  }

  return await response.json();
}

export async function listTables(dbName: string) {
  const response = await fetch(`/api/db-info/tables/${dbName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tables for database ${dbName}`);
  }

  return await response.json();
}

export async function getTableInfo(dbName: string, tableName: string) {
  const response = await fetch(`/api/db-info/table/${dbName}/${tableName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch info for table ${tableName}`);
  }

  return await response.json();
}

export default api; 