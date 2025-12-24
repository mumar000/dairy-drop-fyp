import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetails = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('reviews');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // Product data
    const product = {
        id: 1,
        name: 'Premium Wireless Headphones Pro',
        category: 'Audio & Electronics',
        price: 299.99,
        originalPrice: 399.99,
        stock: 45,
        rating: 4.5,
        reviewCount: 128,
        description: 'Experience premium sound quality with our flagship wireless headphones. Featuring advanced noise cancellation technology, 40-hour battery life, and premium comfort for all-day wear. Perfect for music lovers, professionals, and travelers.',
        features: [
            'Active Noise Cancellation (ANC)',
            '40-hour battery life',
            'Premium memory foam ear cushions',
            'Bluetooth 5.2 connectivity',
            'Multi-device pairing',
            'Touch controls'
        ],
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
            'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80',
            'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80'
        ]
    };

    // Reviews data
    const reviews = [
        {
            id: 1,
            author: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?img=45',
            rating: 5,
            date: '2024-12-15',
            comment: 'Absolutely love these headphones! The sound quality is incredible and the noise cancellation works perfectly. Worth every penny.',
            verified: true
        },
        {
            id: 2,
            author: 'Michael Chen',
            avatar: 'https://i.pravatar.cc/150?img=33',
            rating: 4,
            date: '2024-12-10',
            comment: 'Great headphones overall. Battery life is impressive and they are very comfortable. Only minor issue is they can feel a bit tight after long wear.',
            verified: true
        },
        {
            id: 3,
            author: 'Emma Wilson',
            avatar: 'https://i.pravatar.cc/150?img=47',
            rating: 5,
            date: '2024-12-05',
            comment: 'Best purchase I\'ve made this year! The ANC is amazing for my daily commute. Highly recommend for anyone looking for premium headphones.',
            verified: true
        }
    ];

    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Handle review submission
        console.log('Review submitted');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <span className="hover:text-blue-600 cursor-pointer">Home</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="hover:text-blue-600 cursor-pointer">{product.category}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900">{product.name}</span>
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left - Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-[500px] object-cover rounded-xl"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`bg-white rounded-lg border-2 overflow-hidden transition ${selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-24 object-cover"
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
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">{product.rating}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                    {product.reviewCount} reviews
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                            </div>

                            {/* Stock */}
                            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-gray-700 font-medium">
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Features */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-700">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mb-6">
                                <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
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
                                    <p className="text-xs font-medium text-gray-900">2 Year Warranty</p>
                                    <p className="text-xs text-gray-500">Full coverage</p>
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
                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-600 font-medium">
                                    {product.rating} out of 5 based on {product.reviewCount} reviews
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6 mb-8 pb-8 border-b border-gray-200">
                        {reviews.map((review) => (
                            <div key={review.id} className="flex gap-4">
                                <img
                                    src={review.avatar}
                                    alt={review.author}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                        {review.verified && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                Verified Purchase
                                            </span>
                                        )}
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
                                            {new Date(review.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Write Review Form */}
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

                            {/* Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Review Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Review Title</label>
                                <input
                                    type="text"
                                    placeholder="Sum up your experience"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Review Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Your Review</label>
                                <textarea
                                    rows="5"
                                    placeholder="Share your thoughts about this product..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;