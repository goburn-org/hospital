import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { NODE_ENV } from '../env';
import { apiTokenStorage } from '../provider/auth/auth-util';

const baseUrl =
  NODE_ENV === 'development'
    ? 'http://localhost:9000/api'
    : 'https://hims-27650986183.asia-southeast1.run.app/api';

const handleError = (error: unknown) => {
  if (error instanceof AxiosError && error.response?.data.message) {
    return new Error(error.response?.data.message);
  }
  return error;
};
export class HttpService {
  static updateToken(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    apiTokenStorage.setToken(token);
    this.handleUnauthorizedRequest();
  }

  static handleUnauthorizedRequest = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          axios.defaults.headers.common['Authorization'] = '';
          apiTokenStorage.removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  };

  static removeToken() {
    axios.defaults.headers.common['Authorization'] = '';
    apiTokenStorage.removeToken();
  }

  static async get<T>(url: string, params?: AxiosRequestConfig) {
    try {
      const formattedUrl = url.startsWith('/') ? url : `/${url}`;
      const response = await axios.get<T>(`${baseUrl}${formattedUrl}`, params);
      return response.data;
    } catch (e) {
      throw handleError(e);
    }
  }

  static async post<T, R = unknown>(url: string, data?: R) {
    try {
      const response = await axios.post<T>(`${baseUrl}/${url}`, data);
      return response.data;
    } catch (e) {
      throw handleError(e);
    }
  }

  static async put<T, R = unknown>(url: string, data?: R) {
    try {
      const response = await axios.put<T>(`${baseUrl}/${url}`, data);
      return response.data;
    } catch (e) {
      throw handleError(e);
    }
  }

  static async putFile<T>(url: string, data: File) {
    try {
      const formData = new FormData();
      formData.append('file', data);
      const response = await axios.put<T>(`${baseUrl}/${url}`, formData);
      return response.data;
    } catch (e) {
      throw handleError(e);
    }
  }

  static async delete<T>(url: string, data?: AxiosRequestConfig) {
    try {
      const response = await axios.delete<T>(`${baseUrl}/${url}`, data);
      return response.data;
    } catch (e) {
      throw handleError(e);
    }
  }
}
