import { Building2, Home, MessagesSquare, Users } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import { UserAuth } from '@/context/AuthContext'

export default function NavBar() {
  const { session, signOutUser } = UserAuth()
  const navigate = useNavigate()

  console.log(session)

  const handleSignOut = async (e) => {
    e.preventDefault()
    try {
      await signOutUser()
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <nav className='fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 justify-around'>
        <Button
          asChild
          variant='ghost'
          className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
        >
          <NavLink to='/dashboard'>
            <Home className='h-4 w-4' />
            <span>Dashboard</span>
          </NavLink>
        </Button>

        <Button
          asChild
          variant='ghost'
          className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
        >
          <NavLink to='/contacts'>
            <Users className='h-4 w-4' />
            <span>Contacts</span>
          </NavLink>
        </Button>

        <Button
          asChild
          variant='ghost'
          className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
        >
          <NavLink to='/companies'>
            <Building2 className='h-4 w-4' />
            <span>Companies</span>
          </NavLink>
        </Button>

        <Button
          asChild
          variant='ghost'
          className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
        >
          <NavLink to='/interactions'>
            <MessagesSquare className='h-4 w-4' />
            <span>Interactions</span>
          </NavLink>
        </Button>

        {session ? (
          <Button
            className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </nav>
  )
}
