/**
 * Spinner.jsx — Loading indicator
 */
import React from "react";
import theme from "../../config/theme";

export default function Spinner({ size = 20, color = theme.colors.accent.primary, label = "" }) {
  return (
    <span
      role="status"
      aria-label={label || "Loading..."}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span style={{ fontSize: theme.font.size.sm, color: theme.colors.text.secondary }}>
          {label}
        </span>
      )}
    </span>
  );
}

/** Full-area loading overlay */
export function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        gap: "16px",
      }}
    >
      <Spinner size={32} />
      <span style={{ fontSize: theme.font.size.sm, color: theme.colors.text.secondary }}>
        {message}
      </span>
    </div>
  );
}
