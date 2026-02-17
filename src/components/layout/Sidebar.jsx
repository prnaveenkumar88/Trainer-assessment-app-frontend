import { useNavigate } from "react-router-dom";
import { getRole, logout } from "../../utils/auth";

function Sidebar({ isOpen = false, onNavigate }) {

  const navigate = useNavigate();
  const role = getRole();

  const handleNavigate = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      <div className="sidebar-inner">

        {/* APP TITLE */}
        <h3 className="sidebar-title">TechStack</h3>

        {/* NAVIGATION */}
        <div className="sidebar-menu">

          {role === "admin" && (
            <button
              className="sidebar-btn"
              onClick={() => handleNavigate("/admin")}
            >
              Admin Dashboard
            </button>
          )}

          {role === "assessor" && (
            <button
              className="sidebar-btn"
              onClick={() => handleNavigate("/assessor")}
            >
              Assessor Dashboard
            </button>
          )}

          {role === "trainer" && (
            <button
              className="sidebar-btn"
              onClick={() => handleNavigate("/trainer")}
            >
              Trainer Dashboard
            </button>
          )}

        </div>

        {/* LOGOUT AT BOTTOM */}
        <div className="sidebar-footer">
          <button
            className="sidebar-btn logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>

      </div>

    </div>
  );
}

export default Sidebar;
