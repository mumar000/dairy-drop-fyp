import { useState } from 'react'
import { Sidebar } from '../components/Products/Sidebar'
import { ProductCard } from '../components/Products/ProductCard'
import { Pagination } from '../components/Products/Pagination'

const Products = () => {
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: { min: '', max: '' },
        brands: [],
        ratings: [],
        inStockOnly: false
    })

    const [sortBy, setSortBy] = useState('featured')
    const [currentPage, setCurrentPage] = useState(1)

    // Sample products data
    const allProducts = [
        { id: 1, name: 'Organic Whole Milk', category: 'Milk', price: 4.99, rating: 4.8, stock: 45, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80', brand: 'Dairy Drop' },
        { id: 2, name: 'Greek Yogurt', category: 'Yogurt', price: 3.49, rating: 4.9, stock: 32, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80', brand: 'Farm Fresh' },
        { id: 3, name: 'Aged Cheddar', category: 'Cheese', price: 7.99, rating: 4.7, stock: 18, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80', brand: 'Organic Valley' },
        { id: 4, name: 'Fresh Butter', category: 'Butter', price: 5.49, rating: 4.6, stock: 28, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80', brand: 'Local Farms' },
        { id: 5, name: 'Mozzarella', category: 'Cheese', price: 6.99, rating: 4.9, stock: 12, image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80', brand: 'Dairy Drop' },
        { id: 6, name: 'Almond Milk', category: 'Specialty', price: 5.99, rating: 4.5, stock: 40, image: 'https://images.unsplash.com/photo-1626196340104-2d6769a08761?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWxtb25kJTIwbWlsa3xlbnwwfHwwfHx8MA%3D%3D', brand: 'Organic Valley' },
        { id: 7, name: 'Cottage Cheese', category: 'Cheese', price: 4.49, rating: 4.4, stock: 25, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&q=80', brand: 'Farm Fresh' },
        { id: 8, name: 'Sour Cream', category: 'Specialty', price: 3.99, rating: 4.6, stock: 35, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80', brand: 'Local Farms' },
    ]

    const handleClearAll = () => {
        setFilters({
            categories: [],
            priceRange: { min: '', max: '' },
            brands: [],
            ratings: [],
            inStockOnly: false
        })
    }

    const handleAddToCart = (product) => {
        console.log('Added to cart:', product)
    }

    return (
        <div className='bg-gray-50 min-h-screen py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>All Products</h1>
                    <p className='text-gray-600'>Showing {allProducts.length} products</p>
                </div>

                <div className='flex gap-8'>
                    {/* Sidebar */}
                    <div className='hidden lg:block w-80 flex-shrink-0'>
                        <Sidebar
                            filters={filters}
                            setFilters={setFilters}
                            onClearAll={handleClearAll}
                        />
                    </div>

                    {/* Main Area */}
                    <div className='flex-1'>
                        {/* Sort Dropdown */}
                        <div className='bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center justify-between'>
                            <span className='text-gray-700 font-medium'>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                            >
                                <option value='featured'>Featured</option>
                                <option value='price-low'>Price: Low to High</option>
                                <option value='price-high'>Price: High to Low</option>
                                <option value='rating'>Highest Rated</option>
                                <option value='newest'>Newest</option>
                            </select>
                        </div>

                        {/* Product Grid */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {allProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={3}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products