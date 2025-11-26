import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaTrash, FaChevronDown } from "react-icons/fa";
import { AiFillEye } from 'react-icons/ai'
import { FiMail, FiPhone } from "react-icons/fi";
import NumberDetailsModal from './NumberDetailsModal';
import { fetchNumbers, fetchNumberCode } from "../../../services/numberService";
import { getEmails, getEmailCode } from "../../../services/emailService";
import { useParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../common/SectionHeader";
import { SkeletonTableRow } from "../../common/Skeletons";
import { useUser } from "../../../contexts/UserContext";
import { triggerRentalCronjob } from "../../../services/rentalService";

const ManageNumbers = ({ orderId }) => {
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [refundRefreshing, setRefundRefreshing] = useState(false);
  const { user } = useUser();

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

  const activeListRef = useRef(null);
  const inactiveListRef = useRef(null);

  // For routing param support
  const params = useParams ? useParams() : {};
  const navigate = useNavigate();
  // Prefer prop, fallback to params
  const orderIdParam = orderId || params.orderId;

  // Dummy verification code for demo
  const verificationCode = "1234";

  // Fetch numbers and emails for active tab (only once)
  useEffect(() => {
    if (activeNumbers.length === 0 && activeEmails.length === 0) {
      setActiveLoading(true);
      
      // Fetch active numbers
      const fetchActiveNumbers = fetchNumbers({ status: "active", start: 0 })
        .then(({ numbers, next }) => {
          // Mark each number with type='number' if not already set
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
      
      // Fetch active emails
      const fetchActiveEmails = getEmails()
        .then(response => {
          if (response.status === "success" && Array.isArray(response.data)) {
            // Filter for active emails and format them to match number structure
            const activeEmailsData = response.data
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
            setActiveEmails(activeEmailsData);
            return activeEmailsData;
          }
          return [];
        })
        .catch(err => {
          console.error("Error fetching active emails:", err);
          return [];
        });
      
      // When both fetches complete, update loading state
      Promise.all([fetchActiveNumbers, fetchActiveEmails])
        .then(() => setActiveLoading(false));
    }
  // eslint-disable-next-line
  }, []);

  // Fetch inactive numbers and emails (only once)
  useEffect(() => {
    if (inactiveNumbers.length === 0 && inactiveEmails.length === 0) {
      setInactiveLoading(true);
      
      // Fetch inactive numbers
      const fetchInactiveNumbers = fetchNumbers({ status: "inactive", start: 0 })
        .then(({ numbers, next }) => {
          // Mark each number with type='number' if not already set
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
      const fetchInactiveEmails = getEmails()
        .then(response => {
          if (response.status === "success" && Array.isArray(response.data)) {
            // Filter for inactive emails and format them to match number structure
            const inactiveEmailsData = response.data
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
            setInactiveEmails(inactiveEmailsData);
            return inactiveEmailsData;
          }
          return [];
        })
        .catch(err => {
          console.error("Error fetching inactive emails:", err);
          return [];
        });
      
      // When both fetches complete, update loading state
      Promise.all([fetchInactiveNumbers, fetchInactiveEmails])
        .then(() => setInactiveLoading(false));
    }
  }, [inactiveNumbers.length, inactiveEmails.length]);

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
      fetchNumbers({ status: "active", start: activeNext })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          setActiveNumbers(prev => [...prev, ...moreNumbers]);
          setActiveNext(newNext);
        })
        .finally(() => setActiveLoadingMore(false));
    }
  }, [activeLoadingMore, activeLoading, activeNext]);

  // Infinite scroll handler for inactive
  const handleInactiveScroll = useCallback(() => {
    if (inactiveLoadingMore || inactiveLoading || inactiveNext == null) return;
    const el = inactiveListRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      setInactiveLoadingMore(true);
      fetchNumbers({ status: "inactive", start: inactiveNext })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          setInactiveNumbers(prev => [...prev, ...moreNumbers]);
          setInactiveNext(newNext);
        })
        .finally(() => setInactiveLoadingMore(false));
    }
  }, [inactiveLoadingMore, inactiveLoading, inactiveNext]);

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
      fetchNumbers({ status: "active", start: activeNext })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          setActiveNumbers(prev => [...prev, ...moreNumbers]);
          setActiveNext(newNext);
        })
        .finally(() => setActiveLoadingMore(false));
    }
  }, [activeNumbers, activeNext, activeLoading, activeLoadingMore]);

  // Auto-load next batch if content is not scrollable but more data exists (inactive)
  useEffect(() => {
    const el = inactiveListRef.current;
    if (!el || inactiveLoading || inactiveLoadingMore) return;
    if (inactiveNext != null && el.scrollHeight <= el.clientHeight + 10) {
      setInactiveLoadingMore(true);
      fetchNumbers({ status: "inactive", start: inactiveNext })
        .then(({ numbers: moreNumbers, next: newNext }) => {
          setInactiveNumbers(prev => [...prev, ...moreNumbers]);
          setInactiveNext(newNext);
        })
        .finally(() => setInactiveLoadingMore(false));
    }
  }, [inactiveNumbers, inactiveNext, inactiveLoading, inactiveLoadingMore]);

  // Filtering (apply search to both active and inactive numbers and emails)
  const filteredActiveNumbers = [...activeNumbers, ...activeEmails].filter((n) => {
    const numStr = n.number?.toString() || "";
    const serviceStr = n.serviceName?.toLowerCase() || "";
    const typeStr = n.type?.toLowerCase() || "";
    const searchStr = search.toLowerCase();
    return (
      n.status === 1 &&
      (searchStr === "" ||
        numStr.includes(searchStr) ||
        serviceStr.includes(searchStr) ||
        typeStr.includes(searchStr))
    );
  });
  const filteredInactiveNumbers = [...inactiveNumbers, ...inactiveEmails].filter((n) => {
    const numStr = n.number?.toString() || "";
    const serviceStr = n.serviceName?.toLowerCase() || "";
    const typeStr = n.type?.toLowerCase() || "";
    const searchStr = search.toLowerCase();
    return (
      n.status !== 1 &&
      (searchStr === "" ||
        numStr.includes(searchStr) ||
        serviceStr.includes(searchStr) ||
        typeStr.includes(searchStr))
    );
  });

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
          className="bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm flex items-center gap-2 transition-colors min-h-[40px] sm:min-h-[44px] touch-manipulation"
          onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
        >
          <span className="hidden xs:inline text-xs sm:text-sm">Buy</span>
          <span className="xs:hidden text-lg">+Rent</span>
          <FaChevronDown className={`transition-transform text-xs sm:text-sm ${buyDropdownOpen ? 'rotate-180' : ''}`} />
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
    <div className="px-2 sm:px-6 lg:px-6 ml-6">
      {/* Unified Responsive Table */}
      <div className="mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 ms-3">
          <div className="flex justify-between">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary">Manage Rentals</h1>
            <BuyDropdown />
          </div>
        </div>
        
        <div className="ms-3">

       
        {/* Tabs and Search */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4 border-b border-[#ECECEC] mb-6 lg:mb-10">
          <div className="flex gap-6 sm:gap-8">
            {["Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                className={`pb-3 text-base sm:text-lg font-medium transition-colors min-h-[44px] ${
                  activeTab === tab
                    ? "border-b-2 lg:border-b-3 border-primary text-primary"
                    : "text-text-grey hover:text-text-primary"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex bg-background rounded-lg border border-gray-200 px-3 py-2 items-center w-full sm:max-w-xs lg:max-w-sm">
            <FaSearch className="text-text-grey mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search numbers, emails or services"
              className="outline-none bg-transparent text-sm text-text-secondary w-full min-w-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {/* Refund Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
          <div className="items-center justify-between gap-3">
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
        {/* Responsive Table */}
        <div
          className="bg-background rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 overflow-x-auto thin-scrollbar ms-3"
          style={{ maxHeight: "70vh", minHeight: 200, overflowY: "hidden" }}
        >
          {/* Active Table */}
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
                          {item.type === 'email' ? (
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
                          <div className="font-mono text-sm sm:text-base truncate">{item.number}</div>
                          <div className="text-xs text-text-grey mt-1 truncate max-w-[120px] sm:max-w-[180px]">
                            {item.serviceName && item.serviceName.length > 15
                              ? item.serviceName.slice(0, 15) + "..."
                              : item.serviceName}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-3 font-semibold">
                        <span className={`text-sm sm:text-base ${
                          isLessThanOneHour(item.expiration) ? "text-danger" : "text-success"
                        }`}>
                          {formatExpiration(item.expiration)}
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
          {/* Inactive Table */}
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
                          {item.type === 'email' ? (
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
                          <div className="font-mono text-sm sm:text-base truncate">{item.number}</div>
                          <div className="text-xs text-text-grey mt-1 truncate max-w-[120px] sm:max-w-[180px]">
                            {item.serviceName && item.serviceName.length > 15
                              ? item.serviceName.slice(0, 15) + "..."
                              : item.serviceName}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-3 font-semibold">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {item.date}
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
      {/* Modal */}
      <NumberDetailsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // Remove orderId from URL if present
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
      />
    </div>
  );
};

export default ManageNumbers;
