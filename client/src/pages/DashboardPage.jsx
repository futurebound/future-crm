import { useNavigate } from 'react-router-dom'

import { UserAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { session, signOutUser } = UserAuth()
  const navigate = useNavigate()

  const handleSignOut = async (e) => {
    e.preventDefault()
    try {
      await signOutUser()
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Dashboard Page</h1>
      <h2>Welcome, {session?.user?.email}</h2>
      <div>
        <p
          onClick={handleSignOut}
          className='mt-4 inline-block border px-4 py-3 hover:cursor-pointer'
        >
          Sign Out
        </p>
      </div>
    </div>
  )
}
