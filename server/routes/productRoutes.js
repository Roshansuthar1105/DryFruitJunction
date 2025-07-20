const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const upload = require('../utils/multer');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage
} = require('../controllers/productController');

// router.route('/')
//   .get(getProducts)
//   .post(protect, admin, upload.array('productImages', 5), createProduct); // Changed field name to 'productImages'
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct); // Remove the upload middleware here
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/images')
  .post(protect, admin, upload.array('images', 5), uploadProductImages)
  .delete(protect, admin, deleteProductImage);

module.exports = router;