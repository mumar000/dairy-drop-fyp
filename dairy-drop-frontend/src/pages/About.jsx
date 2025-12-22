import Hero from '../components/About/Hero';
import Stats from '../components/About/Stats';
import CoreValues from '../components/About/CoreValues';
import Mission from "../components/About/Mission";
import Footer from "../components/Footer";

const About = () => {
    return (
        <>
            <section className='bg-white py-20 relative overflow-hidden'>
                {/* Floating Animated Icons */}
                <div className='absolute top-20 left-10 animate-float-slow opacity-20'>
                    <svg className='w-12 h-12 text-blue-400' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z' />
                    </svg>
                </div>

                <div className='absolute top-32 right-16 animate-bounce-slow opacity-15'>
                    <svg className='w-14 h-14 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                    </svg>
                </div>

                <div className='absolute bottom-40 left-1/4 animate-float opacity-20'>
                    <svg className='w-10 h-10 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                </div>

                <div className='absolute top-1/2 right-12 animate-spin-slow opacity-15'>
                    <svg className='w-12 h-12 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z' clipRule='evenodd' />
                    </svg>
                </div>

                <div className='absolute bottom-32 right-1/4 animate-bounce-slow opacity-20'>
                    <svg className='w-11 h-11 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' clipRule='evenodd' />
                    </svg>
                </div>

                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>

                    {/* Header Section */}
                    <Hero />

                    {/* Stats Section */}
                    <Stats />

                    {/* Values Section - 3 Cards */}
                    <CoreValues />

                    {/* Mission & Vision - Split Section */}
                    <Mission />

                </div>

                {/* Animation Styles */}
                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                    @keyframes float-slow {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-25px) rotate(-5deg); }
                    }
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-float {
                        animation: float 5s ease-in-out infinite;
                    }
                    .animate-float-slow {
                        animation: float-slow 6s ease-in-out infinite;
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 4s ease-in-out infinite;
                    }
                    .animate-spin-slow {
                        animation: spin-slow 20s linear infinite;
                    }
                `}</style>
            </section>

            {/* Footer - Separate from About Section */}
            <Footer />
        </>
    )
}

export default About