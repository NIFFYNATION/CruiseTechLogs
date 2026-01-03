import axios from 'axios';
import { shopConfig } from '../shop.config';

const api = axios.create({
    baseURL: shopConfig.api.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const shopApi = {
    /**
     * Fetch products with optional filters
     * @param {Object} params
     * @param {number} params.start - Offset (default 0)
     * @param {number} params.limit - Limit (default 10)
     * @param {string} params.category - Category ID
     * @param {string} params.search - Search term
     * @param {Array} params.tags - Array of tags
     */
    getProducts: async (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.start) queryParams.append('start', params.start);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);
        
        if (params.tags && params.tags.length > 0) {
            params.tags.forEach(tag => queryParams.append('tags[]', tag));
        }

        const response = await api.get(`/products/get?${queryParams.toString()}`);
        return response;
    },

    /**
     * Fetch details of a single product
     * @param {string} id - Product ID
     */
    getProductDetail: async (id) => {
        const response = await api.get(`/products/detail?id=${id}`);
        return response;
    },

    /**
     * Fetch all available tags
     */
    getTags: async () => {
        const response = await api.get('/products/tags');
        return response;
    },

    /**
     * Fetch all categories
     */
    getCategories: async () => {
        const response = await api.get('/products/categories');
        return response;
    },

    /**
     * Helper to construct full image URL
     * @param {string} path 
     */
    getImageUrl: (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Remove leading slash if present to avoid double slashes
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${shopConfig.api.imageBaseUrl}${cleanPath}`;
    },

    /**
     * Get user cart
     */
    getCart: async () => {
        const response = await api.get('/products/cart');
        return response;
    },

    /**
     * Add to cart
     * @param {Object} data
     * @param {string} data.productID
     * @param {number} data.quantity
     * @param {string} data.shipping_id
     * @param {Object} data.custom_datas
     */
    addToCart: async (data) => {
        const response = await api.post('/products/cart/add', data);
        return response;
    },

    /**
     * Remove from cart
     * @param {Object} data
     * @param {string} data.productID
     * @param {string} data.shipping_id
     */
    removeFromCart: async (data) => {
        const response = await api.post('/products/cart/remove', data);
        return response;
    },

    /**
     * Place an order (checkout cart)
     * @param {Object} data - Order data (e.g. { gateway: 'korapay' })
     */
    placeOrder: async (data = {}) => {
        const response = await api.post('/products/order', data);
        return response;
    },

    /**
     * Get user orders
     * @param {Object} params
     * @param {number} params.start
     * @param {number} params.limit
     */
    getOrders: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.start) queryParams.append('start', params.start);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/products/orders?${queryParams.toString()}`);
        return response;
    },

    /**
     * Get single order by ID
     * @param {string} id - The Group Order ID (e.g., ORD_GRP_...)
     */
    getOrder: async (id) => {
        const response = await api.get(`/products/order/details?orderID=${id}`);
        return response;
    },

    /**
     * Get order payment details
     * @param {string} id - The Group Order ID
     */
    getOrderPayment: async (id) => {
        const response = await api.get(`/products/order/payment?orderID=${id}`);
        return response;
    },

    /**
     * Get order shipping details
     * @param {string} id - The Group Order ID
     */
    getOrderShipping: async (id) => {
        const response = await api.get(`/products/order/shipping?orderID=${id}`);
        return response;
    },

    /**
     * Get shipping addresses
     */
    getAddresses: async () => {
        const response = await api.get('/products/address/get');
        return response;
    },

    /**
     * Add shipping address
     * @param {Object} data
     */
    addAddress: async (data) => {
        const response = await api.post('/products/address/add', data);
        return response;
    },

    /**
     * Edit shipping address
     * @param {Object} data
     * @param {string} data.ID - Address ID
     */
    editAddress: async (data) => {
        const response = await api.post('/products/address/edit', data);
        return response;
    },

    /**
     * Delete shipping address
     * @param {string} id
     */
    deleteAddress: async (id) => {
        const response = await api.post('/products/address/delete', { ID: id });
        return response;
    },

    /**
     * Validate payment
     * @param {string} reference - Transaction reference
     */
    validatePayment: async (reference) => {
        const response = await api.get(`/deposit/validate?txref=${reference}`);
        return response;
    }
};

export default shopApi;
