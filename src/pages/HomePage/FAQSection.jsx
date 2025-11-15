import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { useState } from "react";
import { brandGold } from "../../theme/colors";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "How does the coaching program work?",
    answer:
      "Each program includes personalized training plans, weekly check-ins via video calls, and real-time program adjustments based on your progress. You'll receive periodized programming that adapts to your competition calendar and training phases.",
  },
  {
    question: "What's included in the Elite Hybrid Plan?",
    answer:
      "The Elite Hybrid Plan combines physical preparation with nutrition guidance. You get all performance coaching features plus weekly macro adjustments, game-day fueling strategies, and recovery nutrition protocols tailored to your training schedule.",
  },
  {
    question: "Do I need to be a competitive athlete to work with you?",
    answer:
      "While many of my athletes compete at a high level, I work with anyone committed to improving their performance. Whether you're preparing for competition, returning from injury, or simply want to train like an elite athlete, we can build a program that fits your goals.",
  },
  {
    question: "How do I access the e-book library?",
    answer:
      "E-books are available for individual purchase, or you can get access to the full library with the Pro Complete Stack coaching package. Each e-book includes downloadable PDFs and lifetime access to updates.",
  },
  {
    question: "What makes your approach different?",
    answer:
      "I combine competitive experience (national judo champion) with sports science education and hands-on coaching. Every program is data-driven, using force-velocity profiling, energy system mapping, and periodization principles. It's not generic programming—it's tailored to your specific needs and goals.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Results vary based on your starting point, consistency, and goals. Most athletes notice improvements in strength and power within 4-6 weeks, with significant gains typically visible after 12 weeks of consistent training. We track progress through regular assessments and adjust as needed.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      bg="white"
      borderRadius="none"
      transition="all 0.2s ease"
      _hover={{ borderColor: brandGold }}
    >
      <Flex
        justify="space-between"
        align="center"
        p={{ base: 5, md: 6 }}
        cursor="pointer"
        onClick={onToggle}
      >
        <Text
          fontWeight="semibold"
          color="gray.900"
          fontSize={{ base: "sm", md: "md" }}
          pr={4}
        >
          {question}
        </Text>
        <Box color={brandGold} flexShrink={0}>
          {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </Box>
      </Flex>
      {isOpen && (
        <Box
          px={{ base: 5, md: 6 }}
          pb={{ base: 5, md: 6 }}
          pt={0}
          borderTop="1px solid"
          borderColor="gray.100"
        >
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} textAlign="justify">
            {answer}
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box as="section" id="faq" bg="white" py={{ base: 16, md: 20 }}>
      <Container maxW="4xl" px={{ base: 6, md: 0 }}>
        <Stack spacing={{ base: 10, md: 12 }}>
          <Stack spacing={3} textAlign="center" maxW="3xl" mx="auto">
            <Heading size={{ base: "xl", md: "2xl" }} letterSpacing="tight">
              <chakra.span
                display="inline-flex"
                flexDirection="column"
                alignItems="center"
              >
                Frequently Asked Questions
                <Box height="3px" width="100%" bg={brandGold} mt={2} />
              </chakra.span>
            </Heading>
            <Text
              color="gray.600"
              fontSize={{ base: "md", md: "lg" }}
              textAlign="justify"
            >
              Everything you need to know about coaching programs, e-books, and
              how we work together to elevate your performance.
            </Text>
          </Stack>

          <Stack spacing={4}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

