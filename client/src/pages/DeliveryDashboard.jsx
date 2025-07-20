import { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {toast}from 'react-hot-toast';

export default function DeliveryDashboard() {
  const { user, BACKEND_API } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_API}/api/users/delivery/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_API}/api/users/delivery/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
      toast.error('Failed to update order status');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Delivery <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">Dashboard</span>
          </h2>
          <p className="text-xl text-gray-600">Manage your delivery assignments</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">Order #{order.orderNumber || order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                    <span className="font-bold text-gray-800">
                      ₹{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Customer</h4>
                  <p className="text-gray-800">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-gray-600">{order.user?.email}</p>
                  <p className="text-gray-600">{order.user?.phone}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Delivery Address
                  </h4>
                  <p className="text-gray-800">
                    {order.shippingInfo?.address}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingInfo?.city}, {order.shippingInfo?.pincode}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-medium text-gray-500">Items</h4>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 w-12 h-12 rounded-lg" />
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  {order.orderStatus === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'shipped')}
                      className="cursor-pointer flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Truck className="h-4 w-4" />
                      <span>Mark as Shipped</span>
                    </button>
                  )}
                  {order.orderStatus === 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                      className="cursor-pointer flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark as Delivered</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders assigned</h3>
            <p className="mt-2 text-gray-500">Your assigned orders will appear here</p>
          </div>
        )}
      </div>
    </section>
  );
}