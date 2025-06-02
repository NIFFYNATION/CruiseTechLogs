import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const NotificationBanner = ({ messageCount = 0 }) => {
  if (messageCount === 0) return null;

  return (
    <AnimatePresence>
      {messageCount > 0 && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="flex md:hidden justify-center bg-quaternary-light gap-2 rounded-full mb-8 p-2 mt-8 items-center"
        >
          <img src="/icons/bell.svg" alt="bell" className="" />
          <p className="text-text-secondary text-sm font-medium">
            You have {messageCount} messages! 
            <span className="text-quinary text-base font-medium">
              <Link to="/dashboard/messages">click to view</Link>
            </span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner; 