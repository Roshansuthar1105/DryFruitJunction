import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useApi = () => {
  const { BACKEND_API } = useAuth();

  const getToken = () => localStorage.getItem('token');

  const getHeaders = () => ({
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
  });

  // Special headers for file uploads
  const getMultipartHeaders = () => ({
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data'
    },
  });

  return {
    fetchUsers: () => axios.get(`${BACKEND_API}/api/users`, getHeaders()),
    fetchOrders: () => axios.get(`${BACKEND_API}/api/orders`, getHeaders()),
    fetchContacts: () => axios.get(`${BACKEND_API}/api/contact`, getHeaders()),
    fetchActivities: () => axios.get(`${BACKEND_API}/api/activities`, getHeaders()),
    updateUserRole: (userId, newRole) =>
      axios.put(`${BACKEND_API}/api/users/${userId}/role`, { role: newRole }, getHeaders()),
    updateContactStatus: (contactId, newStatus) =>
      axios.put(`${BACKEND_API}/api/contact/${contactId}`, { status: newStatus }, getHeaders()),
    updateOrderStatus: (orderId, newStatus) =>
      axios.put(`${BACKEND_API}/api/orders/${orderId}`, { status: newStatus }, getHeaders()),
    // Product methods
    getProducts: () => axios.get(`${BACKEND_API}/api/products`, getHeaders()),
    getProductById: (id) => axios.get(`${BACKEND_API}/api/products/${id}`, getHeaders()),
    createProduct: (data) => axios.post(
      `${BACKEND_API}/api/products`, 
      data,
      getHeaders() // Not multipart since we're not sending files
    ),
    updateProduct: (id, data) => axios.put(`${BACKEND_API}/api/products/${id}`, data, getHeaders()),
    deleteProduct: (id) => axios.delete(`${BACKEND_API}/api/products/${id}`, getHeaders()),
    
    // File upload methods - use multipart headers
    uploadProductImages: (id, formData) => axios.post(
      `${BACKEND_API}/api/products/${id}/images`, 
      formData, 
      getMultipartHeaders()
    ),
    deleteProductImage: (id, data) => axios.delete(
      `${BACKEND_API}/api/products/${id}/images`, 
      { 
        data: { public_id: data.public_id }, // Send as public_id
        ...getHeaders() 
      }
    ),
  };
};

export default useApi;