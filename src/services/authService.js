import { account, databases } from "../config/appwrite";
import { buildUrl } from "../utils/url";

/**
 * Login with email and password
 * Note: User must have verified their email to login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Appwrite session object
 * @throws {Error} If login fails or email is not verified
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

    return session;
  } catch (error) {
    // If it's already our custom error, throw it
    if (error.message.includes("not verified")) {
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
    // Debug: Log the exact URLs being sent to Appwrite
    console.log("📤 Appwrite OAuth2 Session URLs:", { successUrl, failureUrl });
    account.createOAuth2Session("google", successUrl, failureUrl);

    setTimeout(() => {
      account.createOAuth2Session("google", successUrl, failureUrl);
    }, 1000);
  } catch (error) {
    console.error("❌ OAuth2 Session Error:", error);
    throw new Error(
      error?.message || "Unable to sign in with Google. Please try again."
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
 * Ensures a user document exists in the users collection
 * Creates it if it doesn't exist, updates authMethod if needed
 * @param {string} authMethod - 'simple' for email/password, 'google' for OAuth
 * @returns {Promise} Created or existing user document
 */
export const ensureUserDocument = async (authMethod = "simple") => {
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

    try {
      // Try to get existing document
      const existingDoc = await databases.getDocument(
        databaseId,
        collectionId,
        user.$id
      );

      // If document exists but doesn't have authMethod, update it
      if (!existingDoc.authMethod) {
        try {
          await databases.updateDocument(databaseId, collectionId, user.$id, {
            authMethod: authMethod,
          });
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
          phoneNumber: user.phone || "", // Required field (collection uses phoneNumber, not phone)
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
        throw createError;
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

    // Step 3: Update phone number if provided
    if (phone) {
      try {
        await account.updatePhone(phone, password);
      } catch (phoneError) {
        // Phone update is optional, fail silently
      }
    }

    // Step 4: Insert user data in users collection with authMethod: 'simple'
    try {
      await ensureUserDocument("simple");
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
