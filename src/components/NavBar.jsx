import React from "react";
import { Button, Flex, HStack, Link, Heading, chakra } from "@chakra-ui/react";
import { brandGold } from "../theme/colors";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "My Services", href: "/services" },
];

export default function NavBar({ isHeroInView = true }) {
  const bg = isHeroInView ? "gray.900" : "white";
  const textColor = isHeroInView ? "white" : "gray.900";
  const hoverColor = isHeroInView ? brandGold : brandGold;

  return (
    <Flex
      as="header"
      position="sticky"
      top={0}
      zIndex={20}
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

      <HStack spacing={6} fontSize="sm" color="inherit">
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
    </Flex>
  );
}
