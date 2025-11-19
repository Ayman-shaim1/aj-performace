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
} from "@chakra-ui/react";
import {
  FiUsers,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState, useEffect } from "react";
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
  }, [currentPage, adminFilter]);

  // Debounce search
  useEffect(() => {
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
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Box color={brandGold} fontSize="3xl">
              <FiUsers />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="gray.900">
                User Management
              </Heading>
              <Text color="gray.600">
                Manage users, permissions, and access controls
              </Text>
            </VStack>
          </HStack>

          {/* Filters and Search */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            p={6}
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
            borderColor="gray.200"
            bg="white"
            overflowX="auto"
            // border="1px solid"
            // p={7}

          >
            {loading ? (
              <Flex justify="center" align="center" py={12}>
                <Spinner size="xl" color={brandGold} thickness="3px" />
              </Flex>
            ) : users.length === 0 ? (
              <Box p={8} textAlign="center">
                <Text color="gray.600" fontSize="lg">
                  No users found
                </Text>
                <Text color="gray.500" fontSize="sm" mt={2}>
                  {searchTerm || adminFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No users have been registered yet"}
                </Text>
              </Box>
            ) : (
              <>
                <Box overflowX="auto">
                  <table
                    width="100%"
                    style={{ borderCollapse: "collapse", width: "100%" }}
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
                          }}
                        >
                          Email
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
                          }}
                        >
                          Phone
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
                          }}
                        >
                          Status
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
                          }}
                        >
                          Auth Method
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
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <td
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#1A202C",
                              padding: "16px",
                            }}
                          >
                            {user.fullName || "N/A"}
                          </td>
                          <td
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#4A5568",
                              padding: "16px",
                            }}
                          >
                            {user.email || "N/A"}
                          </td>
                          <td
                            style={{
                              border: "1px solid #E2E8F0",
                              color: "#718096",
                              padding: "16px",
                            }}
                          >
                            {user.phoneNumber || "N/A"}
                          </td>
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
                    justify="space-between"
                    align="center"
                    p={4}
                    borderTop="1px solid"
                    borderColor="gray.200"
                    bg="gray.50"
                  >
                    <Text color="gray.600" fontSize="sm">
                      Showing {(currentPage - 1) * limit + 1} to{" "}
                      {Math.min(currentPage * limit, totalUsers)} of{" "}
                      {totalUsers} users
                    </Text>
                    <HStack spacing={2}>
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
                        size="sm"
                      >
                        <HStack spacing={1}>
                          <FiChevronLeft />
                          <Text>Previous</Text>
                        </HStack>
                      </Button>
                      <Text color="gray.600" fontSize="sm" px={2}>
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
                        size="sm"
                      >
                        <HStack spacing={1}>
                          <Text>Next</Text>
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
