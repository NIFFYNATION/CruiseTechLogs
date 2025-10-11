import React, { useState } from "react";
import { bookEmail } from "../../../services/emailService";
import CustomModal from "../../common/CustomModal";
import { FiMail } from "react-icons/fi";

const BuyEmailModal = ({ isOpen, onClose, service, emailType, onBuy }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await bookEmail({
        serviceID: service.id || service.ID,
        emailType: emailType.id,
      });

      if (response.status === "success" && response.data) {
        onBuy(response.data);
      } else {
        setError(response.message || "Failed to book email");
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || "Failed to book email");
      setLoading(false);
    }
  };

  const footerContent = (
    <div className="flex gap-3 p-4 border-t border-border-grey">
      <button
        onClick={onClose}
        className="flex-1 border border-border-grey py-2 rounded-md hover:bg-gray-50 transition-colors"
        disabled={loading}
      >
        Cancel
      </button>
      <button
        onClick={handleBuy}
        className={`flex-1 bg-quaternary text-white py-2 rounded-md transition-colors ${loading ? "opacity-70" : "hover:bg-primary-dark"}`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Confirm Purchase"
        )}
      </button>
    </div>
  );

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Confirm Purchase"
      headerIcon={<FiMail className="text-primary text-xl" />}
      className="max-w-md"
      showFooter={true}
      footerContent={footerContent}
      closeable={!loading}
    >
      <div className="p-4">
        <div className="mb-4">
          <h3 className="font-medium text-lg mb-2">{service.name}</h3>
          <div className="flex items-center mb-2">
            <img
              src={`/icons/${service.code?.toLowerCase() || 'mail'}.svg`}
              alt={service.name}
              className="w-6 h-6 mr-2"
              onError={(e) => {
                e.target.src = "/icons/mail.svg";
              }}
            />
            <span className="text-text-secondary">
              {emailType?.name || emailType?.id || "Email"}
            </span>
          </div>
          <div className="bg-secondary/10 p-3 rounded-md mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">Service:</span>
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">Email Type:</span>
              <span className="font-medium">{emailType?.name || emailType?.id || "Unknown"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">Available:</span>
              <span className="font-medium">{service.count || 0}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border-grey">
              <span className="text-text-secondary font-medium">Cost:</span>
              <span className="font-bold">₦{service.cost?.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="text-sm text-text-secondary mb-4">
            <p>
              By clicking "Confirm Purchase", you agree to rent this email for verification purposes.
              The cost will be deducted from your account balance.
            </p>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default BuyEmailModal;