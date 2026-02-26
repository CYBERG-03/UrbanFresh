import { Link } from 'react-router-dom';

/**
 * Presentation Layer – Login page placeholder.
 * Full implementation in SCRUM-3 (Login + JWT Token Issuance).
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">UrbanFresh</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>
        <p className="text-gray-400 text-sm mb-4">Login coming in SCRUM-3</p>
        <Link to="/register" className="text-green-600 hover:underline text-sm">
          Register instead
        </Link>
      </div>
    </div>
  );
}
