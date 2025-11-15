import {
  Badge,
  Box,
  Button,
  chakra,
  CloseButton,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  HStack,
  FieldRoot,
  FieldLabel,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  DialogCloseTrigger,
  DialogPositioner,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft, FiLogIn, FiAlertCircle, FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";
import { brandGold } from "../theme/colors";
import InputText from "../components/InputText";
import EBookItem from "../components/EBookItem";
import { BsGoogle } from "react-icons/bs";
import {
  login,
  loginWithGoogle,
  ensureUserDocument,
  logout as logoutService,
} from "../services/authService";
import { account } from "../config/appwrite";
import { useAuth } from "../hooks/useAuth";
import { buildUrl } from "../utils/url";

// Static list of categories displayed in the sidebar filter summary.
const categories = [
  { label: "All", count: 5 },
  { label: "Performance Training", count: 2 },
  { label: "Nutrition", count: 2 },
  { label: "Mindset & Recovery", count: 1 },
];

// Data set powering the e-book grid cards and modal details.
const ebooks = [
  {
    title: "Explosive Athlete Blueprint",
    description:
      "A 12-week periodized plan blending force-velocity profiling, contrast training, and mobility resets for consistent power gains.",
    category: "Performance Training",
    level: "Advanced",
    length: "96 pages",
    cover:
      "https://images.pexels.com/photos/4761791/pexels-photo-4761791.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 39,
  },
  {
    title: "Fuel Like a Pro: Game-Day Nutrition",
    description:
      "Practical fueling roadmaps for training, game-day, and recovery windows with meal plans tailored to combat sports and field athletes.",
    category: "Nutrition",
    level: "Intermediate",
    length: "72 pages",
    cover:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 29,
  },
  {
    title: "High-Output Conditioning Systems",
    description:
      "Energy system protocols customized to your practice calendar with heart-rate guided tempo and sprint sessions.",
    category: "Performance Training",
    level: "Intermediate",
    length: "84 pages",
    cover:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    price: 32,
  },
  {
    title: "Recovery Rituals for Relentless Athletes",
    description:
      "Daily and weekly recovery stacks combining breathwork, sleep hygiene, and micro-mobility to keep your CNS primed.",
    category: "Mindset & Recovery",
    level: "All Levels",
    length: "58 pages",
    cover:
      "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80",
    price: 24,
  },
  {
    title: "Macro Mastery for Hybrid Competitors",
    description:
      "Macro periodization strategies, supplement timing, and hydration frameworks to support mixed training blocks.",
    category: "Nutrition",
    level: "All Levels",
    length: "68 pages",
    cover:
      "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=800&q=80",
    price: 27,
  },
];

export default function EBookListPage() {
  // Track which e-book is open in the detail modal (null = hidden).
  const [selectedBook, setSelectedBook] = useState(null);
  // Track the live search query (not wired yet—placeholder for future Appwrite integration).
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginServerError, setLoginServerError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { currentUser, checkAuth } = useAuth();

  // Check if user just logged in via OAuth and ensure user document exists
  // This page is the OAuth success redirect URL, so we ensure user document with authMethod: 'google'
  useEffect(() => {
    const checkAndCreateUserDocument = async (retryCount = 0) => {
      const maxRetries = 3;
      const delay = 500;

      // Add a delay to ensure OAuth session is fully established
      await new Promise((resolve) => setTimeout(resolve, delay));

      try {
        // Check if there's an active session
        const user = await account.get();

        if (user && user.$id) {
          // Update auth state via hook
          checkAuth();
          // Since this page is the OAuth success URL, ensure document exists with authMethod: 'google'
          // If document already exists with 'simple', it will keep that (won't overwrite)
          // If document doesn't exist, create it with 'google'
          try {
            await ensureUserDocument("google");
            return; // Success, exit
          } catch (error) {
            // Retry if we haven't exceeded max retries
            if (retryCount < maxRetries) {
              setTimeout(
                () => checkAndCreateUserDocument(retryCount + 1),
                delay * 2
              );
            }
          }
        } else {
          // User not found yet, retry if we haven't exceeded max retries
          if (retryCount < maxRetries) {
            setTimeout(
              () => checkAndCreateUserDocument(retryCount + 1),
              delay * 2
            );
          }
        }
      } catch (error) {
        // Error getting user, retry if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          setTimeout(
            () => checkAndCreateUserDocument(retryCount + 1),
            delay * 2
          );
        }
      }
    };

    checkAndCreateUserDocument();
  }, []);

  // Open the modal with the chosen book context.
  const handleOpenModal = (book) => {
    setSelectedBook(book);
  };

  // Close the modal and reset the active book.
  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginForm({ email: "", password: "" });
    setLoginErrors({});
    setLoginServerError("");
  };

  const handleGoogleLogin = () => {
    const successUrl = buildUrl("/e-books");
    const failureUrl = buildUrl("/login");
    loginWithGoogle(successUrl, failureUrl);
  };

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    // Clear field error when user types
    if (loginErrors[name]) {
      setLoginErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Clear server error when user types
    if (loginServerError) setLoginServerError("");
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginForm.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!loginForm.password) {
      newErrors.password = "Password is required";
    }
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginErrors({});
    setLoginServerError("");

    // Client-side validation
    if (!validateLoginForm()) {
      return;
    }

    // Set loading state immediately
    setIsSubmittingLogin(true);
    try {
      await login(loginForm.email, loginForm.password);
      // Refresh user state after successful login
      checkAuth();
      handleCloseLoginModal();
      // Note: Don't set isSubmittingLogin to false here since modal is closing
    } catch (error) {
      setLoginServerError(error.message);
      setIsSubmittingLogin(false); // Stop loading on error
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutService();
      // Refresh auth state after logout
      checkAuth();
    } catch (error) {
      // Handle logout error silently or show notification
      setIsLoggingOut(false); // Stop loading on error
    }
    // Note: Don't set isLoggingOut to false here on success since user state will change
  };

  return (
    <Box as="section" bg="white" py={{ base: 12, md: 20 }}>
      <Container maxW="8xl" px={{ base: 1, md: 10, lg: 5 }}>
        {/* Secondary navigation back to the landing page */}
        <Flex justify="space-between" align="center">
          <Button
            as={RouterLink}
            to="/"
            alignSelf={{ base: "stretch", md: "flex-start" }}
            borderRadius="none"
            bg="gray.900"
            color="white"
            _hover={{ bg: "gray.700" }}
            size="sm"
            px={5}
            mb={10}
          >
            <FiArrowLeft color="white" /> Back to Home
          </Button>

          {currentUser ? (
            <Flex align="center" gap={3} mb={10}>
              <Text
                fontSize="md"
                fontWeight="semibold"
                color="gray.500"
                px={5}
                py={2}
                textTransform="uppercase"
              >
                Welcome, {currentUser.name || currentUser.email} !
              </Text>
              <Button
                borderRadius="none"
                bg="gray.900"
                color="white"
                size="sm"
                px={4}
                _hover={{ bg: "gray.700" }}
                onClick={handleLogout}
                isDisabled={isLoggingOut}
                position="relative"
              >
                {isLoggingOut ? (
                  <Stack direction="row" spacing={2} align="center">
                    <Spinner size="sm" color="white" thickness="2px" />
                    <Text>Logging out...</Text>
                  </Stack>
                ) : (
                  <>
                    <FiLogOut style={{ marginRight: "8px" }} />
                    Logout
                  </>
                )}
              </Button>
            </Flex>
          ) : (
            <Button
              borderRadius="none"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              px={5}
              mb={10}
              color="black"
              _hover={{ bg: "gray.100" }}
              onClick={handleOpenLoginModal}
            >
              <FiLogIn color="black" /> Authenticate
            </Button>
          )}
        </Flex>
        <Stack spacing={{ base: 10, md: 14 }}>
          <Stack spacing={3} textAlign={{ base: "center", md: "left" }}>
            {/* Page heading with adaptive underline accent */}
            <Heading size={{ base: "2xl", md: "3xl" }} letterSpacing="tight">
              <chakra.span
                display="inline-flex"
                flexDirection="column"
                alignItems={{ base: "center", md: "flex-start" }}
              >
                AJ Performance E-Book Library
                <Box height="3px" width="100%" bg={brandGold} mt={2} />
              </chakra.span>
            </Heading>
            <Text
              color="gray.600"
              maxW={{ base: "full", md: "3xl" }}
              fontSize={{ base: "md", md: "lg" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Curated playbooks written by Coach Ayoub to help you train,
              recover, and fuel like an elite performer. Pick the category that
              matches your current season and keep stacking wins.
            </Text>
          </Stack>

          {/* Lightweight banner nudging users to interact with cards */}
          <Box
            bg="gray.100"
            color="gray.600"
            borderRadius="none"
            py={{ base: 3, md: 4 }}
            px={{ base: 4, md: 6 }}
            textAlign="center"
            fontWeight="semibold"
            letterSpacing="wide"
          >
            Tap any e-book card to explore details and purchase.
          </Box>

          {/* Search input placeholder (functionality to be added later) */}
          <Flex justify="end" w="full">
            <InputText
              id="ebook-search"
              label="Search E-Books"
              placeholder="Search by title or category"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Flex>

          <Grid
            templateColumns={{ base: "1fr", lg: "280px 1fr" }}
            gap={{ base: 10, lg: 14 }}
            alignItems="start"
          >
            {/* Left column: static category summary */}
            <GridItem>
              <Stack
                spacing={4}
                border="1px solid"
                borderColor="gray.200"
                p={{ base: 6, md: 8 }}
                bg="white"
                borderRadius="none"
                position="sticky"
                top={{ base: "unset", lg: "6rem" }}
              >
                <Heading
                  size="md"
                  letterSpacing="wide"
                  textTransform="uppercase"
                >
                  Categories
                </Heading>
                <Box
                  height="1px"
                  w="full"
                  bgGradient="linear(to-r, gray.100, gray.200, gray.100)"
                />
                <VStack spacing={4} align="stretch">
                  {categories.map((category) => (
                    <Flex
                      key={category.label}
                      justify="space-between"
                      align="center"
                      border="1px solid"
                      borderColor="gray.100"
                      px={4}
                      py={3}
                      borderRadius="none"
                      transition="all 0.2s ease"
                      _hover={{
                        borderColor: brandGold,
                        transform: "translateX(4px)",
                        bg: "gray.50",
                      }}
                    >
                      <Text fontWeight="semibold" color="gray.700">
                        {category.label}
                      </Text>
                      <Badge
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        colorScheme="yellow"
                      >
                        {category.count}
                      </Badge>
                    </Flex>
                  ))}
                </VStack>
              </Stack>
            </GridItem>

            {/* Right column: responsive grid of e-book cards */}
            <GridItem>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={{ base: 8, md: 10, lg: 12 }}
                rowGap={{ base: 2, md: 2, lg: 2 }}
                columnGap={{ base: 2, md: 2, lg: 2 }}
              >
                {ebooks.map((book) => (
                  <EBookItem
                    key={book.title}
                    book={book}
                    onClick={() => handleOpenModal(book)}
                  />
                ))}
              </SimpleGrid>

              {/* Static pagination placeholder */}
              <HStack
                justify="center"
                spacing={6}
                pt={8}
                fontWeight="semibold"
                color="gray.600"
              >
                <Button
                  borderRadius="none"
                  variant="outline"
                  colorScheme="gray"
                  isDisabled
                >
                  Previous
                </Button>
                <Text>Page 1 of 3</Text>
                <Button
                  borderRadius="none"
                  variant="outline"
                  colorScheme="gray"
                  isDisabled
                >
                  Next
                </Button>
              </HStack>
            </GridItem>
          </Grid>
        </Stack>
      </Container>

      {!currentUser && (
        <DialogRoot
          open={isLoginModalOpen}
          onOpenChange={({ open }) => {
            if (!open) {
              handleCloseLoginModal();
            }
          }}
        >
          <DialogBackdrop bg="blackAlpha.700" />
          <DialogPositioner
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
          >
            <DialogContent
              bg="white"
              borderRadius="none"
              maxW="lg"
              w="full"
              position="relative"
            >
              <DialogCloseTrigger asChild>
                <CloseButton
                  borderRadius="full"
                  position="absolute"
                  top={4}
                  right={4}
                />
              </DialogCloseTrigger>
              <DialogBody p={{ base: 6, md: 8 }}>
                <Stack spacing={6} as="form" onSubmit={handleLoginSubmit}>
                  <Stack spacing={3} textAlign="center">
                    <Heading size="lg" color="gray.900">
                      Authenticate to Continue
                    </Heading>
                    <Text color="gray.600">
                      Sign in with your credentials to manage your e-book
                      purchases.
                    </Text>
                  </Stack>

                  {loginServerError && (
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
                          {loginServerError}
                        </Text>
                      </Box>
                    </Box>
                  )}

                  <Stack spacing={4}>
                    <Box>
                      <FieldRoot required>
                        <FieldLabel
                          fontSize="sm"
                          textTransform="uppercase"
                          letterSpacing="widest"
                        >
                          Email
                        </FieldLabel>
                        <InputText
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={handleLoginInputChange}
                          error={loginErrors.email}
                        />
                      </FieldRoot>
                    </Box>
                    <Box>
                      <FieldRoot required>
                        <FieldLabel
                          fontSize="sm"
                          textTransform="uppercase"
                          letterSpacing="widest"
                        >
                          Password
                        </FieldLabel>
                        <InputText
                          id="login-password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={handleLoginInputChange}
                          error={loginErrors.password}
                        />
                      </FieldRoot>
                    </Box>
                  </Stack>

                  <Stack spacing={3}>
                    <Button
                      type="submit"
                      borderRadius="none"
                      bg={brandGold}
                      color="white"
                      _hover={{ bg: brandGold, opacity: 0.85 }}
                      isDisabled={isSubmittingLogin}
                      position="relative"
                    >
                      {isSubmittingLogin ? (
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
                      onClick={handleGoogleLogin}
                      isDisabled={isSubmittingLogin}
                    >
                      Continue with Google
                    </Button>
                  </Stack>
                  <Stack spacing={1} textAlign="center">
                    <Text fontSize="sm" color="gray.500">
                      Don&apos;t have an account?{" "}
                      <Button
                        as={RouterLink}
                        to="/register"
                        variant="link"
                        color={brandGold}
                        onClick={handleCloseLoginModal}
                        px={1}
                      >
                        Create one
                      </Button>
                    </Text>
                  </Stack>
                </Stack>
              </DialogBody>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      )}

      <DialogRoot
        open={Boolean(selectedBook)}
        onOpenChange={({ open }) => {
          if (!open) {
            handleCloseModal();
          }
        }}
      >
        <DialogBackdrop bg="blackAlpha.700" />
        <DialogPositioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
        >
          <DialogContent
            bg="white"
            borderRadius="none"
            maxW="xl"
            w="full"
            position="relative"
          >
            <DialogCloseTrigger asChild>
              <CloseButton
                borderRadius="full"
                position="absolute"
                top={4}
                right={4}
              />
            </DialogCloseTrigger>
            <DialogBody p={{ base: 6, md: 8 }}>
              {selectedBook && (
                <Stack spacing={5}>
                  <Stack spacing={2}>
                    <Text
                      fontSize="sm"
                      textTransform="uppercase"
                      color="gray.500"
                    >
                      AJ Performance · Coach Ayoub
                    </Text>
                    <Heading size="lg" color="gray.900">
                      {selectedBook.title}
                    </Heading>
                    <Badge
                      alignSelf="flex-start"
                      bg={brandGold}
                      color="white"
                      borderRadius="none"
                      px={3}
                      py={1}
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="widest"
                    >
                      {selectedBook.category}
                    </Badge>
                  </Stack>
                  <Image
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    w="full"
                    h={{ base: "220px", md: "260px" }}
                    objectFit="cover"
                    border="1px solid"
                    borderColor="gray.200"
                  />
                  <Text color="gray.600" textAlign="justify">
                    {selectedBook.description}
                  </Text>
                  <Flex
                    gap={4}
                    wrap="wrap"
                    fontSize="xs"
                    letterSpacing="widest"
                    textTransform="uppercase"
                    color="gray.600"
                  >
                    <Text fontWeight="semibold">
                      Level: {selectedBook.level}
                    </Text>
                    <Text>|</Text>
                    <Text fontWeight="semibold">
                      Length: {selectedBook.length}
                    </Text>
                    <Text>|</Text>
                    <Text fontWeight="semibold">Author: Coach Ayoub</Text>
                  </Flex>
                  <Flex
                    w="full"
                    align="center"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={4}
                  >
                    <Text fontWeight="bold" fontSize="xl" color="gray.900">
                      ${selectedBook.price}
                    </Text>
                    <Button
                      borderRadius="none"
                      bg={brandGold}
                      color="white"
                      _hover={{ bg: brandGold, opacity: 0.85 }}
                      size="lg"
                    >
                      Buy This E-Book
                    </Button>
                  </Flex>
                </Stack>
              )}
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}
