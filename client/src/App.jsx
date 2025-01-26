import { useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const fetchAPI = async () => {
    const response = await axios.get('http://localhost:8080/api')
    console.log(response.data.message)
  }

  // [] to ensure only runs on initial render
  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
      <h1>FutureCRM</h1>
    </>
  )
}

export default App
