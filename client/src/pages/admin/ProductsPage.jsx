import { useState, useEffect } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import DataTable from '../../components/admin/DataTable';
import MobileDataCard from '../../components/admin/MobileDataCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Image as ImageIcon, Star, Search, Filter } from 'lucide-react';
import ProductFormModal from '../../components/admin/ProductFormModal';
import ImageUploadModal from '../../components/admin/ImageUploadModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import useApi from '../../services/apiService';
import toast from 'react-hot-toast';

const categoryOptions = [
  'Premium',
  'Regular',
  'Seasonal'
];

export default function ProductsPage() {
  const { data: products, loading, error, fetchData } = useAdminData('products');
  const api = useApi();
  const [newProductId, setNewProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.isActive) || 
      (statusFilter === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async () => {
    try {
      await api.deleteProduct(selectedProduct._id);
      fetchData();
      setIsDeleteModalOpen(false);
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const columns = [
    {
      header: 'Product Info',
      accessor: product => (
        <div className="flex items-center space-x-4">
          {product.images?.[0]?.url ? (
            <div className="relative">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              {product.featured && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1 rounded-full">
                  Featured
                </div>
              )}
            </div>
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{product.name}</p>
            <p className="text-sm text-gray-500 truncate">
              {product.shortDescription}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {product.category}
              </span>
              {product.rating > 0 && (
                <span className="flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-amber-500 mr-1" />
                  {product.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Pricing',
      accessor: product => (
        <div className="space-y-1">
          {product.variants?.length > 0 ? (
            product.variants.map(variant => (
              <div key={variant._id} className="text-sm">
                <div className="font-medium">
                  {variant.weight}: ₹{variant.price}
                  {variant.originalPrice > variant.price && (
                    <span className="text-gray-400 line-through text-xs ml-1">₹{variant.originalPrice}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <span className="font-medium">₹{product.price}</span>
          )}
        </div>
      )
    },
    {
      header: 'Inventory',
      accessor: product => (
        <div className="space-y-1">
          {product.variants?.length > 0 ? (
            product.variants.map(variant => (
              <div key={variant._id} className="flex items-center">
                <StatusBadge
                  status={`${variant.stock} left`}
                  variants={{
                    [`${variant.stock} left`]: 
                      variant.stock === 0 ? 'red' : 
                      variant.stock <= product.lowStockThreshold ? 'orange' : 'green'
                  }}
                />
                {!variant.isActive && (
                  <span className="ml-1 text-xs text-gray-500">(Inactive)</span>
                )}
              </div>
            ))
          ) : (
            <StatusBadge
              status={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              variants={{
                'In Stock': 'green',
                'Out of Stock': 'red'
              }}
            />
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: product => (
        <StatusBadge
          status={product.isActive ? 'Active' : 'Inactive'}
          variants={{
            'Active': 'green',
            'Inactive': 'red'
          }}
        />
      )
    },
    {
      header: 'Actions',
      accessor: product => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedProduct(product);
              setIsFormOpen(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setSelectedProduct(product);
              setIsImageUploadOpen(true);
            }}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative"
            title="Manage Images"
          >
            <ImageIcon className="h-4 w-4" />
            {product.images?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-100 text-purple-800 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {product.images.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setSelectedProduct(product);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-6 min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-500">Manage your product inventory and listings</p>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <DataTable 
              data={filteredProducts} 
              columns={columns} 
              emptyMessage="No products found. Try adjusting your filters or add a new product."
            />
          </div>
          
          <div className="md:hidden space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500">No products match your search criteria</p>
              </div>
            ) : (
              filteredProducts.map(product => {
                const mainVariant = product.variants?.[0] || {
                  price: product.price,
                  weight: '',
                  stock: product.stock,
                  isActive: product.isActive
                };

                return (
                  <MobileDataCard
                    key={product._id}
                    title={product.name}
                    subtitle={
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {product.category}
                          </span>
                          {product.featured && (
                            <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium">
                          {mainVariant.weight && `${mainVariant.weight}: `}₹{mainVariant.price}
                          {mainVariant.originalPrice > mainVariant.price && (
                            <span className="text-gray-400 line-through text-xs ml-1">₹{mainVariant.originalPrice}</span>
                          )}
                        </div>
                        {product.rating > 0 && (
                          <div className="flex items-center text-sm">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                            <span>{product.rating} ({product.numReviews || 0} reviews)</span>
                          </div>
                        )}
                      </div>
                    }
                    status={
                      <div className="space-y-2">
                        {product.variants?.length > 0 ? (
                          product.variants.map(variant => (
                            <div key={variant._id} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{variant.weight}</span>
                              <div className="flex items-center">
                                <StatusBadge
                                  status={`${variant.stock} left`}
                                  variants={{
                                    [`${variant.stock} left`]: 
                                      variant.stock === 0 ? 'red' : 
                                      variant.stock <= product.lowStockThreshold ? 'orange' : 'green'
                                  }}
                                />
                                {!variant.isActive && (
                                  <span className="ml-1 text-xs text-gray-500">(Inactive)</span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <StatusBadge
                            status={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            variants={{
                              'In Stock': 'green',
                              'Out of Stock': 'red'
                            }}
                          />
                        )}
                      </div>
                    }
                    action={
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsFormOpen(true);
                          }}
                          className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 " />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsImageUploadOpen(true);
                          }}
                          className="cursor-pointer p-2 text-purple-600 hover:bg-purple-50 rounded-lg relative"
                          title="Manage Images"
                        >
                          <ImageIcon className="h-4 w-4" />
                          {product.images?.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-purple-100 text-purple-800 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {product.images.length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    }
                  />
                );
              })
            )}
          </div>
        </>
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setNewProductId(null);
        }}
        product={selectedProduct}
        onSuccess={async (createdProduct) => {
          await fetchData();
          if (!selectedProduct && createdProduct) {
            setNewProductId(createdProduct._id);
            setSelectedProduct(createdProduct);
            setIsImageUploadOpen(true);
            toast.success('Product created! Now add images');
          } else {
            toast.success('Product updated successfully');
          }
        }}
        categories={categoryOptions}
      />

      {selectedProduct && (
        <>
          <ImageUploadModal
            isOpen={isImageUploadOpen}
            onClose={() => setIsImageUploadOpen(false)}
            product={selectedProduct || { _id: newProductId, name: 'New Product' }}
            onSuccess={async () => {
              await fetchData();
              setNewProductId(null);
              toast.success('Images updated successfully');
            }}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Product"
            message={`Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}
    </div>
  );
}