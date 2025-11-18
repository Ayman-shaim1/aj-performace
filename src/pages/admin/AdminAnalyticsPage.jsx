import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
import { FiBarChart2, FiTrendingUp, FiEye, FiDownload } from "react-icons/fi";
import { brandGold } from "../../theme/colors";

export default function AdminAnalyticsPage() {
  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Box color={brandGold} fontSize="3xl">
              <FiBarChart2 />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="gray.900">
                Analytics & Reports
              </Heading>
              <Text color="gray.600">
                View insights and performance metrics
              </Text>
            </VStack>
          </HStack>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box borderRadius="none" border="1px solid" borderColor="gray.200" p={6} bg="white">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiTrendingUp />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Revenue
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
                    <FiEye />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Page Views
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
                    <FiDownload />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Downloads
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
                    Active Users
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
                Analytics dashboard coming soon...
              </Text>
              <Text color="gray.500">
                This page will provide:
              </Text>
              <Box as="ul" pl={6} color="gray.600">
                <li>Revenue and sales reports</li>
                <li>User engagement metrics</li>
                <li>E-book download statistics</li>
                <li>Traffic and page view analytics</li>
                <li>Exportable reports and data</li>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

