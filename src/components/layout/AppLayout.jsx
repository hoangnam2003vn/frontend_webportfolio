/**
 * AppLayout.jsx — Root layout: Sidebar + main content area
 */
import React from "react";
import theme from "../../config/theme";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const SIDEBAR_WIDTH = 220;

export default function AppLayout({ activeModel, onNavigate, title, subtitle, actions, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.colors.bg.base }}>
      {/* Fixed Sidebar */}
      <Sidebar activeModel={activeModel} onNavigate={onNavigate} />

      {/* Main content — offset by sidebar width */}
      <div style={{ flex: 1, marginLeft: `${SIDEBAR_WIDTH}px`, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Topbar title={title} subtitle={subtitle} actions={actions} />
        <main style={{ flex: 1, padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
