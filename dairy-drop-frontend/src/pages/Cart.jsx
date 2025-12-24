import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '../api/cartApi.js';
import { useGetProductQuery } from '../api/productsApi.js';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import { toast } from 'sonner';

const Cart = () => {
    const { data: cartItems = [], isLoading, isError, refetch } = useGetCartQuery();
    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeCartItem] = useRemoveCartItemMutation();

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cartItems.length === 0 ? 0 : 4.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity <= 0) {
            await removeFromCartItem(productId);
        } else {
            try {
                await updateCartItem({ productId, quantity: newQuantity }).unwrap();
                toast.success('Cart updated successfully');
            } catch (error) {
                console.error('Error updating cart:', error);
                toast.error('Failed to update cart item');
            }
        }
    };

    const removeFromCartItem = async (productId) => {
        try {
            await removeCartItem(productId).unwrap();
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading cart...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-red-600">Error loading cart</div>
            </div>
        );
    }

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
                                        key={item.product}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemoveFromCart={removeFromCartItem}
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