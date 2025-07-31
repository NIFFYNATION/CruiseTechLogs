import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/apiUrls';

/**
 * Initiate a deposit transaction
 * @param {number} amount - Deposit amount (minimum 1000 NGN)
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const initiateDeposit = async (amount) => {
  try {
    // Validate minimum amount
    if (!amount || amount < 1000) {
      return {
        success: false,
        message: 'Minimum deposit amount is ₦1,000'
      };
    }

    // Prepare request data
    const requestData = {
      amount: Number(amount)
    };

    const response = await axiosInstance.post(API_URLS.DEPOSIT_INI, requestData);
    
    // Check response status and structure
    if (response.status === 200 && response.data?.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Payment initialized successfully'
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to initialize payment'
      };
    }
  } catch (error) {
    console.error('Deposit Initiation Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while processing your deposit'
    };
  }
};

/**
 * Validate deposit transaction after payment gateway redirect
 * @param {string} txRef - Transaction reference
 * @param {string} transID - Transaction ID
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export const validateDeposit = async (txRef, transID) => {
  try {
    if (!txRef) {
      return {
        success: false,
        message: 'Transaction reference is required'
      };
    }

    if (!transID) {
      return {
        success: false,
        message: 'Transaction ID is required'
      };
    }

    const response = await axiosInstance.get(`${API_URLS.DEPOSIT_VALIDATE}?txref=${encodeURIComponent(txRef)}&transID=${encodeURIComponent(transID)}`);
    
    if (response.status === 200 && response.data?.code === 200) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Payment validated successfully'
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to validate payment'
      };
    }
  } catch (error) {
    console.error('Deposit Validation Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while validating your payment'
    };
  }
};