/**
 * Badge.jsx — Inline status/label chip
 */
import React from "react";
import theme from "../../config/theme";

const STATUS_COLORS = {
  published: { bg: theme.colors.accent.successLight, color: theme.colors.accent.success },
  active: { bg: theme.colors.accent.successLight, color: theme.colors.accent.success },
  approved: { bg: theme.colors.accent.successLight, color: theme.colors.accent.success },
  delivered: { bg: theme.colors.accent.successLight, color: theme.colors.accent.success },
  draft: { bg: theme.colors.bg.hover, color: theme.colors.text.secondary },
  pending: { bg: theme.colors.accent.warningLight, color: "#B45309" },
  processing: { bg: theme.colors.accent.warningLight, color: "#B45309" },
  shipped: { bg: "rgba(91,106,240,0.1)", color: theme.colors.accent.primary },
  inactive: { bg: theme.colors.accent.dangerLight, color: theme.colors.accent.danger },
  cancelled: { bg: theme.colors.accent.dangerLight, color: theme.colors.accent.danger },
  spam: { bg: theme.colors.accent.dangerLight, color: theme.colors.accent.danger },
  trash: { bg: theme.colors.accent.dangerLight, color: theme.colors.accent.danger },
  archived: { bg: theme.colors.bg.hover, color: theme.colors.text.tertiary },
  admin: { bg: "rgba(91,106,240,0.12)", color: theme.colors.accent.primary },
  editor: { bg: "rgba(48,164,108,0.1)", color: theme.colors.accent.success },
  viewer: { bg: theme.colors.bg.hover, color: theme.colors.text.secondary },
  out_of_stock: { bg: theme.colors.accent.dangerLight, color: theme.colors.accent.danger },
};

export default function Badge({ value }) {
  if (value === null || value === undefined) return <span style={{ color: theme.colors.text.tertiary }}>—</span>;

  const str = String(value);
  const colors = STATUS_COLORS[str.toLowerCase()] || {
    bg: theme.colors.accent.light,
    color: theme.colors.accent.primary,
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: theme.radius.full,
        fontSize: theme.font.size.xs,
        fontWeight: theme.font.weight.semibold,
        letterSpacing: "0.02em",
        textTransform: "capitalize",
        ...colors,
      }}
    >
      {str.replace(/_/g, " ")}
    </span>
  );
}
