export const saveAuth = (token, role, email, name) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);
  localStorage.setItem("name", name);
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const getEmail = () => {
  return localStorage.getItem("email");
};

export const getName = () => {
  return localStorage.getItem("name");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
