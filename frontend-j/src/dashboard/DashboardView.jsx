import React, { useState, useEffect } from "react";
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title,
  Filler
} from 'chart.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCoachId, getToken, debugAuthState } from '../utils/authUtils';
import {
  Box,
  Text,
  Button,
  Spinner,
  Badge,
  Icon,
  useToast,
  useColorModeValue,
  useColorMode,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react';
import { 
  FaRupeeSign, FaClock, FaRegMoneyBillAlt, 
  FaPercentage, FaTrophy, FaExclamationTriangle, 
  FaDownload, FaSyncAlt, FaArrowUp, FaSpinner, FaBell, FaBolt, FaCalendar, FaUser, FaTasks
} from 'react-icons/fa';
import { 
  IoStatsChart, IoReceiptOutline, IoWalletOutline, IoBarChart, 
  IoPeopleOutline 
} from 'react-icons/io5';

// Chart.js registration
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler
);

// API Base URL
const API_BASE_URL = 'https://api.funnelseye.com';

// Import API service
import { dashboardAPI, handleAPIError } from '../services/api';
import DailyPriorityFeed from '../components/DailyPriorityFeed';

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

        {/* Professional Charts Section */}
        <Box display={{ base: "block", md: "flex" }} gap={6} mb={6}>
          {/* Performance Trends Chart Skeleton */}
          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg" 
            border="1px" 
            borderColor="gray.200"
            overflow="hidden"
            position="relative"
            w={{ base: "100%", md: "auto" }}
            flex={{ base: "none", md: "0.7" }}
            mb={{ base: 6, md: 0 }}
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
                  <Skeleton height="32px" width="60px" borderRadius="lg" />
                  <Skeleton height="32px" width="60px" borderRadius="lg" />
                </HStack>
              </Flex>
            </CardHeader>
            <CardBody pt={0}>
              <Box h="300px" position="relative">
                <Skeleton height="100%" width="100%" borderRadius="lg" />
              </Box>
            </CardBody>
          </Card>

          {/* Lead Distribution Chart Skeleton */}
          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg" 
            border="1px" 
            borderColor="gray.200"
            overflow="hidden"
            position="relative"
            w={{ base: "100%", md: "auto" }}
            flex={{ base: "none", md: "0.3" }}
          >
            <Box
              position="absolute"
              top="0"
              left="-100%"
              width="100%"
              height="100%"
              background="linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)"
              animation="shimmer 3.5s infinite"
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
                  <Skeleton height="32px" width="180px" borderRadius="lg" />
                  <Skeleton height="16px" width="250px" borderRadius="md" />
                </VStack>
                <HStack spacing={3}>
                  <Skeleton height="32px" width="60px" borderRadius="lg" />
                  <Skeleton height="32px" width="60px" borderRadius="lg" />
                </HStack>
              </Flex>
            </CardHeader>
            <CardBody pt={0}>
              <Box h="300px" position="relative">
                <Skeleton height="100%" width="100%" borderRadius="lg" />
              </Box>
              <VStack spacing={3} mt={4}>
                {[...Array(4)].map((_, i) => (
                  <HStack key={i} spacing={2} w="full">
                    <Skeleton height="12px" width="12px" borderRadius="full" />
                    <Skeleton height="16px" width="120px" borderRadius="md" />
                    <Skeleton height="16px" width="60px" borderRadius="md" ml="auto" />
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </Box>

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
            <Text color="gray.500" fontSize="sm" fontWeight="medium">
              Loading your amazing dashboard...
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
// Bubble Background Component
const BubbleBackground = () => (
  <Box
    position="fixed"
    top={0}
    left={0}
    w="100vw"
    h="100vh"
    overflow="hidden"
    zIndex={-1}
    pointerEvents="none"
    bg="linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"
  >
    {[...Array(20)].map((_, i) => (
      <Box
        key={i}
        position="absolute"
        w={`${Math.random() * 80 + 30}px`}
        h={`${Math.random() * 80 + 30}px`}
        borderRadius="50%"
        bg="linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)"
        backdropFilter="blur(10px)"
        animation={`float ${Math.random() * 25 + 15}s ease-in-out infinite`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`
        }}
        _before={{
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '20%',
          w: '30%',
          h: '30%',
          borderRadius: '50%',
          bg: 'rgba(102, 126, 234, 0.4)'
        }}
      />
    ))}
    <style>{`
      @keyframes float {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg); 
          opacity: 0.7; 
        }
        25% { 
          transform: translateY(-30px) rotate(90deg); 
          opacity: 0.9; 
        }
        50% { 
          transform: translateY(-60px) rotate(180deg); 
          opacity: 0.5; 
        }
        75% { 
          transform: translateY(-30px) rotate(270deg); 
          opacity: 0.8; 
        }
      }
    `}</style>
  </Box>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const authState = useSelector(state => state.auth);
  const user = authState?.user;
  const token = getToken(authState);
  const toast = useToast();
  const { colorMode } = useColorMode();
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const shadowColor = useColorModeValue('sm', 'dark-lg');
  
  // Coach ID extract
  const coachId = getCoachId(authState);

  // State management
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    leads: null,
    financial: null,
    team: null,
    performance: null,
    trends: null,
    marketing: null,
    calendar: null,
    tasks: null,
    dailyFeed: null,
  });
  
  // User context state
  const [userContext, setUserContext] = useState({
    isStaff: false,
    isCoach: false,
    userId: null,
    permissions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  // Timeline filter state
  const [trendsTimeFilter, setTrendsTimeFilter] = useState('1W');
  const [leadsTimeFilter, setLeadsTimeFilter] = useState('1M');

  // No mock data - all data must come from backend

  // Fetch tasks data separately for Tasks Overview
  const fetchTasksData = async () => {
    if (!token || !coachId) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflow/tasks?limit=200`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Coach-ID': coachId,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const tasks = Array.isArray(data.data) ? data.data : [];
          
          // Calculate distributions and metrics
          const statusDistribution = {};
          const stageDistribution = {};
          const priorityDistribution = {};
          let overdueTasks = 0;
          let upcomingTasks = 0;
          const now = new Date();
          
          tasks.forEach(task => {
            // Status distribution
            const status = task.status || 'Pending';
            statusDistribution[status] = (statusDistribution[status] || 0) + 1;
            
            // Stage distribution
            const stage = task.stage || task.customStage || 'Unassigned';
            stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
            
            // Priority distribution
            const priority = task.priority || 'LOW';
            priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
            
            // Overdue and upcoming tasks
            if (task.dueDate) {
              const dueDate = new Date(task.dueDate);
              if (dueDate < now && status !== 'Completed' && status !== 'Done') {
                overdueTasks++;
              } else if (dueDate > now && status !== 'Completed' && status !== 'Done') {
                upcomingTasks++;
              }
            }
          });
          
          const completedTasks = tasks.filter(t => 
            t.status === 'Completed' || t.status === 'Done'
          ).length;
          
          return {
            totalTasks: tasks.length,
            completedTasks,
            pendingTasks: tasks.length - completedTasks,
            statusDistribution,
            stageDistribution,
            priorityDistribution,
            overdueTasks,
            upcomingTasks,
            tasks: tasks.slice(0, 10) // Keep recent tasks for reference
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching tasks data:', error);
      return null;
    }
  };

  // Enhanced retry mechanism with exponential backoff
  const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // Enhanced API call with better error handling
  const safeAPICall = async (apiFunction) => {
    try {
      return await retryWithBackoff(apiFunction);
    } catch (error) {
      console.error(`❌ API call failed:`, error.message);
      
      // Show user-friendly error message
      if (error.message.includes('500')) {
        toast({
          title: 'Server Error',
          description: 'The server encountered an error. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.message.includes('401') || error.message.includes('403')) {
        toast({
          title: 'Authentication Error',
          description: 'Please login again to continue.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      
      throw error; // Re-throw to let caller handle it properly
    }
  };

  // Fetch all dashboard data with enhanced error handling
  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      // Debug authentication state
      console.log('🔐 Auth state:', { user, token, isAuthenticated: !!token && !!user });
      console.log('🔐 Token from Redux:', token);
      console.log('🔐 User from Redux:', user);
      console.log('🔐 Token from localStorage:', localStorage.getItem('token'));
      console.log('🔐 User from localStorage:', localStorage.getItem('user'));
      
      // Check if user is staff or coach
      const userData = user || JSON.parse(localStorage.getItem('user') || '{}');
      console.log('👤 User type check:', {
        isStaff: userData.role === 'staff' || userData.userType === 'staff',
        isCoach: userData.role === 'coach' || userData.userType === 'coach',
        userRole: userData.role,
        userType: userData.userType,
        userId: userData._id || userData.id
      });
      
      // Test token format
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log('🔐 Stored token length:', storedToken.length);
        console.log('🔐 Token starts with:', storedToken.substring(0, 20) + '...');
        console.log('🔐 Token ends with:', '...' + storedToken.substring(storedToken.length - 20));
      }

      // Enhanced authentication check
      if (!token || !user) {
        console.warn('⚠️ Authentication check failed:', { token: !!token, user: !!user });
        
        // Try to get fresh data from localStorage as fallback
        const freshToken = localStorage.getItem('token');
        const freshUser = localStorage.getItem('user');
        
        if (!freshToken || !freshUser) {
          setError('Please login to view dashboard data');
          setLoading(false);
          setRefreshing(false);
          
          // Show login prompt
          toast({
            title: 'Authentication Required',
            description: 'Please login to access the dashboard',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
          return;
        } else {
          console.log('🔄 Using fresh auth data from localStorage');
          // Update the auth state with fresh data
          const parsedUser = JSON.parse(freshUser);
          console.log('🔄 Fresh user data:', parsedUser);
        }
      }

      // Try to fetch real data from API with enhanced error handling
      try {
        // Use the new unified endpoint
        let completeData = null;
        let tasksData = null;
        try {
          console.log('🚀 Attempting unified API call...');
          console.log('🔐 Using token:', token ? `${token.substring(0, 20)}...` : 'No token');
          console.log('👤 User data:', user);
          
          completeData = await safeAPICall(
            () => dashboardAPI.getCompleteData()
          );
          console.log('✅ Unified API response:', completeData);
          
          // Fetch tasks data separately
          tasksData = await fetchTasksData();
          console.log('✅ Tasks data:', tasksData);
        } catch (completeError) {
          console.log('⚠️ Complete data fetch failed, trying individual endpoints:', completeError.message);
        }

        if (completeData) {
          // Use complete data if available - Map to real API structure
          const apiData = completeData.data || completeData;
          const userCtx = completeData.userContext || {};
          console.log('📊 Processing complete API data:', apiData);
          console.log('👤 User context:', userCtx);
          
          // Set user context
          setUserContext({
            isStaff: userCtx.isStaff || false,
            isCoach: userCtx.isCoach || false,
            userId: userCtx.userId || null,
            permissions: userCtx.permissions || []
          });
          
          // Map data based on user type (Coach vs Staff)
          if (userCtx.isStaff) {
            // Staff dashboard data mapping
            setDashboardData({
              overview: {
                // Staff-specific overview metrics
                staffName: apiData.overview?.staffName || user?.name || 'Staff Member',
                staffEmail: apiData.overview?.staffEmail || user?.email || '',
                period: apiData.overview?.period || 'Last 30 days',
                lastActive: apiData.overview?.lastActive || new Date().toISOString(),
                
                // Lead metrics (staff-specific)
                myAssignedLeads: apiData.overview?.myAssignedLeads || 0,
                myNewLeadsThisPeriod: apiData.overview?.myNewLeadsThisPeriod || 0,
                myNewLeadsToday: apiData.overview?.myNewLeadsToday || 0,
                myLeadsConverted: apiData.overview?.myLeadsConverted || 0,
                myLeadsLost: apiData.overview?.myLeadsLost || 0,
                myConversionRate: apiData.overview?.myConversionRate || '0',
                myLossRate: apiData.overview?.myLossRate || '0',
                myAverageLeadScore: apiData.overview?.myAverageLeadScore || '0',
                myHotLeads: apiData.overview?.myHotLeads || 0,
                myLeadsNeedingFollowUp: apiData.overview?.myLeadsNeedingFollowUp || 0,
                
                // Appointment metrics (staff-specific)
                myTotalAppointments: apiData.overview?.myTotalAppointments || 0,
                myAppointmentsThisPeriod: apiData.overview?.myAppointmentsThisPeriod || 0,
                myAppointmentsToday: apiData.overview?.myAppointmentsToday || 0,
                myCompletedAppointments: apiData.overview?.myCompletedAppointments || 0,
                myCancelledAppointments: apiData.overview?.myCancelledAppointments || 0,
                myNoShowAppointments: apiData.overview?.myNoShowAppointments || 0,
                myUpcomingAppointments: apiData.overview?.myUpcomingAppointments || 0,
                myAppointmentCompletionRate: apiData.overview?.myAppointmentCompletionRate || '0',
                myAppointmentNoShowRate: apiData.overview?.myAppointmentNoShowRate || '0',
                
                // Messaging metrics (staff-specific)
                myTotalMessagesSent: apiData.overview?.myTotalMessagesSent || 0,
                myMessagesSentThisPeriod: apiData.overview?.myMessagesSentThisPeriod || 0,
                myMessagesToday: apiData.overview?.myMessagesToday || 0,
                myWhatsAppMessages: apiData.overview?.myWhatsAppMessages || 0,
                myEmailMessages: apiData.overview?.myEmailMessages || 0,
                myActiveConversations: apiData.overview?.myActiveConversations || 0,
                myTotalContactsMessaged: apiData.overview?.myTotalContactsMessaged || 0,
                myAverageMessagesPerDay: apiData.overview?.myAverageMessagesPerDay || '0'
              },
              
              // Staff performance score
              myPerformanceScore: apiData.myPerformanceScore || null,
              
              // Team performance (leaderboard)
              teamPerformance: apiData.teamPerformance || null,
              
              // Staff tasks
              myTasks: apiData.myTasks || null,
              
              // Staff-specific leads
              leads: apiData.leads || null,
              
              // Staff-specific messaging data
              messaging: apiData.messaging || null,
              
              // Staff-specific appointments
              appointments: apiData.appointments || null,
              
              // Other staff-specific data
              leadsBySource: apiData.leadsBySource || [],
              leadConversionFunnel: apiData.leadConversionFunnel || null,
              topPerformingLeads: apiData.topPerformingLeads || [],
              messagingTrends: apiData.messagingTrends || [],
              mostContactedLeads: apiData.mostContactedLeads || [],
              appointmentStats: apiData.appointmentStats || null,
              upcomingWeekSchedule: apiData.upcomingWeekSchedule || {},
              performanceMetrics: apiData.performanceMetrics || null,
              weeklyTrends: apiData.weeklyTrends || null,
              recentActivity: apiData.recentActivity || [],
              dailyTasks: apiData.dailyTasks || [],
              pendingActions: apiData.pendingActions || null,
              todayAppointments: apiData.todayAppointments || [],
              quickStats: apiData.quickStats || [],
              achievements: apiData.achievements || [],
              weekSummary: apiData.weekSummary || null,
              
              // Financial data not available for staff
              financial: null,
              
              // Other data
              performance: null,
              trends: null,
              marketing: null,
              calendar: null,
              tasks: tasksData || {
                // Fallback for staff if tasks fetch failed
                totalTasks: 0,
                completedTasks: 0,
                pendingTasks: 0,
                statusDistribution: {},
                stageDistribution: {},
                priorityDistribution: {},
                overdueTasks: 0,
                upcomingTasks: 0
              },
              dailyFeed: null
            });
          } else {
            // Coach dashboard data mapping (existing logic)
          setDashboardData({
            overview: {
              // Map real overview metrics directly
              totalLeads: apiData.overview?.metrics?.totalLeads || 0,
              convertedLeads: apiData.overview?.metrics?.convertedLeads || 0,
              conversionRate: apiData.overview?.metrics?.conversionRate || 0,
              totalRevenue: apiData.overview?.metrics?.totalRevenue || 0,
              totalAppointments: apiData.overview?.metrics?.totalAppointments || 0,
              completedAppointments: apiData.overview?.metrics?.completedAppointments || 0,
              appointmentCompletionRate: apiData.overview?.metrics?.appointmentCompletionRate || 0,
              totalTasks: apiData.overview?.metrics?.totalTasks || 0,
              completedTasks: apiData.overview?.metrics?.completedTasks || 0,
              taskCompletionRate: apiData.overview?.metrics?.taskCompletionRate || 0,
              avgRevenuePerLead: apiData.overview?.metrics?.avgRevenuePerLead || 0,
              leadGrowth: apiData.overview?.metrics?.leadGrowth || 0,
              quickActions: apiData.overview?.quickActions || []
            },
            leads: {
              // Map real leads data directly
                total: apiData.leads?.total || 0,
                new: apiData.leads?.new || 0,
                contacted: apiData.leads?.contacted || 0,
                qualified: apiData.leads?.qualified || 0,
                converted: apiData.leads?.converted || 0,
                lost: apiData.leads?.lost || 0,
                recentLeads: apiData.leads?.recentLeads || [],
                leadsByStatus: apiData.leads?.leadsByStatus || {},
                leadsBySource: apiData.leads?.leadsBySource || []
            },
            team: {
              // Map real team data directly
              totalStaff: apiData.team?.totalStaff || 0,
                activeStaff: apiData.team?.activeStaff || 0,
                staffPerformance: apiData.team?.staffPerformance || [],
                topPerformer: apiData.team?.topPerformer || null,
                teamAverages: apiData.team?.teamAverages || {}
            },
            financial: {
              // Map real financial data directly
                totalRevenue: apiData.financial?.totalRevenue || 0,
                totalExpenses: apiData.financial?.totalExpenses || 0,
                netProfit: apiData.financial?.netProfit || 0,
                profitMargin: apiData.financial?.profitMargin || 0,
                revenueByMonth: apiData.financial?.revenueByMonth || [],
                topRevenueProducts: apiData.financial?.topRevenueProducts || []
            },
            performance: {
              // Map real performance data directly
                overallScore: apiData.performance?.overallScore || 0,
                trends: apiData.performance?.trends || {}
            },
            marketing: {
              // Map real marketing data directly
                totalCampaigns: apiData.marketing?.totalCampaigns || 0,
                activeCampaigns: apiData.marketing?.activeCampaigns || 0,
                totalAdSpend: apiData.marketing?.totalAdSpend || 0,
                leadsFromMarketing: apiData.marketing?.leadsFromMarketing || 0,
                costPerLead: apiData.marketing?.costPerLead || 0
            },
            calendar: {
              // Map real calendar data directly
                totalAppointments: apiData.calendar?.totalAppointments || 0,
                upcomingAppointments: apiData.calendar?.upcomingAppointments || 0,
                todayAppointments: apiData.calendar?.todayAppointments || 0
            },
            tasks: tasksData || {
              // Fallback to API data if tasks fetch failed
              totalTasks: apiData.tasks?.total || 0,
              completedTasks: apiData.tasks?.completed || 0,
              pendingTasks: apiData.tasks?.pending || 0,
              statusDistribution: apiData.tasks?.tasksByStatus || {},
              stageDistribution: {},
              priorityDistribution: {},
              overdueTasks: 0,
              upcomingTasks: 0
            },
              dailyFeed: apiData.dailyFeed || null
            });
          }
        } else {
          // API failed - show error and empty state
          console.error('❌ Unified dashboard API failed');
          console.error('❌ API Error details:', completeError);
          
          setError('Failed to load dashboard data. Please check your connection and try again.');
          setDashboardData({
            overview: null,
            leads: null,
            financial: null,
            team: null,
            performance: null,
            trends: null,
            marketing: null,
            calendar: null,
            tasks: null,
            dailyFeed: null,
          });
          
          toast({
            title: 'Connection Error',
            description: 'Unable to load dashboard data. Please refresh the page.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          
          setLastSyncTime(new Date());
          setLoading(false);
          setRefreshing(false);
          return;
        }
      } catch (err) {
        console.error('❌ Dashboard fetch error:', err);
        
        setError('Failed to fetch dashboard data. Please try again.');
        setDashboardData({
          overview: null,
          leads: null,
          financial: null,
          team: null,
          performance: null,
          trends: null,
          marketing: null,
          calendar: null,
          tasks: null,
          dailyFeed: null,
        });
        
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please refresh the page.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('❌ Dashboard fetch error:', err);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Offline detection and network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log('🌐 Back online - attempting to sync data');
      toast({
        title: 'Connection Restored',
        description: 'Syncing latest data...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Auto-refresh when back online
      setTimeout(() => fetchDashboardData(true), 1000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('📴 Gone offline - using cached data');
      toast({
        title: 'Offline Mode',
        description: 'You are offline. Dashboard shows cached data.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    };

    // Check initial online status
    setIsOffline(!navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time data fetching
  useEffect(() => {
    fetchDashboardData();
  }, []);


  // Chart data generators with API data
  const generateOpportunitiesData = () => {
    const leads = dashboardData.leads;
    if (!leads) return {
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#6366f1', '#ec4899'],
        borderWidth: 0
      }]
    };

    // Get lead status distribution from API
    const statusData = leads.statusDistribution || {};
    const labels = Object.keys(statusData);
    const data = Object.values(statusData);

    return {
      labels: labels.length > 0 ? labels : ['Welcome Page', 'Appointment'],
      datasets: [{
        data: data.length > 0 ? data : [0, 0],
        backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'],
        borderWidth: 0,
        hoverBackgroundColor: ['#4f46e5', '#db2777', '#059669', '#d97706'],
        hoverBorderWidth: 4,
        hoverBorderColor: colorMode === 'dark' ? '#374151' : '#1e293b'
      }]
    };
  };

  // Filter trends data based on selected timeline
  const getFilteredTrendsData = () => {
    const performance = dashboardData.performance;
    if (!performance?.trends) return { labels: [], revenue: [], leads: [] };

    const now = new Date();
    let cutoffDate;
    
    if (trendsTimeFilter === '1W') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else { // 1M
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredTrends = performance.trends.filter(trend => {
      const trendDate = new Date(trend.date);
      return trendDate >= cutoffDate;
    });

    return {
      labels: filteredTrends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      revenue: filteredTrends.map(t => t.revenue || 0),
      leads: filteredTrends.map(t => t.leads || 0)
    };
  };

  // Filter leads data based on selected timeline
  const getFilteredLeadsData = () => {
    const leads = dashboardData.leads;
    if (!leads?.recentLeads) return { statusDistribution: leads?.statusDistribution || {}, totalLeads: leads?.totalLeads || 0 };

    const now = new Date();
    let cutoffDate;
    
    if (leadsTimeFilter === '1W') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else { // 1M
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredLeads = leads.recentLeads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= cutoffDate;
    });

    // Recalculate status distribution for filtered leads
    const statusDistribution = {};
    filteredLeads.forEach(lead => {
      statusDistribution[lead.status] = (statusDistribution[lead.status] || 0) + 1;
    });

    return {
      statusDistribution: Object.keys(statusDistribution).length > 0 ? statusDistribution : (leads?.statusDistribution || {}),
      totalLeads: filteredLeads.length > 0 ? filteredLeads.length : (leads?.totalLeads || 0)
    };
  };

  // Common chart options with dark mode support
  const commonChartOptions = () => ({
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: colorMode === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(30, 41, 59, 0.95)',
        titleColor: colorMode === 'dark' ? '#f9fafb' : '#f8fafc',
        bodyColor: colorMode === 'dark' ? '#d1d5db' : '#cbd5e1',
        borderColor: '#6366f1',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter',
          size: 13
        },
        callbacks: {
          label: function(context) {
            if (!context || !context.label || context.parsed === null || context.parsed === undefined) {
              return 'No data';
            }
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => (a || 0) + (b || 0), 0);
            if (total === 0) return `${label}: ${value.toLocaleString()} (0%)`;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeOutQuart',
      delay: function(context) {
        return context.dataIndex * 200;
      }
    },
    elements: {
      arc: {
        borderWidth: 3,
        borderColor: colorMode === 'dark' ? '#374151' : '#ffffff',
        hoverBorderWidth: 4,
        hoverBorderColor: colorMode === 'dark' ? '#374151' : '#ffffff'
      }
    }
  });

  // Loading component
  if (loading) {
    return <ProfessionalLoader />;
  }

  // Error component
  if (error && !dashboardData.overview) {
    return (
      <Box 
        textAlign="center" 
        py={20}
        bg={bgColor}
        minH="100vh"
        transition="all 0.3s ease"
      >
        <Icon as={FaExclamationTriangle} boxSize={16} color="red.500" mb={4} />
        <Text fontSize="xl" fontWeight="semibold" mb={2} color={textColor}>
          Oops! Something went wrong
        </Text>
        <Text color={secondaryTextColor} mb={4}>{error}</Text>
        {coachId && (
          <Badge colorScheme="brand" variant="subtle" mb={4}>
            Coach ID: {coachId}
          </Badge>
        )}
        <Button
          leftIcon={<FaSyncAlt />}
          colorScheme="brand"
          onClick={() => fetchDashboardData()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // Helper function to check if user has permission
  const hasPermission = (permission) => {
    return userContext.permissions?.includes(permission) || false;
  };

  // Helper function to check if section should be rendered based on permissions
  const shouldRenderSection = (sectionName) => {
    if (!userContext.isStaff) return true; // Coach sees everything
    
    const permissionMap = {
      'leads': 'leads:view',
      'messaging': 'messaging:view', 
      'appointments': 'calendar:view',
      'calendar': 'calendar:view'
    };
    
    const requiredPermission = permissionMap[sectionName];
    return !requiredPermission || hasPermission(requiredPermission);
  };

  // Destructure dashboard data for easier access
  const { overview, leads, financial, team, performance, trends, marketing } = dashboardData;

  return (
    <Box bg={bgColor} minH="100vh" transition="all 0.3s ease" p={6}>
      <BubbleBackground />
      
      {/* Header Section with KPI Cards */}
      <Box
        bg={cardBgColor}
        borderRadius="xl"
        p={6}
        mb={6}
        boxShadow={shadowColor}
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s ease"
      >
        {/* Top Row - Header and Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {userContext.isStaff ? (
                <>Hello, {dashboardData.overview?.staffName || user?.name || 'Staff Member'} 👋</>
              ) : (
                <>Hello, {user?.name || 'User'} 👋</>
              )}
            </Text>
            <Text color={secondaryTextColor}>
              {userContext.isStaff ? (
                <>Here's your personal dashboard for {dashboardData.overview?.period || 'the last 30 days'}</>
              ) : (
                <>Here's what's happening with your business today</>
              )}
            </Text>
            {userContext.isStaff && dashboardData.overview?.lastActive && (
              <Text fontSize="sm" color={secondaryTextColor} mt={1}>
                Last active: {new Date(dashboardData.overview.lastActive).toLocaleString()}
              </Text>
            )}
          </Box>
          <Box display="flex" gap={3}>
            <Button
              leftIcon={<FaDownload />}
              variant="outline"
              colorScheme="brand"
              size="sm"
              onClick={async () => {
                try {
                  const response = await fetch(`${API_BASE_URL}/api/coach-dashboard/export?format=csv&timeRange=30`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                      'Accept': 'text/csv',
                      'Coach-ID': coachId,
                    },
                  });
                  
                  if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    toast({
                      title: 'Export Successful',
                      description: 'Dashboard data exported successfully',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Export failed');
                  }
                } catch (error) {
                  console.error('Export error:', error);
                  toast({
                    title: 'Export Failed',
                    description: error.message || 'Failed to export dashboard data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}
            >
              Export
            </Button>
            <Button
              leftIcon={refreshing ? <FaSpinner className="fa-spin" /> : <FaSyncAlt />}
              colorScheme="brand"
              size="sm"
              onClick={() => fetchDashboardData(true)}
              isLoading={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              leftIcon={<FaSpinner />}
              variant="outline"
              colorScheme="brand"
              size="sm"
              onClick={async () => {
                try {
                  console.log('🧪 Testing authentication...');
                  const result = await dashboardAPI.testAuth();
                  console.log('✅ Auth test successful:', result);
                  toast({
                    title: 'Authentication Test',
                    description: 'Token is working correctly!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                } catch (error) {
                  console.error('❌ Auth test failed:', error);
                  toast({
                    title: 'Authentication Test Failed',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
            >
              Test Auth
            </Button>
          </Box>
        </Box>
        
        {/* Middle Row - Date, Coach ID, and Status */}
        <Box display="flex" alignItems="center" gap={4} mb={6}>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon as={FaClock} color={secondaryTextColor} />
            <Text fontSize="sm" color={secondaryTextColor}>
              {new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString()} - {new Date().toLocaleDateString()}
            </Text>
          </Box>
          {coachId && (
            <Badge colorScheme="brand" variant="subtle">
              Coach ID: {coachId}
            </Badge>
          )}
          {isOffline && (
            <Badge colorScheme="orange" variant="solid">
              📴 Offline Mode
            </Badge>
          )}
          {lastSyncTime && !isOffline && (
            <Badge colorScheme="green" variant="subtle">
              ✅ Last sync: {lastSyncTime.toLocaleTimeString()}
            </Badge>
          )}
        </Box>

        {/* Bottom Row - KPI Cards Grid */}
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {userContext.isStaff ? (
            // Staff-specific KPI cards
            <>
              {/* My Assigned Leads */}
              <Box
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="xl"
                p={6}
                border="1px"
                borderColor={useColorModeValue('blue.200', 'blue.700')}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Box display="flex" alignItems="center" gap={4}>
                  <Box
                    bg={useColorModeValue('blue.100', 'blue.800')}
                    p={3}
                    borderRadius="lg"
                    color={useColorModeValue('blue.600', 'blue.300')}
                  >
                    <Icon as={IoPeopleOutline} boxSize={6} />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('blue.800', 'blue.200')}>
                      {dashboardData.overview?.myAssignedLeads?.toLocaleString() || '0'}
                    </Text>
                    <Text color={useColorModeValue('blue.700', 'blue.300')} fontSize="sm">My Assigned Leads</Text>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Icon as={FaArrowUp} color="green.500" boxSize={3} />
                      <Text fontSize="xs" color="green.500">+{dashboardData.overview?.myNewLeadsToday || 0} today</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* My Conversion Rate */}
              <Box
                bg={useColorModeValue('green.50', 'green.900')}
                borderRadius="xl"
                p={6}
                border="1px"
                borderColor={useColorModeValue('green.200', 'green.700')}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Box display="flex" alignItems="center" gap={4}>
                  <Box
                    bg={useColorModeValue('green.100', 'green.800')}
                    p={3}
                    borderRadius="lg"
                    color={useColorModeValue('green.600', 'green.300')}
                  >
                    <Icon as={IoStatsChart} boxSize={6} />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('green.800', 'green.200')}>
                      {dashboardData.overview?.myConversionRate || '0'}%
                    </Text>
                    <Text color={useColorModeValue('green.700', 'green.300')} fontSize="sm">My Conversion Rate</Text>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Icon as={FaArrowUp} color="green.500" boxSize={3} />
                      <Text fontSize="xs" color="green.500">{dashboardData.overview?.myLeadsConverted || 0} converted</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* My Messages Sent */}
              <Box
                bg={useColorModeValue('purple.50', 'purple.900')}
                borderRadius="xl"
                p={6}
                border="1px"
                borderColor={useColorModeValue('purple.200', 'purple.700')}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Box display="flex" alignItems="center" gap={4}>
                  <Box
                    bg={useColorModeValue('purple.100', 'purple.800')}
                    p={3}
                    borderRadius="lg"
                    color={useColorModeValue('purple.600', 'purple.300')}
                  >
                    <Icon as={FaBell} boxSize={6} />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('purple.800', 'purple.200')}>
                      {dashboardData.overview?.myTotalMessagesSent?.toLocaleString() || '0'}
                    </Text>
                    <Text color={useColorModeValue('purple.700', 'purple.300')} fontSize="sm">Messages Sent</Text>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Icon as={FaArrowUp} color="green.500" boxSize={3} />
                      <Text fontSize="xs" color="green.500">{dashboardData.overview?.myMessagesToday || 0} today</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* My Appointments */}
              <Box
                bg={useColorModeValue('orange.50', 'orange.900')}
                borderRadius="xl"
                p={6}
                border="1px"
                borderColor={useColorModeValue('orange.200', 'orange.700')}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Box display="flex" alignItems="center" gap={4}>
                  <Box
                    bg={useColorModeValue('orange.100', 'orange.800')}
                    p={3}
                    borderRadius="lg"
                    color={useColorModeValue('orange.600', 'orange.300')}
                  >
                    <Icon as={FaCalendar} boxSize={6} />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('orange.800', 'orange.200')}>
                      {dashboardData.overview?.myTotalAppointments || 0}
                    </Text>
                    <Text color={useColorModeValue('orange.700', 'orange.300')} fontSize="sm">My Appointments</Text>
                    <Box display="flex" gap={2} mt={2}>
                      <Badge size="sm" colorScheme="blue">📅 {dashboardData.overview?.myCompletedAppointments || 0} completed</Badge>
                      <Badge size="sm" colorScheme="green">⏰ {dashboardData.overview?.myAppointmentCompletionRate || '0'}% rate</Badge>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            // Coach-specific KPI cards (existing)
            <>
          {/* Total Leads */}
          <Box
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor={useColorModeValue('blue.200', 'blue.700')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <Box display="flex" alignItems="center" gap={4}>
              <Box
                bg={useColorModeValue('blue.100', 'blue.800')}
                p={3}
                borderRadius="lg"
                color={useColorModeValue('blue.600', 'blue.300')}
              >
                <Icon as={IoPeopleOutline} boxSize={6} />
              </Box>
              <Box flex="1">
                <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('blue.800', 'blue.200')}>
                  {overview?.totalLeads?.toLocaleString() || '0'}
                </Text>
                <Text color={useColorModeValue('blue.700', 'blue.300')} fontSize="sm">Total Leads</Text>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Icon as={FaArrowUp} color="green.500" boxSize={3} />
                  <Text fontSize="xs" color="green.500">+{leads?.funnel?.qualified || 0} qualified</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Conversion Rate */}
          <Box
            bg={useColorModeValue('green.50', 'green.900')}
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor={useColorModeValue('green.200', 'green.700')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <Box display="flex" alignItems="center" gap={4}>
              <Box
                bg={useColorModeValue('green.100', 'green.800')}
                p={3}
                borderRadius="lg"
                color={useColorModeValue('green.600', 'green.300')}
              >
                <Icon as={IoStatsChart} boxSize={6} />
              </Box>
              <Box flex="1">
                <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('green.800', 'green.200')}>
                  {overview?.conversionRate?.toFixed(1) || '0'}%
                </Text>
                <Text color={useColorModeValue('green.700', 'green.300')} fontSize="sm">Conversion Rate</Text>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Icon as={FaArrowUp} color="green.500" boxSize={3} />
                  <Text fontSize="xs" color="green.500">{overview?.convertedLeads || 0} converted</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Total Revenue */}
          <Box
            bg={useColorModeValue('yellow.50', 'yellow.900')}
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor={useColorModeValue('yellow.200', 'yellow.700')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <Box display="flex" alignItems="center" gap={4}>
              <Box
                bg={useColorModeValue('yellow.100', 'yellow.800')}
                p={3}
                borderRadius="lg"
                color={useColorModeValue('yellow.600', 'yellow.300')}
              >
                <Icon as={FaRupeeSign} boxSize={6} />
              </Box>
              <Box flex="1">
                <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('yellow.800', 'yellow.200')}>
                  ₹{overview?.totalRevenue?.toLocaleString() || '0'}
                </Text>
                <Text color={useColorModeValue('yellow.700', 'yellow.300')} fontSize="sm">Total Revenue</Text>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Icon as={FaArrowUp} color="green.500" boxSize={3} />
                  <Text fontSize="xs" color="green.500">₹{financial?.metrics?.avgRevenuePerDay?.toFixed(0) || 0}/day</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Total Appointments */}
          <Box
            bg={useColorModeValue('purple.50', 'purple.900')}
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor={useColorModeValue('purple.200', 'purple.700')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <Box display="flex" alignItems="center" gap={4}>
              <Box
                bg={useColorModeValue('purple.100', 'purple.800')}
                p={3}
                borderRadius="lg"
                color={useColorModeValue('purple.600', 'purple.300')}
              >
                <Icon as={IoBarChart} boxSize={6} />
              </Box>
              <Box flex="1">
                <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('purple.800', 'purple.200')}>
                  {overview?.totalAppointments || 0}
                </Text>
                <Text color={useColorModeValue('purple.700', 'purple.300')} fontSize="sm">Total Appointments</Text>
                <Box display="flex" gap={2} mt={2}>
                  <Badge size="sm" colorScheme="blue">📅 {overview?.completedAppointments || 0} completed</Badge>
                  <Badge size="sm" colorScheme="green">⏰ {overview?.appointmentCompletionRate?.toFixed(1) || 0}% rate</Badge>
                </Box>
              </Box>
            </Box>
          </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Staff Performance Score Section - Only for Staff */}
      {userContext.isStaff && dashboardData.myPerformanceScore && (
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={6}
          mb={6}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          transition="all 0.3s ease"
        >
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Icon as={FaTrophy} boxSize={6} color="yellow.500" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              My Performance Score
            </Text>
            <Badge colorScheme="yellow" variant="subtle">
              {dashboardData.myPerformanceScore.scoreOutOf100 || 0}/100
            </Badge>
          </Box>
          
          <Box display="flex" alignItems="center" gap={6}>
            {/* Circular Progress */}
            <Box position="relative" w="120px" h="120px">
              <Box
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                borderRadius="50%"
                bg={useColorModeValue('gray.100', 'gray.700')}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {dashboardData.myPerformanceScore.scoreOutOf100 || 0}
                </Text>
              </Box>
            </Box>
            
            {/* Score Details */}
            <Box flex="1">
              <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={2}>
                {dashboardData.myPerformanceScore.rating?.label || 'Good'} {dashboardData.myPerformanceScore.rating?.icon || '👍'}
              </Text>
              <Text color={secondaryTextColor} mb={4}>
                Overall Score: {dashboardData.myPerformanceScore.overallScore || '0'}
              </Text>
              
              {/* Score Breakdown */}
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3}>
                {dashboardData.myPerformanceScore.breakdown && Object.entries(dashboardData.myPerformanceScore.breakdown).map(([key, value]) => (
                  <Box key={key} p={3} bg={useColorModeValue('gray.50', 'gray.600')} borderRadius="lg">
                    <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                    <Text fontSize="sm" color={secondaryTextColor}>
                      {value.score || 0}/{value.max || 0} ({value.rate || value.avgScore || value.messages || value.activeDays || '0'})
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Team Performance Section - Different for Staff vs Coach */}
      {dashboardData.teamPerformance && (
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={6}
          mb={6}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          transition="all 0.3s ease"
        >
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Icon as={FaTrophy} boxSize={6} color="yellow.500" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              {userContext.isStaff ? 'Team Leaderboard' : 'Team Performance'}
            </Text>
            <Badge colorScheme="yellow" variant="subtle">
              {userContext.isStaff ? `${dashboardData.teamPerformance.totalTeamMembers || 0} members` : `${team?.totalStaff || 0} staff`}
            </Badge>
            {userContext.isStaff && dashboardData.teamPerformance.myRank && (
              <Badge colorScheme="blue" variant="solid">
                Your Rank: #{dashboardData.teamPerformance.myRank}
              </Badge>
            )}
          </Box>
          
          {userContext.isStaff ? (
            // Staff team leaderboard
            <Box>
              {dashboardData.teamPerformance?.teamLeaderboard && dashboardData.teamPerformance.teamLeaderboard.length > 0 ? (
                dashboardData.teamPerformance.teamLeaderboard.slice(0, 5).map((member, index) => (
                  <Box
                    key={member.staffId || index}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    p={3}
                    borderRadius="lg"
                    bg={member.isCurrentUser ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    border={member.isCurrentUser ? '2px' : '1px'}
                    borderColor={member.isCurrentUser ? 'blue.500' : borderColor}
                    _hover={{ bg: hoverBg }}
                    transition="all 0.2s"
                  >
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={index === 0 ? 'yellow.500' : index === 1 ? 'gray.400' : index === 2 ? 'orange.500' : 'gray.200'}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {member.rank || index + 1}
                    </Box>
                    <Box flex="1">
                      <Text fontWeight="semibold" color={textColor}>
                        {member.staffName}
                        {member.isCurrentUser && <Badge ml={2} colorScheme="blue" size="sm">You</Badge>}
                      </Text>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        Score: {member.performanceScore || 0} • {member.conversionRate || '0'}% conversion
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontWeight="bold" color="brand.600" fontSize="sm">
                        {member.leadsConverted || 0} converted
                      </Text>
                      <Text fontSize="xs" color={secondaryTextColor}>
                        {member.messagesSent || 0} messages
                      </Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Icon as={IoPeopleOutline} boxSize={10} color={mutedTextColor} mb={2} />
                  <Text color={mutedTextColor} fontSize="sm">
                    No team members found
                  </Text>
                </Box>
              )}
            </Box>
          ) : (
            // Coach team performance
            <Box>
              {team?.staffPerformance && team.staffPerformance.length > 0 ? (
                team.staffPerformance.slice(0, 5).map((member, index) => (
                  <Box
                    key={member.staffId || index}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    p={3}
                    borderRadius="lg"
                    _hover={{ bg: hoverBg }}
                    transition="all 0.2s"
                  >
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={index === 0 ? 'yellow.500' : index === 1 ? 'gray.400' : index === 2 ? 'orange.500' : 'gray.200'}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {member.rank || index + 1}
                    </Box>
                    <Box flex="1">
                      <Text fontWeight="semibold" color={textColor}>
                        {member.staffName || member.name}
                      </Text>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        Score: {member.performanceScore || member.score || 0} • {member.conversionRate || '0'}% conversion
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontWeight="bold" color="brand.600" fontSize="sm">
                        {member.leadsConverted || 0} converted
                      </Text>
                      <Text fontSize="xs" color={secondaryTextColor}>
                        {member.messagesSent || 0} messages
                      </Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Icon as={IoPeopleOutline} boxSize={10} color={mutedTextColor} mb={2} />
                  <Text color={mutedTextColor} fontSize="sm">
                    No team members found
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
      {/* Charts Section - Side by Side - Only for Coach or Staff with permissions */}
      {(!userContext.isStaff || shouldRenderSection('leads')) && (
      <Box 
        display={{ base: "block", md: "flex" }} 
        gap={6} 
        mb={6}
        w="100%"
        overflow="hidden"
        maxW="100%"
      >
        {/* Performance Trends Chart - 70% width on desktop, full width on mobile */}
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          w={{ base: "100%", md: "auto" }}
          flex={{ base: "none", md: "0.7" }}
          transition="all 0.3s ease"
          overflow="hidden"
          mb={{ base: 6, md: 0 }}
          minW="0"
          maxW="100%"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Performance Trends
            </Text>
            <Box display="flex" gap={2}>
              <Button 
                size="sm" 
                variant={trendsTimeFilter === '1W' ? 'solid' : 'ghost'} 
                colorScheme="brand"
                onClick={() => setTrendsTimeFilter('1W')}
              >
                1W
              </Button>
              <Button 
                size="sm" 
                variant={trendsTimeFilter === '1M' ? 'solid' : 'ghost'} 
                colorScheme="brand"
                onClick={() => setTrendsTimeFilter('1M')}
              >
                1M
              </Button>
            </Box>
          </Box>
          
          {dashboardData.performance?.trends ? (
            <Box 
              h="300px" 
              position="relative"
              w="100%"
              overflow="visible"
              maxW="100%"
              minW="0"
              pt={4}
              pb={2}
            >
              <Line 
                data={{
                  labels: getFilteredTrendsData().labels,
                  datasets: [
                    {
                      label: 'Leads',
                      data: getFilteredTrendsData().leads.map(val => val || 0),
                      borderColor: '#6366f1',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      borderWidth: 3,
                      tension: 0.4,
                      fill: true,
                      pointBackgroundColor: '#6366f1',
                      pointBorderColor: colorMode === 'dark' ? '#374151' : '#ffffff',
                      pointBorderWidth: 3,
                      pointRadius: 6,
                      pointHoverRadius: 10,
                      pointHoverBackgroundColor: '#4f46e5',
                      pointHoverBorderColor: colorMode === 'dark' ? '#374151' : '#ffffff',
                      pointHoverBorderWidth: 4,
                      cubicInterpolationMode: 'monotone',
                      fillColor: 'rgba(99, 102, 241, 0.1)',
                      fillOpacity: 0.3
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: colorMode === 'dark' ? 'rgba(31, 41, 55, 0.98)' : 'rgba(15, 23, 42, 0.98)',
                      titleColor: colorMode === 'dark' ? '#f9fafb' : '#f8fafc',
                      bodyColor: colorMode === 'dark' ? '#d1d5db' : '#e2e8f0',
                      borderColor: '#6366f1',
                      borderWidth: 2,
                      cornerRadius: 16,
                      displayColors: false,
                      titleFont: {
                        family: 'Inter',
                        size: 16,
                        weight: '700'
                      },
                      bodyFont: {
                        family: 'Inter',
                        size: 14,
                        weight: '500'
                      },
                      padding: 16,
                      callbacks: {
                        title: function(context) {
                          if (!context || !context[0] || !context[0].label) return '';
                          return `${context[0].label} 2025`;
                        },
                        label: function(context) {
                          if (!context || !context.parsed || context.parsed.y === null || context.parsed.y === undefined) {
                            return 'No data';
                          }
                          return `Leads: ${context.parsed.y.toLocaleString()}`;
                        },
                        afterLabel: function(context) {
                          if (!context || !context.parsed || context.parsed.y === null || context.parsed.y === undefined) {
                            return '';
                          }
                          const data = context.parsed.y;
                          const prevData = context.dataset.data[context.dataIndex - 1];
                          if (prevData && prevData !== null && prevData !== undefined && prevData !== 0) {
                            const change = ((data - prevData) / prevData * 100).toFixed(1);
                            const isPositive = change >= 0;
                            return `${isPositive ? '+' : ''}${change}% from previous day`;
                          }
                          return '';
                        }
                      }
                    }
                  },
                  animation: {
                    duration: 2000,
                    easing: 'easeOutQuart',
                    delay: function(context) {
                      return context.dataIndex * 200;
                    },
                    onProgress: function(animation) {
                      const chart = animation.chart;
                      const ctx = chart.ctx;
                      const dataset = chart.data.datasets[0];
                      const meta = chart.getDatasetMeta(0);
                      
                      if (meta.data.length > 0) {
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.font = 'bold 13px Inter';
                        ctx.fillStyle = '#6366f1';
                        
                        meta.data.forEach((point, index) => {
                          const data = dataset.data[index];
                          if (data !== null && data !== undefined) {
                            const position = point.getCenterPoint();
                            ctx.fillText(`${data.toLocaleString()}`, position.x, position.y - 20);
                          }
                        });
                        ctx.restore();
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: colorMode === 'dark' ? 'rgba(75, 85, 99, 0.3)' : 'rgba(148, 163, 184, 0.08)',
                        lineWidth: 1,
                        drawBorder: false,
                        drawTicks: false
                      },
                      ticks: {
                        font: {
                          family: 'Inter',
                          size: 12,
                          weight: '500'
                        },
                        color: colorMode === 'dark' ? '#9ca3af' : '#64748b',
                        padding: 12,
                        callback: function(value) {
                          return value.toLocaleString();
                        }
                      },
                      border: {
                        display: false
                      },
                      suggestedMax: function(context) {
                        const max = Math.max(...context.chart.data.datasets[0].data);
                        return max > 0 ? max * 1.15 : 100; // Add 15% padding at top
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        font: {
                          family: 'Inter',
                          size: 13,
                          weight: '600'
                        },
                        color: colorMode === 'dark' ? '#9ca3af' : '#475569',
                        padding: 12
                      },
                      border: {
                        display: false
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  },
                  elements: {
                    point: {
                      hoverRadius: 10,
                      hoverBorderWidth: 4
                    },
                    line: {
                      borderWidth: 3
                    }
                  },
                  layout: {
                    padding: {
                      top: 20,
                      bottom: 10
                    }
                  }
                }}
              />
            </Box>
          ) : (
            <Box h="300px" display="flex" alignItems="center" justifyContent="center">
              <Spinner size="lg" color="brand.500" />
              <Text color={secondaryTextColor} ml={3}>Loading chart data...</Text>
            </Box>
          )}
        </Box>

        {/* Lead Distribution Chart - 30% width on desktop, full width on mobile */}
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          w={{ base: "100%", md: "auto" }}
          flex={{ base: "none", md: "0.3" }}
          transition="all 0.3s ease"
          overflow="hidden"
          minW="0"
          maxW="100%"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Lead Distribution
            </Text>
            <Box display="flex" gap={2}>
              <Button 
                size="sm" 
                variant={leadsTimeFilter === '1W' ? 'solid' : 'ghost'} 
                colorScheme="brand"
                onClick={() => setLeadsTimeFilter('1W')}
              >
                1W
              </Button>
              <Button 
                size="sm" 
                variant={leadsTimeFilter === '1M' ? 'solid' : 'ghost'} 
                colorScheme="brand"
                onClick={() => setLeadsTimeFilter('1M')}
              >
                1M
              </Button>
            </Box>
          </Box>
          <Box 
            h="300px"
            w="100%"
            overflow="hidden"
            maxW="100%"
            minW="0"
          >
            <Doughnut 
              data={{
                labels: Object.keys(getFilteredLeadsData().statusDistribution),
                datasets: [{
                  data: Object.values(getFilteredLeadsData().statusDistribution).map(val => val || 0),
                  backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'],
                  borderWidth: 0,
                  hoverBackgroundColor: ['#4f46e5', '#db2777', '#059669', '#d97706'],
                  hoverBorderWidth: 4,
                  hoverBorderColor: colorMode === 'dark' ? '#374151' : '#1e293b'
                }]
              }} 
              options={commonChartOptions()}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={3} mt={4}>
            {Object.entries(getFilteredLeadsData().statusDistribution).map(([status, count], index) => (
              <Box key={status} display="flex" alignItems="center" gap={2}>
                <Box w={3} h={3} bg={['#6366f1', '#ec4899', '#10b981', '#f59e0b'][index % 4]} borderRadius="full" />
                <Text fontSize="sm" color={secondaryTextColor}>{status}</Text>
                <Text fontSize="sm" fontWeight="semibold" ml="auto" color={textColor}>{count?.toLocaleString() || 0}</Text>
              </Box>
            ))}
            {Object.keys(getFilteredLeadsData().statusDistribution).length === 0 && (
              <>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box w={3} h={3} bg="blue.500" borderRadius="full" />
                  <Text fontSize="sm" color={secondaryTextColor}>Welcome Page</Text>
                  <Text fontSize="sm" fontWeight="semibold" ml="auto" color={textColor}>0</Text>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box w={3} h={3} bg="pink.500" borderRadius="full" />
                  <Text fontSize="sm" color={secondaryTextColor}>Appointment</Text>
                  <Text fontSize="sm" fontWeight="semibold" ml="auto" color={textColor}>0</Text>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
      )}

      {/* Tasks Overview Section - Only for Coach or Staff with task permissions */}
      {(!userContext.isStaff || hasPermission('tasks:view')) && (
      <Box
        bg={cardBgColor}
        borderRadius="xl"
        p={6}
        mb={6}
        boxShadow={shadowColor}
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s ease"
      >
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Icon as={FaClock} boxSize={6} color="purple.500" />
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Tasks Overview
          </Text>
          <Badge colorScheme="purple" variant="subtle">{dashboardData.tasks?.totalTasks || 0} total</Badge>
        </Box>
        
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          {/* Task Status Distribution */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={3}>Status Distribution</Text>
            {Object.entries(dashboardData.tasks?.statusDistribution || {}).map(([status, count]) => (
              <Box key={status} display="flex" alignItems="center" gap={2} mb={2}>
                <Box w={3} h={3} bg="purple.500" borderRadius="full" />
                <Text fontSize="sm" color={secondaryTextColor}>{status}</Text>
                <Text fontSize="sm" fontWeight="semibold" ml="auto" color={textColor}>{count}</Text>
              </Box>
            ))}
          </Box>

          {/* Task Stage Distribution */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={3}>Stage Distribution</Text>
            {Object.entries(dashboardData.tasks?.stageDistribution || {}).map(([stage, count]) => (
              <Box key={stage} display="flex" alignItems="center" gap={2} mb={2}>
                <Box w={3} h={3} bg="blue.500" borderRadius="full" />
                <Text fontSize="sm" color={secondaryTextColor}>{stage}</Text>
                <Text fontSize="sm" fontWeight="semibold" ml="auto" color={textColor}>{count}</Text>
              </Box>
            ))}
          </Box>

          {/* Task Priority Distribution */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={3}>Priority Distribution</Text>
            {Object.entries(dashboardData.tasks?.priorityDistribution || {}).map(([priority, count]) => (
              <Box key={priority} display="flex" alignItems="center" gap={2} mb={2}>
                <Box w={3} h={3} bg={priority === 'HIGH' ? 'red.500' : priority === 'MEDIUM' ? 'orange.500' : 'green.500'} borderRadius="full" />
                <Text fontSize="sm" color={secondaryTextColor}>{priority}</Text>
                <Text fontSize="sm" fontWeight="semibold" ml="auto" color={textColor}>{count}</Text>
              </Box>
            ))}
          </Box>

          {/* Task Metrics */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={3}>Task Metrics</Text>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between">
                <Text fontSize="sm" color={secondaryTextColor}>Overdue:</Text>
                <Badge colorScheme="red" variant="subtle">{dashboardData.tasks?.overdueTasks || 0}</Badge>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text fontSize="sm" color={secondaryTextColor}>Upcoming:</Text>
                <Badge colorScheme="blue" variant="subtle">{dashboardData.tasks?.upcomingTasks || 0}</Badge>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text fontSize="sm" color={secondaryTextColor}>Completed:</Text>
                <Badge colorScheme="green" variant="subtle">{dashboardData.tasks?.completedTasks || 0}</Badge>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      )}


      {/* Recent Leads and Daily Feed Section - Permission-based rendering */}
      {(!userContext.isStaff || shouldRenderSection('leads')) && (
      <Box display="flex" gap={6} mb={6}>
        {/* Recent Leads */}
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={6}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          flex="1"
          transition="all 0.3s ease"
        >
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Icon as={IoPeopleOutline} boxSize={6} color="blue.500" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                {userContext.isStaff ? 'My Recent Leads' : 'Recent Leads'}
            </Text>
              <Badge colorScheme="blue" variant="subtle">
                {userContext.isStaff ? 
                  (dashboardData.leads?.recentLeads?.length || 0) + ' assigned' : 
                  (leads?.recentLeads?.length || 0) + ' total'
                }
              </Badge>
          </Box>
          
          <Box 
            maxH="300px" 
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              // Firefox scrollbar styling
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {userContext.isStaff ? (
              // Staff leads data
              dashboardData.leads?.recentLeads && dashboardData.leads.recentLeads.length > 0 ? (
                dashboardData.leads.recentLeads.slice(0, 5).map((lead, index) => (
                  <Box
                    key={lead._id || lead.id || index}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    p={3}
                    borderRadius="lg"
                    _hover={{ bg: hoverBg }}
                    transition="all 0.2s"
                    borderBottom="1px"
                    borderColor={borderColor}
                  >
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg="blue.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="blue.600"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {lead.name?.charAt(0)?.toUpperCase() || 'L'}
                    </Box>
                    <Box flex="1">
                      <Text fontWeight="semibold" color={textColor}>
                        {lead.name}
                      </Text>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        {lead.email}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Badge 
                        colorScheme={lead.status === 'Qualified' ? 'green' : lead.status === 'Converted' ? 'blue' : 'orange'} 
                        variant="subtle"
                        size="sm"
                      >
                        {lead.status}
                      </Badge>
                      <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                        Score: {lead.leadScore || 0}
                      </Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Icon as={FaUser} boxSize={10} color={mutedTextColor} mb={2} />
                  <Text color={mutedTextColor} fontSize="sm">
                    No recent leads
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mt={3}
                    onClick={() => navigate('/dashboard/leads')}
                  >
                    View All Leads
                  </Button>
                </Box>
              )
            ) : (
              // Coach leads data
              leads?.recentLeads && leads.recentLeads.length > 0 ? (
                leads.recentLeads.slice(0, 5).map((lead, index) => (
                  <Box
                    key={lead.id || lead._id || index}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    p={3}
                    borderRadius="lg"
                    _hover={{ bg: hoverBg }}
                    transition="all 0.2s"
                    borderBottom="1px"
                    borderColor={borderColor}
                  >
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg="blue.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="blue.600"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {lead.name?.charAt(0)?.toUpperCase() || 'L'}
                    </Box>
                    <Box flex="1">
                      <Text fontWeight="semibold" color={textColor}>
                        {lead.name}
                      </Text>
                      <Text fontSize="sm" color={secondaryTextColor}>
                        {lead.email}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Badge 
                        colorScheme={lead.status === 'Welcome Page' ? 'blue' : lead.status === 'Appointment' ? 'green' : 'orange'} 
                        variant="subtle"
                        size="sm"
                      >
                        {lead.status}
                      </Badge>
                      <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Icon as={FaUser} boxSize={10} color={mutedTextColor} mb={2} />
                  <Text color={mutedTextColor} fontSize="sm">
                    No recent leads
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mt={3}
                    onClick={() => navigate('/dashboard/leads')}
                  >
                    View All Leads
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Box>

        {/* Daily Priority Feed - Comprehensive Interactive Component */}
        <Box flex="1">
          <DailyPriorityFeed 
            token={token} 
            coachId={coachId}
            onItemClick={(item) => {
              // Handle item click - navigate to relevant section
              if (item.leadId) {
                navigate(`/dashboard/leads?leadId=${item.leadId}`);
              } else if (item.appointmentId) {
                navigate(`/dashboard/calender?appointmentId=${item.appointmentId}`);
              }
            }}
          />
        </Box>
      </Box>
      )}

      {/* Marketing and Calendar Section - Only for Coach */}
      {!userContext.isStaff && (
      <Box display="flex" gap={6} mb={6}>
        {/* Marketing Overview */}
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={6}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          flex="1"
          transition="all 0.3s ease"
        >
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Icon as={IoStatsChart} boxSize={6} color="green.500" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Marketing Overview
            </Text>
            <Badge colorScheme="green" variant="subtle">{marketing?.activeCampaigns || 0} campaigns</Badge>
          </Box>
          
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
            <Box textAlign="center" p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>Total Spend</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('green.600', 'green.300')}>
                ₹{marketing?.metrics?.totalSpend?.toLocaleString() || '0'}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>Avg CPC</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('blue.600', 'blue.300')}>
                ₹{marketing?.metrics?.avgCPC?.toFixed(2) || '0'}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>Avg ROAS</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('purple.600', 'purple.300')}>
                {marketing?.metrics?.avgROAS?.toFixed(1) || '0'}x
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>Total Clicks</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('orange.600', 'orange.300')}>
                {marketing?.metrics?.totalClicks?.toLocaleString() || '0'}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Calendar Overview */}
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={6}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          flex="1"
          transition="all 0.3s ease"
        >
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Icon as={FaCalendar} boxSize={6} color="purple.500" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Calendar Overview
            </Text>
            <Badge colorScheme="purple" variant="subtle">{dashboardData.calendar?.stats?.total || 0} total</Badge>
          </Box>
          
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
            <Box textAlign="center" p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>Completed</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('purple.600', 'purple.300')}>
                {dashboardData.calendar?.stats?.completed || 0}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('red.50', 'red.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>Cancelled</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('red.600', 'red.300')}>
                {dashboardData.calendar?.stats?.cancelled || 0}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>No Show</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('orange.600', 'orange.300')}>
                {dashboardData.calendar?.stats?.noShow || 0}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="lg">
              <Text fontSize="sm" color={secondaryTextColor}>Completion Rate</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('green.600', 'green.300')}>
                {dashboardData.calendar?.stats?.completionRate?.toFixed(1) || '0'}%
              </Text>
            </Box>
          </Box>

          {/* Next Appointment */}
          {dashboardData.calendar?.nextAppointment && (
            <Box mt={4} p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
              <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>Next Appointment</Text>
              <Text fontSize="sm" color={secondaryTextColor}>
                <strong>{dashboardData.calendar.nextAppointment.leadId?.name}</strong> - {dashboardData.calendar.nextAppointment.summary}
              </Text>
              <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                {new Date(dashboardData.calendar.nextAppointment.startTime).toLocaleString()}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
      )}

      {/* Performance Alerts Section - Only for Coach */}
      {!userContext.isStaff && (
      <Box
        bg={cardBgColor}
        borderRadius="xl"
        p={6}
        mb={6}
        boxShadow={shadowColor}
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s ease"
      >
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Icon as={FaExclamationTriangle} boxSize={6} color="orange.500" />
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Performance Alerts
          </Text>
          <Badge colorScheme="orange" variant="subtle">{performance?.alerts?.length || 0} alerts</Badge>
        </Box>
        
        <Box display="flex" flexDirection="column" gap={3}>
          {performance?.alerts?.map((alert, index) => (
            <Box
              key={index}
              p={4}
              borderRadius="lg"
              bg={alert.type === 'warning' ? useColorModeValue('orange.50', 'orange.900') : 
                  alert.type === 'error' ? useColorModeValue('red.50', 'red.900') : 
                  useColorModeValue('green.50', 'green.900')}
              border="1px"
              borderColor={alert.type === 'warning' ? 'orange.200' : 
                          alert.type === 'error' ? 'red.200' : 'green.200'}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Icon 
                  as={alert.type === 'warning' ? FaExclamationTriangle : 
                      alert.type === 'error' ? FaExclamationTriangle : FaTrophy} 
                  boxSize={5} 
                  color={alert.type === 'warning' ? 'orange.500' : 
                         alert.type === 'error' ? 'red.500' : 'green.500'} 
                />
                <Box flex="1">
                  <Text fontWeight="semibold" color={textColor} fontSize="sm">
                    {alert.message}
                  </Text>
                  <Text fontSize="xs" color={secondaryTextColor} mt={1}>
                    {alert.recommendation}
                  </Text>
                </Box>
                <Badge 
                  colorScheme={alert.type === 'warning' ? 'orange' : 
                              alert.type === 'error' ? 'red' : 'green'} 
                  variant="solid"
                  size="sm"
                >
                  {alert.value}
                </Badge>
              </Box>
            </Box>
          )) || (
            <Text color={secondaryTextColor} textAlign="center" py={4}>
              No performance alerts
            </Text>
          )}
        </Box>
      </Box>
      )}

      {/* Team Analytics Section - Only for Coach */}
      {!userContext.isStaff && (
      <Box
        bg={cardBgColor}
        borderRadius="xl"
        p={6}
        mb={6}
        boxShadow={shadowColor}
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s ease"
      >
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Icon as={FaTrophy} boxSize={6} color="yellow.500" />
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Team Analytics
          </Text>
          <Badge colorScheme="yellow" variant="subtle">{team?.totalStaff || 0} staff</Badge>
        </Box>
        
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
          {/* Top Performer */}
          {team?.teamAnalytics?.topPerformer && (
            <Box p={4} bg={useColorModeValue('yellow.50', 'yellow.900')} borderRadius="lg">
              <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>🏆 Top Performer</Text>
              <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('yellow.600', 'yellow.300')}>
                {team.teamAnalytics.topPerformer.name}
              </Text>
              <Text fontSize="sm" color={secondaryTextColor}>
                Score: {team.teamAnalytics.topPerformer.score} • {team.teamAnalytics.topPerformer.rankingLevel?.name}
              </Text>
            </Box>
          )}

          {/* Most Improved */}
          {team?.teamAnalytics?.mostImproved && (
            <Box p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="lg">
              <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>📈 Most Improved</Text>
              <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('green.600', 'green.300')}>
                {team.teamAnalytics.mostImproved.name}
              </Text>
              <Text fontSize="sm" color={secondaryTextColor}>
                +{team.teamAnalytics.mostImproved.improvement} points improvement
              </Text>
            </Box>
          )}

          {/* Team Stats */}
          <Box p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>📊 Team Stats</Text>
            <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.300')}>
              {team?.teamAnalytics?.averageScore || 0} avg score
            </Text>
            <Text fontSize="sm" color={secondaryTextColor}>
              {team?.activeStaff || 0} active staff members
            </Text>
          </Box>

          {/* Level Distribution */}
          <Box p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="lg">
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>🎯 Level Distribution</Text>
            {Object.entries(team?.teamAnalytics?.levelDistribution || {}).map(([level, count]) => (
              <Box key={level} display="flex" justifyContent="space-between" mb={1}>
                <Text fontSize="sm" color={secondaryTextColor}>{level}</Text>
                <Text fontSize="sm" fontWeight="semibold" color={textColor}>{count}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      )}

      {/* Bottom Section - Team Performance and Financial Overview Side by Side - Only for Coach */}
      {!userContext.isStaff && (
      <Box display="flex" gap={6}>
        {/* Team Leaderboard */}
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={6}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          flex="1"
          transition="all 0.3s ease"
        >
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Icon as={FaTrophy} boxSize={6} color="yellow.500" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Team Performance
            </Text>
            <Badge colorScheme="brand" variant="subtle">This Month</Badge>
          </Box>
          
          <Box>
            {team?.leaderboard?.slice(0, 5).map((member, index) => (
              <Box
                key={member.id}
                display="flex"
                alignItems="center"
                gap={4}
                p={3}
                borderRadius="lg"
                _hover={{ bg: hoverBg }}
                transition="all 0.2s"
              >
                <Box
                  w={8}
                  h={8}
                  borderRadius="full"
                  bg={index === 0 ? 'yellow.500' : index === 1 ? 'gray.400' : index === 2 ? 'orange.500' : 'gray.200'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {member.rank || index + 1}
                </Box>
                <Box flex="1">
                  <Text fontWeight="semibold" color={textColor}>
                    {member.name}
                  </Text>
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Score: {member.score || 0} • {member.rankingLevel?.name || 'Unknown'}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontWeight="bold" color="brand.600" fontSize="sm">
                    {member.metrics?.leadsHandled || 0} leads
                  </Text>
                  <Text fontSize="xs" color={secondaryTextColor}>
                    {member.metrics?.tasksCompleted || 0}/{member.metrics?.totalTasks || 0} tasks
                  </Text>
                </Box>
              </Box>
            )) || (
              <Text color={secondaryTextColor} textAlign="center" py={4}>
                No team data available
              </Text>
            )}
          </Box>
        </Box>

        {/* Financial Overview */}
        <Box
          bg={cardBgColor}
          borderRadius="xl"
          p={6}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          flex="1"
          transition="all 0.3s ease"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Financial Overview
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="brand.600">
              ₹{financial?.metrics?.totalRevenue?.toLocaleString() || '0'}
            </Text>
          </Box>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
            <Box textAlign="center" p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="lg">
              <Icon as={IoWalletOutline} boxSize={6} color={useColorModeValue('green.600', 'green.300')} mb={2} />
              <Text fontSize="sm" color={secondaryTextColor}>Total Revenue</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('green.600', 'green.300')}>
                ₹{financial?.metrics?.totalRevenue?.toLocaleString() || '0'}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
              <Icon as={FaRegMoneyBillAlt} boxSize={6} color={useColorModeValue('blue.600', 'blue.300')} mb={2} />
              <Text fontSize="sm" color={secondaryTextColor}>Avg Revenue/Day</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('blue.600', 'blue.300')}>
                ₹{financial?.metrics?.avgRevenuePerDay?.toFixed(0) || '0'}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="lg">
              <Icon as={FaPercentage} boxSize={6} color={useColorModeValue('purple.600', 'purple.300')} mb={2} />
              <Text fontSize="sm" color={secondaryTextColor}>Total Payments</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('purple.600', 'purple.300')}>
                {financial?.metrics?.totalPayments || '0'}
              </Text>
            </Box>
            <Box textAlign="center" p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="lg">
              <Icon as={IoStatsChart} boxSize={6} color={useColorModeValue('orange.600', 'orange.300')} mb={2} />
              <Text fontSize="sm" color={secondaryTextColor}>Avg/Client</Text>
              <Text fontSize="lg" fontWeight="semibold" color={useColorModeValue('orange.600', 'orange.300')}>
                ₹{financial?.metrics?.avgRevenuePerClient?.toFixed(0) || '0'}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      )}
    </Box>
  );
};

export default Dashboard;
