import React from "react";

const SelectionModal = ({ open, onClose, onSelect, title, options, showIcon = true }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl mx-2 p-0 overflow-hidden shadow-lg relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border-grey bg-bgLayout rounded-t-lg px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="divide-y divide-border-grey px-4 border-b-2 rounded-b-xl border-b-[#FFDE59]">
          {options.map((option) => (
            <button
              key={option.value}
              className="flex items-center gap-4 w-full px-8 py-5 hover:bg-quaternary-light transition"
              onClick={() => {
                onSelect(option);
                onClose();
              }}
            >
              {showIcon && option.icon && (
                <img src={option.icon} alt={option.label} className="w-7 h-7" />
              )}
              <span className="font-medium text-text-primary">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
