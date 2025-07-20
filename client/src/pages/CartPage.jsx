// src/pages/CartPage.jsx
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart ({cartCount})</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
            <Link
              to="/products"
              className="cursor-pointer mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={`${item._id}-${item.variantId}`} className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item._id, item.variantId)}
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {item.variantId && (
                      <p className="text-sm text-gray-500 mt-1">
                        Variant: {item.weight} - ₹{item.price}
                      </p>
                    )}

                    <p className="text-lg font-bold text-pink-600 mt-2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>

                    <div className="flex items-center mt-4 border border-gray-300 rounded-full w-fit">
                      <button
                        onClick={() => updateQuantity(item._id, item.variantId, item.quantity - 1)}
                        className="cursor-pointer px-3 py-1 text-gray-600 hover:text-pink-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.variantId, item.quantity + 1)}
                        className="cursor-pointer px-3 py-1 text-gray-600 hover:text-pink-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-pink-600">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to={user ? "/checkout" : "/login"}
                className="cursor-pointer mt-6 w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}