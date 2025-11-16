import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { brandGold } from "../theme/colors";
import { verifyEmail } from "../services/authService";
import { showErrorToast } from "../utils/toast";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      if (!userId || !secret) {
        setStatus("error");
        showErrorToast(
          "",
          "Invalid verification link. Missing required parameters.",
          { position: "top-center" }
        );
        return;
      }

      // Set status to verifying (shows loader)
      setStatus("verifying");

      try {
        await verifyEmail(userId, secret);
        setStatus("success");
        // Don't show toast here, redirect will show it on login page if needed
        // Redirect to login after 1 second
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        setStatus("error");
        showErrorToast(
          "",
          error.message ||
            "Email verification failed. The link may be invalid or expired.",
          { position: "top-center" }
        );
      }
    };

    verify();
  }, [userId, secret, navigate]);

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
            {status === "verifying" && (
              <>
                <Spinner size="xl" color={brandGold} thickness="4px" />
                <Stack spacing={3}>
                  <Heading size="xl" color="gray.900">
                    Verifying Your Email
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    Please wait while we verify your email address...
                  </Text>
                </Stack>
              </>
            )}

            {status === "success" && (
              <>
                <Box
                  bg="green.100"
                  borderRadius="full"
                  p={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiCheckCircle size={48} color="#38A169" />
                </Box>
                <Stack spacing={3}>
                  <Heading size="xl" color="gray.900">
                    Email Verified!
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    Your email has been successfully verified. You will be
                    redirected to the login page shortly.
                  </Text>
                </Stack>
                <Button
                  as={RouterLink}
                  to="/login"
                  borderRadius="none"
                  bg={brandGold}
                  color="white"
                  _hover={{ bg: brandGold, opacity: 0.85 }}
                  leftIcon={<FiArrowLeft />}
                >
                  Go to Login
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <Box
                  bg="red.100"
                  borderRadius="full"
                  p={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiXCircle size={48} color="#E53E3E" />
                </Box>
                <Stack spacing={3}>
                  <Heading size="xl" color="gray.900">
                    Verification Failed
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    The verification link is invalid or has expired. Please
                    request a new verification email.
                  </Text>
                </Stack>
                <VStack spacing={3} w="full">
                  <Button
                    as={RouterLink}
                    to="/register"
                    borderRadius="none"
                    bg={brandGold}
                    color="white"
                    _hover={{ bg: brandGold, opacity: 0.85 }}
                    w="full"
                  >
                    Register Again
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
              </>
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
