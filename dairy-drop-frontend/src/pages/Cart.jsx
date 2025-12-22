import { useState } from 'react';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';

const Cart = () => {
    // Static cart data for now - this will be replaced with actual state later
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Fresh Cow Milk 1L',
            price: 2.49,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&q=100',
            inStock: 500
        },
        {
            id: 2,
            name: 'Desi Ghee 500g',
            price: 7.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=1000&q=100',
            inStock: 200
        },
        {
            id: 3,
            name: 'Yogurt 500g',
            price: 1.99,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1000&q=100',
            inStock: 400
        }
    ]);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 4.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            setCartItems(cartItems.filter(item => item.id !== id));
        } else {
            setCartItems(cartItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    <div className="lg:col-span-7">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                                <p className="mt-1 text-gray-500">Start adding some delicious dairy products!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemoveFromCart={removeFromCart}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        <CartSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;