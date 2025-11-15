import { useState, useEffect } from "react";
import { account } from "../config/appwrite";

/**
 * Custom hook to check and manage authentication state
 * @returns {Object} { currentUser, isLoading, checkAuth }
 * - currentUser: The current authenticated user object or null
 * - isLoading: Boolean indicating if authentication check is in progress
 * - checkAuth: Function to manually refresh authentication state
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const user = await account.get();
      if (user && user.$id) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { currentUser, isLoading, checkAuth };
};

