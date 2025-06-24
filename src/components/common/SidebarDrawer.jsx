import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
    hidden: { opacity: 0, pointerEvents: "none" },
    visible: { opacity: 1, pointerEvents: "auto" },
  };
  const drawerVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

const SidebarDrawer = ({ open, onClose, children, className = "", ...props }) => (
  <AnimatePresence>
    {open && (
      <div className="md:hidden block">
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 z-40 bg-black/2 backdrop-blur-xs"
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        />
        {/* Drawer */}
        <motion.div
          className={`fixed top-0 right-0 h-full w-[97vw] max-w-xs bg-background z-50 shadow-2xl p-4 bg-white/80 shadow-2xl z-50 backdrop-blur-md ${className}`}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={drawerVariants}
          onClick={e => e.stopPropagation()}
          {...props}
        >
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default SidebarDrawer; 