import React from 'react';

const SocialButtons = ({ buttons }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {buttons.map(({ icon, label }, index) => (
        <button
          key={index}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-secondary rounded-md bg-background hover:bg-secondary transition-colors"
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialButtons;