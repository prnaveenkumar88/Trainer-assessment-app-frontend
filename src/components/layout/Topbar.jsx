import { useState, useEffect } from "react";
import brandLogo from "../../assets/branding/omotec-logo.gif";

const THEME_STORAGE_KEY = "app-theme";

function Topbar({ onToggleSidebar }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return document.body.getAttribute("data-theme") || "dark";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);


  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>

        <div className="topbar-brand">
          <img
            src={brandLogo}
            alt="OMOTEC Learn Tech For Future"
            className="brand-logo"
          />

          <div className="topbar-title">
            Trainer Assessment System
          </div>
        </div>
      </div>

      <button
        type="button"
        className="theme-btn"
        onClick={toggleTheme}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

export default Topbar;
