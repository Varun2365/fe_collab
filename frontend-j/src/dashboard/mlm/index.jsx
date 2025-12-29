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
  FiZoomIn, FiZoomOut, FiMaximize2
} from 'react-icons/fi';

// --- BEAUTIFUL SKELETON COMPONENTS ---
const BeautifulSkeleton = () => {
  return (
    <Box bg="gray.100" minH="100vh" py={6} px={6}>
      <Box maxW="full" mx="auto">
        <VStack spacing={8} align="stretch" w="full">
          {/* Header Skeleton */}
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
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
                          <Skeleton height="60px" width="60px" borderRadius="lg" />
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
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
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
        borderRadius="2xl"
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
              {level === 0 ? '👑' : `L${level}`}
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
                    borderRadius="full"
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
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {coach.isActive ? '✅ Active' : '❌ Inactive'}
                    </Badge>
                    {level === 0 && (
                      <Badge
                        bg="linear-gradient(45deg, #FFD700, #FFA500)"
                        color="white"
                        size="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                        boxShadow="0 4px 8px rgba(255, 215, 0, 0.3)"
                        animation="shimmer 2s infinite"
                      >
                        👑 HEAD COACH
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
              borderRadius="xl"
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
                    borderRadius="full"
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
                    borderRadius="full"
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
                    borderRadius="full"
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
                    borderRadius="full"
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
                borderRadius="xl" 
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
                    borderRadius="full"
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

            {/* Enhanced Action Buttons */}
            <HStack spacing={3} w="full">
              <Button
                size="md"
                variant="outline"
                colorScheme="blue"
                leftIcon={<ViewIcon />}
                onClick={() => onViewCoach(coach)}
                flex="1"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{ 
                  bg: 'blue.50', 
                  borderColor: 'blue.400',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                transition="all 0.3s"
              >
                👁️ View
              </Button>
              <Button
                size="md"
                variant="outline"
                colorScheme="orange"
                leftIcon={<EditIcon />}
                onClick={() => onEditCoach(coach)}
                flex="1"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{ 
                  bg: 'orange.50', 
                  borderColor: 'orange.400',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                }}
                transition="all 0.3s"
              >
                ✏️ Edit
              </Button>
              {/* Only show expand button for non-root levels */}
              {level > 0 && canExpand && (
                <IconButton
                  size="md"
                  variant="outline"
                  colorScheme={colorScheme.bg.split('.')[0]}
                  icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  onClick={() => setIsExpanded(!isExpanded)}
                  borderRadius="xl"
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
                borderRadius="lg"
                border="1px solid"
                borderColor={`${colorScheme.bg}30`}
              >
                <HStack justify="center" spacing={2}>
                  <Box
                    w="8px"
                    h="8px"
                    bg={isExpanded ? 'green.400' : 'gray.400'}
                    borderRadius="full"
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
          borderRadius="lg"
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

  // Sample data for demonstration when no real data is available
  const sampleHierarchyData = {
    name: 'Varun Kumar',
    email: 'varun.kumar@mlmnetwork.com',
    _id: 'sample-root-001',
    isActive: true,
    currentLevel: 0,
    teamRankName: 'Head Coach',
    downline: [
      {
        _id: 'sample-l1-001',
        name: 'Priya Sharma',
        email: 'priya.sharma@mlmnetwork.com',
        isActive: true,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 85,
          activityStreak: 12,
          isActive: true
        },
        downline: [
          {
            _id: 'sample-l2-001',
            name: 'Rahul Verma',
            email: 'rahul.verma@mlmnetwork.com',
            isActive: true,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 72,
              activityStreak: 8,
              isActive: true
            },
            downline: [
              {
                _id: 'sample-l3-001',
                name: 'Anjali Patel',
                email: 'anjali.patel@mlmnetwork.com',
                isActive: true,
                currentLevel: 3,
                teamRankName: 'Associate',
                performance: {
                  performanceScore: 65,
                  activityStreak: 5,
                  isActive: true
                },
                downline: []
              },
              {
                _id: 'sample-l3-002',
                name: 'Vikram Singh',
                email: 'vikram.singh@mlmnetwork.com',
                isActive: false,
                currentLevel: 3,
                teamRankName: 'Associate',
                performance: {
                  performanceScore: 45,
                  activityStreak: 2,
                  isActive: false
                },
                downline: []
              }
            ]
          },
          {
            _id: 'sample-l2-002',
            name: 'Meera Kapoor',
            email: 'meera.kapoor@mlmnetwork.com',
            isActive: true,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 78,
              activityStreak: 15,
              isActive: true
            },
            downline: [
              {
                _id: 'sample-l3-003',
                name: 'Arjun Reddy',
                email: 'arjun.reddy@mlmnetwork.com',
                isActive: true,
                currentLevel: 3,
                teamRankName: 'Associate',
                performance: {
                  performanceScore: 68,
                  activityStreak: 7,
                  isActive: true
                },
                downline: []
              }
            ]
          }
        ]
      },
      {
        _id: 'sample-l1-002',
        name: 'Amit Patel',
        email: 'amit.patel@mlmnetwork.com',
        isActive: true,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 92,
          activityStreak: 25,
          isActive: true
        },
        downline: [
          {
            _id: 'sample-l2-003',
            name: 'Neha Gupta',
            email: 'neha.gupta@mlmnetwork.com',
            isActive: true,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 81,
              activityStreak: 18,
              isActive: true
            },
            downline: []
          },
          {
            _id: 'sample-l2-004',
            name: 'Suresh Kumar',
            email: 'suresh.kumar@mlmnetwork.com',
            isActive: false,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 58,
              activityStreak: 3,
              isActive: false
            },
            downline: []
          }
        ]
      },
      {
        _id: 'sample-l1-003',
        name: 'Kavita Singh',
        email: 'kavita.singh@mlmnetwork.com',
        isActive: true,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 88,
          activityStreak: 20,
          isActive: true
        },
        downline: [
          {
            _id: 'sample-l2-005',
            name: 'Rajesh Malhotra',
            email: 'rajesh.malhotra@mlmnetwork.com',
            isActive: true,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 75,
              activityStreak: 11,
              isActive: true
            },
            downline: []
          }
        ]
      },
      {
        _id: 'sample-l1-004',
        name: 'Deepak Sharma',
        email: 'deepak.sharma@mlmnetwork.com',
        isActive: false,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 62,
          activityStreak: 4,
          isActive: false
        },
        downline: []
      }
    ]
  };

  // Process hierarchy data to build proper tree structure
  const processedHierarchy = useMemo(() => {
    // If no real data, use sample data
    if (!hierarchyData) {
      return sampleHierarchyData;
    }
    
    // Handle the new data structure with downlineHierarchy
    if (hierarchyData.downlineHierarchy && Array.isArray(hierarchyData.downlineHierarchy)) {
      // Create the root node (you) with your downline as children
      const rootNode = {
        name: hierarchyData.name || 'Network Leader',
        email: hierarchyData.email || '',
        _id: hierarchyData._id || 'root',
        isActive: true,
        currentLevel: 0,
        teamRankName: 'Head Coach',
        downline: hierarchyData.downlineHierarchy.map(member => ({
          ...member,
          // Convert the flat structure to tree structure
          downline: [], // For now, we'll show only direct level
          // Add performance data if available
          performance: member.performance || {
            currentLevel: member.currentLevel || 'Beginner',
            performanceScore: member.performanceScore || 0,
            isActive: member.isActive || false,
            activityStreak: member.activityStreak || 0
          }
        }))
      };
      
      return rootNode;
    }
    
    // Fallback to old structure if needed
    if (hierarchyData.coach || hierarchyData.name) {
      return hierarchyData.coach || hierarchyData;
    }
    
    // If it's an array, find the root coach (head coach)
    if (Array.isArray(hierarchyData)) {
      // Find head coach (the one without sponsorId or with sponsorId === userId)
      const headCoach = hierarchyData.find(coach => 
        !coach.sponsorId || coach.sponsorId === coach._id
      ) || hierarchyData[0];
      
      if (headCoach) {
        // Build tree structure recursively
        const buildTree = (parentId) => {
          return hierarchyData
            .filter(coach => coach.sponsorId === parentId && coach._id !== parentId)
            .map(coach => ({
              ...coach,
              downline: buildTree(coach._id)
            }));
        };
        
        return {
          ...headCoach,
          downline: buildTree(headCoach._id)
        };
      }
    }
    
    // If all else fails, return sample data
    return sampleHierarchyData;
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
      <Card bg="white" border="1px" borderColor="gray.200" borderRadius="xl" boxShadow="md">
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
                    placeholder="🔍 Search coaches..."
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
          <Skeleton height="150px" borderRadius="lg" />
          <HStack spacing={4} overflowX="auto">
            <Skeleton height="300px" width="350px" borderRadius="lg" />
            <Skeleton height="300px" width="350px" borderRadius="lg" />
            <Skeleton height="300px" width="350px" borderRadius="lg" />
          </HStack>
        </VStack>
      )}

      {/* Show no data state */}
      {!loading && !processedHierarchy && (
        <Card bg="linear-gradient(135deg, rgba(219, 234, 254, 0.5), rgba(233, 213, 255, 0.5))" borderRadius="xl" border="2px dashed" borderColor="blue.300">
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
              value={processedHierarchy.downline ? processedHierarchy.downline.length : 0}
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
            borderRadius="xl" 
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
                      {processedHierarchy.name}'s Complete MLM Network Structure
                    </Text>
                    {/* Sample Data Notice */}
                    {!hierarchyData && (
                      <HStack spacing={2} align="center">
                        <Box w="2px" h="4" bg="orange.400" borderRadius="full" />
                        <Text fontSize="sm" color="orange.600" fontWeight="medium">
                          📱 Demo Mode - Using Sample Data
                        </Text>
                      </HStack>
                    )}
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
                  <Card bg="gray.50" border="1px" borderColor="gray.200" borderRadius="lg">
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
                            {/* Sample Data Indicator */}
                            {!hierarchyData && (
                              <Badge 
                                colorScheme="orange" 
                                variant="solid" 
                                borderRadius="full"
                                animation="pulse 2s infinite"
                              >
                                📱 Sample Data
                              </Badge>
                            )}
                          </HStack>
                        </HStack>
                        
                        {/* Tree Depth Slider - Always visible */}
                        <FormControl w="full">
                          <FormLabel fontSize="sm" mb={2} color="gray.700" fontWeight="bold">
                            🎯 Tree Depth Control
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
                          borderRadius="lg" 
                          border="1px solid" 
                          borderColor="blue.200"
                          mb={4}
                        >
                          <VStack spacing={3}>
                            {/* Sample Data Info */}
                            {!hierarchyData && (
                              <Box 
                                p={3} 
                                bg="orange.50" 
                                borderRadius="lg" 
                                border="1px solid" 
                                borderColor="orange.200"
                                w="full"
                              >
                                <HStack spacing={3} justify="center">
                                  <Box fontSize="16px">📱</Box>
                                  <Text fontSize="sm" color="orange.700" fontWeight="medium" textAlign="center">
                                    Demo Mode Active - This is sample data to showcase the Team Hierarchy Tree functionality
                                  </Text>
                                </HStack>
                              </Box>
                            )}
                            
                            {/* Connection Lines Legend */}
                            <Box 
                              p={3} 
                              bg="purple.50" 
                              borderRadius="lg" 
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
                                Level 1: {processedHierarchy.downline ? processedHierarchy.downline.length : 0} Direct Members
                              </Text>
                              {treeDepth > 1 && (
                                <>
                                  <Box w="3px" h="20px" bg="purple.500" borderRadius="full" />
                                  <Text fontSize="sm" color="purple.700" fontWeight="medium">
                                    Level 2: {processedHierarchy.downline ? 
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
                                    Level 3: {processedHierarchy.downline ? 
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
                          <FormControl w="200px" display={processedHierarchy.downline && processedHierarchy.downline.length > 3 ? 'block' : 'none'}>
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
                          <FormControl w="200px" display={processedHierarchy.downline && processedHierarchy.downline.length > 2 ? 'block' : 'none'}>
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
                          borderRadius="full"
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
                                  borderRadius="full"
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
                                {processedHierarchy.downline.length > 1 && (
                                  <Box
                                    position="absolute"
                                    top="40px"
                                    left="25%"
                                    right="25%"
                                    height="4px"
                                    bgGradient="linear(to-r, blue.400, purple.500, blue.400)"
                                    borderRadius="full"
                                    zIndex={1}
                                    className="connection-line-horizontal"
                                  />
                                )}
                                
                                {/* Individual vertical lines to each child */}
                                {processedHierarchy.downline.map((_, index) => {
                                  const totalChildren = processedHierarchy.downline.length;
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
                                      borderRadius="full"
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
                            columns={{ base: 1, md: processedHierarchy.downline.length }} 
                            spacing={`var(--node-spacing)`}
                            justifyItems="center"
                            w="full"
                          >
                            {processedHierarchy.downline.map((childCoach, index) => (
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
                                    borderRadius="full"
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
                                    borderRadius="full"
                                    zIndex={1}
                                    className="connection-line-horizontal"
                                    style={{ animationDelay: "1.4s" }}
                                  />
                                  
                                  {/* Individual connection points */}
                                  {processedHierarchy.downline.map((childCoach, childIndex) => {
                                    if (childCoach.downline && childCoach.downline.length > 0) {
                                      return childCoach.downline.map((_, grandIndex) => {
                                        const totalGrandChildren = processedHierarchy.downline.reduce((total, child) => 
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
                                              borderRadius="full"
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
                                            borderRadius="full"
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
                                            borderRadius="full"
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
                                    borderRadius="full"
                                    zIndex={1}
                                    className="connection-line-horizontal"
                                    style={{ animationDelay: "1.7s" }}
                                  />
                                  
                                  {/* Individual connection points for Level 3 */}
                                  {processedHierarchy.downline.map((childCoach, childIndex) => {
                                    if (childCoach.downline && childCoach.downline.length > 0) {
                                      return childCoach.downline.map((grandChildCoach, grandIndex) => {
                                        if (grandChildCoach.downline && grandChildCoach.downline.length > 0) {
                                          return grandChildCoach.downline.map((_, greatGrandIndex) => {
                                            const totalGreatGrandChildren = processedHierarchy.downline.reduce((total, child) => 
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
                                                borderRadius="full"
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
                                {processedHierarchy.downline.map((childCoach, childIndex) => (
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
                                              borderRadius="full"
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
                                                borderRadius="full"
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
          <Card bg="linear-gradient(135deg, rgba(219, 234, 254, 0.5), rgba(233, 213, 255, 0.5))" border="1px" borderColor="blue.200" borderRadius="xl" boxShadow="md">
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
                      borderRadius="full"
                    >
                      {coach.isActive ? '✅ Active' : '❌ Inactive'}
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
      <ModalContent borderRadius="2xl">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box 
            bg="orange.50" 
            border="1px" 
            borderColor="orange.200" 
            borderRadius="lg" 
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
    // Check localStorage as fallback
    const localAuth = getLocalStorageAuth();
    
    // Use Redux data if available, otherwise fallback to localStorage
    const finalCoachId = coachId || localAuth.coachId;
    const finalToken = token || localAuth.token;
    const finalUser = user || localAuth.user;
    
    setEffectiveAuth({
      coachId: finalCoachId,
      token: finalToken,
      user: finalUser
    });
    
    if (!finalCoachId || !finalToken) {
      toast('Authentication data not available. Please log in again.', 'warning');
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoaches, setSelectedCoaches] = useState(new Set());
  const [showDummyData, setShowDummyData] = useState(false);
  const [treeZoom, setTreeZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [treePosition, setTreePosition] = useState({ x: 0, y: 0 });

  // Sample data for demonstration
  const sampleHierarchyData = {
    name: 'Varun Kumar',
    email: 'varun.kumar@mlmnetwork.com',
    _id: 'sample-root-001',
    isActive: true,
    currentLevel: 0,
    teamRankName: 'Head Coach',
    downline: [
      {
        _id: 'sample-l1-001',
        name: 'Priya Sharma',
        email: 'priya.sharma@mlmnetwork.com',
        isActive: true,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 85,
          activityStreak: 12,
          isActive: true
        },
        downline: [
          {
            _id: 'sample-l2-001',
            name: 'Rahul Verma',
            email: 'rahul.verma@mlmnetwork.com',
            isActive: true,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 72,
              activityStreak: 8,
              isActive: true
            },
            downline: []
          },
          {
            _id: 'sample-l2-002',
            name: 'Meera Kapoor',
            email: 'meera.kapoor@mlmnetwork.com',
            isActive: true,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 78,
              activityStreak: 15,
              isActive: true
            },
            downline: []
          }
        ]
      },
      {
        _id: 'sample-l1-002',
        name: 'Amit Patel',
        email: 'amit.patel@mlmnetwork.com',
        isActive: true,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 92,
          activityStreak: 25,
          isActive: true
        },
        downline: [
          {
            _id: 'sample-l2-003',
            name: 'Neha Gupta',
            email: 'neha.gupta@mlmnetwork.com',
            isActive: true,
            currentLevel: 2,
            teamRankName: 'Coach',
            performance: {
              performanceScore: 81,
              activityStreak: 18,
              isActive: true
            },
            downline: []
          }
        ]
      },
      {
        _id: 'sample-l1-003',
        name: 'Kavita Singh',
        email: 'kavita.singh@mlmnetwork.com',
        isActive: true,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 88,
          activityStreak: 20,
          isActive: true
        },
        downline: []
      },
      {
        _id: 'sample-l1-004',
        name: 'Deepak Sharma',
        email: 'deepak.sharma@mlmnetwork.com',
        isActive: false,
        currentLevel: 1,
        teamRankName: 'Senior Coach',
        performance: {
          performanceScore: 62,
          activityStreak: 4,
          isActive: false
        },
        downline: []
      }
    ]
  };
  
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
      sponsorId: effectiveAuth.coachId || ''
    }));
  }, [effectiveAuth.coachId]);

  const [reportConfig, setReportConfig] = useState({
    reportType: 'team_summary',
    period: 'monthly',
    startDate: '',
    endDate: ''
  });

  const BASE_URL = API_BASE_URL;

  // API Headers - ENHANCED with fallback authentication
  const getHeaders = () => {
    const authData = effectiveAuth;
    
    return {
      'Authorization': `Bearer ${authData.token}`,
      'Coach-ID': authData.coachId || '',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
  };

  // API Functions
  const fetchHierarchyLevels = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/hierarchy-levels`, {
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
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/downline/${authData.coachId}?includePerformance=true`, {
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
      // Use the downline API to get your team structure
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/downline/${authData.coachId}?includePerformance=true`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Process the data to match the expected structure
        let processedData;
        if (data.success && data.data) {
          // If data has success wrapper
          if (data.data.downlineWithPerformance) {
            processedData = {
              name: user?.name || 'Network Leader',
              email: user?.email || '',
              _id: user?.id,
              isActive: true,
              currentLevel: 0,
              downlineHierarchy: data.data.downlineWithPerformance || []
            };
          } else if (data.data.downline) {
            processedData = {
              name: user?.name || 'Network Leader',
              email: user?.email || '',
              _id: user?.id,
              isActive: true,
              currentLevel: 0,
              downlineHierarchy: data.data.downline || []
            };
          } else {
            processedData = {
              name: user?.name || 'Network Leader',
              email: user?.email || '',
              _id: user?.id,
              isActive: true,
              currentLevel: 0,
              downlineHierarchy: data.data || []
            };
          }
        } else {
          // If data is direct
          if (data.downlineWithPerformance) {
            processedData = {
              name: user?.name || 'Network Leader',
              email: user?.email || '',
              _id: user?.id,
              isActive: true,
              currentLevel: 0,
              downlineHierarchy: data.downlineWithPerformance || []
            };
          } else if (data.downline) {
            processedData = {
              name: user?.name || 'Network Leader',
              email: user?.email || '',
              _id: user?.id,
              isActive: true,
              currentLevel: 0,
              downlineHierarchy: data.downline || []
            };
          } else {
            processedData = {
              name: user?.name || 'Network Leader',
              email: user?.email || '',
              _id: user?.id,
              isActive: true,
              currentLevel: 0,
              downlineHierarchy: data || []
            };
          }
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
          errorData.message?.toLowerCase().includes('no downline found') ||
          errorData.message?.toLowerCase().includes('no team members found') ||
          errorData.message?.toLowerCase().includes('not found')
        )) {
          // Set empty hierarchy data (no downline yet) - this is expected, not an error
          const emptyData = {
            name: effectiveAuth.user?.name || user?.name || 'Network Leader',
            email: effectiveAuth.user?.email || user?.email || '',
            _id: effectiveAuth.coachId || user?.id,
            isActive: true,
            currentLevel: 0,
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
            isActive: true,
            currentLevel: 0,
            downlineHierarchy: []
          };
          setHierarchyData(emptyData);
        }
      }
    } catch (error) {
      console.error('💥 fetchHierarchy Error:', error);
      
      // Set empty data on network error
      const emptyData = {
        name: effectiveAuth.user?.name || user?.name || 'Network Leader',
        email: effectiveAuth.user?.email || user?.email || '',
        _id: effectiveAuth.coachId || user?.id,
        isActive: true,
        currentLevel: 0,
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
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/team-performance/${authData.coachId}?period=monthly`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const processedData = data.success ? data.data : data;
        
        // Check if the data has the expected structure
        if (processedData && (
          processedData.totalTeamSize !== undefined ||
          processedData.activeCoaches !== undefined ||
          processedData.totalRevenue !== undefined ||
          processedData.averagePerformanceScore !== undefined
        )) {
          setTeamPerformance(processedData);
        } else {
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
          // No team members yet - this is normal, just set to null (no error logging)
          setTeamPerformance(null);
        } else {
          // Real error - only log if it's not a 404
          if (response.status !== 404) {
            console.error('❌ Team Performance API Error Response:', errorText);
            toast(`Failed to fetch team performance: ${response.status} ${response.statusText}`, 'error');
          }
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
    
    fetchingRef.current.reports = true;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/reports/${user?.id}?limit=10`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data.success ? data.data : data);
      } else {
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

  // Fetch Commissions
  const fetchCommissions = async () => {
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/commissions/${authData.coachId}`, {
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
    const authData = effectiveAuth;
    if (!authData.coachId || !authData.token) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/admin-requests/${authData.coachId}`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAdminRequests(data.success ? (data.data || []) : []);
      }
    } catch (error) {
      console.error('💥 fetchAdminRequests Error:', error);
      toast('Failed to fetch admin requests', 'error');
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
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/coach-performance/${authData.coachId}`, {
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
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/sales-performance/${authData.coachId}`, {
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
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/client-performance/${authData.coachId}`, {
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
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/lead-performance/${authData.coachId}`, {
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
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/downline`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...formData,
          sponsorId: user?.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast('Coach added successfully');
        onAddModalClose();
        resetForm();
        fetchDownline();
        fetchHierarchy(); // Refresh hierarchy when adding new coach
        fetchTeamPerformance();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add coach');
      }
    } catch (error) {
      console.error('💥 addCoach Error:', error);
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/advanced-mlm/generate-report`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          sponsorId: user?.id,
          ...reportConfig
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast('Report generation started');
        onReportModalClose();
        fetchReports();
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('💥 generateReport Error:', error);
      toast(error.message, 'error');
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
      sponsorId: user?.id || '',
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
      sponsorId: coach.sponsorId || user?.id || '',
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
    // Only fetch if not already fetching and data is not loaded
    switch (activeTab) {
      case 0: // Hierarchy
        if (!fetchingRef.current.hierarchy && !hierarchyData) {
          fetchHierarchy();
        }
        break;
      case 1: // Direct Coaches
        if (!fetchingRef.current.downline && downlineData.length === 0) {
          fetchDownline();
        }
        break;
      case 2: // Performance
        if (!fetchingRef.current.teamPerformance && !teamPerformance) {
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
          fetchReports();
        }
        break;
      case 4: // Commissions
        if (commissions.length === 0) {
          fetchCommissions();
        }
        break;
      case 5: // Admin Requests
        if (adminRequests.length === 0) {
          fetchAdminRequests();
        }
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, performanceSubTab]); // Only depend on activeTab and performanceSubTab

  // Conditional rendering for loading
  if (loading && !downlineData.length && !hierarchyData && !teamPerformance) {
    return <BeautifulSkeleton />;
  }

  return (
    <Box bg="gray.100" minH="100vh" py={6} px={6}>
      <Box maxW="full" mx="auto">
        <VStack spacing={8} align="stretch" w="full">
          {/* Minimalist Header */}
          <Card bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.100">
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
                    {/* Toggle for Dummy/Actual Data - Only show in Hierarchy tab */}
                    {activeTab === 0 && (
                      <HStack spacing={2} align="center" px={3} py={2} bg="gray.50" borderRadius="7px">
                        <Text fontSize="xs" color="gray.600" fontWeight="500" whiteSpace="nowrap">
                          {showDummyData ? 'Demo' : 'Actual'}
                        </Text>
                        <Switch
                          isChecked={showDummyData}
                          onChange={(e) => setShowDummyData(e.target.checked)}
                          colorScheme="blue"
                          size="sm"
                        />
                      </HStack>
                    )}
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
            <Card bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="lg" shadow="md">
              <CardBody py={4}>
                <HStack justify="space-between" align="center">
                  <HStack spacing={3} align="center">
                    <Box
                      w="8px"
                      h="8px"
                      bg="blue.500"
                      borderRadius="full"
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
                      borderRadius="lg"
                    >
                      📥 Export Selected
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
                      borderRadius="lg"
                    >
                      🗑️ Delete Selected
                    </Button>
                  </ButtonGroup>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Card bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.100">
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
                >
                  Admin Requests
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
                      // Determine which data to use based on toggle
                      const dataToUse = showDummyData ? sampleHierarchyData : hierarchyData;
                      
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
                                {showDummyData && (
                                  <Badge colorScheme="orange" variant="subtle" fontSize="xs" borderRadius="full" px={2}>
                                    Demo Data
                                  </Badge>
                                )}
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
                                            src={`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`}
                                            alt={dataToUse.name || 'You'}
                                            borderRadius="full"
                                            boxSize="80px"
                                            border="4px solid"
                                            borderColor="gray.400"
                                            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                                            objectFit="cover"
                                            fallbackSrc="https://via.placeholder.com/80"
                                          />
                                          <Box
                                            position="absolute"
                                            bottom="-2px"
                                            right="-2px"
                                            w={4}
                                            h={4}
                                            bg="green.500"
                                            borderRadius="full"
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
                                          const imageId = (member._id ? member._id.toString().charCodeAt(0) : index) % 70 + 1;
                                          
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
                                                        src={`https://i.pravatar.cc/150?img=${imageId}`}
                                                        alt={member.name}
                                                        borderRadius="full"
                                                        boxSize="64px"
                                                        border="3px solid"
                                                        borderColor={member.isActive !== false ? "green.400" : "gray.400"}
                                                        boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                                                        objectFit="cover"
                                                        fallbackSrc="https://via.placeholder.com/64"
                                                      />
                                                      <Box
                                                        position="absolute"
                                                        bottom="-2px"
                                                        right="-2px"
                                                        w={3}
                                                        h={3}
                                                        bg={member.isActive !== false ? "green.500" : "gray.400"}
                                                        borderRadius="full"
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
                                                        const childImageId = (child._id ? child._id.toString().charCodeAt(0) : childIndex) % 70 + 1;
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
                                                                    src={`https://i.pravatar.cc/150?img=${childImageId}`}
                                                                    alt={child.name}
                                                                    borderRadius="full"
                                                                    boxSize="48px"
                                                                    border="2px solid"
                                                                    borderColor={child.isActive !== false ? "green.400" : "gray.400"}
                                                                    boxShadow="0 2px 6px rgba(0,0,0,0.1)"
                                                                    objectFit="cover"
                                                                    fallbackSrc="https://via.placeholder.com/48"
                                                                  />
                                                                  <Box
                                                                    position="absolute"
                                                                    bottom="-1px"
                                                                    right="-1px"
                                                                    w={2.5}
                                                                    h={2.5}
                                                                    bg={child.isActive !== false ? "green.500" : "gray.400"}
                                                                    borderRadius="full"
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
                            placeholder="🔍 Search coaches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg="white"
                            borderRadius="lg"
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
                          ➕ Add Coach
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Enhanced Table or Cards View */}
                    {loading ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {Array(6).fill(0).map((_, i) => (
                          <Card key={i} borderRadius="lg">
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
                      <Card borderRadius="xl" overflow="hidden" border="1px" borderColor="gray.200">
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
                                        <HStack spacing={2}>
                                          <Badge colorScheme={coach.isActive ? 'green' : 'red'} size="sm" borderRadius="full">
                                            {coach.isActive ? '✅ Active' : '❌ Inactive'}
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
                                        borderRadius="full"
                                        px={3}
                                        py={1}
                                      >
                                        {coach.isActive ? '✅ Active' : '❌ Inactive'}
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
                                            📧 Send Email
                                          </MenuItem>
                                          <MenuItem icon={<ChatIcon />}>
                                            💬 Send Message
                                          </MenuItem>
                                          <MenuDivider />
                                          <MenuItem 
                                            icon={<DeleteIcon />} 
                                            color="red.500"
                                            onClick={() => openDeleteModal(coach)}
                                          >
                                            🗑️ Delete Coach
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
                      <Card bg="gray.50" borderRadius="lg" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="lg"
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
                                ➕ Add New Coach
                              </Button>
                            </VStack>
                          </Center>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>

                {/* Performance Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Team Performance Analytics</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Comprehensive insights into your team's performance and growth
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
                        <Skeleton height="200px" borderRadius="lg" />
                        <SimpleGrid columns={3} spacing={4} w="100%">
                          <Skeleton height="150px" borderRadius="lg" />
                          <Skeleton height="150px" borderRadius="lg" />
                          <Skeleton height="150px" borderRadius="lg" />
                        </SimpleGrid>
                      </VStack>
                    ) : teamPerformance ? (
                      <VStack spacing={6} align="stretch">
                        {/* Performance Overview Cards */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                          <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" borderRadius="xl" boxShadow="lg">
                            <CardBody textAlign="center" p={6}>
                              <VStack spacing={3}>
                                <Box p={3} bg="white" borderRadius="full">
                                  <Text fontSize="2xl" color="blue.600">●</Text>
                                </Box>
                                <Stat>
                                  <StatLabel color="white" fontSize="sm">TEAM SIZE</StatLabel>
                                  <StatNumber color="white" fontSize="3xl">
                                    {teamPerformance.teamSize || 0}
                                  </StatNumber>
                                  <StatHelpText color="white" opacity={0.8}>Total Members</StatHelpText>
                                </Stat>
                              </VStack>
                            </CardBody>
                          </Card>
                          
                          <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white" borderRadius="xl" boxShadow="lg">
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
                          
                          <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white" borderRadius="xl" boxShadow="lg">
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
                          
                          <Card bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" color="white" borderRadius="xl" boxShadow="lg">
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
                          <Card borderRadius="xl" boxShadow="md">
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
                                    borderRadius="full"
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
                                    borderRadius="full"
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
                                    borderRadius="full"
                                  />
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>

                          <Card borderRadius="xl" boxShadow="md">
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
                                    borderRadius="full"
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
                                    borderRadius="full"
                                  />
                                </Box>

                                <Box textAlign="center" p={4} bg="gray.50" borderRadius="lg">
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
                      </VStack>
                    ) : (
                      <Card bg="gray.50" borderRadius="lg" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="lg"
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
                                <Heading size="md" color="gray.800">Team Performance Analytics</Heading>
                                <Text fontSize="sm" color="gray.600">
                                  Comprehensive insights into your team's performance and growth
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
                                <Skeleton height="200px" borderRadius="lg" />
                                <SimpleGrid columns={3} spacing={4} w="100%">
                                  <Skeleton height="150px" borderRadius="lg" />
                                  <Skeleton height="150px" borderRadius="lg" />
                                  <Skeleton height="150px" borderRadius="lg" />
                                </SimpleGrid>
                              </VStack>
                            ) : teamPerformance ? (
                              <VStack spacing={6} align="stretch">
                                {/* Performance Overview Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                                  <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" borderRadius="xl" boxShadow="lg">
                                    <CardBody textAlign="center" p={6}>
                                      <VStack spacing={3}>
                                        <Box p={3} bg="white" borderRadius="full">
                                          <Text fontSize="2xl" color="blue.600">●</Text>
                                        </Box>
                                        <Stat>
                                          <StatLabel color="white" fontSize="sm">TEAM SIZE</StatLabel>
                                          <StatNumber color="white" fontSize="3xl">
                                            {teamPerformance.teamSize || 0}
                                          </StatNumber>
                                          <StatHelpText color="white" opacity={0.8}>Total Members</StatHelpText>
                                        </Stat>
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                  
                                  <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white" borderRadius="xl" boxShadow="lg">
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
                                  
                                  <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white" borderRadius="xl" boxShadow="lg">
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
                                  
                                  <Card bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" color="white" borderRadius="xl" boxShadow="lg">
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
                                  <Card borderRadius="xl" boxShadow="md">
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
                                            borderRadius="full"
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
                                            borderRadius="full"
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
                                            borderRadius="full"
                                          />
                                        </Box>
                                      </VStack>
                                    </CardBody>
                                  </Card>

                                  <Card borderRadius="xl" boxShadow="md">
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
                                            borderRadius="full"
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
                                            borderRadius="full"
                                          />
                                        </Box>

                                        <Box textAlign="center" p={4} bg="gray.50" borderRadius="lg">
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
                              </VStack>
                            ) : (
                              <Card bg="gray.50" borderRadius="lg" border="2px dashed" borderColor="gray.300">
                                <CardBody py={12}>
                                  <Center>
                                    <VStack spacing={4}>
                                      <Box
                                        w="80px"
                                        h="80px"
                                        bg="gray.200"
                                        borderRadius="lg"
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
                        <TabPanel p={0}>
                          <VStack spacing={4} align="stretch">
                            <Heading size="md" color="gray.800">Coach Performance Metrics</Heading>
                            {coachPerformance ? (
                              <Card>
                                <CardBody>
                                  <Text>Coach performance data will be displayed here</Text>
                                  <Text fontSize="xs" color="gray.500">Data: {JSON.stringify(coachPerformance).substring(0, 100)}...</Text>
                                </CardBody>
                              </Card>
                            ) : (
                              <Card>
                                <CardBody>
                                  <Text color="gray.500">No coach performance data available</Text>
                                </CardBody>
                              </Card>
                            )}
                          </VStack>
                        </TabPanel>
                        
                        {/* Sales Performance Sub-tab */}
                        <TabPanel p={0}>
                          <VStack spacing={4} align="stretch">
                            <Heading size="md" color="gray.800">Sales Performance Metrics</Heading>
                            {salesPerformance ? (
                              <Card>
                                <CardBody>
                                  <Text>Sales performance data will be displayed here</Text>
                                  <Text fontSize="xs" color="gray.500">Data: {JSON.stringify(salesPerformance).substring(0, 100)}...</Text>
                                </CardBody>
                              </Card>
                            ) : (
                              <Card>
                                <CardBody>
                                  <Text color="gray.500">No sales performance data available</Text>
                                </CardBody>
                              </Card>
                            )}
                          </VStack>
                        </TabPanel>
                        
                        {/* Client Performance Sub-tab */}
                        <TabPanel p={0}>
                          <VStack spacing={4} align="stretch">
                            <Heading size="md" color="gray.800">Client Performance Metrics</Heading>
                            {clientPerformance ? (
                              <Card>
                                <CardBody>
                                  <Text>Client performance data will be displayed here</Text>
                                  <Text fontSize="xs" color="gray.500">Data: {JSON.stringify(clientPerformance).substring(0, 100)}...</Text>
                                </CardBody>
                              </Card>
                            ) : (
                              <Card>
                                <CardBody>
                                  <Text color="gray.500">No client performance data available</Text>
                                </CardBody>
                              </Card>
                            )}
                          </VStack>
                        </TabPanel>
                        
                        {/* Lead Performance Sub-tab */}
                        <TabPanel p={0}>
                          <VStack spacing={4} align="stretch">
                            <Heading size="md" color="gray.800">Lead Performance Metrics</Heading>
                            {leadPerformance ? (
                              <Card>
                                <CardBody>
                                  <Text>Lead performance data will be displayed here</Text>
                                  <Text fontSize="xs" color="gray.500">Data: {JSON.stringify(leadPerformance).substring(0, 100)}...</Text>
                                </CardBody>
                              </Card>
                            ) : (
                              <Card>
                                <CardBody>
                                  <Text color="gray.500">No lead performance data available</Text>
                                </CardBody>
                              </Card>
                            )}
                          </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </TabPanel>

                {/* Reports Tab - Keep existing enhanced design */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Team Reports & Analytics</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Generate and manage comprehensive team performance reports
                        </Text>
                      </VStack>
                      <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onReportModalOpen}>
                        Generate New Report
                      </Button>
                    </Flex>

                    {loading ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {Array(6).fill(0).map((_, i) => (
                          <Card key={i} borderRadius="lg">
                            <CardBody>
                              <SkeletonText noOfLines={3} spacing="4" />
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    ) : reports.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {reports.map((report, index) => (
                          <Card 
                            key={report._id || index} 
                            borderRadius="lg" 
                            boxShadow="md"
                            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                            transition="all 0.2s"
                          >
                            <CardBody>
                              <VStack spacing={4} align="stretch">
                                <HStack justify="space-between">
                                  <VStack align="start" spacing={1}>
                                    <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                                      {report.reportType?.replace(/_/g, ' ').toUpperCase()}
                                    </Badge>
                                    <Badge 
                                      colorScheme={report.status === 'completed' ? 'green' : report.status === 'processing' ? 'yellow' : 'gray'} 
                                      variant="solid"
                                      borderRadius="full"
                                      px={2}
                                      py={1}
                                    >
                                      {report.status === 'completed' ? '✅' : report.status === 'processing' ? '⏳' : '⚠️'} {report.status || 'pending'}
                                    </Badge>
                                  </VStack>
                                  <Box as={FiFileText} color="gray.400" size="24px" />
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
                                </VStack>

                                <ButtonGroup size="sm" spacing={2}>
                                  <Button 
                                    variant="outline" 
                                    flex={1}
                                    leftIcon={<ViewIcon />}
                                    colorScheme="blue"
                                    _hover={{ bg: 'blue.50' }}
                                  >
                                    👁️ View
                                  </Button>
                                  <IconButton 
                                    icon={<DownloadIcon />} 
                                    variant="outline"
                                    colorScheme="green"
                                    isDisabled={report.status !== 'completed'}
                                    _hover={{ bg: 'green.50' }}
                                    title="Download Report"
                                  />
                                </ButtonGroup>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Card bg="gray.50" borderRadius="lg" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="lg"
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
                                  Generate your first report to analyze team performance and track progress.
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
                          <Skeleton key={i} height="80px" borderRadius="lg" />
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
                      <Card bg="gray.50" borderRadius="lg" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="gray.500"
                              >
                                <Text fontSize="3xl">💰</Text>
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

                {/* Admin Requests Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="gray.800">Admin Requests</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Track your hierarchy change requests and their status
                        </Text>
                      </VStack>
                      <Button leftIcon={<RepeatIcon />} colorScheme="blue" onClick={fetchAdminRequests} isLoading={loading}>
                        Refresh
                      </Button>
                    </Flex>

                    {loading ? (
                      <VStack spacing={4}>
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} height="120px" borderRadius="lg" />
                        ))}
                      </VStack>
                    ) : adminRequests.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {adminRequests.map((request, index) => (
                          <Card key={request._id || index} borderRadius="lg" border="1px" borderColor="gray.200">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack justify="space-between" w="full">
                                  <Badge 
                                    colorScheme={
                                      request.status === 'approved' ? 'green' : 
                                      request.status === 'rejected' ? 'red' : 
                                      request.status === 'pending' ? 'yellow' : 'gray'
                                    }
                                  >
                                    {request.status || 'pending'}
                                  </Badge>
                                  <Text fontSize="xs" color="gray.500">
                                    {new Date(request.createdAt || request.submittedAt).toLocaleDateString()}
                                  </Text>
                                </HStack>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="600" color="gray.800">{request.requestType || 'Hierarchy Change'}</Text>
                                  <Text fontSize="sm" color="gray.600">{request.reason || request.description || 'No description provided'}</Text>
                                </VStack>
                                {request.adminResponse && (
                                  <Box p={3} bg="gray.50" borderRadius="md" w="full">
                                    <Text fontSize="xs" color="gray.500" fontWeight="600" mb={1}>Admin Response:</Text>
                                    <Text fontSize="sm" color="gray.700">{request.adminResponse}</Text>
                                  </Box>
                                )}
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Card bg="gray.50" borderRadius="lg" border="2px dashed" borderColor="gray.300">
                        <CardBody py={12}>
                          <Center>
                            <VStack spacing={4}>
                              <Box
                                w="80px"
                                h="80px"
                                bg="gray.200"
                                borderRadius="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="gray.500"
                              >
                                <Text fontSize="3xl">📋</Text>
                              </Box>
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Admin Requests
                                </Text>
                                <Text color="gray.500" textAlign="center" fontSize="sm">
                                  You haven't submitted any admin requests yet.
                                </Text>
                              </VStack>
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
        <ModalContent borderRadius="2xl" maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack spacing={3}>
              <Box p={2} bg="blue.100" borderRadius="lg" color="blue.600">
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
                    📍 Location Information
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
                  ❌ Cancel
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

      {/* Enhanced Generate Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={onReportModalClose} size="lg">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack spacing={3}>
              <Box p={2} bg="blue.100" borderRadius="lg" color="blue.600">
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

                <Box p={4} bg="blue.50" borderRadius="lg" border="1px" borderColor="blue.200">
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
                  ❌ Cancel
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

      {/* Enhanced View Coach Modal */}
      {selectedCoach && (
        <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size="4xl">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent maxH="90vh" overflowY="auto" borderRadius="2xl">
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
                <Card bg="gray.50" borderRadius="lg">
                  <CardBody>
                    <ButtonGroup spacing={3} size="sm" w="full" justifyContent="center">
                      <Button
                        leftIcon={<Box as={FiMail} />}
                        colorScheme="blue"
                        variant="outline"
                        _hover={{ bg: 'blue.50' }}
                      >
                        📧 Send Email
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
                        ✏️ Edit Profile
                      </Button>
                    </ButtonGroup>
                  </CardBody>
                </Card>

                {/* Contact Information */}
                <Card borderRadius="lg" boxShadow="sm">
                  <CardHeader>
                    <Heading size="md" color="gray.800">📞 Contact Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Box p={2} bg="blue.100" borderRadius="lg" color="blue.600">
                            <EmailIcon />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">Email</Text>
                            <Text fontWeight="medium" color="gray.800">{selectedCoach.email}</Text>
                          </VStack>
                        </HStack>
                        
                        <HStack spacing={3}>
                          <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
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
                          <Box p={2} bg="purple.100" borderRadius="lg" color="purple.600">
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
                          <Box p={2} bg="orange.100" borderRadius="lg" color="orange.600">
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
                  <Card borderRadius="lg" boxShadow="sm">
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
                            borderRadius="full"
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
                <Card borderRadius="lg" boxShadow="sm">
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
                            borderRadius="full"
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
                  <Card borderRadius="lg" boxShadow="sm">
                    <CardHeader>
                      <Heading size="md" color="gray.800">📝 Bio & Description</Heading>
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
                  <Card borderRadius="lg" boxShadow="sm">
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
  
  /* Animated Line Drawing Animations */
  @keyframes drawLineVertical {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: 100%;
      opacity: 1;
    }
  }
  
  @keyframes drawLineHorizontal {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      opacity: 1;
    }
  }
  
  @keyframes drawLineDiagonal {
    from {
      width: 0;
      height: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }
  
  @keyframes drawLineFromRoot {
    0% {
      width: 0;
      height: 0;
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.5);
    }
    100% {
      width: 100%;
      height: 100%;
      opacity: 1;
      transform: scale(1);
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
