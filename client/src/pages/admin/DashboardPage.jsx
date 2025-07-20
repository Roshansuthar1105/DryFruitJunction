// DashboardPage.jsx
import { useAdminData } from '../../hooks/useAdminData';
import DataCard from '../../components/admin/DataCard.jsx';
import { Users, ShoppingBag, Mail, Activity, DollarSign, Package, CheckCircle, Truck } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardPage() {
  const { data: users, loading: usersLoading } = useAdminData('users');
  const { data: orders, loading: ordersLoading } = useAdminData('orders');
  const { data: contacts, loading: contactsLoading } = useAdminData('contacts');
  const { data: activities, loading: activitiesLoading } = useAdminData('activities');
  
  // Calculate additional stats
  const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const completedOrders = orders.filter(order => order.orderStatus === 'delivered').length;
  const pendingOrders = orders.filter(order => order.orderStatus === 'processing').length;
  const shippedOrders = orders.filter(order => order.orderStatus === 'shipped').length;

  const stats = [
    { title: 'Total Users', value: users.length, icon: Users, color: 'purple' },
    { title: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'blue' },
    { title: 'Total Sales', value: `₹${totalSales.toFixed(2)}`, icon: DollarSign, color: 'green' },
    { title: 'Completed Orders', value: completedOrders, icon: CheckCircle, color: 'green' },
    { title: 'Pending Orders', value: pendingOrders, icon: Package, color: 'yellow' },
    { title: 'Shipped Orders', value: shippedOrders, icon: Truck, color: 'blue' },
    { title: 'Contact Messages', value: contacts.length, icon: Mail, color: 'orange' },
    { title: 'Recent Activities', value: activities.length, icon: Activity, color: 'pink' },
  ];

  // Prepare data for charts
  const orderStatusData = {
    labels: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        label: 'Orders by Status',
        data: [
          orders.filter(o => o.orderStatus === 'processing').length,
          orders.filter(o => o.orderStatus === 'shipped').length,
          orders.filter(o => o.orderStatus === 'delivered').length,
          orders.filter(o => o.orderStatus === 'cancelled').length,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sales by month data (simplified - you would group by month in a real app)
  const salesByMonthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales (₹)',
        data: [5000, 8000, 12000, 9000, 15000, 18000, 20000, 17000, 14000, 16000, 19000, 22000], // Sample data
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="sticky top-0 z-10 bg-white pt-4 pb-4 -mt-6 -mx-6 px-6 border-b border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4 border-gray-200">
          Admin Dashboard
        </h2>
      </div>
      <div className='mt-6'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <DataCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={
                stat.title.includes('Users') ? usersLoading :
                stat.title.includes('Orders') ? ordersLoading :
                stat.title.includes('Messages') ? contactsLoading :
                activitiesLoading
              }
            />
          ))}
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
            <div className="h-80">
              <Bar 
                data={salesByMonthData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
            <div className="h-80">
              <Pie 
                data={orderStatusData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                }} 
              />
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.orderNumber || order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}