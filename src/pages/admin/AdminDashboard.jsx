import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiUsers, FiBook, FiBarChart2, FiDollarSign } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { brandGold } from "../../theme/colors";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
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

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // Static data for charts
  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 180 },
    { month: "Mar", users: 240 },
    { month: "Apr", users: 320 },
    { month: "May", users: 410 },
    { month: "Jun", users: 520 },
    { month: "Jul", users: 650 },
    { month: "Aug", users: 780 },
    { month: "Sep", users: 920 },
    { month: "Oct", users: 1100 },
    { month: "Nov", users: 1280 },
    { month: "Dec", users: 1450 },
  ];

  const ebookPerformanceData = [
    { name: "Fitness Basics", sales: 245, views: 3200 },
    { name: "Nutrition Guide", sales: 189, views: 2800 },
    { name: "Strength Training", sales: 312, views: 4100 },
    { name: "Cardio Mastery", sales: 156, views: 2100 },
    { name: "Yoga Fundamentals", sales: 278, views: 3500 },
    { name: "Recovery Methods", sales: 134, views: 1800 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 2400 },
    { month: "Feb", revenue: 3800 },
    { month: "Mar", revenue: 5200 },
    { month: "Apr", revenue: 6800 },
    { month: "May", revenue: 8500 },
    { month: "Jun", revenue: 10200 },
    { month: "Jul", revenue: 12400 },
    { month: "Aug", revenue: 14800 },
    { month: "Sep", revenue: 17200 },
    { month: "Oct", revenue: 19800 },
    { month: "Nov", revenue: 22800 },
    { month: "Dec", revenue: 26000 },
  ];

  const userDistributionData = [
    { name: "Free Tier", value: 850, color: "#718096" },
    { name: "Premium", value: 420, color: "#D4AF37" },
    { name: "Enterprise", value: 180, color: "#2D3748" },
  ];

  const COLORS = ["#718096", "#D4AF37", "#2D3748"];

  const stats = [
    {
      label: "Total Users",
      value: "1,450",
      change: "+12.5%",
      icon: FiUsers,
      trend: "up",
    },
    {
      label: "E-Books",
      value: "24",
      change: "+3 this month",
      icon: FiBook,
      trend: "up",
    },
    {
      label: "Total Revenue",
      value: "$26,000",
      change: "+18.2%",
      icon: FiDollarSign,
      trend: "up",
    },
    {
      label: "Growth Rate",
      value: "23.4%",
      change: "+4.1%",
      icon: FiBarChart2,
      trend: "up",
    },
  ];

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="gray.900">
              Dashboard
            </Heading>
            <Text color="gray.600">
              Welcome back, {currentUser?.name || currentUser?.email || "Admin"}
            </Text>
          </VStack>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Box
                  key={index}
                  borderRadius="none"
                  border="1px solid"
                  borderColor="gray.200"
                  p={6}
                  bg="white"
                  _hover={{
                    borderColor: brandGold,
                    boxShadow: "0 4px 12px rgba(212, 175, 55, 0.1)",
                  }}
                  transition="all 0.2s"
                >
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="100%">
                      <Box color={brandGold} fontSize="2xl">
                        <IconComponent />
                      </Box>
                      <Text
                        fontSize="xs"
                        color={stat.trend === "up" ? "green.500" : "red.500"}
                        fontWeight="medium"
                      >
                        {stat.change}
                      </Text>
                    </HStack>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        {stat.label}
                      </Text>
                      <Heading size="2xl" color="gray.900">
                        {stat.value}
                      </Heading>
                    </VStack>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Charts Row 1: User Growth & Revenue */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* User Growth Line Chart */}
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={4}>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.900">
                    User Growth
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Monthly user acquisition trend
                  </Text>
                </VStack>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="month"
                        stroke="#718096"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#718096"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "4px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke={brandGold}
                        strokeWidth={3}
                        dot={{ fill: brandGold, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Total Users"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </Box>

            {/* Revenue Area Chart */}
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={4}>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.900">
                    Revenue Trend
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Monthly revenue in USD
                  </Text>
                </VStack>
                <Box w="100%" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={brandGold} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={brandGold} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="month"
                        stroke="#718096"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#718096"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "4px",
                        }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={brandGold}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Charts Row 2: E-Book Performance & User Distribution */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* E-Book Performance Bar Chart */}
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={4}>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.900">
                    E-Book Performance
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Sales and views by title
                  </Text>
                </VStack>
                <Box w="100%" h="350px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ebookPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        stroke="#718096"
                        fontSize={11}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis stroke="#718096" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "4px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar
                        dataKey="sales"
                        fill={brandGold}
                        radius={[4, 4, 0, 0]}
                        name="Sales"
                      />
                      <Bar
                        dataKey="views"
                        fill="#718096"
                        radius={[4, 4, 0, 0]}
                        name="Views"
                        opacity={0.7}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </Box>

            {/* User Distribution Pie Chart */}
            <Box
              borderRadius="none"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              bg="white"
            >
              <VStack align="start" spacing={4}>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.900">
                    User Distribution
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Users by subscription tier
                  </Text>
                </VStack>
                <Box w="100%" h="350px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "4px",
                        }}
                        formatter={(value) => `${value} users`}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "12px" }}
                        formatter={(value) => {
                          const data = userDistributionData.find(
                            (d) => d.name === value
                          );
                          return `${value} (${data?.value} users)`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
