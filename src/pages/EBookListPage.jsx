import {
  Badge,
  Box,
  Button,
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
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { brandGold } from "../theme/colors";

const categories = [
  { label: "All", count: 5 },
  { label: "Performance Training", count: 2 },
  { label: "Nutrition", count: 2 },
  { label: "Mindset & Recovery", count: 1 },
];

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
  const [selectedBook, setSelectedBook] = useState(null);

  const handleOpenModal = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <Box as="section" bg="white" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl" px={{ base: 6, md: 0 }}>
        <Stack spacing={{ base: 10, md: 14 }}>
          <Stack spacing={3} textAlign={{ base: "center", md: "left" }}>
            <Heading size={{ base: "2xl", md: "3xl" }} letterSpacing="tight">
              AJ Performance E-Book Library
              <Box
                width={{ base: "full", md: "32" }}
                height="3px"
                display="block"
                bg={brandGold}
                mt={2}
              />
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

          <Grid
            templateColumns={{ base: "1fr", lg: "280px 1fr" }}
            gap={{ base: 10, lg: 14 }}
            alignItems="start"
          >
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

            <GridItem>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                columnGap={{ base: 6, md: 8, lg: 10 }}
                rowGap={{ base: 8, md: 10, lg: 12 }}
              >
                {ebooks.map((book) => (
                  <Stack
                    key={book.title}
                    h="100%"
                    border="1px solid"
                    borderColor="gray.200"
                    bg="white"
                    borderRadius="none"
                    boxShadow="lg"
                    spacing={0}
                    transition="transform 0.2s ease, box-shadow 0.2s ease"
                    _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
                    cursor="pointer"
                    onClick={() => handleOpenModal(book)}
                    overflow="hidden"
                    position="relative"
                    role="group"
                  >
                    <Box position="relative" overflow="hidden">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        w="full"
                        h={{ base: "280px", md: "300px", lg: "320px" }}
                        objectFit="cover"
                        transition="transform 0.3s ease"
                        _groupHover={{ transform: "scale(1.05)" }}
                      />
                      <Badge
                        position="absolute"
                        top={4}
                        left={4}
                        bg="blackAlpha.700"
                        color="white"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                      >
                        ${book.price}
                      </Badge>
                    </Box>

                    <Box
                      position="absolute"
                      inset={0}
                      bgGradient="linear(to-t, blackAlpha.700, transparent 55%)"
                      color="white"
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      p={{ base: 5, md: 6 }}
                      pointerEvents="none"
                      opacity={0}
                      transform="translateY(12px)"
                      transition="opacity 0.2s ease, transform 0.2s ease"
                      _groupHover={{ opacity: 1, transform: "translateY(0)" }}
                    >
                      <Stack spacing={2} align="flex-start">
                        <Heading size="md" color="white">
                          {book.title}
                        </Heading>
                        <Badge
                          bg={brandGold}
                          color="white"
                          borderRadius="none"
                          px={3}
                          py={1}
                          fontSize="xs"
                          textTransform="uppercase"
                          letterSpacing="widest"
                        >
                          {book.category}
                        </Badge>
                      </Stack>
                    </Box>
                  </Stack>
                ))}
              </SimpleGrid>
            </GridItem>
          </Grid>
        </Stack>
      </Container>

      <AnimatePresence>
        {selectedBook && (
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            position="fixed"
            inset={0}
            bg="blackAlpha.700"
            zIndex={50}
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
            onClick={handleCloseModal}
          >
            <Box
              as={motion.div}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              bg="white"
              borderRadius="none"
              maxW="xl"
              w="full"
              p={{ base: 6, md: 8 }}
              position="relative"
              onClick={(event) => event.stopPropagation()}
            >
              <CloseButton
                position="absolute"
                top={4}
                right={4}
                onClick={handleCloseModal}
                borderRadius="full"
              />
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
                  <Text fontWeight="semibold">Level: {selectedBook.level}</Text>
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
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
