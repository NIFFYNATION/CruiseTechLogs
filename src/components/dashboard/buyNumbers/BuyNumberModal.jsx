import React from "react";
import CountryFlag from "react-country-flag";
import { FiInfo } from "react-icons/fi";

const BuyNumberModal = ({
  open,
  onClose,
  service,
  country,
  onBuy,
}) => {
  if (!open || !service || !country) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-xl mx-2 p-0 overflow-hidden shadow-lg relative">
        {/* Title */}
        <div className="px-6 pt-6 pb-2 border-b border-border-grey">
          <h2 className="text-lg font-semibold">Buy Number</h2>
        </div>
        {/* Service Card */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between border rounded-lg border-primary  px-4 py-3">
            <div className="flex items-center gap-3">
              <img src={service.icon} alt={service.name} className="w-7 h-7" />
              <div>
                <div className="font-semibold">{service.name}</div>
                <div className="flex items-center gap-1 text-primary font-medium text-sm">
                  <CountryFlag
                    countryCode={country.value}
                    svg
                    className="w-5 h-5"
                    style={{ borderRadius: "4px" }}
                  />
                  {country.name} ({country.code})
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-text-grey">Set-up Fee: <span className="text-primary font-semibold">FREE</span></span>
              <span className="text-xs text-text-grey">Cost: <span className="text-primary font-semibold">{service.price}</span></span>
            </div>
          </div>
        </div>
        {/* Info Notice */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 bg-[#FFF4ED] border border-quinary rounded-lg px-4 py-3">
            <FiInfo className="text-quinary w-5 h-5" />
            <span className="text- text-sm">
              Please note that your account will be charged immediately when you this number.
            </span>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-4 border-t border-border-grey px-6 py-4">
          <button
            className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-quinary hover:bg-quaternary text-white rounded-full px-4 md:px-6 py-2 font-semibold transition"
            onClick={onBuy}
          >
            Buy Number & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyNumberModal;
