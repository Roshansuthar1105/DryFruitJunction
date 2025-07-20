// src/pages/CheckoutPage.jsx
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    pincode: '',
    address: '',
    apiAddress: {
      address: '',
      latitude: '',
      longitude: ''
    },
    notes: '',
    paymentMethod: 'cod',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocationFetched, setIsLocationFetched] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  useEffect(() => {
    fetchLocation();
  }, []);
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token'); // Or however you're storing the JWT

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
        {
          shippingInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            pincode: formData.pincode,
            address: formData.address,
            city: formData.city,
            location: formData.apiAddress, // includes lat/lng + display address
            notes: formData.notes,
          },
          paymentMethod: formData.paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        toast.success("Order Conformed");
        setOrderData(response.data); // Save full response
        setOrderSuccess(true);
        clearCart();
      }
    } catch (error) {
      console.error('❌ Order submission failed:', error.response?.data?.message || error.message);
      toast.error("Order submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };


  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
              lat: latitude,
              lon: longitude,
              format: 'json',
            },
            headers: {
              'User-Agent': 'sweet-store-frontend', // Required by Nominatim
              'Accept-Language': 'en',
            },
          });

          const apiAddress = {
            address: response.data.display_name || 'Unknown location',
            latitude: latitude,
            longitude: longitude
          };
          setFormData((prev) => ({
            ...prev,
            apiAddress,
          }));
          setIsLocationFetched(true);
        } catch (error) {
          console.error('❌ Nominatim failed:', error);
          toast.error('Failed to fetch address');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to retrieve your location');
      }
    );
  };


  if (orderSuccess) {
    return (<>
      {orderSuccess && orderData && (
        <section className="py-20 bg-gradient-to-br from-pink-50 to-orange-50 min-h-screen">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for your order. We’ve received it and will start preparing your sweet treats shortly.
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Order ID:</strong>{orderData._id}
              </p>
              <p className="text-gray-600 mb-6">
                <strong>Status:</strong> {orderData.orderStatus}
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </section>
      )}
    </>)

    return (
      <section className="py-20 bg-gradient-to-br from-pink-50 to-orange-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've received it and will start preparing your sweet treats shortly.
            </p>
            <p className="text-gray-600 mb-8">
              Order ID: <span className="font-medium">SWEET-{Math.floor(Math.random() * 10000)}</span>
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Checkout
          </h2>
          <p className="text-xl text-gray-600">Complete your order with these simple steps</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Delivery Information</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div >
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                  Pincode
                </label>
                <input
                  type="number"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  maxLength={6}
                  minLength={6}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                  Delivery Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  {/* <button
                    type="button"
                    onClick={fetchLocation}
                    className="bg-gray-100 hover:bg-gray-200 px-4 rounded-xl text-sm font-medium transition-colors"
                  >
                    Use My Location
                  </button> */}
                </div>

                {formData.apiAddress.address &&
                  <p className='text-xs' >Current Address : {formData.apiAddress.address}x</p>
                }
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Special instructions, allergies, etc."
                ></textarea>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4">Payment Method</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="online"
                      name="paymentMethod"
                      type="radio"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      disabled
                    />
                    <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-500 cursor-pointer">
                      Online Payment (Coming Soon)
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="cursor-pointer w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Place Order (₹${cartTotal.toFixed(2)})`
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item?.images[0]?.url}
                      alt={item?.images[0]?.alt}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-gray-800 font-medium">{item.name}</h4>
                      {item.variantId && (
                        <p className="text-xs text-gray-500">{item.weight}</p>
                      )}
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-gray-800 font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-gray-800">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}