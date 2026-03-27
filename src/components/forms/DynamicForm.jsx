/**
 * DynamicForm.jsx — Schema-driven form generator
 *
 * Given a list of field definitions, renders the appropriate input widget
 * for each field. Handles: text, textarea, number, email, password,
 * select, multi-select, boolean, date, datetime, file, image, rich_text.
 *
 * Props:
 *   fields     — field definitions from model config
 *   values     — current form values { [key]: value }
 *   onChange   — (key, value) => void
 *   errors     — { [key]: string } validation errors
 *   disabled   — disable all inputs
 */
import React, { useRef } from "react";
import theme from "../../config/theme";
import { FIELD_TYPES } from "../../config/models";

// ── Shared input style ────────────────────────────────────
const inputBase = {
  width: "100%",
  height: "38px",
  padding: "0 12px",
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radius.md,
  fontSize: theme.font.size.sm,
  fontFamily: theme.font.body,
  color: theme.colors.text.primary,
  background: theme.colors.bg.surface,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 150ms",
};

// ── Individual field components ───────────────────────────

function TextInput({ field, value, onChange, disabled }) {
  return (
    <input
      type={field.type === FIELD_TYPES.EMAIL ? "email" : field.type === FIELD_TYPES.PASSWORD ? "password" : "text"}
      value={value ?? ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder || ""}
      disabled={disabled || field.readonly}
      style={inputBase}
      onFocus={(e) => { e.target.style.borderColor = theme.colors.accent.primary; }}
      onBlur={(e) => { e.target.style.borderColor = theme.colors.border.default; }}
    />
  );
}

function NumberInput({ field, value, onChange, disabled }) {
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(field.key, e.target.value === "" ? "" : Number(e.target.value))}
      placeholder={field.placeholder || "0"}
      disabled={disabled || field.readonly}
      style={inputBase}
      onFocus={(e) => { e.target.style.borderColor = theme.colors.accent.primary; }}
      onBlur={(e) => { e.target.style.borderColor = theme.colors.border.default; }}
    />
  );
}

function TextareaInput({ field, value, onChange, disabled }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder || ""}
      disabled={disabled || field.readonly}
      rows={4}
      style={{
        ...inputBase,
        height: "auto",
        padding: "10px 12px",
        resize: "vertical",
        minHeight: "90px",
      }}
      onFocus={(e) => { e.target.style.borderColor = theme.colors.accent.primary; }}
      onBlur={(e) => { e.target.style.borderColor = theme.colors.border.default; }}
    />
  );
}

function SelectInput({ field, value, onChange, disabled }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      disabled={disabled || field.readonly}
      style={{ ...inputBase, cursor: "pointer", appearance: "auto" }}
    >
      <option value="">— Select —</option>
      {(field.options || []).map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

function MultiSelectInput({ field, value, onChange, disabled }) {
  const selected = Array.isArray(value) ? value : [];
  const toggle = (optVal) => {
    const next = selected.includes(optVal)
      ? selected.filter((v) => v !== optVal)
      : [...selected, optVal];
    onChange(field.key, next);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {(field.options || []).map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => !disabled && toggle(opt.value)}
            style={{
              padding: "4px 10px",
              borderRadius: theme.radius.full,
              border: `1px solid ${active ? theme.colors.accent.primary : theme.colors.border.default}`,
              background: active ? theme.colors.accent.light : theme.colors.bg.surface,
              color: active ? theme.colors.accent.primary : theme.colors.text.secondary,
              fontSize: theme.font.size.xs,
              fontWeight: theme.font.weight.medium,
              fontFamily: theme.font.body,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 150ms",
            }}
          >
            {active && "✓ "}{opt.label}
          </button>
        );
      })}
    </div>
  );
}

function BooleanInput({ field, value, onChange, disabled }) {
  const checked = Boolean(value);
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: disabled ? "not-allowed" : "pointer" }}>
      <div
        onClick={() => !disabled && onChange(field.key, !checked)}
        style={{
          width: "40px", height: "22px",
          borderRadius: theme.radius.full,
          background: checked ? theme.colors.accent.primary : theme.colors.border.default,
          position: "relative",
          transition: "background 200ms",
          cursor: disabled ? "not-allowed" : "pointer",
          flexShrink: 0,
        }}
      >
        <div style={{
          width: "18px", height: "18px",
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: "2px",
          left: checked ? "20px" : "2px",
          transition: "left 200ms",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </div>
      <span style={{ fontSize: theme.font.size.sm, color: theme.colors.text.secondary }}>
        {checked ? "Yes" : "No"}
      </span>
    </label>
  );
}

function DateInput({ field, value, onChange, disabled }) {
  return (
    <input
      type={field.type === FIELD_TYPES.DATETIME ? "datetime-local" : "date"}
      value={value ?? ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      disabled={disabled || field.readonly}
      style={inputBase}
      onFocus={(e) => { e.target.style.borderColor = theme.colors.accent.primary; }}
      onBlur={(e) => { e.target.style.borderColor = theme.colors.border.default; }}
    />
  );
}

function FileInput({ field, value, onChange, disabled }) {
  const ref = useRef(null);
  const isImage = field.type === FIELD_TYPES.IMAGE;

  return (
    <div>
      {/* Preview */}
      {isImage && value && typeof value === "string" && (
        <img
          src={value}
          alt="preview"
          style={{
            width: "80px", height: "80px",
            objectFit: "cover", borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border.subtle}`,
            marginBottom: "8px", display: "block",
          }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      )}

      <div
        onClick={() => !disabled && ref.current?.click()}
        style={{
          border: `2px dashed ${theme.colors.border.default}`,
          borderRadius: theme.radius.md,
          padding: "20px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: theme.colors.bg.base,
          transition: "border-color 150ms",
        }}
        onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = theme.colors.accent.primary; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.colors.border.default; }}
      >
        <div style={{ fontSize: "24px", marginBottom: "6px" }}>{isImage ? "🖼️" : "📎"}</div>
        <div style={{ fontSize: theme.font.size.sm, color: theme.colors.text.secondary }}>
          Click to {isImage ? "upload image" : "choose file"}
        </div>
        {field.accept && (
          <div style={{ fontSize: theme.font.size.xs, color: theme.colors.text.tertiary, marginTop: "4px" }}>
            {field.accept}
          </div>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept={field.accept || "*/*"}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(field.key, file);
        }}
      />

      {value instanceof File && (
        <div style={{ marginTop: "6px", fontSize: theme.font.size.xs, color: theme.colors.accent.success }}>
          ✓ {value.name} selected
        </div>
      )}
    </div>
  );
}

function ReadonlyField({ value }) {
  return (
    <div style={{
      ...inputBase,
      display: "flex", alignItems: "center",
      background: theme.colors.bg.base,
      color: theme.colors.text.secondary,
      cursor: "not-allowed",
    }}>
      {String(value ?? "—")}
    </div>
  );
}

// ── Field dispatcher ──────────────────────────────────────
function FieldInput({ field, value, onChange, disabled }) {
  if (field.readonly) return <ReadonlyField value={value} />;

  switch (field.type) {
    case FIELD_TYPES.TEXT:
    case FIELD_TYPES.EMAIL:
    case FIELD_TYPES.PASSWORD:
      return <TextInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    case FIELD_TYPES.NUMBER:
      return <NumberInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    case FIELD_TYPES.TEXTAREA:
    case FIELD_TYPES.RICH_TEXT:
      return <TextareaInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    case FIELD_TYPES.SELECT:
    case FIELD_TYPES.RELATION:
      return <SelectInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    case FIELD_TYPES.MULTI_SELECT:
      return <MultiSelectInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    case FIELD_TYPES.BOOLEAN:
      return <BooleanInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      return <DateInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    case FIELD_TYPES.FILE:
    case FIELD_TYPES.IMAGE:
      return <FileInput field={field} value={value} onChange={onChange} disabled={disabled} />;
    default:
      return <TextInput field={field} value={value} onChange={onChange} disabled={disabled} />;
  }
}

// ── Main DynamicForm ──────────────────────────────────────
export default function DynamicForm({ fields, values, onChange, errors = {}, disabled = false }) {
  // Filter out readonly-only fields when creating (no value to show)
  const editableFields = fields.filter((f) => !f.readonly || values[f.key] !== undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {editableFields.map((field) => (
        <div key={field.key}>
          {/* Label */}
          <label style={{
            display: "block",
            fontSize: theme.font.size.xs,
            fontWeight: theme.font.weight.semibold,
            color: theme.colors.text.secondary,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "6px",
          }}>
            {field.label}
            {field.required && <span style={{ color: theme.colors.accent.danger, marginLeft: "3px" }}>*</span>}
          </label>

          {/* Input */}
          <FieldInput
            field={field}
            value={values[field.key]}
            onChange={onChange}
            disabled={disabled}
          />

          {/* Validation error */}
          {errors[field.key] && (
            <div style={{
              marginTop: "4px",
              fontSize: theme.font.size.xs,
              color: theme.colors.accent.danger,
            }}>
              {errors[field.key]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
