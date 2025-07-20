import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import axios from 'axios'
import { toast } from 'react-hot-toast';

export default function UserDashboard() {
  const { user, logout, BACKEND_API } = useAuth()
  const { favorites } = useFavorites()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [errorOrders, setErrorOrders] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true)
      const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get(`${VITE_API_BASE_URL}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setOrders(data.reverse()) // show latest first
      } catch (error) {
        console.log(error)
        setErrorOrders(error.response?.data?.message || 'Failed to load orders')
        toast.error('Failed to load orders')
      }
      setLoadingOrders(false)
    }

    fetchOrders()
  }, [])

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      toast.error('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BACKEND_API}/api/auth/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPasswordSuccess('Password updated successfully');
      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    }
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${VITE_API_BASE_URL}/api/auth/account`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Account deleted !")
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account:', error);
    }
  };

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-pink-50 to-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer w-full flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-pink-600" />
              <span className="font-medium">Menu</span>
            </div>
            {mobileMenuOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-pink-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('orders')
                    setMobileMenuOpen(false)
                  }}
                  className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 text-sm ${activeTab === 'orders'
                    ? 'bg-pink-50 text-pink-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('favorites')
                    setMobileMenuOpen(false)
                  }}
                  className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 text-sm ${activeTab === 'favorites'
                    ? 'bg-pink-50 text-pink-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites ({favorites.length})</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('account')
                    setMobileMenuOpen(false)
                  }}
                  className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 text-sm ${activeTab === 'account'
                    ? 'bg-pink-50 text-pink-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <User className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="cursor-pointer w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          )}

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'orders'
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>My Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'favorites'
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Heart className="h-5 w-5" />
                <span>Favorites ({favorites.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'account'
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <User className="h-5 w-5" />
                <span>Account Settings</span>
              </button>
              <button
                onClick={logout}
                className="cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">My Orders</h2>
                {loadingOrders ? (
                  <p className="text-gray-500">Loading orders...</p>
                ) : errorOrders ? (
                  <p className="text-red-500">{errorOrders}</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-4 md:space-y-6">
                    {orders.map(order => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4 gap-2">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm md:text-base">Order #{order._id.slice(-6)}</h3>
                            <p className="text-xs md:text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <span
                              className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${order.orderStatus === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                              {order.orderStatus || 'Processing'}
                            </span>
                            <span className="font-bold text-gray-800 text-sm md:text-base">
                              ₹{order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          {order.orderItems.map((item, index) => {
                            // Find primary image or use first image
                            const displayImage = item.images?.find(img => img.isPrimary) || item.images?.[0];

                            return (
                              <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  {displayImage ? (
                                    <img
                                      src={displayImage.url}
                                      alt={displayImage.alt || item.name}
                                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-lg" />
                                  )}

                                  <div>
                                    <h4 className="font-medium text-gray-800 text-sm md:text-base">{item.name}</h4>
                                    {item.variant && (
                                      <p className="text-xs text-gray-500">{item.variant}</p>
                                    )}
                                    <p className="text-xs md:text-sm text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="text-gray-800 text-sm md:text-base">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <ShoppingBag className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                    <h3 className="mt-3 md:mt-4 text-base md:text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">Your order history will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">My Favorites</h2>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {favorites.map(product => (
                      <div key={product._id} className="border border-gray-200 rounded-lg p-3 md:p-4">
                        <div className="bg-gray-100 h-32 md:h-40 rounded-lg mb-3 md:mb-4"></div>
                        <h3 className="font-bold text-gray-800 text-sm md:text-base">{product.name}</h3>
                        <p className="text-gray-600 text-xs md:text-sm mt-1 line-clamp-2">{product.description}</p>
                        <div className="mt-3 md:mt-4 flex justify-between items-center">
                          <span className="font-bold text-pink-600 text-sm md:text-base">₹{product.price}</span>
                          <button className="cursor-pointer text-pink-600 hover:text-pink-800">
                            <Heart className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <Heart className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                    <h3 className="mt-3 md:mt-4 text-base md:text-lg font-medium text-gray-900">No favorites yet</h3>
                    <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">Save your favorite products here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 space-y-6 md:space-y-8">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Change Password</h3>
                  <form onSubmit={updatePassword} className="space-y-3 md:space-y-4">
                    {passwordError && (
                      <div className="p-2 md:p-3 bg-red-100 text-red-700 rounded-md text-xs md:text-sm">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="p-2 md:p-3 bg-green-100 text-green-700 rounded-md text-xs md:text-sm">
                        {passwordSuccess}
                      </div>
                    )}
                    <div>
                      <label htmlFor="currentPassword" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 cursor-pointer">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 cursor-pointer">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
                        required
                        minLength="6"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 cursor-pointer">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
                        required
                        minLength="6"
                      />
                    </div>
                    <button
                      type="submit"
                      className="cursor-pointer bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:shadow-md transition-all text-sm md:text-base w-full md:w-auto"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="border-t border-gray-200 pt-4 md:pt-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Account Actions</h3>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="cursor-pointer text-red-600 hover:text-red-800 font-medium text-sm md:text-base"
                  >
                    Delete My Account
                  </button>

                  {showDeleteConfirm && (
                    <div className="mt-3 md:mt-4 p-3 md:p-4 bg-red-50 rounded-lg">
                      <p className="text-red-800 text-sm md:text-base mb-3 md:mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                        <button
                          onClick={deleteAccount}
                          className="cursor-pointer bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-red-700 text-sm md:text-base"
                        >
                          Yes, Delete Account
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="cursor-pointer bg-gray-200 text-gray-800 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-300 text-sm md:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}