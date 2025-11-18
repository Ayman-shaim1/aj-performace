import { Box, Container, Heading, Text, VStack, HStack, Button, SimpleGrid } from "@chakra-ui/react";
import { FiSettings, FiLock, FiMail, FiGlobe, FiDatabase } from "react-icons/fi";
import { brandGold } from "../../theme/colors";

export default function AdminSettingsPage() {
  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Box color={brandGold} fontSize="3xl">
              <FiSettings />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="gray.900">
                Settings
              </Heading>
              <Text color="gray.600">
                Configure system settings and preferences
              </Text>
            </VStack>
          </HStack>

          {/* Settings Categories */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
              _hover={{ borderColor: brandGold, cursor: "pointer" }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <Box color={brandGold} fontSize="2xl">
                  <FiLock />
                </Box>
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.900">
                    Security
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Manage passwords, 2FA, and security settings
                  </Text>
                </VStack>
              </VStack>
            </Box>

            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
              _hover={{ borderColor: brandGold, cursor: "pointer" }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <Box color={brandGold} fontSize="2xl">
                  <FiMail />
                </Box>
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.900">
                    Email Settings
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Configure email templates and notifications
                  </Text>
                </VStack>
              </VStack>
            </Box>

            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
              _hover={{ borderColor: brandGold, cursor: "pointer" }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <Box color={brandGold} fontSize="2xl">
                  <FiGlobe />
                </Box>
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.900">
                    General
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Site settings, branding, and preferences
                  </Text>
                </VStack>
              </VStack>
            </Box>

            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
              _hover={{ borderColor: brandGold, cursor: "pointer" }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <Box color={brandGold} fontSize="2xl">
                  <FiDatabase />
                </Box>
                <VStack align="start" spacing={2}>
                  <Heading size="md" color="gray.900">
                    Database
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Backup, restore, and database management
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Content */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            p={8}
            bg="white"
          >
            <VStack spacing={4} align="start">
              <Text color="gray.600" fontSize="lg">
                Settings management coming soon...
              </Text>
              <Text color="gray.500">
                This page will allow you to configure:
              </Text>
              <Box as="ul" pl={6} color="gray.600">
                <li>System preferences and defaults</li>
                <li>Email and notification settings</li>
                <li>Security and authentication options</li>
                <li>Database backup and maintenance</li>
                <li>API keys and integrations</li>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

