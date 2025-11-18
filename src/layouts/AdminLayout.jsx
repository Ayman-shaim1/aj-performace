import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, VStack, Spinner, Text, HStack } from "@chakra-ui/react";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import { showErrorToast } from "../utils/toast";
import { brandGold } from "../theme/colors";
import { databases } from "../config/appwrite";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { currentUser, isLoading, checkAuth } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  // Verify user is admin and redirect if not authenticated or not admin
  useEffect(() => {
    const verifyAdmin = async () => {
      // Wait for auth check to complete before verifying
      if (isLoading) {
        return;
      }

      if (!currentUser) {
        navigate("/admin/login");
        return;
      }

      try {
        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionId = "users";

        if (!databaseId) {
          showErrorToast("Error", "Configuration error. Please contact support.");
          navigate("/admin/login");
          return;
        }

        // Get user document to check isAdmin
        const userDoc = await databases.getDocument(
          databaseId,
          collectionId,
          currentUser.$id
        );

        if (!userDoc.isAdmin) {
          showErrorToast("Access Denied", "You do not have administrator privileges.");
          await logout();
          checkAuth();
          navigate("/admin/login");
          return;
        }

        setIsVerifying(false);
      } catch (error) {
        showErrorToast("Error", "Failed to verify admin access.");
        navigate("/admin/login");
      }
    };

    verifyAdmin();
  }, [currentUser, isLoading, navigate, checkAuth]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color={brandGold} thickness="4px" />
          <Text color="gray.600">Verifying admin access...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <HStack align="stretch" h="100vh" overflow="hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <Box
        flex={1}
        overflowY="auto"
        bg="gray.50"
        ml={{ base: 0, md: 0 }}
        minH="100vh"
        transition="all 0.3s"
      >
        <Outlet />
      </Box>
    </HStack>
  );
}

