import React, { useState, useEffect, useRef, useCallback } from "react";
import TopControls from "../../common/TopControls";
import SectionHeader from "../../common/SectionHeader";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from '../../../services/socialAccountService';
import Toast from '../../common/Toast';
import { SkeletonTableRow } from "../../common/Skeletons";

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

  // Infinite scroll for normal orders
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
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, searchActive]);

  // Auto-fetch more if not scrollable after first batch (normal orders)
  useEffect(() => {
    if (searchActive) return;
    const el = tableRef.current;
    if (!el || loading || loadingMore) return;
    if (orders.length === 0 || !next) return;
    // Try up to 3 times to avoid infinite loop
    if (el.scrollHeight <= el.clientHeight + 10 && autoFetchTries.current < 3) {
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
      fetchOrders({ start: 1, search })
        .then(({ accounts, next, error }) => {
          if (error) setToast({ show: true, message: error, type: 'error' });
          setSearchOrders(accounts);
          setSearchNext(next);
        })
        .finally(() => setSearchLoading(false));
    }, 400);
    // eslint-disable-next-line
  }, [search]);

  // Infinite scroll for search results
  const handleSearchScroll = useCallback(() => {
    if (!searchActive || searchLoading || !searchNext) return;
    const el = tableRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) {
      setSearchLoading(true);
      fetchOrders({ start: searchNext, search })
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
    el.addEventListener('scroll', handleSearchScroll);
    return () => el.removeEventListener('scroll', handleSearchScroll);
  }, [handleSearchScroll, searchActive]);

  // Auto-fetch more if not scrollable after first batch (search orders)
  useEffect(() => {
    if (!searchActive) return;
    const el = tableRef.current;
    if (!el || searchLoading) return;
    if (searchOrders.length === 0 || !searchNext) return;
    // Try up to 3 times to avoid infinite loop
    if (el.scrollHeight <= el.clientHeight + 10 && autoFetchTries.current < 3) {
      autoFetchTries.current += 1;
      setSearchLoading(true);
      fetchOrders({ start: searchNext, search })
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

  // Table data to show
  const tableData = searchActive ? searchOrders : orders;
  const isLoading = searchActive ? searchLoading : loading;
  const isLoadingMore = searchActive ? searchLoading : loadingMore;

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
              placeholder="Search by account title or order id"
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
        {/* Table */}
        <div
          className="max-w-[320px] sm:max-w-[650px] lg:max-w-full w-full overflow-x-auto"
          ref={tableRef}
          style={{ maxHeight: '70vh', minHeight: 200, overflowY: 'auto' }}
        >
          <table className="min-w-[900px] overflow-x-auto w-full text-left">
            <thead className="sticky top-0 z-10 bg-background">
              <tr className="border-b border-secondary">
                <th className="py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm font-semibold text-tertiary w-10 sm:w-12"></th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm font-semibold text-tertiary hidden sm:table-cell">Order ID</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm font-semibold text-tertiary">Title</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm font-semibold text-tertiary">Amount</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm font-semibold text-tertiary">Qty.</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm font-semibold text-tertiary">Date</th>
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
                  <td colSpan={6} className="py-6 sm:py-8 text-center text-tertiary">No orders found.</td>
                </tr>
              ) : (
                tableData.map((order, idx) => (
                  <tr key={order.ID || idx} className="border-b border-secondary hover:bg-secondary-light transition">
                    <td className="py-2 px-1 sm:py-4 sm:px-2 text-center align-middle">
                      <button
                        className="bg-quaternary rounded-lg p-2 hover:bg-quaternary/90 transition w-full sm:w-auto"
                        onClick={() => navigate(`/dashboard/accounts/order/${order.ID}`)}
                        aria-label="View Order"
                      >
                        <img src="/icons/eye-bold.svg" alt="View" className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                    <td className="py-2 px-1 sm:py-4 sm:px-2 text-[13px] sm:text-[15px] hidden sm:table-cell">{order.ID}</td>
                    <td className="py-2 px-1 sm:py-4 sm:px-2 font-semibold text-primary hover:underline cursor-pointer max-w-[120px] sm:max-w-xs truncate">
                      <span
                        onClick={() => navigate(`/dashboard/accounts/order/${order.ID}`)}
                        className="hover:underline cursor-pointer block truncate"
                        tabIndex={0}
                        role="button"
                        style={{ outline: 'none' }}
                        title={order.title}
                      >
                        {order.title}
                      </span>
                    </td>
                    <td className="py-2 px-1 sm:py-4 sm:px-2 text-quaternary font-semibold text-[13px] sm:text-[15px]">₦ {order.amount}</td>
                    <td className="py-2 px-1 sm:py-4 sm:px-2 text-[13px] sm:text-[15px]">{order.no_of_orders}</td>
                    <td className="py-2 px-1 sm:py-4 sm:px-2 text-[13px] sm:text-[15px]">{order.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
