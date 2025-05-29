import React from 'react';
import { Link } from 'react-router-dom';

const NotificationBanner = ({ messageCount = 0 }) => {
  if (messageCount === 0) return null;

  return (
    <div className="flex justify-center bg-quaternary-light gap-2 rounded-full mb-8 p-2 mt-8 items-center">
      <img src="/icons/bell.png" alt="bell" className="" />
      <p className="text-text-secondary text-sm font-medium">
        You have {messageCount} messages! 
        <span className="text-quinary text-base font-medium">
          <Link to="/dashboard/messages">click to view</Link>
        </span>
      </p>
    </div>
  );
};

export default NotificationBanner; 