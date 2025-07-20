import { useState } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import StatusBadge from '../../components/admin/StatusBadge';
import UpdateStatusDropdown from '../../components/admin/UpdateStatusDropdown';
import {toast}from 'react-hot-toast';

const statusFilters = [
  { value: 'all', label: 'All Messages' },
  { value: 'pending', label: 'Pending' },
  { value: 'responded', label: 'Responded' },
  { value: 'spam', label: 'Spam' },
];

export default function ContactsPage() {
  const { data: contacts, loading, error, updateStatus } = useAdminData('contacts');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="sticky top-0 z-10 bg-white pt-4 pb-4 -mt-6 -mx-6 px-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 border-gray-200 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-800">Contact Submissions</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer border border-gray-300 rounded-md px-3 py-2"
          >
            {statusFilters.map(filter => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search contacts..."
            className="border border-gray-300 rounded-md px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      </div>
<div className='mt-6'>
      {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
      
      {loading ? (
        <p className="text-gray-500">Loading contacts...</p>
      ) : (
        <div className="space-y-6">
          {filteredContacts.map(contact => (
            <div key={contact._id} className="border border-gray-200 bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div>
                  <h3 className="font-bold text-gray-800">{contact.name}</h3>
                  <p className="text-sm text-gray-500">
                    {contact.phone}
                  </p>
                  <p className="text-sm text-gray-500">
                    {contact.email} • {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <UpdateStatusDropdown
                    currentStatus={contact.status}
                    options={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'responded', label: 'Responded' },
                      { value: 'spam', label: 'Spam' },
                    ]}
                    onUpdate={(newStatus) => {toast.success("Contact updated");updateStatus(contact._id, newStatus, 'contact')}}
                  />
                  <StatusBadge 
                    status={contact.status} 
                    variants={{
                      pending: 'yellow',
                      responded: 'green',
                      spam: 'red'
                    }}
                  />
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
    </div>
  );
}