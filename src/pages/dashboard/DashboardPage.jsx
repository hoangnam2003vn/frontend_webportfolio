import React from "react";
import theme from "../../config/theme";
import MODELS from "../../config/models";
import { useAuth } from "../../context/AuthContext";

function StatCard({ model, modelKey, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.colors.bg.surface,
        border: `1px solid ${hovered ? theme.colors.accent.primary : theme.colors.border.subtle}`,
        borderRadius: theme.radius.lg,
        padding: "20px",
        cursor: "pointer",
        transition: "all 180ms ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? theme.shadow.md : theme.shadow.sm,
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "12px" }}>{model.icon}</div>
      <div style={{
        fontSize: theme.font.size.lg,
        fontWeight: theme.font.weight.bold,
        color: theme.colors.text.primary,
        marginBottom: "4px",
      }}>
        {model.labelPlural}
      </div>
      <div style={{
        fontSize: theme.font.size.xs,
        color: theme.colors.text.tertiary,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>
        {model.fields.length} fields · {model.roles.join(", ")}
      </div>

      <div style={{
        marginTop: "16px",
        paddingTop: "12px",
        borderTop: `1px solid ${theme.colors.border.subtle}`,
        fontSize: theme.font.size.xs,
        color: hovered ? theme.colors.accent.primary : theme.colors.text.tertiary,
        fontWeight: theme.font.weight.medium,
        transition: "color 180ms",
      }}>
        Manage {model.labelPlural} →
      </div>
    </div>
  );
}

export default function DashboardPage({ onNavigate }) {
  const { user, hasAccess } = useAuth();

  const accessibleModels = Object.entries(MODELS).filter(([, model]) =>
    hasAccess(model.roles)
  );

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Welcome */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{
          fontSize: theme.font.size["2xl"],
          fontWeight: theme.font.weight.bold,
          color: theme.colors.text.primary,
          margin: "0 0 8px",
          letterSpacing: "-0.5px",
        }}>
          Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
        </h2>
        <p style={{ fontSize: theme.font.size.base, color: theme.colors.text.secondary, margin: 0 }}>
          You have access to {accessibleModels.length} module{accessibleModels.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Quick stats row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        marginBottom: "32px",
      }}>
        {[
          { label: "Total Modules", value: accessibleModels.length, icon: "◧" },
          { label: "Your Role", value: user?.role || "—", icon: "🔐" },
          { label: "System Status", value: "Online", icon: "●" },
        ].map((s) => (
          <div key={s.label} style={{
            background: theme.colors.bg.surface,
            border: `1px solid ${theme.colors.border.subtle}`,
            borderRadius: theme.radius.md,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <span style={{ fontSize: "20px" }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: theme.font.size.lg, fontWeight: theme.font.weight.bold, color: theme.colors.text.primary, textTransform: "capitalize" }}>
                {s.value}
              </div>
              <div style={{ fontSize: theme.font.size.xs, color: theme.colors.text.tertiary }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Model grid */}
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{
          fontSize: theme.font.size.base,
          fontWeight: theme.font.weight.semibold,
          color: theme.colors.text.secondary,
          margin: "0 0 16px",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: theme.font.size.xs,
        }}>
          Available Modules
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}>
          {accessibleModels.map(([key, model]) => (
            <StatCard
              key={key}
              modelKey={key}
              model={model}
              onClick={() => onNavigate(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
