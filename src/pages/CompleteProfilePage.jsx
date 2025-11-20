import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import InputText from "../components/InputText";
import { brandGold } from "../theme/colors";
import { FiAlertCircle } from "react-icons/fi";
import { ensureUserDocument, updateAccountPhone } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { account, databases } from "../config/appwrite";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { currentUser, checkAuth } = useAuth();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [needsPhone, setNeedsPhone] = useState(false);

  // Check if user needs to complete profile
  useEffect(() => {
    const checkProfile = async () => {
      try {
        // First, try to get user directly from account (in case currentUser is not loaded yet)
        let user = currentUser;
        if (!user) {
          try {
            user = await account.get();
          } catch (accountError) {
            // User not authenticated, redirect to login
            navigate("/login");
            return;
          }
        }

        if (!user || !user.$id) {
          navigate("/login");
          return;
        }

        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionId = "users";

        if (!databaseId) {
          // No database config, skip check
          navigate("/e-books");
          return;
        }

        try {
          // Get user document
          const userDoc = await databases.getDocument(
            databaseId,
            collectionId,
            user.$id
          );

          // Check if phone number is missing or empty
          if (!userDoc.phoneNumber || userDoc.phoneNumber.trim() === "") {
            setNeedsPhone(true);
          } else {
            // Phone number exists, redirect to e-books
            navigate("/e-books");
          }
        } catch (error) {
          // Document doesn't exist, create it first
          try {
            // Determine authMethod - check if user has email verification (likely Google OAuth)
            const authMethod = user.emailVerification ? "google" : "simple";
            await ensureUserDocument(authMethod);
            
            // Refresh auth state
            await checkAuth();
            
            // Check again after creation
            const userDoc = await databases.getDocument(
              databaseId,
              collectionId,
              user.$id
            );
            if (!userDoc.phoneNumber || userDoc.phoneNumber.trim() === "") {
              setNeedsPhone(true);
            } else {
              navigate("/e-books");
            }
          } catch (createError) {
            console.error("Error creating user document:", createError);
            // Error creating document, still show form to allow user to complete profile
            setNeedsPhone(true);
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        // On error, still show form to allow user to complete profile
        setNeedsPhone(true);
      } finally {
        setIsChecking(false);
      }
    };

    // Add a small delay to ensure OAuth session is fully established
    const timer = setTimeout(() => {
      checkProfile();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, navigate, checkAuth]);

  const handleChange = (event) => {
    const { value } = event.target;
    setPhone(value);
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validation
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    // Validate phone format: must start with + and have max 15 digits
    let phoneClean = phone.trim();
    if (!phoneClean.startsWith("+")) {
      setError("Phone number must start with '+'");
      return;
    }
    // Count digits (excluding the +)
    const digitsOnly = phoneClean.substring(1).replace(/\D/g, "");
    if (digitsOnly.length === 0) {
      setError("Phone number must contain digits");
      return;
    }
    if (digitsOnly.length > 15) {
      setError("Phone number must have maximum 15 digits");
      return;
    }
    // Clean phone number: keep only + and digits, limit to 15 digits
    phoneClean = "+" + digitsOnly.substring(0, 15);

    setIsSubmitting(true);
    try {
      const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const collectionId = "users";

      if (!databaseId) {
        throw new Error("Database configuration error");
      }

      // Get user directly if currentUser is not available
      let user = currentUser;
      if (!user) {
        try {
          user = await account.get();
        } catch (accountError) {
          throw new Error("You must be logged in to complete your profile.");
        }
      }

      if (!user || !user.$id) {
        throw new Error("User not found. Please try logging in again.");
      }

      // Get existing document to determine authMethod
      let authMethod = "google"; // Default for new Google OAuth users
      try {
        const existingDoc = await databases.getDocument(
          databaseId,
          collectionId,
          user.$id
        );
        if (existingDoc.authMethod) {
          authMethod = existingDoc.authMethod;
        }
      } catch (error) {
        // Document doesn't exist yet, determine authMethod from user
        // Google OAuth users typically have emailVerification = true
        authMethod = user.emailVerification ? "google" : "simple";
      }

      // Update user document with phone number in database collection (this always works)
      await ensureUserDocument(authMethod, phoneClean);

      // Note: For OAuth users (Google), we cannot update phone in Appwrite account
      // because account.updatePhone() requires a password, which OAuth users don't have.
      // The phone number is stored in the database collection and can be accessed from there.
      // For email/password users, the phone would also need to be updated separately
      // with account.updatePhone(phone, password) if they want it in their Appwrite account.

      // Verify the phone number was saved in database
      const updatedDoc = await databases.getDocument(
        databaseId,
        collectionId,
        user.$id
      );
      
      if (!updatedDoc.phoneNumber || updatedDoc.phoneNumber.trim() === "") {
        throw new Error("Phone number was not saved. Please try again.");
      }

      showSuccessToast("", "Profile completed successfully!", {
        position: "top-center",
      });

      // Refresh auth state
      await checkAuth();

      // Redirect to e-books
      navigate("/e-books");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <Box
        bg="gray.100"
        py={{ base: 16, md: 24 }}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="lg">
          <Stack spacing={4} align="center">
            <Spinner size="xl" color={brandGold} thickness="4px" />
            <Text color="gray.600">Checking your profile...</Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (!needsPhone) {
    return null; // Will redirect in useEffect
  }

  return (
    <Box
      bg="gray.100"
      py={{ base: 16, md: 24 }}
      minH="100vh"
      display="flex"
      alignItems="center"
    >
      <Container maxW="lg">
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="none"
          p={{ base: 6, md: 10 }}
        >
          <Stack spacing={6} as="form" onSubmit={handleSubmit}>
            <Stack spacing={2} textAlign="center">
              <Heading size="xl" color="gray.900">
                Complete Your Profile
              </Heading>
              <Text color="gray.600">
                Please provide your phone number to complete your registration.
              </Text>
            </Stack>

            {error && (
              <Box
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="none"
                p={4}
                display="flex"
                alignItems="flex-start"
                gap={3}
              >
                <Box color="red.500" fontSize="xl" mt={0.5}>
                  <FiAlertCircle />
                </Box>
                <Box flex="1">
                  <Text fontWeight="bold" color="red.800" mb={1}>
                    Error!
                  </Text>
                  <Text color="red.700" fontSize="sm">
                    {error}
                  </Text>
                </Box>
              </Box>
            )}

            <Stack spacing={4}>
              <InputText
                id="complete-profile-phone"
                name="phone"
                label="Phone Number"
                placeholder="+212 600 000 000"
                value={phone}
                onChange={handleChange}
                error={error && !phone.trim() ? error : ""}
                isRequired
              />
            </Stack>

            <Stack spacing={3}>
              <Button
                type="submit"
                borderRadius="none"
                bg={brandGold}
                color="white"
                _hover={{ bg: brandGold, opacity: 0.85 }}
                isDisabled={isSubmitting}
                position="relative"
              >
                {isSubmitting ? (
                  <Stack direction="row" spacing={2} align="center">
                    <Spinner size="sm" color="white" thickness="2px" />
                    <Text>Updating profile...</Text>
                  </Stack>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

