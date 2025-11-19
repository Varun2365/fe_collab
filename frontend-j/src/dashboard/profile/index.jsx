import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCoachId, getToken, debugAuthState } from '../../utils/authUtils';
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
  const [activeTab, setActiveTab] = useState(0);
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
    if (activeTab === 5) { // Subscription tab index
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
      window.location.href = `https://api.funnelseye.com/subscription-plans?token=${encodeURIComponent(token)}`;
    } else {
      window.location.href = 'https://api.funnelseye.com/subscription-plans';
    }
  };

  const handleRenew = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `https://api.funnelseye.com/subscription-plans?token=${encodeURIComponent(token)}`;
    } else {
      window.location.href = 'https://api.funnelseye.com/subscription-plans';
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
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py={8}>
        {/* Profile Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card mb={8} bg={cardBg} shadow="lg">
            <CardBody>
              <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
                <Box position="relative">
                  <Avatar
                    size="2xl"
                    src={user.portfolio?.profileImages?.[0]}
                    name={user.name}
                  />
                  {isEditing && (
                    <IconButton
                      icon={<FaEdit />}
                      size="sm"
                      colorScheme="blue"
                      rounded="full"
                      position="absolute"
                      bottom={0}
                      right={0}
                    />
                  )}
                </Box>

                <VStack align={{ base: 'center', md: 'start' }} flex={1} spacing={2}>
                  <Heading size="xl" color={textColor}>
                    {user.name}
                  </Heading>
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                    {user.role === 'coach' ? 'Fitness Coach' : 'User'}
                  </Badge>
                  <Text color={mutedTextColor} textAlign={{ base: 'center', md: 'left' }}>
                    {user.bio || 'No bio available'}
                  </Text>

                  <SimpleGrid columns={{ base: 3, md: 3 }} spacing={4} mt={4}>
                    <Stat textAlign="center">
                      <StatNumber color="blue.500">{user.portfolio?.totalProjectsCompleted || 0}</StatNumber>
                      <StatLabel>Projects</StatLabel>
                    </Stat>
                    <Stat textAlign="center">
                      <StatNumber color="green.500">{user.portfolio?.experienceYears || 0}</StatNumber>
                      <StatLabel>Years Exp.</StatLabel>
                    </Stat>
                    <Stat textAlign="center">
                      <StatNumber color="purple.500">{user.credits || 0}</StatNumber>
                      <StatLabel>Credits</StatLabel>
                    </Stat>
                  </SimpleGrid>
                </VStack>

                <VStack spacing={3}>
                  {!isEditing ? (
                    <>
                      <Button
                        leftIcon={<FaEdit />}
                        colorScheme="blue"
                        onClick={() => setIsEditing(true)}
                        size="lg"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        leftIcon={<FaCreditCard />}
                        colorScheme="green"
                        variant="outline"
                        onClick={onOpen}
                        size="lg"
                      >
                        Add Credits
                      </Button>
                    </>
                  ) : (
                    <HStack>
                      <Button
                        leftIcon={<FaSave />}
                        colorScheme="green"
                        onClick={updateProfile}
                        isLoading={loading}
                        size="lg"
                      >
                        Save
                      </Button>
                      <Button
                        leftIcon={<FaTimes />}
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Flex>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Navigation Tabs */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="blue">
            <TabList mb={6} overflowX="auto">
              <Tab><FaUser /> Overview</Tab>
              <Tab><FaTrophy /> Portfolio</Tab>
              <Tab><FaCalendarAlt /> Appointments</Tab>
              <Tab><IoRocketOutline /> Lead Magnets</Tab>
              <Tab><FaWhatsapp /> WhatsApp</Tab>
              <Tab><FaCreditCard /> Subscription</Tab>
              <Tab><FaEdit /> Settings</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel px={0}>
                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                  {/* Basic Information */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Basic Information</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          {isEditing ? (
                            <Input
                              value={editData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.name || 'Not specified'}</Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Text color={mutedTextColor}>{user.email}</Text>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Bio</FormLabel>
                          {isEditing ? (
                            <Textarea
                              value={editData.bio}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                              placeholder="Tell us about yourself..."
                              rows={3}
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.bio || 'No bio added yet'}</Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Phone</FormLabel>
                          {isEditing ? (
                            <Input
                              value={editData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.phone || 'Not specified'}</Text>
                          )}
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Contact Information */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Contact Information</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>City</FormLabel>
                          {isEditing ? (
                            <Input
                              value={editData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="Enter your city"
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.city || 'Not specified'}</Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Country</FormLabel>
                          {isEditing ? (
                            <Input
                              value={editData.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              placeholder="Enter your country"
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.country || 'Not specified'}</Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Company</FormLabel>
                          {isEditing ? (
                            <Input
                              value={editData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              placeholder="Enter your company name"
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.company || 'Not specified'}</Text>
                          )}
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Professional Information */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Professional Information</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Experience (Years)</FormLabel>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editData.experienceYears}
                              onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value))}
                              min="0"
                              max="50"
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.portfolio?.experienceYears || 0} years</Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Projects Completed</FormLabel>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editData.totalProjectsCompleted}
                              onChange={(e) => handleInputChange('totalProjectsCompleted', parseInt(e.target.value))}
                              min="0"
                            />
                          ) : (
                            <Text color={mutedTextColor}>{user.portfolio?.totalProjectsCompleted || 0} projects</Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Specializations</FormLabel>
                          {isEditing ? (
                            <VStack align="stretch" spacing={2}>
                              {editData.specializations.map((spec, index) => (
                                <HStack key={index}>
                                  <Input
                                    value={spec}
                                    onChange={(e) => updateSpecialization(index, e.target.value)}
                                    placeholder="Enter specialization"
                                  />
                                  <IconButton
                                    icon={<FaTrash />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => removeSpecialization(index)}
                                  />
                                </HStack>
                              ))}
                              <Button
                                leftIcon={<FaPlus />}
                                size="sm"
                                variant="outline"
                                onClick={addSpecialization}
                              >
                                Add Specialization
                              </Button>
                            </VStack>
                          ) : (
                            <Flex wrap="wrap" gap={2}>
                              {user.portfolio?.specializations?.length > 0 ? (
                                user.portfolio.specializations.map((spec, index) => (
                                  <Tag key={index} colorScheme="blue">
                                    {spec}
                                  </Tag>
                                ))
                              ) : (
                                <Text color={mutedTextColor}>No specializations added</Text>
                              )}
                            </Flex>
                          )}
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Account Status */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Account Status</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text>Verification</Text>
                          <Badge colorScheme={user.isVerified ? 'green' : 'orange'}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </Badge>
                        </HStack>

                        <HStack justify="space-between">
                          <Text>Account Status</Text>
                          <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </HStack>

                        <HStack justify="space-between">
                          <Text>Credits</Text>
                          <Badge colorScheme="purple" fontSize="md">
                            {user.credits || 0}
                          </Badge>
                        </HStack>

                        <HStack justify="space-between">
                          <Text>Last Active</Text>
                          <Text color={mutedTextColor} fontSize="sm">
                            {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'Never'}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
              </TabPanel>

              {/* Portfolio Tab */}
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

              {/* Appointments Tab */}
              <TabPanel px={0}>
                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                  {/* Appointment Settings */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Appointment Settings</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Appointment Headline</FormLabel>
                          {isEditing ? (
                            <Input
                              value={editData.appointmentHeadline}
                              onChange={(e) => handleInputChange('appointmentHeadline', e.target.value)}
                              placeholder="Enter appointment headline"
                            />
                          ) : (
                            <Text color={mutedTextColor}>
                              {user.appointmentSettings?.appointmentHeadline || 'Schedule a Call With Us'}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Slot Duration</FormLabel>
                          {isEditing ? (
                            <Select
                              value={editData.slotDuration}
                              onChange={(e) => handleInputChange('slotDuration', parseInt(e.target.value))}
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={45}>45 minutes</option>
                              <option value={60}>60 minutes</option>
                            </Select>
                          ) : (
                            <Text color={mutedTextColor}>
                              {user.appointmentSettings?.slotDuration || 30} minutes
                            </Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Time Zone</FormLabel>
                          {isEditing ? (
                            <Select
                              value={editData.timeZone}
                              onChange={(e) => handleInputChange('timeZone', e.target.value)}
                            >
                              <option value="UTC+05:30">UTC+05:30 (IST)</option>
                              <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                              <option value="UTC-05:00">UTC-05:00 (EST)</option>
                              <option value="UTC-08:00">UTC-08:00 (PST)</option>
                            </Select>
                          ) : (
                            <Text color={mutedTextColor}>
                              {user.appointmentSettings?.timeZone || 'UTC+05:30'}
                            </Text>
                          )}
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Available Days */}
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="md" color={textColor}>Available Days</Heading>
                    </CardHeader>
                    <CardBody>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <HStack key={day} justify="space-between">
                            <Text fontSize="sm">{day}</Text>
                            <Switch
                              isChecked={user.appointmentSettings?.availableDays?.includes(day) || false}
                              isDisabled={!isEditing}
                              size="sm"
                            />
                          </HStack>
                        ))}
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Blocked Dates */}
                  <Card bg={cardBg} shadow="md" gridColumn={{ base: "1", lg: "span 2" }}>
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" color={textColor}>Blocked Dates</Heading>
                        {isEditing && (
                          <Button leftIcon={<FaPlus />} size="sm" colorScheme="red">
                            Add Blocked Date
                          </Button>
                        )}
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      {user.appointmentSettings?.blockedDates?.length > 0 ? (
                        <Flex wrap="wrap" gap={2}>
                          {user.appointmentSettings.blockedDates.map((date, index) => (
                            <Tag key={index} colorScheme="red">
                              <TagLabel>{new Date(date).toLocaleDateString()}</TagLabel>
                              {isEditing && <TagCloseButton />}
                            </Tag>
                          ))}
                        </Flex>
                      ) : (
                        <Text color={mutedTextColor}>No blocked dates set</Text>
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

              {/* WhatsApp Tab */}
              <TabPanel px={0}>
                <Card bg={cardBg} shadow="md">
                  <CardHeader>
                    <Heading size="md" color={textColor}>WhatsApp Configuration</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <FormControl>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          value={whatsappConfig.phoneNumber}
                          onChange={(e) => handleWhatsappChange('phoneNumber', e.target.value)}
                          placeholder="Enter WhatsApp phone number"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Welcome Message</FormLabel>
                        <Textarea
                          value={whatsappConfig.welcomeMessage}
                          onChange={(e) => handleWhatsappChange('welcomeMessage', e.target.value)}
                          placeholder="Enter welcome message for WhatsApp"
                          rows={4}
                        />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">Enable WhatsApp Integration</FormLabel>
                        <Switch
                          isChecked={whatsappConfig.isActive}
                          onChange={(e) => handleWhatsappChange('isActive', e.target.checked)}
                          colorScheme="green"
                        />
                      </FormControl>

                      <Button
                        leftIcon={<FaWhatsapp />}
                        colorScheme="green"
                        onClick={updateWhatsappConfig}
                        isLoading={loading}
                      >
                        Update WhatsApp Configuration
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
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
                                      window.location.href = `https://api.funnelseye.com/subscription-plans?token=${encodeURIComponent(token)}`;
                                    } else {
                                      window.location.href = 'https://api.funnelseye.com/subscription-plans';
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
      </Container>
    </Box>
  );
};

export default Profile;
