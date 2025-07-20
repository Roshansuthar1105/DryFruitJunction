const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Stores files in memory as Buffers

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed'), false);
  }
};

const upload = multer({
  storage: storage, // Using memory storage
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit per file
  }
});
module.exports = upload;