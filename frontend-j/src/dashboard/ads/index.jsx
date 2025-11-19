// Marketing & Ads Dashboard - Complete Rebuild with Modern UI
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Container, Flex, Grid, Text, Button, Input, Select, Textarea,
  FormControl, FormLabel, FormHelperText, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, ModalFooter, useDisclosure,
  Card, CardBody, CardHeader, Stat, StatLabel, StatNumber, StatHelpText,
  Badge, IconButton, Tabs, TabList, TabPanels, Tab, TabPanel,
  VStack, HStack, Divider, SimpleGrid, useToast, Spinner, Progress,
  Alert, AlertIcon, AlertTitle, AlertDescription, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Tooltip, useColorModeValue, Switch, InputGroup, InputLeftElement,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  List, ListItem, ListIcon, Code, Tag, TagLabel, TagLeftIcon, TagRightIcon,
  Image, Heading, Stack, Wrap, WrapItem, Center, AspectRatio
} from '@chakra-ui/react';
import {
  FiPlus, FiRefreshCw, FiPlay, FiPause, FiBarChart2, FiTarget, FiImage,
  FiSettings, FiTrendingUp, FiDollarSign, FiUsers, FiEye, FiMousePointer,
  FiZap, FiEdit3, FiTrash2, FiDownload, FiCopy, FiExternalLink, FiChevronRight,
  FiFilter, FiSearch, FiCalendar, FiCheckCircle, FiXCircle, FiAlertTriangle,
  FiKey, FiShield, FiStar, FiCpu, FiLayers, FiActivity, FiAward,
  FiArrowUp, FiArrowDown, FiMoreVertical, FiShare2, FiClock
} from 'react-icons/fi';
import { getAuthHeaders, getCoachId, getToken } from '../../utils/authUtils';

const BASE_URL = 'https://api.funnelseye.com';

const MarketingAds = () => {
  const authState = useSelector(state => state.auth);
  const token = getToken(authState);
  const coachId = getCoachId(authState);
  const toast = useToast();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const gradientBg = useColorModeValue('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)');
  
  // Main state
  const [loading, setLoading] = useState(false);
  const [credentialsStatus, setCredentialsStatus] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [funnels, setFunnels] = useState([]);
  const [aiDashboard, setAiDashboard] = useState(null);
  const [socialMediaHistory, setSocialMediaHistory] = useState([]);
  
  // Modals
  const { isOpen: isCredentialsOpen, onOpen: onCredentialsOpen, onClose: onCredentialsClose } = useDisclosure();
  const { isOpen: isMetaSetupOpen, onOpen: onMetaSetupOpen, onClose: onMetaSetupClose } = useDisclosure();
  const { isOpen: isCreateCampaignOpen, onOpen: onCreateCampaignOpen, onClose: onCreateCampaignClose } = useDisclosure();
  const { isOpen: isAICopyOpen, onOpen: onAICopyOpen, onClose: onAICopyClose } = useDisclosure();
  const { isOpen: isAIPosterOpen, onOpen: onAIPosterOpen, onClose: onAIPosterClose } = useDisclosure();
  const { isOpen: isAITargetingOpen, onOpen: onAITargetingOpen, onClose: onAITargetingClose } = useDisclosure();
  const { isOpen: isCampaignDetailsOpen, onOpen: onCampaignDetailsOpen, onClose: onCampaignDetailsClose } = useDisclosure();
  
  // Form states
  const [metaCredentials, setMetaCredentials] = useState({
    accessToken: '',
    appId: '',
    appSecret: '',
    businessAccountId: '',
    adAccountId: '',
    facebookPageId: '',
    instagramAccountId: ''
  });
  
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
  
  const [aiPosterForm, setAiPosterForm] = useState({
    coachName: authState?.user?.name || '',
    niche: '',
    offer: '',
    targetAudience: '',
    style: 'modern',
    colorScheme: 'blue'
  });
  
  const [aiTargetingForm, setAiTargetingForm] = useState({
    targetAudience: '',
    budget: 50
  });
  
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedPoster, setGeneratedPoster] = useState(null);
  const [generatedTargeting, setGeneratedTargeting] = useState(null);
  const [metaSetupSteps, setMetaSetupSteps] = useState(null);
  
  // API Helper
  const makeRequest = useCallback(async (endpoint, options = {}) => {
    const headers = getAuthHeaders(authState);
    if (!headers) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to continue',
        status: 'error',
        duration: 3000
      });
      return null;
    }
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
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
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
      return null;
    }
  }, [authState, toast]);
  
  // ===== CREDENTIALS MANAGEMENT =====
  
  const fetchCredentialsStatus = useCallback(async () => {
    const data = await makeRequest('/api/marketing/v1/credentials/status');
    if (data?.success) {
      setCredentialsStatus(data.data);
    }
  }, [makeRequest]);
  
  const fetchMetaSetupSteps = useCallback(async () => {
    const data = await makeRequest('/api/marketing/v1/credentials/meta/setup-steps');
    if (data?.success) {
      setMetaSetupSteps(data.data);
    }
  }, [makeRequest]);
  
  const setupMetaCredentials = useCallback(async () => {
    setLoading(true);
    const data = await makeRequest('/api/marketing/v1/credentials/meta', {
      method: 'POST',
      body: JSON.stringify(metaCredentials)
    });
    
    if (data?.success) {
      toast({
        title: 'Success',
        description: 'Meta credentials saved successfully',
        status: 'success',
        duration: 3000
      });
      onMetaSetupClose();
      fetchCredentialsStatus();
    }
    setLoading(false);
  }, [metaCredentials, makeRequest, toast, onMetaSetupClose, fetchCredentialsStatus]);
  
  const verifyMetaCredentials = useCallback(async () => {
    setLoading(true);
    const data = await makeRequest('/api/marketing/v1/credentials/meta/verify', {
      method: 'POST'
    });
    
    if (data?.success) {
      toast({
        title: 'Verification Successful',
        description: 'Your Meta credentials are valid',
        status: 'success',
        duration: 3000
      });
      fetchCredentialsStatus();
    }
    setLoading(false);
  }, [makeRequest, toast, fetchCredentialsStatus]);
  
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
    }
  }, [makeRequest]);
  
  const createCampaign = useCallback(async () => {
    setLoading(true);
    let endpoint = '/api/ads/create';
    let payload = campaignForm;
    
    // If using AI, use AI-optimized campaign creation
    if (campaignForm.useAI) {
      endpoint = '/api/ai-ads/create-optimized-campaign';
      payload = {
        name: campaignForm.name,
        objective: campaignForm.objective,
        targetAudience: campaignForm.targetAudience,
        budget: campaignForm.budget,
        productInfo: campaignForm.productInfo,
        coachMetaAccountId: credentialsStatus?.meta?.adAccountId || ''
      };
    }
    
    const data = await makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    if (data?.success) {
      toast({
        title: 'Campaign Created',
        description: campaignForm.useAI ? 'Your AI-optimized campaign has been created!' : 'Your campaign has been created successfully',
        status: 'success',
        duration: 3000
      });
      onCreateCampaignClose();
      fetchCampaigns();
      fetchDashboardData();
    }
    setLoading(false);
  }, [campaignForm, credentialsStatus, makeRequest, toast, onCreateCampaignClose, fetchCampaigns, fetchDashboardData]);
  
  const pauseCampaign = useCallback(async (campaignId) => {
    const data = await makeRequest(`/api/ads/${campaignId}/pause`, {
      method: 'POST'
    });
    
    if (data?.success) {
      toast({
        title: 'Campaign Paused',
        status: 'success',
        duration: 2000
      });
      fetchCampaigns();
    }
  }, [makeRequest, toast, fetchCampaigns]);
  
  const resumeCampaign = useCallback(async (campaignId) => {
    const data = await makeRequest(`/api/ads/${campaignId}/resume`, {
      method: 'POST'
    });
    
    if (data?.success) {
      toast({
        title: 'Campaign Resumed',
        status: 'success',
        duration: 2000
      });
      fetchCampaigns();
    }
  }, [makeRequest, toast, fetchCampaigns]);
  
  const deleteCampaign = useCallback(async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    const data = await makeRequest(`/api/marketing/v1/campaigns/${campaignId}`, {
      method: 'DELETE'
    });
    
    if (data?.success) {
      toast({
        title: 'Campaign Deleted',
        status: 'success',
        duration: 2000
      });
      fetchCampaigns();
    }
  }, [makeRequest, toast, fetchCampaigns]);
  
  const optimizeCampaign = useCallback(async (campaignId) => {
    setLoading(true);
    const data = await makeRequest(`/api/ai-ads/auto-optimize/${campaignId}`, {
      method: 'POST'
    });
    
    if (data?.success) {
      toast({
        title: 'Campaign Optimized',
        description: 'AI has optimized your campaign settings',
        status: 'success',
        duration: 3000
      });
      fetchCampaigns();
      fetchDashboardData();
    }
    setLoading(false);
  }, [makeRequest, toast, fetchCampaigns, fetchDashboardData]);
  
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
      toast({
        title: 'AI Content Generated',
        description: 'Your ad copy has been generated successfully',
        status: 'success',
        duration: 3000
      });
    }
    setLoading(false);
  }, [aiCopyForm, makeRequest, toast]);
  
  const generatePoster = useCallback(async () => {
    setLoading(true);
    const data = await makeRequest('/api/ai-ads/generate-poster', {
      method: 'POST',
      body: JSON.stringify(aiPosterForm)
    });
    
    if (data?.success) {
      setGeneratedPoster(data.data);
      toast({
        title: 'Poster Generated',
        description: 'Your AI-generated poster is ready',
        status: 'success',
        duration: 3000
      });
    }
    setLoading(false);
  }, [aiPosterForm, makeRequest, toast]);
  
  const generateTargeting = useCallback(async () => {
    setLoading(true);
    const data = await makeRequest('/api/ai-ads/targeting-recommendations', {
      method: 'POST',
      body: JSON.stringify({
        targetAudience: aiTargetingForm.targetAudience,
        budget: aiTargetingForm.budget
      })
    });
    
    if (data?.success) {
      setGeneratedTargeting(data.data);
      toast({
        title: 'Targeting Recommendations Generated',
        description: 'AI has analyzed and provided targeting suggestions',
        status: 'success',
        duration: 3000
      });
    }
    setLoading(false);
  }, [aiTargetingForm, makeRequest, toast]);
  
  const getPerformanceInsights = useCallback(async (campaignId) => {
    setLoading(true);
    const data = await makeRequest(`/api/ai-ads/performance-insights/${campaignId}`);
    if (data?.success) {
      toast({
        title: 'Performance Insights',
        description: 'AI insights loaded successfully',
        status: 'success',
        duration: 2000
      });
      setSelectedCampaign({ ...selectedCampaign, insights: data.data });
    }
    setLoading(false);
  }, [makeRequest, toast, selectedCampaign]);
  
  const detectAnomalies = useCallback(async (campaignId) => {
    setLoading(true);
    const data = await makeRequest(`/api/ai-ads/detect-anomalies/${campaignId}`);
    if (data?.success) {
      toast({
        title: data.count > 0 ? 'Anomalies Detected' : 'No Anomalies',
        description: data.count > 0 ? `${data.count} anomalies found in campaign performance` : 'Your campaign is performing normally',
        status: data.count > 0 ? 'warning' : 'success',
        duration: 3000
      });
    }
    setLoading(false);
  }, [makeRequest, toast]);
  
  // ===== FUNNELS =====
  
  const fetchFunnels = useCallback(async () => {
    if (!coachId) return;
    const data = await makeRequest(`/api/funnels/coach/${coachId}/funnels`);
    if (data?.success) {
      setFunnels(data.data || []);
    }
  }, [coachId, makeRequest]);
  
  const fetchSocialMediaHistory = useCallback(async () => {
    const data = await makeRequest('/api/ai-ads/social-media-history');
    if (data?.success) {
      setSocialMediaHistory(data.data || []);
    }
  }, [makeRequest]);
  
  // ===== INITIAL LOAD =====
  
  useEffect(() => {
    if (token && coachId) {
      fetchCredentialsStatus();
      fetchDashboardData();
      fetchCampaigns();
      fetchFunnels();
      fetchAIDashboard();
      fetchSocialMediaHistory();
    }
  }, [token, coachId, fetchCredentialsStatus, fetchDashboardData, fetchCampaigns, fetchFunnels, fetchAIDashboard, fetchSocialMediaHistory]);
  
  useEffect(() => {
    if (isMetaSetupOpen && !metaSetupSteps) {
      fetchMetaSetupSteps();
    }
  }, [isMetaSetupOpen, metaSetupSteps, fetchMetaSetupSteps]);
  
  // Calculate stats
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
  
  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section */}
      <Box bg={gradientBg} color="white" py={12} mb={8}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={6}>
            <Box flex="1" minW="300px">
              <HStack spacing={3} mb={4}>
                <Box p={3} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                  <FiTarget size={32} />
                </Box>
                <Box>
                  <Heading size="2xl" mb={2}>Marketing & Ads</Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    AI-Powered Campaign Management
                  </Text>
                </Box>
              </HStack>
              <HStack spacing={4} mt={6}>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="whiteAlpha"
                  color="white"
                  size="lg"
                  onClick={onCreateCampaignOpen}
                  _hover={{ bg: 'whiteAlpha.300' }}
                >
                  Create Campaign
                </Button>
                <Button
                  leftIcon={<FiSettings />}
                  variant="outline"
                  color="white"
                  borderColor="whiteAlpha.400"
                  size="lg"
                  onClick={onCredentialsOpen}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  API Setup
                </Button>
              </HStack>
            </Box>
            
            {/* Quick Stats */}
            <SimpleGrid columns={4} spacing={6} minW="400px">
              <Box textAlign="center">
                <Text fontSize="3xl" fontWeight="bold">{campaigns.length}</Text>
                <Text fontSize="sm" opacity={0.8}>Total Campaigns</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="3xl" fontWeight="bold">{activeCampaigns}</Text>
                <Text fontSize="sm" opacity={0.8}>Active</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="3xl" fontWeight="bold">${totalSpend.toFixed(0)}</Text>
                <Text fontSize="sm" opacity={0.8}>Total Spend</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="3xl" fontWeight="bold">{totalConversions}</Text>
                <Text fontSize="sm" opacity={0.8}>Conversions</Text>
              </Box>
            </SimpleGrid>
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="container.xl" pb={8}>
        {/* Credentials Alert */}
        {credentialsStatus && !credentialsStatus.meta?.isConfigured && (
          <Alert status="warning" mb={6} borderRadius="lg" boxShadow="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Meta API Credentials Required</AlertTitle>
              <AlertDescription>
                Please set up your Meta API credentials to create and manage campaigns.
              </AlertDescription>
            </Box>
            <Button size="sm" colorScheme="orange" onClick={onCredentialsOpen}>
              Setup Now
            </Button>
          </Alert>
        )}
        
        {/* Main Content Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={6} mb={8}>
          {/* Sidebar - Quick Actions */}
          <VStack spacing={4} align="stretch">
            {/* AI Tools Card */}
            <Card bg={cardBg} boxShadow="lg" borderWidth={2} borderColor="purple.200">
              <CardHeader bg="purple.50" borderBottomWidth={1} borderColor="purple.100">
                <HStack>
                  <FiStar color="#805AD5" />
                  <Text fontWeight="bold" color="purple.700">AI Tools</Text>
                  <Badge colorScheme="purple" ml="auto">New</Badge>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Button
                    leftIcon={<FiZap />}
                    colorScheme="purple"
                    variant="outline"
                    size="sm"
                    onClick={onAICopyOpen}
                    isFullWidth
                  >
                    Generate Ad Copy
                  </Button>
                  <Button
                    leftIcon={<FiTarget />}
                    colorScheme="purple"
                    variant="outline"
                    size="sm"
                    onClick={onAITargetingOpen}
                    isFullWidth
                  >
                    AI Targeting
                  </Button>
                  <Button
                    leftIcon={<FiImage />}
                    colorScheme="purple"
                    variant="outline"
                    size="sm"
                    onClick={onAIPosterOpen}
                    isFullWidth
                  >
                    Generate Poster
                  </Button>
                  <Button
                    leftIcon={<FiCpu />}
                    colorScheme="purple"
                    variant="outline"
                    size="sm"
                    onClick={fetchAIDashboard}
                    isFullWidth
                  >
                    AI Dashboard
                  </Button>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Quick Stats Card */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader>
                <Text fontWeight="bold" fontSize="sm">Performance Overview</Text>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={mutedTextColor}>CTR</Text>
                    <Text fontWeight="bold">{avgCTR.toFixed(2)}%</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={mutedTextColor}>Avg CPC</Text>
                    <Text fontWeight="bold">${avgCPC.toFixed(2)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={mutedTextColor}>Impressions</Text>
                    <Text fontWeight="bold">{totalImpressions.toLocaleString()}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={mutedTextColor}>Clicks</Text>
                    <Text fontWeight="bold">{totalClicks.toLocaleString()}</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
          
          {/* Main Content */}
          <VStack spacing={6} align="stretch">
            {/* Campaigns Section */}
            <Card bg={cardBg} boxShadow="lg">
              <CardHeader borderBottomWidth={1} borderColor={borderColor}>
                <Flex justify="space-between" align="center">
                  <HStack>
                    <FiBarChart2 />
                    <Text fontWeight="bold" fontSize="xl">Your Campaigns</Text>
                  </HStack>
                  <HStack>
                    <IconButton
                      icon={<FiRefreshCw />}
                      size="sm"
                      variant="ghost"
                      onClick={fetchCampaigns}
                    />
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="blue"
                      size="sm"
                      onClick={onCreateCampaignOpen}
                    >
                      New Campaign
                    </Button>
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody>
                {campaigns.length > 0 ? (
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
                          <Tr key={campaign._id || campaign.id} _hover={{ bg: 'gray.50' }}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">{campaign.name}</Text>
                                {campaign.aiGenerated && (
                                  <Badge colorScheme="purple" size="sm" mt={1}>
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
                            <Td isNumeric>${campaign.budget || campaign.dailyBudget || 0}/day</Td>
                            <Td>
                              <HStack spacing={4} fontSize="xs">
                                <Tooltip label="Impressions">
                                  <HStack>
                                    <FiEye />
                                    <Text>{(campaign.impressions || 0).toLocaleString()}</Text>
                                  </HStack>
                                </Tooltip>
                                <Tooltip label="Clicks">
                                  <HStack>
                                    <FiMousePointer />
                                    <Text>{(campaign.clicks || 0).toLocaleString()}</Text>
                                  </HStack>
                                </Tooltip>
                                <Tooltip label="Conversions">
                                  <HStack>
                                    <FiCheckCircle />
                                    <Text>{campaign.conversions || 0}</Text>
                                  </HStack>
                                </Tooltip>
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
                                  />
                                ) : (
                                  <IconButton
                                    icon={<FiPlay />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="green"
                                    onClick={() => resumeCampaign(campaign._id || campaign.id)}
                                  />
                                )}
                                <IconButton
                                  icon={<FiZap />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="purple"
                                  onClick={() => optimizeCampaign(campaign._id || campaign.id)}
                                  title="AI Optimize"
                                />
                                <IconButton
                                  icon={<FiBarChart2 />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedCampaign(campaign);
                                    onCampaignDetailsOpen();
                                  }}
                                />
                                <IconButton
                                  icon={<FiTrash2 />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => deleteCampaign(campaign._id || campaign.id)}
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
                      <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onCreateCampaignOpen}>
                        Create Your First Campaign
                      </Button>
                    </VStack>
                  </Center>
                )}
              </CardBody>
            </Card>
            
            {/* AI Dashboard Section */}
            {aiDashboard && (
              <Card bg="purple.50" borderWidth={2} borderColor="purple.200" boxShadow="lg">
                <CardHeader bg="purple.100" borderBottomWidth={1} borderColor="purple.200">
                  <HStack>
                    <FiCpu color="#805AD5" />
                    <Text fontWeight="bold" color="purple.700">AI Performance Dashboard</Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box p={4} bg="white" borderRadius="md">
                      <Text fontSize="sm" color={mutedTextColor} mb={1}>AI Optimizations</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {aiDashboard.totalOptimizations || 0}
                      </Text>
                    </Box>
                    <Box p={4} bg="white" borderRadius="md">
                      <Text fontSize="sm" color={mutedTextColor} mb={1}>Generated Content</Text>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {aiDashboard.totalGeneratedContent || 0}
                      </Text>
                    </Box>
                    <Box p={4} bg="white" borderRadius="md">
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
        </Grid>
        
        {/* Modals */}
        
        {/* Credentials Setup Modal */}
        <Modal isOpen={isCredentialsOpen} onClose={onCredentialsClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>API Credentials Setup</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Meta API Required</AlertTitle>
                    <AlertDescription>
                      You need to set up Meta API credentials to create and manage ad campaigns.
                    </AlertDescription>
                  </Box>
                </Alert>
                <Button onClick={onMetaSetupOpen} colorScheme="blue" isFullWidth>
                  Setup Meta API Credentials
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
        
        {/* Meta Setup Modal */}
        <Modal isOpen={isMetaSetupOpen} onClose={onMetaSetupClose} size="2xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Meta API Setup</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {metaSetupSteps ? (
                <VStack align="stretch" spacing={6}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{metaSetupSteps.title}</AlertTitle>
                    </Box>
                  </Alert>
                  
                  <Accordion allowToggle>
                    {metaSetupSteps.steps.map((step) => (
                      <AccordionItem key={step.step}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="bold">{step.title}</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <List spacing={2}>
                            {step.instructions.map((instruction, idx) => (
                              <ListItem key={idx}>
                                <ListIcon as={FiChevronRight} color="blue.500" />
                                {instruction}
                              </ListItem>
                            ))}
                          </List>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  <Divider />
                  
                  <FormControl isRequired>
                    <FormLabel>Access Token</FormLabel>
                    <Input
                      type="password"
                      value={metaCredentials.accessToken}
                      onChange={(e) => setMetaCredentials({ ...metaCredentials, accessToken: e.target.value })}
                      placeholder="Enter your Meta access token"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>App ID</FormLabel>
                    <Input
                      value={metaCredentials.appId}
                      onChange={(e) => setMetaCredentials({ ...metaCredentials, appId: e.target.value })}
                      placeholder="Enter your Facebook App ID"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>App Secret</FormLabel>
                    <Input
                      type="password"
                      value={metaCredentials.appSecret}
                      onChange={(e) => setMetaCredentials({ ...metaCredentials, appSecret: e.target.value })}
                      placeholder="Enter your Facebook App Secret"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Ad Account ID (Optional)</FormLabel>
                    <Input
                      value={metaCredentials.adAccountId}
                      onChange={(e) => setMetaCredentials({ ...metaCredentials, adAccountId: e.target.value })}
                      placeholder="act_123456789"
                    />
                    <FormHelperText>Format: act_123456789</FormHelperText>
                  </FormControl>
                </VStack>
              ) : (
                <Center py={8}>
                  <Spinner size="xl" />
                </Center>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onMetaSetupClose}>
                Cancel
              </Button>
              {credentialsStatus?.meta?.isConfigured && (
                <Button variant="outline" mr={3} onClick={verifyMetaCredentials} isLoading={loading}>
                  Verify
                </Button>
              )}
              <Button colorScheme="blue" onClick={setupMetaCredentials} isLoading={loading}>
                Save Credentials
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Create Campaign Modal */}
        <Modal isOpen={isCreateCampaignOpen} onClose={onCreateCampaignClose} size="xl">
          <ModalOverlay />
          <ModalContent>
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
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Objective</FormLabel>
                  <Select
                    value={campaignForm.objective}
                    onChange={(e) => setCampaignForm({ ...campaignForm, objective: e.target.value })}
                  >
                    <option value="CONVERSIONS">Conversions</option>
                    <option value="LEAD_GENERATION">Lead Generation</option>
                    <option value="TRAFFIC">Website Traffic</option>
                    <option value="AWARENESS">Brand Awareness</option>
                    <option value="ENGAGEMENT">Engagement</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Daily Budget ($)</FormLabel>
                  <Input
                    type="number"
                    value={campaignForm.budget}
                    onChange={(e) => setCampaignForm({ ...campaignForm, budget: parseFloat(e.target.value) })}
                    placeholder="50"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Target Audience</FormLabel>
                  <Input
                    value={campaignForm.targetAudience}
                    onChange={(e) => setCampaignForm({ ...campaignForm, targetAudience: e.target.value })}
                    placeholder="e.g., Weight loss enthusiasts, 25-45 years"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Product/Offer Description</FormLabel>
                  <Textarea
                    value={campaignForm.productInfo}
                    onChange={(e) => setCampaignForm({ ...campaignForm, productInfo: e.target.value })}
                    placeholder="Describe your product or offer..."
                    rows={3}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Funnel (Optional)</FormLabel>
                  <Select
                    value={campaignForm.funnelId}
                    onChange={(e) => {
                      const funnel = funnels.find(f => (f._id || f.id) === e.target.value);
                      setCampaignForm({
                        ...campaignForm,
                        funnelId: e.target.value,
                        funnelUrl: funnel?.publicUrl || ''
                      });
                    }}
                    placeholder="Select a funnel..."
                  >
                    {funnels.map((funnel) => (
                      <option key={funnel._id || funnel.id} value={funnel._id || funnel.id}>
                        {funnel.name}
                      </option>
                    ))}
                  </Select>
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
              <Button variant="ghost" mr={3} onClick={onCreateCampaignClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={createCampaign} isLoading={loading}>
                Create Campaign
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* AI Copy Generation Modal */}
        <Modal isOpen={isAICopyOpen} onClose={onAICopyClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FiStar color="#805AD5" />
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
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Product/Offer Description</FormLabel>
                  <Textarea
                    value={aiCopyForm.productInfo}
                    onChange={(e) => setAiCopyForm({ ...aiCopyForm, productInfo: e.target.value })}
                    placeholder="Describe your product or offer..."
                    rows={4}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Campaign Objective</FormLabel>
                  <Select
                    value={aiCopyForm.campaignObjective}
                    onChange={(e) => setAiCopyForm({ ...aiCopyForm, campaignObjective: e.target.value })}
                  >
                    <option value="CONVERSIONS">Conversions</option>
                    <option value="LEAD_GENERATION">Lead Generation</option>
                    <option value="TRAFFIC">Website Traffic</option>
                    <option value="AWARENESS">Brand Awareness</option>
                  </Select>
                </FormControl>
                
                {generatedContent && (
                  <Box p={4} bg="purple.50" borderRadius="md" borderWidth={1} borderColor="purple.200">
                    <Text fontWeight="bold" mb={2}>Generated Ad Copy:</Text>
                    <Text mb={3}>{generatedContent.headline || generatedContent.primaryCopy}</Text>
                    <Button
                      size="sm"
                      leftIcon={<FiCopy />}
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent.headline || generatedContent.primaryCopy);
                        toast({ title: 'Copied!', status: 'success', duration: 2000 });
                      }}
                    >
                      Copy
                    </Button>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAICopyClose}>
                Close
              </Button>
              <Button
                leftIcon={<FiStar />}
                colorScheme="purple"
                onClick={generateAICopy}
                isLoading={loading}
              >
                Generate with AI
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* AI Poster Generation Modal */}
        <Modal isOpen={isAIPosterOpen} onClose={onAIPosterClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FiImage color="#805AD5" />
                <Text>Generate AI Poster</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Coach Name</FormLabel>
                  <Input
                    value={aiPosterForm.coachName}
                    onChange={(e) => setAiPosterForm({ ...aiPosterForm, coachName: e.target.value })}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Niche</FormLabel>
                  <Input
                    value={aiPosterForm.niche}
                    onChange={(e) => setAiPosterForm({ ...aiPosterForm, niche: e.target.value })}
                    placeholder="e.g., Weight Loss, Fitness"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Offer</FormLabel>
                  <Textarea
                    value={aiPosterForm.offer}
                    onChange={(e) => setAiPosterForm({ ...aiPosterForm, offer: e.target.value })}
                    placeholder="Describe your offer..."
                    rows={3}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Target Audience</FormLabel>
                  <Input
                    value={aiPosterForm.targetAudience}
                    onChange={(e) => setAiPosterForm({ ...aiPosterForm, targetAudience: e.target.value })}
                  />
                </FormControl>
                
                {generatedPoster && (
                  <Box p={4} bg="purple.50" borderRadius="md" borderWidth={1} borderColor="purple.200">
                    <Text fontWeight="bold" mb={2}>Generated Poster:</Text>
                    {generatedPoster.imageUrl && (
                      <Image src={generatedPoster.imageUrl} alt="AI Generated Poster" borderRadius="md" mb={2} />
                    )}
                    <Button
                      size="sm"
                      leftIcon={<FiDownload />}
                      onClick={() => {
                        window.open(generatedPoster.imageUrl, '_blank');
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAIPosterClose}>
                Close
              </Button>
              <Button
                leftIcon={<FiStar />}
                colorScheme="purple"
                onClick={generatePoster}
                isLoading={loading}
              >
                Generate Poster
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* AI Targeting Modal */}
        <Modal isOpen={isAITargetingOpen} onClose={onAITargetingClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <FiTarget color="#805AD5" />
                <Text>AI Targeting Recommendations</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Target Audience</FormLabel>
                  <Input
                    value={aiTargetingForm.targetAudience}
                    onChange={(e) => setAiTargetingForm({ ...aiTargetingForm, targetAudience: e.target.value })}
                    placeholder="e.g., Weight loss enthusiasts"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Budget ($)</FormLabel>
                  <Input
                    type="number"
                    value={aiTargetingForm.budget}
                    onChange={(e) => setAiTargetingForm({ ...aiTargetingForm, budget: parseFloat(e.target.value) })}
                  />
                </FormControl>
                
                {generatedTargeting && (
                  <Box p={4} bg="purple.50" borderRadius="md" borderWidth={1} borderColor="purple.200">
                    <Text fontWeight="bold" mb={2}>Targeting Recommendations:</Text>
                    <Text>{JSON.stringify(generatedTargeting, null, 2)}</Text>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAITargetingClose}>
                Close
              </Button>
              <Button
                leftIcon={<FiCpu />}
                colorScheme="purple"
                onClick={generateTargeting}
                isLoading={loading}
              >
                Get Recommendations
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Campaign Details Modal */}
        <Modal isOpen={isCampaignDetailsOpen} onClose={onCampaignDetailsClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
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
                      <Text fontWeight="bold">${selectedCampaign.budget || selectedCampaign.dailyBudget}/day</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color={mutedTextColor}>Objective</Text>
                      <Text fontWeight="bold">{selectedCampaign.objective}</Text>
                    </Box>
                  </SimpleGrid>
                  
                  <Divider />
                  
                  <HStack spacing={2}>
                    <Button
                      leftIcon={<FiCpu />}
                      colorScheme="purple"
                      size="sm"
                      onClick={() => getPerformanceInsights(selectedCampaign._id || selectedCampaign.id)}
                      isLoading={loading}
                    >
                      Get AI Insights
                    </Button>
                    <Button
                      leftIcon={<FiAlertTriangle />}
                      colorScheme="orange"
                      size="sm"
                      onClick={() => detectAnomalies(selectedCampaign._id || selectedCampaign.id)}
                      isLoading={loading}
                    >
                      Detect Anomalies
                    </Button>
                    <Button
                      leftIcon={<FiZap />}
                      colorScheme="purple"
                      size="sm"
                      onClick={() => optimizeCampaign(selectedCampaign._id || selectedCampaign.id)}
                      isLoading={loading}
                    >
                      AI Optimize
                    </Button>
                  </HStack>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onCampaignDetailsClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default MarketingAds;
