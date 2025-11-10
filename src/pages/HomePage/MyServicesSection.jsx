import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { brandGold } from "../../theme/colors";

const services = [
  {
    title: "Performance Coaching",
    subtitle: "Physical Preparation",
    description:
      "Individualized strength, power, and speed programming with weekly check-ins to keep your progress accountable.",
    features: [
      "Assessment and testing every training block",
      "Periodized strength, speed, and conditioning",
      "Weekly video feedback and session reviews",
    ],
    cta: "Start Coaching",
  },
  {
    title: "Elite Hybrid Plan",
    subtitle: "Physical Prep + Nutrition Guidance",
    description:
      "Pair your training blueprint with personalized fueling and recovery guidance tailored to practice and competition days.",
    features: [
      "All performance coaching inclusions",
      "Macro and micronutrient targets adjusted weekly",
      "Game-day and recovery fueling strategies",
    ],
    cta: "Book Hybrid Plan",
    highlight: true,
  },
  {
    title: "Pro Complete Stack",
    subtitle: "Physical Prep + Nutrition + E-books",
    description:
      "Full-spectrum coaching with access to AJ's premium e-book library for mindset, mobility, and competition prep.",
    features: [
      "Everything in the Elite Hybrid Plan",
      "Exclusive e-book drop each month",
      "Priority messaging and 48-hour program tweaks",
    ],
    cta: "Apply for Pro Stack",
  },
];

export default function MyServicesSection() {
  return (
    <Box as="section" bg="gray.50" py={{ base: 16, md: 20 }}>
      <Container maxW="6xl">
        <Stack spacing={{ base: 10, md: 12 }} textAlign="center">
          <Stack spacing={3} maxW="3xl" mx="auto">
            <Heading size={{ base: "xl", md: "2xl" }} letterSpacing="tight">
              Programs Built for High Performance
            </Heading>
            <Text
              color="gray.600"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="justify"
            >
              Choose the level of support that matches your season goals—from
              pure physical preparation to full-spectrum performance with
              nutrition and education layered in.
            </Text>
          </Stack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 8, md: 10 }}
          >
            {services.map((service) => {
              const isHighlight = Boolean(service.highlight);

              return (
                <Flex
                  key={service.title}
                  direction="column"
                  position="relative"
                  bg="white"
                  border="1px solid"
                  borderColor={isHighlight ? brandGold : "gray.200"}
                  boxShadow={isHighlight ? "xl" : "md"}
                  borderRadius="none"
                  p={{ base: 6, md: 8 }}
                  mr={1}
                  minH="100%"
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{ transform: "translateY(-8px)", boxShadow: "2xl" }}
                >
                  <Stack spacing={1} mb={4} align="flex-start" textAlign="left">
                    <Text
                      textTransform="uppercase"
                      fontSize="xs"
                      fontWeight="semibold"
                      letterSpacing="widest"
                      color={isHighlight ? brandGold : "gray.500"}
                    >
                      {service.subtitle}
                    </Text>
                    <Flex align="center" gap={3}>
                      <Heading size="lg" color="gray.900">
                        {service.title}
                      </Heading>
                      {isHighlight && (
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          letterSpacing="widest"
                          textTransform="uppercase"
                          color={brandGold}
                        >
                          Recommended
                        </Text>
                      )}
                    </Flex>
                  </Stack>

                  <Text
                    as="small"
                    color="gray.600"
                    fontSize="sm"
                    textAlign="justify"
                  >
                    {service.description}
                  </Text>

                  <Stack
                    flex="1"
                    spacing={3}
                    color="gray.700"
                    fontSize="sm"
                    mt={6}
                    mb={8}
                    textAlign="left"
                  >
                    {service.features.map((feature) => (
                      <Flex key={feature} align="flex-start" gap={3}>
                        <Box
                          boxSize={2}
                          mt={2}
                          borderRadius="full"
                          bg={isHighlight ? brandGold : "gray.400"}
                        />
                        <Text as="span" textAlign="justify">
                          {feature}
                        </Text>
                      </Flex>
                    ))}
                  </Stack>

                  <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                    <Button
                      size="md"
                      bg={isHighlight ? brandGold : "gray.900"}
                      color={isHighlight ? "black" : "white"}
                      borderRadius="none"
                      px={8}
                      whiteSpace="nowrap"
                      _hover={{
                        bg: isHighlight ? brandGold : "gray.700",
                        opacity: isHighlight ? 0.9 : 1,
                      }}
                    >
                      {service.cta}
                    </Button>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
