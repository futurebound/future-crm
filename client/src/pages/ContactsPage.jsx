import { UserAuth } from '@/context/AuthContext'

export default function ContactsPage() {
  const { session } = UserAuth()

  return (
    <div>
      <h1>Contacts Page</h1>
      <h2>Welcome, {session?.user?.email}</h2>
    </div>
  )
}
