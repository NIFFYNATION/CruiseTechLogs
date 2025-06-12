import React from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0, pointerEvents: "none" },
  visible: { opacity: 1, pointerEvents: "auto" },
};

const modalVariantsDesktop = {
  hidden: { opacity: 0, scale: 0.97, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30, delay: 0 } },
  exit: { opacity: 0, scale: 0.97, y: 30, transition: { duration: 0.2, delay: 0 } },
};

const modalVariantsMobile = (fullHeight) => ({
  hidden: { y: "100%", opacity: 0, height: "90vh" },
  visible: {
    y: 0,
    opacity: 1,
    height: fullHeight ? "calc(100vh + 30px)" : "90vh",
    transition: { type: "spring", stiffness: 300, damping: 30, delay: 0 }
  },
  exit: { y: "100%", opacity: 0, height: "90vh", transition: { duration: 0.25, delay: 0 } },
});

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

const ReusableModal = ({
  open,
  onClose,
  title,
  children,
  mobileFullHeight = false,
  showCloseButton = true,
  className = "",
  footer = null,
}) => {
  const mobile = isMobile();

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        onClick={handleOverlayClick}
      >
        <motion.div
          className={`bg-white/80 rounded-xl w-full max-w-3xl mx-2 p-0 overflow-hidden shadow-lg relative ${mobile ? "-mb-30 flex flex-col justify-between" : ""} ${className}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobile ? modalVariantsMobile(mobileFullHeight) : modalVariantsDesktop}
          onClick={e => e.stopPropagation()}
        >
          {/* Floating Close Button (mobile only) */}
          {showCloseButton && mobile && (
            <button
              className="absolute mt-1 right-4 z-10 bg-white shadow-lg rounded-full p-2 text-2xl text-text-primary border border-gray-200"
              onClick={onClose}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
            >
              <IoClose />
            </button>
          )}
          {/* Title and Close Icon (desktop only) */}
          {(title || showCloseButton) && (
            <div className={`px-6 py-4 bg-bgLayout/40 border-b border-border-grey flex items-center justify-between ${mobile ? "pb-2" : ""}`}>
              <h2 className="text-lg font-semibold">{title}</h2>
              {!mobile && showCloseButton && (
                <button className="text-2xl text-text-primary" onClick={onClose}>
                  <IoClose />
                </button>
              )}
            </div>
          )}
          {children}
          {footer}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReusableModal;
