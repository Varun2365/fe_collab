// Marketing & Ads Dashboard - Professional Redesign with Graphs & Meta OAuth
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Box, Container, Flex, Grid, Text, Button, Input, Select, Textarea,
  FormControl, FormLabel, FormHelperText, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, ModalFooter, useDisclosure,
  Card, CardBody, CardHeader, Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
  Badge, IconButton, Tabs, TabList, TabPanels, Tab, TabPanel,
  VStack, HStack, Divider, SimpleGrid, useToast, Spinner, Progress,
  Alert, AlertIcon, AlertTitle, AlertDescription, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Tooltip as ChakraTooltip, useColorModeValue, Switch, InputGroup, InputLeftElement,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  List, ListItem, ListIcon, Heading, Stack, Center, Skeleton, SkeletonText
} from '@chakra-ui/react';
import {
  FiPlus, FiRefreshCw, FiPlay, FiPause, FiBarChart2, FiTarget, FiImage,
  FiSettings, FiTrendingUp, FiDollarSign, FiUsers, FiEye, FiMousePointer,
  FiZap, FiEdit3, FiTrash2, FiDownload, FiCopy, FiExternalLink, FiChevronRight,
  FiFilter, FiSearch, FiCalendar, FiCheckCircle, FiXCircle, FiAlertTriangle,
  FiKey, FiShield, FiStar, FiCpu, FiLayers, FiActivity, FiAward,
  FiArrowUp, FiArrowDown, FiMoreVertical, FiShare2, FiClock, FiLink
} from 'react-icons/fi';
import {
  CheckCircleIcon, WarningIcon, InfoIcon, CloseIcon
} from '@chakra-ui/icons';
import { getAuthHeaders, getCoachId, getToken } from '../../utils/authUtils';
import { API_BASE_URL } from '../../config/apiConfig';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Use API_BASE_URL from config (localhost:8080 in dev, api.funnelseye.com in production)
const BASE_URL = API_BASE_URL;

// Custom Toast Hook - Fixed Width (Similar to Calendar Page)
const useCustomToast = () => {
  const toast = useToast();
  
  return useCallback((message, status = 'info') => {
    const statusConfig = {
      success: {
        title: 'Success',
        bg: 'white',
        borderColor: 'green.200',
        iconColor: 'green.500',
        titleColor: 'green.700',
        textColor: 'gray.700',
        icon: CheckCircleIcon
      },
      error: {
        title: 'Error',
        bg: 'white',
        borderColor: 'red.200',
        iconColor: 'red.500',
        titleColor: 'red.700',
        textColor: 'gray.700',
        icon: WarningIcon
      },
      warning: {
        title: 'Warning',
        bg: 'white',
        borderColor: 'orange.200',
        iconColor: 'orange.500',
        titleColor: 'orange.700',
        textColor: 'gray.700',
        icon: WarningIcon
      },
      info: {
        title: 'Info',
        bg: 'white',
        borderColor: 'blue.200',
        iconColor: 'blue.500',
        titleColor: 'blue.700',
        textColor: 'gray.700',
        icon: InfoIcon
      }
    };

    const config = statusConfig[status] || statusConfig.success;
    const IconComponent = config.icon;
    
    toast({
      title: config.title,
      description: message,
      status,
      duration: 4000,
      isClosable: true,
      position: 'top-right',
      variant: 'subtle',
      containerStyle: {
        maxWidth: '400px',
      },
      render: ({ title, description, onClose }) => (
        <Box
          bg={config.bg}
          border="1px solid"
          borderColor={config.borderColor}
          borderRadius="7px"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          p={4}
          display="flex"
          alignItems="flex-start"
          gap={3}
          minW="320px"
          maxW="400px"
          w="400px"
        >
          <Box
            as={IconComponent}
            color={config.iconColor}
            boxSize={5}
            mt={0.5}
            flexShrink={0}
          />
          <VStack align="start" spacing={1} flex={1}>
            <Text
              fontSize="sm"
              fontWeight="600"
              color={config.titleColor}
            >
              {title}
            </Text>
            <Text
              fontSize="sm"
              color={config.textColor}
              lineHeight="1.5"
            >
              {description}
            </Text>
          </VStack>
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            size="xs"
            variant="ghost"
            onClick={onClose}
            color="gray.400"
            _hover={{ color: 'gray.600', bg: 'gray.50' }}
            borderRadius="7px"
            flexShrink={0}
          />
        </Box>
      ),
    });
  }, [toast]);
};

// Stats Card Component (Similar to Calendar Page)
const StatsCard = ({ title, value, icon, color = "blue", change, changeType }) => {
  const cardBgColor = useColorModeValue(`${color}.50`, `${color}.900`);
  const cardBorderColor = useColorModeValue(`${color}.200`, `${color}.700`);
  const iconBg = useColorModeValue(`${color}.100`, `${color}.800`);
  const iconColor = useColorModeValue(`${color}.600`, `${color}.300`);
  
  return (
    <Card 
      bg={cardBgColor} 
      border="1px" 
      borderColor={cardBorderColor}
      borderRadius="7px"
      _hover={{ borderColor: `${color}.300`, boxShadow: 'sm' }}
      transition="all 0.2s"
      boxShadow="none"
      flex="1"
    >
      <CardBody p={4}>
        <HStack spacing={3} align="center">
          <Box
            p={2.5}
            bg={iconBg}
            borderRadius="7px"
            color={iconColor}
          >
            {icon}
          </Box>
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="xs" color={`${color}.600`} fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
              {title}
            </Text>
            <HStack spacing={2} align="baseline">
              <Text fontSize="xl" fontWeight="700" color={`${color}.800`}>
                {value}
              </Text>
              {change && (
                <Stat>
                  <StatHelpText m={0}>
                    <StatArrow type={changeType === 'increase' ? 'increase' : 'decrease'} />
                    {change}
                  </StatHelpText>
                </Stat>
              )}
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

const MarketingAds = () => {
  const authState = useSelector(state => state.auth);
  const token = getToken(authState);
  const coachId = getCoachId(authState);
  const showToast = useCustomToast();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  
  // Main state
  const [loading, setLoading] = useState(false);
  const [credentialsStatus, setCredentialsStatus] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [funnels, setFunnels] = useState([]);
  const [aiDashboard, setAiDashboard] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [tabIndex, setTabIndex] = useState(0);
  
  // Currency options
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];
  
  // Modals
  const { isOpen: isCredentialsOpen, onOpen: onCredentialsOpen, onClose: onCredentialsClose } = useDisclosure();
  const { isOpen: isMetaOAuthOpen, onOpen: onMetaOAuthOpen, onClose: onMetaOAuthClose } = useDisclosure();
  const { isOpen: isCreateCampaignOpen, onOpen: onCreateCampaignOpen, onClose: onCreateCampaignClose } = useDisclosure();
  const { isOpen: isAICopyOpen, onOpen: onAICopyOpen, onClose: onAICopyClose } = useDisclosure();
  const { isOpen: isCampaignDetailsOpen, onOpen: onCampaignDetailsOpen, onClose: onCampaignDetailsClose } = useDisclosure();
  
  // Form states
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    objective: 'CONVERSIONS',
    budget: 50,
    targetAudience: '',
    productInfo: '',
    funnelId: '',
    funnelUrl: '',
    useAI: true
  });
  
  const [aiCopyForm, setAiCopyForm] = useState({
    targetAudience: '',
    productInfo: '',
    campaignObjective: 'CONVERSIONS'
  });
  
  const [generatedContent, setGeneratedContent] = useState(null);
  
  // API Helper
  const makeRequest = useCallback(async (endpoint, options = {}) => {
    const headers = getAuthHeaders(authState);
    if (!headers) {
      showToast('Please log in to continue', 'error');
      return null;
    }
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      showToast(error.message, 'error');
      return null;
    }
  }, [authState, showToast]);
  
  // ===== CREDENTIALS MANAGEMENT =====
  
  const fetchCredentialsStatus = useCallback(async () => {
    const data = await makeRequest('/api/marketing/v1/credentials/status');
    if (data?.success) {
      setCredentialsStatus(data.data);
    }
  }, [makeRequest]);
  
  // Meta OAuth Flow
  const initiateMetaOAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Get OAuth URL from backend
      const data = await makeRequest('/api/marketing/v1/credentials/meta/oauth/initiate', {
      method: 'POST',
        body: JSON.stringify({
          redirectUri: `${window.location.origin}/ads/oauth/callback`
        })
      });
      
      if (data?.success && data.data?.authUrl) {
        // Redirect to Meta OAuth
        window.location.href = data.data.authUrl;
      }
    } catch (error) {
      showToast('Failed to initiate Meta OAuth', 'error');
    }
    setLoading(false);
  }, [makeRequest, showToast]);
  
  // Handle OAuth callback (if redirected back)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);
  
  const handleOAuthCallback = useCallback(async (code, state) => {
    setLoading(true);
    const data = await makeRequest('/api/marketing/v1/credentials/meta/oauth/callback', {
      method: 'POST',
      body: JSON.stringify({ code, state })
    });
    
    if (data?.success) {
      showToast('Meta account connected successfully!', 'success');
      fetchCredentialsStatus();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setLoading(false);
  }, [makeRequest, showToast, fetchCredentialsStatus]);
  
  // ===== DASHBOARD DATA =====
  
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    const data = await makeRequest('/api/marketing/v1/dashboard?includeAIInsights=true&includeRecommendations=true');
    if (data?.success) {
      setDashboardData(data.data);
    }
    setLoading(false);
  }, [makeRequest]);
  
  const fetchAIDashboard = useCallback(async () => {
    const data = await makeRequest('/api/ai-ads/dashboard');
    if (data?.success) {
      setAiDashboard(data.data);
    }
  }, [makeRequest]);
  
  // ===== CAMPAIGNS =====
  
  const fetchCampaigns = useCallback(async () => {
    const data = await makeRequest('/api/ads');
    if (data?.success) {
      setCampaigns(data.data || []);
      // Fetch actual performance data from API
      fetchPerformanceData(data.data || []);
    }
  }, [makeRequest]);
  
  const fetchPerformanceData = useCallback(async (campaignsData) => {
    if (!campaignsData || campaignsData.length === 0) {
      setPerformanceData(null);
      return;
    }
    
    // For now, set to null - will be populated when actual analytics API is available
    // This removes dummy data generation
    setPerformanceData(null);
    
    // TODO: When analytics API is ready, fetch actual performance data
    // const insightsPromises = campaignsData.map(campaign => 
    //   makeRequest(`/api/ads/${campaign._id || campaign.id}/analytics`)
    // );
    // const insights = await Promise.all(insightsPromises);
    // ... aggregate and set performance data
  }, [makeRequest]);
  
  // Currency management
  const fetchCurrencyPreference = useCallback(async () => {
    const data = await makeRequest('/api/marketing/v1/preferences/currency');
    if (data?.success && data.data?.currency) {
      setCurrency(data.data.currency);
    }
  }, [makeRequest]);
  
  const saveCurrencyPreference = useCallback(async (newCurrency) => {
    const data = await makeRequest('/api/marketing/v1/preferences/currency', {
      method: 'POST',
      body: JSON.stringify({ currency: newCurrency })
    });
    if (data?.success) {
      setCurrency(newCurrency);
      showToast('Currency preference saved', 'success');
    }
  }, [makeRequest, showToast]);
  
  const createCampaign = useCallback(async () => {
    setLoading(true);
    let endpoint = '/api/ads/create';
    let payload = {
      coachMetaAccountId: credentialsStatus?.meta?.adAccountId || '',
      campaignData: {
        name: campaignForm.name,
        objective: campaignForm.objective,
        dailyBudget: campaignForm.budget,
        targetAudience: campaignForm.targetAudience,
        productInfo: campaignForm.productInfo
      },
      useAI: campaignForm.useAI
    };
    
    const data = await makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    if (data?.success) {
      showToast(
        campaignForm.useAI ? 'Your AI-optimized campaign has been created!' : 'Your campaign has been created successfully',
        'success'
      );
      onCreateCampaignClose();
      setCampaignForm({
        name: '',
        objective: 'CONVERSIONS',
        budget: 50,
        targetAudience: '',
        productInfo: '',
        funnelId: '',
        funnelUrl: '',
        useAI: true
      });
      fetchCampaigns();
      fetchDashboardData();
    }
    setLoading(false);
  }, [campaignForm, credentialsStatus, makeRequest, showToast, onCreateCampaignClose, fetchCampaigns, fetchDashboardData]);
  
  const pauseCampaign = useCallback(async (campaignId) => {
    const data = await makeRequest(`/api/ads/${campaignId}/pause`, {
      method: 'POST'
    });
    
    if (data?.success) {
      showToast('Campaign paused successfully', 'success');
      fetchCampaigns();
    }
  }, [makeRequest, showToast, fetchCampaigns]);
  
  const resumeCampaign = useCallback(async (campaignId) => {
    const data = await makeRequest(`/api/ads/${campaignId}/resume`, {
      method: 'POST'
    });
    
    if (data?.success) {
      showToast('Campaign resumed successfully', 'success');
      fetchCampaigns();
    }
  }, [makeRequest, showToast, fetchCampaigns]);
  
  const optimizeCampaign = useCallback(async (campaignId) => {
    setLoading(true);
    const data = await makeRequest(`/api/ai-ads/auto-optimize/${campaignId}`, {
      method: 'POST'
    });
    
    if (data?.success) {
      showToast('AI has optimized your campaign settings', 'success');
      fetchCampaigns();
      fetchDashboardData();
    }
    setLoading(false);
  }, [makeRequest, showToast, fetchCampaigns, fetchDashboardData]);
  
  // ===== AI FEATURES =====
  
  const generateAICopy = useCallback(async () => {
    setLoading(true);
    const data = await makeRequest('/api/ai-ads/generate-copy', {
      method: 'POST',
      body: JSON.stringify({
        targetAudience: aiCopyForm.targetAudience,
        productInfo: aiCopyForm.productInfo,
        campaignObjective: aiCopyForm.campaignObjective
      })
    });
    
    if (data?.success) {
      setGeneratedContent(data.data);
      showToast('Your ad copy has been generated successfully', 'success');
    }
    setLoading(false);
  }, [aiCopyForm, makeRequest, showToast]);
  
  // ===== FUNNELS =====
  
  const fetchFunnels = useCallback(async () => {
    if (!coachId) return;
    const data = await makeRequest(`/api/funnels/coach/${coachId}/funnels`);
    if (data?.success) {
      setFunnels(data.data || []);
    }
  }, [coachId, makeRequest]);
  
  // ===== INITIAL LOAD =====
  
  useEffect(() => {
    if (token && coachId) {
      fetchCredentialsStatus();
      fetchDashboardData();
      fetchCampaigns();
      fetchFunnels();
      fetchAIDashboard();
      fetchCurrencyPreference();
    }
  }, [token, coachId, fetchCredentialsStatus, fetchDashboardData, fetchCampaigns, fetchFunnels, fetchAIDashboard, fetchCurrencyPreference]);
  
  // Get currency symbol
  const currencySymbol = useMemo(() => {
    const curr = currencies.find(c => c.code === currency);
    return curr?.symbol || '$';
  }, [currency]);
  
  // Calculate stats
  const totalSpend = useMemo(() => campaigns.reduce((sum, c) => sum + (parseFloat(c.totalSpent) || 0), 0), [campaigns]);
  const totalImpressions = useMemo(() => campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0), [campaigns]);
  const totalClicks = useMemo(() => campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0), [campaigns]);
  const totalConversions = useMemo(() => campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0), [campaigns]);
  const activeCampaigns = useMemo(() => campaigns.filter(c => c.status === 'ACTIVE').length, [campaigns]);
  const avgCTR = useMemo(() => totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00', [totalClicks, totalImpressions]);
  const avgCPC = useMemo(() => totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : '0.00', [totalSpend, totalClicks]);
  
  // Chart data
  const performanceChartData = useMemo(() => {
    if (!performanceData) return null;
    
    return {
      labels: performanceData.labels,
      datasets: [
        {
          label: 'Impressions',
          data: performanceData.impressions,
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Clicks',
          data: performanceData.clicks,
          borderColor: 'rgb(118, 75, 162)',
          backgroundColor: 'rgba(118, 75, 162, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [performanceData]);
  
  const spendChartData = useMemo(() => {
    if (!performanceData) return null;
    
    return {
      labels: performanceData.labels,
      datasets: [
        {
          label: `Spend (${currencySymbol})`,
          data: performanceData.spend,
          borderColor: 'rgb(237, 137, 54)',
          backgroundColor: 'rgba(237, 137, 54, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Conversions',
          data: performanceData.conversions,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  }, [performanceData]);
  
  const gridColor = useColorModeValue('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)');
  
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  }), [gridColor]);
  
  return (
    <Box bg={bgColor} minH="100vh" py={6} px={6} w="100%">
        {/* Header Section - Elegant & Minimal */}
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" fontWeight="700" bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)" bgClip="text">
              Marketing & Ads
            </Heading>
            <Text color={mutedTextColor} fontSize="sm">
              AI-Powered Campaign Management & Analytics
                  </Text>
          </VStack>
          <HStack spacing={3}>
            {/* Currency Selector */}
            <Select
              value={currency}
              onChange={(e) => saveCurrencyPreference(e.target.value)}
              size="sm"
              w="120px"
              borderRadius="7px"
              borderColor={borderColor}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </Select>
            
            {/* Elegant Create Campaign Button */}
                <Button
                  leftIcon={<FiPlus />}
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
              size="md"
                  onClick={onCreateCampaignOpen}
              borderRadius="7px"
              _hover={{
                bgGradient: 'linear(135deg, #5568d3 0%, #653a8f 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              _active={{
                transform: 'translateY(0)'
              }}
              transition="all 0.2s"
              fontWeight="500"
              px={6}
                >
                  Create Campaign
                </Button>
            
            {/* Elegant Connect Meta Button */}
            {!credentialsStatus?.meta?.isConfigured ? (
                <Button
                leftIcon={<FiLink />}
                bg="white"
                color="purple.600"
                border="1.5px solid"
                borderColor="purple.200"
                size="md"
                onClick={onMetaOAuthOpen}
                borderRadius="7px"
                _hover={{
                  bg: 'purple.50',
                  borderColor: 'purple.300',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(128, 90, 213, 0.2)'
                }}
                _active={{
                  transform: 'translateY(0)'
                }}
                transition="all 0.2s"
                fontWeight="500"
                px={6}
              >
                Connect Meta
                </Button>
            ) : (
              <IconButton
                icon={<FiSettings />}
                variant="ghost"
                size="md"
                onClick={onCredentialsOpen}
                borderRadius="7px"
                aria-label="Settings"
                _hover={{ bg: 'gray.100' }}
              />
            )}
              </HStack>
          </Flex>
      
        {/* Credentials Alert */}
        {credentialsStatus && !credentialsStatus.meta?.isConfigured && (
          <Alert status="warning" mb={6} borderRadius="7px" border="1px" borderColor="orange.200">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Meta Account Not Connected</AlertTitle>
              <AlertDescription>
                Connect your Meta account to create and manage ad campaigns without API keys.
              </AlertDescription>
            </Box>
            <Button size="sm" colorScheme="orange" onClick={onMetaOAuthOpen} ml={4}>
              Connect Now
            </Button>
          </Alert>
        )}
        
        {/* Tabs Navigation */}
        <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="blue" mb={6}>
          <TabList borderBottom="2px solid" borderColor={borderColor} pb={0}>
            <Tab
              _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
              fontWeight="500"
              fontSize="sm"
              px={6}
              py={3}
            >
              Overview
            </Tab>
            <Tab
              _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
              fontWeight="500"
              fontSize="sm"
              px={6}
              py={3}
            >
              Campaigns
            </Tab>
            <Tab
              _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
              fontWeight="500"
              fontSize="sm"
              px={6}
              py={3}
            >
              Analytics
            </Tab>
            <Tab
              _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
              fontWeight="500"
              fontSize="sm"
              px={6}
              py={3}
            >
              AI Tools
            </Tab>
            <Tab
              _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
              fontWeight="500"
              fontSize="sm"
              px={6}
              py={3}
            >
              Settings
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Overview Tab */}
            <TabPanel px={0} pt={6}>
              {/* Stats Cards */}
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={6}>
                <StatsCard
                  title="Total Spend"
                  value={`${currencySymbol}${totalSpend.toFixed(2)}`}
                  icon={<Box as={FiDollarSign} boxSize={5} />}
                  color="blue"
                />
                <StatsCard
                  title="Impressions"
                  value={totalImpressions.toLocaleString()}
                  icon={<Box as={FiEye} boxSize={5} />}
                  color="purple"
                />
                <StatsCard
                  title="Clicks"
                  value={totalClicks.toLocaleString()}
                  icon={<Box as={FiMousePointer} boxSize={5} />}
                  color="green"
                />
                <StatsCard
                  title="Active Campaigns"
                  value={activeCampaigns}
                  icon={<Box as={FiTarget} boxSize={5} />}
                  color="orange"
                />
              </SimpleGrid>
        
              {/* Performance Charts */}
              {performanceChartData ? (
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mb={6}>
                  <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                    <CardHeader pb={2}>
                      <Text fontWeight="600" fontSize="md">Performance Overview</Text>
                      <Text fontSize="xs" color={mutedTextColor}>Impressions & Clicks (Last 7 Days)</Text>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <Line data={performanceChartData} options={chartOptions} />
                      </Box>
              </CardBody>
            </Card>
            
                  <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                    <CardHeader pb={2}>
                      <Text fontWeight="600" fontSize="md">Spend & Conversions</Text>
                      <Text fontSize="xs" color={mutedTextColor}>Revenue Metrics (Last 7 Days)</Text>
              </CardHeader>
              <CardBody>
                      <Box h="300px">
                        {spendChartData && <Line data={spendChartData} options={chartOptions} />}
                      </Box>
              </CardBody>
            </Card>
                </Grid>
              ) : (
                <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor} mb={6}>
                  <CardBody py={12}>
                    <Center>
                      <VStack spacing={3}>
                        <FiBarChart2 size={48} color={mutedTextColor} />
                        <Text color={mutedTextColor}>No performance data available yet</Text>
                        <Text fontSize="sm" color={mutedTextColor}>Start creating campaigns to see analytics</Text>
          </VStack>
                    </Center>
                  </CardBody>
                </Card>
              )}
              
              {/* Additional Metrics */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Average CTR</StatLabel>
                      <StatNumber fontSize="2xl">{avgCTR}%</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Average CPC</StatLabel>
                      <StatNumber fontSize="2xl">{currencySymbol}{avgCPC}</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Conversions</StatLabel>
                      <StatNumber fontSize="2xl">{totalConversions}</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            {/* Campaigns Tab */}
            <TabPanel px={0} pt={6}>
              <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
          <CardHeader borderBottom="1px" borderColor={borderColor}>
                <Flex justify="space-between" align="center">
                  <HStack>
                <Box as={FiBarChart2} color="blue.500" />
                <Text fontWeight="600" fontSize="lg">Your Campaigns</Text>
                  </HStack>
                  <HStack>
                    <IconButton
                      icon={<FiRefreshCw />}
                      size="sm"
                      variant="ghost"
                      onClick={fetchCampaigns}
                  aria-label="Refresh"
                    />
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="blue"
                      size="sm"
                      onClick={onCreateCampaignOpen}
                  borderRadius="7px"
                    >
                      New Campaign
                    </Button>
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody>
            {loading && campaigns.length === 0 ? (
              <VStack spacing={4} py={8}>
                <Skeleton height="40px" width="100%" />
                <Skeleton height="40px" width="100%" />
                <Skeleton height="40px" width="100%" />
              </VStack>
            ) : campaigns.length > 0 ? (
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Campaign Name</Th>
                          <Th>Objective</Th>
                          <Th>Status</Th>
                          <Th isNumeric>Budget</Th>
                          <Th>Performance</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {campaigns.map((campaign) => (
                      <Tr key={campaign._id || campaign.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                            <Td>
                          <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">{campaign.name}</Text>
                                {campaign.aiGenerated && (
                              <Badge colorScheme="purple" size="sm">
                                    <FiStar size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                    AI Generated
                                  </Badge>
                                )}
                              </VStack>
                            </Td>
                            <Td>
                              <Badge>{campaign.objective}</Badge>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  campaign.status === 'ACTIVE' ? 'green' :
                                  campaign.status === 'PAUSED' ? 'yellow' : 'gray'
                                }
                              >
                                {campaign.status}
                              </Badge>
                            </Td>
                            <Td isNumeric>{currencySymbol}{campaign.budget || campaign.dailyBudget || 0}/day</Td>
                            <Td>
                              <HStack spacing={4} fontSize="xs">
                            <ChakraTooltip label="Impressions">
                                  <HStack>
                                    <FiEye />
                                    <Text>{(campaign.impressions || 0).toLocaleString()}</Text>
                                  </HStack>
                            </ChakraTooltip>
                            <ChakraTooltip label="Clicks">
                                  <HStack>
                                    <FiMousePointer />
                                    <Text>{(campaign.clicks || 0).toLocaleString()}</Text>
                                  </HStack>
                            </ChakraTooltip>
                            <ChakraTooltip label="Conversions">
                                  <HStack>
                                    <FiCheckCircle />
                                    <Text>{campaign.conversions || 0}</Text>
                                  </HStack>
                            </ChakraTooltip>
                              </HStack>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                {campaign.status === 'ACTIVE' ? (
                                  <IconButton
                                    icon={<FiPause />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="yellow"
                                    onClick={() => pauseCampaign(campaign._id || campaign.id)}
                                aria-label="Pause"
                                  />
                                ) : (
                                  <IconButton
                                    icon={<FiPlay />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="green"
                                    onClick={() => resumeCampaign(campaign._id || campaign.id)}
                                aria-label="Resume"
                                  />
                                )}
                                <IconButton
                                  icon={<FiZap />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="purple"
                                  onClick={() => optimizeCampaign(campaign._id || campaign.id)}
                              aria-label="AI Optimize"
                                />
                                <IconButton
                                  icon={<FiBarChart2 />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedCampaign(campaign);
                                    onCampaignDetailsOpen();
                                  }}
                              aria-label="View Details"
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Center py={12}>
                    <VStack spacing={4}>
                      <Box p={6} bg="gray.100" borderRadius="full">
                        <FiTarget size={48} color="#718096" />
                      </Box>
                      <Text color={mutedTextColor} fontSize="lg">No campaigns yet</Text>
                  <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onCreateCampaignOpen} borderRadius="7px">
                        Create Your First Campaign
                      </Button>
                    </VStack>
                  </Center>
                )}
              </CardBody>
            </Card>
            </TabPanel>
            
            {/* Analytics Tab */}
            <TabPanel px={0} pt={6}>
              <VStack spacing={6} align="stretch">
                {performanceChartData ? (
                  <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                    <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                      <CardHeader pb={2}>
                        <Text fontWeight="600" fontSize="md">Performance Overview</Text>
                        <Text fontSize="xs" color={mutedTextColor}>Impressions & Clicks (Last 7 Days)</Text>
                      </CardHeader>
                      <CardBody>
                        <Box h="300px">
                          <Line data={performanceChartData} options={chartOptions} />
                        </Box>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                      <CardHeader pb={2}>
                        <Text fontWeight="600" fontSize="md">Spend & Conversions</Text>
                        <Text fontSize="xs" color={mutedTextColor}>Revenue Metrics (Last 7 Days)</Text>
                      </CardHeader>
                      <CardBody>
                        <Box h="300px">
                          {spendChartData && <Line data={spendChartData} options={chartOptions} />}
                        </Box>
                      </CardBody>
                    </Card>
                  </Grid>
                ) : (
                  <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                    <CardBody py={12}>
                      <Center>
                        <VStack spacing={3}>
                          <FiBarChart2 size={48} color={mutedTextColor} />
                          <Text color={mutedTextColor}>No analytics data available</Text>
                        </VStack>
                      </Center>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </TabPanel>
            
            {/* AI Tools Tab */}
            <TabPanel px={0} pt={6}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                  <CardHeader>
                    <HStack>
                      <Box as={FiCpu} color="purple.600" />
                      <Text fontWeight="600" fontSize="lg">AI Tools</Text>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Button
                        leftIcon={<FiZap />}
                        colorScheme="purple"
                        variant="outline"
                        size="lg"
                        onClick={onAICopyOpen}
                        h="80px"
                        borderRadius="7px"
                      >
                        <VStack spacing={1}>
                          <Text fontWeight="600">Generate Ad Copy</Text>
                          <Text fontSize="xs" color={mutedTextColor}>AI-powered ad content</Text>
                        </VStack>
                      </Button>
                      <Button
                        leftIcon={<FiTarget />}
                        colorScheme="purple"
                        variant="outline"
                        size="lg"
                        h="80px"
                        borderRadius="7px"
                      >
                        <VStack spacing={1}>
                          <Text fontWeight="600">AI Targeting</Text>
                          <Text fontSize="xs" color={mutedTextColor}>Smart audience recommendations</Text>
                        </VStack>
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
                
            {aiDashboard && (
                  <Card bg="purple.50" borderWidth={2} borderColor="purple.200" boxShadow="sm" borderRadius="7px">
                <CardHeader bg="purple.100" borderBottomWidth={1} borderColor="purple.200">
                  <HStack>
                        <Box as={FiCpu} color="purple.600" />
                    <Text fontWeight="bold" color="purple.700">AI Performance Dashboard</Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Box p={4} bg="white" borderRadius="7px">
                      <Text fontSize="sm" color={mutedTextColor} mb={1}>AI Optimizations</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {aiDashboard.totalOptimizations || 0}
                      </Text>
                    </Box>
                        <Box p={4} bg="white" borderRadius="7px">
                      <Text fontSize="sm" color={mutedTextColor} mb={1}>Generated Content</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {aiDashboard.totalGeneratedContent || 0}
                      </Text>
                    </Box>
                        <Box p={4} bg="white" borderRadius="7px">
                      <Text fontSize="sm" color={mutedTextColor} mb={1}>Performance Score</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {aiDashboard.performanceScore || 'N/A'}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}
          </VStack>
            </TabPanel>
            
            {/* Settings Tab */}
            <TabPanel px={0} pt={6}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Text fontWeight="600" fontSize="lg">Preferences</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          value={currency}
                          onChange={(e) => saveCurrencyPreference(e.target.value)}
                          borderRadius="7px"
                        >
                          {currencies.map(curr => (
                            <option key={curr.code} value={curr.code}>
                              {curr.symbol} {curr.name} ({curr.code})
                            </option>
                          ))}
                        </Select>
                        <FormHelperText>This currency will be used for all financial displays</FormHelperText>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} boxShadow="sm" borderRadius="7px" border="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Text fontWeight="600" fontSize="lg">Meta Account</Text>
                  </CardHeader>
                  <CardBody>
                    {credentialsStatus?.meta?.isConfigured ? (
                      <VStack spacing={4} align="stretch">
                        <Alert status="success" borderRadius="7px">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Meta account connected</AlertTitle>
                            <AlertDescription>Your Meta account is active and ready to use</AlertDescription>
                          </Box>
                        </Alert>
                        <Button
                          leftIcon={<FiSettings />}
                          variant="outline"
                          onClick={onCredentialsOpen}
                          borderRadius="7px"
                        >
                          Manage Connection
                        </Button>
                      </VStack>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        <Alert status="warning" borderRadius="7px">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Meta account not connected</AlertTitle>
                            <AlertDescription>Connect your Meta account to start creating campaigns</AlertDescription>
                          </Box>
                        </Alert>
                        <Button
                          leftIcon={<FiLink />}
                          colorScheme="purple"
                          onClick={onMetaOAuthOpen}
                          borderRadius="7px"
                        >
                          Connect Meta Account
                        </Button>
                      </VStack>
                    )}
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {/* Modals */}
        
        {/* Meta OAuth Modal */}
        <Modal isOpen={isMetaOAuthOpen} onClose={onMetaOAuthClose} size="md">
          <ModalOverlay />
          <ModalContent borderRadius="7px">
            <ModalHeader>Connect Meta Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Alert status="info" borderRadius="7px">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>OAuth Authentication</AlertTitle>
                    <AlertDescription>
                      Connect your Meta account securely without entering API keys manually. We'll handle the authentication for you.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <VStack spacing={3} py={4}>
                  <Text fontSize="sm" color={mutedTextColor} textAlign="center">
                    Click the button below to connect your Meta Business account. You'll be redirected to Meta's secure login page.
                  </Text>
                  
                  <Button
                    leftIcon={<FiLink />}
                    colorScheme="blue"
                    size="lg"
                    onClick={initiateMetaOAuth}
                    isLoading={loading}
                    isFullWidth
                    borderRadius="7px"
                  >
                    Connect with Meta
                </Button>
                </VStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onMetaOAuthClose} borderRadius="7px">
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Credentials Setup Modal */}
        <Modal isOpen={isCredentialsOpen} onClose={onCredentialsClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="7px">
            <ModalHeader>API Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Alert status="info" borderRadius="7px">
                    <AlertIcon />
                    <Box>
                    <AlertTitle>Meta Account Connected</AlertTitle>
                    <AlertDescription>
                      Your Meta account is connected via OAuth. You can manage your connection here.
                    </AlertDescription>
                    </Box>
                  </Alert>
                  
                {credentialsStatus?.meta?.isConfigured && (
                  <Box p={4} bg="green.50" borderRadius="7px" border="1px" borderColor="green.200">
                    <HStack>
                      <CheckCircleIcon color="green.500" />
                      <Text color="green.700" fontWeight="medium">Meta account is connected and active</Text>
                    </HStack>
                          </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCredentialsClose} borderRadius="7px">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Create Campaign Modal */}
        <Modal isOpen={isCreateCampaignOpen} onClose={onCreateCampaignClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="7px">
            <ModalHeader>Create New Campaign</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Campaign Name</FormLabel>
                  <Input
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                    placeholder="e.g., Summer Weight Loss Campaign"
                    borderRadius="7px"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Objective</FormLabel>
                  <Select
                    value={campaignForm.objective}
                    onChange={(e) => setCampaignForm({ ...campaignForm, objective: e.target.value })}
                    borderRadius="7px"
                  >
                    <option value="CONVERSIONS">Conversions</option>
                    <option value="LEAD_GENERATION">Lead Generation</option>
                    <option value="TRAFFIC">Website Traffic</option>
                    <option value="AWARENESS">Brand Awareness</option>
                    <option value="ENGAGEMENT">Engagement</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Daily Budget ({currencySymbol})</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      {currencySymbol}
                    </InputLeftElement>
                  <Input
                    type="number"
                    value={campaignForm.budget}
                    onChange={(e) => setCampaignForm({ ...campaignForm, budget: parseFloat(e.target.value) })}
                    placeholder="50"
                      borderRadius="7px"
                      pl="40px"
                  />
                  </InputGroup>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Target Audience</FormLabel>
                  <Input
                    value={campaignForm.targetAudience}
                    onChange={(e) => setCampaignForm({ ...campaignForm, targetAudience: e.target.value })}
                    placeholder="e.g., Weight loss enthusiasts, 25-45 years"
                    borderRadius="7px"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Product/Offer Description</FormLabel>
                  <Textarea
                    value={campaignForm.productInfo}
                    onChange={(e) => setCampaignForm({ ...campaignForm, productInfo: e.target.value })}
                    placeholder="Describe your product or offer..."
                    rows={3}
                    borderRadius="7px"
                  />
                </FormControl>
                
                <FormControl>
                  <HStack>
                    <Switch
                      isChecked={campaignForm.useAI}
                      onChange={(e) => setCampaignForm({ ...campaignForm, useAI: e.target.checked })}
                    />
                    <FormLabel mb={0}>
                      <HStack>
                        <Text>Use AI Optimization</Text>
                        <Badge colorScheme="purple">Recommended</Badge>
                      </HStack>
                    </FormLabel>
                  </HStack>
                  <FormHelperText>
                    AI will generate ad copy and targeting recommendations automatically
                  </FormHelperText>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCreateCampaignClose} borderRadius="7px">
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={createCampaign} isLoading={loading} borderRadius="7px">
                Create Campaign
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* AI Copy Generation Modal */}
        <Modal isOpen={isAICopyOpen} onClose={onAICopyClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="7px">
            <ModalHeader>
              <HStack>
                <Box as={FiStar} color="purple.500" />
                <Text>Generate AI Ad Copy</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Target Audience</FormLabel>
                  <Input
                    value={aiCopyForm.targetAudience}
                    onChange={(e) => setAiCopyForm({ ...aiCopyForm, targetAudience: e.target.value })}
                    placeholder="e.g., Weight loss enthusiasts, 25-45 years"
                    borderRadius="7px"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Product/Offer Description</FormLabel>
                  <Textarea
                    value={aiCopyForm.productInfo}
                    onChange={(e) => setAiCopyForm({ ...aiCopyForm, productInfo: e.target.value })}
                    placeholder="Describe your product or offer..."
                    rows={4}
                    borderRadius="7px"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Campaign Objective</FormLabel>
                  <Select
                    value={aiCopyForm.campaignObjective}
                    onChange={(e) => setAiCopyForm({ ...aiCopyForm, campaignObjective: e.target.value })}
                    borderRadius="7px"
                  >
                    <option value="CONVERSIONS">Conversions</option>
                    <option value="LEAD_GENERATION">Lead Generation</option>
                    <option value="TRAFFIC">Website Traffic</option>
                    <option value="AWARENESS">Brand Awareness</option>
                  </Select>
                </FormControl>
                
                {generatedContent && (
                  <Box p={4} bg="purple.50" borderRadius="7px" borderWidth={1} borderColor="purple.200">
                    <Text fontWeight="bold" mb={2}>Generated Ad Copy:</Text>
                    <Text mb={3}>{generatedContent.headline || generatedContent.primaryCopy}</Text>
                    <Button
                      size="sm"
                      leftIcon={<FiCopy />}
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent.headline || generatedContent.primaryCopy);
                        showToast('Copied to clipboard!', 'success');
                      }}
                      borderRadius="7px"
                    >
                      Copy
                    </Button>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAICopyClose} borderRadius="7px">
                Close
              </Button>
              <Button
                leftIcon={<FiStar />}
                colorScheme="purple"
                onClick={generateAICopy}
                isLoading={loading}
                borderRadius="7px"
              >
                Generate with AI
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Campaign Details Modal */}
        <Modal isOpen={isCampaignDetailsOpen} onClose={onCampaignDetailsClose} size="2xl">
          <ModalOverlay />
          <ModalContent borderRadius="7px">
            <ModalHeader>Campaign Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedCampaign && (
                <VStack align="stretch" spacing={4}>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color={mutedTextColor}>Campaign Name</Text>
                      <Text fontWeight="bold">{selectedCampaign.name}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color={mutedTextColor}>Status</Text>
                      <Badge colorScheme={selectedCampaign.status === 'ACTIVE' ? 'green' : 'yellow'}>
                        {selectedCampaign.status}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color={mutedTextColor}>Budget</Text>
                      <Text fontWeight="bold">{currencySymbol}{selectedCampaign.budget || selectedCampaign.dailyBudget}/day</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color={mutedTextColor}>Objective</Text>
                      <Text fontWeight="bold">{selectedCampaign.objective}</Text>
                    </Box>
                  </SimpleGrid>
                  
                  <Divider />
                  
                  <HStack spacing={2}>
                    <Button
                      leftIcon={<FiZap />}
                      colorScheme="purple"
                      size="sm"
                      onClick={() => optimizeCampaign(selectedCampaign._id || selectedCampaign.id)}
                      isLoading={loading}
                      borderRadius="7px"
                    >
                      AI Optimize
                    </Button>
                  </HStack>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onCampaignDetailsClose} borderRadius="7px">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </Box>
  );
};

export default MarketingAds;
