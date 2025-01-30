import { Link } from 'react-router-dom'

import { UserAuth } from '@/context/AuthContext'

export default function NavBar({ session }) {
  const { signOut } = UserAuth()

  return (
    <nav className='flex h-24 items-center justify-between bg-slate-500 px-4 text-white'>
      {/* Home Logo */}
      <div>
        <Link to='/'>FutureCRM</Link>
      </div>

      {/* Nav Links */}
      <ul className='flex'>
        <li className='p-4'>
          <Link to='/dashboard'>Dashboard</Link>
        </li>
        <li className='p-4'>
          <Link to='/signup'>Sign Up</Link>
        </li>
        <li className='p-4'>
          {session ? (
            <button onClick={signOut}>Sign Out</button>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </li>
      </ul>
    </nav>
  )
}
