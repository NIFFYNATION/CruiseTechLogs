import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../services/api';
import { formatPrice } from '../shop.config';
import { isUserLoggedIn } from '../../controllers/userController';
import CustomModal from '../../components/common/CustomModal';
import { FiTrash2, FiShoppingBag, FiLock, FiArrowRight, FiCheckCircle, FiAlertCircle, FiMinus, FiPlus, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ShopCart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    // Modal state for success/error/confirmation
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // info, success, error, warning
        action: null,
        showCancel: false,
        cancelAction: null
    });

    const fetchCart = async () => {
        try {
            setLoading(true);
            if (!isUserLoggedIn()) {
                setLoading(false);
                return;
            }
            const res = await shopApi.getCart();
            if (res.status === 'success') {
                const items = res.data.items || (Array.isArray(res.data) ? res.data : []);
                setCartItems(items);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
            if (err.response && err.response.status === 404) {
                setCartItems([]);
            } else {
                setError('Failed to load cart. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemoveItem = async (item) => {
        try {
            setProcessing(true);
            const payload = {
                productID: item.productID || item.product?.ID || item.id,
                shipping_id: item.shipping_id
            };
            const res = await shopApi.removeFromCart(payload);
            if (res.status === 'success') {
                fetchCart();
            }
        } catch (err) {
            console.error("Failed to remove item", err);
            setModalConfig({
                isOpen: true,
                title: 'Error',
                message: 'Failed to remove item from cart.',
                type: 'error'
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleCheckout = async () => {
        try {
            setProcessing(true);
            const res = await shopApi.placeOrder({ gateway: 'korapay' });
            if (res.status === 'success') {
                const orderData = res.data;
                const paymentUrl = orderData.payment_url || orderData.payment_data?.pay_url;

                setModalConfig({
                    isOpen: true,
                    title: 'Order Placed Successfully!',
                    message: null,
                    type: 'success',
                    customContent: (
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">Order placed successfully. Please proceed to payment.</p>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 border border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm font-medium">Order ID:</span>
                                    <span className="font-mono font-bold text-black bg-white px-2 py-0.5 rounded border border-gray-100">{orderData.orderID}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm font-medium">Amount:</span>
                                    <span className="font-black text-black text-lg">{formatPrice(orderData.total_amount)}</span>
                                </div>
                            </div>

                            <a
                                href={paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-black/20 flex items-center justify-center gap-2"
                                onClick={() => {
                                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                                    fetchCart();
                                }}
                            >
                                Pay Now
                                <FiArrowRight />
                            </a>

                            <button
                                onClick={() => {
                                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                                    fetchCart();
                                    navigate('/shop/dashboard');
                                }}
                                className="w-full mt-3 py-3 text-gray-500 font-bold hover:text-black transition-colors"
                            >
                                I'll pay later
                            </button>
                        </div>
                    ),
                    action: null
                });
            } else {
                throw new Error(res.message || 'Checkout failed');
            }
        } catch (err) {
            console.error("Checkout failed", err);
            setModalConfig({
                isOpen: true,
                title: 'Checkout Failed',
                message: err.response?.data?.message || 'An error occurred during checkout. Please try again.',
                type: 'error'
            });
        } finally {
            setProcessing(false);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.price || item.product?.amount) || 0;
        const qty = Number(item.quantity) || 1;
        return acc + (price * qty);
    }, 0);

    const shippingTotal = 0;
    const total = subtotal + shippingTotal;

    if (!isUserLoggedIn()) {
        return (
            <div className="bg-white font-['Inter',sans-serif]">
                <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiLock className="text-4xl text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Login Required</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Please log in to view your cart and continue shopping.</p>
                    <Link to="/login" state={{ from: '/shop/cart' }} className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all hover:shadow-lg">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-['Inter',sans-serif]">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-[#0f1115] tracking-tight mb-2">Shopping Cart</h1>
                    <p className="text-[#6b7280] font-medium">{cartItems.length} items in your cart</p>
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 font-medium">
                            <FiAlertCircle className="text-xl" />
                            {error}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiShoppingBag className="text-4xl text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0f1115] mb-2">Your cart is empty</h2>
                        <p className="text-[#6b7280] mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our products and start shopping!</p>
                        <Link to="/shop/products" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all hover:shadow-lg shadow-black/10">
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <ul className="divide-y divide-gray-50">
                                    <AnimatePresence>
                                        {cartItems.map((item, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="p-6 sm:flex gap-6 hover:bg-gray-50/50 transition-colors group"
                                            >
                                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200 relative">
                                                    {item.image || item.cover_image || item.product?.cover_image ? (
                                                        <img
                                                            src={shopApi.getImageUrl(item.image || item.cover_image || item.product?.cover_image)}
                                                            alt={item.name || item.product?.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <FiImage className="text-3xl" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 mt-4 sm:mt-0 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-[#0f1115] hover:text-[#ff6a00] transition-colors line-clamp-2">
                                                                    <Link to={`/shop/products/${item.productID || item.id}`}>{item.name || item.product?.title}</Link>
                                                                </h3>
                                                                <p className="text-sm text-[#6b7280] mt-1 font-medium">{item.category || item.product?.category}</p>
                                                            </div>
                                                            <p className="text-lg font-black text-[#0f1115] whitespace-nowrap">{formatPrice(item.price || item.product?.amount)}</p>
                                                        </div>

                                                        {item.shipping_address && (
                                                            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                                                                <FiShoppingBag size={12} />
                                                                Shipping to: {item.shipping_address.city}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                            <button disabled className="w-8 h-8 flex items-center justify-center text-gray-400 cursor-not-allowed">
                                                                <FiMinus size={14} />
                                                            </button>
                                                            <span className="text-sm font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                                                            <button disabled className="w-8 h-8 flex items-center justify-center text-gray-400 cursor-not-allowed">
                                                                <FiPlus size={14} />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => handleRemoveItem(item)}
                                                            disabled={processing}
                                                            className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                                                        >
                                                            <FiTrash2 />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-24">
                                <h2 className="text-xl font-black text-[#0f1115] mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-[#0f1115]">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-green-600">{shippingTotal === 0 ? 'Free' : formatPrice(shippingTotal)}</span>
                                    </div>
                                    <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                                        <span className="text-lg font-bold text-[#0f1115]">Total</span>
                                        <span className="text-3xl font-black text-black">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processing}
                                    className="w-full bg-[#ff6a00] text-white font-bold py-4 rounded-xl hover:bg-[#e55f00] transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                >
                                    {processing ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            Checkout
                                            <FiArrowRight />
                                        </>
                                    )}
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                    <FiLock />
                                    Secure Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <CustomModal
                open={modalConfig.isOpen}
                onClose={() => {
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                    if (modalConfig.action && !modalConfig.showCancel) modalConfig.action();
                }}
                title={modalConfig.title}
                className="max-w-md"
            >
                <div className="text-center p-8">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${modalConfig.type === 'success' ? 'bg-green-50 text-green-500' :
                        modalConfig.type === 'error' ? 'bg-red-50 text-red-500' :
                            modalConfig.type === 'warning' ? 'bg-yellow-50 text-yellow-500' :
                                'bg-blue-50 text-blue-500'
                        }`}>
                        {modalConfig.type === 'success' && <FiCheckCircle className="text-3xl" />}
                        {modalConfig.type === 'error' && <FiAlertCircle className="text-3xl" />}
                        {modalConfig.type === 'warning' && <FiAlertCircle className="text-3xl" />}
                        {modalConfig.type === 'info' && <FiAlertCircle className="text-3xl" />}
                    </div>
                    {modalConfig.customContent ? modalConfig.customContent : (
                        <>
                            <p className="text-gray-600 mb-8 font-medium">{modalConfig.message}</p>

                            <div className="flex gap-3">
                                {modalConfig.showCancel && (
                                    <button
                                        onClick={() => {
                                            setModalConfig(prev => ({ ...prev, isOpen: false }));
                                            if (modalConfig.cancelAction) modalConfig.cancelAction();
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setModalConfig(prev => ({ ...prev, isOpen: false }));
                                        if (modalConfig.action) modalConfig.action();
                                    }}
                                    className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg"
                                >
                                    Okay
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </CustomModal>
        </div>
    );
};

export default ShopCart;
