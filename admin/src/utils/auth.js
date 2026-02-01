/**
 * Authentication utility functions
 * Single source of truth for auth state
 */

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  // Prefer token if present (API auth), but also allow legacy/login-flag and currentUser
  const token = localStorage.getItem("token");
  if (token) return true;

  const flag = localStorage.getItem("isAuthenticated");
  if (flag === "true") return true;

  const user = localStorage.getItem("currentUser");
  return !!user;
};

/**
 * Get stored token
 * @returns {string|null} Token or null
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get current user data
 * @returns {object|null} User object or null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Set authentication data
 * @param {string} token - JWT token
 * @param {object} user - User object
 */
export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAuthenticated");
};
