import { databases } from "../config/appwrite";
import { Query } from "appwrite";

/**
 * Get all users with pagination, search, and admin filter
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of users per page (default: 25)
 * @param {number} options.offset - Number of users to skip (default: 0)
 * @param {string} options.searchTerm - Search term to filter by name or email (optional)
 * @param {boolean|null} options.isAdmin - Filter by admin status: true for admins only, false for non-admins, null for all (optional)
 * @returns {Promise<Object>} Object containing users array and total count
 * @throws {Error} If fetching users fails
 */
export const getUsers = async ({
  limit = 25,
  offset = 0,
  searchTerm = "",
  isAdmin = null,
} = {}) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "users";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    // Build query array
    const queries = [];

    // Add pagination queries
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));

    // Add search query if searchTerm is provided
    if (searchTerm && searchTerm.trim() !== "") {
      // Search in both fullName and email fields
      // Appwrite supports OR queries, but we'll use separate queries for name and email
      // Note: Appwrite's Query.search() searches in a single field
      // We'll use Query.or() to search in multiple fields if available, otherwise search in email
      // For better search, we can search in email (most common) or use multiple queries
      queries.push(
        Query.or([
          Query.search("fullName", searchTerm),
          Query.search("email", searchTerm),
        ])
      );
    }

    // Add admin filter if specified
    if (isAdmin !== null && isAdmin !== undefined) {
      queries.push(Query.equal("isAdmin", isAdmin));
    }

    // Order by creation date (newest first)
    queries.push(Query.orderDesc("$createdAt"));

    // Fetch users from database
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );

    return {
      users: response.documents,
      total: response.total,
      limit: response.limit,
      offset: response.offset,
    };
  } catch (error) {
    throw new Error(
      error?.message || "Unable to fetch users. Please try again."
    );
  }
};

/**
 * Get a single user by ID
 * @param {string} userId - User document ID
 * @returns {Promise<Object>} User document
 * @throws {Error} If fetching user fails
 */
export const getUserById = async (userId) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "users";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    const userDoc = await databases.getDocument(
      databaseId,
      collectionId,
      userId
    );

    return userDoc;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to fetch user. Please try again."
    );
  }
};

/**
 * Update user document
 * @param {string} userId - User document ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user document
 * @throws {Error} If updating user fails
 */
export const updateUser = async (userId, userData) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "users";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    const updatedDoc = await databases.updateDocument(
      databaseId,
      collectionId,
      userId,
      userData
    );

    return updatedDoc;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to update user. Please try again."
    );
  }
};

/**
 * Delete user document
 * @param {string} userId - User document ID
 * @returns {Promise<boolean>} Success status
 * @throws {Error} If deleting user fails
 */
export const deleteUser = async (userId) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "users";

    if (!databaseId) {
      throw new Error(
        "Database configuration error. Please contact support."
      );
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    await databases.deleteDocument(databaseId, collectionId, userId);

    return true;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to delete user. Please try again."
    );
  }
};

