import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { brandGold } from "../theme/colors";

export default function EBookItem({ book, onClick, variant = "full" }) {
  const isPreview = variant === "preview";

  return (
    <Stack
      border="1px solid"
      borderColor="gray.200"
      bg="white"
      borderRadius="none"
      boxShadow={isPreview ? "none" : "md"}
      overflow="hidden"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: isPreview ? "xl" : "xl",
      }}
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      role={onClick ? "group" : undefined}
    >
      <Box position="relative">
        {/* Cover art with hover animation */}
        <Image
          src={book.cover}
          alt={book.title}
          w="full"
          h={
            isPreview
              ? { base: "280px", md: "320px" }
              : { base: "380px", md: "360px", lg: "360px" }
          }
          objectFit="cover"
          transition="transform 0.3s ease"
          _groupHover={onClick ? { transform: "scale(1.02)" } : undefined}
        />
        <Badge
          position="absolute"
          top={4}
          right={4}
          bg="blackAlpha.800"
          color="white"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          letterSpacing="widest"
        >
          ${book.price}
        </Badge>
        {isPreview ? (
          <Badge
            position="absolute"
            top={4}
            left={4}
            bg={brandGold}
            color="white"
            borderRadius="none"
            px={3}
            py={1}
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="widest"
          >
            {book.category}
          </Badge>
        ) : (
          <Box
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            bottom={4}
            width="calc(100% - 32px)"
            bg="blackAlpha.200"
            backdropFilter="blur(12px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="sm"
            px={4}
            py={3}
            color="white"
            textAlign="left"
          >
            {/* Category + title glass overlay */}
            <Badge
              bg={brandGold}
              color="white"
              borderRadius="none"
              px={3}
              py={1}
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="widest"
              mb={2}
            >
              {book.category}
            </Badge>
            <Heading size="sm" color="white">
              {book.title}
            </Heading>
          </Box>
        )}
      </Box>
      {isPreview && (
        <Stack spacing={3} p={{ base: 5, md: 6 }}>
          <Heading size="md" color="gray.900">
            {book.title}
          </Heading>
          <Button
            as={RouterLink}
            to="/e-books"
            size="sm"
            bg={brandGold}
            color="white"
            borderRadius="none"
            _hover={{ bg: brandGold, opacity: 0.85 }}
            w="full"
          >
            View Details
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

