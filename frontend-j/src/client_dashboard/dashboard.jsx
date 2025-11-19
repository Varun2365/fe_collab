import React from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Progress,
  Avatar,
  AvatarGroup,
  Icon,
  Button,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  MdTrendingUp,
  MdPeople,
  MdShoppingCart,
  MdAttachMoney,
  MdVisibility,
  MdThumbUp,
  MdShare,
  MdFavorite,
} from 'react-icons/md';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import Topbar from './topbar';
import Sidebar from './sidebar';

const Dashboard = () => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  
  // Sample Data
  const revenueData = [
    { month: 'Jan', revenue: 45000, users: 2400 },
    { month: 'Feb', revenue: 52000, users: 2800 },
    { month: 'Mar', revenue: 48000, users: 2600 },
    { month: 'Apr', revenue: 61000, users: 3200 },
    { month: 'May', revenue: 55000, users: 2900 },
    { month: 'Jun', revenue: 67000, users: 3400 },
  ];

  const pieData = [
    { name: 'Direct', value: 45, color: '#4299E1' },
    { name: 'Social', value: 30, color: '#48BB78' },
    { name: 'Email', value: 15, color: '#ED8936' },
    { name: 'Referral', value: 10, color: '#9F7AEA' },
  ];

  const statsData = [
    {
      label: 'Total Revenue',
      value: '$125,430',
      change: '+12.5%',
      isPositive: true,
      icon: MdAttachMoney,
      color: 'green',
      bg: 'linear(135deg, green.400, green.600)',
    },
    {
      label: 'Active Users',
      value: '23,456',
      change: '+8.2%',
      isPositive: true,
      icon: MdPeople,
      color: 'blue',
      bg: 'linear(135deg, blue.400, blue.600)',
    },
    {
      label: 'Orders',
      value: '3,456',
      change: '+23.1%',
      isPositive: true,
      icon: MdShoppingCart,
      color: 'purple',
      bg: 'linear(135deg, purple.400, purple.600)',
    },
    {
      label: 'Conversion',
      value: '12.4%',
      change: '-2.3%',
      isPositive: false,
      icon: MdTrendingUp,
      color: 'orange',
      bg: 'linear(135deg, orange.400, orange.600)',
    },
  ];

  const teamData = [
    { name: 'Sarah Chen', role: 'Lead Designer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Mike Johnson', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { name: 'Emily Davis', role: 'Marketing', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  ];

  const projectProgress = [
    { name: 'Website Redesign', progress: 85, color: 'green' },
    { name: 'Mobile App', progress: 62, color: 'blue' },
    { name: 'Marketing Campaign', progress: 94, color: 'purple' },
    { name: 'Data Migration', progress: 38, color: 'orange' },
  ];

  return (
    <Flex h="100vh" bg="linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)">
      <Sidebar />
      
      <Box flex={1} overflow="hidden">
        <Topbar />
        
        <Box p={8} overflowY="auto" h="calc(100vh - 80px)">
          {/* Welcome Header */}
          <Box mb={8}>
            <HStack justify="space-between" align="center" mb={2}>
              <Box>
                <Text fontSize="3xl" fontWeight="black" color="gray.800" mb={1}>
                  Welcome back, Alex! 👋
                </Text>
                <Text color="gray.600" fontSize="lg">
                  Here's what's happening with your business today.
                </Text>
              </Box>
              <Button
                leftIcon={<FiArrowUpRight />}
                colorScheme="brand"
                size="lg"
                borderRadius="xl"
                bgGradient="linear(135deg, brand.400, brand.600)"
                _hover={{
                  bgGradient: "linear(135deg, brand.500, brand.700)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px rgba(30, 230, 30, 0.4)"
                }}
                transition="all 0.3s ease"
                boxShadow="0 8px 20px rgba(30, 230, 30, 0.2)"
              >
                View Reports
              </Button>
            </HStack>
          </Box>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            {statsData.map((stat, index) => (
              <Card
                key={index}
                bg={cardBg}
                backdropFilter="blur(20px)"
                borderRadius="2xl"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
                }}
                transition="all 0.3s ease"
                position="relative"
                overflow="hidden"
              >
                {/* Background Gradient */}
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  w="100px"
                  h="100px"
                  bgGradient={stat.bg}
                  borderRadius="full"
                  opacity={0.1}
                  transform="translate(30px, -30px)"
                />
                
                <CardBody p={6}>
                  <HStack justify="space-between" mb={4}>
                    <Box
                      p={3}
                      borderRadius="xl"
                      bgGradient={stat.bg}
                      boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)"
                    >
                      <Icon as={stat.icon} boxSize={6} color="white" />
                    </Box>
                    <HStack>
                      <Icon 
                        as={stat.isPositive ? FiArrowUpRight : FiArrowDownRight} 
                        color={stat.isPositive ? 'green.500' : 'red.500'} 
                      />
                      <Text 
                        fontSize="sm" 
                        fontWeight="bold"
                        color={stat.isPositive ? 'green.500' : 'red.500'}
                      >
                        {stat.change}
                      </Text>
                    </HStack>
                  </HStack>
                  
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    {stat.label}
                  </Text>
                  <Text fontSize="2xl" fontWeight="black" color="gray.800">
                    {stat.value}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Grid templateColumns="2fr 1fr" gap={8} mb={8}>
            {/* Revenue Chart */}
            <Card
              bg={cardBg}
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.2)"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
            >
              <CardBody p={8}>
                <HStack justify="space-between" mb={6}>
                  <Box>
                    <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
                      Revenue Overview
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      Monthly performance metrics
                    </Text>
                  </Box>
                  <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                    +15.3% vs last month
                  </Badge>
                </HStack>
                
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#48BB78" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#48BB78" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>

            {/* Traffic Sources */}
            <Card
              bg={cardBg}
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.2)"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
            >
              <CardBody p={6}>
                <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={6}>
                  Traffic Sources
                </Text>
                
                <Box h="200px" mb={6}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <VStack spacing={3} align="stretch">
                  {pieData.map((item, index) => (
                    <HStack key={index} justify="space-between">
                      <HStack>
                        <Box w={3} h={3} bg={item.color} borderRadius="full" />
                        <Text fontSize="sm" color="gray.600">{item.name}</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold">{item.value}%</Text>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          <Grid templateColumns="1fr 1fr" gap={8}>
            {/* Team Members */}
            <Card
              bg={cardBg}
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.2)"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
            >
              <CardBody p={6}>
                <HStack justify="space-between" mb={6}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    Team Members
                  </Text>
                  <AvatarGroup size="sm" max={3}>
                    {teamData.map((member, index) => (
                      <Avatar key={index} src={member.avatar} />
                    ))}
                  </AvatarGroup>
                </HStack>

                <VStack spacing={4} align="stretch">
                  {teamData.map((member, index) => (
                    <HStack key={index} justify="space-between" p={3} borderRadius="lg" _hover={{ bg: "gray.50" }}>
                      <HStack>
                        <Avatar size="sm" src={member.avatar} />
                        <Box>
                          <Text fontSize="sm" fontWeight="bold">{member.name}</Text>
                          <Text fontSize="xs" color="gray.500">{member.role}</Text>
                        </Box>
                      </HStack>
                      <Badge colorScheme="green" borderRadius="full">Active</Badge>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Project Progress */}
            <Card
              bg={cardBg}
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.2)"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
            >
              <CardBody p={6}>
                <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={6}>
                  Project Progress
                </Text>

                <VStack spacing={5} align="stretch">
                  {projectProgress.map((project, index) => (
                    <Box key={index}>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">{project.name}</Text>
                        <Text fontSize="sm" fontWeight="bold" color={`${project.color}.500`}>
                          {project.progress}%
                        </Text>
                      </HStack>
                      <Progress 
                        value={project.progress} 
                        colorScheme={project.color}
                        borderRadius="full"
                        size="sm"
                        bg="gray.100"
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
