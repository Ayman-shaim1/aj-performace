import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiBarChart2, FiTrendingUp, FiUsers, FiBook } from "react-icons/fi";
import { brandGold } from "../../theme/colors";

export default function AdminDashboard() {
  // Fake static data for charts
  const barChartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 450 },
    { name: "May", value: 600 },
    { name: "Jun", value: 550 },
  ];

  const lineChartData = [
    { name: "Week 1", users: 120, downloads: 80 },
    { name: "Week 2", users: 190, downloads: 120 },
    { name: "Week 3", users: 300, downloads: 180 },
    { name: "Week 4", users: 280, downloads: 200 },
    { name: "Week 5", users: 390, downloads: 250 },
  ];

  const pieChartData = [
    { name: "E-Books", value: 35 },
    { name: "Courses", value: 25 },
    { name: "Consulting", value: 20 },
    { name: "Other", value: 20 },
  ];

  const COLORS = [brandGold, "#805AD5", "#3182CE", "#38A169"];

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <Box color={brandGold} fontSize="3xl">
              <FiBarChart2 />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="gray.900">
                Dashboard
              </Heading>
              <Text color="gray.600">
                Overview of your platform performance
              </Text>
            </VStack>
          </HStack>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiTrendingUp />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Revenue
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  $12,450
                </Heading>
                <Text fontSize="xs" color="green.500">
                  +12.5% from last month
                </Text>
              </VStack>
            </Box>

            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiUsers />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Active Users
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  1,234
                </Heading>
                <Text fontSize="xs" color="green.500">
                  +8.2% from last month
                </Text>
              </VStack>
            </Box>

            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiBook />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total E-Books
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  48
                </Heading>
                <Text fontSize="xs" color="green.500">
                  +3 new this month
                </Text>
              </VStack>
            </Box>

            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box color={brandGold} fontSize="2xl">
                    <FiTrendingUp />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Downloads
                  </Text>
                </HStack>
                <Heading size="2xl" color="gray.900">
                  2,890
                </Heading>
                <Text fontSize="xs" color="green.500">
                  +15.3% from last month
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Charts Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Bar Chart */}
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={4}>
                <Heading size="md" color="gray.900">
                  Monthly Sales
                </Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={brandGold} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </Box>

            {/* Line Chart */}
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={4}>
                <Heading size="md" color="gray.900">
                  Weekly Growth
                </Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke={brandGold}
                        strokeWidth={2}
                        name="Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="downloads"
                        stroke="#805AD5"
                        strokeWidth={2}
                        name="Downloads"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Pie Chart */}
          <Box
            borderRadius="none"
            border="1px solid"
            borderColor="gray.200"
            p={6}
            bg="white"
          >
            <VStack align="start" spacing={4}>
              <Heading size="md" color="gray.900">
                Revenue by Category
              </Heading>
              <Box w="100%" h="300px" display="flex" justifyContent="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
