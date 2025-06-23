import React from 'react';

const FormSection = ({ children, title, subtitle }) => {
  return (
    <div
      className="max-w-md w-full space-y-6 p-6 sm:p-8 rounded-lg bg-background/30 shadow-lg"
      style={{
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <div>
        <h2 className="text-2xl font-bold text-quinary">{title}</h2>
        <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default FormSection;