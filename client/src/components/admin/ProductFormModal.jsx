import { useState, useEffect, useRef } from 'react';
import { X, Save, Plus, Minus, Tag, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import useApi from '../../services/apiService';
import toast from 'react-hot-toast';

export default function ProductFormModal({ isOpen, onClose, product, onSuccess, categories }) {
  const api = useApi();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: categories[0],
    variants: [
      {
        weight: '',
        price: '',
        originalPrice: '',
        stock: 10,
        isActive: true
      }
    ],
    ingredients: [],
    lowStockThreshold: 10,
    isActive: true,
    featured: true,
    tags: [],
    rating: 4.5,
    shelfLife: '',
    storageInstructions: '',
    allergens: [],
    isVegan: false,
    isGlutenFree: false,
    preparationTime: '',
    slug: '',
    images: []
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || '',
        category: product.category,
        variants: product.variants?.length ? product.variants : [
          {
            weight: product.weight || '',
            price: product.price,
            originalPrice: product.originalPrice || '',
            stock: product.stock,
            isActive: true
          }
        ],
        ingredients: product.ingredients || [],
        lowStockThreshold: product.lowStockThreshold || 10,
        isActive: product.isActive,
        featured: product.featured || false,
        tags: product.tags || [],
        rating: product.rating || 4.5,
        shelfLife: product.shelfLife || '',
        storageInstructions: product.storageInstructions || '',
        allergens: product.allergens || [],
        isVegan: product.isVegan || false,
        isGlutenFree: product.isGlutenFree || false,
        preparationTime: product.preparationTime || '',
        slug: product.slug || '',
        images: product.images || []
      });
      setImagePreviews(product.images || []);
    } else {
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        category: categories[0],
        variants: [
          {
            weight: '',
            price: '',
            originalPrice: '',
            stock: 10,
            isActive: true
          }
        ],
        ingredients: [],
        lowStockThreshold: 10,
        isActive: true,
        featured: false,
        tags: [],
        rating: 4.5,
        shelfLife: '',
        storageInstructions: '',
        allergens: [],
        isVegan: false,
        isGlutenFree: false,
        preparationTime: '',
        slug: '',
        images: []
      });
      setImagePreviews([]);
    }
    setFilesToUpload([]);
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          weight: '',
          price: '',
          originalPrice: '',
          stock: 10,
          isActive: true
        }
      ]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const updatedVariants = [...formData.variants];
      updatedVariants.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        variants: updatedVariants
      }));
    } else {
      toast.error('At least one variant is required');
    }
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFilesToUpload(selectedFiles);

    const newPreviews = selectedFiles.map(file => ({
      id: URL.createObjectURL(file),
      file,
      name: file.name,
      isNew: true
    }));

    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...imagePreviews];
    const removed = newPreviews.splice(index, 1);

    if (removed[0].isNew) {
      setFilesToUpload(filesToUpload.filter(f =>
        f.name !== removed[0].file.name
      ));
    }

    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate variants
      for (const variant of formData.variants) {
        if (!variant.weight || !variant.price || variant.stock < 0) {
          throw new Error('Please fill all required fields for variants');
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        variants: formData.variants.map(variant => ({
          ...variant,
          price: parseFloat(variant.price),
          originalPrice: variant.originalPrice ? parseFloat(variant.originalPrice) : null,
          stock: parseInt(variant.stock)
        })),
        ingredients: formData.ingredients,
        lowStockThreshold: formData.lowStockThreshold,
        isActive: formData.isActive,
        featured: formData.featured,
        tags: formData.tags,
        rating: formData.rating,
        shelfLife: formData.shelfLife,
        storageInstructions: formData.storageInstructions,
        allergens: formData.allergens,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
        preparationTime: formData.preparationTime,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
      };

      let result;
      if (product) {
        // For update, include images if they exist
        result = await api.updateProduct(product._id, {
          ...productData,
          images: imagePreviews
            .filter(img => !img.isNew) // existing images
            .map(img => ({
              url: img.url,
              public_id: img.public_id,
              alt: img.alt || ''
            }))
        });
        toast.success('Product updated successfully');
      } else {
        // For create, don't include images
        result = await api.createProduct(productData);
        toast.success('Product created successfully');
      }

      onSuccess(result.data);
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Images <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={image.id || image.public_id} className="relative group">
                    <img
                      src={image.url || image.id}
                      alt={image.alt || image.name || formData.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="cursor-pointer absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
                <div
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs mt-1">Add Image</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                </div>
              </div>
              {imagePreviews.length === 0 && (
                <p className="mt-1 text-sm text-red-600">At least one image is required</p>
              )}
            </div>    */}
                     {/* Required Fields */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="cursor-pointer w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Will be generated from name if empty"
              />
            </div>

            {/* Variants Section */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 cursor-pointer">
                  Variants <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="cursor-pointer text-sm bg-pink-500 text-white px-3 py-1 rounded-md flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 cursor-pointer">
                          Weight <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.weight}
                          onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          placeholder="e.g., 250g, 1kg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 cursor-pointer">
                          Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 cursor-pointer">
                          Original Price (₹)
                        </label>
                        <input
                          type="number"
                          value={variant.originalPrice}
                          onChange={(e) => handleVariantChange(index, 'originalPrice', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 cursor-pointer">
                          Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="cursor-pointer text-xs text-red-600 hover:text-red-800 flex items-center"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other fields... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="1"
                max="5"
                step="0.1"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Active Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Featured Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Vegan
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isGlutenFree"
                checked={formData.isGlutenFree}
                onChange={handleChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Gluten Free
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Shelf Life
              </label>
              <input
                type="text"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., 7 days, 1 month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Preparation Time
              </label>
              <input
                type="text"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., 2 hours, 1 day"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Ingredients (comma separated)
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients.join(', ')}
                onChange={(e) => handleArrayChange('ingredients', e.target.value)}
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Allergens (comma separated)
              </label>
              <textarea
                name="allergens"
                value={formData.allergens.join(', ')}
                onChange={(e) => handleArrayChange('allergens', e.target.value)}
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2"
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="cursor-pointer bg-pink-500 text-white px-3 rounded-r-md"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="cursor-pointer ml-1 text-gray-500 hover:text-red-500"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Storage Instructions
              </label>
              <textarea
                name="storageInstructions"
                value={formData.storageInstructions}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                maxLength="160"
                placeholder="Brief description (160 characters max)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-md hover:shadow-md flex items-center space-x-2"
              disabled={loading}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}