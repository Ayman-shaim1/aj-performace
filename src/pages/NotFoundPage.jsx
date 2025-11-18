import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiHome, FiArrowLeft } from "react-icons/fi";
import { brandGold } from "../theme/colors";

export default function NotFoundPage() {
  const navigate = useNavigate();

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
          <VStack spacing={6} align="center" textAlign="center">
            <Box
              bg={`${brandGold}20`}
              borderRadius="full"
              p={6}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiAlertCircle size={48} color={brandGold} />
            </Box>

            <Stack spacing={3}>
              <Heading size="2xl" color="gray.900">
                404
              </Heading>
              <Heading size="lg" color="gray.900">
                Page Not Found
              </Heading>
              <Text color="gray.600" fontSize="md">
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
              </Text>
            </Stack>

            <VStack spacing={4} w="full" pt={4}>
              <Button
                as={RouterLink}
                to="/"
                borderRadius="none"
                bg={brandGold}
                color="white"
                _hover={{ bg: brandGold, opacity: 0.85 }}
                w="full"
                leftIcon={<FiHome />}
              >
                Go to Homepage
              </Button>

              <Button
                variant="ghost"
                color="gray.600"
                _hover={{ bg: "gray.50" }}
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </VStack>

            <Text fontSize="sm" color="gray.500" pt={4}>
              Need help?{" "}
              <Button
                as={RouterLink}
                to="/"
                variant="link"
                color={brandGold}
                px={1}
              >
                Contact us
              </Button>
              .
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

