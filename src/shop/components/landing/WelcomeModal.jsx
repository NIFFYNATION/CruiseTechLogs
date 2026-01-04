import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
            className="absolute top-0 left-0 right-0 h-[6px] z-[70] rounded-t-[1rem]"
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
            className="absolute top-0 left-0 right-0 h-[6px] z-[70] rounded-t-[1rem]"
            style={{
                background: 'linear-gradient(to right, #ff6a00, #4caf50, #2196f3)'
            }}
        />
    );
};

const WelcomeModal = ({ isOpen, onClose, userName }) => {
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
                        className="relative w-full max-w-lg bg-white/70 rounded-[1rem] shadow-2xl overflow-hidden border border-white/20 max-h-[90vh] overflow-y-auto scrollbar-hide"
                    >
                        <StaticGradientBorder />
                        <RibbonAnimation />

                        {/* Header / Banner */}
                        <div className="bg-gradient-to-br from-[#ff6a00] to-[#ff4081] p-6 text-white relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-8xl">celebration</span>
                            </div>

                            <div className="relative z-10">
                                <div className="size-12 bg-orange-500/80 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                                    <span className="material-symbols-outlined text-2xl text-white">waving_hand</span>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight mb-2 text-[#0f1115]">
                                    Welcome to Cruise Gifts{userName ? `, ${userName}` : ''}!
                                </h2>
                                <div className="flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full w-fit border border-white/10">
                                    <span className="material-symbols-outlined text-[16px] text-white">local_shipping</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Free Shipping on All Products</span>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex gap-4">
                                    <div className="size-9 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                                        <span className="material-symbols-outlined text-[20px]">info</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f1115] mb-0.5 text-xs uppercase tracking-wider">About Cruise Gifts</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            This is a sub-part of the <span className="font-bold text-[#0f1115]">CruiseTech</span> platform. We offer a carefully selected collection of premium gifts/products you can send to your family and friends anywhere in the world.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="size-9 rounded-full bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-600">
                                        <span className="material-symbols-outlined text-[20px]">payments</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f1115] mb-0.5 text-xs uppercase tracking-wider">Payment Policy</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            Please note that we have an independent payment system. <span className="font-bold text-red-500 underline decoration-red-200 decoration-2 underline-offset-2">You cannot use your <span className="italic">CruiseTechLogs</span> balance for purchases here.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="size-9 rounded-full bg-green-50 flex-shrink-0 flex items-center justify-center text-green-600">
                                        <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0f1115] mb-0.5 text-xs uppercase tracking-wider">How to Pay</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            Simply select your preferred payment method at the checkout stage. Our secure checkout supports various options for a smooth experience.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <button
                                onClick={onClose}
                                className="w-full bg-[#0f1115] text-white py-4 rounded-xl font-black text-base hover:bg-[#ff6a00] hover:shadow-xl hover:shadow-[#ff6a00]/20 transition-all duration-300 active:scale-[0.98]"
                            >
                                Let's Start Shopping
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeModal;
