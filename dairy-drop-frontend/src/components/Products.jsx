const Products = () => {
    const products = [
        {
            id: 1,
            name: 'Organic Whole Milk',
            description: 'Fresh from local farms, rich in nutrients and taste',
            price: 4.99,
            rating: 4.8,
            reviews: 156,
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&q=100',
            inStock: 45
        },
        {
            id: 2,
            name: 'Greek Yogurt',
            description: 'Creamy texture with authentic Greek taste',
            price: 3.49,
            rating: 4.9,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1000&q=100',
            inStock: 32
        },
        {
            id: 3,
            name: 'Cheddar Cheese',
            description: 'Premium quality aged for perfect flavor',
            price: 7.99,
            rating: 4.7,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1000&q=100',
            inStock: 18
        },
        {
            id: 4,
            name: 'Fresh Butter',
            description: 'Smooth and rich, perfect for cooking',
            price: 5.49,
            rating: 4.6,
            reviews: 124,
            image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=1000&q=100',
            inStock: 28
        },
        {
            id: 5,
            name: 'Artisan Mozzarella',
            description: 'Handcrafted fresh mozzarella daily',
            price: 6.99,
            rating: 4.9,
            reviews: 178,
            image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aWNlJTIwY3JlYW18ZW58MHx8MHx8fDA%3D',
            inStock: 12
        }
    ]

    const handleAddToCart = (product) => {
        console.log('Added to cart:', product)
    }

    return (
        <section className='bg-gray-50 py-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                {/* Header */}
                <div className='text-center mb-12'>
                    <h2 className='text-4xl font-bold text-gray-900 mb-3'>
                        Most Selling <span className='text-blue-600'>Products</span>
                    </h2>
                    <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                        Discover our customer favorites - premium quality dairy products loved by thousands.
                    </p>
                </div>

                {/* Products Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className='bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col'
                        >
                            {/* Image Container */}
                            <div className='relative aspect-square overflow-hidden bg-gray-100'>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                />

                                {/* Stock Badge */}
                                {product.inStock < 20 && (
                                    <div className='absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full'>
                                        Low Stock
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className='p-5 flex flex-col flex-grow'>
                                {/* Product Name */}
                                <h3 className='text-lg font-bold text-gray-900 mb-2'>
                                    {product.name}
                                </h3>

                                {/* Description */}
                                <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                                    {product.description}
                                </p>

                                {/* Rating */}
                                <div className='flex items-center gap-2 mb-3'>
                                    <div className='flex items-center'>
                                        {[...Array(5)].map((_, index) => (
                                            <svg
                                                key={index}
                                                className={`w-4 h-4 ${index < Math.floor(product.rating)
                                                        ? 'text-yellow-500'
                                                        : 'text-gray-300'
                                                    }`}
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                            >
                                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className='text-sm text-gray-600'>
                                        {product.rating} ({product.reviews})
                                    </span>
                                </div>

                                {/* Price & Stock */}
                                <div className='flex items-center justify-between mb-3'>
                                    <span className='text-2xl font-bold text-gray-900'>
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className={`text-sm font-semibold ${product.inStock > 20 ? 'text-green-600' :
                                            product.inStock > 0 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                                    </span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.inStock === 0}
                                    className={`w-full px-4 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto text-sm ${product.inStock > 0
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                        <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
                                    </svg>
                                    {product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Products