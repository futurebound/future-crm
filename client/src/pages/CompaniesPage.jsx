import { UserAuth } from '@/context/AuthContext'

export default function CompaniesPage() {
  const { session } = UserAuth()

  return (
    <div>
      <h1>Companies Page</h1>
      <h2>Welcome, {session?.user?.email}</h2>
    </div>
  )
}
