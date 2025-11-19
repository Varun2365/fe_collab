import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Badge,
  useColorModeValue,
  useColorMode,
  Tooltip,
  MenuGroup,
  useBreakpointValue,
  Button,
  VStack,
  Divider,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import {
  FiBell,
  FiSearch,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSettings,
  FiUser,
  FiMessageCircle,
  FiVideo,
  FiCreditCard,
  FiMenu,
  FiX,
  FiCheck,
  FiTrash2,
  FiAlertTriangle,
  FiInfo,
  FiClock,
  FiCheckCircle,
  FiCalendar,
} from 'react-icons/fi';
import { logout } from '../redux/authSlice';
import { selectUser } from '../redux/authSlice';
import { toggleDarkMode } from '../redux/uiSlice';
import { dashboardAPI } from '../services/api';

const TopNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toast = useToast();
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Check if we're on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');

  // Fetch notifications using complete dashboard API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Get complete dashboard data (same as DashboardView)
      const dashboardData = await dashboardAPI.getCompleteData();
      
      const notifications = [];

      // 1. Performance Alerts (High Priority)
      if (dashboardData.performance?.alerts) {
        const alerts = dashboardData.performance.alerts.map((alert, index) => ({
          id: `performance_alert_${index}`,
          type: 'performance_alert',
          title: alert.message,
          message: alert.recommendation,
          priority: alert.type === 'error' ? 'high' : alert.type === 'warning' ? 'medium' : 'low',
          value: alert.value,
          timestamp: new Date().toISOString(),
          read: false,
          category: 'Performance',
          icon: alert.type === 'warning' ? 'warning' : alert.type === 'error' ? 'error' : 'success'
        }));
        notifications.push(...alerts);
      }

      // 2. Recent Leads (Medium Priority)
      if (dashboardData.leads?.recentLeads) {
        const recentLeads = dashboardData.leads.recentLeads.slice(0, 3); // Latest 3 leads
        const leadNotifications = recentLeads.map((lead, index) => ({
          id: `lead_${lead.id || index}`,
          type: 'lead_notification',
          title: `New Lead: ${lead.name}`,
          message: `Status: ${lead.status} | Source: ${lead.source}`,
          priority: lead.status === 'Appointment' ? 'high' : 'medium',
          value: lead.status,
          timestamp: lead.createdAt || new Date().toISOString(),
          read: false,
          category: 'Leads',
          icon: 'info'
        }));
        notifications.push(...leadNotifications);
      }

      // 3. Task Alerts (Medium Priority)
      if (dashboardData.tasks) {
        // Overdue tasks
        if (dashboardData.tasks.overdueTasks > 0) {
          notifications.push({
            id: 'overdue_tasks',
            type: 'task_alert',
            title: `${dashboardData.tasks.overdueTasks} Overdue Task${dashboardData.tasks.overdueTasks > 1 ? 's' : ''}`,
            message: 'You have overdue tasks that need immediate attention',
            priority: 'high',
            value: `${dashboardData.tasks.overdueTasks}`,
            timestamp: new Date().toISOString(),
            read: false,
            category: 'Tasks',
            icon: 'warning'
          });
        }

        // Upcoming tasks
        if (dashboardData.tasks.upcomingTasks > 0) {
          notifications.push({
            id: 'upcoming_tasks',
            type: 'task_reminder',
            title: `${dashboardData.tasks.upcomingTasks} Task${dashboardData.tasks.upcomingTasks > 1 ? 's' : ''} Due Soon`,
            message: 'Tasks are due in the next 24 hours',
            priority: 'medium',
            value: `${dashboardData.tasks.upcomingTasks}`,
            timestamp: new Date().toISOString(),
            read: false,
            category: 'Tasks',
            icon: 'clock'
          });
        }
      }

      // 4. Calendar/Appointment Alerts (Medium Priority)
      if (dashboardData.calendar?.nextAppointment) {
        const appointment = dashboardData.calendar.nextAppointment;
        const appointmentTime = new Date(appointment.startTime);
        const now = new Date();
        const timeDiff = appointmentTime - now;
        const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));

        if (hoursUntil <= 24 && hoursUntil > 0) {
          notifications.push({
            id: `appointment_${appointment._id}`,
            type: 'appointment_reminder',
            title: `Upcoming Appointment: ${appointment.leadId.name}`,
            message: `Scheduled for ${appointmentTime.toLocaleString()} (${hoursUntil}h remaining)`,
            priority: hoursUntil <= 2 ? 'high' : 'medium',
            value: `${hoursUntil}h`,
            timestamp: new Date().toISOString(),
            read: false,
            category: 'Calendar',
            icon: 'calendar'
          });
        }
      }

      // 5. Daily Feed Items (Low-Medium Priority)
      if (dashboardData.dailyFeed) {
        // Recent leads from daily feed
        const recentFeedLeads = dashboardData.dailyFeed
          .filter(item => item.type === 'Recent Lead')
          .slice(0, 2); // Latest 2 recent leads

        const feedNotifications = recentFeedLeads.map((item, index) => ({
          id: `feed_lead_${item.leadId}`,
          type: 'feed_notification',
          title: item.title,
          message: item.description,
          priority: 'low',
          value: 'New',
          timestamp: item.createdAt || new Date().toISOString(),
          read: false,
          category: 'Daily Feed',
          icon: 'info'
        }));
        notifications.push(...feedNotifications);

        // Stale leads (high priority for re-engagement)
        const staleLeads = dashboardData.dailyFeed
          .filter(item => item.type === 'Stale Lead - Re-engage')
          .slice(0, 2); // Top 2 stale leads

        const staleNotifications = staleLeads.map((item, index) => ({
          id: `stale_lead_${item.leadId}`,
          type: 'stale_lead_alert',
          title: item.title,
          message: item.description,
          priority: 'medium',
          value: 'Stale',
          timestamp: item.lastActivityAt || new Date().toISOString(),
          read: false,
          category: 'Leads',
          icon: 'warning'
        }));
        notifications.push(...staleNotifications);
      }

      // 6. Performance Alerts (High Priority)
      if (dashboardData.performance?.alerts) {
        const performanceAlerts = dashboardData.performance.alerts.map((alert, index) => ({
          id: `performance_alert_${index}`,
          type: 'performance_alert',
          title: alert.message,
          message: alert.recommendation,
          priority: alert.type === 'error' ? 'high' : alert.type === 'warning' ? 'medium' : 'low',
          value: alert.value,
          timestamp: new Date().toISOString(),
          read: false,
          category: 'Performance',
          icon: alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'success'
        }));
        notifications.push(...performanceAlerts);
      }

      // 7. Team Performance Alerts (Low Priority)
      if (dashboardData.team?.teamAnalytics) {
        const analytics = dashboardData.team.teamAnalytics;
        
        // Low average score alert
        if (analytics.averageScore < 5) {
          notifications.push({
            id: 'team_performance',
            type: 'team_alert',
            title: 'Team Performance Below Target',
            message: `Average team score: ${analytics.averageScore}/10. Consider additional training.`,
            priority: 'medium',
            value: `${analytics.averageScore}/10`,
            timestamp: new Date().toISOString(),
            read: false,
            category: 'Team',
            icon: 'warning'
          });
        }
      }

      // 8. Financial Alerts (Low Priority)
      if (dashboardData.financial?.metrics) {
        const metrics = dashboardData.financial.metrics;
        
        // Zero revenue alert
        if (metrics.totalRevenue === 0) {
          notifications.push({
            id: 'zero_revenue',
            type: 'financial_alert',
            title: 'No Revenue Generated',
            message: 'Consider focusing on lead conversion and sales activities',
            priority: 'medium',
            value: '₹0',
            timestamp: new Date().toISOString(),
            read: false,
            category: 'Financial',
            icon: 'warning'
          });
        }
      }

      // Sort notifications by priority and timestamp (newest first)
      notifications.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        const aPriority = priorityOrder[a.priority] || 0;
        const bPriority = priorityOrder[b.priority] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Higher priority first
        }
        
        return new Date(b.timestamp) - new Date(a.timestamp); // Newer first
      });

      const unreadCount = notifications.filter(n => !n.read).length;

      setNotifications(notifications);
      setNotificationCount(notifications.length);
      setUnreadCount(unreadCount);

      console.log('✅ Real-time notifications fetched successfully:', notifications.length);
      console.log('📊 Notification breakdown:', {
        performance: notifications.filter(n => n.category === 'Performance').length,
        leads: notifications.filter(n => n.category === 'Leads').length,
        tasks: notifications.filter(n => n.category === 'Tasks').length,
        calendar: notifications.filter(n => n.category === 'Calendar').length,
        team: notifications.filter(n => n.category === 'Team').length,
        financial: notifications.filter(n => n.category === 'Financial').length,
        feed: notifications.filter(n => n.category === 'Daily Feed').length
      });
      console.log('🔍 All notifications:', notifications);

    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      
      // Set empty state if API fails
      setNotifications([]);
      setNotificationCount(0);
      setUnreadCount(0);

      // Only show toast for network errors, not for expected errors
      const errorMessage = error.message || error.toString();
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Network error')) {
        // Don't show toast on every failed fetch to avoid spam
        // The error is already logged to console
        console.warn('⚠️ Network error fetching notifications - this may be due to CORS, connectivity, or server issues');
      } else {
        toast({
          title: 'Error',
          description: errorMessage || 'Failed to load notifications',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read (local state only)
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read (local state only)
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
    toast({
      title: 'Success',
      description: 'All notifications marked as read',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Delete notification (local state only)
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setNotificationCount(prev => prev - 1);
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Get icon for notification type
  const getNotificationIcon = (icon) => {
    switch (icon) {
      case 'warning':
        return FiAlertTriangle;
      case 'error':
        return FiAlertTriangle;
      case 'success':
        return FiCheckCircle;
      case 'info':
        return FiInfo;
      case 'clock':
        return FiClock;
      case 'calendar':
        return FiCalendar;
      default:
        return FiBell;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // All useEffect hooks at the top to maintain order
  useEffect(() => {
    const handleSidebarEvent = (event) => {
      console.log('TopNav: Received sidebar event:', event.detail);
      
      if (event.detail) {
        if (event.detail.width) {
          // Handle width-based events
          const newCollapsed = event.detail.width === '80px';
          setIsSidebarCollapsed(newCollapsed);
          console.log('TopNav: Updated state based on width:', newCollapsed);
        } else if (event.detail.action === 'toggle') {
          // Handle action-based events
          if (event.detail.collapsed !== undefined) {
            setIsSidebarCollapsed(event.detail.collapsed);
            console.log('TopNav: Updated state based on collapsed value:', event.detail.collapsed);
          } else {
            setIsSidebarCollapsed(prev => !prev);
            console.log('TopNav: Toggled state to:', !event.detail.collapsed);
          }
        }
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarEvent);
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarEvent);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSidebarToggle = () => {
    console.log('TopNav: Sidebar toggle clicked, current state:', isSidebarCollapsed);
    
    // Use the same logic as Sidebar - directly update state
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      console.log('TopNav: Toggling sidebar state to:', newState);
      
      // Dispatch event to notify Sidebar and MainLayout
      const event = new CustomEvent('sidebarToggle', {
        detail: {
          action: 'toggle',
          collapsed: newState,
          width: newState ? '80px' : '320px'  // Add width for MainLayout
        }
      });
      window.dispatchEvent(event);
      
      return newState;
    });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleThemeToggle = () => {
    toggleColorMode();
    dispatch(toggleDarkMode());
  };

  const handleProfileClick = () => {
    navigate('/Profile_settings');
  };

  const handleWhatsAppSettings = () => {
    navigate('/whatsapp_setup');
  };

  const handleZoomSettings = () => {
    navigate('/zoom-settings');
  };

  const handlePaymentGateways = () => {
    navigate('/payment-gateways');
  };

  return (
    <Box
      h="80px"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex h="100%" align="center" justify="space-between">
        {/* Left Section */}
        <HStack spacing={4} align="flex-start">
          {/* Menu Button - Always show on mobile, show on desktop when sidebar is collapsed */}
          {(isMobile || isSidebarCollapsed) && (
            <Tooltip label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
              <IconButton
                icon={isSidebarCollapsed ? <FiMenu /> : <FiX />}
                variant="ghost"
                size="md"
                aria-label="Toggle sidebar"
                onClick={handleSidebarToggle}
                color="brand.600"
                _hover={{
                  bg: 'rgba(102, 126, 234, 0.1)',
                  transform: 'scale(1.05)',
                }}
                transition="all 0.2s ease"
                // Mobile specific styling
                {...(isMobile && {
                  size: "lg",
                  color: "brand.500",
                  _hover: {
                    bg: 'rgba(102, 126, 234, 0.15)',
                    transform: 'scale(1.1)',
                  }
                })}
              />
            </Tooltip>
          )}
          
          <Box flex="1" minW={0}>  {/* Prevent text overflow */}
            <Text fontSize="2xl" fontWeight="bold" color="brand.600" noOfLines={1}>
              Welcome back, {user?.name || 'User'}!
            </Text>
            <Text fontSize="sm" color={textColor} noOfLines={1}>
              Here's what's happening with your business today
            </Text>
          </Box>
        </HStack>

        {/* Right Section */}
        <HStack spacing={4}>
          {/* Search */}
          <Tooltip label="Search">
            <IconButton
              icon={<FiSearch />}
              variant="ghost"
              size="md"
              aria-label="Search"
            />
          </Tooltip>

          {/* Notifications Dropdown */}
          <Box position="relative">
            <Tooltip label="Notifications">
              <IconButton
                icon={<FiBell />}
                variant="ghost"
                size="md"
                aria-label="Notifications"
                position="relative"
                onClick={() => setShowNotifications(!showNotifications)}
                _hover={{ bg: 'rgba(102, 126, 234, 0.1)' }}
              >
                {unreadCount > 0 && (
                  <Badge
                    position="absolute"
                    top="8px"
                    right="8px"
                    colorScheme="red"
                    variant="solid"
                    size="sm"
                    borderRadius="full"
                    fontSize="xs"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </IconButton>
            </Tooltip>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <Box
                position="absolute"
                top="100%"
                right={0}
                mt={2}
                bg={cardBgColor}
                borderRadius="lg"
                boxShadow="2xl"
                border="1px"
                borderColor={borderColor}
                minW="400px"
                maxW="500px"
                zIndex={1000}
                overflow="hidden"
              >
                {/* Header */}
                <Box
                  p={4}
                  borderBottom="1px"
                  borderColor={borderColor}
                  bg={useColorModeValue('blue.50', 'blue.900')}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center" gap={2}>
                      <FiBell color="blue.500" />
                      <Text fontWeight="semibold" color={textColor}>
                        Notifications
                      </Text>
                      <Badge colorScheme="blue" variant="outline" size="sm">
                        {notificationCount} total
                      </Badge>
                      {unreadCount > 0 && (
                        <Badge colorScheme="red" variant="solid" size="sm">
                          {unreadCount} new
                        </Badge>
                      )}
                    </Flex>
                    <Flex gap={2}>
                      {unreadCount > 0 && (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="outline"
                          onClick={markAllAsRead}
                          leftIcon={<FiCheck />}
                        >
                          Mark All Read
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        color="gray.500"
                        onClick={() => setShowNotifications(false)}
                        _hover={{ bg: 'gray.100' }}
                      >
                        <FiX />
                      </Button>
                    </Flex>
                  </Flex>
                </Box>

                {/* Notifications List */}
                <Box maxH="400px" overflowY="auto">
                  {loading ? (
                    <Box p={8} textAlign="center">
                      <Spinner size="md" color="brand.500" />
                      <Text mt={2} color={textColor}>Loading notifications...</Text>
                    </Box>
                  ) : notifications.length === 0 ? (
                    <Box p={8} textAlign="center">
                      <FiBell size={48} color="gray.400" />
                      <Text mt={2} color={textColor}>No notifications</Text>
                      <Text fontSize="xs" color="gray.500" mt={2}>
                        Debug: notifications.length = {notifications.length}
                      </Text>
                    </Box>
                  ) : (
                    <VStack spacing={0} align="stretch">
                      {/* Debug Info */}
                      <Box p={2} bg="gray.100" fontSize="xs" color="gray.600">
                        Debug: {notifications.length} notifications loaded
                      </Box>
                      {notifications.map((notification, index) => {
                        const IconComponent = getNotificationIcon(notification.icon);
                        const priorityColor = getPriorityColor(notification.priority);
                        
                        return (
                          <Box
                            key={notification.id}
                            p={4}
                            borderBottom={index < notifications.length - 1 ? "1px" : "none"}
                            borderColor={borderColor}
                            bg={notification.read ? 'transparent' : useColorModeValue('blue.50', 'blue.900')}
                            _hover={{ bg: hoverBgColor }}
                            transition="background-color 0.2s"
                          >
                            <Flex alignItems="flex-start" gap={3}>
                              <Box
                                p={2}
                                borderRadius="md"
                                bg={`${priorityColor}.100`}
                                color={`${priorityColor}.600`}
                              >
                                <IconComponent size={16} />
                              </Box>
                              
                              <Box flex="1" minW={0}>
                                <Flex alignItems="center" gap={2} mb={1}>
                                  <Text fontWeight="semibold" color={textColor} fontSize="sm" noOfLines={1}>
                                    {notification.title}
                                  </Text>
                                  {notification.value && (
                                    <Badge 
                                      colorScheme={priorityColor} 
                                      variant="solid"
                                      size="sm"
                                      fontSize="xs"
                                    >
                                      {notification.value}
                                    </Badge>
                                  )}
                                  {!notification.read && (
                                    <Box w={2} h={2} bg="blue.500" borderRadius="full" />
                                  )}
                                </Flex>
                                
                                <Text fontSize="xs" color={textColor} mb={2} noOfLines={2}>
                                  {notification.message}
                                </Text>
                                
                                <Flex alignItems="center" justifyContent="space-between">
                                  <Text fontSize="xs" color="gray.500">
                                    {formatTimestamp(notification.timestamp)}
                                  </Text>
                                  
                                  <Flex gap={1}>
                                    {!notification.read && (
                                      <Button
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => markAsRead(notification.id)}
                                        leftIcon={<FiCheck size={12} />}
                                      >
                                        Read
                                      </Button>
                                    )}
                                    <Button
                                      size="xs"
                                      variant="ghost"
                                      colorScheme="red"
                                      onClick={() => deleteNotification(notification.id)}
                                      leftIcon={<FiTrash2 size={12} />}
                                    >
                                      Delete
                                    </Button>
                                  </Flex>
                                </Flex>
                              </Box>
                            </Flex>
                          </Box>
                        );
                      })}
                    </VStack>
                  )}
                </Box>

                {/* Footer */}
                {notifications.length > 0 && (
                  <Box
                    p={3}
                    borderTop="1px"
                    borderColor={borderColor}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                  >
                    <Button
                      size="sm"
                      colorScheme="brand"
                      w="100%"
                      onClick={() => {
                        setShowNotifications(false);
                        fetchNotifications();
                      }}
                    >
                      Refresh Notifications
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Theme Toggle */}
          <Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              variant="ghost"
              size="md"
              aria-label="Toggle theme"
              onClick={handleThemeToggle}
            />
          </Tooltip>

          {/* Beautiful User Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Avatar size="sm" name={user?.name} src={user?.avatar} />}
              variant="ghost"
              size="md"
              aria-label="User menu"
              _hover={{ bg: 'rgba(102, 126, 234, 0.1)' }}
            />
            <MenuList minW="260px" borderRadius="xl" boxShadow="2xl" border="none" overflow="hidden">
              {/* User Header */}
              <Box 
                p={4} 
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
              >
                <Flex alignItems="center" gap={3}>
                  <Avatar 
                    size="md" 
                    name={user?.name} 
                    src={user?.avatar}
                    border="2px solid white"
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="md">
                      {user?.name || 'User'}
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                      {user?.email || 'user@example.com'}
                    </Text>
                    <Badge 
                      bg="rgba(255,255,255,0.2)" 
                      color="white" 
                      size="sm" 
                      mt={1}
                    >
                      {user?.role || 'User'}
                    </Badge>
                  </Box>
                </Flex>
              </Box>

              {/* Stats Section */}
              <Box p={3} bg={useColorModeValue('gray.50', 'gray.800')}>
                <Flex justify="space-around">
                  <Box textAlign="center">
                    <Text fontSize="lg" fontWeight="bold" color="brand.500">
                      {notificationCount}
                    </Text>
                    <Text fontSize="xs" color="gray.500">Alerts</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="lg" fontWeight="bold" color="green.500">
                      Online
                    </Text>
                    <Text fontSize="xs" color="gray.500">Status</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="lg" fontWeight="bold" color="purple.500">
                      Pro
                    </Text>
                    <Text fontSize="xs" color="gray.500">Plan</Text>
                  </Box>
                </Flex>
              </Box>

              {/* Menu Items */}
              <Box p={1}>
                <MenuItem 
                  icon={<FiUser />} 
                  onClick={handleProfileClick}
                  borderRadius="md"
                  _hover={{ bg: 'brand.50' }}
                >
                  <Box>
                    <Text fontWeight="medium">Profile Settings</Text>
                    <Text fontSize="xs" color="gray.500">Manage your account</Text>
                  </Box>
                </MenuItem>

                <Menu>
                  <MenuButton 
                    as={MenuItem} 
                    icon={<FiSettings />}
                    borderRadius="md"
                    _hover={{ bg: 'brand.50' }}
                  >
                    <Box>
                      <Text fontWeight="medium">Settings</Text>
                      <Text fontSize="xs" color="gray.500">Configure preferences</Text>
                    </Box>
                  </MenuButton>
                  <MenuList borderRadius="lg" boxShadow="xl">
                    <MenuItem icon={<FiMessageCircle />} onClick={handleWhatsAppSettings}>
                      WhatsApp Integration
                    </MenuItem>
                    <MenuItem icon={<FiVideo />} onClick={handleZoomSettings}>
                      Zoom Meetings
                    </MenuItem>
                    <MenuItem icon={<FiCreditCard />} onClick={handlePaymentGateways}>
                      Payment Methods
                    </MenuItem>
                  </MenuList>
                </Menu>

                <MenuDivider />

                <MenuItem 
                  icon={<FiLogOut />} 
                  onClick={handleLogout}
                  borderRadius="md"
                  _hover={{ bg: 'red.50' }}
                >
                  <Box>
                    <Text fontWeight="medium" color="red.500">Sign Out</Text>
                    <Text fontSize="xs" color="gray.500">Logout from account</Text>
                  </Box>
                </MenuItem>
              </Box>

              {/* Footer */}
              <Box p={2} bg={useColorModeValue('gray.100', 'gray.700')} textAlign="center">
                <Text fontSize="xs" color="gray.500">
                  Last active: {new Date().toLocaleTimeString()}
                </Text>
              </Box>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default TopNav;