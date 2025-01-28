import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className='flex h-24 items-center justify-between bg-slate-500 px-4 text-white'>
      {/* Home Logo */}
      <div>
        <Link to='/'>FutureCRM</Link>
      </div>

      {/* Nav Links */}
      <ul className='flex'>
        <li className='p-4'>
          <Link to='/'>Home</Link>
        </li>
        <li className='p-4'>
          <Link to='/signup'>Signup</Link>
        </li>
      </ul>
    </nav>
  )
}
