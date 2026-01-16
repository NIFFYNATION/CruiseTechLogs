import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { shopApi } from '../services/api';
import { formatPrice } from '../shop.config';
import { linkifyHtml } from '../../utils/formatUtils';
import parse from 'html-react-parser';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiShoppingBag, FiUser, FiChevronDown, FiChevronUp, FiCopy, FiCheck, FiAlertTriangle, FiMessageCircle, FiSend, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import CustomModal from '../../components/common/CustomModal';

// Helper Copy Button Component
const CopyButton = ({ text, className = "" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        if (text) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`p-1.5 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0 ${className}`}
            title="Copy to clipboard"
        >
            {copied ? <FiCheck size={14} className="text-green-600" /> : <FiCopy size={14} className="text-gray-400 hover:text-black" />}
        </button>
    );
};

// Reusable Collapsible Item Card
const OrderItemCard = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col border-b border-gray-50 last:border-0">
            {/* Header / Summary View - Always Visible */}
            <div
                className="p-5 sm:p-6 flex gap-4 sm:gap-6 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl flex-shrink-0 overflow-hidden border border-gray-100 relative shadow-sm">
                    {item.image ? (
                        <img
                            src={shopApi.getImageUrl(item.image)}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiPackage size={24} />
                        </div>
                    )}
                </div>

                {/* Content Summary */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <h5 className="text-gray-900 text-base text-sm sm:text-lg line-clamp-1 pr-2">
                                {item.product_name || item.title}
                            </h5>
                            <span className="font-black text-gray-900 whitespace-nowrap text-base sm:text-lg">
                                {formatPrice(item.price)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${['delivered', 'completed'].includes(item.status?.toLowerCase()) ? 'bg-green-50 text-green-700 border-green-100' :
                                ['cancelled', 'failed'].includes(item.status?.toLowerCase()) ? 'bg-red-50 text-red-700 border-red-100' :
                                    item.status?.toLowerCase() === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-gray-50 text-gray-700 border-gray-200'
                                }`}>
                                {item.status}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</span>
                        </div>

                        {/* Tracking Summary */}
                        {item.tracking_code && (
                            <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                                    <FiTruck size={12} />
                                    <span className="truncate max-w-[120px] font-mono">
                                        {item.tracking_code}
                                    </span>
                                </div>
                                <CopyButton text={item.tracking_code} />
                            </div>
                        )}
                    </div>

                    {/* Toggle Indicator & Delivery Range */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                            {isExpanded ? (
                                <>Hide Details <FiChevronUp /></>
                            ) : (
                                <>View Details <FiChevronDown /></>
                            )}
                        </div>
                        {item.delivery_range && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-tight">
                                <FiClock size={10} />
                                {item.delivery_range}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Details Section */}
            <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden bg-gray-50/50"
            >
                <div className="p-5 sm:p-6 pt-0 space-y-5">
                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-1 gap-4 text-xs sm:text-sm border-t border-gray-100 pt-5">
                        {item.item_id && (
                            <div>
                                <span className="block text-gray-400 font-medium mb-1.5">Item ID</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-600 break-all text-xs">
                                        #{item.item_id.split('_').pop()}
                                    </span>
                                    <CopyButton text={item.item_id} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Custom Data */}
                    {item.custom_data && Object.keys(item.custom_data).length > 0 && (
                        <div>
                            <span className="block text-gray-400 text-xs font-medium mb-2">Specifications</span>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(item.custom_data).map(([key, value]) => {
                                    let displayValue = value;
                                    let isLink = false;

                                    if (Array.isArray(value)) {
                                        displayValue = value.join(', ');
                                    } else if (typeof value === 'string' && value.match(/^https?:\/\//)) {
                                        isLink = true;
                                    }

                                    return (
                                        <div key={key} className="inline-flex items-center max-w-full">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-sm max-w-full">
                                                <span className="opacity-50 mr-1 uppercase whitespace-nowrap">{key}:</span>
                                                {isLink ? (
                                                    <a
                                                        href={value}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline hover:text-blue-800 truncate block max-w-[150px] sm:max-w-[200px]"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title={value}
                                                    >
                                                        {value}
                                                    </a>
                                                ) : (
                                                    <span className="truncate block max-w-[150px] sm:max-w-[200px]" title={displayValue}>
                                                        {displayValue}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Shipping & Tracking Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5 shadow-sm">
                        {/* Shipping Address */}
                        {item.shipping?.address ? (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                    <FiMapPin size={16} />
                                </div>
                                <div className="text-sm text-gray-600 min-w-0 flex-1">
                                    <p className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1.5">Shipping To</p>
                                    {item.shipping.name && <p className="font-bold text-gray-900 break-words text-base mb-1">{item.shipping.name}</p>}
                                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <p className="break-words leading-relaxed text-gray-700">{item.shipping.address}</p>
                                        <p className="break-words text-gray-700">{item.shipping.city}, {item.shipping.state} {item.shipping.zip}</p>
                                        <p className="break-words font-medium text-gray-900 mt-1">{item.shipping.country}</p>
                                        {item.shipping.phone && <p className="text-xs mt-2 text-gray-400 break-all pt-2 border-t border-gray-200">Tel: {item.shipping.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4 opacity-50">
                                <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center flex-shrink-0">
                                    <FiMapPin size={16} />
                                </div>
                                <div className="text-sm text-gray-500">
                                    <p className="font-bold text-xs uppercase tracking-wider mb-1">Shipping Address</p>
                                    <p>No shipping address provided</p>
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-gray-100" />


                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Reuse Stepper Component
const OrderStatusStepper = ({ items = [] }) => {
    const steps = [
        { key: 'pending', label: 'Uncomplete', desc: 'Pending payment or confirmation' },
        { key: 'order_placed', label: 'Order Placed', desc: 'Successfully received' },
        { key: 'processing', label: 'Processing', desc: 'Preparing for shipment' },
        { key: 'shipped', label: 'Shipped', desc: 'On the way' },
        { key: 'delivered', label: 'Delivered', desc: 'Package delivered' }
    ];

    // Calculate item counts for each status
    // Map 'completed' to 'delivered' for counting purposes
    const itemCounts = items.reduce((acc, item) => {
        const status = (item.status?.toLowerCase() === 'completed') ? 'delivered' : item.status?.toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const isCancelled = items.every(item => ['cancelled', 'failed'].includes(item.status?.toLowerCase()));

    if (isCancelled && items.length > 0) {
        return (
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                    <FiXCircle size={24} />
                </div>
                <h3 className="text-red-900 font-bold mb-1">Order Cancelled</h3>
                <p className="text-red-700 text-sm">All items in this order have been cancelled.</p>
            </div>
        );
    }

    // Find the index of the highest active stage
    const highestActiveIndex = steps.reduce((highest, step, idx) => {
        if (itemCounts[step.key] > 0) return idx;
        return highest;
    }, -1);

    return (
        <div className="relative pl-2">
            {/* Vertical Line */}
            <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gray-100" />

            <div className="space-y-8 relative">
                {steps.map((step, idx) => {
                    const count = itemCounts[step.key] || 0;
                    const hasItems = count > 0;
                    // Active if this stage has items OR if a later stage is active (idx <= highestActiveIndex)
                    const isActive = idx <= highestActiveIndex;

                    return (
                        <div key={step.key} className="flex gap-6 relative group">
                            {/* Icon/Circle */}
                            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 border-[6px] ${isActive
                                ? 'bg-black text-white border-white shadow-xl shadow-black/10 scale-110'
                                : 'bg-gray-50 text-gray-300 border-white'
                                }`}>
                                {hasItems ? (
                                    <span className="text-xs font-bold">{count}</span>
                                ) : (isActive ? (
                                    <FiCheck size={14} />
                                ) : (
                                    <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                                ))}
                            </div>

                            {/* Content */}
                            <div className={`pt-2 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}>
                                <h4 className={`font-black text-sm uppercase tracking-wider mb-1 ${isActive ? 'text-black' : 'text-gray-900'
                                    }`}>
                                    {step.label}
                                </h4>
                                <p className="text-xs font-medium text-gray-500 max-w-[200px] leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ShopOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [disputes, setDisputes] = useState([]);
    const [disputesLoading, setDisputesLoading] = useState(false);
    const [disputeError, setDisputeError] = useState(null);
    const [disputeMessage, setDisputeMessage] = useState('');
    const [startingDispute, setStartingDispute] = useState(false);
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const disputeSectionRef = useRef(null);

    useEffect(() => {
        const parseOrderData = (data) => {
            let orderData = { ...data };
            
            // Map fields based on new API structure
            // items is an array of detailed item objects
            const items = Array.isArray(orderData.items) ? orderData.items : [];

            // Parse product_image if it's a string JSON
            const parsedItems = items.map(item => {
                let images = [];
                try {
                    if (typeof item.product_image === 'string') {
                        images = JSON.parse(item.product_image);
                    } else if (Array.isArray(item.product_image)) {
                        images = item.product_image;
                    }
                } catch (e) {
                    images = [];
                }

                let customData = {};
                try {
                    if (item.custom_datas) {
                        customData = typeof item.custom_datas === 'string'
                            ? JSON.parse(item.custom_datas)
                            : item.custom_datas;
                    } else if (item.custom_data) {
                        customData = typeof item.custom_data === 'string'
                            ? JSON.parse(item.custom_data)
                            : item.custom_data;
                    }
                } catch (e) {
                    console.error("Error parsing custom_datas", e);
                }

                return {
                    ...item,
                    item_id: item.ID, // Preserve original item ID
                    product_name: item.product_title || item.product_name,
                    image: item.cover_image || (images.length > 0 ? images[0] : null),
                    price: Number(item.amount || item.price),
                    quantity: Number(item.quantity || item.no_of_orders) || 1,
                    status: item.status || 'pending',
                    updated_at: item.updated_at,
                    delivery_range: item.delivery_range,
                    custom_data: customData,
                    tracking_code: item.tracking_code || item.tracking_number || item.tracking_id || item.tracking,
                    courier: item.courier || item.shipping_courier || item.shipping_company,
                    shipping: {
                        name: item.shipping_name,
                        address: item.shipping_address,
                        city: item.shipping_city,
                        state: item.shipping_state,
                        country: item.shipping_country,
                        zip: item.shipping_zip,
                        phone: item.shipping_phone
                    }
                };
            });

            // Parse payment metadata if available
            let paymentMeta = {};
            try {
                if (orderData.payment_details?.meta_data) {
                    paymentMeta = typeof orderData.payment_details.meta_data === 'string'
                        ? JSON.parse(orderData.payment_details.meta_data)
                        : orderData.payment_details.meta_data;
                }
            } catch (e) {
                console.error("Failed to parse payment metadata", e);
            }

            return {
                ...orderData,
                id: orderData.ID || orderData.id,
                order_id: orderData.ID || orderData.order_id || orderData.id,
                amount: orderData.total_amount || orderData.amount,
                shipping_cost: orderData.shipping_cost || 0,
                date: orderData.date || orderData.created_at,
                last_updated: orderData.last_updated,
                customer: orderData.customer || {
                    name: orderData.customer_name || orderData.name,
                    email: orderData.customer_email || orderData.email,
                    phone: orderData.customer_phone || orderData.phone
                },
                items: parsedItems,
                // Payment details might be nested in data or separate
                payment_details: {
                    ...orderData.payment_details,
                    meta: paymentMeta
                } || null,
                payment_url: (orderData.payment_details && orderData.payment_details.pay_url) ? orderData.payment_details.pay_url : orderData.payment_url
            };
        };

        const fetchOrder = async () => {
            try {
                setLoading(true);
                // Based on new API structure, getOrder returns everything needed in data
                const orderRes = await shopApi.getOrder(id);

                if (orderRes.status === 'success' && orderRes.data) {
                    let finalOrder = parseOrderData(orderRes.data);

                    // Check for payment validation
                    // Only validate if tx_ref exists and status is NOT success
                    if (finalOrder.payment_details?.tx_ref && finalOrder.payment_details.status !== 'success') {
                        try {
                            const validateRes = await shopApi.validatePayment(finalOrder.payment_details.tx_ref);
                            if (validateRes.status === 'success') {
                                // Payment was successful, fetch updated order details
                                const updatedRes = await shopApi.getOrder(id);
                                if (updatedRes.status === 'success' && updatedRes.data) {
                                    finalOrder = parseOrderData(updatedRes.data);
                                }
                            }
                        } catch (validationErr) {
                            console.warn("Background payment validation failed", validationErr);
                        }
                    }

                    setOrder(finalOrder);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                console.error("Failed to fetch order", err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    useEffect(() => {
        const fetchDisputes = async () => {
            if (!order?.order_id && !order?.id) return;
            const orderID = order.order_id || order.id;
            try {
                setDisputesLoading(true);
                setDisputeError(null);
                const res = await shopApi.getDisputeMessages(orderID);
                if (res.status === 'success' && Array.isArray(res.data)) {
                    setDisputes(res.data);
                } else {
                    setDisputes([]);
                }
            } catch (err) {
                console.error('Failed to fetch disputes', err);
                setDisputeError('Failed to load dispute messages.');
            } finally {
                setDisputesLoading(false);
            }
        };

        if (order) {
            fetchDisputes();
        }
    }, [order]);

    const userMessageStreak = (() => {
        let count = 0;
        for (let i = disputes.length - 1; i >= 0; i--) {
            const msg = disputes[i];
            if (msg.sender_type === 'admin') {
                break;
            }
            count += 1;
        }
        return count;
    })();

    const hasReachedUserMessageLimit = userMessageStreak >= 3;

    const maskEmail = (email) => {
        if (!email) return '';
        const [local, domain] = email.split('@');
        if (!domain) return email;
        const visible = local.slice(0, 3);
        return `${visible}${local.length > 3 ? '***' : ''}@${domain}`;
    };

    const scrollToDisputeSection = () => {
        if (disputeSectionRef.current) {
            disputeSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleStartDispute = async () => {
        if (hasReachedUserMessageLimit) {
            setDisputeError('You have sent 3 messages in a row. Please wait for support to reply.');
            return;
        }
        if (!disputeMessage.trim() || (!order?.order_id && !order?.id)) return;
        const orderID = order.order_id || order.id;
        try {
            setStartingDispute(true);
            setDisputeError(null);
            await shopApi.startDispute({
                orderID,
                message: disputeMessage.trim()
            });
            setDisputeMessage('');
            const res = await shopApi.getDisputeMessages(orderID);
            if (res.status === 'success' && Array.isArray(res.data)) {
                setDisputes(res.data);
            }
        } catch (err) {
            console.error('Failed to start dispute', err);
            setDisputeError('Unable to send dispute message. Please try again.');
        } finally {
            setStartingDispute(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <FiPackage className="text-4xl text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">{error || "The order you're looking for doesn't exist or may have been removed."}</p>
                <button
                    onClick={() => navigate('/shop/orders')}
                    className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto sm:px-8 font-['Inter',sans-serif] text-[#0f1115] pb-20 lg:pt-20"
        >
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/shop/orders')}
                    className="flex items-center text-gray-500 hover:text-black mb-6 transition-colors font-medium group"
                >
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Orders
                </button>
                <hr />
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 bg-white p-5 rounded-3xl mt-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2 mt-5">
                            <h3 className="text-md sm:text-3xl md:text-4xl font-black tracking-tight break-all flex items-center gap-3">
                                Order #{order.order_id || order.id}
                                <CopyButton text={order.order_id || order.id} className="mt-1" />
                            </h3>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border whitespace-nowrap ${['delivered', 'completed'].includes(order.status?.toLowerCase()) ? 'bg-green-50 text-green-700 border-green-100' :
                                ['cancelled', 'failed'].includes(order.status?.toLowerCase()) ? 'bg-red-50 text-red-700 border-red-100' :
                                    'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 justify-between">
                            <p className="text-gray-500 flex flex-wrap items-center gap-4 font-medium">
                                <span className="flex items-center gap-2">
                                    <FiClock className="text-gray-400" />
                                    Placed on {formatDate(order.created_at || order.date)}
                                </span>
                            </p>
                            {disputes.length > 0 && (
                                <button
                                    type="button"
                                    onClick={scrollToDisputeSection}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-100"
                                >
                                    <FiMessageCircle className="text-sm" />
                                    View Dispute
                                </button>
                            )}
                        </div>
                        {disputes.length == 0 && (
                            <p className="text-sm text-gray-500 mt-3 text-red-500">
                                Got any Issue with this order? <button
                                    type="button"
                                    onClick={scrollToDisputeSection}
                                    className="text-red-600 hover:text-red-700 font-semibold underline ml-1"
                                >
                                    Start a dispute
                                </button>
                            </p>
                        )}
                        </div>

                    {(order.status === 'pending' && order.payment_url) && (
                        <button
                            onClick={() => window.open(order.payment_url, '_blank')}
                            className="px-8 py-4 bg-[#ff6a00] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-[#e55f00] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[200px]"
                        >
                            <FiCreditCard /> Pay Now
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 sm:p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <FiShoppingBag className="text-black" />
                                Order Items
                            </h2>
                            <span className="text-sm font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                {order.items?.length} Items
                            </span>
                        </div>
                        <motion.div
                            className="divide-y divide-gray-50"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {order.items?.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <OrderItemCard item={item} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Order Status */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <FiTruck className="text-black" />
                            Order Tracking
                        </h2>
                        <OrderStatusStepper items={order.items} />
                    </div>

                    {/* Customer Details */}
                    {order.customer && (order.customer.name || order.customer.email) && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <FiUser className="text-black" />
                                Customer Details
                            </h2>
                            <div className="space-y-4 text-sm text-gray-600">
                                {order.customer.name && (
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</span>
                                        <span className="font-medium text-gray-900 text-base">{order.customer.name}</span>
                                    </div>
                                )}
                                {order.customer.email && (
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</span>
                                        <span className="break-all font-medium text-gray-900">{order.customer.email}</span>
                                    </div>
                                )}
                                {order.customer.phone && (
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</span>
                                        <span className="font-medium text-gray-900">{order.customer.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <FiCreditCard className="text-black" />
                            Payment Summary
                        </h2>
                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="text-gray-900">
                                    {formatPrice(
                                        (order.items || []).reduce((acc, it) => {
                                            const price = Number(it.price) || 0;
                                            const qty = Number(it.quantity) || 1;
                                            return acc + price * qty;
                                        }, 0)
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                {order.shipping_cost > 0 ? (
                                    <span className="text-gray-900">{formatPrice(order.shipping_cost)}</span>
                                ) : (
                                    <span className="text-green-600">Free</span>
                                )}
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Tax</span>
                                <span className="text-gray-900">$0.00</span>
                            </div>
                            {Number(order?.discount_amount) > 0 && (
                                <div className="flex justify-between text-gray-500">
                                    <span>Discount{order.discount_code ? ` (${order.discount_code})` : ''}</span>
                                    <span className="text-green-700">-{formatPrice(Number(order.discount_amount))}</span>
                                </div>
                            )}

                            {/* Detailed Payment Info */}
                            {order.payment_details && (
                                <>
                                    <div className="border-t border-gray-100 my-4 pt-4 space-y-3">
                                        <div className="flex justify-between items-center text-gray-500">
                                            <span>Payment Status</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${order.payment_details.status === 'success' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.payment_details.status}
                                            </span>
                                        </div>
                                        {order.payment_details.date && (
                                            <div className="flex justify-between text-gray-500">
                                                <span>Payment Date</span>
                                                <span className="text-gray-900 text-right">{formatDate(order.payment_details.date)}</span>
                                            </div>
                                        )}
                                        {order.payment_details.tx_ref && (
                                            <div className="flex justify-between text-gray-500">
                                                <span>Ref ID</span>
                                                <span className="text-gray-900 font-mono text-xs">{order.payment_details.tx_ref}</span>
                                            </div>
                                        )}
                                        {order.payment_details.meta?.card && (
                                            <div className="flex justify-between text-gray-500">
                                                <span>Payment Method</span>
                                                <span className="text-gray-900 flex items-center gap-1">
                                                    <span className="capitalize">{order.payment_details.meta.card.card_type}</span>
                                                    <span>•••• {order.payment_details.meta.card.last_four}</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-end">
                            <span className="text-gray-900 font-bold">Total Paid</span>
                            <span className="text-2xl font-black text-black">
                                    {formatPrice(Number(order.payment_details?.amount ?? order.amount))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Dispute Section */}
                    <div
                        ref={disputeSectionRef}
                        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-4"
                    >
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <FiAlertTriangle className="text-red-500" />
                                <h2 className="text-lg font-bold">Order Dispute</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsChatExpanded((prev) => !prev)}
                                className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                                title={isChatExpanded ? 'Collapse chat' : 'Expand chat'}
                            >
                                {isChatExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                            </button>
                        </div>
                        {disputes.length === 0 && (
                            <p className="text-sm text-gray-500">
                                If there is an issue with this order, you can open a dispute. Our team will review your messages and respond here. We might also notify you by email 
                                {order.customer?.email && (
                                    <>
                                        {' '} at{' '}
                                        <span className="font-semibold">
                                            {maskEmail(order.customer.email)}
                                        </span>
                                        .
                                    </>
                                )}
                            </p>
                        )}

                        <div
                            className={`space-y-3 overflow-y-auto border border-gray-100 p-3 bg-gray-50/60 rounded-2xl ${
                                isChatExpanded ? 'max-h-[70vh]' : 'max-h-80'
                            }`}
                        >
                            {disputesLoading ? (
                                <div className="text-sm text-gray-400">Loading dispute messages...</div>
                            ) : disputes.length === 0 ? (
                                <div className="text-sm text-gray-400">
                                    No dispute opened for this order yet.
                                </div>
                            ) : (
                                disputes.map(msg => (
                                    <div
                                        key={msg.ID}
                                        className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                                                msg.sender_type === 'admin'
                                                    ? 'bg-black-50 text-black-800 border border-black-100'
                                                    : 'bg-blue-50 text-blue-800 border border-blue-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1 mb-1">
                                                <FiMessageCircle className="text-[10px]" />
                                                <span className="font-bold uppercase tracking-wide">
                                                    {msg.sender_type === 'admin' ? 'Support' : 'You'}
                                                </span>
                                            </div>
                                            <p className="whitespace-pre-wrap break-words">
                                                {parse(linkifyHtml(msg.message, 'text-blue-700 underline'))}
                                            </p>
                                            {msg.created_at && (
                                                <div className="mt-1 text-[10px] text-gray-400">
                                                    {new Date(msg.created_at).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {disputeError && (
                            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                {disputeError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <textarea
                                value={disputeMessage}
                                onChange={(e) => setDisputeMessage(e.target.value)}
                                rows={3}
                                placeholder={
                                    hasReachedUserMessageLimit
                                        ? 'You have sent 3 messages. Please wait for support to reply.'
                                        : 'Describe the issue with this order...'
                                }
                                disabled={hasReachedUserMessageLimit}
                                className={`w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 resize-none ${
                                    hasReachedUserMessageLimit ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                            />
                            <button
                                onClick={handleStartDispute}
                                disabled={startingDispute || !disputeMessage.trim() || hasReachedUserMessageLimit}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
                                    startingDispute || !disputeMessage.trim() || hasReachedUserMessageLimit
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                            >
                                <FiSend className="text-sm" />
                                {startingDispute ? 'Sending...' : disputes.length === 0 ? 'Start Dispute' : 'Reply to Dispute'}
                            </button>
                        </div>
                    </div>


                </div>
            </div>

            {/* Payment Modal */}
            <CustomModal
                open={showPayModal}
                onClose={() => setShowPayModal(false)}
                title="Complete Payment"
                className="max-w-md"
            >
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCreditCard className="text-2xl" />
                    </div>
                    <p className="mb-6 text-gray-600">
                        You will be redirected to our secure payment gateway to complete your purchase of <span className="font-bold text-black">{formatPrice(order.amount)}</span>.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPayModal(false)}
                            className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <a
                            href={order.payment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/20"
                            onClick={() => setShowPayModal(false)}
                        >
                            Pay Now
                        </a>
                    </div>
                </div>
            </CustomModal>
        </motion.div>
    );
};

export default ShopOrderDetails;
