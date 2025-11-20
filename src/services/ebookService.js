import { databases } from "../config/appwrite";
import { Query } from "appwrite";

/**
 * Get all e-books with pagination, search, and category filter
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of e-books per page (default: 25)
 * @param {number} options.offset - Number of e-books to skip (default: 0)
 * @param {string} options.searchTerm - Search term to filter by title or description (optional)
 * @param {string} options.categoryId - Filter by category ID (optional)
 * @returns {Promise<Object>} Object containing e-books array and total count
 * @throws {Error} If fetching e-books fails
 */
export const getEBooks = async ({
  limit = 25,
  offset = 0,
  searchTerm = "",
  categoryId = null,
} = {}) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "ebooks";

    if (!databaseId) {
      throw new Error("Database configuration error. Please contact support.");
    }

    const queries = [];
    
    // If we have a search term, we'll fetch all matching documents and filter client-side
    // Otherwise, use pagination as normal
    if (searchTerm && searchTerm.trim() !== "") {
      // For search, we need to fetch more documents to filter client-side
      // We'll use a higher limit (1000 should be enough for most cases)
      queries.push(Query.limit(1000));
      queries.push(Query.offset(0));
    } else {
      queries.push(Query.limit(limit));
      queries.push(Query.offset(offset));
    }

    if (categoryId) {
      queries.push(Query.equal("categorie", categoryId));
    }

    queries.push(Query.orderDesc("$createdAt"));

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );

    let filteredEbooks = response.documents;
    let total = response.total;

    // Client-side filtering if search term is provided
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      filteredEbooks = response.documents.filter(
        (ebook) =>
          ebook.title?.toLowerCase().includes(searchLower) ||
          ebook.description?.toLowerCase().includes(searchLower)
      );
      
      total = filteredEbooks.length;
      
      // Apply pagination after filtering
      const startIndex = offset;
      const endIndex = startIndex + limit;
      filteredEbooks = filteredEbooks.slice(startIndex, endIndex);
    }

    return {
      ebooks: filteredEbooks,
      total: total,
      limit: limit,
      offset: offset,
    };
  } catch (error) {
    throw new Error(
      error?.message || "Unable to fetch e-books. Please try again."
    );
  }
};

/**
 * Get a single e-book by ID
 * @param {string} ebookId - E-book document ID
 * @returns {Promise<Object>} E-book document
 * @throws {Error} If fetching e-book fails
 */
export const getEBookById = async (ebookId) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "ebooks";

    if (!databaseId) {
      throw new Error("Database configuration error. Please contact support.");
    }

    if (!ebookId) {
      throw new Error("E-book ID is required.");
    }

    const ebookDoc = await databases.getDocument(
      databaseId,
      collectionId,
      ebookId
    );

    return ebookDoc;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to fetch e-book. Please try again."
    );
  }
};

/**
 * Create a new e-book
 * @param {Object} ebookData - E-book data
 * @param {string} ebookData.title - E-book title (required)
 * @param {string} ebookData.description - E-book description (required)
 * @param {number} ebookData.price - E-book price (required)
 * @param {string} ebookData.image - Image file ID from storage (required)
 * @param {string} ebookData.categorie - Category ID (required)
 * @returns {Promise<Object>} Created e-book document
 * @throws {Error} If creating e-book fails
 */
export const createEBook = async ({
  title,
  description,
  price,
  image,
  categorie,
}) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "ebooks";

    if (!databaseId) {
      throw new Error("Database configuration error. Please contact support.");
    }

    if (!title || title.trim() === "") {
      throw new Error("Title is required.");
    }
    if (!description || description.trim() === "") {
      throw new Error("Description is required.");
    }
    if (price === undefined || price === null || price < 0) {
      throw new Error("Valid price is required.");
    }
    if (!image || image.trim() === "") {
      throw new Error("Image is required.");
    }
    if (!categorie || categorie.trim() === "") {
      throw new Error("Category is required.");
    }

    const newEBook = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image: image.trim(),
        categorie: categorie.trim(),
      }
    );

    return newEBook;
  } catch (error) {
    // Log the full error for debugging
    console.error("E-book creation error:", error);
    
    // Check for specific Appwrite permission errors
    if (
      error.code === 401 ||
      error.code === 403 ||
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("not authorized") ||
      error.message?.toLowerCase().includes("permission")
    ) {
      throw new Error(
        "You don't have permission to create e-books. Please contact the administrator."
      );
    }
    
    throw new Error(
      error?.message || "Unable to create e-book. Please try again."
    );
  }
};

/**
 * Update an e-book
 * @param {string} ebookId - E-book document ID
 * @param {Object} ebookData - E-book data to update
 * @param {string} ebookData.title - E-book title
 * @param {string} ebookData.description - E-book description
 * @param {number} ebookData.price - E-book price
 * @param {string} ebookData.image - Image file ID from storage
 * @param {string} ebookData.categorie - Category ID
 * @returns {Promise<Object>} Updated e-book document
 * @throws {Error} If updating e-book fails
 */
export const updateEBook = async (
  ebookId,
  { title, description, price, image, categorie }
) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "ebooks";

    if (!databaseId) {
      throw new Error("Database configuration error. Please contact support.");
    }

    if (!ebookId) {
      throw new Error("E-book ID is required.");
    }

    const updateData = {};

    if (title !== undefined) {
      if (!title || title.trim() === "") {
        throw new Error("Title cannot be empty.");
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (!description || description.trim() === "") {
        throw new Error("Description cannot be empty.");
      }
      updateData.description = description.trim();
    }

    if (price !== undefined) {
      if (price === null || price < 0) {
        throw new Error("Valid price is required.");
      }
      updateData.price = parseFloat(price);
    }

    if (image !== undefined && image !== null) {
      if (image.trim() === "") {
        throw new Error("Image cannot be empty.");
      }
      updateData.image = image.trim();
    }

    if (categorie !== undefined) {
      if (!categorie || categorie.trim() === "") {
        throw new Error("Category cannot be empty.");
      }
      updateData.categorie = categorie.trim();
    }

    const updatedEBook = await databases.updateDocument(
      databaseId,
      collectionId,
      ebookId,
      updateData
    );

    return updatedEBook;
  } catch (error) {
    // Check for permission errors
    if (
      error.code === 401 ||
      error.code === 403 ||
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("not authorized") ||
      error.message?.toLowerCase().includes("permission")
    ) {
      throw new Error(
        "You don't have permission to update e-books. Please contact the administrator."
      );
    }
    throw new Error(
      error?.message || "Unable to update e-book. Please try again."
    );
  }
};

/**
 * Delete an e-book
 * @param {string} ebookId - E-book document ID
 * @returns {Promise<boolean>} Success status
 * @throws {Error} If deleting e-book fails
 */
export const deleteEBook = async (ebookId) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "ebooks";

    if (!databaseId) {
      throw new Error("Database configuration error. Please contact support.");
    }

    if (!ebookId) {
      throw new Error("E-book ID is required.");
    }

    await databases.deleteDocument(databaseId, collectionId, ebookId);

    return true;
  } catch (error) {
    // Check for permission errors
    if (
      error.code === 401 ||
      error.code === 403 ||
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("not authorized") ||
      error.message?.toLowerCase().includes("permission")
    ) {
      throw new Error(
        "You don't have permission to delete e-books. Please contact the administrator."
      );
    }
    throw new Error(
      error?.message || "Unable to delete e-book. Please try again."
    );
  }
};
