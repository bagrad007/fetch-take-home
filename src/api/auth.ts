import { apiClient, handleApiError } from './config';

export interface LoginResponse {
  success: boolean;
}

export const authApi = {
  async login(name: string, email: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        name,
        email,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
