import { Building2, Home, MessagesSquare, User, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function NavBar() {
  return (
    <nav className='fixed left-0 right-0 top-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 justify-around'>
        <Button
          asChild
          variant='ghost'
          className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
          disabled
        >
          <NavLink to='/dashboard' onClick={(e) => e.preventDefault()}>
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

        {/* <Button
          asChild
          variant='ghost'
          className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
          disabled
        >
          <NavLink to='/companies' onClick={(e) => e.preventDefault()}>
            <Building2 className='h-4 w-4' />
            <span>Companies</span>
          </NavLink>
        </Button> */}

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

        <Button
          asChild
          variant='ghost'
          className='flex h-auto flex-col gap-1 px-2 py-3 text-xs'
        >
          <NavLink to='/profile'>
            <User className='h-4 w-4' />
            <span>Profile</span>
          </NavLink>
        </Button>
      </div>
    </nav>
  )
}
