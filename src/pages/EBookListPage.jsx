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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowLeft, FiLogIn } from "react-icons/fi";
import { useState } from "react";
import { brandGold } from "../theme/colors";
import InputText from "../components/InputText";
import { BsGoogle } from "react-icons/bs";
import { account } from "../config/appwrite";
import { BiLogIn } from "react-icons/bi";

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
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Open the modal with the chosen book context.
  const handleOpenModal = (book) => {
    setSelectedBook(book);
  };

  // Close the modal and reset the active book.
  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const loginWithGoogle = () => {
    account.createOAuth2Session(
      "google",
      "http://localhost:5173/e-books", // success redirect
      "http://localhost:5173/login" // failure redirect
    );
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginForm({ email: "", password: "" });
    setLoginError("");
  };

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    setIsSubmittingLogin(true);
    try {
      await account.createEmailPasswordSession(
        loginForm.email,
        loginForm.password
      );
      handleCloseLoginModal();
    } catch (error) {
      setLoginError(
        error?.message ||
          "Unable to sign in with these credentials. Please try again."
      );
    } finally {
      setIsSubmittingLogin(false);
    }
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
                  <Stack
                    key={book.title}
                    border="1px solid"
                    borderColor="gray.200"
                    bg="white"
                    borderRadius="none"
                    boxShadow="md"
                    overflow="hidden"
                    transition="transform 0.2s ease, box-shadow 0.2s ease"
                    _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
                    onClick={() => handleOpenModal(book)}
                    cursor="pointer"
                    role="group"
                  >
                    <Box position="relative">
                      {/* Cover art with hover animation */}
                      <Image
                        src={book.cover}
                        alt={book.title}
                        w="full"
                        h={{ base: "380px", md: "360px", lg: "360px" }}
                        objectFit="cover"
                        transition="transform 0.3s ease"
                        _groupHover={{ transform: "scale(1.02)" }}
                      />
                      <Badge
                        position="absolute"
                        top={4}
                        right={4}
                        bg="blackAlpha.800"
                        color="white"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        letterSpacing="widest"
                      >
                        ${book.price}
                      </Badge>
                      <Box
                        position="absolute"
                        left="50%"
                        transform="translateX(-50%)"
                        bottom={4}
                        width="calc(100% - 32px)"
                        bg="blackAlpha.200"
                        backdropFilter="blur(12px)"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        borderRadius="sm"
                        px={4}
                        py={3}
                        color="white"
                        textAlign="left"
                      >
                        {/* Category + title glass overlay */}
                        <Badge
                          bg={brandGold}
                          color="white"
                          borderRadius="none"
                          px={3}
                          py={1}
                          fontSize="xs"
                          textTransform="uppercase"
                          letterSpacing="widest"
                          mb={2}
                        >
                          {book.category}
                        </Badge>
                        <Heading size="sm" color="white">
                          {book.title}
                        </Heading>
                      </Box>
                    </Box>
                  </Stack>
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

                <Stack spacing={4}>
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
                    />
                  </FieldRoot>
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
                    />
                  </FieldRoot>
                  {loginError && (
                    <Text color="red.500" fontSize="sm">
                      {loginError}
                    </Text>
                  )}
                </Stack>

                <Stack spacing={3}>
                  <Button
                    type="submit"
                    borderRadius="none"
                    bg={brandGold}
                    color="white"
                    _hover={{ bg: brandGold, opacity: 0.85 }}
                    isLoading={isSubmittingLogin}
                    loadingText="Signing in"
                  >
                    Sign In
                  </Button>
                  <Button
                    leftIcon={<BsGoogle />}
                    borderRadius="none"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    color="black"
                    _hover={{ bg: "gray.50" }}
                    onClick={loginWithGoogle}
                    isDisabled={isSubmittingLogin}
                  >
                    Continue with Google
                  </Button>
                </Stack>
                <Stack spacing={1} textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    Having trouble?{" "}
                    <Button
                      variant="link"
                      color={brandGold}
                      onClick={handleCloseLoginModal}
                      px={1}
                    >
                      Contact support
                    </Button>
                  </Text>
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
