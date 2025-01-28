import axios from 'axios'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import NavBar from './components/NavBar'

function App() {
  const fetchAPI = async () => {
    const response = await axios.get('http://localhost:8080/api/v1')
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
      </main>
    </>
  )
}

export default App
