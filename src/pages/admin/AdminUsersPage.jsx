import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Badge,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { brandGold } from "../../theme/colors";
import { getUsers } from "../../services/userService";
import { showErrorToast } from "../../utils/toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminFilter, setAdminFilter] = useState("all"); // "all", "admin", "user"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 25;
  const showPhoneColumn = useBreakpointValue({ base: false, md: true });
  const showAuthMethodColumn = useBreakpointValue({ base: false, md: true });
  const isFirstMount = useRef(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * limit;
      const isAdminFilter =
        adminFilter === "admin" ? true : adminFilter === "user" ? false : null;

      const result = await getUsers({
        limit,
        offset,
        searchTerm: searchTerm.trim(),
        isAdmin: isAdminFilter,
      });

      setUsers(result.users);
      setTotalUsers(result.total);
      setTotalPages(Math.ceil(result.total / limit));
    } catch (error) {
      showErrorToast("Error", error.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Mark that initial mount is complete after first fetch
    if (isFirstMount.current) {
      isFirstMount.current = false;
    }
  }, [currentPage, adminFilter]);

  // Debounce search
  useEffect(() => {
    // Skip on initial mount to avoid double fetch
    if (isFirstMount.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdminFilterChange = (e) => {
    setAdminFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 4, md: 8 }}>
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          {/* Header */}
          <HStack spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <Box color={brandGold} fontSize={{ base: "2xl", md: "3xl" }}>
              <FiUsers />
            </Box>
            <VStack align="start" spacing={1} flex={1}>
              <Heading size={{ base: "lg", md: "xl" }} color="gray.900">
                User Management
              </Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                Manage users, permissions, and access controls
              </Text>
            </VStack>
          </HStack>

          {/* Filters and Search */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            p={{ base: 4, md: 6 }}
            bg="white"
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              align={{ base: "stretch", md: "center" }}
            >
              {/* Search Input */}
              <Box flex={1} position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  pointerEvents="none"
                  zIndex={1}
                >
                  <FiSearch />
                </Box>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    borderRadius: 0,
                    paddingLeft: "40px",
                    border: "1px solid #E2E8F0",
                    padding: "8px 8px 8px 40px",
                    width: "100%",
                    fontSize: "16px",
                    minHeight: "44px", // Better touch target on mobile
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = brandGold;
                    e.target.style.boxShadow = `0 0 7px 1px ${brandGold}`;
                    e.target.style.outline = "none";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E8F0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </Box>

              {/* Admin Filter */}
              <Box minW={{ base: "full", md: "200px" }}>
                <select
                  value={adminFilter}
                  onChange={handleAdminFilterChange}
                  style={{
                    borderRadius: 0,
                    border: "1px solid #E2E8F0",
                    padding: "8px",
                    width: "100%",
                    fontSize: "16px",
                    minHeight: "44px", // Better touch target on mobile
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = brandGold;
                    e.target.style.boxShadow = `0 0 7px 1px ${brandGold}`;
                    e.target.style.outline = "none";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E8F0";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admins Only</option>
                  <option value="user">Regular Users</option>
                </select>
              </Box>
            </Flex>
          </Box>

          {/* Users Table */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            overflow="hidden"
          >
            {loading ? (
              <Flex justify="center" align="center" py={12}>
                <Spinner size="xl" color={brandGold} thickness="3px" />
              </Flex>
            ) : users.length === 0 ? (
              <Box p={{ base: 6, md: 8 }} textAlign="center">
                <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                  No users found
                </Text>
                <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }} mt={2}>
                  {searchTerm || adminFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No users have been registered yet"}
                </Text>
              </Box>
            ) : (
              <>
                {/* Mobile Card View */}
                <Box display={{ base: "block", md: "none" }}>
                  <VStack spacing={0} align="stretch" divider={<Box borderTop="1px solid" borderColor="gray.200" />}>
                    {users.map((user) => (
                      <Box
                        key={user.$id}
                        p={4}
                        _hover={{ bg: "gray.50" }}
                        transition="background 0.2s"
                      >
                        <VStack align="stretch" spacing={3}>
                          <Flex justify="space-between" align="start">
                            <VStack align="start" spacing={1} flex={1}>
                              <Text fontWeight="semibold" color="gray.900" fontSize="md">
                                {user.fullName || "N/A"}
                              </Text>
                              <Text color="gray.600" fontSize="sm" wordBreak="break-all">
                                {user.email || "N/A"}
                              </Text>
                            </VStack>
                            {user.isAdmin ? (
                              <Badge
                                bg={brandGold}
                                color="white"
                                borderRadius="none"
                                px={2}
                                py={1}
                                fontSize="xs"
                                fontWeight="semibold"
                                ml={2}
                              >
                                Admin
                              </Badge>
                            ) : (
                              <Badge
                                bg="gray.200"
                                color="gray.700"
                                borderRadius="none"
                                px={2}
                                py={1}
                                fontSize="xs"
                                fontWeight="semibold"
                                ml={2}
                              >
                                User
                              </Badge>
                            )}
                          </Flex>
                          <HStack spacing={4} fontSize="sm" color="gray.600" flexWrap="wrap">
                            {user.phoneNumber && (
                              <Text>
                                <Text as="span" fontWeight="medium">Phone:</Text> {user.phoneNumber}
                              </Text>
                            )}
                            <Text>
                              <Text as="span" fontWeight="medium">Auth:</Text> {user.authMethod === "google" ? "Google" : "Email"}
                            </Text>
                            <Text>
                              <Text as="span" fontWeight="medium">Joined:</Text> {formatDate(user.$createdAt)}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                {/* Desktop Table View */}
                <Box display={{ base: "none", md: "block" }} overflowX="auto">
                  <table
                    width="100%"
                    style={{ 
                      borderCollapse: "collapse", 
                      width: "100%"
                    }}
                  >
                    <thead style={{ backgroundColor: "#F7FAFC" }}>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #E2E8F0",
                            color: "#4A5568",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            padding: "16px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            border: "1px solid #E2E8F0",
                            color: "#4A5568",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            padding: "16px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Email
                        </th>
                        {showPhoneColumn && (
                          <th
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#4A5568",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              fontSize: "12px",
                              letterSpacing: "0.05em",
                              padding: "16px",
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Phone
                          </th>
                        )}
                        <th
                          style={{
                            border: "1px solid #E2E8F0",
                            color: "#4A5568",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            padding: "16px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Status
                        </th>
                        {showAuthMethodColumn && (
                          <th
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#4A5568",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              fontSize: "12px",
                              letterSpacing: "0.05em",
                              padding: "16px",
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Auth Method
                          </th>
                        )}
                        <th
                          style={{
                            border: "1px solid #E2E8F0",
                            color: "#4A5568",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            padding: "16px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.$id}
                          style={{
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#F7FAFC";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <td
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#1A202C",
                              padding: "16px",
                            }}
                          >
                            <Text fontWeight="medium" fontSize="15px">
                              {user.fullName || "N/A"}
                            </Text>
                          </td>
                          <td
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#4A5568",
                              padding: "16px",
                            }}
                          >
                            <Text fontSize="14px" wordBreak="break-word">
                              {user.email || "N/A"}
                            </Text>
                          </td>
                          {showPhoneColumn && (
                            <td
                              style={{
                                border: "1px solid #E2E8F0",
                                color: "#718096",
                                padding: "16px",
                                fontSize: "14px",
                              }}
                            >
                              {user.phoneNumber || "N/A"}
                            </td>
                          )}
                          <td
                            style={{
                              border: "1px solid #E2E8F0",
                              padding: "16px",
                            }}
                          >
                            {user.isAdmin ? (
                              <Badge
                                bg={brandGold}
                                color="white"
                                borderRadius="none"
                                px={2}
                                py={1}
                                fontSize="xs"
                                fontWeight="semibold"
                              >
                                Admin
                              </Badge>
                            ) : (
                              <Badge
                                bg="gray.200"
                                color="gray.700"
                                borderRadius="none"
                                px={2}
                                py={1}
                                fontSize="xs"
                                fontWeight="semibold"
                              >
                                User
                              </Badge>
                            )}
                          </td>
                          {showAuthMethodColumn && (
                            <td
                              style={{
                                border: "1px solid #E2E8F0",
                                color: "#718096",
                                fontSize: "14px",
                                padding: "16px",
                              }}
                            >
                              {user.authMethod === "google" ? "Google" : "Email"}
                            </td>
                          )}
                          <td
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#718096",
                              fontSize: "14px",
                              padding: "16px",
                            }}
                          >
                            {formatDate(user.$createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", md: "center" }}
                    gap={{ base: 3, md: 0 }}
                    p={{ base: 3, md: 4 }}
                    borderTop="1px solid"
                    borderColor="gray.200"
                    bg="gray.50"
                  >
                    <Text 
                      color="gray.600" 
                      fontSize={{ base: "xs", md: "sm" }}
                      textAlign={{ base: "center", md: "left" }}
                    >
                      Showing {(currentPage - 1) * limit + 1} to{" "}
                      {Math.min(currentPage * limit, totalUsers)} of{" "}
                      {totalUsers} users
                    </Text>
                    <HStack 
                      spacing={2} 
                      justify={{ base: "center", md: "flex-end" }}
                      flexWrap="wrap"
                    >
                      <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        borderRadius="none"
                        variant="outline"
                        borderColor="gray.300"
                        color="gray.700"
                        _hover={{
                          bg: "gray.100",
                          borderColor: brandGold,
                          color: brandGold,
                        }}
                        _disabled={{
                          opacity: 0.5,
                          cursor: "not-allowed",
                        }}
                        size={{ base: "sm", md: "sm" }}
                      >
                        <HStack spacing={1}>
                          <FiChevronLeft />
                          <Text display={{ base: "none", sm: "block" }}>Previous</Text>
                        </HStack>
                      </Button>
                      <Text 
                        color="gray.600" 
                        fontSize={{ base: "xs", md: "sm" }} 
                        px={2}
                        whiteSpace="nowrap"
                      >
                        Page {currentPage} of {totalPages}
                      </Text>
                      <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        borderRadius="none"
                        variant="outline"
                        borderColor="gray.300"
                        color="gray.700"
                        _hover={{
                          bg: "gray.100",
                          borderColor: brandGold,
                          color: brandGold,
                        }}
                        _disabled={{
                          opacity: 0.5,
                          cursor: "not-allowed",
                        }}
                        size={{ base: "sm", md: "sm" }}
                      >
                        <HStack spacing={1}>
                          <Text display={{ base: "none", sm: "block" }}>Next</Text>
                          <FiChevronRight />
                        </HStack>
                      </Button>
                    </HStack>
                  </Flex>
                )}
              </>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
