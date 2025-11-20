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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { BsGoogle } from "react-icons/bs";
import { FiAlertCircle } from "react-icons/fi";
import InputText from "../components/InputText";
import { brandGold } from "../theme/colors";
import { login, loginWithGoogle } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { showErrorToast } from "../utils/toast";
import { buildUrl } from "../utils/url";

export default function LoginPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      showErrorToast(
        "",
        "You are already logged in. Redirecting to e-books...",
        { position: "top-center" }
      );
      navigate("/e-books");
    }
  }, [currentUser, navigate]);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Clear server error when user types
    if (serverError) setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formValues.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setServerError("");

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formValues.email, formValues.password);
      navigate("/e-books");
    } catch (err) {
      setServerError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const successUrl = buildUrl("/complete-profile");
    const failureUrl = buildUrl("/login");
    loginWithGoogle(successUrl, failureUrl);
  };

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
                Welcome Back
              </Heading>
              <Text color="gray.600">
                Sign in with your credentials to access your dashboard.
              </Text>
            </Stack>

            {serverError && (
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
                    {serverError}
                  </Text>
                </Box>
              </Box>
            )}

            <Stack spacing={4}>
              <InputText
                id="login-email"
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formValues.email}
                onChange={handleChange}
                error={errors.email}
                isRequired
              />
              <InputText
                id="login-password"
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formValues.password}
                onChange={handleChange}
                error={errors.password}
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
                    <Text>Signing in...</Text>
                  </Stack>
                ) : (
                  "Sign In"
                )}
              </Button>
              <Button
                leftIcon={<BsGoogle />}
                borderRadius="none"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                color="black"
                _hover={{ bg: "gray.50" }}
                type="button"
                onClick={handleGoogleLogin}
                isDisabled={isSubmitting}
              >
                Continue with Google
              </Button>
            </Stack>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Don&apos;t have an account?{" "}
              <Button
                as={RouterLink}
                to="/register"
                variant="link"
                color={brandGold}
                px={1}
              >
                Create one
              </Button>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
