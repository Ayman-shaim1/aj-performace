import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import InputText from "../components/InputText";
import { brandGold } from "../theme/colors";
import { BsGoogle } from "react-icons/bs";

export default function RegisterPage() {
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Registration logic will be integrated later.
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

            <Stack spacing={4}>
              <InputText
                id="register-full-name"
                name="fullName"
                label="Full Name"
                placeholder="Your name"
                value={formValues.fullName}
                onChange={handleChange}
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
                isRequired
              />
              <InputText
                id="register-phone"
                name="phone"
                label="Phone Number"
                placeholder="+212 600 000 000"
                value={formValues.phone}
                onChange={handleChange}
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
              >
                Create Account
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
