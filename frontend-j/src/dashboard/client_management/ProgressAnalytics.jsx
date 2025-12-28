import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Button,
  Avatar,
  Icon,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart,
  FiPieChart,
  FiDownload,
  FiImage,
  FiCalendar,
  FiUsers,
  FiFileText,
} from 'react-icons/fi';
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
} from 'recharts';

const ProgressAnalytics = () => {
  const [selectedClient, setSelectedClient] = useState('all');

  const weightProgressData = [
    { month: 'Jan', avg: 78, target: 75 },
    { month: 'Feb', avg: 76, target: 75 },
    { month: 'Mar', avg: 75, target: 75 },
  ];

  const adherenceData = [
    { name: 'Excellent (80-100%)', value: 3, color: '#10B981' },
    { name: 'Good (60-79%)', value: 1, color: '#F59E0B' },
    { name: 'Poor (<60%)', value: 1, color: '#EF4444' },
  ];

  const beforeAfterPhotos = [
    {
      id: 1,
      client: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      before: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
      after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300',
      weightLost: 5,
      date: '2024-03-20',
    },
    {
      id: 2,
      client: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      before: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
      after: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300',
      weightLost: 3,
      date: '2024-03-19',
    },
  ];

  const reports = [
    {
      id: 1,
      client: 'Alex Johnson',
      period: 'March 2024',
      weightLost: 2.5,
      workouts: 12,
      adherence: 87,
      status: 'completed',
    },
    {
      id: 2,
      client: 'Sarah Williams',
      period: 'March 2024',
      weightLost: 1.8,
      workouts: 15,
      adherence: 92,
      status: 'completed',
    },
  ];

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6} mb={8}>
        <HStack justify="space-between">
          <Box>
            <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={2}>
              Progress Analytics
            </Text>
            <Text color="gray.600" fontSize="sm" fontWeight="500">
              Comprehensive analytics and reports for client progress
            </Text>
          </Box>
          <Button
            leftIcon={<FiDownload />}
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
            borderRadius="xl"
            fontWeight="700"
          >
            Export Report
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
            <CardBody p={5}>
              <HStack justify="space-between" mb={3}>
                <Box
                  w="48px"
                  h="48px"
                  bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiTrendingDown} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">25kg</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Weight Lost</Text>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
            <CardBody p={5}>
              <HStack justify="space-between" mb={3}>
                <Box
                  w="48px"
                  h="48px"
                  bgGradient="linear(135deg, #3B82F6 0%, #2563EB 100%)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiBarChart} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">78%</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Avg Adherence</Text>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
            <CardBody p={5}>
              <HStack justify="space-between" mb={3}>
                <Box
                  w="48px"
                  h="48px"
                  bgGradient="linear(135deg, #F59E0B 0%, #D97706 100%)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiImage} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{beforeAfterPhotos.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Transformations</Text>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
            <CardBody p={5}>
              <HStack justify="space-between" mb={3}>
                <Box
                  w="48px"
                  h="48px"
                  bgGradient="linear(135deg, #8B5CF6 0%, #7C3AED 100%)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiFileText} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{reports.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Reports Generated</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      <Tabs>
        <TabList>
          <Tab fontWeight="700">Charts & Trends</Tab>
          <Tab fontWeight="700">Before/After Photos</Tab>
          <Tab fontWeight="700">Progress Reports</Tab>
        </TabList>

        <TabPanels>
          {/* Charts */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
              <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
                <CardBody p={6}>
                  <Text fontSize="lg" fontWeight="800" color="gray.900" mb={4}>
                    Weight Progress Trend
                  </Text>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightProgressData}>
                        <defs>
                          <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Area type="monotone" dataKey="avg" stroke="#10B981" strokeWidth={2} fill="url(#colorAvg)" />
                        <Line type="monotone" dataKey="target" stroke="#667eea" strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>

              <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
                <CardBody p={6}>
                  <Text fontSize="lg" fontWeight="800" color="gray.900" mb={4}>
                    Adherence Distribution
                  </Text>
                  <Box h="300px">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={adherenceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {adherenceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </SimpleGrid>
          </TabPanel>

          {/* Before/After Photos */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {beforeAfterPhotos.map((photo) => (
                <motion.div key={photo.id} whileHover={{ scale: 1.02, y: -4 }}>
                  <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
                    <CardBody p={6}>
                      <HStack spacing={3} mb={4}>
                        <Avatar size="sm" name={photo.client} src={photo.avatar} />
                        <Box flex={1}>
                          <Text fontWeight="800" color="gray.900">{photo.client}</Text>
                          <Text fontSize="xs" color="gray.500">{photo.date}</Text>
                        </Box>
                        <Badge
                          bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                          color="white"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                        >
                          -{photo.weightLost}kg
                        </Badge>
                      </HStack>
                      <SimpleGrid columns={2} spacing={4}>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={2} fontWeight="700">BEFORE</Text>
                          <Box
                            h="200px"
                            bgImage={`url(${photo.before})`}
                            bgSize="cover"
                            bgPosition="center"
                            borderRadius="xl"
                          />
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.600" mb={2} fontWeight="700">AFTER</Text>
                          <Box
                            h="200px"
                            bgImage={`url(${photo.after})`}
                            bgSize="cover"
                            bgPosition="center"
                            borderRadius="xl"
                          />
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Reports */}
          <TabPanel>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontWeight="700" color="gray.700">Client</Th>
                      <Th fontWeight="700" color="gray.700">Period</Th>
                      <Th fontWeight="700" color="gray.700">Weight Lost</Th>
                      <Th fontWeight="700" color="gray.700">Workouts</Th>
                      <Th fontWeight="700" color="gray.700">Adherence</Th>
                      <Th fontWeight="700" color="gray.700">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {reports.map((report) => (
                      <Tr key={report.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <Text fontWeight="700" color="gray.900">{report.client}</Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.600">{report.period}</Text>
                        </Td>
                        <Td>
                          <HStack>
                            <Icon as={FiTrendingDown} color="#10B981" boxSize={4} />
                            <Text fontWeight="700" color="gray.900">{report.weightLost}kg</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontWeight="600" color="gray.700">{report.workouts}</Text>
                        </Td>
                        <Td>
                          <Badge
                            bg={report.adherence >= 80 ? '#10B981' : report.adherence >= 60 ? '#F59E0B' : '#EF4444'}
                            color="white"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="700"
                          >
                            {report.adherence}%
                          </Badge>
                        </Td>
                        <Td>
                          <Button
                            leftIcon={<FiDownload />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            borderRadius="lg"
                          >
                            Download
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProgressAnalytics;

