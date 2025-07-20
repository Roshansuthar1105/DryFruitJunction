// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children,allowedRoles = ['user'] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children
}