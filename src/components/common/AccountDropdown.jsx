import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import ProfileActions from "./profileActionButtons";
import { fetchUserDetails, defaultUser } from '../../controllers/userController';
import UserProgress from "./UserProgress";
import UserAvatar from "./UserAvatar"; // Import UserAvatar
import DropdownCard from "./DropdownCard";
import SidebarDrawer from "./SidebarDrawer";
import { extractLastNumber } from "../../utils/formatUtils";
import { useNavigate } from 'react-router-dom';

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
  open = true,
}) => {
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propUser) {
      setLoading(true);
      // Always fetch from API on open
      fetchUserDetails()
        .then(data => setUser(data))
        .catch(() => setUser(defaultUser))
        .finally(() => setLoading(false));
    }
  }, [propUser]);

  const safeUser = user || defaultUser;

  // Add a handler to close dropdown and then call onEditProfile
  const handleEditProfile = () => {
    if (onClose) onClose();
    if (onEditProfile) onEditProfile();
  };

  // Get level badge icon
  const levelNum = extractLastNumber(safeUser.nextStage) || extractLastNumber(safeUser.stage?.name);
  const badgeUrl = levelNum
    ? `/icons/level-badge-${levelNum}.svg`
    : '/icons/level-badge.svg';

  if (loading) {
    // Optionally, replace with a spinner or skeleton
    return null;
  }

  return (
    <>
      {/* MOBILE: SidebarDrawer */}
      <SidebarDrawer open={open} onClose={onClose}>
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
            badgeUrl={badgeUrl}
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
            onClick={() => {
              if (onClose) onClose();
              setTimeout(() => navigate('/dashboard/stages'), 100); // ensure sidebar closes first
            }}
          >
            Know more about discount
          </button>
        </div>
        {/* Actions */}
        <ProfileActions onEditProfile={handleEditProfile} onLogout={onLogout} />
      </SidebarDrawer>
      {/* DESKTOP: DropdownCard */}
      <DropdownCard>
        {/* Top Section */}
        <div className="flex items-center gap-4 mb-4 p-4 border-b-1 border-[#C7C7C7] rounded-t-2xl">
          <UserAvatar
            src={safeUser.profile_image}
            alt={safeUser.first_name}
            size={64}
            showLevel={false}
            level={safeUser.stage?.name}
            badgeUrl={badgeUrl}
          />
          <div>
            <h3 className="font-semibold text-lg text-text-primary">{safeUser.first_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-[#A97B2A] px-3 py-1 rounded-full bg-[#A97B2A]/20 text-xs font-semibold">
                <img src={badgeUrl} alt="level badge" className="w-4 h-4 inline-block mr-1" />
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
          <button
            onClick={() => navigate('/dashboard/stages')}
            className="mt-4 px-4 py-2 text-sm font-bold text-white bg-quinary rounded-full shadow hover:bg-quaternary transition-colors focus:outline-none focus:ring-2 focus:ring-quinary focus:ring-offset-2"
          >
            Read about discount
          </button>
        </div>
        {/* Actions */}
        <ProfileActions onEditProfile={handleEditProfile} onLogout={onLogout} />
      </DropdownCard>
    </>
  );
};

export default AccountDropdown;
