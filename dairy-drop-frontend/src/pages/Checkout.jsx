import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, MapPin, User, Mail, Phone, Lock, Truck, Check, X, Loader2 } from 'lucide-react';
import { useGetCartQuery } from '../api/cartApi.js';
import { usePlaceOrderMutation } from '../api/orderApi.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Cash on Delivery as per backend
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Pakistan' // Default to India
    });

    const navigate = useNavigate();
    const { data: cartItems = [], isLoading, isError } = useGetCartQuery();
    const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 4.99; // Free shipping for now
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    useEffect(() => {
        // Get user info from localStorage
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (userInfo.user) {
                setFormData(prev => ({
                    ...prev,
                    firstName: userInfo.user.name?.split(' ')[0] || '',
                    lastName: userInfo.user.name?.split(' ').slice(1).join(' ') || '',
                    email: userInfo.user.email || '',
                    phone: userInfo.user.phone || ''
                }));
            }
        } catch (error) {
            console.error('Error getting user info:', error);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
            !formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const orderData = {
                address: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone,
                    line1: formData.street,
                    line2: formData.apartment,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                    country: formData.country
                },
                fromCart: true // Use items from cart
            };

            await placeOrder(orderData).unwrap();
            toast.success('Order placed successfully!');
            navigate('/orders'); // Navigate to orders page
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error?.data?.message || 'Failed to place order');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading cart...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Error loading cart</h2>
                    <p className="text-gray-600">Please try again later</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
                    <p className="text-gray-600 mb-4">Add some items to your cart before checking out</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                                <p className="text-sm text-gray-500">Complete your purchase</p>
                            </div>
                        </div>
                        <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => navigate('/cart')}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {[
                            { num: 1, label: 'Information', icon: User },
                            { num: 2, label: 'Shipping', icon: Truck },
                            { num: 3, label: 'Payment', icon: CreditCard }
                        ].map((s, idx) => (
                            <div key={s.num} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${step >= s.num
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {step > s.num ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                                    </div>
                                    <p className={`text-sm font-medium mt-2 ${step >= s.num ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {s.label}
                                    </p>
                                </div>
                                {idx < 2 && (
                                    <div className={`h-1 flex-1 mx-2 rounded ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                                    <p className="text-sm text-gray-500">We'll use this to send order updates</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="John"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Doe"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john.doe@example.com"
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                                    <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="123 Main Street"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Apartment, suite, etc. (optional)</label>
                                    <input
                                        type="text"
                                        name="apartment"
                                        value={formData.apartment}
                                        onChange={handleInputChange}
                                        placeholder="Apt 4B"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Karachi"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State / Province *</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                        >
                                            <option value="">Select state</option>
                                            <option value="Sindh">Sindh</option>
                                            <option value="Punjab">Punjab</option>
                                            <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                                            <option value="Balochistan">Balochistan</option>
                                            <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code *</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            placeholder="400001"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                        >
                                            <option value="Pakistan">Pakistan</option>
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                                    <p className="text-sm text-gray-500">All transactions are secure and encrypted</p>
                                </div>
                            </div>

                            {/* Payment Options */}
                            <div className="space-y-3 mb-6">
                                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">C</div>
                                    <span className="font-medium text-gray-900 flex-1">Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="flex gap-4">
                                        <div className="relative">
                                            <img
                                                src={item.image || 'https://placehold.co/80x80?text=No+Image'}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h3>
                                            <p className="text-sm font-bold text-gray-900 mt-2">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (8%)</span>
                                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Complete Order Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isPlacingOrder}
                                className="w-full py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>

                            {/* Security Badge */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Lock className="w-4 h-4" />
                                <span>Secure checkout via COD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;