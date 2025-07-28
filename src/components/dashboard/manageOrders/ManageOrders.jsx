import React, { useState, useEffect, useRef, useCallback } from "react";
import TopControls from "../../common/TopControls";
import SectionHeader from "../../common/SectionHeader";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from '../../../services/socialAccountService';
import Toast from '../../common/Toast';
import { SkeletonTableRow } from "../../common/Skeletons";
import { formatDate, money_format } from '../../../utils/formatUtils';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [next, setNext] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOrders, setSearchOrders] = useState([]);
  const [searchNext, setSearchNext] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [page, setPage] = useState(1); // Not used for API, but for TopControls
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const searchTimeout = useRef(null);
  const fetchController = useRef(null);
  const autoFetchTries = useRef(0);

  // Initial fetch (normal orders)
  useEffect(() => {
    if (searchActive) return;
    setLoading(true);
    fetchOrders({ start: 1 })
      .then(({ accounts, next, error }) => {
        if (error) setToast({ show: true, message: error, type: 'error' });
        setOrders(accounts);
        setNext(next);
      })
      .finally(() => setLoading(false));
  }, [searchActive]);

  // Infinite scroll for normal orders (desktop only)
  const handleScroll = useCallback(() => {
    if (searchActive || loadingMore || loading || !next) return;
    const el = tableRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 160) {
      setLoadingMore(true);
      fetchOrders({ start: next })
        .then(({ accounts, next: newNext, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setOrders(prev => [...prev, ...accounts]);
          setNext(newNext);
        })
        .finally(() => setLoadingMore(false));
    }
  }, [searchActive, loadingMore, loading, next]);

  useEffect(() => {
    if (searchActive) return;
    const el = tableRef.current;
    if (!el) return;
    // Only add scroll listener for desktop (lg and above)
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, searchActive]);

  // Auto-fetch more if not scrollable after first batch (desktop only)
  useEffect(() => {
    if (searchActive) return;
    const el = tableRef.current;
    if (!el || loading || loadingMore) return;
    if (orders.length === 0 || !next) return;
    // Only auto-fetch for desktop
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop && el.scrollHeight <= el.clientHeight + 10 && autoFetchTries.current < 3) {
      autoFetchTries.current += 1;
      setLoadingMore(true);
      fetchOrders({ start: next })
        .then(({ accounts, next: newNext, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setOrders(prev => [...prev, ...accounts]);
          setNext(newNext);
        })
        .finally(() => setLoadingMore(false));
    } else {
      autoFetchTries.current = 0;
    }
  }, [orders, next, loading, loadingMore, searchActive]);

  // Process bulk links - extract individual URLs from pasted text
  const processBulkLinks = (text) => {
    if (!text) return [];
    
    // Extract URLs using regex - matches http/https URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    
    // Clean up URLs and remove duplicates
    const cleanUrls = [...new Set(urls.map(url => url.trim()))];
    
    return cleanUrls;
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search.trim()) {
      setSearchActive(false);
      setSearchOrders([]);
      setSearchNext(1);
      setSearchLoading(false);
      return;
    }
    setSearchActive(true);
    setSearchLoading(true);
    setSearchOrders([]);
    setSearchNext(1);
    // Cancel previous fetch if any
    if (fetchController.current) fetchController.current.abort();
    
    searchTimeout.current = setTimeout(() => {
      // Check if search contains multiple URLs (bulk link search)
      const extractedUrls = processBulkLinks(search);
      let searchQuery = search;
      
      if (extractedUrls.length > 1) {
        // For bulk link search, join URLs with spaces for API search
        searchQuery = extractedUrls.join(' ');
        setToast({ 
          show: true, 
          message: `Searching for ${extractedUrls.length} links...`, 
          type: 'info' 
        });
      }
      
      fetchOrders({ start: 1, search: searchQuery })
        .then(({ accounts, next, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setSearchOrders(accounts);
          setSearchNext(next);
          
          // Show results summary for bulk search
          if (extractedUrls.length > 1) {
            setToast({ 
              show: true, 
              message: `Found ${accounts.length} orders matching the provided links`, 
              type: 'success' 
            });
          }
        })
        .finally(() => setSearchLoading(false));
    }, 400);
    // eslint-disable-next-line
  }, [search]);

  // Infinite scroll for search results (desktop only)
  const handleSearchScroll = useCallback(() => {
    if (!searchActive || searchLoading || !searchNext) return;
    const el = tableRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
      setSearchLoading(true);
      
      // Process search query for bulk links consistency
      const extractedUrls = processBulkLinks(search);
      const searchQuery = extractedUrls.length > 1 ? extractedUrls.join(' ') : search;
      
      fetchOrders({ start: searchNext, search: searchQuery })
        .then(({ accounts, next: newNext, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setSearchOrders(prev => [...prev, ...accounts]);
          setSearchNext(newNext);
        })
        .finally(() => setSearchLoading(false));
    }
  }, [searchActive, searchLoading, searchNext, search]);

  useEffect(() => {
    if (!searchActive) return;
    const el = tableRef.current;
    if (!el) return;
    // Only add scroll listener for desktop (lg and above)
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      el.addEventListener('scroll', handleSearchScroll);
      return () => el.removeEventListener('scroll', handleSearchScroll);
    }
  }, [handleSearchScroll, searchActive]);

  // Auto-fetch more if not scrollable after first batch (desktop only)
  useEffect(() => {
    if (!searchActive) return;
    const el = tableRef.current;
    if (!el || searchLoading) return;
    if (searchOrders.length === 0 || !searchNext) return;
    // Only auto-fetch for desktop
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop && el.scrollHeight <= el.clientHeight + 10 && autoFetchTries.current < 3) {
      autoFetchTries.current += 1;
      setSearchLoading(true);
      
      // Process search query for bulk links consistency
      const extractedUrls = processBulkLinks(search);
      const searchQuery = extractedUrls.length > 1 ? extractedUrls.join(' ') : search;
      
      fetchOrders({ start: searchNext, search: searchQuery })
        .then(({ accounts, next: newNext, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setSearchOrders(prev => [...prev, ...accounts]);
          setSearchNext(newNext);
        })
        .finally(() => setSearchLoading(false));
    } else {
      autoFetchTries.current = 0;
    }
  }, [searchOrders, searchNext, searchLoading, searchActive, search]);

  // Load more function for mobile
  const handleLoadMore = () => {
    if (searchActive) {
      if (searchLoading || !searchNext) return;
      setSearchLoading(true);
      
      const extractedUrls = processBulkLinks(search);
      const searchQuery = extractedUrls.length > 1 ? extractedUrls.join(' ') : search;
      
      fetchOrders({ start: searchNext, search: searchQuery })
        .then(({ accounts, next: newNext, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setSearchOrders(prev => [...prev, ...accounts]);
          setSearchNext(newNext);
        })
        .finally(() => setSearchLoading(false));
    } else {
      if (loadingMore || !next) return;
      setLoadingMore(true);
      fetchOrders({ start: next })
        .then(({ accounts, next: newNext, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setOrders(prev => [...prev, ...accounts]);
          setNext(newNext);
        })
        .finally(() => setLoadingMore(false));
    }
  };

  // Table data to show
  const tableData = searchActive ? searchOrders : orders;
  const isLoading = searchActive ? searchLoading : loading;
  const isLoadingMore = searchActive ? searchLoading : loadingMore;
  const hasMore = searchActive ? searchNext : next;

  return (
    <div className="p-4 md:p-10">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <SectionHeader
        title="Your Orders"
        buttonText="Buy New Account"
        onButtonClick={() => navigate("/dashboard/accounts")}
      />
      <div className="bg-background rounded-2xl shadow p-4 md:p-8 mx-auto">
        {/* Search Bar */}
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search by account title, order id, or paste multiple links"
              className="w-full border border-border-grey rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <img
              src="/icons/search.svg"
              alt="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary"
            />
          </div>
        </div>
        {/* Top Controls (optional, not used for API) */}
        {/* <TopControls page={page} setPage={setPage} /> */}
        {/* Mobile Card Layout */}
        <div className="block lg:hidden">
          <div className="space-y-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-secondary-light rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-secondary rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-secondary rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : tableData.length === 0 ? (
              <div className="text-center py-8 text-tertiary">No orders found.</div>
            ) : (
              <>
                {tableData.map((order, idx) => (
                  <div
                    key={order.ID || idx}
                    className="bg-white border border-secondary rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/dashboard/accounts/order/${order.ID}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary text-sm truncate" title={order.title}>
                          {order.title}
                        </h3>
                        <p className="text-xs text-tertiary mt-1">Order ID: {order.ID}</p>
                      </div>
                      <button
                        className="bg-quaternary rounded-lg p-2 hover:bg-quaternary/90 transition ml-3 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/accounts/order/${order.ID}`);
                        }}
                        aria-label="View Order"
                      >
                        <img src="/icons/eye-bold.svg" alt="View" className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-tertiary mb-1">Amount</p>
                        <p className="font-semibold text-quaternary">{money_format(order.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-tertiary mb-1">Quantity</p>
                        <p className="font-medium">{order.no_of_orders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-tertiary mb-1">Date</p>
                        <div className="font-medium">
                          <p className="text-sm">{formatDate(order.date).date}</p>
                          <p className="text-xs text-tertiary">{formatDate(order.date).time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* Load More Button for Mobile */}
          {!isLoading && tableData.length > 0 && hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoadingMore ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div
          className="hidden lg:block w-full overflow-x-auto"
          ref={tableRef}
          style={{ maxHeight: '70vh', minHeight: 200, overflowY: 'auto' }}
        >
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-background">
              <tr className="border-b border-secondary">
                <th className="py-3 px-4 text-sm font-semibold text-tertiary w-16">Action</th>
                <th className="py-3 px-4 text-sm font-semibold text-tertiary">Order ID</th>
                <th className="py-3 px-4 text-sm font-semibold text-tertiary">Title</th>
                <th className="py-3 px-4 text-sm font-semibold text-tertiary">Amount</th>
                <th className="py-3 px-4 text-sm font-semibold text-tertiary">Quantity</th>
                <th className="py-3 px-4 text-sm font-semibold text-tertiary">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonTableRow key={i} cols={6} />
                  ))}
                </>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-tertiary">No orders found.</td>
                </tr>
              ) : (
                tableData.map((order, idx) => (
                  <tr 
                    key={order.ID || idx} 
                    className="border-b border-secondary hover:bg-secondary-light transition cursor-pointer"
                    onClick={() => navigate(`/dashboard/accounts/order/${order.ID}`)}
                  >
                    <td className="py-4 px-4 text-center">
                      <button
                        className="bg-quaternary rounded-lg p-2 hover:bg-quaternary/90 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/accounts/order/${order.ID}`);
                        }}
                        aria-label="View Order"
                      >
                        <img src="/icons/eye-bold.svg" alt="View" className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">{order.ID}</td>
                    <td className="py-4 px-4">
                      <span
                        className="font-semibold text-primary hover:underline cursor-pointer block"
                        title={order.title}
                      >
                        {order.title}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-quaternary font-semibold">{money_format(order.amount)}</td>
                    <td className="py-4 px-4 font-medium">{order.no_of_orders}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium">
                        <p className="text-sm">{formatDate(order.date).date}</p>
                        <p className="text-xs text-tertiary">{formatDate(order.date).time}</p>
                      </div>
                    </td>
                  </tr>
                ))
               )}
             </tbody>
           </table>
        </div>
        
        {/* Loading More Indicator for Desktop */}
        <div className="hidden lg:block">
          {isLoadingMore && (
            <div className="flex justify-center items-center py-4">
              <svg className="animate-spin h-6 w-6 text-quinary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="ml-2 text-quinary font-semibold">Loading more...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
