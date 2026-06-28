import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '@heroui/react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner size="lg" color="accent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (roles && !roles.includes(role)) {
    const home = role === 'admin' ? '/admin' : role === 'agency' ? '/agency' : '/account'
    return <Navigate to={home} replace />
  }

  return children
}
