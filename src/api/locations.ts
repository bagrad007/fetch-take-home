import { apiClient, handleApiError } from './config';
import type { Location } from '../types';

export const locationsApi = {
  async fetchLocations(zipCodes: string[]): Promise<Location[]> {
    try {
      const response = await apiClient.post<Location[]>('/locations', zipCodes);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
