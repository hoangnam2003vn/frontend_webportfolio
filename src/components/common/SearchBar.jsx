/**
 * SearchBar.jsx — Debounced search input
 * Props: value, onChange, placeholder, onClear
 */
import React, { useCallback } from "react";
import theme from "../../config/theme";
import { debounce } from "../../utils/helpers";

export default function SearchBar({ value, onChange, placeholder = "Search…", style: sx = {} }) {
  // Debounce so we don't fire on every keystroke
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(debounce(onChange, 350), [onChange]);

  const [local, setLocal] = React.useState(value || "");

  const handleChange = (e) => {
    setLocal(e.target.value);
    debouncedOnChange(e.target.value);
  };

  const clear = () => {
    setLocal("");
    onChange("");
  };

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", ...sx }}>
      {/* Search icon */}
      <svg
        width="15" height="15" viewBox="0 0 15 15" fill="none"
        style={{ position: "absolute", left: "10px", color: theme.colors.text.tertiary, pointerEvents: "none" }}
      >
        <path
          d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-.691 3.395 2.853 2.853-.707.707-2.853-2.853A4.5 4.5 0 1 1 9.31 9.895Z"
          fill="currentColor"
        />
      </svg>

      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          height: "36px",
          paddingLeft: "32px",
          paddingRight: local ? "32px" : "12px",
          paddingTop: 0, paddingBottom: 0,
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.radius.md,
          fontSize: theme.font.size.sm,
          fontFamily: theme.font.body,
          color: theme.colors.text.primary,
          background: theme.colors.bg.surface,
          outline: "none",
          width: "220px",
          transition: "border-color 150ms",
        }}
        onFocus={(e) => { e.target.style.borderColor = theme.colors.accent.primary; }}
        onBlur={(e) => { e.target.style.borderColor = theme.colors.border.default; }}
      />

      {/* Clear button */}
      {local && (
        <button
          onClick={clear}
          style={{
            position: "absolute", right: "8px",
            background: "none", border: "none", cursor: "pointer",
            color: theme.colors.text.tertiary, fontSize: "16px",
            lineHeight: 1, padding: "2px",
          }}
        >×</button>
      )}
    </div>
  );
}
