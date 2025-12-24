import { Minus, Plus, Trash2 } from 'lucide-react';
import { useGetProductQuery } from '../../api/productsApi.js';

const CartItem = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
  const { data: product, isLoading: isProductLoading } = useGetProductQuery(item.product, {
    skip: !item.product, // Skip query if product ID is not available
  });

  const handleIncrement = () => {
    onUpdateQuantity(item.product, item.quantity + 1);
  };

  const handleDecrement = () => {
    onUpdateQuantity(item.product, item.quantity - 1);
  };

  const handleRemove = () => {
    onRemoveFromCart(item.product);
  };

  // Use product image if available, otherwise use cart item image or placeholder
  const image = product?.image || item.image || 'https://placehold.co/100x100';
  // Use product stock if available
  const inStock = product?.inStock ?? item.inStock ?? 999; // Default to high number if not available

  if (isProductLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center space-x-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center space-x-6 hover:shadow-sm transition-shadow">
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-lg font-semibold text-blue-600">${item.price.toFixed(2)}</p>

        <div className="flex items-center mt-2">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="mx-3 text-gray-700 font-medium">{item.quantity}</span>

          <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={item.quantity >= inStock}
          >
            <Plus className="w-4 h-4" />
          </button>

          <span className="ml-4 text-sm text-gray-500">
            {inStock > 0 ? `${inStock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-4">
        <p className="text-lg font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
          title="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;