import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserAccounts } from '../services/userService';
import { fetchNumbers, fetchNumberCode } from '../services/numberService';
import { fetchUserDetails } from '../controllers/userController';
import BalanceCard from './dashboard/cards/BalanceCard';
import { FiCopy } from 'react-icons/fi';
import Toast from './common/Toast';
import { DateTime } from 'luxon';
import { SkeletonCard } from "./common/Skeletons";

const overlayVariants = {
  hidden: { opacity: 0, pointerEvents: 'none' },
  visible: { opacity: 1, pointerEvents: 'auto' },
  exit: { y: 50, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

const menuVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  exit: { y: 50, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

// Helper: get seconds left until expiration (using Lagos time)
function getSecondsLeft(dateStr, expiration) {
  if (!dateStr || !expiration) return 0;
  const startTs = typeof dateStr === "number"
  ? dateStr
  : parseDateToTimestamp(dateStr);
  // const startTs = new Date(dateStr.replace(" ", "T")).getTime() / 1000;
  const expireTs = startTs + Number(expiration);
  const nowLagos =  getNowLagosSeconds();
  return expireTs - nowLagos;
}

function getNowLagosSeconds() {
  const lagosTimeString =  DateTime.now().setZone('Africa/Lagos').toMillis();
  return Math.floor(lagosTimeString / 1000);
}
function parseDateToTimestamp(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  // Defensive: ensure dateStr is a string before replace
  return new Date(dateStr.replace(" ", "T")).getTime() / 1000; // Convert to seconds
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

const QuickAction = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition">
      <div className="w-12 h-12 bg-white/50 dark:bg-gray-800/50 rounded-full flex items-center justify-center shadow-md">
        <img src={icon} alt={label} className="w-6 h-6 [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)]" />
      </div>
      <span className="text-xs text-center text-gray-800 dark:text-gray-200 font-semibold">{label}</span>
    </button>
  );

const MobileTabMenu = ({ onClose }) => {
  const [accounts, setAccounts] = useState([]);
  const [activeNumber, setActiveNumber] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [messages, setMessages] = useState([]);
  const [codeLoading, setCodeLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showAccount, setShowAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const countdownRef = useRef();

  // Fetch initial data on open
  useEffect(() => {
    setLoading(true);
    fetchUserDetails(); // Refresh user balance
    fetchUserAccounts().then(setAccounts).catch(() => setAccounts([]));
    fetchNumbers({ status: 'active', start: 0 }).then(({ numbers }) => {
      if (numbers.length > 0) {
        setActiveNumber(numbers[0]);
      }
      setLoading(false);
    });
  }, []);

  // Timer to hide account number
  useEffect(() => {
    if (accounts.length > 0 && showAccount) {
      const timer = setTimeout(() => {
        setShowAccount(false);
      }, 7000); // 7 seconds
      return () => clearTimeout(timer);
    }
  }, [accounts, showAccount]);

  // Countdown timer for active number
  useEffect(() => {
    if (!activeNumber) return;
    const update = () => {
      const secs = getSecondsLeft(activeNumber.create_timestamp ?? activeNumber.date, activeNumber.expiration);
      setSecondsLeft(secs > 0 ? secs : 0);
    };
    update();
    countdownRef.current = setInterval(update, 1000);
    return () => clearInterval(countdownRef.current);
  }, [activeNumber]);

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };
  
  const handleFetchCode = useCallback(async () => {
    if (!activeNumber) return;
    setCodeLoading(true);
    const res = await fetchNumberCode(activeNumber.ID);
    if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
      setMessages(res.data);
    } else {
      setToast({ show: true, type: 'error', message: res.message || "No code found." });
    }
    setCodeLoading(false);
  }, [activeNumber]);

  return (
  <AnimatePresence>
      {toast.show && <Toast type={toast.type || "success"} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />}
    <motion.div
        className="fixed inset-0 bg-black/20 z-50 backdrop-blur-md"
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
    />
    <motion.div
        className="fixed left-0 right-0 mx-auto bottom-32 z-50 flex flex-col items-center w-[90vw] max-w-lg"
      initial="hidden"
      animate="visible"
        exit="exit"
      variants={menuVariants}
    >
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 w-full shadow-2xl shadow-black/20 max-h-[calc(100vh-150px)] overflow-y-auto thin-scrollbar">
          <div className="mb-2">
            {loading ? <SkeletonCard className="min-h-[80px]" /> : <BalanceCard isSimple={true} />}
          </div>

          {loading ? (
            <SkeletonCard className="max-h-[100px] mb-4" />
          ) : activeNumber && secondsLeft > 0 && (
             <div 
                className="bg-black/5 dark:bg-white/5 p-3 rounded-lg mb-4 cursor-pointer hover:bg-black/10"
                onClick={() => handleNavigate(`/dashboard/manage-numbers/${activeNumber.ID}`)}
              >
               <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Active Number</h3>
                 <span className="text-sm font-bold text-green-600">{formatCountdown(secondsLeft)}</span>
               </div>
                <div className="flex items-center justify-between">
                    <p className="font-mono text-gray-800 dark:text-gray-200">{activeNumber.number}</p>
                    <button onClick={handleFetchCode} className="text-xs bg-orange-500 text-white font-semibold px-2 py-1 rounded-md hover:bg-orange-600 transition" disabled={codeLoading}>
                      {codeLoading ? 'Checking...' : 'Check Code'}
                    </button>
                </div>
                 {messages.length > 0 && (
                    <div className="mt-2 text-xs border-t border-black/10 dark:border-white/10 pt-2">
                        <p className="text-gray-700 dark:text-gray-300 truncate">{messages[messages.length - 1].message}</p>
                    </div>
                 )}
             </div>
          )}

          {loading ? (
            <SkeletonCard className="min-h-[80px] mb-4" />
          ) : accounts.length > 0 && (
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg mb-4">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Virtual Account</h3>
              {accounts.map(acc => (
                <div key={acc.account_number} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{acc.bank_name}</span>
                   
                        <p className="text-lg font-mono text-gray-800 dark:text-gray-200">{acc.account_number}</p>
                    
                  </div>
                  <button onClick={() => handleCopy(acc.account_number, "Account number copied!")} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                    <FiCopy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
              </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <QuickAction icon="/icons/wallet.svg" label="Fund Wallet" onClick={() => handleNavigate('/dashboard/wallet')} />
            <QuickAction icon="/icons/buy-number.svg" label="Numbers" onClick={() => handleNavigate('/dashboard/manage-numbers')} />
            <QuickAction icon="/icons/social-media.svg" label="Accounts" onClick={() => handleNavigate('/dashboard/manage-orders')} />
        </div>
      </div>
      {/* Arrow */}
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-white/70 dark:border-t-gray-800/70 translate-x-[6px]" />
    </motion.div>
  </AnimatePresence>
);
};

export default MobileTabMenu;
