import React from "react";
import { FaWallet } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  {
    id: 1,
    title: "Wallet Topup",
    description: "Successfully added funds to account",
    amount: "+ ₦ 20,000",
    time: "1m",
    unread: true,
  },
  // ...repeat as needed
  {
    id: 2,
    title: "Wallet Topup",
    description: "Successfully added funds to account",
    amount: "+ ₦ 20,000",
    time: "1m",
    unread: true,
  },
  {
    id: 3,
    title: "Wallet Topup",
    description: "Successfully added funds to account",
    amount: "+ ₦ 20,000",
    time: "1m",
    unread: true,
  },
  {
    id: 3,
    title: "Wallet Topup",
    description: "Successfully added funds to account",
    amount: "+ ₦ 20,000",
    time: "1m",
    unread: true,
  },
];

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0, pointerEvents: "none" },
  visible: { opacity: 1, pointerEvents: "auto" },
};
const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 }
  }),
};

const NotificationDropdown = ({ onMarkRead, onClose }) => (
  <>
    {/* MOBILE: Right-side drawer and overlay */}
    <AnimatePresence>
      <div className="md:hidden">
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        />
        {/* Drawer */}
        <motion.div
          className="fixed top-0 right-0 h-full w-[97vw] max-w-xs bg-background z-50 shadow-2xl p-4"
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={drawerVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg text-text-primary">Notifications</span>
            <button className="text-2xl text-text-primary" onClick={onClose}>
              <IoClose />
            </button>
          </div>
          <button
            className="block text-success font-medium text-sm hover:underline mb-2"
            onClick={onMarkRead}
          >
            Mark as read
          </button>
          <div>
            {notifications.map((n, idx) => (
              <motion.div
                key={n.id + idx}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <div className="flex items-start gap-3 py-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1 bg-[#D9700A0D]">
                    <img className="w-5 h-5 [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)]" src="/icons/wallet-topup.svg" alt="wallet-topup" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text-primary">{n.title}</span>
                      <span className="text-sm text-text-grey">{n.time}</span>
                    </div>
                    <div className="text-xs text-text-grey">{n.description}</div>
                    <div className="text-sm font-bold text-success mt-1">{n.amount}</div>
                  </div>
                  {n.unread && (
                    <span className="w-2 h-2 bg-quinary rounded-full mt-2 ml-2" />
                  )}
                </div>
                {idx !== notifications.length - 1 && (
                  <div className="border-b border-text-grey" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
    {/* DESKTOP: Original dropdown, untouched */}
    <AnimatePresence>
      <div className="hidden md:block">
        <motion.div
          className="absolute -right-12 md:-left-35 mt-8 w-[290px] md:w-[350px] bg-background rounded-2xl shadow-xl z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={dropdownVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg text-text-primary">Notification</span>
            <button
              className="text-success font-medium text-sm hover:underline"
              onClick={onMarkRead}
            >
              Mark as read
            </button>
          </div>
          <div>
            {notifications.map((n, idx) => (
              <motion.div
                key={n.id + idx}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <div className="flex items-start gap-3 py-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1 bg-[#D9700A0D]">
                    <img className="w-5 h-5 [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)]" src="/icons/wallet-topup.svg" alt="wallet-topup" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text-primary">{n.title}</span>
                      <span className="text-xs text-text-grey">{n.time}</span>
                    </div>
                    <p className="text-xs text-text-grey">{n.description}</p>
                    <p className="text-sm font-bold text-success mt-1">{n.amount}</p>
                  </div>
                  {n.unread && (
                    <span className="w-2 h-2 bg-quinary rounded-full mt-2 ml-2" />
                  )}
                </div>
                {idx !== notifications.length - 1 && (
                  <div className="border-b border-text-grey" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </>
);

export default NotificationDropdown;