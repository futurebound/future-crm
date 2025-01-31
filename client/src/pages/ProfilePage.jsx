import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { UserAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { session, signOutUser } = UserAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOutUser()
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='container max-w-xl py-10'>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h3 className='text-sm font-medium'>Email</h3>
            <p className='text-sm text-muted-foreground'>
              {session?.user?.email}
            </p>
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
