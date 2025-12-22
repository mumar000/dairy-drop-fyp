const Stats = () => {
    return (
        <div className='bg-gradient-to-r from-blue-400 to-blue-800 rounded-3xl p-12 mb-20 shadow-xl'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                <div className='text-center'>
                    <div className='text-4xl md:text-5xl font-bold text-white mb-2'>10+</div>
                    <div className='text-blue-100 text-sm md:text-base'>Years Experience</div>
                </div>
                <div className='text-center'>
                    <div className='text-4xl md:text-5xl font-bold text-white mb-2'>50K+</div>
                    <div className='text-blue-100 text-sm md:text-base'>Happy Customers</div>
                </div>
                <div className='text-center'>
                    <div className='text-4xl md:text-5xl font-bold text-white mb-2'>500+</div>
                    <div className='text-blue-100 text-sm md:text-base'>Products</div>
                </div>
                <div className='text-center'>
                    <div className='text-4xl md:text-5xl font-bold text-white mb-2'>100%</div>
                    <div className='text-blue-100 text-sm md:text-base'>Quality Assured</div>
                </div>
            </div>
        </div>
    )
}

export default Stats