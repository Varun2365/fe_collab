import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Flex, Text, Button, Input, InputGroup, InputLeftElement, 
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Avatar,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, FormHelperText, Select, Textarea, Switch, useDisclosure,
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
  MenuDivider, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Code, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton
} from '@chakra-ui/react';
import {
  SearchIcon, AddIcon, EditIcon, DeleteIcon, EmailIcon, PhoneIcon, 
  ViewIcon, DownloadIcon, ChevronDownIcon, StarIcon,
  CalendarIcon, InfoIcon, CheckCircleIcon, WarningIcon, TimeIcon,
  ChatIcon, ExternalLinkIcon, SettingsIcon, CopyIcon,
} from '@chakra-ui/icons';
import { 
  FiFileText, FiUser, FiMail, FiPhone, FiCalendar, FiFilter, FiUpload,
  FiEye, FiEdit, FiTrash2, FiCopy, FiUsers, FiMoreVertical, 
  FiPlay, FiPause, FiBarChart2, FiTrendingUp, FiTarget, FiGlobe, FiWifi,
  FiZap, FiActivity, FiClock, FiBell, FiCode, FiDatabase, FiShield,
  FiAlertTriangle, FiInfo, FiExternalLink, FiSave, FiX, FiXCircle,
  FiRefreshCw, FiPlus, FiSettings
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getCoachId, getToken, isAuthenticated, debugAuthState } from '../../utils/authUtils';
import { API_BASE_URL as BASE_URL } from '../../config/apiConfig';
import GraphAutomationBuilder from './GraphAutomationBuilder';

// Graph Builder Drawer Component with dynamic sidebar width
const GraphBuilderDrawer = ({ isOpen, onClose, graphBuilderRule, handleGraphBuilderSave, eventsActions, builderResources, viewMode = false }) => {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      if (event.detail) {
        if (event.detail.width) {
          const widthStr = event.detail.width;
          const width = widthStr === '80px' ? 80 : (widthStr === '300px' ? 300 : 320);
          setSidebarWidth(width);
        } else if (event.detail.collapsed !== undefined) {
          // Handle collapsed state
          const width = event.detail.collapsed ? 80 : 320;
          setSidebarWidth(width);
        }
      }
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    // Get initial sidebar state - check if sidebar is collapsed
    const checkInitialWidth = () => {
      // Try to get from event or check sidebar state
      const sidebarElement = document.querySelector('[data-sidebar]');
      if (sidebarElement) {
        const computedWidth = window.getComputedStyle(sidebarElement).width;
        const width = parseInt(computedWidth) || 320;
        setSidebarWidth(width);
      }
    };
    
    // Check after a short delay to ensure DOM is ready
    setTimeout(checkInitialWidth, 100);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);
  
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="full"
    >
      <DrawerOverlay />
      <DrawerContent 
        maxW={sidebarWidth === 80 ? '100vw' : `calc(100vw - ${sidebarWidth}px)`}
        ml={sidebarWidth === 80 ? '0' : `${sidebarWidth}px`}
        w={sidebarWidth === 80 ? '100vw' : `calc(100vw - ${sidebarWidth}px)`}
        sx={{
          transition: 'margin-left 0.1s cubic-bezier(0.4, 0, 0.2, 1), width 0.1s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (max-width: 1199px)': {
            maxW: sidebarWidth === 80 ? '100vw' : (sidebarWidth === 80 ? 'calc(100vw - 80px)' : 'calc(100vw - 300px)'),
            ml: sidebarWidth === 80 ? '0' : (sidebarWidth === 80 ? '80px' : '300px'),
            w: sidebarWidth === 80 ? '100vw' : (sidebarWidth === 80 ? 'calc(100vw - 80px)' : 'calc(100vw - 300px)'),
          },
          '@media (max-width: 767px)': {
            maxW: '100vw',
            ml: '0',
            w: '100vw',
          }
        }}
      >
        <DrawerCloseButton zIndex={20} />
        <DrawerBody p={0} overflow="hidden">
          <GraphAutomationBuilder
            rule={graphBuilderRule}
            onSave={handleGraphBuilderSave}
            onClose={onClose}
            eventsActions={eventsActions}
            builderResources={builderResources}
            viewMode={viewMode || graphBuilderRule?.viewMode || false}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

// --- API CONFIGURATION ---
// API_BASE_URL automatically switches between:
// - Development: http://localhost:8080/api
// - Production: https://api.funnelseye.com/api
const API_BASE_URL = `${BASE_URL}/api`;

const shouldHideBillingTrigger = (event) => {
  const value =
    typeof event === 'string'
      ? event
      : event?.value || event?.label || event?.name || '';
  if (!value) return false;
  const normalized = value.toLowerCase();
  return (
    normalized.includes('invoice') ||
    normalized.includes('subscription') ||
    normalized.includes('refund')
  );
};

const sanitizeEventsActions = (raw = {}) => ({
  ...raw,
  events: (raw.events || []).filter((event) => !shouldHideBillingTrigger(event)),
});

// --- BEAUTIFUL SKELETON COMPONENTS ---
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

        {/* Professional Automation Layout Skeleton */}
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
                <Skeleton height="32px" width="300px" borderRadius="lg" />
                <Skeleton height="16px" width="400px" borderRadius="md" />
              </VStack>
              <HStack spacing={3}>
                <Skeleton height="40px" width="120px" borderRadius="lg" />
                <Skeleton height="40px" width="150px" borderRadius="xl" />
              </HStack>
            </Flex>
          </CardHeader>
          
          <CardBody pt={0} px={0}>
            {/* Automation Rules Table Skeleton */}
            <TableContainer w="full" overflowX="auto" borderRadius="lg" border="1px" borderColor="gray.100">
              <Table variant="simple" size="md" w="full">
                <Thead>
                  <Tr bg="gray.50">
                    {[...Array(6)].map((_, i) => (
                      <Th key={i} px={{ base: 3, md: 6 }} py={{ base: 3, md: 5 }}>
                        <Skeleton height="16px" width="100px" borderRadius="md" />
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <Tr key={rowIndex} borderBottom="1px" borderColor="gray.100">
                      {[...Array(6)].map((_, cellIndex) => (
                        <Td key={cellIndex} px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                          {cellIndex === 0 ? (
                            <VStack align="start" spacing={2}>
                              <Skeleton height="18px" width="200px" borderRadius="md" />
                              <Skeleton height="14px" width="150px" borderRadius="sm" />
                            </VStack>
                          ) : cellIndex === 1 ? (
                            <Skeleton height="24px" width="120px" borderRadius="full" />
                          ) : cellIndex === 2 ? (
                            <VStack spacing={1} align="start">
                              <Skeleton height="16px" width="80px" borderRadius="sm" />
                              <HStack spacing={1}>
                                <Skeleton height="20px" width="60px" borderRadius="full" />
                                <Skeleton height="20px" width="70px" borderRadius="full" />
                              </HStack>
                            </VStack>
                          ) : cellIndex === 3 ? (
                            <Skeleton height="24px" width="80px" borderRadius="full" />
                          ) : cellIndex === 4 ? (
                            <VStack spacing={0.5} align="start">
                              <Skeleton height="14px" width="120px" borderRadius="sm" />
                              <Skeleton height="12px" width="80px" borderRadius="sm" />
                            </VStack>
                          ) : (
                            <HStack spacing={1} justify="center">
                              {[...Array(3)].map((_, btnIndex) => (
                                <Skeleton key={btnIndex} height="32px" width="32px" borderRadius="md" />
                              ))}
                            </HStack>
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
              Loading automation rules...
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

// --- MINIMAL STATS CARDS ---
const StatsCard = ({ title, value, icon, color = "blue", trend, isLoading = false }) => {
  const bgColor = useColorModeValue(`${color}.50`, `${color}.900`);
  const borderColor = useColorModeValue(`${color}.200`, `${color}.700`);
  const iconBg = useColorModeValue(`${color}.100`, `${color}.800`);
  const iconColor = `${color}.600`;
  const textColor = useColorModeValue(`${color}.700`, `${color}.200`);
  const valueColor = useColorModeValue(`${color}.800`, `${color}.100`);
  
  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={5}
      _hover={{ 
        borderColor: `${color}.300`, 
        transition: 'all 0.2s',
        boxShadow: 'sm',
        transform: 'translateY(-2px)'
      }}
      transition="all 0.2s"
    >
      <HStack spacing={4} align="center">
        <Box
          p={2.5}
          bg={iconBg}
          borderRadius="md"
          color={iconColor}
        >
          {icon}
        </Box>
        <VStack align="start" spacing={0} flex={1}>
          <Text fontSize="xs" color={textColor} fontWeight="500" letterSpacing="0.5px">
            {title}
          </Text>
          {isLoading ? (
            <Skeleton height="32px" width="60px" mt={1} />
          ) : (
            <Text fontSize="2xl" fontWeight="600" color={valueColor} mt={1}>
              {typeof value === 'number' ? value : 0}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ status, isActive }) => {
  if (isActive) {
    return (
      <Badge 
        colorScheme="green" 
        variant="subtle" 
        borderRadius="md" 
        px={2.5}
        py={1}
        fontSize="xs"
        fontWeight="500"
      >
        Active
      </Badge>
    );
  }
  return (
    <Badge 
      colorScheme="gray" 
      variant="subtle" 
      borderRadius="md" 
      px={2.5}
      py={1}
      fontSize="xs"
      fontWeight="500"
    >
      Inactive
    </Badge>
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
                <Text color="orange.700" fontSize={{ base: "xs", md: "sm" }}>
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
            Delete Rule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// --- TEMPLATE VARIABLES HELPER ---
const getAvailableVariables = (triggerEvent) => {
  const generalVariables = [
    { path: '{{currentDate}}', description: 'Current date (YYYY-MM-DD)' },
    { path: '{{currentTime}}', description: 'Current time (HH:MM:SS)' },
    { path: '{{currentDateTime}}', description: 'Current date and time' },
    { path: '{{timestamp}}', description: 'Unix timestamp' }
  ];

  const leadVariables = [
    { path: '{{lead.name}}', description: 'Lead full name' },
    { path: '{{lead.firstName}}', description: 'Lead first name' },
    { path: '{{lead.lastName}}', description: 'Lead last name' },
    { path: '{{lead.email}}', description: 'Lead email address' },
    { path: '{{lead.phone}}', description: 'Lead phone number' },
    { path: '{{lead.status}}', description: 'Lead status' },
    { path: '{{lead.temperature}}', description: 'Lead temperature (Hot/Warm/Cold)' },
    { path: '{{lead.source}}', description: 'Lead source' },
    { path: '{{lead.score}}', description: 'Lead score' }
  ];

  const coachVariables = [
    { path: '{{coach.name}}', description: 'Coach name' },
    { path: '{{coach.email}}', description: 'Coach email' }
  ];

  const staffVariables = [
    { path: '{{assignedStaff.name}}', description: 'Assigned staff name' },
    { path: '{{assignedStaff.email}}', description: 'Assigned staff email' }
  ];

  const appointmentVariables = [
    { path: '{{appointment.startTime}}', description: 'Appointment start time' },
    { path: '{{appointment.duration}}', description: 'Appointment duration (minutes)' },
    { path: '{{appointment.type}}', description: 'Appointment type' }
  ];

  const paymentVariables = [
    { path: '{{payment.amount}}', description: 'Payment amount' },
    { path: '{{payment.currency}}', description: 'Payment currency' },
    { path: '{{payment.status}}', description: 'Payment status' },
    { path: '{{payment.transactionId}}', description: 'Transaction ID' }
  ];

  let eventVariables = [...generalVariables, ...coachVariables];

  // Add variables based on trigger event
  if (triggerEvent && triggerEvent.includes('lead')) {
    eventVariables = [...eventVariables, ...leadVariables, ...staffVariables];
  }
  if (triggerEvent && triggerEvent.includes('appointment')) {
    eventVariables = [...eventVariables, ...leadVariables, ...appointmentVariables];
  }
  if (triggerEvent && triggerEvent.includes('payment')) {
    eventVariables = [...eventVariables, ...leadVariables, ...paymentVariables];
  }
  if (triggerEvent && triggerEvent.includes('task')) {
    eventVariables = [...eventVariables, ...leadVariables];
  }

  return eventVariables;
};

// --- ACTION CONFIG FORM COMPONENT ---
const ActionConfigForm = ({ 
  action, 
  onChange, 
  triggerEvent, 
  builderResources,
  onClose 
}) => {
  const [localConfig, setLocalConfig] = useState(action.config || {});
  const [showVariables, setShowVariables] = useState(false);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [variableSuggestions, setVariableSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const availableVariables = getAvailableVariables(triggerEvent);

  const updateConfig = (field, value) => {
    const updated = { ...localConfig, [field]: value };
    setLocalConfig(updated);
    onChange({ ...action, config: updated });
  };

  const insertVariable = (variable, fieldName) => {
    const currentValue = localConfig[fieldName] || '';
    const textarea = document.getElementById(`action-config-${fieldName}`);
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
      updateConfig(fieldName, newValue);
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
      updateConfig(fieldName, currentValue + variable);
    }
    setShowVariables(false);
  };

  const handleVariableInput = (fieldName, value) => {
    updateConfig(fieldName, value);
    // Show suggestions when user types {{
    if (value.includes('{{')) {
      const searchTerm = value.substring(value.lastIndexOf('{{') + 2).toLowerCase();
      const filtered = availableVariables.filter(v => 
        v.path.toLowerCase().includes(searchTerm) || 
        v.description.toLowerCase().includes(searchTerm)
      );
      setVariableSuggestions(filtered);
      setActiveField(fieldName);
      setShowVariables(true);
    } else {
      setShowVariables(false);
    }
  };

  const renderActionFields = () => {
    const actionType = action.type;
    
    switch (actionType) {
      case 'add_note_to_lead':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>
                Note Content
                <Tooltip label="Click info icon to see available variables">
                  <IconButton
                    icon={<FiInfo />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => setShowVariables(!showVariables)}
                  />
                </Tooltip>
              </FormLabel>
              <Textarea
                id={`action-config-note`}
                value={localConfig.note || ''}
                onChange={(e) => handleVariableInput('note', e.target.value)}
                placeholder="Enter note content. Use {{lead.name}} for dynamic values"
                rows={4}
              />
              {showVariables && activeField === 'note' && (
                <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text fontSize="xs" fontWeight="bold" mb={2}>Available Variables:</Text>
                  <VStack align="stretch" spacing={1} maxH="200px" overflowY="auto">
                    {variableSuggestions.length > 0 ? variableSuggestions.map((v, i) => (
                      <Button
                        key={i}
                        size="xs"
                        variant="ghost"
                        justifyContent="flex-start"
                        onClick={() => insertVariable(v.path, 'note')}
                        leftIcon={<Code fontSize="xs" />}
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" fontWeight="bold">{v.path}</Text>
                          <Text fontSize="xs" color="gray.600">{v.description}</Text>
                        </VStack>
                      </Button>
                    )) : availableVariables.map((v, i) => (
                      <Button
                        key={i}
                        size="xs"
                        variant="ghost"
                        justifyContent="flex-start"
                        onClick={() => insertVariable(v.path, 'note')}
                        leftIcon={<Code fontSize="xs" />}
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" fontWeight="bold">{v.path}</Text>
                          <Text fontSize="xs" color="gray.600">{v.description}</Text>
                        </VStack>
                      </Button>
                    ))}
                  </VStack>
                </Box>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Note Type</FormLabel>
              <Select
                value={localConfig.noteType || 'general'}
                onChange={(e) => updateConfig('noteType', e.target.value)}
              >
                <option value="general">General</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="followup">Follow-up</option>
                <option value="important">Important</option>
              </Select>
            </FormControl>
          </VStack>
        );

      case 'create_task':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Task Name</FormLabel>
              <Input
                id={`action-config-name`}
                value={localConfig.name || ''}
                onChange={(e) => handleVariableInput('name', e.target.value)}
                placeholder="e.g., Follow up with {{lead.name}}"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                id={`action-config-description`}
                value={localConfig.description || ''}
                onChange={(e) => handleVariableInput('description', e.target.value)}
                placeholder="Task description"
                rows={3}
              />
            </FormControl>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={localConfig.priority || 'MEDIUM'}
                  onChange={(e) => updateConfig('priority', e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Stage</FormLabel>
                <Select
                  value={localConfig.stage || 'LEAD_GENERATION'}
                  onChange={(e) => updateConfig('stage', e.target.value)}
                >
                  <option value="LEAD_GENERATION">Lead Generation</option>
                  <option value="LEAD_QUALIFICATION">Lead Qualification</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="CLOSING">Closing</option>
                  <option value="ONBOARDING">Onboarding</option>
                </Select>
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel>Assign To</FormLabel>
              <Select
                value={localConfig.assignedTo || ''}
                onChange={(e) => updateConfig('assignedTo', e.target.value)}
                placeholder="Select staff (optional, defaults to coach)"
              >
                <option value="">Coach (Me)</option>
                {builderResources.staff.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Due Date Offset (days)</FormLabel>
              <NumberInput
                value={localConfig.dueDateOffset || 7}
                onChange={(value) => updateConfig('dueDateOffset', parseInt(value) || 7)}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>Days from now (e.g., 7 = 7 days from trigger)</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Estimated Hours</FormLabel>
              <NumberInput
                value={localConfig.estimatedHours || 1}
                onChange={(value) => updateConfig('estimatedHours', parseFloat(value) || 1)}
                min={0.5}
                step={0.5}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        );

      case 'send_whatsapp_message':
      case 'send_sms_message':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Message Template</FormLabel>
              <Select
                value={localConfig.templateId || ''}
                onChange={(e) => {
                  updateConfig('templateId', e.target.value);
                  // Optionally load template content
                }}
                placeholder="Select template (optional)"
              >
                <option value="">Custom Message</option>
                {builderResources.messageTemplates
                  .filter(t => t.type === (actionType === 'send_whatsapp_message' ? 'whatsapp' : 'sms'))
                  .map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>
                Message
                <Tooltip label="Click info icon to see available variables">
                  <IconButton
                    icon={<FiInfo />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => setShowVariables(!showVariables)}
                  />
                </Tooltip>
              </FormLabel>
              <Textarea
                id={`action-config-message`}
                value={localConfig.message || ''}
                onChange={(e) => handleVariableInput('message', e.target.value)}
                placeholder="Enter message. Use {{lead.name}} for dynamic values"
                rows={6}
              />
              {showVariables && activeField === 'message' && (
                <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text fontSize="xs" fontWeight="bold" mb={2}>Available Variables:</Text>
                  <VStack align="stretch" spacing={1} maxH="200px" overflowY="auto">
                    {(variableSuggestions.length > 0 ? variableSuggestions : availableVariables).map((v, i) => (
                      <Button
                        key={i}
                        size="xs"
                        variant="ghost"
                        justifyContent="flex-start"
                        onClick={() => insertVariable(v.path, 'message')}
                        leftIcon={<Code fontSize="xs" />}
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" fontWeight="bold">{v.path}</Text>
                          <Text fontSize="xs" color="gray.600">{v.description}</Text>
                        </VStack>
                      </Button>
                    ))}
                  </VStack>
                </Box>
              )}
            </FormControl>
          </VStack>
        );

      case 'send_email_message':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Email Template</FormLabel>
              <Select
                value={localConfig.templateId || ''}
                onChange={(e) => updateConfig('templateId', e.target.value)}
                placeholder="Select template (optional)"
              >
                <option value="">Custom Email</option>
                {builderResources.messageTemplates
                  .filter(t => t.type === 'email')
                  .map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Input
                id={`action-config-subject`}
                value={localConfig.subject || ''}
                onChange={(e) => handleVariableInput('subject', e.target.value)}
                placeholder="Email subject"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>
                Body
                <Tooltip label="Click info icon to see available variables">
                  <IconButton
                    icon={<FiInfo />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => setShowVariables(!showVariables)}
                  />
                </Tooltip>
              </FormLabel>
              <Textarea
                id={`action-config-body`}
                value={localConfig.body || ''}
                onChange={(e) => handleVariableInput('body', e.target.value)}
                placeholder="Email body. Use {{lead.name}} for dynamic values"
                rows={8}
              />
              {showVariables && activeField === 'body' && (
                <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                  <Text fontSize="xs" fontWeight="bold" mb={2}>Available Variables:</Text>
                  <VStack align="stretch" spacing={1} maxH="200px" overflowY="auto">
                    {(variableSuggestions.length > 0 ? variableSuggestions : availableVariables).map((v, i) => (
                      <Button
                        key={i}
                        size="xs"
                        variant="ghost"
                        justifyContent="flex-start"
                        onClick={() => insertVariable(v.path, 'body')}
                        leftIcon={<Code fontSize="xs" />}
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" fontWeight="bold">{v.path}</Text>
                          <Text fontSize="xs" color="gray.600">{v.description}</Text>
                        </VStack>
                      </Button>
                    ))}
                  </VStack>
                </Box>
              )}
            </FormControl>
          </VStack>
        );

      case 'assign_lead_to_staff':
        return (
          <FormControl isRequired>
            <FormLabel>Assign To Staff</FormLabel>
            <Select
              value={localConfig.staffId || ''}
              onChange={(e) => updateConfig('staffId', e.target.value)}
              placeholder="Select staff member"
            >
              {builderResources.staff.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </Select>
          </FormControl>
        );

      case 'update_lead_status':
        return (
          <FormControl isRequired>
            <FormLabel>New Status</FormLabel>
            <Select
              value={localConfig.status || ''}
              onChange={(e) => updateConfig('status', e.target.value)}
              placeholder="Select status"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
            </Select>
          </FormControl>
        );

      case 'add_lead_tag':
        return (
          <FormControl isRequired>
            <FormLabel>Tag Name</FormLabel>
            <Input
              value={localConfig.tag || ''}
              onChange={(e) => updateConfig('tag', e.target.value)}
              placeholder="Enter tag name"
            />
          </FormControl>
        );

      case 'update_lead_score':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Score</FormLabel>
              <NumberInput
                value={localConfig.score || 0}
                onChange={(value) => updateConfig('score', parseInt(value) || 0)}
                min={0}
                max={100}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Reason</FormLabel>
              <Input
                value={localConfig.reason || ''}
                onChange={(e) => updateConfig('reason', e.target.value)}
                placeholder="Reason for score update"
              />
            </FormControl>
          </VStack>
        );

      case 'add_to_funnel':
      case 'move_to_funnel_stage':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Funnel</FormLabel>
              <Select
                value={localConfig.funnelId || ''}
                onChange={(e) => {
                  updateConfig('funnelId', e.target.value);
                  updateConfig('stageId', ''); // Reset stage when funnel changes
                }}
                placeholder="Select funnel"
              >
                {builderResources.funnels.map(funnel => (
                  <option key={funnel.id} value={funnel.id}>
                    {funnel.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {localConfig.funnelId && (
              <FormControl isRequired>
                <FormLabel>Stage</FormLabel>
                <Select
                  value={localConfig.stageId || ''}
                  onChange={(e) => updateConfig('stageId', e.target.value)}
                  placeholder="Select stage"
                >
                  {builderResources.funnels
                    .find(f => f.id === localConfig.funnelId)
                    ?.stages?.map(stage => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            )}
          </VStack>
        );

      case 'wait_delay':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Delay (Days)</FormLabel>
              <NumberInput
                value={localConfig.delayDays || 0}
                onChange={(value) => updateConfig('delayDays', parseInt(value) || 0)}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Delay (Hours)</FormLabel>
              <NumberInput
                value={localConfig.delayHours || 0}
                onChange={(value) => updateConfig('delayHours', parseInt(value) || 0)}
                min={0}
                max={23}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Delay (Minutes)</FormLabel>
              <NumberInput
                value={localConfig.delayMinutes || 0}
                onChange={(value) => updateConfig('delayMinutes', parseInt(value) || 0)}
                min={0}
                max={59}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        );

      default:
        return (
          <Alert status="info">
            <AlertIcon />
            <AlertDescription>
              Configuration fields for this action type will be available soon.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="sm">Configure Action: {getActionDisplayNameHelper(action.type)}</Heading>
          <HStack spacing={2}>
            <Popover isOpen={showVariablesModal} onClose={() => setShowVariablesModal(false)}>
              <PopoverTrigger>
                <IconButton
                  icon={<FiInfo />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  aria-label="Show all variables"
                  onClick={() => setShowVariablesModal(true)}
                />
              </PopoverTrigger>
              <PopoverContent maxW="400px">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold">Available Variables</PopoverHeader>
                <PopoverBody maxH="400px" overflowY="auto">
                  <VStack align="stretch" spacing={2}>
                    {availableVariables.map((v, i) => (
                      <Box key={i} p={2} bg="blue.50" borderRadius="md">
                        <Code fontSize="sm" colorScheme="blue">{v.path}</Code>
                        <Text fontSize="xs" color="gray.600" mt={1}>{v.description}</Text>
                      </Box>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <IconButton
              icon={<FiX />}
              size="sm"
              variant="ghost"
              onClick={onClose}
            />
          </HStack>
        </HStack>
        {renderActionFields()}
        <HStack justify="flex-end" mt={4}>
          <Button size="sm" onClick={onClose}>Done</Button>
        </HStack>
      </VStack>
    </>
  );
};

// Helper function to get action display name (accessible to all components)
const getActionDisplayNameHelper = (actionType) => {
  const actionMap = {
    'send_whatsapp_message': 'Send WhatsApp Message',
    'add_lead_tag': 'Add Lead Tag',
    'create_calendar_event': 'Create Calendar Event',
    'add_note_to_lead': 'Add Note to Lead',
    'move_to_funnel_stage': 'Move to Funnel Stage',
    'create_invoice': 'Create Invoice',
    'send_email_message': 'Send Email Message',
    'create_task': 'Create Task',
    'update_lead_status': 'Update Lead Status',
    'assign_lead_to_staff': 'Assign Lead to Staff',
    'update_lead_score': 'Update Lead Score',
    'send_sms_message': 'Send SMS Message',
    'wait_delay': 'Wait/Delay',
    'add_to_funnel': 'Add to Funnel',
    'remove_from_funnel': 'Remove from Funnel',
    'remove_lead_tag': 'Remove Lead Tag',
    'create_deal': 'Create Deal',
    'update_lead_field': 'Update Lead Field',
    'create_multiple_tasks': 'Create Multiple Tasks',
    'create_zoom_meeting': 'Create Zoom Meeting',
    'create_invoice': 'Create Invoice',
    'issue_refund': 'Issue Refund',
    'call_webhook': 'Call Webhook',
    'trigger_another_automation': 'Trigger Another Automation'
  };
  return actionMap[actionType] || actionType;
};

// --- MAIN COMPONENT ---
const AutomationDashboard = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [automationRules, setAutomationRules] = useState([]);
  const [eventsActions, setEventsActions] = useState({ events: [], actions: [] });
  const [stats, setStats] = useState({
    totalRules: 0,
    activeRules: 0,
    inactiveRules: 0,
    executedToday: 0
  });

  // Modal states
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isGraphBuilderOpen, onOpen: onGraphBuilderOpen, onClose: onGraphBuilderClose } = useDisclosure();
  
  // Graph builder state
  const [graphBuilderRule, setGraphBuilderRule] = useState(null);
  const [useGraphBuilder, setUseGraphBuilder] = useState(false);

  // Form states
  const [selectedRule, setSelectedRule] = useState(null);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    coachId: '',
    triggerEvent: '',
    triggerConditions: [],
    triggerConditionLogic: 'AND',
    actions: [],
    isActive: true
  });
  const [newAction, setNewAction] = useState({
    type: '',
    config: {},
    delay: 0,
    order: 0
  });
  const [editingActionIndex, setEditingActionIndex] = useState(null);
  const [builderResources, setBuilderResources] = useState({
    staff: [],
    funnels: [],
    messageTemplates: [],
    automationRules: []
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Redux state
  const authState = useSelector((state) => state.auth);
  const token = getToken(authState);
  const coachId = getCoachId(authState);

  // Custom toast
  const toast = useCustomToast();

  // Get auth headers
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !coachId) { 
        setError("Authentication details are missing."); 
        setLoading(false); 
        return; 
      }
      setLoading(true); 
      setError(null);
      try {
        // Fetch automation rules
        const rulesResponse = await axios.get(`${API_BASE_URL}/automation-rules`, { 
          headers: getAuthHeaders() 
        });
        setAutomationRules(rulesResponse.data.data || rulesResponse.data || []);

        // Fetch events and actions
        try {
          const eventsResponse = await axios.get(`${API_BASE_URL}/automation-rules/events-actions`, { 
            headers: getAuthHeaders() 
          });
          const rawEventsActions = eventsResponse.data.data || eventsResponse.data || { events: [], actions: [] };
          setEventsActions(sanitizeEventsActions(rawEventsActions));
          
          // Fetch builder resources (staff, funnels, templates)
          try {
            const resourcesResponse = await axios.get(`${API_BASE_URL}/automation-rules/builder-resources`, {
              headers: getAuthHeaders()
            });
            setBuilderResources(resourcesResponse.data.data || {
              staff: [],
              funnels: [],
              messageTemplates: [],
              automationRules: []
            });
          } catch (resourcesErr) {
            console.warn("Could not fetch builder resources:", resourcesErr);
          }
        } catch (eventsErr) {
          console.warn("Could not fetch events and actions, using fallback data:", eventsErr);
          // Fallback data
          setEventsActions(sanitizeEventsActions({
            events: [
              'lead_created',
              'appointment_booked', 
              'payment_successful',
              'task_completed',
              'email_opened',
              'form_submitted'
            ],
            actions: [
              'send_whatsapp_message',
              'add_lead_tag',
              'create_calendar_event',
              'add_note_to_lead',
              'move_to_funnel_stage',
              'create_invoice',
              'send_email',
              'create_task',
              'update_lead_status'
            ]
          }));
        }

        // Calculate stats
        const rules = rulesResponse.data.data || rulesResponse.data || [];
        setStats({
          totalRules: Number(rules.length) || 0,
          activeRules: Number(rules.filter(r => r.isActive).length) || 0,
          inactiveRules: Number(rules.filter(r => !r.isActive).length) || 0,
          executedToday: Number(rules.filter(r => {
            const today = new Date().toDateString();
            return r.lastExecutedAt && new Date(r.lastExecutedAt).toDateString() === today;
          }).length) || 0
        });

      } catch (err) {
        console.error("Error fetching automation data:", err);
        const errorMsg = err.response?.data?.message || "Failed to fetch automation data. Please try again.";
        setError(errorMsg);
        toast(errorMsg, 'error');
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchData();
  }, [token, coachId, toast]);

  // Action handlers
  const openCreateModal = () => {
    setGraphBuilderRule({
      name: '',
      description: '',
      coachId: coachId,
      workflowType: 'graph',
      nodes: [],
      edges: [],
      isActive: true
    });
    setUseGraphBuilder(true);
    onGraphBuilderOpen();
  };

  const [viewMode, setViewMode] = useState(false);
  
  const openEditGraphModal = (rule, isViewMode = false) => {
    setViewMode(isViewMode);
    // Ensure rule has all necessary fields for graph editor
    const ruleForEditor = {
      ...rule,
      viewMode: isViewMode,
      workflowType: rule.workflowType || (rule.nodes && rule.nodes.length > 0 ? 'graph' : 'legacy'),
      nodes: rule.nodes || [],
      edges: rule.edges || [],
      viewport: rule.viewport || { x: 0, y: 0, zoom: 1 },
    };
    setGraphBuilderRule(ruleForEditor);
    setUseGraphBuilder(true);
    onGraphBuilderOpen();
  };

  const handleGraphBuilderSave = async (workflowData) => {
    try {
      let response;
      if (graphBuilderRule?._id) {
        // Update existing rule
        response = await axios.put(
          `${API_BASE_URL}/automation-rules/${graphBuilderRule._id}`,
          workflowData,
          { headers: getAuthHeaders() }
        );
        
        // Handle response format
        const updatedRule = response.data?.data || response.data;
        if (updatedRule) {
          toast('Automation rule updated successfully!', 'success');
          
          // Update the rule in local state
          setAutomationRules(prevRules => 
            prevRules.map(r => {
              if (r._id === graphBuilderRule._id || r._id?.toString() === graphBuilderRule._id?.toString()) {
                return updatedRule;
              }
              return r;
            })
          );
          
          // Update stats if status changed
          if (updatedRule.isActive !== graphBuilderRule.isActive) {
            setStats(prevStats => ({
              ...prevStats,
              activeRules: updatedRule.isActive 
                ? prevStats.activeRules + 1 
                : Math.max(0, prevStats.activeRules - 1),
              inactiveRules: !updatedRule.isActive 
                ? prevStats.inactiveRules + 1 
                : Math.max(0, prevStats.inactiveRules - 1),
            }));
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        // Create new rule
        response = await axios.post(
          `${API_BASE_URL}/automation-rules`,
          workflowData,
          { headers: getAuthHeaders() }
        );
        
        // Handle response format
        const newRule = response.data?.data || response.data;
        if (newRule) {
          toast('Automation rule created successfully!', 'success');
          
          // Add the new rule to local state
          setAutomationRules(prevRules => [newRule, ...prevRules]);
          
          // Update stats
          setStats(prevStats => ({
            ...prevStats,
            totalRules: prevStats.totalRules + 1,
            activeRules: newRule.isActive ? prevStats.activeRules + 1 : prevStats.activeRules,
            inactiveRules: !newRule.isActive ? prevStats.inactiveRules + 1 : prevStats.inactiveRules,
          }));
        } else {
          throw new Error('Invalid response from server');
        }
      }
      
      onGraphBuilderClose();
      setGraphBuilderRule(null);
    } catch (err) {
      console.error("Error saving graph workflow:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save automation rule';
      toast(errorMsg, 'error');
    }
  };

  const openEditModal = (rule) => {
    setSelectedRule(rule);
    setNewRule({
      name: rule.name,
      coachId: rule.coachId,
      triggerEvent: rule.triggerEvent,
      actions: rule.actions || []
    });
    onEditOpen();
  };

  const openViewModal = (rule) => {
    setSelectedRule(rule);
    onViewOpen();
  };

  const openDeleteModal = (rule) => {
    setRuleToDelete(rule);
    onDeleteOpen();
  };

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.triggerEvent || newRule.actions.length === 0) {
      toast('Please fill in all required fields (name, trigger event, and at least one action)', 'error');
      return;
    }

    // Validate that all actions have required config fields
    for (const action of newRule.actions) {
      if (!action.type) {
        toast('All actions must have a type selected', 'error');
        return;
      }
      // Basic validation - can be expanded per action type
      if (action.type === 'add_note_to_lead' && !action.config.note) {
        toast('Note content is required for "Add Note to Lead" action', 'error');
        return;
      }
      if (action.type === 'create_task' && !action.config.name) {
        toast('Task name is required for "Create Task" action', 'error');
        return;
      }
      if (action.type === 'send_whatsapp_message' && !action.config.message) {
        toast('Message is required for "Send WhatsApp Message" action', 'error');
        return;
      }
      if (action.type === 'send_email_message' && (!action.config.subject || !action.config.body)) {
        toast('Subject and body are required for "Send Email Message" action', 'error');
        return;
      }
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/automation-rules`, newRule, { 
        headers: getAuthHeaders() 
      });
      toast('Automation rule created successfully!', 'success');
      onCreateClose();
      setNewRule({ 
        name: '', 
        description: '',
        coachId: coachId, 
        triggerEvent: '', 
        triggerConditions: [],
        triggerConditionLogic: 'AND',
        actions: [],
        isActive: true
      });
      setNewAction({ type: '', config: {}, delay: 0, order: 0 });
      setEditingActionIndex(null);
      // Refresh data
      window.location.reload();
    } catch (err) {
      console.error("Error creating rule:", err);
      const errorMsg = err.response?.data?.message || 'Failed to create automation rule';
      toast(errorMsg, 'error');
    }
  };

  const handleUpdateRule = async () => {
    if (!selectedRule) return;

    try {
      await axios.put(`${API_BASE_URL}/automation-rules/${selectedRule._id}`, newRule, { 
        headers: getAuthHeaders() 
      });
      toast('Automation rule updated successfully!');
      onEditClose();
      setSelectedRule(null);
      // Refresh data
      window.location.reload();
    } catch (err) {
      console.error("Error updating rule:", err);
      toast('Failed to update automation rule', 'error');
    }
  };

  const handleDeleteRule = async () => {
    if (!ruleToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/automation-rules/${ruleToDelete._id}`, { 
        headers: getAuthHeaders() 
      });
      toast('Automation rule deleted successfully!');
      onDeleteClose();
      setRuleToDelete(null);
      // Refresh data
      window.location.reload();
    } catch (err) {
      console.error("Error deleting rule:", err);
      toast('Failed to delete automation rule', 'error');
    }
  };

  const addAction = () => {
    if (!newAction.type) {
      toast('Please select an action type', 'error');
      return;
    }
    const actionToAdd = {
      ...newAction,
      config: newAction.config || {},
      delay: newAction.delay || 0,
      order: newRule.actions.length
    };
    setNewRule(prev => ({
      ...prev,
      actions: [...prev.actions, actionToAdd]
    }));
    setNewAction({ type: '', config: {}, delay: 0, order: 0 });
  };

  const removeAction = (index) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  // Filter rules
  const filteredRules = useMemo(() => {
    return automationRules.filter(rule => {
      const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && rule.isActive) ||
        (statusFilter === 'inactive' && !rule.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [automationRules, searchTerm, statusFilter]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Never';
    }
  };

  // Handle funnel assignment
  const handleFunnelAssignment = async (ruleId, funnelId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/automation-rules/${ruleId}/assign-funnel`,
        { funnelId: funnelId || null },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        // Update local state
        setAutomationRules(prev => prev.map(rule => 
          rule._id === ruleId 
            ? { ...rule, funnelId: funnelId || null }
            : rule
        ));
        toast('Funnel assignment updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error assigning funnel:', error);
      toast(error.response?.data?.message || 'Failed to assign funnel', 'error');
    }
  };

  // Get trigger event display name
  const getTriggerDisplayName = (triggerEvent) => {
    const eventMap = {
      'lead_created': 'Lead Created',
      'appointment_booked': 'Appointment Booked',
      'payment_successful': 'Payment Successful',
      'task_completed': 'Task Completed',
      'email_opened': 'Email Opened',
      'form_submitted': 'Form Submitted'
    };
    return eventMap[triggerEvent] || triggerEvent;
  };

  // Get action display name (use helper function)
  const getActionDisplayName = getActionDisplayNameHelper;

  if (loading) {
    return <ProfessionalLoader />;
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxW="full" py={6} px={8} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Hero + Stats + Filters */}
        <Box
          bg="white"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          p={6}
        >
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
              <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
                <Heading size="lg" color="gray.900" fontWeight="600">
                  Automation Rules
                </Heading>
                <Text color="gray.500" fontSize="sm" fontWeight="400">
                  Manage and automate your business workflows
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Button
                  leftIcon={<FiRefreshCw />}
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="md"
                >
                  Refresh
                </Button>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="blue"
                  size="md"
                  onClick={openCreateModal}
                >
                  Create Rule
                </Button>
              </HStack>
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
              <StatsCard
                title="Total Rules"
                value={stats.totalRules}
                icon={<FiZap size={20} />}
                color="blue"
              />
              <StatsCard
                title="Active Rules"
                value={stats.activeRules}
                icon={<FiActivity size={20} />}
                color="green"
              />
              <StatsCard
                title="Inactive Rules"
                value={stats.inactiveRules}
                icon={<FiPause size={20} />}
                color="orange"
              />
              <StatsCard
                title="Executed Today"
                value={stats.executedToday}
                icon={<FiClock size={20} />}
                color="purple"
              />
            </SimpleGrid>

            <HStack spacing={4} justify="space-between" flexWrap="wrap">
              <HStack spacing={3} flex={1} minW="300px">
                <InputGroup maxW="400px" flex={1}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px', borderColor: 'blue.300' }}
                  />
                </InputGroup>
                <Select
                  maxW="180px"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  bg="gray.50"
                  border="none"
                  _focus={{ bg: 'white', border: '1px', borderColor: 'blue.300' }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </HStack>
            </HStack>
          </VStack>
        </Box>

        {/* Minimal Rules Table */}
        <Box
          bg="white"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Flex justify="space-between" align="center" p={5} borderBottom="1px" borderColor="gray.100">
            <VStack align="start" spacing={0}>
              <Text fontSize="md" fontWeight="600" color="gray.900">
                Automation Rules
              </Text>
              <Text color="gray.500" fontSize="xs" mt={1}>
                {filteredRules.length} {filteredRules.length === 1 ? 'rule' : 'rules'}
              </Text>
            </VStack>
          </Flex>
          
          <Box>
            <TableContainer w="full" overflowX="auto" className="hide-scrollbar">
              <Table variant="simple" size="md" w="full">
                <Thead>
                  <Tr bg="gray.50">
                    <Th px={6} py={4} fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Rule Name
                    </Th>
                    <Th px={6} py={4} fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Trigger Event
                    </Th>
                    <Th px={6} py={4} fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Actions
                    </Th>
                    <Th px={6} py={4} fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Status
                    </Th>
                    <Th px={6} py={4} fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Funnel
                    </Th>
                    <Th px={6} py={4} fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Last Executed
                    </Th>
                    <Th px={6} py={4} fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredRules.map((rule) => (
                    <Tr 
                      key={rule._id} 
                      borderBottom="1px" 
                      borderColor="gray.100" 
                      _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                      onClick={() => openEditGraphModal(rule)}
                      transition="background 0.2s"
                    >
                      <Td px={6} py={4}>
                        <VStack align="start" spacing={0.5}>
                          <Text fontWeight="600" fontSize="sm" color="gray.900">{rule.name}</Text>
                          <Text color="gray.400" fontSize="xs">
                            {formatDate(rule.createdAt)}
                          </Text>
                        </VStack>
                      </Td>
                      <Td px={6} py={4}>
                        <HStack spacing={1}>
                          <Box
                            px={1.5}
                            py={0.5}
                            bg="blue.50"
                            borderRadius="sm"
                            border="1px"
                            borderColor="blue.100"
                          >
                            <Text fontSize="10px" fontWeight="600" color="blue.700" letterSpacing="0.5px">
                              {rule.triggerEvent ? getTriggerDisplayName(rule.triggerEvent).substring(0, 12) : 'Graph'}
                            </Text>
                          </Box>
                          {rule.workflowType === 'graph' && (
                            <Box
                              px={1.5}
                              py={0.5}
                              bg="purple.50"
                              borderRadius="sm"
                              border="1px"
                              borderColor="purple.100"
                            >
                              <Text fontSize="10px" fontWeight="600" color="purple.700" letterSpacing="0.5px">
                                G
                              </Text>
                            </Box>
                          )}
                        </HStack>
                      </Td>
                      <Td px={6} py={4}>
                        <HStack spacing={1} flexWrap="wrap">
                          {rule.workflowType === 'graph' ? (
                            <>
                              {Array.isArray(rule.nodes) && rule.nodes
                                .filter(n => n.type === 'action')
                                .slice(0, 2)
                                .map((node, index) => (
                                  <Box
                                    key={index}
                                    px={1.5}
                                    py={0.5}
                                    bg="green.50"
                                    borderRadius="sm"
                                    border="1px"
                                    borderColor="green.100"
                                  >
                                    <Text fontSize="10px" fontWeight="600" color="green.700" letterSpacing="0.5px">
                                      {(node.label || node.nodeType || 'Action').substring(0, 8)}
                                    </Text>
                                  </Box>
                                ))}
                              {Array.isArray(rule.nodes) && rule.nodes.filter(n => n.type === 'action').length > 2 && (
                                <Box
                                  px={1.5}
                                  py={0.5}
                                  bg="gray.50"
                                  borderRadius="sm"
                                  border="1px"
                                  borderColor="gray.200"
                                >
                                  <Text fontSize="10px" fontWeight="600" color="gray.600" letterSpacing="0.5px">
                                    +{rule.nodes.filter(n => n.type === 'action').length - 2}
                                  </Text>
                                </Box>
                              )}
                            </>
                          ) : (
                            <>
                              {Array.isArray(rule.actions) && rule.actions.slice(0, 2).map((action, index) => (
                                <Box
                                  key={index}
                                  px={1.5}
                                  py={0.5}
                                  bg="green.50"
                                  borderRadius="sm"
                                  border="1px"
                                  borderColor="green.100"
                                >
                                  <Text fontSize="10px" fontWeight="600" color="green.700" letterSpacing="0.5px">
                                    {getActionDisplayName(action?.type || '').substring(0, 8)}
                                  </Text>
                                </Box>
                              ))}
                              {Array.isArray(rule.actions) && rule.actions.length > 2 && (
                                <Box
                                  px={1.5}
                                  py={0.5}
                                  bg="gray.50"
                                  borderRadius="sm"
                                  border="1px"
                                  borderColor="gray.200"
                                >
                                  <Text fontSize="10px" fontWeight="600" color="gray.600" letterSpacing="0.5px">
                                    +{rule.actions.length - 2}
                                  </Text>
                                </Box>
                              )}
                            </>
                          )}
                        </HStack>
                      </Td>
                      <Td px={6} py={4}>
                        <StatusBadge status={rule.status} isActive={rule.isActive} />
                      </Td>
                      <Td px={6} py={4} onClick={(e) => e.stopPropagation()}>
                        <Select
                          size="sm"
                          value={rule.funnelId || ''}
                          onChange={(e) => handleFunnelAssignment(rule._id, e.target.value)}
                          placeholder="No funnel"
                          maxW="200px"
                          fontSize="xs"
                          borderRadius="md"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'blue.400' }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                        >
                          {builderResources.funnels.map(funnel => (
                            <option key={funnel.id} value={funnel.id}>
                              {funnel.name}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td px={6} py={4}>
                        <Text fontSize="xs" color="gray.600" fontWeight="500">
                          {formatDate(rule.lastExecutedAt)}
                        </Text>
                      </Td>
                      <Td px={6} py={4} onClick={(e) => e.stopPropagation()}>
                        <HStack spacing={1} justify="flex-end">
                          <IconButton
                            icon={<FiEye />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditGraphModal(rule, true); // Pass true for view mode
                            }}
                            aria-label="View Workflow"
                          />
                          <IconButton
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditGraphModal(rule);
                            }}
                            aria-label="Edit Rule"
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(rule);
                            }}
                            aria-label="Delete Rule"
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {filteredRules.length === 0 && (
              <Box py={12} textAlign="center">
                <VStack spacing={3}>
                  <FiZap size={48} color="gray.300" />
                  <Text color="gray.500" fontSize="sm" fontWeight="500">
                    No automation rules found
                  </Text>
                  <Text color="gray.400" fontSize="xs">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Create your first automation rule to get started'}
                  </Text>
                </VStack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Create Rule Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="2xl">
            <ModalHeader>Create New Automation Rule</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel>Rule Name</FormLabel>
                  <Input
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter rule name"
                    borderRadius="lg"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Trigger Event</FormLabel>
                  <Select
                    value={newRule.triggerEvent}
                    onChange={(e) => setNewRule(prev => ({ ...prev, triggerEvent: e.target.value }))}
                    borderRadius="lg"
                  >
                    <option value="">Select trigger event</option>
                    {Array.isArray(eventsActions.events) && eventsActions.events.map((event, index) => {
                      const eventValue = typeof event === 'string' ? event : event.value || event.name || event;
                      const eventLabel = typeof event === 'string' ? getTriggerDisplayName(event) : (event.label || event.name || eventValue);
                      return (
                        <option key={eventValue || index} value={eventValue}>
                          {eventLabel}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Actions</FormLabel>
                  <VStack spacing={4} align="stretch">
                    {newRule.actions.map((action, index) => (
                      <Card key={index} variant="outline" borderColor={editingActionIndex === index ? 'blue.300' : 'gray.200'}>
                        <CardBody p={4}>
                          {editingActionIndex === index ? (
                            <ActionConfigForm
                              action={action}
                              onChange={(updatedAction) => {
                                const updatedActions = [...newRule.actions];
                                updatedActions[index] = updatedAction;
                                setNewRule(prev => ({ ...prev, actions: updatedActions }));
                              }}
                              triggerEvent={newRule.triggerEvent}
                              builderResources={builderResources}
                              onClose={() => setEditingActionIndex(null)}
                            />
                          ) : (
                            <HStack justify="space-between">
                              <VStack align="start" spacing={1} flex={1}>
                                <HStack>
                                  <Text fontWeight="medium">{getActionDisplayName(action.type)}</Text>
                                  {action.delay > 0 && (
                                    <Badge colorScheme="orange" size="sm">
                                      Delay: {action.delay}s
                                    </Badge>
                                  )}
                                </HStack>
                                <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                  {action.config && Object.keys(action.config).length > 0
                                    ? Object.entries(action.config).map(([key, value]) => {
                                        if (typeof value === 'string' && value.length > 50) {
                                          return `${key}: ${value.substring(0, 50)}...`;
                                        }
                                        return `${key}: ${value}`;
                                      }).join(', ')
                                    : 'No configuration'}
                                </Text>
                              </VStack>
                              <HStack spacing={2}>
                                <IconButton
                                  icon={<FiEdit />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="ghost"
                                  onClick={() => setEditingActionIndex(index)}
                                  aria-label="Edit action"
                                />
                                <IconButton
                                  icon={<FiX />}
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => removeAction(index)}
                                  aria-label="Remove action"
                                />
                              </HStack>
                            </HStack>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                    
                    {editingActionIndex === null && (
                      <Card variant="dashed" borderStyle="dashed">
                        <CardBody p={4}>
                          <VStack spacing={4}>
                            <Select
                              value={newAction.type}
                              onChange={(e) => {
                                setNewAction(prev => ({ 
                                  ...prev, 
                                  type: e.target.value,
                                  config: {},
                                  order: newRule.actions.length
                                }));
                              }}
                              placeholder="Select action type"
                              borderRadius="lg"
                            >
                              <option value="">Select action type</option>
                              {Array.isArray(eventsActions.actions) && eventsActions.actions.map((action, index) => {
                                const actionValue = typeof action === 'string' ? action : action.value || action.name || action;
                                const actionLabel = typeof action === 'string' ? getActionDisplayName(action) : (action.label || action.name || actionValue);
                                const actionCategory = typeof action === 'object' ? action.category : '';
                                return (
                                  <option key={actionValue || index} value={actionValue}>
                                    {actionCategory ? `[${actionCategory}] ` : ''}{actionLabel}
                                  </option>
                                );
                              })}
                            </Select>
                            {newAction.type && (
                              <Button
                                leftIcon={<FiPlus />}
                                colorScheme="blue"
                                onClick={() => {
                                  addAction();
                                  // Open config for the newly added action
                                  setTimeout(() => {
                                    setEditingActionIndex(newRule.actions.length);
                                  }, 50);
                                }}
                                size="sm"
                                borderRadius="lg"
                                w="full"
                              >
                                Add & Configure Action
                              </Button>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCreateClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleCreateRule}>
                Create Rule
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Rule Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="2xl">
            <ModalHeader>Edit Automation Rule</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel>Rule Name</FormLabel>
                  <Input
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter rule name"
                    borderRadius="lg"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Trigger Event</FormLabel>
                  <Select
                    value={newRule.triggerEvent}
                    onChange={(e) => setNewRule(prev => ({ ...prev, triggerEvent: e.target.value }))}
                    borderRadius="lg"
                  >
                    <option value="">Select trigger event</option>
                    {Array.isArray(eventsActions.events) && eventsActions.events.map((event, index) => {
                      const eventValue = typeof event === 'string' ? event : event.value || event.name || event;
                      const eventLabel = typeof event === 'string' ? getTriggerDisplayName(event) : (event.label || event.name || eventValue);
                      return (
                        <option key={eventValue || index} value={eventValue}>
                          {eventLabel}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <HStack>
                    <Switch
                      isChecked={newRule.isActive}
                      onChange={(e) => setNewRule(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <Text>{newRule.isActive ? 'Active' : 'Inactive'}</Text>
                  </HStack>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleUpdateRule}>
                Update Rule
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Rule Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="2xl">
            <ModalHeader>Rule Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedRule && (
                <VStack spacing={6} align="stretch">
                  <Card>
                    <CardHeader>
                      <Heading size="md">{selectedRule.name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.500">Status</Text>
                          <StatusBadge status={selectedRule.status} isActive={selectedRule.isActive} />
                        </VStack>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.500">Trigger Event</Text>
                          <Badge colorScheme="blue" variant="outline">
                            {getTriggerDisplayName(selectedRule.triggerEvent)}
                          </Badge>
                        </VStack>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.500">Created</Text>
                          <Text>{formatDate(selectedRule.createdAt)}</Text>
                        </VStack>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.500">Last Executed</Text>
                          <Text>{formatDate(selectedRule.lastExecutedAt)}</Text>
                        </VStack>
                      </SimpleGrid>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Heading size="md">Actions</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {selectedRule.actions?.map((action, index) => (
                          <Card key={index} variant="outline">
                            <CardBody p={4}>
                              <VStack align="start" spacing={2}>
                                <Text fontWeight="medium">{getActionDisplayName(action.type)}</Text>
                                <Code p={2} borderRadius="md" fontSize="sm">
                                  {JSON.stringify(action.config, null, 2)}
                                </Code>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onViewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleDeleteRule}
          title="Delete Automation Rule"
          message={`Are you sure you want to delete "${ruleToDelete?.name}"? This action cannot be undone.`}
          isLoading={false}
        />

        {/* Graph Builder Drawer */}
        <GraphBuilderDrawer
          isOpen={isGraphBuilderOpen}
          onClose={onGraphBuilderClose}
          graphBuilderRule={graphBuilderRule}
          handleGraphBuilderSave={handleGraphBuilderSave}
          eventsActions={eventsActions}
          builderResources={builderResources}
          viewMode={viewMode}
        />
      </VStack>
    </Box>
  );
};

export default AutomationDashboard;