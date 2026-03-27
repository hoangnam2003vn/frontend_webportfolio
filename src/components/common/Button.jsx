/**
 * Button.jsx — Reusable button with variants
 * variants: primary | secondary | danger | ghost
 */
import React from "react";
import theme from "../../config/theme";

const styles = {
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    borderRadius: theme.radius.md,
    fontFamily: theme.font.body,
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.semibold,
    cursor: "pointer",
    transition: "all 150ms ease",
    textDecoration: "none",
  },
  sizes: {
    sm: { padding: "5px 10px", fontSize: theme.font.size.xs },
    md: { padding: "8px 14px", fontSize: theme.font.size.sm },
    lg: { padding: "10px 20px", fontSize: theme.font.size.base },
  },
  variants: {
    primary: {
      background: theme.colors.accent.primary,
      color: "#fff",
    },
    secondary: {
      background: theme.colors.bg.surface,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.default}`,
    },
    danger: {
      background: theme.colors.accent.danger,
      color: "#fff",
    },
    ghost: {
      background: "transparent",
      color: theme.colors.text.secondary,
    },
  },
  hover: {
    primary: { background: theme.colors.accent.hover },
    secondary: { background: theme.colors.bg.hover },
    danger: { background: "#C03035" },
    ghost: { background: theme.colors.bg.hover, color: theme.colors.text.primary },
  },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  fullWidth = false,
  icon = null,
  style: extraStyle = {},
}) {
  const [hovered, setHovered] = React.useState(false);

  const computed = {
    ...styles.base,
    ...styles.sizes[size],
    ...styles.variants[variant],
    ...(hovered && !disabled ? styles.hover[variant] : {}),
    ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}),
    ...(fullWidth ? { width: "100%", justifyContent: "center" } : {}),
    ...extraStyle,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={computed}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
