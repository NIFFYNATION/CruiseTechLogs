import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Toast from "./Toast";

// This component renders Toast in a dedicated portal above all other UI
const ToastPortal = ({ type, message, onClose, timeout = 4000, className = "", position = "top-center" }) => {
  const toastRootRef = useRef(null);

  useEffect(() => {
    let toastRoot = document.getElementById("toast-root");
    if (!toastRoot) {
      toastRoot = document.createElement("div");
      toastRoot.id = "toast-root";
      toastRoot.style.zIndex = 2147483647; // Highest z-index
      toastRoot.style.position = "fixed";
      toastRoot.style.top = "0";
      toastRoot.style.left = "0";
      toastRoot.style.width = "100vw";
      toastRoot.style.height = "100vh";
      toastRoot.style.pointerEvents = "none";
      document.body.appendChild(toastRoot);
    }
    toastRootRef.current = toastRoot;
    return () => {
      // Do not remove the toastRoot to allow multiple toasts
    };
  }, []);

  if (!toastRootRef.current) return null;

  return createPortal(
    <div style={{ pointerEvents: "none", zIndex: 2147483647 }}>
      <Toast
        type={type}
        message={message}
        onClose={onClose}
        timeout={timeout}
        className={className}
        position={position}
      />
    </div>,
    toastRootRef.current
  );
};

export default ToastPortal;
