import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Flex, Text, Button, Input, InputGroup, InputLeftElement, 
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Avatar,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Select, Textarea, Switch, useDisclosure,
  HStack, VStack, Divider, IconButton, Menu, MenuButton, MenuList, MenuItem,
  Alert, AlertIcon, AlertTitle, AlertDescription, useToast,
  Skeleton, SkeletonText, Card, CardBody, CardHeader, Heading,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Tabs, TabList, TabPanels, Tab, TabPanel, Checkbox, CheckboxGroup,
  Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody,
  useColorModeValue, Container, Spacer, Tag, TagLabel, TagCloseButton,
  Progress, CircularProgress, Center, Wrap, WrapItem,
  GridItem, Grid, Stack, ButtonGroup, FormErrorMessage,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, MenuDivider
} from '@chakra-ui/react';
// Custom SVG Icons
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
    <polyline points="17,6 23,6 23,12"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const MoreVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="5" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getCoachId, getToken, isAuthenticated, debugAuthState } from '../../utils/authUtils';

// --- API CONFIGURATION ---
const API_BASE_URL = 'https://api.funnelseye.com/api';

// --- BEAUTIFUL SKELETON COMPONENTS ---
// Professional Loading Skeleton Component with Smooth Animations
const ProfessionalLoader = () => {
  return (
    <Box maxW="full" py={8} px={6}>
      <VStack spacing={8} align="stretch">
        {/* Header Section with Professional Animation */}
        <Card 
          bg="white" 
          borderRadius="xl" 
          boxShadow="lg" 
          border="1px" 
          borderColor="gray.200"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="-100%"
            width="100%"
            height="100%"
            background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)"
            animation="shimmer 2s infinite"
            sx={{
              '@keyframes shimmer': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' }
              }
            }}
          />
          <CardHeader py={6}>
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
                <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
                  <Skeleton height="40px" width="400px" borderRadius="lg" />
                  <Skeleton height="20px" width="600px" borderRadius="md" />
                </VStack>
                <HStack spacing={4}>
                  <Skeleton height="40px" width="300px" borderRadius="lg" />
                  <Skeleton height="40px" width="150px" borderRadius="xl" />
                </HStack>
              </Flex>
              
              {/* Professional Stats Cards with Gradient Animation */}
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                {[...Array(4)].map((_, i) => (
                  <Card 
                    key={i} 
                    variant="outline"
                    borderRadius="xl"
                    overflow="hidden"
                    position="relative"
                    _hover={{ transform: 'translateY(-2px)', transition: 'all 0.3s' }}
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="-100%"
                      width="100%"
                      height="100%"
                      background={`linear-gradient(90deg, transparent, ${
                        ['rgba(59, 130, 246, 0.1)', 'rgba(34, 197, 94, 0.1)', 'rgba(251, 146, 60, 0.1)', 'rgba(168, 85, 247, 0.1)'][i]
                      }, transparent)`}
                      animation="shimmer 2.5s infinite"
                      sx={{
                        '@keyframes shimmer': {
                          '0%': { left: '-100%' },
                          '100%': { left: '100%' }
                        }
                      }}
                    />
                    <CardBody p={6}>
                      <HStack spacing={4} align="center" w="full">
                        <Skeleton 
                          height="60px" 
                          width="60px" 
                          borderRadius="xl" 
                          startColor="gray.200"
                          endColor="gray.300"
                        />
                        <VStack align="start" spacing={2} flex={1}>
                          <Skeleton height="16px" width="120px" borderRadius="md" />
                          <Skeleton height="32px" width="80px" borderRadius="lg" />
                        </VStack>
                        <Skeleton height="24px" width="60px" borderRadius="full" />
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </CardHeader>
        </Card>

        {/* Professional Table Skeleton */}
        <Card 
          bg="white" 
          borderRadius="xl" 
          boxShadow="lg" 
          border="1px" 
          borderColor="gray.200"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="-100%"
            width="100%"
            height="100%"
            background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)"
            animation="shimmer 3s infinite"
            sx={{
              '@keyframes shimmer': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' }
              }
            }}
          />
          <CardHeader py={6}>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Skeleton height="32px" width="200px" borderRadius="lg" />
                <Skeleton height="16px" width="300px" borderRadius="md" />
              </VStack>
              <HStack spacing={3}>
                <Skeleton height="32px" width="150px" borderRadius="lg" />
                <Skeleton height="32px" width="150px" borderRadius="lg" />
              </HStack>
            </Flex>
          </CardHeader>
          
          <CardBody pt={0} px={0}>
            <TableContainer w="full" overflowX="auto" borderRadius="lg" border="1px" borderColor="gray.100" className="hide-scrollbar">
              <Table variant="simple" size="md" w="full">
                <Thead>
                  <Tr bg="gray.50">
                    {[...Array(6)].map((_, i) => (
                      <Th key={i} px={{ base: 3, md: 6 }} py={{ base: 3, md: 5 }}>
                        <Skeleton height="16px" width="80px" borderRadius="md" />
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <Tr key={rowIndex} borderBottom="1px" borderColor="gray.100">
                      {[...Array(6)].map((_, cellIndex) => (
                        <Td key={cellIndex} px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                          {cellIndex === 1 ? (
                            <VStack align="start" spacing={2}>
                              <Skeleton height="20px" width="180px" borderRadius="md" />
                              <Skeleton height="14px" width="250px" borderRadius="sm" />
                              <HStack spacing={2}>
                                <Skeleton height="20px" width="80px" borderRadius="full" />
                                <Skeleton height="20px" width="60px" borderRadius="full" />
                              </HStack>
                            </VStack>
                          ) : cellIndex === 4 ? (
                            <HStack spacing={2} justify="center">
                              <Skeleton height="32px" width="32px" borderRadius="md" />
                              <VStack spacing={0} align="center">
                                <Skeleton height="16px" width="20px" borderRadius="sm" />
                                <Skeleton height="12px" width="40px" borderRadius="sm" />
                              </VStack>
                            </HStack>
                          ) : cellIndex === 5 ? (
                            <HStack spacing={1} justify="center">
                              {[...Array(3)].map((_, btnIndex) => (
                                <Skeleton key={btnIndex} height="32px" width="32px" borderRadius="md" />
                              ))}
                            </HStack>
                          ) : (
                            <Skeleton height="20px" width="60px" borderRadius="md" />
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* Loading Progress Indicator */}
        <Box textAlign="center" py={4}>
          <VStack spacing={3}>
            <HStack spacing={2}>
              <Box
                w="8px"
                h="8px"
                bg="blue.500"
                borderRadius="full"
                animation="pulse 1.4s infinite"
                sx={{
                  '@keyframes pulse': {
                    '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                    '40%': { transform: 'scale(1)', opacity: 1 }
                  }
                }}
              />
              <Box
                w="8px"
                h="8px"
                bg="blue.500"
                borderRadius="full"
                animation="pulse 1.4s infinite 0.2s"
                sx={{
                  '@keyframes pulse': {
                    '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                    '40%': { transform: 'scale(1)', opacity: 1 }
                  }
                }}
              />
              <Box
                w="8px"
                h="8px"
                bg="blue.500"
                borderRadius="full"
                animation="pulse 1.4s infinite 0.4s"
                sx={{
                  '@keyframes pulse': {
                    '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                    '40%': { transform: 'scale(1)', opacity: 1 }
                  }
                }}
              />
            </HStack>
            <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
              Loading staff data...
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

// --- BEAUTIFUL TOAST NOTIFICATIONS ---
const useCustomToast = () => {
  const toast = useToast();
  
  return useCallback((message, status = 'success') => {
    let title = 'Success!';
    if (status === 'error') title = 'Error!';
    else if (status === 'warning') title = 'Warning!';
    else if (status === 'info') title = 'Info!';
    
    toast({
      title,
      description: message,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      variant: 'subtle',
    });
  }, [toast]);
};

// --- BEAUTIFUL STATS CARDS ---
const StatsCard = ({ title, value, icon, color = "blue", trend, isLoading = false }) => {
  const bgColor = useColorModeValue(`${color}.50`, `${color}.900`);
  const borderColor = useColorModeValue(`${color}.200`, `${color}.700`);
  
  return (
    <Card 
      bg={bgColor} 
      border="1px" 
      borderColor={borderColor}
      borderRadius="xl"
      _hover={{ transform: 'translateY(-3px)', shadow: 'xl', borderColor: `${color}.300` }}
      transition="all 0.3s"
      position="relative"
      overflow="hidden"
      boxShadow="md"
    >
      <CardBody p={6}>
        <HStack spacing={4} align="center" w="full">
          <Box
            p={4}
            bg={`${color}.100`}
            borderRadius="xl"
            color={`${color}.600`}
            boxShadow="md"
            _groupHover={{ transform: 'scale(1.1)', bg: `${color}.200` }}
            transition="all 0.3s"
          >
            {icon}
          </Box>
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize={{ base: "xs", md: "sm" }} color={`${color}.700`} fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
              {title}
            </Text>
            {isLoading ? (
              <Skeleton height="28px" width="70px" />
            ) : (
              <Text fontSize="3xl" fontWeight="bold" color={`${color}.800`}>
                {value}
              </Text>
            )}
          </VStack>
          {trend && (
            <Badge 
              colorScheme={trend > 0 ? 'green' : 'red'} 
              variant="solid" 
              size="sm"
              borderRadius="full"
              px={3}
              py={1}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </Badge>
          )}
        </HStack>
      </CardBody>
    </Card>
  );
};

const StaffManagement = () => {
  // --- AUTHENTICATION & STATE ---
  const { token, user } = useSelector(state => state.auth);
  const showToast = useCustomToast();
  
  // --- STATE MANAGEMENT ---
  const [staffData, setStaffData] = useState([]);
  const [permissions, setPermissions] = useState({ categories: {}, presets: {} });
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [staffTasks, setStaffTasks] = useState(null);
  const [staffMetrics, setStaffMetrics] = useState(null);
  const [staffLeads, setStaffLeads] = useState(null);
  const [leadDistribution, setLeadDistribution] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  
  // Modal controls
  const { isOpen: isStaffModalOpen, onOpen: onStaffModalOpen, onClose: onStaffModalClose } = useDisclosure();
  const { isOpen: isPermissionModalOpen, onOpen: onPermissionModalOpen, onClose: onPermissionModalClose } = useDisclosure();
  const { isOpen: isDistributionModalOpen, onOpen: onDistributionModalOpen, onClose: onDistributionModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure();
  
  // Form states
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    permissions: []
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');
  
  // Check if user is coach
  const isCoach = user?.role === 'coach';
  
  // --- API CONFIGURATION ---
  const apiConfig = useMemo(() => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }), [token]);

  // --- API FUNCTIONS ---
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/coach/staff`, apiConfig);
      if (response.data.success) {
        setStaffData(response.data.data || []);
      } else {
        showToast('Failed to fetch staff data', 'error');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      showToast(error.response?.data?.message || 'Failed to fetch staff data', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiConfig, showToast]);

  // Fetch permissions
  const fetchPermissions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/permissions`);
      if (response.data.success) {
        setPermissions(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  }, []);

  // Fetch team performance
  const fetchTeamPerformance = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/coach/staff/team-performance`, apiConfig);
      if (response.data.success) {
        setTeamPerformance(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch team performance:', error);
    }
  }, [apiConfig]);

  // Fetch staff details
  const fetchStaffDetails = useCallback(async (staffId) => {
    try {
      const [tasksRes, metricsRes, leadsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/coach/staff/${staffId}/tasks`, apiConfig),
        axios.get(`${API_BASE_URL}/coach/staff/${staffId}/metrics`, apiConfig),
        axios.get(`${API_BASE_URL}/coach/staff/${staffId}/leads`, apiConfig)
      ]);
      
      if (tasksRes.data.success) setStaffTasks(tasksRes.data.data);
      if (metricsRes.data.success) setStaffMetrics(metricsRes.data.data);
      if (leadsRes.data.success) setStaffLeads(leadsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch staff details:', error);
    }
  }, [apiConfig]);

  // Fetch lead distribution (coach only)
  const fetchLeadDistribution = useCallback(async () => {
    if (!isCoach) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/coach/staff/lead-distribution`, apiConfig);
      if (response.data.success) {
        setLeadDistribution(response.data.data.staff || []);
      }
    } catch (error) {
      console.error('Failed to fetch lead distribution:', error);
    }
  }, [apiConfig, isCoach]);

  // Create new staff member
  const createStaff = useCallback(async () => {
    // Validation
    if (!newStaff.name.trim()) {
      showToast('Please enter staff name', 'error');
      return;
    }
    if (!newStaff.email.trim()) {
      showToast('Please enter staff email', 'error');
      return;
    }
    if (!newStaff.password.trim()) {
      showToast('Please enter staff password', 'error');
      return;
    }
    if (selectedPermissions.length === 0) {
      showToast('Please select at least one permission preset or custom permissions', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/coach/staff`, {
        name: newStaff.name.trim(),
        email: newStaff.email.trim(),
        password: newStaff.password.trim(),
        permissions: selectedPermissions
      }, apiConfig);
      
      if (response.data.success) {
        showToast(`Staff member "${newStaff.name}" created successfully with ${selectedPermissions.length} permissions`, 'success');
        onStaffModalClose();
        setNewStaff({ name: '', email: '', password: '', permissions: [] });
        setSelectedPermissions([]);
        setSelectedPreset('');
        fetchStaff();
      } else {
        showToast(response.data.message || 'Failed to create staff member', 'error');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      showToast(error.response?.data?.message || 'Failed to create staff member', 'error');
    } finally {
      setLoading(false);
    }
  }, [newStaff, selectedPermissions, apiConfig, showToast, onStaffModalClose, fetchStaff]);

  // Update staff permissions
  const updateStaffPermissions = useCallback(async (staffId, permissions) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/coach/staff/${staffId}/permissions`, {
        permissions
      }, apiConfig);
      
      if (response.data.success) {
        showToast('Staff permissions updated successfully', 'success');
        fetchStaff();
      } else {
        showToast('Failed to update permissions', 'error');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      showToast('Failed to update permissions', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiConfig, showToast, fetchStaff]);

  // Assign permission preset
  const assignPreset = useCallback(async (staffId, presetName) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/coach/staff/${staffId}/permission-group`, {
        presetName
      }, apiConfig);
      
      if (response.data.success) {
        showToast(`${presetName} preset assigned successfully`, 'success');
        fetchStaff();
      } else {
        showToast('Failed to assign preset', 'error');
      }
    } catch (error) {
      console.error('Error assigning preset:', error);
      showToast('Failed to assign preset', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiConfig, showToast, fetchStaff]);

  // Toggle staff status
  const toggleStaffStatus = useCallback(async (staffId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/coach/staff/${staffId}/toggle-status`, {}, apiConfig);
      
      if (response.data.success) {
        showToast('Staff status updated successfully', 'success');
        fetchStaff();
      } else {
        showToast('Failed to update staff status', 'error');
      }
    } catch (error) {
      console.error('Error toggling staff status:', error);
      showToast('Failed to update staff status', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiConfig, showToast, fetchStaff]);

  // Update lead distribution
  const updateLeadDistribution = useCallback(async (distributions) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/coach/staff/lead-distribution`, {
        distributions
      }, apiConfig);
      
      if (response.data.success) {
        showToast('Lead distribution updated successfully', 'success');
        fetchLeadDistribution();
      } else {
        showToast('Failed to update lead distribution', 'error');
      }
    } catch (error) {
      console.error('Error updating lead distribution:', error);
      showToast('Failed to update lead distribution', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiConfig, showToast, fetchLeadDistribution]);

  // Delete staff member
  const deleteStaff = useCallback(async (staffId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/coach/staff/${staffId}`, apiConfig);
      
      if (response.data.success) {
        showToast('Staff member deleted successfully', 'success');
        fetchStaff();
      } else {
        showToast('Failed to delete staff member', 'error');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      showToast('Failed to delete staff member', 'error');
    } finally {
      setLoading(false);
    }
  }, [apiConfig, showToast, fetchStaff]);

  // --- UTILITY FUNCTIONS ---
  const handlePresetSelect = useCallback((presetName) => {
    const preset = permissions.presets[presetName];
    if (preset) {
      setSelectedPermissions(preset.permissions);
      setSelectedPreset(presetName);
    }
  }, [permissions.presets]);

  const handleStaffSelect = useCallback((staff) => {
    setSelectedStaff(staff);
    onDetailsModalOpen();
  }, [onDetailsModalOpen]);

  const handleDeleteClick = useCallback((staff) => {
    setStaffToDelete(staff);
    onDeleteModalOpen();
  }, [onDeleteModalOpen]);

  const confirmDelete = useCallback(async () => {
    if (staffToDelete) {
      await deleteStaff(staffToDelete._id);
      setStaffToDelete(null);
      onDeleteModalClose();
    }
  }, [staffToDelete, deleteStaff, onDeleteModalClose]);

  // Filter staff based on search and status
  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || (statusFilter === 'active' ? staff.isActive : !staff.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [staffData, searchTerm, statusFilter]);

  // Load data on component mount
  useEffect(() => {
    fetchStaff();
    fetchPermissions();
    fetchTeamPerformance();
    fetchLeadDistribution();
  }, [fetchStaff, fetchPermissions, fetchTeamPerformance, fetchLeadDistribution]);

  // Load staff details when selected
  useEffect(() => {
    if (selectedStaff) {
      fetchStaffDetails(selectedStaff._id);
    }
  }, [selectedStaff, fetchStaffDetails]);

  // --- RENDER FUNCTIONS ---
  const renderPermissionCategories = () => {
    return Object.entries(permissions.categories || {}).map(([category, data]) => (
      <Box key={category} mb={6}>
        <Heading size="md" mb={3} color="gray.700">
          {category}
        </Heading>
        <CheckboxGroup
          value={selectedPermissions}
          onChange={setSelectedPermissions}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
            {data.permissions.map((permission) => (
              <Checkbox
                key={permission.permission}
                value={permission.permission}
                colorScheme="blue"
              >
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="medium">
                    {permission.icon} {permission.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {permission.description}
                  </Text>
                </VStack>
              </Checkbox>
            ))}
          </SimpleGrid>
        </CheckboxGroup>
      </Box>
    ));
  };

  const renderPermissionPresets = () => {
    return Object.entries(permissions.presets || {}).map(([name, preset]) => (
      <Button
        key={name}
        variant={selectedPreset === name ? 'solid' : 'outline'}
        size="sm"
        onClick={() => handlePresetSelect(name)}
        colorScheme={selectedPreset === name ? 'green' : 'gray'}
        mb={2}
        mr={2}
        borderRadius="xl"
        _hover={{ 
          transform: 'translateY(-2px)', 
          boxShadow: 'lg',
          bg: selectedPreset === name ? 'green.600' : 'gray.50'
        }}
        transition="all 0.3s ease"
        fontWeight="semibold"
        px={4}
        py={2}
        border="2px"
        borderColor={selectedPreset === name ? 'green.500' : 'gray.300'}
        bg={selectedPreset === name ? 'green.500' : 'white'}
        color={selectedPreset === name ? 'white' : 'gray.700'}
      >
        <HStack spacing={2}>
          <Text>{name}</Text>
          <Badge 
            colorScheme={selectedPreset === name ? 'white' : 'green'} 
            variant={selectedPreset === name ? 'solid' : 'subtle'}
            borderRadius="full"
            px={2}
            py={0}
            fontSize="xs"
          >
            {preset.permissionCount}
          </Badge>
        </HStack>
      </Button>
    ));
  };

  const renderStaffCard = (staff) => (
    <Card 
      key={staff._id} 
      bg="white" 
      borderRadius="xl" 
      boxShadow="md" 
      border="1px" 
      borderColor="gray.200"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      transition="all 0.3s"
    >
      <CardHeader>
        <Flex justify="space-between" align="center">
          <HStack>
            <Avatar name={staff.name} size="md" />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color="gray.800">
                {staff.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {staff.email}
              </Text>
            </VStack>
          </HStack>
          <Menu>
            <MenuButton as={IconButton} icon={<MoreVerticalIcon />} variant="ghost" />
            <MenuList>
              <MenuItem icon={<ViewIcon />} onClick={() => handleStaffSelect(staff)}>
                View Details
              </MenuItem>
              {isCoach && (
                <>
                  <MenuItem icon={<EditIcon />} onClick={() => {
                    setSelectedStaff(staff);
                    setSelectedPermissions(staff.permissions || []);
                    onPermissionModalOpen();
                  }}>
                    Manage Permissions
                  </MenuItem>
                  <MenuItem icon={<SettingsIcon />} onClick={() => toggleStaffStatus(staff._id)}>
                    {staff.isActive ? 'Deactivate' : 'Activate'}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<DeleteIcon />} color="red.500" onClick={() => handleDeleteClick(staff)}>
                    Delete
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">Status</Text>
            <Badge colorScheme={staff.isActive ? 'green' : 'red'}>
              {staff.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">Permissions</Text>
            <Text fontSize="sm" fontWeight="medium">
              {staff.permissions?.length || 0}
            </Text>
          </HStack>
          
          {isCoach && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Lead Ratio</Text>
              <Text fontSize="sm" fontWeight="medium">
                {staff.distributionRatio || 1}x
              </Text>
            </HStack>
          )}
          
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">Last Active</Text>
            <Text fontSize="sm">
              {staff.lastActive ? new Date(staff.lastActive).toLocaleDateString() : 'Never'}
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const renderTeamLeaderboard = () => {
    if (!teamPerformance) return <Skeleton height="200px" />;
    
    return (
      <Card bg="white" borderRadius="xl" boxShadow="md" border="1px" borderColor="gray.200">
        <CardHeader>
          <Heading size="md" color="gray.800">
            🏆 Team Performance Leaderboard
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            {teamPerformance.teamLeaderboard?.map((member, index) => (
              <HStack
                key={member.staffId}
                w="full"
                p={3}
                bg={member.isCurrentUser ? 'blue.50' : 'transparent'}
                borderRadius="md"
                border={member.isCurrentUser ? '2px solid' : '1px solid'}
                borderColor={member.isCurrentUser ? 'blue.200' : 'gray.200'}
              >
                <Text fontWeight="bold" color={member.isCurrentUser ? 'blue.600' : 'gray.800'}>
                  #{member.rank}
                </Text>
                <Avatar name={member.staffName} size="sm" />
                <VStack align="start" flex={1} spacing={0}>
                  <Text fontWeight="medium" color="gray.800">
                    {member.staffName}
                    {member.isCurrentUser && <Text as="span" color="blue.500"> (You)</Text>}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {member.leadsAssigned} leads • {member.conversionRate}% conversion
                  </Text>
                </VStack>
                <VStack align="end" spacing={0}>
                  <Text fontWeight="bold" color="green.500">
                    {member.performanceScore}
                  </Text>
                  <Text fontSize="xs" color="gray.500">Score</Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
          
          {teamPerformance.teamAverage && (
            <Box mt={4} p={3} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.500">
                Team Average: {teamPerformance.teamAverage.conversionRate}% conversion • 
                {teamPerformance.teamAverage.leadsPerStaff} leads per staff
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>
    );
  };

  const renderLeadDistribution = () => {
    if (!isCoach) return null;
    
    return (
      <Card bg="white" borderRadius="xl" boxShadow="md" border="1px" borderColor="gray.200">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md" color="gray.800">
              📊 Lead Distribution
            </Heading>
            <Button size="sm" onClick={onDistributionModalOpen}>
              <EditIcon mr={2} />
              Manage
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            {leadDistribution.map((staff) => (
              <HStack key={staff.staffId} w="full" justify="space-between">
                <Text color="gray.800">{staff.name}</Text>
                <HStack>
                  <Slider
                    value={staff.distributionRatio}
                    min={0}
                    max={5}
                    step={0.1}
                    w="100px"
                    onChange={(value) => {
                      const newDistributions = leadDistribution.map(s => 
                        s.staffId === staff.staffId ? { ...s, distributionRatio: value } : s
                      );
                      setLeadDistribution(newDistributions);
                    }}
                    onChangeEnd={(value) => {
                      updateLeadDistribution([{
                        staffId: staff.staffId,
                        ratio: value
                      }]);
                    }}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text fontSize="sm" fontWeight="medium" minW="40px">
                    {staff.distributionRatio}x
                  </Text>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>
    );
  };

  // --- MAIN RENDER ---
  if (loading && staffData.length === 0) {
    return <ProfessionalLoader />;
  }

  return (
    <Box bg="gray.50" minH="100vh" pt="20px">
      <Box w="100%" py={4} px={4}>
        {/* Header */}
        <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200" mb={6}>
          <CardHeader py={4}>
            <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
              <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
                <Heading size="xl" color="gray.800">
                   Staff Management
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  {isCoach ? 'Manage your team members and their permissions' : 'View your team and performance'}
                </Text>
              </VStack>
              
              {isCoach && (
                <Button
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<AddIcon />}
                  onClick={onStaffModalOpen}
                  borderRadius="xl"
                  px={8}
                >
                  Add Staff Member
                </Button>
              )}
            </Flex>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
          <StatsCard
            title="Total Staff"
            value={staffData.length}
            icon={<UsersIcon />}
            color="blue"
            isLoading={loading}
          />
          
          <StatsCard
            title="Team Performance"
            value={`${teamPerformance?.teamAverage?.conversionRate || 0}%`}
            icon={<TrendingUpIcon />}
            color="green"
            isLoading={loading}
          />
          
          <StatsCard
            title="Top Performer"
            value={teamPerformance?.topPerformer?.performanceScore || 0}
            icon={<AwardIcon />}
            color="orange"
            isLoading={loading}
          />
          
          <StatsCard
            title="Your Rank"
            value={teamPerformance?.myRank ? `#${teamPerformance.myRank}` : 'Coach'}
            icon={<TargetIcon />}
            color="purple"
            isLoading={loading}
          />
        </SimpleGrid>

        {/* Main Content */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Staff List */}
          <Box>
            {/* Filters */}
            <Card bg="white" borderRadius="xl" boxShadow="md" border="1px" borderColor="gray.200" mb={6}>
              <CardBody>
                <Flex gap={4} align="center">
                  <InputGroup flex={1}>
                    <InputLeftElement>
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search staff members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderRadius="xl"
                    />
                  </InputGroup>
                  
                  <Select
                    placeholder="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    w="200px"
                    borderRadius="xl"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                  
                  <ButtonGroup size="sm">
                    <IconButton
                      icon={<GridIcon />}
                      variant={viewMode === 'grid' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('grid')}
                      borderRadius="xl"
                    />
                    <IconButton
                      icon={<ListIcon />}
                      variant={viewMode === 'list' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('list')}
                      borderRadius="xl"
                    />
                  </ButtonGroup>
                </Flex>
              </CardBody>
            </Card>

            {/* Staff Grid/List */}
            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} height="200px" borderRadius="xl" />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredStaff.map(renderStaffCard)}
              </SimpleGrid>
            )}
          </Box>

          {/* Sidebar */}
          <VStack spacing={6} align="stretch">
            {renderTeamLeaderboard()}
            {renderLeadDistribution()}
          </VStack>
        </Grid>

        {/* Staff Details Modal */}
        <Modal isOpen={isDetailsModalOpen} onClose={onDetailsModalClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="xl">
            <ModalHeader>
              <HStack>
                <Avatar name={selectedStaff?.name} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{selectedStaff?.name}</Text>
                  <Text fontSize="sm" color="gray.500">{selectedStaff?.email}</Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs>
                <TabList>
                  <Tab>Tasks</Tab>
                  <Tab>Metrics</Tab>
                  <Tab>Leads</Tab>
                  <Tab>Permissions</Tab>
                </TabList>
                
                <TabPanels>
                  <TabPanel>
                    {staffTasks ? (
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text fontWeight="bold">Total Tasks: {staffTasks.total}</Text>
                          <Badge colorScheme="green">Completion: {staffTasks.completionRate}%</Badge>
                        </HStack>
                        
                        <Box>
                          <Text fontWeight="medium" mb={2}>Today's Tasks</Text>
                          {staffTasks.todayTasks?.map((task) => (
                            <Card key={task._id} size="sm" mb={2}>
                              <CardBody>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">{task.title}</Text>
                                  <Badge colorScheme={
                                    task.priority === 'high' ? 'red' :
                                    task.priority === 'medium' ? 'yellow' : 'green'
                                  }>
                                    {task.priority}
                                  </Badge>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                        </Box>
                      </VStack>
                    ) : (
                      <Skeleton height="200px" />
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    {staffMetrics ? (
                      <VStack spacing={4} align="stretch">
                        <Card bg="blue.50">
                          <CardBody>
                            <HStack justify="space-between">
                              <VStack align="start">
                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                  {staffMetrics.performanceScore?.overallScore}
                                </Text>
                                <Text fontSize="sm" color="gray.500">Performance Score</Text>
                              </VStack>
                              <VStack align="end">
                                <Text fontSize="lg" fontWeight="bold">
                                  {staffMetrics.performanceScore?.rating?.label}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {staffMetrics.performanceScore?.rating?.icon}
                                </Text>
                              </VStack>
                            </HStack>
                          </CardBody>
                        </Card>
                        
                        <SimpleGrid columns={2} spacing={4}>
                          {Object.entries(staffMetrics.performanceScore?.breakdown || {}).map(([key, value]) => (
                            <Card key={key} size="sm">
                              <CardBody>
                                <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </Text>
                                <Text fontSize="lg" fontWeight="bold">
                                  {value.score}/{value.max}
                                </Text>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>
                      </VStack>
                    ) : (
                      <Skeleton height="200px" />
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    {staffLeads ? (
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <Text fontWeight="bold">Total Leads: {staffLeads.total}</Text>
                          <Badge colorScheme="green">Conversion: {staffLeads.conversionRate}%</Badge>
                        </HStack>
                        
                        <SimpleGrid columns={2} spacing={4}>
                          {Object.entries(staffLeads.leadsByStatus || {}).map(([status, count]) => (
                            <Card key={status} size="sm">
                              <CardBody>
                                <Text fontSize="sm" textTransform="capitalize">{status}</Text>
                                <Text fontSize="lg" fontWeight="bold">{count}</Text>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>
                      </VStack>
                    ) : (
                      <Skeleton height="200px" />
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="bold">Permissions ({selectedStaff?.permissions?.length || 0})</Text>
                      <Wrap>
                        {selectedStaff?.permissions?.map((permission) => (
                          <WrapItem key={permission}>
                            <Tag size="sm" colorScheme="blue">
                              <TagLabel>{permission}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Add Staff Modal */}
        <Modal isOpen={isStaffModalOpen} onClose={onStaffModalClose} size="6xl">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent 
            borderRadius="xl" 
            maxW="1200px" 
            maxH="90vh" 
            overflow="hidden"
            boxShadow="2xl"
          >
            <ModalHeader 
              bg="white" 
              borderBottom="1px solid" 
              borderColor="gray.200"
              py={6}
            >
              <HStack justify="space-between" w="full">
                <HStack spacing={4}>
                  <Box 
                    p={3} 
                    bg="blue.50" 
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="blue.100"
                  >
                    <UsersIcon />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      Add New Staff Member
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Create a team member with proper access permissions
                    </Text>
                  </VStack>
                </HStack>
                <ModalCloseButton position="static" />
              </HStack>
            </ModalHeader>
            
            <ModalBody p={0} overflowY="auto">
              <Box p={8}>
                <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={8}>
                  {/* Left Column - Basic Info & Presets */}
                  <VStack spacing={6} align="stretch">
                    {/* Basic Information Section */}
                    <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                      <CardHeader pb={4}>
                        <HStack>
                          <Box p={2} bg="blue.100" borderRadius="lg">
                            <EditIcon />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                              Basic Information
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              Staff member details
                            </Text>
                          </VStack>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel fontWeight="semibold" color="gray.700">Full Name</FormLabel>
                            <Input
                              value={newStaff.name}
                              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                              placeholder="Enter full name"
                              borderRadius="lg"
                              border="1px"
                              borderColor="gray.300"
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                            />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel fontWeight="semibold" color="gray.700">Email Address</FormLabel>
                            <Input
                              type="email"
                              value={newStaff.email}
                              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                              placeholder="Enter email address"
                              borderRadius="lg"
                              border="1px"
                              borderColor="gray.300"
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                            />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel fontWeight="semibold" color="gray.700">Password</FormLabel>
                            <Input
                              type="password"
                              value={newStaff.password}
                              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                              placeholder="Enter secure password"
                              borderRadius="lg"
                              border="1px"
                              borderColor="gray.300"
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                            />
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Permission Presets Section */}
                    <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                      <CardHeader pb={4}>
                        <HStack>
                          <Box p={2} bg="green.100" borderRadius="lg">
                            <SettingsIcon />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                              Role Presets
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              Quick permission templates
                            </Text>
                          </VStack>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <VStack spacing={4} align="stretch">
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={3}>
                              Choose a role preset to automatically assign permissions:
                            </Text>
                            <Box>
                              {renderPermissionPresets()}
                            </Box>
                          </Box>
                          
                          {selectedPreset && (
                            <Alert status="success" borderRadius="lg" bg="green.50" border="1px" borderColor="green.200">
                              <AlertIcon color="green.500" />
                              <Box>
                                <Text fontSize="sm" fontWeight="semibold" color="green.800">
                                  ✓ {selectedPreset} Selected
                                </Text>
                                <Text fontSize="xs" color="green.600">
                                  {selectedPermissions.length} permissions assigned • {permissions.presets[selectedPreset]?.description || ''}
                                </Text>
                              </Box>
                            </Alert>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>

                  {/* Right Column - Custom Permissions */}
                  <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
                    <CardHeader pb={4}>
                      <HStack>
                        <Box p={2} bg="purple.100" borderRadius="lg">
                          <SettingsIcon />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.800">
                            Custom Permissions
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Additional access controls
                          </Text>
                        </VStack>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center">
                          <Text fontSize="sm" color="gray.600">
                            Add specific permissions beyond the selected preset
                          </Text>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="blue"
                              onClick={() => {
                                const allPermissions = Object.values(permissions.categories || {})
                                  .flatMap(category => category.permissions.map(p => p.permission));
                                setSelectedPermissions(allPermissions);
                              }}
                              borderRadius="lg"
                            >
                              Select All
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="red"
                              onClick={() => setSelectedPermissions([])}
                              borderRadius="lg"
                            >
                              Clear All
                            </Button>
                          </HStack>
                        </HStack>
                        
                        <InputGroup>
                          <InputLeftElement>
                            <SearchIcon />
                          </InputLeftElement>
                          <Input
                            placeholder="Search permissions..."
                            value={permissionSearch}
                            onChange={(e) => setPermissionSearch(e.target.value)}
                            borderRadius="lg"
                            border="1px"
                            borderColor="gray.300"
                            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                          />
                        </InputGroup>
                        
                        <Box 
                          maxH="600px" 
                          overflowY="auto" 
                          border="1px" 
                          borderColor="gray.300" 
                          borderRadius="lg" 
                          p={4}
                          bg="gray.50"
                        >
                          <CheckboxGroup
                            value={selectedPermissions}
                            onChange={setSelectedPermissions}
                          >
                            <VStack spacing={4} align="stretch">
                              {Object.entries(permissions.categories || {})
                                .filter(([category, data]) => {
                                  if (!permissionSearch) return true;
                                  const searchLower = permissionSearch.toLowerCase();
                                  return category.toLowerCase().includes(searchLower) ||
                                         data.permissions.some(p => 
                                           p.name.toLowerCase().includes(searchLower) ||
                                           p.permission.toLowerCase().includes(searchLower)
                                         );
                                })
                                .map(([category, data]) => {
                                  const filteredPermissions = data.permissions.filter(permission => {
                                    if (!permissionSearch) return true;
                                    const searchLower = permissionSearch.toLowerCase();
                                    return permission.name.toLowerCase().includes(searchLower) ||
                                           permission.permission.toLowerCase().includes(searchLower) ||
                                           category.toLowerCase().includes(searchLower);
                                  });
                                  
                                  if (filteredPermissions.length === 0) return null;
                                  
                                  return (
                                    <Box key={category} bg="white" p={4} borderRadius="lg" border="1px" borderColor="gray.200" boxShadow="sm">
                                      <HStack mb={3}>
                                        <Box p={1} bg="blue.100" borderRadius="md">
                                          <SettingsIcon />
                                        </Box>
                                        <Text fontSize="md" fontWeight="bold" color="gray.800" textTransform="capitalize">
                                          {category}
                                        </Text>
                                        <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                                          {filteredPermissions.length} permissions
                                        </Badge>
                                      </HStack>
                                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={2}>
                                        {filteredPermissions.map((permission) => (
                                          <Checkbox
                                            key={permission.permission}
                                            value={permission.permission}
                                            colorScheme="blue"
                                            size="sm"
                                            borderRadius="md"
                                            _hover={{ bg: "blue.50" }}
                                            p={2}
                                          >
                                            <HStack spacing={2}>
                                              <Text fontSize="sm" color="gray.700">
                                                {permission.icon}
                                              </Text>
                                              <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                {permission.name}
                                              </Text>
                                            </HStack>
                                          </Checkbox>
                                        ))}
                                      </SimpleGrid>
                                    </Box>
                                  );
                                })
                                .filter(Boolean)}
                            </VStack>
                          </CheckboxGroup>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
              </Box>
            </ModalBody>
            
            <ModalFooter 
              bg="gray.50" 
              borderTop="1px" 
              borderColor="gray.200"
              py={4}
            >
              <HStack justify="space-between" w="full">
                <HStack spacing={3}>
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <TargetIcon />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Total Permissions: {selectedPermissions.length}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {selectedPreset ? `Based on ${selectedPreset} preset` : 'Custom selection'}
                    </Text>
                  </VStack>
                </HStack>
                
                <HStack spacing={3}>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      onStaffModalClose();
                      setNewStaff({ name: '', email: '', password: '', permissions: [] });
                      setSelectedPermissions([]);
                      setSelectedPreset('');
                      setPermissionSearch('');
                    }}
                    borderRadius="lg"
                    border="1px"
                    borderColor="gray.300"
                    _hover={{ bg: "gray.50" }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createStaff} 
                    isLoading={loading} 
                    borderRadius="lg"
                    isDisabled={selectedPermissions.length === 0}
                    colorScheme="blue"
                    _disabled={{
                      bg: "gray.300",
                      color: "gray.500",
                      cursor: "not-allowed"
                    }}
                    px={6}
                    py={2}
                    fontWeight="semibold"
                  >
                    {loading ? 'Creating Staff...' : `Create Staff Member`}
                  </Button>
                </HStack>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Permission Management Modal */}
        <Modal isOpen={isPermissionModalOpen} onClose={onPermissionModalClose} size="6xl">
          <ModalOverlay />
          <ModalContent maxH="80vh" overflowY="auto" borderRadius="xl">
            <ModalHeader>
              <HStack>
                <Avatar name={selectedStaff?.name} size="sm" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">Manage Permissions</Text>
                  <Text fontSize="sm" color="gray.500">
                    {selectedStaff?.name} - {selectedStaff?.email}
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6} align="stretch">
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Current Permissions: {selectedStaff?.permissions?.length || 0}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Select permissions below to update for this staff member
                    </Text>
                  </Box>
                </Alert>
                
                <Box>
                  <Text fontWeight="bold" mb={3}>Permission Presets</Text>
                  {renderPermissionPresets()}
                </Box>
                
                <Divider />
                
                <Box>
                  <Text fontWeight="bold" mb={3}>Custom Permissions</Text>
                  {renderPermissionCategories()}
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">
                  Selected: {selectedPermissions.length} permissions
                </Text>
                <HStack>
                  <Button variant="ghost" mr={3} onClick={() => {
                    onPermissionModalClose();
                    setSelectedStaff(null);
                    setSelectedPermissions([]);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => {
                      if (selectedStaff) {
                        updateStaffPermissions(selectedStaff._id, selectedPermissions);
                        onPermissionModalClose();
                        setSelectedStaff(null);
                        setSelectedPermissions([]);
                      }
                    }}
                    isLoading={loading}
                    borderRadius="xl"
                  >
                    Update Permissions
                  </Button>
                </HStack>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} size="md">
          <ModalOverlay />
          <ModalContent borderRadius="xl">
            <ModalHeader>
              <HStack>
                <Box p={2} bg="red.50" borderRadius="lg">
                  <DeleteIcon />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color="red.600">Delete Staff Member</Text>
                  <Text fontSize="sm" color="gray.500">This action cannot be undone</Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Alert status="warning" borderRadius="lg" mb={4}>
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <AlertTitle>Are you sure?</AlertTitle>
                  <AlertDescription>
                    You are about to permanently delete <strong>{staffToDelete?.name}</strong> from your team.
                    This will remove all their data and cannot be undone.
                  </AlertDescription>
                </VStack>
              </Alert>
              
              {staffToDelete && (
                <Card bg="gray.50" borderRadius="lg" p={4}>
                  <HStack>
                    <Avatar name={staffToDelete.name} size="md" />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{staffToDelete.name}</Text>
                      <Text fontSize="sm" color="gray.600">{staffToDelete.email}</Text>
                      <HStack>
                        <Badge colorScheme={staffToDelete.status === 'active' ? 'green' : 'red'}>
                          {staffToDelete.status}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          {staffToDelete.permissions?.length || 0} permissions
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Card>
              )}
            </ModalBody>
            <ModalFooter>
              <HStack>
                <Button variant="ghost" mr={3} onClick={() => {
                  onDeleteModalClose();
                  setStaffToDelete(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={() => {
                    if (staffToDelete) {
                      deleteStaff(staffToDelete._id);
                      onDeleteModalClose();
                      setStaffToDelete(null);
                    }
                  }}
                  isLoading={loading}
                  borderRadius="xl"
                >
                  Delete Staff Member
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Lead Distribution Modal */}
        <Modal isOpen={isDistributionModalOpen} onClose={onDistributionModalClose} size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="xl">
            <ModalHeader>Manage Lead Distribution</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                {leadDistribution.map((staff) => (
                  <HStack key={staff.staffId} w="full" justify="space-between">
                    <Text color="gray.800">{staff.name}</Text>
                    <HStack>
                      <Slider
                        value={staff.distributionRatio}
                        min={0}
                        max={5}
                        step={0.1}
                        w="200px"
                        onChange={(value) => {
                          const newDistributions = leadDistribution.map(s => 
                            s.staffId === staff.staffId ? { ...s, distributionRatio: value } : s
                          );
                          setLeadDistribution(newDistributions);
                        }}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <Text fontSize="sm" fontWeight="medium" minW="40px">
                        {staff.distributionRatio}x
                      </Text>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDistributionModalClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={() => {
                  const distributions = leadDistribution.map(staff => ({
                    staffId: staff.staffId,
                    ratio: staff.distributionRatio
                  }));
                  updateLeadDistribution(distributions);
                  onDistributionModalClose();
                }}
                isLoading={loading}
                borderRadius="xl"
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default StaffManagement;