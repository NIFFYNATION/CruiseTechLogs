import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import ProfileActions from "./profileActionButtons";
import { fetchUserDetails, defaultUser } from '../../controllers/userController';
import UserProgress from "./UserProgress";
import UserAvatar from "./UserAvatar"; // Import UserAvatar

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
  user: propUser, // optional
  onEditProfile,
  onLogout,
  onKnowMore,
  onClose,
}) => {
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);

  useEffect(() => {
    if (!propUser) {
      setLoading(true);
      fetchUserDetails()
        .then(data => setUser(data))
        .catch(() => setUser(defaultUser))
        .finally(() => setLoading(false));
    }
  }, [propUser]);

  const safeUser = user || defaultUser;

  if (loading) {
    // Optionally, replace with a spinner or skeleton
    return null;
  }

  return (
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
                <UserAvatar
                  src={safeUser.profile_image ?? ''}
                  alt={safeUser.name}
                  size={80}
                  showLevel={true}
                  level={safeUser.stage?.name}
                />
                <div className="font-semibold text-lg text-text-primary mt-4">{safeUser.first_name}</div>
                <div className="text-[#777777] text-sm font-semibold mb-2">{safeUser.email}</div>
              </div>
              {/* Progress Section */}
              <div className="border-t border-text-grey pt-4 mb-10 p-6">
                <UserProgress
                  percentage={safeUser.percentage}
                  stageName={safeUser.stage?.name}
                  nextStage={safeUser.nextStage}
                />
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
              <UserAvatar
                src={safeUser.profile_image}
                alt={safeUser.first_name}
                size={64}
                showLevel={false}
                level={safeUser.stage?.name}
              />
              <div>
                <h3 className="font-semibold text-lg text-text-primary">{safeUser.first_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[#A97B2A] px-3 py-1 rounded-full bg-[#A97B2A]/20 text-xs font-semibold">
                    <span className="inline-block w-4 h-4 bg-[url('/level-badge.png')] bg-cover" />
                    Level {safeUser.level}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                <FaEnvelope className="text-[#777777]" />
                  <span className="text-[#777777] text-sm font-semibold">{safeUser.email}</span>
                </div>
              </div>
            </div>
            {/* Progress Section */}
            <div className="pt-4 p-8">
              <UserProgress
                percentage={safeUser.percentage}
                stageName={safeUser.stage?.name}
                nextStage={safeUser.nextStage}
              />
              <span className="text-xs font-semibold text-primary">Read about discount </span>
            </div>
            {/* Actions */}
            <ProfileActions onEditProfile onLogout />
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default AccountDropdown;
