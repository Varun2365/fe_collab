import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCoachId, getToken, debugAuthState } from '../../utils/authUtils';
import { API_BASE_URL } from '../../config/apiConfig';
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  Switch,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Image,
  SimpleGrid,
  IconButton,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Center
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaGlobe,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaTrophy,
  FaCertificate,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaPlus,
  FaTrash,
  FaEye,
  FaDownload,
  FaShare,
  FaHeart,
  FaComment,
  FaShareAlt,
  FaBookmark,
  FaEllipsisH,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaWhatsapp,
  FaCreditCard
} from 'react-icons/fa';
import {
  FiCreditCard,
  FiCalendar,
  FiTrendingUp,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiInfo,
  FiDownload,
  FiFileText,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiBarChart,
  FiZap,
  FiShield,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPrinter,
  FiCheckCircle,
  FiImage,
  FiCopy,
} from 'react-icons/fi';
import { subscriptionAPI } from '../../services/subscriptionAPI';
import {
  IoLocationOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoPeopleOutline,
  IoRocketOutline
} from 'react-icons/io5';

const MotionBox = motion(Box);

const Profile = () => {
  const navigate = useNavigate();
  const authState = useSelector(state => state.auth);
  const user = authState?.user;
  const token = getToken(authState);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Portfolio is now default (index 0 after removing Overview)
  const [editData, setEditData] = useState({});
  const [whatsappConfig, setWhatsappConfig] = useState({});
  const [creditsToAdd, setCreditsToAdd] = useState('');
  
  // Subscription state
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const { isOpen: isUpgradeOpen, onOpen: onUpgradeOpen, onClose: onUpgradeClose } = useDisclosure();
  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const { isOpen: isRenewOpen, onOpen: onRenewOpen, onClose: onRenewClose } = useDisclosure();
  const [cancellationReason, setCancellationReason] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  // Initialize edit data
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        city: user.city || '',
        country: user.country || '',
        company: user.company || '',
        phone: user.phone || '',
        experienceYears: user.portfolio?.experienceYears || 0,
        totalProjectsCompleted: user.portfolio?.totalProjectsCompleted || 0,
        specializations: user.portfolio?.specializations || [],
        appointmentHeadline: user.appointmentSettings?.appointmentHeadline || 'Schedule a Call With Us',
        slotDuration: user.appointmentSettings?.slotDuration || 30,
        timeZone: user.appointmentSettings?.timeZone || 'UTC+05:30',
        availableDays: user.appointmentSettings?.availableDays || [],
        blockedDates: user.appointmentSettings?.blockedDates || []
      });

      setWhatsappConfig({
        phoneNumber: user.whatsappConfig?.phoneNumber || '',
        welcomeMessage: user.whatsappConfig?.welcomeMessage || '',
        isActive: user.whatsappConfig?.isActive || false
      });
    }
  }, [user]);

  // Load subscription data
  useEffect(() => {
    if (activeTab === 2) { // Subscription tab index (Portfolio=0, Lead Magnets=1, Subscription=2, Settings=3)
      loadSubscriptionData();
    }
  }, [activeTab]);

  const loadSubscriptionData = async () => {
    try {
      setSubscriptionLoading(true);
      const results = await Promise.allSettled([
        subscriptionAPI.getMySubscription(),
        subscriptionAPI.getSubscriptionHistory({ limit: 50 })
      ]);
      
      if (results[0].status === 'fulfilled' && results[0].value.data) {
        setSubscription(results[0].value.data);
      } else {
        setSubscription(null);
      }
      
      if (results[1].status === 'fulfilled') {
        setPaymentHistory(results[1].value.data || []);
      } else {
        setPaymentHistory([]);
      }
    } catch (err) {
      console.error('Error loading subscription data:', err);
      toast({
        title: 'Error',
        description: 'Failed to load subscription data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text, label) => {
    if (!text || text === 'Not specified') return;
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label || 'Text'} copied to clipboard`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }).catch(() => {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'cancelled': return 'red';
      case 'expired': return 'orange';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  // Calculate usage percentage
  const getUsagePercentage = (current, max) => {
    if (max === 0 || max === -1) return 0;
    return Math.min((current / max) * 100, 100);
  };

  // Handle subscription actions
  const handleUpgrade = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `${API_BASE_URL}/subscription-plans?token=${encodeURIComponent(token)}`;
    } else {
      window.location.href = `${API_BASE_URL}/subscription-plans`;
    }
  };

  const handleRenew = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `${API_BASE_URL}/subscription-plans?token=${encodeURIComponent(token)}`;
    } else {
      window.location.href = `${API_BASE_URL}/subscription-plans`;
    }
  };

  const handleCancel = async () => {
    try {
      await subscriptionAPI.cancelSubscription({ reason: cancellationReason });
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription has been cancelled successfully.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      onCancelClose();
      loadSubscriptionData();
    } catch (err) {
      toast({
        title: 'Cancellation failed',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // API Functions
  const fetchCoachProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coach-profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update user data in Redux store if needed
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch profile data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coach-profile/${user._id}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWhatsappConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coach-profile/${user._id}/whatsapp-config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(whatsappConfig)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'WhatsApp configuration updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to update WhatsApp config');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update WhatsApp configuration',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const addCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coach-profile/add-credits/${user._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credits: parseInt(creditsToAdd) })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Credits added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setCreditsToAdd('');
        onClose();
      } else {
        throw new Error('Failed to add credits');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add credits',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWhatsappChange = (field, value) => {
    setWhatsappConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle specializations
  const addSpecialization = () => {
    setEditData(prev => ({
      ...prev,
      specializations: [...prev.specializations, '']
    }));
  };

  const removeSpecialization = (index) => {
    const newSpecs = editData.specializations.filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      specializations: newSpecs
    }));
  };

  const updateSpecialization = (index, value) => {
    const newSpecs = [...editData.specializations];
    newSpecs[index] = value;
    setEditData(prev => ({
      ...prev,
      specializations: newSpecs
    }));
  };

  if (!user) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color={mutedTextColor}>Loading profile...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} w="100%" 
      css={{
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
          borderRadius: '10px',
          transition: 'background 0.2s',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
        },
        scrollbarWidth: 'thin',
        scrollbarColor: `${useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)')} transparent`,
      }}
    >
      {/* Profile Header - Redesigned with Banner and Overview Content */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box position="relative" w="100%">
          {/* Banner Background Image */}
          <Box
            h="160px"
            w="100%"
            bgImage={user.portfolio?.bannerImage || 'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80)'}
            bgSize="cover"
            bgPosition="center"
            bgRepeat="no-repeat"
            position="relative"
            _after={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
            }}
          />

          {/* Profile Content Card with Overview Content */}
          <Box px={6} position="relative" mt="-60px" zIndex={1}>
            <Box maxW="6xl" mx="auto">
              <Card 
                mb={8} 
                bg={cardBg} 
                borderRadius="10px"
                border="1px solid"
                borderColor={borderColor}
                boxShadow="0 8px 24px rgba(0, 0, 0, 0.12)"
                overflow="hidden"
              >
                {/* Profile Header Section - Compact 2 Column Layout */}
                <CardBody pt={16} pb={5} px={8}>
                  <Grid templateColumns={{ base: "1fr", lg: "auto 1px 1fr" }} gap={6} alignItems="start">
                  {/* Left Section - Avatar & Stats (Horizontal) */}
                  <VStack spacing={3} align={{ base: 'center', lg: 'start' }} w="100%">
                    {/* Avatar Section */}
                    <Box position="relative">
                      <Avatar
                        size="xl"
                        src={user.portfolio?.profileImages?.[0]}
                        name={user.name}
                        border="4px solid"
                        borderColor={cardBg}
                        boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
                        w="100px"
                        h="100px"
                      />
                      {isEditing && (
                        <IconButton
                          icon={<FaEdit />}
                          size="xs"
                          colorScheme="blue"
                          rounded="full"
                          position="absolute"
                          bottom={0}
                          right={0}
                          boxShadow="lg"
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="all 0.2s"
                          border="2px solid"
                          borderColor={cardBg}
                        />
                      )}
                    </Box>

                    {/* Stats - Horizontal Compact Layout */}
                    <HStack spacing={4} align="center" flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
                      <VStack spacing={0} align={{ base: 'center', lg: 'start' }}>
                        <Text 
                          fontSize="2xl" 
                          fontWeight="700" 
                          color="blue.500"
                          lineHeight="1"
                        >
                          {user.portfolio?.totalProjectsCompleted || 0}
                        </Text>
                        <Text 
                          fontSize="2xs" 
                          color={mutedTextColor}
                          fontWeight="500"
                          textTransform="uppercase"
                          letterSpacing="0.5px"
                          mt={0.5}
                        >
                          Projects
                        </Text>
                      </VStack>
                      <VStack spacing={0} align={{ base: 'center', lg: 'start' }}>
                        <Text 
                          fontSize="2xl" 
                          fontWeight="700" 
                          color="green.500"
                          lineHeight="1"
                        >
                          {user.portfolio?.experienceYears || 0}
                        </Text>
                        <Text 
                          fontSize="2xs" 
                          color={mutedTextColor}
                          fontWeight="500"
                          textTransform="uppercase"
                          letterSpacing="0.5px"
                          mt={0.5}
                        >
                          Years
                        </Text>
                      </VStack>
                      <VStack spacing={0} align={{ base: 'center', lg: 'start' }}>
                        <Text 
                          fontSize="2xl" 
                          fontWeight="700" 
                          color="purple.500"
                          lineHeight="1"
                        >
                          {user.credits || 0}
                        </Text>
                        <Text 
                          fontSize="2xs" 
                          color={mutedTextColor}
                          fontWeight="500"
                          textTransform="uppercase"
                          letterSpacing="0.5px"
                          mt={0.5}
                        >
                          Credits
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  {/* Vertical Divider 1 */}
                  <Divider 
                    orientation="vertical" 
                    borderColor={borderColor}
                    display={{ base: 'none', lg: 'block' }}
                    h="100%"
                  />

                  {/* Middle Section - Profile Info & Contact (Compact) */}
                  <VStack 
                    align={{ base: 'center', lg: 'start' }} 
                    spacing={3}
                    w="100%"
                    px={{ base: 0, lg: 4 }}
                  >
                    {/* Name, Verified Badge, and Role - Inline */}
                    <VStack align={{ base: 'center', lg: 'start' }} spacing={1.5} w="100%">
                      <HStack spacing={2} align="center" flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
                        <Heading 
                          size="lg" 
                          color={textColor}
                          fontWeight="700"
                          fontSize={{ base: 'xl', md: '2xl' }}
                        >
                          {user.name}
                        </Heading>
                        {user.isVerified && (
                          <Box
                            as={FiCheckCircle}
                            color="green.500"
                            boxSize={5}
                            title="Verified Account"
                          />
                        )}
                        <Badge 
                          colorScheme="blue" 
                          fontSize="2xs"
                          fontWeight="600"
                          px={2} 
                          py={0.5}
                          borderRadius="6px"
                          textTransform="none"
                          letterSpacing="0.3px"
                          bg="blue.50"
                          color="blue.700"
                          border="1px solid"
                          borderColor="blue.200"
                          _dark={{
                            bg: "blue.900",
                            color: "blue.100",
                            borderColor: "blue.700"
                          }}
                        >
                          {user.role === 'coach' ? 'Fitness Coach' : 'User'}
                        </Badge>
                        <Badge 
                          colorScheme={user.isActive ? 'green' : 'red'}
                          fontSize="2xs"
                          fontWeight="600"
                          px={2} 
                          py={0.5}
                          borderRadius="6px"
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </HStack>
                    </VStack>

                    {/* Bio - Compact */}
                    {user.bio && (
                      <Text 
                        color={mutedTextColor} 
                        textAlign={{ base: 'center', lg: 'left' }}
                        fontSize="xs"
                        lineHeight="1.5"
                        w="100%"
                        noOfLines={2}
                      >
                        {user.bio}
                      </Text>
                    )}

                    {/* Contact Information - Values with Copy Buttons */}
                    <VStack spacing={2.5} align="stretch" w="100%" mt={1}>
                      {user.email && (
                        <HStack spacing={2} align="center" justify="space-between">
                          <HStack spacing={2} align="center" flex={1}>
                            <Box as={FiMail} color={mutedTextColor} boxSize={4} flexShrink={0} />
                            <Text color={textColor} fontSize="sm" fontWeight="500" noOfLines={1} flex={1}>
                              {user.email}
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<FiCopy />}
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => copyToClipboard(user.email, 'Email')}
                            aria-label="Copy email"
                            borderRadius="7px"
                          />
                        </HStack>
                      )}

                      {user.phone && (
                        <HStack spacing={2} align="center" justify="space-between">
                          {isEditing ? (
                            <Input
                              value={editData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter phone"
                              size="sm"
                              fontSize="sm"
                              borderRadius="7px"
                              flex={1}
                            />
                          ) : (
                            <>
                              <HStack spacing={2} align="center" flex={1}>
                                <Box as={FiPhone} color={mutedTextColor} boxSize={4} flexShrink={0} />
                                <Text color={textColor} fontSize="sm" fontWeight="500" noOfLines={1} flex={1}>
                                  {user.phone}
                                </Text>
                              </HStack>
                              <IconButton
                                icon={<FiCopy />}
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => copyToClipboard(user.phone, 'Phone')}
                                aria-label="Copy phone"
                                borderRadius="7px"
                              />
                            </>
                          )}
                        </HStack>
                      )}

                      {([user.city, user.country].filter(Boolean).length > 0) && (
                        <HStack spacing={2} align="center" justify="space-between">
                          {isEditing ? (
                            <HStack spacing={2} w="100%">
                              <Input
                                value={editData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="City"
                                size="sm"
                                fontSize="sm"
                                borderRadius="7px"
                                flex={1}
                              />
                              <Input
                                value={editData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                placeholder="Country"
                                size="sm"
                                fontSize="sm"
                                borderRadius="7px"
                                flex={1}
                              />
                            </HStack>
                          ) : (
                            <>
                              <HStack spacing={2} align="center" flex={1}>
                                <Box as={FiMapPin} color={mutedTextColor} boxSize={4} flexShrink={0} />
                                <Text color={textColor} fontSize="sm" fontWeight="500" noOfLines={1} flex={1}>
                                  {[user.city, user.country].filter(Boolean).join(', ')}
                                </Text>
                              </HStack>
                              <IconButton
                                icon={<FiCopy />}
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => copyToClipboard([user.city, user.country].filter(Boolean).join(', '), 'Location')}
                                aria-label="Copy location"
                                borderRadius="7px"
                              />
                            </>
                          )}
                        </HStack>
                      )}

                      {user.company && (
                        <HStack spacing={2} align="center" justify="space-between">
                          {isEditing ? (
                            <Input
                              value={editData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              placeholder="Enter company"
                              size="sm"
                              fontSize="sm"
                              borderRadius="7px"
                              flex={1}
                            />
                          ) : (
                            <>
                              <HStack spacing={2} align="center" flex={1}>
                                <Box as={FiGlobe} color={mutedTextColor} boxSize={4} flexShrink={0} />
                                <Text color={textColor} fontSize="sm" fontWeight="500" noOfLines={1} flex={1}>
                                  {user.company}
                                </Text>
                              </HStack>
                              <IconButton
                                icon={<FiCopy />}
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => copyToClipboard(user.company, 'Company')}
                                aria-label="Copy company"
                                borderRadius="7px"
                              />
                            </>
                          )}
                        </HStack>
                      )}
                    </VStack>
                  </VStack>

                  {/* Right Section - Experience Only */}
                  <VStack 
                    align={{ base: 'center', lg: 'start' }} 
                    spacing={3}
                    w="100%"
                    px={{ base: 0, lg: 4 }}
                  >
                    {/* Experience - Value with Copy Button */}
                    <HStack spacing={2} align="center" justify="space-between" w="100%">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editData.experienceYears}
                          onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value))}
                          placeholder="Years"
                          size="sm"
                          fontSize="sm"
                          borderRadius="7px"
                          w="120px"
                        />
                      ) : (
                        <>
                          <HStack spacing={2} align="center" flex={1}>
                            <Box as={FiTrendingUp} color={mutedTextColor} boxSize={4} flexShrink={0} />
                            <Text color={textColor} fontSize="sm" fontWeight="500">
                              {user.portfolio?.experienceYears || 0} years
                            </Text>
                          </HStack>
                          <IconButton
                            icon={<FiCopy />}
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => copyToClipboard(`${user.portfolio?.experienceYears || 0} years`, 'Experience')}
                            aria-label="Copy experience"
                            borderRadius="7px"
                          />
                        </>
                      )}
                    </HStack>
                  </VStack>
                  </Grid>
                </CardBody>
              </Card>
            </Box>
          </Box>
        </Box>
      </MotionBox>

      {/* Content Container */}
      <Box px={6} pb={6}>
        <Box maxW="7xl" mx="auto">

          {/* Navigation Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs index={activeTab} onChange={setActiveTab} variant="line" colorScheme="blue">
            <TabList mb={6} overflowX="auto" borderBottom="2px solid" borderColor={borderColor}>
              <Tab 
                _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                fontWeight="500"
                fontSize="sm"
                px={6}
                py={3}
              >
                <HStack spacing={2}>
                  <FaTrophy />
                  <Text>Portfolio</Text>
                </HStack>
              </Tab>
              <Tab 
                _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                fontWeight="500"
                fontSize="sm"
                px={6}
                py={3}
              >
                <HStack spacing={2}>
                  <IoRocketOutline />
                  <Text>Lead Magnets</Text>
                </HStack>
              </Tab>
              <Tab 
                _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                fontWeight="500"
                fontSize="sm"
                px={6}
                py={3}
              >
                <HStack spacing={2}>
                  <FaCreditCard />
                  <Text>Subscription</Text>
                </HStack>
              </Tab>
              <Tab 
                _selected={{ color: 'blue.600', borderBottom: '2px solid', borderColor: 'blue.600' }}
                fontWeight="500"
                fontSize="sm"
                px={6}
                py={3}
              >
                <HStack spacing={2}>
                  <FaEdit />
                  <Text>Settings</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Portfolio Tab - Now Default */}
              <TabPanel px={0}>
                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                  {/* Profile Images */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" color={textColor}>Profile Images</Heading>
                        {isEditing && (
                          <IconButton icon={<FaPlus />} size="sm" colorScheme="blue" />
                        )}
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {user.portfolio?.profileImages?.length > 0 ? (
                        <SimpleGrid columns={3} spacing={4}>
                          {user.portfolio.profileImages.map((image, index) => (
                            <Box key={index} position="relative">
                              <Image
                                src={image}
                                alt={`Profile ${index + 1}`}
                                rounded="md"
                                objectFit="cover"
                                h="100px"
                                w="100%"
                              />
                              {isEditing && (
                                <HStack position="absolute" top={1} right={1} spacing={1}>
                                  <IconButton icon={<FaEye />} size="xs" colorScheme="blue" />
                                  <IconButton icon={<FaTrash />} size="xs" colorScheme="red" />
                                </HStack>
                              )}
                            </Box>
                          ))}
                        </SimpleGrid>
                      ) : (
                        <VStack spacing={4} py={8} color={mutedTextColor}>
                          <FaImage size={40} />
                          <Text>No profile images uploaded yet</Text>
                          {isEditing && (
                            <Button leftIcon={<FaPlus />} size="sm" colorScheme="blue">
                              Upload Image
                            </Button>
                          )}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>

                  {/* Gallery */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" color={textColor}>Gallery</Heading>
                        {isEditing && (
                          <IconButton icon={<FaPlus />} size="sm" colorScheme="blue" />
                        )}
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {user.portfolio?.gallery?.length > 0 ? (
                        <SimpleGrid columns={3} spacing={4}>
                          {user.portfolio.gallery.map((image, index) => (
                            <Box key={index} position="relative">
                              <Image
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                rounded="md"
                                objectFit="cover"
                                h="100px"
                                w="100%"
                              />
                              {isEditing && (
                                <HStack position="absolute" top={1} right={1} spacing={1}>
                                  <IconButton icon={<FaEye />} size="xs" colorScheme="blue" />
                                  <IconButton icon={<FaTrash />} size="xs" colorScheme="red" />
                                </HStack>
                              )}
                            </Box>
                          ))}
                        </SimpleGrid>
                      ) : (
                        <VStack spacing={4} py={8} color={mutedTextColor}>
                          <FaImage size={40} />
                          <Text>No gallery images uploaded yet</Text>
                          {isEditing && (
                            <Button leftIcon={<FaPlus />} size="sm" colorScheme="blue">
                              Upload Image
                            </Button>
                          )}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>

                  {/* Certifications */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" color={textColor}>Certifications</Heading>
                        {isEditing && (
                          <IconButton icon={<FaPlus />} size="sm" colorScheme="blue" />
                        )}
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {user.portfolio?.certificationIcons?.length > 0 ? (
                        <VStack spacing={3}>
                          {user.portfolio.certificationIcons.map((cert, index) => (
                            <HStack key={index} w="100%" p={3} bg={useColorModeValue('gray.50', 'gray.700')} rounded="md">
                              <FaCertificate color="orange" />
                              <VStack align="start" spacing={0} flex={1}>
                                <Text fontWeight="medium">{cert.name || `Certification ${index + 1}`}</Text>
                                <Text fontSize="sm" color={mutedTextColor}>{cert.issuer || 'Issuing Organization'}</Text>
                              </VStack>
                            </HStack>
                          ))}
                        </VStack>
                      ) : (
                        <VStack spacing={4} py={8} color={mutedTextColor}>
                          <FaCertificate size={40} />
                          <Text>No certifications added yet</Text>
                          {isEditing && (
                            <Button leftIcon={<FaPlus />} size="sm" colorScheme="blue">
                              Add Certification
                            </Button>
                          )}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>

                  {/* Testimonials */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" color={textColor}>Testimonials</Heading>
                        {isEditing && (
                          <IconButton icon={<FaPlus />} size="sm" colorScheme="blue" />
                        )}
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {user.portfolio?.testimonials?.length > 0 ? (
                        <VStack spacing={4}>
                          {user.portfolio.testimonials.map((testimonial, index) => (
                            <Card key={index} w="100%" size="sm">
                              <CardBody>
                                <Text fontSize="sm" fontStyle="italic" mb={2}>
                                  "{testimonial.content || 'Great work and dedication!'}"
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color="blue.500">
                                  - {testimonial.author || 'Client'}
                                </Text>
                                <Text fontSize="xs" color={mutedTextColor}>
                                  {testimonial.title || 'Satisfied Customer'}
                                </Text>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      ) : (
                        <VStack spacing={4} py={8} color={mutedTextColor}>
                          <FaComment size={40} />
                          <Text>No testimonials added yet</Text>
                          {isEditing && (
                            <Button leftIcon={<FaPlus />} size="sm" colorScheme="blue">
                              Add Testimonial
                            </Button>
                          )}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>
                </Grid>
              </TabPanel>

              {/* Lead Magnets Tab */}
              <TabPanel px={0}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                  {Object.entries(user.leadMagnets || {}).map(([key, magnet]) => (
                    <Card key={key} bg={cardBg} shadow="md">
                      <CardHeader>
                        <Flex justify="space-between" align="center">
                          <Heading size="sm" color={textColor}>
                            {magnet.title || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Heading>
                          <Badge colorScheme={magnet.isActive ? 'green' : 'gray'}>
                            {magnet.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Text fontSize="sm" color={mutedTextColor} mb={4}>
                          {magnet.description || 'No description available'}
                        </Text>
                        <SimpleGrid columns={2} spacing={4} mb={4}>
                          <Stat textAlign="center">
                            <StatNumber fontSize="md" color="blue.500">{magnet.downloads || 0}</StatNumber>
                            <StatLabel fontSize="xs">Downloads</StatLabel>
                          </Stat>
                          <Stat textAlign="center">
                            <StatNumber fontSize="md" color="green.500">{magnet.leadsGenerated || 0}</StatNumber>
                            <StatLabel fontSize="xs">Leads</StatLabel>
                          </Stat>
                        </SimpleGrid>
                        <HStack spacing={2}>
                          <IconButton icon={<FaEye />} size="sm" colorScheme="blue" />
                          <IconButton icon={<FaEdit />} size="sm" colorScheme="gray" />
                          <IconButton icon={<FaShareAlt />} size="sm" colorScheme="green" />
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel px={0}>
                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                  {/* Account Settings */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Account Settings</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text>Email Notifications</Text>
                          <Switch defaultChecked colorScheme="blue" />
                        </HStack>
                        <Divider />
                        <HStack justify="space-between">
                          <Text>SMS Notifications</Text>
                          <Switch colorScheme="blue" />
                        </HStack>
                        <Divider />
                        <HStack justify="space-between">
                          <Text>Two-Factor Authentication</Text>
                          <Switch colorScheme="blue" />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Privacy Settings */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Privacy Settings</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Profile Visibility</FormLabel>
                          <Select defaultValue="public">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends">Friends Only</option>
                          </Select>
                        </FormControl>

                        <HStack justify="space-between">
                          <Text>Show Contact Info</Text>
                          <Switch defaultChecked colorScheme="blue" />
                        </HStack>

                        <HStack justify="space-between">
                          <Text>Show Online Status</Text>
                          <Switch defaultChecked colorScheme="blue" />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Data Management */}
                  <Card bg={cardBg} shadow="md" gridColumn={{ base: "1", lg: "span 2" }}>
                    <CardHeader>
                      <Heading size="md" color={textColor}>Data Management</Heading>
                    </CardHeader>
                    <CardBody>
                      <HStack spacing={4}>
                        <Button leftIcon={<FaDownload />} colorScheme="blue" variant="outline">
                          Export My Data
                        </Button>
                        <Button leftIcon={<FaTrash />} colorScheme="red" variant="outline">
                          Delete Account
                        </Button>
                      </HStack>
                    </CardBody>
                  </Card>
                </Grid>
              </TabPanel>

              {/* Subscription Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  {subscriptionLoading ? (
                    <Center py={10}>
                      <Spinner size="xl" color="blue.500" />
                    </Center>
                  ) : (
                    <>
                      {/* No Subscription Message */}
                      {!subscription && (
                        <Card bg={cardBg} borderRadius="xl" boxShadow="lg" border="2px solid" borderColor="gray.200">
                          <CardBody>
                            <VStack spacing={4} py={8}>
                              <Icon as={FiAlertTriangle} boxSize={12} color="orange.500" />
                              <Box textAlign="center">
                                <Heading size="md" color={textColor} mb={2}>
                                  No Active Subscription
                                </Heading>
                                <Text color={mutedTextColor} mb={4}>
                                  You don't have an active subscription. Please select a plan below to get started.
                                </Text>
                                <Button
                                  colorScheme="blue"
                                  size="lg"
                                  onClick={() => {
                                    const token = localStorage.getItem('token');
                                    if (token) {
                                      window.location.href = `${API_BASE_URL}/subscription-plans?token=${encodeURIComponent(token)}`;
                                    } else {
                                      window.location.href = `${API_BASE_URL}/subscription-plans`;
                                    }
                                  }}
                                >
                                  View Available Plans
                                </Button>
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      )}

                      {/* Current Plan Status */}
                      {subscription && (
                        <>
                          <Card bg={cardBg} border="2px solid" borderColor={subscription.status === 'active' ? 'green.200' : 'red.200'} borderRadius="xl" boxShadow="lg">
                            <CardHeader bg={subscription.status === 'active' ? 'green.50' : 'red.50'} borderRadius="xl">
                              <HStack justify="space-between" align="center">
                                <HStack spacing={4}>
                                  <Box
                                    p={3}
                                    borderRadius="full"
                                    bg={subscription.status === 'active' ? 'green.100' : 'red.100'}
                                  >
                                    <Icon 
                                      as={subscription.status === 'active' ? FiCheck : FiX} 
                                      boxSize={6} 
                                      color={subscription.status === 'active' ? 'green.600' : 'red.600'} 
                                    />
                                  </Box>
                                  <Box>
                                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                                      {subscription.planId?.name || 'No Active Plan'}
                                    </Text>
                                    <Text fontSize="md" color={mutedTextColor}>
                                      {subscription.status === 'active' ? '✅ Active Subscription' : '❌ Inactive Subscription'}
                                    </Text>
                                  </Box>
                                </HStack>
                                <VStack align="end" spacing={1}>
                                  <Badge
                                    colorScheme={getStatusColor(subscription.status)}
                                    fontSize="md"
                                    px={4}
                                    py={2}
                                    borderRadius="full"
                                  >
                                    {subscription.status?.toUpperCase()}
                                  </Badge>
                                  {subscription.daysUntilExpiry && (
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {subscription.daysUntilExpiry} days remaining
                                    </Text>
                                  )}
                                </VStack>
                              </HStack>
                            </CardHeader>
                            <CardBody>
                              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                                {/* Billing Info */}
                                <Box>
                                  <HStack mb={3}>
                                    <Icon as={FiDollarSign} color="blue.500" />
                                    <Text fontWeight="semibold" color={textColor}>Billing</Text>
                                  </HStack>
                                  <VStack align="stretch" spacing={2}>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>Amount:</Text>
                                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                                        {formatCurrency(subscription.billing?.amount, subscription.billing?.currency)}
                                      </Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>Cycle:</Text>
                                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                                        {subscription.billing?.billingCycle}
                                      </Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>Next Billing:</Text>
                                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                                        {formatDate(subscription.billing?.nextBillingDate)}
                                      </Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>Payment Status:</Text>
                                      <Badge
                                        colorScheme={subscription.billing?.paymentStatus === 'paid' ? 'green' : 'red'}
                                        size="sm"
                                      >
                                        {subscription.billing?.paymentStatus}
                                      </Badge>
                                    </HStack>
                                  </VStack>
                                </Box>

                                {/* Usage Stats */}
                                <Box>
                                  <HStack mb={3}>
                                    <Icon as={FiBarChart} color="green.500" />
                                    <Text fontWeight="semibold" color={textColor}>Usage</Text>
                                  </HStack>
                                  <VStack align="stretch" spacing={3}>
                                    <Box>
                                      <HStack justify="space-between" mb={1}>
                                        <Text fontSize="xs" color={mutedTextColor}>Funnels</Text>
                                        <Text fontSize="xs" fontWeight="semibold" color={textColor}>
                                          {subscription.usage?.currentFunnels || 0} / {subscription.planId?.features?.maxFunnels === -1 ? '∞' : subscription.planId?.features?.maxFunnels || 0}
                                        </Text>
                                      </HStack>
                                      <Progress
                                        value={getUsagePercentage(
                                          subscription.usage?.currentFunnels || 0,
                                          subscription.planId?.features?.maxFunnels || 1
                                        )}
                                        colorScheme="blue"
                                        size="sm"
                                        borderRadius="md"
                                      />
                                    </Box>
                                    <Box>
                                      <HStack justify="space-between" mb={1}>
                                        <Text fontSize="xs" color={mutedTextColor}>Leads</Text>
                                        <Text fontSize="xs" fontWeight="semibold" color={textColor}>
                                          {subscription.usage?.currentLeads || 0} / {subscription.limits?.maxLeads === -1 || subscription.planId?.limits?.maxLeads === -1 ? '∞' : (subscription.limits?.maxLeads || subscription.planId?.limits?.maxLeads || 0).toLocaleString()}
                                        </Text>
                                      </HStack>
                                      <Progress
                                        value={getUsagePercentage(
                                          subscription.usage?.currentLeads || 0,
                                          subscription.limits?.maxLeads || subscription.planId?.limits?.maxLeads || 1
                                        )}
                                        colorScheme="green"
                                        size="sm"
                                        borderRadius="md"
                                      />
                                    </Box>
                                    <Box>
                                      <HStack justify="space-between" mb={1}>
                                        <Text fontSize="xs" color={mutedTextColor}>Staff</Text>
                                        <Text fontSize="xs" fontWeight="semibold" color={textColor}>
                                          {subscription.usage?.currentStaff || 0} / {subscription.planId?.features?.maxStaff === -1 ? '∞' : subscription.planId?.features?.maxStaff || 0}
                                        </Text>
                                      </HStack>
                                      <Progress
                                        value={getUsagePercentage(
                                          subscription.usage?.currentStaff || 0,
                                          subscription.planId?.features?.maxStaff || 1
                                        )}
                                        colorScheme="purple"
                                        size="sm"
                                        borderRadius="md"
                                      />
                                    </Box>
                                  </VStack>
                                </Box>

                                {/* Features */}
                                <Box>
                                  <HStack mb={3}>
                                    <Icon as={FiZap} color="purple.500" />
                                    <Text fontWeight="semibold" color={textColor}>Features</Text>
                                  </HStack>
                                  <VStack align="stretch" spacing={2}>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>AI Features:</Text>
                                      <Icon
                                        as={subscription.planId?.features?.aiFeatures ? FiCheck : FiX}
                                        color={subscription.planId?.features?.aiFeatures ? 'green.500' : 'red.500'}
                                      />
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>Analytics:</Text>
                                      <Icon
                                        as={subscription.planId?.features?.advancedAnalytics ? FiCheck : FiX}
                                        color={subscription.planId?.features?.advancedAnalytics ? 'green.500' : 'red.500'}
                                      />
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>Priority Support:</Text>
                                      <Icon
                                        as={subscription.planId?.features?.prioritySupport ? FiCheck : FiX}
                                        color={subscription.planId?.features?.prioritySupport ? 'green.500' : 'red.500'}
                                      />
                                    </HStack>
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color={mutedTextColor}>Custom Domain:</Text>
                                      <Icon
                                        as={subscription.planId?.features?.customDomain ? FiCheck : FiX}
                                        color={subscription.planId?.features?.customDomain ? 'green.500' : 'red.500'}
                                      />
                                    </HStack>
                                  </VStack>
                                </Box>

                                {/* Quick Actions */}
                                <Box>
                                  <HStack mb={3}>
                                    <Icon as={FiTrendingUp} color="orange.500" />
                                    <Text fontWeight="semibold" color={textColor}>Actions</Text>
                                  </HStack>
                                  <VStack spacing={2} align="stretch">
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      leftIcon={<FiTrendingUp />}
                                      onClick={handleUpgrade}
                                      isDisabled={subscription.status !== 'active'}
                                    >
                                      Upgrade Plan
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      leftIcon={<FiRefreshCw />}
                                      onClick={handleRenew}
                                      isDisabled={subscription.status !== 'active'}
                                    >
                                      Renew
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      colorScheme="red"
                                      leftIcon={<FiX />}
                                      onClick={onCancelOpen}
                                      isDisabled={subscription.status !== 'active'}
                                    >
                                      Cancel
                                    </Button>
                                  </VStack>
                                </Box>
                              </SimpleGrid>
                            </CardBody>
                          </Card>

                          {/* Detailed Usage */}
                          <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
                            <CardHeader>
                              <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                  <Icon as={FiBarChart} boxSize={6} color="blue.500" />
                                  <Box>
                                    <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                                      Current Plan Service Usage
                                    </Text>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {subscription?.planId?.name || 'Premium Fitness Coach'} - Used vs Available
                                    </Text>
                                  </Box>
                                </HStack>
                                <Button
                                  size="sm"
                                  leftIcon={<FiRefreshCw />}
                                  onClick={loadSubscriptionData}
                                  variant="outline"
                                  colorScheme="blue"
                                >
                                  Refresh
                                </Button>
                              </HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={6} align="stretch">
                                {/* Funnels Usage */}
                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <HStack spacing={2}>
                                      <Icon as={FiTrendingUp} color="blue.500" />
                                      <Text fontWeight="semibold" color={textColor}>Funnels</Text>
                                    </HStack>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {subscription?.usage?.currentFunnels || 0} / {subscription?.planId?.features?.maxFunnels === -1 ? '∞' : subscription?.planId?.features?.maxFunnels || 0}
                                    </Text>
                                  </HStack>
                                  <Progress
                                    value={getUsagePercentage(
                                      subscription?.usage?.currentFunnels || 0,
                                      subscription?.planId?.features?.maxFunnels || 1
                                    )}
                                    colorScheme="blue"
                                    size="lg"
                                    borderRadius="md"
                                  />
                                  <HStack justify="space-between" mt={1}>
                                    <Text fontSize="xs" color="green.600">
                                      Used: {subscription?.usage?.currentFunnels || 0}
                                    </Text>
                                    <Text fontSize="xs" color="blue.600">
                                      Remaining: {subscription?.planId?.features?.maxFunnels === -1 ? '∞' : (subscription?.planId?.features?.maxFunnels || 0) - (subscription?.usage?.currentFunnels || 0)}
                                    </Text>
                                  </HStack>
                                </Box>

                                {/* Leads Usage */}
                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <HStack spacing={2}>
                                      <Icon as={FiUsers} color="green.500" />
                                      <Text fontWeight="semibold" color={textColor}>Leads</Text>
                                    </HStack>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {subscription?.usage?.currentLeads || 0} / {subscription?.planId?.features?.maxLeads === -1 || subscription?.limits?.maxLeads === -1 ? '∞' : (subscription?.limits?.maxLeads || subscription?.planId?.limits?.maxLeads || 0).toLocaleString()}
                                    </Text>
                                  </HStack>
                                  <Progress
                                    value={getUsagePercentage(
                                      subscription?.usage?.currentLeads || 0,
                                      subscription?.limits?.maxLeads || subscription?.planId?.limits?.maxLeads || 1
                                    )}
                                    colorScheme="green"
                                    size="lg"
                                    borderRadius="md"
                                  />
                                  <HStack justify="space-between" mt={1}>
                                    <Text fontSize="xs" color="green.600">
                                      Used: {(subscription?.usage?.currentLeads || 0).toLocaleString()}
                                    </Text>
                                    <Text fontSize="xs" color="blue.600">
                                      Remaining: {subscription?.limits?.maxLeads === -1 || subscription?.planId?.limits?.maxLeads === -1 ? '∞' : ((subscription?.limits?.maxLeads || subscription?.planId?.limits?.maxLeads || 0) - (subscription?.usage?.currentLeads || 0)).toLocaleString()}
                                    </Text>
                                  </HStack>
                                </Box>

                                {/* Staff Usage */}
                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <HStack spacing={2}>
                                      <Icon as={FiUsers} color="purple.500" />
                                      <Text fontWeight="semibold" color={textColor}>Team Members</Text>
                                    </HStack>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {subscription?.usage?.currentStaff || 0} / {subscription?.planId?.features?.maxStaff === -1 ? '∞' : subscription?.planId?.features?.maxStaff || 0}
                                    </Text>
                                  </HStack>
                                  <Progress
                                    value={getUsagePercentage(
                                      subscription?.usage?.currentStaff || 0,
                                      subscription?.planId?.features?.maxStaff || 1
                                    )}
                                    colorScheme="purple"
                                    size="lg"
                                    borderRadius="md"
                                  />
                                  <HStack justify="space-between" mt={1}>
                                    <Text fontSize="xs" color="green.600">
                                      Used: {subscription?.usage?.currentStaff || 0}
                                    </Text>
                                    <Text fontSize="xs" color="blue.600">
                                      Remaining: {subscription?.planId?.features?.maxStaff === -1 ? '∞' : (subscription?.planId?.features?.maxStaff || 0) - (subscription?.usage?.currentStaff || 0)}
                                    </Text>
                                  </HStack>
                                </Box>

                                {/* Automation Rules Usage */}
                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <HStack spacing={2}>
                                      <Icon as={FiZap} color="orange.500" />
                                      <Text fontWeight="semibold" color={textColor}>Automation Rules</Text>
                                    </HStack>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {subscription?.usage?.currentAutomationRules || 0} / {subscription?.planId?.features?.automationRules === -1 || subscription?.limits?.maxAutomationRules === -1 ? '∞' : (subscription?.planId?.features?.automationRules || subscription?.limits?.maxAutomationRules || 0)}
                                    </Text>
                                  </HStack>
                                  <Progress
                                    value={getUsagePercentage(
                                      subscription?.usage?.currentAutomationRules || 0,
                                      subscription?.planId?.features?.automationRules || subscription?.limits?.maxAutomationRules || 1
                                    )}
                                    colorScheme="orange"
                                    size="lg"
                                    borderRadius="md"
                                  />
                                  <HStack justify="space-between" mt={1}>
                                    <Text fontSize="xs" color="green.600">
                                      Used: {subscription?.usage?.currentAutomationRules || 0}
                                    </Text>
                                    <Text fontSize="xs" color="blue.600">
                                      Remaining: {subscription?.planId?.features?.automationRules === -1 || subscription?.limits?.maxAutomationRules === -1 ? '∞' : (subscription?.planId?.features?.automationRules || subscription?.limits?.maxAutomationRules || 0) - (subscription?.usage?.currentAutomationRules || 0)}
                                    </Text>
                                  </HStack>
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>

                          {/* Payment History */}
                          {paymentHistory.length > 0 && (
                            <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
                              <CardHeader>
                                <HStack spacing={3}>
                                  <Icon as={FiFileText} boxSize={6} color="blue.500" />
                                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                                    Payment History
                                  </Text>
                                </HStack>
                              </CardHeader>
                              <CardBody>
                                <TableContainer>
                                  <Table variant="simple">
                                    <Thead>
                                      <Tr>
                                        <Th>Date</Th>
                                        <Th>Amount</Th>
                                        <Th>Status</Th>
                                        <Th>Transaction ID</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {paymentHistory.map((payment, index) => (
                                        <Tr key={index}>
                                          <Td>{formatDate(payment.date)}</Td>
                                          <Td>{formatCurrency(payment.amount, payment.currency)}</Td>
                                          <Td>
                                            <Badge colorScheme={payment.status === 'paid' ? 'green' : 'red'}>
                                              {payment.status}
                                            </Badge>
                                          </Td>
                                          <Td fontSize="sm" color={mutedTextColor}>{payment.transactionId || 'N/A'}</Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </CardBody>
                            </Card>
                          )}
                        </>
                      )}
                    </>
                  )}
                </VStack>

                {/* Cancel Subscription Modal */}
                <Modal isOpen={isCancelOpen} onClose={onCancelClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Cancel Subscription</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <VStack spacing={4} align="stretch">
                        <Alert status="warning">
                          <AlertIcon />
                          <AlertDescription>
                            Are you sure you want to cancel your subscription? This action cannot be undone.
                          </AlertDescription>
                        </Alert>
                        <FormControl>
                          <FormLabel>Reason for Cancellation (Optional)</FormLabel>
                          <Textarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Please let us know why you're cancelling..."
                            rows={4}
                          />
                        </FormControl>
                      </VStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="ghost" mr={3} onClick={onCancelClose}>
                        Keep Subscription
                      </Button>
                      <Button colorScheme="red" onClick={handleCancel}>
                        Cancel Subscription
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </TabPanel>
            </TabPanels>
            </Tabs>
          </MotionBox>
        </Box>
      </Box>

      {/* Add Credits Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Credits</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Credits to Add</FormLabel>
                <Input
                  type="number"
                  value={creditsToAdd}
                  onChange={(e) => setCreditsToAdd(e.target.value)}
                  placeholder="Enter number of credits"
                  min="1"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={addCredits} isLoading={loading}>
                Add Credits
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </Box>
  );
};

export default Profile;
