import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaInstagram, FaYoutube, FaTiktok, FaLinkedin } from "react-icons/fa6";
import { brandGold } from "../../theme/colors";

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://youtube.com", label: "YouTube", icon: FaYoutube },
  { href: "https://www.tiktok.com", label: "TikTok", icon: FaTiktok },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
];

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.900" color="whiteAlpha.800" py={12} borderTop="2px solid" borderColor={brandGold}>
      <Container maxW="6xl" px={{ base: 6, md: 0 }}>
        <Stack spacing={6}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap={4}
          >
            <Text fontWeight="bold" fontSize="lg" color="white">
              AJ Performance
            </Text>

            <HStack spacing={4}>
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  isExternal
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color="whiteAlpha.700"
                  _hover={{ color: brandGold, textDecoration: "none" }}
                >
                  <Icon size="1.1rem" />
                  <Text fontSize="sm">{label}</Text>
                </Link>
              ))}
            </HStack>
          </Flex>

          <Box borderTop="1px solid" borderColor="whiteAlpha.200" />

          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap={3}
            fontSize="xs"
            color="whiteAlpha.600"
          >
            <Text>© {currentYear} AJ Performance. All rights reserved.</Text>
            {/* <HStack spacing={5}>
              <Link href="#" _hover={{ color: brandGold }}>
                Privacy Policy
              </Link>
              <Link href="#" _hover={{ color: brandGold }}>
                Terms of Service
              </Link>
              <Link href="#" _hover={{ color: brandGold }}>
                Cookie Preferences
              </Link>
            </HStack> */}
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}


