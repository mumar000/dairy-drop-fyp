import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, ChevronLeft, ChevronRight, ChevronRight as ArrowRight, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGetProductQuery } from '../api/productsApi.js';
import { useAddToCartMutation } from '../api/cartApi.js';
import { useListProductReviewsQuery, useAddReviewMutation } from '../api/reviewApi.js';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const ProductDetails = () => {
    const { productId } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('reviews');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    const userInfo = useSelector((state) => state.auth.userInfo);

    const { data, isLoading, isError, refetch } = useGetProductQuery(productId);
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

    // Fetch real-time reviews from the database
    const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError } = useListProductReviewsQuery(productId);
    const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();

    const product = data?.product || {};
    const reviews = reviewsData?.reviews || [];

    const fallbackImages = [
        'https://images.unsplash.com/photo-1635586506547-4dbe01d7ba5d?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRhaXJ5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1633179963862-72c64dc6d30d?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRhaXJ5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D',
        'https://plus.unsplash.com/premium_photo-1664298144031-9097970e5bd3?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRhaXJ5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1630409346699-79481a79db52?w=1000&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhaXJ5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D',
    ];

    const galleryImages =
        product.images && product.images.length > 0
            ? product.images
            : fallbackImages;

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!userInfo?.token) {
            toast.error('Please log in to submit a review');
            return;
        }

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!reviewComment.trim()) {
            toast.error('Please enter a review comment');
            return;
        }

        try {
            await addReview({
                productId: product._id,
                rating: rating,
                comment: reviewComment
            }).unwrap();

            toast.success('Review submitted successfully!');
            setRating(0);
            setReviewComment('');

            // Refetch product data to update average rating
            refetch();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    const handleAddToCart = async () => {
        try {
            await addToCart({
                productId: product._id,
                quantity: quantity,
                name: product.name,
                price: product.price
            }).unwrap();
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading product...</span>
                </div>
            </div>
        );
    }

    if (isError || !product._id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
                    <p className="text-gray-600">The product you're looking for doesn't exist or is unavailable.</p>
                </div>
            </div>
        );
    }

    // Calculate discount percentage
    const DISCOUNT_PERCENT = 25;

    const discountedPrice = product.price;
    const originalPrice = discountedPrice / (1 - DISCOUNT_PERCENT / 100);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <span className="hover:text-blue-600">Home</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="hover:text-blue-600">{product.category}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900">{product.name}</span>
                    <ChevronRight className="w-4 h-4" />
                    <Link to={"/products"} className="text-gray-900 cursor-pointer hover:text-blue-600">Go Back</Link>
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left - Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
                            <img
                                loading="lazy"
                                src={galleryImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-[500px] object-cover rounded-xl"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-3">
                            {galleryImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`bg-white rounded-lg border-2 overflow-hidden transition ${selectedImage === index
                                        ? 'border-blue-600'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        loading="lazy"
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-32 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right - Product Info */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            {/* Category */}
                            <div className="mb-3">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                    {product.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.averageRating > 0 ? product.averageRating : 4.5)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">
                                    {product.averageRating > 0
                                        ? product.averageRating.toFixed(1)
                                        : '4.5'}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span className="text-blue-600">
                                    {product.ratingCount || 45} reviews
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-4xl font-bold text-gray-900">
                                    ${discountedPrice.toFixed(2)}
                                </span>

                                <span className="text-xl text-gray-400 line-through">
                                    ${originalPrice.toFixed(2)}
                                </span>

                                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                                    Save {DISCOUNT_PERCENT}%
                                </span>
                            </div>

                            {/* Stock */}
                            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                                <div className={`w-3 h-3 rounded-full ${product.inStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-gray-700 font-medium">
                                    {product.inStock > 0 ? `In Stock (${product.inStock} available)` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                                    <ul className="space-y-2">
                                        {product.features.slice(0, 5).map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-gray-700">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={!product.inStock || quantity <= 1}
                                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            setQuantity(Math.max(1, Math.min(product.inStock || Infinity, value)));
                                        }}
                                        min="1"
                                        max={product.inStock}
                                        className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                                        disabled={!product.inStock || quantity >= product.inStock}
                                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                                {product.inStock > 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Max quantity: {product.inStock}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || isAddingToCart}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold rounded-xl transition ${product.inStock > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        } ${isAddingToCart ? 'opacity-75' : ''}`}
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Adding to Cart...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <button className="w-14 h-14 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-900">Free Shipping</p>
                                    <p className="text-xs text-gray-500">On orders $50+</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                        <Shield className="w-6 h-6 text-green-600" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-900">Quality Guarantee</p>
                                    <p className="text-xs text-gray-500">Premium quality</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                        <RotateCcw className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-900">30-Day Returns</p>
                                    <p className="text-xs text-gray-500">Easy refunds</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.averageRating || 0)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">
                                    {product.averageRating?.toFixed(1) || '0.0'} out of 5 based on {product.ratingCount || 0} reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6 mb-8 pb-8 border-b border-gray-200">
                        {reviewsLoading ? (
                            <div className="flex justify-center items-center h-20">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : reviewsError ? (
                            <div className="text-center text-red-600">Error loading reviews</div>
                        ) : reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="font-medium text-gray-700">
                                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                Verified Purchase
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-4">No reviews yet. Be the first to review this product!</div>
                        )}
                    </div>

                    {/* Write Review Form - Only show if user is logged in */}
                    {userInfo?.token ? (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                            <form onSubmit={handleSubmitReview} className="space-y-5">
                                {/* Rating Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Your Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-8 h-8 transition ${star <= (hoverRating || rating)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Review Comment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Your Review</label>
                                    <textarea
                                        rows="5"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Share your thoughts about this product..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isAddingReview}
                                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isAddingReview ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Review'
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-600 mb-4">Please <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> or <Link to="/register" className="text-blue-600 hover:underline">Register</Link> to submit a review.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;