import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import StatusBadge from '../../components/admin/StatusBadge';

const activityTypes = [
  { value: 'all', label: 'All Activities' },
  { value: 'login', label: 'User Login' },
  { value: 'signup', label: 'User Signup' },
  { value: 'product_add', label: 'Product Added' },
  { value: 'product_update', label: 'Product Updated' },
  { value: 'product_delete', label: 'Product Deleted' },
  { value: 'product_images_add', label: 'Product Images Added' },
  { value: 'product_image_delete', label: 'Product Image Deleted' },
  { value: 'order_placed', label: 'Order Placed' },
  { value: 'order_shipped', label: 'Order Shipped' },
  { value: 'order_delivered', label: 'Order Delivered' },
  { value: 'order_cancelled', label: 'Order Cancelled' },
  { value: 'contact_submitted', label: 'Contact Form Submitted' }
];

export default function ActivitiesPage() {
  const { data: activities, loading, error } = useAdminData('activities');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredActivities = activities.filter(activity => {
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesSearch =
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.user && `${activity.user.firstName} ${activity.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 ">
      <div className="sticky top-0 z-10 bg-white pt-4 pb-4 -mt-6 -mx-6 px-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-extrabold text-gray-800">Recent Activities</h2>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="cursor-pointer border border-gray-300 rounded-md px-3 py-2"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search activities..."
              className="border border-gray-300 rounded-md px-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='mt-6' >
        {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        {loading ? (
          <p className="text-gray-500">Loading activities...</p>
        ) : (
          <div className="space-y-4 ">
            {filteredActivities.map((activity) => (
              <div key={activity._id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex flex-col md:flex-row justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'System'}
                    </p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <div className="flex flex-col md:items-end gap-1">
                    <div className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                    <StatusBadge
                      status={activity.type.replace('_', ' ')}
                      variants={{
                        'user login': 'blue',
                        'order created': 'green',
                        'order updated': 'purple',
                        'contact submitted': 'orange'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}