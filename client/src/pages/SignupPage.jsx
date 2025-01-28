import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_URL
      const response = await axios.post(`${apiUrl}/auth/signup`, formData)
      console.log('Signup successful:', response.data)
      navigate('/login') // Redirect to login after successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h1 className='mb-6 text-2xl font-bold'>Sign Up</h1>

      {error && (
        <div className='mb-4 rounded bg-red-100 p-3 text-red-700'>{error}</div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='email' className='mb-1 block'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full rounded border p-2'
          />
        </div>

        <div>
          <label htmlFor='password' className='mb-1 block'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            className='w-full rounded border p-2'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-blue-300'
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
