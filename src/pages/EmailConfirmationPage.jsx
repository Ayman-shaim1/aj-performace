import { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { brandGold } from "../theme/colors";
import { useAuth } from "../hooks/useAuth";
import { showErrorToast } from "../utils/toast";

export default function EmailConfirmationPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  // Redirect if already authenticated and verified
  useEffect(() => {
    if (currentUser?.emailVerification) {
      showErrorToast(
        "",
        "Your email is already verified. Redirecting...",
        { position: "top-center" }
      );
      navigate("/e-books");
    }
  }, [currentUser, navigate]);

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
              <FiMail size={48} color={brandGold} />
            </Box>

            <Stack spacing={3}>
              <Heading size="xl" color="gray.900">
                Check Your Email
              </Heading>
              <Text color="gray.600" fontSize="md">
                We've sent a verification email to{" "}
                <Text as="span" fontWeight="semibold" color="gray.900">
                  {email || "your email address"}
                </Text>
                . Please click the link in the email to verify your account.
              </Text>
            </Stack>

            <VStack spacing={4} w="full" pt={4}>
              <Button
                as={RouterLink}
                to="/resend-verification"
                borderRadius="none"
                bg={brandGold}
                color="white"
                _hover={{ bg: brandGold, opacity: 0.85 }}
                w="full"
              >
                Resend Verification Email
              </Button>

              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                color="gray.600"
                _hover={{ bg: "gray.50" }}
                leftIcon={<FiArrowLeft />}
              >
                Back to Login
              </Button>
            </VStack>

            <Text fontSize="sm" color="gray.500" pt={4}>
              Didn't receive the email? Check your spam folder or{" "}
              <Button
                as={RouterLink}
                to="/register"
                variant="link"
                color={brandGold}
                px={1}
              >
                try registering again
              </Button>
              .
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

