import axiosInstance from '../utils/axiosInstance';
import { API_BASE_URL } from '../utils/apiUrls';

export const fetchPlatforms = async (categoryID) => {
  if (!categoryID) return [];
  try {
    const res = await axiosInstance.get(`${API_BASE_URL}/account/platforms?categoryID=${categoryID}`);
    if (res.status === 200 && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch {
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get(`${API_BASE_URL}/account/categories`);
    if (res.status === 200 && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch {
    return [];
  }
};

export const fetchAccounts = async ({ page = 1, platform, category }) => {
  console.log(platform, category)
  if (!platform || !category) return [];
  try {
    const res = await axiosInstance.get(
      `${API_BASE_URL}/account/fetch?page=${page}&category=${category}&platform=${platform}`
    );
    if (res.status === 200 && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [];
  } catch {
    
    return [];
  }
};

export const fetchTotalInStock = async (accountID) => {
  if (!accountID) return null;
  try {
    const res = await axiosInstance.get(
      `${API_BASE_URL}/account/fetch/total?accountID=${accountID}`
    );
    if (res.status === 200 && res.data?.data?.total != null) {
      return res.data.data.total;
    }
    return null;
  } catch {
    return null;
  }
};

export const fetchAccountLogins = async (accountID) => {
  if (!accountID) return [];
  let allLogins = [];
  let page = 1;
  let batchSize = 1;
  let keepFetching = true;

  while (keepFetching) {
    try {
      const res = await axiosInstance.get(
        `${API_BASE_URL}/account/fetch/logins?accountID=${accountID}&page=${page}`
      );
      if (
        res.status === 200 &&
        Array.isArray(res.data.data) &&
        res.data.data.length > 0
      ) {
        allLogins = allLogins.concat(res.data.data);
        // After first batch, increase batch size for next fetches
        if (batchSize === 1) batchSize = 30;
        else batchSize += 30;
        page++;
      } else {
        keepFetching = false;
      }
    } catch {
      keepFetching = false;
    }
  }
  return allLogins;
};

export const fetchAccountDetails = async (accountID) => {
  if (!accountID) return null;
  try {
    const res = await axiosInstance.get(
      `${API_BASE_URL}/account/get?ID=${accountID}`
    );
    if (res.status === 200 && res.data?.data) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
};

export const buyAccount = async (accountID, payload) => {
  if (!accountID) {
    return { success: false, message: 'Account ID is required.' };
  }
  try {
    const res = await axiosInstance.post(
      `${API_BASE_URL}/account/buy?accountID=${accountID}`,
      payload
    );

    if (res.data && res.data.status === 'success') {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message || 'An unknown error occurred' };
    }
  } catch (error) {
    return { success: false, message: error.message || 'Failed to place order. Please try again.' };
  }
};

export const fetchOrders = async ({ start = 1, search = "" } = {}) => {
  try {
    let url = `${API_BASE_URL}/account/orders?start=${start}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const res = await axiosInstance.get(url);
    if (res.data && res.data.status === "success" && res.data.data) {
      return {
        next: res.data.data.next,
        accounts: Array.isArray(res.data.data.accounts) ? res.data.data.accounts : [],
      };
    }
    return { next: null, accounts: [] };
  } catch (error) {
    return { next: null, accounts: [], error: error.message || "Failed to fetch orders." };
  }
};

export const fetchOrderDetails = async (orderID) => {
  if (!orderID) return null;
  try {
    const res = await axiosInstance.get(`${API_BASE_URL}/account/order?ID=${orderID}`);
    if (res.data && res.data.status === 'success' && res.data.data && res.data.data.order) {
      return res.data.data.order;
    }
    return null;
  } catch {
    return null;
  }
};

export const fetchLoginDetails = async (loginID) => {
  if (!loginID) return null;
  try {
    const res = await axiosInstance.get(`${API_BASE_URL}/account/fetch/logins?ID=${loginID}`);
    if (res.data && res.data.status === 'success' && res.data.data) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
};


