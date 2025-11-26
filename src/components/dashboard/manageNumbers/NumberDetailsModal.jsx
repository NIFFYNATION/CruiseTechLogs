import React, { useEffect, useState, useCallback, useRef } from "react";
import CustomModal from "../../common/CustomModal";
import { fetchNumberCode, closeNumber, checkWhatsAppNumber } from "../../../services/numberService";
import { reactivateNumber } from "../../../services/rentalService";
import { FiMail, FiPhone } from "react-icons/fi";

// Feature flag to enable/disable WhatsApp verification
const ENABLE_WHATSAPP_CHECK = false;
import ToastPortal from "../common/ToastPortal";
import ConfirmDialog from "../../common/ConfirmDialog";
import { DateTime } from 'luxon';

// Helper: parse date string to UTC timestamp (seconds)
function parseDateToTimestamp(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  // Defensive: ensure dateStr is a string before replace
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
  // Defensive: ensure dateStr is a string
  // If dateStr is a number (timestamp), use it directly; else parse
  const startTs = typeof dateStr === "number"
    ? dateStr
    : parseDateToTimestamp(dateStr);
  const expireTs = startTs + Number(expiration);
  const nowLagos = getNowLagosSeconds();
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
  serviceName, // service name for WhatsApp verification
  serviceCode, // optional code for service (e.g., 'wa' for WhatsApp)
  onReload,
  onCopyNumber,
  onCopyCode,
  verificationCode: initialVerificationCode,
  type = 'number', // type of contact: 'number' or 'email'
  reactive = false, // whether reactivation is allowed (true or 1)
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
  const [whatsappStatus, setWhatsappStatus] = useState(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const intervalRef = useRef();
  const countdownRef = useRef();
  const [reactivateLoading, setReactivateLoading] = useState(false);
  const [reactivateDisabledUntil, setReactivateDisabledUntil] = useState(null);
  const [reactivated, setReactivated] = useState(false);

  // Determine if number is still active based on countdown
  // status === 1 or status === "active", and secondsLeft > 0 means not expired
  const isStillActive = ((status === "active" || status === 1) && secondsLeft > 0);
  
  // Determine actual active status based on type and message conditions
  const isActuallyActive = type === 'email'
    ? (isStillActive && messages.length === 0)
    : isStillActive;
  const isActiveForUI = isActuallyActive || reactivated;
  const canReactivate = ((reactive === true || reactive === 1));
  const isWhatsAppService = (serviceName?.toLowerCase() === 'whatsapp' || serviceCode?.toLowerCase() === 'wa');
  const showReactivateInstruction = (!isActiveForUI && canReactivate);
  // console.log(reactive);
  //   && !reactivateLoading
  //   && (!reactivateDisabledUntil || Date.now() >= reactivateDisabledUntil);

  // const canReactivate = true;
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

  // Calculate seconds left for countdown (using UTC)
  useEffect(() => {
    if (!open) return;
    let active = true;
    function updateCountdown() {
      let secs = 0;
      // Prefer expire_date if available, else use date + expiration
      if (date && expiration) {
        secs = getSecondsLeft(date, expiration);
      } else if (expire_date) {
        const expireTs = parseDateToTimestamp(expire_date);
        const nowLagos = getNowLagosSeconds();
        secs = expireTs - nowLagos;
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

  // Poll every 30s if active (background)
  useEffect(() => {
    if (!open) {
      clearInterval(intervalRef.current);
      return;
    }
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

  // Fetch code/messages on open
  useEffect(() => {
    if (open && orderId) {
      setIsBackground(false);
      fetchCode(false);
      checkWhatsAppVerification();
    }
    // eslint-disable-next-line
  }, [open, orderId, serviceName]);

  // Reload handler
  const handleReload = async () => {
    setReloadDisabled(true);
    setIsBackground(false);
    if (onReload) onReload();
    await fetchCode(false);
    setReloadDisabled(false);
  };

  // Reactivate handler
  const handleReactivate = async () => {
    if (!orderId) return;
    setReactivateLoading(true);
    try {
      const res = await reactivateNumber(orderId);
      const isSuccess = res && (res.code === 200 || res.status === 200 || res.status === 'success');
      if (isSuccess) {
        setToast({ type: "success", message: res.message || "Number reactivated successfully." });
        setReactivated(true);
        // Disable button for 3 minutes
        setReactivateDisabledUntil(Date.now() + 3 * 60 * 1000);
        // Optionally refresh number details
        if (onReload) onReload();
        setIsBackground(false);
        await fetchCode(false);
      } else {
        setToast({
          type: "error",
          message: res?.message || "We are having issue activating your number please try again.",
        });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to reactivate number." });
    } finally {
      setReactivateLoading(false);
    }
  };

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

  const checkWhatsAppVerification = async () => {
    if (!ENABLE_WHATSAPP_CHECK) return;
    
    if (serviceName?.toLowerCase() === "whatsapp" && number) {
      setWhatsappLoading(true);
      try {
        const result = await checkWhatsAppNumber(number);
        setWhatsappStatus(result);
      } catch (error) {
        setWhatsappStatus({
          code: 500,
          status: "error",
          message: "Failed to verify WhatsApp number",
          data: null
        });
      } finally {
        setWhatsappLoading(false);
      }
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
      {/* ConfirmDialog for closing number/email */}
      <ConfirmDialog
        open={confirmOpen}
        title={`Close ${type === 'email' ? 'Email' : 'Number'}`}
        message={`Are you sure you want to close this ${type === 'email' ? 'email' : 'number'}? This action cannot be undone.`}
        onConfirm={handleCloseNumber}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Yes, Close"
        cancelText="Cancel"
        loading={closeLoading}
      />
      <CustomModal
        open={open}
        onClose={onClose}
        title={type === 'email' ? "Email Details" : "Number Details"}
        showFooter={false}
        className="max-w-xl"
        reloadAction={handleReload}
        closeable={true}
      >
        {/* Note */}
        <p className="px-6 pt-4 pb-2 text-[14px] text-text-secondary">
        Note: The {type === 'email' ? 'email' : 'number'} is valid for the duration of the countdown. Please verify it as soon as possible. If the code is delayed, try reloading the {type === 'email' ? 'email' : 'number'}.
           </p>
        {/* WhatsApp usage instruction */}
        {isWhatsAppService && (
          <div className="px-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2 text-xs text-blue-800">
              <strong>WhatsApp Tip:</strong> Confirm this number is not already registered on WhatsApp before attempting to use it.
            </div>
          </div>
        )}
        {/* Reactivate instruction when button is available */}
        {showReactivateInstruction && (
          <div className="px-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2 text-xs text-yellow-800">
              <strong>Action Required:</strong> Click "Reactivate" before requesting or sending verification codes.
            </div>
          </div>
        )}
        {/* Number/Email Section */}
        <div className="px-6 py-4 mx-6 my-4 border-border-grey border-t border-b">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base">{type === 'email' ? 'Email:' : 'Number:'}</span>
            <span className="font-semibold text-quinary">{number}</span>
            <button onClick={handleCopyNumber} title={`Copy ${type === 'email' ? 'email' : 'number'}`}>
              <img src="/icons/copy-bold.svg" alt={`Copy ${type === 'email' ? 'email' : 'number'}`} />
            </button>
            {type === 'email' ? <FiMail className="ml-1 text-quinary" /> : <FiPhone className="ml-1 text-quinary" />}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                isActiveForUI
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isActiveForUI ? (
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
            {/* Add Close Number/Email button if active */}
            {isActiveForUI && (
              <button
                className="ml-4 bg-danger text-white rounded-full px-4 py-1 text-xs font-semibold hover:bg-danger/80 transition"
                onClick={() => setConfirmOpen(true)}
                disabled={closeLoading}
              >
                {closeLoading ? "Closing..." : `Close ${type === 'email' ? 'Email' : 'Number'}`}
              </button>
            )}
            {/* Reactivate button when eligible */}
            {!isActiveForUI && canReactivate && (
              <button
                className="ml-4 bg-quinary text-white rounded-full px-4 py-1 text-xs font-semibold hover:bg-quinary/80 transition disabled:opacity-50"
                onClick={handleReactivate}
                disabled={!canReactivate}
                title={`Reactivate ${type === 'email' ? 'Email' : 'Number'}`}
              >
                {reactivateLoading ? 'Reactivating...' : `Reactivate ${type === 'email' ? 'Email' : 'Number'}`}
              </button>
            )}
            {/* Disabled reactivate button (cooldown) */}
            {!isActiveForUI && (reactive === true || reactive === 1) && !canReactivate && (
              <button
                className="ml-4 bg-quinary text-white rounded-full px-4 py-1 text-xs font-semibold opacity-70 cursor-not-allowed"
                disabled
              >
                Reactivate available in 3 mins
              </button>
            )}
          </div>
        </div>
        {/* WhatsApp Verification Section */}
        {ENABLE_WHATSAPP_CHECK && serviceName?.toLowerCase() === "whatsapp" && (
          <div className="px-6 py-4 mx-6 my-4 border-border-grey border-t border-b">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-base">WhatsApp Status:</span>
              {whatsappLoading ? (
                <span className="text-blue-600 text-sm">Checking...</span>
              ) : whatsappStatus ? (
                <span
                   className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                     whatsappStatus.status === "success"
                       ? "bg-red-100 text-red-700"
                       : "bg-green-100 text-green-700"
                   }`}
                 >
                   {whatsappStatus.status === "success" ? "Registered" : "Not Registered"}
                 </span>
              ) : (
                <span className="text-gray-500 text-sm">Unknown</span>
              )}
            </div>
            {whatsappStatus && whatsappStatus.message && (
              <div className="text-xs text-text-grey mt-1">
                {whatsappStatus.message}
              </div>
            )}
          </div>
        )}
        {/* Verification Messages Section */}
        <div className="px-6 py-6 flex flex-col items-center w-full">
          <h3 className="text-center font-semibold text-lg mb-4">{type === 'email' ? 'VERIFICATION CODES' : 'OTP MESSAGES'}</h3>
          <div className="w-full flex flex-col gap-4">
            {!isBackground && codeLoading ? (
              <div className="flex justify-center items-center py-8 text-quinary font-semibold text-lg">Loading...</div>
            ) : codeError ? (
              <div className="flex justify-center items-center py-8 text-danger text-sm">{codeError}</div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center py-8 text-gray-400">
                {type === 'email' ? 'No verification codes received yet.' : 'No OTP messages received yet.'}
              </div>
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
