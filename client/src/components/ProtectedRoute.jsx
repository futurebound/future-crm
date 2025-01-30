import { Navigate } from 'react-router-dom'

import { UserAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session } = UserAuth()

  if (session === undefined) {
    ;<div>Loading...</div>
  } else if (!session) return <Navigate to='/login' replace />

  return <>{children}</>
}
