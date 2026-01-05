import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import ReviewOrderModal from '../components/ReviewOrderModal';
import WelcomeModal from '../components/landing/WelcomeModal';
import { useShopData } from '../hooks/useShopData';
import { useOrderModal } from '../hooks/useOrderModal';
import { isUserLoggedIn, getUserData } from '../../controllers/userController';
import { shopApi } from '../services/api';
import { formatPrice, cleanDescription } from '../shop.config';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const FeaturedSection = ({ section, orderModal }) => {
  const { fetchSectionDetail, tags } = useShopData();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      console.log('🔍 Loading section:', section.ID, section.title);
      try {
        const data = await fetchSectionDetail(section.ID);
        console.log('📦 Section data received:', JSON.stringify(data, null, 2));

        if (!data) {
          console.error('❌ Section data is null or undefined');
          setLoading(false);
          return;
        }

        // Check if products exist in the data
        const productsArray = data.products || [];
        console.log('✅ Products array:', productsArray.length, 'products');

        if (productsArray.length === 0) {
          console.warn('⚠️ No products in section data');
          setLoading(false);
          return;
        }

        // Map products same as useShopData logic
        const formatted = productsArray.map(p => {
          let pTagIds = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' && p.tags ? (p.tags.includes('[') ? JSON.parse(p.tags) : p.tags.split(',')) : []);
          const pMappedTags = pTagIds.map(tid => {
            const t = tags.find(tag => String(tag.ID) === String(tid));
            return (t && t.name) ? { id: String(t.ID), name: t.name } : null;
          }).filter(Boolean);

          return {
            id: p.ID,
            title: p.title,
            description: cleanDescription(p.description),
            price: Number(p.amount),
            oldPrice: null,
            category: p.category_id,
            image: shopApi.getImageUrl(p.cover_image),
            delivery_range: p.delivery_range,
            tags: pMappedTags,
            badge: pMappedTags.some(t => t.name === 'Featured') ? 'Featured' : pMappedTags.some(t => t.name === 'New') ? 'New' : pMappedTags.some(t => t.name === 'Sale') ? 'Sale' : null
          };
        });
        console.log('🎨 Formatted products:', formatted.length, formatted);
        setProducts(formatted);
      } catch (error) {
        console.error('💥 Error loading section:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [section.ID, fetchSectionDetail, tags]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-gray-100 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-2xl">
            <span className="text-[#ff6a00] font-bold uppercase tracking-widest text-xs mb-2 block">Featured</span>
            <h2 className="text-3xl font-bold text-[#0f1115] sm:text-4xl tracking-tight">{section.title}</h2>
            {section.short_description && <p className="text-gray-500 mt-2">{section.short_description}</p>}
          </div>
          <Link className="group text-[#0f1115] font-semibold hover:text-[#ff6a00] inline-flex items-center gap-2 text-sm transition-colors" to={`/shop/products?section=${section.ID}`}>
            View All <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
        >
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-gray-50 rounded-3xl animate-pulse" />
            ))
          ) : (
            products.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                variants={fadeInUp}
                onAddToCart={() => orderModal.openModal(product)}
              />
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

const ShopLandingPage = () => {
  const { products, categories, sections, loading, fetchProducts } = useShopData();
  const orderModal = useOrderModal();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = React.useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenShopWelcome');
    if (!hasSeenWelcome) {
      if (isUserLoggedIn()) {
        const user = getUserData();
        setUserName(user?.first_name || user?.name || '');
      }
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('hasSeenShopWelcome', 'true');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/shop/products?search=${encodeURIComponent(heroSearch)}`);
    }
  };

  React.useEffect(() => {
    fetchProducts({ limit: 50, sort: 'newest' }); // Fetch enough products to find recent categories/tags
  }, [fetchProducts]);

  return (
    <div className="min-h-screen w-full flex flex-col font-['Inter',sans-serif] text-[#0f1115] antialiased selection:bg-[#ff6a00] selection:text-white overflow-x-hidden bg-white">
      {/* Hero Section - Creative Gradient Redesign */}
      <section className="relative pt-6 pb-8 lg:pt-28 lg:pb-20 overflow-hidden bg-[#f8f5f2]">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1000&auto=format&fit=crop')] opacity-[0.12] blur-[1px] bg-cover bg-center mix-blend-multiply"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] lg:w-[40%] lg:h-[40%] rounded-full bg-gradient-to-r from-orange-200/40 to-rose-200/40 blur-[80px] lg:blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] lg:w-[50%] lg:h-[50%] rounded-full bg-gradient-to-l from-blue-100/40 to-purple-100/40 blur-[90px] lg:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] lg:w-[25%] lg:h-[25%] rounded-full bg-yellow-100/30 blur-[60px] lg:blur-[80px]"></div>

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-70"></div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center mt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200/50 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-xs font-bold text-orange-700 tracking-wide uppercase">#1 Message & Gift Delivery</span>
              </motion.div>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50/80 backdrop-blur-sm border border-green-200/50 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-green-600">local_shipping</span>
                <span className="text-xs font-bold text-green-700 tracking-wide uppercase">Free Shipping on All Products</span>
              </motion.div>
            </div>

            <motion.h1 variants={fadeInUp} className="text-4xl font-black tracking-tighter text-[#1a1a1a] sm:text-6xl lg:text-7xl mb-6 leading-[1.05] lg:leading-[0.95]">
              Send
              <span className="text-[#ff6a00]">
                Gifts
              </span>
              Worldwide.
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-600 font-medium mb-10 lg:mb-12 max-w-xlg mx-auto leading-relaxed">
              The easiest way to send gifts to your family and friends anywhere in the world.
            </motion.p>

            <motion.div variants={fadeInUp} className="w-full max-w-2xl relative z-20">
              <form onSubmit={handleSearch} className="relative group transform transition-transform hover:scale-[1.01] duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-2xl opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
                <div className="relative flex flex-row items-center bg-white rounded-2xl shadow-xl shadow-orange-900/5 border border-white/50 backdrop-blur-xl p-1 sm:p-2">
                  <div className="hidden sm:flex pl-4 items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-2xl group-focus-within:text-[#ff6a00] transition-colors">search</span>
                  </div>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search..."
                    className="block w-full px-4 py-3 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:ring-0 text-base sm:text-lg font-medium text-left"
                  />
                  <div className="w-auto">
                    <button
                      type="submit"
                      className="bg-[#0f1115] text-white size-10 sm:w-auto sm:h-auto sm:px-8 sm:py-3 rounded-xl font-bold text-sm hover:bg-[#ff6a00] transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 flex items-center justify-center"
                    >
                      <span className="hidden sm:inline">Search</span>
                      <span className="material-symbols-outlined sm:hidden text-[20px]">search</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Categories Pills */}
              {/* Advanced Marquee Categories */}
              {/* Advanced Marquee Categories (Mobile Only) */}
              <div className="mt-8 lg:hidden w-full overflow-hidden mask-linear-fade relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#f8f5f2] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#f8f5f2] to-transparent z-10"></div>
                <motion.div
                  className="flex gap-4 w-max"
                  animate={{ x: [0, "-50%"] }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 80
                  }}
                >
                  {[...categories, ...categories].map((cat, idx) => (
                    <button
                      key={`${cat.id}-${idx}`}
                      onClick={() => navigate(`/shop/products?category=${cat.id}`)}
                      className="group relative flex-shrink-0 px-1 py-1 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                      <div className="relative flex items-center gap-2 pl-1 pr-4 py-1">
                        <div className="size-6 rounded-full bg-gray-100 bg-cover bg-center ring-2 ring-white" style={{ backgroundImage: `url('${cat.image || ''}')` }}></div>
                        <span className="text-xs font-bold text-gray-700 group-hover:text-[#ff6a00] whitespace-nowrap">{cat.name}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* Quick Categories Pills (Desktop Only) */}
              <div className="hidden lg:flex mt-10 flex-wrap justify-center gap-3">
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/shop/products?category=${cat.id}`)}
                    className="group relative px-1 py-1 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-2 pl-1 pr-4 py-1">
                      <div className="size-8 rounded-full bg-gray-100 bg-cover bg-center ring-2 ring-white" style={{ backgroundImage: `url('${cat.image || ''}')` }}></div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-[#ff6a00]">{cat.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>




      {/* Featured Section 1 (if exists) */}
      {sections.length > 0 && (
        <FeaturedSection
          section={sections[0]}
          orderModal={orderModal}
        />
      )}

      {/* Categories Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-100 pb-8"
          >
            <div className="max-w-2xl">
              <span className="text-[#ff6a00] font-bold uppercase tracking-widest text-xs mb-2 block">Collections</span>
              <h2 className="text-3xl font-bold text-[#0f1115] sm:text-4xl tracking-tight">Shop by Category</h2>
            </div>
            <Link className="group text-[#0f1115] font-semibold hover:text-[#ff6a00] inline-flex items-center gap-2 text-sm transition-colors" to="/shop/categories">
              View All Categories <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 scrollbar-hide"
          >
            {categories.length > 1 ? (
              categories.slice(1, 6).map((category) => (
                <CategoryCard
                  key={category.id}
                  image={category.image || 'https://via.placeholder.com/300'}
                  title={category.name}
                  subtitle="Explore Collection"
                  link={`/shop/products?category=${category.id}`}
                  variants={scaleIn}
                  className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-auto snap-center"
                />
              ))
            ) : (
              // Fallback/Loading state for categories
              [1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-auto aspect-[4/5] bg-gray-100 rounded-[2rem] animate-pulse snap-center"></div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Category-Based Product Sections */}
      {categories.slice(1, 4).map((category) => {
        const categoryProducts = products.filter(p => p.category === category.id).slice(0, 4);

        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} className="py-24 bg-white border-t border-gray-100 relative z-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
              >
                <div className="max-w-2xl">
                  <span className="text-[#ff6a00] font-bold uppercase tracking-widest text-xs mb-2 block">Category</span>
                  <h2 className="text-3xl font-bold text-[#0f1115] sm:text-4xl tracking-tight">{category.name}</h2>
                </div>
                <Link
                  className="group text-[#0f1115] font-semibold hover:text-[#ff6a00] inline-flex items-center gap-2 text-sm transition-colors"
                  to={`/shop/products?category=${category.id}`}
                >
                  View All <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
              >
                {categoryProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    variants={fadeInUp}
                    onAddToCart={() => orderModal.openModal(product)}
                  />
                ))}
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* Remaining Dynamic Featured Sections */}
      {sections.slice(1).map((section) => (
        <FeaturedSection
          key={section.ID}
          section={section}
          orderModal={orderModal}
        />
      ))}


      {/* Popular Gifts Section */}
      <section className="py-5 lg:py-24 bg-[#f7f5f2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 lg:mb-12 gap-4 lg:gap-8"
          >
            <div className="max-w-2xl">
              <span className="text-[#ff6a00] font-bold uppercase tracking-widest text-xs mb-2 block">New</span>
              <h2 className="text-3xl font-bold text-[#0f1115] sm:text-4xl tracking-tight mb-2">Recently Added</h2>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8"
          >
            {loading ? (
              // Loading skeletons
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="h-64 bg-gray-100 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3"></div>
                      <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  variants={fadeInUp}
                  onAddToCart={() => orderModal.openModal(product)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products found.
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Link className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gray-200 bg-white text-[#0f1115] font-semibold hover:border-[#ff6a00] hover:text-[#ff6a00] transition-all duration-300 shadow-sm" to="/shop/products">
              View All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.25]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-20 max-w-2xl mx-auto"
          >
            <span className="inline-block py-1.5 px-3 rounded-full bg-[#ff6a00]/5 border border-[#ff6a00]/10 text-[#ff6a00] font-bold text-[10px] uppercase tracking-widest mb-4">Simple Process</span>
            <h2 className="text-4xl font-bold text-[#0f1115] sm:text-5xl mb-6 tracking-tight">How It Works</h2>
            <p className="text-lg text-[#6b7280] font-normal">Sending love shouldn't be complicated. We've simplified the gifting process into four easy steps.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="relative grid grid-cols-1 md:grid-cols-4 gap-12 text-center"
          >
            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="relative flex flex-col items-center group">
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-[1px] bg-gradient-to-r from-[#ff6a00] to-gray-200 bg-[length:12px_100%] opacity-30"></div>
              <div className="relative z-10 flex size-20 items-center justify-center rounded-2xl bg-white text-[#ff6a00] shadow-lg shadow-gray-200/50 mb-6 group-hover:-translate-y-2 transition-transform duration-300 border border-gray-50 ring-1 ring-gray-100">
                <span className="material-symbols-outlined text-3xl">search</span>
                <div className="absolute -top-3 -right-3 size-7 rounded-full bg-[#0f1115] text-white text-xs font-bold flex items-center justify-center shadow-md border-4 border-white">1</div>
              </div>
              <h3 className="text-lg font-bold text-[#0f1115] mb-2">Select Gift</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">Browse our curated collection and pick the perfect item.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="relative flex flex-col items-center group">
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-[1px] bg-gradient-to-r from-[#ff6a00] to-gray-200 bg-[length:12px_100%] opacity-30"></div>
              <div className="relative z-10 flex size-20 items-center justify-center rounded-2xl bg-white text-[#ff6a00] shadow-lg shadow-gray-200/50 mb-6 group-hover:-translate-y-2 transition-transform duration-300 border border-gray-50 ring-1 ring-gray-100">
                <span className="material-symbols-outlined text-3xl">edit_note</span>
                <div className="absolute -top-3 -right-3 size-7 rounded-full bg-[#0f1115] text-white text-xs font-bold flex items-center justify-center shadow-md border-4 border-white">2</div>
              </div>
              <h3 className="text-lg font-bold text-[#0f1115] mb-2">Personalize</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">Add a warm message or record a video greeting card.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="relative flex flex-col items-center group">
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-[1px] bg-gradient-to-r from-[#ff6a00] to-gray-200 bg-[length:12px_100%] opacity-30"></div>
              <div className="relative z-10 flex size-20 items-center justify-center rounded-2xl bg-white text-[#ff6a00] shadow-lg shadow-gray-200/50 mb-6 group-hover:-translate-y-2 transition-transform duration-300 border border-gray-50 ring-1 ring-gray-100">
                <span className="material-symbols-outlined text-3xl">credit_card</span>
                <div className="absolute -top-3 -right-3 size-7 rounded-full bg-[#0f1115] text-white text-xs font-bold flex items-center justify-center shadow-md border-4 border-white">3</div>
              </div>
              <h3 className="text-lg font-bold text-[#0f1115] mb-2">Secure Payment</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">Checkout securely with your preferred payment method.</p>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={fadeInUp} className="relative flex flex-col items-center group">
              <div className="relative z-10 flex size-20 items-center justify-center rounded-2xl bg-white text-[#ff6a00] shadow-lg shadow-gray-200/50 mb-6 group-hover:-translate-y-2 transition-transform duration-300 border border-gray-50 ring-1 ring-gray-100">
                <span className="material-symbols-outlined text-3xl">sentiment_satisfied</span>
                <div className="absolute -top-3 -right-3 size-7 rounded-full bg-[#0f1115] text-white text-xs font-bold flex items-center justify-center shadow-md border-4 border-white">4</div>
              </div>
              <h3 className="text-lg font-bold text-[#0f1115] mb-2">We Deliver</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">We ship it instantly and notify you upon safe arrival.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff6a00]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <motion.div
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-1/3 sticky top-24"
            >
              <span className="text-[#ff6a00] font-bold uppercase tracking-widest text-xs mb-3 block">Our Promise</span>
              <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6 tracking-tight">Why Choose Us</h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Experience the best in gifting convenience. We prioritize quality and reliability in every package we send out.
              </p>
              <Link className="inline-flex items-center text-white font-bold border-b border-white/50 pb-0.5 hover:text-[#ff6a00] hover:border-[#ff6a00] transition-colors" to="#">
                Learn more about our mission <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div variants={scaleIn} className="group relative rounded-3xl bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 border border-white/10">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-[#ff6a00] text-white shadow-lg shadow-[#ff6a00]/20">
                  <span className="material-symbols-outlined text-2xl">diamond</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Premium Quality</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  We partner with top-tier brands to curate gifts that look and feel luxurious. Every item is hand-picked.
                </p>
              </motion.div>
              <motion.div variants={scaleIn} className="group relative rounded-3xl bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 border border-white/10">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-[#ff6a00] text-white shadow-lg shadow-[#ff6a00]/20">
                  <span className="material-symbols-outlined text-2xl">bolt</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Instant Delivery</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Need it now? Our global network ensures digital gifts arrive instantly and physical goods are dispatched same-day.
                </p>
              </motion.div>
              <motion.div variants={scaleIn} className="group relative rounded-3xl bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 border border-white/10">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-[#ff6a00] text-white shadow-lg shadow-[#ff6a00]/20">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">Secure Checkout</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Your data is safe with us. We use bank-level encryption to ensure every transaction is protected.
                </p>
              </motion.div>
              <motion.div variants={scaleIn} className="group relative rounded-3xl bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 border border-white/10">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-[#ff6a00] text-white shadow-lg shadow-[#ff6a00]/20">
                  <span className="material-symbols-outlined text-2xl">support_agent</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">24/7 Support</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Questions? Our dedicated support team is available around the clock to assist you with any inquiries.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section> */}

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
        handleBack={orderModal.handleBack}
        customFieldValues={orderModal.customFieldValues}
        setCustomFieldValues={orderModal.setCustomFieldValues}
        getCustomFields={orderModal.getCustomFields}
        handleProceedFromShipping={orderModal.handleProceedFromShipping}
      />

      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
        userName={userName}
      />
    </div>
  );
};

export default ShopLandingPage;
