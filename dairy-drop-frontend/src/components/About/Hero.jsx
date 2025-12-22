import aboutImage from "../../assets/images/aboutImage.jfif"

const Hero = () => {
    return (
        <>
            <div className='text-center mb-16'>
                <span className='inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4'>
                    About Us
                </span>
                <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                    Your Trusted Partner for <span className='text-blue-600'>Fresh Dairy</span>
                </h2>
                <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                    We've been delivering farm-fresh dairy products to families for over a decade,
                    ensuring quality, freshness, and sustainability in every drop.
                </p>
            </div>

            {/* Story Section - Two Columns */}
            <div className='grid md:grid-cols-2 gap-12 mb-20 items-center'>
                <div className='space-y-6'>
                    <h3 className='text-3xl font-bold text-gray-900'>Our Story</h3>
                    <p className='text-gray-600 leading-relaxed'>
                        Founded in 2014, Dairy Drop started with a simple mission: to bring
                        the freshest dairy products from local farms directly to your doorstep.
                        What began as a small family business has grown into a trusted name
                        serving thousands of happy customers.
                    </p>
                    <p className='text-gray-600 leading-relaxed'>
                        We work closely with certified organic farms, ensuring that every
                        product meets our strict quality standards. From farm to table,
                        we maintain the cold chain and deliver within hours of milking.
                    </p>
                    <div className='flex gap-4 pt-4'>
                        <div className='flex items-center gap-2'>
                            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                                <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                </svg>
                            </div>
                            <span className='text-gray-700 font-medium'>100% Organic</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                                <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                </svg>
                            </div>
                            <span className='text-gray-700 font-medium'>Farm Fresh</span>
                        </div>
                    </div>
                </div>
                <div className='relative'>
                    <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                        <img
                            src={aboutImage}
                            alt='Our Farm'
                            className='w-full h-96 object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent'></div>
                    </div>
                    <div className='absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600 rounded-full opacity-20 -z-10'></div>
                    <div className='absolute -top-8 -left-8 w-24 h-24 bg-green-500 rounded-full opacity-20 -z-10'></div>
                </div>
            </div>
        </>
    )
}

export default Hero