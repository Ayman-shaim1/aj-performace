import { storage } from "../config/appwrite";

/**
 * Upload an image file to Appwrite Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} The file ID (to be stored in the database)
 * @throws {Error} If upload fails
 */
export const uploadImage = async (file) => {
  try {
    const bucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

    if (!bucketId) {
      throw new Error(
        "Storage bucket configuration error. Please contact support."
      );
    }

    if (!file) {
      throw new Error("File is required.");
    }

    // Validate file type
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit. Please upload a smaller image.");
    }

    // Upload file to Appwrite Storage
    const response = await storage.createFile(
      bucketId,
      "unique()",
      file
    );

    // Return the file ID - this should be stored in the database
    return response.$id;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to upload image. Please try again."
    );
  }
};

/**
 * Get the URL for an uploaded image
 * @param {string} fileId - The file ID from the database
 * @returns {string} The image URL
 */
export const getImageUrl = (fileId) => {
  if (!fileId) {
    return null;
  }

  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const bucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

  if (!endpoint || !projectId || !bucketId) {
    return null;
  }

  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};

/**
 * Delete an image from Appwrite Storage
 * @param {string} fileId - The file ID to delete
 * @returns {Promise<boolean>} Success status
 * @throws {Error} If deletion fails
 */
export const deleteImage = async (fileId) => {
  try {
    const bucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

    if (!bucketId) {
      throw new Error(
        "Storage bucket configuration error. Please contact support."
      );
    }

    if (!fileId) {
      throw new Error("File ID is required.");
    }

    await storage.deleteFile(bucketId, fileId);

    return true;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to delete image. Please try again."
    );
  }
};

