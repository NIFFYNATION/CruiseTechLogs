import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { AiFillEye } from 'react-icons/ai'
import NumberDetailsModal from './NumberDetailsModal';
import { fetchNumbers } from "../../../services/numberService";
import { useParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../common/SectionHeader";
import { SkeletonTableRow } from "../../common/Skeletons";

const ManageNumbers = ({ orderId }) => {
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);

  // Separate state for active/inactive numbers and pagination
  const [activeNumbers, setActiveNumbers] = useState([]);
  const [inactiveNumbers, setInactiveNumbers] = useState([]);
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

  // Fetch numbers for active tab (only once)
  useEffect(() => {
    if (activeNumbers.length === 0) {
      setActiveLoading(true);
      fetchNumbers({ status: "active", start: 0 })
        .then(({ numbers, next }) => {
          setActiveNumbers(numbers);
          setActiveNext(next);
        })
        .finally(() => setActiveLoading(false));
    }
    // eslint-disable-next-line
  }, []);

  // Fetch numbers for inactive tab (only once)
  useEffect(() => {
    if (inactiveNumbers.length === 0) {
      setInactiveLoading(true);
      fetchNumbers({ status: "inactive", start: 0 })
        .then(({ numbers, next }) => {
          setInactiveNumbers(numbers);
          setInactiveNext(next);
        })
        .finally(() => setInactiveLoading(false));
    }
    // eslint-disable-next-line
  }, []);

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

  // Filtering (apply search to both active and inactive numbers)
  const filteredActiveNumbers = activeNumbers.filter((n) => {
    const numStr = n.number?.toString() || "";
    const serviceStr = n.serviceName?.toLowerCase() || "";
    const searchStr = search.toLowerCase();
    return (
      n.status === 1 &&
      (searchStr === "" ||
        numStr.includes(searchStr) ||
        serviceStr.includes(searchStr))
    );
  });
  const filteredInactiveNumbers = inactiveNumbers.filter((n) => {
    const numStr = n.number?.toString() || "";
    const serviceStr = n.serviceName?.toLowerCase() || "";
    const searchStr = search.toLowerCase();
    return (
      n.status !== 1 &&
      (searchStr === "" ||
        numStr.includes(searchStr) ||
        serviceStr.includes(searchStr))
    );
  });

  // Handler for "View" button
  const handleView = (numberObj) => {
    setSelectedNumber(numberObj);
    setModalOpen(true);
    // If orderId is in URL, remove it for clean navigation after manual open
    if (orderIdParam) {
      navigate("/dashboard/manage-numbers", { replace: true });
    }
  };

  // Handler for when a number is closed
  const handleNumberClosed = (orderId) => {
    setActiveNumbers((prev) => prev.filter((n) => n.ID !== orderId));
    setInactiveNumbers((prev) => [
      ...prev,
      ...(activeNumbers.filter((n) => n.ID === orderId).map((n) => ({
        ...n,
        status: 0,
        date: new Date().toISOString().slice(0, 19).replace("T", " "),
      })))],
    );
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

  return (
    <div className="">
      {/* Unified Responsive Table */}
      <div className="mt-4 sm:mt-6">
        <SectionHeader
          title="Manage Numbers"
          buttonText="+ Buy Number"
          onButtonClick={() => navigate('/dashboard/buy-numbers')}
        />

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b border-[#ECECEC] mb-6 md:mb-10 px-2 md:px-0">
          <div className="flex gap-8">
            {["Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 md:pb-0 text-base md:text-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "border-b-2 md:border-b-3 border-primary text-primary"
                    : "text-text-grey"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
        </div>
          <div className="flex bg-background rounded-lg border-none px-3 py-2 mb-2 md:mb-0 items-center max-w-xs">
            
          <FaSearch className="text-text-grey mr-2" />
          <input
            type="text"
            placeholder="Search numbers or service type"
            className="outline-none bg-transparent text-sm text-text-secondary w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        </div>
        
        {/* Refund Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
          <p className="mb-1">
            <strong>Refund Information:</strong> If your refund is taking too long to process, please reload the page to refresh your refund status.
          </p>
        </div>
        
        {/* Responsive Table */}
        <div
          className="bg-background rounded-2xl shadow p-2 md:p-4 overflow-x-auto thin-scrollbar"
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
                <tr className="text-left text-xs md:text-sm">
                <th className="py-2 px-2">Number</th>
                <th className="py-2 px-2">Expiration</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
                {activeLoading ? (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonTableRow key={i} cols={3} />
                    ))}
                  </>
                ) : filteredActiveNumbers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-grey py-8">
                      <div className="flex flex-col items-center gap-4">
                        <span>No numbers found.</span>
                        <div className="flex  gap-2 w-full justify-center items-center">
                          <button
                            className="bg-quinary hover:bg-[#ff8c1a] text-white font-semibold rounded-full px-4 py-1.5 text-sm flex items-center gap-2 transition-colors"
                            onClick={() => navigate('/dashboard/buy-numbers')}
                          >
                            + Buy Number
                          </button>
                          <button
                            className="bg-quaternary-light text-quinary font-semibold rounded-full px-4 py-1.5 text-sm flex items-center gap-2 border border-quaternary transition-colors hover:bg-quaternary-light"
                            style={{ background: "none" }}
                            onClick={() => setActiveTab("Inactive")}
                          >
                            View Inactive Numbers
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredActiveNumbers.map((n) => (
                    <tr
                      key={n.ID}
                      className="border-b last:border-b-0 border-text-grey text-sm md:text-base"
                    >
                      <td className="py-3 px-2 font-medium text-text-primary">
                        {n.number}
                        <div className="text-xs text-text-grey mt-1 truncate max-w-[180px]">
                          {n.serviceName && n.serviceName.length > 20
                            ? n.serviceName.slice(0, 20) + "..."
                            : n.serviceName}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        <span className={isLessThanOneHour(n.expiration) ? "text-danger" : "text-success"}>
                          {formatExpiration(n.expiration)}
                      </span>
                  </td>
                  <td className="py-3 px-2">
                        <button
                          className="bg-quaternary-light text-quinary font-semibold rounded-full px-2 py-1 flex items-center gap-1 text-sm"
                          onClick={() => handleView(n)}
                        >
                          View <span className="text-xs"><AiFillEye className="text-quinary" /></span>
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
          <table className="w-full">
              <thead className="sticky top-0 z-10 bg-background">
                <tr className="text-left text-xs md:text-sm">
                <th className="py-2 px-2">Number</th>
                  <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
                {inactiveLoading ? (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonTableRow key={i} cols={3} />
                    ))}
                  </>
                ) : filteredInactiveNumbers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-grey py-8">
                      <div className="flex flex-col items-center gap-4">
                        <span>No inactive numbers found.</span>
                        <div className="text-xs text-text-secondary max-w-xs mx-auto">
                          You have no expired or used numbers yet.<br />
                          Numbers will appear here after they expire or are used.<br />
                          <span className="font-semibold">Tip:</span> Buy a number and use it for verification. Once expired, it will show here for your records.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInactiveNumbers.map((n) => (
                    <tr
                      key={n.ID}
                      className="border-b last:border-b-0 border-text-grey text-sm md:text-base"
                    >
                      <td className="py-3 px-2 font-medium text-text-primary">
                        {n.number}
                        <div className="text-xs text-text-grey mt-1 truncate max-w-[180px]">
                          {n.serviceName && n.serviceName.length > 20
                            ? n.serviceName.slice(0, 20) + "..."
                            : n.serviceName}
                        </div>
                      </td>
                      <td className="font-semibold">
                        <span className="font-semibold rounded-full text-xs">
                          {n.date}
                        </span>
                  </td>
                  <td className="py-3 px-2">
                        <button
                          className="bg-quaternary-light text-quinary font-semibold rounded-full px-2 py-1 flex items-center gap-1 text-sm"
                          onClick={() => handleView(n)}
                        >
                        View <span className="text-xs"><AiFillEye className="text-quinary" /></span>
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
        date={(selectedNumber?.create_timestamp != null || "") ? selectedNumber.create_timestamp : selectedNumber?.date}
        expire_date={selectedNumber?.expire_date}
        onNumberClosed={handleNumberClosed}
      />
    </div>
  );
};

export default ManageNumbers;
