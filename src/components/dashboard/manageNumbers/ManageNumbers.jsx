import React, { useState, useEffect, useRef, useCallback } from "react";
import { DateTime } from "luxon";
import { FaSearch, FaTrash, FaChevronDown, FaFilter, FaTimes } from "react-icons/fa";
import { AiFillEye } from 'react-icons/ai'
import { FiMail, FiPhone, FiCopy } from "react-icons/fi";
import NumberDetailsModal from './NumberDetailsModal';
import { fetchNumbers, fetchNumberCode, renewNumber } from "../../../services/numberService";
import { getEmails, getEmailCode } from "../../../services/emailService";
import { useParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../common/SectionHeader";
import { SkeletonTableRow, SkeletonNumberCard } from "../../common/Skeletons";
import { useUser } from "../../../contexts/UserContext";
import { triggerRentalCronjob, fetchRenewPrice } from "../../../services/rentalService";
import CustomModal from "../../common/CustomModal";

const ManageNumbers = ({ orderId }) => {
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [refundRefreshing, setRefundRefreshing] = useState(false);
  const { user } = useUser();

  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewModalLoading, setRenewModalLoading] = useState(false);
  const [renewModalMessage, setRenewModalMessage] = useState("");
  const [renewModalPrice, setRenewModalPrice] = useState(null);
  const [renewModalOrderId, setRenewModalOrderId] = useState(null);
  const [renewingOrderId, setRenewingOrderId] = useState(null);
  const [renewPriceId, setRenewPriceId] = useState(null);
  const [renewSubmitLoading, setRenewSubmitLoading] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const handleRenewProceed = async () => {
    if (!renewModalOrderId || !renewPriceId || renewSubmitLoading) return;
    setRenewSubmitLoading(true);
    try {
      const result = await renewNumber(renewModalOrderId, renewPriceId);
      const nextOrderId = result?.data?.ID || result?.ID || null;
      const nextNumberData = result?.data || result || null;
      if (nextNumberData) {
        setSelectedNumber(nextNumberData);
        setModalOpen(true);
        setActiveTab("Active");
      }
      setRenewModalOpen(false);
      setRenewModalLoading(false);
      setRenewModalMessage("");
      setRenewModalPrice(null);
      setRenewModalOrderId(null);
      setRenewPriceId(null);
      if (nextOrderId) {
        window.location.href = `/dashboard/manage-numbers/${nextOrderId}`;
      }
    } catch (error) {
      setRenewModalMessage(error.message || "Failed to renew number");
      setRenewModalPrice(null);
    } finally {
      setRenewSubmitLoading(false);
    }
  };

  // Separate state for active/inactive numbers and pagination
  const [activeNumbers, setActiveNumbers] = useState([]);
  const [inactiveNumbers, setInactiveNumbers] = useState([]);
  const [activeEmails, setActiveEmails] = useState([]);
  const [inactiveEmails, setInactiveEmails] = useState([]);
  const [activeNext, setActiveNext] = useState(null);
  const [inactiveNext, setInactiveNext] = useState(null);
  const [activeLoading, setActiveLoading] = useState(false);
  const [inactiveLoading, setInactiveLoading] = useState(false);
  const [activeLoadingMore, setActiveLoadingMore] = useState(false);
  const [inactiveLoadingMore, setInactiveLoadingMore] = useState(false);
  const [countdownTick, setCountdownTick] = useState(0);

  const activeListRef = useRef(null);
  const inactiveListRef = useRef(null);

  // For routing param support
  const params = useParams ? useParams() : {};
  const navigate = useNavigate();
  // Prefer prop, fallback to params
  const orderIdParam = orderId || params.orderId;

  // Dummy verification code for demo
  const verificationCode = "1234";

  // Actual filters used for fetching
  const [filters, setFilters] = useState({
    s: "",
    type: "",
    canrenew: "",
    contact: "",
    start_date: "",
    end_date: ""
  });

  // Pending filters for UI inputs (before Apply)
  const [tempFilters, setTempFilters] = useState({
    type: "",
    canrenew: "",
    contact: "",
    start_date: "",
    end_date: ""
  });

  // Apply filters
  const applyFilters = () => {
    setFilters(prev => ({ ...prev, ...tempFilters }));
    setFilterModalOpen(false);
  };

  // Clear filters
  const clearFilters = () => {
    const cleared = {
      type: "",
      canrenew: "",
      contact: "",
      start_date: "",
      end_date: ""
    };
    setTempFilters(cleared);
    setFilters(prev => ({ ...prev, ...cleared }));
    setFilterModalOpen(false);
  };

  // Sync temp filters with active filters when modal opens
  useEffect(() => {
    if (filterModalOpen) {
      setTempFilters({
        type: filters.type,
        canrenew: filters.canrenew,
        contact: filters.contact,
        start_date: filters.start_date,
        end_date: filters.end_date
      });
    }
  }, [filterModalOpen]);

  // Debounce search update to filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, s: search }));
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch numbers and emails for active tab when filters change
  useEffect(() => {
    // Reset and fetch active
    setActiveLoading(true);
    setActiveNumbers([]);
    setActiveEmails([]); // Clear emails to avoid stale data
    setActiveNext(0);

    // Fetch active numbers
    const fetchActiveNumbers = fetchNumbers({ status: "active", start: 0, ...filters })
      .then(({ numbers, next }) => {
        const numbersWithType = numbers.map(num => ({
          ...num,
          type: num.type || 'number'
        }));
        setActiveNumbers(numbersWithType);
        setActiveNext(next);
        return numbersWithType;
      })
      .catch(err => {
        console.error("Error fetching active numbers:", err);
        return [];
      });

    // Fetch active emails (only if contact filter allows)
    let fetchActiveEmails = Promise.resolve([]);
    if (filters.contact !== 'number') {
      fetchActiveEmails = getEmails()
        .then(response => {
          if (response.status === "success" && Array.isArray(response.data)) {
            let activeEmailsData = response.data
              .filter(email => email.status === "active")
              .map(email => ({
                ID: email.id || email.ID,
                userID: email.userID,
                accountID: email.accountID,
                serviceCode: email.serviceCode,
                serviceName: email.service,
                number: email.email,
                amount: email.amount,
                type: 'email',
                expiration: email.expiration || 0,
                status: 1,
                create_timestamp: email.create_timestamp,
                date: email.date
              }));
            
            // Client-side filtering for emails
            if (filters.s) {
              const s = filters.s.toLowerCase();
              activeEmailsData = activeEmailsData.filter(e => 
                (e.number && e.number.toLowerCase().includes(s)) || 
                (e.serviceName && e.serviceName.toLowerCase().includes(s))
              );
            }
            // Date filtering for emails could be added here if needed
            
            setActiveEmails(activeEmailsData);
            return activeEmailsData;
          }
          return [];
        })
        .catch(err => {
          console.error("Error fetching active emails:", err);
          return [];
        });
    }

    Promise.all([fetchActiveNumbers, fetchActiveEmails])
      .then(() => setActiveLoading(false));

  }, [filters]); // Re-run when filters change

  // Fetch inactive numbers and emails when filters change
  useEffect(() => {
    // Reset and fetch inactive
    setInactiveLoading(true);
    setInactiveNumbers([]);
    setInactiveEmails([]);
    setInactiveNext(0);

    // Fetch inactive numbers
    const fetchInactiveNumbers = fetchNumbers({ status: "inactive", start: 0, ...filters })
      .then(({ numbers, next }) => {
        const numbersWithType = numbers.map(num => ({
          ...num,
          type: num.type || 'number'
        }));
        setInactiveNumbers(numbersWithType);
        setInactiveNext(next);
        return numbersWithType;
      })
      .catch(err => {
        console.error("Error fetching inactive numbers:", err);
        return [];
      });

    // Fetch inactive emails
    let fetchInactiveEmails = Promise.resolve([]);
    if (filters.contact !== 'number') {
      fetchInactiveEmails = getEmails()
        .then(response => {
          if (response.status === "success" && Array.isArray(response.data)) {
            let inactiveEmailsData = response.data
              .filter(email => email.status !== "active")
              .map(email => ({
                ID: email.id || email.ID,
                userID: email.userID,
                accountID: email.accountID,
                serviceCode: email.serviceCode,
                serviceName: email.service,
                number: email.email,
                amount: email.amount,
                type: 'email',
                expiration: 0,
                status: 0,
                create_timestamp: email.create_timestamp,
                date: email.date
              }));

            // Client-side filtering for emails
            if (filters.s) {
              const s = filters.s.toLowerCase();
              inactiveEmailsData = inactiveEmailsData.filter(e => 
                (e.number && e.number.toLowerCase().includes(s)) || 
                (e.serviceName && e.serviceName.toLowerCase().includes(s))
              );
            }

            setInactiveEmails(inactiveEmailsData);
            return inactiveEmailsData;
          }
          return [];
        })
        .catch(err => {
          console.error("Error fetching inactive emails:", err);
          return [];
        });
    }

    Promise.all([fetchInactiveNumbers, fetchInactiveEmails])
      .then(() => setInactiveLoading(false));
  }, [filters]);

  // --- Auto-open modal if orderId param is present ---
  useEffect(() => {
    if (!orderIdParam) return;
    // Search both active and inactive numbers for the orderId
    const allNumbers = [...activeNumbers, ...inactiveNumbers];
    const found = allNumbers.find(n => n.ID === orderIdParam);
    if (found) {
      setSelectedNumber(found);
      setModalOpen(true);
    }
    // If not found and numbers are loaded, you may want to show a toast or redirect
  }, [orderIdParam, activeNumbers, inactiveNumbers]);

  // Infinite scroll handler for active
  const handleActiveScroll = useCallback(() => {
    if (activeLoadingMore || activeLoading || activeNext == null) return;
    const el = activeListRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      setActiveLoadingMore(true);
      fetchNumbers({ status: "active", start: activeNext, ...filters })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          const numbersWithType = moreNumbers.map(num => ({
            ...num,
            type: num.type || 'number'
          }));
          setActiveNumbers(prev => [...prev, ...numbersWithType]);
          setActiveNext(newNext);
        })
        .finally(() => setActiveLoadingMore(false));
    }
  }, [activeLoadingMore, activeLoading, activeNext, filters]);

  // Infinite scroll handler for inactive
  const handleInactiveScroll = useCallback(() => {
    if (inactiveLoadingMore || inactiveLoading || inactiveNext == null) return;
    const el = inactiveListRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      setInactiveLoadingMore(true);
      fetchNumbers({ status: "inactive", start: inactiveNext, ...filters })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          const numbersWithType = moreNumbers.map(num => ({
            ...num,
            type: num.type || 'number'
          }));
          setInactiveNumbers(prev => [...prev, ...numbersWithType]);
          setInactiveNext(newNext);
        })
        .finally(() => setInactiveLoadingMore(false));
    }
  }, [inactiveLoadingMore, inactiveLoading, inactiveNext, filters]);

  // Attach scroll event to the table container for active
  useEffect(() => {
    const el = activeListRef.current;
    if (!el || activeNext == null) return;
    el.addEventListener("scroll", handleActiveScroll);
    return () => {
      el.removeEventListener("scroll", handleActiveScroll);
    };
  }, [handleActiveScroll, activeNext]);

  // Attach scroll event to the table container for inactive
  useEffect(() => {
    const el = inactiveListRef.current;
    if (!el || inactiveNext == null) return;
    el.addEventListener("scroll", handleInactiveScroll);
    return () => {
      el.removeEventListener("scroll", handleInactiveScroll);
    };
  }, [handleInactiveScroll, inactiveNext]);

  // Auto-load next batch if content is not scrollable but more data exists (active)
  useEffect(() => {
    const el = activeListRef.current;
    if (!el || activeLoading || activeLoadingMore) return;
    if (activeNext != null && el.scrollHeight <= el.clientHeight + 10) {
      setActiveLoadingMore(true);
      fetchNumbers({ status: "active", start: activeNext, ...filters })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          const numbersWithType = moreNumbers.map(num => ({
            ...num,
            type: num.type || 'number'
          }));
          setActiveNumbers(prev => [...prev, ...numbersWithType]);
          setActiveNext(newNext);
        })
        .finally(() => setActiveLoadingMore(false));
    }
  }, [activeNumbers, activeNext, activeLoading, activeLoadingMore, filters]);

  // Auto-load next batch if content is not scrollable but more data exists (inactive)
  useEffect(() => {
    const el = inactiveListRef.current;
    if (!el || inactiveLoading || inactiveLoadingMore) return;
    if (inactiveNext != null && el.scrollHeight <= el.clientHeight + 10) {
      setInactiveLoadingMore(true);
      fetchNumbers({ status: "inactive", start: inactiveNext, ...filters })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          const numbersWithType = moreNumbers.map(num => ({
            ...num,
            type: num.type || 'number'
          }));
          setInactiveNumbers(prev => [...prev, ...numbersWithType]);
          setInactiveNext(newNext);
        })
        .finally(() => setInactiveLoadingMore(false));
    }
  }, [inactiveNumbers, inactiveNext, inactiveLoading, inactiveLoadingMore, filters]);

  // Filtering (handled by API + useEffect for emails, so just combine)
  const filteredActiveNumbers = [...activeNumbers, ...activeEmails];
  const filteredInactiveNumbers = [...inactiveNumbers, ...inactiveEmails];

  // Handler for "View" button
  const handleView = async (item) => {
    setSelectedNumber(item);
    setModalOpen(true);
    // If orderId is in URL, remove it for clean navigation after manual open
    if (orderIdParam) {
      navigate("/dashboard/manage-numbers", { replace: true });
    }

    // Fetch verification code based on item type
    try {
      if (item.type === 'email') {
        // Fetch email code
        const res = await getEmailCode(item.ID);
        if (res.status === "success" && Array.isArray(res.data) && res.data.length > 0) {
          // Just get the first message for now
          setVerificationCode(res.data[0].code || res.data[0].content || "");
        } else {
          setVerificationCode("");
        }
      } else {
        // Fetch number code (default)
        const res = await fetchNumberCode(item.ID);
        if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
          // Just get the first message for now
          setVerificationCode(res.data[0].message || "");
        } else {
          setVerificationCode("");
        }
      }
    } catch (err) {
      console.error(`Error fetching code for ${item.type || 'number'}:`, err);
      setVerificationCode("");
    }
  };

  // Handler for when a number or email is closed
  const handleNumberClosed = (orderId) => {
    // Handle email type
    if (selectedNumber?.type === 'email') {
      setActiveEmails((prev) => prev.filter((e) => e.ID !== orderId));
      setInactiveEmails((prev) => [
        ...prev,
        ...(activeEmails.filter((e) => e.ID === orderId).map((e) => ({
          ...e,
          status: 0,
          date: new Date().toISOString().slice(0, 19).replace("T", " "),
        })))
      ]);
    } else {
      // Handle number type (default)
      setActiveNumbers((prev) => prev.filter((n) => n.ID !== orderId));
      setInactiveNumbers((prev) => [
        ...prev,
        ...(activeNumbers.filter((n) => n.ID === orderId).map((n) => ({
          ...n,
          status: 0,
          date: new Date().toISOString().slice(0, 19).replace("T", " "),
        })))
      ]);
    }
    setModalOpen(false);
    // After closing, remove orderId from URL if present
    if (orderIdParam) {
      navigate("/dashboard/manage-numbers", { replace: true });
    }
  };

  // Handler for reload, copy, etc.
  const handleReload = () => {
    // alert("Reload Number clicked!");
  };
  const handleCopyNumber = () => {
    if (selectedNumber?.number) navigator.clipboard.writeText(selectedNumber.number);
  };
  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
  };

  // Helper for expiration formatting (API gives seconds)
  function formatExpiration(seconds) {
    if (!seconds || seconds <= 0) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h > 0 ? `${h}h` : "",
      m > 0 ? `${m}m` : "",
      s > 0 ? `${s}s` : "",
    ].filter(Boolean).join(" ");
  }

  function isLessThanOneHour(expiration) {
    return expiration > 0 && expiration < 3600;
  }

  function formatTypeLabel(type) {
    if (!type) return "N/A";
    return String(type).replace(/_/g, " ");
  }

  function formatAmount(amount) {
    const num = Number(amount);
    if (Number.isNaN(num)) return amount || "0";
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function parseDateToTimestamp(dateStr) {
    if (!dateStr) return null;
    if (typeof dateStr === "number") return dateStr;
    const str = String(dateStr);
    return new Date(str.replace(" ", "T")).getTime() / 1000;
  }

  function getNowLagosSeconds() {
    const lagosMillis = DateTime.now().setZone("Africa/Lagos").toMillis();
    return Math.floor(lagosMillis / 1000);
  }

  function getSecondsLeftForItem(item, _tick) {
    if (!item) return 0;
    let secs = 0;
    const baseDate = item.date || item.create_timestamp;
    const expiration = item.expiration;
    if (baseDate && expiration) {
      const startTs = parseDateToTimestamp(baseDate);
      if (startTs != null) {
        const expireTs = startTs + Number(expiration);
        const nowLagos = getNowLagosSeconds();
        secs = expireTs - nowLagos;
      }
    } else if (item.expire_date) {
      const expireTs = parseDateToTimestamp(item.expire_date);
      if (expireTs != null) {
        const nowLagos = getNowLagosSeconds();
        secs = expireTs - nowLagos;
      }
    } else {
      const raw = Number(item.expiration);
      if (Number.isFinite(raw)) secs = raw;
    }
    return secs > 0 ? secs : 0;
  }

  function hasActiveCountdown(item) {
    const secs = getSecondsLeftForItem(item, countdownTick);
    return secs > 0;
  }

  function canShowRenew(item) {
    if (!item) return false;
    if (item.type === "email") return false;
    if (String(item.number || "").includes("@")) return false;
    if (Number(item.canrenew) !== 1) return false;
    if (item.status === 1 && hasActiveCountdown(item)) return false;
    return true;
  }

  const handleOpenRenew = async (item) => {
    if (!item) return;
    if (item.status === 1) return;
    if (item.type === "email" || String(item.number || "").includes("@")) return;
    if (!item.ID) return;
    if (renewingOrderId) return;

    setRenewModalLoading(true);
    setRenewModalOrderId(item.ID);
    setRenewModalMessage("");
    setRenewModalPrice(null);
    setRenewPriceId(null);
    setRenewingOrderId(item.ID);

    try {
      const res = await fetchRenewPrice(item.ID);
      if (res && res.status === "success") {
        setRenewModalPrice(res.data?.price ?? null);
        setRenewModalMessage(res.message || "");
        setRenewPriceId(res.data?.ID ?? null);
      } else {
        setRenewModalPrice(null);
        setRenewModalMessage(res?.message || "Not renewable number.");
      }
      setRenewModalOpen(true);
    } finally {
      setRenewModalLoading(false);
      setRenewingOrderId(null);
    }
  };

  // Custom Buy Dropdown Component
  const BuyDropdown = () => {
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setBuyDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="bg-quinary hover:bg-[#ff8c1a] text-white font-medium rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95 h-8 sm:h-10 mt-1 sm:mt-0"
          onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
        >
          <span className="hidden xs:inline">+ New Rental</span>
          <span className="xs:hidden">+ Rent</span>
          <FaChevronDown className={`transition-transform text-xs ${buyDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {buyDropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="py-1">
              <button
                className="w-full text-left px-3 py-3 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-2 transition-colors touch-manipulation"
                onClick={() => {
                  navigate('/dashboard/buy-numbers');
                  setBuyDropdownOpen(false);
                }}
              >
                <FiPhone className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span className="truncate">Buy Numbers</span>
              </button>
              <button
                className="w-full text-left px-3 py-3 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center gap-2 transition-colors touch-manipulation"
                onClick={() => {
                  navigate('/dashboard/buy-emails');
                  setBuyDropdownOpen(false);
                }}
              >
                <FiMail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <span className="truncate">Buy Emails</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-2 sm:px-4 lg:px-6 sm:ml-4">
      {/* Unified Responsive Table */}
      <div className="mt-3 sm:mt-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 ms-2">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary">Manage Rentals</h1>
            <BuyDropdown />
          </div>
        </div>

        <div className="ms-2">


          {/* Tabs and Search */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-3 border-b border-[#ECECEC] mb-4 lg:mb-6">
            <div className="flex gap-4 sm:gap-6">
              {["Active", "Inactive"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 text-sm sm:text-base font-medium transition-colors min-h-[36px] ${activeTab === tab
                      ? "border-b-2 lg:border-b-3 border-primary text-primary"
                      : "text-text-grey hover:text-text-primary"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center flex-1 sm:min-w-[280px] h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 focus-within:border-transparent focus-within:ring-0 focus-within:outline-none transition-all">
                <FaSearch className="text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search rentals..."
                  className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 text-sm text-gray-700 placeholder-gray-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button 
                className={`flex items-center gap-2 px-4 h-10 rounded-lg border font-medium text-sm transition-all active:scale-95 ${
                  Object.values(filters).some(val => val !== "" && typeof val === "string" && val !== filters.s)
                    ? "bg-primary text-white border-primary shadow-sm hover:bg-primary-dark" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => setFilterModalOpen(true)}
                title="Filter Rentals"
              >
                <FaFilter className={Object.values(filters).some(val => val !== "" && typeof val === "string" && val !== filters.s) ? "text-white" : "text-gray-500"} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3 text-xs sm:text-sm text-blue-800">
            <div className="items-center justify-between gap-2">
              <p className="mb-0">
                <strong>Refund Information:</strong> If your refund seems delayed, use the refresh button to update your refund status.
              </p>
              <button
                type="button"
                className="flex mt-3 items-center gap-1 px-3 py-1 bg-quinary text-white rounded-full text-xs font-medium hover:bg-quinary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={async () => {
                  if (refundRefreshing) return;
                  const uid = user?.userID || user?.ID;
                  if (!uid) return;
                  setRefundRefreshing(true);
                  const ok = await triggerRentalCronjob(uid);
                  if (ok) {
                    window.location.reload();
                  } else {
                    setRefundRefreshing(false);
                  }
                }}
                disabled={refundRefreshing}
                title="Refresh balance and refund status"
              >
                <img src="/icons/reload.svg" alt="Refresh" className={`h-4 w-4 ${refundRefreshing ? "animate-spin" : ""}`} />
                {refundRefreshing ? "Refreshing" : "Refresh Balance"}
              </button>
            </div>
          </div>
        </div>

        <div className="ms-2">
          <div className="md:hidden space-y-3">
            {activeTab === "Active" && (
              <div className="space-y-3">
                {activeLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonNumberCard key={i} />
                  ))
                ) : filteredActiveNumbers.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 bg-background rounded-xl p-3 border border-dashed border-gray-200">
                    <span className="text-sm text-text-secondary">No active rentals found.</span>
                    <div className="flex flex-col sm:flex-row gap-2 w-full justify-center items-center">
                      <button
                        className="w-full sm:w-auto bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-3 py-1.5 text-sm flex items-center justify-center gap-2 transition-colors"
                        onClick={() => setBuyDropdownOpen(true)}
                      >
                        + Start Renting
                      </button>
                      <button
                        className="w-full sm:w-auto bg-quaternary-light text-quinary font-semibold rounded-full px-3 py-1.5 text-sm flex items-center justify-center gap-2 border border-quaternary transition-colors hover:bg-quaternary-light"
                        style={{ background: "none" }}
                        onClick={() => setActiveTab("Inactive")}
                      >
                        View Inactive Rentals
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredActiveNumbers.map((item) => {
                    const secsLeft = getSecondsLeftForItem(item, countdownTick);
                    return (
                    <div
                      key={item.ID}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {item.type === "email" ? (
                            <>
                              <FiMail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span className="text-xs font-medium text-blue-600">Email</span>
                            </>
                          ) : (
                            <>
                              <FiPhone className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-xs font-medium text-green-600">Number</span>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-xs font-semibold ${isLessThanOneHour(secsLeft) ? "text-danger" : "text-success"}`}
                          >
                            {formatExpiration(secsLeft)}
                          </div>
                          <div className="text-[11px] text-text-grey">Time left</div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className={`font-mono font-semibold text-text-primary break-all ${
                              String(item.number || "").includes("@") ? "text-base" : "text-[20px]"
                            }`}
                          >
                            {item.number}
                          </div>
                          <button
                            type="button"
                            className="ml-2 px-2 py-1 rounded-full border border-gray-200 text-[10px] text-text-secondary flex items-center gap-1 active:scale-95"
                            onClick={() => {
                              if (item.number) navigator.clipboard.writeText(item.number);
                            }}
                          >
                            <FiCopy className="h-3 w-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-x-3 gap-y-1 text-[11px] text-text-grey">
                          <div>
                            <div className="uppercase tracking-wide">Service</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {item.serviceName || item.serviceCode || "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="uppercase tracking-wide">Type</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {formatTypeLabel(item.type)}
                            </div>
                          </div>
                          <div>
                            <div className="uppercase tracking-wide">Date</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {(() => {
                                if (!item.date) return "N/A";
                                let dt = DateTime.fromISO(item.date);
                                if (!dt.isValid) dt = DateTime.fromSQL(item.date);
                                return dt.isValid ? dt.toFormat("MMM dd, yyyy") : item.date;
                              })()}
                            </div>
                          </div>
                          <div>
                            <div className="uppercase tracking-wide">Amount</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {formatAmount(item.amount)}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="uppercase tracking-wide">Order ID</div>
                            <button
                              type="button"
                              className="text-[11px] text-text-primary font-medium break-all underline decoration-dotted"
                              onClick={() => {
                                if (item.ID) navigator.clipboard.writeText(item.ID);
                              }}
                            >
                              {item.ID}
                            </button>
                          </div>
                        </div>
                      </div>
                    <div className="flex gap-2">
                        {canShowRenew(item) && (
                            <button
                              className="flex-1 bg-white text-quinary border border-quinary font-semibold rounded-full px-3 py-2 flex items-center justify-center gap-1 text-xs hover:bg-quaternary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              type="button"
                              disabled={renewingOrderId === item.ID}
                              onClick={() => handleOpenRenew(item)}
                            >
                              {renewingOrderId === item.ID ? (
                                <>
                                  <svg
                                    className="animate-spin h-3 w-3 text-quinary"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v8z"
                                    />
                                  </svg>
                                  <span>Checking...</span>
                                </>
                              ) : (
                                <span>Re-new</span>
                              )}
                            </button>
                          )}
                        <button
                          className="flex-1 bg-quaternary-light text-quinary font-semibold rounded-full px-3 py-2 flex items-center justify-center gap-1 text-xs hover:bg-quaternary transition-colors"
                          onClick={() => handleView(item)}
                        >
                          <AiFillEye className="h-4 w-4" />
                          <span>View details</span>
                        </button>
                      </div>
                    </div>
                  )})
                )}
              </div>
            )}

            {activeTab === "Inactive" && (
              <div className="space-y-3">
                {inactiveLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonNumberCard key={i} />
                  ))
                ) : filteredInactiveNumbers.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 bg-background rounded-2xl p-4 border border-dashed border-gray-200">
                    <span className="text-sm text-text-secondary">No inactive rentals found.</span>
                    <div className="flex flex-col sm:flex-row gap-2 w-full justify-center items-center">
                      <button
                        className="w-full sm:w-auto bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-4 py-2 text-sm flex items-center justify-center gap-2 transition-colors"
                        onClick={() => setBuyDropdownOpen(true)}
                      >
                        + Start Renting
                      </button>
                      <button
                        className="w-full sm:w-auto bg-quaternary-light text-quinary font-semibold rounded-full px-4 py-2 text-sm flex items-center justify-center gap-2 border border-quaternary transition-colors hover:bg-quaternary-light"
                        style={{ background: "none" }}
                        onClick={() => setActiveTab("Active")}
                      >
                        View Active Rentals
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredInactiveNumbers.map((item) => (
                    <div
                      key={item.ID}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {item.type === "email" ? (
                            <>
                              <FiMail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span className="text-xs font-medium text-blue-600">Email</span>
                            </>
                          ) : (
                            <>
                              <FiPhone className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-xs font-medium text-green-600">Number</span>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          {/* <div className="text-xs text-gray-600">
                            {item.date}
                          </div> */}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className={`font-mono font-semibold text-text-primary break-all ${
                              String(item.number || "").includes("@") ? "text-base" : "text-[20px]"
                            }`}
                          >
                            {item.number}
                          </div>
                          <button
                            type="button"
                            className="ml-2 px-2 py-1 rounded-full border border-gray-200 text-[10px] text-text-secondary flex items-center gap-1 active:scale-95"
                            onClick={() => {
                              if (item.number) navigator.clipboard.writeText(item.number);
                            }}
                          >
                            <FiCopy className="h-3 w-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-x-3 gap-y-1 text-[11px] text-text-grey">
                          <div>
                            <div className="uppercase tracking-wide">Service</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {item.serviceName || item.serviceCode || "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="uppercase tracking-wide">Type</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {formatTypeLabel(item.type)}
                            </div>
                          </div>
                          <div>
                            <div className="uppercase tracking-wide">Date</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {(() => {
                                if (!item.date) return "N/A";
                                let dt = DateTime.fromISO(item.date);
                                if (!dt.isValid) dt = DateTime.fromSQL(item.date);
                                return dt.isValid ? dt.toFormat("MMM dd, yyyy") : item.date;
                              })()}
                            </div>
                          </div>
                          <div>
                            <div className="uppercase tracking-wide">Amount</div>
                            <div className="text-[11px] text-text-primary font-medium">
                              {formatAmount(item.amount)}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="uppercase tracking-wide">Order ID</div>
                            <button
                              type="button"
                              className="text-[11px] text-text-primary font-medium break-all underline decoration-dotted"
                              onClick={() => {
                                if (item.ID) navigator.clipboard.writeText(item.ID);
                              }}
                            >
                              {item.ID}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {canShowRenew(item) && (
                            <button
                              className="flex-1 bg-white text-quinary border border-quinary font-semibold rounded-full px-3 py-2 flex items-center justify-center gap-1 text-xs hover:bg-quaternary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              type="button"
                              disabled={renewingOrderId === item.ID}
                              onClick={() => handleOpenRenew(item)}
                            >
                              {renewingOrderId === item.ID ? (
                                <>
                                  <svg
                                    className="animate-spin h-3 w-3 text-quinary"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v8z"
                                    />
                                  </svg>
                                  <span>Checking...</span>
                                </>
                              ) : (
                                <span>Re-new</span>
                              )}
                            </button>
                          )}
                        <button
                          className="flex-1 bg-quaternary-light text-quinary font-semibold rounded-full px-3 py-2 flex items-center justify-center gap-1 text-xs hover:bg-quaternary transition-colors"
                          onClick={() => handleView(item)}
                        >
                          <AiFillEye className="h-4 w-4" />
                          <span>View details</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div
            className="hidden md:block bg-background rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 overflow-x-auto thin-scrollbar"
            style={{ maxHeight: "70vh", minHeight: 200, overflowY: "hidden" }}
          >
            <div
              ref={activeListRef}
              className="thin-scrollbar"
              style={{ display: activeTab === "Active" ? "block" : "none", maxHeight: "70vh", overflowY: "auto" }}
            >
              <table className="w-full thin-scrollbar">
                <thead className="sticky top-0 z-10 bg-background">
                  <tr className="text-left text-xs sm:text-sm">
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Type</th>
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Number/Email</th>
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Expiration</th>
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLoading ? (
                    <>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonTableRow key={i} cols={4} />
                      ))}
                    </>
                  ) : filteredActiveNumbers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-grey py-8">
                        <div className="flex flex-col items-center gap-4">
                          <span>No active rentals found.</span>
                          <div className="flex gap-2 w-full justify-center items-center">
                            <button
                              className="bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-4 py-1.5 text-sm flex items-center gap-2 transition-colors"
                              onClick={() => setBuyDropdownOpen(true)}
                            >
                              + Start Renting
                            </button>
                            <button
                              className="bg-quaternary-light text-quinary font-semibold rounded-full px-4 py-1.5 text-sm flex items-center gap-2 border border-quaternary transition-colors hover:bg-quaternary-light"
                              style={{ background: "none" }}
                              onClick={() => setActiveTab("Inactive")}
                            >
                              View Inactive Rentals
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredActiveNumbers.map((item) => (
                      <tr
                        key={item.ID}
                        className="border-b last:border-b-0 border-text-grey text-sm md:text-base"
                      >
                        <td className="py-3 px-2 sm:px-3 font-medium text-text-primary">
                          <div className="flex items-center gap-2">
                            {item.type === "email" ? (
                              <>
                                <FiMail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-blue-600 font-medium hidden sm:inline">Email</span>
                              </>
                            ) : (
                              <>
                                <FiPhone className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-green-600 font-medium hidden sm:inline">Number</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-3 font-medium text-text-primary">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-mono text-sm sm:text-base truncate">{item.number}</div>
                              <button
                                type="button"
                                className="px-2 py-1 rounded-full border border-gray-200 text-[10px] text-text-secondary flex items-center gap-1 active:scale-95"
                                onClick={() => {
                                  if (item.number) navigator.clipboard.writeText(item.number);
                                }}
                              >
                                <FiCopy className="h-3 w-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                            <div className="text-xs text-text-grey mt-1 truncate max-w-[120px] sm:max-w-[180px]">
                              {(item.serviceName || item.serviceCode || "").length > 15
                                ? (item.serviceName || item.serviceCode || "").slice(0, 15) + "..."
                                : (item.serviceName || item.serviceCode || "")}
                            </div>
                            <div className="mt-1 text-[11px] text-text-grey flex flex-wrap gap-x-2 gap-y-0.5">
                              <span>
                                Type:{" "}
                                <span className="text-text-primary">
                                  {formatTypeLabel(item.type)}
                                </span>
                              </span>
                              <span>
                                Amount:{" "}
                                <span className="text-text-primary">
                                  {formatAmount(item.amount)}
                                </span>
                              </span>
                              <span className="hidden lg:inline">
                                ID:{" "}
                                <button
                                  type="button"
                                  className="text-text-primary break-all underline decoration-dotted"
                                  onClick={() => {
                                    if (item.ID) navigator.clipboard.writeText(item.ID);
                                  }}
                                >
                                  {item.ID}
                                </button>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-3 font-semibold">
                          <span className={`text-sm sm:text-base ${isLessThanOneHour(getSecondsLeftForItem(item, countdownTick)) ? "text-danger" : "text-success"}`}>
                            {formatExpiration(getSecondsLeftForItem(item, countdownTick))}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-3">
                          <button
                            className="bg-quaternary-light text-quinary font-semibold rounded-full px-3 py-2 flex items-center gap-1 text-xs sm:text-sm hover:bg-quaternary transition-colors min-h-[36px] min-w-[36px]"
                            onClick={() => handleView(item)}
                          >
                            <span className="hidden sm:inline">View</span>
                            <AiFillEye className="h-4 w-4 sm:hidden" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {activeLoadingMore && (
                <div className="flex justify-center items-center py-4">
                  <svg className="animate-spin h-6 w-6 text-quinary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="ml-2 text-quinary font-semibold">Loading more...</span>
                </div>
              )}
            </div>

            <div
              ref={inactiveListRef}
              style={{ display: activeTab === "Inactive" ? "block" : "none", maxHeight: "70vh", overflowY: "auto" }}
            >
              <table className="w-full thin-scrollbar">
                <thead className="sticky top-0 z-10 bg-background">
                  <tr className="text-left text-xs sm:text-sm">
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Type</th>
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Number/Email</th>
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Date</th>
                    <th className="py-3 px-2 sm:px-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveLoading ? (
                    <>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonTableRow key={i} cols={4} />
                      ))}
                    </>
                  ) : filteredInactiveNumbers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-grey py-8">
                        <div className="flex flex-col items-center gap-4">
                          <span>No inactive rentals found.</span>
                          <div className="flex gap-2 w-full justify-center items-center">
                            <button
                              className="bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-4 py-1.5 text-sm flex items-center gap-2 transition-colors"
                              onClick={() => setBuyDropdownOpen(true)}
                            >
                              + Start Renting
                            </button>
                            <button
                              className="bg-quaternary-light text-quinary font-semibold rounded-full px-4 py-1.5 text-sm flex items-center gap-2 border border-quaternary transition-colors hover:bg-quaternary-light"
                              style={{ background: "none" }}
                              onClick={() => setActiveTab("Active")}
                            >
                              View Active Rentals
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInactiveNumbers.map((item) => (
                      <tr
                        key={item.ID}
                        className="border-b last:border-b-0 border-text-grey text-sm md:text-base"
                      >
                        <td className="py-3 px-2 sm:px-3 font-medium text-text-primary">
                          <div className="flex items-center gap-2">
                            {item.type === "email" ? (
                              <>
                                <FiMail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-blue-600 font-medium hidden sm:inline">Email</span>
                              </>
                            ) : (
                              <>
                                <FiPhone className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-green-600 font-medium hidden sm:inline">Number</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-3 font-medium text-text-primary">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-mono text-sm sm:text-base truncate">{item.number}</div>
                              <button
                                type="button"
                                className="px-2 py-1 rounded-full border border-gray-200 text-[10px] text-text-secondary flex items-center gap-1 active:scale-95"
                                onClick={() => {
                                  if (item.number) navigator.clipboard.writeText(item.number);
                                }}
                              >
                                <FiCopy className="h-3 w-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                            <div className="text-xs text-text-grey mt-1 truncate max-w-[120px] sm:max-w-[180px]">
                              {(item.serviceName || item.serviceCode || "").length > 15
                                ? (item.serviceName || item.serviceCode || "").slice(0, 15) + "..."
                                : (item.serviceName || item.serviceCode || "")}
                            </div>
                            <div className="mt-1 text-[11px] text-text-grey flex flex-wrap gap-x-2 gap-y-0.5">
                              <span>
                                Type:{" "}
                                <span className="text-text-primary">
                                  {formatTypeLabel(item.type)}
                                </span>
                              </span>
                              <span>
                                Amount:{" "}
                                <span className="text-text-primary">
                                  {formatAmount(item.amount)}
                                </span>
                              </span>
                              <span className="hidden lg:inline">
                                ID:{" "}
                                <span className="text-text-primary break-all">
                                  {item.ID}
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 sm:px-3 font-semibold">
                          <span className="text-xs sm:text-sm text-gray-600">
                            {item.date}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-3">
                          <div className="flex gap-2">
                            {canShowRenew(item) && (
                                <button
                                  className="bg-white text-quinary border border-quinary font-semibold rounded-full px-3 py-2 flex items-center gap-1 text-xs sm:text-sm hover:bg-quaternary-light transition-colors min-h-[36px] disabled:opacity-60 disabled:cursor-not-allowed"
                                  type="button"
                                  disabled={renewingOrderId === item.ID}
                                  onClick={() => handleOpenRenew(item)}
                                >
                                  {renewingOrderId === item.ID ? (
                                    <>
                                      <svg
                                        className="animate-spin h-3 w-3 text-quinary"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                          fill="none"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8v8z"
                                        />
                                      </svg>
                                      <span>Checking...</span>
                                    </>
                                  ) : (
                                    <span>Re-new</span>
                                  )}
                                </button>
                              )}
                            <button
                              className="bg-quaternary-light text-quinary font-semibold rounded-full px-3 py-2 flex items-center gap-1 text-xs sm:text-sm hover:bg-quaternary transition-colors min-h-[36px] min-w-[36px]"
                              onClick={() => handleView(item)}
                            >
                              <span className="hidden sm:inline">View</span>
                              <AiFillEye className="h-4 w-4 sm:hidden" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {inactiveLoadingMore && (
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
      </div>
      {/* Modal */}
      <NumberDetailsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (orderIdParam) {
            navigate("/dashboard/manage-numbers", { replace: true });
          }
        }}
        number={selectedNumber?.number}
        expiration={selectedNumber?.expiration}
        status={
          selectedNumber
            ? selectedNumber.status == 1
              ? "active"
              : "expired"
            : "expired"
        }
        verificationCode={verificationCode}
        onReload={handleReload}
        onCopyNumber={handleCopyNumber}
        onCopyCode={handleCopyCode}
        orderId={selectedNumber?.ID}
        serviceName={selectedNumber?.serviceName}
        serviceCode={selectedNumber?.serviceCode}
        date={(selectedNumber?.create_timestamp != null || "") ? selectedNumber.create_timestamp : selectedNumber?.date}
        expire_date={selectedNumber?.expire_date}
        onNumberClosed={handleNumberClosed}
        type={selectedNumber?.type || 'number'}
        reactive={selectedNumber?.reactive}
        canrenew={selectedNumber?.canrenew}
        onRenew={() => {
          if (selectedNumber) {
            return handleOpenRenew(selectedNumber);
          }
          return null;
        }}
      />
      <CustomModal
        open={renewModalOpen}
        onClose={() => {
          setRenewModalOpen(false);
          setRenewModalLoading(false);
          setRenewModalMessage("");
          setRenewModalPrice(null);
          setRenewModalOrderId(null);
          setRenewPriceId(null);
          setRenewSubmitLoading(false);
        }}
        title="Renew rental"
        showFooter={true}
        footerContent={
          <div className="flex justify-end gap-3 px-6 py-3 border-t border-border-grey bg-bgLayout/60">
            <button
              type="button"
              className="border border-quinary text-quinary rounded-full px-4 py-2 text-sm font-semibold hover:bg-quinary hover:text-white transition"
              onClick={() => {
                setRenewModalOpen(false);
                setRenewModalLoading(false);
                setRenewModalMessage("");
                setRenewModalPrice(null);
                setRenewModalOrderId(null);
                setRenewPriceId(null);
                setRenewSubmitLoading(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-quinary text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#ff8c1a] transition disabled:opacity-60"
              disabled={renewModalLoading || renewSubmitLoading || !renewModalOrderId || !renewPriceId}
              onClick={handleRenewProceed}
            >
              {renewSubmitLoading ? "Processing..." : "Proceed"}
            </button>
          </div>
        }
      >
        <div className="px-6 py-4">
          {renewModalLoading ? (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <svg className="animate-spin h-4 w-4 text-quinary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>Checking renewal price...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {renewModalPrice != null && (
                <>
                  <p className="text-sm text-text-primary">
                    This number may be renewed.
                  </p>
                  <p className="text-sm text-text-secondary text-[20px]">
                    Renewal price:{" "}
                    <span className="font-semibold text-text-primary">
                      {formatAmount(renewModalPrice)}
                    </span>
                  </p>
                  <p className="text-xs text-text-grey">
                    Click Proceed to continue (the renewal amount will be deducted from your balance) or Cancel to close.
                  </p>
                </>
              )}
              {renewModalPrice == null && renewModalMessage && (
                <p className="text-sm text-danger">
                  {renewModalMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </CustomModal>
      {/* Filter Modal */}
      <CustomModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Rentals"
        headerIcon={<FaFilter className="text-primary text-sm" />}
        showFooter={true}
        footerContent={
          <div className="flex gap-3 px-6 py-3 border-t border-border-grey bg-bgLayout/60 w-full">
            <button
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white hover:border-gray-400 transition-all active:scale-[0.98]"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="flex-[2] px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark shadow-sm hover:shadow transition-all active:scale-[0.98]"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        }
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contact Method</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              value={tempFilters.contact}
              onChange={(e) => setTempFilters(prev => ({ ...prev, contact: e.target.value }))}
            >
              <option value="">All Contacts</option>
              <option value="number">Number Only</option>
              <option value="email">Email Only</option>
            </select>
          </div>

          <div className={tempFilters.contact === "email" ? "opacity-50 pointer-events-none" : ""}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rental Type</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-gray-100"
              value={tempFilters.type}
              onChange={(e) => setTempFilters(prev => ({ ...prev, type: e.target.value }))}
              disabled={tempFilters.contact === "email"}
            >
              <option value="">All Types</option>
              <option value="short_term">Short Term</option>
              <option value="long_term">Long Term</option>
            </select>
          </div>

          <div className={tempFilters.contact === "email" ? "opacity-50 pointer-events-none" : ""}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Renewable Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-gray-100"
              value={tempFilters.canrenew}
              onChange={(e) => setTempFilters(prev => ({ ...prev, canrenew: e.target.value }))}
              disabled={tempFilters.contact === "email"}
            >
              <option value="">Any Status</option>
              <option value="1">Renewable Only</option>
              <option value="0">Non-Renewable Only</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">From Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={tempFilters.start_date}
                onChange={(e) => setTempFilters(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">To Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={tempFilters.end_date}
                onChange={(e) => setTempFilters(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ManageNumbers;
