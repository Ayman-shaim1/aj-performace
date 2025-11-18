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
import { FiAlertCircle } from "react-icons/fi";
import InputText from "../../components/InputText";
import { brandGold } from "../../theme/colors";
import { adminLogin } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { currentUser, checkAuth } = useAuth();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (currentUser) {
      // Check if user is admin (we'll verify this on dashboard)
      navigate("/admin/dashboard");
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
      await adminLogin(formValues.email, formValues.password);
      // Refresh authentication state after successful login
      await checkAuth();
      navigate("/admin/dashboard");
    } catch (err) {
      setServerError(err.message);
      setIsSubmitting(false);
    }
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
                Admin Login
              </Heading>
              <Text color="gray.600">
                Sign in with your administrator credentials to access the admin
                dashboard.
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
                id="admin-login-email"
                name="email"
                label="Email"
                type="email"
                placeholder="admin@example.com"
                value={formValues.email}
                onChange={handleChange}
                error={errors.email}
                isRequired
              />
              <InputText
                id="admin-login-password"
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
                  "Sign In as Admin"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
