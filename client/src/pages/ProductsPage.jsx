// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react'
import { Filter, Search, Star, ChevronDown, ChevronUp } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {toast}from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: ''
  })
  const {BACKEND_API}=useAuth();
  const [sortOption, setSortOption] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_API}/api/products`);
        
        console.table(response.data.data);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to fetch products:', error);
      }
    };
  
    fetchProducts();
  }, [searchTerm, filters, sortOption]);
  // Filter and sort products
  useEffect(() => {
    let result = [...products]
    
    // Apply search
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply filters
    if (filters.category) {
      result = result.filter(product => product.category === filters.category)
    }
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice)
      result = result.filter(product => parseFloat(product.price.replace('$', '')) >= min)
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice)
      result = result.filter(product => parseFloat(product.price.replace('$', '')) <= max)
    }
    if (filters.rating) {
      result = result.filter(product => product.rating >= parseFloat(filters.rating))
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')))
        break
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default: // 'featured'
        // Default sorting (could be by popularity, etc.)
        break
    }
    
    setProducts(result)
  }, [searchTerm, filters, sortOption])

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: ''
    })
    setSearchTerm('')
    setSortOption('featured')
  }

  return (
    <section className="py-12 bg-gradient-to-br from-pink-50 to-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">Sweet Collection</span>
          </h2>
          <p className="text-xl text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Search and Filter Bar */}
        {/* <div className="mb-8 bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex flex-row gap-4 w-full md:w-fit justify-between' >
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700" >
                Sort by:
              </label>
              <select
                id="sort"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
  
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-end space-x-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {showFilters ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="candy">Candy</option>
                  <option value="pastry">Pastry</option>
                  <option value="cake">Cakes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div> */}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={resetFilters}
              className="cursor-pointer mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}