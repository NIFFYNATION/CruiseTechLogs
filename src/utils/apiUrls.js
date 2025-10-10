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
  
  // Email rental endpoints
  EMAIL_TYPES: `${API_BASE_URL}/rentals/email/types`,
  EMAIL_SERVICES: `${API_BASE_URL}/rentals/email/services`,
  BOOK_EMAIL: `${API_BASE_URL}/rentals/email/rent`,


  BUY_ACCOUNT: `${API_BASE_URL}/account/buy`,
  ORDERS: `${API_BASE_URL}/account/orders`,
  ORDER_DETAILS: `${API_BASE_URL}/account/order`,
  LOGIN_DETAILS: `${API_BASE_URL}/account/fetch/logins`,
  USER_EDIT: `${API_BASE_URL}/user/edit`,
  USER_CHANGE_PASSWORD: `${API_BASE_URL}/user/changepassword`,
  USER_NOTIFICATIONS: `${API_BASE_URL}/user/notifications`,
  USER_NOTIFICATION_COUNT: `${API_BASE_URL}/user/notification/no`,
  USER_NOTIFICATION_SEEN: `${API_BASE_URL}/user/notification/seen`,
  CONTENT_HELP: `${API_BASE_URL}/content/help`,
  STAGES: `${API_BASE_URL}/content/stages`,
  CONTENT_LIVECHAT: `${API_BASE_URL}/content/livechat`,
  USER_GENERATE_API: `${API_BASE_URL}/user/gen/api`,
  FORGET_PASSWORD: `${API_BASE_URL}/auth/forgetpassword`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/resetpassword`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  
  // deposit 
  DEPOSIT_INI: `${API_BASE_URL}/deposit/ini`,
  DEPOSIT_VALIDATE: `${API_BASE_URL}/deposit/validate`,
  
  // Referral endpoints
  REFERRAL_STATS: `${API_BASE_URL}/referral/stats`,
  REFERRAL_GET: `${API_BASE_URL}/referral/get`,
  REFERRAL_TRANSFER: `${API_BASE_URL}/referral/transfer`,
  
  // WhatsApp verification endpoint
  WHATSAPP_CHECK: `${API_BASE_URL}/check/whatsapp`,
  // Add other endpoints as needed
};
