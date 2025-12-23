import { useListProductsQuery } from '../api/productsApi.js'
import { Sidebar } from '../components/Products/Sidebar'
import { ProductCard } from '../components/Products/ProductCard'
import { Pagination } from '../components/Products/Pagination'
import { useState } from 'react'

const Products = () => {
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: { min: '', max: '' },
        brands: [],
        ratings: [],
        inStockOnly: false
    })

    const [sortBy, setSortBy] = useState('-createdAt')
    const [currentPage, setCurrentPage] = useState(1)
    const [limit] = useState(12)

    // Convert our filters to API query parameters
    const queryParams = {
        page: currentPage,
        limit: limit,
        sort: sortBy,
        category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
        minPrice: filters.priceRange.min || undefined,
        maxPrice: filters.priceRange.max || undefined,
        inStock: filters.inStockOnly ? 1 : undefined,
    }

    const { data, isLoading, isError, error, refetch } = useListProductsQuery(queryParams)

    const products = data?.items || []
    const totalProducts = data?.total || 0
    const totalPages = data?.pages || 1

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

    // Handle sort changes
    const handleSortChange = (value) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    return (
        <div className='bg-gray-50 min-h-screen py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>All Products</h1>
                    <p className='text-gray-600'>
                        {isLoading ? 'Loading products...' : `Showing ${products.length} of ${totalProducts} products`}
                    </p>
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
                                onChange={(e) => handleSortChange(e.target.value)}
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                            >
                                <option value='-createdAt'>Newest</option>
                                <option value='name'>Name A-Z</option>
                                <option value='-name'>Name Z-A</option>
                                <option value='price'>Price: Low to High</option>
                                <option value='-price'>Price: High to Low</option>
                                <option value='averageRating'>Highest Rated</option>
                            </select>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className='flex justify-center items-center h-64'>
                                <div className='text-lg text-gray-600'>Loading products...</div>
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className='flex justify-center items-center h-64'>
                                <div className='text-lg text-red-600'>
                                    Error loading products: {error?.data?.message || error?.error || 'Unknown error'}
                                </div>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!isLoading && !isError && (
                            <>
                                {products.length > 0 ? (
                                    <>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                            {products.map((product, index) => (
                                                <ProductCard
                                                    key={product._id}
                                                    product={product}
                                                    index={index}
                                                    onAddToCart={handleAddToCart}
                                                />
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={setCurrentPage}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className='flex flex-col items-center justify-center py-20'>
                                        <div className='text-center'>
                                            <h3 className='text-2xl font-bold text-gray-900 mb-2'>No products found</h3>
                                            <p className='text-gray-600 mb-6'>We couldn't find any products matching your search criteria.</p>
                                            <button
                                                onClick={() => {
                                                    setFilters({
                                                        categories: [],
                                                        priceRange: { min: '', max: '' },
                                                        brands: [],
                                                        ratings: [],
                                                        inStockOnly: false
                                                    });
                                                    setSortBy('-createdAt');
                                                    setCurrentPage(1);
                                                }}
                                                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products