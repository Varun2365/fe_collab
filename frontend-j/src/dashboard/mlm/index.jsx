// MLMDashboard.jsx - Complete Final Version with Enhanced Team Hierarchy (FIXED)
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getCoachId, getToken, debugAuthState, getLocalStorageAuth } from '../../utils/authUtils';
import { API_BASE_URL } from '../../config/apiConfig';
import { 
  Box, 
  Container, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Button, 
  Flex, 
  Heading, 
  Text, 
  Grid, 
  GridItem,
  Card, 
  CardBody, 
  CardHeader,
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText,
  StatGroup,
  Avatar, 
  Badge, 
  VStack, 
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  Switch,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Progress,
  Tag,
  TagLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Skeleton,
  SkeletonText,
  Image,
  Center,
  InputGroup,
  InputLeftElement,
  ButtonGroup,
  Tooltip,
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel,
  Wrap,
  WrapItem,
  Stack,
  FormErrorMessage,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  MenuDivider,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  AddIcon, 
  EditIcon, 
  DeleteIcon, 
  ViewIcon,
  RepeatIcon,
  SettingsIcon,
  DownloadIcon,
  SearchIcon,
  ChevronRightIcon,
  EmailIcon,
  PhoneIcon,
  CalendarIcon,
  InfoIcon,
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  ChatIcon,
  ExternalLinkIcon,
  CopyIcon,
  StarIcon
} from '@chakra-ui/icons';
import { 
  FiFileText, FiUser, FiMail, FiPhone, FiCalendar, FiFilter, FiUpload,
  FiEye, FiEdit, FiTrash2, FiCopy, FiUsers, FiMoreVertical, 
  FiPlay, FiPause, FiBarChart2, FiTrendingUp, FiTarget, FiGlobe,
  FiZoomIn, FiZoomOut, FiMaximize2, FiRefreshCw, FiPlus
} from 'react-icons/fi';

// --- BEAUTIFUL SKELETON COMPONENTS ---
const BeautifulSkeleton = () => {
  return (
    <Box bg="gray.100" minH="100vh" py={6} px={6}>
      <Box maxW="full" mx="auto">
        <VStack spacing={8} align="stretch" w="full">
          {/* Header Skeleton */}
          <Card bg="white" borderRadius="7px" boxShadow="lg" border="1px" borderColor="gray.200">
            <CardHeader py={6}>
              <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
                  <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
                    <Skeleton height="32px" width="300px" />
                    <Skeleton height="16px" width="400px" />
                  </VStack>
                  <HStack spacing={4}>
                    <Skeleton height="40px" width="300px" />
                    <Skeleton height="48px" width="150px" />
                  </HStack>
                </Flex>
                
                {/* Stats Cards Skeleton */}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} variant="outline">
                      <CardBody>
                        <VStack spacing={3}>
                          <Skeleton height="60px" width="60px" borderRadius="7px" />
                          <SkeletonText noOfLines={2} spacing="4" />
                          <Skeleton height="30px" width="80px" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardHeader>
          </Card>

          {/* Table Skeleton */}
          <Card bg="white" borderRadius="7px" boxShadow="lg" border="1px" borderColor="gray.200">
            <CardBody>
              <VStack spacing={4} align="stretch">
                {[...Array(5)].map((_, i) => (
                  <HStack key={i} spacing={4} justify="space-between">
                    <Skeleton height="20px" width="200px" />
                    <Skeleton height="20px" width="150px" />
                    <Skeleton height="20px" width="100px" />
                    <Skeleton height="20px" width="120px" />
                    <Skeleton height="20px" width="100px" />
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
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

// --- STATS CARDS (Matching AI & Automation Theme) ---
const StatsCard = ({ title, value, icon, color = "blue", trend, isLoading = false, description }) => {
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
            {isLoading ? (
              <Skeleton height="28px" width="80px" mt={1} />
            ) : (
              <Text fontSize="xl" fontWeight="700" color={`${color}.800`} mt={1}>
                {value}
              </Text>
            )}
            {description && (
              <Text fontSize="xs" color={`${color}.600`} mt={0.5}>
                {description}
              </Text>
            )}
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

// Helper function to calculate total team size recursively
const calculateTotalTeamSize = (coach) => {
  if (!coach.downline || coach.downline.length === 0) return 0;
  
  let total = coach.downline.length;
  coach.downline.forEach(child => {
    total += calculateTotalTeamSize(child);
  });
  
  return total;
};

// --- ENHANCED HIERARCHY NODE COMPONENT ---
const HierarchyNode = ({ coach, level = 0, onViewCoach, onEditCoach, maxLevels = 5 }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0); // Root level always expanded, others collapsed
  const hasChildren = coach.downline && coach.downline.length > 0;
  const canExpand = level < maxLevels && hasChildren;

  const nodeColors = {
    0: { bg: 'blue.500', border: 'blue.600', bgCard: 'blue.50', shadowColor: 'blue.200' },
    1: { bg: 'purple.500', border: 'purple.600', bgCard: 'purple.50', shadowColor: 'purple.200' },
    2: { bg: 'green.500', border: 'green.600', bgCard: 'green.50', shadowColor: 'green.200' },
    3: { bg: 'orange.500', border: 'orange.600', bgCard: 'orange.50', shadowColor: 'orange.200' },
    4: { bg: 'red.500', border: 'red.600', bgCard: 'red.50', shadowColor: 'red.200' },
  };

  const colorScheme = nodeColors[Math.min(level, 4)];

  return (
    <Box position="relative" className="hierarchy-node-container">
      {/* Enhanced Coach Node with Professional Design */}
      <Card
        className="coach-card"
        borderRadius="7px"
        boxShadow={level === 0 
          ? `0 15px 35px -10px var(--chakra-colors-${colorScheme.shadowColor}), 0 20px 25px -10px var(--chakra-colors-gray-400)` 
          : `0 8px 25px -5px var(--chakra-colors-${colorScheme.shadowColor}), 0 10px 10px -5px var(--chakra-colors-gray-300)`
        }
        bg={level === 0 ? "linear-gradient(135deg, white 0%, #f8fafc 100%)" : "white"}
        border="3px solid"
        borderColor={coach.isActive ? colorScheme.border : 'gray.400'}
        _hover={{
          transform: level === 0 ? 'translateY(-8px) scale(1.05)' : 'translateY(-4px) scale(1.02)',
          boxShadow: level === 0 
            ? `0 25px 50px -15px var(--chakra-colors-${colorScheme.shadowColor}), 0 25px 35px -15px var(--chakra-colors-gray-500)` 
            : `0 20px 40px -10px var(--chakra-colors-${colorScheme.shadowColor}), 0 15px 20px -5px var(--chakra-colors-gray-400)`,
          borderColor: coach.isActive ? colorScheme.bg : 'gray.500'
        }}
        transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        mb={level === 0 ? 12 : 8}
        minW={level === 0 ? "400px" : "380px"}
        maxW={level === 0 ? "420px" : "400px"}
        opacity={coach.isActive ? 1 : 0.8}
        position="relative"
        overflow="hidden"
      >
        {/* Gradient Background Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="4px"
          bgGradient={`linear(to-r, ${colorScheme.bg}, ${colorScheme.border})`}
        />
        
        {/* Special Crown Indicator for Head Coach */}
        {level === 0 && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            height="6px"
            bgGradient="linear(45deg, #FFD700, #FFA500, #FFD700)"
            backgroundSize="200% 200%"
            animation="shimmer 2s infinite"
          />
        )}
        
        {/* Level Indicator Strip */}
        <Box
          position="absolute"
          top={level === 0 ? "6px" : "0"}
          right="0"
          width="60px"
          height="60px"
          bgGradient={`linear(135deg, ${colorScheme.bg}, ${colorScheme.border})`}
          clipPath="polygon(50% 0%, 100% 0%, 100% 100%)"
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-end"
          pt={2}
          pr={2}
        >
          <VStack spacing={0}>
            <Text fontSize="xs" fontWeight="bold" color="white">
              {level === 0 ? 'H' : `L${level}`}
            </Text>
            {level === 0 && (
              <Text fontSize="8px" fontWeight="bold" color="white" opacity={0.9}>
                HEAD
              </Text>
            )}
          </VStack>
        </Box>

        <CardBody p={6}>
          <VStack spacing={5}>
            {/* Header with Avatar and Level Badge */}
            <HStack spacing={4} w="full" justify="space-between">
              <HStack spacing={4}>
                <Box position="relative">
                  <Avatar
                    name={coach.name}
                    size="xl"
                    bg={coach.isActive ? colorScheme.bg : 'gray.400'}
                    color="white"
                    boxShadow="0 8px 16px -4px rgba(0,0,0,0.3)"
                    border="4px solid white"
                    position="relative"
                    borderRadius="full"
                    _after={{
                      content: '""',
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      borderRadius: 'full',
                      border: '2px solid',
                      borderColor: coach.isActive ? colorScheme.border : 'gray.500',
                    }}
                  />
                  {/* Status Indicator */}
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    w="20px"
                    h="20px"
                    bg={coach.isActive ? 'green.400' : 'red.400'}
                    borderRadius="7px"
                    border="3px solid white"
                    boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  />
                </Box>
                
                <VStack align="start" spacing={2} flex="1">
                  <Text fontWeight="bold" fontSize="lg" color="gray.800" noOfLines={1}>
                    {coach.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {coach.email}
                  </Text>
                  <HStack spacing={2}>
                    <Badge
                      colorScheme={coach.isActive ? 'green' : 'red'}
                      size="sm"
                      borderRadius="7px"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {coach.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {level === 0 && (
                      <Badge
                        bg="linear-gradient(45deg, #FFD700, #FFA500)"
                        color="white"
                        size="sm"
                        borderRadius="7px"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                        boxShadow="0 4px 8px rgba(255, 215, 0, 0.3)"
                        animation="shimmer 2s infinite"
                      >
                        HEAD COACH
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </HStack>
            </HStack>

            {/* Professional Stats Grid */}
            <Box 
              w="full" 
              p={4} 
              bgGradient={`linear(135deg, ${colorScheme.bgCard}, white)`}
              borderRadius="7px"
              border="1px solid"
              borderColor={`${colorScheme.bg}20`}
              boxShadow="inset 0 1px 3px rgba(0,0,0,0.1)"
            >
              <SimpleGrid columns={2} spacing={4}>
                <VStack spacing={2} align="center">
                  <Box
                    w="12px"
                    h="12px"
                    bg={colorScheme.bg}
                    borderRadius="7px"
                    boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  />
                  <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Level</Text>
                  <Text fontSize="lg" fontWeight="bold" color={colorScheme.bg}>
                    {coach.currentLevel || level + 1}
                  </Text>
                </VStack>
                
                <VStack spacing={2} align="center">
                  <Box
                    w="12px"
                    h="12px"
                    bg="green.400"
                    borderRadius="7px"
                    boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  />
                  <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Team Size</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    {calculateTotalTeamSize(coach)}
                  </Text>
                </VStack>
                
                <VStack spacing={2} align="center">
                  <Box
                    w="12px"
                    h="12px"
                    bg="purple.400"
                    borderRadius="7px"
                    boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  />
                  <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Direct</Text>
                  <Text fontSize="lg" fontWeight="bold" color="purple.600">
                    {coach.downline ? coach.downline.length : 0}
                  </Text>
                </VStack>
                
                <VStack spacing={2} align="center">
                  <Box
                    w="12px"
                    h="12px"
                    bg="orange.400"
                    borderRadius="7px"
                    boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  />
                  <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Rank</Text>
                  <Text fontSize="sm" fontWeight="bold" color="orange.600" noOfLines={1}>
                    {coach.teamRankName || 'N/A'}
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>

            {/* Enhanced Performance Section */}
            {coach.performance && (
              <HStack 
                w="full" 
                justify="space-between" 
                p={4} 
                bg="white" 
                borderRadius="7px" 
                border="2px solid" 
                borderColor="gray.100"
                boxShadow="0 4px 12px rgba(0,0,0,0.05)"
              >
                <VStack spacing={2} align="center">
                  <CircularProgress
                    value={coach.performance.performanceScore || 0}
                    size="60px"
                    color={colorScheme.bg}
                    thickness="6px"
                    trackColor="gray.100"
                  >
                    <CircularProgressLabel fontSize="sm" fontWeight="bold" color={colorScheme.bg}>
                      {coach.performance.performanceScore || 0}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text fontSize="xs" color="gray.600" fontWeight="medium" textAlign="center">
                    Performance
                  </Text>
                </VStack>
                
                <VStack spacing={2} align="center">
                  <Box textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" color="green.600">
                      {coach.performance.activityStreak || 0}
                    </Text>
                    <Text fontSize="xs" color="green.600" fontWeight="medium">days</Text>
                  </Box>
                  <Text fontSize="xs" color="gray.600" fontWeight="medium" textAlign="center">
                    Streak
                  </Text>
                </VStack>

                <VStack spacing={2} align="center">
                  <Badge 
                    colorScheme={coach.performance.isActive ? 'green' : 'orange'} 
                    variant="solid"
                    borderRadius="7px"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {coach.performance.isActive ? 'ACTIVE' : 'IDLE'}
                  </Badge>
                  <Text fontSize="xs" color="gray.600" fontWeight="medium" textAlign="center">
                    Status
                  </Text>
                </VStack>
              </HStack>
            )}

            {/* Consolidated Action Menu */}
            <HStack spacing={2} w="full" justify="space-between">
              <Menu>
                <MenuButton
                  as={Button}
                  size="md"
                  variant="outline"
                  colorScheme="blue"
                  rightIcon={<ChevronDownIcon />}
                  flex="1"
                  borderRadius="7px"
                  borderWidth="2px"
                  _hover={{ 
                    bg: 'blue.50', 
                    borderColor: 'blue.400',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  transition="all 0.3s"
                >
                  Actions
                </MenuButton>
                <MenuList borderRadius="7px">
                  <MenuItem icon={<ViewIcon />} onClick={() => onViewCoach(coach)}>
                    View Details
                  </MenuItem>
                  <MenuItem icon={<EditIcon />} onClick={() => onEditCoach(coach)}>
                    Edit Coach
                  </MenuItem>
                </MenuList>
              </Menu>
              {/* Only show expand button for non-root levels */}
              {level > 0 && canExpand && (
                <IconButton
                  size="md"
                  variant="outline"
                  colorScheme={colorScheme.bg.split('.')[0]}
                  icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  onClick={() => setIsExpanded(!isExpanded)}
                  borderRadius="7px"
                  borderWidth="2px"
                  _hover={{ 
                    bg: colorScheme.bgCard,
                    borderColor: colorScheme.border,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${colorScheme.shadowColor}`
                  }}
                  transition="all 0.3s"
                />
              )}
            </HStack>

            {/* Team Overview */}
            {hasChildren && (
              <Box 
                w="full" 
                textAlign="center" 
                p={3} 
                bgGradient={`linear(135deg, ${colorScheme.bgCard}, white)`}
                borderRadius="7px"
                border="1px solid"
                borderColor={`${colorScheme.bg}30`}
              >
                <HStack justify="center" spacing={2}>
                  <Box
                    w="8px"
                    h="8px"
                    bg={isExpanded ? 'green.400' : 'gray.400'}
                    borderRadius="7px"
                    animation={isExpanded ? "pulse 2s infinite" : "none"}
                  />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    {isExpanded ? 'Showing' : 'Hidden'} {coach.downline.length} Direct Members
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Team Member Indicator */}
      {hasChildren && (
        <Box 
          w="full" 
          textAlign="center" 
          p={3} 
          bgGradient={`linear(135deg, ${colorScheme.bgCard}, white)`}
          borderRadius="7px"
          border="1px solid"
          borderColor={`${colorScheme.bg}30`}
          mt={4}
        >
          <HStack justify="center" spacing={2}>
            <Box
              w="8px"
              h="8px"
              bg={colorScheme.bg}
              borderRadius="full"
              animation="pulse 2s infinite"
            />
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {coach.downline.length} Team Member{coach.downline.length !== 1 ? 's' : ''}
            </Text>
            {canExpand && (
              <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={2} py={1}>
                Expandable
              </Badge>
            )}
          </HStack>
        </Box>
      )}
    </Box>
  );
};

// --- ENHANCED HIERARCHY OVERVIEW COMPONENT (FIXED) ---
const HierarchyOverview = ({ 
  hierarchyData, 
  loading, 
  onViewCoach, 
  onEditCoach, 
  levelsToShow,
  nodeSpacing = 6,
  treeHeight = 8,
  setNodeSpacing = () => {},
  setTreeHeight = () => {}
}) => {
  const [viewMode, setViewMode] = useState('tree');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [treeDepth, setTreeDepth] = useState(3); // Control tree depth

  // Process hierarchy data to build proper tree structure from real backend data
  const processedHierarchy = useMemo(() => {
    // If no real data, return null (will show empty state)
    if (!hierarchyData) {
      return null;
    }
    
    // Handle the nested tree structure from backend hierarchy API
    if (hierarchyData.downline && Array.isArray(hierarchyData.downline)) {
      // Backend returns nested structure directly
      return {
        ...hierarchyData,
        downline: hierarchyData.downline,
        downlineHierarchy: hierarchyData.downlineHierarchy || hierarchyData.downline
      };
    }
    
    // Handle flat structure with downlineHierarchy
    if (hierarchyData.downlineHierarchy && Array.isArray(hierarchyData.downlineHierarchy)) {
      // Build tree from flat structure using sponsorId relationships
      const buildTree = (parentId, members, level = 0) => {
        return members
          .filter(m => {
            // For root level, get direct children
            if (level === 0) {
              // Check if member's sponsorId matches parent or if it's level 1
              return (m.sponsorId && m.sponsorId.toString() === parentId.toString()) || 
                     (m.level === 1 || !m.level);
            }
            // For deeper levels, filter by level
            return m.level === level + 1;
          })
          .map(member => ({
            ...member,
            downline: buildTree(member._id, members, level + 1),
            downlineHierarchy: buildTree(member._id, members, level + 1)
          }));
      };
      
      const rootNode = {
        ...hierarchyData,
        downline: buildTree(hierarchyData._id, hierarchyData.downlineHierarchy, 0),
        downlineHierarchy: hierarchyData.downlineHierarchy
      };
      
      return rootNode;
    }
    
    // Return hierarchy data as-is if it has the expected structure
    if (hierarchyData.name || hierarchyData._id) {
      return hierarchyData;
    }
    
    // Return null if no valid data
    return null;
  }, [hierarchyData]);

  // Calculate hierarchy stats - always calculate this to avoid hooks error
  const hierarchyStats = useMemo(() => {
    if (!processedHierarchy) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        maxDepth: 0,
        levelCounts: {}
      };
    }
    
    const calculateStats = (node, level = 0) => {
      let stats = {
        totalMembers: 1,
        activeMembers: node.isActive ? 1 : 0,
        maxDepth: level,
        levelCounts: { [level]: 1 }
      };
      
      if (node.downline) {
        node.downline.forEach(child => {
          const childStats = calculateStats(child, level + 1);
          stats.totalMembers += childStats.totalMembers;
          stats.activeMembers += childStats.activeMembers;
          stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
          
          Object.keys(childStats.levelCounts).forEach(lvl => {
            stats.levelCounts[lvl] = (stats.levelCounts[lvl] || 0) + childStats.levelCounts[lvl];
          });
        });
      }
      
      return stats;
    };
    
    return calculateStats(processedHierarchy);
  }, [processedHierarchy]);

  // Always render the component structure to avoid hooks error
  return (
    <VStack spacing={8} align="stretch">
      {/* Enhanced Hierarchy Controls */}
      <Card bg="white" border="1px" borderColor="gray.200" borderRadius="7px" boxShadow="md">
        <CardBody p={6}>
          <VStack spacing={4}>
            <HStack justify="space-between" w="full" wrap="wrap" spacing={4}>
              <HStack spacing={6}>
                <FormControl maxW="200px">
                  <FormLabel fontSize="sm" mb={2} color="gray.700" fontWeight="bold">View Mode</FormLabel>
                  <ButtonGroup size="md" isAttached variant="outline" colorScheme="blue">
                    <Button
                      bg={viewMode === 'tree' ? 'blue.500' : 'white'}
                      color={viewMode === 'tree' ? 'white' : 'blue.500'}
                      onClick={() => setViewMode('tree')}
                      leftIcon={<Box as={FiBarChart2} />}
                      _hover={{ bg: viewMode === 'tree' ? 'blue.600' : 'blue.50' }}
                    >
                      Tree View
                    </Button>
                    <Button
                      bg={viewMode === 'table' ? 'blue.500' : 'white'}
                      color={viewMode === 'table' ? 'white' : 'blue.500'}
                      onClick={() => setViewMode('table')}
                      leftIcon={<Box as={FiFileText} />}
                      _hover={{ bg: viewMode === 'table' ? 'blue.600' : 'blue.50' }}
                    >
                      Table View
                    </Button>
                  </ButtonGroup>
                </FormControl>

                <FormControl maxW="180px">
                  <FormLabel fontSize="sm" mb={2} color="gray.700" fontWeight="bold">Filter Level</FormLabel>
                  <Select
                    size="md"
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500' }}
                  >
                    <option value="all">🌍 All Levels</option>
                    <option value="1">1️⃣ Level 1 Only</option>
                    <option value="2">2️⃣ Up to Level 2</option>
                    <option value="3">3️⃣ Up to Level 3</option>
                    <option value="4">4️⃣ Up to Level 4</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <InputGroup maxW="300px">
                  <InputLeftElement>
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    size="md"
                    placeholder="Search coaches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500' }}
                  />
                </InputGroup>
              </HStack>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Show loading state */}
      {loading && (
        <VStack spacing={6}>
          <Skeleton height="150px" borderRadius="7px" />
          <HStack spacing={4} overflowX="auto">
            <Skeleton height="300px" width="350px" borderRadius="7px" />
            <Skeleton height="300px" width="350px" borderRadius="7px" />
            <Skeleton height="300px" width="350px" borderRadius="7px" />
          </HStack>
        </VStack>
      )}

      {/* Show no data state */}
      {!loading && !processedHierarchy && (
        <Card bg="linear-gradient(135deg, rgba(219, 234, 254, 0.5), rgba(233, 213, 255, 0.5))" borderRadius="7px" border="2px dashed" borderColor="blue.300">
          <CardBody py={16}>
            <Center>
              <VStack spacing={6}>
                <Box
                  w="120px"
                  h="120px"
                  bg="linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="blue.500"
                  boxShadow="lg"
                >
                  <Box as={FiUsers} size="48px" />
                </Box>
                <VStack spacing={3}>
                  <Heading size="lg" color="gray.700" textAlign="center">
                    Build Your Team Hierarchy
                  </Heading>
                  <Text color="gray.600" textAlign="center" fontSize="md" maxW="400px">
                    Start building your MLM team structure by adding coaches. You'll be the head coach, 
                    and all team members will be organized under their respective sponsors.
                  </Text>
                </VStack>
                <Button
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<AddIcon />}
                  onClick={() => {/* This should open add modal */}}
                  borderRadius="full"
                  px={8}
                  py={6}
                  fontSize="md"
                  fontWeight="bold"
                  boxShadow="lg"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl'
                  }}
                >
                  Add Your First Team Member
                </Button>
              </VStack>
            </Center>
          </CardBody>
        </Card>
      )}

      {/* Show hierarchy data */}
      {!loading && processedHierarchy && (
        <>
          {/* Enhanced Hierarchy Stats */}
          <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
            <StatsCard
              title="Total Team"
              value={hierarchyStats.totalMembers}
              icon={<Box as={FiUsers} size="24px" />}
              color="blue"
              description="All members"
            />
            <StatsCard
              title="Active Members"
              value={hierarchyStats.activeMembers}
              icon={<CheckCircleIcon />}
              color="green"
              description="Currently active"
            />
            <StatsCard
              title="Direct Reports"
              value={processedHierarchy?.downline ? processedHierarchy.downline.length : 0}
              icon={<Box as={FiUser} size="24px" />}
              color="purple"
              description="Level 1"
            />
            <StatsCard
              title="Max Depth"
              value={hierarchyStats.maxDepth + 1}
              icon={<Box as={FiTrendingUp} size="24px" />}
              color="orange"
              description="Hierarchy levels"
            />
            <StatsCard
              title="Active Rate"
              value={`${Math.round((hierarchyStats.activeMembers / hierarchyStats.totalMembers) * 100)}%`}
              icon={<Box as={FiTarget} size="24px" />}
              color="red"
              description="Team activity"
            />
          </SimpleGrid>

          {/* Main Hierarchy Display */}
          <Card 
            borderRadius="7px" 
            boxShadow="xl" 
            overflow="hidden" 
            border="1px" 
            borderColor="gray.200"
            bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            sx={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%,rgb(16, 56, 109) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, #e2e8f0 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          >
            <CardHeader 
              bg="white" 
              color="gray.800" 
              py={6}
            >
              <HStack justify="space-between" align="center">
                <HStack align="center" spacing={3}>
                  <Heading size="lg" color="gray.800">
                    {viewMode === 'tree' ? 'Team Hierarchy Tree' : 'Team Structure Table'}
                  </Heading>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="md" color="gray.600">
                      {processedHierarchy?.name || 'Your'} Complete MLM Network Structure
                    </Text>
                  </VStack>
                </HStack>
                <Badge colorScheme="blue" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm">
                  {hierarchyStats.totalMembers} Total Members
                </Badge>
              </HStack>
            </CardHeader>
            
            <CardBody p={8}>
              {viewMode === 'tree' ? (
                <VStack spacing={6} align="stretch">
                  {/* Tree Controls with Smart Sliders */}
                  <Card bg="gray.50" border="1px" borderColor="gray.200" borderRadius="7px">
                    <CardBody p={4}>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
                          <HStack spacing={4}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                              🌳 Tree Layout Controls:
                            </Text>
                            <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                              Professional Layout
                            </Badge>
                          </HStack>
                        </HStack>
                        
                        {/* Tree Depth Slider - Always visible */}
                        <FormControl w="full">
                          <FormLabel fontSize="sm" mb={2} color="gray.700" fontWeight="bold">
                            Tree Depth Control
                          </FormLabel>
                          <HStack spacing={4} align="center">
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">Level 1</Text>
                            <Slider 
                              value={treeDepth} 
                              min={1} 
                              max={5} 
                              step={1}
                              onChange={(val) => setTreeDepth(val)}
                              size="lg"
                              colorScheme="blue"
                              flex={1}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">Level 5</Text>
                            <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
                              {treeDepth} Levels
                            </Badge>
                          </HStack>
                          <Text fontSize="xs" color="gray.600" mt={1}>
                            Control how many levels of the hierarchy tree to display
                          </Text>
                        </FormControl>
                        
                        {/* Additional Layout Controls */}
                        {/* Tree Structure Info */}
                        <Box 
                          p={3} 
                          bg="blue.50" 
                          borderRadius="7px" 
                          border="1px solid" 
                          borderColor="blue.200"
                          mb={4}
                        >
                          <VStack spacing={3}>
                            {/* Connection Lines Legend */}
                            <Box 
                              p={3} 
                              bg="purple.50" 
                              borderRadius="7px" 
                              border="1px solid" 
                              borderColor="purple.200"
                              w="full"
                            >
                              <VStack spacing={2}>
                                <Text fontSize="sm" color="purple.700" fontWeight="bold" textAlign="center">
                                  🔗 Connection Lines Guide
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} w="full">
                                  <HStack spacing={2} justify="center">
                                    <Box w="3px" h="16px" bg="blue.500" borderRadius="full" />
                                    <Text fontSize="xs" color="purple.700" fontWeight="medium">
                                      Head Coach → Level 1
                                    </Text>
                                  </HStack>
                                  <HStack spacing={2} justify="center">
                                    <Box w="3px" h="16px" bg="purple.500" borderRadius="full" />
                                    <Text fontSize="xs" color="purple.700" fontWeight="medium">
                                      Level 1 → Level 2
                                    </Text>
                                  </HStack>
                                  <HStack spacing={2} justify="center">
                                    <Box w="3px" h="16px" bg="green.500" borderRadius="full" />
                                    <Text fontSize="xs" color="purple.700" fontWeight="medium">
                                      Level 2 → Level 3
                                    </Text>
                                  </HStack>
                                </SimpleGrid>
                              </VStack>
                            </Box>
                            
                            <HStack spacing={3} justify="center">
                              <Box w="3px" h="20px" bg="blue.500" borderRadius="full" />
                              <Text fontSize="sm" color="blue.700" fontWeight="medium">
                                Level 1: {processedHierarchy?.downline ? processedHierarchy.downline.length : 0} Direct Members
                              </Text>
                              {treeDepth > 1 && (
                                <>
                                  <Box w="3px" h="20px" bg="purple.500" borderRadius="full" />
                                  <Text fontSize="sm" color="purple.700" fontWeight="medium">
                                    Level 2: {processedHierarchy?.downline ? 
                                      processedHierarchy.downline.reduce((total, child) => 
                                        total + (child.downline ? child.downline.length : 0), 0
                                      ) : 0
                                    } Members
                                  </Text>
                                </>
                              )}
                              {treeDepth > 2 && (
                                <>
                                  <Box w="3px" h="20px" bg="green.500" borderRadius="full" />
                                  <Text fontSize="sm" color="green.700" fontWeight="medium">
                                    Level 3: {processedHierarchy?.downline ? 
                                      processedHierarchy.downline.reduce((total, child) => 
                                        total + (child.downline ? 
                                          child.downline.reduce((subTotal, grandChild) => 
                                            subTotal + (grandChild.downline ? grandChild.downline.length : 0), 0
                                          ) : 0
                                        ), 0
                                      ) : 0
                                    } Members
                                  </Text>
                                </>
                              )}
                            </HStack>
                          </VStack>
                        </Box>
                        
                        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                          {/* Node Spacing Slider */}
                          <FormControl w="200px" display={processedHierarchy?.downline && processedHierarchy.downline.length > 3 ? 'block' : 'none'}>
                            <FormLabel fontSize="xs" mb={1} color="gray.600">Node Spacing</FormLabel>
                            <HStack spacing={2}>
                              <Text fontSize="xs" color="gray.500">Tight</Text>
                              <Slider 
                                defaultValue={6} 
                                min={2} 
                                max={12} 
                                step={1}
                                onChange={(val) => setNodeSpacing(val)}
                                size="sm"
                                colorScheme="blue"
                              >
                                <SliderTrack>
                                  <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                              </Slider>
                              <Text fontSize="xs" color="gray.500">Wide</Text>
                            </HStack>
                          </FormControl>
                          
                          {/* Tree Height Slider */}
                          <FormControl w="200px" display={processedHierarchy?.downline && processedHierarchy.downline.length > 2 ? 'block' : 'none'}>
                            <FormLabel fontSize="xs" mb={1} color="gray.600">Tree Height</FormLabel>
                            <HStack spacing={2}>
                              <Text fontSize="xs" color="gray.500">Compact</Text>
                              <Slider 
                                defaultValue={8} 
                                min={4} 
                                max={16} 
                                step={1}
                                onChange={(val) => setTreeHeight(val)}
                                size="sm"
                                colorScheme="green"
                              >
                                <SliderTrack>
                                  <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                              </Slider>
                              <Text fontSize="xs" color="gray.500">Spacious</Text>
                            </HStack>
                          </FormControl>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Tree Container with Smart Overflow */}
                  <Box 
                    overflowX="auto" 
                    overflowY="visible" 
                    minH="600px" 
                    pb={8}
                    sx={{
                      '&::-webkit-scrollbar': {
                        height: '8px',
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'gray.100',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'blue.400',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: 'blue.500',
                      },
                    }}
                  >
                                      <Box 
                    minW="fit-content" 
                    p={6}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    className="tree-container"
                    sx={{
                      '--node-spacing': `${nodeSpacing}rem`,
                      '--tree-height': `${treeHeight}rem`,
                    }}
                  >
                                        {/* Root Node - Top Center */}
                    <Box textAlign="center" mb={`var(--tree-height)`}>
                      {/* Head Coach Title */}
                      <VStack spacing={3} mb={6}>
                        <Box
                          w="80px"
                          h="80px"
                          bgGradient="linear(135deg, #3b82f6, #8b5cf6)"
                          borderRadius="7px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="xl"
                          border="4px solid white"
                          className="head-coach-icon"
                        >
                          <Text fontSize="32px" color="white">👑</Text>
                        </Box>
                        <VStack spacing={1}>
                          <Heading size="md" color="blue.800">
                            Head Coach
                          </Heading>
                          <Text fontSize="sm" color="blue.600" fontWeight="medium">
                            Network Leader
                          </Text>
                        </VStack>
                      </VStack>
                      
                      <HierarchyNode
                        coach={processedHierarchy}
                        level={0}
                        onViewCoach={onViewCoach}
                        onEditCoach={onEditCoach}
                        maxLevels={treeDepth}
                      />
                    </Box>
                    
                    {/* Dynamic Tree Levels */}
                    {processedHierarchy.downline && processedHierarchy.downline.length > 0 && (
                      <Box w="full">
                                                {/* Level 1 - Direct Children */}
                        <Box mb={`var(--tree-height)`}>
                          {/* Connection Lines from Root to Level 1 */}
                          <Box position="relative" height={`calc(var(--tree-height) - 2rem)`} mb={4}>
                            <Center>
                              <Box position="relative" width="100%">
                                {/* Main vertical line from root */}
                                <Box
                                  position="absolute"
                                  left="50%"
                                  top="0"
                                  width="4px"
                                  height="40px"
                                  bgGradient="linear(to-b, blue.500, blue.400)"
                                  borderRadius="7px"
                                  transform="translateX(-50%)"
                                  zIndex={1}
                                  className="connection-line-root"
                                  _hover={{
                                    width: "6px",
                                    boxShadow: "0 0 10px rgba(59, 130, 246, 0.6)",
                                    transition: "all 0.3s ease"
                                  }}
                                  transition="all 0.3s ease"
                                />
                                
                                {/* Horizontal distribution line */}
                                {(processedHierarchy?.downline?.length || 0) > 1 && (
                                  <Box
                                    position="absolute"
                                    top="40px"
                                    left="25%"
                                    right="25%"
                                    height="4px"
                                    bgGradient="linear(to-r, blue.400, purple.500, blue.400)"
                                    borderRadius="7px"
                                    zIndex={1}
                                    className="connection-line-horizontal"
                                  />
                                )}
                                
                                {/* Individual vertical lines to each child */}
                                {(processedHierarchy?.downline || []).map((_, index) => {
                                  const totalChildren = processedHierarchy?.downline?.length || 0;
                                  const childPosition = (index - (totalChildren - 1) / 2) * (100 / Math.max(totalChildren - 1, 1));
                                  return (
                                    <Box
                                      key={index}
                                      position="absolute"
                                      top="40px"
                                      left={`${50 + childPosition}%`}
                                      width="4px"
                                      height="20px"
                                      bgGradient="linear(to-b, purple.500, purple.400)"
                                      borderRadius="7px"
                                      transform="translateX(-50%)"
                                      zIndex={1}
                                      className="connection-line-level1"
                                      style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                                    />
                                  );
                                })}
                              </Box>
                            </Center>
                          </Box>
                          
                          {/* Level 1 Children in Horizontal Row */}
                          <SimpleGrid 
                            columns={{ base: 1, md: processedHierarchy?.downline?.length || 1 }} 
                            spacing={`var(--node-spacing)`}
                            justifyItems="center"
                            w="full"
                          >
                            {(processedHierarchy?.downline || []).map((childCoach, index) => (
                              <Box key={childCoach._id || index} position="relative">
                                {/* Connection indicator above each child */}
                                <Box
                                  position="absolute"
                                  top="-20px"
                                  left="50%"
                                  transform="translateX(-50%)"
                                  zIndex={2}
                                >
                                  <Box
                                    w="12px"
                                    h="12px"
                                    bg="purple.500"
                                    borderRadius="7px"
                                    border="2px solid white"
                                    boxShadow="0 0 0 2px purple.500"
                                    className="connection-point-level1"
                                    style={{ animationDelay: `${1.3 + index * 0.1}s` }}
                                  />
                                </Box>
                                
                                <HierarchyNode
                                  coach={childCoach}
                                  level={1}
                                  onViewCoach={onViewCoach}
                                  onEditCoach={onEditCoach}
                                  maxLevels={treeDepth}
                                />
                              </Box>
                            ))}
                          </SimpleGrid>
                        </Box>
                        
                                                                         {/* Level 2 - Grandchildren (if depth > 1) */}
                        {treeDepth > 1 && (
                          <Box mb={`var(--tree-height)`}>
                            {/* Connection Lines from Level 1 to Level 2 */}
                            <Box position="relative" height={`calc(var(--tree-height) - 2rem)`} mb={4}>
                              <Center>
                                <Box position="relative" width="100%">
                                  {/* Main horizontal distribution line */}
                                  <Box
                                    position="absolute"
                                    left="10%"
                                    right="10%"
                                    top="0"
                                    height="4px"
                                    bgGradient="linear(to-r, purple.400, green.500, purple.400)"
                                    borderRadius="7px"
                                    zIndex={1}
                                    className="connection-line-horizontal"
                                    style={{ animationDelay: "1.4s" }}
                                  />
                                  
                                  {/* Individual connection points */}
                                  {processedHierarchy?.downline?.map((childCoach, childIndex) => {
                                    if (childCoach.downline && childCoach.downline.length > 0) {
                                      return childCoach.downline.map((_, grandIndex) => {
                                        const totalGrandChildren = (processedHierarchy?.downline || []).reduce((total, child) => 
                                          total + (child.downline ? child.downline.length : 0), 0
                                        );
                                        const grandChildPosition = (grandIndex + childIndex * 2) * (80 / Math.max(totalGrandChildren - 1, 1));
                                                                                  return (
                                            <Box
                                              key={`connection-${childIndex}-${grandIndex}`}
                                              position="absolute"
                                              top="0"
                                              left={`${10 + grandChildPosition}%`}
                                              width="8px"
                                              height="8px"
                                              bg="green.500"
                                              borderRadius="7px"
                                              border="2px solid white"
                                              boxShadow="0 0 0 2px green.500"
                                              zIndex={2}
                                              className="connection-point-level2"
                                              style={{ animationDelay: `${1.6 + grandIndex * 0.1}s` }}
                                            />
                                          );
                                      });
                                    }
                                    return null;
                                  })}
                                </Box>
                              </Center>
                            </Box>
                            
                            {/* Level 2 Children in Horizontal Row */}
                            <Box 
                              w="full" 
                              overflowX="auto"
                              sx={{
                                '&::-webkit-scrollbar': { height: '8px' },
                                '&::-webkit-scrollbar-track': { background: 'gray.100', borderRadius: '4px' },
                                '&::-webkit-scrollbar-thumb': { background: 'green.400', borderRadius: '4px' }
                              }}
                            >
                              <HStack 
                                spacing={`var(--node-spacing)`} 
                                justify="center" 
                                minW="max-content"
                                px={4}
                              >
                                {processedHierarchy.downline.map((childCoach, childIndex) => (
                                  childCoach.downline && childCoach.downline.length > 0 ? (
                                    childCoach.downline.map((grandChildCoach, grandIndex) => (
                                      <Box key={`${childIndex}-${grandIndex}`} position="relative">
                                        {/* Connection line from Level 1 to Level 2 */}
                                        <Tooltip 
                                          label={`${childCoach.name} → ${grandChildCoach.name}`}
                                          placement="top"
                                          hasArrow
                                          bg="purple.500"
                                          color="white"
                                        >
                                          <Box
                                            position="absolute"
                                            bottom="100%"
                                            left="50%"
                                            width="4px"
                                            height="30px"
                                            bgGradient="linear(to-b, purple.500, green.500)"
                                            borderRadius="7px"
                                            transform="translateX(-50%)"
                                            zIndex={1}
                                            className="connection-line-level2"
                                            style={{ animationDelay: `${1.5 + grandIndex * 0.1}s` }}
                                            _hover={{
                                              width: "6px",
                                              boxShadow: "0 0 10px rgba(147, 51, 234, 0.6)",
                                              transition: "all 0.3s ease"
                                            }}
                                            transition="all 0.3s ease"
                                            cursor="pointer"
                                          />
                                        </Tooltip>
                                        
                                        {/* Connection indicator above Level 2 */}
                                        <Box
                                          position="absolute"
                                          top="-20px"
                                          left="50%"
                                          transform="translateX(-50%)"
                                          zIndex={2}
                                        >
                                          <Box
                                            w="10px"
                                            h="10px"
                                            bg="green.500"
                                            borderRadius="7px"
                                            border="2px solid white"
                                            boxShadow="0 0 0 2px green.500"
                                            className="connection-point-level2"
                                            style={{ animationDelay: `${1.6 + grandIndex * 0.1}s` }}
                                          />
                                        </Box>
                                        
                                        <HierarchyNode
                                          coach={grandChildCoach}
                                          level={2}
                                          onViewCoach={onViewCoach}
                                          onEditCoach={onEditCoach}
                                          maxLevels={treeDepth}
                                        />
                                      </Box>
                                    ))
                                  ) : (
                                    <Box key={`empty-${childIndex}`} w="200px" h="100px" />
                                  )
                                ))}
                              </HStack>
                            </Box>
                          </Box>
                        )}
                        
                                                                         {/* Level 3 - Great Grandchildren (if depth > 2) */}
                        {treeDepth > 2 && (
                          <Box mb={`var(--tree-height)`}>
                            {/* Connection Lines from Level 2 to Level 3 */}
                            <Box position="relative" height={`calc(var(--tree-height) - 2rem)`} mb={4}>
                              <Center>
                                <Box position="relative" width="100%">
                                  {/* Main horizontal distribution line */}
                                  <Box
                                    position="absolute"
                                    left="15%"
                                    right="15%"
                                    top="0"
                                    height="4px"
                                    bgGradient="linear(to-r, green.400, orange.500, green.400)"
                                    borderRadius="7px"
                                    zIndex={1}
                                    className="connection-line-horizontal"
                                    style={{ animationDelay: "1.7s" }}
                                  />
                                  
                                  {/* Individual connection points for Level 3 */}
                                  {(processedHierarchy?.downline || []).map((childCoach, childIndex) => {
                                    if (childCoach.downline && childCoach.downline.length > 0) {
                                      return childCoach.downline.map((grandChildCoach, grandIndex) => {
                                        if (grandChildCoach.downline && grandChildCoach.downline.length > 0) {
                                          return grandChildCoach.downline.map((_, greatGrandIndex) => {
                                            const totalGreatGrandChildren = (processedHierarchy?.downline || []).reduce((total, child) => 
                                              total + (child.downline ? 
                                                child.downline.reduce((subTotal, grandChild) => 
                                                  subTotal + (grandChild.downline ? grandChild.downline.length : 0), 0
                                                ) : 0
                                              ), 0
                                            );
                                            const greatGrandChildPosition = (greatGrandIndex + grandIndex * 2 + childIndex * 3) * (70 / Math.max(totalGreatGrandChildren - 1, 1));
                                            return (
                                              <Box
                                                key={`connection-l3-${childIndex}-${grandIndex}-${greatGrandIndex}`}
                                                position="absolute"
                                                top="0"
                                                left={`${15 + greatGrandChildPosition}%`}
                                                width="8px"
                                                height="8px"
                                                bg="orange.500"
                                                borderRadius="7px"
                                                border="2px solid white"
                                                boxShadow="0 0 0 2px orange.500"
                                                zIndex={2}
                                                className="connection-point-level3"
                                                style={{ animationDelay: `${1.9 + greatGrandIndex * 0.1}s` }}
                                              />
                                            );
                                          });
                                        }
                                        return null;
                                      });
                                    }
                                    return null;
                                  })}
                                </Box>
                              </Center>
                            </Box>
                            
                            {/* Level 3 Children in Horizontal Row */}
                            <Box 
                              w="full" 
                              overflowX="auto"
                              sx={{
                                '&::-webkit-scrollbar': { height: '8px' },
                                '&::-webkit-scrollbar-track': { background: 'gray.100', borderRadius: '4px' },
                                '&::-webkit-scrollbar-thumb': { background: 'orange.400', borderRadius: '4px' }
                              }}
                            >
                              <HStack 
                                spacing={`var(--node-spacing)`} 
                                justify="center" 
                                minW="max-content"
                                px={4}
                              >
                                {(processedHierarchy?.downline || []).map((childCoach, childIndex) => (
                                  childCoach.downline && childCoach.downline.length > 0 ? (
                                    childCoach.downline.map((grandChildCoach, grandIndex) => (
                                      grandChildCoach.downline && grandChildCoach.downline.length > 0 ? (
                                        grandChildCoach.downline.map((greatGrandChildCoach, greatGrandIndex) => (
                                          <Box key={`${childIndex}-${grandIndex}-${greatGrandIndex}`} position="relative">
                                            {/* Connection line from Level 2 to Level 3 */}
                                            <Box
                                              position="absolute"
                                              bottom="100%"
                                              left="50%"
                                              width="4px"
                                              height="30px"
                                              bgGradient="linear(to-b, green.500, orange.500)"
                                              borderRadius="7px"
                                              transform="translateX(-50%)"
                                              zIndex={1}
                                              className="connection-line-level3"
                                              style={{ animationDelay: `${1.8 + greatGrandIndex * 0.1}s` }}
                                            />
                                            
                                            {/* Connection indicator above Level 3 */}
                                            <Box
                                              position="absolute"
                                              top="-20px"
                                              left="50%"
                                              transform="translateX(-50%)"
                                              zIndex={2}
                                            >
                                              <Box
                                                w="8px"
                                                h="8px"
                                                bg="orange.500"
                                                borderRadius="7px"
                                                border="2px solid white"
                                                boxShadow="0 0 0 2px orange.500"
                                                className="connection-point-level3"
                                                style={{ animationDelay: `${1.9 + greatGrandIndex * 0.1}s` }}
                                              />
                                            </Box>
                                            
                                            <HierarchyNode
                                              coach={greatGrandChildCoach}
                                              level={3}
                                              onViewCoach={onViewCoach}
                                              onEditCoach={onEditCoach}
                                              maxLevels={treeDepth}
                                            />
                                          </Box>
                                        ))
                                      ) : (
                                        <Box key={`empty-l2-${childIndex}-${grandIndex}`} w="200px" h="100px" />
                                      )
                                    ))
                                  ) : (
                                    <Box key={`empty-l1-${childIndex}`} w="200px" h="100px" />
                                  )
                                ))}
                              </HStack>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  </Box>
                </VStack>
              ) : (
                <TableView 
                  hierarchyData={processedHierarchy} 
                  onViewCoach={onViewCoach}
                  onEditCoach={onEditCoach}
                  searchTerm={searchTerm}
                />
              )}
            </CardBody>
          </Card>

          {/* Enhanced Hierarchy Legend */}
          <Card bg="linear-gradient(135deg, rgba(219, 234, 254, 0.5), rgba(233, 213, 255, 0.5))" border="1px" borderColor="blue.200" borderRadius="7px" boxShadow="md">
            <CardBody p={6}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center">
                  <Heading size="md" color="blue.800">
                    Hierarchy Legend & Guide
                  </Heading>
                  <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                    MLM Structure Guide
                  </Badge>
                </HStack>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="start" spacing={3}>
                    <Text fontWeight="bold" color="blue.700" fontSize="sm">
                      Level Color Coding:
                    </Text>
                    <SimpleGrid columns={1} spacing={2}>
                      <HStack spacing={3}>
                        <Box w="16px" h="16px" bg="blue.500" borderRadius="full" />
                        <Text fontSize="sm" color="blue.700">Head Coach (You) - Level 0</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Box w="16px" h="16px" bg="purple.500" borderRadius="full" />
                        <Text fontSize="sm" color="blue.700">Direct Team - Level 1</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Box w="16px" h="16px" bg="green.500" borderRadius="full" />
                        <Text fontSize="sm" color="blue.700">Second Level - Level 2</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Box w="16px" h="16px" bg="orange.500" borderRadius="full" />
                        <Text fontSize="sm" color="blue.700">Third Level - Level 3</Text>
                      </HStack>
                      <HStack spacing={3}>
                        <Box w="16px" h="16px" bg="red.500" borderRadius="full" />
                        <Text fontSize="sm" color="blue.700">Level 4 and beyond</Text>
                      </HStack>
                    </SimpleGrid>
                  </VStack>

                  <VStack align="start" spacing={3}>
                    <Text fontWeight="bold" color="blue.700" fontSize="sm">
                      Understanding the Structure:
                    </Text>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color="blue.600">
                        • <strong>Direct:</strong> Coaches directly sponsored by this member
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        • <strong>Team Size:</strong> Total members in downline (all levels)
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        • <strong>Performance:</strong> Activity score and streak days
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        • <strong>Active:</strong> Currently participating members
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        • <strong>Lines:</strong> Show sponsor-downline relationships
                      </Text>
                    </VStack>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </>
      )}
    </VStack>
  );
};

// --- TABLE VIEW COMPONENT ---
const TableView = ({ hierarchyData, onViewCoach, onEditCoach, searchTerm }) => {
  const flattenHierarchy = (node, level = 0, parentName = '', sponsorName = '') => {
    let result = [{
      ...node,
      level,
      parentName,
      sponsorName,
      indentedName: '  '.repeat(level) + node.name
    }];
    
    if (node.downline) {
      node.downline.forEach(child => {
        result = result.concat(flattenHierarchy(child, level + 1, node.name, node.name));
      });
    }
    
    return result;
  };

  const flatData = flattenHierarchy(hierarchyData);
  const filteredData = flatData.filter(coach =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.sponsorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TableContainer>
      <Table variant="simple" size="md">
        <Thead>
          <Tr bg="gray.50">
            <Th py={4} color="gray.700" fontWeight="bold">COACH HIERARCHY</Th>
            <Th py={4} color="gray.700" fontWeight="bold">LEVEL</Th>
            <Th py={4} color="gray.700" fontWeight="bold">SPONSOR</Th>
            <Th py={4} color="gray.700" fontWeight="bold">STATUS</Th>
            <Th py={4} color="gray.700" fontWeight="bold">PERFORMANCE</Th>
            <Th py={4} color="gray.700" fontWeight="bold">TEAM</Th>
            <Th py={4} color="gray.700" fontWeight="bold">ACTIONS</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((coach, index) => {
            const levelColors = ['blue', 'purple', 'green', 'orange', 'red'];
            const colorScheme = levelColors[Math.min(coach.level, 4)];
            
            return (
              <Tr key={coach._id || index} _hover={{ bg: 'gray.50' }} borderBottom="1px" borderColor="gray.100">
                <Td py={4}>
                  <HStack spacing={3}>
                    <Box w={`${coach.level * 24}px`} />
                    {coach.level > 0 && (
                      <Box w="16px" h="2px" bg={`${colorScheme}.300`} />
                    )}
                    <Avatar 
                      size="sm" 
                      name={coach.name} 
                      bg={`${colorScheme}.500`}
                      color="white"
                    />
                    <VStack align="start" spacing={1}>
                      <HStack spacing={2}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.800">
                          {coach.name}
                        </Text>
                        {coach.level === 0 && (
                          <Badge colorScheme="blue" size="sm" borderRadius="full">
                            YOU
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {coach.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td py={4}>
                  <Badge colorScheme={colorScheme} size="md" borderRadius="full" px={3} py={1}>
                    {coach.level === 0 ? 'HEAD' : `L${coach.level}`}
                  </Badge>
                </Td>
                <Td py={4}>
                  <Text fontSize="sm" color="gray.700">
                    {coach.sponsorName || (coach.level === 0 ? 'Self' : 'N/A')}
                  </Text>
                </Td>
                <Td py={4}>
                  <VStack align="start" spacing={1}>
                    <Badge 
                      colorScheme={coach.isActive ? 'green' : 'red'} 
                      size="sm"
                      borderRadius="7px"
                    >
                      {coach.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {coach.teamRankName || 'No rank'}
                    </Text>
                  </VStack>
                </Td>
                <Td py={4}>
                  {coach.performance ? (
                    <HStack spacing={3}>
                      <CircularProgress
                        value={coach.performance.performanceScore || 0}
                        size="35px"
                        color={`${colorScheme}.400`}
                        thickness="6px"
                      >
                        <CircularProgressLabel fontSize="10px" fontWeight="bold">
                          {coach.performance.performanceScore || 0}
                        </CircularProgressLabel>
                      </CircularProgress>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.700">
                          {coach.performance.performanceScore || 0}%
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {coach.performance.activityStreak || 0}d streak
                        </Text>
                      </VStack>
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.400">No data</Text>
                  )}
                </Td>
                <Td py={4}>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="bold" color={`${colorScheme}.600`}>
                      {coach.downline ? coach.downline.length : 0} Direct
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {calculateTotalTeamSize(coach)} Total
                    </Text>
                  </VStack>
                </Td>
                <Td py={4}>
                  <ButtonGroup size="sm" spacing={1}>
                    <Tooltip label="View Details">
                      <IconButton
                        icon={<ViewIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onViewCoach(coach)}
                        _hover={{ bg: 'blue.100' }}
                      />
                    </Tooltip>
                    <Tooltip label="Edit Coach">
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="orange"
                        variant="ghost"
                        onClick={() => onEditCoach(coach)}
                        _hover={{ bg: 'orange.100' }}
                      />
                    </Tooltip>
                  </ButtonGroup>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

// --- BEAUTIFUL CONFIRMATION MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="7px">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box 
            bg="orange.50" 
            border="1px" 
            borderColor="orange.200" 
            borderRadius="7px" 
            p={4}
          >
            <HStack spacing={3}>
              <Box color="orange.500" fontSize="xl">⚠️</Box>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold" color="orange.800">
                  Are you sure?
                </Text>
                <Text color="orange.700" fontSize="sm">
                  {message}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            bg="red.600" 
            color="white" 
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Deleting..."
            _hover={{ bg: 'red.700' }}
            _active={{ bg: 'red.800' }}
          >
            Confirm Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// --- MAIN MLM DASHBOARD COMPONENT ---
const MLMDashboard = () => {
  const authState = useSelector(state => state.auth);
  const token = getToken(authState);
  const coachId = getCoachId(authState);
  const user = authState?.user;
  const toast = useCustomToast();
  
  // Enhanced authentication with fallback
  const [effectiveAuth, setEffectiveAuth] = useState({ coachId, token, user });
  
  // Debug authentication state and set fallback
  useEffect(() => {
    console.log('🔍 Authentication Debug:');
    console.log('  - Redux authState:', authState);
    console.log('  - Redux coachId:', coachId);
    console.log('  - Redux token:', token ? 'Present' : 'Missing');
    console.log('  - Redux user:', user ? 'Present' : 'Missing');
    
    // Check localStorage as fallback
    const localAuth = getLocalStorageAuth();
    console.log('  - localStorage auth:', localAuth);
    
    // Use Redux data if available, otherwise fallback to localStorage
    const finalCoachId = coachId || localAuth.coachId;
    const finalToken = token || localAuth.token;
    const finalUser = user || localAuth.user;
    
    console.log('  - Final coachId:', finalCoachId);
    console.log('  - Final token:', finalToken ? 'Present' : 'Missing');
    console.log('  - Final user:', finalUser ? 'Present' : 'Missing');
    
    setEffectiveAuth({
      coachId: finalCoachId,
      token: finalToken,
      user: finalUser
    });
    
    if (!finalCoachId || !finalToken) {
      console.error('❌ Authentication data not available!');
      toast('Authentication data not available. Please log in again.', 'warning');
    } else {
      console.log('✅ Authentication data available');
    }
  }, [authState, coachId, token, user, toast]);
  
  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [performanceSubTab, setPerformanceSubTab] = useState(0); // Sub-tab for performance metrics
  const [loading, setLoading] = useState(false);
  const [downlineData, setDownlineData] = useState([]);
  const [hierarchyData, setHierarchyData] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [reports, setReports] = useState([]);
  const [hierarchyLevels, setHierarchyLevels] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [commissionSummary, setCommissionSummary] = useState({ totalEarned: 0, pendingAmount: 0, totalCommissions: 0 });
  const [adminRequests, setAdminRequests] = useState([]);
  const [currentSponsor, setCurrentSponsor] = useState(null);
  const [showAdminRequestForm, setShowAdminRequestForm] = useState(false);
  const [sponsorSearchResults, setSponsorSearchResults] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [requestForm, setRequestForm] = useState({
    requestType: 'sponsor_change',
    requestedSponsorId: '',
    reason: ''
  });
  const [coachPerformance, setCoachPerformance] = useState(null);
  const [salesPerformance, setSalesPerformance] = useState(null);
  const [clientPerformance, setClientPerformance] = useState(null);
  const [leadPerformance, setLeadPerformance] = useState(null);

  // Calculate hierarchy stats for team performance fallback
  const hierarchyStats = useMemo(() => {
    if (!hierarchyData) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        maxDepth: 0,
        levelCounts: {}
      };
    }
    
    const calculateStats = (node, level = 0) => {
      let stats = {
        totalMembers: 1,
        activeMembers: node.isActive ? 1 : 0,
        maxDepth: level,
        levelCounts: { [level]: 1 }
      };
      
      if (node.downline) {
        node.downline.forEach(child => {
          const childStats = calculateStats(child, level + 1);
          stats.totalMembers += childStats.totalMembers;
          stats.activeMembers += childStats.activeMembers;
          stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
          
          Object.keys(childStats.levelCounts).forEach(lvl => {
            stats.levelCounts[lvl] = (stats.levelCounts[lvl] || 0) + childStats.levelCounts[lvl];
          });
        });
      }
      
      return stats;
    };
    
    const stats = calculateStats(hierarchyData);
    return stats;
  }, [hierarchyData]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [levelsToShow, setLevelsToShow] = useState(5);
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [reportFilter, setReportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoaches, setSelectedCoaches] = useState(new Set());
  const [treeZoom, setTreeZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [treePosition, setTreePosition] = useState({ x: 0, y: 0 });

  // Request deduplication - prevent multiple simultaneous calls
  const fetchingRef = useRef({
    hierarchy: false,
    downline: false,
    teamPerformance: false,
    reports: false
  });
  
  // Tree Layout State
  const [nodeSpacing, setNodeSpacing] = useState(6);
  const [treeHeight, setTreeHeight] = useState(8);

  // Modal States
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isReportModalOpen, onOpen: onReportModalOpen, onClose: onReportModalClose } = useDisclosure();

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sponsorId: '',
    selfCoachId: '',
    currentLevel: 1,
    bio: '',
    city: '',
    country: '',
    company: '',
    experienceYears: 0,
    specializations: '',
    isActive: true,
    teamRankName: '',
    presidentTeamRankName: ''
  });
  
  // Update formData when effectiveAuth changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      sponsorId: effectiveAuth.coachId || user?.id || ''
    }));
  }, [effectiveAuth.coachId, user?.id]);

  const [reportConfig, setReportConfig] = useState({
    reportType: 'team_summary',
    period: 'monthly',
    startDate: '',
    endDate: ''
  });

  const BASE_URL = API_BASE_URL; // Keep for compatibility

  const [isReportDetailOpen, setIsReportDetailOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);

  // API Headers - ENHANCED with fallback authentication
  const getHeaders = () => {
    const authData = effectiveAuth;
    console.log('🔐 getHeaders - effectiveAuth:', authData);
    console.log('🔑 Token being used:', authData.token ? 'Present' : 'Missing');
    console.log('🆔 Coach-ID being used:', authData.coachId);
    
    const headers = {
      'Authorization': `Bearer ${authData.token}`,
      'Coach-ID': authData.coachId || '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
    
    console.log('📤 Headers being sent:', headers);
    return headers;
  };

  // API Functions
  const fetchHierarchyLevels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/hierarchy-levels`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setHierarchyLevels(data.success ? data.data : data);
      }
    } catch (error) {
      console.error('💥 fetchHierarchyLevels Error:', error);
    }
  };

  const fetchDownline = async () => {
    // Prevent duplicate calls
    if (fetchingRef.current.downline) {
      return;
    }
    
    const authData = effectiveAuth;
    
    if (!authData.coachId || !authData.token) {
      console.error('❌ Missing authentication data:', authData);
      toast('Authentication data not available. Please log in again.', 'error');
      return;
    }
    
    fetchingRef.current.downline = true;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/downline/${authData.coachId}?includePerformance=true`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        const downlineArray = data.success && data.data ? 
          (data.data.downlineWithPerformance || data.data.downline || data.data) : 
          (data.downlineWithPerformance || data.downline || data);
        
        setDownlineData(Array.isArray(downlineArray) ? downlineArray : []);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        // Check if it's a 404 with "no data" message (not a real error)
        if (response.status === 404 && (
          errorData.message?.toLowerCase().includes('no downline found') ||
          errorData.message?.toLowerCase().includes('not found')
        )) {
          // No downline yet - this is normal, just set empty array (no error logging)
          setDownlineData([]);
        } else {
          // Real error - only log if it's not a 404
          if (response.status !== 404) {
            console.error('💥 fetchDownline Error:', errorText);
            toast('Failed to fetch downline data', 'error');
          }
          setDownlineData([]);
        }
      }
    } catch (error) {
      console.error('💥 fetchDownline Error:', error);
      // Only show toast for network errors, not 404s
      if (error.message && !error.message.includes('404')) {
        toast('Failed to fetch downline data', 'error');
      }
      setDownlineData([]);
    } finally {
      fetchingRef.current.downline = false;
      setLoading(false);
    }
  };

  const fetchHierarchy = async () => {
    // Prevent duplicate calls
    if (fetchingRef.current.hierarchy) {
      return;
    }
    
    const authData = effectiveAuth;
    
    if (!authData.coachId || !authData.token) {
      console.error('❌ Missing authentication data:', authData);
      toast('Authentication data not available. Please log in again.', 'error');
      return;
    }
    
    fetchingRef.current.hierarchy = true;
    setLoading(true);
    try {
      // Use the proper hierarchy API endpoint
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/hierarchy/${authData.coachId}?levels=${levelsToShow || 5}&includePerformance=true`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Process the data from hierarchy API
        let processedData;
        if (data.success && data.data) {
          // Hierarchy API returns nested structure with root data
          processedData = data.data;
        } else if (data.data) {
          processedData = data.data;
        } else {
          processedData = data;
        }
        
        // Ensure the data has the expected structure
        if (!processedData.downline && !processedData.downlineHierarchy) {
          processedData = {
            ...processedData,
            downline: [],
            downlineHierarchy: []
          };
        }
        
        setHierarchyData(processedData);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        // Check if it's a 404 with "no data" message (not a real error)
        if (response.status === 404 && (
          errorData.message?.toLowerCase().includes('no downline') ||
          errorData.message?.toLowerCase().includes('not found')
        )) {
          // Set empty hierarchy data (no downline yet) - this is expected, not an error
          const emptyData = {
            name: effectiveAuth.user?.name || user?.name || 'Network Leader',
            email: effectiveAuth.user?.email || user?.email || '',
            _id: effectiveAuth.coachId || user?.id,
            profilePictureUrl: effectiveAuth.user?.profilePictureUrl || user?.profilePictureUrl,
            isActive: true,
            currentLevel: 0,
            downline: [],
            downlineHierarchy: []
          };
          setHierarchyData(emptyData);
        } else {
          // Real error - only log if it's not a 404
          if (response.status !== 404) {
            console.error('fetchHierarchy Failed - Status:', response.status);
            console.error('fetchHierarchy Failed - Error:', errorText);
            toast('Failed to fetch hierarchy data', 'error');
          }
          // Set empty data on error
          const emptyData = {
            name: effectiveAuth.user?.name || user?.name || 'Network Leader',
            email: effectiveAuth.user?.email || user?.email || '',
            _id: effectiveAuth.coachId || user?.id,
            profilePictureUrl: effectiveAuth.user?.profilePictureUrl || user?.profilePictureUrl,
            isActive: true,
            currentLevel: 0,
            downline: [],
            downlineHierarchy: []
          };
          setHierarchyData(emptyData);
        }
      }
    } catch (error) {
      console.error('💥 fetchHierarchy Error:', error);
      toast('Failed to fetch hierarchy data', 'error');
      
      // Set empty data on network error
      const emptyData = {
        name: effectiveAuth.user?.name || user?.name || 'Network Leader',
        email: effectiveAuth.user?.email || user?.email || '',
        _id: effectiveAuth.coachId || user?.id,
        profilePictureUrl: effectiveAuth.user?.profilePictureUrl || user?.profilePictureUrl,
        isActive: true,
        currentLevel: 0,
        downline: [],
        downlineHierarchy: []
      };
      
      setHierarchyData(emptyData);
    } finally {
      fetchingRef.current.hierarchy = false;
      setLoading(false);
    }
  };

  const fetchTeamPerformance = async () => {
    // Prevent duplicate calls
    if (fetchingRef.current.teamPerformance) {
      return;
    }
    
    const authData = effectiveAuth;
    
    if (!authData.coachId || !authData.token) {
      console.error('❌ Missing authentication data:', authData);
      return;
    }
    
    fetchingRef.current.teamPerformance = true;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/team-performance/${authData.coachId}?period=monthly`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        
        console.log('✅ Team Performance Data Received:', data);
        
        if (data.success && data.data) {
          // Map the backend data structure to frontend expectations
          const performanceData = {
            // Team summary stats
            totalTeamSize: data.data.summary?.teamSize || 0,
            activeCoaches: data.data.summary?.memberDetails?.filter(m => m.performance?.isActive)?.length || 0,
            totalRevenue: data.data.summary?.totalRevenue || 0,
            averagePerformanceScore: data.data.summary?.memberDetails?.length > 0 
              ? data.data.summary.memberDetails.reduce((sum, m) => sum + (m.performance?.score || 0), 0) / data.data.summary.memberDetails.length 
              : 0,
            
            // Detailed metrics
            totalLeads: data.data.summary?.totalLeads || 0,
            totalSales: data.data.summary?.totalSales || 0,
            averageConversionRate: data.data.summary?.averageConversionRate || 0,
            
            // Member details for individual performance
            memberDetails: data.data.summary?.memberDetails || [],
            
            // Top and under performers
            topPerformers: data.data.summary?.topPerformers || [],
            underPerformers: data.data.summary?.underPerformers || [],
            
            // Additional metrics
            period: data.data.period || 'monthly',
            dateRange: data.data.dateRange || {},
            
            // Calculated metrics
            totalTasks: data.data.summary?.memberDetails?.reduce((sum, m) => sum + (m.tasks?.total || 0), 0) || 0,
            completedTasks: data.data.summary?.memberDetails?.reduce((sum, m) => sum + (m.tasks?.completed || 0), 0) || 0,
            qualifiedLeads: data.data.summary?.memberDetails?.reduce((sum, m) => sum + (m.leads?.qualified || 0), 0) || 0,
            convertedLeads: data.data.summary?.memberDetails?.reduce((sum, m) => sum + (m.leads?.converted || 0), 0) || 0,
          };
          
          setTeamPerformance(performanceData);
          console.log('✅ Processed Performance Data:', performanceData);
        } else {
          console.warn('⚠️ No performance data available');
          setTeamPerformance(null);
        }
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        // Check if it's a 404 with "no data" message (not a real error)
        if (response.status === 404 && (
          errorData.message?.toLowerCase().includes('no team members found') ||
          errorData.message?.toLowerCase().includes('not found')
        )) {
          console.log('ℹ️ No team members found - setting empty performance data');
          setTeamPerformance(null);
        } else {
          console.error('❌ Team Performance API Error:', response.status, errorData);
          toast(errorData.message || 'Failed to fetch team performance', 'error');
          setTeamPerformance(null);
        }
      }
    } catch (error) {
      console.error('💥 fetchTeamPerformance Error:', error);
      toast('Failed to fetch team performance', 'error');
      setTeamPerformance(null);
    } finally {
      fetchingRef.current.teamPerformance = false;
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    // Prevent duplicate calls
    if (fetchingRef.current.reports) {
      return;
    }
    
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      console.warn('⚠️ fetchReports: Missing authentication data');
      return;
    }
    
    fetchingRef.current.reports = true;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/reports/${authData.coachId}?limit=10`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data.success ? data.data : data);
        console.log('✅ Reports fetched successfully:', data);
      } else {
        console.error('❌ fetchReports: API Error', response.status, response.statusText);
        setReports([]);
      }
    } catch (error) {
      console.error('💥 fetchReports Error:', error);
      toast('Failed to fetch reports', 'error');
      setReports([]);
    } finally {
      fetchingRef.current.reports = false;
      setLoading(false);
    }
  };

  const fetchReportDetail = async reportId => {
    if (!reportId) {
      console.warn('⚠️ fetchReportDetail: No report ID provided');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/reports/detail/${reportId}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        const reportData = data.success ? data.data : data;
        setReportDetail(reportData);
        console.log('✅ Report detail fetched successfully:', reportData);
      } else {
        console.error('❌ fetchReportDetail: API Error', response.status, response.statusText);
        setReportDetail(null);
        toast('Failed to fetch report details', 'error');
      }
    } catch (error) {
      console.error('💥 fetchReportDetail Error:', error);
      setReportDetail(null);
      toast('Failed to fetch report details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openReportDetail = report => {
    setSelectedReport(report);
    setIsReportDetailOpen(true);
    if (report?._id) {
      fetchReportDetail(report._id);
    } else {
      console.warn('⚠️ openReportDetail: No report ID found');
      setReportDetail(null);
    }
  };

  const closeReportDetail = () => {
    setIsReportDetailOpen(false);
    setSelectedReport(null);
    setReportDetail(null);
  };

  const downloadReportDetail = () => {
    const data = reportDetail;
    if (!data) return;
    const fileName = `report-${data.reportId || 'detail'}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadIndividualReport = async (report) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/reports/download/${report._id}`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${report.reportType}-${report._id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('Report downloaded successfully', 'success');
      } else {
        // Fallback to JSON download if PDF not available
        const detailResponse = await fetch(`${API_BASE_URL}/api/advanced-mlm/reports/detail/${report._id}`, {
          headers: getHeaders()
        });
        
        if (detailResponse.ok) {
          const data = await detailResponse.json();
          const reportData = data.success ? data.data : data;
          const fileName = `report-${report.reportType}-${report._id}.json`;
          const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast('Report downloaded successfully', 'success');
        } else {
          throw new Error('Failed to download report');
        }
      }
    } catch (error) {
      console.error('💥 downloadIndividualReport Error:', error);
      toast('Failed to download report', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Commissions
  const fetchCommissions = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/commissions/${authData.coachId}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCommissions(data.data.commissions || []);
          setCommissionSummary(data.data.summary || { totalEarned: 0, pendingAmount: 0, totalCommissions: 0 });
        }
      }
    } catch (error) {
      console.error('💥 fetchCommissions Error:', error);
      toast('Failed to fetch commissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Admin Requests
  const fetchAdminRequests = async () => {
    console.log('🚀 fetchAdminRequests called!');
    const authData = effectiveAuth;
    console.log('🔐 Auth data:', authData);
    if (!authData.coachId || !authData.token) {
      console.error('❌ Missing authentication data:', authData);
      return;
    }
    
    console.log('🔍 Making request to:', `${API_BASE_URL}/api/coach-hierarchy/relevant-requests`);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/coach-hierarchy/relevant-requests`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 fetchAdminRequests Response:', data);
        console.log('🔍 Admin Requests Count:', data.success ? (data.data || []).length : 0);
        setAdminRequests(data.success ? (data.data || []) : []);
      } else {
        console.error('❌ fetchAdminRequests Failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('💥 fetchAdminRequests Error:', error);
      toast('Failed to fetch admin requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current sponsor information
  const fetchCurrentSponsor = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/coach-hierarchy/details`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.sponsorId) {
          setCurrentSponsor(data.data.sponsorId);
        }
      }
    } catch (error) {
      console.error('💥 fetchCurrentSponsor Error:', error);
    }
  };

  // Search for sponsors
  const searchSponsors = async (query) => {
    if (!query || query.length < 3) {
      setSponsorSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/coach-hierarchy/search-sponsor?query=${encodeURIComponent(query)}`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Combine digital and external sponsors
          const allSponsors = [
            ...(data.data?.digitalSponsors || []).map(s => ({
              ...s,
              type: 'digital',
              displayId: s.selfCoachId
            })),
            ...(data.data?.externalSponsors || []).map(s => ({
              ...s,
              type: 'external',
              displayId: s.phone || s.email
            }))
          ];
          setSponsorSearchResults(allSponsors);
        }
      }
    } catch (error) {
      console.error('💥 searchSponsors Error:', error);
    }
  };

  // Submit admin request
  const submitAdminRequest = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      toast('Authentication required', 'error');
      return;
    }

    if (!selectedSponsor || !requestForm.reason.trim()) {
      toast('Please select a sponsor and provide a reason', 'error');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        requestType: 'sponsor_change',
        requestedData: {
          sponsorId: selectedSponsor._id,
          sponsorName: selectedSponsor.name,
          sponsorType: selectedSponsor.type
        },
        reason: requestForm.reason
      };

      const response = await fetch(`${API_BASE_URL}/api/coach-hierarchy/admin-request`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast('Admin request submitted successfully', 'success');
          setShowAdminRequestForm(false);
          setSelectedSponsor(null);
          setRequestForm({ requestType: 'sponsor_change', requestedSponsorId: '', reason: '' });
          setSponsorSearchResults([]);
          fetchAdminRequests(); // Refresh the list
        } else {
          toast(data.message || 'Failed to submit request', 'error');
        }
      } else {
        toast('Failed to submit admin request', 'error');
      }
    } catch (error) {
      console.error('💥 submitAdminRequest Error:', error);
      toast('Failed to submit admin request', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Coach Performance
  const fetchCoachPerformance = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/coach-performance/${authData.coachId}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCoachPerformance(data.success ? data.data : data);
      }
    } catch (error) {
      console.error('💥 fetchCoachPerformance Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Sales Performance
  const fetchSalesPerformance = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/sales-performance/${authData.coachId}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setSalesPerformance(data.success ? data.data : data);
      }
    } catch (error) {
      console.error('💥 fetchSalesPerformance Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Client Performance
  const fetchClientPerformance = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/client-performance/${authData.coachId}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setClientPerformance(data.success ? data.data : data);
      }
    } catch (error) {
      console.error('💥 fetchClientPerformance Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Lead Performance
  const fetchLeadPerformance = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/lead-performance/${authData.coachId}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setLeadPerformance(data.success ? data.data : data);
      }
    } catch (error) {
      console.error('💥 fetchLeadPerformance Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCoach = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password || !formData.selfCoachId) {
        toast('Please fill all required fields: name, email, password, and Coach ID', 'error');
        setLoading(false);
        return;
      }

      // Ensure sponsorId is set correctly
      const sponsorId = formData.sponsorId || effectiveAuth.coachId || user?.id;
      if (!sponsorId) {
        toast('Sponsor ID is missing. Please log in again.', 'error');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/downline`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          sponsorId: sponsorId,
          selfCoachId: formData.selfCoachId,
          currentLevel: formData.currentLevel || 1,
          bio: formData.bio,
          city: formData.city,
          country: formData.country,
          company: formData.company,
          experienceYears: formData.experienceYears,
          specializations: formData.specializations,
          isActive: formData.isActive,
          teamRankName: formData.teamRankName,
          presidentTeamRankName: formData.presidentTeamRankName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast(data.message || 'Coach added successfully', 'success');
        onAddModalClose();
        resetForm();
        fetchDownline();
        fetchHierarchy(); // Refresh hierarchy when adding new coach
        fetchTeamPerformance();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add coach');
      }
    } catch (error) {
      console.error('💥 addCoach Error:', error);
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateCoach = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!selectedCoach || !selectedCoach._id) {
      toast('Coach selection error', 'error');
      setLoading(false);
      return;
    }

    // Check if trying to update sponsorId and it's not the coach's own profile
    const isUpdatingSponsor = formData.sponsorId && formData.sponsorId !== selectedCoach.sponsorId;
    const isOwnProfile = effectiveAuth.coachId === selectedCoach._id;
    
    if (isUpdatingSponsor && !isOwnProfile) {
      // Use the downline sponsor update endpoint
      try {
        const response = await fetch(`${API_BASE_URL}/api/coach-hierarchy/update-downline-sponsor/${selectedCoach._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${effectiveAuth.token}`,
            'X-Coach-Id': effectiveAuth.coachId
          },
          body: JSON.stringify({
            sponsorId: formData.sponsorId,
            reason: `Sponsor change requested for ${selectedCoach.name} (${selectedCoach.email})`
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Sponsor change request submitted:', data);
          toast('Sponsor change request submitted for admin approval', 'success');
          onEditModalClose();
          fetchHierarchy(); // Refresh the data
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit sponsor change request');
        }
      } catch (error) {
        console.error('💥 Sponsor change request Error:', error);
        toast(error.message, 'error');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Prepare update data - include all fields except sponsorId for downline updates
    const updateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      country: formData.country,
      selfCoachId: formData.selfCoachId,
      currentLevel: formData.currentLevel,
      isActive: formData.isActive,
      bio: formData.bio,
      teamRankName: formData.teamRankName,
      presidentTeamRankName: formData.presidentTeamRankName,
      company: formData.company,
      experienceYears: formData.experienceYears,
      specializations: formData.specializations ? formData.specializations.split(',').map(s => s.trim()).filter(s => s) : []
    };

    // Only include sponsorId if updating own profile
    if (isOwnProfile && formData.sponsorId) {
      updateData.sponsorId = formData.sponsorId;
    }

    // Only include password if it's provided
    if (formData.password && formData.password.trim()) {
      updateData.password = formData.password;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/coach-hierarchy/update-coach/${selectedCoach._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveAuth.token}`,
          'X-Coach-Id': effectiveAuth.coachId
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Coach updated:', data);
        toast('Coach profile updated successfully', 'success');
        onEditModalClose();
        fetchHierarchy(); // Refresh the data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update coach');
      }
    } catch (error) {
      console.error('💥 updateCoach Error:', error);
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (e) => {
    e.preventDefault();
    
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      toast('Authentication required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/advanced-mlm/generate-report`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          sponsorId: authData.coachId,
          ...reportConfig
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Report generation started:', data);
        toast('Report generation started', 'success');
        onReportModalClose();
        fetchReports();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('💥 generateReport Error:', error);
      toast(error.message || 'Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      sponsorId: effectiveAuth.coachId || user?.id || '',
      selfCoachId: '',
      currentLevel: 1,
      bio: '',
      city: '',
      country: '',
      company: '',
      experienceYears: 0,
      specializations: '',
      isActive: true,
      teamRankName: '',
      presidentTeamRankName: ''
    });
  };

  const openEditModal = (coach) => {
    setSelectedCoach(coach);
    setFormData({
      name: coach.name || '',
      email: coach.email || '',
      password: '',
      phone: coach.phone || '',
      sponsorId: coach.sponsorId || effectiveAuth.coachId || user?.id || '',
      selfCoachId: coach.selfCoachId || '',
      currentLevel: coach.currentLevel || 1,
      bio: coach.bio || '',
      city: coach.city || '',
      country: coach.country || '',
      company: coach.company || '',
      experienceYears: coach.portfolio?.experienceYears || 0,
      specializations: coach.portfolio?.specializations?.map(s => s.name).join(', ') || '',
      isActive: coach.isActive !== undefined ? coach.isActive : true,
      teamRankName: coach.teamRankName || '',
      presidentTeamRankName: coach.presidentTeamRankName || ''
    });
    onEditModalOpen();
  };

  const openViewModal = (coach) => {
    setSelectedCoach(coach);
    onViewModalOpen();
  };

  const openDeleteModal = (coach) => {
    setSelectedCoach(coach);
    onDeleteModalOpen();
  };

  const handleSelectCoach = (coachId) => {
    setSelectedCoaches(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(coachId)) {
        newSelected.delete(coachId);
      } else {
        newSelected.add(coachId);
      }
      return newSelected;
    });
  };

  const handleSelectAllCoaches = (isChecked, coaches) => {
    setSelectedCoaches(isChecked ? new Set(coaches.map(coach => coach._id)) : new Set());
  };

  // Memoized filtered data
  const filteredDownlineData = useMemo(() => {
    if (!Array.isArray(downlineData)) return [];
    
    let filtered = [...downlineData];
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(coach => 
        coach.name?.toLowerCase().includes(searchLower) ||
        coach.email?.toLowerCase().includes(searchLower) ||
        coach.city?.toLowerCase().includes(searchLower) ||
        coach.country?.toLowerCase().includes(searchLower)
      );
    }
    
    // Performance filter
    if (performanceFilter !== 'all') {
      filtered = filtered.filter(coach => {
        switch (performanceFilter) {
          case 'active': return coach.isActive;
          case 'inactive': return !coach.isActive;
          case 'top': return coach.performance?.performanceScore >= 80;
          default: return true;
        }
      });
    }
    
    return filtered;
  }, [downlineData, searchTerm, performanceFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    // Use team performance data if available and valid, otherwise fallback to hierarchy data
    const totalTeam = teamPerformance?.totalTeamSize || hierarchyStats?.totalMembers || filteredDownlineData.length;
    const activeCoaches = teamPerformance?.activeCoaches || hierarchyStats?.activeMembers || filteredDownlineData.filter(c => c.isActive).length;
    const totalRevenue = teamPerformance?.totalRevenue || 0;
    const avgPerformance = teamPerformance?.averagePerformanceScore || 0;
    
    const calculatedStats = { totalTeam, activeCoaches, totalRevenue, avgPerformance };
    
    return calculatedStats;
  }, [teamPerformance, filteredDownlineData, hierarchyStats]);

  // Load data on component mount - only fetch hierarchy levels
  useEffect(() => {
    fetchHierarchyLevels();
  }, []);

  // Load data based on active tab - only once when tab changes
  useEffect(() => {
    console.log('🔄 Tab switching - activeTab:', activeTab);
    console.log('🔄 Performance sub-tab:', performanceSubTab);
    
    switch (activeTab) {
      case 0: // Hierarchy
        if (!hierarchyData) {
          console.log('🌳 Calling fetchHierarchy()');
          fetchHierarchy();
        }
        break;
      case 1: // Direct Coaches
        if (!fetchingRef.current.downline && downlineData.length === 0) {
          console.log('👥 Calling fetchDownline()');
          fetchDownline();
        }
        break;
      case 2: // Performance
        if (!fetchingRef.current.teamPerformance && !teamPerformance) {
          console.log('📊 Calling fetchTeamPerformance()');
          fetchTeamPerformance();
        }
        // Load sub-tab data based on performanceSubTab
        if (performanceSubTab === 0 && !coachPerformance) {
          fetchCoachPerformance();
        } else if (performanceSubTab === 1 && !salesPerformance) {
          fetchSalesPerformance();
        } else if (performanceSubTab === 2 && !clientPerformance) {
          fetchClientPerformance();
        } else if (performanceSubTab === 3 && !leadPerformance) {
          fetchLeadPerformance();
        }
        break;
      case 3: // Reports
        if (!fetchingRef.current.reports && reports.length === 0) {
          console.log('📊 Calling fetchReports()');
          fetchReports();
        }
        break;
      case 4: // Commissions
        console.log('🔄 Tab 4: Commissions - checking if fetchCommissions needed');
        if (commissions.length === 0) {
          console.log('📊 Calling fetchCommissions()');
          fetchCommissions();
        }
        break;
      case 5: // Admin Requests
        console.log('🔄 Tab 5: Admin Requests - checking if fetchAdminRequests needed');
        console.log('🔢 Current adminRequests length:', adminRequests.length);
        // CLEAR STATE AND FORCE CALL: Always call fetchAdminRequests when Admin Requests tab is selected
        setAdminRequests([]); // Clear existing data
        console.log('📋 FORCE CALLING fetchAdminRequests()');
        fetchAdminRequests();
        if (!currentSponsor) {
          console.log('👤 Calling fetchCurrentSponsor()');
          fetchCurrentSponsor();
        }
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, performanceSubTab]); // Only depend on activeTab and performanceSubTab

  // Auto-refresh performance data every 30 seconds when on performance tab
  useEffect(() => {
    let intervalId = null;
    
    if (activeTab === 2) { // Performance tab
      // Set up interval to refresh performance data
      intervalId = setInterval(() => {
        console.log('🔄 Auto-refreshing performance data...');
        fetchTeamPerformance();
      }, 30000); // 30 seconds
    }
    
    // Cleanup interval when tab changes or component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeTab]); // Only depend on activeTab

  // Conditional rendering for loading
  if (loading && !downlineData.length && !hierarchyData && !teamPerformance) {
    return <BeautifulSkeleton />;
  }

  return (
    <Box bg="gray.100" minH="100vh" py={6} px={6}>
      <Box maxW="full" mx="auto">
        <VStack spacing={8} align="stretch" w="full">
          {/* Minimalist Header */}
          <Card bg="white" borderRadius="7px" boxShadow="sm" border="1px" borderColor="gray.100">
            <CardBody p={8}>
              <VStack spacing={8} align="stretch">
                {/* Header Section */}
                <Flex justify="space-between" align="center" direction={{ base: 'column', lg: 'row' }} gap={6}>
                  {/* Left Side - Title */}
                  <VStack align={{ base: 'center', lg: 'start' }} spacing={2} flex="1">
                    <Heading 
                      size="xl" 
                      color="gray.900" 
                      fontWeight="600"
                      letterSpacing="-0.02em"
                    >
                      Coach Network
                    </Heading>
                    <Text 
                      color="gray.600" 
                      fontSize="sm" 
                      fontWeight="normal"
                      textAlign={{ base: 'center', lg: 'start' }}
                      maxW="600px"
                    >
                      Manage your team hierarchy and track performance metrics
                    </Text>
                  </VStack>
                  
                  {/* Right Side - Action Buttons */}
                  <HStack spacing={3} justify={{ base: 'center', lg: 'end' }}>
                    <IconButton
                      icon={<RepeatIcon />}
                      variant="ghost"
                      size="md"
                      onClick={() => {
                        switch (activeTab) {
                          case 0: fetchHierarchy(); break;
                          case 1: fetchDownline(); break;
                          case 2: fetchTeamPerformance(); break;
                          case 3: fetchReports(); break;
                        }
                      }}
                      _hover={{
                        bg: 'gray.50'
                      }}
                      transition="all 0.2s"
                      borderRadius="7px"
                      isLoading={loading}
                      aria-label="Refresh"
                    />
                    
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      size="md"
                      onClick={onAddModalOpen}
                      borderRadius="7px"
                      px={6}
                    >
                      Add Coach
                    </Button>
                  </HStack>
                </Flex>
                
                {/* Stats Cards - Minimalist Design */}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                  <StatsCard
                    title="Total Team Size"
                    value={stats.totalTeam}
                    icon={<Box as={FiUsers} size="20px" />}
                    color="blue"
                    description="Active team members"
                    isLoading={loading}
                  />
                  <StatsCard
                    title="Active Coaches"
                    value={stats.activeCoaches}
                    icon={<CheckCircleIcon />}
                    color="green"
                    description="Currently active"
                    isLoading={loading}
                  />
                  <StatsCard
                    title="Team Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={<Box as={FiTrendingUp} size="20px" />}
                    color="purple"
                    description="Monthly total"
                    isLoading={loading}
                  />
                  <StatsCard
                    title="Avg Performance"
                    value={`${stats.avgPerformance}%`}
                    icon={<Box as={FiTarget} size="20px" />}
                    color="orange"
                    description="Team average"
                    isLoading={loading}
                  />
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Bulk Actions Toolbar */}
          {selectedCoaches.size > 0 && activeTab === 1 && (
            <Card bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="7px" shadow="md">
              <CardBody py={4}>
                <HStack justify="space-between" align="center">
                  <HStack spacing={3} align="center">
                    <Box
                      w="8px"
                      h="8px"
                      bg="blue.500"
                      borderRadius="7px"
                      animation="pulse 2s infinite"
                    />
                    <Text fontWeight="semibold" color="blue.700" fontSize="md">
                      {selectedCoaches.size} coaches selected
                    </Text>
                    <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                      Bulk Actions Available
                    </Badge>
                  </HStack>
                  
                  <ButtonGroup size="md" spacing={3}>
                    <Button 
                      leftIcon={<DownloadIcon />} 
                      colorScheme="blue"
                      variant="outline"
                      _hover={{ 
                        transform: 'translateY(-1px)', 
                        shadow: 'md',
                        bg: 'blue.50'
                      }}
                      transition="all 0.2s"
                      borderRadius="7px"
                    >
                      Export Selected
                    </Button>
                    <Button 
                      leftIcon={<DeleteIcon />} 
                      colorScheme="red"
                      variant="outline"
                      _hover={{ 
                        transform: 'translateY(-1px)', 
                        shadow: 'md',
                        bg: 'red.50'
                      }}
                      transition="all 0.2s"
                      borderRadius="7px"
                    >
                      Delete Selected
                    </Button>
                  </ButtonGroup>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Card bg="white" borderRadius="7px" boxShadow="sm" border="1px" borderColor="gray.100">
            <Tabs index={activeTab} onChange={setActiveTab} colorScheme="blue">
              <TabList borderBottom="1px" borderColor="gray.200" px={6} pt={4}>
                <Tab 
                  _selected={{ 
                    color: 'blue.600', 
                    borderBottom: '2px solid',
                    borderColor: 'blue.600',
                  }}
                  fontWeight="500"
                  fontSize="sm"
                  px={4}
                  py={3}
                  color="gray.600"
                  _hover={{ color: 'gray.900' }}
                >
                  Hierarchy
                </Tab>
                <Tab 
                  _selected={{ 
                    color: 'blue.600', 
                    borderBottom: '2px solid',
                    borderColor: 'blue.600',
                  }}
                  fontWeight="500"
                  fontSize="sm"
                  px={4}
                  py={3}
                  color="gray.600"
                  _hover={{ color: 'gray.900' }}
                >
                  Direct Coaches
                </Tab>
                <Tab 
                  _selected={{ 
                    color: 'blue.600', 
                    borderBottom: '2px solid',
                    borderColor: 'blue.600',
                  }}
                  fontWeight="500"
                  fontSize="sm"
                  px={4}
                  py={3}
                  color="gray.600"
                  _hover={{ color: 'gray.900' }}
                >
                  Performance
                </Tab>
                <Tab 
                  _selected={{ 
                    color: 'blue.600', 
                    borderBottom: '2px solid',
                    borderColor: 'blue.600',
                  }}
                  fontWeight="500"
                  fontSize="sm"
                  px={4}
                  py={3}
                  color="gray.600"
                  _hover={{ color: 'gray.900' }}
                >
                  Reports
                </Tab>
                <Tab 
                  _selected={{ 
                    color: 'blue.600', 
                    borderBottom: '2px solid',
                    borderColor: 'blue.600',
                  }}
                  fontWeight="500"
                  fontSize="sm"
                  px={4}
                  py={3}
                  color="gray.600"
                  _hover={{ color: 'gray.900' }}
                >
                  Commissions
                </Tab>
                <Tab 
                  _selected={{ 
                    color: 'blue.600', 
                    borderBottom: '2px solid',
                    borderColor: 'blue.600',
                  }}
                  fontWeight="500"
                  fontSize="sm"
                  px={4}
                  py={3}
                  color="gray.600"
                  _hover={{ color: 'gray.900' }}
                  onClick={() => {
                    console.log('🎯 Admin Requests tab clicked directly!');
                    setActiveTab(5); // Force set active tab to 5
                    setTimeout(() => {
                      console.log('🎯 Force calling fetchAdminRequests()');
                      fetchAdminRequests();
                    }, 100);
                  }}
                >
                  Admin Requests
                </Tab>
                <Tab 
                  fontSize="sm" 
                  fontWeight="500" 
                  color="gray.600"
                  _hover={{ color: 'gray.900' }}
                  onClick={() => setActiveTab(6)}
                >
                  Admin Requests main tab
                </Tab>
              </TabList>

              <TabPanels>
                {/* Hierarchy Tab - Redesigned */}
                <TabPanel p={0}>
                  <Box p={6}>
                    {loading && !hierarchyData ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Card key={i} borderRadius="7px" border="1px" borderColor="gray.200">
                            <CardBody>
                              <Skeleton height="120px" />
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    ) : (() => {
                      // Use real hierarchy data from backend
                      const dataToUse = hierarchyData;
                      
                      // Get the members list - handle both downlineHierarchy and downline structures
                      const members = dataToUse?.downlineHierarchy || dataToUse?.downline || [];
                      const hasMembers = Array.isArray(members) && members.length > 0;
                      
                      if (!hasMembers) {
                        return (
                          <Card bg="gray.50" border="1px" borderColor="gray.200" borderRadius="7px">
                            <CardBody py={12}>
                              <Center>
                                <VStack spacing={4}>
                                  <Box as={FiUsers} size={48} color="gray.400" />
                                  <VStack spacing={2}>
                                    <Text fontSize="lg" fontWeight="600" color="gray.700">
                                      No Team Members Yet
                                    </Text>
                                    <Text fontSize="sm" color="gray.500" textAlign="center" maxW="400px">
                                      Start building your network by adding your first team member
                                    </Text>
                                  </VStack>
                                  <Button
                                    leftIcon={<AddIcon />}
                                    colorScheme="blue"
                                    onClick={onAddModalOpen}
                                    borderRadius="7px"
                                    mt={2}
                                  >
                                    Add First Team Member
                                  </Button>
                                </VStack>
                              </Center>
                            </CardBody>
                          </Card>
                        );
                      }
                      
                      return (
                        <VStack spacing={6} align="stretch">
                          {/* Header */}
                          <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                              <HStack spacing={3} align="center">
                                <Text fontSize="sm" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="wide">
                                  Team Structure
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.500">
                                {members.length} direct member{members.length !== 1 ? 's' : ''}
                              </Text>
                            </VStack>
                            <HStack spacing={2}>
                              <Box position="relative">
                                <Select 
                                  value={levelsToShow} 
                                  onChange={(e) => setLevelsToShow(parseInt(e.target.value))}
                                  size="sm"
                                  w="150px"
                                  borderRadius="7px"
                                  borderColor="gray.300"
                                  bg="white"
                                  fontWeight="500"
                                  _hover={{
                                    borderColor: 'blue.400',
                                    boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.2)',
                                    transform: 'translateY(-1px)'
                                  }}
                                  _focus={{
                                    borderColor: 'blue.500',
                                    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
                                    outline: 'none'
                                  }}
                                  _active={{
                                    borderColor: 'blue.500'
                                  }}
                                  transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                  cursor="pointer"
                                  sx={{
                                    '& > option': {
                                      background: 'white !important',
                                      color: 'gray.700',
                                      padding: '10px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      transition: 'all 0.15s ease',
                                      '&:hover': {
                                        background: 'blue.50 !important',
                                        color: 'blue.700'
                                      },
                                      '&:checked': {
                                        background: 'blue.100 !important',
                                        color: 'blue.800',
                                        fontWeight: '600'
                                      },
                                      '&:focus': {
                                        background: 'blue.50 !important'
                                      }
                                    }
                                  }}
                                >
                                  <option value={1}>Level 1</option>
                                  <option value={2}>Level 2</option>
                                  <option value={3}>Level 3</option>
                                  <option value={0}>All Levels</option>
                                </Select>
                              </Box>
                              <IconButton
                                icon={<RepeatIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={fetchHierarchy}
                                isLoading={loading}
                                aria-label="Refresh"
                                borderRadius="7px"
                              />
                            </HStack>
                          </Flex>

                          {/* Professional Tree View with Graph Paper Background and Zoom */}
                          <Card border="1px" borderColor="gray.200" borderRadius="7px" overflow="hidden">
                            {/* Zoom Controls */}
                            <HStack 
                              justify="space-between" 
                              align="center"
                              p={3} 
                              bg="gray.50" 
                              borderBottom="1px" 
                              borderColor="gray.200"
                              spacing={4}
                            >
                              <HStack spacing={3} flex={1} maxW="400px">
                                <Text fontSize="xs" color="gray.600" fontWeight="500" minW="60px">
                                  Zoom: {Math.round(treeZoom * 100)}%
                                </Text>
                                <Slider
                                  aria-label="Zoom slider"
                                  value={treeZoom}
                                  min={0.5}
                                  max={2}
                                  step={0.1}
                                  onChange={(val) => setTreeZoom(val)}
                                  colorScheme="blue"
                                  flex={1}
                                >
                                  <SliderTrack>
                                    <SliderFilledTrack />
                                  </SliderTrack>
                                  <SliderThumb />
                                </Slider>
                              </HStack>
                              <IconButton
                                icon={<FiMaximize2 />}
                                size="sm"
                                onClick={() => setTreeZoom(1)}
                                aria-label="Reset Zoom"
                                variant="ghost"
                                colorScheme="blue"
                              />
                            </HStack>
                            
                            {/* Tree Container with Graph Paper Background */}
                            <Box
                              position="relative"
                              overflow="auto"
                              bg="white"
                              minH="600px"
                              cursor={isDragging ? 'grabbing' : 'default'}
                              onMouseDown={(e) => {
                                // Only start dragging if clicking on empty area (not on interactive elements)
                                const target = e.target;
                                const isInteractive = target.closest('button') || 
                                                     target.closest('[role="button"]') || 
                                                     target.closest('img') ||
                                                     target.closest('svg') ||
                                                     target.closest('.tooltip-container');
                                
                                if (!isInteractive) {
                                  setIsDragging(true);
                                  setDragStart({
                                    x: e.clientX - treePosition.x,
                                    y: e.clientY - treePosition.y
                                  });
                                  e.preventDefault();
                                }
                              }}
                              onMouseMove={(e) => {
                                if (isDragging) {
                                  const newX = e.clientX - dragStart.x;
                                  const newY = e.clientY - dragStart.y;
                                  setTreePosition({
                                    x: newX,
                                    y: newY
                                  });
                                }
                              }}
                              onMouseUp={() => setIsDragging(false)}
                              onMouseLeave={() => setIsDragging(false)}
                              sx={{
                                backgroundImage: `
                                  linear-gradient(to right, rgba(156, 163, 175, 0.1) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(156, 163, 175, 0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px',
                                backgroundPosition: `${treePosition.x % 20}px ${treePosition.y % 20}px, ${treePosition.x % 20}px ${treePosition.y % 20}px`,
                                // Custom scrollbar styling - minimal and elegant
                                '&::-webkit-scrollbar': {
                                  width: '10px',
                                  height: '10px',
                                },
                                '&::-webkit-scrollbar-track': {
                                  background: 'rgba(0, 0, 0, 0.02)',
                                  borderRadius: '5px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  background: 'rgba(156, 163, 175, 0.2)',
                                  borderRadius: '5px',
                                  border: '2px solid transparent',
                                  backgroundClip: 'padding-box',
                                  '&:hover': {
                                    background: 'rgba(156, 163, 175, 0.35)',
                                    backgroundClip: 'padding-box',
                                  },
                                },
                                // Firefox scrollbar
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(156, 163, 175, 0.2) rgba(0, 0, 0, 0.02)',
                              }}
                            >
                              <Box
                                className="tree-background"
                                minW="fit-content"
                                position="relative"
                                py={6}
                                px={8}
                                transform={`scale(${treeZoom}) translate(${treePosition.x / treeZoom}px, ${treePosition.y / treeZoom}px)`}
                                transformOrigin="top left"
                                transition={isDragging ? 'none' : 'transform 0.05s ease-out'}
                                style={{
                                  userSelect: 'none',
                                }}
                              >
                                <VStack spacing={12} align="stretch">
                                  {/* Root Node - Head Coach */}
                                  <Box textAlign="center" position="relative" zIndex={3} id="root-node">
                                    <Tooltip
                                      label={
                                        <Box p={3}>
                                          <VStack align="start" spacing={2}>
                                            <HStack spacing={2}>
                                              <Text fontWeight="600" color="white" fontSize="sm">
                                                {dataToUse.name || 'You'}
                                              </Text>
                                              <Box w={2} h={2} bg="green.500" borderRadius="full" />
                                            </HStack>
                                            <Text fontSize="xs" color="gray.200">
                                              Head Coach • Level 0
                                            </Text>
                                            {dataToUse.email && (
                                              <Text fontSize="xs" color="gray.300">
                                                {dataToUse.email}
                                              </Text>
                                            )}
                                            <HStack spacing={4} pt={2} borderTop="1px" borderColor="gray.600">
                                              <VStack spacing={0} align="start">
                                                <Text fontSize="xs" color="gray.400">Team Size</Text>
                                                <Text fontSize="sm" fontWeight="700" color="white">
                                                  {members.length}
                                                </Text>
                                              </VStack>
                                              {dataToUse.performance?.performanceScore !== undefined && (
                                                <VStack spacing={0} align="start">
                                                  <Text fontSize="xs" color="gray.400">Performance</Text>
                                                  <Text fontSize="sm" fontWeight="700" color="white">
                                                    {dataToUse.performance.performanceScore}%
                                                  </Text>
                                                </VStack>
                                              )}
                                            </HStack>
                                          </VStack>
                                        </Box>
                                      }
                                      bg="gray.800"
                                      color="white"
                                      borderRadius="7px"
                                      placement="top"
                                      hasArrow
                                    >
                                      <Box
                                        as="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openViewModal(dataToUse);
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        cursor="pointer"
                                        _hover={{ transform: 'scale(1.1)' }}
                                        transition="all 0.2s"
                                        position="relative"
                                        zIndex={3}
                                        id="root-avatar"
                                      >
                                        <Box position="relative" display="inline-block">
                                          <Image
                                            src={dataToUse.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dataToUse.name || 'User')}&background=3182ce&color=fff&size=128`}
                                            alt={dataToUse.name || 'You'}
                                            borderRadius="7px"
                                            boxSize="80px"
                                            border="4px solid"
                                            borderColor="gray.400"
                                            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                                            objectFit="cover"
                                            fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(dataToUse.name || 'User')}&background=3182ce&color=fff&size=128`}
                                          />
                                          <Box
                                            position="absolute"
                                            bottom="-2px"
                                            right="-2px"
                                            w={4}
                                            h={4}
                                            bg="green.500"
                                            borderRadius="7px"
                                            border="2px solid"
                                            borderColor="white"
                                          />
                                        </Box>
                                      </Box>
                                    </Tooltip>
                                    <Text fontSize="sm" color="gray.700" mt={3} fontWeight="600">
                                      {dataToUse.name || 'You'}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Head Coach
                                    </Text>
                                  </Box>

                                {/* Level 1 Members */}
                                {members.length > 0 && (
                                  <Box position="relative" mt={2}>
                                    {/* SVG Connection Lines - Properly Connected */}
                                    <Box
                                      position="absolute"
                                      top="-80px"
                                      left="0"
                                      right="0"
                                      height="80px"
                                      zIndex={1}
                                      pointerEvents="none"
                                    >
                                      <svg
                                        width="100%"
                                        height="100%"
                                        style={{ position: 'absolute', top: 0, left: 0 }}
                                      >
                                        {/* Vertical line from root to horizontal branch */}
                                        <line
                                          x1="50%"
                                          y1="0"
                                          x2="50%"
                                          y2="40"
                                          stroke="#9CA3AF"
                                          strokeWidth="2.5"
                                        />
                                        {/* Horizontal line connecting all level 1 members */}
                                        {members.length > 1 && (
                                          <line
                                            x1={`${100 / (members.length * 2)}%`}
                                            y1="40"
                                            x2={`${100 - (100 / (members.length * 2))}%`}
                                            y2="40"
                                            stroke="#9CA3AF"
                                            strokeWidth="2.5"
                                          />
                                        )}
                                        {/* Vertical lines from horizontal branch to each member avatar */}
                                        {members.map((_, index) => {
                                          const colCount = members.length > 4 ? 5 : members.length;
                                          const colWidth = 100 / colCount;
                                          const xPos = (index % colCount) * colWidth + colWidth / 2;
                                          return (
                                            <line
                                              key={`line-${index}`}
                                              x1={`${xPos}%`}
                                              y1="40"
                                              x2={`${xPos}%`}
                                              y2="80"
                                              stroke="#9CA3AF"
                                              strokeWidth="2.5"
                                            />
                                          );
                                        })}
                                      </svg>
                                    </Box>

                                    <SimpleGrid 
                                      columns={{ base: 2, md: members.length > 3 ? 4 : members.length, lg: members.length > 4 ? 5 : members.length }} 
                                      spacing={6}
                                      mt={10}
                                    >
                                      {members
                                        .filter((_, index) => levelsToShow === 0 || levelsToShow >= 1)
                                        .map((member, index) => {
                                          const memberDownline = member.downlineHierarchy || member.downline || [];
                                          const hasChildren = memberDownline.length > 0;
                                          
                                          return (
                                            <Box key={member._id || index} position="relative" textAlign="center" id={`member-${index}`}>
                                              <VStack spacing={2}>
                                                <Tooltip
                                                  label={
                                                    <Box p={3}>
                                                      <VStack align="start" spacing={2}>
                                                        <HStack spacing={2}>
                                                          <Text fontWeight="600" color="white" fontSize="sm">
                                                            {member.name}
                                                          </Text>
                                                          {member.isActive !== false ? (
                                                            <Box w={2} h={2} bg="green.500" borderRadius="full" />
                                                          ) : (
                                                            <Box w={2} h={2} bg="gray.400" borderRadius="full" />
                                                          )}
                                                        </HStack>
                                                        <Text fontSize="xs" color="gray.200">
                                                          Level {member.currentLevel || 1}
                                                        </Text>
                                                        {member.email && (
                                                          <Text fontSize="xs" color="gray.300">
                                                            {member.email}
                                                          </Text>
                                                        )}
                                                        <HStack spacing={4} pt={2} borderTop="1px" borderColor="gray.600">
                                                          {member.performance?.performanceScore !== undefined && (
                                                            <VStack spacing={0} align="start">
                                                              <Text fontSize="xs" color="gray.400">Performance</Text>
                                                              <Text fontSize="sm" fontWeight="700" color="white">
                                                                {member.performance.performanceScore}%
                                                              </Text>
                                                            </VStack>
                                                          )}
                                                          {hasChildren && (
                                                            <VStack spacing={0} align="start">
                                                              <Text fontSize="xs" color="gray.400">Team</Text>
                                                              <Text fontSize="sm" fontWeight="700" color="white">
                                                                {memberDownline.length}
                                                              </Text>
                                                            </VStack>
                                                          )}
                                                        </HStack>
                                                      </VStack>
                                                    </Box>
                                                  }
                                                  bg="gray.800"
                                                  color="white"
                                                  borderRadius="7px"
                                                  placement="top"
                                                  hasArrow
                                                >
                                                  <Box
                                                    as="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      openViewModal(member);
                                                    }}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    cursor="pointer"
                                                    _hover={{ transform: 'scale(1.1)' }}
                                                    transition="all 0.2s"
                                                    position="relative"
                                                    zIndex={2}
                                                    id={`member-avatar-${index}`}
                                                  >
                                                    <Box position="relative" display="inline-block">
                                                      <Image
                                                        src={member.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'User')}&background=3182ce&color=fff&size=128`}
                                                        alt={member.name}
                                                        borderRadius="7px"
                                                        boxSize="64px"
                                                        border="3px solid"
                                                        borderColor={member.isActive !== false ? "green.400" : "gray.400"}
                                                        boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                                                        objectFit="cover"
                                                        fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'User')}&background=3182ce&color=fff&size=128`}
                                                      />
                                                      <Box
                                                        position="absolute"
                                                        bottom="-2px"
                                                        right="-2px"
                                                        w={3}
                                                        h={3}
                                                        bg={member.isActive !== false ? "green.500" : "gray.400"}
                                                        borderRadius="7px"
                                                        border="2px solid"
                                                        borderColor="white"
                                                      />
                                                    </Box>
                                                  </Box>
                                                </Tooltip>
                                                <Text fontSize="xs" color="gray.700" mt={1} fontWeight="500" noOfLines={1} maxW="80px" mx="auto">
                                                  {member.name}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                  L{member.currentLevel || 1}
                                                </Text>
                                              </VStack>

                                              {/* Level 2 Members - Nested */}
                                              {hasChildren && levelsToShow >= 2 && memberDownline.length > 0 && (
                                                <Box mt={8} position="relative">
                                                  {/* SVG Connection Lines for Level 2 - Properly Connected */}
                                                  <Box
                                                    position="absolute"
                                                    top="-50px"
                                                    left="50%"
                                                    transform="translateX(-50%)"
                                                    width={`${Math.min(memberDownline.length * 70, 350)}px`}
                                                    height="50px"
                                                    zIndex={1}
                                                    pointerEvents="none"
                                                  >
                                                    <svg
                                                      width="100%"
                                                      height="100%"
                                                      style={{ position: 'absolute', top: 0, left: 0 }}
                                                    >
                                                      {/* Vertical line from level 1 member */}
                                                      <line
                                                        x1="50%"
                                                        y1="0"
                                                        x2="50%"
                                                        y2="25"
                                                        stroke="#9CA3AF"
                                                        strokeWidth="2.5"
                                                      />
                                                      {/* Horizontal line for level 2 */}
                                                      {memberDownline.length > 1 && (
                                                        <line
                                                          x1={`${50 - ((memberDownline.length - 1) * 30)}%`}
                                                          y1="25"
                                                          x2={`${50 + ((memberDownline.length - 1) * 30)}%`}
                                                          y2="25"
                                                          stroke="#9CA3AF"
                                                          strokeWidth="2.5"
                                                        />
                                                      )}
                                                      {/* Vertical lines to each level 2 member */}
                                                      {memberDownline.map((_, childIndex) => {
                                                        if (memberDownline.length === 1) {
                                                          return (
                                                            <line
                                                              key={`line-l2-${childIndex}`}
                                                              x1="50%"
                                                              y1="25"
                                                              x2="50%"
                                                              y2="50"
                                                              stroke="#9CA3AF"
                                                              strokeWidth="2.5"
                                                            />
                                                          );
                                                        }
                                                        const spacing = 100 / (memberDownline.length - 1);
                                                        const xPos = childIndex * spacing;
                                                        return (
                                                          <line
                                                            key={`line-l2-${childIndex}`}
                                                            x1={`${xPos}%`}
                                                            y1="25"
                                                            x2={`${xPos}%`}
                                                            y2="50"
                                                            stroke="#9CA3AF"
                                                            strokeWidth="2.5"
                                                          />
                                                        );
                                                      })}
                                                    </svg>
                                                  </Box>

                                                  <HStack spacing={3} justify="center" flexWrap="wrap" mt={6}>
                                                    {memberDownline
                                                      .filter((_, idx) => levelsToShow === 0 || idx < 6)
                                                      .map((child, childIndex) => {
                                                        return (
                                                          <VStack key={child._id || childIndex} spacing={1} position="relative">
                                                            <Tooltip
                                                              label={
                                                                <Box p={3}>
                                                                  <VStack align="start" spacing={2}>
                                                                    <HStack spacing={2}>
                                                                      <Text fontWeight="600" color="white" fontSize="sm">
                                                                        {child.name}
                                                                      </Text>
                                                                      {child.isActive !== false ? (
                                                                        <Box w={2} h={2} bg="green.500" borderRadius="full" />
                                                                      ) : (
                                                                        <Box w={2} h={2} bg="gray.400" borderRadius="full" />
                                                                      )}
                                                                    </HStack>
                                                                    <Text fontSize="xs" color="gray.200">
                                                                      Level {child.currentLevel || 2}
                                                                    </Text>
                                                                    {child.email && (
                                                                      <Text fontSize="xs" color="gray.300">
                                                                        {child.email}
                                                                      </Text>
                                                                    )}
                                                                    {child.performance?.performanceScore !== undefined && (
                                                                      <VStack spacing={0} align="start" pt={2} borderTop="1px" borderColor="gray.600">
                                                                        <Text fontSize="xs" color="gray.400">Performance</Text>
                                                                        <Text fontSize="sm" fontWeight="700" color="white">
                                                                          {child.performance.performanceScore}%
                                                                        </Text>
                                                                      </VStack>
                                                                    )}
                                                                  </VStack>
                                                                </Box>
                                                              }
                                                              bg="gray.800"
                                                              color="white"
                                                              borderRadius="7px"
                                                              placement="top"
                                                              hasArrow
                                                            >
                                                              <Box
                                                                as="button"
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  openViewModal(child);
                                                                }}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                cursor="pointer"
                                                                _hover={{ transform: 'scale(1.1)' }}
                                                                transition="all 0.2s"
                                                                position="relative"
                                                                zIndex={2}
                                                              >
                                                                <Box position="relative" display="inline-block">
                                                                  <Image
                                                                    src={child.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name || 'User')}&background=3182ce&color=fff&size=128`}
                                                                    alt={child.name}
                                                                    borderRadius="7px"
                                                                    boxSize="48px"
                                                                    border="2px solid"
                                                                    borderColor={child.isActive !== false ? "green.400" : "gray.400"}
                                                                    boxShadow="0 2px 6px rgba(0,0,0,0.1)"
                                                                    objectFit="cover"
                                                                    fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(child.name || 'User')}&background=3182ce&color=fff&size=128`}
                                                                  />
                                                                  <Box
                                                                    position="absolute"
                                                                    bottom="-1px"
                                                                    right="-1px"
                                                                    w={2.5}
                                                                    h={2.5}
                                                                    bg={child.isActive !== false ? "green.500" : "gray.400"}
                                                                    borderRadius="7px"
                                                                    border="2px solid"
                                                                    borderColor="white"
                                                                  />
                                                                </Box>
                                                              </Box>
                                                            </Tooltip>
                                                            <Text fontSize="xs" color="gray.600" noOfLines={1} maxW="60px">
                                                              {child.name}
                                                            </Text>
                                                          </VStack>
                                                        );
                                                      })}
                                                  </HStack>
                                                </Box>
                                              )}
                                            </Box>
                                          );
                                        })}
                                    </SimpleGrid>
                                  </Box>
                                )}
                              </VStack>
                            </Box>
                          </Box>
                        </Card>
                        </VStack>
                      );
                    })()}
                  </Box>
                </TabPanel>

                {/* Direct Coaches Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Header with Search and Filters */}
                    <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Direct Team Coaches</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Manage and monitor your direct team members
                        </Text>
                      </VStack>
                      
                      <HStack spacing={4}>
                        <InputGroup maxW="300px">
                          <InputLeftElement>
                            <SearchIcon color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="Search coaches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg="white"
                            borderRadius="7px"
                            border="2px"
                            borderColor="gray.200"
                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                            _hover={{ borderColor: 'gray.300' }}
                          />
                        </InputGroup>
                        
                        <Select 
                          w="200px" 
                          value={performanceFilter} 
                          onChange={(e) => setPerformanceFilter(e.target.value)}
                          bg="white"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'gray.400' }}
                        >
                          <option value="all">All Coaches</option>
                          <option value="active">Active Only</option>
                          <option value="inactive">Inactive Only</option>
                          <option value="top">Top Performers</option>
                        </Select>
                        
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onAddModalOpen}>
                          Add Coach
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Enhanced Table or Cards View */}
                    {loading ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {Array(6).fill(0).map((_, i) => (
                          <Card key={i} borderRadius="7px">
                            <CardBody>
                              <VStack spacing={4}>
                                <Skeleton height="60px" width="60px" borderRadius="full" />
                                <SkeletonText noOfLines={4} spacing="4" />
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    ) : filteredDownlineData.length > 0 ? (
                      <Card borderRadius="7px" overflow="hidden" border="1px" borderColor="gray.200">
                        <TableContainer>
                          <Table variant="simple" size="md">
                            <Thead>
                              <Tr bg="gray.50">
                                <Th py={4} color="gray.700" fontWeight="bold" fontSize="sm">
                                  <Checkbox
                                    isChecked={selectedCoaches.size === filteredDownlineData.length && filteredDownlineData.length > 0}
                                    onChange={(e) => handleSelectAllCoaches(e.target.checked, filteredDownlineData)}
                                  />
                                </Th>
                                <Th py={4} color="gray.700" fontWeight="bold" fontSize="sm">COACH</Th>
                                <Th py={4} color="gray.700" fontWeight="bold" fontSize="sm">CONTACT</Th>
                                <Th py={4} color="gray.700" fontWeight="bold" fontSize="sm">LOCATION</Th>
                                <Th py={4} color="gray.700" fontWeight="bold" fontSize="sm">STATUS</Th>
                                <Th py={4} color="gray.700" fontWeight="bold" fontSize="sm">PERFORMANCE</Th>
                                <Th py={4} color="gray.700" fontWeight="bold" fontSize="sm">ACTIONS</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {filteredDownlineData.map((coach, index) => (
                                <Tr 
                                  key={coach._id || index}
                                  _hover={{ bg: 'gray.50' }}
                                  borderBottom="1px"
                                  borderColor="gray.100"
                                  bg={selectedCoaches.has(coach._id) ? 'blue.50' : 'white'}
                                >
                                  <Td py={4}>
                                    <Checkbox
                                      isChecked={selectedCoaches.has(coach._id)}
                                      onChange={() => handleSelectCoach(coach._id)}
                                    />
                                  </Td>
                                  <Td py={4}>
                                    <HStack spacing={3}>
                                      <Avatar 
                                        name={coach.name} 
                                        bg="blue.500" 
                                        color="white" 
                                        size="md"
                                        boxShadow="md"
                                      />
                                      <VStack align="start" spacing={1}>
                                        <Text fontWeight="bold" color="gray.800">{coach.name}</Text>
                                        <Text fontSize="xs" color="gray.500">Sponsor ID: {coach.sponsorId || 'N/A'}</Text>
                                        <HStack spacing={2}>
                                          <Badge colorScheme={coach.isActive ? 'green' : 'red'} size="sm" borderRadius="full">
                                            {coach.isActive ? 'Active' : 'Inactive'}
                                          </Badge>
                                          <Badge colorScheme="blue" size="sm" borderRadius="full">
                                            Level {coach.currentLevel || 1}
                                          </Badge>
                                        </HStack>
                                      </VStack>
                                    </HStack>
                                  </Td>
                                  <Td py={4}>
                                    <VStack align="start" spacing={1}>
                                      <HStack spacing={2}>
                                        <Box as={FiMail} color="blue.500" size="14px" />
                                        <Text fontSize="sm" color="gray.700">{coach.email}</Text>
                                      </HStack>
                                      <HStack spacing={2}>
                                        <Box as={FiPhone} color="green.500" size="14px" />
                                        <Text fontSize="sm" color="gray.700">{coach.phone || 'N/A'}</Text>
                                      </HStack>
                                    </VStack>
                                  </Td>
                                  <Td py={4}>
                                    <VStack align="start" spacing={1}>
                                      <Text fontSize="sm" color="gray.700">
                                        {coach.city || 'N/A'}
                                      </Text>
                                      <Text fontSize="sm" color="gray.500">
                                        {coach.country || 'N/A'}
                                      </Text>
                                    </VStack>
                                  </Td>
                                  <Td py={4}>
                                    <VStack align="start" spacing={2}>
                                      <Badge 
                                        colorScheme={coach.isActive ? 'green' : 'gray'} 
                                        variant="solid"
                                        borderRadius="7px"
                                        px={3}
                                        py={1}
                                      >
                                        {coach.isActive ? 'Active' : 'Inactive'}
                                      </Badge>
                                      <Text fontSize="xs" color="gray.500">
                                        {coach.teamRankName || 'No rank'}
                                      </Text>
                                    </VStack>
                                  </Td>
                                  <Td py={4}>
                                    {coach.performance ? (
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={2}>
                                          <CircularProgress 
                                            value={coach.performance.performanceScore || 0} 
                                            size="40px" 
                                            color="blue.400"
                                            thickness="8px"
                                          >
                                            <CircularProgressLabel fontSize="xs">
                                              {coach.performance.performanceScore || 0}
                                            </CircularProgressLabel>
                                          </CircularProgress>
                                          <VStack align="start" spacing={0}>
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">
                                              {coach.performance.performanceScore || 0}%
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                              {coach.performance.activityStreak || 0}d streak
                                            </Text>
                                          </VStack>
                                        </HStack>
                                      </VStack>
                                    ) : (
                                      <Text fontSize="sm" color="gray.400">No data</Text>
                                    )}
                                  </Td>
                                  <Td py={4}>
                                    <ButtonGroup size="sm" variant="ghost" spacing={1}>
                                      <Tooltip label="View Details">
                                        <IconButton
                                          icon={<ViewIcon />}
                                          onClick={() => openViewModal(coach)}
                                          colorScheme="blue"
                                          _hover={{ bg: 'blue.100' }}
                                        />
                                      </Tooltip>
                                      <Tooltip label="Edit Coach">
                                        <IconButton
                                          icon={<EditIcon />}
                                          onClick={() => openEditModal(coach)}
                                          colorScheme="orange"
                                          _hover={{ bg: 'orange.100' }}
                                        />
                                      </Tooltip>
                                      <Menu>
                                        <MenuButton
                                          as={IconButton}
                                          icon={<Box as={FiMoreVertical} />}
                                          variant="ghost"
                                          size="sm"
                                          _hover={{ bg: 'gray.100' }}
                                        />
                                        <MenuList>
                                          <MenuItem icon={<Box as={FiMail} />}>
                                            Send Email
                                          </MenuItem>
                                          <MenuItem icon={<ChatIcon />}>
                                            Send Message
                                          </MenuItem>
                                          <MenuDivider />
                                          <MenuItem 
                                            icon={<DeleteIcon />} 
                                            color="red.500"
                                            onClick={() => openDeleteModal(coach)}
                                          >
                                            Delete Coach
                                          </MenuItem>
                                        </MenuList>
                                      </Menu>
                                    </ButtonGroup>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Card>
                    ) : (
                      <Card bg="gray.50" borderRadius="7px" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="7px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="gray.500"
                              >
                                <Box as={FiUsers} size="32px" />
                              </Box>
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Coaches Found
                                </Text>
                                <Text color="gray.500" textAlign="center" fontSize="sm">
                                  {searchTerm || performanceFilter !== 'all' 
                                    ? 'No coaches match your current filters.' 
                                    : 'Start building your team by adding your first coach.'
                                  }
                                </Text>
                              </VStack>
                              <Button colorScheme="blue" onClick={onAddModalOpen} size="sm">
                                Add New Coach
                              </Button>
                            </VStack>
                          </Center>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>

                {/* Performance Tab - Matching Page Theme */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Header with Search and Filters */}
                    <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Team Performance Analytics</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Comprehensive insights into your team's performance and growth metrics
                        </Text>
                      </VStack>
                      
                      <HStack spacing={4}>
                        <Select 
                          w="200px" 
                          value={performanceFilter} 
                          onChange={(e) => setPerformanceFilter(e.target.value)}
                          bg="white"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'gray.400' }}
                        >
                          <option value="all">🌍 All Members</option>
                          <option value="top">⭐ Top Performers</option>
                          <option value="active">🔥 Active Only</option>
                          <option value="inactive">⚠️ Needs Attention</option>
                        </Select>
                        
                        <Button 
                          leftIcon={<RepeatIcon />} 
                          colorScheme="blue" 
                          onClick={fetchTeamPerformance}
                          isLoading={loading}
                        >
                          Refresh Data
                        </Button>
                      </HStack>
                    </Flex>
                    {loading ? (
                      <VStack spacing={6}>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                          {[1, 2, 3, 4].map((i) => (
                            <Card key={i} borderRadius="7px" border="1px" borderColor="gray.200">
                              <CardBody>
                                <Skeleton height="120px" />
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>
                        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                          {[1, 2, 3].map((i) => (
                            <Card key={i} borderRadius="7px" border="1px" borderColor="gray.200">
                              <CardBody>
                                <Skeleton height="200px" />
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>
                      </VStack>
                    ) : teamPerformance ? (
                      <VStack spacing={6} align="stretch">
                        {/* Performance Overview Cards */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                          <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                            <CardBody textAlign="center" p={6}>
                              <VStack spacing={3}>
                                <Box p={3} bg="blue.50" borderRadius="full">
                                  <Text fontSize="2xl">👥</Text>
                                </Box>
                                <Stat>
                                  <StatLabel color="gray.600" fontSize="sm">TEAM SIZE</StatLabel>
                                  <StatNumber color="gray.800" fontSize="3xl" fontWeight="bold">
                                    {teamPerformance.totalTeamSize || 0}
                                  </StatNumber>
                                  <StatHelpText color="gray.500">Total Members</StatHelpText>
                                </Stat>
                              </VStack>
                            </CardBody>
                          </Card>
                          
                          <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                            <CardBody textAlign="center" p={6}>
                              <VStack spacing={3}>
                                <Box p={3} bg="purple.50" borderRadius="full">
                                  <Text fontSize="2xl">🎯</Text>
                                </Box>
                                <Stat>
                                  <StatLabel color="gray.600" fontSize="sm">TOTAL LEADS</StatLabel>
                                  <StatNumber color="gray.800" fontSize="3xl" fontWeight="bold">
                                    {teamPerformance.totalLeads || 0}
                                  </StatNumber>
                                  <StatHelpText color="gray.500">This Month</StatHelpText>
                                </Stat>
                              </VStack>
                            </CardBody>
                          </Card>
                          
                          <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                            <CardBody textAlign="center" p={6}>
                              <VStack spacing={3}>
                                <Box p={3} bg="green.50" borderRadius="full">
                                  <Text fontSize="2xl">💰</Text>
                                </Box>
                                <Stat>
                                  <StatLabel color="gray.600" fontSize="sm">TOTAL SALES</StatLabel>
                                  <StatNumber color="gray.800" fontSize="3xl" fontWeight="bold">
                                    {teamPerformance.totalSales || 0}
                                  </StatNumber>
                                  <StatHelpText color="gray.500">Completed</StatHelpText>
                                </Stat>
                              </VStack>
                            </CardBody>
                          </Card>
                          
                          <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                            <CardBody textAlign="center" p={6}>
                              <VStack spacing={3}>
                                <Box p={3} bg="yellow.50" borderRadius="full">
                                  <Text fontSize="2xl">💵</Text>
                                </Box>
                                <Stat>
                                  <StatLabel color="gray.600" fontSize="sm">REVENUE</StatLabel>
                                  <StatNumber color="gray.800" fontSize="3xl" fontWeight="bold">
                                    ${(teamPerformance.totalRevenue || 0).toLocaleString()}
                                  </StatNumber>
                                  <StatHelpText color="gray.500">Monthly</StatHelpText>
                                </Stat>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Performance Analytics */}
                        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                          {/* Performance Distribution */}
                          <Card borderRadius="7px" border="1px" borderColor="gray.200">
                            <CardHeader>
                              <Heading size="md" color="gray.800">Performance Distribution</Heading>
                              <Text fontSize="sm" color="gray.600">Team performance breakdown</Text>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={4} align="stretch">
                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Top Performers (80-100%)</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="green.600">
                                      {teamPerformance.memberDetails ? 
                                        teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 80).length
                                        : 0}
                                    </Text>
                                  </HStack>
                                  <Progress 
                                    value={teamPerformance.memberDetails ? 
                                      (teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 80).length / teamPerformance.memberDetails.length) * 100
                                      : 0} 
                                    colorScheme="green" 
                                    size="lg" 
                                    borderRadius="7px"
                                  />
                                </Box>

                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Average Performers (40-79%)</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="yellow.600">
                                      {teamPerformance.memberDetails ? 
                                        teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 40 && (m.performance?.score || 0) < 80).length
                                        : 0}
                                    </Text>
                                  </HStack>
                                  <Progress 
                                    value={teamPerformance.memberDetails ? 
                                      (teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 40 && (m.performance?.score || 0) < 80).length / teamPerformance.memberDetails.length) * 100
                                      : 0} 
                                    colorScheme="yellow" 
                                    size="lg" 
                                    borderRadius="7px"
                                  />
                                </Box>

                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Needs Support (0-39%)</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="red.600">
                                      {teamPerformance.memberDetails ? 
                                        teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) < 40).length
                                        : 0}
                                    </Text>
                                  </HStack>
                                  <Progress 
                                    value={teamPerformance.memberDetails ? 
                                      (teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) < 40).length / teamPerformance.memberDetails.length) * 100
                                      : 0} 
                                    colorScheme="red" 
                                    size="lg" 
                                    borderRadius="7px"
                                  />
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>

                          {/* Key Metrics */}
                          <Card borderRadius="7px" border="1px" borderColor="gray.200">
                            <CardHeader>
                              <Heading size="md" color="gray.800">Key Performance Metrics</Heading>
                              <Text fontSize="sm" color="gray.600">Critical business indicators</Text>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={4} align="stretch">
                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Conversion Rate</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="blue.600">
                                      {teamPerformance.totalLeads > 0 
                                        ? ((teamPerformance.totalSales / teamPerformance.totalLeads) * 100).toFixed(1)
                                        : 0}%
                                    </Text>
                                  </HStack>
                                  <Progress 
                                    value={teamPerformance.totalLeads > 0 
                                      ? (teamPerformance.totalSales / teamPerformance.totalLeads) * 100
                                      : 0} 
                                    colorScheme="blue" 
                                    size="lg" 
                                    borderRadius="7px"
                                  />
                                </Box>

                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Team Activity Rate</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="purple.600">
                                      {teamPerformance.memberDetails ? 
                                        Math.round((teamPerformance.memberDetails.filter(m => m.performance?.isActive).length / teamPerformance.memberDetails.length) * 100)
                                        : 0}%
                                    </Text>
                                  </HStack>
                                  <Progress 
                                    value={teamPerformance.memberDetails ? 
                                      (teamPerformance.memberDetails.filter(m => m.performance?.isActive).length / teamPerformance.memberDetails.length) * 100
                                      : 0} 
                                    colorScheme="purple" 
                                    size="lg" 
                                    borderRadius="7px"
                                  />
                                </Box>

                                <Box textAlign="center" p={4} bg="gray.50" borderRadius="7px">
                                  <Text fontSize="xs" color="gray.500" mb={1}>AVERAGE DEAL SIZE</Text>
                                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                    ${teamPerformance.totalSales > 0 
                                      ? (teamPerformance.totalRevenue / teamPerformance.totalSales).toFixed(0)
                                      : 0}
                                  </Text>
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>

                          {/* Performance Trends */}
                          <Card borderRadius="7px" border="1px" borderColor="gray.200">
                            <CardHeader>
                              <Heading size="md" color="gray.800">Performance Trends</Heading>
                              <Text fontSize="sm" color="gray.600">Monthly growth indicators</Text>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={4} align="stretch">
                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Revenue Growth</Text>
                                    <Badge colorScheme="green" fontSize="xs">+22%</Badge>
                                  </HStack>
                                  <Progress value={75} colorScheme="green" size="lg" borderRadius="7px" />
                                </Box>

                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Team Expansion</Text>
                                    <Badge colorScheme="blue" fontSize="xs">+12%</Badge>
                                  </HStack>
                                  <Progress value={60} colorScheme="blue" size="lg" borderRadius="7px" />
                                </Box>

                                <Box>
                                  <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600" color="gray.700">Lead Quality</Text>
                                    <Badge colorScheme="purple" fontSize="xs">+8%</Badge>
                                  </HStack>
                                  <Progress value={85} colorScheme="purple" size="lg" borderRadius="7px" />
                                </Box>

                                <Box p={4} bg="orange.50" borderRadius="7px" textAlign="center">
                                  <Text fontSize="xs" color="orange.600" mb={1} fontWeight="600">PERFORMANCE SCORE</Text>
                                  <Text fontSize="3xl" fontWeight="bold" color="orange.500">87.5</Text>
                                  <Text fontSize="xs" color="orange.500" mt={1}>Excellent</Text>
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Team Performance Table */}
                        <Card borderRadius="7px" border="1px" borderColor="gray.200">
                          <CardHeader>
                            <Flex justify="space-between" align="center">
                              <Heading size="md" color="gray.800">Team Member Performance</Heading>
                              <Badge colorScheme="blue" variant="solid">
                                {teamPerformance.memberDetails?.length || 0} Members
                              </Badge>
                            </Flex>
                          </CardHeader>
                          <CardBody>
                            <TableContainer>
                              <Table variant="simple" size="sm">
                                <Thead>
                                  <Tr>
                                    <Th>Coach Name</Th>
                                    <Th>Performance Score</Th>
                                    <Th>Leads</Th>
                                    <Th>Sales</Th>
                                    <Th>Revenue</Th>
                                    <Th>Status</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {teamPerformance.memberDetails?.map((member, index) => (
                                    <Tr key={member.coachId || index}>
                                      <Td>
                                        <VStack align="start" spacing={0}>
                                          <Text fontSize="sm" fontWeight="bold">{member.name}</Text>
                                          <Text fontSize="xs" color="gray.500">{member.email}</Text>
                                        </VStack>
                                      </Td>
                                      <Td>
                                        <HStack spacing={2}>
                                          <CircularProgress
                                            value={member.performance?.score || 0}
                                            size="30px"
                                            color={member.performance?.score >= 80 ? 'green.400' : 
                                                   member.performance?.score >= 40 ? 'yellow.400' : 'red.400'}
                                            thickness="6px"
                                          >
                                            <CircularProgressLabel fontSize="10px" fontWeight="bold">
                                              {member.performance?.score || 0}
                                            </CircularProgressLabel>
                                          </CircularProgress>
                                          <Text fontSize="xs" color="gray.600">
                                            {member.performance?.score >= 80 ? 'Excellent' :
                                             member.performance?.score >= 40 ? 'Good' : 'Needs Help'}
                                          </Text>
                                        </HStack>
                                      </Td>
                                      <Td>
                                        <VStack align="start" spacing={0}>
                                          <Text fontSize="sm" fontWeight="bold">{member.leads?.total || 0}</Text>
                                          <Text fontSize="xs" color="green.600">
                                            {member.leads?.converted || 0} converted
                                          </Text>
                                        </VStack>
                                      </Td>
                                      <Td>
                                        <VStack align="start" spacing={0}>
                                          <Text fontSize="sm" fontWeight="bold">{member.sales?.total || 0}</Text>
                                          <Text fontSize="xs" color="blue.600">
                                            {(member.leads?.total > 0 ? 
                                              ((member.leads?.converted || 0) / member.leads?.total * 100) : 0).toFixed(1)}% rate
                                          </Text>
                                        </VStack>
                                      </Td>
                                      <Td>
                                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                                          ${member.revenue?.total || 0}
                                        </Text>
                                      </Td>
                                      <Td>
                                        <Badge 
                                          colorScheme={member.performance?.isActive ? 'green' : 'red'}
                                          fontSize="xs"
                                        >
                                          {member.performance?.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </CardBody>
                        </Card>
                      </VStack>
                    ) : (
                      <Card bg="gray.50" borderRadius="7px" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="7px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="gray.500"
                              >
                                <Text fontSize="3xl">📊</Text>
                              </Box>
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Performance Data Available
                                </Text>
                                <Text color="gray.500" textAlign="center" fontSize="sm">
                                  Performance analytics will appear once your team starts generating activity and sales data.
                                </Text>
                              </VStack>
                              <Button 
                                colorScheme="blue" 
                                onClick={fetchTeamPerformance}
                                isLoading={loading}
                                leftIcon={<RepeatIcon />}
                              >
                                Load Performance Data
                              </Button>
                            </VStack>
                          </Center>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>

                {/* Performance Tab - Enhanced with Sub-tabs */}
                <TabPanel p={0}>
                  <Box p={6}>
                    <Tabs index={performanceSubTab} onChange={setPerformanceSubTab} colorScheme="blue">
                      <TabList borderBottom="1px" borderColor="gray.200" mb={4}>
                        <Tab fontSize="sm" fontWeight="500">Overview</Tab>
                        <Tab fontSize="sm" fontWeight="500">Coach Performance</Tab>
                        <Tab fontSize="sm" fontWeight="500">Sales Performance</Tab>
                        <Tab fontSize="sm" fontWeight="500">Client Performance</Tab>
                        <Tab fontSize="sm" fontWeight="500">Lead Performance</Tab>
                      </TabList>
                      <TabPanels>
                        {/* Overview Sub-tab - Existing team performance */}
                        <TabPanel p={0}>
                          <VStack spacing={6} align="stretch">
                            <Flex justify="space-between" align="center">
                              <VStack align="start" spacing={1}>
                                <HStack spacing={2}>
                                  <Heading size="md" color="gray.800">Team Performance Analytics</Heading>
                                  <HStack spacing={1}>
                                    <Box w="2" h="2" bg="green.500" borderRadius="full" animation="pulse 2s infinite" />
                                    <Text fontSize="xs" color="green.600" fontWeight="bold">LIVE</Text>
                                  </HStack>
                                </HStack>
                                <Text fontSize="sm" color="gray.600">
                                  Comprehensive insights into your team's performance and growth • Auto-refreshes every 30 seconds
                                </Text>
                              </VStack>
                              <HStack spacing={3}>
                                <Select w="200px" value={performanceFilter} onChange={(e) => setPerformanceFilter(e.target.value)}>
                                  <option value="all">🌍 All Members</option>
                                  <option value="top">⭐ Top Performers</option>
                                  <option value="active">✅ Active Only</option>
                                  <option value="inactive">⚠️ Needs Attention</option>
                                </Select>
                                <Button 
                                  variant="outline" 
                                  onClick={fetchTeamPerformance} 
                                  isLoading={loading}
                                  leftIcon={<RepeatIcon />}
                                  colorScheme="blue"
                                >
                                  🔄 Refresh Data
                                </Button>
                              </HStack>
                            </Flex>

                            {loading ? (
                              <VStack spacing={4}>
                                <Skeleton height="200px" borderRadius="7px" />
                                <SimpleGrid columns={3} spacing={4} w="100%">
                                  <Skeleton height="150px" borderRadius="7px" />
                                  <Skeleton height="150px" borderRadius="7px" />
                                  <Skeleton height="150px" borderRadius="7px" />
                                </SimpleGrid>
                              </VStack>
                            ) : teamPerformance ? (
                              <VStack spacing={6} align="stretch">
                                {/* Performance Overview Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                  <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" borderRadius="7px" boxShadow="lg">
                                    <CardBody textAlign="center" p={6}>
                                      <VStack spacing={3}>
                                        <Box p={3} bg="white" borderRadius="full">
                                          <Text fontSize="2xl" color="blue.600">●</Text>
                                        </Box>
                                        <Stat>
                                          <StatLabel color="white" fontSize="sm">TEAM SIZE</StatLabel>
                                          <StatNumber color="white" fontSize="3xl">
                                            {teamPerformance.totalTeamSize || 0}
                                          </StatNumber>
                                          <StatHelpText color="white" opacity={0.8}>Total Members</StatHelpText>
                                        </Stat>
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white" borderRadius="7px" boxShadow="lg">
                                    <CardBody textAlign="center" p={6}>
                                      <VStack spacing={3}>
                                        <Box p={3} bg="white" borderRadius="full">
                                          <Text fontSize="2xl" color="pink.500">●</Text>
                                        </Box>
                                        <Stat>
                                          <StatLabel color="white" fontSize="sm">TOTAL LEADS</StatLabel>
                                          <StatNumber color="white" fontSize="3xl">
                                            {teamPerformance.totalLeads || 0}
                                          </StatNumber>
                                          <StatHelpText color="white" opacity={0.8}>This Month</StatHelpText>
                                        </Stat>
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white" borderRadius="7px" boxShadow="lg">
                                    <CardBody textAlign="center" p={6}>
                                      <VStack spacing={3}>
                                        <Box p={3} bg="white" borderRadius="full">
                                          <Text fontSize="2xl" color="blue.400">●</Text>
                                        </Box>
                                        <Stat>
                                          <StatLabel color="white" fontSize="sm">TOTAL SALES</StatLabel>
                                          <StatNumber color="white" fontSize="3xl">
                                            {teamPerformance.totalSales || 0}
                                          </StatNumber>
                                          <StatHelpText color="white" opacity={0.8}>Completed</StatHelpText>
                                        </Stat>
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" color="white" borderRadius="7px" boxShadow="lg">
                                    <CardBody textAlign="center" p={6}>
                                      <VStack spacing={3}>
                                        <Box p={3} bg="white" borderRadius="full">
                                          <Text fontSize="2xl" color="green.400">●</Text>
                                        </Box>
                                        <Stat>
                                          <StatLabel color="white" fontSize="sm">REVENUE</StatLabel>
                                          <StatNumber color="white" fontSize="3xl">
                                            ${(teamPerformance.totalRevenue || 0).toLocaleString()}
                                          </StatNumber>
                                          <StatHelpText color="white" opacity={0.8}>Monthly</StatHelpText>
                                        </Stat>
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                </SimpleGrid>

                                {/* Performance Charts and Analytics */}
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                  <Card borderRadius="7px" boxShadow="md">
                                    <CardHeader>
                                      <Heading size="md" color="gray.800">Performance Distribution</Heading>
                                    </CardHeader>
                                    <CardBody>
                                      <VStack spacing={4} align="stretch">
                                        <Box>
                                          <HStack justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">High Performers (80-100%)</Text>
                                            <Text fontSize="sm" fontWeight="bold" color="green.600">
                                              {teamPerformance.memberDetails ? 
                                                teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 80).length
                                                : 0}
                                            </Text>
                                          </HStack>
                                          <Progress 
                                            value={teamPerformance.memberDetails ? 
                                              (teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 80).length / teamPerformance.memberDetails.length) * 100
                                              : 0} 
                                            colorScheme="green" 
                                            size="lg" 
                                            borderRadius="7px"
                                          />
                                        </Box>

                                        <Box>
                                          <HStack justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">Medium Performers (40-79%)</Text>
                                            <Text fontSize="sm" fontWeight="bold" color="yellow.600">
                                              {teamPerformance.memberDetails ? 
                                                teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 40 && (m.performance?.score || 0) < 80).length
                                                : 0}
                                            </Text>
                                          </HStack>
                                          <Progress 
                                            value={teamPerformance.memberDetails ? 
                                              (teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) >= 40 && (m.performance?.score || 0) < 80).length / teamPerformance.memberDetails.length) * 100
                                              : 0} 
                                            colorScheme="yellow" 
                                            size="lg" 
                                            borderRadius="7px"
                                          />
                                        </Box>

                                        <Box>
                                          <HStack justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">Needs Support (0-39%)</Text>
                                            <Text fontSize="sm" fontWeight="bold" color="red.600">
                                              {teamPerformance.memberDetails ? 
                                                teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) < 40).length
                                                : 0}
                                            </Text>
                                          </HStack>
                                          <Progress 
                                            value={teamPerformance.memberDetails ? 
                                              (teamPerformance.memberDetails.filter(m => (m.performance?.score || 0) < 40).length / teamPerformance.memberDetails.length) * 100
                                              : 0} 
                                            colorScheme="red" 
                                            size="lg" 
                                            borderRadius="7px"
                                          />
                                        </Box>
                                      </VStack>
                                    </CardBody>
                                  </Card>

                                  <Card borderRadius="7px" boxShadow="md">
                                    <CardHeader>
                                      <Heading size="md" color="gray.800">Key Metrics</Heading>
                                    </CardHeader>
                                    <CardBody>
                                      <VStack spacing={4} align="stretch">
                                        <Box>
                                          <HStack justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">Conversion Rate</Text>
                                            <Text fontSize="sm" fontWeight="bold" color="blue.600">
                                              {teamPerformance.totalLeads > 0 
                                                ? ((teamPerformance.totalSales / teamPerformance.totalLeads) * 100).toFixed(1)
                                                : 0}%
                                            </Text>
                                          </HStack>
                                          <Progress 
                                            value={teamPerformance.totalLeads > 0 
                                              ? (teamPerformance.totalSales / teamPerformance.totalLeads) * 100
                                              : 0} 
                                            colorScheme="blue" 
                                            size="lg" 
                                            borderRadius="7px"
                                          />
                                        </Box>

                                        <Box>
                                          <HStack justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="bold" color="gray.700">Team Activity</Text>
                                            <Text fontSize="sm" fontWeight="bold" color="purple.600">
                                              {teamPerformance.memberDetails ? 
                                                Math.round((teamPerformance.memberDetails.filter(m => m.performance?.isActive).length / teamPerformance.memberDetails.length) * 100)
                                                : 0}%
                                            </Text>
                                          </HStack>
                                          <Progress 
                                            value={teamPerformance.memberDetails ? 
                                              (teamPerformance.memberDetails.filter(m => m.performance?.isActive).length / teamPerformance.memberDetails.length) * 100
                                              : 0} 
                                            colorScheme="purple" 
                                            size="lg" 
                                            borderRadius="7px"
                                          />
                                        </Box>

                                        <Box textAlign="center" p={4} bg="gray.50" borderRadius="7px">
                                          <Text fontSize="xs" color="gray.500" mb={1}>AVERAGE DEAL SIZE</Text>
                                          <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                            ${teamPerformance.totalSales > 0 
                                              ? (teamPerformance.totalRevenue / teamPerformance.totalSales).toFixed(0)
                                              : 0}
                                          </Text>
                                        </Box>
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                </SimpleGrid>

                                {/* Performance Insights */}
                                <Card borderRadius="7px" boxShadow="md" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                                  <CardBody color="white">
                                    <Heading size="md" mb={4} color="white">📊 Performance Insights</Heading>
                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={2}>
                                          <Box as={FiTrendingUp} color="green.300" />
                                          <Text fontSize="sm" fontWeight="bold" color="green.300">TOP PERFORMER</Text>
                                        </HStack>
                                        <Text fontSize="lg" fontWeight="bold" color="white">
                                          {teamPerformance.topPerformers?.[0]?.name || 'N/A'}
                                        </Text>
                                        <Text fontSize="xs" color="white" opacity={0.8}>
                                          Score: {teamPerformance.topPerformers?.[0]?.performance?.score || 0}%
                                        </Text>
                                      </VStack>
                                      
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={2}>
                                          <Box as={FiTarget} color="yellow.300" />
                                          <Text fontSize="sm" fontWeight="bold" color="yellow.300">TEAM AVG SCORE</Text>
                                        </HStack>
                                        <Text fontSize="lg" fontWeight="bold" color="white">
                                          {teamPerformance.averagePerformanceScore?.toFixed(1) || 0}%
                                        </Text>
                                        <Text fontSize="xs" color="white" opacity={0.8}>
                                          Across {teamPerformance.totalTeamSize || 0} members
                                        </Text>
                                      </VStack>
                                      
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={2}>
                                          <Box as={FiUsers} color="blue.300" />
                                          <Text fontSize="sm" fontWeight="bold" color="blue.300">ACTIVE RATE</Text>
                                        </HStack>
                                        <Text fontSize="lg" fontWeight="bold" color="white">
                                          {teamPerformance.memberDetails ? 
                                            Math.round((teamPerformance.memberDetails.filter(m => m.performance?.isActive).length / teamPerformance.memberDetails.length) * 100)
                                            : 0}%
                                        </Text>
                                        <Text fontSize="xs" color="white" opacity={0.8}>
                                          {teamPerformance.activeCoaches || 0} of {teamPerformance.totalTeamSize || 0} active
                                        </Text>
                                      </VStack>
                                    </SimpleGrid>
                                  </CardBody>
                                </Card>

                                {/* Team Member Performance Table */}
                                <Card borderRadius="7px" boxShadow="md">
                                  <CardHeader>
                                    <Flex justify="space-between" align="center">
                                      <Heading size="md" color="gray.800">Team Member Performance</Heading>
                                      <Badge colorScheme="blue" variant="solid">
                                        {teamPerformance.memberDetails?.length || 0} Members
                                      </Badge>
                                    </Flex>
                                  </CardHeader>
                                  <CardBody>
                                    <TableContainer>
                                      <Table variant="simple" size="sm">
                                        <Thead>
                                          <Tr>
                                            <Th>Coach Name</Th>
                                            <Th>Performance Score</Th>
                                            <Th>Leads</Th>
                                            <Th>Sales</Th>
                                            <Th>Revenue</Th>
                                            <Th>Status</Th>
                                            <Th>Level</Th>
                                          </Tr>
                                        </Thead>
                                        <Tbody>
                                          {teamPerformance.memberDetails?.map((member, index) => (
                                            <Tr key={member.coachId || index}>
                                              <Td>
                                                <VStack align="start" spacing={0}>
                                                  <Text fontSize="sm" fontWeight="bold">{member.name}</Text>
                                                  <Text fontSize="xs" color="gray.500">{member.email}</Text>
                                                </VStack>
                                              </Td>
                                              <Td>
                                                <HStack spacing={2}>
                                                  <CircularProgress
                                                    value={member.performance?.score || 0}
                                                    size="30px"
                                                    color={member.performance?.score >= 80 ? 'green.400' : 
                                                           member.performance?.score >= 40 ? 'yellow.400' : 'red.400'}
                                                    thickness="6px"
                                                  >
                                                    <CircularProgressLabel fontSize="10px" fontWeight="bold">
                                                      {member.performance?.score || 0}
                                                    </CircularProgressLabel>
                                                  </CircularProgress>
                                                  <Text fontSize="xs" color="gray.600">
                                                    {member.performance?.score >= 80 ? 'Excellent' :
                                                     member.performance?.score >= 40 ? 'Good' : 'Needs Help'}
                                                  </Text>
                                                </HStack>
                                              </Td>
                                              <Td>
                                                <VStack align="start" spacing={0}>
                                                  <Text fontSize="sm" fontWeight="bold">{member.leads?.total || 0}</Text>
                                                  <Text fontSize="xs" color="green.600">
                                                    {member.leads?.converted || 0} converted
                                                  </Text>
                                                </VStack>
                                              </Td>
                                              <Td>
                                                <VStack align="start" spacing={0}>
                                                  <Text fontSize="sm" fontWeight="bold">{member.sales?.total || 0}</Text>
                                                  <Text fontSize="xs" color="blue.600">
                                                    {(member.leads?.total > 0 ? 
                                                      ((member.leads?.converted || 0) / member.leads?.total * 100) : 0).toFixed(1)}% rate
                                                  </Text>
                                                </VStack>
                                              </Td>
                                              <Td>
                                                <Text fontSize="sm" fontWeight="bold" color="green.600">
                                                  ${(member.sales?.revenue || 0).toLocaleString()}
                                                </Text>
                                              </Td>
                                              <Td>
                                                <Badge 
                                                  colorScheme={member.performance?.isActive ? 'green' : 'orange'} 
                                                  variant="solid"
                                                  fontSize="xs"
                                                >
                                                  {member.performance?.isActive ? 'ACTIVE' : 'IDLE'}
                                                </Badge>
                                              </Td>
                                              <Td>
                                                <Badge 
                                                  colorScheme="blue" 
                                                  variant="outline"
                                                  fontSize="xs"
                                                >
                                                  {member.performance?.level || 'Beginner'}
                                                </Badge>
                                              </Td>
                                            </Tr>
                                          ))}
                                        </Tbody>
                                      </Table>
                                    </TableContainer>
                                  </CardBody>
                                </Card>
                              </VStack>
                            ) : (
                              <Card bg="gray.50" borderRadius="7px" border="2px dashed" borderColor="gray.300">
                                <CardBody py={12}>
                                  <Center>
                                    <VStack spacing={4}>
                                      <Box
                                        w="80px"
                                        h="80px"
                                        bg="gray.200"
                                        borderRadius="7px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        color="gray.500"
                                      >
                                        <Box as={FiBarChart2} size="32px" />
                                      </Box>
                                      <VStack spacing={2}>
                                        <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                          No Performance Data
                                        </Text>
                                        <Text color="gray.500" textAlign="center" fontSize="sm">
                                          Performance metrics will appear once your team starts generating activity.
                                        </Text>
                                      </VStack>
                                    </VStack>
                                  </Center>
                                </CardBody>
                              </Card>
                            )}
                          </VStack>
                        </TabPanel>
                        
                        {/* Coach Performance Sub-tab */}
                        <TabPanel p={6}>
                          <VStack spacing={6} align="stretch">
                            <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                              <VStack align="start" spacing={1}>
                                <Heading size="md" color="gray.800">Coach Performance Analytics</Heading>
                                <Text fontSize="sm" color="gray.600">
                                  Individual coach performance metrics, productivity analysis, and ranking system
                                </Text>
                              </VStack>
                              
                              <HStack spacing={4}>
                                <Select 
                                  w="180px" 
                                  bg="white"
                                  borderColor="gray.300"
                                  _hover={{ borderColor: 'gray.400' }}
                                >
                                  <option value="all">🌍 All Coaches</option>
                                  <option value="top">⭐ Top Performers</option>
                                  <option value="active">✅ Active Coaches</option>
                                  <option value="new">🆕 New Coaches</option>
                                </Select>
                                
                                <Button 
                                  leftIcon={<RepeatIcon />} 
                                  variant="outline" 
                                  colorScheme="gray"
                                >
                                  Refresh
                                </Button>
                              </HStack>
                            </Flex>

                            {/* Coach Performance Overview */}
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="blue.600">👥</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">TOTAL COACHES</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">48</StatNumber>
                                    <StatHelpText color="green.600">+6 this month</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="green.600">⭐</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">TOP PERFORMERS</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">12</StatNumber>
                                    <StatHelpText color="green.600">25% of team</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="purple.600">📈</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">AVG SCORE</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">82.4</StatNumber>
                                    <StatHelpText color="green.600">+3.2 points</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="orange.600">🎯</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">PRODUCTIVITY</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">94%</StatNumber>
                                    <StatHelpText color="green.600">Excellent</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                            </SimpleGrid>

                            {/* Coach Performance Table */}
                            <Card borderRadius="7px" border="1px" borderColor="gray.200">
                              <CardHeader>
                                <Heading size="md" color="gray.800">Coach Performance Rankings</Heading>
                              </CardHeader>
                              <CardBody>
                                <TableContainer>
                                  <Table variant="simple" size="sm">
                                    <Thead>
                                      <Tr>
                                        <Th>Coach</Th>
                                        <Th>Score</Th>
                                        <Th>Team Size</Th>
                                        <Th>Sales</Th>
                                        <Th>Revenue</Th>
                                        <Th>Status</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {[
                                        { name: "Sarah Johnson", email: "sarah@example.com", score: 94, teamSize: 12, sales: 48, revenue: "$18,420", status: "active" },
                                        { name: "Michael Chen", email: "michael@example.com", score: 89, teamSize: 8, sales: 32, revenue: "$12,340", status: "active" },
                                        { name: "Emily Davis", email: "emily@example.com", score: 87, teamSize: 10, sales: 41, revenue: "$15,680", status: "active" },
                                        { name: "Robert Wilson", email: "robert@example.com", score: 76, teamSize: 6, sales: 24, revenue: "$8,920", status: "active" },
                                        { name: "Lisa Anderson", email: "lisa@example.com", score: 71, teamSize: 5, sales: 19, revenue: "$6,840", status: "idle" },
                                      ].map((coach, index) => (
                                        <Tr key={index}>
                                          <Td>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="bold">{coach.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{coach.email}</Text>
                                            </VStack>
                                          </Td>
                                          <Td>
                                            <HStack spacing={2}>
                                              <CircularProgress
                                                value={coach.score}
                                                size="30px"
                                                color={coach.score >= 90 ? 'green.400' : 
                                                       coach.score >= 80 ? 'blue.400' : 
                                                       coach.score >= 70 ? 'yellow.400' : 'red.400'}
                                                thickness="6px"
                                              >
                                                <CircularProgressLabel fontSize="10px" fontWeight="bold">
                                                  {coach.score}
                                                </CircularProgressLabel>
                                              </CircularProgress>
                                              <Text fontSize="xs" color="gray.600">
                                                {coach.score >= 90 ? 'Elite' :
                                                 coach.score >= 80 ? 'Excellent' :
                                                 coach.score >= 70 ? 'Good' : 'Needs Help'}
                                              </Text>
                                            </HStack>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold">{coach.teamSize}</Text>
                                            <Text fontSize="xs" color="gray.500">members</Text>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold">{coach.sales}</Text>
                                            <Text fontSize="xs" color="blue.600">this month</Text>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold" color="green.600">{coach.revenue}</Text>
                                          </Td>
                                          <Td>
                                            <Badge 
                                              colorScheme={coach.status === 'active' ? 'green' : 'orange'}
                                              fontSize="xs"
                                            >
                                              {coach.status.toUpperCase()}
                                            </Badge>
                                          </Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </CardBody>
                            </Card>
                          </VStack>
                        </TabPanel>
                        
                        {/* Sales Performance Sub-tab */}
                        <TabPanel p={6}>
                          <VStack spacing={6} align="stretch">
                            <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                              <VStack align="start" spacing={1}>
                                <Heading size="md" color="gray.800">Sales Performance Analytics</Heading>
                                <Text fontSize="sm" color="gray.600">
                                  Revenue tracking, conversion analysis, and sales team performance metrics
                                </Text>
                              </VStack>
                              
                              <HStack spacing={4}>
                                <Select 
                                  w="180px" 
                                  bg="white"
                                  borderColor="gray.300"
                                  _hover={{ borderColor: 'gray.400' }}
                                >
                                  <option value="all">📊 All Sales</option>
                                  <option value="month">📅 This Month</option>
                                  <option value="quarter">📆 This Quarter</option>
                                  <option value="year">📈 This Year</option>
                                </Select>
                                
                                <Button 
                                  leftIcon={<RepeatIcon />} 
                                  variant="outline" 
                                  colorScheme="gray"
                                >
                                  Refresh
                                </Button>
                              </HStack>
                            </Flex>

                            {/* Sales Performance Overview */}
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="green.600">💰</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">TOTAL REVENUE</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">$89,420</StatNumber>
                                    <StatHelpText color="green.600">+18.2% vs last month</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="blue.600">📈</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">CONVERSION RATE</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">28.4%</StatNumber>
                                    <StatHelpText color="green.600">+4.1% improvement</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="purple.600">🎯</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">TOTAL DEALS</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">156</StatNumber>
                                    <StatHelpText color="green.600">+24 this month</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="orange.600">💵</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">AVG DEAL SIZE</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">$573</StatNumber>
                                    <StatHelpText color="green.600">+$82 increase</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                            </SimpleGrid>

                            {/* Sales Performance Table */}
                            <Card borderRadius="7px" border="1px" borderColor="gray.200">
                              <CardHeader>
                                <Heading size="md" color="gray.800">Sales Team Performance</Heading>
                              </CardHeader>
                              <CardBody>
                                <TableContainer>
                                  <Table variant="simple" size="sm">
                                    <Thead>
                                      <Tr>
                                        <Th>Sales Person</Th>
                                        <Th>Deals</Th>
                                        <Th>Revenue</Th>
                                        <Th>Conversion</Th>
                                        <Th>Avg Deal</Th>
                                        <Th>Trend</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {[
                                        { name: "Sarah Johnson", email: "sarah@example.com", deals: 24, revenue: "$18,420", conversion: "32%", avgDeal: "$768", trend: "up" },
                                        { name: "Michael Chen", email: "michael@example.com", deals: 18, revenue: "$12,340", conversion: "28%", avgDeal: "$686", trend: "up" },
                                        { name: "Emily Davis", email: "emily@example.com", deals: 21, revenue: "$15,680", conversion: "31%", avgDeal: "$747", trend: "stable" },
                                        { name: "Robert Wilson", email: "robert@example.com", deals: 15, revenue: "$8,920", conversion: "24%", avgDeal: "$595", trend: "down" },
                                        { name: "Lisa Anderson", email: "lisa@example.com", deals: 12, revenue: "$6,840", conversion: "19%", avgDeal: "$570", trend: "up" },
                                      ].map((sales, index) => (
                                        <Tr key={index}>
                                          <Td>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="bold">{sales.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{sales.email}</Text>
                                            </VStack>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold">{sales.deals}</Text>
                                            <Text fontSize="xs" color="blue.600">this month</Text>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold" color="green.600">{sales.revenue}</Text>
                                          </Td>
                                          <Td>
                                            <HStack spacing={2}>
                                              <Text fontSize="sm" fontWeight="bold">{sales.conversion}</Text>
                                              <Badge 
                                                colorScheme={parseFloat(sales.conversion) >= 30 ? 'green' : 
                                                           parseFloat(sales.conversion) >= 25 ? 'blue' : 'yellow'}
                                                fontSize="xs"
                                              >
                                                {parseFloat(sales.conversion) >= 30 ? 'Excellent' :
                                                 parseFloat(sales.conversion) >= 25 ? 'Good' : 'Average'}
                                              </Badge>
                                            </HStack>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold">{sales.avgDeal}</Text>
                                          </Td>
                                          <Td>
                                            <HStack spacing={1}>
                                              {sales.trend === 'up' ? (
                                                <>
                                                  <Text fontSize="sm" color="green.600">↑</Text>
                                                  <Text fontSize="xs" color="green.600">+12%</Text>
                                                </>
                                              ) : sales.trend === 'down' ? (
                                                <>
                                                  <Text fontSize="sm" color="red.600">↓</Text>
                                                  <Text fontSize="xs" color="red.600">-8%</Text>
                                                </>
                                              ) : (
                                                <>
                                                  <Text fontSize="sm" color="gray.600">→</Text>
                                                  <Text fontSize="xs" color="gray.600">0%</Text>
                                                </>
                                              )}
                                            </HStack>
                                          </Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </CardBody>
                            </Card>
                          </VStack>
                        </TabPanel>
                        
                        {/* Client Performance Sub-tab */}
                        <TabPanel p={6}>
                          <VStack spacing={6} align="stretch">
                            <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                              <VStack align="start" spacing={1}>
                                <Heading size="md" color="gray.800">Client Performance Analytics</Heading>
                                <Text fontSize="sm" color="gray.600">
                                  Client satisfaction metrics, retention analysis, and account performance tracking
                                </Text>
                              </VStack>
                              
                              <HStack spacing={4}>
                                <Select 
                                  w="180px" 
                                  bg="white"
                                  borderColor="gray.300"
                                  _hover={{ borderColor: 'gray.400' }}
                                >
                                  <option value="all">👥 All Clients</option>
                                  <option value="active">✅ Active Clients</option>
                                  <option value="new">🆕 New Clients</option>
                                  <option value="at-risk">⚠️ At Risk</option>
                                </Select>
                                
                                <Button 
                                  leftIcon={<RepeatIcon />} 
                                  variant="outline" 
                                  colorScheme="gray"
                                >
                                  Refresh
                                </Button>
                              </HStack>
                            </Flex>

                            {/* Client Performance Overview */}
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="blue.600">👥</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">TOTAL CLIENTS</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">342</StatNumber>
                                    <StatHelpText color="green.600">+28 this month</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="green.600">😊</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">SATISFACTION</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">94%</StatNumber>
                                    <StatHelpText color="green.600">+2% improvement</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="purple.600">🔄</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">RETENTION</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">87%</StatNumber>
                                    <StatHelpText color="green.600">Above industry</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="orange.600">💰</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">AVG VALUE</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">$1,247</StatNumber>
                                    <StatHelpText color="green.600">+$124 increase</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                            </SimpleGrid>

                            {/* Client Performance Table */}
                            <Card borderRadius="7px" border="1px" borderColor="gray.200">
                              <CardHeader>
                                <Heading size="md" color="gray.800">Client Performance Metrics</Heading>
                              </CardHeader>
                              <CardBody>
                                <TableContainer>
                                  <Table variant="simple" size="sm">
                                    <Thead>
                                      <Tr>
                                        <Th>Client</Th>
                                        <Th>Status</Th>
                                        <Th>Satisfaction</Th>
                                        <Th>Revenue</Th>
                                        <Th>Duration</Th>
                                        <Th>Risk</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {[
                                        { name: "Tech Solutions Inc", email: "contact@techsolutions.com", status: "active", satisfaction: 98, revenue: "$8,420", duration: "18 months", risk: "low" },
                                        { name: "Global Marketing Co", email: "info@globalmarketing.com", status: "active", satisfaction: 92, revenue: "$5,340", duration: "12 months", risk: "low" },
                                        { name: "StartUp Ventures", email: "hello@startupventures.com", status: "active", satisfaction: 87, revenue: "$3,680", duration: "6 months", risk: "medium" },
                                        { name: "Enterprise Systems", email: "support@enterprisesys.com", status: "at-risk", satisfaction: 76, revenue: "$4,920", duration: "24 months", risk: "high" },
                                        { name: "Digital Agency Pro", email: "team@digitalagency.com", status: "active", satisfaction: 94, revenue: "$2,840", duration: "3 months", risk: "low" },
                                      ].map((client, index) => (
                                        <Tr key={index}>
                                          <Td>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="bold">{client.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{client.email}</Text>
                                            </VStack>
                                          </Td>
                                          <Td>
                                            <Badge 
                                              colorScheme={client.status === 'active' ? 'green' : 'orange'}
                                              fontSize="xs"
                                            >
                                              {client.status.toUpperCase()}
                                            </Badge>
                                          </Td>
                                          <Td>
                                            <HStack spacing={2}>
                                              <CircularProgress
                                                value={client.satisfaction}
                                                size="30px"
                                                color={client.satisfaction >= 95 ? 'green.400' : 
                                                       client.satisfaction >= 85 ? 'blue.400' : 
                                                       client.satisfaction >= 75 ? 'yellow.400' : 'red.400'}
                                                thickness="6px"
                                              >
                                                <CircularProgressLabel fontSize="10px" fontWeight="bold">
                                                  {client.satisfaction}
                                                </CircularProgressLabel>
                                              </CircularProgress>
                                              <Text fontSize="xs" color="gray.600">
                                                {client.satisfaction >= 95 ? 'Excellent' :
                                                 client.satisfaction >= 85 ? 'Good' :
                                                 client.satisfaction >= 75 ? 'Average' : 'Poor'}
                                              </Text>
                                            </HStack>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold" color="green.600">{client.revenue}</Text>
                                            <Text fontSize="xs" color="gray.500">lifetime</Text>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold">{client.duration}</Text>
                                            <Text fontSize="xs" color="gray.500">client</Text>
                                          </Td>
                                          <Td>
                                            <Badge 
                                              colorScheme={client.risk === 'low' ? 'green' : 
                                                         client.risk === 'medium' ? 'yellow' : 'red'}
                                              fontSize="xs"
                                            >
                                              {client.risk.toUpperCase()}
                                            </Badge>
                                          </Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </CardBody>
                            </Card>
                          </VStack>
                        </TabPanel>
                        
                        {/* Lead Performance Sub-tab */}
                        <TabPanel p={6}>
                          <VStack spacing={6} align="stretch">
                            <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                              <VStack align="start" spacing={1}>
                                <Heading size="md" color="gray.800">Lead Performance Analytics</Heading>
                                <Text fontSize="sm" color="gray.600">
                                  Lead generation tracking, conversion funnel analysis, and source performance metrics
                                </Text>
                              </VStack>
                              
                              <HStack spacing={4}>
                                <Select 
                                  w="180px" 
                                  bg="white"
                                  borderColor="gray.300"
                                  _hover={{ borderColor: 'gray.400' }}
                                >
                                  <option value="all">🎯 All Leads</option>
                                  <option value="new">🆕 New Leads</option>
                                  <option value="qualified">✅ Qualified</option>
                                  <option value="converted">💰 Converted</option>
                                </Select>
                                
                                <Button 
                                  leftIcon={<RepeatIcon />} 
                                  variant="outline" 
                                  colorScheme="gray"
                                >
                                  Refresh
                                </Button>
                              </HStack>
                            </Flex>

                            {/* Lead Performance Overview */}
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="blue.600">🎯</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">TOTAL LEADS</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">1,247</StatNumber>
                                    <StatHelpText color="green.600">+156 this month</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="green.600">✅</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">CONVERTED</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">324</StatNumber>
                                    <StatHelpText color="green.600">26% rate</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="purple.600">📈</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">QUALITY SCORE</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">8.4/10</StatNumber>
                                    <StatHelpText color="green.600">+0.8 points</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                              
                              <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                <CardBody textAlign="center" p={4}>
                                  <Text fontSize="2xl" color="orange.600">⏱️</Text>
                                  <Stat>
                                    <StatLabel color="gray.600" fontSize="xs">RESPONSE TIME</StatLabel>
                                    <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">1.8h</StatNumber>
                                    <StatHelpText color="green.600">-45min faster</StatHelpText>
                                  </Stat>
                                </CardBody>
                              </Card>
                            </SimpleGrid>

                            {/* Lead Performance Table */}
                            <Card borderRadius="7px" border="1px" borderColor="gray.200">
                              <CardHeader>
                                <Heading size="md" color="gray.800">Lead Performance by Source</Heading>
                              </CardHeader>
                              <CardBody>
                                <TableContainer>
                                  <Table variant="simple" size="sm">
                                    <Thead>
                                      <Tr>
                                        <Th>Source</Th>
                                        <Th>Leads</Th>
                                        <Th>Converted</Th>
                                        <Th>Rate</Th>
                                        <Th>Quality</Th>
                                        <Th>Trend</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {[
                                        { name: "Website", leads: 423, converted: 142, rate: "33.6%", quality: 8.7, trend: "up" },
                                        { name: "Social Media", leads: 312, converted: 78, rate: "25.0%", quality: 7.9, trend: "up" },
                                        { name: "Email Campaign", leads: 267, converted: 64, rate: "24.0%", quality: 8.2, trend: "stable" },
                                        { name: "Referrals", leads: 145, converted: 28, rate: "19.3%", quality: 9.1, trend: "up" },
                                        { name: "Paid Ads", leads: 100, converted: 12, rate: "12.0%", quality: 6.8, trend: "down" },
                                      ].map((source, index) => (
                                        <Tr key={index}>
                                          <Td>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="bold">{source.name}</Text>
                                              <Text fontSize="xs" color="gray.500">Primary channel</Text>
                                            </VStack>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold">{source.leads}</Text>
                                            <Text fontSize="xs" color="blue.600">this month</Text>
                                          </Td>
                                          <Td>
                                            <Text fontSize="sm" fontWeight="bold">{source.converted}</Text>
                                            <Text fontSize="xs" color="green.600">deals</Text>
                                          </Td>
                                          <Td>
                                            <HStack spacing={2}>
                                              <Text fontSize="sm" fontWeight="bold">{source.rate}</Text>
                                              <Badge 
                                                colorScheme={parseFloat(source.rate) >= 30 ? 'green' : 
                                                           parseFloat(source.rate) >= 20 ? 'blue' : 'yellow'}
                                                fontSize="xs"
                                              >
                                                {parseFloat(source.rate) >= 30 ? 'Excellent' :
                                                 parseFloat(source.rate) >= 20 ? 'Good' : 'Average'}
                                              </Badge>
                                            </HStack>
                                          </Td>
                                          <Td>
                                            <HStack spacing={2}>
                                              <Text fontSize="sm" fontWeight="bold">{source.quality}/10</Text>
                                              <Badge 
                                                colorScheme={source.quality >= 9 ? 'green' : 
                                                           source.quality >= 8 ? 'blue' : 
                                                           source.quality >= 7 ? 'yellow' : 'red'}
                                                fontSize="xs"
                                              >
                                                {source.quality >= 9 ? 'High' :
                                                 source.quality >= 8 ? 'Good' :
                                                 source.quality >= 7 ? 'Average' : 'Low'}
                                              </Badge>
                                            </HStack>
                                          </Td>
                                          <Td>
                                            <HStack spacing={1}>
                                              {source.trend === 'up' ? (
                                                <>
                                                  <Text fontSize="sm" color="green.600">↑</Text>
                                                  <Text fontSize="xs" color="green.600">+18%</Text>
                                                </>
                                              ) : source.trend === 'down' ? (
                                                <>
                                                  <Text fontSize="sm" color="red.600">↓</Text>
                                                  <Text fontSize="xs" color="red.600">-12%</Text>
                                                </>
                                              ) : (
                                                <>
                                                  <Text fontSize="sm" color="gray.600">→</Text>
                                                  <Text fontSize="xs" color="gray.600">0%</Text>
                                                </>
                                              )}
                                            </HStack>
                                          </Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </CardBody>
                            </Card>
                          </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </TabPanel>

                {/* Reports Tab - Professional Analytics Dashboard */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Header Section */}
                    <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Business Intelligence Reports</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Comprehensive analytics and insights for data-driven decision making
                        </Text>
                      </VStack>
                      
                      <HStack spacing={4}>
                        <Select 
                          w="180px" 
                          value={reportFilter} 
                          onChange={(e) => setReportFilter(e.target.value)}
                          bg="white"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'gray.400' }}
                        >
                          <option value="all">📊 All Reports</option>
                          <option value="sales">💰 Sales Reports</option>
                          <option value="team">👥 Team Reports</option>
                          <option value="financial">📈 Financial Reports</option>
                          <option value="leads">🎯 Lead Reports</option>
                          <option value="activity">⚡ Activity Reports</option>
                        </Select>
                        
                        <Button 
                          leftIcon={<AddIcon />} 
                          colorScheme="blue" 
                          onClick={onReportModalOpen}
                        >
                          Generate Report
                        </Button>
                        
                        <Button 
                          leftIcon={<RepeatIcon />} 
                          variant="outline" 
                          colorScheme="gray"
                          onClick={fetchReports}
                          isLoading={fetchingRef.current.reports}
                        >
                          Refresh
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Quick Stats Overview */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                      <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                        <CardBody textAlign="center" p={4}>
                          <VStack spacing={2}>
                            <Box p={2} bg="blue.50" borderRadius="full">
                              <Text fontSize="xl">📊</Text>
                            </Box>
                            <Stat>
                              <StatLabel color="gray.600" fontSize="xs">TOTAL REPORTS</StatLabel>
                              <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                                {reports.length}
                              </StatNumber>
                              <StatHelpText color="gray.500">Generated</StatHelpText>
                            </Stat>
                          </VStack>
                        </CardBody>
                      </Card>
                      
                      <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                        <CardBody textAlign="center" p={4}>
                          <VStack spacing={2}>
                            <Box p={2} bg="green.50" borderRadius="full">
                              <Text fontSize="xl">✅</Text>
                            </Box>
                            <Stat>
                              <StatLabel color="gray.600" fontSize="xs">COMPLETED</StatLabel>
                              <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                                {reports.filter(r => r.status === 'completed').length}
                              </StatNumber>
                              <StatHelpText color="gray.500">Ready to view</StatHelpText>
                            </Stat>
                          </VStack>
                        </CardBody>
                      </Card>
                      
                      <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                        <CardBody textAlign="center" p={4}>
                          <VStack spacing={2}>
                            <Box p={2} bg="yellow.50" borderRadius="full">
                              <Text fontSize="xl">⏳</Text>
                            </Box>
                            <Stat>
                              <StatLabel color="gray.600" fontSize="xs">PROCESSING</StatLabel>
                              <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                                {reports.filter(r => r.status === 'processing').length}
                              </StatNumber>
                              <StatHelpText color="gray.500">In progress</StatHelpText>
                            </Stat>
                          </VStack>
                        </CardBody>
                      </Card>
                      
                      <Card borderRadius="7px" border="1px" borderColor="gray.200" bg="white">
                        <CardBody textAlign="center" p={4}>
                          <VStack spacing={2}>
                            <Box p={2} bg="purple.50" borderRadius="full">
                              <Text fontSize="xl">📈</Text>
                            </Box>
                            <Stat>
                              <StatLabel color="gray.600" fontSize="xs">THIS MONTH</StatLabel>
                              <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                                {reports.filter(r => {
                                  const reportDate = new Date(r.generatedDate);
                                  const currentMonth = new Date().getMonth();
                                  return reportDate.getMonth() === currentMonth;
                                }).length}
                              </StatNumber>
                              <StatHelpText color="gray.500">New reports</StatHelpText>
                            </Stat>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Report Categories with Tabs */}
                    <Card borderRadius="7px" border="1px" borderColor="gray.200">
                      <CardBody p={0}>
                        <Tabs colorScheme="blue" variant="enclosed">
                          <TabList borderBottom="1px" borderColor="gray.200">
                            <Tab fontSize="sm" fontWeight="500">📊 Overview</Tab>
                            <Tab fontSize="sm" fontWeight="500">💰 Sales</Tab>
                            <Tab fontSize="sm" fontWeight="500">👥 Team</Tab>
                            <Tab fontSize="sm" fontWeight="500">📈 Financial</Tab>
                            <Tab fontSize="sm" fontWeight="500">🎯 Leads</Tab>
                            <Tab fontSize="sm" fontWeight="500">⚡ Activity</Tab>
                          </TabList>
                          
                          <TabPanels>
                            {/* Overview Tab */}
                            <TabPanel p={6}>
                              <VStack spacing={6} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                  View all your business reports in one place. Filter by type, status, or date range.
                                </Text>
                                
                                {loading ? (
                                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {Array(6).fill(0).map((_, i) => (
                                      <Card key={i} borderRadius="7px" border="1px" borderColor="gray.200">
                                        <CardBody>
                                          <SkeletonText noOfLines={4} spacing="4" />
                                        </CardBody>
                                      </Card>
                                    ))}
                                  </SimpleGrid>
                                ) : reports.length > 0 ? (
                                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {reports.map((report, index) => (
                                      <Card 
                                        key={report._id || index} 
                                        borderRadius="7px" 
                                        border="1px" 
                                        borderColor="gray.200"
                                        _hover={{ borderColor: 'blue.300', shadow: 'md' }}
                                        transition="all 0.2s"
                                      >
                                        <CardBody>
                                          <VStack spacing={4} align="stretch">
                                            <HStack justify="space-between">
                                              <VStack align="start" spacing={1}>
                                                <Badge 
                                                  colorScheme="blue" 
                                                  variant="subtle" 
                                                  px={3} 
                                                  py={1} 
                                                  borderRadius="full"
                                                  fontSize="xs"
                                                >
                                                  {report.reportType?.replace(/_/g, ' ').toUpperCase()}
                                                </Badge>
                                                <Badge 
                                                  colorScheme={
                                                    report.status === 'completed' ? 'green' : 
                                                    report.status === 'processing' ? 'yellow' : 'gray'
                                                  } 
                                                  variant="solid"
                                                  borderRadius="7px"
                                                  px={2}
                                                  py={1}
                                                  fontSize="xs"
                                                >
                                                  {report.status || 'pending'}
                                                </Badge>
                                              </VStack>
                                              <Box as={FiFileText} color="gray.400" size="20px" />
                                            </HStack>
                                            
                                            <VStack align="start" spacing={2}>
                                              <Text fontSize="sm" color="gray.600">
                                                <strong>Period:</strong> {report.period || 'N/A'}
                                              </Text>
                                              <Text fontSize="sm" color="gray.600">
                                                <strong>Generated:</strong> {report.generatedDate 
                                                  ? new Date(report.generatedDate).toLocaleDateString()
                                                  : 'N/A'
                                                }
                                              </Text>
                                              <Text fontSize="sm" color="gray.600">
                                                <strong>Size:</strong> {report.fileSize || '2.4 MB'}
                                              </Text>
                                            </VStack>

                                            <ButtonGroup size="sm" spacing={2}>
                                              <Button 
                                                variant="outline" 
                                                flex={1}
                                                leftIcon={<ViewIcon />}
                                                colorScheme="blue"
                                                onClick={() => openReportDetail(report)}
                                              >
                                                View
                                              </Button>
                                              <IconButton 
                                                icon={<DownloadIcon />} 
                                                variant="outline"
                                                colorScheme="green"
                                                isDisabled={report.status !== 'completed'}
                                                title="Download Report"
                                                onClick={() => downloadIndividualReport(report)}
                                              />
                                            </ButtonGroup>
                                          </VStack>
                                        </CardBody>
                                      </Card>
                                    ))}
                                  </SimpleGrid>
                                ) : (
                                  <Card bg="gray.50" borderRadius="7px" border="2px dashed" borderColor="gray.300">
                                    <CardBody py={12}>
                                      <Center>
                                        <VStack spacing={4}>
                                          <Box
                                            w="80px"
                                            h="80px"
                                            bg="gray.200"
                                            borderRadius="7px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            color="gray.500"
                                          >
                                            <Box as={FiFileText} size="32px" />
                                          </Box>
                                          <VStack spacing={2}>
                                            <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                              No Reports Available
                                            </Text>
                                            <Text color="gray.500" textAlign="center" fontSize="sm">
                                              Generate your first report to analyze business performance and track progress.
                                            </Text>
                                          </VStack>
                                          <Button colorScheme="blue" onClick={onReportModalOpen} size="sm">
                                            Generate First Report
                                          </Button>
                                        </VStack>
                                      </Center>
                                    </CardBody>
                                  </Card>
                                )}
                              </VStack>
                            </TabPanel>
                            
                            {/* Sales Reports Tab */}
                            <TabPanel p={6}>
                              <VStack spacing={6} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                  Comprehensive sales analytics including revenue trends, conversion rates, and performance metrics.
                                </Text>
                                
                                {/* Sales Overview Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="green.600">💰</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">TOTAL REVENUE</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">$124,850</StatNumber>
                                        <StatHelpText color="green.600">+15.3% vs last month</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="blue.600">📈</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">CONVERSION RATE</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">24.8%</StatNumber>
                                        <StatHelpText color="green.600">+3.2% improvement</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="purple.600">🎯</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">TOTAL DEALS</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">342</StatNumber>
                                        <StatHelpText color="green.600">+28 this month</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="orange.600">💵</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">AVG DEAL SIZE</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">$365</StatNumber>
                                        <StatHelpText color="green.600">+$45 increase</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                </SimpleGrid>

                                {/* Sales Reports List */}
                                <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                  <CardHeader>
                                    <Heading size="md" color="gray.800">Available Sales Reports</Heading>
                                  </CardHeader>
                                  <CardBody>
                                    <VStack spacing={3} align="stretch">
                                      {[
                                        { name: "Monthly Revenue Report", date: "2024-01-15", size: "2.4 MB", status: "completed" },
                                        { name: "Sales Conversion Analysis", date: "2024-01-14", size: "1.8 MB", status: "completed" },
                                        { name: "Product Performance Report", date: "2024-01-13", size: "3.1 MB", status: "processing" },
                                      ].map((report, index) => (
                                        <HStack key={index} p={3} bg="gray.50" borderRadius="7px" justify="space-between">
                                          <HStack spacing={3}>
                                            <Box w="8" h="8" bg="blue.100" borderRadius="7px" display="flex" alignItems="center" justifyContent="center">
                                              <Text fontSize="xs">📊</Text>
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="600">{report.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{report.date} • {report.size}</Text>
                                            </VStack>
                                          </HStack>
                                          <HStack spacing={2}>
                                            <Badge colorScheme={report.status === 'completed' ? 'green' : 'yellow'} fontSize="xs">
                                              {report.status}
                                            </Badge>
                                            <Button size="xs" variant="outline" colorScheme="blue">View</Button>
                                          </HStack>
                                        </HStack>
                                      ))}
                                    </VStack>
                                  </CardBody>
                                </Card>
                              </VStack>
                            </TabPanel>
                            
                            {/* Team Reports Tab */}
                            <TabPanel p={6}>
                              <VStack spacing={6} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                  Team performance metrics, member productivity analysis, and hierarchy insights.
                                </Text>
                                
                                {/* Team Overview Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="blue.600">👥</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">ACTIVE MEMBERS</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">284</StatNumber>
                                        <StatHelpText color="green.600">+12 this week</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="green.600">⭐</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">TOP PERFORMERS</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">47</StatNumber>
                                        <StatHelpText color="green.600">16.5% of team</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="purple.600">📈</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">AVG SCORE</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">78.4</StatNumber>
                                        <StatHelpText color="green.600">+5.2 points</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="orange.600">🎯</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">PRODUCTIVITY</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">92%</StatNumber>
                                        <StatHelpText color="green.600">Above target</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                </SimpleGrid>

                                {/* Team Reports List */}
                                <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                  <CardHeader>
                                    <Heading size="md" color="gray.800">Available Team Reports</Heading>
                                  </CardHeader>
                                  <CardBody>
                                    <VStack spacing={3} align="stretch">
                                      {[
                                        { name: "Team Performance Summary", date: "2024-01-15", size: "3.2 MB", status: "completed" },
                                        { name: "Member Productivity Analysis", date: "2024-01-14", size: "2.1 MB", status: "completed" },
                                        { name: "Hierarchy Performance Report", date: "2024-01-13", size: "4.5 MB", status: "processing" },
                                      ].map((report, index) => (
                                        <HStack key={index} p={3} bg="gray.50" borderRadius="7px" justify="space-between">
                                          <HStack spacing={3}>
                                            <Box w="8" h="8" bg="purple.100" borderRadius="7px" display="flex" alignItems="center" justifyContent="center">
                                              <Text fontSize="xs">👥</Text>
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="600">{report.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{report.date} • {report.size}</Text>
                                            </VStack>
                                          </HStack>
                                          <HStack spacing={2}>
                                            <Badge colorScheme={report.status === 'completed' ? 'green' : 'yellow'} fontSize="xs">
                                              {report.status}
                                            </Badge>
                                            <Button size="xs" variant="outline" colorScheme="blue">View</Button>
                                          </HStack>
                                        </HStack>
                                      ))}
                                    </VStack>
                                  </CardBody>
                                </Card>
                              </VStack>
                            </TabPanel>
                            
                            {/* Financial Reports Tab */}
                            <TabPanel p={6}>
                              <VStack spacing={6} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                  Financial analytics including revenue tracking, commission analysis, and profit margins.
                                </Text>
                                
                                {/* Financial Overview Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="green.600">💰</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">TOTAL REVENUE</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">$458,290</StatNumber>
                                        <StatHelpText color="green.600">+22.4% growth</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="blue.600">💵</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">COMMISSIONS PAID</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">$89,420</StatNumber>
                                        <StatHelpText color="green.600">+18.2% vs last month</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="purple.600">📊</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">PROFIT MARGIN</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">34.2%</StatNumber>
                                        <StatHelpText color="green.600">+2.8% improvement</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="orange.600">📈</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">ROI</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">156%</StatNumber>
                                        <StatHelpText color="green.600">Excellent performance</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                </SimpleGrid>

                                {/* Financial Reports List */}
                                <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                  <CardHeader>
                                    <Heading size="md" color="gray.800">Available Financial Reports</Heading>
                                  </CardHeader>
                                  <CardBody>
                                    <VStack spacing={3} align="stretch">
                                      {[
                                        { name: "Monthly Financial Summary", date: "2024-01-15", size: "4.2 MB", status: "completed" },
                                        { name: "Commission Analysis Report", date: "2024-01-14", size: "2.8 MB", status: "completed" },
                                        { name: "Profit & Loss Statement", date: "2024-01-13", size: "3.5 MB", status: "processing" },
                                      ].map((report, index) => (
                                        <HStack key={index} p={3} bg="gray.50" borderRadius="7px" justify="space-between">
                                          <HStack spacing={3}>
                                            <Box w="8" h="8" bg="green.100" borderRadius="7px" display="flex" alignItems="center" justifyContent="center">
                                              <Text fontSize="xs">💰</Text>
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="600">{report.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{report.date} • {report.size}</Text>
                                            </VStack>
                                          </HStack>
                                          <HStack spacing={2}>
                                            <Badge colorScheme={report.status === 'completed' ? 'green' : 'yellow'} fontSize="xs">
                                              {report.status}
                                            </Badge>
                                            <Button size="xs" variant="outline" colorScheme="blue">View</Button>
                                          </HStack>
                                        </HStack>
                                      ))}
                                    </VStack>
                                  </CardBody>
                                </Card>
                              </VStack>
                            </TabPanel>
                            
                            {/* Lead Reports Tab */}
                            <TabPanel p={6}>
                              <VStack spacing={6} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                  Lead generation analytics, conversion tracking, and source performance metrics.
                                </Text>
                                
                                {/* Lead Overview Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="blue.600">🎯</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">TOTAL LEADS</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">1,847</StatNumber>
                                        <StatHelpText color="green.600">+234 this month</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="green.600">✅</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">CONVERTED</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">458</StatNumber>
                                        <StatHelpText color="green.600">24.8% rate</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="purple.600">📈</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">QUALITY SCORE</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">8.4/10</StatNumber>
                                        <StatHelpText color="green.600">+0.6 points</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="orange.600">⏱️</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">RESPONSE TIME</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">2.3h</StatNumber>
                                        <StatHelpText color="green.600">-30min faster</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                </SimpleGrid>

                                {/* Lead Reports List */}
                                <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                  <CardHeader>
                                    <Heading size="md" color="gray.800">Available Lead Reports</Heading>
                                  </CardHeader>
                                  <CardBody>
                                    <VStack spacing={3} align="stretch">
                                      {[
                                        { name: "Lead Generation Analysis", date: "2024-01-15", size: "3.1 MB", status: "completed" },
                                        { name: "Conversion Funnel Report", date: "2024-01-14", size: "2.4 MB", status: "completed" },
                                        { name: "Lead Source Performance", date: "2024-01-13", size: "2.9 MB", status: "processing" },
                                      ].map((report, index) => (
                                        <HStack key={index} p={3} bg="gray.50" borderRadius="7px" justify="space-between">
                                          <HStack spacing={3}>
                                            <Box w="8" h="8" bg="orange.100" borderRadius="7px" display="flex" alignItems="center" justifyContent="center">
                                              <Text fontSize="xs">🎯</Text>
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="600">{report.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{report.date} • {report.size}</Text>
                                            </VStack>
                                          </HStack>
                                          <HStack spacing={2}>
                                            <Badge colorScheme={report.status === 'completed' ? 'green' : 'yellow'} fontSize="xs">
                                              {report.status}
                                            </Badge>
                                            <Button size="xs" variant="outline" colorScheme="blue">View</Button>
                                          </HStack>
                                        </HStack>
                                      ))}
                                    </VStack>
                                  </CardBody>
                                </Card>
                              </VStack>
                            </TabPanel>
                            
                            {/* Activity Reports Tab */}
                            <TabPanel p={6}>
                              <VStack spacing={6} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                  User engagement metrics, system activity logs, and performance tracking data.
                                </Text>
                                
                                {/* Activity Overview Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="blue.600">⚡</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">ACTIVE USERS</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">892</StatNumber>
                                        <StatHelpText color="green.600">+45 today</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="green.600">📊</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">SESSIONS</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">3,247</StatNumber>
                                        <StatHelpText color="green.600">+12.3% vs yesterday</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="purple.600">⏱️</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">AVG SESSION</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">24m</StatNumber>
                                        <StatHelpText color="green.600">+3min longer</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                    <CardBody textAlign="center" p={4}>
                                      <Text fontSize="2xl" color="orange.600">🎯</Text>
                                      <Stat>
                                        <StatLabel color="gray.600" fontSize="xs">ENGAGEMENT</StatLabel>
                                        <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">87%</StatNumber>
                                        <StatHelpText color="green.600">Above average</StatHelpText>
                                      </Stat>
                                    </CardBody>
                                  </Card>
                                </SimpleGrid>

                                {/* Activity Reports List */}
                                <Card borderRadius="7px" border="1px" borderColor="gray.200">
                                  <CardHeader>
                                    <Heading size="md" color="gray.800">Available Activity Reports</Heading>
                                  </CardHeader>
                                  <CardBody>
                                    <VStack spacing={3} align="stretch">
                                      {[
                                        { name: "User Activity Summary", date: "2024-01-15", size: "2.8 MB", status: "completed" },
                                        { name: "System Performance Report", date: "2024-01-14", size: "1.9 MB", status: "completed" },
                                        { name: "Engagement Analytics", date: "2024-01-13", size: "3.3 MB", status: "processing" },
                                      ].map((report, index) => (
                                        <HStack key={index} p={3} bg="gray.50" borderRadius="7px" justify="space-between">
                                          <HStack spacing={3}>
                                            <Box w="8" h="8" bg="red.100" borderRadius="7px" display="flex" alignItems="center" justifyContent="center">
                                              <Text fontSize="xs">⚡</Text>
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                              <Text fontSize="sm" fontWeight="600">{report.name}</Text>
                                              <Text fontSize="xs" color="gray.500">{report.date} • {report.size}</Text>
                                            </VStack>
                                          </HStack>
                                          <HStack spacing={2}>
                                            <Badge colorScheme={report.status === 'completed' ? 'green' : 'yellow'} fontSize="xs">
                                              {report.status}
                                            </Badge>
                                            <Button size="xs" variant="outline" colorScheme="blue">View</Button>
                                          </HStack>
                                        </HStack>
                                      ))}
                                    </VStack>
                                  </CardBody>
                                </Card>
                              </VStack>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>

                {/* Commissions Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Commissions & Earnings</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Track your commission history and earnings
                        </Text>
                      </VStack>
                      <Button leftIcon={<RepeatIcon />} colorScheme="blue" onClick={fetchCommissions} isLoading={loading}>
                        Refresh
                      </Button>
                    </Flex>

                    {/* Commission Summary Cards */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Card bg="green.50" border="1px" borderColor="green.200" borderRadius="7px">
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="xs" color="green.600" fontWeight="600" textTransform="uppercase">Total Earned</Text>
                            <Text fontSize="2xl" fontWeight="700" color="green.800">
                              ${commissionSummary.totalEarned?.toLocaleString() || '0.00'}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                      <Card bg="yellow.50" border="1px" borderColor="yellow.200" borderRadius="7px">
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="xs" color="yellow.600" fontWeight="600" textTransform="uppercase">Pending</Text>
                            <Text fontSize="2xl" fontWeight="700" color="yellow.800">
                              ${commissionSummary.pendingAmount?.toLocaleString() || '0.00'}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                      <Card bg="blue.50" border="1px" borderColor="blue.200" borderRadius="7px">
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="xs" color="blue.600" fontWeight="600" textTransform="uppercase">Total Commissions</Text>
                            <Text fontSize="2xl" fontWeight="700" color="blue.800">
                              {commissionSummary.totalCommissions || 0}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Commissions Table */}
                    {loading ? (
                      <VStack spacing={4}>
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} height="80px" borderRadius="7px" />
                        ))}
                      </VStack>
                    ) : commissions.length > 0 ? (
                      <Card>
                        <CardBody>
                          <TableContainer>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Date</Th>
                                  <Th>Type</Th>
                                  <Th>Amount</Th>
                                  <Th>Percentage</Th>
                                  <Th>Status</Th>
                                  <Th>Notes</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {commissions.map((commission, index) => (
                                  <Tr key={commission._id || index}>
                                    <Td>{new Date(commission.calculatedAt || commission.createdAt).toLocaleDateString()}</Td>
                                    <Td>
                                      <Badge colorScheme="blue" variant="subtle">
                                        {commission.commissionType || 'N/A'}
                                      </Badge>
                                    </Td>
                                    <Td fontWeight="600">${commission.commissionAmount?.toLocaleString() || '0.00'}</Td>
                                    <Td>{(commission.commissionPercentage * 100)?.toFixed(1)}%</Td>
                                    <Td>
                                      <Badge 
                                        colorScheme={
                                          commission.status === 'paid' ? 'green' : 
                                          commission.status === 'pending' ? 'yellow' : 
                                          commission.status === 'approved' ? 'blue' : 'gray'
                                        }
                                      >
                                        {commission.status || 'pending'}
                                      </Badge>
                                    </Td>
                                    <Td fontSize="sm" color="gray.600">{commission.notes || '-'}</Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </CardBody>
                      </Card>
                    ) : (
                      <Card bg="gray.50" borderRadius="7px" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="7px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="gray.500"
                              >
                                <Text fontSize="3xl" fontWeight="bold" color="gray.400">$</Text>
                              </Box>
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Commissions Yet
                                </Text>
                                <Text color="gray.500" textAlign="center" fontSize="sm">
                                  Commissions will appear here once they are calculated and processed.
                                </Text>
                              </VStack>
                            </VStack>
                          </Center>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>

                {/* Admin Requests Tab - Professional UI */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Header Section */}
                    <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Admin Requests Management</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Track and manage hierarchy change requests, sponsor changes, and administrative approvals
                        </Text>
                      </VStack>
                      
                      <HStack spacing={4}>
                        <Select 
                          w="180px" 
                          bg="white"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'gray.400' }}
                        >
                          <option value="all">📋 All Requests</option>
                          <option value="pending">⏳ Pending</option>
                          <option value="approved">✅ Approved</option>
                          <option value="rejected">❌ Rejected</option>
                        </Select>
                        
                        <Button 
                          leftIcon={<AddIcon />} 
                          colorScheme="blue" 
                          onClick={() => setShowAdminRequestForm(true)}
                        >
                          New Request
                        </Button>
                        
                        <Button 
                          leftIcon={<RepeatIcon />} 
                          colorScheme="gray" 
                          onClick={() => {
                            console.log('🔄 Refresh button clicked - calling fetchAdminRequests manually');
                            fetchAdminRequests();
                          }} 
                          isLoading={loading}
                        >
                          Refresh
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Quick Stats */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center" p={4}>
                          <Text fontSize="2xl" color="blue.600">📋</Text>
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">TOTAL REQUESTS</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.length}
                            </StatNumber>
                            <StatHelpText color="gray.500">All time</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center" p={4}>
                          <Text fontSize="2xl" color="yellow.600">⏳</Text>
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">PENDING</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.filter(r => r.status === 'pending').length}
                            </StatNumber>
                            <StatHelpText color="gray.500">Awaiting review</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center" p={4}>
                          <Text fontSize="2xl" color="green.600">✅</Text>
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">APPROVED</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.filter(r => r.status === 'approved').length}
                            </StatNumber>
                            <StatHelpText color="gray.500">Completed</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center" p={4}>
                          <Text fontSize="2xl" color="red.600">❌</Text>
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">REJECTED</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.filter(r => r.status === 'rejected').length}
                            </StatNumber>
                            <StatHelpText color="gray.500">Declined</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Admin Requests List */}
                    
                    {/* Simplified rendering logic */}
                    {loading && (
                      <VStack spacing={4}>
                        {[1, 2, 3].map(i => (
                          <Card key={i} borderRadius="7px" border="1px" borderColor="gray.200">
                            <CardBody>
                              <SkeletonText noOfLines={4} spacing="4" />
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    )}
                    
                    {!loading && adminRequests.length > 0 && (
                      <VStack spacing={4} align="stretch">
                        {adminRequests.map((request, index) => {
                          const isOwnRequest = request.coachId?._id === effectiveAuth.coachId;
                          return (
                            <Card 
                              key={request._id || index} 
                              borderRadius="7px" 
                              border="1px" 
                              borderColor={isOwnRequest ? "blue.200" : "gray.200"}
                              bg={isOwnRequest ? "blue.50" : "white"}
                            >
                              <CardBody>
                                <VStack align="stretch" spacing={4}>
                                  {/* Request Header */}
                                  <HStack justify="space-between" align="start">
                                    <VStack align="start" spacing={2} flex={1}>
                                      <HStack spacing={2}>
                                        <Badge 
                                          colorScheme={
                                            request.status === 'approved' ? 'green' : 
                                            request.status === 'rejected' ? 'red' : 
                                            request.status === 'pending' ? 'yellow' : 'gray'
                                          }
                                          fontSize="xs"
                                          px={2}
                                          py={1}
                                        >
                                          {request.status?.toUpperCase() || 'PENDING'}
                                        </Badge>
                                        {isOwnRequest ? (
                                          <Badge colorScheme="blue" variant="outline" fontSize="xs">MY REQUEST</Badge>
                                        ) : (
                                          <Badge colorScheme="orange" variant="outline" fontSize="xs">DOWNLINE REQUEST</Badge>
                                        )}
                                      </HStack>
                                      
                                      <Text fontSize="md" fontWeight="600" color="gray.800">
                                        {request.requestType?.replace(/_/g, ' ').toUpperCase() || 'HIERARCHY CHANGE'}
                                      </Text>
                                      
                                      <Text fontSize="sm" color="gray.600">
                                        {request.reason || request.description || 'No description provided'}
                                      </Text>
                                    </VStack>
                                    
                                    <VStack align="end" spacing={1}>
                                      <Text fontSize="xs" color="gray.500">
                                        {new Date(request.createdAt || request.submittedAt).toLocaleDateString()}
                                      </Text>
                                      <Text fontSize="xs" color="gray.400">
                                        {new Date(request.createdAt || request.submittedAt).toLocaleTimeString()}
                                      </Text>
                                    </VStack>
                                  </HStack>

                                  {/* Coach Information */}
                                  {!isOwnRequest && request.coachId && (
                                    <HStack p={3} bg="orange.50" borderRadius="7px" spacing={3}>
                                      <Avatar size="sm" name={request.coachId.name} bg="orange.200" />
                                      <VStack align="start" spacing={0} flex={1}>
                                        <Text fontSize="sm" fontWeight="600" color="orange.800">
                                          {request.coachId.name}
                                        </Text>
                                        <Text fontSize="xs" color="orange.600">
                                          {request.coachId.selfCoachId} • {request.coachId.email}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                  )}

                                  {/* Request Details */}
                                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <Box p={3} bg="gray.50" borderRadius="7px">
                                      <Text fontSize="xs" color="gray.500" fontWeight="600" mb={2}>CURRENT DATA</Text>
                                      <VStack align="start" spacing={1}>
                                        {request.currentData?.selfCoachId && (
                                          <Text fontSize="xs" color="gray.600">
                                            <strong>Coach ID:</strong> {request.currentData.selfCoachId}
                                          </Text>
                                        )}
                                        {request.currentData?.currentLevel && (
                                          <Text fontSize="xs" color="gray.600">
                                            <strong>Level:</strong> {request.currentData.currentLevel}
                                          </Text>
                                        )}
                                        {request.currentData?.sponsorId && (
                                          <Text fontSize="xs" color="gray.600">
                                            <strong>Sponsor:</strong> {request.currentData.sponsorId}
                                          </Text>
                                        )}
                                      </VStack>
                                    </Box>
                                    
                                    <Box p={3} bg="blue.50" borderRadius="7px">
                                      <Text fontSize="xs" color="blue.500" fontWeight="600" mb={2}>REQUESTED CHANGES</Text>
                                      <VStack align="start" spacing={1}>
                                        {request.requestedData?.sponsorId && (
                                          <Text fontSize="xs" color="blue.700">
                                            <strong>New Sponsor:</strong> {request.requestedData.sponsorId}
                                          </Text>
                                        )}
                                        {request.requestedData?.currentLevel && (
                                          <Text fontSize="xs" color="blue.700">
                                            <strong>New Level:</strong> {request.requestedData.currentLevel}
                                          </Text>
                                        )}
                                        {request.requestedData?.selfCoachId && (
                                          <Text fontSize="xs" color="blue.700">
                                            <strong>New Coach ID:</strong> {request.requestedData.selfCoachId}
                                          </Text>
                                        )}
                                      </VStack>
                                    </Box>
                                  </SimpleGrid>

                                  {/* Admin Response */}
                                  {request.adminNotes && (
                                    <Box p={3} bg="green.50" borderRadius="7px">
                                      <Text fontSize="xs" color="green.600" fontWeight="600" mb={1}>
                                        ADMIN RESPONSE
                                      </Text>
                                      <Text fontSize="sm" color="green.800">
                                        {request.adminNotes}
                                      </Text>
                                      {request.processedAt && (
                                        <Text fontSize="xs" color="green.600" mt={2}>
                                          Processed on {new Date(request.processedAt).toLocaleDateString()}
                                        </Text>
                                      )}
                                    </Box>
                                  )}

                                  {/* Action Buttons */}
                                  {request.status === 'pending' && isOwnRequest && (
                                    <HStack spacing={2} justify="end">
                                      <Button size="sm" variant="outline" colorScheme="gray">
                                        Edit Request
                                      </Button>
                                      <Button size="sm" variant="outline" colorScheme="red">
                                        Cancel Request
                                      </Button>
                                    </HStack>
                                  )}
                                </VStack>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </VStack>
                    )}
                    
                    {!loading && adminRequests.length === 0 && (
                      /* No Admin Requests Found State */
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody>
                          <Center py={12}>
                            <VStack spacing={6}>
                              <Box 
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="7px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="gray.500"
                              >
                                <Text fontSize="3xl">📋</Text>
                              </Box>
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Admin Requests Found
                                </Text>
                                <Text color="gray.500" textAlign="center" fontSize="sm">
                                  You haven't submitted any admin requests yet. Create your first request to change your hierarchy or sponsor.
                                </Text>
                              </VStack>
                              <Button 
                                colorScheme="blue" 
                                onClick={() => setShowAdminRequestForm(true)}
                                leftIcon={<AddIcon />}
                              >
                                Create First Request
                              </Button>
                            </VStack>
                          </Center>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>

                {/* Admin Requests Main Tab - Complete Content */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Header Section */}
                    <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Admin Requests Management</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Track and manage hierarchy change requests, sponsor changes, and administrative approvals
                        </Text>
                      </VStack>
                      <HStack spacing={3}>
                        <Button 
                          leftIcon={<AddIcon />} 
                          colorScheme="blue" 
                          onClick={() => setShowAdminRequestForm(true)}
                        >
                          New Request
                        </Button>
                        <Button 
                          leftIcon={<RepeatIcon />} 
                          colorScheme="gray" 
                          onClick={() => fetchAdminRequests()} 
                          isLoading={loading}
                        >
                          Refresh
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Statistics Cards */}
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center">
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">TOTAL REQUESTS</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.length}
                            </StatNumber>
                            <StatHelpText color="gray.500">All time</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center">
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">PENDING</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.filter(r => r.status === 'pending').length}
                            </StatNumber>
                            <StatHelpText color="gray.500">Awaiting review</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center">
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">APPROVED</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.filter(r => r.status === 'approved').length}
                            </StatNumber>
                            <StatHelpText color="gray.500">Completed</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody textAlign="center">
                          <Stat>
                            <StatLabel color="gray.600" fontSize="xs">REJECTED</StatLabel>
                            <StatNumber color="gray.800" fontSize="2xl" fontWeight="bold">
                              {adminRequests.filter(r => r.status === 'rejected').length}
                            </StatNumber>
                            <StatHelpText color="gray.500">Declined</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Admin Requests List */}
                    {loading && (
                      <VStack spacing={4}>
                        {[1, 2, 3].map(i => (
                          <Card key={i} borderRadius="7px" border="1px" borderColor="gray.200">
                            <CardBody>
                              <SkeletonText noOfLines={4} spacing="4" />
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    )}
                    
                    {!loading && adminRequests.length > 0 && (
                      <VStack spacing={4} align="stretch">
                        {adminRequests.map((request, index) => {
                          const isOwnRequest = request.coachId?._id === effectiveAuth.coachId;
                          return (
                            <Card 
                              key={request._id || index} 
                              borderRadius="7px" 
                              border="1px" 
                              borderColor={isOwnRequest ? "blue.200" : "gray.200"}
                              bg={isOwnRequest ? "blue.50" : "white"}
                            >
                              <CardBody>
                                <VStack align="stretch" spacing={4}>
                                  {/* Request Header */}
                                  <HStack justify="space-between" align="start">
                                    <VStack align="start" spacing={2} flex={1}>
                                      <HStack spacing={2}>
                                        <Badge 
                                          colorScheme={
                                            request.status === 'approved' ? 'green' : 
                                            request.status === 'rejected' ? 'red' : 
                                            request.status === 'pending' ? 'yellow' : 'gray'
                                          }
                                          fontSize="xs"
                                          px={2}
                                          py={1}
                                        >
                                          {request.status?.toUpperCase() || 'PENDING'}
                                        </Badge>
                                        {isOwnRequest ? (
                                          <Badge colorScheme="blue" variant="outline" fontSize="xs">MY REQUEST</Badge>
                                        ) : (
                                          <Badge colorScheme="orange" variant="outline" fontSize="xs">DOWNLINE REQUEST</Badge>
                                        )}
                                      </HStack>
                                      
                                      <Text fontSize="md" fontWeight="600" color="gray.800">
                                        {request.requestType?.replace(/_/g, ' ').toUpperCase() || 'HIERARCHY CHANGE'}
                                      </Text>
                                      
                                      <Text fontSize="sm" color="gray.600">
                                        {request.reason || request.description || 'No description provided'}
                                      </Text>
                                    </VStack>
                                    
                                    <VStack align="end" spacing={1}>
                                      <Text fontSize="xs" color="gray.500">
                                        {new Date(request.createdAt || request.submittedAt).toLocaleDateString()}
                                      </Text>
                                      <Text fontSize="xs" color="gray.400">
                                        {new Date(request.createdAt || request.submittedAt).toLocaleTimeString()}
                                      </Text>
                                    </VStack>
                                  </HStack>

                                  {/* Coach Information */}
                                  {!isOwnRequest && request.coachId && (
                                    <HStack p={3} bg="orange.50" borderRadius="7px" spacing={3}>
                                      <Avatar size="sm" name={request.coachId.name} bg="orange.200" />
                                      <VStack align="start" spacing={0} flex={1}>
                                        <Text fontSize="sm" fontWeight="600" color="orange.800">
                                          {request.coachId.name}
                                        </Text>
                                        <Text fontSize="xs" color="orange.600">
                                          {request.coachId.selfCoachId} • {request.coachId.email}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                  )}

                                  {/* Request Details */}
                                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <Box p={3} bg="gray.50" borderRadius="7px">
                                      <Text fontSize="xs" color="gray.500" fontWeight="600" mb={2}>CURRENT DATA</Text>
                                      <VStack align="start" spacing={1}>
                                        {request.currentData?.selfCoachId && (
                                          <Text fontSize="xs" color="gray.600">
                                            <strong>Coach ID:</strong> {request.currentData.selfCoachId}
                                          </Text>
                                        )}
                                        {request.currentData?.currentLevel && (
                                          <Text fontSize="xs" color="gray.600">
                                            <strong>Level:</strong> {request.currentData.currentLevel}
                                          </Text>
                                        )}
                                        {request.currentData?.sponsorId && (
                                          <Text fontSize="xs" color="gray.600">
                                            <strong>Sponsor:</strong> {request.currentData.sponsorId}
                                          </Text>
                                        )}
                                      </VStack>
                                    </Box>
                                    
                                    <Box p={3} bg="blue.50" borderRadius="7px">
                                      <Text fontSize="xs" color="blue.500" fontWeight="600" mb={2}>REQUESTED CHANGES</Text>
                                      <VStack align="start" spacing={1}>
                                        {request.requestedData?.sponsorId && (
                                          <Text fontSize="xs" color="blue.700">
                                            <strong>New Sponsor:</strong> {request.requestedData.sponsorId}
                                          </Text>
                                        )}
                                        {request.requestedData?.currentLevel && (
                                          <Text fontSize="xs" color="blue.700">
                                            <strong>New Level:</strong> {request.requestedData.currentLevel}
                                          </Text>
                                        )}
                                        {request.requestedData?.selfCoachId && (
                                          <Text fontSize="xs" color="blue.700">
                                            <strong>New Coach ID:</strong> {request.requestedData.selfCoachId}
                                          </Text>
                                        )}
                                      </VStack>
                                    </Box>
                                  </SimpleGrid>

                                  {/* Admin Response */}
                                  {request.adminNotes && (
                                    <Box p={3} bg="green.50" borderRadius="7px">
                                      <Text fontSize="xs" color="green.600" fontWeight="600" mb={1}>
                                        ADMIN RESPONSE
                                      </Text>
                                      <Text fontSize="sm" color="green.800">
                                        {request.adminNotes}
                                      </Text>
                                      {request.processedAt && (
                                        <Text fontSize="xs" color="green.600" mt={2}>
                                          Processed on {new Date(request.processedAt).toLocaleDateString()}
                                        </Text>
                                      )}
                                    </Box>
                                  )}

                                  {/* Action Buttons */}
                                  {request.status === 'pending' && isOwnRequest && (
                                    <HStack spacing={2} justify="end">
                                      <Button size="sm" variant="outline" colorScheme="gray">
                                        Edit Request
                                      </Button>
                                      <Button size="sm" variant="outline" colorScheme="red">
                                        Cancel Request
                                      </Button>
                                    </HStack>
                                  )}
                                </VStack>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </VStack>
                    )}
                    
                    {!loading && adminRequests.length === 0 && (
                      <Card borderRadius="7px" border="1px" borderColor="gray.200">
                        <CardBody>
                          <Center py={12}>
                            <VStack spacing={6}>
                              <Box 
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="7px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="gray.500"
                              >
                                <Text fontSize="3xl">📋</Text>
                              </Box>
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Admin Requests Found
                                </Text>
                                <Text color="gray.500" textAlign="center" fontSize="sm">
                                  You haven't submitted any admin requests yet. Create your first request to change your hierarchy or sponsor.
                                </Text>
                              </VStack>
                              <Button 
                                colorScheme="blue" 
                                onClick={() => setShowAdminRequestForm(true)}
                                leftIcon={<AddIcon />}
                              >
                                Create First Request
                              </Button>
                            </VStack>
                          </Center>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </VStack>
      </Box>

      {/* Enhanced Add Coach Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size="2xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="7px" maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack spacing={3}>
              <Box p={2} bg="blue.100" borderRadius="7px" color="blue.600">
                <AddIcon />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">➕ Add New Team Coach</Text>
                <Text fontSize="sm" color="gray.500">Expand your network with a new team member</Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={addCoach}>
            <ModalBody>
              <VStack spacing={6} align="stretch">
                {/* Personal Information Section */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                    👤 Personal Information
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700">Full Name</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="gray.700">Email Address</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="gray.700">Password</FormLabel>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter secure password"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="gray.700">Coach ID (Unique)</FormLabel>
                      <Input
                        value={formData.selfCoachId}
                        onChange={(e) => handleInputChange('selfCoachId', e.target.value.toUpperCase())}
                        placeholder="Enter unique Coach ID (e.g., COACH123)"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                        textTransform="uppercase"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        This must be a unique identifier for the coach
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Level</FormLabel>
                      <NumberInput
                        min={1}
                        max={12}
                        value={formData.currentLevel}
                        onChange={(_, value) => handleInputChange('currentLevel', value)}
                        bg="white"
                      >
                        <NumberInputField 
                          borderColor="gray.300"
                          _hover={{ borderColor: 'gray.400' }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Location Information Section */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                    Location Information
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel color="gray.700">City</FormLabel>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Country</FormLabel>
                      <Input
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Enter country"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Professional Information Section */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">
                    💼 Professional Information
                  </Text>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel color="gray.700">Company/Organization</FormLabel>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Company or organization name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel color="gray.700">Team Rank</FormLabel>
                        <Input
                          value={formData.teamRankName}
                          onChange={(e) => handleInputChange('teamRankName', e.target.value)}
                          placeholder="Team rank designation"
                          bg="white"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'gray.400' }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="gray.700">Experience (Years)</FormLabel>
                        <NumberInput
                          min={0}
                          max={50}
                          value={formData.experienceYears}
                          onChange={(_, value) => handleInputChange('experienceYears', value)}
                          bg="white"
                        >
                          <NumberInputField 
                            borderColor="gray.300"
                            _hover={{ borderColor: 'gray.400' }}
                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel color="gray.700">Bio/Description</FormLabel>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Brief description about the coach and their expertise"
                        rows={3}
                        resize="vertical"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Specializations</FormLabel>
                      <Input
                        value={formData.specializations}
                        onChange={(e) => handleInputChange('specializations', e.target.value)}
                        placeholder="e.g., Leadership, Sales, Marketing (comma separated)"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Separate multiple specializations with commas
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Status</FormLabel>
                      <HStack spacing={3}>
                        <Switch
                          isChecked={formData.isActive}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                          colorScheme="blue"
                        />
                        <Text color="gray.700" fontWeight="medium">
                          {formData.isActive ? 'Active Coach' : 'Inactive Coach'}
                        </Text>
                      </HStack>
                    </FormControl>
                  </VStack>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter bg="gray.50" borderBottomRadius="2xl">
              <ButtonGroup spacing={4}>
                <Button 
                  variant="ghost" 
                  onClick={onAddModalClose} 
                  disabled={loading}
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  bg="blue.500"
                  color="white"
                  isLoading={loading}
                  loadingText="Adding Coach..."
                  leftIcon={<AddIcon />}
                  _hover={{ bg: 'blue.600' }}
                  _active={{ bg: 'blue.700' }}
                  px={8}
                >
                  ➕ Add Coach to Team
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Enhanced Edit Coach Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="2xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="7px" maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack spacing={3}>
              <Box p={2} bg="orange.100" borderRadius="7px" color="orange.600">
                <EditIcon />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">Edit Coach Profile</Text>
                <Text fontSize="sm" color="gray.500">Update coach information and settings</Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={updateCoach}>
            <ModalBody>
              <VStack spacing={6} align="stretch">
                {/* Basic Information */}
                <Box>
                  <Heading size="sm" color="gray.700" mb={4}>👤 Basic Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700">Full Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Enter coach name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="gray.700">Email Address</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="coach@example.com"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Phone Number</FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="+1 234 567 8900"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Self Coach ID</FormLabel>
                      <Input
                        name="selfCoachId"
                        value={formData.selfCoachId}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Unique coach identifier"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Location Information */}
                <Box>
                  <Heading size="sm" color="gray.700" mb={4}>📍 Location Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel color="gray.700">City</FormLabel>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="New York"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Country</FormLabel>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="United States"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Company</FormLabel>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Company name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Experience (Years)</FormLabel>
                      <Input
                        name="experienceYears"
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }))}
                        placeholder="5"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Professional Information */}
                <Box>
                  <Heading size="sm" color="gray.700" mb={4}>💼 Professional Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel color="gray.700">Current Level</FormLabel>
                      <Select
                        name="currentLevel"
                        value={formData.currentLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) }))}
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      >
                        <option value={1}>Level 1</option>
                        <option value={2}>Level 2</option>
                        <option value={3}>Level 3</option>
                        <option value={4}>Level 4</option>
                        <option value={5}>Level 5</option>
                        <option value={6}>Level 6</option>
                        <option value={7}>Level 7</option>
                        <option value={8}>Level 8</option>
                        <option value={9}>Level 9</option>
                        <option value={10}>Level 10</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Status</FormLabel>
                      <Select
                        name="isActive"
                        value={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value === 'true' }))}
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">Team Rank</FormLabel>
                      <Input
                        name="teamRankName"
                        value={formData.teamRankName}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Team rank name"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700">President Team Rank</FormLabel>
                      <Input
                        name="presidentTeamRankName"
                        value={formData.presidentTeamRankName}
                        onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="President team rank"
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Specializations */}
                <Box>
                  <Heading size="sm" color="gray.700" mb={4}>🎯 Specializations</Heading>
                  <FormControl>
                    <FormLabel color="gray.700">Specializations (comma-separated)</FormLabel>
                    <Input
                      name="specializations"
                      value={formData.specializations}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      placeholder="Sales, Marketing, Leadership"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                    />
                  </FormControl>
                </Box>

                {/* Bio */}
                <Box>
                  <Heading size="sm" color="gray.700" mb={4}>📝 Bio / Description</Heading>
                  <FormControl>
                    <FormLabel color="gray.700">Bio</FormLabel>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      placeholder="Tell us about this coach..."
                      rows={4}
                      resize="none"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                    />
                  </FormControl>
                </Box>

                {/* Password Reset */}
                <Box>
                  <Heading size="sm" color="gray.700" mb={4}>🔐 Password Reset</Heading>
                  <FormControl>
                    <FormLabel color="gray.700">New Password (leave empty to keep current)</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      placeholder="Enter new password only if you want to change it"
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                    />
                  </FormControl>
                </Box>

                <Box p={4} bg="orange.50" borderRadius="7px" border="1px" borderColor="orange.200">
                  <HStack spacing={3}>
                    <Box color="orange.500">●</Box>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="bold" color="orange.800">
                        🔄 Complete Edit Access
                      </Text>
                      <Text fontSize="xs" color="orange.700">
                        You can now update ALL coach information. Password field is optional - only fill if you want to change the password.
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter bg="gray.50" borderBottomRadius="2xl">
              <ButtonGroup spacing={4}>
                <Button 
                  variant="ghost" 
                  onClick={onEditModalClose} 
                  disabled={loading}
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  bg="orange.500"
                  color="white"
                  isLoading={loading}
                  loadingText="Updating Coach..."
                  leftIcon={<EditIcon />}
                  _hover={{ bg: 'orange.600' }}
                  _active={{ bg: 'orange.700' }}
                  px={8}
                >
                  ✏️ Update Coach Profile
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Enhanced Generate Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={onReportModalClose} size="lg">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="7px">
          <ModalHeader>
            <HStack spacing={3}>
              <Box p={2} bg="blue.100" borderRadius="7px" color="blue.600">
                <Box as={FiFileText} />
              </Box>
              <VStack align="start" spacing={0}>
                                  <Text fontSize="lg" fontWeight="bold">Generate Team Report</Text>
                <Text fontSize="sm" color="gray.500">Create comprehensive analytics and insights</Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={generateReport}>
            <ModalBody>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="gray.700">Report Type</FormLabel>
                  <Select
                    value={reportConfig.reportType}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, reportType: e.target.value }))}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                  >
                    <option value="team_summary">Team Summary Report</option>
                    <option value="performance_analysis">Performance Analysis</option>
                    <option value="coach_activity">Coach Activity Report</option>
                    <option value="commission_report">Commission Report</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700">Time Period</FormLabel>
                  <Select
                    value={reportConfig.period}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, period: e.target.value }))}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                  >
                    <option value="weekly">Weekly Report</option>
                    <option value="monthly">Monthly Report</option>
                    <option value="quarterly">Quarterly Report</option>
                    <option value="yearly">Yearly Report</option>
                  </Select>
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel color="gray.700">Start Date</FormLabel>
                    <Input
                      type="date"
                      value={reportConfig.startDate}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, startDate: e.target.value }))}
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.700">End Date</FormLabel>
                    <Input
                      type="date"
                      value={reportConfig.endDate}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, endDate: e.target.value }))}
                      bg="white"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    />
                  </FormControl>
                </SimpleGrid>

                <Box p={4} bg="blue.50" borderRadius="7px" border="1px" borderColor="blue.200">
                  <HStack spacing={3}>
                    <Box color="blue.500">●</Box>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="bold" color="blue.800">
                        Report Generation Info
                      </Text>
                      <Text fontSize="xs" color="blue.700">
                        Reports typically take 1-3 minutes to generate. You'll receive a notification when ready.
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter bg="gray.50" borderBottomRadius="2xl">
              <ButtonGroup spacing={4}>
                <Button 
                  variant="ghost" 
                  onClick={onReportModalClose} 
                  disabled={loading}
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  bg="blue.500"
                  color="white"
                  isLoading={loading}
                  loadingText="Generating..."
                  leftIcon={<Box as={FiFileText} />}
                  _hover={{ bg: 'blue.600' }}
                  _active={{ bg: 'blue.700' }}
                  px={8}
                >
                  Generate Report
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isReportDetailOpen} onClose={closeReportDetail} size="xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="7px">
          <ModalHeader>
            <HStack spacing={3} justifyContent="space-between">
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">Report Details</Text>
                <Text fontSize="sm" color="gray.500">{selectedReport?.reportType?.replace(/_/g, ' ') || ''}</Text>
              </VStack>
              <Button leftIcon={<DownloadIcon />} variant="outline" colorScheme="green" onClick={downloadReportDetail} isDisabled={!reportDetail}>
                Download
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading && !reportDetail ? (
              <VStack spacing={4} align="stretch">
                <Skeleton height="24px" />
                <Skeleton height="120px" />
                <Skeleton height="24px" />
                <Skeleton height="200px" />
              </VStack>
            ) : reportDetail ? (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card><CardBody><VStack align="start" spacing={1}><Text fontSize="xs" color="gray.500">Status</Text><Text fontWeight="600">{reportDetail.status}</Text></VStack></CardBody></Card>
                  <Card><CardBody><VStack align="start" spacing={1}><Text fontSize="xs" color="gray.500">Period</Text><Text fontWeight="600">{reportDetail.reportPeriod?.period}</Text></VStack></CardBody></Card>
                  <Card><CardBody><VStack align="start" spacing={1}><Text fontSize="xs" color="gray.500">Generated</Text><Text fontWeight="600">{reportDetail.generatedAt ? new Date(reportDetail.generatedAt).toLocaleDateString() : 'N/A'}</Text></VStack></CardBody></Card>
                </SimpleGrid>
                <Card>
                  <CardHeader>
                    <Heading size="sm">Individual Metrics</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Leads</Text><Text fontWeight="600">{reportDetail.reportData?.individualMetrics?.leadsGenerated || 0}</Text></VStack>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Conversions</Text><Text fontWeight="600">{reportDetail.reportData?.individualMetrics?.leadsConverted || 0}</Text></VStack>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Sales</Text><Text fontWeight="600">{reportDetail.reportData?.individualMetrics?.salesClosed || 0}</Text></VStack>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Revenue</Text><Text fontWeight="600">{reportDetail.reportData?.individualMetrics?.revenueGenerated || 0}</Text></VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Heading size="sm">Team Metrics</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Team Size</Text><Text fontWeight="600">{reportDetail.reportData?.teamMetrics?.teamSize || 0}</Text></VStack>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Leads</Text><Text fontWeight="600">{reportDetail.reportData?.teamMetrics?.teamLeads || 0}</Text></VStack>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Sales</Text><Text fontWeight="600">{reportDetail.reportData?.teamMetrics?.teamSales || 0}</Text></VStack>
                      <VStack align="start"><Text fontSize="xs" color="gray.500">Revenue</Text><Text fontWeight="600">{reportDetail.reportData?.teamMetrics?.teamRevenue || 0}</Text></VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            ) : (
              <Text color="gray.600">No report details available</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeReportDetail}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Enhanced View Coach Modal */}
      {selectedCoach && (
        <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size="4xl">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent maxH="90vh" overflowY="auto" borderRadius="7px">
            <ModalHeader>
              <HStack spacing={4}>
                <Avatar 
                  size="lg" 
                  name={selectedCoach.name} 
                  bg="blue.500" 
                  color="white"
                  boxShadow="lg"
                />
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color="gray.800">{selectedCoach.name}</Heading>
                  <HStack spacing={2}>
                    <Badge colorScheme={selectedCoach.isActive ? 'green' : 'red'} variant="solid" borderRadius="full">
                      {selectedCoach.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                      Level {selectedCoach.currentLevel || 1}
                    </Badge>
                    <Badge colorScheme="purple" variant="outline" borderRadius="full">
                      👤 Coach Profile
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">{selectedCoach.email}</Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6} align="stretch">
                {/* Quick Actions */}
                <Card bg="gray.50" borderRadius="7px">
                  <CardBody>
                    <ButtonGroup spacing={3} size="sm" w="full" justifyContent="center">
                      <Button
                        leftIcon={<Box as={FiMail} />}
                        colorScheme="blue"
                        variant="outline"
                        _hover={{ bg: 'blue.50' }}
                      >
                        Send Email
                      </Button>
                      <Button
                        leftIcon={<ChatIcon />}
                        colorScheme="green"
                        variant="outline"
                        _hover={{ bg: 'green.50' }}
                      >
                        💬 Send Message
                      </Button>
                      <Button
                        leftIcon={<EditIcon />}
                        colorScheme="orange"
                        variant="outline"
                        onClick={() => {
                          onViewModalClose();
                          openEditModal(selectedCoach);
                        }}
                        _hover={{ bg: 'orange.50' }}
                      >
                        Edit Profile
                      </Button>
                    </ButtonGroup>
                  </CardBody>
                </Card>

                {/* Contact Information */}
                <Card borderRadius="7px" boxShadow="sm">
                  <CardHeader>
                    <Heading size="md" color="gray.800">Contact Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Box p={2} bg="blue.100" borderRadius="7px" color="blue.600">
                            <EmailIcon />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">Email</Text>
                            <Text fontWeight="medium" color="gray.800">{selectedCoach.email}</Text>
                          </VStack>
                        </HStack>
                        
                        <HStack spacing={3}>
                          <Box p={2} bg="green.100" borderRadius="7px" color="green.600">
                            <PhoneIcon />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">Phone</Text>
                            <Text fontWeight="medium" color="gray.800">{selectedCoach.phone || 'Not provided'}</Text>
                          </VStack>
                        </HStack>
                      </VStack>

                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Box p={2} bg="purple.100" borderRadius="7px" color="purple.600">
                            <Box as={FiGlobe} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">Location</Text>
                            <Text fontWeight="medium" color="gray.800">
                              {[selectedCoach.city, selectedCoach.country].filter(Boolean).join(', ') || 'Not specified'}
                            </Text>
                          </VStack>
                        </HStack>
                        
                        <HStack spacing={3}>
                          <Box p={2} bg="orange.100" borderRadius="7px" color="orange.600">
                            <Box as={FiUser} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">Company</Text>
                            <Text fontWeight="medium" color="gray.800">{selectedCoach.company || 'Not specified'}</Text>
                          </VStack>
                        </HStack>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Performance Metrics */}
                {selectedCoach.performance && (
                  <Card borderRadius="7px" boxShadow="sm">
                    <CardHeader>
                      <Heading size="md" color="gray.800">Performance Metrics</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <VStack spacing={2}>
                          <CircularProgress 
                            value={selectedCoach.performance.performanceScore || 0}
                            size="80px"
                            color="blue.400"
                            thickness="8px"
                          >
                            <CircularProgressLabel fontSize="lg" fontWeight="bold">
                              {selectedCoach.performance.performanceScore || 0}%
                            </CircularProgressLabel>
                          </CircularProgress>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">Performance Score</Text>
                        </VStack>

                        <VStack spacing={2}>
                          <Box textAlign="center">
                            <Text fontSize="3xl" fontWeight="bold" color="green.600">
                              {selectedCoach.performance.activityStreak || 0}
                            </Text>
                            <Text fontSize="lg" color="green.600">days</Text>
                          </Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">Activity Streak</Text>
                        </VStack>

                        <VStack spacing={2}>
                          <Box textAlign="center">
                            <Text fontSize="sm" color="gray.500">Last Activity</Text>
                            <Text fontSize="md" fontWeight="bold" color="gray.800">
                              {selectedCoach.performance.lastActivity 
                                ? new Date(selectedCoach.performance.lastActivity).toLocaleDateString()
                                : 'N/A'
                              }
                            </Text>
                          </Box>
                          <Badge 
                            colorScheme={selectedCoach.performance.isActive ? 'green' : 'red'} 
                            variant="subtle"
                            borderRadius="7px"
                            px={3}
                            py={1}
                          >
                            {selectedCoach.performance.isActive ? 'Currently Active' : 'Inactive'}
                          </Badge>
                        </VStack>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                )}

                {/* Professional Details */}
                <Card borderRadius="7px" boxShadow="sm">
                  <CardHeader>
                    <Heading size="md" color="gray.800">💼 Professional Details</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <VStack align="start" spacing={4}>
                        <Box>
                          <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Team Rank</Text>
                          <Text fontWeight="medium" color="gray.800">{selectedCoach.teamRankName || 'Not assigned'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>President Team Rank</Text>
                          <Text fontWeight="medium" color="gray.800">{selectedCoach.presidentTeamRankName || 'Not assigned'}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Experience</Text>
                          <Text fontWeight="medium" color="gray.800">
                            {selectedCoach.portfolio?.experienceYears || 0} years
                          </Text>
                        </Box>
                      </VStack>

                      <VStack align="start" spacing={4}>
                        <Box>
                          <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Member Since</Text>
                          <Text fontWeight="medium" color="gray.800">
                            {selectedCoach.createdAt ? new Date(selectedCoach.createdAt).toLocaleDateString() : 'N/A'}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Current Level</Text>
                          <Badge colorScheme="blue" variant="solid" borderRadius="full" px={3} py={1}>
                            Level {selectedCoach.currentLevel || 1}
                          </Badge>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>Status</Text>
                          <Badge 
                            colorScheme={selectedCoach.isActive ? 'green' : 'red'} 
                            variant="solid"
                            borderRadius="7px"
                            px={3}
                            py={1}
                          >
                            {selectedCoach.isActive ? 'Active Member' : 'Inactive Member'}
                          </Badge>
                        </Box>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Bio Section */}
                {selectedCoach.bio && (
                  <Card borderRadius="7px" boxShadow="sm">
                    <CardHeader>
                      <Heading size="md" color="gray.800">Bio & Description</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text color="gray.700" lineHeight="1.6" fontSize="sm">
                        {selectedCoach.bio}
                      </Text>
                    </CardBody>
                  </Card>
                )}

                {/* Specializations */}
                {selectedCoach.portfolio && selectedCoach.portfolio.specializations && selectedCoach.portfolio.specializations.length > 0 && (
                  <Card borderRadius="7px" boxShadow="sm">
                    <CardHeader>
                      <Heading size="md" color="gray.800">Specializations</Heading>
                    </CardHeader>
                    <CardBody>
                      <Wrap spacing={2}>
                        {selectedCoach.portfolio.specializations.map((spec, idx) => (
                          <WrapItem key={idx}>
                            <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3} py={1}>
                              {spec.name || spec}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter bg="gray.50" borderBottomRadius="2xl">
              <ButtonGroup spacing={4}>
                <Button variant="ghost" onClick={onViewModalClose} color="gray.600">
                  Close
                </Button>
                <Button 
                  colorScheme="orange" 
                  leftIcon={<EditIcon />}
                  onClick={() => {
                    onViewModalClose();
                    openEditModal(selectedCoach);
                  }}
                >
                  Edit Coach
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Admin Request Form Modal */}
      <Modal isOpen={showAdminRequestForm} onClose={() => setShowAdminRequestForm(false)} size="lg">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="7px">
          <ModalHeader>
            <HStack spacing={3}>
              <Box p={2} bg="blue.100" borderRadius="7px" color="blue.600">
                <FiUser />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading size="lg" color="gray.800">Submit Admin Request</Heading>
                <Text fontSize="sm" color="gray.600">Request sponsor ID change</Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="info" borderRadius="7px">
                <AlertIcon />
                <Box>
                  <Text fontWeight="600" color="blue.800">Hierarchy Locking Policy</Text>
                  <Text fontSize="sm" color="blue.700" mt={1}>
                    Your sponsor ID is locked after signup for security. Any changes require admin approval.
                  </Text>
                </Box>
              </Alert>

              <FormControl>
                <FormLabel fontWeight="600" color="gray.700">Request Type</FormLabel>
                <Input value="Sponsor ID Change" isReadOnly bg="gray.50" />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="600" color="gray.700">Search New Sponsor</FormLabel>
                <Input
                  placeholder="Search by name, coach ID, phone, or email..."
                  onChange={(e) => searchSponsors(e.target.value)}
                  bg="white"
                />
                {sponsorSearchResults.length > 0 && (
                  <VStack align="stretch" spacing={2} mt={2} maxH="200px" overflowY="auto">
                    {sponsorSearchResults.map((sponsor) => (
                      <Card
                        key={sponsor._id}
                        p={3}
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="7px"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedSponsor(sponsor);
                          setSponsorSearchResults([]);
                        }}
                        bg={selectedSponsor?._id === sponsor._id ? "blue.50" : "white"}
                        _hover={{ bg: "gray.50" }}
                      >
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="600" color="gray.800">{sponsor.name}</Text>
                            <Text fontSize="xs" color="gray.600">
                              {sponsor.type === 'digital' ? `ID: ${sponsor.displayId}` : `${sponsor.displayId}`}
                            </Text>
                          </VStack>
                          <Badge colorScheme={sponsor.type === 'digital' ? 'blue' : 'green'} variant="subtle">
                            {sponsor.type === 'digital' ? 'Digital System' : 'External'}
                          </Badge>
                        </HStack>
                      </Card>
                    ))}
                  </VStack>
                )}
              </FormControl>

              {selectedSponsor && (
                <Card p={3} bg="green.50" border="1px" borderColor="green.200" borderRadius="7px">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="600" color="green.800">Selected Sponsor</Text>
                      <Text color="green.700">{selectedSponsor.name}</Text>
                      <Text fontSize="xs" color="green.600">
                        {selectedSponsor.type === 'digital' ? `ID: ${selectedSponsor.displayId}` : `${selectedSponsor.displayId}`}
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => setSelectedSponsor(null)}
                    >
                      <FiTrash2 />
                    </Button>
                  </HStack>
                </Card>
              )}

              <FormControl>
                <FormLabel fontWeight="600" color="gray.700">Reason for Change</FormLabel>
                <Textarea
                  placeholder="Please explain why you need to change your sponsor ID..."
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  rows={4}
                  resize="none"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup spacing={3}>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowAdminRequestForm(false);
                  setSelectedSponsor(null);
                  setRequestForm({ requestType: 'sponsor_change', requestedSponsorId: '', reason: '' });
                  setSponsorSearchResults([]);
                }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={submitAdminRequest}
                isLoading={loading}
                isDisabled={!selectedSponsor || !requestForm.reason.trim()}
              >
                Submit Request
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          // Handle delete confirmation
          onDeleteModalClose();
          toast('Coach deletion confirmed', 'success');
        }}
        title="Delete Coach"
        message="This action cannot be undone. This will permanently remove the coach from your team."
        isLoading={loading}
      />
    </Box>
  );
};

// Add custom CSS animations for the tree structure
const treeStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideDown {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: 100%;
      opacity: 1;
    }
  }
  
  @keyframes slideRight {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      opacity: 1;
    }
  }
  
  @keyframes expandWidth {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes fadeInOut {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }
  
  /* Animated Line Drawing Animations */
  @keyframes drawLineVertical {
    from {
      height: 0;
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      height: 100%;
      opacity: 1;
    }
  }
  
  @keyframes drawLineHorizontal {
    0% {
      width: 0;
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      width: 100%;
      opacity: 1;
    }
  }
  
  @keyframes drawConnectionPoint {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(180deg);
      opacity: 0.7;
    }
    100% {
      transform: scale(1) rotate(360deg);
      opacity: 1;
    }
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .hierarchy-node-container {
    animation: fadeInUp 0.6s ease-out both;
  }
  
  .coach-card {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .coach-card:hover {
    transform: translateY(-8px) scale(1.03);
  }
  
  /* Animated Connection Lines */
  .connection-line-root {
    animation: drawLineVertical 1.2s ease-out 0.5s both;
  }
  
  .connection-line-horizontal {
    animation: drawLineHorizontal 1.5s ease-out 1s both;
  }
  
  .connection-line-level1 {
    animation: drawLineVertical 1s ease-out 1.2s both;
  }
  
  .connection-line-level2 {
    animation: drawLineVertical 1s ease-out 1.5s both;
  }
  
  .connection-line-level3 {
    animation: drawLineVertical 1s ease-out 1.8s both;
  }
  
  .connection-point {
    animation: drawConnectionPoint 0.8s ease-out both;
  }
  
  .connection-point-level1 {
    animation: drawConnectionPoint 0.8s ease-out 1.3s both;
  }
  
  .connection-point-level2 {
    animation: drawConnectionPoint 0.8s ease-out 1.6s both;
  }
  
  .connection-point-level3 {
    animation: drawConnectionPoint 0.8s ease-out 1.9s both;
  }
  
  /* Tree Container Animation */
  .tree-container {
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  /* Progressive Node Animation */
  .hierarchy-node-container {
    animation: fadeInUp 0.6s ease-out both;
  }
  
  .hierarchy-node-container:nth-child(1) { animation-delay: 0.3s; }
  .hierarchy-node-container:nth-child(2) { animation-delay: 0.5s; }
  .hierarchy-node-container:nth-child(3) { animation-delay: 0.7s; }
  .hierarchy-node-container:nth-child(4) { animation-delay: 0.9s; }
  .hierarchy-node-container:nth-child(5) { animation-delay: 1.1s; }
  
  /* Head Coach Icon Animation */
  .head-coach-icon {
    animation: drawConnectionPoint 1s ease-out 0.1s both;
  }
`;

// Inject the styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = treeStyles;
  document.head.appendChild(styleElement);
}

export default MLMDashboard;
