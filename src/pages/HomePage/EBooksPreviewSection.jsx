import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { brandGold } from "../../theme/colors";
import EBookItem from "../../components/EBookItem";

const featuredEbooks = [
  {
    title: "Explosive Athlete Blueprint",
    category: "Performance Training",
    cover:
      "https://images.pexels.com/photos/4761791/pexels-photo-4761791.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 39,
  },
  {
    title: "Fuel Like a Pro: Game-Day Nutrition",
    category: "Nutrition",
    cover:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 29,
  },
  {
    title: "Recovery Rituals for Relentless Athletes",
    category: "Mindset & Recovery",
    cover:
      "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80",
    price: 24,
  },
];

export default function EBooksPreviewSection() {
  const navigate = useNavigate();

  const handleEBookClick = () => {
    navigate("/e-books");
  };

  return (
    <Box as="section" id="ebooks-preview" bg="white" py={{ base: 16, md: 20 }}>
      <Container maxW="6xl" px={{ base: 6, md: 0 }}>
        <Stack spacing={{ base: 10, md: 12 }}>
          <Stack spacing={3} textAlign="center" maxW="3xl" mx="auto">
            <Heading size={{ base: "xl", md: "2xl" }} letterSpacing="tight">
              <chakra.span
                display="inline-flex"
                flexDirection="column"
                alignItems="center"
              >
                Premium E-Book Library
                <Box height="3px" width="100%" bg={brandGold} mt={2} />
              </chakra.span>
            </Heading>
            <Text
              color="gray.600"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="justify"
            >
              Curated playbooks written by Coach Ayoub covering performance
              training, nutrition, and recovery strategies to elevate every
              aspect of your athletic journey.
            </Text>
          </Stack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 8, md: 10 }}
          >
            {featuredEbooks.map((ebook) => (
              <EBookItem
                key={ebook.title}
                book={ebook}
                onClick={handleEBookClick}
              />
            ))}
          </SimpleGrid>

          <Flex justify="center" pt={4}>
            <Button
              as={RouterLink}
              to="/e-books"
              size="lg"
              bg="gray.900"
              color="white"
              borderRadius="none"
              px={10}
              _hover={{ bg: "gray.700" }}
            >
              Browse All E-Books
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

