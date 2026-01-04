
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShopData } from '../hooks/useShopData';
import { shopApi } from '../services/api';

const ShopCategories = () => {
    const { categories, loading, error } = useShopData();

    // Filter out 'all' category if present, as this is a specific categories page
    const displayCategories = categories.filter(cat => cat.id !== 'all');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col font-['Inter',sans-serif] text-[#0f1115] antialiased selection:bg-[#ff6a00] selection:text-white overflow-x-hidden bg-[#f7f5f2]">
            <div className="flex-grow pt-20 lg:pt-24 pb-20">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-16 pt-10">
                        <span className="text-[#ff6a00] font-bold uppercase tracking-widest text-xs mb-3 block">Explore</span>
                        <h1 className="text-4xl md:text-5xl font-black text-[#0f1115] mb-6 tracking-tight">
                            Shop by Category
                        </h1>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Browse out wide collection of categories. Find exactly what you are looking for.
                        </p>
                    </div>

                    {loading && displayCategories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-12 h-12 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Loading categories...</p>
                        </div>
                    ) : error && displayCategories.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
                            <h3 className="text-xl font-bold text-[#0f1115] mb-2">Failed to load categories</h3>
                            <p className="text-gray-500">{error}</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                        >
                            {displayCategories.map((category) => (
                                <motion.div key={category.id} variants={itemVariants}>
                                    <Link
                                        to={`/shop/products?category=${category.id}`}
                                        className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[200px] sm:h-[300px]"
                                    >
                                        <div className="absolute inset-0 bg-gray-200">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                    <span className="material-symbols-outlined text-4xl sm:text-6xl">category</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/60 to-transparent opacity-100 transition-opacity" />
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 [text-shadow:_0_2px_10px_rgba(0,0,0,1)]">{category.name}</h3>
                                            <div className="flex items-center gap-2 text-white/95 group-hover:text-[#ff6a00] transition-colors text-xs sm:text-sm font-bold [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
                                                <span>View Products</span>
                                                <span className="material-symbols-outlined text-[14px] sm:text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ShopCategories;
