import React, { useEffect, useState, useCallback, useRef } from "react";
import CustomModal from "../../common/CustomModal";
import { fetchNumberCode, closeNumber } from "../../../services/numberService";
import ToastPortal from "../common/ToastPortal";
import ConfirmDialog from "../../common/ConfirmDialog";
import { DateTime } from 'luxon';

// Helper: parse date string to UTC timestamp (seconds)
function parseDateToTimestamp(dateStr) {
  if (!dateStr) return null;
   return new Date(dateStr.replace(" ", "T")).getTime() / 1000; // Convert to seconds
}

// Helper: get current time in Africa/Lagos timezone in seconds
function getNowLagosSeconds() {
  const lagosTimeString =  DateTime.now().setZone('Africa/Lagos').toMillis();
  return Math.floor(lagosTimeString / 1000);
}

// Helper: get seconds left until expiration (using Lagos time)
function getSecondsLeft(dateStr, expiration) {
  if (!dateStr || !expiration) {  return 0;}
  // dateStr is the start time, expiration is seconds to add
  const startTs = parseDateToTimestamp(dateStr);
  const expireTs = startTs + Number(expiration);
  // Get current Lagos time in seconds
  const nowLagos = getNowLagosSeconds();
  // console.log(expireTs, nowLagos, dateStr);
  return expireTs - nowLagos;
}

// Helper: format seconds as h m s
function formatCountdown(secs) {
  if (secs <= 0) return "0s";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [
    h > 0 ? `${h}h` : "",
    m > 0 ? `${m}m` : "",
    s > 0 ? `${s}s` : "",
  ].filter(Boolean).join(" ");
}

// Helper: format date string as UTC for display
function formatUTCDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(/-/g, "/"));
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC"
  }) + " UTC";
}

const extractOtp = (msg) => {
  // Try to extract 4-8 digit code from message
  const match = msg && msg.match(/(\d{3,8}(-\d{3,8})?)/);
  return match ? match[0] : "";
};

const NumberDetailsModal = ({
  open,
  onClose,
  number,
  expiration, // this is seconds (duration)
  status,
  date,       // this is the start date/time string
  expire_date, // this is the absolute expiration date/time string (optional)
  onNumberClosed, // callback when number is closed
  orderId, // <-- add this prop!
  onReload,
  onCopyNumber,
  onCopyCode,
  verificationCode: initialVerificationCode,
}) => {
  const [messages, setMessages] = useState([]);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [isBackground, setIsBackground] = useState(false);
  const [toast, setToast] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [reloadDisabled, setReloadDisabled] = useState(false);
  const intervalRef = useRef();
  const countdownRef = useRef();

  // Calculate seconds left for countdown (using UTC)
  useEffect(() => {
    if (!open) return;
    let active = true;
    function updateCountdown() {
      let secs = 0;
      // Prefer expire_date if available, else use date + expiration
      if (expire_date) {
        const expireTs = parseDateToTimestamp(expire_date);
        const nowLagos = getNowLagosSeconds();
        secs = expireTs - nowLagos;
      } else if (date && expiration) {
        secs = getSecondsLeft(date, expiration);
      }
      if (active) setSecondsLeft(secs > 0 ? secs : 0);
    }
    updateCountdown();
    countdownRef.current = setInterval(updateCountdown, 1000);
    return () => {
      active = false;
      clearInterval(countdownRef.current);
    };
  }, [open, date, expiration, expire_date]);

  // Determine if number is still active based on countdown
  // status === 1 means active, and secondsLeft > 0 means not expired
  const isStillActive = status === 1 && secondsLeft > 0;

  // Fetch code/messages from API
  const fetchCode = useCallback(
    async (isBg = false) => {
      if (!orderId) return;
      if (!isBg) setCodeLoading(true);
      setCodeError("");
      try {
        const res = await fetchNumberCode(orderId);
        if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
          setMessages(res.data);
          // Only show toast if not background and there is a message
          if (!isBg && res.message) {
            setToast({
              type: "success",
              message: res.message,
            });
          }
        } else {
          setMessages([]);
          setCodeError(res.message || "No code found.");
          if (!isBg && res.message) {
            setToast({
              type: res.code === 200 ? "success" : "error",
              message: res.message,
            });
          }
        }
      } catch (err) {
        setMessages([]);
        setCodeError(err.message || "Failed to fetch code.");
        if (!isBg && err.message) {
          setToast({
            type: "error",
            message: err.message,
          });
        }
      } finally {
        if (!isBg) setCodeLoading(false);
      }
    },
    [orderId]
  );

  // Fetch code/messages on open
  useEffect(() => {
    if (open && orderId) {
      setIsBackground(false);
      fetchCode(false);
    }
    // eslint-disable-next-line
  }, [open, orderId]);

  // Reload handler
  const handleReload = async () => {
    setReloadDisabled(true);
    setIsBackground(false);
    if (onReload) onReload();
    await fetchCode(false);
    setReloadDisabled(false);
  };

  // Poll every 30s if active (background)
  useEffect(() => {
    if (open && isStillActive && orderId) {
      intervalRef.current = setInterval(() => {
        setIsBackground(true);
        fetchCode(true);
      }, 30000);
      return () => clearInterval(intervalRef.current);
    }
    // Always clear interval when modal is closed or not active
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [open, isStillActive, orderId, fetchCode]);

  // Copy number handler
  const handleCopyNumber = () => {
    if (number) navigator.clipboard.writeText(number);
    if (onCopyNumber) onCopyNumber();
  };

  // Copy OTP handler
  const handleCopyOtp = (otp) => {
    if (otp) navigator.clipboard.writeText(otp);
    if (onCopyCode) onCopyCode();
  };

  // Copy full message handler
  const handleCopyMessage = (msg) => {
    if (msg) navigator.clipboard.writeText(msg);
  };

  // Handle close number
  const handleCloseNumber = async () => {
    setCloseLoading(true);
    setConfirmOpen(false); // Close ConfirmDialog immediately on click "Yes"
    try {
      const res = await closeNumber(orderId);
      if (res.code === 200) {
        setToast({
          type: "success",
          message: res.message || "Number closed successfully.",
        });
        if (onNumberClosed) onNumberClosed(orderId);
        // Optionally, close modal or update UI
      } else {
        setToast({
          type: "error",
          message: res.message || "Failed to close number.",
        });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Failed to close number.",
      });
    } finally {
      setCloseLoading(false);
    }
  };

  if (!open) {
    // Always render ToastPortal if toast is set, even if modal is closed
    return (
      <>
        {toast && (
          <ToastPortal
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            timeout={toast.type === "success" ? 2500 : 5000}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* ConfirmDialog for closing number */}
      <ConfirmDialog
        open={confirmOpen}
        title="Close Number"
        message="Are you sure you want to close this number? This action cannot be undone."
        onConfirm={handleCloseNumber}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Yes, Close"
        cancelText="Cancel"
        loading={closeLoading}
      />
      <CustomModal
        open={open}
        onClose={onClose}
        title="Number Details"
        showFooter={false}
        className="max-w-xl"
        reloadAction={handleReload}
        closeable={true}
      >
        {/* Note */}
        <p className="px-6 pt-4 pb-2 text-[14px] text-text-secondary">
          Note: Number takes only 10 minutes for you to verify, it means it expires after 10 minutes. Please verify number immediately, if code is taking time, kindly reload number.
        </p>
        {/* Number Section */}
        <div className="px-6 py-4 mx-6 my-4 border-border-grey border-t border-b">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base">Number:</span>
            <span className="font-semibold text-quinary">{number}</span>
            <button onClick={handleCopyNumber} title="Copy number">
              <img src="/icons/copy-bold.svg" alt="Copy number" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                isStillActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isStillActive ? (
                <>
                  Active
                  <span className="text-green-700 font-medium ml-2">
                    ({formatCountdown(secondsLeft)})
                  </span>
                </>
              ) : (
                <>Expired</>
              )}
            </span>
            {expire_date && (
              <span className="text-xs text-text-grey ml-2">
                Expires at: {formatUTCDate(expire_date)}
              </span>
            )}
          </div>
        </div>
        {/* OTP Messages Section */}
        <div className="px-6 py-6 flex flex-col items-center w-full">
          <h3 className="text-center font-semibold text-lg mb-4">OTP MESSAGES</h3>
          <div className="w-full flex flex-col gap-4">
            {!isBackground && codeLoading ? (
              <div className="flex justify-center items-center py-8 text-quinary font-semibold text-lg">Loading...</div>
            ) : codeError ? (
              <div className="flex justify-center items-center py-8 text-danger text-sm">{codeError}</div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center py-8 text-gray-400">No OTP messages received yet.</div>
            ) : (
              messages.map((msgObj, idx) => {
                const otp = extractOtp(msgObj.message || "");
                return (
                  <div
                    key={msgObj.ID || idx}
                    className="flex flex-col md:flex-row md:items-center gap-2 bg-[#FFF4ED] border border-quinary rounded-lg px-4 py-3 shadow"
                  >
                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                      <div className="flex items-center gap-2">
                        {otp && (
                          <span
                            className="select-all bg-black text-white rounded-lg px-3 py-1 font-mono font-bold text-base cursor-pointer hover:bg-quinary transition"
                            title="Copy OTP"
                            onClick={() => handleCopyOtp(otp)}
                          >
                            {otp}
                          </span>
                        )}
                        <span className="text-xs text-text-secondary break-all flex-1">
                          {msgObj.message}
                          <button
                            className="ml-2 bg-quinary/10 hover:bg-quinary/20 rounded-full p-1 transition align-middle"
                            onClick={() => handleCopyMessage(msgObj.message)}
                            title="Copy full message"
                          >
                            <img src="/icons/copy-bold.svg" alt="Copy message" className="w-4 h-4" />
                          </button>
                        </span>
                      </div>
                    </div>
                    {msgObj.sender && (
                      <div className="text-xs text-text-grey mt-1 md:mt-0 md:ml-4">
                        From: <span className="font-semibold">{msgObj.sender}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CustomModal>
      {/* Toast is always rendered, above all components */}
      {toast && (
        <ToastPortal
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          timeout={toast.type === "success" ? 2500 : 5000}
        />
      )}
    </>
  );
};

export default NumberDetailsModal;
