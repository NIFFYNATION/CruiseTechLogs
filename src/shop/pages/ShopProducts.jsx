import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import ReviewOrderModal from '../components/ReviewOrderModal';
import LoginPromptModal from '../components/LoginPromptModal';
import { shopApi } from '../services/api';
import { shopConfig } from '../shop.config';
import { useShopData } from '../hooks/useShopData';
import { useOrderModal } from '../hooks/useOrderModal';

const SORT_OPTIONS = [
  { id: 'featured', name: 'Featured' },
  { id: 'newest', name: 'Newest Arrivals' },
  { id: 'price_asc', name: 'Price: Low to High' },
  { id: 'price_desc', name: 'Price: High to Low' },
];

const ShopProducts = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sectionProducts, setSectionProducts] = useState([]);
  const [loadingSection, setLoadingSection] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const fetchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Use custom hook for order modal
  const orderModal = useOrderModal();

  // Use custom hook for API data
  const {
    products: apiProducts,
    categories: apiCategories,
    tags: apiTags,
    loading,
    error,
    isInitialSyncDone,
    fetchProducts
  } = useShopData();

  // Debounce price range updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);

    return () => clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const sectionParam = params.get('section');
    const tagsParam = params.getAll('tags[]'); // Collects multiple tags[] params

    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
    if (sectionParam) setSelectedSection(sectionParam);
    if (tagsParam.length > 0) setSelectedTags(tagsParam);
  }, [location.search]);

  // Track initial fetch to avoid flash
  const isFirstFetch = useRef(true);

  // Fetch section products if section is selected
  useEffect(() => {
    if (!selectedSection) {
      setSectionProducts([]);
      return;
    }

    const fetchSectionProducts = async () => {
      setLoadingSection(true);
      try {
        const response = await shopApi.getSectionDetail(selectedSection);
        if (response.status === 'success' && response.data && response.data.products) {
          // Format products similar to useShopData
          const formatted = response.data.products.map(p => ({
            id: p.ID,
            title: p.title,
            description: p.description,
            price: Number(p.amount),
            category: p.category_id,
            image: shopApi.getImageUrl(p.cover_image),
            delivery_range: p.delivery_range,
            tags: [],
            badge: null
          }));
          setSectionProducts(formatted);
        }
      } catch (error) {
        console.error('Error fetching section products:', error);
      } finally {
        setLoadingSection(false);
      }
    };

    fetchSectionProducts();
  }, [selectedSection]);

  // Debounced fetch when filters change (only if not viewing a section)
  useEffect(() => {
    if (selectedSection) return; // Don't fetch regular products if viewing a section

    // Skip debounce on first mount or if data is already being fetched
    const delay = isFirstFetch.current ? 0 : 500;

    const timer = setTimeout(() => {
      setIsFetching(true);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      fetchProducts({
        search: debouncedSearchQuery,
        category: selectedCategory,
        tags: selectedTags,
        limit: 50
      });
      isFirstFetch.current = false;
      fetchTimeoutRef.current = setTimeout(() => {
        setIsFetching(false);
      }, 1500);
    }, delay);

    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, selectedCategory, selectedTags, fetchProducts, selectedSection]);

  useEffect(() => {
    if (!isFetching) return;
    if (!loading) {
      setIsFetching(false);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    }
  }, [loading, isFetching]);

  

  const toggleTag = (tagId) => {
    const idStr = String(tagId);
    setSelectedTags(prev =>
      prev.includes(idStr)
        ? prev.filter(t => t !== idStr)
        : [...prev, idStr]
    );
  };

  // Client-side filtering for Price and Sorting (since API handles Search, Category, Tags)
  const filteredProducts = useMemo(() => {
    // If viewing a section, use section products instead of regular products
    let result = selectedSection ? [...sectionProducts] : [...apiProducts];

    // Price filter
    result = result.filter(product =>
      product.price >= debouncedPriceRange.min && product.price <= debouncedPriceRange.max
    );

    // Sorting logic
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products come pre-sorted by newest from API
        break;
      case 'featured':
      default:
        // Featured or default sorting
        break;
    }

    return result;
  }, [apiProducts, sectionProducts, selectedSection, debouncedPriceRange, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          ref={searchInputRef}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all text-sm font-medium shadow-sm"
        />

        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none z-10">search</span>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold text-[#0f1115] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-1">
          {apiCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex justify-between items-center group ${selectedCategory === category.id
                ? 'bg-[#ff6a00] text-white shadow-md shadow-[#ff6a00]/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#0f1115]'
                }`}
            >
              {category.name}
              {selectedCategory === category.id && (
                <span className="material-symbols-outlined text-[16px] bg-white/20 rounded-full p-0.5">check</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-[#0f1115] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{shopConfig.currency.symbol}</span>
            <input
              type="number"
              min="0"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              className="w-full pl-8 pr-2 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#ff6a00] outline-none"
              placeholder="Min"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{shopConfig.currency.symbol}</span>
            <input
              type="number"
              min="0"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-full pl-8 pr-2 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#ff6a00] outline-none"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-bold text-[#0f1115] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {apiTags.map(tag => (
            <button
              key={tag.ID}
              onClick={() => toggleTag(tag.ID)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${selectedTags.includes(String(tag.ID))
                ? 'bg-[#0f1115] text-white border-[#0f1115] shadow-lg'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#0f1115]'
                }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col font-['Inter',sans-serif] text-[#0f1115] antialiased selection:bg-[#ff6a00] selection:text-white overflow-x-hidden bg-[#f7f5f2]">
      <div className="flex-grow pt-5 lg:pt-5 pb-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden w-full md:w-auto bg-[#0f1115] text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#ff6a00] transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined">filter_list</span>
              Filters & Sort
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 relative">

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0 relative">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100 p-4">
                  <FilterContent />
                </div>
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {isMobileFiltersOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-[90vw] max-w-[800px] bg-white/85 z-50 shadow-2xl flex flex-col lg:hidden"
                  >
                    <div className="flex items-center justify-between p-6 pb-4 flex-none border-b border-gray-50">
                      <h2 className="text-2xl font-black text-[#0f1115]">Filters</h2>
                      <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                      <FilterContent mobile />
                    </div>

                    <div className="flex-none p-4 border-t border-gray-100">
                      <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="w-full bg-[#0f1115] text-white py-4 rounded-xl font-bold hover:bg-[#ff6a00] transition-colors"
                      >
                        Show {filteredProducts.length} Results
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="flex-1 min-h-[500px]">

              {/* Results Bar */}
              <div className="mb-8 flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500">
                  Showing <span className="text-[#0f1115] font-bold">{filteredProducts.length}</span> results
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-200 text-[#0f1115] text-sm font-bold rounded-lg pl-4 pr-10 py-2.5 outline-none focus:border-[#ff6a00] cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {(isFetching && !selectedSection) || (selectedSection && loadingSection) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 flex items-center gap-3 text-sm font-medium text-gray-600"
                  >
                    <div className="size-5 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div>
                    Fetching updated results...
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Grid */}
              <AnimatePresence mode="wait">
                {loading && apiProducts.length === 0 ? (
                  <motion.div
                    key="initial_loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center min-h-[400px]"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-12 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium">Loading products...</p>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[400px] text-center"
                  >
                    <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
                    <h3 className="text-xl font-bold text-[#0f1115] mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-[#0f1115] text-white rounded-full font-bold hover:bg-[#ff6a00] transition-colors"
                    >
                      Retry
                    </button>
                  </motion.div>
                ) : filteredProducts.length > 0 ? (
                  <motion.div
                    key="grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        variants={itemVariants}
                        {...product}
                        onAddToCart={() => orderModal.openModal(product)}
                      />
                    ))}
                  </motion.div>
                ) : !isInitialSyncDone ? (
                  <motion.div
                    key="syncing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center min-h-[400px]"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-12 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium">Syncing results...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed text-center px-4"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0f1115] mb-2">No products found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      We couldn't find any products matching your filters. Try adjusting your search or clearing some filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedTags([]);
                        setPriceRange({ min: 0, max: 1000000 });
                        setSortBy('featured');
                      }}
                      className="text-white bg-[#0f1115] px-8 py-3 rounded-full font-bold hover:bg-[#ff6a00] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

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

      <LoginPromptModal 
        open={orderModal.showLoginPrompt} 
        onClose={orderModal.closeLoginPrompt} 
        onLogin={orderModal.handleLogin} 
        onSignup={orderModal.handleSignup} 
      />
    </div>
  );
};

export default ShopProducts;
