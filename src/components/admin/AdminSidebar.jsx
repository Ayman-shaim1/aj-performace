import {
  Box,
  VStack,
  Text,
  Button,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPositioner,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { brandGold } from "../../theme/colors";
import { logout } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useState } from "react";

const menuItems = [
  { icon: FiHome, label: "Dashboard", path: "/admin/dashboard" },
  { icon: FiUsers, label: "Users", path: "/admin/users" },
  { icon: FiBook, label: "E-Books", path: "/admin/ebooks" },
  { icon: FiBarChart2, label: "Orders", path: "/admin/orders" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, checkAuth } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const breakpoint = useBreakpointValue({ base: true, lg: false });
  const showTooltips = Boolean(breakpoint);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccessToast(null, "You have been logged out successfully.");
      checkAuth();
      navigate("/admin/login");
    } catch (error) {
      showErrorToast(
        "Error",
        error.message || "Failed to logout. Please try again."
      );
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Box w={{ base: "70px", lg: "280px" }} bg={"gray.700"} zIndex={1000} p={0}>
      <VStack h="100%" w="100%" align="stretch" p={0}>
        {/* Logo/Header Section */}
        <Box
          p={{ base: 6, lg: 10 }}
          borderBottom="1px solid"
          borderColor="gray.200"
        ></Box>

        {/* Navigation Menu */}
        <Box flex={1} width="100%">
          <VStack align="stretch" spacing={0} width="100%">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              const IconComponent = item.icon;

              return (
                <Box
                  key={item.path}
                  position="relative"
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {showTooltips ? (
                    <TooltipRoot openDelay={300}>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleNavigation(item.path)}
                          justifyContent={{ base: "center", lg: "flex-start" }}
                          borderRadius="none"
                          bg={active ? brandGold : "transparent"}
                          color={active ? "white" : "gray.700"}
                          _hover={{
                            bg: active ? brandGold : "gray.800",
                            color: active ? "white" : "gray.900",
                          }}
                          fontWeight={active ? "semibold" : "normal"}
                          px={{ base: 0, lg: 4 }}
                          py={4}
                          h="auto"
                          w="100%"
                          transition="none"
                        >
                          <IconComponent
                            size={18}
                            color={active ? "white" : "white"}
                          />
                          <Text
                            display={{ base: "none", lg: "block" }}
                            ml={2}
                            fontSize="sm"
                            color={active ? "white" : "white"}
                          >
                            {item.label}
                          </Text>
                        </Button>
                      </TooltipTrigger>
                      <TooltipPositioner>
                        <TooltipContent>{item.label}</TooltipContent>
                      </TooltipPositioner>
                    </TooltipRoot>
                  ) : (
                    <Button
                      onClick={() => handleNavigation(item.path)}
                      justifyContent={{ base: "center", lg: "flex-start" }}
                      borderRadius="none"
                      bg={active ? brandGold : "transparent"}
                      color={active ? "white" : "gray.700"}
                      _hover={{
                        bg: active ? brandGold : "gray.800",
                        color: active ? "white" : "gray.900",
                      }}
                      fontWeight={active ? "semibold" : "normal"}
                      px={{ base: 0, lg: 4 }}
                      py={4}
                      h="auto"
                      w="100%"
                      transition="none"
                    >
                      <IconComponent
                        size={18}
                        color={active ? "white" : "white"}
                      />
                      <Text
                        display={{ base: "none", lg: "block" }}
                        ml={2}
                        fontSize="sm"
                        color={active ? "white" : "white"}
                      >
                        {item.label}
                      </Text>
                    </Button>
                  )}
                </Box>
              );
            })}
          </VStack>
        </Box>

        {/* Logout Button */}
        <Box
          borderTop="1px solid"
          borderColor="gray.200"
          position="relative"
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {showTooltips ? (
            <TooltipRoot openDelay={300}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  borderRadius="none"
                  bg="transparent"
                  color="red.500"
                  _hover={{
                    bg: "red.700",
                    color: "white",
                  }}
                  justifyContent={{ base: "center", lg: "flex-start" }}
                  px={{ base: 0, lg: 4 }}
                  py={4}
                  h="auto"
                  minW={{ base: "70px", lg: "auto" }}
                  transition="none"
                  fontWeight="normal"
                  width="100%"
                >
                  <FiLogOut size={18} color="red.500" />
                  <Text
                    display={{ base: "none", lg: "block" }}
                    ml={2}
                    fontSize="sm"
                  >
                    Logout
                  </Text>
                </Button>
              </TooltipTrigger>
              <TooltipPositioner>
                <TooltipContent>Logout</TooltipContent>
              </TooltipPositioner>
            </TooltipRoot>
          ) : (
            <Button
              onClick={handleLogout}
              borderRadius="none"
              bg="transparent"
              color="red.500"
              _hover={{
                bg: "red.700",
                color: "white",
              }}
              justifyContent={{ base: "center", lg: "flex-start" }}
              px={{ base: 0, lg: 4 }}
              py={4}
              h="auto"
              minW={{ base: "70px", lg: "auto" }}
              transition="none"
              fontWeight="normal"
              width="100%"
            >
              <FiLogOut size={18} color="red.500" />
              <Text
                display={{ base: "none", lg: "block" }}
                ml={2}
                fontSize="sm"
              >
                Logout
              </Text>
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
