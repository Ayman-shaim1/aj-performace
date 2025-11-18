import { Box, Container, Heading, Text, VStack, SimpleGrid, HStack } from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";
import { brandGold } from "../../theme/colors";

export default function AdminUsersPage() {
  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Box color={brandGold} fontSize="3xl">
              <FiUsers />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="gray.900">
                User Management
              </Heading>
              <Text color="gray.600">
                Manage users, permissions, and access controls
              </Text>
            </VStack>
          </HStack>

          {/* Content */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            p={8}
            bg="white"
          >
            <VStack spacing={4} align="start">
              <Text color="gray.600" fontSize="lg">
                User management features coming soon...
              </Text>
              <Text color="gray.500">
                This page will allow you to:
              </Text>
              <Box as="ul" pl={6} color="gray.600">
                <li>View all registered users</li>
                <li>Edit user information</li>
                <li>Manage user permissions</li>
                <li>Activate or deactivate accounts</li>
                <li>View user activity logs</li>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

