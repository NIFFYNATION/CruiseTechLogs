import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0, pointerEvents: "none" },
  visible: { opacity: 1, pointerEvents: "auto" },
};

const modalVariantsDesktop = (customHeight) => ({
  hidden: { opacity: 0, scale: 0.97, y: 30, height: customHeight || undefined },
  visible: { opacity: 1, scale: 1, y: 0, height: customHeight || undefined, transition: { type: "spring", stiffness: 300, damping: 30, delay: 0 } },
  exit: { opacity: 0, scale: 0.97, y: 30, height: customHeight || undefined, transition: { duration: 0.2, delay: 0 } },
});

const modalVariantsMobile = (fullHeight, customHeight) => ({
  hidden: { y: "100%", opacity: 0, height: customHeight || "90vh" },
  visible: {
    y: 0,
    opacity: 1,
    height: fullHeight ? (customHeight || "calc(100vh + 30px)") : (customHeight || "90vh"),
    transition: { type: "spring", stiffness: 300, damping: 30, delay: 0 }
  },
  exit: { y: "100%", opacity: 0, height: customHeight || "90vh", transition: { duration: 0.25, delay: 0 } },
});

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

const CustomModal = ({
  open: openProp,
  defaultOpen = false, // <-- allow to pass default open state
  onClose,
  title,
  description,
  headerIcon = null,
  children,
  showCloseButton = true,
  className = "",
  showFooter = true,
  footerContent = null,
  enableSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  list = [],
  renderItem,
  customHeight,
  closeable = true,
  ...rest
}) => {
  const mobile = isMobile();
  const [search, setSearch] = useState("");
  const [fullHeight, setFullHeight] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const searchInputRef = useRef(null);
  const lastDownOnInput = useRef(false);

  // Sync internal open state with prop if provided
  useEffect(() => {
    if (typeof openProp === "boolean") {
      setInternalOpen(openProp);
    }
  }, [openProp]);

  useEffect(() => {
    lastDownOnInput.current = false;
  }, [internalOpen]);

  const handleMouseDown = (e) => {
    if (
      searchInputRef.current &&
      (e.target === searchInputRef.current || searchInputRef.current.contains(e.target))
    ) {
      lastDownOnInput.current = true;
    } else {
      lastDownOnInput.current = false;
    }
  };

  const handleOverlayClick = (e) => {
    if (
      e.target === e.currentTarget &&
      !lastDownOnInput.current
    ) {
      onClose();
    }
    lastDownOnInput.current = false;
  };

  // Handle search logic if enabled
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  // Height logic for mobile
  const handleSearchFocus = () => {
    if (mobile) setFullHeight(true);
  };

  // List rendering logic
  let filteredList = list;
  if (enableSearch && search && Array.isArray(list)) {
    filteredList = list.filter(
      item =>
        (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item.value && String(item.value).toLowerCase().includes(search.toLowerCase()))
    );
  }

  // --- Only return null after all hooks are called ---
  if (!internalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        // Only allow overlay click to close if closeable
        // onPointerDown={handleMouseDown}
        // onClick={closeable ? handleOverlayClick : undefined}
      >
        <motion.div
          className={`rounded-xl w-full max-w-3xl mx-2 p-0 overflow-hidden shadow-lg relative ${mobile ? "-mb-30 flex flex-col" : ""} ${className}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobile ? modalVariantsMobile(fullHeight, customHeight) : modalVariantsDesktop(customHeight)}
          onClick={e => e.stopPropagation()}
          {...rest}
        >
          {/* Floating Close Button (mobile only) */}
          {showCloseButton && closeable && mobile && (
            <button
              className="absolute mt-1 right-4 z-10 bg-white shadow-lg rounded-full p-2 text-2xl text-text-primary border border-gray-200"
              onClick={onClose}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
            >
              <IoClose />
            </button>
          )}
          {/* Title, Icon, and Close Icon (desktop only) */}
          {(title || showCloseButton || headerIcon) && (
            <div className={`px-6 py-4 bg-bgLayout/60 border-b border-border-grey flex items-center justify-between ${mobile ? "pb-2" : ""}`}>
              <div className="flex items-center gap-2">
                {headerIcon && <span className="mr-2">{headerIcon}</span>}
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  {description && <p className="text-gray-900">{description}</p>}
                </div>
              </div>
              {!mobile && showCloseButton && closeable && (
                <button className="text-2xl text-text-primary" onClick={onClose}>
                  <IoClose />
                </button>
              )}
            </div>
          )}
          {/* Search */}
          {enableSearch && (
            <div className="px-6 py-0 pb-3 bg-bgLayout/70 border-b border-border-grey">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full font-semibold border-b border-border-grey pl-10 pr-4 py-2.5 focus:outline-none"
                  value={search}
                  onChange={handleSearch}
                  onFocus={handleSearchFocus}
                />
              </div>
            </div>
          )}
        {Array.isArray(list) && list.length > 0 && (
            <div
                className="px-6 -mt-0 pb-2 max-h-[340px] md:max-h-[340px] overflow-y-auto bg-bgLayout/70"
                style={
                    mobile
                        ? { maxHeight: fullHeight ? "calc(100vh - 100px)" : "calc(90vh - 100px)" }
                        : {}
                }
            >
                <div
                    className={`grid md:grid-cols-2 gap-y-0 gap-x-4 mb-5 ${
                        filteredList.length <= 2 ? "md:grid-cols-1" : ""
                    }`}
                >
                    {filteredList.map((item, idx) =>
                        renderItem ? (
                            renderItem(item, idx)
                        ) : (
                            <button
                                key={item.value || idx}
                                className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-[#F7F7F7] transition w-full text-left"
                                onClick={() => {
                                    // Only close if item has a name and value
                                    if (
                                        (item.name && item.name.trim() !== "") &&
                                        (item.value && String(item.value).trim() !== "")
                                    ) {
                                        if (item.onClick) item.onClick(item);
                                        if (rest.onSelect) rest.onSelect(item);
                                        onClose();
                                    }
                                }}
                            >
                                {item.icon && (
                                    <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
                                )}
                                {item.flag && (
                                    <img src={item.flag} alt={item.name} className="w-6 h-6 rounded" />
                                )}
                                {item.countryCode && (
                                    <img src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.countryCode}.svg`} alt={item.name} className="w-6 h-6 rounded" />
                                )}
                                <span className="font-medium">{item.name + item.value || item.label}</span>
                            </button>
                        )
                    )}
                </div>
            </div>
        )}
        {/* Children as fallback/wrapper */}
          {(!Array.isArray(list) || list.length === 0) && children}
          {/* Footer */}
          {showFooter && (
            footerContent ? (
              footerContent
            ) : (
              <div className="hidden md:flex justify-end border-t border-border-grey px-6 py-4 bg-bgLayout/60 border-b-3 rounded-b-xl border-b-[#FA5A15]">
                {closeable && (
                  <button
                    className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                )}
              </div>
            )
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomModal;
