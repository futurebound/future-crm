import { UserAuth } from '@/context/AuthContext'

export default function InteractionsPage() {
  const { session } = UserAuth()

  return (
    <div>
      <h1>Interactions Page</h1>
      <h2>Welcome, {session?.user?.email}</h2>
    </div>
  )
}
