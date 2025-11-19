import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Spinner,
  Badge,
  Icon,
  useToast,
  Flex,
  HStack,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Divider,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDownload,
  FaFilter,
  FaCalendar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FunnelAnalytics = ({ funnelId }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('conversions');
  
  // Mock analytics data
  const mockAnalytics = {
    overview: {
      totalVisitors: 1250,
      totalConversions: 6,
      conversionRate: 0.48,
      revenue: 18000,
      cost: 2500,
      roi: 620,
      avgOrderValue: 3000,
      costPerAcquisition: 416.67,
      revenuePerVisitor: 14.4
    },
    trends: {
      labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
      visitors: [120, 135, 142, 118, 156, 168, 145],
      conversions: [0, 1, 0, 1, 2, 1, 1],
      revenue: [0, 3000, 0, 3000, 6000, 3000, 3000]
    },
    stagePerformance: [
      { name: 'Landing Page', visitors: 1250, conversions: 89, rate: 7.12, dropoff: 0 },
      { name: 'Video Sales Letter', visitors: 89, conversions: 34, rate: 38.2, dropoff: 61.8 },
      { name: 'Application Form', visitors: 34, conversions: 12, rate: 35.3, dropoff: 64.7 },
      { name: 'Discovery Call', visitors: 12, conversions: 8, rate: 66.7, dropoff: 33.3 },
      { name: 'Enrollment', visitors: 8, conversions: 6, rate: 75.0, dropoff: 25.0 }
    ],
    trafficSources: [
      { source: 'Facebook Ads', visitors: 450, conversions: 3, rate: 0.67 },
      { source: 'Google Ads', visitors: 380, conversions: 2, rate: 0.53 },
      { source: 'Organic Search', visitors: 220, conversions: 1, rate: 0.45 },
      { source: 'Email Marketing', visitors: 200, conversions: 0, rate: 0.00 }
    ],
    deviceBreakdown: [
      { device: 'Mobile', visitors: 750, conversions: 4, rate: 0.53 },
      { device: 'Desktop', visitors: 400, conversions: 2, rate: 0.50 },
      { device: 'Tablet', visitors: 100, conversions: 0, rate: 0.00 }
    ],
    geographicData: [
      { location: 'Mumbai', visitors: 320, conversions: 2, rate: 0.63 },
      { location: 'Delhi', visitors: 280, conversions: 2, rate: 0.71 },
      { location: 'Bangalore', visitors: 220, conversions: 1, rate: 0.45 },
      { location: 'Chennai', visitors: 180, conversions: 1, rate: 0.56 },
      { location: 'Other', visitors: 250, conversions: 0, rate: 0.00 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [funnelId]);

  const getChartData = () => {
    const { trends } = mockAnalytics;
    
    switch (selectedMetric) {
      case 'visitors':
        return {
          labels: trends.labels,
          datasets: [{
            label: 'Visitors',
            data: trends.visitors,
            borderColor: '#3182ce',
            backgroundColor: 'rgba(49, 130, 206, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      case 'conversions':
        return {
          labels: trends.labels,
          datasets: [{
            label: 'Conversions',
            data: trends.conversions,
            borderColor: '#38a169',
            backgroundColor: 'rgba(56, 161, 105, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      case 'revenue':
        return {
          labels: trends.labels,
          datasets: [{
            label: 'Revenue (₹)',
            data: trends.revenue,
            borderColor: '#d69e2e',
            backgroundColor: 'rgba(214, 158, 46, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  const getStageChartData = () => {
    const { stagePerformance } = mockAnalytics;
    
    return {
      labels: stagePerformance.map(stage => stage.name),
      datasets: [{
        label: 'Conversion Rate (%)',
        data: stagePerformance.map(stage => stage.rate),
        backgroundColor: [
          '#3182ce',
          '#38a169',
          '#d69e2e',
          '#e53e3e',
          '#805ad5'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  };

  const getTrafficSourceData = () => {
    const { trafficSources } = mockAnalytics;
    
    return {
      labels: trafficSources.map(source => source.source),
      datasets: [{
        label: 'Visitors',
        data: trafficSources.map(source => source.visitors),
        backgroundColor: [
          '#3182ce',
          '#38a169',
          '#d69e2e',
          '#e53e3e'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3182ce',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="brand.500" mb={4} />
        <Text fontSize="xl" fontWeight="semibold">Loading Analytics...</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="lg" color="gray.800">Funnel Analytics</Heading>
            <Text color="gray.600">Detailed performance insights and optimization recommendations</Text>
          </Box>
          
          <HStack spacing={4}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              variant="filled"
              minW="120px"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </Select>
            
            <Button leftIcon={<FaDownload />} variant="outline" colorScheme="brand">
              Export Report
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Visitors</StatLabel>
              <StatNumber>{mockAnalytics.overview.totalVisitors.toLocaleString()}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% from last period
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Conversions</StatLabel>
              <StatNumber>{mockAnalytics.overview.totalConversions}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8% from last period
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Conversion Rate</StatLabel>
              <StatNumber>{mockAnalytics.overview.conversionRate.toFixed(2)}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5% from last period
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Revenue</StatLabel>
              <StatNumber>₹{mockAnalytics.overview.revenue.toLocaleString()}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23% from last period
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Performance Trends */}
      <Card mb={6}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Performance Trends</Heading>
            <Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              variant="filled"
              minW="150px"
            >
              <option value="visitors">Visitors</option>
              <option value="conversions">Conversions</option>
              <option value="revenue">Revenue</option>
            </Select>
          </Flex>
        </CardHeader>
        <CardBody>
          <Box h="400px">
            <Line data={getChartData()} options={chartOptions} />
          </Box>
        </CardBody>
      </Card>

      {/* Funnel Stages Performance */}
      <Card mb={6}>
        <CardHeader>
          <Heading size="md">Funnel Stages Performance</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Stage Conversion Rates</Text>
              <Box h="300px">
                <Bar data={getStageChartData()} options={chartOptions} />
              </Box>
            </Box>
            
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Stage Breakdown</Text>
              <VStack spacing={3} align="stretch">
                {mockAnalytics.stagePerformance.map((stage, index) => (
                  <Box key={index}>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="medium">{stage.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {stage.visitors} → {stage.conversions} ({stage.rate}%)
                      </Text>
                    </Flex>
                    <Progress 
                      value={stage.rate} 
                      size="lg" 
                      colorScheme="brand"
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Dropoff: {stage.dropoff}%
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Traffic Sources & Device Breakdown */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Traffic Sources</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <Doughnut 
                data={getTrafficSourceData()} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: true,
                      position: 'bottom'
                    }
                  }
                }} 
              />
            </Box>
            
            <VStack spacing={3} align="stretch" mt={4}>
              {mockAnalytics.trafficSources.map((source, index) => (
                <Flex key={index} justify="space-between" align="center">
                  <Text>{source.source}</Text>
                  <HStack spacing={4}>
                    <Text fontSize="sm" color="gray.500">
                      {source.visitors} visitors
                    </Text>
                    <Badge colorScheme={source.rate > 0.5 ? 'green' : 'red'} variant="subtle">
                      {source.rate}% conv.
                    </Badge>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <Heading size="md">Device Breakdown</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {mockAnalytics.deviceBreakdown.map((device, index) => (
                <Box key={index}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="medium">{device.device}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {device.visitors} visitors
                    </Text>
                  </Flex>
                  <Progress 
                    value={(device.visitors / mockAnalytics.overview.totalVisitors) * 100} 
                    size="lg" 
                    colorScheme="brand"
                    borderRadius="full"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Conversion Rate: {device.rate}%
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Geographic Performance */}
      <Card mb={6}>
        <CardHeader>
          <Heading size="md">Geographic Performance</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Location</Th>
                <Th>Visitors</Th>
                <Th>Conversions</Th>
                <Th>Conversion Rate</Th>
                <Th>Performance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockAnalytics.geographicData.map((location, index) => (
                <Tr key={index}>
                  <Td fontWeight="medium">{location.location}</Td>
                  <Td>{location.visitors.toLocaleString()}</Td>
                  <Td>{location.conversions}</Td>
                  <Td>{location.rate}%</Td>
                  <Td>
                    <Badge 
                      colorScheme={location.rate > 0.5 ? 'green' : location.rate > 0.3 ? 'yellow' : 'red'} 
                      variant="subtle"
                    >
                      {location.rate > 0.5 ? 'High' : location.rate > 0.3 ? 'Medium' : 'Low'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <Heading size="md">Optimization Recommendations</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning">
              <AlertIcon />
              <Box>
                <Text fontWeight="semibold">High Dropoff at Video Sales Letter</Text>
                <Text fontSize="sm">
                  Consider A/B testing different video lengths and messaging to improve engagement
                </Text>
              </Box>
            </Alert>
            
            <Alert status="info">
              <AlertIcon />
              <Box>
                <Text fontWeight="semibold">Mobile Performance Optimization</Text>
                <Text fontSize="sm">
                  Mobile visitors have 0% conversion rate. Review mobile user experience and page speed
                </Text>
              </Box>
            </Alert>
            
            <Alert status="success">
              <AlertIcon />
              <Box>
                <Text fontWeight="semibold">Strong Discovery Call Performance</Text>
                <Text fontSize="sm">
                  Discovery call stage has excellent conversion rate. Consider expanding this stage
                </Text>
              </Box>
            </Alert>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default FunnelAnalytics;
