import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal, shipping, tax, total }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium">${subtotal.toFixed(2)}</p>
        </div>
        
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium">${shipping.toFixed(2)}</p>
        </div>
        
        <div className="flex justify-between text-sm">
          <p className="text-gray-600">Tax</p>
          <p className="font-medium">${tax.toFixed(2)}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <Link
          to="/checkout"
          className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
        >
          Proceed to Checkout
        </Link>
        
        <Link
          to="/products"
          className="block w-full text-center py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;