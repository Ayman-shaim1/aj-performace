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
import InputText from "../components/InputText";
import { brandGold } from "../theme/colors";
import { BsGoogle } from "react-icons/bs";
import { FiAlertCircle } from "react-icons/fi";
import { register, loginWithGoogle } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { buildUrl } from "../utils/url";

export default function RegisterPage() {
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
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
    if (!formValues.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formValues.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    // Set loading state immediately
    setIsSubmitting(true);
    try {
      await register({
        email: formValues.email,
        password: formValues.password,
        fullName: formValues.fullName,
        phone: formValues.phone || undefined,
      });
      // Redirect to email confirmation page after successful registration
      navigate(`/email-confirmation?email=${encodeURIComponent(formValues.email)}`);
      // Note: Don't set isSubmitting to false here since we're navigating
    } catch (err) {
      setServerError(err.message);
      setIsSubmitting(false); // Stop loading on error
    }
  };

  const handleGoogleLogin = () => {
    const successUrl = buildUrl("/e-books");
    const failureUrl = buildUrl("/register");
    // Debug: Log URLs to verify they match Appwrite configuration
    console.log("OAuth Success URL:", successUrl);
    console.log("OAuth Failure URL:", failureUrl);
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
                Create Your Account
              </Heading>
              <Text color="gray.600">
                Sign up to unlock personalized training programs and more.
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
                id="register-full-name"
                name="fullName"
                label="Full Name"
                placeholder="Your name"
                value={formValues.fullName}
                onChange={handleChange}
                error={errors.fullName}
                isRequired
              />
              <InputText
                id="register-email"
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
                id="register-phone"
                name="phone"
                label="Phone Number"
                placeholder="+212 600 000 000"
                value={formValues.phone}
                onChange={handleChange}
                error={errors.phone}
                isRequired
              />
              <InputText
                id="register-password"
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                value={formValues.password}
                onChange={handleChange}
                error={errors.password}
                isRequired
              />
              <InputText
                id="register-confirm-password"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
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
                    <Text>Creating account...</Text>
                  </Stack>
                ) : (
                  "Create Account"
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
              Already have an account?{" "}
              <Button
                as={RouterLink}
                to="/login"
                variant="link"
                color={brandGold}
                px={1}
              >
                Sign in
              </Button>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
