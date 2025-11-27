// src/api/services.ts
import axios from './axios';

// Interface dữ liệu đăng nhập
export interface LoginCredentials {
  username: string;
  password: string;
}

// Interface tài xế
export interface Driver {
  id?: string;
  name: string;
  phone: string;
  status?: string;
  vehicleId?: string | null;
  certifications?: string[];
  shift?: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  },

  testAdmin: async () => {
    const response = await axios.get('/api/auth/admin');
    return response.data;
  },
};

export const driverAPI = {
  getAll: async () => {
    const response = await axios.get('/api/driver');
    const data = response.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.drivers)) return data.drivers;

    console.warn('⚠ Format lạ từ API /driver:', data);
    return [];
  },

  getById: async (id: string) => {
    const response = await axios.get(`/api/driver/${id}`);
    return response.data;
  },

  create: async (driverData: Driver) => {
    const response = await axios.post('/api/driver', driverData);
    return response.data;
  },

  update: async (id: string, driverData: Driver) => {
    const response = await axios.put(`/api/driver/${id}`, driverData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`/api/driver/${id}`);
    return response.data;
  },
};

export default {
  authAPI,
  driverAPI,
};
