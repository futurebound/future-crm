import { useEffect } from 'react'
import axios from 'axios'

function App() {
  const fetchAPI = async () => {
    // const response = await axios.get('http://localhost:8080/api')
    const response = await axios.get(
      'https://future-crm-server-ljps7kemw-futurebounds-projects.vercel.app/api'
    )
    console.log(response.data.message)
  }

  // [] to ensure only runs on initial render
  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
      <h1 className='text-red-800'>FutureCRM</h1>
    </>
  )
}

export default App
