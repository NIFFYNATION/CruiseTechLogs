import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Toast from '../../common/Toast';
import { validateDeposit } from '../../../services/depositService';
import { money_format } from '../../../utils/formatUtils';

const PaymentValidation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [validationStatus, setValidationStatus] = useState('validating'); // 'validating', 'success', 'failed'
  const [validationData, setValidationData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    const validatePayment = async () => {
      const txRef = searchParams.get('tx_ref');
      const transID = searchParams.get('transaction_id');
      const status = searchParams.get('status');
      
      if (!txRef) {
        setValidationStatus('failed');
        setToast({ show: true, message: 'Invalid payment reference', type: 'error' });
        return;
      }

      if (!transID) {
        setValidationStatus('failed');
        setToast({ show: true, message: 'Invalid transaction ID', type: 'error' });
        return;
      }

      if (status === 'cancelled') {
        setValidationStatus('failed');
        setToast({ show: true, message: 'Payment was cancelled', type: 'error' });
        return;
      }

      try {
        const result = await validateDeposit(txRef, transID);
        
        if (result.success) {
          setValidationStatus('success');
          setValidationData(result.data);
          setToast({ show: true, message: result.message || 'Payment validated successfully!', type: 'success' });
          
          // Redirect to wallet after 3 seconds
          // setTimeout(() => {
          //   navigate('/dashboard/wallet');
          // }, 5000);
        } else {
          setValidationStatus('failed');
          setToast({ show: true, message: result.message || 'Payment validation failed', type: 'error' });
        }
      } catch (error) {
        setValidationStatus('failed');
        setToast({ show: true, message: 'An error occurred while validating payment', type: 'error' });
      }
    };

    validatePayment();
  }, [searchParams, navigate]);

  const handleReturnToWallet = () => {
    navigate('/dashboard/wallet');
  };

  const handleTryAgain = () => {
    navigate('/dashboard/deposit');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {validationStatus === 'validating' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {validationStatus === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your deposit has been processed successfully.
            </p>
            {validationData?.amount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-700">
                  Amount: <span className="font-semibold">{money_format(validationData.amount)}</span>
                </p>
                {validationData.tx_ref && (
                  <p className="text-xs text-green-600 mt-1">
                    Reference: {validationData.tx_ref}
                  </p>
                )}
              </div>
            )}
            <p className="text-sm text-gray-500 mb-4">
              The amount will be credited to your account shortly.
            </p>
            <button
              onClick={handleReturnToWallet}
              className="w-full bg-quinary text-white py-2 px-4 rounded-lg hover:bg-quaternary transition-colors"
            >
              Go to Wallet
            </button>
          </>
        )}

        {validationStatus === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't process your payment. Please try again or contact support if the issue persists.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-quinary text-white py-2 px-4 rounded-lg hover:bg-quaternary transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleReturnToWallet}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return to Wallet
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentValidation;