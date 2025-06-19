import React from "react";
import CustomModal from "./CustomModal";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "",
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  loading = false,
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 2147483647, // Highest possible z-index to always be above any modal
        inset: 0,
        pointerEvents: "auto",
      }}
    >
      <CustomModal
        open={open}
        onClose={onCancel}
        title={title}
        showFooter={false}
        className="max-w-sm"
        style={{
          zIndex: 2147483647, // Also set on modal itself
          position: "relative",
        }}
      >
        <div className="px-6 py-6 text-center">
          <div className="mb-4 text-base text-text-secondary">{message}</div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="border border-quinary text-quinary rounded-full px-6 py-2 font-semibold hover:bg-quinary hover:text-white transition"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              className="bg-quinary hover:bg-quaternary text-white rounded-full px-6 py-2 font-semibold transition"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ConfirmDialog;
