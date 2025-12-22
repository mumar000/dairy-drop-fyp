import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/features/auth/authSlice.js'
import logo from "../assets/images/logo.jpg"
import useAuth from '../hooks/useAuth'
import { UserRound } from 'lucide-react'

export default function NavBar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((s) => s.auth.userInfo)
  const cartItemCount = useSelector((s) => s.cart?.items?.length || 0)

  const { user } = useAuth();

  const onLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <nav className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to={"/"} onClick={() => scrollTo(0, 0)} className='flex items-center gap-2 flex-shrink-0'>
            <img loading='lazy' className='w-12 h-12 object-cover rounded-full' src={logo} alt="Logo" />
            <h1 className='text-xl font-bold text-gray-800 hidden sm:block'>Dairy Drop</h1>
          </Link>

          {/* Menu Links */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link to="/" onClick={() => scrollTo(0, 0)} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
              Home
            </Link>
            <Link to="/products" onClick={() => scrollTo(0, 0)} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
              Products
            </Link>
            <Link to="/about" onClick={() => scrollTo(0, 0)} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
              About
            </Link>
            <Link to="/contact" onClick={() => scrollTo(0, 0)} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className='hidden lg:flex items-center flex-1 max-w-sm ml-4'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Search products...'
                className='w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <svg className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
          </div>

          {/* Right Section: Cart & User */}
          <div className='flex items-center gap-4'>
            {/* Cart Icon with Badge */}
            <Link to="/cart" onClick={() => scrollTo(0, 0)} className='relative p-2 text-gray-700 hover:text-blue-600 transition-colors'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
              {cartItemCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user && (
              <Link to={"/profile"} onClick={() => scrollTo(0,0)} className='cursor-pointer bg-gray-200 hover:bg-gray-300 transition-all duration-300 p-2 rounded-full'>
                <UserRound size={20}/>
              </Link>
            )}

            {/* User Account */}
            {userInfo?.token ? (
              <div className='flex items-center gap-3'>
                <Link to="/orders" onClick={() => scrollTo(0, 0)} className='hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition-colors'>
                  Orders
                </Link>
                <button
                  onClick={onLogout}
                  className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium'
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => scrollTo(0, 0)}
                className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium'
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}