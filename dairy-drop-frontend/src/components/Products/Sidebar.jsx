import { useGetCategoriesQuery } from '../../api/productsApi.js'

export const Sidebar = ({ filters, setFilters, onClearAll, onCategoryChange }) => {
    const { data: categoryData, isLoading: categoriesLoading, isError: categoriesError } = useGetCategoriesQuery();
    const allCategories = categoryData?.categories || ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Ghee'];
    const brands = ['Dairy Drop', 'Farm Fresh', 'Organic Valley', 'Local Farms'];

    // Handle category changes - for single selection
    const handleCategoryChange = (selectedCategory) => {
        if (selectedCategory) {
            // For single category selection, we just pass the single category
            setFilters(prev => ({
                ...prev,
                categories: [selectedCategory]
            }));

            // Call the parent handler to update URL and trigger refetch if needed
            if (onCategoryChange) {
                onCategoryChange([selectedCategory]);
            }
        } else {
            // Clear categories
            setFilters(prev => ({
                ...prev,
                categories: []
            }));

            if (onCategoryChange) {
                onCategoryChange([]);
            }
        }
    };

    return (
        <div className='bg-white rounded-2xl p-6 shadow-sm sticky top-24'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-gray-900'>Filters</h3>
                <button
                    onClick={onClearAll}
                    className='text-sm text-blue-600 hover:text-blue-700 font-semibold'
                >
                    Clear All
                </button>
            </div>

            {/* Category Filter */}
            <div className='mb-6 pb-6 border-b border-gray-200'>
                <h4 className='font-semibold text-gray-900 mb-3'>Category</h4>
                {categoriesLoading ? (
                    <div className='text-gray-600'>Loading categories...</div>
                ) : categoriesError ? (
                    <div className='text-red-600'>Error loading categories</div>
                ) : (
                    <div className='space-y-2'>
                        {allCategories.map((category) => (
                            <label key={category} className='flex items-center cursor-pointer group'>
                                <input
                                    type='radio'
                                    name='category'
                                    checked={filters.categories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className='w-4 h-4 text-blue-600 rounded-full cursor-pointer'
                                />
                                <span className='ml-3 text-gray-700 group-hover:text-gray-900'>{category}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className='mb-6 pb-6 border-b border-gray-200'>
                <h4 className='font-semibold text-gray-900 mb-3'>Price Range</h4>
                <div className='space-y-3'>
                    <div className='flex gap-3'>
                        <input
                            type='number'
                            placeholder='Min'
                            value={filters.priceRange.min}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, min: e.target.value }
                            }))}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                        />
                        <input
                            type='number'
                            placeholder='Max'
                            value={filters.priceRange.max}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, max: e.target.value }
                            }))}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                        />
                    </div>
                </div>
            </div>

            {/* Brand Filter */}
            <div className='mb-6 pb-6 border-b border-gray-200'>
                <h4 className='font-semibold text-gray-900 mb-3'>Brand</h4>
                <div className='space-y-2'>
                    {brands.map((brand) => (
                        <label key={brand} className='flex items-center cursor-pointer group'>
                            <input
                                type='checkbox'
                                checked={filters.brands.includes(brand)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFilters(prev => ({
                                            ...prev,
                                            brands: [...prev.brands, brand]
                                        }));
                                    } else {
                                        setFilters(prev => ({
                                            ...prev,
                                            brands: prev.brands.filter(b => b !== brand)
                                        }));
                                    }
                                }}
                                className='w-4 h-4 text-blue-600 rounded cursor-pointer'
                            />
                            <span className='ml-3 text-gray-700 group-hover:text-gray-900'>{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div className='mb-6 pb-6 border-b border-gray-200'>
                <h4 className='font-semibold text-gray-900 mb-3'>Rating</h4>
                <div className='space-y-2'>
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className='flex items-center cursor-pointer group'>
                            <input
                                type='radio'
                                name='rating'
                                checked={filters.ratings.includes(rating)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFilters(prev => ({
                                            ...prev,
                                            ratings: [rating] // Only one rating filter at a time
                                        }));
                                    } else {
                                        setFilters(prev => ({
                                            ...prev,
                                            ratings: [] // Clear ratings when unselected
                                        }));
                                    }
                                }}
                                className='w-4 h-4 text-blue-600 rounded-full cursor-pointer'
                            />
                            <div className='ml-3 flex items-center'>
                                <span className='text-yellow-500 mr-1'>★</span>
                                <span className='text-gray-700 group-hover:text-gray-900'>{rating}+ Stars</span>
                            </div>
                        </label>
                    ))}
                    {/* Add option to clear rating filter */}
                    <label className='flex items-center cursor-pointer group'>
                        <input
                            type='radio'
                            name='rating'
                            checked={filters.ratings.length === 0}
                            onChange={() => {
                                setFilters(prev => ({
                                    ...prev,
                                    ratings: []
                                }));
                            }}
                            className='w-4 h-4 text-blue-600 rounded-full cursor-pointer'
                        />
                        <div className='ml-3 flex items-center'>
                            <span className='text-gray-700 group-hover:text-gray-900'>All Ratings</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Availability */}
            <div>
                <h4 className='font-semibold text-gray-900 mb-3'>Availability</h4>
                <label className='flex items-center cursor-pointer group'>
                    <input
                        type='checkbox'
                        checked={filters.inStockOnly}
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            inStockOnly: e.target.checked
                        }))}
                        className='w-4 h-4 text-blue-600 rounded cursor-pointer'
                    />
                    <span className='ml-3 text-gray-700 group-hover:text-gray-900'>In Stock Only</span>
                </label>
            </div>
        </div>
    )
}