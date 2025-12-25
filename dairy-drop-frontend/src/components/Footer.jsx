import { Link } from 'react-router-dom'
import logo from "../assets/images/logo.jpg"
import { Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-white py-4'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                    {/* Brand */}
                    <div className='text-center md:text-left'>
                        <Link to={"/"} onClick={() => scrollTo(0, 0)} className='flex items-center gap-2'>
                            <img className='object-cover w-14 h-14 rounded-full' loading='lazy' src={logo} alt="Logo" />
                            <h3 className='text-2xl font-bold'>Dairy Drop</h3>
                        </Link>
                        <p className='text-gray-400 text-sm pt-2'>Fresh dairy delivered daily</p>
                    </div>

                    {/* Links */}
                    <div className='flex gap-6 text-sm'>
                        <Link to='/' onClick={() => scrollTo(0, 0)} className='text-gray-400 hover:text-white transition-colors'>Home</Link>
                        <Link to='/products' onClick={() => scrollTo(0, 0)} className='text-gray-400 hover:text-white transition-colors'>Products</Link>
                        <Link to='/about' onClick={() => scrollTo(0, 0)} className='text-gray-400 hover:text-white transition-colors'>About</Link>
                        <Link to='/contact' onClick={() => scrollTo(0, 0)} className='text-gray-400 hover:text-white transition-colors'>Contact</Link>
                    </div>

                    {/* Social */}
                    <div className='flex gap-4'>
                        <Link to={"/"} className='text-gray-400 hover:text-white transition-colors'>
                            <Facebook />
                        </Link>
                        <Link to={"/"} className='text-gray-400 hover:text-white transition-colors'>
                            <Twitter />
                        </Link>
                        <Link to={"/"} className='text-gray-400 hover:text-white transition-colors'>
                            <Instagram />
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className='text-center mt-6 pt-6 border-t border-gray-800 flex items-center justify-between'>
                    <p className='text-gray-400 text-sm'>Copyright © 2026 Dairy Drop. All rights reserved.</p>
                    <p className='text-gray-400 text-sm'>Developed by <span className='text-gray-200'>Muhammad Umer</span></p>
                </div>
            </div>
        </footer>
    )
}

export default Footer