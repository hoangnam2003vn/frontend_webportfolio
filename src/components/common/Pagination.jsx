/**
 * Pagination.jsx — Page navigation controls
 * Props: meta { page, last_page, total, per_page }, onChange(page)
 */
import React from "react";
import theme from "../../config/theme";

function PageBtn({ label, active, disabled, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: "32px", height: "32px",
        padding: "0 8px",
        border: active
          ? `1px solid ${theme.colors.accent.primary}`
          : `1px solid ${theme.colors.border.subtle}`,
        borderRadius: theme.radius.sm,
        background: active
          ? theme.colors.accent.primary
          : hovered && !disabled ? theme.colors.bg.hover : theme.colors.bg.surface,
        color: active
          ? "#fff"
          : disabled ? theme.colors.text.tertiary : theme.colors.text.secondary,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: theme.font.size.sm,
        fontWeight: active ? theme.font.weight.semibold : theme.font.weight.normal,
        fontFamily: theme.font.body,
        transition: "all 120ms",
      }}
    >
      {label}
    </button>
  );
}

export default function Pagination({ meta, onChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { page, last_page, total, per_page } = meta;

  // Build visible page numbers (show up to 7 pages with ellipsis)
  const getPages = () => {
    if (last_page <= 7) return Array.from({ length: last_page }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", last_page];
    if (page >= last_page - 3) return [1, "…", last_page - 4, last_page - 3, last_page - 2, last_page - 1, last_page];
    return [1, "…", page - 1, page, page + 1, "…", last_page];
  };

  const from = (page - 1) * per_page + 1;
  const to = Math.min(page * per_page, total);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 0", flexWrap: "wrap", gap: "12px",
    }}>
      <span style={{ fontSize: theme.font.size.sm, color: theme.colors.text.tertiary }}>
        Showing {from}–{to} of {total} results
      </span>

      <div style={{ display: "flex", gap: "4px" }}>
        <PageBtn label="‹" disabled={page === 1} onClick={() => onChange(page - 1)} />

        {getPages().map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} style={{ padding: "0 4px", color: theme.colors.text.tertiary, lineHeight: "32px" }}>…</span>
            : <PageBtn key={p} label={p} active={p === page} onClick={() => onChange(p)} />
        )}

        <PageBtn label="›" disabled={page === last_page} onClick={() => onChange(page + 1)} />
      </div>
    </div>
  );
}
