/**
 * theme.js — Design tokens
 * Import this in every component that needs styling constants.
 */
const theme = {
  colors: {
    bg: {
      base: "#F7F8FC",
      surface: "#FFFFFF",
      hover: "#F0F2F8",
      overlay: "rgba(15,20,40,0.45)",
    },
    border: {
      subtle: "#E8EAF0",
      default: "#D0D4E0",
    },
    text: {
      primary: "#0F1428",
      secondary: "#5A6080",
      tertiary: "#9BA3C0",
      inverse: "#FFFFFF",
    },
    accent: {
      primary: "#5B6AF0",
      hover: "#4A57D4",
      light: "rgba(91,106,240,0.08)",
      danger: "#E5484D",
      dangerLight: "rgba(229,72,77,0.08)",
      success: "#30A46C",
      successLight: "rgba(48,164,108,0.08)",
      warning: "#F59E0B",
      warningLight: "rgba(245,158,11,0.08)",
    },
  },
  spacing: {
    xs: "4px", sm: "8px", md: "16px",
    lg: "24px", xl: "32px", "2xl": "48px",
  },
  radius: {
    sm: "6px", md: "8px", lg: "12px", full: "9999px",
  },
  shadow: {
    sm: "0 1px 3px rgba(0,0,0,0.06)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 8px 24px rgba(0,0,0,0.12)",
    modal: "0 20px 60px rgba(0,0,0,0.2)",
  },
  font: {
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', monospace",
    size: {
      xs: "11px", sm: "13px", base: "14px",
      md: "16px", lg: "18px", xl: "22px", "2xl": "28px",
    },
    weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
};

export default theme;
