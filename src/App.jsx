import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/common/Toast";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ModelPage from "./pages/dashboard/ModelPage";
import AppLayout from "./components/layout/AppLayout";
import MODELS from "./config/models";
import { LoadingOverlay } from "./components/common/Spinner";


const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; font-size: 16px; }
  body { -webkit-font-smoothing: antialiased; background: #F7F8FC; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D0D4E0; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #9BA3C0; }

  input, textarea, select, button { font-family: inherit; }
  button { cursor: pointer; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleUp { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
`;

// ── Authenticated shell ───────────────────────────────────
function AuthenticatedApp() {
  const { loading, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Show spinner while restoring session from localStorage
  if (loading) return <LoadingOverlay message="Restoring session…" />;
  if (!isAuthenticated) return null; // Parent will render LoginPage

  // Derive page title from current page
  const getTitle = () => {
    if (currentPage === "dashboard") return "Dashboard";
    const model = MODELS[currentPage];
    return model ? model.labelPlural : currentPage;
  };

  const getSubtitle = () => {
    if (currentPage === "dashboard") return "Overview";
    const model = MODELS[currentPage];
    return model ? `Manage ${model.labelPlural.toLowerCase()}` : "";
  };

  return (
    <AppLayout
      activeModel={currentPage}
      onNavigate={setCurrentPage}
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {currentPage === "dashboard" ? (
        <DashboardPage onNavigate={setCurrentPage} />
      ) : (
        <ModelPage key={currentPage} modelKey={currentPage} />
      )}
    </AppLayout>
  );
}

// ── Root routing switch ───────────────────────────────────
function AppRouter() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay message="Loading…" />;
  }

  if (!isAuthenticated) {
    // onLoginSuccess triggers a re-render via AuthContext state change
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  return <AuthenticatedApp />;
}

// ── App entry point ───────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </>
  );
}
