import React, { useState } from "react";
import SectionHeader from "../../common/SectionHeader";
import { Button } from "../../common/Button";
import Toast from '../../common/Toast';
import { money_format } from '../../../utils/formatUtils';
import { useNavigate } from "react-router-dom";
import { initiateDeposit } from '../../../services/depositService';

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const numericAmount = Number(amount);
    
    if (!amount || amount.trim() === '' || isNaN(numericAmount) || numericAmount <= 0) {
      setToast({ show: true, message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    if (numericAmount < 1000) {
      setToast({ show: true, message: 'Minimum deposit amount is ₦1,000', type: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      const result = await initiateDeposit(Number(amount));
      
      if (result.success && result.data?.pay_url) {
        setToast({ 
          show: true, 
          message: result.message || 'Redirecting to payment gateway...', 
          type: 'success' 
        });
        // Redirect to payment gateway
        window.location.href = result.data.pay_url;
      } else {
        setToast({ 
          show: true, 
          message: result.message || 'Failed to initialize payment', 
          type: 'error' 
        });
      }
      
    } catch (error) {
      setToast({ 
        show: true, 
        message: error.message || 'Failed to process deposit', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === '' || (Number(value) >= 0 && !isNaN(value))) {
      // Remove leading zeros but keep at least one digit if the value is just zeros
      const cleanedValue = value.replace(/^0+/, '') || (value.match(/^0+$/) ? '0' : '');
      setAmount(cleanedValue);
    }
  };

  const handleCancel = () => {
    setAmount('');
    // Navigate back or close modal if needed
  };

  return (
    <div className="p-4 md:p-10">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Fund Your Account</h1>
            <p className="text-tertiary text-sm md:text-base">Add funds to your wallet to purchase services</p>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/dashboard/wallet")}
            className="self-start sm:self-auto"
          >
            View Wallet
          </Button>
        </div>
      </div>
      
      <div className="bg-background rounded-2xl shadow p-4 md:p-8 mx-auto max-w-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-primary mb-2">Add Funds to Your Wallet</h3>
          <p className="text-tertiary text-sm">
            Enter the amount you want to deposit into your account. Funds will be available immediately after successful payment.
          </p>
        </div>
        
        <hr className="border-secondary mb-6" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="amount" 
              className="block text-base font-medium text-primary mb-3"
            >
              Amount (NGN)
            </label>
            
            <div className="flex items-center rounded-lg border border-border-grey focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
              <span className="px-4 py-3 rounded-l-lg bg-secondary text-lg text-primary font-bold border-r border-border-grey">
                ₦
              </span>
              <input
                type="number"
                id="amount"
                name="amount"
                min="1"
                step="1"
                className="flex-1 bg-transparent outline-none border-none py-3 px-4 text-lg placeholder-tertiary"
                placeholder="Enter amount (e.g., 5000)"
                value={amount}
                onChange={handleAmountChange}
                required
                disabled={loading}
              />
            </div>
            
            {amount && Number(amount) > 0 && (
              <p className="mt-2 text-sm text-tertiary">
                You are about to deposit: <span className="font-semibold text-primary">{money_format(amount)}</span>
              </p>
            )}
          </div>
          
          {/* Payment Information Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• Funds will be added to your wallet immediately after successful payment</p>
              <p>• Minimum deposit amount: ₦1,000</p>
              <p>• Maximum deposit amount: ₦1,000,000</p>
              <p>• All transactions are secure and encrypted</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !amount || Number(amount) <= 0}
              className="flex-1 sm:flex-none sm:w-48 bg-quinary text-white rounded-full py-3 px-6 font-semibold text-base hover:bg-quaternary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>+</span>
                  Add Fund
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 sm:flex-none sm:w-32 bg-transparent text-secondary border border-border-grey rounded-full py-3 px-6 font-semibold text-base hover:bg-bgLayout transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-secondary">
          <div className="flex items-center justify-between text-sm">
            <span className="text-tertiary">Need help?</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/dashboard/help-center')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;