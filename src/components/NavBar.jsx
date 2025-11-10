import React from "react";
import {
  Button,
  Flex,
  HStack,
  Link,
  Heading,
  chakra,
  IconButton,
  CloseButton,
  Box,
  Stack,
} from "@chakra-ui/react";
import { brandGold } from "../theme/colors";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "My Services", href: "/services" },
];

function MenuIcon(props) {
  return (
    <chakra.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </chakra.svg>
  );
}

export default function NavBar({ isHeroInView = true }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const openMobileMenu = React.useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = React.useCallback(
    () => setIsMobileMenuOpen(false),
    []
  );

  React.useEffect(() => {
    if (!isMobileMenuOpen || typeof window === "undefined") {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const bg = isHeroInView ? "gray.900" : "white";
  const textColor = isHeroInView ? "white" : "gray.900";
  const hoverColor = brandGold;

  return (
    <>
      <Flex
        as="header"
        position="sticky"
        top={0}
        zIndex={40}
        align="center"
        justify="space-between"
        px={{ base: 4, md: 8 }}
        py={4}
        bg={bg}
        color={textColor}
        boxShadow={isHeroInView ? "none" : "sm"}
        transition="background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease"
      >
        <Heading
          size={{ base: "lg", md: "xl" }}
          fontWeight="extrabold"
          letterSpacing="wider"
          textTransform="uppercase"
          lineHeight="1"
          color="inherit"
        >
          AJ <chakra.span color={brandGold}>Performance</chakra.span>
        </Heading>

        <HStack
          spacing={6}
          fontSize="sm"
          color="inherit"
          display={{ base: "none", md: "flex" }}
        >
          {navLinks.map((link) => (
            <Link
              marginRight={3}
              key={link.href}
              href={link.href}
              color="inherit"
              _hover={{
                textDecoration: "underline",
                color: hoverColor,
                transition: "all 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}

          <Button
            borderRadius="none"
            size="sm"
            bg={brandGold}
            _hover={{ bg: brandGold, opacity: 0.85 }}
          >
            Check My E-Books
          </Button>
        </HStack>

        <IconButton
          aria-label="Open navigation menu"
          onClick={openMobileMenu}
          aria-expanded={isMobileMenuOpen}
          icon={<MenuIcon boxSize={5} />}
          size="md"
          variant="ghost"
          color={textColor}
          display={{ base: "inline-flex", md: "none" }}
        />
      </Flex>
      {isMobileMenuOpen && (
        <>
          <Box
            position="fixed"
            inset={0}
            bg="blackAlpha.600"
            onClick={closeMobileMenu}
            zIndex={30}
          />
          <Box
            position="fixed"
            top={0}
            left={0}
            bottom={0}
            width="80%"
            maxW="320px"
            bg="gray.900"
            color="white"
            px={6}
            py={12}
            zIndex={50}
            display="flex"
            flexDirection="column"
            boxShadow="lg"
          >
            <CloseButton
              position="absolute"
              top={4}
              right={4}
              color="white"
              onClick={closeMobileMenu}
            />
            <Stack spacing={6} fontSize="lg" textTransform="uppercase" mt={8}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  _hover={{
                    textDecoration: "underline",
                    color: brandGold,
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
            <Box mt="auto">
              <Button
                borderRadius="none"
                size="md"
                width="full"
                bg={brandGold}
                color="gray.900"
                _hover={{ bg: brandGold, opacity: 0.85 }}
                onClick={closeMobileMenu}
              >
                Check My E-Books
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
