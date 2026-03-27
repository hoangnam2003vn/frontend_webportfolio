/**
 * Modal.jsx — Reusable dialog overlay
 * Props: isOpen, onClose, title, children, size (sm|md|lg|xl)
 */
import React, { useEffect } from "react";
import theme from "../../config/theme";
import Button from "./Button";

const SIZE_MAP = { sm: "400px", md: "560px", lg: "760px", xl: "960px" };

export default function Modal({ isOpen, onClose, title, children, size = "md", footer = null }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: theme.colors.bg.overlay,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: "fadeIn 150ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.colors.bg.surface,
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadow.modal,
          width: "100%",
          maxWidth: SIZE_MAP[size],
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          animation: "scaleUp 150ms ease",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.colors.border.subtle}`,
          flexShrink: 0,
        }}>
          <h2 style={{
            margin: 0, fontSize: theme.font.size.md,
            fontWeight: theme.font.weight.semibold,
            color: theme.colors.text.primary,
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: theme.colors.text.tertiary, fontSize: "20px",
              lineHeight: 1, padding: "2px 4px", borderRadius: theme.radius.sm,
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => { e.target.style.background = theme.colors.bg.hover; e.target.style.color = theme.colors.text.primary; }}
            onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = theme.colors.text.tertiary; }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: "12px 20px",
            borderTop: `1px solid ${theme.colors.border.subtle}`,
            display: "flex", justifyContent: "flex-end", gap: "8px",
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Confirm delete dialog */
export function ConfirmModal({ isOpen, onClose, onConfirm, itemName = "this item", loading = false }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </>
      }
    >
      <p style={{ color: theme.colors.text.secondary, lineHeight: 1.6, margin: 0 }}>
        Are you sure you want to delete <strong style={{ color: theme.colors.text.primary }}>{itemName}</strong>?
        This action cannot be undone.
      </p>
    </Modal>
  );
}
