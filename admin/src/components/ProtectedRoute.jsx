import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/**
 * ProtectedRoute Component
 *
 * Rules:
 * - Only checks authentication (no side effects)
 * - Uses <Navigate /> instead of navigate() to avoid loops
 * - No useEffect, no state updates, no re-renders
 * - Pure function based on current auth state
 */
const ProtectedRoute = ({ children }) => {
  // Simple check: if not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render children if provided, otherwise render nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
