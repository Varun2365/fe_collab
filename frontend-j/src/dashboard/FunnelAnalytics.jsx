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
import { funnelAnalyticsAPI } from '../services/api';

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
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('visitors');
  const [analyticsData, setAnalyticsData] = useState(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  // Calculate date range based on timeRange
  const getDateRange = (range) => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  };

  // Fetch analytics data
  useEffect(() => {
    if (!funnelId) {
      setError('Funnel ID is required');
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const { startDate, endDate } = getDateRange(timeRange);
        const response = await funnelAnalyticsAPI.getFunnelAnalytics(funnelId, startDate, endDate);
        
        if (response.success && response.data) {
          setAnalyticsData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch analytics');
        }
      } catch (err) {
        console.error('Error fetching funnel analytics:', err);
        setError(err.message || 'Failed to load analytics data');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load analytics data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [funnelId, timeRange, toast]);

  const getChartData = () => {
    if (!analyticsData?.dailyTrends || analyticsData.dailyTrends.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = analyticsData.dailyTrends.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    switch (selectedMetric) {
      case 'visitors':
        return {
          labels,
          datasets: [{
            label: 'Visitors',
            data: analyticsData.dailyTrends.map(item => item.views || 0),
            borderColor: '#3182ce',
            backgroundColor: 'rgba(49, 130, 206, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      case 'conversions':
        return {
          labels,
          datasets: [{
            label: 'Conversions',
            data: analyticsData.dailyTrends.map(item => item.conversions || 0),
            borderColor: '#38a169',
            backgroundColor: 'rgba(56, 161, 105, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      case 'uniqueVisitors':
        return {
          labels,
          datasets: [{
            label: 'Unique Visitors',
            data: analyticsData.dailyTrends.map(item => item.uniqueVisitors || 0),
            borderColor: '#805ad5',
            backgroundColor: 'rgba(128, 90, 213, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  const getStageChartData = () => {
    if (!analyticsData?.stageAnalytics || analyticsData.stageAnalytics.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    const stageData = analyticsData.stageAnalytics.map(stage => {
      const conversionRate = stage.totalViews > 0 
        ? ((stage.uniqueVisitors / stage.totalViews) * 100).toFixed(1)
        : 0;
      return parseFloat(conversionRate);
    });
    
    return {
      labels: analyticsData.stageAnalytics.map((_, index) => `Stage ${index + 1}`),
      datasets: [{
        label: 'Views',
        data: analyticsData.stageAnalytics.map(stage => stage.totalViews || 0),
        backgroundColor: [
          '#3182ce',
          '#38a169',
          '#d69e2e',
          '#e53e3e',
          '#805ad5',
          '#ed8936',
          '#319795'
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
        <Text fontSize="xl" fontWeight="semibold" color={textColor}>Loading Analytics...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={20}>
        <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" mb={4} />
        <Text fontSize="xl" fontWeight="semibold" color={textColor} mb={2}>
          Error Loading Analytics
        </Text>
        <Text color={secondaryTextColor} mb={4}>{error}</Text>
        <Button colorScheme="brand" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="xl" fontWeight="semibold" color={textColor}>
          No analytics data available
        </Text>
      </Box>
    );
  }

  const overall = analyticsData.overall || { totalViews: 0, uniqueVisitors: 0 };
  const leadsCaptured = analyticsData.leadsCaptured || 0;
  const conversionRate = overall.uniqueVisitors > 0 
    ? ((leadsCaptured / overall.uniqueVisitors) * 100).toFixed(2)
    : 0;

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="lg" color={textColor}>
              {analyticsData.funnelInfo?.name || 'Funnel'} Analytics
            </Heading>
            <Text color={secondaryTextColor}>Detailed performance insights and optimization recommendations</Text>
          </Box>
          
          <HStack spacing={4}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              variant="filled"
              minW="120px"
              bg={bgColor}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </Select>
          </HStack>
        </Flex>
      </Box>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        <Card bg={bgColor}>
          <CardBody>
            <Stat>
              <StatLabel color={secondaryTextColor}>Total Views</StatLabel>
              <StatNumber color={textColor}>{overall.totalViews?.toLocaleString() || 0}</StatNumber>
              <StatHelpText color={secondaryTextColor}>
                <Icon as={FaEye} mr={1} />
                Page views
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={bgColor}>
          <CardBody>
            <Stat>
              <StatLabel color={secondaryTextColor}>Unique Visitors</StatLabel>
              <StatNumber color={textColor}>{overall.uniqueVisitors?.toLocaleString() || 0}</StatNumber>
              <StatHelpText color={secondaryTextColor}>
                <Icon as={FaUsers} mr={1} />
                Unique sessions
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={bgColor}>
          <CardBody>
            <Stat>
              <StatLabel color={secondaryTextColor}>Leads Captured</StatLabel>
              <StatNumber color={textColor}>{leadsCaptured}</StatNumber>
              <StatHelpText color={secondaryTextColor}>
                Form submissions
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={bgColor}>
          <CardBody>
            <Stat>
              <StatLabel color={secondaryTextColor}>Conversion Rate</StatLabel>
              <StatNumber color={textColor}>{conversionRate}%</StatNumber>
              <StatHelpText color={secondaryTextColor}>
                Visitors to leads
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Performance Trends */}
      <Card mb={6} bg={bgColor}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md" color={textColor}>Performance Trends</Heading>
            <Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              variant="filled"
              minW="150px"
              bg={bgColor}
            >
              <option value="visitors">Views</option>
              <option value="uniqueVisitors">Unique Visitors</option>
              <option value="conversions">Conversions</option>
            </Select>
          </Flex>
        </CardHeader>
        <CardBody>
          {analyticsData.dailyTrends && analyticsData.dailyTrends.length > 0 ? (
            <Box h="400px">
              <Line data={getChartData()} options={chartOptions} />
            </Box>
          ) : (
            <Box textAlign="center" py={10}>
              <Text color={secondaryTextColor}>No trend data available for the selected period</Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Funnel Stages Performance */}
      {analyticsData.stageAnalytics && analyticsData.stageAnalytics.length > 0 && (
        <Card mb={6} bg={bgColor}>
          <CardHeader>
            <Heading size="md" color={textColor}>Funnel Stages Performance</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color={textColor}>Stage Views</Text>
                <Box h="300px">
                  <Bar data={getStageChartData()} options={chartOptions} />
                </Box>
              </Box>
              
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color={textColor}>Stage Breakdown</Text>
                <VStack spacing={3} align="stretch">
                  {analyticsData.stageAnalytics.map((stage, index) => {
                    const conversionRate = stage.totalViews > 0 
                      ? ((stage.uniqueVisitors / stage.totalViews) * 100).toFixed(1)
                      : 0;
                    return (
                      <Box key={index}>
                        <Flex justify="space-between" align="center" mb={2}>
                          <Text fontWeight="medium" color={textColor}>Stage {index + 1}</Text>
                          <Text fontSize="sm" color={secondaryTextColor}>
                            {stage.totalViews} views, {stage.uniqueVisitors} unique
                          </Text>
                        </Flex>
                        <Progress 
                          value={parseFloat(conversionRate)} 
                          size="lg" 
                          colorScheme="brand"
                          borderRadius="full"
                        />
                        <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                          Engagement: {conversionRate}%
                        </Text>
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Additional Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md" color={textColor}>Additional Metrics</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color={secondaryTextColor} mb={1}>Appointments Booked</Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {analyticsData.appointmentsBooked || 0}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color={secondaryTextColor} mb={1}>Products Purchased</Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {analyticsData.productsPurchased || 0}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color={secondaryTextColor} mb={1}>Funnel Completions</Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {analyticsData.funnelCompletionCount || 0}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color={secondaryTextColor} mb={1}>Completion Rate</Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {analyticsData.funnelCompletionRate?.toFixed(2) || 0}%
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {analyticsData.hourlyBreakdown && analyticsData.hourlyBreakdown.length > 0 && (
          <Card bg={bgColor}>
            <CardHeader>
              <Heading size="md" color={textColor}>Last 24 Hours</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={2} align="stretch">
                {analyticsData.hourlyBreakdown.map((hour, index) => (
                  <Box key={index}>
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontSize="sm" color={textColor}>
                        {hour.hour}:00
                      </Text>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        {hour.views} views
                      </Text>
                    </Flex>
                    <Progress 
                      value={(hour.views / Math.max(...analyticsData.hourlyBreakdown.map(h => h.views))) * 100} 
                      size="sm" 
                      colorScheme="brand"
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default FunnelAnalytics;
