import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Routing Layer – Protects routes that require authentication.
 * Redirects unauthenticated users to /login.
 * Optionally restricts access to specific roles.
 *
 * @param {ReactNode} children - component to render if authorized
 * @param {string[]} [allowedRoles] - roles that can access (e.g. ['ADMIN']). If omitted, any authenticated user can access.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles specified, check user's role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
