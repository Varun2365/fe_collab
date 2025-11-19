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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Switch,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorModeValue,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaEye,
  FaEdit,
  FaChartLine,
  FaCopy,
  FaShare,
  FaTrash,
  FaPlay,
  FaPause,
  FaExternalLinkAlt,
  FaUsers,
  FaMoneyBillWave,
  // FaTarget,
  FaChartBar,
} from 'react-icons/fa';
import FunnelBuilder from './FunnelBuilder';
import FunnelAnalytics from './FunnelAnalytics';

const Funnels = () => {
  const toast = useToast();
  const [funnels, setFunnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunnel, setSelectedFunnel] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState(null);
  const [viewingAnalytics, setViewingAnalytics] = useState(null);

  // Color scheme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  // Mock data
  const mockFunnels = [
    {
      id: '1',
      name: 'Weight Loss Masterclass',
      description: 'Complete weight loss transformation program',
      status: 'active',
      type: 'sales',
      targetAudience: 'Fitness enthusiasts 25-40',
      stageCount: 5,
      conversionRate: 3.2,
      revenue: 45000,
      roi: 280,
      isActive: true,
      createdAt: '2024-01-15',
      lastModified: '2024-01-20'
    },
    {
      id: '2',
      name: 'Business Coaching Program',
      description: 'High-ticket business coaching funnel',
      status: 'draft',
      type: 'consultation',
      targetAudience: 'Entrepreneurs & Business owners',
      stageCount: 4,
      conversionRate: 0,
      revenue: 0,
      roi: 0,
      isActive: false,
      createdAt: '2024-01-10',
      lastModified: '2024-01-18'
    },
    {
      id: '3',
      name: 'Mindfulness Course',
      description: 'Stress relief and mindfulness training',
      status: 'active',
      type: 'course',
      targetAudience: 'Professionals 30-50',
      stageCount: 6,
      conversionRate: 2.8,
      revenue: 28000,
      roi: 190,
      isActive: true,
      createdAt: '2024-01-05',
      lastModified: '2024-01-22'
    },
    {
      id: '4',
      name: 'Real Estate Investment',
      description: 'Property investment coaching funnel',
      status: 'paused',
      type: 'sales',
      targetAudience: 'Investors 35-55',
      stageCount: 5,
      conversionRate: 1.5,
      revenue: 15000,
      roi: 120,
      isActive: false,
      createdAt: '2024-01-12',
      lastModified: '2024-01-19'
    }
  ];

  const mockAutomationRules = [
    { id: 'rule-1', name: 'Lead Welcome Sequence' },
    { id: 'rule-2', name: 'Cart Abandon Recovery' },
    { id: 'rule-3', name: 'Webinar Reminder Series' },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFunnels(mockFunnels);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateFunnel = () => {
    setEditingFunnel(null);
    setShowBuilder(true);
  };

  const handleEditFunnel = (funnel) => {
    setEditingFunnel(funnel);
    setShowBuilder(true);
  };

  const handleDeleteFunnel = (funnelId) => {
    setFunnels(funnels.filter(f => f.id !== funnelId));
    toast({
      title: 'Funnel deleted',
      description: 'The funnel has been successfully deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleViewAnalytics = (funnel) => {
    setViewingAnalytics(funnel);
    setShowAnalytics(true);
  };

  const handleSaveFunnel = (funnelData) => {
    if (editingFunnel) {
      // Update existing funnel
      setFunnels(funnels.map(f => 
        f.id === editingFunnel.id ? { ...f, ...funnelData } : f
      ));
      toast({
        title: 'Funnel updated',
        description: 'The funnel has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Create new funnel
      const newFunnel = {
        ...funnelData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setFunnels([...funnels, newFunnel]);
      toast({
        title: 'Funnel created',
        description: 'The new funnel has been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setShowBuilder(false);
    setEditingFunnel(null);
  };

  const handleToggleActive = (funnelId) => {
    setFunnels(funnels.map(f => 
      f.id === funnelId ? { ...f, isActive: !f.isActive } : f
    ));
  };

  const filteredFunnels = funnels.filter(funnel => {
    const matchesSearch = funnel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funnel.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || funnel.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedFunnels = [...filteredFunnels].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'conversionRate':
        return b.conversionRate - a.conversionRate;
      case 'revenue':
        return b.revenue - a.revenue;
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'draft': return 'gray';
      case 'paused': return 'yellow';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sales': return 'blue';
      case 'consultation': return 'purple';
      case 'course': return 'teal';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return FaPlay;
      case 'draft': return FaEdit;
      case 'paused': return FaPause;
      default: return FaEdit;
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="brand.500" mb={4} />
        <Text fontSize="xl" fontWeight="semibold">Loading Funnels...</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="lg" color={textColor}>Funnel Management</Heading>
          </Box>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="brand"
            size="lg"
            onClick={handleCreateFunnel}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.3s"
          >
            Create New Funnel
          </Button>
        </Flex>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
          <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
            <CardBody>
              <Stat>
                <StatLabel color="whiteAlpha.800">Total Funnels</StatLabel>
                <StatNumber>{funnels.length}</StatNumber>
                <StatHelpText color="whiteAlpha.800">
                  <StatArrow type="increase" />
                  12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white">
            <CardBody>
              <Stat>
                <StatLabel color="whiteAlpha.800">Active Funnels</StatLabel>
                <StatNumber>{funnels.filter(f => f.isActive).length}</StatNumber>
                <StatHelpText color="whiteAlpha.800">
                  <StatArrow type="increase" />
                  8% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
            <CardBody>
              <Stat>
                <StatLabel color="whiteAlpha.800">Total Revenue</StatLabel>
                <StatNumber>₹{funnels.reduce((sum, f) => sum + f.revenue, 0).toLocaleString()}</StatNumber>
                <StatHelpText color="whiteAlpha.800">
                  <StatArrow type="increase" />
                  23% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" color="white">
            <CardBody>
              <Stat>
                <StatLabel color="whiteAlpha.800">Avg Conversion</StatLabel>
                <StatNumber>
                  {(funnels.reduce((sum, f) => sum + f.conversionRate, 0) / funnels.length).toFixed(1)}%
                </StatNumber>
                <StatHelpText color="whiteAlpha.800">
                  <StatArrow type="increase" />
                  5% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="brand">
        <TabList mb={6}>
          <Tab 
            _selected={{ 
              bg: 'brand.500', 
              color: 'white',
              borderColor: 'brand.500',
              borderRadius: 'md md 0 0'
            }}
          >
            <Icon as={FaChartBar} mr={2} />
            Funnel Overview
          </Tab>
          <Tab 
            _selected={{ 
              bg: 'brand.500', 
              color: 'white',
              borderColor: 'brand.500',
              borderRadius: 'md md 0 0'
            }}
          >
            <Icon as={FaChartLine} mr={2} />
            Analytics Dashboard
          </Tab>
        </TabList>

        <TabPanels>
          {/* Funnel Overview Tab */}
          <TabPanel p={0}>
            <Card>
              <CardHeader bg="gray.50" borderBottom="1px" borderColor={borderColor}>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color={textColor}>Funnel List</Heading>
                  <HStack spacing={4}>
                    <Input
                      placeholder="Search funnels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      maxW="300px"
                      leftIcon={<FaSearch />}
                    />
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      maxW="150px"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="paused">Paused</option>
                    </Select>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      maxW="150px"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="conversionRate">Sort by Conversion</option>
                      <option value="revenue">Sort by Revenue</option>
                      <option value="createdAt">Sort by Date</option>
                    </Select>
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody p={0}>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th px={4} py={3}>Funnel</Th>
                        <Th px={4} py={3}>Status</Th>
                        <Th px={4} py={3}>Type</Th>
                        <Th px={4} py={3}>Target Audience</Th>
                        <Th px={4} py={3}>Stages</Th>
                        <Th px={4} py={3}>Conversion</Th>
                        <Th px={4} py={3}>Revenue</Th>
                        <Th px={4} py={3}>ROI</Th>
                        <Th px={4} py={3}>Active</Th>
                        <Th px={4} py={3}>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sortedFunnels.map((funnel) => (
                        <Tr key={funnel.id} _hover={{ bg: 'gray.50' }}>
                          <Td px={4} py={3}>
                            <Box>
                              <Text fontWeight="semibold" color={textColor} mb={1}>
                                {funnel.name}
                              </Text>
                              <Text fontSize="sm" color={mutedTextColor} noOfLines={2}>
                                {funnel.description}
                              </Text>
                            </Box>
                          </Td>
                          <Td px={4} py={3}>
                            <Badge 
                              colorScheme={getStatusColor(funnel.status)}
                              variant="subtle"
                              px={3}
                              py={1}
                              borderRadius="full"
                            >
                              <Icon as={getStatusIcon(funnel.status)} mr={2} />
                              {funnel.status}
                            </Badge>
                          </Td>
                          <Td px={4} py={3}>
                            <Badge 
                              colorScheme={getTypeColor(funnel.type)}
                              variant="subtle"
                              px={3}
                              py={1}
                              borderRadius="full"
                            >
                              {funnel.type}
                            </Badge>
                          </Td>
                          <Td px={4} py={3}>
                            <Text fontSize="sm" color={mutedTextColor} maxW="150px" noOfLines={2}>
                              {funnel.targetAudience}
                            </Text>
                          </Td>
                          <Td px={4} py={3}>
                            <Text fontWeight="medium" color={textColor}>
                              {funnel.stageCount} stages
                            </Text>
                          </Td>
                          <Td px={4} py={3}>
                            <Text fontWeight="medium" color={textColor}>
                              {funnel.conversionRate}%
                            </Text>
                          </Td>
                          <Td px={4} py={3}>
                            <Text fontWeight="medium" color={textColor}>
                              ₹{funnel.revenue.toLocaleString()}
                            </Text>
                          </Td>
                          <Td px={4} py={3}>
                            <Text fontWeight="medium" color={textColor}>
                              {funnel.roi}%
                            </Text>
                          </Td>
                          <Td px={4} py={3}>
                            <Tooltip label={funnel.isActive ? 'Disable funnel' : 'Enable funnel'}>
                              <Switch
                                isChecked={funnel.isActive}
                                onChange={() => handleToggleActive(funnel.id)}
                                colorScheme="green"
                                size="lg"
                              />
                            </Tooltip>
                          </Td>
                          <Td px={4} py={3}>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FaEllipsisV />}
                                variant="ghost"
                                size="sm"
                                aria-label="Actions"
                              />
                              <MenuList>
                                <MenuItem icon={<FaEye />} onClick={() => handleViewAnalytics(funnel)}>
                                  View Analytics
                                </MenuItem>
                                <MenuItem icon={<FaEdit />} onClick={() => handleEditFunnel(funnel)}>
                                  Edit Funnel
                                </MenuItem>
                                <MenuItem icon={<FaCopy />}>
                                  Duplicate Funnel
                                </MenuItem>
                                <MenuItem icon={<FaShare />}>
                                  Share Funnel
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem icon={<FaTrash />} color="red.500" onClick={() => handleDeleteFunnel(funnel.id)}>
                                  Delete Funnel
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Analytics Dashboard Tab */}
          <TabPanel p={0}>
            <Card>
              <CardHeader bg="gray.50" borderBottom="1px" borderColor={borderColor}>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="md" color={textColor}>Funnel Analytics Overview</Heading>
                    <Text color={mutedTextColor}>Performance insights across all your funnels</Text>
                  </Box>
                  <Button
                    leftIcon={<FaExternalLinkAlt />}
                    variant="outline"
                    colorScheme="brand"
                  >
                    Export Report
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <Box textAlign="center" py={20}>
                  <Icon as={FaChartLine} size="6xl" color="gray.300" mb={4} />
                  <Heading size="lg" color="gray.500" mb={2}>Analytics Dashboard</Heading>
                  <Text color="gray.400" mb={6}>
                    Select a funnel from the overview tab to view detailed analytics
                  </Text>
                  <Button
                    colorScheme="brand"
                    onClick={() => setActiveTab('overview')}
                    leftIcon={<FaChartBar />}
                  >
                    Go to Funnel Overview
                  </Button>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Funnel Builder */}
      {showBuilder && (
        <Box position="fixed" top={0} left={0} right={0} bottom={0} bg="white" zIndex={1000} overflow="auto">
          <Box p={6}>
            <FunnelBuilder
              funnel={editingFunnel}
              onSave={handleSaveFunnel}
              onClose={() => {
                setShowBuilder(false);
                setEditingFunnel(null);
              }}
              automationRules={mockAutomationRules}
            />
          </Box>
        </Box>
      )}

      {/* Funnel Analytics */}
      {showAnalytics && (
        <Box position="fixed" top={0} left={0} right={0} bottom={0} bg="white" zIndex={1000} overflow="auto">
          <Box p={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <Box>
                <Heading size="lg" color="gray.800">
                  {viewingAnalytics?.name} - Analytics
                </Heading>
                <Text color="gray.600">Performance insights and optimization data</Text>
              </Box>
              <Button
                leftIcon={<FaChartBar />}
                variant="ghost"
                onClick={() => {
                  setShowAnalytics(false);
                  setViewingAnalytics(null);
                  setActiveTab('overview');
                }}
              >
                Back to Overview
              </Button>
            </Flex>
            <FunnelAnalytics funnelId={viewingAnalytics?.id} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Funnels;
