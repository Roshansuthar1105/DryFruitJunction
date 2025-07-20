import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useFavorites } from "../context/FavoritesContext"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import ProductCard from "./ProductCard"
import toast from 'react-hot-toast';
export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user, BACKEND_API } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_API}/api/products`);
        setProducts(res.data.data.slice(0, 3)); // Show only first 3 products
      } catch (err) {
        
        toast.error("❌ Failed to load products", err);
        console.error("❌ Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Skeleton loader component that matches ProductCard
  const ProductSkeleton = () => (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-80 bg-gray-200"></div>
      
      {/* Category badge placeholder */}
      <div className="absolute top-4 left-4">
        <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Favorite button placeholder */}
      <div className="absolute top-4 right-4 h-8 w-8 bg-gray-300 rounded-full"></div>
      
      <div className="p-6">
        {/* Product name placeholder */}
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
        
        {/* Description placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
        </div>
        
        {/* Price and button placeholder */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-16 bg-gray-300 rounded-full"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Our Sweet{" "}
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              Collection
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated selection of handcrafted confections, each made with the finest ingredients
            and traditional techniques.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/products">
            <button className="cursor-pointer border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}