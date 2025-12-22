const CoreValues = () => {
    return (
        <div className='mb-20'>
            <h3 className='text-3xl font-bold text-gray-900 text-center mb-12'>Our Core Values</h3>
            <div className='grid md:grid-cols-3 gap-8'>
                {/* Card 1 - Quality */}
                <div className='group bg-white border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-600 hover:shadow-xl transition-all duration-300'>
                    <div className='w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300'>
                        <svg className='w-8 h-8 text-blue-600 group-hover:text-white transition-colors' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                        </svg>
                    </div>
                    <h4 className='text-xl font-bold text-gray-900 mb-3'>Premium Quality</h4>
                    <p className='text-gray-600'>
                        Every product undergoes rigorous quality checks to ensure you receive
                        only the finest dairy products.
                    </p>
                </div>

                {/* Card 2 - Sustainability */}
                <div className='group bg-white border-2 border-green-200 rounded-2xl p-8 hover:border-green-500 hover:shadow-xl transition-all duration-300'>
                    <div className='w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300'>
                        <svg className='w-8 h-8 text-green-600 group-hover:text-white transition-colors' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z' clipRule='evenodd' />
                            <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                        </svg>
                    </div>
                    <h4 className='text-xl font-bold text-gray-900 mb-3'>Sustainability</h4>
                    <p className='text-gray-600'>
                        We're committed to eco-friendly practices, from renewable packaging
                        to supporting local organic farms.
                    </p>
                </div>

                {/* Card 3 - Trust */}
                <div className='group bg-white border-2 border-yellow-200 rounded-2xl p-8 hover:border-yellow-500 hover:shadow-xl transition-all duration-300'>
                    <div className='w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:scale-110 transition-all duration-300'>
                        <svg className='w-8 h-8 text-yellow-600 group-hover:text-white transition-colors' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                        </svg>
                    </div>
                    <h4 className='text-xl font-bold text-gray-900 mb-3'>Customer Trust</h4>
                    <p className='text-gray-600'>
                        Building lasting relationships through transparency, reliability,
                        and exceptional service every single day.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CoreValues