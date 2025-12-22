import { Link } from 'react-router-dom'
import heroImage from "../assets/images/hero.jpg"

const Hero = () => {
    return (
        <section className='relative min-h-screen flex items-center overflow-hidden bg-white'>
            {/* Background Image with Overlay */}
            <div className='absolute inset-0 z-0'>
                <img
                    loading='lazy'
                    src={heroImage}
                    alt='Fresh Dairy Products Background'
                    className='w-full h-full object-cover'
                />
                {/* Dark Overlay for text readability */}
                <div className='absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/70'></div>
            </div>

            {/* Subtle Pattern Overlay */}
            <div className='absolute inset-0 z-0 opacity-5' style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20'>
                <div className='max-w-4xl mx-auto text-center space-y-8'>
                    {/* Badge */}
                    <div className='inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full'>
                        <span className='relative flex h-2 w-2'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                        </span>
                        <span className='text-white text-sm font-medium'>100% Fresh & Organic</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight'>
                        Fresh Dairy Products
                        <br />
                        <span className='text-blue-400'>Delivered to Your Door</span>
                    </h1>

                    {/* Description */}
                    <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed'>
                        Premium quality dairy from local farms, delivered fresh daily. Experience pure, natural goodness right at your doorstep.
                    </p>

                    {/* CTA Button */}
                    <div className='pt-4'>
                        <Link
                            to="/products"
                            onClick={() => scrollTo(0, 0)}
                            className='inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105'
                        >
                            Shop Now
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Floating Animated Feature Cards */}
                {/* Card 1 - Top Left */}
                <div className='absolute top-20 left-4 lg:-left-20 animate-float hidden lg:block'>
                    <div className='group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all duration-300 hover:scale-110 shadow-xl w-64'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors'>
                                <svg className='w-7 h-7 text-green-400' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-bold text-white mb-1'>Farm Fresh</h3>
                                <p className='text-gray-300 text-xs'>From local farms</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Top Right */}
                <div className='absolute top-32 right-4 lg:-right-28 animate-float-delayed hidden lg:block'>
                    <div className='group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all duration-300 hover:scale-110 shadow-xl w-64'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors'>
                                <svg className='w-7 h-7 text-blue-400' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                                    <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-bold text-white mb-1'>Fast Delivery</h3>
                                <p className='text-gray-300 text-xs'>Same-day service</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3 - Bottom Left */}
                <div className='absolute bottom-24 left-4 lg:left-10 animate-float-slow hidden lg:block'>
                    <div className='group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all duration-300 hover:scale-110 shadow-xl w-64'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors'>
                                <svg className='w-7 h-7 text-green-400' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-bold text-white mb-1'>Quality</h3>
                                <p className='text-gray-300 text-xs'>100% certified organic</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Down Indicator - Animated Mouse */}
            <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20'>
                <div className='flex flex-col items-center gap-2'>
                    <div className='w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2'>
                        <div className='w-1 h-2 bg-white/60 rounded-full animate-bounce'></div>
                    </div>
                </div>
            </div>

            {/* Animation Keyframes */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-25px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 5s ease-in-out infinite;
                    animation-delay: 1s;
                }
                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
            `}</style>
        </section>
    )
}

export default Hero