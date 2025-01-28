import axios from 'axios'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'

import NavBar from './components/NavBar'

function App() {
  const fetchAPI = async () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await axios.get(apiUrl)
    // const response = await axios.get('https://future-crm-server.vercel.app/')
    console.log(response.data.message)
  }

  // [] to ensure only runs on initial render
  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
      <NavBar />
      <main className='flex-grow'>
        <Outlet />
        <Toaster />
      </main>
    </>
  )
}

export default App
