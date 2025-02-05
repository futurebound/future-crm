import { useNavigate } from 'react-router-dom'

import { UserAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { session } = UserAuth()

  return (
    <div>
      <h1>Dashboard Page</h1>
      <h2>Welcome, {session?.user?.email}</h2>
    </div>
  )
}
