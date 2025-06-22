import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserTransactions } from "../../../services/userService";
import { money_format, truncate } from "../../../utils/formatUtils"; // <-- use utilities
import SectionHeader from "../../common/SectionHeader";
import { SkeletonTableRow } from "../../common/Skeletons";

const Transactions = ({
  onFundWallet,
  fundButton = null,
  isRecent = false,
  title = "Transactions",
}) => {
  const [transactions, setTransactions] = useState([]);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expanded, setExpanded] = useState({}); // { [id]: true }
  const navigate = useNavigate();

  const listRef = useRef(null);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchUserTransactions({ start: 0 })
      .then((res) => {
        setTransactions(res.transactions || []);
        setNext(res.next || null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Infinite scroll handler (disabled if isRecent)
  const handleScroll = useCallback(() => {
    if (isRecent || loadingMore || loading || next == null) return;
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      setLoadingMore(true);
      fetchUserTransactions({ start: next })
        .then((res) => {
          setTransactions((prev) => [...prev, ...(res.transactions || [])]);
          setNext(res.next || null);
        })
        .finally(() => setLoadingMore(false));
    }
  }, [isRecent, loadingMore, loading, next]);

  // Attach scroll event
  useEffect(() => {
    if (isRecent) return;
    const el = listRef.current;
    if (!el || next == null) return;
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, next, isRecent]);

  // Auto-load next batch if content is not scrollable but more data exists
  useEffect(() => {
    if (isRecent) return;
    const el = listRef.current;
    if (!el || loading || loadingMore) return;
    if (next != null && el.scrollHeight <= el.clientHeight + 10) {
      setLoadingMore(true);
      fetchUserTransactions({ start: next })
        .then((res) => {
          setTransactions((prev) => [...prev, ...(res.transactions || [])]);
          setNext(res.next || null);
        })
        .finally(() => setLoadingMore(false));
    }
  }, [transactions, next, loading, loadingMore, isRecent]);

  // Toggle expand/collapse for a row
  const toggleExpand = (id, e) => {
    if (e) e.stopPropagation();
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mt-5">
      <div className="bg-white rounded-lg shadow p-4 sm:p-8">
        {/* Sticky Header with Fund Account Button */}
        <SectionHeader
          title={title}
          buttonText={!fundButton ? "Fund Account" : undefined}
          onButtonClick={!fundButton ? () => navigate("/dashboard/wallet") : undefined}
        >
          {fundButton}
        </SectionHeader>

        {/* Table */}
        <div
          ref={listRef}
          className="max-w-[330px] sm:max-w-[650px] lg:max-w-full w-full overflow-x-auto"
          style={{ maxHeight: "70vh", minHeight: 200, overflowY: "auto" }}
        >
          <table className="min-w-[700px] overflow-x-auto w-full text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-text-secondary border-b border-bgLayout ">
                <th className="py-2 px-1">View</th>
                <th className="py-2 px-1">Type</th>
                <th className="py-2 px-1">Amount</th>
                <th className="py-2 px-1 sm:table-cell">Action</th>
                <th className="py-2 px-1 sm:table-cell">Current</th>
                {/* Hide on small screens */}
                <th className="py-2 px-1 hidden sm:table-cell">ID</th>
                <th className="py-2 px-1 hidden sm:table-cell">Service ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonTableRow key={i} cols={7} />)
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-tertiary">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <React.Fragment key={tx.ID || idx}>
                    <tr
                      className={`border-b border-bgLayout text-xs sm:text-sm cursor-pointer transition 
                        ${
                          tx.action_type === "credit"
                            ? "bg-green-50/30"
                            : tx.action_type === "debit"
                            ? "bg-red-50/30"
                            : ""
                        }
                        ${expanded[tx.ID] ? "bg-quaternary-light/30" : ""}`}
                    >
                      <td className="py-2 px-1">
                        <button
                          className="bg-quinary text-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-quaternary transition"
                          onClick={e => toggleExpand(tx.ID, e)}
                          title={expanded[tx.ID] ? "Hide Details" : "View Details"}
                        >
                          {expanded[tx.ID] ? "Hide" : "View"}
                        </button>
                      </td>
                      <td className="py-2 px-1">
                        <span className="font-semibold text-text-primary">{tx.trans_for}</span>
                        <p className="text-xs text-tertiary">{tx.date}</p>
                      </td>
                      <td
                        className={`py-2 px-1 font-semibold `}
                      >
                        {money_format(tx.amount)}
                      </td>
                      <td
                        className={`py-2 px-1 font-semibold 
                        `}
                      >
                        {tx.action_type === "credit" ? (
                          <span className="text-success capitalize">Credit</span>
                        ) : (
                          <span className="text-danger capitalize">Debit</span>
                        )}
                      </td>
                      <td className="py-2 px-1 font-semibold text-primary">{money_format(tx.current_balance)}</td>
                      {/* Only show on sm+ */}
                      <td className="py-2 px-1 hidden sm:table-cell">{tx.ID}</td>
                      <td className="py-2 px-1 text-text-primary max-w-[90px] truncate hidden sm:table-cell" title={tx.forID}>
                        {truncate(tx.forID, 12)}
                      </td>
                    </tr>
                    {expanded[tx.ID] && (
                      <tr className="bg-[#FFF4ED] border-b border-bgLayout">
                        <td colSpan={7} className="py-2 px-2">
                          <div className="flex flex-col gap-2 text-xs sm:text-sm">
                            <div className="sm:hidden">
                              <span className="font-semibold text-text-secondary">ID:</span>{" "}
                              <span className="font-mono">{tx.ID}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-text-secondary">Transaction ID:</span>{" "}
                              <span className="font-mono">{tx.transID || "N/A"}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-text-secondary">User ID:</span>{" "}
                              <span className="font-mono">{tx.userID}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-text-secondary">Account Type:</span>{" "}
                              <span className="font-mono">{tx.acct_type}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-text-secondary">Amount Left:</span>{" "}
                              <span className="font-mono">{money_format(tx.amount_left)}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-text-secondary">Order/For ID:</span>{" "}
                              <span className="font-mono">{tx.forID}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-text-secondary">Order Type:</span>{" "}
                              <span className="font-mono">{tx.trans_for}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-text-secondary">Date:</span>{" "}
                              <span className="font-mono">{tx.date}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
          {loadingMore && (
            <div className="flex justify-center items-center py-4">
              <svg className="animate-spin h-6 w-6 text-quinary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="ml-2 text-quinary font-semibold">Loading more...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;