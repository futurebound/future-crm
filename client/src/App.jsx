import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import NavBar from './components/NavBar'
import { UserAuth } from '@/context/AuthContext'

function App() {
  const { session } = UserAuth()

  return (
    <>
      {session && <NavBar session={session} />}
      <main className='mt-16 flex-grow'>
        <Outlet />
        <Toaster />
      </main>
    </>
  )
}

export default App
