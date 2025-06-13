import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";
import LoginRulesModal from "./LoginRulesModal";

const OrderConfirmedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get order details from navigation state
  const { order } = location.state || {};

  const [downloadOpen, setDownloadOpen] = React.useState(false);
  const downloadRef = React.useRef(null);
  const [rulesOpen, setRulesOpen] = React.useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setDownloadOpen(false);
      }
    }
    if (downloadOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [downloadOpen]);

  // Fallback: If no order, redirect to social-media-accounts
  React.useEffect(() => {
    if (!order) {
      navigate("/dashboard/social-media-accounts", { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="bg-background rounded-xl p-4 sm:p-8 ">
      <div className="border-b border-border-grey p-2 pb-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary mb-2 sm:mb-0">Order Confirmed</h2>
          <div className="relative" ref={downloadRef}>
            <Button
              variant="orange"
              size="sm"
              className="flex items-center gap-2 px-5 py-2"
              onClick={() => setDownloadOpen((open) => !open)}
            >
              Download Login Details
              <svg
                className="w-5 h-5 text-background"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            {downloadOpen && (
              <div className="absolute left-0 md:left-auto right-0 md:right-0 mt-2 px-3 py-3 w-52 bg-white rounded-xl shadow-lg z-50">
                <button
                  className="w-full text-left px-3 py-3 hover:bg-bgLayout text-primary font-medium"
                  onClick={() => {
                    setDownloadOpen(false);
                    alert("Download as PDF");
                  }}
                >
                  Download as PDF
                </button>
                <div className="border-t border-bgLayout" />
                <button
                  className="w-full text-left px-3 py-3 hover:bg-bgLayout text-primary font-medium"
                  onClick={() => {
                    setDownloadOpen(false);
                    alert("Download as txt");
                  }}
                >
                  Download as txt
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <span className="">Order ID – </span>
            <span className="text-primary font-mono font-bold">{order.orderId}</span>
          </div>
          <div>
            <span className="">Account ID – </span>
            <span className="text-primary font-mono font-bold">{order.accountId}</span>
          </div>
          <div>
            <span className="">Type of Account – </span>
            <span className="text-primary font-semibold font-bold">{order.accountType}</span>
          </div>
          <div>
            <span className="">Price – </span>
            <span className="text-primary font-bold font-bold">₦{order.price}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-2 mb-6 flex flex-col items-cente border-b-1 border-[#FFDE59]">
        <h3 className="text-xl md:text-2xl font-semibold text-primary text-left md:text-center px- md:px-2 mt-8 mb-0 md:mb-6 tracking-wide">
          ACCOUNT ACCESS DETAILS
        </h3>
        <div className="w-full px-0 md:px-8 pb-8">
          <div className="bg-background rounded-xl p-">
            <div className="mb-6 md:mb-2 flex items-center gap-2">
              <span className="font-semibold text-primary text-base">LOGIN 1 ID</span>
              <span className="font-semibold text-text-primary text-base">– {order.loginId}</span>
            </div>
            <div className="overflow-x-auto w-full">
              <p className="text-xs sm:text-sm font-mono text-text-secondary break-all whitespace-pre-wrap leading-relaxed min-w-[310px]">
                {order.loginDetails}
              </p>
            </div>
          </div>
          {/* Divider */}
          <div className="border-t border-bgLayout mt-6" />
          {/* View additional details button */}
          <button
            className="w-full flex items-center gap-6 text-left text-[16px] font-medium text-quinary mt-2 py-2 px- focus:outline-none"
            
            onClick={() => alert("Show additional details")}
          >
            View additional details
            <svg
              className="w-5 h-5 text-quinary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {/* Read Facebook Login Rules button */}
        
      </div>
      <div className="w-full flex justify-center md:justify-start pb-8">
          <Button
            variant="orange"
            size="md"
            className="w-full max-w-xs rounded-full shadow-md mt-2"
            onClick={() => setRulesOpen(true)}
          >
            Read {order.platform || "Facebook"} Login Rules
          </Button>
        </div>
        <LoginRulesModal
      open={rulesOpen}
      onClose={() => setRulesOpen(false)}
      platform={order.platform || "Facebook"}
    />
    </div>
   
  );
};

export default OrderConfirmedPage;
