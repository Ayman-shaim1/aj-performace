import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { brandGold } from "../../theme/colors";

const aboutHighlights = [
  {
    title: "Judo Roots",
    description:
      "Multiple-time champion with years spent competing and coaching on the national circuit.",
  },
  {
    title: "Sports Science Degree",
    description:
      "Bachelor's in Sports Science from Complexe Moulay Abdellah with a focus on performance optimization.",
  },
  {
    title: "Preparateur Physique",
    description:
      "Trusted by athletes across combat sports, sprint disciplines, and team sports to build resilient bodies.",
  },
];

export default function AboutSection() {
  return (
    <Box as="section" bg="white" py={{ base: 16, md: 20 }}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="stretch"
          gap={{ base: 10, md: 16 }}
        >
          <Stack
            spacing={{ base: 8, md: 10 }}
            flex="1"
            textAlign={{ base: "center", md: "left" }}
            align={{ base: "center", md: "flex-start" }}
            w="full"
          >
            <Heading as="h1" size="3xl" letterSpacing="tight">
              About Coach Ayoub
              <Box width="100%" height="3px" display="block" bg={brandGold} />
            </Heading>

            <Text
              maxW={{ base: "full", md: "30rem" }}
              color="gray.600"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="justify"
              mb={6}
            >
              Former national judo champion turned performance coach, I bring the
              grit of the tatami and the science of sport together. I hold a Sports
              Science Bachelor's from Complexe Moulay Abdellah and now serve as a
              dedicated preparateur physique for competitive athletes who expect to
              move, recover, and compete at their peak.
            </Text>

            <SimpleGrid
              columns={{ base: 1, sm: 3 }}
              spacing={{ base: 6, md: 8 }}
              w="full"
              textAlign="left"
            >
              {aboutHighlights.map((item) => (
                <Stack
                  key={item.title}
                  spacing={3}
                  bg="white"
                  p={{ base: 5, md: 6 }}
                  mr={1}
                  borderRadius="none"
                  border="1px solid"
                  borderColor="gray.100"
                  h="full"
                  transition="all 0.2s ease"
                  _hover={{
                    borderColor: brandGold,
                    transform: "translateY(-6px)",
                    shadow: "lg",
                  }}
                >
                  <Box h="2px" w="36px" bg={brandGold} borderRadius="full" />
                  <Heading size="md" color="gray.800">
                    {item.title}
                  </Heading>
                  <Text as="small" color="gray.600" fontSize="sm">
                    {item.description}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Stack>

          <Box
            flex="1"
            minH={{ base: "14rem", md: "20rem" }}
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
            About Image Placeholder
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
