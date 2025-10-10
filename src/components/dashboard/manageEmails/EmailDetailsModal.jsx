import React, { useState, useEffect } from "react";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import { getEmailCode } from "../../../services/emailService";
import Toast from "../../common/Toast";

const EmailDetailsModal = ({ isOpen, onClose, email, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // Fetch email messages/codes
  const fetchEmailCodes = async () => {
    if (!email || !email.id) return;

    setLoading(true);
    try {
      const response = await getEmailCode(email.id || email.ID);
      if (response.status === "success" && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching email codes:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isOpen && email) {
      fetchEmailCodes();
    }
  }, [isOpen, email]);

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setToast({
          show: true,
          message: "Copied to clipboard",
          type: "success",
        });
      },
      () => {
        setToast({
          show: true,
          message: "Failed to copy",
          type: "error",
        });
      }
    );
  };

  if (!isOpen || !email) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="bg-white rounded-md w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border-grey flex justify-between items-center">
          <h2 className="text-lg font-semibold">Email Details</h2>
          <button
            onClick={onClose}
            className="text-text-grey hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Email Info */}
        <div className="p-4 border-b border-border-grey">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-text-grey mb-1">Email Address</h3>
              <div className="flex items-center">
                <p className="font-medium mr-2">{email.email}</p>
                <button
                  onClick={() => copyToClipboard(email.email)}
                  className="text-primary hover:text-primary-dark"
                  title="Copy Email"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-text-grey mb-1">Service</h3>
              <p className="font-medium">{email.service}</p>
            </div>
            <div>
              <h3 className="text-sm text-text-grey mb-1">Status</h3>
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  email.status === "active"
                    ? "bg-green-100 text-green-800"
                    : email.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {email.status || "Unknown"}
              </span>
            </div>
            <div>
              <h3 className="text-sm text-text-grey mb-1">Expires</h3>
              <p className="font-medium">
                {email.expires_at
                  ? new Date(email.expires_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages/Codes */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Messages</h3>
            <button
              onClick={fetchEmailCodes}
              className="flex items-center text-sm text-primary hover:text-primary-dark"
              disabled={loading}
            >
              <FiRefreshCw
                className={`mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-text-secondary">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            // No messages found
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto text-text-grey mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-text-secondary">No messages received yet</p>
              <p className="text-sm text-text-grey mt-1">
                Messages will appear here when received
              </p>
            </div>
          ) : (
            // Messages list
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className="border border-border-grey rounded-md p-3 hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{message.sender || "Unknown Sender"}</h4>
                      <p className="text-sm text-text-grey">
                        {message.received_at
                          ? new Date(message.received_at).toLocaleString()
                          : "Unknown time"}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(message.code || message.content)}
                      className="text-primary hover:text-primary-dark"
                      title="Copy Content"
                    >
                      <FiCopy />
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-sm">
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.code || message.content || "No content"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-grey">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-2 rounded-sm hover:bg-primary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailsModal;