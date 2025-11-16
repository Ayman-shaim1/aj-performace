import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import InputText from "../../components/InputText";
import { brandGold } from "../../theme/colors";

export default function ContactMeSection() {
  return (
    <Box as="section" id="contact" bg="white" py={{ base: 16, md: 20 }}>
      <Container maxW="6xl" px={{ base: 6, md: 0 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 10, lg: 16 }}
          align="stretch"
        >
          <Stack
            flex="1"
            color="gray.800"
            spacing={6}
            textAlign={{ base: "center", lg: "left" }}
            align={{ base: "center", lg: "flex-start" }}
          >
            <Heading size="2xl" letterSpacing="tight">
              <chakra.span
                display="inline-flex"
                flexDirection="column"
                alignItems={{ base: "center", lg: "flex-start" }}
              >
                Let's Elevate Your Performance
                <Box height="3px" width="100%" bg={brandGold} mt={2} />
              </chakra.span>
            </Heading>
            <Text color="gray.800" fontSize={{ base: "md", md: "lg" }}>
              Ready to build explosive power, sharpen your conditioning, and
              compete with confidence? Reach out with your goals and schedule,
              and I’ll get back with a game plan tailored to you.
            </Text>
            <Stack spacing={4} fontSize="md" color="gray.800">
              <Box>
                <Text fontWeight="semibold" textTransform="uppercase" mb={1}>
                  Phone
                </Text>
                <Text>+1 (555) 987-6543</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" textTransform="uppercase" mb={1}>
                  Email
                </Text>
                <Text>coach@ajperformance.com</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold" textTransform="uppercase" mb={1}>
                  Availability
                </Text>
                <Text>Monday – Saturday · 8:00 – 18:00</Text>
              </Box>
            </Stack>
          </Stack>

          <Flex flex="1" align="stretch">
            <VStack
              as="form"
              spacing={5}
              w="full"
              bg="white"
              p={{ base: 6, md: 8 }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="none"
            >
              <InputText
                id="name"
                label="Name"
                placeholder="Full name"
                isRequired
              />
              <InputText
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                isRequired
              />
              <InputText
                id="phone"
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
              <InputText
                id="message"
                label="Message"
                placeholder="Tell me about your goals..."
                isTextarea
                isRequired
              />
              <Button
                type="submit"
                bg="gray.900"
                color="white"
                borderRadius="none"
                bgColor={brandGold}
                size="lg"
                w="full"
                _hover={{ opacity: 0.85 }}
              >
                Send Message
              </Button>
            </VStack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
