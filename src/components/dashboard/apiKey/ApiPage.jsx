import React, { useState } from "react";
import { FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import CustomModal from "../../common/CustomModal";
import CreateApiKeyModal from "./CreateApiKeyModal";
import { generateApiKey } from "../../../services/userService";
import Toast from "../../common/Toast";

const ApiPage = () => {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);
  const [showKey, setShowKey] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const handleGenerateApiKey = async (password) => {
    setPasswordModalOpen(false);
    const result = await generateApiKey(password);
    if (result.success) {
      setNewApiKey(result.key);
      setShowKey(true); // Always show the key when newly generated
      setToast({
        show: true,
        message: "API Key generated successfully!",
        type: "success",
      });
    } else {
      setToast({
        show: true,
        message: result.message || "Failed to generate API key.",
        type: "error",
      });
    }
  };

  const handleCopy = () => {
    if (!newApiKey) return;
    navigator.clipboard.writeText(newApiKey);
    setToast({ show: true, message: "API Key copied!", type: "success" });
  };

  return (
    <div className="p-6 md:p-10">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Your API Key
          </h1>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="bg-quaternary w-fit text-white font-semibold rounded-full px-6 py-3 shadow hover:bg-quaternary/90 transition flex items-center"
            onClick={() => setPasswordModalOpen(true)}
          >
            <img className="w-5 h-5 mr-2 " src="/icons/add-bold.svg" alt="" />
            <span className="text-sm">Create API Key</span>
          </motion.button>
        </div>
        <p className="text-text-secondary text-sm">
          Note that you can only see your API Key once. But you can always
          generate a new key.
          <br />
          <span className="text-quaternary font-medium cursor-pointer hover:underline">
            Click here
          </span>{" "}
          to view API documentation
        </p>
      </div>

      {/* Password Modal */}
      <CustomModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Create API Key"
        showFooter={false}
      >
        <CreateApiKeyModal
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handleGenerateApiKey}
        />
      </CustomModal>

      {/* Display New API Key */}
      {newApiKey && (
        <div className="bg-white rounded-2xl shadow p-6 md:p-8 mt-8">
          <h2 className="text-lg font-semibold mb-2 text-primary">
            Your New API Key
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            Please copy this key and store it securely. You will not be able to
            see it again after you leave this page.
          </p>
          <div className="flex items-center gap-4 bg-bgLayout p-4 rounded-lg">
            <input
              type={showKey ? "text" : "password"}
              readOnly
              value={newApiKey}
              className="flex-1 bg-transparent outline-none font-mono text-text-primary"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-2 text-text-secondary hover:text-primary"
              title={showKey ? "Hide Key" : "Show Key"}
            >
              {showKey ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-text-secondary hover:text-success"
              title="Copy Key"
            >
              <FiCopy size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiPage;
