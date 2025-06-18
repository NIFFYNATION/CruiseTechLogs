// Get base URL from environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8073';

export const API_URLS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  NUMBERTYPES: `${API_BASE_URL}/rentals/types`,
  NUMBERCOUNTRIES: `${API_BASE_URL}/rentals/countries`,
  NUMBERSERVICES: `${API_BASE_URL}/rentals/services`,
  BOOKNUMBER: `${API_BASE_URL}/rentals/new`,
  GET_NUMBERS: `${API_BASE_URL}/rentals/get`,
  GET_NUMBER_CODE: `${API_BASE_URL}/rentals/getcode`,
  // Add other endpoints as needed
};
