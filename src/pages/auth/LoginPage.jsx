import React, { useState } from "react";
import theme from "../../config/theme";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import { useToast } from "../../components/common/Toast";
import { extractApiErrors } from "../../utils/helpers";

export default function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const showToast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await login(form.email, form.password);
      showToast(`Welcome back, ${user.name}!`, "success");
      onLoginSuccess();
    } catch (err) {
      setError(extractApiErrors(err) || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: "42px",
    padding: "0 14px",
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.size.base,
    fontFamily: theme.font.body,
    color: theme.colors.text.primary,
    background: theme.colors.bg.surface,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 150ms",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.colors.bg.base,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        animation: "fadeIn 300ms ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "32px",
            marginBottom: "12px",
          }}>⬡</div>
          <h1 style={{
            fontSize: theme.font.size["2xl"],
            fontWeight: theme.font.weight.bold,
            color: theme.colors.text.primary,
            margin: "0 0 6px",
            letterSpacing: "-0.5px",
          }}>
            AdminPanel
          </h1>
          <p style={{ fontSize: theme.font.size.sm, color: theme.colors.text.tertiary, margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: theme.colors.bg.surface,
          borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border.subtle}`,
          boxShadow: theme.shadow.md,
          padding: "32px",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Error alert */}
            {error && (
              <div style={{
                padding: "10px 14px",
                background: theme.colors.accent.dangerLight,
                color: theme.colors.accent.danger,
                borderRadius: theme.radius.md,
                fontSize: theme.font.size.sm,
                border: `1px solid ${theme.colors.accent.danger}30`,
              }}>
                {error}
              </div>
            )}

            <div>
              <label style={{
                display: "block",
                fontSize: theme.font.size.xs,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}>
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                autoComplete="email"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = theme.colors.accent.primary; }}
                onBlur={(e) => { e.target.style.borderColor = theme.colors.border.default; }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: theme.font.size.xs,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = theme.colors.accent.primary; }}
                onBlur={(e) => { e.target.style.borderColor = theme.colors.border.default; }}
              />
            </div>

            <Button type="submit" fullWidth disabled={loading} size="lg" style={{ marginTop: "4px" }}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: "20px",
            padding: "10px 14px",
            background: theme.colors.bg.base,
            borderRadius: theme.radius.md,
            fontSize: theme.font.size.xs,
            color: theme.colors.text.tertiary,
          }}>
            <strong style={{ color: theme.colors.text.secondary }}>Demo credentials</strong><br />
            admin@example.com / password
          </div>
        </div>
      </div>
    </div>
  );
}
