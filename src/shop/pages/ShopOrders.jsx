import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { shopApi } from '../services/api';
import { formatPrice } from '../shop.config';
import {
    FiSearch, FiPackage, FiClock,
    FiCheckCircle, FiXCircle, FiArrowRight, FiShoppingBag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---

const OrderStats = ({ orders }) => {
    const stats = useMemo(() => {
        const total = orders.length;
        const active = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status?.toLowerCase())).length;
        const completed = orders.filter(o => ['completed', 'delivered'].includes(o.status?.toLowerCase())).length;
        const spent = orders.filter(o => {
            const isPaid = (o.payment_details?.status === 'success') ||
                ['processing', 'shipped', 'delivered', 'completed'].includes(o.status?.toLowerCase());
            return isPaid && !['cancelled', 'failed'].includes(o.status?.toLowerCase());
        }).reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        return { total, active, completed, spent };
    }, [orders]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FiPackage className="text-6xl text-gray-900" />
                </div>
                <div className="z-10">
                    <div className="p-2 bg-gray-50 rounded-lg w-fit mb-3 text-gray-900">
                        <FiPackage />
                    </div>
                    <span className="text-2xl font-black text-gray-900 block">{stats.total}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Orders</span>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FiClock className="text-6xl text-blue-600" />
                </div>
                <div className="z-10">
                    <div className="p-2 bg-blue-50 rounded-lg w-fit mb-3 text-blue-600">
                        <FiClock />
                    </div>
                    <span className="text-2xl font-black text-gray-900 block">{stats.active}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active</span>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FiCheckCircle className="text-6xl text-green-600" />
                </div>
                <div className="z-10">
                    <div className="p-2 bg-green-50 rounded-lg w-fit mb-3 text-green-600">
                        <FiCheckCircle />
                    </div>
                    <span className="text-2xl font-black text-gray-900 block">{stats.completed}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Completed</span>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FiShoppingBag className="text-6xl text-orange-500" />
                </div>
                <div className="z-10">
                    <div className="p-2 bg-orange-50 rounded-lg w-fit mb-3 text-orange-500">
                        <FiShoppingBag />
                    </div>
                    <span className="text-xl md:text-2xl font-black text-gray-900 block truncate" title={formatPrice(stats.spent)}>
                        {formatPrice(stats.spent)}
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Spent</span>
                </div>
            </div>
        </div>
    );
};

const OrderStatusStepper = ({ status }) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = steps.indexOf(status?.toLowerCase()) > -1
        ? steps.indexOf(status?.toLowerCase())
        : (status?.toLowerCase() === 'completed' ? 3 : 0);

    const isCancelled = ['cancelled', 'failed'].includes(status?.toLowerCase());

    if (isCancelled) {
        return (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold w-fit">
                <FiXCircle />
                <span>Order Cancelled</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 w-full max-w-[200px]">
            {[0, 1, 2, 3].map((step, idx) => (
                <div key={step} className="flex-1 flex flex-col gap-1">
                    <div className={`h-1.5 rounded-full w-full transition-colors duration-300 ${idx <= currentStepIndex ? 'bg-green-500' : 'bg-gray-100'
                        }`} />
                </div>
            ))}
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 min-w-[60px] text-right">
                {status || 'Pending'}
            </span>
        </div>
    );
};

const OrderCard = ({ order, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            onClick={onClick}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm transition-all cursor-pointer overflow-hidden relative"
        >
            {/* Status Stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${['delivered', 'completed'].includes(order.status?.toLowerCase()) ? 'bg-green-500' :
                ['cancelled', 'failed'].includes(order.status?.toLowerCase()) ? 'bg-red-500' :
                    'bg-blue-500'
                }`} />

            <div className="p-5 pl-7">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-black text-gray-900">#{order.order_id || order.id}</h3>
                            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                {new Date(order.date || order.created_at).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            {order.items?.length || 0} items • {formatPrice(order.amount)}
                        </p>
                    </div>

                    {/* Status Stepper */}
                    <div className="flex flex-col items-end gap-2">
                        <OrderStatusStepper status={order.status} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex items-center justify-between">
                    {/* Product Preview Stack */}
                    <div className="flex -space-x-3">
                        {order.items?.slice(0, 4).map((item, idx) => (
                            <div
                                key={idx}
                                className="w-12 h-12 rounded-xl border-2 border-white shadow-sm bg-gray-50 overflow-hidden relative"
                            >
                                {item.image || item.product_image ? (
                                    <img
                                        src={shopApi.getImageUrl(item.image || item.product_image)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <FiPackage />
                                    </div>
                                )}
                            </div>
                        ))}
                        {(order.items?.length > 4) && (
                            <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                +{order.items.length - 4}
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2">
                        <span className="hidden md:block text-sm font-bold text-gray-300 group-hover:text-black transition-colors">
                            View Details
                        </span>
                        <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-all flex items-center justify-center">
                            <FiArrowRight />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ShopOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'amount-high', 'amount-low'

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await shopApi.getOrders({ limit: 100 });
                if (res.status === 'success') {
                    const data = res.data;
                    let ordersList = [];
                    if (Array.isArray(data)) {
                        ordersList = data.map(order => ({
                            ...order,
                            id: order.ID || order.id,
                            order_id: order.ID || order.order_id || order.id,
                            amount: order.total_amount || order.amount,
                            date: order.date || order.created_at,
                            items: order.items?.map(item => ({
                                ...item,
                                product_name: item.product_title || item.product_name,
                                image: item.cover_image || item.image,
                                price: item.amount || item.price
                            })) || []
                        }));
                    }
                    setOrders(ordersList);
                    setFilteredOrders(ordersList);
                }
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        let result = [...orders];

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(order =>
                (order.id && order.id.toString().toLowerCase().includes(lowerTerm)) ||
                (order.order_id && order.order_id.toString().toLowerCase().includes(lowerTerm)) ||
                (order.items && order.items.some(item => (item.product_name || item.title || '').toLowerCase().includes(lowerTerm)))
            );
        }

        // Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(order =>
                order.status && order.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const amountA = Number(a.amount) || 0;
            const amountB = Number(b.amount) || 0;

            switch (sortOrder) {
                case 'oldest': return dateA - dateB;
                case 'amount-high': return amountB - amountA;
                case 'amount-low': return amountA - amountB;
                case 'newest': default: return dateB - dateA;
            }
        });

        setFilteredOrders(result);
    }, [searchTerm, statusFilter, sortOrder, orders]);

    return (
        <div className="font-['Inter',sans-serif] text-[#0f1115] max-w-6xl mx-auto pb-20 px-4 lg:pt-10">
            {/* Page Header */}
            <div className="py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-black text-[#0f1115] tracking-tight mb-3">Your Orders</h1>
                        <p className="text-gray-500 text-lg">Track your packages and view purchase history.</p>
                    </div>
                    <button
                        onClick={() => navigate('/shop/products')}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-black/10 hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <FiShoppingBag />
                        Start Shopping
                    </button>
                </motion.div>
            </div>

            {/* Stats Overview */}
            {!loading && orders.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <OrderStats orders={orders} />
                </motion.div>
            )}

            {/* Filters & Controls */}
            <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-gray-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl overflow-x-auto scrollbar-hide">
                        {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border-none rounded-xl font-bold text-sm text-gray-700 focus:ring-2 focus:ring-black/5 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="amount-high">Amount: High to Low</option>
                        <option value="amount-low">Amount: Low to High</option>
                    </select>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading your orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
                >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <FiPackage className="text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        {searchTerm || statusFilter !== 'all'
                            ? "We couldn't find any orders matching your filters. Try adjusting your search criteria."
                            : "You haven't placed any orders yet. Start shopping to fill this page!"}
                    </p>
                    {searchTerm || statusFilter !== 'all' ? (
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                            className="text-black font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/shop/products')}
                            className="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-black/10 hover:shadow-xl transition-all"
                        >
                            Browse Products
                        </button>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 gap-4"
                >
                    <AnimatePresence>
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id || order.order_id}
                                order={order}
                                onClick={() => navigate(`/shop/orders/${order.id || order.order_id}`)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default ShopOrders;
