/**
 * DataTable.jsx — Generic table for any model
 *
 * Renders columns from field definitions where showInList === true.
 * Handles: sort, loading state, empty state, row actions.
 */
import React from "react";
import theme from "../../config/theme";
import { FIELD_TYPES } from "../../config/models";
import Badge from "./Badge";
import Spinner from "./Spinner";
import { formatDate, formatDateTime, formatFileSize, truncate } from "../../utils/helpers";

// ── Cell renderers by field type ─────────────────────────
function CellValue({ field, value }) {
  if (value === null || value === undefined || value === "") {
    return <span style={{ color: theme.colors.text.tertiary }}>—</span>;
  }

  switch (field.type) {
    case FIELD_TYPES.BOOLEAN:
      return (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          fontSize: theme.font.size.xs,
          color: value ? theme.colors.accent.success : theme.colors.text.tertiary,
        }}>
          {value ? "✓ Yes" : "✗ No"}
        </span>
      );

    case FIELD_TYPES.SELECT:
      return <Badge value={value} />;

    case FIELD_TYPES.DATE:
      return <span style={{ color: theme.colors.text.secondary, fontSize: theme.font.size.sm }}>{formatDate(value)}</span>;

    case FIELD_TYPES.DATETIME:
      return <span style={{ color: theme.colors.text.secondary, fontSize: theme.font.size.sm }}>{formatDateTime(value)}</span>;

    case FIELD_TYPES.IMAGE:
      return value ? (
        <img
          src={value}
          alt=""
          style={{ width: "32px", height: "32px", borderRadius: theme.radius.sm, objectFit: "cover", border: `1px solid ${theme.colors.border.subtle}` }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : <span style={{ color: theme.colors.text.tertiary }}>—</span>;

    case FIELD_TYPES.FILE:
      return <span style={{ fontSize: theme.font.size.xs, color: theme.colors.accent.primary }}>📎 {typeof value === "string" ? value.split("/").pop() : "File"}</span>;

    case FIELD_TYPES.NUMBER:
      if (field.key === "size") return <span style={{ fontSize: theme.font.size.sm }}>{formatFileSize(value)}</span>;
      if (field.key === "price" || field.key === "total") return <span style={{ fontWeight: theme.font.weight.semibold }}>${Number(value).toLocaleString()}</span>;
      return <span style={{ fontSize: theme.font.size.sm }}>{Number(value).toLocaleString()}</span>;

    case FIELD_TYPES.PASSWORD:
      return <span style={{ color: theme.colors.text.tertiary, letterSpacing: "2px" }}>••••••</span>;

    default:
      return (
        <span style={{ fontSize: theme.font.size.sm, color: theme.colors.text.primary }}>
          {truncate(String(value), 60)}
        </span>
      );
  }
}

// ── Sort icon ─────────────────────────────────────────────
function SortIcon({ active, dir }) {
  return (
    <span style={{ marginLeft: "4px", opacity: active ? 1 : 0.3, fontSize: "10px" }}>
      {active ? (dir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );
}

// ── Main table ────────────────────────────────────────────
export default function DataTable({
  fields,
  items,
  loading,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) {
  const visibleFields = fields.filter((f) => f.showInList);

  const headerCell = {
    padding: "10px 12px",
    textAlign: "left",
    fontSize: theme.font.size.xs,
    fontWeight: theme.font.weight.semibold,
    color: theme.colors.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: `1px solid ${theme.colors.border.subtle}`,
    background: theme.colors.bg.base,
    whiteSpace: "nowrap",
    userSelect: "none",
  };

  return (
    <div style={{ overflowX: "auto", borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border.subtle}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
        <thead>
          <tr>
            {visibleFields.map((field) => (
              <th
                key={field.key}
                style={{
                  ...headerCell,
                  cursor: field.sortable ? "pointer" : "default",
                }}
                onClick={() => field.sortable && onSort && onSort(field.key)}
              >
                {field.label}
                {field.sortable && (
                  <SortIcon active={sortBy === field.key} dir={sortDir} />
                )}
              </th>
            ))}
            {(canEdit || canDelete) && (
              <th style={{ ...headerCell, textAlign: "right", width: "100px" }}>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {/* Loading state */}
          {loading && (
            <tr>
              <td
                colSpan={visibleFields.length + 1}
                style={{ padding: "48px", textAlign: "center" }}
              >
                <Spinner label="Loading data…" />
              </td>
            </tr>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && (
            <tr>
              <td
                colSpan={visibleFields.length + 1}
                style={{
                  padding: "64px 24px",
                  textAlign: "center",
                  color: theme.colors.text.tertiary,
                  fontSize: theme.font.size.sm,
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.4 }}>📭</div>
                No records found
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!loading &&
            items.map((item, rowIdx) => (
              <tr
                key={item.id || rowIdx}
                style={{
                  borderBottom: `1px solid ${theme.colors.border.subtle}`,
                  transition: "background 120ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = theme.colors.bg.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
              >
                {visibleFields.map((field) => (
                  <td
                    key={field.key}
                    style={{ padding: "10px 12px", verticalAlign: "middle" }}
                  >
                    <CellValue field={field} value={item[field.key]} />
                  </td>
                ))}

                {(canEdit || canDelete) && (
                  <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                    {canEdit && (
                      <ActionBtn label="Edit" color={theme.colors.accent.primary} onClick={() => onEdit(item)} />
                    )}
                    {canDelete && (
                      <ActionBtn label="Delete" color={theme.colors.accent.danger} onClick={() => onDelete(item)} />
                    )}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? color + "15" : "none",
        border: "none",
        color: color,
        cursor: "pointer",
        fontSize: theme.font.size.xs,
        fontWeight: theme.font.weight.semibold,
        fontFamily: theme.font.body,
        padding: "4px 8px",
        borderRadius: theme.radius.sm,
        marginLeft: "4px",
        transition: "background 120ms",
      }}
    >
      {label}
    </button>
  );
}
