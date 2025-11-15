import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { brandGold } from "../../theme/colors";

const testimonials = [
  {
    name: "Ahmed Benali",
    role: "National Judo Champion",
    sport: "Judo",
    quote:
      "Coach Ayoub's periodized approach took my explosive power to the next level. The force-velocity profiling helped me understand exactly where I needed to focus, and the results showed in competition.",
    result: "Gold Medal, National Championships 2023",
  },
  {
    name: "Sarah Amrani",
    role: "Elite Sprinter",
    sport: "Track & Field",
    quote:
      "The nutrition guidance combined with targeted conditioning work transformed my recovery between training sessions. I've never felt stronger or more prepared going into race season.",
    result: "Personal Best in 100m & 200m",
  },
  {
    name: "Youssef El Fassi",
    role: "MMA Fighter",
    sport: "Mixed Martial Arts",
    quote:
      "Working with AJ Performance gave me the conditioning edge I needed. The hybrid plan covered everything—strength, power, and game-day nutrition. My gas tank has never been better.",
    result: "3-0 Record, Improved Cardio Performance",
  },
];

export default function TestimonialsSection() {
  return (
    <Box as="section" id="testimonials" bg="gray.50" py={{ base: 16, md: 20 }}>
      <Container maxW="6xl" px={{ base: 6, md: 0 }}>
        <Stack spacing={{ base: 10, md: 12 }}>
          <Stack spacing={3} textAlign="center" maxW="3xl" mx="auto">
            <Heading size={{ base: "xl", md: "2xl" }} letterSpacing="tight">
              <chakra.span
                display="inline-flex"
                flexDirection="column"
                alignItems="center"
              >
                What Athletes Say
                <Box height="3px" width="100%" bg={brandGold} mt={2} />
              </chakra.span>
            </Heading>
            <Text
              color="gray.600"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="justify"
            >
              Real results from athletes who've committed to the process and
              trusted the science behind performance optimization.
            </Text>
          </Stack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 8, md: 10 }}
          >
            {testimonials.map((testimonial) => (
              <Stack
                key={testimonial.name}
                spacing={4}
                bg="white"
                p={{ base: 6, md: 8 }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="none"
                h="full"
                transition="all 0.2s ease"
                _hover={{
                  borderColor: brandGold,
                  transform: "translateY(-6px)",
                  shadow: "lg",
                }}
              >
                <Box h="2px" w="48px" bg={brandGold} borderRadius="none" />
                <Text
                  color="gray.700"
                  fontSize="md"
                  fontStyle="italic"
                  textAlign="justify"
                  flex="1"
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </Text>
                <Stack spacing={1} pt={2} borderTop="1px solid" borderColor="gray.100">
                  <Text fontWeight="bold" color="gray.900" fontSize="sm">
                    {testimonial.name}
                  </Text>
                  <Text color="gray.600" fontSize="xs" textTransform="uppercase" letterSpacing="wide">
                    {testimonial.role} · {testimonial.sport}
                  </Text>
                  <Text color={brandGold} fontSize="xs" fontWeight="semibold" mt={1}>
                    {testimonial.result}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}

