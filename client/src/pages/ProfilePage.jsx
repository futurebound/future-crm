import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { UserAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { session, signOutUser } = UserAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profiles`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (session?.access_token) {
      fetchProfile()
    }
  }, [session?.access_token])

  const handleSignOut = async () => {
    try {
      await signOutUser()
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading...</div>

  if (error)
    return (
      <Alert variant='destructive' className='m-4'>
        <AlertDescription>
          {error}
          <Button
            variant='destructive'
            onClick={handleSignOut}
            className='w-full'
          >
            Sign Out
          </Button>
        </AlertDescription>
      </Alert>
    )

  return (
    <div className='container max-w-xl py-10'>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h3 className='text-sm font-medium'>Email</h3>
            <p className='text-sm text-muted-foreground'>{profile?.email}</p>
          </div>
          <Button
            variant='destructive'
            onClick={handleSignOut}
            className='w-full'
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
