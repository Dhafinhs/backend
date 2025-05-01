const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Konfigurasi Cloudinary dari `CLOUDINARY_URL`
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

exports.uploadImage = async (file) => {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    });

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
