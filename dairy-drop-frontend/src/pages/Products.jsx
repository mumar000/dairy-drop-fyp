import { useListProductsQuery } from '../api/productsApi.js'
import { useAddToCartMutation } from '../api/cartApi.js'
import { Sidebar } from '../components/Products/Sidebar'
import { ProductCard } from '../components/Products/ProductCard'
import { Pagination } from '../components/Products/Pagination'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get('q') || ''
    const categoryFromUrl = searchParams.get('category') || ''

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

    // Initialize filters from URL parameters on component mount
    useEffect(() => {
        if (categoryFromUrl) {
            setFilters(prev => ({
                ...prev,
                categories: [categoryFromUrl]
            }))
        }
    }, [categoryFromUrl])

    // Convert our filters to API query parameters
    const queryParams = {
        page: currentPage,
        limit: limit,
        sort: sortBy,
        category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
        minPrice: filters.priceRange.min || undefined,
        maxPrice: filters.priceRange.max || undefined,
        inStock: filters.inStockOnly ? 1 : undefined,
        q: searchQuery || undefined, // Add search parameter (backend expects 'q')
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
        // Clear search and category parameters from URL
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)
            newParams.delete('q')
            newParams.delete('category')
            return newParams
        })
    }

    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()

    const handleAddToCart = async (product) => {
        try {
            await addToCart({
                productId: product._id,
                quantity: 1,
                name: product.name,
                price: product.price
            }).unwrap()
            toast.success(`${product.name} added to cart!`)
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error('Failed to add item to cart')
        }
    }

    // Handle sort changes
    const handleSortChange = (value) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value
        if (value.trim()) {
            setSearchParams({ q: value.trim() })
        } else {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev)
                newParams.delete('q')
                return newParams
            })
        }
    }

    // Handle category change from sidebar
    const handleCategoryChange = (selectedCategories) => {
        setFilters(prev => ({
            ...prev,
            categories: selectedCategories
        }))

        // Update URL with category parameter
        if (selectedCategories.length > 0) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev)
                newParams.set('category', selectedCategories[0]) // Using first category for URL
                return newParams
            })
        } else {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev)
                newParams.delete('category')
                return newParams
            })
        }

        setCurrentPage(1) // Reset to first page when category changes
    }

    // Clear search when search button in navbar is used (searchQuery is updated)
    useEffect(() => {
        if (searchQuery) {
            setCurrentPage(1) // Reset to first page when search changes
        }
    }, [searchQuery])

    return (
        <div className='bg-gray-50 min-h-screen py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                    </h1>
                    <p className='text-gray-600'>
                        {isLoading ? 'Loading products...' :
                         products.length > 0 ? `Showing ${products.length} of ${totalProducts} products` :
                         searchQuery ? `No products found for "${searchQuery}"` : `Showing ${products.length} of ${totalProducts} products`}
                    </p>
                </div>

                <div className='flex gap-8'>
                    {/* Sidebar */}
                    <div className='hidden lg:block w-80 flex-shrink-0'>
                        <Sidebar
                            filters={filters}
                            setFilters={setFilters}
                            onClearAll={handleClearAll}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    {/* Main Area */}
                    <div className='flex-1'>
                        {/* Search and Sort Controls */}
                        <div className='bg-white rounded-2xl p-4 shadow-sm mb-6'>
                            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                {/* Search Input */}
                                <div className='relative flex-1 max-w-md'>
                                    <input
                                        type='text'
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder='Search products...'
                                        className='w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    />
                                    <svg className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                    </svg>
                                </div>

                                {/* Sort Dropdown */}
                                <div className='flex items-center gap-2'>
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
                            </div>
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
                                            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                                                {searchQuery ? `No products found for "${searchQuery}"` : 'No products found'}
                                            </h3>
                                            <p className='text-gray-600 mb-6'>
                                                {searchQuery
                                                    ? 'We couldn\'t find any products matching your search. Try different keywords.'
                                                    : 'We couldn\'t find any products matching your search criteria.'}
                                            </p>
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
                                                    // Clear search parameter
                                                    setSearchParams(prev => {
                                                        const newParams = new URLSearchParams(prev)
                                                        newParams.delete('search')
                                                        return newParams
                                                    })
                                                }}
                                                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                                            >
                                                {searchQuery ? 'Clear Search' : 'Clear all filters'}
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