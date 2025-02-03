import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { UserAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const { signInUser } = UserAuth()

  /**
   * Update form fields
   * TODO: crazy re-rendering on input change, fix later
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // console.log('Sign-in payload:', formData)
      const result = await signInUser(formData.email, formData.password)

      if (result.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          err.response?.data?.message || 'An error occurred during login',
      })

      // Clear password field on error
      setFormData((prev) => ({
        ...prev,
        password: '',
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          Need to create an account?{' '}
          <Link to='/signup' className='text-blue-500 underline'>
            Sign Up!
          </Link>
        </CardContent>
        <CardContent>
          <form onSubmit={handleSignIn} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                placeholder='name@example.com'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
