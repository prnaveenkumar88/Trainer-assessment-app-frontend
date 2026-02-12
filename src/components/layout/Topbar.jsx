import { useState, useEffect } from "react";

function Topbar() {
const [theme, setTheme] = useState(
  document.body.getAttribute("data-theme") || "dark"
);

useEffect(() => {
  document.body.setAttribute("data-theme", theme);
}, [theme]);


  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="topbar">
      <div className="topbar-title">
        Trainer Assessment System
      </div>

      <button className="theme-btn" onClick={toggleTheme}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

export default Topbar;
