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
  ...rest
}) => {
  const mobile = isMobile();
  const [search, setSearch] = useState("");
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (typeof openProp === "boolean") {
      setInternalOpen(openProp);
    }
  }, [openProp]);

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

  let filteredList = list;
  if (enableSearch && search && Array.isArray(list)) {
    filteredList = list.filter(
      item =>
        (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item.value && String(item.value).toLowerCase().includes(search.toLowerCase()))
    );
  }

  if (!internalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 flex justify-center ${mobile ? 'items-end' : 'items-center'} backdrop-blur-md`}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        onClick={handleOverlayClick}
        style={{ zIndex: 9999 }}
      >
        <motion.div
          className={`
            ${mobile 
              ? "w-full flex flex-col bg-white/80 dark:bg-gray-900/10 backdrop-blur-xl rounded-t-2xl shadow-2xl max-h-[90vh]" 
              : "flex flex-col bg-bgLayout/60 rounded-xl w-full max-w-3xl mx-2 shadow-lg max-h-[90vh]"
            }
            p-0 relative ${className}`
          }
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobile ? modalVariantsMobile : modalVariantsDesktop(customHeight)}
          onClick={(e) => e.stopPropagation()}
          drag={mobile ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            if (info.offset.y > 150 || info.velocity.y > 600) {
              handleClose();
            }
          }}
          {...rest}
          style={{
            ...(rest.style || {}),
            zIndex: 9999,
            position: mobile ? "fixed" : "relative",
            bottom: mobile ? 0 : undefined,
          }}
        >
          {mobile && (
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

          {enableSearch && (
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
                />
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto thin-scrollbar">
            {Array.isArray(list) && list.length > 0 && (
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
                                onClick={() => {
                                    if (
                                        (item.name && item.name.trim() !== "") &&
                                        (item.value && String(item.value).trim() !== "")
                                    ) {
                                        if (item.onClick) item.onClick(item);
                                        if (rest.onSelect) rest.onSelect(item);
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
            )}
            
            <div className="px-0 py-4">
              {(!Array.isArray(list) || list.length === 0) && children}
            </div>
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
