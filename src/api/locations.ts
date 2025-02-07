import client from "./client";

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export const fetchLocations = async (
  zipCodes: string[],
): Promise<Location[]> => {
  const response = await client.post<Location[]>("/locations", zipCodes);
  return response.data;
};
