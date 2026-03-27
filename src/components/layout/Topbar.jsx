/**
 * Topbar.jsx — Top navigation bar with breadcrumb + user actions
 */
import React, { useState } from "react";
import theme from "../../config/theme";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

export default function Topbar({ title, subtitle, actions }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  return (
    <header style={{
      height: "56px",
      background: theme.colors.bg.surface,
      borderBottom: `1px solid ${theme.colors.border.subtle}`,
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: "16px",
      position: "sticky",
      top: 0,
      zIndex: 90,
    }}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          margin: 0,
          fontSize: theme.font.size.md,
          fontWeight: theme.font.weight.semibold,
          color: theme.colors.text.primary,
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{
            fontSize: theme.font.size.xs,
            color: theme.colors.text.tertiary,
            marginTop: "1px",
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Actions slot */}
      {actions && <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>{actions}</div>}

      {/* User menu */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: menuOpen ? theme.colors.bg.hover : "none",
            border: `1px solid ${menuOpen ? theme.colors.border.default : "transparent"}`,
            borderRadius: theme.radius.md,
            padding: "5px 10px",
            cursor: "pointer",
            fontFamily: theme.font.body,
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = theme.colors.bg.hover; }}
          onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = "none"; }}
        >
          <div style={{
            width: "28px", height: "28px",
            borderRadius: "50%",
            background: theme.colors.accent.light,
            color: theme.colors.accent.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px",
            fontWeight: theme.font.weight.bold,
          }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span style={{ fontSize: theme.font.size.sm, color: theme.colors.text.secondary }}>
            {user?.name?.split(" ")[0] || "User"}
          </span>
          <span style={{ fontSize: "10px", color: theme.colors.text.tertiary }}>▾</span>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 199 }}
              onClick={() => setMenuOpen(false)}
            />
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0,
              background: theme.colors.bg.surface,
              border: `1px solid ${theme.colors.border.subtle}`,
              borderRadius: theme.radius.md,
              boxShadow: theme.shadow.md,
              zIndex: 200,
              minWidth: "180px",
              overflow: "hidden",
              animation: "slideDown 120ms ease",
            }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${theme.colors.border.subtle}` }}>
                <div style={{ fontSize: theme.font.size.sm, fontWeight: theme.font.weight.medium, color: theme.colors.text.primary }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: theme.font.size.xs, color: theme.colors.text.tertiary }}>
                  {user?.email}
                </div>
              </div>
              <div style={{ padding: "4px" }}>
                <MenuAction label="Sign out" icon="→" onClick={handleLogout} danger />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function MenuAction({ label, icon, onClick, danger }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 10px", border: "none",
        background: hovered ? (danger ? theme.colors.accent.dangerLight : theme.colors.bg.hover) : "transparent",
        color: danger ? theme.colors.accent.danger : theme.colors.text.secondary,
        borderRadius: theme.radius.sm,
        cursor: "pointer",
        fontSize: theme.font.size.sm,
        fontFamily: theme.font.body,
        transition: "all 120ms",
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
