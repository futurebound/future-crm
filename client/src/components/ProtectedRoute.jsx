import React from 'react'
import { Navigate } from 'react-router-dom'

import { UserAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, session, loading } = UserAuth()

  // if (loading) return <div>Loading...</div>
  if (!session) return <Navigate to='/login' replace />

  return <>{children}</>
}
