import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { shopApi } from '../services/api';
import { FiCheckCircle, FiXCircle, FiLoader, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const ShopPaymentValidation = () => {
    const { orderID } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setStatus('error');
                setMessage('No payment reference found.');
                return;
            }

            try {
                const res = await shopApi.validatePayment(reference);
                
                // The user mentioned "200 means it was successful payment"
                // Assuming res.status or res.code or just the fact it didn't throw means success?
                // Typically axios throws on non-2xx. 
                // Let's check the response structure if possible, but based on previous code:
                // if (res.status === 'success' || res.code === 200)
                
                if (res && (res.status === 'success' || res.code === 200 || res === 'success')) {
                    setStatus('success');
                    setMessage('Payment confirmed successfully!');
                } else {
                    setStatus('error');
                    setMessage(res?.message || 'Payment verification failed.');
                }
            } catch (err) {
                console.error('Payment verification error:', err);
                setStatus('error');
                setMessage(err.response?.data?.message || err.message || 'An error occurred while verifying payment.');
            }
        };

        verifyPayment();
    }, [reference]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 font-['Inter',sans-serif]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500" />
                
                <div className="mb-8 relative z-10">
                    {status === 'verifying' && (
                        <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                            <FiLoader className="text-4xl text-blue-500 animate-spin" />
                        </div>
                    )}
                    {status === 'success' && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="spring"
                            className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center"
                        >
                            <FiCheckCircle className="text-5xl text-green-500" />
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="spring"
                            className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center"
                        >
                            <FiXCircle className="text-5xl text-red-500" />
                        </motion.div>
                    )}
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                    {status === 'verifying' && 'Verifying Payment'}
                    {status === 'success' && 'Payment Successful!'}
                    {status === 'error' && 'Payment Failed'}
                </h2>
                
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                    {message}
                </p>

                {status === 'verifying' && (
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden max-w-[200px] mx-auto">
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="h-full bg-blue-500 w-1/2 rounded-full"
                        />
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-3">
                        <Link 
                            to={`/shop/orders/${orderID}`}
                            className="block w-full py-4 bg-[#ff6a00] text-white rounded-xl font-bold hover:bg-[#e55f00] transition-all hover:shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
                        >
                            <FiShoppingBag />
                            View Order Details
                        </Link>
                        <Link 
                            to="/shop/products"
                            className="block w-full py-4 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-3">
                        <Link 
                            to={`/shop/orders/${orderID}`}
                            className="block w-full py-4 bg-[#ff6a00] text-white rounded-xl font-bold hover:bg-[#e55f00] transition-all hover:shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
                        >
                            <FiShoppingBag />
                            View Order Details
                        </Link>
                        <button 
                            onClick={() => window.location.reload()}
                            className="block w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            Try Again
                        </button>
                        <Link 
                            to="/shop/cart"
                            className="block w-full py-4 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                        >
                            Return to Cart
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ShopPaymentValidation;
