// src/context/ToastContext.js
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // type: "success" | "error" | "info"
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// ── Toast container rendered at root level ───────────────────
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      pointerEvents: "none",
    }}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  const styles = {
    success: { bg: "#f0fdf4", border: "#86efac", icon: "✓", iconColor: "#16a34a", text: "#15803d" },
    error:   { bg: "#fef2f2", border: "#fca5a5", icon: "✕", iconColor: "#dc2626", text: "#dc2626" },
    info:    { bg: "#eff6ff", border: "#93c5fd", icon: "i", iconColor: "#2563eb", text: "#1d4ed8" },
  };
  const s = styles[toast.type] || styles.info;

  return (
    <div
      onClick={() => onDismiss(toast.id)}
      style={{
        pointerEvents: "all",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        minWidth: 240,
        maxWidth: 340,
        cursor: "pointer",
        animation: "toastSlideIn 0.22s ease",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Icon */}
      <span style={{
        width: 20, height: 20,
        borderRadius: "50%",
        background: s.iconColor,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {s.icon}
      </span>

      {/* Message */}
      <span style={{ fontSize: 13, color: s.text, fontWeight: 500, flex: 1 }}>
        {toast.message}
      </span>

      {/* Dismiss */}
      <span style={{ fontSize: 12, color: s.text, opacity: 0.5, flexShrink: 0 }}>✕</span>
    </div>
  );
}