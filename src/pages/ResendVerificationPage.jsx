import { useState } from "react";
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
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { FiAlertCircle } from "react-icons/fi";
import InputText from "../components/InputText";
import { brandGold } from "../theme/colors";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { login, sendVerificationEmail } from "../services/authService";
import { buildUrl } from "../utils/url";

export default function ResendVerificationPage() {
  const navigate = useNavigate();
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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Login first to create a session
      await login(formValues.email, formValues.password);
      
      // Send verification email
      const verificationUrl = buildUrl("/verify-email");
      await sendVerificationEmail(verificationUrl);
      
      showSuccessToast(
        "",
        "Verification email sent! Please check your inbox.",
        { position: "top-center" }
      );
      
      // Redirect to email confirmation page
      navigate(`/email-confirmation?email=${encodeURIComponent(formValues.email)}`);
    } catch (err) {
      setServerError(err.message);
      showErrorToast(
        "",
        err.message || "Failed to resend verification email.",
        { position: "top-center" }
      );
    } finally {
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
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
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

            <Stack spacing={2} textAlign="center">
              <Heading size="xl" color="gray.900">
                Resend Verification Email
              </Heading>
              <Text color="gray.600">
                Enter your credentials to receive a new verification email.
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
                w="full"
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

            <VStack spacing={4} w="full">
              <InputText
                id="resend-email"
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
                id="resend-password"
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formValues.password}
                onChange={handleChange}
                error={errors.password}
                isRequired
              />
            </VStack>

            <VStack spacing={3} w="full">
              <Button
                type="submit"
                borderRadius="none"
                bg={brandGold}
                color="white"
                _hover={{ bg: brandGold, opacity: 0.85 }}
                isLoading={isSubmitting}
                loadingText="Sending..."
                w="full"
              >
                Send Verification Email
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
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

