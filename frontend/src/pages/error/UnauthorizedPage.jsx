import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Presentation Layer – Shown when a user tries to access a role they don't have.
 */
export default function UnauthorizedPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link
          to={isAuthenticated ? '/' : '/login'}
          className="text-green-600 hover:underline font-medium text-sm"
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
        </Link>
      </div>
    </div>
  );
}
