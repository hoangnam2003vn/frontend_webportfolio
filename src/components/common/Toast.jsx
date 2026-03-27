/**
 * Toast.jsx — Notification toasts (success, error, info)
 * Usage: import { useToast, ToastContainer } from './Toast'
 */
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import theme from "../../config/theme";

const ToastContext = createContext(null);

const VARIANTS = {
  success: { bg: theme.colors.accent.successLight, color: theme.colors.accent.success, icon: "✓" },
  error: { bg: theme.colors.accent.dangerLight, color: theme.colors.accent.danger, icon: "✕" },
  info: { bg: theme.colors.accent.light, color: theme.colors.accent.primary, icon: "ℹ" },
  warning: { bg: theme.colors.accent.warningLight, color: theme.colors.accent.warning, icon: "⚠" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const show = useCallback((message, type = "info", duration = 3500) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Toast container — bottom right */}
      <div style={{
        position: "fixed", bottom: "24px", right: "24px",
        zIndex: 9999,
        display: "flex", flexDirection: "column", gap: "8px",
        pointerEvents: "none",
      }}>
        {toasts.map((t) => {
          const v = VARIANTS[t.type] || VARIANTS.info;
          return (
            <div
              key={t.id}
              onClick={() => dismiss(t.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                padding: "12px 16px",
                background: theme.colors.bg.surface,
                borderRadius: theme.radius.md,
                boxShadow: theme.shadow.lg,
                border: `1px solid ${theme.colors.border.subtle}`,
                borderLeft: `3px solid ${v.color}`,
                maxWidth: "340px",
                pointerEvents: "auto",
                cursor: "pointer",
                animation: "slideInRight 200ms ease",
              }}
            >
              <span style={{
                width: "20px", height: "20px",
                borderRadius: "50%",
                background: v.bg,
                color: v.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px",
                fontWeight: "bold",
                flexShrink: 0,
              }}>
                {v.icon}
              </span>
              <span style={{ fontSize: theme.font.size.sm, color: theme.colors.text.primary, lineHeight: 1.5 }}>
                {t.message}
              </span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.show;
}
