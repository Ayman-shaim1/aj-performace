import { databases } from "../config/appwrite";
import { Query } from "appwrite";

/**
 * Get all categories with pagination and search
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of categories per page (default: 25)
 * @param {number} options.offset - Number of categories to skip (default: 0)
 * @param {string} options.searchTerm - Search term to filter by name (optional)
 * @returns {Promise<Object>} Object containing categories array and total count
 * @throws {Error} If fetching categories fails
 */
export const getCategories = async ({
  limit = 25,
  offset = 0,
  searchTerm = "",
} = {}) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "categories";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    const queries = [];
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));

    if (searchTerm && searchTerm.trim() !== "") {
      queries.push(Query.search("name", searchTerm));
    }

    queries.push(Query.orderDesc("$createdAt"));

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );

    return {
      categories: response.documents,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
    };
  } catch (error) {
    throw new Error(
      error?.message || "Unable to fetch categories. Please try again."
    );
  }
};

/**
 * Get all categories (no pagination) - useful for dropdowns
 * @returns {Promise<Array>} Array of all categories
 * @throws {Error} If fetching categories fails
 */
export const getAllCategories = async () => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "categories";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.orderAsc("name")]
    );

    return response.documents;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to fetch categories. Please try again."
    );
  }
};

/**
 * Get a single category by ID
 * @param {string} categoryId - Category document ID
 * @returns {Promise<Object>} Category document
 * @throws {Error} If fetching category fails
 */
export const getCategoryById = async (categoryId) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "categories";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    if (!categoryId) {
      throw new Error("Category ID is required.");
    }

    const categoryDoc = await databases.getDocument(
      databaseId,
      collectionId,
      categoryId
    );

    return categoryDoc;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to fetch category. Please try again."
    );
  }
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.name - Category name (required)
 * @returns {Promise<Object>} Created category document
 * @throws {Error} If creating category fails
 */
export const createCategory = async ({ name }) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "categories";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    if (!name || name.trim() === "") {
      throw new Error("Category name is required.");
    }

    const newCategory = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      {
        name: name.trim(),
      }
    );

    return newCategory;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to create category. Please try again."
    );
  }
};

/**
 * Update a category
 * @param {string} categoryId - Category document ID
 * @param {Object} categoryData - Category data to update
 * @param {string} categoryData.name - Category name
 * @returns {Promise<Object>} Updated category document
 * @throws {Error} If updating category fails
 */
export const updateCategory = async (categoryId, { name }) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "categories";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    if (!categoryId) {
      throw new Error("Category ID is required.");
    }

    if (!name || name.trim() === "") {
      throw new Error("Category name is required.");
    }

    const updatedCategory = await databases.updateDocument(
      databaseId,
      collectionId,
      categoryId,
      {
        name: name.trim(),
      }
    );

    return updatedCategory;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to update category. Please try again."
    );
  }
};

/**
 * Delete a category
 * @param {string} categoryId - Category document ID
 * @returns {Promise<boolean>} Success status
 * @throws {Error} If deleting category fails
 */
export const deleteCategory = async (categoryId) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "categories";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    if (!categoryId) {
      throw new Error("Category ID is required.");
    }

    await databases.deleteDocument(databaseId, collectionId, categoryId);

    return true;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to delete category. Please try again."
    );
  }
};

