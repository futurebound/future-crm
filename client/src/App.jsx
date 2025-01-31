import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import NavBar from './components/NavBar'
import { UserAuth } from '@/context/AuthContext'

function App() {
  const { session } = UserAuth()

  return (
    <>
      <main className='flex-grow'>
        <Outlet />
        <Toaster />
      </main>
      {session && <NavBar session={session} />}
    </>
  )
}

export default App
