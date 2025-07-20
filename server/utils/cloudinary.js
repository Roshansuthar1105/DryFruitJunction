// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fs = require('fs');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload a file to Cloudinary
// const uploadToCloudinary = async (filePath, folder = '') => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: folder
//     });
//     // Delete file from local storage after upload
//     fs.unlinkSync(filePath);
//     return result;
//   } catch (error) {
//     // Delete file from local storage if upload fails
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//     throw error;
//   }
// };
const uploadToCloudinary = (buffer, folder = '') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Delete a file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploader: uploadToCloudinary,
  destroy: deleteFromCloudinary
};