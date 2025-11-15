import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { brandGold } from "../../theme/colors";

export default function HeroSection({ sectionRef }) {
  return (
    <Box
      ref={sectionRef}
      as="section"
      id="hero"
      bg="gray.900"
      minH="100vh"
      py={{ base: 20, md: 24 }}
      display="flex"
      alignItems="center"
    >
      <Container maxW="5xl" px={{ base: 6, md: 0 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          gap={{ base: 10, md: 16 }}
        >
          <Box
            flex="1"
            minH={{ base: "14rem", md: "18rem" }}
            w="full"
            bgGradient="linear(to-br, gray.200, white)"
            border="2px dashed"
            borderColor="gray.300"
            rounded="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.500"
            fontWeight="medium"
          >
            Image Placeholder
          </Box>
          <Flex
            flex="1"
            direction="column"
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            gap={6}
          >
            <Heading as="h1" size="3xl" color="white" letterSpacing="tight">
              <chakra.span
                display="inline-flex"
                flexDirection="column"
                alignItems={{ base: "center", md: "flex-start" }}
              >
                Level up with AJ Performance
                <Box height="3px" width="100%" bg={brandGold} mt={2} />
              </chakra.span>
            </Heading>
            <Text color="whiteAlpha.800" fontSize={{ base: "lg", md: "xl" }}>
              Book your next coaching session or dive into our curated e-book
              library designed to elevate every aspect of your training journey.
            </Text>
            <Text color="whiteAlpha.600" fontStyle="italic">
              Personalized, data-driven coaching to keep you explosive,
              injury-free, and competition-ready 365 days a year.
            </Text>

            <Stack
              spacing={3}
              align={{ base: "flex-start", md: "flex-start" }}
              color="whiteAlpha.800"
              fontSize="sm"
            >
              <Flex gap={3} align="center">
                <Box boxSize={2} bg={brandGold} borderRadius="full" />
                <Text>
                  Force-velocity profiling and energy system mapping tailored to
                  you.
                </Text>
              </Flex>
              <Flex gap={3} align="center">
                <Box boxSize={2} bg={brandGold} borderRadius="full" />
                <Text>
                  Weekly recalibration calls with Coach Ayoub for real-time
                  adjustments.
                </Text>
              </Flex>
              <Flex gap={3} align="center">
                <Box boxSize={2} bg={brandGold} borderRadius="full" />
                <Text>
                  Recovery prescriptions that blend HRV, breathwork, and
                  mobility stacks.
                </Text>
              </Flex>
            </Stack>

            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={4}
              w={{ base: "full", sm: "auto" }}
              justify={{ base: "center", md: "flex-start" }}
            >
              <Button
                size="lg"
                bg={brandGold}
                color="white"
                borderRadius="none"
                px={{ base: 8, md: 10 }}
                _hover={{ bg: brandGold, opacity: 0.85 }}
              >
                Book Reservation
              </Button>
              <Button
                size="lg"
                borderRadius="none"
                bg="white"
                color="black"
                px={{ base: 8, md: 10 }}
                _hover={{ bg: "gray.100" }}
              >
                Check My E-Books
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
