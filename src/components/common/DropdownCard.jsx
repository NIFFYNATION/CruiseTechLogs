import React from "react";

const DropdownCard = ({ children, className = "", ...props }) => (
  <div
    className={`hidden md:block absolute right-0 mt-8 w-[500px] md:w-[450px] rounded-2xl shadow-xl z-50 bg-white/80 backdrop-blur-md p-4 md:p-8 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default DropdownCard; 