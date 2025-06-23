import React, { useState } from "react";
import CountryFlag from "react-country-flag";
import { FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";
import CustomModal from "../../common/CustomModal";
import { bookNumber } from "../../../services/numberService";
import ToastPortal from "../common/ToastPortal";

const BuyNumberModal = ({
  open,
  onClose,
  service,
  country,
  onBuy,
}) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errorMsg, setErrorMsg] = useState(""); // For highlighted error line

  // Always render ToastPortal if toast is set, even if modal is closed
  if (!open || !service || !country) {
    return (
      <>
        {toast && (
          <ToastPortal
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            timeout={toast.type === "success" ? 2500 : 5000}
          />
        )}
      </>
    );
  }

  const handleBuy = async () => {
    setToast(null);
    setErrorMsg("");
    setLoading(true);
    try {
      if (!service?.id) {
        setErrorMsg("Invalid service selected. Please try again.");
        setLoading(false);
        return;
      }
      // Prevent double click
      if (loading) return;

      // Book number (now throws on error)
      const result = await bookNumber(service.id);

      setToast({
        type: "success",
        message: result.message || "Number booked successfully!",
      });
      if (onBuy) onBuy(result.data);
    } catch (err) {
      // err.message is always present from numberService
      setErrorMsg(err.message || "Failed to book number. Please check your connection and try again.");
      setToast({
        type: "error",
        message: err.message || "Failed to book number. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear errorMsg on modal close
  const handleClose = () => {
    setErrorMsg("");
    onClose && onClose();
  };

  return (
    <>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Buy Number"
        showFooter={false}
        className="max-w-xl"
      >
        {/* Service Card */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between border rounded-lg border-primary px-4 py-3">
            <div className="flex items-center gap-3 ">
              {/* Generate iconUrl as in BuyNumbers page */}
              {(() => {
                const name = service.name?.split(/[ /]+/)[0] || "";
                const nameLower = name.trim().toLowerCase();
                let domain = `${nameLower}.com`;
                if (nameLower === "telegram" || nameLower === "signal") {
                  domain = `${nameLower}.org`;
                }
                const iconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=90`;
                return (
                  <img
                    src={iconUrl}
                    alt={service.name}
                    className="w-7 h-7"
                  />
                );
              })()}
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
              <span className="text-xs text-text-grey">
                Set-up Fee: <span className="text-primary font-semibold">FREE</span>
              </span>
              <span className="text-xs text-text-grey">
                Cost: <span className="text-primary font-semibold">
                  {typeof service.cost === "number"
                    ? service.cost.toLocaleString("en-NG", { style: "currency", currency: "NGN" })
                    : `₦${service.cost ? String(service.cost).replace(/^₦/, '').replace(/^N/, '').trim() : "0.00"}`}
                </span>
              </span>
            </div>
          </div>
        </div>
        {/* Info Notice */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 bg-[#FFF4ED] border border-quinary rounded-lg px-4 py-3">
            <FiInfo className="text-quinary w-5 h-5" />
            <span className="text- text-sm">
              You'll be charged, but automatically refunded if no OTP is received.
            </span>
          </div>
          {/* display error message here too */}
          {errorMsg && (
            <div className="mt-3 px-4 py-2 rounded bg-red-100 border border-red-400 text-danger font-semibold text-sm">
              {errorMsg}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-4 border-t border-border-grey px-6 py-4">
          <button
            className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-quinary hover:bg-quaternary text-white rounded-full px-4 md:px-6 py-2 font-semibold transition"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? "Processing..." : "Buy Number"}
          </button>
        </div>
      </CustomModal>
      {toast && (
        <ToastPortal
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          timeout={toast.type === "success" ? 2500 : 5000}
        />
      )}
    </>
  );
};

export default BuyNumberModal;
