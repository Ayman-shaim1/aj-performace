import { Box, Container, Heading, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { FiBook, FiPlus } from "react-icons/fi";
import { brandGold } from "../../theme/colors";

export default function AdminEBooksPage() {
  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <HStack spacing={4}>
              <Box color={brandGold} fontSize="3xl">
                <FiBook />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="xl" color="gray.900">
                  E-Book Management
                </Heading>
                <Text color="gray.600">
                  Manage your e-book library and content
                </Text>
              </VStack>
            </HStack>
            <Button
              leftIcon={<FiPlus />}
              borderRadius="none"
              bg={brandGold}
              color="white"
              _hover={{ bg: "#B8941F", opacity: 0.9 }}
            >
              Add E-Book
            </Button>
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
                E-book management features coming soon...
              </Text>
              <Text color="gray.500">
                This page will allow you to:
              </Text>
              <Box as="ul" pl={6} color="gray.600">
                <li>Upload and manage e-books</li>
                <li>Edit e-book details and metadata</li>
                <li>Set pricing and availability</li>
                <li>View download statistics</li>
                <li>Organize e-books by categories</li>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

