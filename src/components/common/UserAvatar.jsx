import React from "react";

const UserAvatar = ({
  src = "/icons/female.svg",
  alt = "User",
  size = 80, // default size in px
  showLevel = false,
  level = "",
  className = "",
}) => (
  <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
    <img
      src={src}
      alt={alt}
      className="rounded-full object-cover border-4 border-[#FF6B00] w-full h-full"
      style={{ width: size, height: size }}
    />
    {showLevel && (
      <div
        className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5 w-25 justify-center"
        style={{
          minWidth: 60,
          bottom: -18,
        }}
      >
        <span className="inline-block w-4 h-4 bg-[url('/level-badge.png')] bg-cover" />
        <span className="text-xs font-semibold text-[#A97B2A]">
          {typeof level === "string" ? level : `Level ${level}`}
        </span>
      </div>
    )}
  </div>
);

export default UserAvatar;
