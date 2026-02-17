import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/layout.css";

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout">

      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={closeSidebar}
      />

      <div className="main">
        <Topbar
          onToggleSidebar={() =>
            setIsSidebarOpen((prev) => !prev)
          }
        />

        <div className="content" onClick={closeSidebar}>
          {children}
        </div>
      </div>

      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

    </div>
  );
}

export default Layout;
