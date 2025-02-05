// import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { UserAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function SignupPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const { session, signUpNewUser } = UserAuth()

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

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Sign-up payload:', formData)
      const result = await signUpNewUser(formData.email, formData.password)
      console.log('result:', result)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'You can now login',
        })
        navigate('/login')
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          err.response?.data?.message || 'An error occurred during signup',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container flex h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500 underline'>
            Log in!
          </Link>
        </CardContent>
        <CardContent>
          <form onSubmit={handleSignUp} className='space-y-4'>
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
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
