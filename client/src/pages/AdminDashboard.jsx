import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Mail, Settings, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, BACKEND_API } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities,setActivities] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    orders: false,
    contacts: false,
    activities:false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'activities') {
      fetchActivities();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchContacts = async () => {
    setLoading(prev => ({ ...prev, contacts: true }));
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_API}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };
  const fetchActivities = async () => {
    setLoading(prev => ({ ...prev, activities: true }));
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_API}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_API}/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Role Updated");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
      toast.error('Failed to update user role');
    }
  };

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_API}/api/contact/${contactId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contact status updated");
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact status');
      toast.error('Failed to update contact status');
    }
  };

  // Update the updateOrderStatus function
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BACKEND_API}/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Status updated");
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error("❌ Order status update failed", err);
      setError(err.response?.data?.message || 'Failed to update order status');
      toast.error('Failed to update order status');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md p-6 h-fit sticky top-6 transition-all">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Admin Dashboard</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('activities')}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'activities' ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Activity className="h-5 w-5" />
                <span>Recent Activities</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'users' ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'orders' ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Order Management</span>
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'contacts' ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Mail className="h-5 w-5" />
                <span>Contact Submissions</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4 border-gray-200">User Management</h2>
                {loading.users ? (
                  <p className="text-gray-500">Loading users...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm md:table hidden">
                      <thead className="bg-gray-50">
                        <tr className="hover:bg-gray-50 transition-all">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {users && users.map(user => (
                          <tr className="hover:bg-gray-50 transition-all" key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                {/* <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600">
                                  {user.firstName}{user.lastName}
                                </div> */}
                                <div>
                                  <div className="text-gray-900 font-medium">{user.firstName} {user.lastName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'delivery' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                onChange={(e) => updateUserRole(user._id, e.target.value)}
                                className="cursor-pointer border border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="delivery">Delivery Partner</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile Version (Cards) */}
                    <div className="md:hidden space-y-4">
                      {users && users.map(user => (
                        <div key={user._id} className="bg-white shadow rounded-xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600">
                              {/* {user.firstName[0]}{user.lastName[0]} */}
                              {user?.firstName || ''}{user?.lastName || ''}

                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="text-gray-500 text-xs">Role:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'delivery' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                              {user.role}
                            </span>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1 cursor-pointer">Update Role</label>
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user._id, e.target.value)}
                              className="cursor-pointer w-full border border-gray-300 rounded-md px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="delivery">Delivery Partner</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4 border-gray-200">Order Management</h2>
                {loading.orders ? (
                  <p className="text-gray-500">Loading orders...</p>
                ) : (
                  <div className="space-y-6">
                    {orders && orders.map(order => (
                      <div key={order._id} className="border border-gray-200 bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800">Order #{order.orderNumber || order._id.slice(-6)}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()} • {order.user?.firstName} {order.user?.lastName}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="cursor-pointer border border-gray-300 rounded-md px-2 py-1 text-sm"
                            >
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <span className="font-bold text-gray-800">
                              {/* ₹{order.totalPrice.toFixed(2)} */}
                              ₹{order.totalPrice}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4 border-gray-200">Contact Submissions</h2>
                {loading.contacts ? (
                  <p className="text-gray-500">Loading contacts...</p>
                ) : (
                  <div className="space-y-6">
                    {contacts.map(contact => (
                      <div key={contact._id} className="border border-gray-200 bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800">{contact.name}</h3>
                            <p className="text-sm text-gray-500">
                              {contact.email} • {new Date(contact.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {contact.phone} • {new Date(contact.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              value={contact.status}
                              onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                              className="cursor-pointer border border-gray-300 rounded-md px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="responded">Responded</option>
                              <option value="spam">Spam</option>
                            </select>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-800">{contact.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'activities' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4 border-gray-200">
                  Recent Activities
                </h2>
                {loading.activities ? (
                  <p className="text-gray-500">Loading activities...</p>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity._id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">
                              {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'System'}
                            </p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(activity.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {activity.type.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}