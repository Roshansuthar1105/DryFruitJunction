import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, Heart, Clock, Leaf, WheatOff, Tag } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import useApi from '../services/apiService';
import { toast } from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { BACKEND_API } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]._id);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_API}/api/products/${id}`);
        setProduct(response.data);
        console.log(response.data)
        setSelectedVariant(response.data.variants?.[0]?._id || null);
        setLoading(false);

        // Fetch related products after main product is loaded
        if (response.data?.category) {
          fetchRelatedProducts(response.data.category, response.data._id);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Error fetching product');
        setError(err.response?.data?.message || 'Failed to fetch product');
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (category, excludeId) => {
      try {
        setRelatedLoading(true);
        const response = await api.getProducts();
        // Filter products from same category excluding current product
        const filtered = response.data.data.filter(
          // p => p.category === category && p._id !== excludeId
          p => p._id !== excludeId
        );
        // Limit to 4 products
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error('Error fetching related products:', err);
        toast.error('Error fetching related products:', err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  const currentVariant = product?.variants?.find(v => v._id === selectedVariant) ||
    product?.variants?.[0] ||
    { price: product?.price, weight: product?.weight };
  const handleAddToCart = async () => {
    try {
      addToCart(product, quantity, selectedVariant);
    } catch (err) {
      toast.error("Error in adding to cart");
      console.error('Error adding to cart:', err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400 fill-current opacity-50" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen">Product not found</div>;
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }
  return (
    <>
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer group mb-8 flex items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-pink-600"
          >
            <ArrowLeft className="w-5 h-5 group-hover:text-pink-600" />
            <span>Back to Shop</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image Gallery */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10 bg-white p-6 rounded-3xl shadow-lg mb-6">
                <img
                  src={product.images[selectedImageIndex]?.url}
                  // src={product.images.find(img => img.isPrimary)?.url || product.images[selectedImageIndex]?.url}
                  alt={product.name}
                  className="w-full h-96 rounded-2xl object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.length > 1 && product.images.map((image, index) => (
                  <button
                    key={image._id}
                    onClick={() => { setSelectedImageIndex(index) }}
                    className={`cursor-pointer bg-white p-2 rounded-xl shadow-md transition-all duration-200 ${selectedImageIndex === index ? 'ring-2 ring-pink-500' : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>

              {/* <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-20 blur-3xl -z-50"></div>
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-80 blur-3xl -z-50" ></div> */}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-pink-100 text-pink-800 rounded-full">
                  {product.category}
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mt-4">
                  {product.name}
                </h1>
                <div className="flex items-center mt-3">
                  <div className="flex mr-2">{renderStars(product.rating)}</div>
                  <span className="text-gray-600">
                    ({product.rating.toFixed(1)}) • {product.numReviews} reviews
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-800">
                ₹{currentVariant?.price.toFixed(2)}{' '}
                {currentVariant?.originalPrice && (
                  <span className="ml-3 text-xl line-through text-gray-400">
                    ₹{currentVariant.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {product.shortDescription}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants?.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Variant:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map(variant => (
                            <button
                              key={variant._id}
                              onClick={() => setSelectedVariant(variant._id)}
                              className={`px-4 py-2 rounded-full border ${selectedVariant === variant._id
                                ? 'bg-pink-100 border-pink-500 text-pink-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              {variant.weight} - ₹{variant.price.toFixed(2)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="cursor-pointer px-4 py-2 text-gray-600 hover:text-pink-600"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="cursor-pointer px-4 py-2 text-gray-600 hover:text-pink-600"
                  >
                    +
                  </button>
                </div>
                <span
                  className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  <span className={`text-sm font-medium ${currentVariant?.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {currentVariant?.stock > 0
                      ? `${currentVariant.stock} in stock`
                      : 'Out of stock'}
                    {currentVariant?.stock <= product.lowStockThreshold && currentVariant?.stock > 0 && (
                      <span className="text-yellow-600"> • Low stock</span>
                    )}
                  </span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => handleAddToCart(product, quantity, selectedVariant)}
                  disabled={currentVariant?.stock <= 0}
                  className={`cursor-pointer flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 ${currentVariant?.stock > 0
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="cursor-pointer border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-pink-500 hover:text-pink-600 transition-all duration-300">
                  <Heart className="w-5 h-5 inline mr-2" />
                  Wishlist
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-pink-600" />
                    </div>
                    <span className="text-gray-700">{product.preparationTime} preparation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      {product.isVegan ? 'Vegan' : 'Vegetarian'}
                    </span>
                  </div>
                  {product.isGlutenFree && (
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <WheatOff className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">Gluten Free</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Product Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Weight:</h4>
                  <p>{product.weight}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Shelf Life:</h4>
                  <p>{product.shelfLife}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Storage:</h4>
                  <p>{product.storageInstructions}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Allergens:</h4>
                  <p>{product.allergens?.join(', ') || 'None'}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-1">Ingredients:</h4>
                  <ul className="list-disc list-inside pl-5">
                    {product.ingredients?.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-1">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {/* <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Customer Reviews
      </h2>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {product.reviews?.length > 0 ? (
          <div className="space-y-8">
            {product.reviews.map(review => (
              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">{renderStars(review.rating)}</div>
                  <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  </section> */}

      {/* Related Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            More from our{' '}
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {product.category}
            </span>{' '}
            collection
          </h2>

          {relatedLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-4">
                    <img
                      src={relatedProduct.images[0]?.url || '/placeholder-product.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 h-72 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div >
                        <h3 className="text-lg font-bold text-gray-800">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-md font-semibold text-gray-600">
                          {relatedProduct.shortDescription}
                        </p>
                        {/* <div className="flex items-center mt-1">
                          <div className="flex mr-1">{renderStars(relatedProduct.rating)}</div>
                          <span className="text-xs text-gray-500">({relatedProduct.numReviews})</span>
                        </div> */}
                      </div>
                      <div className="text-3xl font-bold text-gray-800">
                        ₹{currentVariant?.price.toFixed(2)}{' '}
                        {currentVariant?.originalPrice && (
                          <span className="ml-3 text-xl line-through text-gray-400">
                            ₹{currentVariant.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                    </div>
                    <button
                      onClick={() => navigate(`/products/${relatedProduct._id}`)}
                      className="cursor-pointer mt-4 w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !relatedLoading && (
              <p className="text-center text-gray-500">
                No other products in this category
              </p>
            )
          )}
        </div>
      </section>
    </>
  );

};

export default ProductPage;