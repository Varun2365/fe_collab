import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Badge,
  Collapse,
  IconButton,
  Divider,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiCalendar,
  FiZap,
  FiTrendingUp,
  FiMessageCircle,
  FiChevronDown,
  FiChevronRight,
  FiUser,
  FiUsers as FiTeam,
  FiVideo,
  FiCreditCard,
  FiFileText,
  FiUserCheck,
  FiMenu,
  FiX,
  FiTarget,
  FiGlobe,
  FiCheckSquare,
  FiActivity,
  FiAward,
  FiBookOpen,
  FiPieChart,
  FiHeart,
} from 'react-icons/fi';
import { IoPeopleOutline } from 'react-icons/io5';

// Enhanced SVG Icons with better styling
const FindMeLogo = () => (
  <Box
    w={10}
    h={10}
    bg="linear-gradient(135deg, #5a54ff 0%, #b26bff 100%)"
    borderRadius="xl"
    display="flex"
    alignItems="center"
    justifyContent="center"
    boxShadow="0 8px 25px rgba(90, 84, 255, 0.35)"
  >
    <Text fontSize="lg" fontWeight="bold" color="white">
      F
    </Text>
  </Box>
);

const sidebarPalette = {
  background: 'linear-gradient(185deg, #11111f 0%, #05030c 100%)',
  border: 'rgba(255, 255, 255, 0.08)',
  headerBg: 'rgba(255, 255, 255, 0.02)',
  panel: 'rgba(255, 255, 255, 0.03)',
  panelHover: 'rgba(255, 255, 255, 0.06)',
  panelActive: 'linear-gradient(130deg, rgba(81, 67, 255, 0.35), rgba(168, 85, 247, 0.25))',
  icon: 'rgba(255, 255, 255, 0.05)',
  iconActive: 'rgba(119, 92, 246, 0.3)',
  text: 'rgba(255, 255, 255, 0.95)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  divider: 'rgba(255, 255, 255, 0.08)',
  glow: '0 20px 60px rgba(5, 3, 12, 0.65)',
  highlight: '#a889ff',
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check if we're on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Listen for sidebar toggle events from TopNav
  React.useEffect(() => {
    const handleSidebarToggle = (event) => {
      console.log('Sidebar: Received toggle event:', event.detail);
      
      if (event.detail && event.detail.action === 'toggle') {
        if (event.detail.collapsed !== undefined) {
          // Use the specific collapsed value from TopNav
          setIsCollapsed(event.detail.collapsed);
          console.log('Sidebar: Updated state to:', event.detail.collapsed);
          
          // Also dispatch width event for MainLayout
          if (event.detail.width) {
            const widthEvent = new CustomEvent('sidebarToggle', {
              detail: { width: event.detail.width }
            });
            window.dispatchEvent(widthEvent);
          }
        } else {
          // Fallback to toggle behavior
          setIsCollapsed(prev => {
            const newState = !prev;
            console.log('Sidebar: Toggling collapsed state to:', newState);
            return newState;
          });
        }
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  // Grouped menu items for better organization
  const menuGroups = [
    {
      title: 'Core',
      items: [
        { icon: FiHome, label: 'Dashboard', path: '/', badge: null, type: 'single' },
        { icon: FiBarChart, label: 'Funnels', path: '/funnels', badge: null, type: 'single' },
      ]
    },
    {
      title: 'Leads & Communication',
      items: [
        { 
          icon: IoPeopleOutline, 
          label: 'Lead Management', 
          path: '/leads', 
          badge: null, 
          type: 'dropdown',
          subItems: [
            { icon: FiUser, label: 'Customer Leads', path: '/leads_customer', badge: null },
            { icon: FiTeam, label: 'Coach Leads', path: '/leads_couch', badge: null },
          ]
        },
        { 
          icon: FiUserCheck, 
          label: 'Client Management', 
          path: '/client_management', 
          badge: null, 
          type: 'dropdown',
          subItems: [
            { icon: FiActivity, label: 'Personal Progress Tracking', path: '/client_management/personal_progress', badge: null },
            { icon: FiZap, label: 'Coaching Delivery System (Core)', path: '/client_management/coaching_delivery', badge: null },
            { icon: FiAward, label: 'Essential Gamification', path: '/client_management/gamification', badge: null },
            { icon: FiMessageCircle, label: 'Communication Tools', path: '/client_management/communication', badge: null },
            { icon: FiBookOpen, label: 'Educational Hub (Core)', path: '/client_management/educational_hub', badge: null },
            { icon: FiPieChart, label: 'Progress Analytics (Essential)', path: '/client_management/progress_analytics', badge: null },
            { icon: FiUsers, label: 'Community & Social Programs', path: '/client_management/community', badge: null },
            { icon: FiHeart, label: 'Motivational Features', path: '/client_management/motivational', badge: null },
          ]
        },
        { icon: FiMessageCircle, label: 'Messages', path: '/messaging', badge: null, type: 'single' },
        { icon: FiCalendar, label: 'Calendar', path: '/calendar', badge: null, type: 'single' },
      ]
    },
    {
      title: 'Marketing & Growth',
      items: [
        { icon: FiTarget, label: 'Marketing & Ads', path: '/ads', badge: 'AI', type: 'single' },
        { icon: FiZap, label: 'AI & Automation', path: '/automation', badge: null, type: 'single' },
        { icon: FiFileText, label: 'Courses & Content', path: '/courses', badge: null, type: 'single' },
      ]
    },
    {
      title: 'Team & Network',
      items: [
        { icon: FiUsers, label: 'Staff', path: '/staff', badge: null, type: 'single' },
        { icon: FiTrendingUp, label: 'Couch Network', path: '/mlm', badge: null, type: 'single' },
        { icon: FiCheckSquare, label: 'Tasks & Activities', path: '/tasks', badge: null, type: 'single' },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: FiUserCheck, label: 'Profile', path: '/profile_settings', badge: null, type: 'single' },
        { 
          icon: FiSettings, 
          label: 'Settings', 
          path: '/settings', 
          badge: null, 
          type: 'dropdown',
          subItems: [
            { icon: FiMessageCircle, label: 'WhatsApp Settings', path: '/whatsapp_setup', badge: null },
            { icon: FiVideo, label: 'Zoom Settings', path: '/zoom_settings', badge: null },
            { icon: FiCreditCard, label: 'Payment Gateways', path: '/payment_gateways', badge: null },
          ]
        },
        // { icon: FiCreditCard, label: 'Subscription', path: '/subscription', badge: null, type: 'single' }, // Moved to Profile
        // { icon: FiGlobe, label: 'Custom Domains', path: '/dns', badge: 'New', type: 'single' }, // Commented out
      ]
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDropdown = (path) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };


  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    
    // Calculate stable width values
    const newWidth = newCollapsed ? '80px' : '320px';
    
    // Dispatch event to MainLayout for margin adjustment
    const event = new CustomEvent('sidebarToggle', {
      detail: {
        width: newWidth,
        collapsed: newCollapsed
      }
    });
    window.dispatchEvent(event);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubItemActive = (path) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item, index) => {
    const isExpanded = expandedItems.has(item.path);
    const isItemActive = isActive(item.path);
    const isHovered = hoveredItem === item.name;
    const useNeutralBg = item.label === 'Lead Management' || item.label === 'Settings' || item.label === 'Client Management';

    if (item.type === 'dropdown') {
      return (
        <Box key={item.path} mb={1}>
          {/* Main Dropdown Item */}
          <Box
            as="button"
            w="100%"
            p={2}
            borderRadius="lg"
            bg={
              useNeutralBg
                ? 'transparent'
                : isItemActive
                ? sidebarPalette.panelActive
                : sidebarPalette.panel
            }
            color={isItemActive ? sidebarPalette.text : sidebarPalette.textMuted}
            _hover={{
              bg: useNeutralBg
                ? 'rgba(255, 255, 255, 0.04)'
                : isItemActive
                ? sidebarPalette.panelActive
                : sidebarPalette.panelHover,
              color: sidebarPalette.text,
              transform: 'translateX(3px)',
            }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            onClick={() => toggleDropdown(item.path)}
            position="relative"
            border="1px solid"
            borderColor={
              useNeutralBg
                ? 'transparent'
                : isItemActive
                ? sidebarPalette.highlight
                : 'transparent'
            }
            boxShadow={
              useNeutralBg
                ? 'none'
                : isItemActive
                ? '0 8px 30px rgba(101, 92, 255, 0.25)'
                : '0 2px 8px rgba(3, 3, 6, 0.35)'
            }
            transform={
              useNeutralBg
                ? 'translateX(0)'
                : isItemActive
                ? 'translateX(2px)'
                : 'translateX(0)'
            }
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <HStack spacing={3} justify={isCollapsed ? "center" : "space-between"} align="center">
              <HStack spacing={3} align="center" flex={1}>
                <Box
                  p={isCollapsed ? 2 : "4px"}
                  borderRadius="md"
                  bg={isItemActive ? sidebarPalette.iconActive : sidebarPalette.icon}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
                  transition="transform 0.15s ease"
                  w={isCollapsed ? "40px" : "36px"}
                  h={isCollapsed ? "40px" : "36px"}
                  minW={isCollapsed ? "40px" : "36px"}
                  minH={isCollapsed ? "40px" : "36px"}
                >
                  <Icon 
                    as={item.icon} 
                    boxSize="15px" 
                      color={isItemActive ? sidebarPalette.text : sidebarPalette.textMuted} 
                    flexShrink={0}
                  />
                </Box>
                {!isCollapsed && (
                  <Text 
                    fontWeight={isItemActive ? '600' : '400'} 
                    textAlign="left"
                    fontSize="sm"
                    letterSpacing="0.01em"
                    flex={1}
                    color={isItemActive ? sidebarPalette.text : sidebarPalette.textMuted}
                  >
                    {item.label}
                  </Text>
                )}
                {!isCollapsed && item.badge && (
                  <Badge
                    bg="rgba(255, 255, 255, 0.12)"
                    color={sidebarPalette.text}
                    size="sm"
                    borderRadius="full"
                    fontSize="2xs"
                    px={1.5}
                    py={0.5}
                    fontWeight="600"
                  >
                    {item.badge}
                  </Badge>
                )}
              </HStack>
              
              {/* Dropdown Arrow */}
              {!isCollapsed && (
                <Icon 
                  as={isExpanded ? FiChevronDown : FiChevronRight} 
                  boxSize="15px" 
                  color={isItemActive ? sidebarPalette.text : sidebarPalette.textMuted}
                />
              )}
            </HStack>
          </Box>

          {/* Dropdown Sub-items */}
          {!isCollapsed && (
            <Collapse in={isExpanded} animateOpacity>
              <VStack spacing={1} align="stretch" pl={7} mt={1.5}>
                {item.subItems.map((subItem) => {
                  const isSubActive = isSubItemActive(subItem.path);
                  const isSubHovered = hoveredItem === subItem.name;
                  return (
                    <Box
                      key={subItem.path}
                      as="button"
                      w="100%"
                      p={1.5}
                      borderRadius="md"
                      bg={isSubActive 
                        ? 'rgba(102, 126, 234, 0.15)' 
                        : 'transparent'
                      }
                      color={isSubActive ? 'white' : 'gray.500'}
                      _hover={{
                        bg: isSubActive 
                          ? 'rgba(102, 126, 234, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        transform: 'translateX(2px)',
                      }}
                      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                      onClick={() => handleNavigation(subItem.path)}
                      position="relative"
                      border="1px solid"
                      borderColor={isSubActive ? 'rgba(102, 126, 234, 0.25)' : 'transparent'}
                      transform={isSubHovered ? 'translateX(2px)' : 'translateX(0)'}
                      onMouseEnter={() => setHoveredItem(subItem.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <HStack spacing={2.5} align="center">
                        <Box
                          p="4px"
                          borderRadius="sm"
                          bg={isSubActive 
                            ? 'rgba(102, 126, 234, 0.2)' 
                            : 'rgba(255, 255, 255, 0.05)'
                          }
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          transform={isSubHovered ? 'scale(1.05)' : 'scale(1)'}
                          transition="transform 0.15s ease"
                          w="28px"
                          h="28px"
                          minW="28px"
                          minH="28px"
                        >
                          <Icon 
                            as={subItem.icon} 
                            boxSize="15px" 
                            color={isSubActive ? 'white' : 'gray.500'} 
                            flexShrink={0}
                          />
                        </Box>
                        <Text 
                          fontWeight={isSubActive ? '500' : '400'} 
                          textAlign="left"
                          fontSize="xs"
                        >
                          {subItem.label}
                        </Text>
                        {subItem.badge && (
                          <Badge
                            colorScheme="blue"
                            variant="solid"
                            size="sm"
                            borderRadius="full"
                            fontSize="2xs"
                            px={1}
                            py={0.5}
                          >
                            {subItem.badge}
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </Collapse>
          )}
        </Box>
      );
    }

    // Single Menu Item
    return (
      <Box
        key={item.path}
        as="button"
        w="100%"
        p={2}
        borderRadius="lg"
        bg={isItemActive 
          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%)' 
          : 'transparent'
        }
        color={isItemActive ? sidebarPalette.text : sidebarPalette.textMuted}
        _hover={{
          bg: isItemActive 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.15) 100%)' 
            : 'rgba(255, 255, 255, 0.05)',
          color: 'white',
          transform: 'translateX(3px)',
        }}
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        onClick={() => handleNavigation(item.path)}
        position="relative"
        border="1px solid"
        borderColor={isItemActive ? 'rgba(102, 126, 234, 0.3)' : 'transparent'}
        mb={0.5}
        boxShadow={isItemActive 
          ? '0 2px 6px rgba(102, 126, 234, 0.2)' 
          : 'none'
        }
        transform={isItemActive ? 'translateX(2px)' : 'translateX(0)'}
        onMouseEnter={() => setHoveredItem(item.name)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <HStack spacing={3} justify={isCollapsed ? "center" : "flex-start"} align="center">
          <Box
            p={isCollapsed ? 2 : "4px"}
            borderRadius="md"
            bg={isItemActive 
              ? 'rgba(102, 126, 234, 0.25)' 
              : 'rgba(255, 255, 255, 0.05)'
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
            transform={hoveredItem === item.name ? 'scale(1.05)' : 'scale(1)'}
            transition="transform 0.15s ease"
            w={isCollapsed ? "40px" : "36px"}
            h={isCollapsed ? "40px" : "36px"}
            minW={isCollapsed ? "40px" : "36px"}
            minH={isCollapsed ? "40px" : "36px"}
          >
            <Icon 
              as={item.icon} 
              boxSize="15px" 
              color={isItemActive ? sidebarPalette.text : sidebarPalette.textMuted} 
              flexShrink={0}
            />
          </Box>
          {!isCollapsed && (
            <Text 
              fontWeight={isItemActive ? '600' : '400'} 
              textAlign="left"
              fontSize="sm"
              letterSpacing="0.01em"
              flex={1}
            >
              {item.label}
            </Text>
          )}
          {!isCollapsed && item.badge && (
            <Badge
              colorScheme={item.badge === 'New' ? 'green' : 'red'}
              variant="solid"
              size="sm"
              borderRadius="full"
              fontSize="2xs"
              px={1.5}
              py={0.5}
              fontWeight="600"
            >
              {item.badge}
            </Badge>
          )}
        </HStack>
      </Box>
    );
  };

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w={isCollapsed ? "80px" : { base: "280px", sm: "300px", md: "320px" }}
      maxW={isCollapsed ? "80px" : { base: "280px", sm: "300px", md: "320px" }}
      minW={isCollapsed ? "80px" : { base: "280px", sm: "300px", md: "320px" }}
      bg={sidebarPalette.background}
      borderRight={`1px solid ${sidebarPalette.border}`}
      boxShadow={sidebarPalette.glow}
      zIndex={1000}
      overflow="hidden"
      transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      display={isMobile && isCollapsed ? "none" : "flex"}
      flexDirection="column"
      transform="translateZ(0)"
      willChange="width"
      backdropFilter="blur(12px)"
      sx={{
        '@media (max-width: 575px)': {
          width: isCollapsed ? '80px' : '100%',
          maxWidth: isCollapsed ? '80px' : '100%',
          minWidth: isCollapsed ? '80px' : '100%',
        },
        '@media (min-width: 576px) and (max-width: 767px)': {
          width: isCollapsed ? '80px' : '280px',
          maxWidth: isCollapsed ? '80px' : '280px',
          minWidth: isCollapsed ? '80px' : '280px',
        },
        '@media (min-width: 768px) and (max-width: 991px)': {
          width: isCollapsed ? '80px' : '280px',
          maxWidth: isCollapsed ? '80px' : '280px',
          minWidth: isCollapsed ? '80px' : '280px',
        },
        '@media (min-width: 992px) and (max-width: 1199px)': {
          width: isCollapsed ? '80px' : '280px',
          maxWidth: isCollapsed ? '80px' : '280px',
          minWidth: isCollapsed ? '80px' : '280px',
        },
        '@media (min-width: 1200px) and (max-width: 1399px)': {
          width: isCollapsed ? '80px' : '300px',
          maxWidth: isCollapsed ? '80px' : '300px',
          minWidth: isCollapsed ? '80px' : '300px',
        },
        '@media (min-width: 1400px)': {
          width: isCollapsed ? '80px' : '320px',
          maxWidth: isCollapsed ? '80px' : '320px',
          minWidth: isCollapsed ? '80px' : '320px',
        },
      }}
    >
      {/* Header */}
      <Box 
        p={isCollapsed ? 3 : 4} 
        borderBottom={`1px solid ${sidebarPalette.border}`} 
        mb={3}
        flexShrink={0}
        minH={isCollapsed ? "60px" : "70px"}
        bg={sidebarPalette.headerBg}
      >
        <HStack spacing={isCollapsed ? 0 : 3} justify={isCollapsed ? "center" : "space-between"}>
          <HStack spacing={isCollapsed ? 0 : 3} justify={isCollapsed ? "center" : "flex-start"}>
            <Box
              onClick={isCollapsed ? toggleSidebar : undefined}
              cursor={isCollapsed ? "pointer" : "default"}
              transition="transform 0.2s"
              _hover={isCollapsed ? { transform: "scale(1.1)" } : {}}
            >
              <FindMeLogo />
            </Box>
            {!isCollapsed && (
              <Box>
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={sidebarPalette.text}
                  letterSpacing="0.04em"
                >
                  FunnelsEye
                </Text>
                <Text fontSize="2xs" color={sidebarPalette.textMuted} mt={-0.5}>
                  Dashboard
                </Text>
              </Box>
            )}
          </HStack>
          
          {/* Toggle Button */}
          {!isCollapsed && (
            <Button
              size="xs"
              variant="ghost"
              color={sidebarPalette.textMuted}
              _hover={{
                bg: sidebarPalette.panelHover,
                color: sidebarPalette.text
              }}
              onClick={toggleSidebar}
              p={1}
              borderRadius="md"
              minW="auto"
              h="auto"
            >
              <Icon as={FiX} boxSize="15px" />
            </Button>
          )}
        </HStack>
      </Box>

      {/* Navigation Menu */}
      <Box 
        flex={1} 
        overflowY="auto" 
        overflowX="hidden"
        px={isCollapsed ? 2 : 2.5}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <VStack spacing={3} py={2} align="stretch">
          {menuGroups.map((group, groupIndex) => (
            <Box key={groupIndex}>
              {!isCollapsed && (
                <Text
                  fontSize="2xs"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  px={2}
                  py={1.5}
                  mb={1}
                >
                  {group.title}
                </Text>
              )}
              <VStack spacing={0.5} align="stretch">
                {group.items.map((item, index) => renderMenuItem(item, index))}
              </VStack>
              {groupIndex < menuGroups.length - 1 && !isCollapsed && (
                <Divider borderColor="rgba(255, 255, 255, 0.05)" my={2} />
              )}
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Restore Button when Collapsed - at bottom */}
      {isCollapsed && (
        <Box 
          p={2.5} 
          flexShrink={0}
          mt="auto"
          borderTop="1px solid rgba(255, 255, 255, 0.1)"
        >
          <Box
            as="button"
            w="100%"
            p={3}
            borderRadius="lg"
            bg="rgba(102, 126, 234, 0.1)"
            color="white"
            _hover={{
              bg: 'rgba(102, 126, 234, 0.2)',
              transform: 'scale(1.05)',
            }}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            onClick={toggleSidebar}
            position="relative"
            border="1px solid"
            borderColor="rgba(102, 126, 234, 0.3)"
            boxShadow="0 2px 6px rgba(102, 126, 234, 0.2)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="40px"
            minH="40px"
          >
            <Icon as={FiMenu} boxSize="15px" color="#667eea" />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;