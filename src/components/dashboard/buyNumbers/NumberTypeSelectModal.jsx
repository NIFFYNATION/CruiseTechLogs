import React from "react";

const numberTypes = [
  { label: "Short Term Number 1 (USA)", value: "short1" },
  { label: "Short Term Number 2 (USA)", value: "short2" },
  { label: "Long Term Number (USA)", value: "long1", duration: "3 days" },
  { label: "Long Term Number (USA)", value: "long2", duration: "30 days" },
  { label: "LTR (Network 2) (USA)", value: "long3", duration: "30 days" },
];

const NumberTypeSelectModal = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-3xl mx-2 p-0 overflow-hidden shadow-lg relative">
        {/* Title */}
        <div className="px-6 pt-6 pb-2 border-b border-border-grey bg-bgLayout">
          <h2 className="text-lg font-semibold">Choose Number Category</h2>
        </div>
        {/* Options */}
        <div className="px-6 py-4">
          <div className="flex flex-col">
            {numberTypes.map((type, idx) => (
              <React.Fragment key={type.value}>
                <button
                  className="w-full text-left py-4 px-2 hover:bg-[#F7F7F7] transition rounded"
                  onClick={() => {
                    onSelect(type);
                    onClose();
                  }}
                >
                  <span className="font-medium">
                    {type.label}
                    {type.duration && (
                      <span className="ml-2 text-quinary font-normal">({type.duration})</span>
                    )}
                  </span>
                </button>
                {idx !== numberTypes.length - 1 && (
                  <hr className="border-t border-[#E5E7EB]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end border-t border-border-grey px-6 py-4 bg-bgLayout border-b-2 rounded-b-xl border-b-[#FFDE59]">
          <button
            className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumberTypeSelectModal;
