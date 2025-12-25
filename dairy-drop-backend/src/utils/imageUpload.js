import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Create Cloudinary storage instance
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dairy-drop', // Folder in Cloudinary to store images
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' } // Limit image size
    ]
  },
});

// Initialize multer with Cloudinary storage
export const upload = multer({ storage });

// Function to delete images from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Function to upload single image to Cloudinary
export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'dairy-drop',
      allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 600, crop: 'limit' }
      ]
    });
    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Function to upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'dairy-drop',
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
        transformation: [
          { width: 800, height: 600, crop: 'limit' }
        ]
      })
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw error;
  }
};