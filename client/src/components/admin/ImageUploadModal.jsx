import { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import useApi from '../../services/apiService';
import toast from 'react-hot-toast';

export default function ImageUploadModal({ isOpen, onClose, product, onSuccess }) {
  const api = useApi();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  // Handle click outside
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const newPreviews = selectedFiles.map(file => ({
      id: URL.createObjectURL(file),
      file,
      name: file.name
    }));

    setPreviews(newPreviews);
  };

  const removePreview = (id) => {
    setPreviews(previews.filter(p => p.id !== id));
    setFiles(files.filter(f => URL.createObjectURL(f) !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      await toast.promise(
        api.uploadProductImages(product._id, formData),
        {
          loading: 'Uploading images...',
          success: 'Images uploaded successfully',
          error: (err) => {
            const errorMsg = err.response?.data?.message || 'Failed to upload images';
            setError(errorMsg);
            toast.error("failed to upload image")
            return errorMsg;
          }
        }
      );
      onSuccess();
      onClose();
    } catch (err) {
      // Error is already handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (public_id) => {
    try {
      await toast.promise(
        api.deleteProductImage(product._id, { public_id }),
        {
          loading: 'Deleting image...',
          success: 'Image deleted successfully',
          error: (err) => {
            const errorMsg = err.response?.data?.message || 'Failed to delete image';
            setError(errorMsg);
            toast.error("Failed to delete image")
            return errorMsg;
          }
        }
      );
      onSuccess();
    } catch (err) {
      // Error is already handled by toast.promise
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">
            Manage Images for {product.name}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Upload New Images</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop images here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum 5 images at a time (JPEG, PNG)
                  </p>
                </div>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map(preview => (
                  <div key={preview.id} className="relative group">
                    <img
                      src={preview.id}
                      alt={preview.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removePreview(preview.id)}
                      className="cursor-pointer absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {product.images && product.images.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Existing Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map(image => (
                  <div key={image.public_id} className="relative group">
                    <img
                      src={image.url}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image._id)} // Pass public_id
                      className="cursor-pointer absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            {previews.length > 0 && (
              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-md hover:shadow-md flex items-center space-x-2"
                disabled={loading}
              >
                <Upload className="h-4 w-4" />
                <span>{loading ? 'Uploading...' : 'Upload Images'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}