import React, { useState, useEffect, useRef } from "react";
import { FaWallet } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import DropdownCard from "./DropdownCard";
import SidebarDrawer from "./SidebarDrawer";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";
import CustomModal from "./CustomModal";
import { DateTime } from "luxon";
import { SkeletonNotification } from "./Skeletons";
import { htmlPreviewText, linkifyHtml  } from '../../utils/formatUtils';

import parse, { domToReact } from 'html-react-parser';
import he from 'he'; // For decoding HTML entities

function SafeHtml({ html }) {
  // Decode HTML entities like &lt;p&gt; => <p>
  const decoded = he.decode(html || '');

  const options = {
    replace: (domNode) => {
      if (domNode.name === 'a') {
        const props = {
          ...domNode.attribs,
          className: 'text-primary underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        };
        return <a {...props}>{domToReact(domNode.children, options)}</a>;
      }
    },
  };

  return (
    <div className="prose max-w-none p-4">
      {parse(decoded, options)}
    </div>
  );
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  try {
    const dt = DateTime.fromSQL(dateStr, { zone: "utc" }).toLocal();
    if (!dt.isValid) return "";
    return dt.toRelative();
  } catch (e) {
    return "";
  }
}

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
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.07,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  }),
};

const NotificationDropdown = ({ onClose, open = true }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      // This logic is for desktop only, where DropdownCard is used.
      if (window.innerWidth < 768) return;

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    // Using setTimeout to allow the event that triggered 'open' to pass.
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchNotifications()
        .then(({ notifications: fetchedNotifications, error }) => {
          if (!error && Array.isArray(fetchedNotifications)) {
            setNotifications(fetchedNotifications);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (notification.status === "1") {
      markNotificationAsRead(notification.ID).then((res) => {
        if (res.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.ID === notification.ID ? { ...n, status: "0" } : n
            )
          );
        }
      });
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => n.status === "1");
    if (unread.length === 0) return;

    const promises = unread.map((n) => markNotificationAsRead(n.ID));
    await Promise.all(promises);

    setNotifications((prev) =>
      prev.map((n) => (n.status === "1" ? { ...n, status: "0" } : n))
    );
  };

  const renderNotification = (n, idx) => (
    <motion.div
      key={n.id + idx}
      custom={idx}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      onClick={() => handleNotificationClick(n)}
      className="cursor-pointer"
    >
      <div className="flex items-start gap-3 py-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1 bg-[#D9700A0D]">
          <img
            className="w-5 h-5 [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(118%)_contrast(119%)]"
            src={n.icon || "/icons/bell.svg"}
            alt="notification-icon"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-text-primary">{n.title}</span>
          </div>
          <div className="text-xs text-text-grey line-clamp-2">
            {htmlPreviewText(n.description, 80)}
          </div>
          <span className="text-sm text-text-grey">
              {formatRelativeTime(n.date)}
            </span>
        </div>
        {n.status === "1" && (
          <span className="w-2 h-2 bg-quinary rounded-full mt-2 ml-2 flex-shrink-0" />
        )}
      </div>
      {idx !== notifications.length - 1 && (
        <div className="border-b border-text-grey" />
      )}
    </motion.div>
  );

  const notificationContent = (
    <div>
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <SkeletonNotification key={i} />)
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-text-secondary">
          No notifications yet.
        </div>
      ) : (
        notifications.map(renderNotification)
      )}
    </div>
  );

  return (
    <>
      {/* MOBILE: Right-side drawer and overlay */}
      <SidebarDrawer open={open} onClose={onClose}>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg text-text-primary">
            Notifications
          </span>
          <button className="text-2xl text-text-primary" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        {/* <button
          className="block text-success font-medium text-sm hover:underline mb-2"
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </button> */}
        {notificationContent}
      </SidebarDrawer>
      {/* DESKTOP: DropdownCard */}
      { !selectedNotification && (
        <div ref={dropdownRef}>
          <DropdownCard>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-text-primary">
                Notification
              </span>
              {/* <button
                className="text-success font-medium text-sm hover:underline"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button> */}
            </div>
            {notificationContent}
          </DropdownCard>
        </div>
      )}

      <CustomModal
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        title={selectedNotification?.title}
        showFooter={false}
        className="max-w-lg"
      >
        <SafeHtml html={selectedNotification?.description} />
      </CustomModal>
    </>
  );
};

export default NotificationDropdown;