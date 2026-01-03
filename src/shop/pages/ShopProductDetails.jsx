import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import ShopNavbar from '../components/ShopNavbar';
import ShopFooter from '../components/ShopFooter';
import ProductCard from '../components/ProductCard';
import ReviewOrderModal from '../components/ReviewOrderModal';
import { shopApi } from '../services/api';
import { formatPrice } from '../shop.config';
import { useOrderModal } from '../hooks/useOrderModal';

const ShopProductDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Gallery State
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const orderModal = useOrderModal();

    // Check for buy intent from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('buy') === 'true' && product) {
            orderModal.openModal(product, 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, product]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch product and tags in parallel to map tag IDs to names
                const [productResponse, tagsResponse] = await Promise.all([
                    shopApi.getProductDetail(id),
                    shopApi.getTags()
                ]);

                let availableTags = [];
                if (tagsResponse.status === 'success') {
                    availableTags = tagsResponse.data;
                }

                if (productResponse.status === 'success' && productResponse.data) {
                    let productData = null;

                    // Handle different response structures
                    if (productResponse.data.products && Array.isArray(productResponse.data.products) && productResponse.data.products.length > 0) {
                        productData = productResponse.data.products[0];
                    } else if (productResponse.data.ID) {
                        productData = productResponse.data;
                    }

                    if (productData) {
                        // Fetch related products
                        try {
                            const relatedResponse = await shopApi.getProducts({
                                category: productData.category_id,
                                limit: 4
                            });
                            if (relatedResponse.status === 'success' && relatedResponse.data && Array.isArray(relatedResponse.data.products)) {
                                // Filter out current product and limit to 4
                                const related = relatedResponse.data.products
                                    .filter(p => p.ID !== productData.ID)
                                    .slice(0, 4)
                                    .map(p => {
                                        // Map tags for related products
                                        let pTagIds = [];
                                        if (Array.isArray(p.tags)) {
                                            pTagIds = p.tags;
                                        } else if (typeof p.tags === 'string' && p.tags) {
                                            try {
                                                pTagIds = p.tags.includes('[') ? JSON.parse(p.tags) : p.tags.split(',');
                                            } catch {
                                                pTagIds = [p.tags];
                                            }
                                        }

                                        const pMappedTags = pTagIds.map(tid => {
                                            const t = availableTags.find(tag => tag.ID === tid);
                                            return t ? t.name : tid;
                                        });

                                        return {
                                            id: p.ID,
                                            title: p.title,
                                            description: p.description ? p.description.replace(/<[^>]*>/g, '') : '',
                                            price: Number(p.amount) || 0,
                                            oldPrice: null,
                                            image: shopApi.getImageUrl(p.cover_image),
                                            badge: pMappedTags.includes('Featured') ? 'Featured' : pMappedTags.includes('New') ? 'New' : pMappedTags.includes('Sale') ? 'Sale' : null,
                                        };
                                    });
                                setRelatedProducts(related);
                            }
                        } catch (err) {
                            console.error("Error fetching related products", err);
                        }

                        // Parse tags if needed
                        let tagIds = [];
                        if (Array.isArray(productData.tags)) {
                            tagIds = productData.tags;
                        } else if (typeof productData.tags === 'string' && productData.tags) {
                            try {
                                tagIds = productData.tags.includes('[') ? JSON.parse(productData.tags) : productData.tags.split(',');
                            } catch {
                                tagIds = [productData.tags];
                            }
                        }

                        // Map tag IDs to names
                        const mappedTags = tagIds.map(tid => {
                            const t = availableTags.find(tag => tag.ID === tid);
                            return t ? t.name : tid;
                        });

                        // Parse images
                        let images = [];
                        if (Array.isArray(productData.images)) {
                            images = productData.images;
                        } else if (typeof productData.images === 'string') {
                            try {
                                images = JSON.parse(productData.images);
                            } catch {
                                images = [productData.images];
                            }
                        } else if (productData.product_image) {
                            // Fallback if images array is empty but product_image exists
                            try {
                                images = typeof productData.product_image === 'string' ? JSON.parse(productData.product_image) : productData.product_image;
                            } catch {
                                images = [];
                            }
                        }

                        // Ensure cover image is first if not in images
                        const coverImage = productData.cover_image;
                        if (coverImage && !images.includes(coverImage)) {
                            images.unshift(coverImage);
                        }

                        // Format product for component
                        console.log('Product Data for formatting:', productData);
                        const formattedProduct = {
                            id: productData.ID,
                            title: productData.title,
                            description: productData.description ? productData.description.replace(/<[^>]*>/g, '') : '', // Strip HTML tags
                            price: Number(productData.amount) || 0,
                            oldPrice: null, // API doesn't seem to provide old price
                            category: productData.category_name || 'Uncategorized',
                            tags: mappedTags,
                            image: shopApi.getImageUrl(productData.cover_image),
                            images: images.map(img => shopApi.getImageUrl(img)),
                            badge: mappedTags.includes('Featured') ? 'Featured' : mappedTags.includes('New') ? 'New' : mappedTags.includes('Sale') ? 'Sale' : null,
                            custom_fields: productData.custom_fields,
                            features: productData.custom_fields ? [] : [], // Placeholder for now as custom_fields structure is unknown
                            specs: {} // Placeholder
                        };

                        setProduct(formattedProduct);
                    }
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Derived images
    const productImages = product ? (product.images.length > 0 ? product.images : [product.image]) : [];


    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.9
        })
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        let newIndex = activeImageIndex + newDirection;
        if (newIndex < 0) newIndex = productImages.length - 1;
        if (newIndex >= productImages.length) newIndex = 0;
        setActiveImageIndex(newIndex);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a00]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f2] text-[#0f1115]">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-red-500 mb-4">{error}</p>
                <Link to="/shop/products" className="text-[#ff6a00] hover:underline">Back to Products</Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f2] text-[#0f1115]">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <Link to="/shop/products" className="text-[#ff6a00] hover:underline">Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col font-['Inter',sans-serif] text-[#0f1115] antialiased selection:bg-[#ff6a00] selection:text-white overflow-x-hidden relative">

            {/* Dynamic Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src={productImages[activeImageIndex]}
                            className="w-full h-full object-cover blur-[120px] opacity-25 scale-150"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-white/60 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <ShopNavbar />

                <div className="flex-grow lg:pt-8 pt-5 pb-20 sm:pb-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        {/* Breadcrumbs */}
                        <nav className="flex items-center text-xs sm:text-sm text-gray-600 mb-6 font-medium">
                            <Link to="/shop" className="hover:text-[#ff6a00] transition-colors">Home</Link>
                            <span className="mx-2 opacity-50">/</span>
                            <Link to="/shop/products" className="hover:text-[#ff6a00] transition-colors">Products</Link>
                            <span className="mx-2 opacity-50">/</span>
                            <span className="text-[#0f1115] truncate max-w-[200px]">{product.title}</span>
                        </nav>

                        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 p-5 md:p-8 ring-1 ring-white/50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                                {/* Left: Creative Image Gallery */}
                                <div className="flex flex-col-reverse lg:flex-row gap-4 h-[400px] lg:h-[500px]">

                                    {/* Thumbnails */}
                                    <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 py-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {productImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setDirection(idx > activeImageIndex ? 1 : -1);
                                                    setActiveImageIndex(idx);
                                                }}
                                                className={`relative flex-shrink-0 w-20 h-20 lg:w-full lg:h-24 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${idx === activeImageIndex
                                                    ? 'ring-2 ring-[#ff6a00] ring-offset-2 ring-offset-white/80 scale-100 opacity-100'
                                                    : 'opacity-70 hover:opacity-100 hover:scale-105 bg-white'
                                                    }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`View ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Mock overlay for variety */}
                                                {idx > 0 && (
                                                    <div className={`absolute inset-0 bg-indigo-500 mix-blend-overlay ${idx === 1 ? 'opacity-10' : idx === 2 ? 'opacity-20' : 'opacity-30'
                                                        }`}></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Main Image Stage */}
                                    <motion.div
                                        className="flex-1 relative w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white/70 sm:bg-white shadow-2xl shadow-black/5 group border border-white"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                            <motion.img
                                                key={activeImageIndex}
                                                src={productImages[activeImageIndex]}
                                                custom={direction}
                                                variants={slideVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{
                                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                                    opacity: { duration: 0.2 }
                                                }}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            {/* Overlay mix-blend for consistency with thumbnails */}
                                            {activeImageIndex > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className={`absolute inset-0 bg-indigo-500 mix-blend-overlay pointer-events-none ${activeImageIndex === 1 ? 'opacity-10' : activeImageIndex === 2 ? 'opacity-20' : 'opacity-30'
                                                        }`}
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* Badge */}
                                        {product.badge && (
                                            <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md text-[#0f1115] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg border border-white/50">
                                                {product.badge}
                                            </div>
                                        )}

                                        {/* Navigation Arrows */}
                                        <button
                                            onClick={() => paginate(-1)}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-[#0f1115] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 border border-white/50"
                                        >
                                            <span className="material-symbols-outlined text-2xl">chevron_left</span>
                                        </button>
                                        <button
                                            onClick={() => paginate(1)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-[#0f1115] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 border border-white/50"
                                        >
                                            <span className="material-symbols-outlined text-2xl">chevron_right</span>
                                        </button>

                                        {/* Zoom Hint */}
                                        <div className="absolute bottom-6 right-6 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="bg-black/60 backdrop-blur-xl text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                                                Hover to zoom
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right: Product Info */}
                                <div className="flex flex-col">
                                    <div className="mb-2">
                                        <span className="text-[#ff6a00] font-bold uppercase tracking-widest text-xs">{product.category}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0f1115] tracking-tight mb-4 leading-[0.95]">{product.title}</h1>

                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-3xl font-bold text-[#0f1115]">{formatPrice(product.price)}</span>
                                        {product.oldPrice && (
                                            <span className="text-xl text-gray-400 line-through decoration-2">{formatPrice(product.oldPrice)}</span>
                                        )}
                                        {product.oldPrice && (
                                            <span className="bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                Save {formatPrice(product.oldPrice - product.price)}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-600 text-base leading-relaxed mb-8 font-light">
                                        {product.description}
                                    </p>

                                    <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-6">
                                        {/* Quantity */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-[#0f1115]">Quantity</span>
                                            <div className="flex items-center border border-gray-200 rounded-full">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-l-full transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                                </button>
                                                <span className="w-12 text-center font-bold">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-r-full transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total Amount Display */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-sm font-medium text-gray-500">Total Amount</span>
                                            <span className="text-xl font-black text-[#0f1115]">{formatPrice(product.price * quantity)}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 sm:gap-4 w-full">
                                            <button
                                                onClick={() => orderModal.openModal(product, quantity)}
                                                className="flex-1 h-12 sm:h-14 rounded-full bg-[#0f1115] text-white font-bold text-base sm:text-lg hover:bg-[#ff6a00] hover:shadow-lg hover:shadow-[#ff6a00]/20 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 active:scale-95"
                                            >
                                                Add to Cart now
                                                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">shopping_cart</span>
                                            </button>
                                            <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:text-red-500 transition-colors active:scale-95 bg-white">
                                                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">favorite</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                                            Free Shipping
                                        </div>
                                        {/* <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                2 Year Warranty
                             </div> */}
                                    </div>

                                </div>
                            </div>

                            {/* Tabs Section */}
                            <div className="mt-20">
                                <div className="flex items-center gap-8 border-b border-gray-100 mb-8 overflow-x-auto">
                                    {['description', 'specifications', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${activeTab === tab
                                                ? 'text-[#ff6a00]'
                                                : 'text-gray-400 hover:text-[#0f1115]'
                                                }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff6a00]"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="min-h-[200px]">
                                    {activeTab === 'description' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="prose prose-gray max-w-none"
                                        >
                                            <p className="text-gray-600 leading-relaxed mb-4">
                                                {product.description}
                                            </p>
                                            <h3 className="text-lg font-bold text-[#0f1115] mb-4">Key Features</h3>
                                            <ul className="grid sm:grid-cols-2 gap-4">
                                                {product.features?.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <span className="material-symbols-outlined text-[#ff6a00] text-[20px]">check_circle</span>
                                                        <span className="text-gray-600">{feature}</span>
                                                    </li>
                                                )) || <p>No specific features listed.</p>}
                                            </ul>
                                        </motion.div>
                                    )}

                                    {activeTab === 'specifications' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 max-w-2xl">
                                                {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b border-gray-50 pb-2">
                                                        <span className="text-gray-500 font-medium">{key}</span>
                                                        <span className="text-[#0f1115] font-bold">{value}</span>
                                                    </div>
                                                )) : (
                                                    <p>No specifications available.</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-10"
                                        >
                                            <span className="material-symbols-outlined text-4xl text-gray-200 mb-2">reviews</span>
                                            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Related Products Section */}
                            {relatedProducts.length > 0 && (
                                <div className="mt-16 lg:mt-24 border-t border-gray-100 pt-16">
                                    <div className="flex items-center justify-between mb-8 sm:mb-12">
                                        <h2 className="text-2xl sm:text-3xl font-black text-[#0f1115] tracking-tight">
                                            You Might Also Like
                                        </h2>
                                        <Link to="/shop/products" className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#ff6a00] hover:text-[#e55f00] transition-colors">
                                            View All
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                                        {relatedProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                {...product}
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    visible: { opacity: 1, y: 0 }
                                                }}
                                                onAddToCart={() => orderModal.openModal(product)}
                                            />
                                        ))}
                                    </div>

                                    <Link to="/shop/products" className="mt-10 flex sm:hidden items-center justify-center gap-2 text-sm font-bold text-[#ff6a00] hover:text-[#e55f00] transition-colors">
                                        View All Products
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <ShopFooter />

                    <ReviewOrderModal
                        open={orderModal.open}
                        onClose={orderModal.closeModal}
                        product={orderModal.product}
                        quantity={orderModal.quantity}
                        setQuantity={orderModal.setQuantity}
                        buyStep={orderModal.buyStep}
                        shippingAddresses={orderModal.shippingAddresses}
                        selectedAddressId={orderModal.selectedAddressId}
                        setSelectedAddressId={orderModal.setSelectedAddressId}
                        isAddingAddress={orderModal.isAddingAddress}
                        setIsAddingAddress={orderModal.setIsAddingAddress}
                        newAddress={orderModal.newAddress}
                        setNewAddress={orderModal.setNewAddress}
                        addressLoading={orderModal.addressLoading}
                        orderProcessing={orderModal.orderProcessing}
                        handleAddAddress={orderModal.handleAddAddress}
                        handleProceedToShipping={orderModal.handleProceedToShipping}
                        handleAddToCartAction={orderModal.handleAddToCartAction}
                        customFieldValues={orderModal.customFieldValues}
                        setCustomFieldValues={orderModal.setCustomFieldValues}
                        getCustomFields={orderModal.getCustomFields}
                        handleProceedFromShipping={orderModal.handleProceedFromShipping}
                    />
                </div>
            </div>
        </div>
    );
};

export default ShopProductDetails;
