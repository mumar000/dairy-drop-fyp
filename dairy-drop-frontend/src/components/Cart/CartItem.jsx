import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    onRemoveFromCart(item.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center space-x-6 hover:shadow-sm transition-shadow">
      <div className="flex-shrink-0">
        <img
          src={item.image}
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
            disabled={item.quantity >= item.inStock}
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <span className="ml-4 text-sm text-gray-500">
            {item.inStock > 0 ? `${item.inStock} in stock` : 'Out of stock'}
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