import { Link } from 'react-router-dom'

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Fresh Milk',
      description: 'Pure & organic',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-200',
      textColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
      link: '/products?category=milk'
    },
    {
      id: 2,
      name: 'Yogurt',
      description: 'Creamy & delicious',
      bgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-200',
      textColor: 'text-green-600',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
      link: '/products?category=yogurt'
    },
    {
      id: 3,
      name: 'Cheese',
      description: 'Artisan quality',
      bgColor: 'bg-yellow-100',
      hoverColor: 'hover:bg-yellow-200',
      textColor: 'text-yellow-600',
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80',
      link: '/products?category=cheese'
    },
    {
      id: 4,
      name: 'Butter & Ghee',
      description: 'Rich & smooth',
      bgColor: 'bg-red-100',
      hoverColor: 'hover:bg-red-200',
      textColor: 'text-red-600',
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80',
      link: '/products?category=butter'
    },
    {
      id: 5,
      name: 'Ice Creams',
      description: 'Premium selection',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-200',
      textColor: 'text-purple-600',
      image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aWNlJTIwY3JlYW18ZW58MHx8MHx8fDA%3D',
      link: '/products?category=icecream'
    }
  ]

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

        {/* Categories Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className={`group ${category.bgColor} ${category.hoverColor} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`}
            >
              {/* Image */}
              <div className='aspect-square overflow-hidden'>
                <img
                  src={category.image}
                  alt={category.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
              </div>

              {/* Content */}
              <div className='p-5 text-center'>
                <h3 className={`text-lg font-bold ${category.textColor} mb-1`}>
                  {category.name}
                </h3>
                <p className='text-gray-600 text-sm'>
                  {category.description}
                </p>

                {/* Arrow Icon */}
                <div className='mt-3 flex justify-center'>
                  <div className={`w-8 h-8 ${category.bgColor} rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
                    <svg className={`w-4 h-4 ${category.textColor}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Categories