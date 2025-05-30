import React from "react";

const NumberDetailsModal = ({
  open,
  onClose,
  number,
  expiration,
  status,
  verificationCode,
  onReload,
  onCopyNumber,
  onCopyCode,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] mx-2 mb-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-grey bg-bgLayout rounded-t-lg px-6 py-4">
          <span className="text-base md:text-lg font-semibold">{number}</span>
          <button
            className="bg-quinary text-sm md:text-lg text-white rounded-full px-3 py-2 flex items-center gap-2 font-semibold hover:bg-quaternary transition"
            onClick={onReload}
          >
                          <img src="/icons/reload.svg" alt="Reload number" />

            Reload Number
          </button>
        </div>
        {/* Note */}
        <p className="px-6 pt-4 pb-2  text-[14px] text-text-secondary">
          Note: Number takes only 10 minutes for you to verify, it means it expires after 10 minutes. Please verify number immediately, if code is taking time, kindly reload number.
        </p>
      
        {/* Number Section */}
        <div className="px-6 py-4 mx-6 my-4 border-border-grey border-t border-b">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base">Number:</span>
            <span className="font-semibold text-quinary">{number}</span>
            <button onClick={onCopyNumber} title="Copy number">
              <img src="/icons/copy-bold.svg" alt="Copy number" />
            </button>
          </div>
          <div>
            <span
              className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status === "active" ? (
                <>Active <span className="text-green-700 font-medium">({expiration})</span></>
              ) : (
                <>Expired</>
              )}
            </span>
          </div>
        </div>
        
        {/* Verification Code Section */}
        <div className="px-6 py-6 flex flex-col items-center">
          <h3 className="text-center font-semibold text-lg mb-2">VERIFICATION CODE</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[2rem] font-bold text-quinary tracking-widest">{verificationCode}</span>
            <button onClick={onCopyCode} title="Copy code">
            <img src="/icons/copy-bold.svg" alt="Copy number" />

            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-border-grey border-t bg-bgLayout rounded-b-lg">
          <button
            className="border border-primary text-primary rounded-full px-6 py-2 font-semibold hover:bg-primary hover:text-background transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumberDetailsModal;
