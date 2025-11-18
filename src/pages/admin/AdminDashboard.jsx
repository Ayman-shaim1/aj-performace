import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiUsers, FiBook, FiBarChart2, FiSettings } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { brandGold } from "../../theme/colors";

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="gray.900">
              Dashboard
            </Heading>
            <Text color="gray.600">
              Welcome back, {currentUser?.name || currentUser?.email || "Admin"}
            </Text>
          </VStack>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box borderRadius="none" border="1px solid" borderColor="gray.200" p={6} bg="white">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiUsers />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Users
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  --
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Coming soon
                </Text>
              </VStack>
            </Box>

            <Box borderRadius="none" border="1px solid" borderColor="gray.200" p={6} bg="white">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiBook />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    E-Books
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  --
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Coming soon
                </Text>
              </VStack>
            </Box>

            <Box borderRadius="none" border="1px solid" borderColor="gray.200" p={6} bg="white">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiBarChart2 />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Analytics
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  --
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Coming soon
                </Text>
              </VStack>
            </Box>

            <Box borderRadius="none" border="1px solid" borderColor="gray.200" p={6} bg="white">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiSettings />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Settings
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  --
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Coming soon
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Main Content Area */}
          <Box borderRadius="none" border="1px solid" borderColor="gray.200" p={6} bg="white">
            <VStack spacing={4} align="start">
              <Heading size="lg" color="gray.900">
                Dashboard Overview
              </Heading>
              <Text color="gray.600">
                This is a static dashboard page. The dashboard functionality will be
                developed later. For now, this page serves as a placeholder that
                administrators are redirected to after successful login.
              </Text>
              <Text color="gray.600">
                You can use this page to add admin features such as:
              </Text>
              <Box as="ul" pl={6} color="gray.600">
                <li>User management</li>
                <li>E-book management</li>
                <li>Analytics and reports</li>
                <li>System settings</li>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

