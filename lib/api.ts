import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
export const auth = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    // Store the token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        await api.post('/auth/logout');
      }
    } finally {
      // Clear token regardless of API call success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  },

  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  },
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

// Database Schema API interfaces
export interface DatabaseListResponse {
  status: string;
  databases: Record<string, string>;
}

export interface DatabaseSchemaResponse {
  status: string;
  schema: {
    database: string;
    database_path: string;
    tables: Record<string, {
      columns: Array<{
        name: string;
        type: string;
        primary_key: boolean;
        not_null?: boolean;
      }>;
      sample_data?: Record<string, any>[];
    }>;
  };
}

export interface TablesListResponse {
  status: string;
  database: string;
  tables: string[];
}

export interface TableInfoResponse {
  status: string;
  table_info: {
    columns: Array<{
      name: string;
      type: string;
      primary_key: boolean;
      not_null?: boolean;
    }>;
    sample_data?: Record<string, any>[];
  };
}

// Database Schema API functions
export async function listDatabases(): Promise<DatabaseListResponse> {
  const response = await api.get('/db-info/databases');
  return response.data;
}

export async function getDatabaseSchema(dbName: string): Promise<DatabaseSchemaResponse> {
  const response = await api.get(`/db-info/schema/${dbName}`);
  return response.data;
}

export async function listTables(dbName: string): Promise<TablesListResponse> {
  const response = await api.get(`/db-info/tables/${dbName}`);
  return response.data;
}

export async function getTableInfo(dbName: string, tableName: string): Promise<TableInfoResponse> {
  const response = await api.get(`/db-info/table/${dbName}/${tableName}`);
  return response.data;
}

export default api; 