const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Make sure your .env keys exactly match these names
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_dev",                 // folder name in Cloudinary
    allowed_formats: ["png", "jpg", "jpeg"],  // correct key + spelling
  },
});

module.exports = { cloudinary, storage };
