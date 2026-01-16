import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../services/api';
import { formatPrice } from '../shop.config';
import { useUser } from '../../contexts/UserContext';
import { motion } from 'framer-motion';
import {
    FiShoppingBag,
    FiPackage,
    FiCreditCard,
    FiClock,
    FiArrowRight,
    FiMapPin,
    FiTrendingUp,
    FiActivity,
    FiUser,
    FiCheckCircle,
    FiAlertTriangle
} from 'react-icons/fi';

// --- Components ---

const DashboardStatCard = ({ title, value, subtext, icon: Icon, colorClass, delay }) => {
    // Extract color theme from class name convention (e.g., text-blue-600)
    const colorTheme = colorClass.split('-')[1]; // blue, green, etc.

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            {/* Background Decoration */}
            <div className={`absolute -right-4 -top-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}>
                <Icon className={`text-8xl text-${colorTheme}-500`} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-${colorTheme}-50 text-${colorTheme}-600 group-hover:scale-110 transition-transform`}>
                        <Icon className="text-xl" />
                    </div>
                    {/* Optional sparkline or indicator could go here */}
                </div>

                <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{value}</h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</p>
                </div>

                {subtext && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                        <span className={`text-xs font-bold text-${colorTheme}-600 bg-${colorTheme}-50 px-2 py-1 rounded-lg`}>
                            {subtext}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const ActivityChart = ({ orders }) => {
    const chartData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayOrders = orders.filter(o => (o.created_at || o.date)?.startsWith(date));
            const total = dayOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
            return { date, total, count: dayOrders.length };
        });
    }, [orders]);

    const maxVal = Math.max(...chartData.map(d => d.total), 100);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                        <FiActivity className="text-blue-500" />
                        Spending Activity
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Your purchase history over the last 7 days</p>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-3 min-h-[160px]">
                {chartData.map((d, i) => (
                    <div key={d.date} className="flex flex-col items-center gap-3 flex-1 group relative h-full justify-end">
                        <div
                            className="w-full bg-blue-500 rounded-t-xl relative transition-all duration-500 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-200"
                            style={{
                                height: `${(d.total / maxVal) * 80}%`,
                                minHeight: '8px',
                                opacity: d.total > 0 ? 1 : 0.3
                            }}
                        >
                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-20 shadow-xl translate-y-2 group-hover:translate-y-0">
                                {formatPrice(d.total)}
                                <div className="text-[10px] text-gray-400 font-normal">{d.count} orders</div>
                                <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardOrderCard = ({ order }) => (
    <Link to={`/shop/orders/${order.id || order.order_id}`} className="block group">
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex items-center gap-3 sm:gap-4 overflow-hidden relative">
            {/* Icon/Image */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                {order.items && order.items.length > 0 && (order.items[0].image || order.items[0].product_image) ? (
                    <img
                        src={shopApi.getImageUrl(order.items[0].image || order.items[0].product_image)}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <FiPackage className="text-xl sm:text-2xl text-gray-300" />
                )}
                {order.items && order.items.length > 1 && (
                    <div className="absolute bottom-0 right-0 bg-black text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                        +{order.items.length - 1}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-sm font-black text-gray-900 truncate">#{order.order_id || order.id}</span>
                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border whitespace-nowrap ${['delivered', 'completed'].includes(order.status?.toLowerCase()) ? 'bg-green-50 text-green-600 border-green-100' :
                        ['cancelled', 'failed'].includes(order.status?.toLowerCase()) ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {order.status}
                    </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="flex items-center gap-1 flex-shrink-0">
                        <FiClock className="text-gray-300" />
                        {new Date(order.date || order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
                    <span className="text-gray-900 font-bold flex-shrink-0">{formatPrice(order.amount)}</span>
                    {Number(order.has_active_disputes) === 1 && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                                <FiAlertTriangle className="text-xs" />
                                Dispute active
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Arrow */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all flex-shrink-0">
                <FiArrowRight className="text-sm sm:text-base" />
            </div>
        </div>
    </Link>
);

const ShopDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSpent: 0,
        activeOrders: 0,
        totalOrders: 0,
        cartCount: 0
    });
    const [error, setError] = useState(null);
    const [unresolvedDisputes, setUnresolvedDisputes] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [ordersRes, productsRes, cartRes, statsRes] = await Promise.allSettled([
                    shopApi.getOrders({ limit: 50 }), // Keep limit 50 for ActivityChart
                    shopApi.getProducts({ limit: 4 }),
                    shopApi.getCart(),
                    shopApi.getOrderStats()
                ]);

                // Process Orders
                let ordersList = [];
                if (ordersRes.status === 'fulfilled' && ordersRes.value?.status === 'success') {
                    const data = ordersRes.value.data;
                    if (Array.isArray(data)) {
                        ordersList = data.map(order => ({
                            ...order,
                            id: order.ID || order.id,
                            order_id: order.ID || order.order_id || order.id, // Ensure order_id is available
                            amount: order.total_amount || order.amount,
                            date: order.date || order.created_at,
                            items: (order.items || []).map(item => {
                                let image = item.image || item.product_image;
                                try {
                                    if (typeof image === 'string' && (image.startsWith('[') || image.startsWith('{'))) {
                                        const parsed = JSON.parse(image);
                                        if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
                                    }
                                } catch (e) {
                                    // keep original if parse fails
                                }
                                return { ...item, image };
                            })
                        }));
                    }
                }

                // Process Stats
                let statsData = {
                    totalSpent: 0,
                    activeOrders: 0,
                    totalOrders: 0,
                    completedOrders: 0
                };

                if (statsRes.status === 'fulfilled' && statsRes.value?.status === 'success') {
                    const s = statsRes.value.data;
                    statsData = {
                        totalSpent: Number(s.total_spent) || 0,
                        activeOrders: Number(s.active_orders) || 0,
                        totalOrders: Number(s.no_of_orders) || 0,
                        completedOrders: Number(s.completed_order) || 0
                    };
                }

                // Process Products
                if (productsRes.status === 'fulfilled' && productsRes.value?.status === 'success') {
                    const pData = productsRes.value.data;
                    if (Array.isArray(pData)) {
                        setProducts(pData);
                    } else if (pData && Array.isArray(pData.products)) {
                        setProducts(pData.products);
                    } else {
                        setProducts([]);
                    }
                }

                // Process Cart
                let cartItemsCount = 0;
                if (cartRes.status === 'fulfilled' && cartRes.value?.status === 'success') {
                    const items = cartRes.value.data?.items || [];
                    cartItemsCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
                }

                setOrders(ordersList);
                setStats({
                    ...statsData,
                    cartCount: cartItemsCount
                });

                const unresolvedRes = await shopApi.getUnresolvedDisputes();
                if (unresolvedRes.status === 'success' && Array.isArray(unresolvedRes.data)) {
                    setUnresolvedDisputes(unresolvedRes.data);
                } else {
                    setUnresolvedDisputes([]);
                }

            } catch (err) {
                console.error("Dashboard data fetch failed:", err);
                setError("Failed to load dashboard data. Please try refreshing.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-4 animate-pulse">
                <div className="h-24 bg-gray-100 rounded-3xl w-full md:w-2/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-gray-100 rounded-2xl"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
                    <div className="lg:col-span-2 bg-gray-100 rounded-2xl"></div>
                    <div className="bg-gray-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <FiActivity className="text-4xl text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Oops! Something went wrong.</h3>
                <p className="text-gray-500 mb-8 max-w-md">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12 px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-12 lg:pt-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-200">
                            <FiUser />
                        </div>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Customer Dashboard
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#0f1115] tracking-tight">
                        Hello, {user?.name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p className="text-gray-500 text-lg mt-2 font-medium">
                        Welcome back to your shopping hub.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-wrap gap-3"
                >
                    <button
                        onClick={() => navigate('/shop/cart')}
                        className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <FiShoppingBag />
                        Cart ({stats.cartCount})
                    </button>
                    <button
                        onClick={() => navigate('/shop/products')}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        Start Shopping <FiArrowRight />
                    </button>
                </motion.div>
            </div>

            {unresolvedDisputes.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                    <div className="mt-1 text-red-500">
                        <FiAlertTriangle />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-red-700 mb-1">
                            You have unresolved order disputes
                        </h3>
                        <p className="text-xs text-red-600 mb-2">
                            Please review the latest messages from support and respond to keep your orders moving smoothly.
                        </p>
                        <ul className="text-xs text-red-700 space-y-1">
                            {unresolvedDisputes.slice(0, 3).map((d) => (
                                <li key={d.orderID} className="flex justify-between gap-2">
                                    <span className="font-semibold truncate">
                                        Order {d.orderID}
                                    </span>
                                    {d.last_message && (
                                        <span className="truncate text-[11px] text-red-600 max-w-[220px]">
                                            “{d.last_message}”
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3">
                            <Link
                                to="/shop/orders/dispute"
                                className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-800"
                            >
                                View dispute orders
                                <FiArrowRight className="text-[13px]" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard
                    title="Total Spent"
                    value={formatPrice(stats.totalSpent)}
                    subtext="Lifetime value"
                    icon={FiCreditCard}
                    colorClass="text-green-600"
                    delay={0.1}
                />
                <DashboardStatCard
                    title="Active Orders"
                    value={stats.activeOrders}
                    subtext="In progress"
                    icon={FiClock}
                    colorClass="text-blue-600"
                    delay={0.2}
                />
                <DashboardStatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    subtext="Delivered & more"
                    icon={FiPackage}
                    colorClass="text-purple-600"
                    delay={0.3}
                />
                <DashboardStatCard
                    title="Avg. Order"
                    value={stats.totalOrders > 0 ? formatPrice(stats.totalSpent / stats.totalOrders) : formatPrice(0)}
                    subtext="Per purchase"
                    icon={FiTrendingUp}
                    colorClass="text-orange-500"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#0f1115] tracking-tight">Recent Orders</h2>
                        <Link to="/shop/orders" className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1 transition-colors group">
                            View All History <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        {orders.length === 0 ? (
                            <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <FiPackage className="text-2xl text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
                                <p className="text-gray-500 mb-6 text-sm">Looks like you haven't made any purchases yet.</p>
                                <button
                                    onClick={() => navigate('/shop/products')}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            orders.slice(0, 5).map((order) => (
                                <DashboardOrderCard key={order.id || order.order_id} order={order} />
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Right Column: Activity & Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col gap-6"
                >
                    {/* Activity Chart */}
                    <ActivityChart orders={orders} />

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden min-h-[370px]">
                        <div className="absolute top-0 right-0 p-6 opacity-8">
                            <FiMapPin className="text-8xl text-black" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1 relative z-10">Quick Actions</h3>
                        <p className="text-gray-500 text-sm mb-6 relative z-10">Manage your account settings</p>

                        <div className="space-y-4 relative z-10">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex items-center justify-between p-5 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-all group"
                            >
                                <span className="flex items-center gap-4 font-bold text-sm text-blue-700 uppercase tracking-tight">
                                    <FiActivity className="text-blue-500 text-lg" />
                                    Back to Main Logs
                                </span>
                                <FiArrowRight className="text-blue-400 group-hover:text-blue-700 transition-colors" />
                            </button>
                            <button
                                onClick={() => navigate('/shop/addresses')}
                                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all group"
                            >
                                <span className="flex items-center gap-4 font-bold text-sm text-gray-700 uppercase tracking-tight">
                                    <FiMapPin className="text-blue-500 text-lg" />
                                    Manage Addresses
                                </span>
                                <FiArrowRight className="text-gray-400 group-hover:text-black transition-colors" />
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all group"
                            >
                                <span className="flex items-center gap-4 font-bold text-sm text-gray-700 uppercase tracking-tight">
                                    <FiUser className="text-purple-500 text-lg" />
                                    Profile Settings
                                </span>
                                <FiArrowRight className="text-gray-400 group-hover:text-black transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Trending / Recommendation */}
                    {/* {products.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiTrendingUp className="text-orange-500" />
                                Trending Now
                            </h3>
                            <Link to={`/shop/product/${products[0].id}`} className="group block">
                                <div className="relative rounded-xl overflow-hidden aspect-video mb-4">
                                    <img
                                        src={shopApi.getImageUrl(products[0].cover_image)}
                                        alt={products[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100"></div>
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <p className="font-black text-sm truncate [text-shadow:_0_2px_10px_rgba(0,0,0,1)]">{products[0].title}</p>
                                        <p className="text-xs font-bold opacity-95 [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
                                            {formatPrice(products[0].price)}
                                            <span className="ml-2 text-[10px] text-green-400 font-black">Free Shipping</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )} */}
                </motion.div>
            </div>
        </div>
    );
};

export default ShopDashboard;
