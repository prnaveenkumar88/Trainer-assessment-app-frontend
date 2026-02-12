import { getRole, isLoggedIn } from "../utils/auth";

function AuthGuard({ allowedRoles, children }) {
  if (!isLoggedIn()) {
    window.location.href = "/";
    return null;
  }

  const role = getRole();
  if (!allowedRoles.includes(role)) {
    return <h3>Access Denied</h3>;
  }

  return children;
}

export default AuthGuard;
