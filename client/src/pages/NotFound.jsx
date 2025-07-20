// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-md transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
}