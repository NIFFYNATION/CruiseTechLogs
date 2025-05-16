import React from "react";
import { FaEdit, FaSignOutAlt, FaEnvelope } from "react-icons/fa";

const AccountDropdown = ({
  user = {
    name: "Fortune Ivo",
    email: "ivofortune35@gmail.com",
    avatar: "/avatar.png",
    level: 1,
    progress: 20,
  },
  onEditProfile,
  onLogout,
  onKnowMore,
}) => (
  <div className="absolute right-0 mt-8 w-[300px] md:w-[370px] bg-background rounded-2xl shadow-xl z-50 ">
    {/* Top Section */}
    <div className="flex items-center gap-4 mb-4 p-4">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <div className="font-semibold text-lg text-text-primary">{user.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 bg-[#FFF4ED] text-[#A97B2A] px-3 py-1 rounded-full text-xs font-semibold">
            <span className="inline-block w-4 h-4 bg-[url('/level-badge.png')] bg-cover" />
            Level {user.level}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <FaEnvelope className="text-text-grey" />
          <span className="text-gray-500 text-sm">{user.email}</span>
        </div>
      </div>
    </div>
    {/* Progress Section */}
    <div className="border-t border-text-grey pt-4 mb-4 p-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center gap-1">
          <span className="inline-block w-6 h-6 bg-[url('/level-badge.png')] bg-cover" />
          <span className="text-xs font-semibold text-[#A97B2A]">{user.progress}% to Level {user.level}</span>
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${user.progress}%` }}
        />
      </div>
      <button
        className="bg-quinary hover:bg-quaternary py-2 px-4 text-white font-semibold rounded-full py-2 mt-2 transition-colors"
        onClick={onKnowMore}
      >
        Know more about discount
      </button>
    </div>
    {/* Actions */}
    <div className="">
    <div className="flex border-t border-text-grey rounded-b-2xl">
      <button
        className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-primary py-5"
        onClick={onEditProfile}
      >
        <FaEdit />
        Edit Profile
      </button>
      <div className="w-px bg-text-grey mx-2" />
      <button
        className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-danger py-2"
        onClick={onLogout}
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
    </div>
  </div>
);

export default AccountDropdown;
