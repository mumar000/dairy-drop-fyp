import { Link } from 'react-router-dom'
import { useGetCategoriesQuery } from '../api/productsApi.js'

const Categories = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery()

  // Define category configurations with images and colors
  // Map database category names to display names and styling
  const categoryConfig = {
    'milk': {
      name: 'Fresh Milk',
      description: 'Pure & organic',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-200',
      textColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&q=100'
    },
    'yogurt': {
      name: 'Yogurt',
      description: 'Creamy & delicious',
      bgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-200',
      textColor: 'text-green-600',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1000&q=100'
    },
    'cheese': {
      name: 'Cheese',
      description: 'Artisan quality',
      bgColor: 'bg-yellow-100',
      hoverColor: 'hover:bg-yellow-200',
      textColor: 'text-yellow-600',
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1000&q=100'
    },
    'butter': {
      name: 'Butter',
      description: 'Rich & smooth',
      bgColor: 'bg-red-100',
      hoverColor: 'hover:bg-red-200',
      textColor: 'text-red-600',
      image: 'https://images.unsplash.com/photo-1662988564746-4fc159c87f2d?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnV0dGVyfGVufDB8fDB8fHww'
    },
    'ghee': {
      name: 'Ghee',
      description: 'Pure & aromatic',
      bgColor: 'bg-orange-100',
      hoverColor: 'hover:bg-orange-200',
      textColor: 'text-orange-600',
      image: 'https://media.istockphoto.com/id/1187181045/photo/pure-or-desi-ghee-clarified-melted-butter-healthy-fats-bulletproof-diet-concept-or-paleo.webp?a=1&b=1&s=612x612&w=0&k=20&c=SQlM0ESr2hxs2HsOzRTkjonfFtlHXQFVTKLfaaHWOVg='
    },
    'ice cream': {
      name: 'Ice Creams',
      description: 'Premium selection',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-200',
      textColor: 'text-purple-600',
      image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aWNlJTIwY3JlYW18ZW58MHx8MHx8fDA%3D'
    },
    'specialty': {
      name: 'Specialty Items',
      description: 'Unique flavors',
      bgColor: 'bg-pink-100',
      hoverColor: 'hover:bg-pink-200',
      textColor: 'text-pink-600',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1000&q=100'
    }
  }

  const categories = data?.categories || []

  return (
    <section className='bg-white py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

        {/* Header - Left Aligned */}
        <div className='mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-3'>
            Product <span className='text-blue-600'>Categories</span>
          </h2>
          <p className='text-gray-600 text-lg max-w-2xl'>
            Explore our wide range of fresh dairy products, carefully sourced from local organic farms.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex justify-center items-center h-64'>
            <div className='text-lg text-gray-600'>Loading categories...</div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className='flex justify-center items-center h-64'>
            <div className='text-lg text-red-600'>
              Error loading categories
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !isError && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
            {categories.map((categoryName, index) => {
              // Normalize the category name for consistent matching
              let normalizedCategory = categoryName.toLowerCase().trim();

              // Handle combined categories like "Butter, Ghee" by taking the first part
              if (normalizedCategory.includes(',')) {
                normalizedCategory = normalizedCategory.split(',')[0].trim();
              }

              // Look up configuration based on normalized category
              const config = categoryConfig[normalizedCategory] || {
                name: categoryName, // Use original name if no config found
                description: 'Explore our products',
                bgColor: 'bg-gray-100',
                hoverColor: 'hover:bg-gray-200',
                textColor: 'text-gray-600',
                image: 'https://placehold.co/400x400?text=Category'
              }

              return (
                <Link
                  key={categoryName}
                  to={`/products?category=${encodeURIComponent(categoryName)}`}
                  onClick={() => { window.scrollTo(0, 0) }}
                  className={`group ${config.bgColor} ${config.hoverColor} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105`}
                >
                  {/* Image */}
                  <div className='aspect-square overflow-hidden'>
                    <img
                      src={config.image}
                      alt={config.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>

                  {/* Content */}
                  <div className='p-5 text-center'>
                    <h3 className={`text-lg font-bold ${config.textColor} mb-1`}>
                      {config.name}
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      {config.description}
                    </p>

                    {/* Arrow Icon */}
                    <div className='mt-3 flex justify-center'>
                      <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
                        <svg className={`w-4 h-4 ${config.textColor}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Categories