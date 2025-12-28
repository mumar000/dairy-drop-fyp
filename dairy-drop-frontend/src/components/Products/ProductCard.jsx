import { Star, StarIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export const ProductCard = ({ product, index, onAddToCart }) => {
    const productId = product._id || product.id;
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
    console.log("productId:", productId);

    const handleAddToCart = (product) => {
        // Check if user is authenticated
        if (!userInfo?.token) {
            // If not authenticated, redirect to register page
            toast.info('Please create an account to add items to cart');
            navigate('/register');
            return;
        }

        // If authenticated, call the original onAddToCart function
        onAddToCart(product);
    };

    return (
        <div className='flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group'>

            {/* Link wrapper - Added flex-grow so it takes up available space */}
            <Link to={productId ? `/products/${productId}` : '#'} className="flex-grow">
                {/* Image */}
                <div className='relative aspect-square overflow-hidden bg-gray-100'>
                    <img
                        src={
                            product?.images?.[0] ||
                            product?.image ||
                            "https://placehold.co/400x400?text=No+Image"
                        }
                        alt={product.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    {product.inStock < 20 && product.inStock > 0 && (
                        <div className='absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full'>
                            Low Stock
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className='p-5'>
                    <h3 className='text-lg font-bold text-blue-600 mb-2 line-clamp-2'>
                        {product.name}
                    </h3>
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-2xl font-bold text-gray-900'>${product.price}</span>
                        <span className={`text-sm font-semibold bg-gray-100 p-1 ${product.inStock > 20 ? 'text-green-600' :
                            product.inStock > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {product.inStock > 0 ? `${product.inStock} left` : 'Out of stock'}
                        </span>
                    </div>
                    <div className="mt-2 space-y-2">
                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium flex items-center gap-2 text-gray-800">
                                <Star className='text-yellow-400' /> {(product.averageRating && product.averageRating > 0)
                                    ? product.averageRating.toFixed(1)
                                    : "3.5"}
                            </span>
                            <span className="text-xs text-gray-500">
                                Rating
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button - Now guaranteed to be visible at the bottom */}
            <div className='px-5 pb-5 mt-auto'>
                <button
                    onClick={(e) => {
                        e.preventDefault(); // Safety
                        e.stopPropagation();
                        handleAddToCart(product);
                    }}
                    disabled={product.inStock === 0}
                    className={`w-full px-4 py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${product.inStock > 0
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
    )
}