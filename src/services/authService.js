import { account, databases } from "../config/appwrite";
import { buildUrl } from "../utils/url";

/**
 * Login with email and password
 * Note: User must have verified their email to login
 * Note: Users with isAdmin = true CANNOT use this function - they must use adminLogin()
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Appwrite session object
 * @throws {Error} If login fails, email is not verified, or user is an admin
 */
export const login = async (email, password) => {
  try {
    // First, try to create a session
    const session = await account.createEmailPasswordSession(email, password);

    // Check if user email is verified
    const user = await account.get();

    if (!user.emailVerification) {
      // Delete the session since email is not verified
      try {
        await account.deleteSession("current");
      } catch (deleteError) {
        // Ignore deletion errors
      }
      throw new Error(
        "Your account is not verified. Please check your email and verify your account before logging in."
      );
    }

    // Check if user is an admin - admins must use adminLogin() instead
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "users";

    if (databaseId) {
      try {
        // Get user document to check isAdmin
        const userDoc = await databases.getDocument(
          databaseId,
          collectionId,
          user.$id
        );

        // If user is an admin, block them from using regular login
        if (userDoc.isAdmin) {
          // Delete the session since admin cannot use regular login
          try {
            await account.deleteSession("current");
          } catch (deleteError) {
            // Ignore deletion errors
          }
          throw new Error(
            "Administrator accounts must use the admin login page. Please use /admin/login instead."
          );
        }
      } catch (getDocError) {
        // If document doesn't exist or error fetching, allow login
        // (user might not have document yet, or it's a new user)
        // Only block if we successfully retrieved the document and isAdmin = true
      }
    }

    return session;
  } catch (error) {
    // If it's already our custom error, throw it
    if (
      error.message.includes("not verified") ||
      error.message.includes("Administrator accounts")
    ) {
      throw error;
    }
    throw new Error(
      error?.message ||
        "Unable to sign in with these credentials. Please try again."
    );
  }
};

/**
 * Login with Google OAuth2
 * @param {string} successUrl - URL to redirect on success
 * @param {string} failureUrl - URL to redirect on failure
 */
export const loginWithGoogle = (successUrl, failureUrl) => {
  try {
    account.createOAuth2Session("google", successUrl, failureUrl);
  } catch (error) {
    throw new Error(
      error?.message || "Unable to sign in with Google. Please try again."
    );
  }
};

/**
 * Admin login with email and password
 * Note: User must have verified their email AND isAdmin = true in user document
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Appwrite session object
 * @throws {Error} If login fails, email is not verified, or user is not an admin
 */
export const adminLogin = async (email, password) => {
  try {
    // First, try to create a session (same as regular login)
    const session = await account.createEmailPasswordSession(email, password);

    // Check if user email is verified
    const user = await account.get();

    if (!user.emailVerification) {
      // Delete the session since email is not verified
      try {
        await account.deleteSession("current");
      } catch (deleteError) {
        // Ignore deletion errors
      }
      throw new Error(
        "Your account is not verified. Please check your email and verify your account before logging in."
      );
    }

    // Check if user has admin privileges
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "users";

    if (!databaseId) {
      // Delete session if database config is missing
      try {
        await account.deleteSession("current");
      } catch (deleteError) {
        // Ignore deletion errors
      }
      throw new Error(
        "Admin authentication configuration error. Please contact support."
      );
    }

    try {
      // Get user document from database
      const userDoc = await databases.getDocument(
        databaseId,
        collectionId,
        user.$id
      );

      // Check if user has isAdmin = true
      if (!userDoc.isAdmin) {
        // Delete the session since user is not an admin
        try {
          await account.deleteSession("current");
        } catch (deleteError) {
          // Ignore deletion errors
        }
        throw new Error(
          "Access denied. You do not have administrator privileges."
        );
      }

      return session;
    } catch (getDocError) {
      // If document doesn't exist or error fetching, user is not an admin
      try {
        await account.deleteSession("current");
      } catch (deleteError) {
        // Ignore deletion errors
      }
      throw new Error(
        "Access denied. You do not have administrator privileges."
      );
    }
  } catch (error) {
    // If it's already our custom error, throw it
    if (
      error.message.includes("not verified") ||
      error.message.includes("Access denied") ||
      error.message.includes("configuration error")
    ) {
      throw error;
    }
    throw new Error(
      error?.message ||
        "Unable to sign in with these credentials. Please try again."
    );
  }
};

/**
 * Logout the current user
 * @returns {Promise} Success status
 * @throws {Error} If logout fails
 */
export const logout = async () => {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    throw new Error(error?.message || "Unable to sign out. Please try again.");
  }
};

/**
 * Update phone number in Appwrite account
 * Note: For OAuth users without password, this will fail silently
 * @param {string} phoneNumber - Phone number to update
 * @param {string} password - User password (required for email/password users)
 * @returns {Promise<boolean>} True if update succeeded, false otherwise
 */
export const updateAccountPhone = async (phoneNumber, password = null) => {
  try {
    if (!phoneNumber || phoneNumber.trim() === "") {
      return false;
    }

    // Clean phone number
    let phoneClean = phoneNumber.trim();
    if (!phoneClean.startsWith("+")) {
      phoneClean = "+" + phoneClean;
    }
    const digitsOnly = phoneClean
      .substring(1)
      .replace(/\D/g, "")
      .substring(0, 15);
    phoneClean = "+" + digitsOnly;

    // Try to update phone in account
    // For OAuth users without password, this will fail
    if (password) {
      try {
        await account.updatePhone(phoneClean, password);
        return true;
      } catch (error) {
        // Update failed, return false
        console.warn("Failed to update phone in account:", error.message);
        return false;
      }
    } else {
      // No password provided (OAuth user), cannot update account phone
      // Phone will only be stored in database collection
      return false;
    }
  } catch (error) {
    console.warn("Error updating account phone:", error.message);
    return false;
  }
};

/**
 * Ensures a user document exists in the users collection
 * Creates it if it doesn't exist, updates authMethod if needed
 * @param {string} authMethod - 'simple' for email/password, 'google' for OAuth
 * @param {string} phoneNumber - Optional phone number to use (overrides user.phone from account)
 * @returns {Promise} Created or existing user document
 */
export const ensureUserDocument = async (
  authMethod = "simple",
  phoneNumber = null
) => {
  try {
    const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const collectionId = "users";

    if (!databaseId) {
      return null;
    }

    // Get current user
    const user = await account.get();

    if (!user || !user.$id) {
      return null;
    }

    // Determine phone number: use provided phoneNumber, or user.phone, or empty string
    // Clean the phone number: trim and ensure proper format
    let finalPhoneNumber = "";
    if (phoneNumber !== null && phoneNumber.trim() !== "") {
      finalPhoneNumber = phoneNumber.trim();
    } else if (user.phone && user.phone.trim() !== "") {
      finalPhoneNumber = user.phone.trim();
    }

    try {
      // Try to get existing document
      const existingDoc = await databases.getDocument(
        databaseId,
        collectionId,
        user.$id
      );

      // Prepare update data
      const updateData = {};
      let needsUpdate = false;

      // If document exists but doesn't have authMethod, update it
      if (!existingDoc.authMethod) {
        updateData.authMethod = authMethod;
        needsUpdate = true;
      }

      // If phoneNumber is provided and (different from existing OR existing is empty/missing), update it
      if (phoneNumber !== null && phoneNumber.trim() !== "") {
        const existingPhone = existingDoc.phoneNumber || "";
        if (existingPhone.trim() !== phoneNumber.trim()) {
          updateData.phoneNumber = phoneNumber.trim();
          needsUpdate = true;
        }
      }

      // If needs update, perform it
      if (needsUpdate) {
        try {
          await databases.updateDocument(
            databaseId,
            collectionId,
            user.$id,
            updateData
          );
          // Refresh the document to get updated data
          return await databases.getDocument(
            databaseId,
            collectionId,
            user.$id
          );
        } catch (updateError) {
          // Silently fail update, return existing doc
        }
      }

      return existingDoc;
    } catch (getError) {
      // Document doesn't exist, create it with the provided authMethod
      try {
        // Match the collection schema: fullName, email, phoneNumber (not phone!)
        // For Google OAuth users, user.name might not be available, so use email as fallback
        const userData = {
          fullName: user.name || user.email?.split("@")[0] || "User", // Required field
          email: user.email || "", // Required field
          phoneNumber: finalPhoneNumber, // Use the determined phone number
          authMethod: authMethod,
        };

        const newDoc = await databases.createDocument(
          databaseId,
          collectionId,
          user.$id, // Use the same ID as the account
          userData
        );
        return newDoc;
      } catch (createError) {
        // Log the error for debugging
        console.error("Error creating user document:", createError);
        // Re-throw with more context
        throw new Error(
          createError.message || "Failed to create user document in database"
        );
      }
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Send verification email to user
 * @param {string} url - Callback URL for email verification
 * @returns {Promise} Success status
 * @throws {Error} If sending verification email fails
 */
export const sendVerificationEmail = async (url) => {
  try {
    await account.createVerification(url);
    return true;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to send verification email. Please try again."
    );
  }
};

/**
 * Verify user email with secret token
 * @param {string} userId - User ID
 * @param {string} secret - Verification secret token
 * @returns {Promise} Success status
 * @throws {Error} If verification fails
 */
export const verifyEmail = async (userId, secret) => {
  try {
    await account.updateVerification(userId, secret);
    return true;
  } catch (error) {
    throw new Error(
      error?.message ||
        "Email verification failed. The link may be invalid or expired."
    );
  }
};

/**
 * Register a new user with email and password
 * Note: Creates account, inserts user data in collection, sends verification email, then logs out
 * User cannot login until email is verified
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.fullName - User full name
 * @param {string} userData.phone - User phone number (optional)
 * @returns {Promise} Appwrite user object
 * @throws {Error} If registration fails
 */
export const register = async ({ email, password, fullName, phone }) => {
  try {
    // Clean and validate phone number if provided
    let phoneClean = null;
    if (phone && phone.trim() !== "") {
      phoneClean = phone.trim();
      // Ensure it starts with + and has max 15 digits
      if (!phoneClean.startsWith("+")) {
        // If user forgot the +, add it
        phoneClean = "+" + phoneClean;
      }
      // Remove all non-digit characters except the leading +
      const digitsOnly = phoneClean
        .substring(1)
        .replace(/\D/g, "")
        .substring(0, 15);
      phoneClean = "+" + digitsOnly;
    }

    // Step 1: Create the account (does not create session automatically)
    const user = await account.create("unique()", email, password, fullName);

    // Step 2: Create a temporary session to enable document creation and email sending
    let session = null;
    try {
      session = await account.createEmailPasswordSession(email, password);
    } catch (sessionError) {
      throw new Error(
        "Account created but failed to create session. Please try logging in."
      );
    }

    // Step 3: Update phone number in account if provided
    if (phoneClean) {
      try {
        await account.updatePhone(phoneClean, password);
      } catch (phoneError) {
        // Phone update is optional, fail silently
        // We'll still save it in the document even if account update fails
      }
    }

    // Step 4: Insert user data in users collection with authMethod: 'simple'
    // Pass phone number directly to ensure it's saved in the document
    try {
      await ensureUserDocument("simple", phoneClean);
    } catch (docError) {
      // If document creation fails, delete session and account, then throw error
      try {
        await account.deleteSession("current");
      } catch (deleteError) {
        // Ignore
      }
      throw new Error(
        "Failed to create user profile. Please try again or contact support."
      );
    }

    // Step 5: Send verification email (requires session)
    const verificationUrl = buildUrl("/verify-email");
    try {
      await sendVerificationEmail(verificationUrl);
    } catch (verificationError) {
      // Don't fail registration if email sending fails, user can request resend
      // But log the error for debugging
    }

    // Step 6: Log out the user after sending verification email
    // User needs to verify email before they can log in
    try {
      await account.deleteSession("current");
    } catch (logoutError) {
      // Fail silently, session will expire anyway
    }

    return user;
  } catch (error) {
    throw new Error(
      error?.message || "Unable to create account. Please try again."
    );
  }
};
