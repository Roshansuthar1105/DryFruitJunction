import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import DataTable from '../../components/admin/DataTable';
import MobileDataCard from '../../components/admin/MobileDataCard';
import StatusBadge from '../../components/admin/StatusBadge';
import UpdateStatusDropdown from '../../components/admin/UpdateStatusDropdown';
import {toast}from 'react-hot-toast';

export default function UsersPage() {
  const { data: users, loading, error, updateStatus } = useAdminData('users');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Name', accessor: user => `${user.firstName} ${user.lastName}` },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      accessor: user => (
        <StatusBadge 
          status={user.role} 
          variants={{
            admin: 'purple',
            delivery: 'blue',
            user: 'gray'
          }}
        />
      )
    },
    {
      header: 'Actions',
      accessor: user => (
        <UpdateStatusDropdown
          currentStatus={user.role}
          options={[
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
            { value: 'delivery', label: 'Delivery Partner' },
          ]}
          onUpdate={(newStatus) => {toast.success("User role updated!");updateStatus(user._id, newStatus, 'user')}}
        />
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 min-h-screen">
      <div className="sticky top-0 z-10 bg-white pt-4 pb-4 -mt-6 -mx-6 px-6 border-b border-gray-200">
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200 sm:flex-row flex-col">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-5 sm:mb-0">User Management</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-300 rounded-md px-3 py-2 sm:w-fit w-full "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      </div>
    <div className='mt-6'>

      {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
      
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable data={filteredUsers} columns={columns} />
          </div>
          <div className="md:hidden space-y-4">
            {filteredUsers.map(user => (
              <MobileDataCard
                key={user._id}
                title={`${user.firstName} ${user.lastName}`}
                subtitle={user.email}
                status={user.role}
                statusVariants={{
                  admin: 'purple',
                  delivery: 'blue',
                  user: 'gray'
                }}
                action={
                  <UpdateStatusDropdown
                    currentStatus={user.role}
                    options={[
                      { value: 'user', label: 'User' },
                      { value: 'admin', label: 'Admin' },
                      { value: 'delivery', label: 'Delivery Partner' },
                    ]}
                    onUpdate={(newStatus) => updateStatus(user._id, newStatus, 'user')}
                    className="w-full"
                  />
                }
              />
            ))}
          </div>
        </>
      )}
    </div>

    </div>
  );
}