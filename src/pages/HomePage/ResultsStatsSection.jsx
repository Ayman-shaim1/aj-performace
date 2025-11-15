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

const stats = [
  {
    value: "200+",
    label: "Athletes Coached",
    description: "Elite competitors across combat sports and field athletics",
  },
  {
    value: "15+",
    label: "National Championships",
    description: "Athletes who've won titles under our guidance",
  },
  {
    value: "98%",
    label: "Injury-Free Rate",
    description: "Athletes who complete their season without major setbacks",
  },
  {
    value: "12+",
    label: "Years Experience",
    description: "Combining competitive judo with sports science expertise",
  },
];

export default function ResultsStatsSection() {
  return (
    <Box as="section" id="stats" bg="gray.50" py={{ base: 16, md: 20 }}>
      <Container maxW="6xl" px={{ base: 6, md: 0 }}>
        <Stack spacing={{ base: 10, md: 12 }} textAlign="center">
          <Stack spacing={3} maxW="3xl" mx="auto">
            <Heading size={{ base: "xl", md: "2xl" }} letterSpacing="tight">
              <chakra.span
                display="inline-flex"
                flexDirection="column"
                alignItems="center"
              >
                Proven Results, Measured Impact
                <Box height="3px" width="100%" bg={brandGold} mt={2} />
              </chakra.span>
            </Heading>
            <Text
              color="gray.600"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="justify"
            >
              Data-driven coaching that delivers consistent performance gains and
              keeps athletes competing at their peak, season after season.
            </Text>
          </Stack>

          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 6, md: 8 }}
          >
            {stats.map((stat) => (
              <Stack
                key={stat.label}
                spacing={3}
                bg="white"
                p={{ base: 6, md: 8 }}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="none"
                textAlign="center"
                transition="all 0.2s ease"
                _hover={{
                  borderColor: brandGold,
                  transform: "translateY(-6px)",
                  shadow: "lg",
                }}
              >
                <Text
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={brandGold}
                  lineHeight="1"
                >
                  {stat.value}
                </Text>
                <Heading size="md" color="gray.900">
                  {stat.label}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {stat.description}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}

