import React from "react";
import { extractLastNumber } from "../../utils/formatUtils";

const UserAvatar = ({
  src = "/icons/female.svg",
  alt = "User",
  size = 80, // default size in px
  showLevel = false,
  level = "",
  className = "",
  badgeUrl,
}) => {
  const levelNum = extractLastNumber(level);
  const computedBadgeUrl = levelNum
    ? `/icons/level-badge-${parseInt(levelNum, 10) + 1}.svg`
    : '/icons/level-badge.svg';
  const finalBadgeUrl = badgeUrl || computedBadgeUrl;

  const isDefaultSvg = src.endsWith('.svg') && (src.includes('female') || src.includes('male') || src.includes('user'));

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      {isDefaultSvg ? (
        <div
          className="rounded-full border-4 border-[#FF6B00] bg-gray-50 flex items-center justify-center p-2 box-border"
          style={{ width: size, height: size }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FF6B00',
              WebkitMask: `url(${src}) center center / contain no-repeat`,
              mask: `url(${src}) center center / contain no-repeat`
            }}
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="rounded-full object-cover border-4 border-[#FF6B00] w-full h-full"
          style={{ width: size, height: size }}
        />
      )}
      {showLevel && (
        <div
          className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-1 w-30 justify-center"
          style={{
            minWidth: 70,
            bottom: -18,
          }}
        >
          <img
            src={finalBadgeUrl}
            alt="level badge"
            className="w-5 h-5 bg-white rounded-full border border-white shadow"
          />
          <span className="text-xs font-semibold text-[#A97B2A]">
            {typeof level === "string" ? level : `Level ${level}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
