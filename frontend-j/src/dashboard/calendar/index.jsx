import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getCoachId, getToken, isAuthenticated, debugAuthState } from '../../utils/authUtils';
import {
  Box, Flex, Text, Button, Input, InputGroup, InputLeftElement, 
  Grid, GridItem, Badge, Avatar, Select, Textarea, useDisclosure,
  HStack, VStack, Divider, IconButton, Menu, MenuButton, MenuList, MenuItem,
  Alert, AlertIcon, AlertTitle, AlertDescription, useToast,
  Skeleton, SkeletonText, Card, CardBody, CardHeader, Heading,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
  Tabs, TabList, TabPanels, Tab, TabPanel, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, FormErrorMessage,
  Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody,
  useColorModeValue, Container, Spacer, Tag, TagLabel, TagCloseButton,
  Progress, CircularProgress, Center, Wrap, WrapItem,
  Stack, ButtonGroup, Switch, Spinner, ScaleFade, Collapse,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  MenuDivider
} from '@chakra-ui/react';
import {
  SearchIcon, AddIcon, EditIcon, DeleteIcon, CalendarIcon, TimeIcon,
  ViewIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon, 
  RepeatIcon, CheckCircleIcon, WarningIcon, InfoIcon,
  ChatIcon, PhoneIcon, EmailIcon, StarIcon, ArrowForwardIcon,
  ArrowBackIcon, ExternalLinkIcon, CloseIcon, SmallAddIcon,
  ChevronUpIcon, ChevronDownIcon, CopyIcon
} from '@chakra-ui/icons';
import { 
  FiFileText, FiUser, FiMail, FiPhone, FiCalendar, FiFilter, FiUpload,
  FiEye, FiEdit, FiTrash2, FiCopy, FiUsers, FiMoreVertical, 
  FiPlay, FiPause, FiBarChart2, FiTrendingUp, FiTarget, FiGlobe,
  FiClock, FiMap
} from 'react-icons/fi';

// Helper function to get appointment color based on lead type
const getAppointmentColor = (appointment, leadsData = []) => {
  if (!appointment) return 'blue';
  
  // If appointment has leadId, find the lead in leadsData
  if (appointment.leadId && leadsData.length > 0) {
    const lead = leadsData.find(l => {
      const leadId = l._id || l.id;
      return leadId === appointment.leadId;
    });
    
    if (lead) {
      const leadType = getLeadType(lead);
      return leadType === 'Client' ? 'red' : 'blue'; // Red for clients, Blue for coaches
    }
  }
  
  // If appointment has direct lead data
  if (appointment.lead) {
    const leadType = getLeadType(appointment.lead);
    return leadType === 'Client' ? 'red' : 'blue';
  }
  
  // Default fallback - assume coach if no lead data
  return 'blue';
};


const identifyAppointmentType = (appointment, leadsData = []) => {
  let lead = null;

  // Find the lead associated with this appointment
  if (appointment.leadId && leadsData.length > 0) {
    lead = leadsData.find(l => {
      const leadId = l._id || l.id;
      return leadId === appointment.leadId;
    });
  } else if (appointment.lead) {
    lead = appointment.lead;
  }

  if (!lead) return 'unknown';

  // Determine if this is a Coach or Client lead
  const leadType = getLeadType(lead);
  return leadType.toLowerCase(); // Returns 'coach' or 'client'
};


const filterAppointmentsByType = (appointments, appointmentType, leadsData = []) => {
  if (appointmentType === 'all') {
    return appointments;
  }
  
  const filtered = appointments.filter(appointment => {
    const identifiedType = identifyAppointmentType(appointment, leadsData);
    
    // Now we can properly filter by appointment type
    return identifiedType === appointmentType.toLowerCase();
  });
  
  return filtered;
};
// FIXED Timezone handling utilities
const getTimezoneOffset = (timezone) => {
  const timezoneOffsets = {
    'Asia/Kolkata': 5.5 * 60, // IST is UTC+5:30
    'America/New_York': -5 * 60, // EST is UTC-5
    'America/Chicago': -6 * 60, // CST is UTC-6
    'UTC': 0
  };
  return timezoneOffsets[timezone] || 0;
};

// FIXED: Proper timezone conversion
const convertToTimezone = (utcDateTime, timezone = 'Asia/Kolkata') => {
  if (!utcDateTime) return null;
  
  try {
    const date = new Date(utcDateTime);
    if (isNaN(date.getTime())) return null;
    
    // Use proper Intl.DateTimeFormat for timezone conversion
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Timezone conversion error:', error);
    return null;
  }
};

const formatTimeWithTimezone = (utcDateTime, timezone = 'Asia/Kolkata') => {
  if (!utcDateTime) return 'Invalid Time';
  
  try {
    const date = new Date(utcDateTime);
    if (isNaN(date.getTime())) return 'Invalid Time';
    
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone
    }).format(date);
  } catch (error) {
    console.error('Time formatting error:', error);
    return 'Invalid Time';
  }
};

const formatDateWithTimezone = (utcDateTime, timezone = 'Asia/Kolkata') => {
  if (!utcDateTime) return 'Invalid Date';
  
  try {
    const date = new Date(utcDateTime);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: timezone
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// FIXED: Get proper local date string for comparison
const getLocalDateString = (date) => {
  if (!date) return null;
  
  try {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (isNaN(date.getTime())) return null;
    
    // Return YYYY-MM-DD format in local timezone
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
  } catch (error) {
    console.error('Error getting local date string:', error);
    return null;
  }
};

// Helper function to determine lead type
const getLeadType = (lead) => {
  if (!lead) return 'Unknown';
  
  // Check if lead has client questions data
  if (lead.clientQuestions && Object.keys(lead.clientQuestions).length > 0) {
    return 'Client';
  }
  
  // Check if lead has coach questions data
  if (lead.coachQuestions && Object.keys(lead.coachQuestions).length > 0) {
    return 'Coach';
  }
  
  // Check if lead has both or neither, default to Client for now
  return 'Client';
};

// Helper function to get lead type badge color
const getLeadTypeColor = (leadType) => {
  switch (leadType) {
    case 'Client':
      return 'blue';
    case 'Coach':
      return 'green';
    default:
      return 'gray';
  }
};

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

        {/* Professional Calendar Skeleton */}
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
            <VStack spacing={4} align="stretch">
              {[...Array(7)].map((_, rowIndex) => (
                <HStack key={rowIndex} spacing={4} justify="space-between" p={4}>
                  {[...Array(5)].map((_, cellIndex) => (
                    <VStack key={cellIndex} spacing={2} align="center" flex={1}>
                      <Skeleton height="20px" width="80px" borderRadius="md" />
                      <Skeleton height="60px" width="100%" borderRadius="lg" />
                    </VStack>
                  ))}
                </HStack>
              ))}
            </VStack>
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
            <Text color="gray.500" fontSize="sm" fontWeight="medium">
              Loading calendar data...
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
  
  return useCallback((message, status = 'error') => {
    let title = 'Error!';
    if (status === 'warning') title = 'Warning!';
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
            <Text fontSize="sm" color={`${color}.700`} fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
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

// Beautiful Status Badge Component - Compact Version
const StatusBadge = ({ status, compact = false }) => {
  const getStatusProps = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { colorScheme: 'green', icon: '✓', emoji: '✅' };
      case 'pending':
        return { colorScheme: 'yellow', icon: '⏱', emoji: '⏰' };
      case 'canceled':
        return { colorScheme: 'red', icon: '✕', emoji: '❌' };
      case 'completed':
        return { colorScheme: 'blue', icon: '✓', emoji: '✅' };
      case 'no-show':
        return { colorScheme: 'gray', icon: '⚠', emoji: '⚠️' };
      default:
        return { colorScheme: 'blue', icon: '✓', emoji: '✅' };
    }
  };

  const { colorScheme, icon, emoji } = getStatusProps(status);
  
  if (compact) {
    return (
      <Box
        fontSize="xs"
        color={`${colorScheme}.600`}
        fontWeight="bold"
        title={status || 'confirmed'}
      >
        {icon}
      </Box>
    );
  }
  
  return (
    <Badge 
      colorScheme={colorScheme} 
      variant="subtle" 
      px={2} 
      py={0.5} 
      borderRadius="md"
      fontSize="xs"
    >
      <HStack spacing={1}>
        <Text>{emoji}</Text>
        <Text fontWeight="medium" textTransform="capitalize">
          {status || 'confirmed'}
        </Text>
      </HStack>
    </Badge>
  );
};

// Beautiful Time Slot Component
const TimeSlot = ({ slot, onClick, isSelected }) => {
  const bgColor = useColorModeValue('green.50', 'green.900');
  const borderColor = useColorModeValue('green.200', 'green.600');
  const hoverBg = useColorModeValue('green.100', 'green.800');

  return (
    <Box
      as="button"
      onClick={onClick}
      p={2}
      bg={isSelected ? 'green.100' : bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      _hover={{ bg: hoverBg, transform: 'scale(1.02)' }}
      transition="all 0.2s"
      w="full"
      textAlign="center"
    >
      <VStack spacing={1} fontSize="xs">
        <Text fontWeight="bold" color="green.600">
          {slot.displayTime}
        </Text>
        <Text color="gray.600">
          {slot.duration || 30}m
        </Text>
      </VStack>
    </Box>
  );
};

// Beautiful Appointment Card Component
const AppointmentCard = ({ appointment, onClick, onEdit, onDelete, leads = [], getStaffDisplayName }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const appointmentColor = getAppointmentColor(appointment, leads);
  const borderColor = useColorModeValue(`${appointmentColor}.200`, `${appointmentColor}.600`);
  
  // Get lead type for this appointment
  const leadType = getLeadType(appointment.lead);
  const leadTypeColor = getLeadTypeColor(leadType);
  
  // Get staff assignment from lead or appointment
  const assignedStaff = appointment.lead?.assignedTo || appointment.assignedTo;

  return (
    <Card
      size="sm"
      bg={bgColor}
      borderLeft="4px solid"
      borderLeftColor={borderColor}  // Now uses dynamic color
      _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onClick}
    >
      <CardBody p={3}>
        <VStack align="start" spacing={2}>
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" fontWeight="bold" color={`${appointmentColor}.600`}>  {/* Dynamic color */}
              {appointment.displayTime}
            </Text>
            <StatusBadge status={appointment.status} />
          </HStack>
          
          <HStack justify="space-between" w="full">
            <Text fontSize="xs" color="gray.600" noOfLines={1}>
              {appointment.title || 'Appointment'}
            </Text>
            <Badge colorScheme={leadTypeColor} size="sm" fontSize="xs">
              {leadType}
            </Badge>
          </HStack>
          
          {/* Staff Assignment Display */}
          {assignedStaff && getStaffDisplayName && (
            <HStack spacing={1} w="full">
              <Box as={FiUser} fontSize="xs" color="purple.500" />
              <Text fontSize="xs" color="purple.600" fontWeight="medium" noOfLines={1}>
                {getStaffDisplayName(assignedStaff)}
              </Text>
            </HStack>
          )}
          
          <HStack spacing={1}>
            <TimeIcon fontSize="xs" color="gray.400" />
            <Text fontSize="xs" color="gray.500">
              {appointment.duration || 30}min
            </Text>
          </HStack>

          <HStack spacing={1} onClick={(e) => e.stopPropagation()}>
            <IconButton
              size="xs"
              variant="ghost"
              icon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(appointment);
              }}
              title="Edit"
            />
            <IconButton
              size="xs"
              variant="ghost"
              colorScheme="red"
              icon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(appointment.id || appointment._id);
              }}
              title="Delete"
            />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
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
            Delete Appointment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Main Component
const ComprehensiveCoachCalendar = () => {
  // Add CSS to hide scrollbars while keeping scroll functionality
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hide-scrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* Internet Explorer 10+ */
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none; /* WebKit */
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const authState = useSelector(state => state.auth);
  const coachId = getCoachId(authState);
  const token = getToken(authState);
  const toast = useCustomToast();

  // Enhanced State Management
  const [calendarData, setCalendarData] = useState([]);
  const [allCalendarData, setAllCalendarData] = useState([]); // Store unfiltered data for modal
  const [availability, setAvailability] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointmentType, setAppointmentType] = useState('all'); // 'all', 'coach' or 'client'
  
  // Modal States
  const { isOpen: isAvailabilityModalOpen, onOpen: onAvailabilityModalOpen, onClose: onAvailabilityModalClose } = useDisclosure();
  const { isOpen: isBookingModalOpen, onOpen: onBookingModalOpen, onClose: onBookingModalClose } = useDisclosure();
  const { isOpen: isAppointmentDetailsOpen, onOpen: onAppointmentDetailsOpen, onClose: onAppointmentDetailsClose } = useDisclosure();
  const { isOpen: isDayDetailsModalOpen, onOpen: onDayDetailsModalOpen, onClose: onDayDetailsModalClose } = useDisclosure();
  const { isOpen: isLeadSearchModalOpen, onOpen: onLeadSearchModalOpen, onClose: onLeadSearchModalClose } = useDisclosure();
  const { isOpen: isEditAppointmentModalOpen, onOpen: onEditAppointmentModalOpen, onClose: onEditAppointmentModalClose } = useDisclosure();
  const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Lead Management States
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadDetails, setLeadDetails] = useState(null);
  
  // Staff Management States
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Enhanced Form States
  const [availabilityForm, setAvailabilityForm] = useState({
    workingHours: [],
    unavailableSlots: [],
    defaultAppointmentDuration: 30,
    bufferTime: 10,
    timeZone: 'Asia/Kolkata'
  });

  const [bookingForm, setBookingForm] = useState({
    leadId: '',
    startTime: '',
    duration: 30,
    notes: '',
    timeZone: 'Asia/Kolkata',
    appointmentType: 'coach'
  });

  // Enhanced Client Questions Form State
  const [clientQuestionsForm, setClientQuestionsForm] = useState({
    watchedVideo: '',
    healthGoal: '',
    timelineForResults: '',
    seriousnessLevel: '',
    investmentRange: '',
    startTimeline: '',
    additionalInfo: '',
    vslWatchPercentage: 0
  });

  // Question Types State
  const [questionTypes, setQuestionTypes] = useState(null);
  const [loadingQuestionTypes, setLoadingQuestionTypes] = useState(false);
  
  // Form Validation State
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Edit Appointment Form
  const [editAppointmentForm, setEditAppointmentForm] = useState({
    id: '',
    leadId: '',
    startTime: '',
    duration: 30,
    notes: '',
    status: 'confirmed'
  });

  // Enhanced Statistics
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalAvailableSlots: 0,
    utilizationRate: 0,
    upcomingAppointments: 0,
    weeklyBookings: 0,
    monthlyRevenue: 0,
    averageSessionDuration: 0,
    canceledAppointments: 0,
    noShowRate: 0,
    popularTimeSlots: []
  });

  // API Console States
  const [apiConsoleOpen, setApiConsoleOpen] = useState(false);
  const [apiTestResults, setApiTestResults] = useState([]);
  const [selectedApiTest, setSelectedApiTest] = useState('question-types');
  const [testLeadId, setTestLeadId] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  
  // Test Data States
  const [testClientQuestions, setTestClientQuestions] = useState({
    watchedVideo: 'Yes',
    healthGoal: 'Lose Weight (5-15 kg)',
    timelineForResults: '3-6 months (Moderate)',
    seriousnessLevel: 'Very serious - willing to invest time and money',
    investmentRange: '₹25,000 - ₹50,000',
    startTimeline: 'Within 2 weeks',
    additionalInfo: 'I have tried dieting before but need proper guidance',
    vslWatchPercentage: 85.5
  });

  const [testCoachQuestions, setTestCoachQuestions] = useState({
    watchedVideo: 'Yes',
    currentProfession: 'Fitness Trainer/Gym Instructor',
    interestReasons: ['Want additional income source', 'Passionate about helping people transform'],
    incomeGoal: '₹1,00,000 - ₹2,00,000/month (Professional)',
    investmentCapacity: '₹2,00,000 - ₹3,00,000',
    timeAvailability: '6-8 hours/day (Full-time)',
    timelineToAchieveGoal: '6-12 months (Gradual building)',
    additionalInfo: 'Currently running a small gym, want to scale digitally',
    vslWatchPercentage: 95.0
  });

  const BASE_URL = 'https://api.funnelseye.com';

  // API Console Functions
  const testQuestionTypesAPI = useCallback(async () => {
    setApiLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/leads/question-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      const testResult = {
        id: Date.now(),
        api: 'GET /api/leads/question-types',
        status: response.status,
        success: response.ok,
        timestamp: new Date().toISOString(),
        request: {
          method: 'GET',
          url: `${BASE_URL}/api/leads/question-types`,
          headers: { 'Content-Type': 'application/json' }
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          data: result
        }
      };

      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Question Types API Test ${response.ok ? 'Success' : 'Failed'}`, response.ok ? 'success' : 'error');
    } catch (err) {
      const testResult = {
        id: Date.now(),
        api: 'GET /api/leads/question-types',
        status: 'ERROR',
        success: false,
        timestamp: new Date().toISOString(),
        request: {
          method: 'GET',
          url: `${BASE_URL}/api/leads/question-types`,
          headers: { 'Content-Type': 'application/json' }
        },
        response: {
          error: err.message
        }
      };
      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Question Types API Test Failed: ${err.message}`, 'error');
    } finally {
      setApiLoading(false);
    }
  }, [toast]);

  const testClientQuestionsAPI = useCallback(async () => {
    if (!testLeadId.trim()) {
      toast('Please enter a Lead ID for testing', 'error');
      return;
    }

    setApiLoading(true);
    try {
      const payload = {
        leadId: testLeadId.trim(),
        questionResponses: {
          clientQuestions: testClientQuestions,
          vslWatchPercentage: testClientQuestions.vslWatchPercentage
        },
        appointmentData: {
          preferredTime: '10:00 AM',
          preferredDate: new Date().toISOString().split('T')[0],
          timezone: 'Asia/Kolkata',
          notes: 'Test appointment booking'
        }
      };

      const response = await fetch(`${BASE_URL}/api/leads/question-responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const testResult = {
        id: Date.now(),
        api: 'POST /api/leads/question-responses (Client)',
        status: response.status,
        success: response.ok,
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          url: `${BASE_URL}/api/leads/question-responses`,
          headers: { 'Content-Type': 'application/json' },
          body: payload
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          data: result
        }
      };

      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Client Questions API Test ${response.ok ? 'Success' : 'Failed'}`, response.ok ? 'success' : 'error');
    } catch (err) {
      const testResult = {
        id: Date.now(),
        api: 'POST /api/leads/question-responses (Client)',
        status: 'ERROR',
        success: false,
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          url: `${BASE_URL}/api/leads/question-responses`,
          headers: { 'Content-Type': 'application/json' }
        },
        response: {
          error: err.message
        }
      };
      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Client Questions API Test Failed: ${err.message}`, 'error');
    } finally {
      setApiLoading(false);
    }
  }, [testLeadId, testClientQuestions, toast]);

  const testCoachQuestionsAPI = useCallback(async () => {
    if (!testLeadId.trim()) {
      toast('Please enter a Lead ID for testing', 'error');
      return;
    }

    setApiLoading(true);
    try {
      const payload = {
        leadId: testLeadId.trim(),
        questionResponses: {
          coachQuestions: testCoachQuestions,
          vslWatchPercentage: testCoachQuestions.vslWatchPercentage
        },
        appointmentData: {
          preferredTime: '2:00 PM',
          preferredDate: new Date().toISOString().split('T')[0],
          timezone: 'Asia/Kolkata',
          notes: 'Test coach consultation'
        }
      };

      const response = await fetch(`${BASE_URL}/api/leads/question-responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const testResult = {
        id: Date.now(),
        api: 'POST /api/leads/question-responses (Coach)',
        status: response.status,
        success: response.ok,
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          url: `${BASE_URL}/api/leads/question-responses`,
          headers: { 'Content-Type': 'application/json' },
          body: payload
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          data: result
        }
      };

      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Coach Questions API Test ${response.ok ? 'Success' : 'Failed'}`, response.ok ? 'success' : 'error');
    } catch (err) {
      const testResult = {
        id: Date.now(),
        api: 'POST /api/leads/question-responses (Coach)',
        status: 'ERROR',
        success: false,
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          url: `${BASE_URL}/api/leads/question-responses`,
          headers: { 'Content-Type': 'application/json' }
        },
        response: {
          error: err.message
        }
      };
      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Coach Questions API Test Failed: ${err.message}`, 'error');
    } finally {
      setApiLoading(false);
    }
  }, [testLeadId, testCoachQuestions, toast]);

  const testLeadUpdateAPI = useCallback(async () => {
    if (!testLeadId.trim()) {
      toast('Please enter a Lead ID for testing', 'error');
      return;
    }

    setApiLoading(true);
    try {
      const payload = {
        status: 'Contacted',
        leadTemperature: 'Hot',
        vslWatchPercentage: 75.5,
        notes: 'Test lead update from API console'
      };

      const response = await fetch(`${BASE_URL}/api/leads/${testLeadId.trim()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const testResult = {
        id: Date.now(),
        api: `PUT /api/leads/${testLeadId.trim()}`,
        status: response.status,
        success: response.ok,
        timestamp: new Date().toISOString(),
        request: {
          method: 'PUT',
          url: `${BASE_URL}/api/leads/${testLeadId.trim()}`,
          headers: { 'Content-Type': 'application/json' },
          body: payload
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          data: result
        }
      };

      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Lead Update API Test ${response.ok ? 'Success' : 'Failed'}`, response.ok ? 'success' : 'error');
    } catch (err) {
      const testResult = {
        id: Date.now(),
        api: `PUT /api/leads/${testLeadId.trim()}`,
        status: 'ERROR',
        success: false,
        timestamp: new Date().toISOString(),
        request: {
          method: 'PUT',
          url: `${BASE_URL}/api/leads/${testLeadId.trim()}`,
          headers: { 'Content-Type': 'application/json' }
        },
        response: {
          error: err.message
        }
      };
      setApiTestResults(prev => [testResult, ...prev]);
      toast(`Lead Update API Test Failed: ${err.message}`, 'error');
    } finally {
      setApiLoading(false);
    }
  }, [testLeadId, toast]);

  const clearApiResults = useCallback(() => {
    setApiTestResults([]);
    toast('API test results cleared', 'info');
  }, [toast]);

  // Test Filtering Logic
  const testFilteringLogic = useCallback(() => {
    console.log('🧪 Testing Filtering Logic');
    console.log('📊 Current State:', {
      appointmentType,
      leadsCount: leads.length,
      calendarDataDays: calendarData.length,
      totalAppointments: calendarData.reduce((sum, day) => sum + (day.appointments?.length || 0), 0)
    });

    // Show leads data structure
    console.log('📋 Leads Data Structure:');
    leads.forEach((lead, index) => {
      console.log(`  Lead ${index + 1}:`, {
        id: lead._id || lead.id,
        name: lead.name,
        targetAudience: lead.targetAudience,
        funnelTargetAudience: lead.funnelId?.targetAudience,
        funnelId: lead.funnelId?._id || lead.funnelId?.id || lead.funnelId
      });
    });

    // Test each appointment
    calendarData.forEach((day, dayIndex) => {
      if (day.appointments && day.appointments.length > 0) {
        console.log(`📅 Day ${dayIndex + 1}:`, {
          date: day.date,
          appointmentsCount: day.appointments.length
        });
        
        day.appointments.forEach((appointment, aptIndex) => {
          const identifiedType = identifyAppointmentType(appointment, leads);
          const shouldShow = identifiedType === appointmentType.toLowerCase();
          
          console.log(`  📋 Appointment ${aptIndex + 1}:`, {
            id: appointment._id || appointment.id,
            leadId: appointment.leadId,
            identifiedType,
            requestedType: appointmentType.toLowerCase(),
            shouldShow,
            status: shouldShow ? '✅ SHOW' : '❌ HIDE'
          });
        });
      }
    });
    
    toast('Filtering logic test completed - check console', 'info');
  }, [appointmentType, leads, calendarData]);

  // Debug Client Appointments Issue
  const debugClientAppointments = useCallback(async () => {
    console.log('🔍 Debugging Client Appointments Issue');
    
    try {
      // Step 1: Check if there are any funnels with targetAudience = 'customer'
      const funnelsResponse = await fetch(`${BASE_URL}/api/funnels/coach/${coachId}/funnels`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        }
      });

      if (funnelsResponse.ok) {
        const funnelsResult = await funnelsResponse.json();
        const allFunnels = funnelsResult.data || [];
        
        console.log('📊 All Funnels:', allFunnels.map(f => ({
          id: f.id || f._id,
          name: f.name,
          targetAudience: f.targetAudience
        })));
        
        const customerFunnels = allFunnels.filter(f => f.targetAudience === 'customer');
        console.log('👥 Customer Funnels:', customerFunnels.length, customerFunnels);
        
        // Step 2: Check if there are any leads in customer funnels
        const leadsResponse = await fetch(`${BASE_URL}/api/leads`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        });

        if (leadsResponse.ok) {
          const leadsResult = await leadsResponse.json();
          const allLeads = leadsResult.data || [];
          
          console.log('📋 All Leads:', allLeads.map(l => ({
            id: l._id || l.id,
            name: l.name,
            targetAudience: l.targetAudience,
            funnelId: l.funnelId?._id || l.funnelId?.id || l.funnelId
          })));
          
          const customerFunnelIds = new Set(customerFunnels.map(f => f.id || f._id));
          const customerLeads = allLeads.filter(lead => {
            const leadFunnelId = lead.funnelId?._id || lead.funnelId?.id || lead.funnelId;
            return customerFunnelIds.has(leadFunnelId);
          });
          
          console.log('👥 Customer Leads:', customerLeads.length, customerLeads);
          
          // Step 3: Check if there are any appointments for customer leads
          const customerLeadIds = new Set(customerLeads.map(l => l._id || l.id));
          const allAppointments = calendarData.reduce((acc, day) => {
            if (day.appointments) {
              acc.push(...day.appointments);
            }
            return acc;
          }, []);
          
          const customerAppointments = allAppointments.filter(apt => 
            customerLeadIds.has(apt.leadId)
          );
          
          console.log('📅 Customer Appointments:', customerAppointments.length, customerAppointments);
        }
      }
    } catch (err) {
      console.error('Error debugging client appointments:', err);
    }
    
    toast('Client appointments debug completed - check console', 'info');
  }, [coachId, token, calendarData]);

  // Enhanced Utility Functions
  const getCurrentMonthRange = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    };
  }, [currentDate]);

  // FIXED Lead API Functions
  // REMOVED: fetchLeads function - using fetchLeadsData instead to avoid conflicts

  const fetchSingleLead = useCallback(async (leadId) => {
    if (!token || !coachId || !leadId) return null;
    
    try {
      const response = await fetch(`${BASE_URL}/api/leads/${leadId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Coach-ID': coachId
        }
      });

      if (!response.ok) throw new Error(`Failed to fetch lead: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        console.log('🔍 Fetched Lead Details for VSL Score:', {
          leadId: leadId,
          leadData: result.data,
          score: result.data?.score,
          leadScore: result.data?.leadScore,
          vslScore: result.data?.vslScore,
          vsl_score: result.data?.vsl_score,
          questionResponses: result.data?.questionResponses,
          clientQuestions: result.data?.clientQuestions,
          coachQuestions: result.data?.coachQuestions,
          allKeys: Object.keys(result.data || {})
        });
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('Single lead fetch error:', err);
      return null;
    }
  }, [token, coachId]);

  // Fetch Question Types API
  const fetchQuestionTypes = useCallback(async () => {
    setLoadingQuestionTypes(true);
    try {
      const response = await fetch(`${BASE_URL}/api/leads/question-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Failed to fetch question types: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        setQuestionTypes(result.data);
        console.log('Question types loaded:', result.data);
      }
    } catch (err) {
      console.error('Question types fetch error:', err);
      toast(`Failed to load question types: ${err.message}`, 'error');
    } finally {
      setLoadingQuestionTypes(false);
    }
  }, [toast]);

  // FIXED Calendar Data Fetch with proper timezone handling
  const fetchCalendarData = useCallback(async () => {
    if (!coachId || !token) {
      console.warn('Missing coachId or token for calendar data fetch');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const range = getCurrentMonthRange();
      const timezone = availability?.timeZone || 'Asia/Kolkata';
      
      // Fetch ALL appointments first, then filter client-side
      const baseUrl = `${BASE_URL}/api/coach/${coachId}/calendar`;
      
      const url = new URL(baseUrl);
      url.searchParams.append('startDate', range.startDate);
      url.searchParams.append('endDate', range.endDate);
      url.searchParams.append('timeZone', timezone);
      // Remove appointmentType parameter to get all appointments
      
      console.log(`Fetching calendar data from:`, url.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch calendar data: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Raw Calendar API Result:', result);
      
      if (result.success) {
        const rawData = Array.isArray(result.data) ? result.data : 
                        result.data && Array.isArray(result.data.calendar) ? result.data.calendar : [];
        
        // FIXED: Proper data processing with timezone conversion
        const processedData = rawData.map(day => {
          const processedDay = {
            ...day,
            appointments: [],
            availableSlots: []
          };

          // Process appointments with FIXED timezone conversion
          if (Array.isArray(day.appointments)) {
            processedDay.appointments = day.appointments.map(apt => {
              const localDateStr = convertToTimezone(apt.startTime, timezone);
              return {
                ...apt,
                displayTime: formatTimeWithTimezone(apt.startTime, timezone),
                displayDate: formatDateWithTimezone(apt.startTime, timezone),
                localDateString: localDateStr,
                originalStartTime: apt.startTime
              };
            });
          }

          // Process available slots with FIXED timezone conversion
          if (Array.isArray(day.availableSlots)) {
            processedDay.availableSlots = day.availableSlots.map(slot => {
              const localDateStr = convertToTimezone(slot.startTime, timezone);
              return {
                ...slot,
                displayTime: formatTimeWithTimezone(slot.startTime, timezone),
                displayDate: formatDateWithTimezone(slot.startTime, timezone),
                localDateString: localDateStr,
                originalStartTime: slot.startTime
              };
            });
          }

          return processedDay;
        });
        
        console.log('Processed Calendar Data:', processedData);
        
        // Filter appointments based on appointment type using leads data
        const filteredData = processedData.map(day => {
          if (!day || !day.appointments) return day;
          
          console.log(`🔍 Filtering day ${day.date} with ${day.appointments.length} appointments for ${appointmentType} type`);
          const filteredAppointments = filterAppointmentsByType(day.appointments, appointmentType, leads);
          console.log(`✅ Day ${day.date}: ${filteredAppointments.length}/${day.appointments.length} appointments match ${appointmentType} type`);
          
          return {
            ...day,
            appointments: filteredAppointments
          };
        });
        
        const totalBefore = processedData.reduce((sum, day) => sum + (day.appointments?.length || 0), 0);
        const totalAfter = filteredData.reduce((sum, day) => sum + (day.appointments?.length || 0), 0);
        
        console.log(`📊 FILTERING SUMMARY for ${appointmentType} appointments:`);
        console.log(`   Total appointments before filtering: ${totalBefore}`);
        console.log(`   Total appointments after filtering: ${totalAfter}`);
        console.log(`   Filtered out: ${totalBefore - totalAfter} appointments`);
        
        // Store both filtered and unfiltered data
        setAllCalendarData(processedData); // Unfiltered data for modal
        setCalendarData(filteredData); // Filtered data for calendar view
        calculateEnhancedStats(filteredData);
        
        // Success toast removed - only show on errors
      } else {
        throw new Error(result.message || 'Failed to fetch calendar data');
      }
    } catch (err) {
      console.error('Calendar fetch error:', err);
      setCalendarData([]);
      setAllCalendarData([]);
      toast(`Calendar fetch failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [coachId, token, getCurrentMonthRange, toast, availability?.timeZone, appointmentType, leads]);

  // Fetch Leads Data for Appointment Type Identification
  const fetchLeadsData = useCallback(async () => {
    if (!coachId || !token) return;
    
    try {
      console.log('Fetching leads data for appointment type identification...');
      
      // Fetch all funnels first
      const funnelsResponse = await fetch(`${BASE_URL}/api/funnels/coach/${coachId}/funnels`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        }
      });

      let targetFunnels = [];
      if (funnelsResponse.ok) {
        const funnelsResult = await funnelsResponse.json();
        const allFunnels = funnelsResult.data || [];

        // Filter funnels based on appointment type (EXACT SAME LOGIC AS LEADS)
        if (appointmentType === 'coach') {
          targetFunnels = allFunnels.filter(f => f.targetAudience === 'coach');
        } else if (appointmentType === 'client') {
          targetFunnels = allFunnels.filter(f => f.targetAudience === 'customer');
        } else if (appointmentType === 'all') {
          targetFunnels = allFunnels; // Show all funnels
        }

        console.log(`Filtered ${targetFunnels.length} funnels for ${appointmentType} appointments`);
      }

      // Fetch all leads
      const leadsResponse = await fetch(`${BASE_URL}/api/leads`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        }
      });

      if (!leadsResponse.ok) {
        console.warn('Failed to fetch leads data:', leadsResponse.status);
        return;
      }

      const leadsResult = await leadsResponse.json();
      const allLeads = leadsResult.data || [];

      // Get target funnel IDs
      const targetFunnelIds = new Set(targetFunnels.map(f => f.id || f._id));

      // Filter leads by funnel IDs (EXACT SAME LOGIC AS LEADS)
      let filteredLeads;
      if (appointmentType === 'all') {
        filteredLeads = allLeads; // Show all leads
      } else {
        filteredLeads = allLeads.filter(lead => {
          const leadFunnelId = lead.funnelId?._id || lead.funnelId?.id || lead.funnelId;
          return targetFunnelIds.has(leadFunnelId);
        });
      }

      console.log(`Filtered ${filteredLeads.length} leads for ${appointmentType} appointments`);
      setLeads(filteredLeads);
    } catch (err) {
      console.error('Error fetching leads data:', err);
      setLeads([]);
    }
  }, [coachId, token, appointmentType]);

  // Fetch Staff Data - Similar to Customer Leads
  const fetchStaffData = useCallback(async () => {
    if (!coachId || !token) return;
    
    setLoadingStaff(true);
    try {
      console.log('Fetching staff data for assignments...');
      
      let staffResponse;
      try {
        staffResponse = await fetch(`${BASE_URL}/api/staff?coachId=${coachId}`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        });
      } catch (err) {
        console.log('First staff API failed, trying without query param:', err);
        staffResponse = await fetch(`${BASE_URL}/api/staff`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          }
        });
      }
      
      if (!staffResponse.ok) {
        console.warn('Failed to fetch staff data:', staffResponse.status);
        return;
      }

      const staffResult = await staffResponse.json();
      const staffData = staffResult.data || staffResult || [];
      
      // Filter staff by coachId if needed
      const filteredStaff = Array.isArray(staffData) ? staffData.filter(s => 
        s.coachId === coachId || s.coach === coachId || !s.coachId
      ) : [];
      
      console.log(`Fetched ${filteredStaff.length} staff members`);
      setStaff(filteredStaff);
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setStaff([]);
    } finally {
      setLoadingStaff(false);
    }
  }, [coachId, token]);

  // Helper function to get staff name - Similar to Customer Leads
  const getStaffName = useCallback((staffData) => {
    if (!staffData) return 'Unassigned';
    
    // If staffData is already an object (populated), use it directly
    if (typeof staffData === 'object' && staffData !== null) {
      if (staffData.firstName && staffData.lastName) {
        return `${staffData.firstName} ${staffData.lastName}`;
      } else if (staffData.name) {
        return staffData.name;
      } else {
        return 'Unknown Staff';
      }
    }
    
    // Otherwise, it's an ID - look it up in the staff array
    if (!Array.isArray(staff) || staff.length === 0) {
      return 'Unknown Staff';
    }
    
    const staffMember = staff.find(s => s._id === staffData || s.id === staffData);
    if (staffMember) {
      // Handle different staff name formats
      if (staffMember.firstName && staffMember.lastName) {
        return `${staffMember.firstName} ${staffMember.lastName}`;
      } else if (staffMember.name) {
        return staffMember.name;
      } else {
        return 'Unknown Staff';
      }
    }
    return 'Unknown Staff';
  }, [staff]);

  const getStaffDisplayName = useCallback((staffData) => {
    if (!staffData) return 'Unassigned';
    
    // If staffData is already an object (populated), use it directly
    if (typeof staffData === 'object' && staffData !== null) {
      const staffName = staffData.firstName && staffData.lastName 
        ? `${staffData.firstName} ${staffData.lastName}`
        : staffData.name || 'Unknown Staff';
      
      return staffData.email ? `${staffName}` : staffName;
    }
    
    // Otherwise, it's an ID - look it up in the staff array
    if (!Array.isArray(staff) || staff.length === 0) {
      return 'Unknown Staff';
    }
    
    const staffMember = staff.find(s => s._id === staffData || s.id === staffData);
    if (staffMember) {
      // Get staff name - handle different formats
      const staffName = staffMember.firstName && staffMember.lastName 
        ? `${staffMember.firstName} ${staffMember.lastName}`
        : staffMember.name || 'Unknown Staff';
      
      return staffMember.email ? `${staffName}` : staffName;
    }
    return 'Unknown Staff';
  }, [staff]);

  // FIXED Availability Fetch
  const fetchAvailability = useCallback(async () => {
    if (!coachId || !token) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/coach/${coachId}/availability`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          const defaultAvailability = {
            workingHours: [],
            defaultAppointmentDuration: 30,
            timeZone: 'Asia/Kolkata'
          };
          setAvailability(defaultAvailability);
          setAvailabilityForm(prev => ({ ...prev, ...defaultAvailability }));
          return;
        }
        throw new Error(`Failed to fetch availability: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setAvailability(result.data);
        setAvailabilityForm(prev => ({
          ...prev,
          workingHours: result.data.workingHours || [],
          unavailableSlots: result.data.unavailableSlots || [],
          defaultAppointmentDuration: result.data.defaultAppointmentDuration || 30,
          bufferTime: result.data.bufferTime || 10,
          timeZone: result.data.timeZone || 'Asia/Kolkata'
        }));
        
        // Success toast removed - only show on errors
      }
    } catch (err) {
      console.error('Availability fetch error:', err);
      const defaultAvailability = {
        workingHours: [],
        defaultAppointmentDuration: 30,
        timeZone: 'Asia/Kolkata'
      };
      setAvailability(defaultAvailability);
      toast(`Failed to load availability: ${err.message}`, 'error');
    }
  }, [coachId, token, toast]);

  // Enhanced Appointment Booking with Validation
  const bookAppointment = useCallback(async () => {
    if (!coachId || !token) {
      toast('Authentication required', 'error');
      return;
    }
    
    if (!bookingForm.leadId || !bookingForm.startTime) {
      toast('Lead and appointment time are required', 'error');
      return;
    }
    
    // Validate client questions form inline
    const validateForm = () => {
      const errors = {};
      const requiredFields = [
        'watchedVideo',
        'healthGoal', 
        'timelineForResults',
        'seriousnessLevel',
        'investmentRange',
        'startTimeline'
      ];

      requiredFields.forEach(field => {
        if (!clientQuestionsForm[field] || clientQuestionsForm[field].trim() === '') {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        }
      });

      // Validate VSL percentage
      if (clientQuestionsForm.vslWatchPercentage < 0 || clientQuestionsForm.vslWatchPercentage > 100) {
        errors.vslWatchPercentage = 'VSL watch percentage must be between 0 and 100';
      }

      return Object.keys(errors).length === 0;
    };
    
    if (!validateForm()) {
      toast('Please fill all required client questions correctly', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const timezone = availability?.timeZone || "Asia/Kolkata";
      
      // First book the appointment
      const appointmentPayload = {
        leadId: bookingForm.leadId.trim(),
        startTime: bookingForm.startTime,
        duration: bookingForm.duration || availability?.defaultAppointmentDuration || 30,
        notes: bookingForm.notes.trim() || "Initial consultation",
        timeZone: timezone,
        appointmentType: appointmentType
      };

      console.log('Booking appointment with payload:', appointmentPayload);

      const appointmentResponse = await fetch(`${BASE_URL}/api/coach/${coachId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(appointmentPayload)
      });

      if (!appointmentResponse.ok) {
        throw new Error(`Appointment booking failed: ${appointmentResponse.status}`);
      }

      const appointmentResult = await appointmentResponse.json();
      if (!appointmentResult.success) {
        throw new Error(appointmentResult.message || 'Appointment booking failed');
      }

      // Then submit client questions with enhanced payload
      const questionsPayload = {
        leadId: bookingForm.leadId.trim(),
        questionResponses: {
          clientQuestions: {
            watchedVideo: clientQuestionsForm.watchedVideo,
            healthGoal: clientQuestionsForm.healthGoal,
            timelineForResults: clientQuestionsForm.timelineForResults,
            seriousnessLevel: clientQuestionsForm.seriousnessLevel,
            investmentRange: clientQuestionsForm.investmentRange,
            startTimeline: clientQuestionsForm.startTimeline,
            additionalInfo: clientQuestionsForm.additionalInfo || ''
          },
          vslWatchPercentage: parseFloat(clientQuestionsForm.vslWatchPercentage) || 0
        },
        appointmentData: {
          preferredTime: new Date(bookingForm.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          preferredDate: new Date(bookingForm.startTime).toLocaleDateString('en-US'),
          timezone: timezone,
          notes: bookingForm.notes.trim() || '',
          duration: bookingForm.duration || availability?.defaultAppointmentDuration || 30
        }
      };

      console.log('Submitting client questions with payload:', questionsPayload);

      const questionsResponse = await fetch(`${BASE_URL}/api/leads/question-responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionsPayload)
      });

      if (!questionsResponse.ok) {
        console.warn('Questions submission failed, but appointment was booked');
        toast('Appointment booked, but questions submission failed', 'warning');
      } else {
        const questionsResult = await questionsResponse.json();
        if (questionsResult.success) {
          // Show success with lead insights if available
          const insights = questionsResult.data?.qualificationInsights || [];
          const leadTemperature = questionsResult.data?.leadTemperature || 'Unknown';
          const score = questionsResult.data?.score || 0;
          
          toast(`Appointment booked successfully! Lead Score: ${score}/100 (${leadTemperature})`, 'success');
          
          // Log insights for coach reference
          if (insights.length > 0) {
            console.log('Lead Qualification Insights:', insights);
          }
        } else {
          console.warn('Questions submission failed:', questionsResult.message);
          toast('Appointment booked, but questions submission failed', 'warning');
        }
      }

      onBookingModalClose();
      
      // Reset form inline to avoid circular dependency
      setBookingForm({
        leadId: '',
        startTime: '',
        duration: 30,
        notes: '',
        timeZone: 'Asia/Kolkata'
      });
      setClientQuestionsForm({
        watchedVideo: '',
        healthGoal: '',
        timelineForResults: '',
        seriousnessLevel: '',
        investmentRange: '',
        startTimeline: '',
        additionalInfo: '',
        vslWatchPercentage: 0
      });
      setSelectedLead(null);
      setLeadDetails(null);
      setSelectedSlot(null);
      setFormErrors({});
      setIsFormValid(false);
      
      fetchCalendarData(); // Refresh calendar
    } catch (err) {
      console.error('Booking error:', err);
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [coachId, token, bookingForm, clientQuestionsForm, availability, toast, fetchCalendarData, onBookingModalClose, appointmentType]);

  const updateAppointment = useCallback(async () => {
    if (!token || !editAppointmentForm.id) {
      toast('Authentication or appointment ID required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/appointments/${editAppointmentForm.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadId: editAppointmentForm.leadId,
          startTime: editAppointmentForm.startTime,
          duration: editAppointmentForm.duration,
          notes: editAppointmentForm.notes,
          status: editAppointmentForm.status
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onEditAppointmentModalClose();
          toast('Appointment updated successfully!');
          fetchCalendarData();
        } else {
          throw new Error(result.message || 'Update failed');
        }
      } else {
        throw new Error(`Update failed: ${response.status}`);
      }
    } catch (err) {
      console.error('Appointment update error:', err);
      toast(`Update failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [token, editAppointmentForm, toast, fetchCalendarData, onEditAppointmentModalClose]);

  const deleteAppointment = useCallback(async (appointmentId) => {
    if (!token || !appointmentId) return;
    
    setConfirmAction({ type: 'single', id: appointmentId });
    onConfirmModalOpen();
  }, [token, onConfirmModalOpen]);

  const confirmDeleteAppointment = useCallback(async () => {
    if (confirmAction?.type === 'single' && confirmAction.id) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/appointments/${confirmAction.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            toast('Appointment deleted successfully!');
            fetchCalendarData();
            onAppointmentDetailsClose();
            onDayDetailsModalClose();
          } else {
            throw new Error(result.message || 'Delete failed');
          }
        } else {
          throw new Error(`Delete failed: ${response.status}`);
        }
      } catch (err) {
        console.error('Delete error:', err);
        toast(`Delete failed: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    }
    onConfirmModalClose();
    setConfirmAction(null);
  }, [token, confirmAction, toast, fetchCalendarData, onAppointmentDetailsClose, onDayDetailsModalClose, onConfirmModalClose]);

  const updateAvailability = useCallback(async () => {
    if (!token || !coachId) {
      toast('Authentication required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/coach/availability`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Coach-ID': coachId
        },
        body: JSON.stringify(availabilityForm)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAvailability(result.data);
        onAvailabilityModalClose();
        toast('Availability updated successfully!');
        fetchCalendarData();
      } else {
        // Handle specific error cases
        if (result.requiresZoomIntegration) {
          toast('You must connect your Zoom account before setting availability. Please go to Settings > Zoom Integration.', 'error');
        } else {
          throw new Error(result.message || `Update failed: ${response.status}`);
        }
      }
    } catch (err) {
      console.error('Availability update error:', err);
      toast(`Update failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [token, coachId, availabilityForm, toast, fetchCalendarData, onAvailabilityModalClose]);

  const calculateEnhancedStats = useCallback((data) => {
    if (!Array.isArray(data)) return;

    let totalAppointments = 0;
    let totalAvailableSlots = 0;
    let upcomingAppointments = 0;
    let totalDuration = 0;
    const timeSlotCounts = {};
    const now = new Date();

    data.forEach(day => {
      if (!day || typeof day !== 'object') return;
      
      const appointments = Array.isArray(day.appointments) ? day.appointments : [];
      const slots = Array.isArray(day.availableSlots) ? day.availableSlots : [];
      
      totalAppointments += appointments.length;
      totalAvailableSlots += slots.length;
      
      appointments.forEach(apt => {
        if (!apt || !apt.originalStartTime) return;
        
        try {
          if (new Date(apt.originalStartTime) > now) {
            upcomingAppointments++;
          }
          
          totalDuration += apt.duration || 30;
          
          const displayTime = apt.displayTime || 'Unknown';
          timeSlotCounts[displayTime] = (timeSlotCounts[displayTime] || 0) + 1;
        } catch (error) {
          console.error('Error processing appointment:', apt, error);
        }
      });
    });

    const utilizationRate = (totalAvailableSlots + totalAppointments) > 0 
      ? ((totalAppointments / (totalAvailableSlots + totalAppointments)) * 100).toFixed(1)
      : 0;

    const averageSessionDuration = totalAppointments > 0 ? Math.round(totalDuration / totalAppointments) : 0;

    const popularTimeSlots = Object.entries(timeSlotCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([time, count]) => ({ time, count }));

    setStats({
      totalAppointments,
      totalAvailableSlots,
      utilizationRate: parseFloat(utilizationRate),
      upcomingAppointments,
      weeklyBookings: totalAppointments,
      monthlyRevenue: totalAppointments * 150,
      averageSessionDuration,
      canceledAppointments: 0,
      noShowRate: 0,
      popularTimeSlots,
      appointmentType: appointmentType // Add appointment type to stats
    });
  }, [toast, appointmentType]);

  // Form Validation Functions
  const validateClientQuestions = useCallback(() => {
    const errors = {};
    const requiredFields = [
      'watchedVideo',
      'healthGoal', 
      'timelineForResults',
      'seriousnessLevel',
      'investmentRange',
      'startTimeline'
    ];

    requiredFields.forEach(field => {
      if (!clientQuestionsForm[field] || clientQuestionsForm[field].trim() === '') {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    // Validate VSL percentage
    if (clientQuestionsForm.vslWatchPercentage < 0 || clientQuestionsForm.vslWatchPercentage > 100) {
      errors.vslWatchPercentage = 'VSL watch percentage must be between 0 and 100';
    }

    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  }, [clientQuestionsForm]);

  // Validate form whenever client questions change
  useEffect(() => {
    validateClientQuestions();
  }, [clientQuestionsForm, validateClientQuestions]);

  // Enhanced Form Reset Function (kept for reference but not used to avoid circular dependencies)
  // const resetBookingForm = useCallback(() => {
  //   setBookingForm({
  //     leadId: '',
  //     startTime: '',
  //     duration: 30,
  //     notes: '',
  //     timeZone: 'Asia/Kolkata'
  //   });
  //   setClientQuestionsForm({
  //     watchedVideo: '',
  //     healthGoal: '',
  //     timelineForResults: '',
  //     seriousnessLevel: '',
  //     investmentRange: '',
  //     startTimeline: '',
  //     additionalInfo: '',
  //     vslWatchPercentage: 0
  //   });
  //   setSelectedLead(null);
  //   setLeadDetails(null);
  //   setSelectedSlot(null);
  //   setFormErrors({});
  //   setIsFormValid(false);
  // }, []);

  // FIXED Event Handlers
  const handleDateClick = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleSlotClick = useCallback((slot) => {
    console.log('Slot clicked:', slot);
    setSelectedSlot(slot);
    setBookingForm(prev => ({
      ...prev,
      startTime: slot.originalStartTime || slot.startTime,
      duration: slot.duration || 30
    }));
    onLeadSearchModalOpen();
  }, [onLeadSearchModalOpen]);

  const handleAppointmentClick = useCallback(async (appointment) => {
    console.log('Appointment clicked:', appointment);
    setSelectedAppointment(appointment);
    
    // Fetch lead details if available
    if (appointment.leadId) {
      const leadData = await fetchSingleLead(appointment.leadId);
      if (leadData) {
        setLeadDetails(leadData);
      }
    }
    
    onAppointmentDetailsOpen();
  }, [fetchSingleLead, onAppointmentDetailsOpen]);

  const handleEditAppointment = useCallback((appointment) => {
    setEditAppointmentForm({
      id: appointment.id || appointment._id,
      leadId: appointment.leadId || '',
      startTime: appointment.originalStartTime || appointment.startTime,
      duration: appointment.duration || 30,
      notes: appointment.notes || '',
      status: appointment.status || 'confirmed'
    });
    onAppointmentDetailsClose();
    onEditAppointmentModalOpen();
  }, [onAppointmentDetailsClose, onEditAppointmentModalOpen]);

  const handleLeadSelect = useCallback((lead) => {
    console.log('Lead selected:', lead);
    setSelectedLead(lead);
    setBookingForm(prev => ({
      ...prev,
      leadId: lead._id || lead.id
    }));
    onLeadSearchModalClose();
    onBookingModalOpen();
  }, [onLeadSearchModalClose, onBookingModalOpen]);

  // FIXED getEventsForDate function - Uses unfiltered data for modal
  const getEventsForDate = useCallback((date) => {
    if (!date) {
      console.log('❌ getEventsForDate: No date provided');
      return { appointments: [], availableSlots: [] };
    }
    
    try {
      const targetDateStr = getLocalDateString(date);
      console.log('🔍 getEventsForDate: Looking for date:', targetDateStr);
      
      if (!targetDateStr) {
        console.log('❌ getEventsForDate: No targetDateStr generated');
        return { appointments: [], availableSlots: [] };
      }

      const appointments = [];
      const availableSlots = [];

      // Use unfiltered data for modal to show ALL appointments
      const dataToSearch = allCalendarData.length > 0 ? allCalendarData : calendarData;
      console.log('📊 getEventsForDate: Using data length:', dataToSearch.length, '(unfiltered:', allCalendarData.length, 'filtered:', calendarData.length, ')');

      dataToSearch.forEach((dayData, index) => {
        if (!dayData) {
          console.log(`⚠️ getEventsForDate: dayData[${index}] is null/undefined`);
          return;
        }

        console.log(`🔍 getEventsForDate: Checking dayData[${index}]:`, {
          hasAppointments: Array.isArray(dayData.appointments),
          appointmentsCount: dayData.appointments?.length || 0,
          hasAvailableSlots: Array.isArray(dayData.availableSlots),
          availableSlotsCount: dayData.availableSlots?.length || 0
        });

        // Check appointments
        if (Array.isArray(dayData.appointments)) {
          dayData.appointments.forEach((apt, aptIndex) => {
            if (apt && apt.localDateString === targetDateStr) {
              console.log(`✅ getEventsForDate: Found matching appointment[${aptIndex}]:`, apt);
              appointments.push(apt);
            }
          });
        }

        // Check available slots
        if (Array.isArray(dayData.availableSlots)) {
          dayData.availableSlots.forEach((slot, slotIndex) => {
            if (slot && slot.localDateString === targetDateStr) {
              console.log(`✅ getEventsForDate: Found matching slot[${slotIndex}]:`, slot);
              availableSlots.push(slot);
            }
          });
        }
      });

      console.log('📅 getEventsForDate: Final results:', {
        targetDateStr,
        appointmentsFound: appointments.length,
        availableSlotsFound: availableSlots.length,
        appointments: appointments,
        availableSlots: availableSlots
      });

      return { appointments, availableSlots };
    } catch (error) {
      console.error('❌ Error getting events for date:', date, error);
      return { appointments: [], availableSlots: [] };
    }
  }, [allCalendarData, calendarData]);

  const handleMoreEventsClick = useCallback((date) => {
    console.log('🔍 handleMoreEventsClick called with date:', date);
    
    const events = getEventsForDate(date);
    console.log('📅 Events found for date:', {
      date: date,
      appointments: events.appointments?.length || 0,
      availableSlots: events.availableSlots?.length || 0,
      appointmentsData: events.appointments,
      availableSlotsData: events.availableSlots
    });
    
    setSelectedDayEvents({
      date: date,
      appointments: events.appointments || [],
      availableSlots: events.availableSlots || []
    });
    onDayDetailsModalOpen();
  }, [getEventsForDate, onDayDetailsModalOpen]);

  // Working Hours Management
  const addWorkingHour = useCallback(() => {
    setAvailabilityForm(prev => ({
      ...prev,
      workingHours: [...prev.workingHours, {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00'
      }]
    }));
  }, []);

  const removeWorkingHour = useCallback((index) => {
    setAvailabilityForm(prev => ({
      ...prev,
      workingHours: prev.workingHours.filter((_, i) => i !== index)
    }));
  }, []);

  const updateWorkingHour = useCallback((index, field, value) => {
    setAvailabilityForm(prev => ({
      ...prev,
      workingHours: prev.workingHours.map((wh, i) => 
        i === index ? { ...wh, [field]: value } : wh
      )
    }));
  }, []);

  // Load availability first, then calendar data
  useEffect(() => {
    if (coachId && token) {
      fetchAvailability();
    }
  }, [coachId, token, fetchAvailability]);

  // Load question types on component mount
  useEffect(() => {
    fetchQuestionTypes();
  }, [fetchQuestionTypes]);

  // Load leads data when appointment type changes
  useEffect(() => {
    if (coachId && token) {
      console.log(`🔄 Appointment type changed to: ${appointmentType}`);
      // Clear existing calendar data first to prevent showing wrong appointments
      setCalendarData([]);
      setAllCalendarData([]);
      // First fetch leads data for the new appointment type
      fetchLeadsData();
    }
  }, [coachId, token, appointmentType, fetchLeadsData]);

  // Load staff data on component mount - Similar to Customer Leads
  useEffect(() => {
    if (coachId && token) {
      fetchStaffData();
    }
  }, [coachId, token, fetchStaffData]);

  // Debug effect to log current state
  useEffect(() => {
    const totalAppointments = calendarData.reduce((sum, day) => sum + (day.appointments?.length || 0), 0);
    console.log('📊 Current Calendar State:', {
      appointmentType,
      leadsCount: leads.length,
      calendarDataDays: calendarData.length,
      totalAppointments,
      leadsWithTargetAudience: leads.filter(l => l.targetAudience).length,
      leadsWithoutTargetAudience: leads.filter(l => !l.targetAudience).length
    });
  }, [appointmentType, leads, calendarData]);

  // Sync booking form with appointment type
  useEffect(() => {
    setBookingForm(prev => ({
      ...prev,
      appointmentType: appointmentType
    }));
  }, [appointmentType]);

  // Load calendar data after leads are fetched
  useEffect(() => {
    if (coachId && token && availability && leads.length >= 0) { // Allow 0 leads
      console.log(`📅 Loading calendar data with ${leads.length} leads for ${appointmentType} appointments`);
      // Add a small delay to ensure leads are properly set and prevent race conditions
      const timer = setTimeout(() => {
        console.log(`🔄 Refreshing calendar data for ${appointmentType} appointments`);
        fetchCalendarData();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [coachId, token, availability, appointmentType, leads.length, fetchCalendarData]);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (coachId && token && !loading && availability) {
        fetchCalendarData();
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [coachId, token, loading, availability, appointmentType, fetchCalendarData]);

  // Calendar Navigation
  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }, []);

  // FIXED Calendar Grid Generation
  const getDaysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  }, [currentDate]);

  // Utility Functions
  const isToday = useCallback((date) => {
    if (!date) return false;
    try {
      const today = new Date();
      return getLocalDateString(date) === getLocalDateString(today);
    } catch (error) {
      return false;
    }
  }, []);

  const isDayAvailable = useCallback((date) => {
    if (!date || !availability?.workingHours) return false;
    try {
      const dayOfWeek = date.getDay();
      return availability.workingHours.some(wh => wh.dayOfWeek === dayOfWeek);
    } catch (error) {
      return false;
    }
  }, [availability]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Loading state
  if (loading && calendarData.length === 0) {
    return <ProfessionalLoader />;
  }

  return (
    <Box bg="gray.100" minH="100vh" py={6} px={6}>
      <Box maxW="full" mx="auto">
        <VStack spacing={8} align="stretch" w="full">
          {/* Beautiful Header */}
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
            <CardHeader py={6}>
              <VStack spacing={6} align="stretch">
                {/* Main Header Section */}
                <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={6}>
                  {/* Left Side - Title and Description */}
                  <VStack align={{ base: 'center', lg: 'start' }} spacing={3} flex="1">
                    <HStack spacing={3} justify={{ base: 'center', lg: 'start' }}>
                      <Heading size="lg" color="gray.800" fontWeight="bold">
                        {appointmentType === 'all' ? 'All' : appointmentType === 'coach' ? 'Coach' : 'Client'} Calendar Management
                      </Heading>
                      <Badge colorScheme={appointmentType === 'all' ? 'purple' : appointmentType === 'coach' ? 'blue' : 'green'} variant="subtle" px={3} py={1} borderRadius="full">
                        {appointmentType === 'all' ? 'All Appointments' : appointmentType === 'coach' ? 'Coach Focus' : 'Client Focus'}
                      </Badge>
                    </HStack>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium" textAlign={{ base: 'center', lg: 'start' }}>
                      Professional appointment scheduling and management system
                    </Text>
                  </VStack>
                  
                  {/* Right Side - Search and Actions */}
                  <VStack spacing={4} align={{ base: 'stretch', lg: 'end' }} minW={{ base: 'full', lg: 'auto' }}>
                    {/* Appointment Type Toggle */}
                    <HStack spacing={3} justify={{ base: 'center', lg: 'end' }} w="full">
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">Appointment Type:</Text>
                      <ButtonGroup size="sm" variant="outline" spacing={0} borderRadius="lg" overflow="hidden" shadow="sm">
                        <Button
                          leftIcon={<Box as={FiUsers} />}
                          colorScheme={appointmentType === 'all' ? 'purple' : 'gray'}
                          onClick={() => {
                            console.log('Switching to all appointments');
                            setAppointmentType('all');
                          }}
                          borderRadius="0"
                          borderRightRadius={appointmentType !== 'all' ? '0' : 'lg'}
                          borderLeftRadius="lg"
                          _hover={{ 
                            transform: 'translateY(-1px)', 
                            shadow: 'md',
                            bg: appointmentType === 'all' ? 'purple.50' : 'gray.50'
                          }}
                          _active={{ transform: 'translateY(0px)' }}
                          transition="all 0.2s"
                          fontWeight="medium"
                          px={4}
                          py={2}
                          borderRight="1px solid"
                          borderRightColor="gray.200"
                        >
                          All Appointments
                        </Button>
                        <Button
                          leftIcon={<Box as={FiUser} />}
                          colorScheme={appointmentType === 'coach' ? 'blue' : 'gray'}
                          onClick={() => {
                            console.log('Switching to coach appointments');
                            setAppointmentType('coach');
                          }}
                          borderRadius="0"
                          borderRightRadius={appointmentType === 'client' ? '0' : 'lg'}
                          borderLeftRadius={appointmentType === 'all' ? '0' : 'lg'}
                          _hover={{ 
                            transform: 'translateY(-1px)', 
                            shadow: 'md',
                            bg: appointmentType === 'coach' ? 'blue.50' : 'gray.50'
                          }}
                          _active={{ transform: 'translateY(0px)' }}
                          transition="all 0.2s"
                          fontWeight="medium"
                          px={4}
                          py={2}
                          borderRight="1px solid"
                          borderRightColor="gray.200"
                        >
                          Coach Appointments
                        </Button>
                        <Button
                          leftIcon={<Box as={FiUsers} />}
                          colorScheme={appointmentType === 'client' ? 'green' : 'gray'}
                          onClick={() => {
                            console.log('Switching to client appointments');
                            setAppointmentType('client');
                          }}
                          borderRadius="0"
                          borderLeftRadius={appointmentType === 'coach' ? '0' : 'lg'}
                          borderRightRadius="lg"
                          _hover={{ 
                            transform: 'translateY(-1px)', 
                            shadow: 'md',
                            bg: appointmentType === 'client' ? 'green.50' : 'gray.50'
                          }}
                          _active={{ transform: 'translateY(0px)' }}
                          transition="all 0.2s"
                          fontWeight="medium"
                          px={4}
                          py={2}
                        >
                          Client Appointments
                        </Button>
                      </ButtonGroup>
                    </HStack>
                    
                    {/* Search and Filter Row */}
                    <HStack spacing={3} justify={{ base: 'center', lg: 'end' }} w="full">
                      <InputGroup maxW="320px" w={{ base: 'full', lg: '320px' }}>
                        <InputLeftElement>
                          <SearchIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search appointments..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          bg="white"
                          borderRadius="lg"
                          border="2px"
                          borderColor="gray.200"
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                          _hover={{ borderColor: 'gray.300' }}
                          size="md"
                        />
                      </InputGroup>
                      
                      <Select 
                        maxW="140px" 
                        w={{ base: 'full', lg: '140px' }}
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        size="md"
                        borderRadius="lg"
                        border="2px"
                        borderColor="gray.200"
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                        _hover={{ borderColor: 'gray.300' }}
                      >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="canceled">Canceled</option>
                        <option value="completed">Completed</option>
                      </Select>
                    </HStack>

                  
                    
                    {/* Action Buttons Row */}
                    <HStack spacing={3} justify={{ base: 'center', lg: 'end' }} flexWrap="wrap">
                      <Button
                        leftIcon={<SettingsIcon />}
                        onClick={onAvailabilityModalOpen}
                        colorScheme="gray"
                        variant="outline"
                        size="md"
                        _hover={{
                          transform: 'translateY(-1px)',
                          shadow: 'md',
                          bg: 'gray.50'
                        }}
                        transition="all 0.2s"
                        borderRadius="lg"
                        px={4}
                        py={2}
                      >
                        Settings
                      </Button>
                      
                      <Button
                        leftIcon={<AddIcon />}
                        bg="blue.500"
                        color="white"
                        size="lg"
                        onClick={() => {
                          onLeadSearchModalOpen();
                          // Reset form inline to avoid circular dependency
                          setBookingForm({
                            leadId: '',
                            startTime: '',
                            duration: 30,
                            notes: '',
                            timeZone: 'Asia/Kolkata'
                          });
                          setClientQuestionsForm({
                            watchedVideo: '',
                            healthGoal: '',
                            timelineForResults: '',
                            seriousnessLevel: '',
                            investmentRange: '',
                            startTimeline: '',
                            additionalInfo: '',
                            vslWatchPercentage: 0
                          });
                          setSelectedLead(null);
                          setLeadDetails(null);
                          setSelectedSlot(null);
                          setFormErrors({});
                          setIsFormValid(false);
                        }}
                        borderRadius="xl"
                        px={8}
                        py={3}
                        _hover={{ 
                          bg: "blue.600",
                          transform: 'translateY(-2px)', 
                          boxShadow: 'xl',
                          filter: 'brightness(1.05)'
                        }}
                        _active={{ 
                          bg: "blue.700",
                          transform: 'translateY(0px)',
                          boxShadow: 'lg'
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        fontWeight="bold"
                        fontSize="md"
                      >
                        Book Appointment
                      </Button>
                      
                      <Button
                        leftIcon={loading ? <Spinner size="sm" /> : <RepeatIcon />}
                        colorScheme="green"
                        onClick={fetchCalendarData}
                        disabled={loading}
                        size="md"
                        _hover={{
                          transform: 'translateY(-1px)',
                          shadow: 'md',
                          bg: 'green.50'
                        }}
                        transition="all 0.2s"
                        borderRadius="lg"
                        px={4}
                        py={2}
                      >
                        {loading ? 'Loading...' : 'Refresh'}
                      </Button>
                      
 
                    </HStack>
                  </VStack>
                </Flex>
                
                                 {/* Stats Cards - Professional Design */}
                 <Box mt={2}>
                   <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={3}>
                     Calendar Performance Overview
                   </Text>
                   <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                    <StatsCard
                      title={`${appointmentType === 'all' ? 'All' : appointmentType === 'coach' ? 'Coach' : 'Client'} Appointments`}
                      value={stats.totalAppointments}
                      icon={<Box as={FiCalendar} size="24px" />}
                      color={appointmentType === 'all' ? 'purple' : appointmentType === 'coach' ? 'blue' : 'green'}
                      trend={5}
                      isLoading={loading}
                    />
                    <StatsCard
                      title="Available Slots"
                      value={stats.totalAvailableSlots}
                      icon={<Box as={FiClock} size="24px" />}
                      color="green"
                      trend={3}
                      isLoading={loading}
                    />
                    <StatsCard
                      title="Utilization Rate"
                      value={`${stats.utilizationRate}%`}
                      icon={<Box as={FiTrendingUp} size="24px" />}
                      color="orange"
                      trend={8}
                      isLoading={loading}
                    />
                    <StatsCard
                      title="Upcoming"
                      value={stats.upcomingAppointments}
                      icon={<ArrowForwardIcon />}
                      color="purple"
                      trend={12}
                      isLoading={loading}
                    />
                  </SimpleGrid>
                </Box>
              </VStack>
            </CardHeader>
          </Card>

          {/* Enhanced Navigation */}
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
            <CardBody py={4}>
              <HStack justify="space-between">
                <HStack spacing={4}>
                  <Button 
                    variant="outline" 
                    onClick={goToToday} 
                    leftIcon={<CalendarIcon />}
                    _hover={{
                      transform: 'translateY(-1px)',
                      shadow: 'md',
                      bg: 'blue.50'
                    }}
                    transition="all 0.2s"
                    borderRadius="lg"
                  >
                    Today
                  </Button>
                  
                  <HStack spacing={2}>
                    <IconButton
                      icon={<ChevronLeftIcon />}
                      onClick={() => navigateMonth(-1)}
                      variant="outline"
                      aria-label="Previous month"
                      _hover={{
                        transform: 'translateY(-1px)',
                        shadow: 'md',
                        bg: 'gray.50'
                      }}
                      transition="all 0.2s"
                    />
                    <Text fontSize="xl" fontWeight="bold" minW="200px" textAlign="center" color="gray.800">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <IconButton
                      icon={<ChevronRightIcon />}
                      onClick={() => navigateMonth(1)}
                      variant="outline"
                      aria-label="Next month"
                      _hover={{
                        transform: 'translateY(-1px)',
                        shadow: 'md',
                        bg: 'gray.50'
                      }}
                      transition="all 0.2s"
                    />
                  </HStack>
                </HStack>
                
                <HStack spacing={2}>
                  <Badge colorScheme="blue" variant="outline" px={3} py={1} borderRadius="full">
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="blue.500" borderRadius="full" />
                      <Text fontSize="xs">Appointments</Text>
                    </HStack>
                  </Badge>
                  <Badge colorScheme="green" variant="outline" px={3} py={1} borderRadius="full">
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="green.500" borderRadius="full" />
                      <Text fontSize="xs">Available</Text>
                    </HStack>
                  </Badge>
                </HStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Enhanced Calendar Container */}
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
            <CardBody py={6}>
              <VStack spacing={4} align="stretch">
                {/* Weekday Headers */}
                <Grid templateColumns="repeat(7, 1fr)" gap={2}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <Box key={day} textAlign="center" py={2}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">
                        {day}
                      </Text>
                    </Box>
                  ))}
                </Grid>

                {loading ? (
                  <Center py={20}>
                    <VStack spacing={4}>
                      <Spinner size="xl" color="blue.500" thickness="4px" />
                      <Text color="gray.600">Loading calendar data...</Text>
                    </VStack>
                  </Center>
                ) : (
                  <Grid templateColumns="repeat(7, 1fr)" gap={2} minH="800px">
                    {getDaysInMonth.map((day, index) => {
                      const events = getEventsForDate(day.date);
                      const appointments = events.appointments || [];
                      const availableSlots = events.availableSlots || [];
                      const totalEvents = appointments.length + availableSlots.length;
                      const isAvailable = isDayAvailable(day.date);
                      const todayDate = isToday(day.date);
                      
                      // Calculate how many to show: show more items but still have "show more" button
                      const maxVisibleItems = 5;
                      const visibleAppointments = appointments.slice(0, Math.min(appointments.length, maxVisibleItems));
                      const remainingAfterAppointments = maxVisibleItems - visibleAppointments.length;
                      const visibleSlots = availableSlots.slice(0, remainingAfterAppointments);
                      const hasMoreEvents = totalEvents > maxVisibleItems;

                      return (
                        <Card
                          key={index}
                          variant={day.isCurrentMonth ? 'outline' : 'ghost'}
                          bg={todayDate ? 'blue.50' : day.isCurrentMonth ? 'white' : 'gray.50'}
                          borderColor={todayDate ? 'blue.400' : 'gray.200'}
                          borderWidth={todayDate ? '2px' : '1px'}
                          minH="200px"
                          maxH="200px"
                          cursor="pointer"
                          _hover={{ shadow: 'lg', transform: 'translateY(-2px)', borderColor: todayDate ? 'blue.500' : 'blue.300' }}
                          transition="all 0.3s"
                          onClick={() => handleDateClick(day.date)}
                          opacity={day.isCurrentMonth ? 1 : 0.5}
                          borderRadius="lg"
                          overflow="hidden"
                          position="relative"
                        >
                          <CardBody p={2}>
                            <VStack align="stretch" spacing={1} h="full">
                              {/* Day Header - Compact with Load More */}
                              <HStack justify="space-between" pb={1} borderBottom="1px solid" borderColor={todayDate ? 'blue.200' : 'gray.100'}>
                                <HStack spacing={1}>
                                  <Text
                                    fontSize="md"
                                    fontWeight={todayDate ? 'bold' : 'semibold'}
                                    color={todayDate ? 'blue.600' : day.isCurrentMonth ? 'gray.800' : 'gray.400'}
                                  >
                                    {day.date.getDate()}
                                  </Text>
                                  {todayDate && (
                                    <Badge colorScheme="blue" variant="solid" borderRadius="full" fontSize="xs" px={1.5} py={0.5}>
                                      Today
                                    </Badge>
                                  )}
                                </HStack>
                                <HStack spacing={1}>
                                  {totalEvents > 0 && (
                                    <Badge 
                                      size="xs" 
                                      colorScheme="purple" 
                                      variant="solid" 
                                      borderRadius="full" 
                                      px={1.5} 
                                      fontSize="xs"
                                      cursor={hasMoreEvents ? "pointer" : "default"}
                                      onClick={(e) => {
                                        if (hasMoreEvents) {
                                          e.stopPropagation();
                                          handleMoreEventsClick(day.date);
                                        }
                                      }}
                                      _hover={hasMoreEvents ? { bg: 'purple.600', transform: 'scale(1.05)' } : {}}
                                      transition="all 0.2s"
                                    >
                                      {totalEvents}
                                    </Badge>
                                  )}
                                  {hasMoreEvents && (
                                    <IconButton
                                      size="xs"
                                      variant="ghost"
                                      icon={<ViewIcon />}
                                      colorScheme="purple"
                                      aria-label="Show all events"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoreEventsClick(day.date);
                                      }}
                                      _hover={{ bg: 'purple.100' }}
                                      h="16px"
                                      minW="16px"
                                      p={0}
                                    />
                                  )}
                                </HStack>
                              </HStack>
                              
                              {/* Events Display - Ultra Compact No Scroll */}
                              <VStack spacing={0.5} align="stretch" flex="1">
                                {/* Booked Appointments - Minimal Design */}
                                {visibleAppointments.map((apt, i) => {
                                  const appointmentColor = getAppointmentColor(apt, leads);
                                  const assignedStaff = apt.lead?.assignedTo || apt.assignedTo;
                                  return (
                                    <Box
                                      key={`apt-${i}`}
                                      px={1}
                                      py={0.5}
                                      bg={`${appointmentColor}.100`}
                                      borderRadius="sm"
                                      cursor="pointer"
                                      borderLeft="2px solid"
                                      borderLeftColor={`${appointmentColor}.500`}
                                      _hover={{ bg: `${appointmentColor}.200` }}
                                      transition="all 0.15s"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAppointmentClick(apt);
                                      }}
                                    >
                                      <VStack align="start" spacing={0.5} w="full">
                                        <HStack justify="space-between" w="full" spacing={0.5}>
                                          <Text fontSize="xs" fontWeight="bold" color={`${appointmentColor}.700`} noOfLines={1}>
                                            {apt.displayTime}
                                          </Text>
                                          <StatusBadge status={apt.status} compact={true} />
                                        </HStack>
                                        {/* Staff Assignment Display - Compact */}
                                        {assignedStaff && (
                                          <HStack spacing={0.5} w="full">
                                            <Box as={FiUser} fontSize="2xs" color="purple.600" />
                                            <Text fontSize="2xs" color="purple.700" fontWeight="semibold" noOfLines={1}>
                                              {getStaffDisplayName(assignedStaff)}
                                            </Text>
                                          </HStack>
                                        )}
                                      </VStack>
                                    </Box>
                                  );
                                })}
                                
                                {/* Available Slots - Minimal Design */}
                                {visibleSlots.map((slot, i) => (
                                  <Box
                                    key={`slot-${i}`}
                                    px={1}
                                    py={0.5}
                                    bg="green.50"
                                    borderRadius="sm"
                                    cursor="pointer"
                                    borderLeft="2px solid"
                                    borderLeftColor="green.500"
                                    _hover={{ bg: 'green.100' }}
                                    transition="all 0.15s"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSlotClick(slot);
                                    }}
                                  >
                                    <HStack justify="space-between" w="full" spacing={0.5}>
                                      <Text fontSize="xs" fontWeight="bold" color="green.700" noOfLines={1}>
                                        {slot.displayTime}
                                      </Text>
                                      <Text fontSize="xs" color="green.600">
                                        {slot.duration}m
                                      </Text>
                                    </HStack>
                                  </Box>
                                ))}
                                
                                {/* Empty day state */}
                                {totalEvents === 0 && isAvailable && (
                                  <Center flex="1" p={2} bg="gray.50" borderRadius="md" border="1px dashed" borderColor="gray.300">
                                    <VStack spacing={0.5}>
                                      <AddIcon fontSize="xs" color="gray.400" />
                                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                        Click to add
                                      </Text>
                                    </VStack>
                                  </Center>
                                )}
                                
                                {/* No availability state */}
                                {totalEvents === 0 && !isAvailable && day.isCurrentMonth && (
                                  <Center flex="1">
                                    <Text fontSize="xs" color="gray.400" fontStyle="italic">
                                      Not available
                                    </Text>
                                  </Center>
                                )}
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </Grid>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* MODALS START HERE */}

          {/* Lead Search Modal */}
          <Modal isOpen={isLeadSearchModalOpen} onClose={onLeadSearchModalClose} size="xl">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl">
              <ModalHeader>
                <HStack>
                  <SearchIcon color="blue.500" />
                  <Text>Search and Select Lead</Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              
              <ModalBody>
                <VStack spacing={6} align="stretch">
                  {/* Search Box */}
                  <HStack>
                    <InputGroup flex="1">
                      <InputLeftElement>
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search leads by name, email, or phone..."
                        value={leadSearchQuery}
                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                    <Button 
                      colorScheme="blue"
                      onClick={() => fetchLeadsData()}
                      isLoading={loadingLeads}
                      loadingText="Searching..."
                    >
                      Search
                    </Button>
                  </HStack>

                  {/* Selected Slot Info */}
                  {selectedSlot && (
                    <Card>
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="bold" color="blue.600">Selected Time Slot</Text>
                          <HStack spacing={4}>
                            <HStack>
                              <TimeIcon color="blue.500" />
                              <Text>{selectedSlot.displayTime}</Text>
                            </HStack>
                            <HStack>
                              <CalendarIcon color="green.500" />
                              <Text>{selectedSlot.duration || 30} minutes</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Leads List */}
                  {loadingLeads ? (
                    <Center py={10}>
                      <VStack spacing={4}>
                        <Spinner size="xl" color="blue.500" />
                        <Text color="gray.600">Searching leads...</Text>
                      </VStack>
                    </Center>
                  ) : (
                    <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
                      {leads.length > 0 ? (
                        leads.map((lead) => (
                          <Card
                            key={lead._id || lead.id}
                            cursor="pointer"
                            _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
                            transition="all 0.2s"
                            onClick={() => handleLeadSelect(lead)}
                          >
                            <CardBody>
                              <HStack spacing={4}>
                                <Avatar
                                  name={lead.clientQuestions?.fullName || lead.name || 'Lead'}
                                  size="md"
                                  bg="blue.500"
                                  color="white"
                                />
                                <VStack align="start" spacing={1} flex="1">
                                  <HStack justify="space-between" w="full">
                                    <Text fontWeight="bold">
                                      {lead.clientQuestions?.fullName || lead.name || 'Unknown Lead'}
                                    </Text>
                                    <Badge colorScheme={getLeadTypeColor(getLeadType(lead))} size="sm" fontSize="xs">
                                      {getLeadType(lead)}
                                    </Badge>
                                  </HStack>
                                  <Text color="gray.600" fontSize="sm">
                                    {lead.clientQuestions?.email || lead.email || 'No email'}
                                  </Text>
                                  {lead.clientQuestions?.whatsappNumber && (
                                    <HStack spacing={1}>
                                      <PhoneIcon fontSize="xs" color="green.500" />
                                      <Text fontSize="sm" color="gray.600">
                                        {lead.clientQuestions.whatsappNumber}
                                      </Text>
                                    </HStack>
                                  )}
                                  <HStack spacing={4} fontSize="xs" color="gray.500">
                                    {lead.clientQuestions?.profession && (
                                      <Text>{lead.clientQuestions.profession}</Text>
                                    )}
                                    {lead.clientQuestions?.cityCountry && (
                                      <Text>{lead.clientQuestions.cityCountry}</Text>
                                    )}
                                  </HStack>
                                </VStack>
                                <ArrowForwardIcon color="gray.400" />
                              </HStack>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Center py={10}>
                          <VStack spacing={4}>
                            <SearchIcon fontSize="3xl" color="gray.400" />
                            <VStack spacing={2}>
                              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                No leads found
                              </Text>
                              <Text color="gray.500" textAlign="center">
                                Try adjusting your search terms or load all leads.
                              </Text>
                            </VStack>
                            <Button variant="outline" onClick={() => fetchLeadsData()}>
                              Load All Leads
                            </Button>
                          </VStack>
                        </Center>
                      )}
                    </VStack>
                  )}
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onLeadSearchModalClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Booking Modal */}
          <Modal isOpen={isBookingModalOpen} onClose={onBookingModalClose} size="4xl">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl">
              <ModalHeader>
                <HStack>
                  <AddIcon color="blue.500" />
                  <Text>Book New Appointment</Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              
              <ModalBody>
                <VStack spacing={6} align="stretch">
                  {/* Selected Slot Info */}
                  {selectedSlot && (
                    <Card>
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="bold" color="blue.600">Selected Time Slot</Text>
                          <HStack spacing={4}>
                            <HStack>
                              <TimeIcon color="blue.500" />
                              <Text>{selectedSlot.displayTime}</Text>
                            </HStack>
                            <HStack>
                              <CalendarIcon color="green.500" />
                              <Text>{selectedSlot.duration || availability?.defaultAppointmentDuration || 30} minutes</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Selected Lead Info */}
                  {selectedLead && (
                    <Card>
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="bold" color="blue.600">Selected Lead</Text>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                onBookingModalClose();
                                onLeadSearchModalOpen();
                              }}
                            >
                              Change Lead
                            </Button>
                          </HStack>
                          <HStack spacing={4}>
                            <Avatar
                              name={selectedLead.clientQuestions?.fullName || selectedLead.name || 'Lead'}
                              size="md"
                              bg="blue.500"
                              color="white"
                            />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">
                                {selectedLead.clientQuestions?.fullName || selectedLead.name || 'Unknown Lead'}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {selectedLead.clientQuestions?.email || selectedLead.email || 'No email'}
                              </Text>
                              {selectedLead.clientQuestions?.whatsappNumber && (
                                <Text fontSize="sm" color="gray.600">
                                  {selectedLead.clientQuestions.whatsappNumber}
                                </Text>
                              )}
                            </VStack>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Appointment Details Form */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">Appointment Details</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                          <FormControl isRequired>
                            <FormLabel>Lead ID</FormLabel>
                            <Input
                              value={bookingForm.leadId}
                              onChange={(e) => setBookingForm(prev => ({...prev, leadId: e.target.value}))}
                              placeholder="Lead ID (auto-filled when lead selected)"
                              isReadOnly={!!selectedLead}
                              bg={selectedLead ? 'gray.50' : 'white'}
                            />
                          </FormControl>
                          
                          <FormControl isRequired>
                            <FormLabel>Date & Time</FormLabel>
                            <Input
                              type="datetime-local"
                              value={bookingForm.startTime ? new Date(bookingForm.startTime).toISOString().slice(0, 16) : ''}
                              onChange={(e) => setBookingForm(prev => ({...prev, startTime: new Date(e.target.value).toISOString()}))}
                            />
                          </FormControl>
                        </SimpleGrid>

                        <FormControl>
                          <FormLabel>Duration</FormLabel>
                          <Select
                            value={bookingForm.duration}
                            onChange={(e) => setBookingForm(prev => ({...prev, duration: parseInt(e.target.value)}))}
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                            <option value={120}>120 minutes</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Notes</FormLabel>
                          <Textarea
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm(prev => ({...prev, notes: e.target.value}))}
                            placeholder="Add any special instructions or notes..."
                            rows={4}
                            resize="vertical"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Form Validation Summary */}
                  {Object.keys(formErrors).length > 0 && (
                    <Card borderColor="red.200" bg="red.50">
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <WarningIcon color="red.500" />
                            <Text fontWeight="bold" color="red.700">Please fix the following issues:</Text>
                          </HStack>
                          <VStack align="start" spacing={1}>
                            {Object.entries(formErrors).map(([field, error]) => (
                              <Text key={field} fontSize="sm" color="red.600">
                                • {error}
                              </Text>
                            ))}
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Client Questions Form */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Heading size="md">Client Assessment Questions</Heading>
                          <Text fontSize="sm" color="gray.600">
                            Please fill out these questions to better understand the client's needs
                          </Text>
                        </VStack>
                        <Badge 
                          colorScheme={isFormValid ? "green" : "orange"} 
                          variant="subtle" 
                          px={3} 
                          py={1} 
                          borderRadius="full"
                        >
                          {isFormValid ? "Complete" : `${Object.keys(formErrors).length} Issues`}
                        </Badge>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        {/* Step 1: Fitness Assessment */}
                        <Box w="full">
                          <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.600">
                            1. Fitness Assessment
                          </Text>
                          <VStack spacing={3} align="stretch">
                            <FormControl isRequired isInvalid={!!formErrors.watchedVideo}>
                              <FormLabel fontSize="sm">Did you watch the full video before booking this call?</FormLabel>
                              <Select
                                value={clientQuestionsForm.watchedVideo}
                                onChange={(e) => setClientQuestionsForm(prev => ({...prev, watchedVideo: e.target.value}))}
                                placeholder="Select..."
                                bg="white"
                                borderColor={formErrors.watchedVideo ? "red.300" : "gray.300"}
                                _focus={{ borderColor: formErrors.watchedVideo ? "red.500" : "blue.500" }}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Select>
                              {formErrors.watchedVideo && (
                                <FormErrorMessage fontSize="xs">{formErrors.watchedVideo}</FormErrorMessage>
                              )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!formErrors.healthGoal}>
                              <FormLabel fontSize="sm">Primary Health Goal</FormLabel>
                              <Select
                                value={clientQuestionsForm.healthGoal}
                                onChange={(e) => setClientQuestionsForm(prev => ({...prev, healthGoal: e.target.value}))}
                                placeholder="Select Goal"
                                bg="white"
                                borderColor={formErrors.healthGoal ? "red.300" : "gray.300"}
                                _focus={{ borderColor: formErrors.healthGoal ? "red.500" : "blue.500" }}
                              >
                                <option value="Lose Weight (5-15 kg)">Lose Weight (5-15 kg)</option>
                                <option value="Lose Weight (15+ kg)">Lose Weight (15+ kg)</option>
                                <option value="Gain Weight/Muscle">Gain Weight/Muscle</option>
                                <option value="Improve Fitness & Energy">Improve Fitness & Energy</option>
                                <option value="Manage Health Condition (Diabetes, PCOS, Thyroid)">Manage Health Condition (Diabetes, PCOS, Thyroid)</option>
                                <option value="General Wellness & Lifestyle">General Wellness & Lifestyle</option>
                                <option value="Other">Other</option>
                              </Select>
                              {formErrors.healthGoal && (
                                <FormErrorMessage fontSize="xs">{formErrors.healthGoal}</FormErrorMessage>
                              )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!formErrors.timelineForResults}>
                              <FormLabel fontSize="sm">Timeline for Results</FormLabel>
                              <Select
                                value={clientQuestionsForm.timelineForResults}
                                onChange={(e) => setClientQuestionsForm(prev => ({...prev, timelineForResults: e.target.value}))}
                                placeholder="Select Timeline"
                                bg="white"
                                borderColor={formErrors.timelineForResults ? "red.300" : "gray.300"}
                                _focus={{ borderColor: formErrors.timelineForResults ? "red.500" : "blue.500" }}
                              >
                                <option value="1-3 months (Urgent)">1-3 months (Urgent)</option>
                                <option value="3-6 months (Moderate)">3-6 months (Moderate)</option>
                                <option value="6-12 months (Gradual)">6-12 months (Gradual)</option>
                                <option value="No specific timeline">No specific timeline</option>
                              </Select>
                              {formErrors.timelineForResults && (
                                <FormErrorMessage fontSize="xs">{formErrors.timelineForResults}</FormErrorMessage>
                              )}
                            </FormControl>
                          </VStack>
                        </Box>

                        {/* Step 2: Commitment & Investment */}
                        <Box w="full">
                          <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">
                            2. Commitment & Investment
                          </Text>
                          <VStack spacing={3} align="stretch">
                            <FormControl isRequired isInvalid={!!formErrors.seriousnessLevel}>
                              <FormLabel fontSize="sm">How serious are you about achieving your goals?</FormLabel>
                              <Select
                                value={clientQuestionsForm.seriousnessLevel}
                                onChange={(e) => setClientQuestionsForm(prev => ({...prev, seriousnessLevel: e.target.value}))}
                                placeholder="Select Level"
                                bg="white"
                                borderColor={formErrors.seriousnessLevel ? "red.300" : "gray.300"}
                                _focus={{ borderColor: formErrors.seriousnessLevel ? "red.500" : "blue.500" }}
                              >
                                <option value="Very serious - willing to invest time and money">Very serious - willing to invest time and money</option>
                                <option value="Serious - depends on the approach">Serious - depends on the approach</option>
                                <option value="Somewhat serious - exploring options">Somewhat serious - exploring options</option>
                                <option value="Just curious about possibilities">Just curious about possibilities</option>
                              </Select>
                              {formErrors.seriousnessLevel && (
                                <FormErrorMessage fontSize="xs">{formErrors.seriousnessLevel}</FormErrorMessage>
                              )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!formErrors.investmentRange}>
                              <FormLabel fontSize="sm">What investment range works for you?</FormLabel>
                              <Select
                                value={clientQuestionsForm.investmentRange}
                                onChange={(e) => setClientQuestionsForm(prev => ({...prev, investmentRange: e.target.value}))}
                                placeholder="Select Range"
                                bg="white"
                                borderColor={formErrors.investmentRange ? "red.300" : "gray.300"}
                                _focus={{ borderColor: formErrors.investmentRange ? "red.500" : "blue.500" }}
                              >
                                <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                                <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                                <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                                <option value="₹1,00,000+ (Premium programs)">₹1,00,000+ (Premium programs)</option>
                                <option value="Need to understand value first">Need to understand value first</option>
                              </Select>
                              {formErrors.investmentRange && (
                                <FormErrorMessage fontSize="xs">{formErrors.investmentRange}</FormErrorMessage>
                              )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!formErrors.startTimeline}>
                              <FormLabel fontSize="sm">When would you like to start?</FormLabel>
                              <Select
                                value={clientQuestionsForm.startTimeline}
                                onChange={(e) => setClientQuestionsForm(prev => ({...prev, startTimeline: e.target.value}))}
                                placeholder="Select Timeline"
                                bg="white"
                                borderColor={formErrors.startTimeline ? "red.300" : "gray.300"}
                                _focus={{ borderColor: formErrors.startTimeline ? "red.500" : "blue.500" }}
                              >
                                <option value="Immediately (This week)">Immediately (This week)</option>
                                <option value="Within 2 weeks">Within 2 weeks</option>
                                <option value="Within a month">Within a month</option>
                                <option value="In 2-3 months">In 2-3 months</option>
                                <option value="Just exploring for now">Just exploring for now</option>
                              </Select>
                              {formErrors.startTimeline && (
                                <FormErrorMessage fontSize="xs">{formErrors.startTimeline}</FormErrorMessage>
                              )}
                            </FormControl>
                          </VStack>
                        </Box>

                        {/* Step 3: Additional Information */}
                        <Box w="full">
                          <Text fontSize="md" fontWeight="semibold" mb={3} color="purple.600">
                            3. Additional Information
                          </Text>
                          <VStack spacing={3} align="stretch">
                            <FormControl>
                              <FormLabel fontSize="sm">Any additional information you'd like to share?</FormLabel>
                              <Textarea
                                value={clientQuestionsForm.additionalInfo}
                                onChange={(e) => setClientQuestionsForm(prev => ({...prev, additionalInfo: e.target.value}))}
                                placeholder="Tell us about your fitness journey, challenges, or specific goals..."
                                rows={3}
                                resize="vertical"
                              />
                            </FormControl>

                            <FormControl isInvalid={!!formErrors.vslWatchPercentage}>
                              <FormLabel fontSize="sm">
                                How much of our video did you watch? ({clientQuestionsForm.vslWatchPercentage}%)
                              </FormLabel>
                              <NumberInput
                                value={clientQuestionsForm.vslWatchPercentage}
                                onChange={(value) => setClientQuestionsForm(prev => ({...prev, vslWatchPercentage: parseFloat(value) || 0}))}
                                min={0}
                                max={100}
                                step={5}
                                bg="white"
                                borderColor={formErrors.vslWatchPercentage ? "red.300" : "gray.300"}
                                _focus={{ borderColor: formErrors.vslWatchPercentage ? "red.500" : "blue.500" }}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              {formErrors.vslWatchPercentage && (
                                <FormErrorMessage fontSize="xs">{formErrors.vslWatchPercentage}</FormErrorMessage>
                              )}
                            </FormControl>
                          </VStack>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <ButtonGroup spacing={3}>
                  <Button onClick={onBookingModalClose}>Cancel</Button>
                  <Button
                    colorScheme="blue"
                    onClick={bookAppointment}
                    isLoading={loading}
                    loadingText="Booking..."
                    disabled={!bookingForm.leadId || !bookingForm.startTime || !isFormValid}
                    leftIcon={<CheckCircleIcon />}
                    _disabled={{ 
                      opacity: 0.6, 
                      cursor: 'not-allowed',
                      bg: 'gray.300'
                    }}
                  >
                    {!isFormValid ? 'Complete Required Questions' : 'Book Appointment'}
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Enhanced Day Details Modal - Shows All Booked & Unbooked Appointments */}
          <Modal isOpen={isDayDetailsModalOpen} onClose={onDayDetailsModalClose} size="6xl">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" maxH="90vh" overflowY="auto">
              <ModalHeader bg="gradient-to-r" bgGradient="linear(to-r, blue.50, purple.50)">
                <VStack align="start" spacing={3}>
                  <HStack>
                    <CalendarIcon color="blue.500" boxSize={6} />
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                      {selectedDayEvents?.date ? new Date(selectedDayEvents.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Selected Date'}
                    </Text>
                  </HStack>
                  <HStack spacing={4} flexWrap="wrap">
                    <Badge colorScheme="blue" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm">
                      📅 {selectedDayEvents?.appointments?.length || 0} Booked
                    </Badge>
                    <Badge colorScheme="green" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm">
                      ⏰ {selectedDayEvents?.availableSlots?.length || 0} Available
                    </Badge>
                    <Badge colorScheme="purple" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm">
                      📊 {((selectedDayEvents?.appointments?.length || 0) + (selectedDayEvents?.availableSlots?.length || 0))} Total
                    </Badge>
                  </HStack>
                </VStack>
              </ModalHeader>
              <ModalCloseButton />
              
              <ModalBody p={6}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} align="stretch">
                  {/* Booked Appointments Section */}
                  <Card 
                    border="2px solid" 
                    borderColor="blue.300" 
                    bg="white"
                    boxShadow="xl"
                    borderRadius="xl"
                    h="full"
                    display="flex"
                    flexDirection="column"
                  >
                    <CardHeader bg="gradient-to-r" bgGradient="linear(to-r, blue.500, blue.600)" borderTopRadius="xl" py={4}>
                      <HStack justify="space-between">
                        <HStack spacing={3}>
                          <Box p={2} bg="white" borderRadius="lg">
                            <CalendarIcon color="blue.600" boxSize={5} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" color="white" fontSize="lg">
                              Booked Appointments
                            </Text>
                            <Text fontSize="sm" color="blue.100">
                              {selectedDayEvents?.appointments?.length || 0} scheduled
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    </CardHeader>
                    <CardBody flex="1" overflowY="auto" className="hide-scrollbar" minH="400px">
                      {selectedDayEvents?.appointments && selectedDayEvents.appointments.length > 0 ? (
                        <VStack spacing={3} align="stretch">
                          {selectedDayEvents.appointments.map((apt, i) => {
                            const appointmentColor = getAppointmentColor(apt, leads);
                            const leadType = getLeadType(apt.lead);
                            const leadTypeColor = getLeadTypeColor(leadType);
                            
                            return (
                              <Card
                                key={`modal-apt-${i}`}
                                variant="outline"
                                borderLeft="4px solid"
                                borderLeftColor={`${appointmentColor}.500`}
                                _hover={{ shadow: 'lg', transform: 'translateX(4px)' }}
                                transition="all 0.2s"
                                cursor="pointer"
                                onClick={() => {
                                  handleAppointmentClick(apt);
                                  onDayDetailsModalClose();
                                }}
                              >
                                <CardBody p={4}>
                                  <VStack spacing={3} align="start" w="full">
                                    <HStack justify="space-between" w="full">
                                      <VStack align="start" spacing={1}>
                                        <HStack>
                                          <TimeIcon color={`${appointmentColor}.500`} fontSize="sm" />
                                          <Text fontSize="lg" fontWeight="bold" color={`${appointmentColor}.700`}>
                                            {apt.displayTime}
                                          </Text>
                                        </HStack>
                                        <Badge colorScheme={leadTypeColor} variant="subtle" fontSize="xs">
                                          {leadType}
                                        </Badge>
                                      </VStack>
                                      <StatusBadge status={apt.status} />
                                    </HStack>
                                    
                                    <Divider />
                                    
                                    <VStack align="start" spacing={2} w="full">
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                        {apt.title || apt.lead?.name || 'Appointment'}
                                      </Text>
                                      <HStack spacing={4} fontSize="xs" color="gray.600">
                                        <HStack>
                                          <TimeIcon fontSize="xs" />
                                          <Text>{apt.duration || 30} min</Text>
                                        </HStack>
                                        {apt.lead?.email && (
                                          <HStack>
                                            <EmailIcon fontSize="xs" />
                                            <Text noOfLines={1}>{apt.lead.email}</Text>
                                          </HStack>
                                        )}
                                      </HStack>
                                      
                                      {/* Staff Assignment Display */}
                                      {(apt.lead?.assignedTo || apt.assignedTo) && (
                                        <HStack spacing={2} w="full" p={2} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
                                          <Box as={FiUser} color="purple.500" fontSize="sm" />
                                          <Text fontSize="xs" color="purple.700" fontWeight="medium">
                                            Staff: {getStaffDisplayName(apt.lead?.assignedTo || apt.assignedTo)}
                                          </Text>
                                        </HStack>
                                      )}
                                    </VStack>
                                    
                                    <HStack spacing={2} w="full">
                                      <Button
                                        size="xs"
                                        colorScheme="orange"
                                        variant="outline"
                                        leftIcon={<EditIcon />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditAppointment(apt);
                                          onDayDetailsModalClose();
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="xs"
                                        colorScheme="red"
                                        variant="outline"
                                        leftIcon={<DeleteIcon />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteAppointment(apt.id || apt._id);
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </HStack>
                                  </VStack>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </VStack>
                      ) : (
                        <Center py={10}>
                          <VStack spacing={3}>
                            <CalendarIcon fontSize="3xl" color="gray.400" />
                            <Text color="gray.500" fontSize="sm">
                              No booked appointments
                            </Text>
                          </VStack>
                        </Center>
                      )}
                    </CardBody>
                  </Card>

                  {/* Available Slots Section */}
                  <Card 
                    border="2px solid" 
                    borderColor="green.300" 
                    bg="white"
                    boxShadow="xl"
                    borderRadius="xl"
                    h="full"
                    display="flex"
                    flexDirection="column"
                  >
                    <CardHeader bg="gradient-to-r" bgGradient="linear(to-r, green.500, green.600)" borderTopRadius="xl" py={4}>
                      <HStack justify="space-between">
                        <HStack spacing={3}>
                          <Box p={2} bg="white" borderRadius="lg">
                            <TimeIcon color="green.600" boxSize={5} />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" color="white" fontSize="lg">
                              Available Time Slots
                            </Text>
                            <Text fontSize="sm" color="green.100">
                              {selectedDayEvents?.availableSlots?.length || 0} open slots
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>
                    </CardHeader>
                    <CardBody flex="1" overflowY="auto" className="hide-scrollbar" minH="400px">
                      {selectedDayEvents?.availableSlots && selectedDayEvents.availableSlots.length > 0 ? (
                        <VStack spacing={3} align="stretch">
                          {selectedDayEvents.availableSlots.map((slot, i) => (
                            <Card
                              key={`modal-slot-${i}`}
                              variant="outline"
                              borderLeft="4px solid"
                              borderLeftColor="green.500"
                              _hover={{ shadow: 'lg', transform: 'translateX(4px)', bg: 'green.50' }}
                              transition="all 0.2s"
                              cursor="pointer"
                              onClick={() => {
                                handleSlotClick(slot);
                                onDayDetailsModalClose();
                              }}
                            >
                              <CardBody p={4}>
                                <HStack justify="space-between" w="full">
                                  <VStack align="start" spacing={1}>
                                    <HStack>
                                      <TimeIcon color="green.500" fontSize="sm" />
                                      <Text fontSize="lg" fontWeight="bold" color="green.700">
                                        {slot.displayTime}
                                      </Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.600">
                                      Click to book this slot
                                    </Text>
                                  </VStack>
                                  <VStack align="end" spacing={1}>
                                    <Badge colorScheme="green" variant="solid" px={3} py={1} borderRadius="full">
                                      {slot.duration || 30} min
                                    </Badge>
                                    <Badge colorScheme="green" variant="outline" fontSize="xs">
                                      Open
                                    </Badge>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      ) : (
                        <Center py={10}>
                          <VStack spacing={3}>
                            <TimeIcon fontSize="3xl" color="gray.400" />
                            <Text color="gray.500" fontSize="sm">
                              No available slots
                            </Text>
                          </VStack>
                        </Center>
                      )}
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* No events state */}
                {(!selectedDayEvents?.appointments || selectedDayEvents.appointments.length === 0) && 
                 (!selectedDayEvents?.availableSlots || selectedDayEvents.availableSlots.length === 0) && (
                  <Center py={16} gridColumn="span 2">
                    <VStack spacing={6}>
                      <Box
                        w="120px"
                        h="120px"
                        bg="gray.50"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.400"
                        boxShadow="lg"
                      >
                        <CalendarIcon fontSize="48px" />
                      </Box>
                      <VStack spacing={3}>
                        <Text fontSize="xl" fontWeight="bold" color="gray.600">
                          No events scheduled for this day
                        </Text>
                        <Text color="gray.500" textAlign="center" maxW="md">
                          This day has no booked appointments or available time slots. 
                          You can create new appointments or set up available time slots.
                        </Text>
                      </VStack>
                      <HStack spacing={4}>
                        <Button
                          colorScheme="blue"
                          leftIcon={<AddIcon />}
                          size="lg"
                          onClick={() => {
                            onDayDetailsModalClose();
                            onLeadSearchModalOpen();
                          }}
                        >
                          Create New Appointment
                        </Button>
                        <Button
                          colorScheme="green"
                          leftIcon={<TimeIcon />}
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            onDayDetailsModalClose();
                            onAvailabilityModalOpen();
                          }}
                        >
                          Set Available Slots
                        </Button>
                      </HStack>
                    </VStack>
                  </Center>
                )}
              </ModalBody>

              <ModalFooter>
                <HStack spacing={3} justify="space-between" w="full">
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.600">
                      Total: {((selectedDayEvents?.appointments?.length || 0) + (selectedDayEvents?.availableSlots?.length || 0))} events
                    </Text>
                  </HStack>
                  <ButtonGroup spacing={3}>
                    <Button onClick={onDayDetailsModalClose} variant="outline">
                      Close
                    </Button>
                    <Button
                      colorScheme="blue"
                      leftIcon={<AddIcon />}
                      onClick={() => {
                        onDayDetailsModalClose();
                        onLeadSearchModalOpen();
                      }}
                    >
                      Add New Appointment
                    </Button>
                  </ButtonGroup>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Availability Settings Modal */}
          <Modal isOpen={isAvailabilityModalOpen} onClose={onAvailabilityModalClose} size="2xl">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl">
              <ModalHeader>
                <HStack>
                  <SettingsIcon color="blue.500" />
                  <Text>Availability Settings</Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              
              <ModalBody>
                <VStack spacing={6} align="stretch">
                  {/* Weekly Schedule */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Heading size="md">Weekly Schedule</Heading>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<SmallAddIcon />}
                          onClick={addWorkingHour}
                        >
                          Add Schedule
                        </Button>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      {availabilityForm.workingHours.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {availabilityForm.workingHours.map((wh, index) => (
                            <Card key={index} variant="outline">
                              <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} alignItems="end">
                                  <FormControl>
                                    <FormLabel fontSize="sm">Day</FormLabel>
                                    <Select
                                      value={wh.dayOfWeek}
                                      onChange={(e) => updateWorkingHour(index, 'dayOfWeek', parseInt(e.target.value))}
                                    >
                                      {dayNames.map((day, i) => (
                                        <option key={i} value={i}>{day}</option>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Start Time</FormLabel>
                                    <Input
                                      type="time"
                                      value={wh.startTime}
                                      onChange={(e) => updateWorkingHour(index, 'startTime', e.target.value)}
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="sm">End Time</FormLabel>
                                    <Input
                                      type="time"
                                      value={wh.endTime}
                                      onChange={(e) => updateWorkingHour(index, 'endTime', e.target.value)}
                                    />
                                  </FormControl>
                                  <Button
                                    colorScheme="red"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeWorkingHour(index)}
                                    leftIcon={<DeleteIcon />}
                                  >
                                    Remove
                                  </Button>
                                </SimpleGrid>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      ) : (
                        <Center py={8}>
                          <VStack spacing={4}>
                            <TimeIcon fontSize="3xl" color="gray.400" />
                            <Text color="gray.500" textAlign="center">
                              No working hours set. Add your schedule to start accepting appointments.
                            </Text>
                          </VStack>
                        </Center>
                      )}
                    </CardBody>
                  </Card>

                  {/* General Settings */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">General Settings</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel>Default Duration</FormLabel>
                          <Select
                            value={availabilityForm.defaultAppointmentDuration}
                            onChange={(e) => setAvailabilityForm(prev => ({
                              ...prev,
                              defaultAppointmentDuration: parseInt(e.target.value)
                            }))}
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                            <option value={120}>120 minutes</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Time Zone</FormLabel>
                          <Select
                            value={availabilityForm.timeZone}
                            onChange={(e) => setAvailabilityForm(prev => ({
                              ...prev,
                              timeZone: e.target.value
                            }))}
                          >
                            <option value="Asia/Kolkata">India Standard Time (IST)</option>
                            <option value="America/New_York">Eastern Time (EST/EDT)</option>
                            <option value="America/Chicago">Central Time (CST/CDT)</option>
                            <option value="UTC">UTC</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <ButtonGroup spacing={3}>
                  <Button onClick={onAvailabilityModalClose}>Cancel</Button>
                  <Button
                    colorScheme="blue"
                    onClick={updateAvailability}
                    isLoading={loading}
                    loadingText="Saving..."
                    leftIcon={<CheckCircleIcon />}
                  >
                    Save Settings
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Edit Appointment Modal */}
          <Modal isOpen={isEditAppointmentModalOpen} onClose={onEditAppointmentModalClose} size="xl">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl">
              <ModalHeader>
                <HStack>
                  <EditIcon color="orange.500" />
                  <Text>Edit Appointment</Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              
              <ModalBody>
                <VStack spacing={6} align="stretch">
                  <Card>
                    <CardHeader>
                      <Heading size="md">Appointment Details</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                          <FormControl isRequired>
                            <FormLabel>Lead ID</FormLabel>
                            <Input
                              value={editAppointmentForm.leadId}
                              onChange={(e) => setEditAppointmentForm(prev => ({...prev, leadId: e.target.value}))}
                              placeholder="Enter lead ID (required)"
                            />
                          </FormControl>
                          
                          <FormControl isRequired>
                            <FormLabel>Date & Time</FormLabel>
                            <Input
                              type="datetime-local"
                              value={editAppointmentForm.startTime ? new Date(editAppointmentForm.startTime).toISOString().slice(0, 16) : ''}
                              onChange={(e) => setEditAppointmentForm(prev => ({...prev, startTime: new Date(e.target.value).toISOString()}))}
                            />
                          </FormControl>
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                          <FormControl>
                            <FormLabel>Duration</FormLabel>
                            <Select
                              value={editAppointmentForm.duration}
                              onChange={(e) => setEditAppointmentForm(prev => ({...prev, duration: parseInt(e.target.value)}))}
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={45}>45 minutes</option>
                              <option value={60}>60 minutes</option>
                              <option value={90}>90 minutes</option>
                              <option value={120}>120 minutes</option>
                            </Select>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Select
                              value={editAppointmentForm.status}
                              onChange={(e) => setEditAppointmentForm(prev => ({...prev, status: e.target.value}))}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="pending">Pending</option>
                              <option value="canceled">Canceled</option>
                              <option value="completed">Completed</option>
                              <option value="no-show">No Show</option>
                            </Select>
                          </FormControl>
                        </SimpleGrid>

                        <FormControl>
                          <FormLabel>Notes</FormLabel>
                          <Textarea
                            value={editAppointmentForm.notes}
                            onChange={(e) => setEditAppointmentForm(prev => ({...prev, notes: e.target.value}))}
                            placeholder="Add any special instructions..."
                            rows={4}
                            resize="vertical"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <ButtonGroup spacing={3}>
                  <Button onClick={onEditAppointmentModalClose}>Cancel</Button>
                  <Button
                    colorScheme="orange"
                    onClick={updateAppointment}
                    isLoading={loading}
                    loadingText="Updating..."
                    disabled={!editAppointmentForm.leadId || !editAppointmentForm.startTime}
                    leftIcon={<CheckCircleIcon />}
                  >
                    Update Appointment
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Enhanced Appointment Details Modal */}
          <Modal isOpen={isAppointmentDetailsOpen} onClose={onAppointmentDetailsClose} size="6xl">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" maxH="90vh" overflowY="auto">
              <ModalHeader>
                <HStack>
                  <ViewIcon color="blue.500" />
                  <Text>Appointment Details</Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              
              <ModalBody>
                {selectedAppointment && (
                  <VStack spacing={6} align="stretch">
                    {/* Appointment Information */}
                    <Card>
                      <CardHeader>
                        <HStack justify="space-between">
                          <Heading size="md">Appointment Information</Heading>
                          <StatusBadge status={selectedAppointment.status} />
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="sm" color="gray.500">Title</Text>
                            <Text fontWeight="medium">{selectedAppointment.title || 'Appointment'}</Text>
                          </VStack>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="sm" color="gray.500">Date & Time</Text>
                            <HStack>
                              <CalendarIcon color="blue.500" />
                              <Text fontWeight="medium">
                                {selectedAppointment.displayDate} at {selectedAppointment.displayTime}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="sm" color="gray.500">Duration</Text>
                            <HStack>
                              <TimeIcon color="green.500" />
                              <Text fontWeight="medium">{selectedAppointment.duration || 30} minutes</Text>
                            </HStack>
                          </VStack>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="sm" color="gray.500">Lead ID</Text>
                            <Text fontWeight="medium">{selectedAppointment.leadId}</Text>
                          </VStack>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="sm" color="gray.500">Assigned Staff</Text>
                            <HStack>
                              <Box as={FiUser} color="purple.500" fontSize="20px" />
                              <Badge 
                                colorScheme={selectedAppointment.lead?.assignedTo || selectedAppointment.assignedTo ? 'purple' : 'gray'} 
                                variant={selectedAppointment.lead?.assignedTo || selectedAppointment.assignedTo ? 'solid' : 'outline'}
                                borderRadius="full"
                                px={3}
                                py={1}
                                fontSize="md"
                              >
                                {getStaffDisplayName(selectedAppointment.lead?.assignedTo || selectedAppointment.assignedTo)}
                              </Badge>
                            </HStack>
                          </VStack>
                        </SimpleGrid>
                      </CardBody>
                    </Card>

                    {/* Lead Details with Score & VSL Score */}
                    {leadDetails && (
                      <Card border="2px solid" borderColor="blue.200" bg="blue.50">
                        <CardHeader bg="blue.100" borderRadius="lg">
                          <HStack justify="space-between">
                            <Heading size="md" color="blue.800">📊 Lead Information & Scores</Heading>
                            <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
                              Lead Details
                            </Badge>
                          </HStack>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={6} align="stretch">
                            {/* Lead Basic Info */}
                            <HStack spacing={4} align="start">
                              <Avatar
                                name={leadDetails.clientQuestions?.fullName || leadDetails.name || 'Lead'}
                                size="xl"
                                bg="blue.500"
                                color="white"
                                border="3px solid"
                                borderColor="blue.300"
                              />
                              <VStack align="start" spacing={3} flex="1">
                                <VStack align="start" spacing={2}>
                                  <HStack justify="space-between" w="full">
                                    <Text fontSize="xl" fontWeight="bold" color="blue.800">
                                      {leadDetails.clientQuestions?.fullName || leadDetails.name || 'Unknown Lead'}
                                    </Text>
                                    <Badge colorScheme={getLeadTypeColor(getLeadType(leadDetails))} size="lg" px={3} py={1}>
                                      {getLeadType(leadDetails)}
                                    </Badge>
                                  </HStack>
                                  {leadDetails.clientQuestions?.profession && (
                                    <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                                      💼 {leadDetails.clientQuestions.profession}
                                    </Badge>
                                  )}
                                </VStack>
                                
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                                  {leadDetails.clientQuestions?.email && (
                                    <HStack p={2} bg="white" borderRadius="md" border="1px solid" borderColor="blue.200">
                                      <EmailIcon color="blue.500" />
                                      <Text fontSize="sm" fontWeight="medium">{leadDetails.clientQuestions.email}</Text>
                                    </HStack>
                                  )}
                                  {leadDetails.clientQuestions?.whatsappNumber && (
                                    <HStack p={2} bg="white" borderRadius="md" border="1px solid" borderColor="blue.200">
                                      <PhoneIcon color="green.500" />
                                      <Text fontSize="sm" fontWeight="medium">{leadDetails.clientQuestions.whatsappNumber}</Text>
                                    </HStack>
                                  )}
                                  {leadDetails.clientQuestions?.cityCountry && (
                                    <HStack p={2} bg="white" borderRadius="md" border="1px solid" borderColor="blue.200">
                                      <InfoIcon color="purple.500" />
                                      <Text fontSize="sm" fontWeight="medium">{leadDetails.clientQuestions.cityCountry}</Text>
                                    </HStack>
                                  )}
                                </SimpleGrid>
                              </VStack>
                            </HStack>

                            {/* Enhanced Score & VSL Score Section */}
                            <Card bg="white" border="2px solid" borderColor="green.200" shadow="lg">
                              <CardHeader bg="gradient-to-r" bgGradient="linear(to-r, green.100, blue.100)" borderRadius="lg">
                                <HStack justify="space-between">
                                  <HStack>
                                    <Box as={FiTarget} color="green.600" fontSize="28px" />
                                    <Heading size="lg" color="green.800">🎯 Lead Performance Analytics</Heading>
                                  </HStack>
                                  <Badge colorScheme="green" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm">
                                    📊 Performance Metrics
                                  </Badge>
                                </HStack>
                              </CardHeader>
                              <CardBody p={6}>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                                  {/* Lead Score */}
                                  <VStack spacing={4} p={6} bg="gradient-to-br" bgGradient="linear(to-br, green.50, green.100)" borderRadius="xl" border="2px solid" borderColor="green.200" shadow="md" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.3s">
                                    <HStack>
                                      <Box as={FiTarget} color="green.600" fontSize="32px" />
                                      <Text fontSize="xl" fontWeight="bold" color="green.800">Lead Score</Text>
                                    </HStack>
                                    <VStack spacing={3}>
                                      <Text fontSize="4xl" fontWeight="bold" color="green.600" textShadow="0 2px 4px rgba(0,0,0,0.1)">
                                        {leadDetails.score || leadDetails.leadScore || leadDetails.questionResponses?.score || 'N/A'}
                                      </Text>
                                      <Text fontSize="sm" color="green.700" textAlign="center" fontWeight="medium">
                                        Overall lead quality and engagement score
                                      </Text>
                                    </VStack>
                                    <Badge 
                                      colorScheme={(() => {
                                        const score = leadDetails.score || leadDetails.leadScore || leadDetails.questionResponses?.score;
                                        return score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
                                      })()} 
                                      variant="solid" 
                                      px={4} py={2} 
                                      borderRadius="full"
                                      fontSize="sm"
                                      fontWeight="bold"
                                    >
                                      {(() => {
                                        const score = leadDetails.score || leadDetails.leadScore || leadDetails.questionResponses?.score;
                                        return score >= 80 ? '🌟 High Quality' : score >= 60 ? '⭐ Medium Quality' : '📉 Low Quality';
                                      })()}
                                    </Badge>
                                  </VStack>

                                  {/* VSL Score */}
                                  <VStack spacing={4} p={6} bg="gradient-to-br" bgGradient="linear(to-br, purple.50, purple.100)" borderRadius="xl" border="2px solid" borderColor="purple.200" shadow="md" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.3s">
                                    <HStack>
                                      <Box as={FiBarChart2} color="purple.600" fontSize="32px" />
                                      <Text fontSize="xl" fontWeight="bold" color="purple.800">VSL Score</Text>
                                    </HStack>
                                    <VStack spacing={3}>
                                      <Text fontSize="4xl" fontWeight="bold" color="purple.600" textShadow="0 2px 4px rgba(0,0,0,0.1)">
                                        {leadDetails.vslScore || leadDetails.vsl_score || leadDetails.questionResponses?.vslScore || leadDetails.questionResponses?.vsl_score || 'N/A'}
                                      </Text>
                                      <Text fontSize="sm" color="purple.700" textAlign="center" fontWeight="medium">
                                        Video Sales Letter engagement and conversion score
                                      </Text>
                                    </VStack>
                                    <Badge 
                                      colorScheme={(() => {
                                        const vslScore = leadDetails.vslScore || leadDetails.vsl_score || leadDetails.questionResponses?.vslScore || leadDetails.questionResponses?.vsl_score;
                                        return vslScore >= 80 ? 'purple' : vslScore >= 60 ? 'orange' : 'red';
                                      })()} 
                                      variant="solid" 
                                      px={4} py={2} 
                                      borderRadius="full"
                                      fontSize="sm"
                                      fontWeight="bold"
                                    >
                                      {(() => {
                                        const vslScore = leadDetails.vslScore || leadDetails.vsl_score || leadDetails.questionResponses?.vslScore || leadDetails.questionResponses?.vsl_score;
                                        return vslScore >= 80 ? '🚀 High Engagement' : vslScore >= 60 ? '📈 Medium Engagement' : '📉 Low Engagement';
                                      })()}
                                    </Badge>
                                  </VStack>
                                </SimpleGrid>

                                {/* Enhanced Score Details */}
                                {(() => {
                                  const score = leadDetails.score || leadDetails.leadScore || leadDetails.questionResponses?.score;
                                  const vslScore = leadDetails.vslScore || leadDetails.vsl_score || leadDetails.questionResponses?.vslScore || leadDetails.questionResponses?.vsl_score;
                                  return score || vslScore;
                                })() && (
                                  <Box mt={6} p={6} bg="gradient-to-r" bgGradient="linear(to-r, gray.50, blue.50)" borderRadius="xl" border="2px solid" borderColor="gray.200" shadow="md">
                                    <HStack mb={4}>
                                      <Box as={FiTrendingUp} color="blue.600" fontSize="24px" />
                                      <Text fontSize="lg" fontWeight="bold" color="gray.700">
                                        📈 Detailed Score Breakdown
                                      </Text>
                                    </HStack>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                      {(() => {
                                        const score = leadDetails.score || leadDetails.leadScore || leadDetails.questionResponses?.score;
                                        return score && (
                                          <HStack justify="space-between" p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="green.200">
                                            <HStack>
                                              <Box as={FiTarget} color="green.500" />
                                              <Text fontSize="sm" color="gray.600" fontWeight="medium">Lead Score:</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="bold" color="green.600">{score}/100</Text>
                                          </HStack>
                                        );
                                      })()}
                                      {(() => {
                                        const vslScore = leadDetails.vslScore || leadDetails.vsl_score || leadDetails.questionResponses?.vslScore || leadDetails.questionResponses?.vsl_score;
                                        return vslScore && (
                                          <HStack justify="space-between" p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="purple.200">
                                            <HStack>
                                              <Box as={FiBarChart2} color="purple.500" />
                                              <Text fontSize="sm" color="gray.600" fontWeight="medium">VSL Score:</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="bold" color="purple.600">{vslScore}/100</Text>
                                          </HStack>
                                        );
                                      })()}
                                      {(() => {
                                        const score = leadDetails.score || leadDetails.leadScore || leadDetails.questionResponses?.score;
                                        const vslScore = leadDetails.vslScore || leadDetails.vsl_score || leadDetails.questionResponses?.vslScore || leadDetails.questionResponses?.vsl_score;
                                        return score && vslScore && (
                                          <HStack justify="space-between" p={3} bg="white" borderRadius="lg" border="1px solid" borderColor="blue.200" gridColumn="span 2">
                                            <HStack>
                                              <Box as={FiTrendingUp} color="blue.500" />
                                              <Text fontSize="sm" color="gray.600" fontWeight="medium">Combined Score:</Text>
                                            </HStack>
                                            <Text fontSize="sm" fontWeight="bold" color="blue.600">
                                              {Math.round((score + vslScore) / 2)}/100
                                            </Text>
                                          </HStack>
                                        );
                                      })()}
                                    </SimpleGrid>
                                    
                                    {/* Debug Info */}
                                    <Box mt={4} p={3} bg="yellow.50" borderRadius="md" border="1px solid" borderColor="yellow.200">
                                      <Text fontSize="xs" color="yellow.700" fontWeight="medium" mb={2}>
                                        🔍 Debug Info (Check Console for Full Lead Data):
                                      </Text>
                                      <Text fontSize="xs" color="yellow.600">
                                        Score Sources: score, leadScore, questionResponses.score | VSL Sources: vslScore, vsl_score, questionResponses.vslScore, questionResponses.vsl_score
                                      </Text>
                                    </Box>
                                  </Box>
                                )}
                              </CardBody>
                            </Card>
                          </VStack>
                        </CardBody>
                      </Card>
                    )}

                    {/* Questions and Answers */}
                    {((selectedAppointment.clientQuestions && Object.keys(selectedAppointment.clientQuestions).length > 0) || 
                      (selectedAppointment.coachQuestions && Object.keys(selectedAppointment.coachQuestions).length > 0) ||
                      (leadDetails && leadDetails.clientQuestions && Object.keys(leadDetails.clientQuestions).length > 0) ||
                      (leadDetails && leadDetails.coachQuestions && Object.keys(leadDetails.coachQuestions).length > 0)) && (
                      <Card>
                        <CardHeader>
                          <Heading size="md">Questions & Answers</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={6} align="stretch">
                            {/* Client Questions */}
                            {((selectedAppointment.clientQuestions && Object.keys(selectedAppointment.clientQuestions).length > 0) ||
                              (leadDetails && leadDetails.clientQuestions && Object.keys(leadDetails.clientQuestions).length > 0)) && (
                              <Box>
                                <Text fontSize="lg" fontWeight="bold" color="green.600" mb={4}>
                                  Client Questions
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                  {Object.entries(selectedAppointment.clientQuestions || leadDetails?.clientQuestions || {}).map(([key, value]) => {
                                    if (!value || value === '') return null;
                                    
                                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    
                                    return (
                                      <VStack key={key} align="start" spacing={1} p={3} bg="green.50" borderRadius="md" border="1px" borderColor="green.200">
                                        <Text fontSize="sm" fontWeight="medium" color="green.700">
                                          {label}:
                                        </Text>
                                        <Text fontSize="sm" color="gray.800">
                                          {Array.isArray(value) ? value.join(', ') : value}
                                        </Text>
                                      </VStack>
                                    );
                                  })}
                                </SimpleGrid>
                              </Box>
                            )}

                            {/* Coach Questions */}
                            {((selectedAppointment.coachQuestions && Object.keys(selectedAppointment.coachQuestions).length > 0) ||
                              (leadDetails && leadDetails.coachQuestions && Object.keys(leadDetails.coachQuestions).length > 0)) && (
                              <Box>
                                <Text fontSize="lg" fontWeight="bold" color="blue.600" mb={4}>
                                  Coach Questions
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                  {Object.entries(selectedAppointment.coachQuestions || leadDetails?.coachQuestions || {}).map(([key, value]) => {
                                    if (!value || value === '') return null;
                                    
                                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    
                                    return (
                                      <VStack key={key} align="start" spacing={1} p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                                        <Text fontSize="sm" fontWeight="medium" color="blue.700">
                                          {label}:
                                        </Text>
                                        <Text fontSize="sm" color="gray.800">
                                          {Array.isArray(value) ? value.join(', ') : value}
                                        </Text>
                                      </VStack>
                                    );
                                  })}
                                </SimpleGrid>
                              </Box>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    )}

                    {/* Notes */}
                    {selectedAppointment.notes && (
                      <Card>
                        <CardHeader>
                          <Heading size="md">Notes</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text color="gray.700" lineHeight="1.6">
                            {selectedAppointment.notes}
                          </Text>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                )}
              </ModalBody>

              <ModalFooter>
                <ButtonGroup spacing={3}>
                  <Button onClick={onAppointmentDetailsClose}>Close</Button>
                  <Button
                    colorScheme="orange"
                    leftIcon={<EditIcon />}
                    onClick={() => handleEditAppointment(selectedAppointment)}
                  >
                    Edit Appointment
                  </Button>
                  <Button
                    colorScheme="red"
                    leftIcon={<DeleteIcon />}
                    onClick={() => deleteAppointment(selectedAppointment.id || selectedAppointment._id)}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* API Console Modal */}
          <Modal isOpen={apiConsoleOpen} onClose={() => setApiConsoleOpen(false)} size="6xl">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent borderRadius="2xl" maxH="90vh">
              <ModalHeader>
                <HStack>
                  <Box as={FiBarChart2} size="24px" color="purple.500" />
                  <Text>Questions API Console & Response Viewer</Text>
                  <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                    Coach Dashboard
                  </Badge>
                </HStack>
              </ModalHeader>
              <ModalCloseButton />
              
              <ModalBody>
                <Tabs variant="enclosed" colorScheme="purple">
                  <TabList>
                    <Tab>API Testing</Tab>
                    <Tab>Question Types</Tab>
                    <Tab>User Responses Display</Tab>
                    <Tab>Leads Detail Console</Tab>
                    <Tab>API Results</Tab>
                  </TabList>

                  <TabPanels>
                    {/* API Testing Panel */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        {/* Lead ID Input */}
                        <Card>
                          <CardHeader>
                            <Heading size="md">Test Configuration</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              <FormControl isRequired>
                                <FormLabel>Lead ID for Testing</FormLabel>
                                <Input
                                  placeholder="Enter Lead ID (e.g., 64a5f8b4c123456789abcdef)"
                                  value={testLeadId}
                                  onChange={(e) => setTestLeadId(e.target.value)}
                                  bg="white"
                                />
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                  Required for testing client/coach questions and lead update APIs
                                </Text>
                              </FormControl>
                            </VStack>
                          </CardBody>
                        </Card>

                        {/* API Test Buttons */}
                        <Card>
                          <CardHeader>
                            <Heading size="md">API Tests</Heading>
                          </CardHeader>
                          <CardBody>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <VStack spacing={3} align="stretch">
                                <Text fontWeight="semibold" color="blue.600">Public APIs (No Auth)</Text>
                                <Button
                                  leftIcon={<ViewIcon />}
                                  colorScheme="blue"
                                  onClick={testQuestionTypesAPI}
                                  isLoading={apiLoading}
                                  size="md"
                                >
                                  Test Question Types API
                                </Button>
                                <Button
                                  leftIcon={<CheckCircleIcon />}
                                  colorScheme="green"
                                  onClick={testClientQuestionsAPI}
                                  isLoading={apiLoading}
                                  disabled={!testLeadId.trim()}
                                  size="md"
                                >
                                  Test Client Questions API
                                </Button>
                                <Button
                                  leftIcon={<StarIcon />}
                                  colorScheme="orange"
                                  onClick={testCoachQuestionsAPI}
                                  isLoading={apiLoading}
                                  disabled={!testLeadId.trim()}
                                  size="md"
                                >
                                  Test Coach Questions API
                                </Button>
                                <Button
                                  leftIcon={<EditIcon />}
                                  colorScheme="purple"
                                  onClick={testLeadUpdateAPI}
                                  isLoading={apiLoading}
                                  disabled={!testLeadId.trim()}
                                  size="md"
                                >
                                  Test Lead Update API
                                </Button>
                              </VStack>
                              
                              <VStack spacing={3} align="stretch">
                                <Text fontWeight="semibold" color="purple.600">Actions</Text>
                                <Button
                                  leftIcon={<DeleteIcon />}
                                  colorScheme="red"
                                  variant="outline"
                                  onClick={clearApiResults}
                                  size="md"
                                >
                                  Clear Results
                                </Button>
                                <Box
                                  p={4}
                                  bg="blue.50"
                                  borderRadius="md"
                                  border="1px"
                                  borderColor="blue.200"
                                >
                                  <VStack spacing={2} align="start">
                                    <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                                      Total API Tests: {apiTestResults.length}
                                    </Text>
                                    <Text fontSize="sm" color="blue.600">
                                      Success: {apiTestResults.filter(r => r.success).length}
                                    </Text>
                                    <Text fontSize="sm" color="blue.600">
                                      Failed: {apiTestResults.filter(r => !r.success).length}
                                    </Text>
                                  </VStack>
                                </Box>
                              </VStack>
                            </SimpleGrid>
                          </CardBody>
                        </Card>
                      </VStack>
                    </TabPanel>

                    {/* Question Types Panel */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        {loadingQuestionTypes ? (
                          <Center py={10}>
                            <VStack spacing={4}>
                              <Spinner size="xl" color="purple.500" />
                              <Text>Loading question types...</Text>
                            </VStack>
                          </Center>
                        ) : questionTypes ? (
                          <VStack spacing={6} align="stretch">
                            {/* Client Questions */}
                            <Card>
                              <CardHeader>
                                <HStack>
                                  <Box as={FiUser} size="20px" color="blue.500" />
                                  <Heading size="md" color="blue.600">Client Questions Structure</Heading>
                                </HStack>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={4} align="stretch">
                                  <Text fontSize="sm" color="gray.600" fontStyle="italic">
                                    {questionTypes.client?.description}
                                  </Text>
                                  {questionTypes.client?.questions?.map((q, i) => (
                                    <Box key={i} p={4} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                                      <VStack spacing={2} align="start">
                                        <HStack>
                                          <Badge colorScheme="blue" size="sm">{q.field}</Badge>
                                          <Badge colorScheme={q.required ? 'red' : 'gray'} size="sm">
                                            {q.required ? 'Required' : 'Optional'}
                                          </Badge>
                                          <Badge colorScheme="green" size="sm">{q.type}</Badge>
                                        </HStack>
                                        <Text fontSize="sm" fontWeight="semibold">{q.question}</Text>
                                        {q.options && (
                                          <Box>
                                            <Text fontSize="xs" color="gray.600" fontWeight="medium">Options:</Text>
                                            <Wrap spacing={1} mt={1}>
                                              {q.options.map((opt, oi) => (
                                                <WrapItem key={oi}>
                                                  <Badge variant="outline" size="sm">{opt}</Badge>
                                                </WrapItem>
                                              ))}
                                            </Wrap>
                                          </Box>
                                        )}
                                      </VStack>
                                    </Box>
                                  ))}
                                </VStack>
                              </CardBody>
                            </Card>

                            {/* Coach Questions */}
                            <Card>
                              <CardHeader>
                                <HStack>
                                  <Box as={FiUsers} size="20px" color="orange.500" />
                                  <Heading size="md" color="orange.600">Coach Questions Structure</Heading>
                                </HStack>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={4} align="stretch">
                                  <Text fontSize="sm" color="gray.600" fontStyle="italic">
                                    {questionTypes.coach?.description}
                                  </Text>
                                  {questionTypes.coach?.questions?.map((q, i) => (
                                    <Box key={i} p={4} bg="orange.50" borderRadius="md" border="1px" borderColor="orange.200">
                                      <VStack spacing={2} align="start">
                                        <HStack>
                                          <Badge colorScheme="orange" size="sm">{q.field}</Badge>
                                          <Badge colorScheme={q.required ? 'red' : 'gray'} size="sm">
                                            {q.required ? 'Required' : 'Optional'}
                                          </Badge>
                                          <Badge colorScheme="green" size="sm">{q.type}</Badge>
                                        </HStack>
                                        <Text fontSize="sm" fontWeight="semibold">{q.question}</Text>
                                        {q.options && (
                                          <Box>
                                            <Text fontSize="xs" color="gray.600" fontWeight="medium">Options:</Text>
                                            <Wrap spacing={1} mt={1}>
                                              {q.options.map((opt, oi) => (
                                                <WrapItem key={oi}>
                                                  <Badge variant="outline" size="sm">{opt}</Badge>
                                                </WrapItem>
                                              ))}
                                            </Wrap>
                                          </Box>
                                        )}
                                      </VStack>
                                    </Box>
                                  ))}
                                </VStack>
                              </CardBody>
                            </Card>
                          </VStack>
                        ) : (
                          <Center py={10}>
                            <VStack spacing={4}>
                              <WarningIcon fontSize="4xl" color="gray.400" />
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Question Types Loaded
                                </Text>
                                <Text color="gray.500" textAlign="center">
                                  Question types not loaded yet. Use API Testing tab to fetch them.
                                </Text>
                              </VStack>
                              <Button colorScheme="purple" onClick={fetchQuestionTypes}>
                                Load Question Types
                              </Button>
                            </VStack>
                          </Center>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* User Responses Display Panel */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Card>
                          <CardHeader>
                            <HStack>
                              <Box as={FiEye} size="20px" color="green.500" />
                              <Heading size="md" color="green.600">User Question Responses Viewer</Heading>
                            </HStack>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={6} align="stretch">
                              {/* Test Client Questions Display */}
                              <Box>
                                <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                                  Sample Client Questions & Answers:
                                </Text>
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                                  {Object.entries(testClientQuestions).map(([key, value]) => (
                                    <Box key={key} p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                                      <VStack spacing={2} align="start">
                                        <Text fontSize="sm" fontWeight="bold" color="blue.700">
                                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                        </Text>
                                        <Text fontSize="sm" color="blue.600" wordBreak="break-word">
                                          {typeof value === 'number' ? `${value}%` : value || 'Not provided'}
                                        </Text>
                                      </VStack>
                                    </Box>
                                  ))}
                                </SimpleGrid>
                              </Box>

                              <Divider />

                              {/* Test Coach Questions Display */}
                              <Box>
                                <Text fontSize="lg" fontWeight="semibold" mb={4} color="orange.600">
                                  Sample Coach Questions & Answers:
                                </Text>
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                                  {Object.entries(testCoachQuestions).map(([key, value]) => (
                                    <Box key={key} p={3} bg="orange.50" borderRadius="md" border="1px" borderColor="orange.200">
                                      <VStack spacing={2} align="start">
                                        <Text fontSize="sm" fontWeight="bold" color="orange.700">
                                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                        </Text>
                                        <Text fontSize="sm" color="orange.600" wordBreak="break-word">
                                          {Array.isArray(value) ? value.join(', ') : 
                                           typeof value === 'number' ? `${value}%` : 
                                           value || 'Not provided'}
                                        </Text>
                                      </VStack>
                                    </Box>
                                  ))}
                                </SimpleGrid>
                              </Box>

                              {/* Live Lead Response Viewer */}
                              <Card>
                                <CardHeader>
                                  <Heading size="sm" color="purple.600">Live Lead Response Viewer</Heading>
                                </CardHeader>
                                <CardBody>
                                  <VStack spacing={4} align="stretch">
                                    <FormControl>
                                      <FormLabel>Enter Lead ID to view their responses:</FormLabel>
                                      <HStack>
                                        <Input
                                          placeholder="Lead ID"
                                          value={testLeadId}
                                          onChange={(e) => setTestLeadId(e.target.value)}
                                        />
                                        <Button
                                          colorScheme="purple"
                                          onClick={async () => {
                                            if (!testLeadId.trim()) {
                                              toast('Please enter a Lead ID', 'error');
                                              return;
                                            }
                                            const leadData = await fetchSingleLead(testLeadId.trim());
                                            if (leadData) {
                                              setLeadDetails(leadData);
                                              toast('Lead details fetched successfully!', 'success');
                                            } else {
                                              toast('Lead not found', 'error');
                                            }
                                          }}
                                          isLoading={loadingLeads}
                                        >
                                          Fetch
                                        </Button>
                                      </HStack>
                                    </FormControl>

                                    {leadDetails && (
                                      <Box p={4} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
                                        <VStack spacing={3} align="start">
                                          <Text fontSize="md" fontWeight="bold" color="purple.700">
                                            Lead Details for: {leadDetails.clientQuestions?.fullName || 'Unknown'}
                                          </Text>
                                          
                                          {leadDetails.clientQuestions && (
                                            <Box w="full">
                                              <Text fontSize="sm" fontWeight="semibold" color="purple.600" mb={2}>
                                                Client Questions Response:
                                              </Text>
                                              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                                {Object.entries(leadDetails.clientQuestions).map(([key, value]) => (
                                                  <Box key={key} p={2} bg="white" borderRadius="sm">
                                                    <Text fontSize="xs" fontWeight="bold" color="gray.700">
                                                      {key}:
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.600">
                                                      {value || 'N/A'}
                                                    </Text>
                                                  </Box>
                                                ))}
                                              </SimpleGrid>
                                            </Box>
                                          )}

                                          {leadDetails.questionResponses && (
                                            <Box w="full">
                                              <Text fontSize="sm" fontWeight="semibold" color="purple.600" mb={2}>
                                                Question Responses:
                                              </Text>
                                              <Box p={3} bg="white" borderRadius="sm">
                                                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                                                  {JSON.stringify(leadDetails.questionResponses, null, 2)}
                                                </pre>
                                              </Box>
                                            </Box>
                                          )}
                                        </VStack>
                                      </Box>
                                    )}
                                  </VStack>
                                </CardBody>
                              </Card>
                            </VStack>
                          </CardBody>
                        </Card>
                      </VStack>
                    </TabPanel>

                    {/* Leads Detail Console Panel */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        {/* Leads Search & Filter */}
                        <Card>
                          <CardHeader>
                            <HStack>
                              <Box as={FiUsers} size="20px" color="blue.500" />
                              <Heading size="md" color="blue.600">Leads Detail Console</Heading>
                              <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                                {leads.length} Leads
                              </Badge>
                            </HStack>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              {/* Search Controls */}
                              <HStack spacing={4}>
                                <InputGroup flex="1">
                                  <InputLeftElement>
                                    <SearchIcon color="gray.400" />
                                  </InputLeftElement>
                                  <Input
                                    placeholder="Search leads by name, email, phone..."
                                    value={leadSearchQuery}
                                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                                    bg="white"
                                  />
                                </InputGroup>
                                <Button
                                  colorScheme="blue"
                                  onClick={() => fetchLeadsData()}
                                  isLoading={loadingLeads}
                                  loadingText="Searching..."
                                  leftIcon={<SearchIcon />}
                                >
                                  Search
                                </Button>
                                <Button
                                  colorScheme="green"
                                  onClick={() => fetchLeadsData()}
                                  isLoading={loadingLeads}
                                  loadingText="Loading..."
                                  leftIcon={<FiUsers />}
                                >
                                  Load All
                                </Button>
                              </HStack>

                              {/* Quick Stats */}
                              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                                <Box p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                                  <VStack spacing={1}>
                                    <Text fontSize="sm" color="blue.600" fontWeight="medium">Total Leads</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="blue.700">{leads.length}</Text>
                                  </VStack>
                                </Box>
                                <Box p={3} bg="green.50" borderRadius="md" border="1px" borderColor="green.200">
                                  <VStack spacing={1}>
                                    <Text fontSize="sm" color="green.600" fontWeight="medium">With Questions</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="green.700">
                                      {leads.filter(l => 
                                        (l.clientQuestions && Object.keys(l.clientQuestions).length > 0) || 
                                        (l.coachQuestions && Object.keys(l.coachQuestions).length > 0) || 
                                        l.questionResponses
                                      ).length}
                                    </Text>
                                  </VStack>
                                </Box>
                                <Box p={3} bg="orange.50" borderRadius="md" border="1px" borderColor="orange.200">
                                  <VStack spacing={1}>
                                    <Text fontSize="sm" color="orange.600" fontWeight="medium">Hot Leads</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="orange.700">
                                      {leads.filter(l => l.leadTemperature === 'Hot').length}
                                    </Text>
                                  </VStack>
                                </Box>
                                <Box p={3} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
                                  <VStack spacing={1}>
                                    <Text fontSize="sm" color="purple.600" fontWeight="medium">Qualified</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="purple.700">
                                      {leads.filter(l => l.status === 'Qualified').length}
                                    </Text>
                                  </VStack>
                                </Box>
                              </SimpleGrid>
                            </VStack>
                          </CardBody>
                        </Card>

                        {/* Leads List */}
                        {loadingLeads ? (
                          <Center py={10}>
                            <VStack spacing={4}>
                              <Spinner size="xl" color="blue.500" />
                              <Text>Loading leads...</Text>
                            </VStack>
                          </Center>
                        ) : leads.length > 0 ? (
                          <VStack spacing={4} align="stretch" maxH="600px" overflowY="auto">
                            {leads.map((lead) => (
                              <Card key={lead._id || lead.id} variant="outline" _hover={{ shadow: 'md' }}>
                                <CardBody>
                                  <VStack spacing={4} align="stretch">
                                    {/* Lead Header */}
                                    <HStack justify="space-between" align="start">
                                      <HStack spacing={4}>
                                        <Avatar
                                          name={lead.clientQuestions?.fullName || lead.name || 'Lead'}
                                          size="md"
                                          bg="blue.500"
                                          color="white"
                                        />
                                        <VStack align="start" spacing={1}>
                                          <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                            {lead.clientQuestions?.fullName || lead.name || 'Unknown Lead'}
                                          </Text>
                                          <HStack spacing={4} fontSize="sm" color="gray.600">
                                            <HStack spacing={1}>
                                              <EmailIcon fontSize="xs" />
                                              <Text>{lead.clientQuestions?.email || lead.email || 'No email'}</Text>
                                            </HStack>
                                            {lead.clientQuestions?.whatsappNumber && (
                                              <HStack spacing={1}>
                                                <PhoneIcon fontSize="xs" />
                                                <Text>{lead.clientQuestions.whatsappNumber}</Text>
                                              </HStack>
                                            )}
                                          </HStack>
                                        </VStack>
                                      </HStack>
                                      
                                      <VStack spacing={2} align="end">
                                        <HStack spacing={2}>
                                          {lead.leadTemperature && (
                                            <Badge 
                                              colorScheme={
                                                lead.leadTemperature === 'Hot' ? 'red' :
                                                lead.leadTemperature === 'Warm' ? 'yellow' : 'blue'
                                              }
                                              variant="solid"
                                            >
                                              {lead.leadTemperature}
                                            </Badge>
                                          )}
                                          {lead.status && (
                                            <Badge colorScheme="green" variant="subtle">
                                              {lead.status}
                                            </Badge>
                                          )}
                                        </HStack>
                                        <Text fontSize="xs" color="gray.500">
                                          ID: {lead._id || lead.id}
                                        </Text>
                                      </VStack>
                                    </HStack>

                                    {/* Lead Details */}
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                      {/* Basic Info */}
                                      <Box>
                                        <Text fontSize="sm" fontWeight="semibold" color="blue.600" mb={2}>
                                          Basic Information
                                        </Text>
                                        <VStack spacing={2} align="stretch">
                                          {lead.clientQuestions?.profession && (
                                            <HStack justify="space-between">
                                              <Text fontSize="sm" color="gray.600">Profession:</Text>
                                              <Text fontSize="sm" fontWeight="medium">{lead.clientQuestions.profession}</Text>
                                            </HStack>
                                          )}
                                          {lead.clientQuestions?.cityCountry && (
                                            <HStack justify="space-between">
                                              <Text fontSize="sm" color="gray.600">Location:</Text>
                                              <Text fontSize="sm" fontWeight="medium">{lead.clientQuestions.cityCountry}</Text>
                                            </HStack>
                                          )}
                                          {lead.vslWatchPercentage && (
                                            <HStack justify="space-between">
                                              <Text fontSize="sm" color="gray.600">VSL Watch:</Text>
                                              <Text fontSize="sm" fontWeight="medium">{lead.vslWatchPercentage}%</Text>
                                            </HStack>
                                          )}
                                          {lead.score && (
                                            <HStack justify="space-between">
                                              <Text fontSize="sm" color="gray.600">Score:</Text>
                                              <Text fontSize="sm" fontWeight="medium">{lead.score}/100</Text>
                                            </HStack>
                                          )}
                                        </VStack>
                                      </Box>

                                      {/* Question Responses */}
                                      <Box>
                                        <Text fontSize="sm" fontWeight="semibold" color="green.600" mb={2}>
                                          Question Responses
                                        </Text>
                                        <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
                                          {/* Client Questions */}
                                          {lead.clientQuestions && Object.keys(lead.clientQuestions).length > 0 && (
                                            <Box>
                                              <Text fontSize="xs" fontWeight="bold" color="blue.600" mb={2}>
                                                📝 Client Questions & Answers:
                                              </Text>
                                              <VStack spacing={2} align="stretch">
                                                {Object.entries(lead.clientQuestions).map(([key, value]) => (
                                                  <Box key={key} p={2} bg="blue.50" borderRadius="sm" border="1px" borderColor="blue.200">
                                                    <Text fontSize="xs" fontWeight="bold" color="blue.700">
                                                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                    </Text>
                                                    <Text fontSize="xs" color="blue.600" wordBreak="break-word">
                                                      {typeof value === 'number' ? `${value}%` : value || 'N/A'}
                                                    </Text>
                                                  </Box>
                                                ))}
                                              </VStack>
                                            </Box>
                                          )}

                                          {/* Coach Questions */}
                                          {lead.coachQuestions && Object.keys(lead.coachQuestions).length > 0 && (
                                            <Box>
                                              <Text fontSize="xs" fontWeight="bold" color="orange.600" mb={2}>
                                                🏋️ Coach Questions & Answers:
                                              </Text>
                                              <VStack spacing={2} align="stretch">
                                                {Object.entries(lead.coachQuestions).map(([key, value]) => (
                                                  <Box key={key} p={2} bg="orange.50" borderRadius="sm" border="1px" borderColor="orange.200">
                                                    <Text fontSize="xs" fontWeight="bold" color="orange.700">
                                                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                    </Text>
                                                    <Text fontSize="xs" color="orange.600" wordBreak="break-word">
                                                      {Array.isArray(value) ? value.join(', ') : (typeof value === 'number' ? `${value}%` : value || 'N/A')}
                                                    </Text>
                                                  </Box>
                                                ))}
                                              </VStack>
                                            </Box>
                                          )}

                                          {/* No Questions Available */}
                                          {(!lead.clientQuestions || Object.keys(lead.clientQuestions).length === 0) && 
                                           (!lead.coachQuestions || Object.keys(lead.coachQuestions).length === 0) && (
                                            <Text fontSize="sm" color="gray.500" fontStyle="italic">
                                              No question responses available
                                            </Text>
                                          )}
                                        </VStack>
                                      </Box>
                                    </SimpleGrid>

                                    {/* Actions */}
                                    <HStack justify="space-between">
                                      <HStack spacing={2}>
                                        <Button
                                          size="sm"
                                          colorScheme="blue"
                                          variant="outline"
                                          leftIcon={<ViewIcon />}
                                          onClick={() => {
                                            setTestLeadId(lead._id || lead.id);
                                            setLeadDetails(lead);
                                            toast('Lead details loaded for testing', 'success');
                                          }}
                                        >
                                          Load for Testing
                                        </Button>
                                        <Button
                                          size="sm"
                                          colorScheme="green"
                                          variant="outline"
                                          leftIcon={<FiEye />}
                                          onClick={() => {
                                            setLeadDetails(lead);
                                            toast('Lead details displayed', 'info');
                                          }}
                                        >
                                          View Details
                                        </Button>
                                      </HStack>
                                      
                                      <Text fontSize="xs" color="gray.500">
                                        Created: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Unknown'}
                                      </Text>
                                    </HStack>

                                    {/* Qualification Insights */}
                                    {lead.qualificationInsights && lead.qualificationInsights.length > 0 && (
                                      <Box p={3} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
                                        <Text fontSize="sm" fontWeight="semibold" color="purple.600" mb={2}>
                                          Qualification Insights:
                                        </Text>
                                        <VStack spacing={1} align="stretch">
                                          {lead.qualificationInsights.map((insight, i) => (
                                            <Text key={i} fontSize="xs" color="purple.700">
                                              • {insight}
                                            </Text>
                                          ))}
                                        </VStack>
                                      </Box>
                                    )}
                                  </VStack>
                                </CardBody>
                              </Card>
                            ))}
                          </VStack>
                        ) : (
                          <Center py={10}>
                            <VStack spacing={4}>
                              <Box as={FiUsers} size="48px" color="gray.400" />
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No Leads Found
                                </Text>
                                <Text color="gray.500" textAlign="center">
                                  {leadSearchQuery ? 'Try adjusting your search terms.' : 'Load leads to see them here.'}
                                </Text>
                              </VStack>
                              <Button colorScheme="blue" onClick={() => fetchLeadsData()}>
                                Load All Leads
                              </Button>
                            </VStack>
                          </Center>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* API Results Panel */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {apiTestResults.length > 0 ? (
                          apiTestResults.map((result) => (
                            <Card key={result.id} variant="outline">
                              <CardHeader>
                                <HStack justify="space-between">
                                  <VStack align="start" spacing={1}>
                                    <HStack>
                                      <Badge 
                                        colorScheme={result.success ? 'green' : 'red'} 
                                        variant="solid"
                                      >
                                        {result.status}
                                      </Badge>
                                      <Text fontSize="md" fontWeight="bold">
                                        {result.api}
                                      </Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                      {new Date(result.timestamp).toLocaleString()}
                                    </Text>
                                  </VStack>
                                  <CopyIcon 
                                    cursor="pointer" 
                                    onClick={() => {
                                      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                                      toast('Result copied to clipboard!', 'success');
                                    }}
                                  />
                                </HStack>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={4} align="stretch">
                                  {/* Request Details */}
                                  <Box>
                                    <Text fontSize="sm" fontWeight="semibold" mb={2} color="blue.600">
                                      Request:
                                    </Text>
                                    <Box p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                                      <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap', margin: 0 }}>
                                        {JSON.stringify(result.request, null, 2)}
                                      </pre>
                                    </Box>
                                  </Box>

                                  {/* Response Details */}
                                  <Box>
                                    <Text fontSize="sm" fontWeight="semibold" mb={2} color="green.600">
                                      Response:
                                    </Text>
                                    <Box 
                                      p={3} 
                                      bg={result.success ? "green.50" : "red.50"} 
                                      borderRadius="md" 
                                      border="1px" 
                                      borderColor={result.success ? "green.200" : "red.200"}
                                    >
                                      <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap', margin: 0 }}>
                                        {JSON.stringify(result.response, null, 2)}
                                      </pre>
                                    </Box>
                                  </Box>

                                  {/* Show Insights if available */}
                                  {result.response?.data?.qualificationInsights && (
                                    <Box>
                                      <Text fontSize="sm" fontWeight="semibold" mb={2} color="purple.600">
                                        Lead Qualification Insights:
                                      </Text>
                                      <VStack spacing={2} align="stretch">
                                        {result.response.data.qualificationInsights.map((insight, i) => (
                                          <Box key={i} p={2} bg="purple.50" borderRadius="sm">
                                            <Text fontSize="sm" color="purple.700">• {insight}</Text>
                                          </Box>
                                        ))}
                                        <Box p={2} bg="yellow.50" borderRadius="sm" border="1px" borderColor="yellow.200">
                                          <HStack justify="space-between">
                                            <Text fontSize="sm" fontWeight="bold" color="yellow.800">
                                              Lead Score: {result.response.data.score}/{result.response.data.maxScore || 100}
                                            </Text>
                                            <Badge 
                                              colorScheme={
                                                result.response.data.leadTemperature === 'Hot' ? 'red' :
                                                result.response.data.leadTemperature === 'Warm' ? 'yellow' : 'blue'
                                              }
                                            >
                                              {result.response.data.leadTemperature}
                                            </Badge>
                                          </HStack>
                                        </Box>
                                      </VStack>
                                    </Box>
                                  )}
                                </VStack>
                              </CardBody>
                            </Card>
                          ))
                        ) : (
                          <Center py={10}>
                            <VStack spacing={4}>
                              <Box as={FiBarChart2} size="48px" color="gray.400" />
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                                  No API Test Results Yet
                                </Text>
                                <Text color="gray.500" textAlign="center">
                                  Run some API tests to see the results here.
                                </Text>
                              </VStack>
                            </VStack>
                          </Center>
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </ModalBody>

              <ModalFooter>
                <ButtonGroup spacing={3}>
                  <Button onClick={() => setApiConsoleOpen(false)}>Close</Button>
                  <Button
                    colorScheme="purple"
                    onClick={() => {
                      fetchQuestionTypes();
                      if (leads.length === 0) {
                        fetchLeadsData();
                      }
                    }}
                    isLoading={loadingQuestionTypes || loadingLeads}
                  >
                    Refresh All Data
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={onConfirmModalClose}
            onConfirm={confirmDeleteAppointment}
            title="Delete Appointment"
            message="This action cannot be undone. This will permanently delete the appointment."
            isLoading={loading}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default ComprehensiveCoachCalendar;
