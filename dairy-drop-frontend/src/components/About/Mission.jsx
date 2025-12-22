const Mission = () => {
    return (
        <div className='grid md:grid-cols-2 gap-8 mb-20'>
            {/* Mission */}
            <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-10'>
                <div className='w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6'>
                    <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z' />
                    </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>Our Mission</h3>
                <p className='text-gray-700 leading-relaxed'>
                    To provide families with the freshest, highest quality dairy products
                    while supporting local farmers and promoting sustainable agriculture practices.
                    We believe everyone deserves access to pure, nutritious dairy.
                </p>
            </div>

            {/* Vision */}
            <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-10'>
                <div className='w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6'>
                    <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                        <path fillRule='evenodd' d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z' clipRule='evenodd' />
                    </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>Our Vision</h3>
                <p className='text-gray-700 leading-relaxed'>
                    To become the most trusted dairy delivery service nationwide, setting
                    the standard for quality, sustainability, and customer satisfaction.
                    We envision a future where fresh, organic dairy is accessible to all.
                </p>
            </div>
        </div>
    )
}

export default Mission