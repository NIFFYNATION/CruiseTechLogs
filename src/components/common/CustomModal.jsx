import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiSearch, FiBox } from "react-icons/fi";
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

const modalVariantsMobile = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { type: "spring", stiffness: 400, damping: 40 } },
  exit: { y: "100%", transition: { duration: 0.2 } },
};

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

const CustomModal = ({
  open: openProp,
  defaultOpen = false,
  onClose,
  title,
  description,
  headerIcon = null,
  reloadAction,
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
  loading = false,
  emptyMessage = "No items found.",
  emptyIcon = <FiBox className="w-12 h-12 mb-4 text-gray-300" />,
  ...rest
}) => {
  const mobile = isMobile();
  const [search, setSearch] = useState("");
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (typeof openProp === "boolean") {
      setInternalOpen(openProp);
    }
  }, [openProp]);

  useEffect(() => {
    if (!internalOpen) {
      setHasSearched(false); // Reset when modal closes
    }
  }, [internalOpen]);

  const handleClose = () => {
    if (closeable && onClose) {
      onClose();
    }
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSearchFocus = () => {
    setIsInputFocused(true);
    setHasSearched(true);
  };

  const handleSearchBlur = () => {
    setIsInputFocused(false);
    // Do NOT reset hasSearched here
  };

  let filteredList = list;
  if (enableSearch && search && Array.isArray(list)) {
    filteredList = list.filter(
      item =>
        (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item.value && String(item.value).toLowerCase().includes(search.toLowerCase()))
    );
  }

  const shouldFixHeight = mobile && hasSearched;

  if (!internalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 flex justify-center ${mobile ? (isInputFocused ? 'items-start pt-4' : 'items-end') : 'items-center'} backdrop-blur-md`}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        onClick={handleOverlayClick}
        style={{ zIndex: 2147483646 }}
      >
        <motion.div
          className={`
            ${mobile 
              ? `w-full flex flex-col bg-white/80 dark:bg-gray-900/10 backdrop-blur-xl rounded-t-2xl shadow-2xl ${shouldFixHeight ? 'h-[90vh]' : 'max-h-[90vh]'} transition-height duration-300 ease-in-out`
              : "flex flex-col bg-bgLayout/60 rounded-xl w-full max-w-3xl mx-2 shadow-lg max-h-[90vh]"
            }
            p-0 relative ${className}`
          }
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobile ? modalVariantsMobile : modalVariantsDesktop(customHeight)}
          onClick={(e) => e.stopPropagation()}
          drag={mobile && !isInputFocused ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            if (mobile && !isInputFocused) {
              if (info.offset.y > 150 || info.velocity.y > 600) {
                handleClose();
              }
            }
          }}
          {...rest}
          style={{
            ...(rest.style || {}),
            zIndex: 2147483647,
            position: mobile ? "fixed" : "relative",
            bottom: mobile ? 0 : undefined,
          }}
        >
          {mobile && !isInputFocused && (
            <div className="w-full flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          )}

          {(title || showCloseButton || headerIcon || reloadAction !== undefined) && (
            <div className={`px-6 py-4 border-b border-border-grey flex items-center justify-between flex-shrink-0 ${mobile ? "pb-2 bg-transparent" : "bg-bgLayout/60"}`}>
              <div className="flex items-center gap-2">
                {headerIcon && <span className="mr-2">{headerIcon}</span>}
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  {description && <p className="text-gray-900">{description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {reloadAction !== undefined && (
                  <button
                    className="bg-quinary text-white rounded-full px-3 py-1 flex items-center gap-2 font-semibold hover:bg-quaternary transition text-sm"
                    onClick={reloadAction}
                    title="Reload"
                    disabled={!reloadAction}
                  >
                    <img src="/icons/reload.svg" alt="Reload" className="w-4 h-4" />
                    Reload
                  </button>
                )}
                {showCloseButton && closeable && (
                  <button
                    onClick={handleClose}
                    aria-label="Close"
                    className="shadow-md p-1.5 rounded-full bg-quaternary/5 hover:bg-quaternary/10 dark:bg-quaternary/50 dark:hover:bg-quaternary/10 backdrop-blur-md text-white-500"
                  >
                    <IoClose className="text-2xl text-white" />
                  </button>
                )}
              </div>
            </div>
          )}

          {enableSearch && !loading && Array.isArray(list) && list.length > 0 && (
            <div className={`px-2 py-0 pb-3 flex-shrink-0 ${mobile ? "bg-transparent" : "bg-bgLayout/10"}`}>
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full font-semibold border-1 border-border-grey mt-1 rounded shadow-lg pl-10 pr-4 py-2.5 focus:outline-none"
                  value={search}
                  onChange={handleSearch}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto thin-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="animate-spin h-10 w-10 text-quinary mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-quinary font-semibold">Loading...</span>
              </div>
            ) : Array.isArray(filteredList) && filteredList.length > 0 ? (
              <div className="px-6 -mt-0 pb-2">
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
                                className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition w-full text-left"
                                onMouseDown={() => {
                                    if (
                                        (item.name && item.name.trim() !== "") &&
                                        (item.value && String(item.value).trim() !== "")
                                    ) {
                                        if (item.onClick) item.onClick(item);
                                        if (rest.onSelect) rest.onSelect(item);
                                        if (searchInputRef.current) searchInputRef.current.blur();
                                        handleClose();
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
            ) : (
              (children == null || React.Children.count(children) > 0 ? (
               <> {children}</>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  {React.cloneElement(emptyIcon, { className: "w-12 h-12 mb-4 text-quaternary" })}
                  <div className="text-text-secondary font-semibold mt-2 text-center break-words max-w-xs">
                    {emptyMessage}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {showFooter && (
            footerContent ? (
              footerContent
            ) : (
              <div >
                {closeable && (
                  <></>
                  // <button
                  //   className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
                  //   onClick={handleClose}
                  // >
                  //   Cancel
                  // </button>
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
