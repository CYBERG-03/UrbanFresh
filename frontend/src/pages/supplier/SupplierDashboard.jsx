import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * Presentation Layer – Supplier dashboard placeholder.
 * Full implementation in later sprints (product uploads, shipments).
 */
export default function SupplierDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">UrbanFresh Supplier</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-600">
          Welcome, <span className="font-semibold">{user?.name}</span> (Supplier)
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Supplier portal coming in upcoming sprints.
        </p>
      </div>
    </div>
  );
}
