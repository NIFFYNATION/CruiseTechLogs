import React from "react";
import {  FaEnvelope } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import ProfileActions from "./profileActionButtons";

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

const AccountDropdown = ({
  user = {
    name: "Fortune Ivo",
    email: "ivofortune35@gmail.com",
    avatar: "/icons/female.svg",
    level: 1,
    progress: 20,
  },
  onEditProfile,
  onLogout,
  onKnowMore,
  onClose,
}) => (
  <>
    {/* MOBILE: Right-side drawer and overlay */}
    <AnimatePresence>
      <div className="md:hidden">
        <motion.div
          className="fixed inset-0 z-50"
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div
            className="absolute inset-0 bg-black/2 backdrop-blur-sm"
            variants={overlayVariants}
          />
          <motion.div
            className="absolute top-0 right-0 h-full w-[97vw] max-w-xs bg-white/80 shadow-2xl z-50 flex flex-col backdrop-blur-md"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={e => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
          >
            {/* Close Button */}
            <div className="flex justify-end p-8">
              <button className="text-2xl text-text-primary" onClick={onClose}>
                <IoClose />
              </button>
            </div>
            {/* Avatar and Level */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#FF6B00]"
                />
                <div className="w-[110px] absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-[0_9px_9px_-2px_rgba(0,0,0,0.1)] flex items-center gap-2 justify-center border border-gray-100">
                  <span className="inline-block w-4 h-4 bg-[url('/icons/level-badge.svg')] bg-cover" />
                  <span className="text-xs font-semibold text-[#A97B2A]">Level {user.level}</span>
                </div>
              </div>
              <div className="font-semibold text-lg text-text-primary mt-4">{user.name}</div>
              <div className="text-[#777777] text-sm font-semibold mb-2">{user.email}</div>
            </div>
            {/* Progress Section */}
            <div className="border-t border-text-grey pt-4 mb-10 p-6">
              <div className="flex items-center gap-2 mb-2 mt-4">
                <span className="inline-block w-8 h-8 bg-[url('/icons/level-badge.svg')] bg-cover" />
                <span className="text-base font-semibold text-[#A97B2A]">{user.progress}% to Level {user.level}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${user.progress}%` }}
                />
              </div>
              <button
                className="w-full bg-quinary hover:bg-quaternary text-white font-semibold rounded-full py-2 mt-8 transition-colors"
                onClick={onKnowMore}
              >
                Know more about discount
              </button>
            </div>
            {/* Actions */}
            <ProfileActions onEditProfile onLogout />
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
    {/* DESKTOP: Original dropdown, untouched */}
    <AnimatePresence>
      <div className="hidden md:block ">
        <motion.div
          className="absolute right-0 mt-8 w-[300px] md:w-[370px] rounded-2xl shadow-xl z-50 bg-white/90 backdrop-blur-md"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={dropdownVariants}
        >
          {/* Top Section */}
          <div className="flex items-center gap-4 mb-4 p-4  border-b-1 border-[#C7C7C7] rounded-t-2xl">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg text-text-primary">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1">

                <span className="flex items-center gap-1 bg-background text-[#A97B2A] px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="inline-block w-4 h-4 bg-[url('/icons/level-badge.svg')] bg-cover" />
                  Level {user.level}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
              <FaEnvelope className="text-[#777777]" />
                <span className="text-[#777777] text-sm font-semibold">{user.email}</span>
              </div>
            </div>
          </div>
          {/* Progress Section */}
          <div className="pt-4 p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1">
                <span className="inline-block w-6 h-6 bg-[url('/icons/level-badge.svg')] bg-cover" />
                <span className="text-xs font-semibold text-[#A97B2A]">{user.progress}% to Level {user.level}</span>
              </span>
              <span>-</span>
              <span className="text-xs font-semibold text-primary">Read about discount </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${user.progress}%` }}
              />
            </div>
          </div>
          {/* Actions */}
          <ProfileActions onEditProfile onLogout />
        </motion.div>
      </div>
    </AnimatePresence>
  </>
);

export default AccountDropdown;
