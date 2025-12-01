// WorkerLayout.jsx
import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { logout } from "../../utils/auth";

export default function WorkerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const userId = localStorage.getItem("userId");

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.wrapper}>

      {/* ===== MOBILE TOP BAR ===== */}
      {isMobile && (
        <div style={styles.mobileTopBar}>
          <FiMenu
            size={28}
            onClick={() => setSidebarOpen(true)}
            style={{ cursor: "pointer" }}
          />
          <h2 style={styles.mobileTitle}>Worker Dashboard</h2>
        </div>
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isMobile
            ? sidebarOpen
              ? "translateX(0)"
              : "translateX(-260px)"
            : "translateX(0)",
        }}
      >
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>Worker</h2>
          {isMobile && (
            <FiX
              size={26}
              onClick={() => setSidebarOpen(false)}
              style={{ cursor: "pointer", color: "white" }}
            />
          )}
        </div>

        {/* ===== NAV LINKS ===== */}
        <nav style={styles.navContainer}>
          <a href={`/WorkerDashboard/${userId}`} style={styles.navItem}>Dashboard</a>
          <a href={`/worker/projects/${userId}`} style={styles.navItem}>My Projects</a>
          <a href={`/worker/tasks/${userId}`} style={styles.navItem}>My Tasks</a>
          <a href={`/worker/history/${userId}`} style={styles.navItem}>History</a>
        </nav>

        {/* ===== LOGOUT BUTTON AT BOTTOM ===== */}
        <div style={styles.logoutContainer}>
          <button style={styles.logoutButton} onClick={logout}>
            <FiLogOut style={{ marginRight: "8px" }} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MOBILE OVERLAY ===== */}
      {isMobile && sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main
        style={{
          ...styles.main,
          marginLeft: isMobile ? "0" : "230px",  // ✅ fixes desktop layout
          paddingTop: isMobile ? "70px" : "30px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    overflow: "hidden",
  },

  /* ===== SIDEBAR ===== */
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "230px",
    height: "100vh",
    background: "#1f2937",
    color: "white",
    padding: "30px 20px",
    zIndex: 3000,
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",   // ✅ sidebar scrolls internally
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
  },

  navContainer: {
    flexGrow: 1, // fills space above logout
    marginTop: "10px",
  },

  navItem: {
    display: "block",
    padding: "12px 0",
    color: "#D1D5DB",
    textDecoration: "none",
    borderBottom: "1px solid #374151",
  },

  /* ===== LOGOUT ===== */
  logoutContainer: {
    marginTop: "auto",
    paddingTop: "20px",
  },

  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "#f87171", // red color
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },

  /* ===== MAIN CONTENT ===== */
  main: {
    flex: 1,
    padding: "30px",
    overflowX: "hidden",
    background: "#f6f6f6",
    minHeight: "100vh",
  },

  /* ===== MOBILE TOP BAR ===== */
  mobileTopBar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "60px",
    width: "100%",
    background: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingLeft: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    zIndex: 3500,
  },

  mobileTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1f2937",
  },

  /* ===== OVERLAY ===== */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.45)",
    zIndex: 2500,
  },
};
