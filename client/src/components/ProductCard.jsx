// src/components/ProductCard.jsx
import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?._id || null
  );

  const currentVariant = product.variants?.find(v => v._id === selectedVariant) ||
    product.variants?.[0] ||
    { price: product.price, weight: product.weight, _id: null };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariant);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Product image and header */}
      <div className="relative overflow-hidden flex-1">
        <Link to={`/products/${product._id}`} className="block h-full">
          <img
            src={product?.images?.[0]?.url}
            alt={product?.images?.[0]?.alt || product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </Link>
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-pink-600 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
            {product.category}
          </span>
        </div>
        <button
          onClick={() => user ? toggleFavorite(product) : null}
          className={`absolute top-3 right-3 p-2 cursor-pointer rounded-full transition-all ${isFavorite(product._id)
              ? 'bg-pink-100 text-pink-600 shadow-sm'
              : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-pink-50 hover:text-pink-500'
            }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite(product._id) ? 'fill-pink-600' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div>
          <Link to={`/products/${product._id}`} className="group-hover:text-pink-600 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.shortDescription}
            </p>
          </Link>
        </div>

        {/* Variant selector */}
        {product.variants?.length > 0 && (
          <div className="mt-1">
            <div className="flex flex-wrap gap-2">
              {product.variants.map(variant => (
                <button
                  key={variant._id}
                  onClick={() => setSelectedVariant(variant._id)}
                  className={`cursor-pointer px-2.5 py-1 text-xs rounded-full border transition-colors ${selectedVariant === variant._id
                      ? 'bg-pink-50 border-pink-300 text-pink-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {variant.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <div className='flex flex-row gap-2' >
            <span className="text-lg font-bold text-gray-900">
              ₹{currentVariant.price} 
            </span>
            <span className="text-lg font-bold text-gray-500 line-through ">
              ₹{currentVariant.originalPrice} 
            </span>
            </div>
            {product.variants?.length > 0 && (
              <span className="text-xs text-gray-500">
                {currentVariant.weight}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="cursor-pointer flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}