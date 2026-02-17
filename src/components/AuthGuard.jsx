import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../utils/auth";

function AuthGuard({ allowedRoles = [], children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  const role = getRole();
  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;

  }

  return children;
}

export default AuthGuard;
