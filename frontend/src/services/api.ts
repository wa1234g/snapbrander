import axios from 'axios';
import { User, Project, Template, Module, Draft, ColorScheme, AIGenerationResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    country?: string;
    language?: string;
    currency?: string;
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getUser: () => api.get<User>('/auth/user'),

  updateProfile: (data: Partial<User>) => api.put('/auth/profile', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => api.post('/auth/reset-password', data),
};

export const projectApi = {
  list: () => api.get<{ data: Project[] }>('/projects'),

  init: (data: {
    name: string;
    business_name: string;
    business_type: string;
    description?: string;
  }) => api.post<Project>('/projects/init', data),

  get: (id: number) => api.get<Project>(`/projects/${id}`),

  update: (id: number, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data),

  selectTemplate: (id: number, template_id: number) =>
    api.post(`/projects/${id}/select-template`, { template_id }),

  setColors: (id: number, colors: ColorScheme) =>
    api.post(`/projects/${id}/set-colors`, { colors }),

  uploadLogo: (id: number, logo: File) => {
    const formData = new FormData();
    formData.append('logo', logo);
    return api.post(`/projects/${id}/upload-logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  generateSite: (id: number) => api.post(`/projects/${id}/generate-site`),

  getStatus: (id: number) => api.get(`/projects/${id}/status`),

  archive: (id: number) => api.post(`/projects/${id}/archive`),

  restore: (id: number) => api.post(`/projects/${id}/restore`),

  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const aiApi = {
  generateDescription: (data: {
    business_name: string;
    business_type: string;
    industry?: string;
    language?: string;
  }) => api.post<AIGenerationResponse>('/ai/generate-description', data),

  generateContent: (data: {
    project_id: number;
    content_type: string;
    language?: string;
  }) => api.post<AIGenerationResponse>('/ai/generate-content', data),

  generateColors: (data: {
    business_type: string;
    industry?: string;
    mood?: string;
  }) => api.post<AIGenerationResponse>('/ai/generate-colors', data),

  generateLogo: (data: {
    business_name: string;
    business_type: string;
    style?: string;
    colors?: string[];
  }) => api.post<AIGenerationResponse>('/ai/generate-logo', data),

  translate: (data: {
    text: string;
    from_language: string;
    to_language: string;
  }) => api.post<AIGenerationResponse>('/ai/translate', data),

  chat: (data: {
    message: string;
    session_id?: string;
    project_id?: number;
    current_step?: number;
  }) => api.post<AIGenerationResponse>('/ai/chat', data),

  getChatSession: (sessionId: string) =>
    api.get(`/ai/chat/${sessionId}`),
};

export const templateApi = {
  list: (params?: { category?: string; requires_woocommerce?: boolean }) =>
    api.get<Template[]>('/templates', { params }),

  get: (id: number) => api.get<Template>(`/templates/${id}`),
};

export const moduleApi = {
  list: (params?: { category?: string; is_free?: boolean }) =>
    api.get<Module[]>('/modules', { params }),

  get: (id: number) => api.get<Module>(`/modules/${id}`),
};

export const draftApi = {
  list: () => api.get<Draft[]>('/drafts'),

  save: (data: {
    current_step: number;
    step_data: any;
    session_id?: string;
  }) => api.post<Draft>('/drafts/save', data),

  resume: (session_id?: string) =>
    api.post<Draft>('/drafts/resume', { session_id }),

  delete: (id: number) => api.delete(`/drafts/${id}`),
};

export const settingsApi = {
  getPublic: () => api.get('/settings/public'),
  
  getAll: () => api.get('/settings'),

  update: (settings: Record<string, any>) =>
    api.put('/settings', { settings }),
};

export default api;
