/**
 * helpers.js — Pure utility functions
 */

/** Format bytes to human-readable size */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Format ISO date string to locale display */
export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format datetime */
export function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Debounce — delay fn call until after wait ms of inactivity */
export function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** Truncate string to maxLen characters */
export function truncate(str, maxLen = 50) {
  if (!str) return "";
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}

/** Convert snake_case to Title Case */
export function toTitleCase(str) {
  return str
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Build initial form values from field definitions */
export function buildInitialValues(fields, existingRecord = null) {
  const values = {};
  fields.forEach((field) => {
    if (existingRecord && field.key in existingRecord) {
      values[field.key] = existingRecord[field.key] ?? field.defaultValue ?? "";
    } else {
      values[field.key] = field.defaultValue ?? "";
    }
  });
  return values;
}

/** Extract validation errors from API response */
export function extractApiErrors(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "An unexpected error occurred.";
  if (typeof data.message === "string") return data.message;
  if (data.errors) {
    return Object.values(data.errors).flat().join(" ");
  }
  return "Request failed.";
}
