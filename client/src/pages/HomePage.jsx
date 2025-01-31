import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className='container flex min-h-screen flex-col items-center justify-center'>
      {/* Logo Section */}
      <div className='mb-12 flex w-full justify-center'>
        <img src='vite.svg' alt='FutureCRM Logo' className='h-32 w-32' />
      </div>

      <Card className='w-full max-w-[350px]'>
        <CardHeader>
          <CardTitle className='text-center'>Welcome to FutureCRM</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-center text-muted-foreground'>
            Your all-in-one solution for managing customer relationships. Track
            leads, close deals, and grow your business.
          </p>

          <div className='space-y-2'>
            <Link to='/login'>
              <Button className='w-full' variant='default'>
                Login
              </Button>
            </Link>
            <Link to='/signup'>
              <Button className='w-full' variant='outline'>
                Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
