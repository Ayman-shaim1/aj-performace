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
  Icon,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { brandGold } from "../theme/colors";

const navLinks = [
  //   { label: "Home", href: "#hero", sectionId: "hero" },
  { label: "About Me", href: "#about", sectionId: "about" },
  { label: "My Services", href: "#services", sectionId: "services" },
  { label: "E-Books", href: "#ebooks-preview", sectionId: "ebooks-preview" },
  { label: "Testimonials", href: "#testimonials", sectionId: "testimonials" },
  { label: "FAQ", href: "#faq", sectionId: "faq" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];
const MotionBox = motion(Box);

export default function NavBar({ isHeroInView = true }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(null);
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

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const sectionElements = navLinks
      .map((link) => document.getElementById(link.sectionId))
      .filter(Boolean);

    if (sectionElements.length === 0) {
      return undefined;
    }

    const updateActiveSection = () => {
      const header = document.querySelector("header");
      const headerOffset = header?.offsetHeight ?? 0;
      const scrollPosition = window.scrollY + headerOffset + 100; // Add offset for better detection

      // Find the section that is currently most visible in the viewport
      let activeSection = null;
      let maxVisible = 0;

      sectionElements.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        // Calculate how much of the section is visible
        const viewportTop = window.scrollY;
        const viewportBottom = window.scrollY + window.innerHeight;
        
        const visibleTop = Math.max(sectionTop, viewportTop);
        const visibleBottom = Math.min(sectionBottom, viewportBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Check if section is in the viewport and has significant visibility
        if (visibleHeight > 0 && scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom) {
          if (visibleHeight > maxVisible) {
            maxVisible = visibleHeight;
            activeSection = section.id;
          }
        }
      });

      // Fallback: if no section is significantly visible, find the one closest to the top
      if (!activeSection && sectionElements.length > 0) {
        const sortedSections = [...sectionElements].sort((a, b) => {
          const aTop = a.getBoundingClientRect().top + window.scrollY;
          const bTop = b.getBoundingClientRect().top + window.scrollY;
          return Math.abs(scrollPosition - aTop) - Math.abs(scrollPosition - bTop);
        });
        
        const closest = sortedSections[0];
        const closestTop = closest.getBoundingClientRect().top + window.scrollY;
        if (scrollPosition >= closestTop - 300) {
          activeSection = closest.id;
        }
      }

      setActiveSection(activeSection);
    };

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const handleNavClick = React.useCallback(
    (event, sectionId) => {
      event.preventDefault();
      closeMobileMenu();

      if (typeof window === "undefined") {
        return;
      }

      const section = document.getElementById(sectionId);
      if (!section) {
        return;
      }

      const header = document.querySelector("header");
      const headerOffset = header?.offsetHeight ?? 0;
      const elementPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(elementPosition - headerOffset, 0);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    },
    [closeMobileMenu]
  );

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
          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;

            return (
              <Link
                key={link.href}
                href={link.href}
                textDecoration="none"
                position="relative"
                display="inline-flex"
                alignItems="center"
                px={1}
                py={2}
                marginRight={3}
                fontWeight={isActive ? "semibold" : "medium"}
                letterSpacing="wide"
                transition="color 0.2s ease, transform 0.2s ease"
                color={
                  isActive ? hoverColor : isHeroInView ? "gray.300" : "gray.700"
                }
                outline="none"
                onClick={(event) => handleNavClick(event, link.sectionId)}
                _hover={{
                  textDecoration: "none",
                  color: hoverColor,
                  transform: "translateY(-2px)",
                  _after: { width: "100%" },
                }}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: "2px",
                  width: isActive ? "100%" : "0%",
                  bg: hoverColor,
                  borderRadius: "full",
                  transition: "width 0.2s ease",
                }}
                _focus={{ boxShadow: "none" }}
                _focusVisible={{ boxShadow: "none" }}
              >
                {link.label}
              </Link>
            );
          })}

          <Button
            as={RouterLink}
            to="/e-books"
            borderRadius="none"
            size="sm"
            bg={brandGold}
            _hover={{ bg: brandGold, opacity: 0.85 }}
            color="white"
          >
            Check My E-Books
          </Button>
        </HStack>

        <IconButton
          borderRadius="none"
          aria-label="Open navigation menu"
          onClick={openMobileMenu}
          aria-expanded={isMobileMenuOpen}
          bg={isHeroInView ? "gray.800" : "white"}
          border="1px solid"
          borderColor={isHeroInView ? "gray.900" : "gray.200"}
          _hover={{
            bg: isHeroInView ? "gray.800" : "gray.50",
            transform: "scale(1.05)",
          }}
          _active={{
            bg: isHeroInView ? "gray.500" : "gray.200",
          }}
          transition="all 0.2s ease"
          display={{ base: "inline-flex", md: "none" }}
        >
          <Icon as={FiMenu} color={isHeroInView ? "white" : "gray.900"} />
        </IconButton>
      </Flex>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MotionBox
              key="mobile-overlay"
              position="fixed"
              inset={0}
              bg="blackAlpha.500"
              backdropFilter="blur(2px)"
              onClick={closeMobileMenu}
              zIndex={30}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <MotionBox
              key="mobile-panel"
              position="fixed"
              top={0}
              left={0}
              bottom={0}
              width="80%"
              maxW="320px"
              bg="gray.900"
              color="white"
              px={6}
              py={{ base: 12, sm: 14 }}
              zIndex={50}
              display="flex"
              flexDirection="column"
              boxShadow="lg"
              borderRight="1px solid"
              borderColor="whiteAlpha.200"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <CloseButton
                position="absolute"
                top={4}
                right={4}
                color="white"
                bg={"gray.800"}
                borderRadius="none"
                onClick={closeMobileMenu}
                size="md"
              />
              <Box mt={4}>
                <Heading
                  size="lg"
                  fontWeight="extrabold"
                  letterSpacing="widest"
                  textTransform="uppercase"
                  lineHeight="1"
                >
                  AJ <chakra.span color={brandGold}>Performance</chakra.span>
                </Heading>
                <Box
                  mt={4}
                  height="1px"
                  width="100%"
                  bgGradient="linear(to-r, whiteAlpha.200, whiteAlpha.500, whiteAlpha.200)"
                />
              </Box>
              <Stack
                spacing={5}
                fontSize="lg"
                textTransform="uppercase"
                fontWeight="semibold"
                mt={8}
                align="flex-start"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.sectionId)}
                    borderRadius="md"
                    px={4}
                    py={2.5}
                    width="full"
                    textAlign="left"
                    fontWeight={
                      activeSection === link.sectionId ? "semibold" : "medium"
                    }
                    letterSpacing="widest"
                    color={
                      activeSection === link.sectionId ? brandGold : "white"
                    }
                    bg={
                      activeSection === link.sectionId
                        ? "whiteAlpha.100"
                        : "transparent"
                    }
                    transition="all 0.2s ease"
                    _hover={{
                      color: brandGold,
                      bg: "whiteAlpha.100",
                      transform: "translateX(6px)",
                    }}
                    _focus={{ boxShadow: "none" }}
                    _focusVisible={{ boxShadow: "none" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
              <Box mt="auto">
                <Button
                  as={RouterLink}
                  to="/e-books"
                  borderRadius="none"
                  size="md"
                  width="full"
                  bg={brandGold}
                  _hover={{ bg: brandGold, opacity: 0.85 }}
                  onClick={closeMobileMenu}
                  color="white"
                >
                  Check My E-Books
                </Button>
              </Box>
            </MotionBox>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
