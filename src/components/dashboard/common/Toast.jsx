import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const typeStyles = {
  success: "bg-green-500/60 border-green-400/40",
  error: "bg-red-500/50 border-red-400/40",
  warning: "bg-yellow-400/60 border-yellow-300/40 text-black",
  info: "bg-blue-500/60 border-blue-400/40",
};

const icons = {
  success: (
    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 mr-2 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const positionStyles = {
  "top-center": "left-1/2 -translate-x-1/2 top-6",
  "top-right": "right-6 top-6",
  "bottom-center": "left-1/2 -translate-x-1/2 bottom-6",
  "bottom-right": "right-6 bottom-6",
  "bottom-left": "left-6 bottom-6",
  "top-left": "left-6 top-6",
};

const Toast = ({
  type = "info",
  message = "",
  onClose,
  timeout = 4000,
  className = "",
  position = "top-center", // default to middle top
}) => {
  useEffect(() => {
    if (!timeout) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.4 }}
        className={`
          fixed z-[9999] flex items-center px-3 py-3
          rounded-2xl shadow-2xl min-w-[220px] max-w-xs
          border backdrop-blur-md bg-clip-padding
          ${typeStyles[type] || typeStyles.info}
          bg-opacity-50
          transition-all duration-300
          ${positionStyles[position] || positionStyles["top-center"]}
          ${className}
        `}
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        role="alert"
      >
        <div className="flex items-center flex-1">
          {icons[type] || icons.info}
          <span className="font-medium text-white" style={{ wordBreak: "break-word" }}>{message}</span>
        </div>
        <button
          className="ml-4 text-lg font-bold opacity-60 hover:opacity-100 transition flex-shrink-0"
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          {type === "error" ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <span>&times;</span>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
