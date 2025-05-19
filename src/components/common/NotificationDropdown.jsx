import React from "react";
import { FaWallet } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

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
];

const NotificationDropdown = ({ onMarkRead, onClose }) => (
  <>
    {/* MOBILE: Right-side drawer and overlay */}
    <div className="md:hidden">
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose}></div>
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-[97vw] max-w-xs bg-background z-50 shadow-2xl p-4"
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
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
            <div key={n.id}>
              <div className="flex items-start gap-3 py-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1 bg-[#FFF4ED]">
                  <FaWallet className="text-quinary text-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text-primary">{n.title}</span>
                    <span className="text-xs text-text-grey">{n.time}</span>
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
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* DESKTOP: Original dropdown, untouched */}
    <div className="hidden md:block">
      <div className="absolute -right-12 md:-left-35 mt-8 w-[290px] md:w-[350px] bg-background rounded-2xl shadow-xl z-50 p-4">
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
            <div key={n.id}>
              <div className="flex items-start gap-3 py-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1 bg-[#FFF4ED]">
                  <FaWallet className="text-quinary text-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text-primary">{n.title}</span>
                    <span className="text-xs text-text-grey">{n.time}</span>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default NotificationDropdown;
