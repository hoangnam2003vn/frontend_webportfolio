/**
 * Sidebar.jsx — Left navigation panel
 * Renders nav items from MODELS config, grouped by access role.
 */
import React from "react";
import theme from "../../config/theme";
import MODELS from "../../config/models";
import { useAuth } from "../../context/AuthContext";

const NAV_SECTIONS = [
  {
    label: "Content",
    models: ["posts", "categories", "tags", "comments", "media"],
  },
  {
    label: "Commerce",
    models: ["products", "orders", "customers"],
  },
  {
    label: "Admin",
    models: ["users", "roles", "settings", "audit_logs"],
  },
];

function NavItem({ modelKey, modelDef, active, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  const isActive = active === modelKey;

  return (
    <button
      onClick={() => onClick(modelKey)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        border: "none",
        borderRadius: theme.radius.md,
        background: isActive
          ? theme.colors.accent.light
          : hovered ? theme.colors.bg.hover : "transparent",
        color: isActive ? theme.colors.accent.primary : theme.colors.text.secondary,
        cursor: "pointer",
        fontSize: theme.font.size.sm,
        fontWeight: isActive ? theme.font.weight.semibold : theme.font.weight.normal,
        fontFamily: theme.font.body,
        textAlign: "left",
        transition: "all 120ms",
      }}
    >
      <span style={{ fontSize: "16px", width: "20px", textAlign: "center", flexShrink: 0 }}>
        {modelDef.icon}
      </span>
      <span style={{ flex: 1 }}>{modelDef.labelPlural}</span>
      {isActive && (
        <div style={{
          width: "4px", height: "4px",
          borderRadius: "50%",
          background: theme.colors.accent.primary,
        }} />
      )}
    </button>
  );
}

export default function Sidebar({ activeModel, onNavigate }) {
  const { hasAccess, user } = useAuth();

  return (
    <aside style={{
      width: "220px",
      flexShrink: 0,
      background: theme.colors.bg.surface,
      borderRight: `1px solid ${theme.colors.border.subtle}`,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 16px",
        borderBottom: `1px solid ${theme.colors.border.subtle}`,
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: theme.font.size.lg,
          fontWeight: theme.font.weight.bold,
          color: theme.colors.text.primary,
          letterSpacing: "-0.5px",
        }}>
          ⬡ AdminPanel
        </div>
        <div style={{
          fontSize: theme.font.size.xs,
          color: theme.colors.text.tertiary,
          marginTop: "2px",
        }}>
          Management System
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {/* Dashboard link */}
        <NavItem
          modelKey="dashboard"
          modelDef={{ icon: "▦", labelPlural: "Dashboard" }}
          active={activeModel}
          onClick={onNavigate}
        />

        <div style={{ margin: "8px 0" }} />

        {NAV_SECTIONS.map((section) => {
          const visibleModels = section.models.filter((key) => {
            const model = MODELS[key];
            return model && hasAccess(model.roles);
          });

          if (visibleModels.length === 0) return null;

          return (
            <div key={section.label} style={{ marginBottom: "16px" }}>
              <div style={{
                fontSize: theme.font.size.xs,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.text.tertiary,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0 12px",
                marginBottom: "4px",
              }}>
                {section.label}
              </div>

              {visibleModels.map((key) => (
                <NavItem
                  key={key}
                  modelKey={key}
                  modelDef={MODELS[key]}
                  active={activeModel}
                  onClick={onNavigate}
                />
              ))}
            </div>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div style={{
        padding: "12px 16px",
        borderTop: `1px solid ${theme.colors.border.subtle}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px",
            borderRadius: "50%",
            background: theme.colors.accent.light,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
            flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{
              fontSize: theme.font.size.sm,
              fontWeight: theme.font.weight.medium,
              color: theme.colors.text.primary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {user?.name || "User"}
            </div>
            <div style={{
              fontSize: theme.font.size.xs,
              color: theme.colors.text.tertiary,
              textTransform: "capitalize",
            }}>
              {user?.role || "viewer"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
