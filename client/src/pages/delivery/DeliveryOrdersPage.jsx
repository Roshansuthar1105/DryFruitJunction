// DeliveryOrdersPage.jsx
import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import StatusBadge from '../../components/admin/StatusBadge';

export default function DeliveryOrdersPage() {
  const { data: orders, loading, error } = useAdminData('orders');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter orders that are shipped or assigned to this delivery person
//   const filteredOrders = orders.filter(order => 
//     (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') &&
//     (`${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.orderNumber?.toString().includes(searchTerm) ||
//     order._id.includes(searchTerm))
//   );
    const filteredOrders=orders;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="sticky top-0 z-10 bg-white pt-4 pb-4 -mt-6 -mx-6 px-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 border-gray-200 gap-4">
          <h2 className="text-3xl font-extrabold text-gray-800">My Deliveries</h2>
          <input
            type="text"
            placeholder="Search deliveries..."
            className="border border-gray-300 rounded-md px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6">
        {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        {loading ? (
          <p className="text-gray-500">Loading deliveries...</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order._id} className="border border-gray-200 bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800">Order #{order.orderNumber || order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={order.orderStatus}
                      variants={{
                        processing: 'yellow',
                        shipped: 'blue',
                        delivered: 'green',
                        cancelled: 'red'
                      }}
                    />
                    <span className="font-bold text-gray-800">
                      ₹{order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {item.images?.[0]?.url ? (
                          <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-lg" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm md:text-base">{item.name}</h4>
                          <p className="text-xs md:text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-gray-800 text-sm md:text-base">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Phone: {order.shippingInfo?.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}