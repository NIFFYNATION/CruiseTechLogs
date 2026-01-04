import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShopData } from '../../shop/hooks/useShopData';

const RibbonAnimation = () => {
    const ribbons = Array.from({ length: 15 });
    return (
        <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden z-[60]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 3 }}
        >
            {ribbons.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: -20,
                        x: Math.random() * 400 - 200,
                        rotate: 0,
                        opacity: 1
                    }}
                    animate={{
                        y: 800,
                        x: Math.random() * 600 - 300,
                        rotate: 360 * 2,
                        opacity: 0
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        delay: Math.random() * 2,
                        ease: "linear"
                    }}
                    className="absolute top-0 left-1/2 w-3 h-3"
                    style={{
                        backgroundColor: ['#ff6a00', '#ff4081', '#4caf50', '#2196f3', '#ffeb3b'][i % 5],
                        borderRadius: i % 3 === 0 ? '50%' : '2px',
                    }}
                />
            ))}
        </motion.div>
    );
};

const AnimatingGradientBorder = () => {
    return (
        <motion.div
            className="absolute top-0 left-0 right-0 h-[6px] z-[70] rounded-t-[1.5rem]"
            animate={{
                background: [
                    'linear-gradient(to right, #ff6a00, #4caf50, #ff6a00)',
                    'linear-gradient(to right, #2196f3, #ff6a00, #4caf50)',
                    'linear-gradient(to right, #ff6a00, #4caf50, #ff4081)',
                ]
            }}
            transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    );
};

const StaticGradientBorder = () => {
    return (
        <div
            className="absolute top-0 left-0 right-0 h-[6px] z-[70] rounded-t-[1.5rem]"
            style={{
                background: 'linear-gradient(to right, #ff6a00, #4caf50, #2196f3)'
            }}
        />
    );
};

const ShopAnnouncementModal = ({ isOpen, onClose, userName }) => {
    const navigate = useNavigate();
    const { categories } = useShopData();

    const handleVisitShop = () => {
        onClose();
        navigate('/shop');
    };

    // Filter out "All Categories" and take top 4
    const displayCategories = categories
        .filter(cat => cat.id !== 'all')
        .slice(0, 4)
        .map(cat => {
            const name = cat.name.toLowerCase();
            let icon = 'local_mall'; // Default
            if (name.includes('electronic') || name.includes('gadget') || name.includes('tech')) icon = 'devices';
            else if (name.includes('fashion') || name.includes('clothing') || name.includes('wear')) icon = 'apparel';
            else if (name.includes('shoe') || name.includes('sneaker') || name.includes('footwear')) icon = 'steps';
            else if (name.includes('gaming') || name.includes('console')) icon = 'sports_esports';
            else if (name.includes('watch') || name.includes('accessory')) icon = 'watch';
            else if (name.includes('health') || name.includes('beauty')) icon = 'spa';
            else if (name.includes('home') || name.includes('living')) icon = 'home_mini';

            return { name: cat.name, icon, image: cat.image, id: cat.id };
        });

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0f1115]/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white/90 rounded-[1.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
                    >
                        <StaticGradientBorder />
                        <RibbonAnimation />

                        {/* Header / Banner */}
                        <div className="bg-gradient-to-br from-[#ff6a00] to-[#ff4081] p-6 text-white relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-8xl">shopping_basket</span>
                            </div>

                            <div className="relative z-10">
                                <div className="size-12 bg-[#ff6a00]/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                                    <span className="material-symbols-outlined text-2xl text-white">campaign</span>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight mb-1 text-black">
                                    Introducing <span className="text-[#ff6a00]">Cruise Gifts!</span>
                                </h2>
                                <p className="text-black/70 text-sm font-medium">
                                    Hey {userName || 'there'}, our new premium shop is live.
                                </p>
                            </div>
                        </div>



                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="size-9 rounded-full bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-600">
                                        <span className="material-symbols-outlined text-[20px]">card_giftcard</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f1115] mb-0.5 text-xs uppercase tracking-wider">Send Gifts</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            Send premium gifts and products to your family and friends anywhere in the world, and Enjoy <span className="font-bold text-[#0f1115]">FREE shipping</span> on all products.
                                        </p>
                                    </div>
                                </div>



                                <div className="flex gap-4">
                                    <div className="size-9 rounded-full bg-red-50 flex-shrink-0 flex items-center justify-center text-red-600">
                                        <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f1115] mb-0.5 text-xs uppercase tracking-wider">Payment Clarification</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            Products must be paid for at checkout using available payment options. <span className="font-bold text-red-600">CruiseTechLogs balance cannot be used for shop purchases at this time.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">

                                {/* Top Categories Marquee */}
                                {displayCategories.length > 0 && (
                                    <div className="px-3">
                                        <div className="relative overflow-hidden w-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
                                            <motion.div
                                                className="flex gap-3 w-max"
                                                animate={{ x: [0, "-50%"] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                    duration: 40
                                                }}
                                            >
                                                {[...displayCategories, ...displayCategories].map((cat, idx) => (
                                                    <button
                                                        key={`${cat.id}-${idx}`}
                                                        onClick={() => {
                                                            onClose();
                                                            navigate(`/shop/products?category=${cat.id}`);
                                                        }}
                                                        className="group relative flex-shrink-0 px-1 py-1 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                                                        <div className="relative flex items-center gap-2 pl-1 pr-4 py-1">
                                                            <div className="size-6 rounded-full bg-gray-100 bg-cover bg-center ring-2 ring-white" style={{ backgroundImage: `url('${cat.image || ''}')` }}></div>
                                                            <span className="text-[11px] font-bold text-gray-700 group-hover:text-[#ff6a00] whitespace-nowrap">{cat.name}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={handleVisitShop}
                                    className="w-full bg-[#ff6a00] text-white py-4 rounded-xl font-black text-base hover:bg-[#ff4081] hover:shadow-xl hover:shadow-[#ff6a00]/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    Explore the Shop Now
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full text-gray-500 py-3 rounded-xl  text-sm hover:bg-gray-100 transition-all duration-300"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShopAnnouncementModal;
