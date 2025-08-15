import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    console.error("API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export const getClientById = async (id) => {
  try {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClientById = async (id, data) => {
  try {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllClients = async () => {
  try {
    const response = await api.get(`/clients`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createClient = async (data) => {
  try {
    const response = await api.post(`/clients`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteClientById = async (id) => {
  try {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMeetings = async () => {
  try {
    const response = await api.get(`/meetings`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllMeetings = async () => {
  try {
    const response = await api.get(`/meetings`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMeetingById = async (id) => {
  try {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMeeting = async (data) => {
  try {
    const response = await api.post(`/meetings`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMeetingById = async (id, data) => {
  try {
    const response = await api.put(`/meetings/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMeetingById = async (id) => {
  try {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};