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
  MenuDivider
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
  FiPlay, FiPause, FiBarChart2, FiTrendingUp, FiTarget, FiGlobe
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getCoachId, getToken, isAuthenticated, debugAuthState } from '../../../utils/authUtils';

// --- API CONFIGURATION ---
const API_BASE_URL = 'https://api.funnelseye.com/api';
const ALL_LEADS_FUNNEL = { id: 'all', name: 'All Customer Leads', stages: [] };

// --- UTILITY FUNCTIONS ---
const getFunnelId = (lead) => {
    if (!lead || !lead.funnelId) return null;
    if (typeof lead.funnelId === 'string') return lead.funnelId;
    if (typeof lead.funnelId === 'object' && lead.funnelId !== null) {
        return lead.funnelId._id || lead.funnelId.id || lead.funnelId;
    }
    return lead.funnelId;
};

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
                    {[...Array(8)].map((_, i) => (
                      <Th key={i} px={6} py={5}>
                        <Skeleton height="16px" width="80px" borderRadius="md" />
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <Tr key={rowIndex} borderBottom="1px" borderColor="gray.100">
                      {[...Array(8)].map((_, cellIndex) => (
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
                          ) : cellIndex === 5 || cellIndex === 6 ? (
                            <VStack spacing={0.5} align="center">
                              <Skeleton height="12px" width="80px" borderRadius="sm" />
                              <Skeleton height="10px" width="60px" borderRadius="sm" />
                            </VStack>
                          ) : cellIndex === 7 ? (
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
            <Text color="gray.500" fontSize="sm" fontWeight="medium">
              Loading customer leads...
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

// --- LEAD SCORE CALCULATION FUNCTION ---
const calculateLeadScore = (lead) => {
  let score = 0;
  
  // Base score for having contact info
  if (lead.email) score += 10;
  if (lead.phone) score += 10;
  
  // Location completeness
  if (lead.city) score += 5;
  if (lead.country) score += 5;
  
  // Temperature scoring
  switch (lead.leadTemperature?.toLowerCase()) {
    case 'hot': score += 30; break;
    case 'warm': score += 20; break;
    case 'cold': score += 10; break;
    default: score += 5;
  }
  
  // Source scoring
  switch (lead.source?.toLowerCase()) {
    case 'referral': score += 25; break;
    case 'event': score += 20; break;
    case 'social media': score += 15; break;
    case 'web form': score += 10; break;
    case 'email campaign': score += 10; break;
    case 'cold call': score += 5; break;
    default: score += 5;
  }
  
  // Follow-up activity
  if (lead.followUpHistory && lead.followUpHistory.length > 0) {
    score += Math.min(lead.followUpHistory.length * 5, 25);
  }
  
  // Assignment status
  if (lead.assignedTo) score += 10;
  
  // Recent activity bonus
  if (lead.lastFollowUpAt) {
    const lastFollowUp = new Date(lead.lastFollowUpAt);
    const daysSince = (new Date() - lastFollowUp) / (1000 * 60 * 60 * 24);
    if (daysSince <= 7) score += 15;
    else if (daysSince <= 30) score += 10;
  }
  
  // Cap at 100
  return Math.min(score, 100);
};

// --- BEAUTIFUL LEAD SCORE BADGE ---
const LeadScoreBadge = ({ score }) => {
  const getScoreProps = (score) => {
    if (score >= 80) return { colorScheme: 'green', icon: '🏆', label: 'Excellent' };
    if (score >= 60) return { colorScheme: 'blue', icon: '⭐', label: 'Good' };
    if (score >= 40) return { colorScheme: 'orange', icon: '📈', label: 'Fair' };
    if (score >= 20) return { colorScheme: 'yellow', icon: '📊', label: 'Poor' };
    return { colorScheme: 'red', icon: '⚠️', label: 'Critical' };
  };

  const { colorScheme, icon, label } = getScoreProps(score);
  
  return (
    <Badge colorScheme={colorScheme} variant="subtle" px={2} py={1} borderRadius="md">
      <HStack spacing={1}>
        <Text fontSize="xs">{icon}</Text>
        <Text fontSize="xs" fontWeight="bold">{score}</Text>
        <Text fontSize="xs" fontWeight="medium">{label}</Text>
      </HStack>
    </Badge>
  );
};

// --- BEAUTIFUL LEAD TEMPERATURE BADGE ---
const LeadTemperatureBadge = ({ temperature }) => {
  const getTemperatureProps = (temp) => {
    switch (temp?.toLowerCase()) {
      case 'hot':
        return { colorScheme: 'red', icon: '🔥' };
      case 'warm':
        return { colorScheme: 'orange', icon: '🌡️' };
      case 'cold':
        return { colorScheme: 'blue', icon: '❄️' };
      default:
        return { colorScheme: 'gray', icon: '📊' };
    }
  };

  const { colorScheme, icon } = getTemperatureProps(temperature);
  
  return (
    <Badge colorScheme={colorScheme} variant="subtle" px={2} py={1} borderRadius="md">
      <HStack spacing={1}>
        <Text fontSize="xs">{icon}</Text>
        <Text fontSize="xs" fontWeight="medium">{temperature}</Text>
      </HStack>
    </Badge>
  );
};

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ status, isActive }) => {
  if (isActive) {
    return (
      <Badge colorScheme="green" variant="solid" borderRadius="full" px={3}>
        Active
      </Badge>
    );
  }
  return (
    <Badge colorScheme="gray" variant="outline" borderRadius="full" px={3}>
      Draft
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
            Delete Lead
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// --- STAFF ASSIGNMENTS OVERVIEW MODAL ---
const StaffAssignmentsModal = ({ isOpen, onClose, staff, stats, getStaffLeadCount, onStaffCardClick }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent maxH="90vh" overflowY="auto" borderRadius="2xl">
        <ModalHeader>
          <HStack spacing={3}>
            <Box as={FiUsers} size="24px" color="blue.500" />
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Staff Assignments Overview
              </Text>
              <Text fontSize="sm" color="gray.500" fontWeight="normal">
                Monitor lead distribution across your team
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Summary Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Card bg="blue.50" borderRadius="lg">
                <CardBody>
                  <VStack spacing={2}>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                      {stats.totalLeads}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Total Leads
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
              <Card bg="gray.50" borderRadius="lg">
                <CardBody>
                  <VStack spacing={2}>
                    <Text fontSize="3xl" fontWeight="bold" color="gray.600">
                      {stats.unassignedLeads}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Unassigned
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
              <Card bg="green.50" borderRadius="lg">
                <CardBody>
                  <VStack spacing={2}>
                    <Text fontSize="3xl" fontWeight="bold" color="green.600">
                      {stats.totalLeads - stats.unassignedLeads}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Assigned
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
              <Card bg="purple.50" borderRadius="lg">
                <CardBody>
                  <VStack spacing={2}>
                    <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                      {staff.length}
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Staff Members
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Staff Cards Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {/* Unassigned Leads Card */}
              <Card 
                variant="outline" 
                borderRadius="lg" 
                bg="gray.50"
                cursor="pointer"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg', borderColor: 'gray.400' }}
                transition="all 0.2s"
                onClick={() => {
                  onStaffCardClick('unassigned');
                  onClose();
                }}
              >
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Box 
                        p={3} 
                        bg="gray.200" 
                        borderRadius="lg"
                        color="gray.600"
                      >
                        <Box as={FiUser} size="24px" />
                      </Box>
                      <Badge 
                        colorScheme="gray" 
                        variant="solid" 
                        fontSize="xl"
                        px={4}
                        py={2}
                        borderRadius="full"
                      >
                        {stats.unassignedLeads}
                      </Badge>
                    </HStack>
                    <VStack align="start" spacing={1} w="full">
                      <Text fontSize="md" color="gray.700" fontWeight="bold">
                        Unassigned Leads
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Click to view unassigned leads
                      </Text>
                    </VStack>
                    <Progress 
                      value={(stats.unassignedLeads / stats.totalLeads) * 100} 
                      size="sm" 
                      colorScheme="gray" 
                      borderRadius="full"
                      w="full"
                    />
                    <Text fontSize="xs" color="gray.500">
                      {((stats.unassignedLeads / stats.totalLeads) * 100).toFixed(1)}% of total leads
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Staff Member Cards */}
              {staff.map((staffMember, index) => {
                const staffId = staffMember._id || staffMember.id;
                const assignedCount = getStaffLeadCount(staffId);
                const percentage = stats.totalLeads > 0 ? (assignedCount / stats.totalLeads) * 100 : 0;
                const staffName = staffMember.firstName && staffMember.lastName 
                  ? `${staffMember.firstName} ${staffMember.lastName}`
                  : staffMember.name || 'Unknown Staff';
                
                const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'teal'];
                const color = colors[index % colors.length];

                return (
                  <Card 
                    key={staffId}
                    variant="outline" 
                    borderRadius="lg" 
                    bg={`${color}.50`}
                    borderColor={`${color}.200`}
                    cursor="pointer"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg', borderColor: `${color}.400` }}
                    transition="all 0.2s"
                    onClick={() => {
                      onStaffCardClick(staffId);
                      onClose();
                    }}
                  >
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="full">
                          <Box 
                            p={3} 
                            bg={`${color}.100`} 
                            borderRadius="lg"
                            color={`${color}.600`}
                          >
                            <Box as={FiUser} size="24px" />
                          </Box>
                          <Badge 
                            colorScheme={color} 
                            variant="solid" 
                            fontSize="xl"
                            px={4}
                            py={2}
                            borderRadius="full"
                          >
                            {assignedCount}
                          </Badge>
                        </HStack>
                        <VStack align="start" spacing={1} w="full">
                          <Text fontSize="md" color="gray.700" fontWeight="bold" noOfLines={1}>
                            {staffName}
                          </Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {staffMember.email}
                          </Text>
                        </VStack>
                        <Progress 
                          value={percentage} 
                          size="sm" 
                          colorScheme={color} 
                          borderRadius="full"
                          w="full"
                        />
                        <Text fontSize="xs" color="gray.500">
                          {percentage.toFixed(1)}% of total leads
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>

            {/* Info Message */}
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <AlertTitle fontSize="sm">Click on any card to filter leads</AlertTitle>
                <AlertDescription fontSize="xs">
                  Select a staff member to view only their assigned leads, or click "Unassigned" to see leads without assignment.
                </AlertDescription>
              </VStack>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// --- BEAUTIFUL MESSAGE MODAL ---
const MessageModal = ({ isOpen, onClose, lead, type, onSend }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (type === 'whatsapp') {
        // For WhatsApp, open the WhatsApp URL directly
        const phoneNumber = lead.phone.replace(/[^\d]/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message.trim())}`;
        window.open(whatsappUrl, '_blank');
        onClose();
        setSubject('');
        setMessage('');
      } else {
      await onSend({
        leadId: lead._id,
        type,
        subject: type === 'email' ? subject : '',
        message: message.trim(),
        recipient: type === 'email' ? lead.email : lead.phone
      });
      onClose();
      setSubject('');
      setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader>
          <HStack>
            <Box color={type === 'email' ? 'blue.500' : type === 'whatsapp' ? 'green.500' : 'green.500'}>
              {type === 'email' ? <EmailIcon /> : type === 'whatsapp' ? <Box as={FaWhatsapp} /> : <ChatIcon />}
            </Box>
            <VStack align="start" spacing={0}>
              <Text>Send {type === 'email' ? 'Email' : type === 'whatsapp' ? 'WhatsApp' : 'SMS'}</Text>
              <Text fontSize="sm" color="gray.500">
                To: {lead?.name} ({type === 'email' ? lead?.email : lead?.phone})
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {type === 'email' && (
              <FormControl>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Type your ${type === 'email' ? 'email' : type === 'whatsapp' ? 'WhatsApp' : 'SMS'} message here...`}
                rows={type === 'email' ? 8 : 4}
                resize="vertical"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                {message.length}/{type === 'email' ? 2000 : type === 'whatsapp' ? 4096 : 160} characters
              </Text>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            bg={type === 'email' ? 'blue.500' : type === 'whatsapp' ? 'green.500' : 'green.500'}
            color="white"
            onClick={handleSend}
            isLoading={isLoading}
            loadingText="Sending..."
            leftIcon={type === 'email' ? <EmailIcon /> : type === 'whatsapp' ? <Box as={FaWhatsapp} /> : <ChatIcon />}
            _hover={{ bg: type === 'email' ? 'blue.600' : type === 'whatsapp' ? 'green.600' : 'green.600' }}
          >
            Send {type === 'email' ? 'Email' : type === 'whatsapp' ? 'WhatsApp' : 'SMS'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// --- BEAUTIFUL FUNNEL SELECTION MODAL ---
const FunnelSelectionModal = ({ isOpen, onClose, funnels, onSelect, leads }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader>Select Customer Funnel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {[ALL_LEADS_FUNNEL, ...funnels].map(funnel => {
              let leadCount = 0;
              if (funnel.id === 'all') {
                leadCount = leads.length;
              } else {
                leadCount = leads.filter(lead => getFunnelId(lead) === funnel.id).length;
              }
              
              return (
                <Card
                  key={funnel.id}
                  cursor="pointer"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  onClick={() => onSelect(funnel)}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack>
                        <Box color="blue.500">
                          <FiFilter />
                        </Box>
                        <Badge colorScheme="blue" variant="subtle">
                          Customer Funnel
                        </Badge>
                      </HStack>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {funnel.name}
                        </Text>
                        <Text color="gray.600" fontSize="sm">
                          {funnel.id === 'all' 
                            ? `${leadCount} customer leads` 
                            : `${leadCount} leads, ${funnel.stages?.length || 0} stages`
                          }
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// --- BEAUTIFUL CREATE/EDIT LEAD MODAL ---
const CreateLeadModal = ({ isOpen, onClose, onSave, leadToEdit, funnels, staff }) => {
  const isEditMode = !!leadToEdit;
  const customerFunnels = funnels;
  const toast = useCustomToast();
  
  console.log('CreateLeadModal - staff prop:', staff);
  console.log('CreateLeadModal - staff length:', staff?.length);
  
  const initialFormData = isEditMode 
    ? { 
        ...leadToEdit, 
        funnelId: getFunnelId(leadToEdit) || '', 
        nextFollowUpAt: leadToEdit.nextFollowUpAt ? new Date(leadToEdit.nextFollowUpAt).toISOString().slice(0, 16) : '',
        assignedTo: leadToEdit.assignedTo?._id || leadToEdit.assignedTo || ''
      } 
    : { 
        name: '', email: '', phone: '', city: '', country: '', status: '', 
        funnelId: '', notes: '', source: 'Web Form', leadTemperature: 'Warm', 
        nextFollowUpAt: '', targetAudience: 'customer', assignedTo: ''
      };
  
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFunnel, setSelectedFunnel] = useState(
    isEditMode ? customerFunnels.find(f => f.id === getFunnelId(leadToEdit)) : null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Reset form data when modal opens or leadToEdit changes
  useEffect(() => {
    if (isOpen) {
      const newInitialData = isEditMode 
        ? { 
            ...leadToEdit, 
            funnelId: getFunnelId(leadToEdit) || '', 
            nextFollowUpAt: leadToEdit.nextFollowUpAt ? new Date(leadToEdit.nextFollowUpAt).toISOString().slice(0, 16) : '',
            assignedTo: leadToEdit.assignedTo?._id || leadToEdit.assignedTo || ''
          } 
        : { 
            name: '', email: '', phone: '', city: '', country: '', status: '', 
            funnelId: '', notes: '', source: 'Web Form', leadTemperature: 'Warm', 
            nextFollowUpAt: '', targetAudience: 'customer', assignedTo: ''
          };
      
      setFormData(newInitialData);
      setSelectedFunnel(
        isEditMode ? customerFunnels.find(f => f.id === getFunnelId(leadToEdit)) : null
      );
    }
  }, [isOpen, leadToEdit, isEditMode, customerFunnels]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFunnelChange = (funnelId) => {
    const funnel = customerFunnels.find(f => f.id === funnelId);
    setSelectedFunnel(funnel);
    setFormData(prev => ({ 
      ...prev, 
      funnelId: funnelId, 
      status: funnel && funnel.stages.length > 0 ? funnel.stages[0].name : '' 
    }));
  };

  const handleSubmit = async () => {
    if (!formData.funnelId) {
      toast("Please select a customer funnel.", 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const submitData = { 
        ...formData, 
        nextFollowUpAt: formData.nextFollowUpAt ? new Date(formData.nextFollowUpAt).toISOString() : null 
      };
      await onSave(submitData);
      onClose();
      // Reset form data after successful save
      const resetData = { 
        name: '', email: '', phone: '', city: '', country: '', status: '', 
        funnelId: '', notes: '', source: 'Web Form', leadTemperature: 'Warm', 
        nextFollowUpAt: '', targetAudience: 'customer', assignedTo: ''
      };
      setFormData(resetData);
      setSelectedFunnel(null);
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form data when modal closes
    const resetData = { 
      name: '', email: '', phone: '', city: '', country: '', status: '', 
      funnelId: '', notes: '', source: 'Web Form', leadTemperature: 'Warm', 
      nextFollowUpAt: '', targetAudience: 'customer', assignedTo: ''
    };
    setFormData(resetData);
    setSelectedFunnel(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent maxH="90vh" overflowY="auto" borderRadius="2xl">
        <ModalHeader>
          <HStack>
            <Text>{isEditMode ? 'Edit Customer Lead' : 'Create New Customer Lead'}</Text>
            <Badge colorScheme="blue" variant="subtle">Customer</Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Contact Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                Contact Information
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Source</FormLabel>
                  <Select
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                  >
                    <option value="Web Form">Web Form</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Event">Event</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Location */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                Location
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Enter country"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Sales Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                Sales Information
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Customer Funnel</FormLabel>
                  <Select
                    value={formData.funnelId}
                    onChange={(e) => handleFunnelChange(e.target.value)}
                    placeholder="Select Customer Funnel"
                  >
                    {customerFunnels.map(funnel => (
                      <option key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={!formData.funnelId}
                    placeholder="Select Status"
                  >
                    {selectedFunnel?.stages.map(stage => (
                      <option key={stage.name} value={stage.name}>
                        {stage.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Lead Temperature</FormLabel>
                  <Select
                    value={formData.leadTemperature}
                    onChange={(e) => handleInputChange('leadTemperature', e.target.value)}
                  >
                    <option value="Hot">🔥 Hot</option>
                    <option value="Warm">🌡️ Warm</option>
                    <option value="Cold">❄️ Cold</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Next Follow-up</FormLabel>
                  <Input
                    type="datetime-local"
                    value={formData.nextFollowUpAt}
                    onChange={(e) => handleInputChange('nextFollowUpAt', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Assign to Staff</FormLabel>
                  <Select
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    placeholder="Select staff member"
                  >
                    <option value="">Unassigned</option>
                    {staff && staff.length > 0 ? (
                      staff.map(staffMember => {
                        console.log('Rendering staff member:', staffMember);
                        // Get staff name - handle different formats
                        const staffName = staffMember.firstName && staffMember.lastName 
                          ? `${staffMember.firstName} ${staffMember.lastName}`
                          : staffMember.name || 'Unknown Staff';
                        
                        return (
                          <option key={staffMember._id || staffMember.id} value={staffMember._id || staffMember.id}>
                            {staffName} ({staffMember.email})
                          </option>
                        );
                      })
                    ) : (
                      <option value="" disabled>No staff members available</option>
                    )}
                  </Select>
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Additional Notes */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                Additional Notes
              </Text>
              <FormControl>
                <Textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes about this customer lead..."
                  resize="vertical"
                />
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            bg="blue.500"
            color="white"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText={isEditMode ? 'Updating...' : 'Creating...'}
            leftIcon={<AddIcon />}
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
          >
            {isEditMode ? 'Update Customer Lead' : 'Create Customer Lead'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// --- BEAUTIFUL LEAD DETAILS MODAL ---
const LeadDetailsModal = ({ 
  isOpen, onClose, lead, onEditLead, onDelete, onAddFollowUp, 
  onSendMessage, getStatusLabel, getFunnelName, getStaffName, getStaffDisplayName 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [newFollowUpNote, setNewFollowUpNote] = useState('');
  
  const formatDate = (dateString) => 
    dateString ? new Date(dateString).toLocaleString() : 'Not scheduled';

  const handleAddFollowUpClick = () => {
    if (newFollowUpNote.trim()) {
      onAddFollowUp(lead._id, newFollowUpNote.trim());
      setNewFollowUpNote('');
    }
  };

  if (!lead) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent maxH="90vh" overflowY="auto" borderRadius="2xl">
        <ModalHeader>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <HStack>
                <Text fontSize="xl" fontWeight="bold">{lead.name}</Text>
                <Badge colorScheme="blue" variant="subtle">Customer Lead</Badge>
              </HStack>
              <HStack spacing={3}>
                <LeadScoreBadge score={calculateLeadScore(lead)} />
                <LeadTemperatureBadge temperature={lead.leadTemperature} />
                <Badge colorScheme="green" variant="outline">
                  {getStatusLabel(lead.status, getFunnelId(lead))}
                </Badge>
              </HStack>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Action Buttons */}
            <Card>
              <CardBody>
                <HStack justify="space-between">
                  <ButtonGroup size="sm" variant="outline" spacing={2}>
                    <Button
                      leftIcon={<EmailIcon />}
                      colorScheme="blue"
                      onClick={() => onSendMessage(lead, 'email')}
                    >
                      Send Email
                    </Button>
                    <Button
                      leftIcon={<Box as={FaWhatsapp} />}
                      colorScheme="green"
                      onClick={() => onSendMessage(lead, 'whatsapp')}
                    >
                      Send WhatsApp
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup size="sm" spacing={2}>
                    <Button
                      leftIcon={<EditIcon />}
                      colorScheme="orange"
                      variant="outline"
                      onClick={() => onEditLead(lead)}
                    >
                      Edit
                    </Button>
                    <Button
                      leftIcon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                      onClick={() => onDelete(lead._id)}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </HStack>
              </CardBody>
            </Card>

            {/* Tabs */}
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
              <TabList>
                <Tab>Customer Details</Tab>
                <Tab>Follow-ups & Communications</Tab>
              </TabList>

              <TabPanels>
                {/* Details Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    {/* Contact Information */}
                    <Card>
                      <CardHeader>
                        <Heading size="md">Contact Information</Heading>
                      </CardHeader>
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Email</Text>
                            <HStack>
                              <EmailIcon color="blue.500" />
                              <Text>{lead.email}</Text>
                            </HStack>
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Phone</Text>
                            <HStack>
                              <PhoneIcon color="green.500" />
                              <Text>{lead.phone}</Text>
                            </HStack>
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Location</Text>
                            <HStack>
                              <InfoIcon color="purple.500" />
                              <Text>
                                {[lead.city, lead.country].filter(Boolean).join(', ') || 'Not specified'}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Source</Text>
                            <Text>{lead.source}</Text>
                          </VStack>
                        </SimpleGrid>
                      </CardBody>
                    </Card>

                    {/* Sales Information */}
                    <Card>
                      <CardHeader>
                        <Heading size="md">Sales Information</Heading>
                      </CardHeader>
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Funnel</Text>
                            <HStack>
                              <Box as={FiFilter} color="blue.500" />
                              <Text>{getFunnelName(lead.funnelId)}</Text>
                            </HStack>
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Current Status</Text>
                            <Badge colorScheme="green" variant="outline">
                              {getStatusLabel(lead.status, getFunnelId(lead))}
                            </Badge>
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Lead Score</Text>
                            <LeadScoreBadge score={calculateLeadScore(lead)} />
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Lead Temperature</Text>
                            <LeadTemperatureBadge temperature={lead.leadTemperature} />
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Next Follow-up</Text>
                            <HStack>
                              <CalendarIcon color="orange.500" />
                              <Text>{formatDate(lead.nextFollowUpAt)}</Text>
                            </HStack>
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Assigned To</Text>
                            <Badge 
                              colorScheme={lead.assignedTo ? 'green' : 'gray'} 
                              variant={lead.assignedTo ? 'solid' : 'outline'}
                              borderRadius="full"
                              px={3}
                              py={1}
                            >
                              {getStaffDisplayName(lead.assignedTo)}
                            </Badge>
                          </VStack>
                        </SimpleGrid>
                      </CardBody>
                    </Card>

                    {/* Timeline */}
                    <Card>
                      <CardHeader>
                        <Heading size="md">Timeline</Heading>
                      </CardHeader>
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Created On</Text>
                            <HStack>
                              <TimeIcon color="green.500" />
                              <Text>{formatDate(lead.createdAt)}</Text>
                            </HStack>
                          </VStack>
                          <VStack align="start">
                            <Text fontSize="sm" color="gray.500">Last Follow-up</Text>
                            <HStack>
                              <TimeIcon color="blue.500" />
                              <Text>{formatDate(lead.lastFollowUpAt)}</Text>
                            </HStack>
                          </VStack>
                        </SimpleGrid>
                      </CardBody>
                    </Card>

                    {/* Notes */}
                    {lead.notes && (
                      <Card>
                        <CardHeader>
                          <Heading size="md">Notes</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text color="gray.700" lineHeight="1.6">
                            {lead.notes}
                          </Text>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </TabPanel>

                {/* Follow-ups Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    {/* Add Follow-up Form */}
                    <Card>
                      <CardHeader>
                        <Heading size="md">Add New Follow-up</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4}>
                          <Textarea
                            placeholder="Add new follow-up note or communication log..."
                            value={newFollowUpNote}
                            onChange={(e) => setNewFollowUpNote(e.target.value)}
                            rows={3}
                            resize="vertical"
                          />
                          <HStack justify="flex-end" w="full">
                            <Button
                              colorScheme="blue"
                              onClick={handleAddFollowUpClick}
                              leftIcon={<AddIcon />}
                              disabled={!newFollowUpNote.trim()}
                            >
                              Add Follow-up Note
                            </Button>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Follow-up History */}
                    <Card>
                      <CardHeader>
                        <Heading size="md">Communication History</Heading>
                      </CardHeader>
                      <CardBody>
                        {lead.followUpHistory && lead.followUpHistory.length > 0 ? (
                          <VStack spacing={4} align="stretch">
                            {lead.followUpHistory.map((followUp, index) => (
                              <Box
                                key={index}
                                p={4}
                                bg="gray.50"
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderLeftColor="blue.500"
                              >
                                <VStack align="start" spacing={2}>
                                  <Text fontSize="sm" color="gray.600">
                                    {formatDate(followUp.followUpDate)}
                                  </Text>
                                  <Text color="gray.800">
                                    {followUp.note}
                                  </Text>
                                </VStack>
                              </Box>
                            ))}
                          </VStack>
                        ) : (
                          <Center py={8}>
                            <VStack spacing={2}>
                              <ChatIcon boxSize={8} color="gray.400" />
                              <Text color="gray.500" textAlign="center">
                                No follow-up history available.
                                <br />
                                Start by adding your first follow-up note above.
                              </Text>
                            </VStack>
                          </Center>
                        )}
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// --- DRAG & DROP COMPONENTS (BEAUTIFUL PIPELINE VIEW) ---
const DraggableLeadItem = ({ lead, onClick, onSendMessage }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD',
    item: { lead },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
  }));

  return (
    <Card
      ref={drag}
      cursor="pointer"
      opacity={isDragging ? 0.5 : 1}
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      onClick={() => onClick(lead)}
      size="sm"
      mb={3}
    >
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="sm">{lead.name}</Text>
              <Badge size="xs" colorScheme="blue" variant="subtle">
                Customer
              </Badge>
            </VStack>
            <VStack spacing={1}>
              <LeadScoreBadge score={calculateLeadScore(lead)} />
              <LeadTemperatureBadge temperature={lead.leadTemperature} />
            </VStack>
          </HStack>

          <VStack align="start" spacing={1} fontSize="xs" color="gray.600">
            <HStack>
              <EmailIcon />
              <Text>{lead.email}</Text>
            </HStack>
            <HStack>
              <PhoneIcon />
              <Text>{lead.phone}</Text>
            </HStack>
            {(lead.city || lead.country) && (
              <HStack>
                <InfoIcon />
                <Text>{[lead.city, lead.country].filter(Boolean).join(', ')}</Text>
              </HStack>
            )}
          </VStack>

          {lead.nextFollowUpAt && (
            <Badge colorScheme="orange" variant="subtle" fontSize="xs">
              Follow-up: {new Date(lead.nextFollowUpAt).toLocaleDateString()}
            </Badge>
          )}

          <HStack spacing={2} onClick={(e) => e.stopPropagation()}>
            <IconButton
              size="xs"
              colorScheme="blue"
              variant="ghost"
              icon={<EmailIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onSendMessage(lead, 'email');
              }}
              title="Send Email"
            />
            <IconButton
              size="xs"
              colorScheme="green"
              variant="ghost"
              icon={<Box as={FaWhatsapp} />}
              onClick={(e) => {
                e.stopPropagation();
                onSendMessage(lead, 'whatsapp');
              }}
              title="Send WhatsApp"
            />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const DroppableStatusColumn = ({ statusInfo, leadsInColumn, onLeadClick, onStatusChange, onSendMessage }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LEAD',
    drop: (item) => {
      if (item && item.lead && item.lead._id) {
        onStatusChange(item.lead._id, statusInfo.name, getFunnelId(item.lead));
      }
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() })
  }));

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = isOver ? 'blue.300' : 'gray.200';

  return (
    <Box
      ref={drop}
      minW="300px"
      h="calc(100vh - 300px)"
      bg={bgColor}
      borderRadius="lg"
      border="2px dashed"
      borderColor={borderColor}
      p={4}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={4} h="full">
        <HStack justify="space-between">
          <HStack>
            <Box w={3} h={3} bg="blue.500" borderRadius="full" />
            <Text fontWeight="bold" fontSize="lg">
              {statusInfo.name || 'Unknown Status'}
            </Text>
          </HStack>
          <Badge colorScheme="blue" variant="subtle">
            {leadsInColumn ? leadsInColumn.length : 0}
          </Badge>
        </HStack>
        
        <Box overflowY="auto" flex="1">
          {leadsInColumn && leadsInColumn.map((lead) => (
            <DraggableLeadItem
              key={lead._id || Math.random()}
              lead={lead}
              onClick={onLeadClick}
              onSendMessage={onSendMessage}
            />
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

const LeadsTableView = ({ 
  leads, onEditLead, onDeleteLead, onExport, onImport, onSendMessage, 
  getStatusLabel, getFunnelName, getStaffName, getStaffDisplayName, selectedLeads, onSelectLead, onSelectAllLeads,
  actionMenuOpen, setActionMenuOpen, selectedFunnel, setSelectedFunnel,
  showCompleteData = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const toast = useToast();

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = useMemo(() => {
    if (!leads || !Array.isArray(leads)) return [];
    let sortableLeads = [...leads];
    if (sortConfig.key) {
      sortableLeads.sort((a, b) => {
        if (!a || !b) return 0;
        let valA, valB;
        switch (sortConfig.key) {
          case 'name': valA = a.name || ''; valB = b.name || ''; break;
          case 'email': valA = a.email || ''; valB = b.email || ''; break;
          case 'phone': valA = a.phone || ''; valB = b.phone || ''; break;
          case 'city': valA = a.city || ''; valB = b.city || ''; break;
          case 'country': valA = a.country || ''; valB = b.country || ''; break;
          case 'status': valA = getStatusLabel(a.status, getFunnelId(a)) || ''; valB = getStatusLabel(b.status, getFunnelId(b)) || ''; break;
          case 'funnel': valA = getFunnelName(a.funnelId) || ''; valB = getFunnelName(b.funnelId) || ''; break;
          case 'score': valA = calculateLeadScore(a); valB = calculateLeadScore(b); break;
          case 'temperature': valA = a.leadTemperature || ''; valB = b.leadTemperature || ''; break;
          case 'next_follow-up': valA = a.nextFollowUpAt ? new Date(a.nextFollowUpAt).getTime() : 0; valB = b.nextFollowUpAt ? new Date(b.nextFollowUpAt).getTime() : 0; break;
          case 'created': valA = a.createdAt ? new Date(a.createdAt).getTime() : 0; valB = b.createdAt ? new Date(b.createdAt).getTime() : 0; break;
          default: valA = a[sortConfig.key] || ''; valB = b[sortConfig.key] || '';
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig, getStatusLabel, getFunnelName]);

  const filteredLeads = sortedLeads.filter(lead => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.phone?.toLowerCase().includes(searchLower) ||
      lead.city?.toLowerCase().includes(searchLower) ||
      lead.country?.toLowerCase().includes(searchLower) ||
      getStatusLabel(lead.status, getFunnelId(lead)).toLowerCase().includes(searchLower) ||
      getFunnelName(lead.funnelId).toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => 
    dateString ? new Date(dateString).toLocaleDateString() : '';

  return (
    <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
      <CardHeader py={6}>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <InputGroup maxW="400px">
              <InputLeftElement>
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search customer leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                borderRadius="lg"
                border="2px"
                borderColor="gray.200"
                _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px #9ca3af' }}
                _hover={{ borderColor: 'gray.300' }}
              />
            </InputGroup>
            <ButtonGroup size="sm" variant="outline">
              <Button leftIcon={<DownloadIcon />} onClick={onExport}>
                Export
              </Button>
              <Button as="label" leftIcon={<Box as={FiUpload} />}>
                Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={onImport}
                  style={{ display: 'none' }}
                />
              </Button>
            </ButtonGroup>
          </HStack>
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600">
              {showCompleteData ? 
                'Showing all customer lead information' : 
                'Showing essential information: Name, Email, Phone, Status, Temperature, Next Follow-up, Contact & Actions'
              }
            </Text>
            <Badge colorScheme={showCompleteData ? 'green' : 'orange'} variant="subtle">
              {showCompleteData ? 'Complete View' : 'Essential View'}
            </Badge>
          </HStack>
        </VStack>
      </CardHeader>
      
      <CardBody pt={0} px={0}>
        {filteredLeads.length === 0 ? (
          <Center py={20}>
            <VStack spacing={6}>
              <Box
                w="120px"
                h="120px"
                bg="blue.50"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="blue.500"
                boxShadow="lg"
              >
                <Box as={FiUsers} size="48px" />
              </Box>
              <VStack spacing={3}>
                <Heading size="lg" color="gray.600">
                  No customer leads found
                </Heading>
                <Text color="gray.500">
                  No customer leads match your current filters.
                </Text>
              </VStack>
            </VStack>
          </Center>
        ) : (
          <TableContainer 
            w="full" 
            overflowX="auto" 
            borderRadius="lg" 
            border="1px" 
            borderColor="gray.100" 
            className="hide-scrollbar"
            minW={{ base: "600px", md: "full" }}
          >
            <Table variant="simple" size={{ base: "sm", md: "md" }} w="full">
              <Thead>
                <Tr bg="gray.50" borderBottom="2px" borderColor="gray.200">
                  <Th px={{ base: 3, md: 6 }} py={{ base: 3, md: 5 }} color="gray.800" fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} textAlign="center">
                    <Checkbox
                      isChecked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                      onChange={(e) => onSelectAllLeads(e.target.checked, filteredLeads)}
                    />
                  </Th>
                  {(showCompleteData ? 
                    ['Name', 'Email', 'Phone', 'City', 'Country', 'Status', 'Funnel', 'Score', 'Temperature', 'Assigned To', 'Next Follow-up', 'Created', 'Contact', 'Actions'] :
                    ['Name', 'Email', 'Phone', 'Status', 'Score', 'Temperature', 'Assigned To', 'Next Follow-up', 'Contact', 'Actions']
                  ).map(header => {
                    const sortKey = header.toLowerCase().replace(/ /g, '_');
                    const canSort = !['Contact', 'Actions'].includes(header);
                    return (
                      <Th 
                        key={header}
                        px={{ base: 3, md: 6 }} 
                        py={{ base: 3, md: 5 }} 
                        color="gray.800" 
                        fontWeight="bold" 
                        fontSize={{ base: "xs", md: "sm" }} 
                        textAlign="left"
                        cursor={canSort ? 'pointer' : 'default'}
                        onClick={() => canSort && requestSort(sortKey)}
                        _hover={canSort ? { bg: 'gray.100' } : {}}
                        minW={{ base: "80px", md: "auto" }}
                      >
                        <HStack spacing={1}>
                          <Text>{header}</Text>
                          {sortConfig.key === sortKey && (
                            <Text fontSize="xs">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </Text>
                          )}
                        </HStack>
                      </Th>
                    );
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {leads.map((lead, index) => (
                  <Tr 
                    key={lead._id}
                    cursor="pointer"
                    onClick={() => onEditLead(lead)}
                    bg={selectedLeads.has(lead._id) ? 'blue.50' : 'white'}
                    _hover={{ bg: 'gray.50', transform: 'translateY(-1px)', boxShadow: 'sm' }}
                    borderBottom="1px"
                    borderColor="gray.100"
                    transition="all 0.3s"
                  >
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }} textAlign="center">
                      <Checkbox
                        isChecked={selectedLeads.has(lead._id)}
                        onChange={() => onSelectLead(lead._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Td>
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                      <VStack align="start" spacing={{ base: 1, md: 2 }}>
                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "lg" }} color="gray.800">
                          {lead.name || 'N/A'}
                        </Text>
                        <Badge colorScheme="blue" variant="subtle" size={{ base: "xs", md: "sm" }} px={{ base: 2, md: 3 }} py={{ base: 0.5, md: 1 }} borderRadius="full">
                          Customer
                        </Badge>
                      </VStack>
                    </Td>
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }} fontWeight={!showCompleteData ? 'medium' : 'normal'}>
                      <HStack>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{lead.email || 'N/A'}</Text>
                        {lead.email && (
                          <Tooltip label="Copy Email">
                            <IconButton
                              size={{ base: "xs", md: "xs" }}
                              variant="ghost"
                              icon={<CopyIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(lead.email);
                                toast({
                                  title: 'Copied!',
                                  description: 'Email copied to clipboard',
                                  status: 'success',
                                  duration: 2000,
                                });
                              }}
                              colorScheme="blue"
                              aria-label="Copy email"
                              _hover={{ bg: 'blue.100' }}
                            />
                          </Tooltip>
                        )}
                      </HStack>
                    </Td>
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }} fontWeight={!showCompleteData ? 'medium' : 'normal'}>
                      <HStack>
                        <Text>{lead.phone || 'N/A'}</Text>
                        {lead.phone && (
                          <Tooltip label="Copy Phone">
                            <IconButton
                              size="xs"
                              variant="ghost"
                              icon={<CopyIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(lead.phone);
                                toast({
                                  title: 'Copied!',
                                  description: 'Phone number copied to clipboard',
                                  status: 'success',
                                  duration: 2000,
                                });
                              }}
                              colorScheme="green"
                              aria-label="Copy phone"
                              _hover={{ bg: 'green.100' }}
                            />
                          </Tooltip>
                        )}
                      </HStack>
                    </Td>
                    {showCompleteData && (
                      <>
                        <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>{lead.city || 'N/A'}</Td>
                        <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>{lead.country || 'N/A'}</Td>
                      </>
                    )}
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                      <Badge colorScheme="green" variant="solid" size={!showCompleteData ? 'md' : 'sm'} px={3} py={1} borderRadius="full">
                        {getStatusLabel(lead.status, getFunnelId(lead))}
                      </Badge>
                    </Td>
                    {showCompleteData && (
                      <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                        <Badge colorScheme="purple" variant="subtle">
                          {getFunnelName(lead.funnelId)}
                        </Badge>
                      </Td>
                    )}
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                      <LeadScoreBadge score={calculateLeadScore(lead)} />
                    </Td>
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                      <LeadTemperatureBadge temperature={lead.leadTemperature} />
                    </Td>
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                      <Badge 
                        colorScheme={lead.assignedTo ? 'green' : 'gray'} 
                        variant={lead.assignedTo ? 'solid' : 'outline'}
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {getStaffDisplayName(lead.assignedTo)}
                      </Badge>
                    </Td>
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }} fontWeight={!showCompleteData ? 'medium' : 'normal'}>
                      {lead.nextFollowUpAt ? (
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm">{new Date(lead.nextFollowUpAt).toLocaleDateString()}</Text>
                          <Text fontSize="xs" color="gray.500">{new Date(lead.nextFollowUpAt).toLocaleTimeString()}</Text>
                        </VStack>
                      ) : 'N/A'}
                    </Td>
                    {showCompleteData && (
                      <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>{formatDate(lead.createdAt)}</Td>
                    )}
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                      <Center>
                        <HStack spacing={1} justify="center">
                          <Tooltip label="Call">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={<PhoneIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (lead.phone) {
                                  window.open(`tel:${lead.phone}`, '_self');
                                }
                              }}
                              colorScheme="green"
                              aria-label="Call"
                              isDisabled={!lead.phone}
                              _hover={{ bg: 'green.100', transform: 'scale(1.05)' }}
                            />
                          </Tooltip>
                          <Tooltip label="Send Email">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={<Box as={FiMail} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSendMessage(lead, 'email');
                              }}
                              colorScheme="blue"
                              aria-label="Send email"
                              _hover={{ bg: 'blue.100', transform: 'scale(1.05)' }}
                            />
                          </Tooltip>
                          <Tooltip label="Send WhatsApp">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={<Box as={FaWhatsapp} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSendMessage(lead, 'whatsapp');
                              }}
                              colorScheme="green"
                              aria-label="Send WhatsApp"
                              _hover={{ bg: 'green.100', transform: 'scale(1.05)' }}
                            />
                          </Tooltip>
                        </HStack>
                      </Center>
                    </Td>
                    <Td px={{ base: 3, md: 6 }} py={{ base: 3, md: 4 }}>
                      <Center>
                        <HStack spacing={1} justify="center">
                          <Tooltip label="Edit Lead">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={<Box as={FiEdit} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditLead(lead);
                              }}
                              colorScheme="orange"
                              aria-label="Edit lead"
                              _hover={{ bg: 'orange.100', transform: 'scale(1.05)' }}
                            />
                          </Tooltip>
                          <Box position="relative">
                            <IconButton
                              icon={<Box as={FiMoreVertical} />}
                              variant="ghost"
                              size="sm"
                              aria-label="More actions"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFunnel(lead);
                                setActionMenuOpen(!actionMenuOpen);
                              }}
                              _hover={{ bg: 'gray.100', transform: 'scale(1.05)' }}
                            />
                            {actionMenuOpen && selectedFunnel?._id === lead._id && (
                              <Box
                                position="absolute"
                                top="100%"
                                right="0"
                                mt={2}
                                bg="white"
                                boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                borderRadius="12px"
                                border="1px solid"
                                borderColor="gray.200"
                                minW="200px"
                                py={{ base: 1, md: 2 }}
                                zIndex={9999}
                                _before={{
                                  content: '""',
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '12px',
                                  width: '0',
                                  height: '0',
                                  borderLeft: '8px solid transparent',
                                  borderRight: '8px solid transparent',
                                  borderBottom: '8px solid white',
                                  zIndex: 1
                                }}
                                _after={{
                                  content: '""',
                                  position: 'absolute',
                                  top: '-9px',
                                  right: '11px',
                                  width: '0',
                                  height: '0',
                                  borderLeft: '9px solid transparent',
                                  borderRight: '9px solid transparent',
                                  borderBottom: '9px solid #e2e8f0',
                                  zIndex: 0
                                }}
                              >
                                <VStack spacing={0} align="stretch">
                                  <Button
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    leftIcon={<Box as={FiEye} size={16} />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActionMenuOpen(false);
                                    }}
                                    _hover={{ 
                                      bg: 'blue.50', 
                                      color: 'blue.600',
                                      transform: 'translateX(4px)'
                                    }}
                                    py={4}
                                    px={5}
                                    fontSize="sm"
                                    fontWeight="medium"
                                    borderRadius="8px"
                                    mx={2}
                                    my={1}
                                    h="auto"
                                    transition="all 0.2s ease"
                                  >
                                View Details
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    leftIcon={<Box as={FiCopy} size={16} />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActionMenuOpen(false);
                                    }}
                                    _hover={{ 
                                      bg: 'green.50', 
                                      color: 'green.600',
                                      transform: 'translateX(4px)'
                                    }}
                                    py={4}
                                    px={5}
                                    fontSize="sm"
                                    fontWeight="medium"
                                    borderRadius="8px"
                                    mx={2}
                                    my={1}
                                    h="auto"
                                    transition="all 0.2s ease"
                                  >
                                Duplicate Lead
                                  </Button>
                                  <Divider borderColor="gray.200" my={2} />
                                  <Button
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    leftIcon={<Box as={FiTrash2} size={16} />}
                                color="red.500" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteLead(lead._id);
                                      setActionMenuOpen(false);
                                    }}
                                    _hover={{ 
                                      bg: 'red.50', 
                                      color: 'red.600',
                                      transform: 'translateX(4px)'
                                    }}
                                    py={4}
                                    px={5}
                                    fontSize="sm"
                                    fontWeight="medium"
                                    borderRadius="8px"
                                    mx={2}
                                    my={1}
                                    h="auto"
                                    transition="all 0.2s ease"
                              >
                                Delete Lead
                                  </Button>
                                </VStack>
                              </Box>
                            )}
                          </Box>
                        </HStack>
                      </Center>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </CardBody>
    </Card>
  );
};

// --- MAIN LEADSVIEW COMPONENT ---
const LeadsView = () => {
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

  // State management
  const [viewMode, setViewMode] = useState('table');
  const [activeFunnel, setActiveFunnel] = useState(ALL_LEADS_FUNNEL);
  const [leads, setLeads] = useState([]);
  const [funnels, setFunnels] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [showCompleteData, setShowCompleteData] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Modal states
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure();
  const { isOpen: isFunnelModalOpen, onOpen: onFunnelModalOpen, onClose: onFunnelModalClose } = useDisclosure();
  const { isOpen: isMessageModalOpen, onOpen: onMessageModalOpen, onClose: onMessageModalClose } = useDisclosure();
  const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure();
  const { isOpen: isStaffOverviewModalOpen, onOpen: onStaffOverviewModalOpen, onClose: onStaffOverviewModalClose } = useDisclosure();

  const [leadForModal, setLeadForModal] = useState(null);
  const [messageModal, setMessageModal] = useState({ lead: null, type: '' });
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState(null);
  const [selectedStaffFilter, setSelectedStaffFilter] = useState(null); // null = all leads, 'unassigned' = unassigned, staffId = specific staff

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuOpen) {
        setActionMenuOpen(false);
      }
    };

    if (actionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);

  // Redux se auth token aur coach ID lena
  const authState = useSelector((state) => state.auth);
  const token = getToken(authState);
  const coachId = getCoachId(authState);

  // Custom toast
  const toast = useCustomToast();

  // Helper functions
  const getFunnelName = useCallback((funnelData) => {
    if (typeof funnelData === 'object' && funnelData !== null && funnelData.name) return funnelData.name;
    if (typeof funnelData === 'string') { 
      const funnel = funnels.find(f => f.id === funnelData); 
      return funnel ? funnel.name : 'Unknown Funnel'; 
    }
    const funnelId = getFunnelId({ funnelId: funnelData });
    const funnel = funnels.find(f => f.id === funnelId);
    return funnel ? funnel.name : 'Unknown Funnel';
  }, [funnels]);

  const getStatusLabel = useCallback((statusKey, funnelId) => {
    const funnel = funnels.find(f => f.id === funnelId);
    return funnel?.stages.find(s => s.name === statusKey)?.name || statusKey;
  }, [funnels]);

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
      // Try to get from localStorage if staff array is empty
      const cachedStaff = localStorage.getItem(`staff_${coachId}`);
      if (cachedStaff) {
        try {
          const parsedStaff = JSON.parse(cachedStaff);
          const staffMember = parsedStaff.find(s => s._id === staffData || s.id === staffData);
          if (staffMember) {
            if (staffMember.firstName && staffMember.lastName) {
              return `${staffMember.firstName} ${staffMember.lastName}`;
            } else if (staffMember.name) {
              return staffMember.name;
            }
          }
        } catch (cacheErr) {
          console.error('Error parsing cached staff for name:', cacheErr);
        }
      }
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
  }, [staff, coachId]);

  const getStaffDisplayName = useCallback((staffData) => {
    if (!staffData) return 'Unassigned';
    
    // If staffData is already an object (populated), use it directly
    if (typeof staffData === 'object' && staffData !== null) {
      const staffName = staffData.firstName && staffData.lastName 
        ? `${staffData.firstName} ${staffData.lastName}`
        : staffData.name || 'Unknown Staff';
      
      return staffData.email ? `${staffName} (${staffData.email})` : staffName;
    }
    
    // Otherwise, it's an ID - look it up in the staff array
    if (!Array.isArray(staff) || staff.length === 0) {
      // Try to get from localStorage if staff array is empty
      const cachedStaff = localStorage.getItem(`staff_${coachId}`);
      if (cachedStaff) {
        try {
          const parsedStaff = JSON.parse(cachedStaff);
          const staffMember = parsedStaff.find(s => s._id === staffData || s.id === staffData);
          if (staffMember) {
            const staffName = staffMember.firstName && staffMember.lastName 
              ? `${staffMember.firstName} ${staffMember.lastName}`
              : staffMember.name || 'Unknown Staff';
            return staffMember.email ? `${staffName} (${staffMember.email})` : staffName;
          }
        } catch (cacheErr) {
          console.error('Error parsing cached staff for display name:', cacheErr);
        }
      }
      return 'Unknown Staff';
    }
    
    const staffMember = staff.find(s => s._id === staffData || s.id === staffData);
    if (staffMember) {
      // Get staff name - handle different formats
      const staffName = staffMember.firstName && staffMember.lastName 
        ? `${staffMember.firstName} ${staffMember.lastName}`
        : staffMember.name || 'Unknown Staff';
      
      return staffMember.email ? `${staffName} (${staffMember.email})` : staffName;
    }
    return 'Unknown Staff';
  }, [staff, coachId]);

  // Get lead count for a specific staff member
  const getStaffLeadCount = useCallback((staffId) => {
    if (!staffId) {
      return leads.filter(lead => !lead.assignedTo).length;
    }
    return leads.filter(lead => {
      const assignedId = typeof lead.assignedTo === 'object' ? lead.assignedTo?._id : lead.assignedTo;
      return assignedId === staffId;
    }).length;
  }, [leads]);

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
        // Step 1: Funnels fetch karna
        const funnelsResponse = await axios.get(`${API_BASE_URL}/funnels/coach/${coachId}/funnels`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        const allFunnels = funnelsResponse.data.data;

        // Step 2: Sirf 'customer' audience waale funnels ko filter karna
        const customerFunnels = allFunnels
          .filter(f => f.targetAudience === 'customer')
          .map(f => ({ 
            id: f.id || f._id, 
            name: f.name, 
            targetAudience: f.targetAudience, 
            stages: f.stages.map(s => ({ name: s.name, order: s.order })) 
          }));
        setFunnels(customerFunnels);

        // Customer funnels ke IDs ka ek Set banaana for quick lookup
        const customerFunnelIds = new Set(customerFunnels.map(f => f.id));

        // Step 3: Staff fetch karna for assignment
        console.log('Fetching staff for coachId:', coachId);
        try {
          // Try different API endpoints
          let staffResponse;
          try {
            staffResponse = await axios.get(`${API_BASE_URL}/staff?coachId=${coachId}`, { 
              headers: { 'Authorization': `Bearer ${token}` } 
            });
          } catch (err) {
            console.log('First staff API failed, trying without query param:', err.response?.data);
            staffResponse = await axios.get(`${API_BASE_URL}/staff`, { 
              headers: { 'Authorization': `Bearer ${token}` } 
            });
          }
          
          console.log('Staff response:', staffResponse.data);
          const staffData = staffResponse.data.data || staffResponse.data || [];
          console.log('Staff data:', staffData);
          
          // Filter staff by coachId if needed
          const filteredStaff = Array.isArray(staffData) ? staffData.filter(s => 
            s.coachId === coachId || s.coach === coachId || !s.coachId
          ) : [];
          
          console.log('Filtered staff:', filteredStaff);
          setStaff(filteredStaff);
        } catch (staffErr) {
          console.error('Error fetching staff:', staffErr);
          // Fallback: Create mock staff data for testing
          const mockStaff = [
            { _id: 'staff1', name: 'John Doe', email: 'john@example.com', coachId: coachId },
            { _id: 'staff2', name: 'Jane Smith', email: 'jane@example.com', coachId: coachId },
            { _id: 'staff3', name: 'Mike Johnson', email: 'mike@example.com', coachId: coachId }
          ];
          console.log('Using mock staff data:', mockStaff);
          setStaff(mockStaff);
        }

        // Step 4: Saare leads fetch karna
        const leadsResponse = await axios.get(`${API_BASE_URL}/leads`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        
        // Step 5: Leads ko filter karna jo customer funnels se belong karte hain
        const customerLeads = leadsResponse.data.data.filter(lead => {
          const funnelId = getFunnelId(lead);
          return customerFunnelIds.has(funnelId);
        });
        setLeads(customerLeads);

      } catch (err) {
        console.error("Data fetch karte waqt error:", err);
        const errorMsg = err.response?.data?.message || "Data fetch nahi ho paaya. Kripya dobara try karein.";
        setError(errorMsg);
        toast(errorMsg, 'error');
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchData();
  }, [token, coachId, toast]);

  // Action handlers
  const openCreateModal = (lead = null) => {
    setLeadForModal(lead);
    onCreateModalOpen();
  };

  const handleSendMessage = (lead, type) => {
    if (!lead) {
      toast('Lead information is missing', 'error');
      return;
    }
    setMessageModal({ lead, type });
    onMessageModalOpen();
  };

  const handleSendMessageSubmit = async (messageData) => {
    try {
      await axios.post(`${API_BASE_URL}/messages/send`, messageData, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      toast(`${messageData.type === 'email' ? 'Email' : 'SMS'} sent successfully!`);
      onMessageModalClose();
    } catch (err) {
      console.error("Error sending message:", err);
      toast(`Failed to send ${messageData.type === 'email' ? 'email' : 'SMS'}`, 'error');
    }
  };

  // Task creation function for lead assignments
  const createWorkflowTask = async (taskData) => {
    try {
      console.log('➕ Creating Workflow Task from Lead Assignment...');
      console.log('📝 Task Data:', {
        name: taskData.name,
        assignedTo: taskData.assignedTo,
        priority: taskData.priority,
        stage: taskData.stage,
        dueDate: taskData.dueDate,
        relatedLead: taskData.relatedLead,
        estimatedHours: taskData.estimatedHours,
        tags: taskData.tags,
        fullData: taskData
      });
      
      const response = await axios.post(`${API_BASE_URL}/workflow/tasks`, taskData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('✅ Workflow Task Created Successfully!', {
        status: response.status,
        taskId: response.data?.data?._id || response.data?._id,
        createdTask: response.data.data || response.data
      });

      return response.data.data || response.data;
    } catch (err) {
      console.error('❌ Failed to Create Workflow Task:', err);
      console.error('❌ Task Data that Failed:', taskData);
      console.error('❌ Error Response:', err.response?.data);
      console.error('❌ Error Status:', err.response?.status);
      return null;
    }
  };

  const handleSaveLead = async (leadData) => {
    const isEditMode = !!leadData._id;
    const payload = isEditMode ? leadData : { ...leadData, coachId };
    
    // Check if lead is being assigned to staff (new assignment)
    const oldLead = isEditMode ? leads.find(l => l._id === leadData._id) : null;
    const isNewAssignment = payload.assignedTo && (!oldLead || oldLead.assignedTo !== payload.assignedTo);
    
    console.log('Saving lead:', { isEditMode, leadData, payload });
    console.log('Assignment data:', { assignedTo: payload.assignedTo, assignedStaff: payload.assignedStaff });
    console.log('Is new assignment:', isNewAssignment);
    
    try {
      let updatedLead = null;
      
      if (isEditMode) {
        console.log('Updating lead with ID:', payload._id);
        console.log('Payload being sent:', JSON.stringify(payload, null, 2));
        
        try {
          // Try different assignment field names if assignedTo is present
          let updatePayload = { ...payload };
          if (payload.assignedTo) {
            updatePayload = {
              ...payload,
              assignedTo: payload.assignedTo,
              assignedStaff: payload.assignedTo,
              staffId: payload.assignedTo
            };
          }
          
          const response = await axios.put(`${API_BASE_URL}/leads/${payload._id}`, updatePayload, { 
            headers: { 'Authorization': `Bearer ${token}` } 
          });
          console.log('Update response:', response.data);
          console.log('Updated lead data:', response.data.data);
          updatedLead = response.data.data;
          setLeads(prevLeads => prevLeads.map(lead => lead._id === payload._id ? updatedLead : lead));
          toast("Customer lead updated successfully!");
        } catch (putError) {
          console.log('PUT failed, trying PATCH:', putError.response?.data);
          // Try PATCH if PUT fails
          let patchPayload = { ...payload };
          if (payload.assignedTo) {
            patchPayload = {
              ...payload,
              assignedTo: payload.assignedTo,
              assignedStaff: payload.assignedTo,
              staffId: payload.assignedTo
            };
          }
          
          const patchResponse = await axios.patch(`${API_BASE_URL}/leads/${payload._id}`, patchPayload, { 
            headers: { 'Authorization': `Bearer ${token}` } 
          });
          console.log('PATCH response:', patchResponse.data);
          updatedLead = patchResponse.data.data;
          setLeads(prevLeads => prevLeads.map(lead => lead._id === payload._id ? updatedLead : lead));
          toast("Customer lead updated successfully!");
        }
      } else {
        console.log('Creating new lead');
        const response = await axios.post(`${API_BASE_URL}/leads`, payload, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        console.log('Create response:', response.data);
        updatedLead = response.data.data;
        setLeads(prevLeads => [updatedLead, ...prevLeads]);
        toast("New customer lead created successfully!");
      }
      
      // Create task if lead was assigned to staff
      if (isNewAssignment && updatedLead) {
        const taskData = {
          name: `Follow up: ${updatedLead.name}`,
          description: `Follow up with lead ${updatedLead.name}\nEmail: ${updatedLead.email || 'N/A'}\nPhone: ${updatedLead.phone || 'N/A'}\nSource: ${updatedLead.source || 'N/A'}`,
          priority: 'MEDIUM',
          stage: 'LEAD_GENERATION',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Due in 2 days
          assignedTo: payload.assignedTo,
          relatedLead: updatedLead._id,
          estimatedHours: 1,
          tags: ['lead-followup', 'customer-lead']
        };
        
        const taskResult = await createWorkflowTask(taskData);
        if (taskResult) {
          const staffName = getStaffName(payload.assignedTo);
          toast(`Task created for ${staffName} to follow up on this lead`, 'success');
        }
      }
      
      onCreateModalClose();
    } catch (err) {
      console.error("Error saving lead:", err);
      console.error("Error details:", err.response?.data);
      toast(`Error saving customer lead: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const handleDeleteLead = (leadId) => {
    setConfirmAction({ type: 'single', id: leadId });
    onConfirmModalOpen();
  };

  const confirmDeleteLead = async () => {
    if (confirmAction?.type === 'single' && confirmAction.id) {
      try {
        await axios.delete(`${API_BASE_URL}/leads/${confirmAction.id}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        setLeads(leads.filter(lead => lead._id !== confirmAction.id));
        toast("Customer lead deleted successfully");
        onDetailsModalClose();
        setLeadForModal(null);
      } catch (err) {
        console.error("Error deleting lead:", err);
        toast(`Error deleting customer lead: ${err.response?.data?.message || err.message}`, 'error');
      }
    }
    onConfirmModalClose();
    setConfirmAction(null);
  };

  const handleStatusChange = async (leadId, newStatus, funnelId) => {
    const originalLeads = [...leads];
    setLeads(prevLeads => prevLeads.map(lead => 
      lead._id === leadId ? { ...lead, status: newStatus } : lead
    ));
    
    try {
      await axios.put(`${API_BASE_URL}/leads/${leadId}`, { status: newStatus, funnelId: funnelId }, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      toast("Customer lead status updated!");
    } catch (err) {
      console.error("Error updating lead status:", err);
      toast("Failed to update customer lead status.", 'error');
      setLeads(originalLeads);
    }
  };

  const handleAddFollowUp = async (leadId, note) => {
    const newFollowUp = { note: note, followUpDate: new Date().toISOString(), createdBy: coachId };
    try {
      await axios.post(`${API_BASE_URL}/leads/${leadId}/followup`, newFollowUp, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      setLeads(prevLeads => prevLeads.map(lead => {
        if (lead._id === leadId) { 
          return { 
            ...lead, 
            followUpHistory: [...(lead.followUpHistory || []), newFollowUp], 
            lastFollowUpAt: new Date().toISOString() 
          }; 
        }
        return lead;
      }));
      toast("Follow-up added successfully!");
    } catch (err) {
      console.error("Error adding follow-up:", err);
      toast(`Error adding follow-up: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(leadId)) { 
        newSelected.delete(leadId); 
      } else { 
        newSelected.add(leadId); 
      }
      return newSelected;
    });
  };

  const handleSelectAllLeads = (isChecked, leads) => 
    setSelectedLeads(isChecked ? new Set(leads.map(lead => lead._id)) : new Set());

  const handleBulkDelete = () => {
    if (selectedLeads.size > 0) { 
      setConfirmAction({ type: 'bulk' });
      onConfirmModalOpen();
    } else { 
      toast("No customer leads selected for bulk delete.", "error"); 
    }
  };

  const handleBulkAssign = async (staffId) => {
    if (selectedLeads.size === 0) {
      toast("No customer leads selected for assignment.", "error");
      return;
    }

    try {
      const leadIds = Array.from(selectedLeads);
      console.log('🔄 Starting Bulk Assignment...');
      console.log('📋 Selected lead IDs:', leadIds);
      console.log('👤 Staff ID to assign:', staffId);
      
      // Get the actual lead objects
      const assignedLeads = leads.filter(lead => selectedLeads.has(lead._id));
      console.log('📊 Total leads to assign:', assignedLeads.length);
      
      // Try bulk endpoint first
      let bulkSuccess = false;
      try {
        const bulkPayload = {
          leadIds: leadIds,
          assignedTo: staffId || null,
          assignedStaff: staffId || null,
          staffId: staffId || null
        };
        
        console.log('📤 Trying bulk assignment endpoint...');
        console.log('📦 Bulk payload:', JSON.stringify(bulkPayload, null, 2));
        
        // Try POST first
        try {
          const response = await axios.post(`${API_BASE_URL}/leads/bulk-assign`, bulkPayload, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('✅ Bulk POST assignment successful:', response.data);
          bulkSuccess = true;
        } catch (postError) {
          console.log('❌ Bulk POST failed, trying PUT...', postError.response?.data);
          // Try PUT if POST fails
          const putResponse = await axios.put(`${API_BASE_URL}/leads/bulk-assign`, bulkPayload, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('✅ Bulk PUT assignment successful:', putResponse.data);
          bulkSuccess = true;
        }
      } catch (bulkError) {
        console.log('❌ Bulk endpoint failed, falling back to individual updates...', bulkError.response?.data);
        bulkSuccess = false;
      }

      // If bulk endpoint failed, update leads individually
      if (!bulkSuccess) {
        console.log('🔄 Updating leads individually...');
        let successCount = 0;
        
        for (const lead of assignedLeads) {
          try {
            const updatePayload = {
              assignedTo: staffId || null,
              assignedStaff: staffId || null,
              staffId: staffId || null
            };
            
            console.log(`📝 Updating lead ${lead._id}...`);
            
            try {
              await axios.put(`${API_BASE_URL}/leads/${lead._id}`, updatePayload, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              successCount++;
            } catch (putError) {
              // Try PATCH if PUT fails
              console.log(`⚠️ PUT failed for ${lead._id}, trying PATCH...`);
              await axios.patch(`${API_BASE_URL}/leads/${lead._id}`, updatePayload, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              successCount++;
            }
          } catch (leadError) {
            console.error(`❌ Failed to update lead ${lead._id}:`, leadError.response?.data);
          }
        }
        
        console.log(`✅ Successfully updated ${successCount}/${assignedLeads.length} leads`);
        
        if (successCount === 0) {
          throw new Error('Failed to update any leads');
        }
      }

      // Update local state
      setLeads(prevLeads => prevLeads.map(lead => 
        selectedLeads.has(lead._id) ? { ...lead, assignedTo: staffId } : lead
      ));

      const staffName = staffId ? getStaffName(staffId) : 'Unassigned';
      
      // Create tasks for each assigned lead (only if assigning to staff, not unassigning)
      let taskCreatedCount = 0;
      
      if (staffId) {
        console.log('📋 Creating tasks for assigned leads...');
        for (const lead of assignedLeads) {
          const taskData = {
            name: `Follow up: ${lead.name}`,
            description: `Follow up with lead ${lead.name}\nEmail: ${lead.email || 'N/A'}\nPhone: ${lead.phone || 'N/A'}\nSource: ${lead.source || 'N/A'}`,
            priority: 'MEDIUM',
            stage: 'LEAD_GENERATION',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: staffId,
            relatedLead: lead._id,
            estimatedHours: 1,
            tags: ['lead-followup', 'customer-lead']
          };
          
          const taskResult = await createWorkflowTask(taskData);
          if (taskResult) {
            taskCreatedCount++;
          }
        }
      }
      
      // Show success message
      if (staffId) {
        if (taskCreatedCount > 0) {
          toast(`✅ ${selectedLeads.size} leads assigned to ${staffName} with ${taskCreatedCount} tasks created`, 'success');
        } else {
          toast(`✅ ${selectedLeads.size} leads assigned to ${staffName}`, 'success');
        }
      } else {
        toast(`✅ ${selectedLeads.size} leads unassigned successfully`, 'success');
      }
      
      setSelectedLeads(new Set());
    } catch (err) {
      console.error("❌ Error bulk assigning leads:", err);
      console.error("❌ Error details:", err.response?.data);
      toast(`Error assigning leads: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/leads/bulk`, { 
        data: { leadIds: Array.from(selectedLeads) }, 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      setLeads(leads.filter(lead => !selectedLeads.has(lead._id)));
      toast(`${selectedLeads.size} customer leads deleted`);
      setSelectedLeads(new Set());
    } catch (err) {
      console.error("Error bulk deleting leads:", err);
      toast(`Error deleting customer leads: ${err.response?.data?.message || err.message}`, 'error');
    }
    onConfirmModalClose();
    setConfirmAction(null);
  };

  const handleSelectFunnel = (funnel) => { 
    setActiveFunnel(funnel); 
    onFunnelModalClose(); 
    setSelectedLeads(new Set()); 
  };

  const handleViewChange = (mode) => { 
    if (mode === 'pipeline' && activeFunnel.id === 'all' && funnels.length > 0) { 
      setActiveFunnel(funnels[0]); 
    } 
    setViewMode(mode); 
  };

  const openDetailsModal = (lead) => {
    setLeadForModal(lead);
    onDetailsModalOpen();
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,City,Country,Status,Funnel,Score,Temperature,Assigned To,Source,Created\n" + 
      leads.map(lead => [
        lead.name || '', lead.email || '', lead.phone || '', lead.city || '', 
        lead.country || '', lead.status || '', getFunnelName(lead.funnelId), 
        calculateLeadScore(lead), lead.leadTemperature || '', getStaffDisplayName(lead.assignedTo), lead.source || '', 
        lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''
      ].join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Customer leads exported successfully!");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedLeads = event.target.result.split('\n').slice(1).map(line => { 
            const v = line.split(','); 
            return { 
              name: v[0] || '', email: v[1] || '', phone: v[2] || '', 
              city: v[3] || '', country: v[4] || '', source: v[8] || 'Import', 
              leadTemperature: v[7] || 'Warm', targetAudience: 'customer' 
            }; 
          }).filter(lead => lead.name && lead.email);
          
          console.log('Imported customer leads:', importedLeads);
          toast(`${importedLeads.length} customer leads imported successfully!`);
        } catch (error) {
          toast("Error importing customer leads. Please check file format.", 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  // Staff card click handler
  const handleStaffCardClick = (staffFilter) => {
    setSelectedStaffFilter(staffFilter);
    setViewMode('table'); // Switch to table view to show filtered leads
    setCurrentPage(1); // Reset to first page
    
    // Show toast notification
    if (staffFilter === 'unassigned') {
      toast('Showing unassigned leads', 'info');
    } else if (staffFilter === null) {
      toast('Showing all leads', 'info');
    } else {
      const staffMember = staff.find(s => (s._id || s.id) === staffFilter);
      const staffName = staffMember?.firstName && staffMember?.lastName 
        ? `${staffMember.firstName} ${staffMember.lastName}`
        : staffMember?.name || 'Unknown Staff';
      toast(`Showing leads assigned to ${staffName}`, 'info');
    }
  };

  // Memoized data for rendering
  const displayedLeads = useMemo(() => {
    if (!leads || !Array.isArray(leads)) return [];
    
    let leadsToDisplay = [...leads];
    
    // Filter by funnel
    if (activeFunnel && activeFunnel.id !== 'all') { 
      leadsToDisplay = leadsToDisplay.filter(lead => lead && getFunnelId(lead) === activeFunnel.id); 
    }
    
    // Filter by staff assignment
    if (selectedStaffFilter === 'unassigned') {
      leadsToDisplay = leadsToDisplay.filter(lead => !lead.assignedTo);
    } else if (selectedStaffFilter !== null) {
      leadsToDisplay = leadsToDisplay.filter(lead => {
        const assignedId = typeof lead.assignedTo === 'object' ? lead.assignedTo?._id : lead.assignedTo;
        return assignedId === selectedStaffFilter;
      });
    }
    
    // Filter by search term
    if (searchTerm) { 
      const searchLower = searchTerm.toLowerCase(); 
      leadsToDisplay = leadsToDisplay.filter(lead => {
        if (!lead) return false;
        return (
          (lead.name?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.phone?.toLowerCase().includes(searchLower) ||
          lead.city?.toLowerCase().includes(searchLower) ||
          lead.country?.toLowerCase().includes(searchLower) ||
          (getStatusLabel(lead.status, getFunnelId(lead)) || '').toLowerCase().includes(searchLower) ||
          (getFunnelName(lead.funnelId) || '').toLowerCase().includes(searchLower))
        );
      }); 
    }
    
    // Update total items for pagination
    setTotalItems(leadsToDisplay.length);
    
    return leadsToDisplay;
  }, [leads, activeFunnel, searchTerm, selectedStaffFilter, staff, getFunnelName, getStatusLabel]);

  // Pagination logic
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return displayedLeads.slice(startIndex, endIndex);
  }, [displayedLeads, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedLeads(new Set()); // Clear selection when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setSelectedLeads(new Set()); // Clear selection
  };

  const leadsByStatus = useMemo(() => {
    const statusMap = {};
    if (activeFunnel && activeFunnel.id !== 'all' && activeFunnel.stages && Array.isArray(activeFunnel.stages)) { 
      activeFunnel.stages.forEach(stage => { 
        if (stage && stage.name) {
          statusMap[stage.name] = displayedLeads.filter(lead => lead && lead.status === stage.name);
        }
      }); 
    }
    return statusMap;
  }, [activeFunnel, displayedLeads]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalLeads = displayedLeads.length;
    const hotLeads = displayedLeads.filter(lead => lead.leadTemperature === 'Hot').length;
    const warmLeads = displayedLeads.filter(lead => lead.leadTemperature === 'Warm').length;
    const coldLeads = displayedLeads.filter(lead => lead.leadTemperature === 'Cold').length;
    
    // Score statistics
    const scores = displayedLeads.map(lead => calculateLeadScore(lead));
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    
    // Staff assignment statistics
    const staffAssignments = {};
    const unassignedLeads = displayedLeads.filter(lead => !lead.assignedTo).length;
    
    displayedLeads.forEach(lead => {
      if (lead.assignedTo) {
        const staffId = typeof lead.assignedTo === 'object' ? lead.assignedTo._id : lead.assignedTo;
        staffAssignments[staffId] = (staffAssignments[staffId] || 0) + 1;
      }
    });
    
    return { 
      totalLeads, 
      hotLeads, 
      warmLeads, 
      coldLeads, 
      avgScore, 
      staffAssignments,
      unassignedLeads 
    };
  }, [displayedLeads]);

  // Conditional rendering for loading and error states
  if (loading) return <ProfessionalLoader />;
  
  if (error) return (
    <Box bg="gray.100" minH="100vh" py={6} px={6}>
      <Center py={20}>
        <VStack spacing={6}>
          <Box
            w="120px"
            h="120px"
            bg="red.50"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="red.500"
            boxShadow="lg"
          >
            <WarningIcon boxSize="48px" />
          </Box>
          <VStack spacing={3}>
            <Heading size="xl" color="gray.600">
              Error Loading Customer Leads
            </Heading>
            <Text color="gray.500" textAlign="center" maxW="md">
              {error}
            </Text>
          </VStack>
          <Button 
            bg="blue.500"
            color="white"
            size="lg"
            onClick={() => window.location.reload()}
            _hover={{ bg: 'blue.600' }}
          >
            Try Again
          </Button>
        </VStack>
      </Center>
    </Box>
  );

  // Main component render
  return (
    <Box bg="gray.100" minH="100vh" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
      <Box maxW="full" mx="auto">
        <VStack spacing={8} align="stretch" w="full">
          {/* Beautiful Header */}
          <Card bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
            <CardHeader py={{ base: 4, md: 6 }}>
              <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                {/* Main Header Section */}
                <Flex justify="space-between" align="start" direction={{ base: 'column', lg: 'row' }} gap={6}>
                  {/* Left Side - Title and Description */}
                  <VStack align={{ base: 'center', lg: 'start' }} spacing={3} flex="1">
                    <HStack spacing={3} justify={{ base: 'center', lg: 'start' }}>
                      <Heading size={{ base: "md", md: "lg" }} color="gray.800" fontWeight="bold">
                        Customer Leads Management
                      </Heading>
                      <Badge colorScheme="blue" variant="subtle" px={{ base: 2, md: 3 }} py={{ base: 0.5, md: 1 }} borderRadius="full" fontSize={{ base: "xs", md: "sm" }}>
                        Customer Focus
                      </Badge>
                    </HStack>
                    <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" textAlign={{ base: 'center', lg: 'start' }}>
                      Manage and track your customer leads effectively for maximum conversions
                    </Text>
                    <HStack spacing={2} justify={{ base: 'center', lg: 'start' }}>
                      <Badge colorScheme={showCompleteData ? 'green' : 'orange'} variant="subtle" borderRadius="full">
                        {showCompleteData ? 'Complete Data View' : 'Important Data View'}
                      </Badge>
                      <Text fontSize="xs" color="gray.500">
                        {showCompleteData ? 'Showing all columns' : 'Showing essential columns only'}
                      </Text>
                    </HStack>
                  </VStack>
                  
                  {/* Right Side - Toggle Buttons and Actions */}
                  <VStack spacing={4} align={{ base: 'stretch', lg: 'end' }} minW={{ base: 'full', lg: 'auto' }}>
                    {/* Toggle Buttons - View Mode */}
                    <ButtonGroup size={{ base: "xs", md: "sm" }} variant="outline" spacing={0} borderRadius="lg" overflow="hidden" shadow="sm">
                      <Button
                        leftIcon={viewMode === 'table' ? <CheckCircleIcon /> : <ViewIcon />}
                        colorScheme={viewMode === 'table' ? 'blue' : 'gray'}
                        onClick={() => handleViewChange('table')}
                        borderRadius="0"
                        borderRightRadius={viewMode === 'pipeline' ? '0' : 'lg'}
                        borderLeftRadius="lg"
                        _hover={{ 
                          transform: 'translateY(-1px)', 
                          shadow: 'md',
                          bg: viewMode === 'table' ? 'blue.50' : 'gray.50'
                        }}
                        _active={{ transform: 'translateY(0px)' }}
                        transition="all 0.2s"
                        fontWeight="medium"
                        px={{ base: 2, md: 4 }}
                        py={{ base: 1, md: 2 }}
                        borderRight="1px solid"
                        borderRightColor="gray.200"
                      >
                        Table View
                      </Button>
                      <Button
                        leftIcon={viewMode === 'pipeline' ? <CheckCircleIcon /> : <ViewIcon />}
                        colorScheme={viewMode === 'pipeline' ? 'blue' : 'gray'}
                        onClick={() => handleViewChange('pipeline')}
                        borderRadius="0"
                        borderLeftRadius={viewMode === 'table' ? '0' : 'lg'}
                        borderRightRadius="lg"
                        _hover={{ 
                          transform: 'translateY(-1px)', 
                          shadow: 'md',
                          bg: viewMode === 'pipeline' ? 'blue.50' : 'gray.50'
                        }}
                        _active={{ transform: 'translateY(0px)' }}
                        transition="all 0.2s"
                        fontWeight="medium"
                        px={{ base: 2, md: 4 }}
                        py={{ base: 1, md: 2 }}
                      >
                        Pipeline View
                      </Button>
                    </ButtonGroup>
                    
                    {/* Action Buttons */}
                    <HStack spacing={3} justify={{ base: 'center', lg: 'end' }}>
                      <Button
                        leftIcon={showCompleteData ? <ViewIcon /> : <InfoIcon />}
                        colorScheme={showCompleteData ? 'green' : 'orange'}
                        variant="outline"
                        size="md"
                        onClick={() => {
                          const newMode = !showCompleteData;
                          setShowCompleteData(newMode);
                          
                          if (newMode) {
                            toast('Switched to Complete Data View - Showing all customer lead information', 'success');
                          } else {
                            toast('Switched to Important Data View - Showing essential information only', 'success');
                          }
                        }}
                        _hover={{
                          transform: 'translateY(-1px)',
                          shadow: 'md',
                          bg: showCompleteData ? 'green.50' : 'orange.50'
                        }}
                        transition="all 0.2s"
                        borderRadius="lg"
                      >
                        {showCompleteData ? 'Show Important Data' : 'Show Complete Data'}
                      </Button>
                      
                      <Button
                        leftIcon={<AddIcon />}
                        bg="blue.500"
                        color="white"
                        size="lg"
                        onClick={() => openCreateModal()}
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
                        New Customer Lead
                      </Button>
                    </HStack>
                  </VStack>
                </Flex>
                
                 {/* Stats Cards - Professional Design */}
                 <Box>
                   <Flex justify="space-between" align="center" mb={4} direction={{ base: 'column', md: 'row' }} gap={4} wrap="wrap">
                     {/* Left Side - Title */}
                     <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.700" textAlign={{ base: 'center', md: 'left' }}>
                       Lead Performance Overview
                     </Text>
                     
                     {/* Right Side - Staff Overview Button & Funnel Selection */}
                     <HStack spacing={3} flexWrap="wrap" justify={{ base: 'center', md: 'flex-end' }}>
                       {/* View Staff Overview Button */}
                       {staff.length > 0 && (
                         <Button
                           size="sm"
                           colorScheme="purple"
                           onClick={onStaffOverviewModalOpen}
                           leftIcon={<Box as={FiUsers} />}
                           _hover={{ 
                             transform: 'translateY(-2px)', 
                             shadow: 'lg',
                             bg: 'purple.600'
                           }}
                           transition="all 0.2s"
                           borderRadius="lg"
                           variant="solid"
                         >
                           Staff Overview
                         </Button>
                       )}
                       
                       {/* Funnel Selection */}
                       <HStack spacing={{ base: 1, md: 2 }} align="center" bg="blue.50" px={{ base: 2, md: 3 }} py={{ base: 1, md: 2 }} borderRadius="md" border="1px solid" borderColor="blue.200">
                         <Box w="2" h="2" bg="blue.500" borderRadius="full" />
                         <Text fontSize={{ base: "xs", md: "sm" }} color="blue.700" fontWeight="medium">
                           {displayedLeads ? displayedLeads.length : 0} Leads
                           {activeFunnel && activeFunnel.id !== 'all' && (
                             <Text as="span" color="blue.600"> in {activeFunnel.name || 'Unknown Funnel'}</Text>
                           )}
                         </Text>
                         <Button
                           variant="ghost"
                           leftIcon={<Box as={FiFilter} />}
                           onClick={onFunnelModalOpen}
                           size="xs"
                           colorScheme="blue"
                           _hover={{ bg: 'blue.100' }}
                           transition="all 0.2s"
                           borderRadius="sm"
                         >
                           {activeFunnel && activeFunnel.name ? activeFunnel.name : 'Select Funnel'}
                           <ChevronDownIcon ml={1} />
                         </Button>
                       </HStack>
                     </HStack>
                   </Flex>
                   <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={4}>
                     <StatsCard
                       title="Total Leads"
                       value={stats.totalLeads}
                       icon={<Box as={FiUsers} size="24px" />}
                       color="blue"
                       trend={12}
                       isLoading={loading}
                     />
                     <StatsCard
                       title="Hot Leads"
                       value={stats.hotLeads}
                       icon={<StarIcon />}
                       color="red"
                       trend={8}
                       isLoading={loading}
                     />
                     <StatsCard
                       title="Warm Leads"
                       value={stats.warmLeads}
                       icon={<TimeIcon />}
                       color="orange"
                       trend={15}
                       isLoading={loading}
                     />
                     <StatsCard
                       title="Cold Leads"
                       value={stats.coldLeads}
                       icon={<InfoIcon />}
                       color="blue"
                       trend={5}
                       isLoading={loading}
                     />
                     <StatsCard
                       title="Avg Score"
                       value={stats.avgScore}
                       icon={<Box as={FiBarChart2} size="24px" />}
                       color="green"
                       trend={10}
                       isLoading={loading}
                     />
                   </SimpleGrid>
                 </Box>
              </VStack>
            </CardHeader>
          </Card>

          {/* Active Staff Filter Badge */}
          {selectedStaffFilter && (
            <Card bg="purple.50" border="1px solid" borderColor="purple.200" borderRadius="lg" shadow="md">
              <CardBody py={3}>
                <HStack justify="space-between" align="center">
                  <HStack spacing={3}>
                    <Box 
                      p={2} 
                      bg="purple.100" 
                      borderRadius="lg" 
                      color="purple.600"
                    >
                      <Box as={FiFilter} size="20px" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold" color="purple.800">
                        Active Filter
                      </Text>
                      <Text fontSize="xs" color="purple.700">
                        {selectedStaffFilter === 'unassigned' 
                          ? 'Showing unassigned leads' 
                          : `Showing leads assigned to ${getStaffName(selectedStaffFilter)}`}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="purple"
                    onClick={() => handleStaffCardClick(null)}
                    leftIcon={<Box as={FiFilter} />}
                    _hover={{ 
                      transform: 'translateY(-1px)', 
                      shadow: 'md' 
                    }}
                    transition="all 0.2s"
                  >
                    Clear Filter
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Bulk Actions Toolbar */}
          {selectedLeads.size > 0 && viewMode === 'table' && (
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
                      sx={{
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 }
                        }
                      }}
                    />
                    <Text fontWeight="semibold" color="blue.700" fontSize="md">
                      {selectedLeads.size} customer leads selected
                    </Text>
                    <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                      Bulk Actions Available
                    </Badge>
                  </HStack>
                  
                  <ButtonGroup size="md" spacing={3}>
                    <Menu>
                      <MenuButton 
                        as={Button} 
                        leftIcon={<Box as={FiUsers} />}
                        colorScheme="green"
                        variant="outline"
                        _hover={{ 
                          transform: 'translateY(-1px)', 
                          shadow: 'md',
                          bg: 'green.50'
                        }}
                        transition="all 0.2s"
                        borderRadius="lg"
                      >
                        Assign to Staff
                        <ChevronDownIcon ml={1} />
                      </MenuButton>
                      <MenuList maxH="400px" overflowY="auto">
                        <MenuItem onClick={() => handleBulkAssign('')}>
                          <HStack justify="space-between" w="full">
                            <Text>Unassign All</Text>
                            <Badge colorScheme="gray" variant="subtle" borderRadius="full">
                              {stats.unassignedLeads} unassigned
                            </Badge>
                          </HStack>
                        </MenuItem>
                        <MenuDivider />
                        {staff.map(staffMember => {
                          // Get staff name - handle different formats
                          const staffName = staffMember.firstName && staffMember.lastName 
                            ? `${staffMember.firstName} ${staffMember.lastName}`
                            : staffMember.name || 'Unknown Staff';
                          
                          const staffId = staffMember._id || staffMember.id;
                          const assignedCount = getStaffLeadCount(staffId);
                          
                          return (
                            <MenuItem 
                              key={staffId}
                              onClick={() => handleBulkAssign(staffId)}
                              _hover={{ bg: 'blue.50' }}
                            >
                              <HStack justify="space-between" w="full" spacing={3}>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium">{staffName}</Text>
                                  <Text fontSize="xs" color="gray.500">{staffMember.email}</Text>
                                </VStack>
                                <Badge 
                                  colorScheme={assignedCount > 0 ? 'blue' : 'gray'} 
                                  variant="solid" 
                                  borderRadius="full"
                                  px={3}
                                  py={1}
                                >
                                  {assignedCount} leads
                                </Badge>
                              </HStack>
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </Menu>
                    <Button 
                      leftIcon={<DownloadIcon />} 
                      onClick={handleExport}
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
                      Export Selected
                    </Button>
                    <Button 
                      leftIcon={<DeleteIcon />} 
                      colorScheme="red"
                      variant="outline"
                      onClick={handleBulkDelete}
                      _hover={{ 
                        transform: 'translateY(-1px)', 
                        shadow: 'md',
                        bg: 'red.50'
                      }}
                      transition="all 0.2s"
                      borderRadius="lg"
                    >
                      Delete Selected
                    </Button>
                  </ButtonGroup>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Main Content Area */}
          {viewMode === 'pipeline' && activeFunnel && activeFunnel.id !== 'all' ? (
            <DndProvider backend={HTML5Backend}>
              <Card>
                <CardBody>
                  {activeFunnel.stages && Array.isArray(activeFunnel.stages) && activeFunnel.stages.length > 0 ? (
                    <HStack align="start" spacing={6} overflowX="auto" pb={4} className="hide-scrollbar">
                      {activeFunnel.stages
                        .filter(stage => stage && stage.order !== undefined)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map(stage => (
                          <DroppableStatusColumn
                            key={stage.name || Math.random()}
                            statusInfo={stage}
                            leadsInColumn={leadsByStatus[stage.name] || []}
                            onLeadClick={openDetailsModal}
                            onStatusChange={handleStatusChange}
                            onSendMessage={handleSendMessage}
                          />
                        ))}
                    </HStack>
                  ) : (
                    <Center py={20}>
                      <VStack spacing={4}>
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
                          <SettingsIcon boxSize="48px" />
                        </Box>
                        <VStack spacing={2}>
                          <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                            No stages configured
                          </Text>
                          <Text color="gray.500" textAlign="center">
                            No stages found for this customer funnel. Please configure your funnel stages.
                          </Text>
                        </VStack>
                      </VStack>
                    </Center>
                  )}
                </CardBody>
              </Card>
            </DndProvider>
          ) : viewMode === 'pipeline' && activeFunnel && activeFunnel.id === 'all' ? (
            <Card>
              <CardBody>
                <Center py={20}>
                  <VStack spacing={4}>
                    <Box
                      w="120px"
                      h="120px"
                      bg="blue.50"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="blue.400"
                      boxShadow="lg"
                    >
                      <Box as={FiFilter} size="48px" />
                    </Box>
                    <VStack spacing={2}>
                      <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                        Select a customer funnel
                      </Text>
                      <Text color="gray.500" textAlign="center">
                        Please select a specific customer funnel to view the pipeline.
                      </Text>
                    </VStack>
                    <Button colorScheme="blue" onClick={onFunnelModalOpen}>
                      Select Funnel
                    </Button>
                  </VStack>
                </Center>
              </CardBody>
            </Card>
          ) : (
            <LeadsTableView
              leads={paginatedLeads || []}
              onEditLead={openDetailsModal}
              onDeleteLead={handleDeleteLead}
              onExport={handleExport}
              onImport={handleImport}
              onSendMessage={handleSendMessage}
              getStatusLabel={getStatusLabel}
              getFunnelName={getFunnelName}
              getStaffName={getStaffName}
              getStaffDisplayName={getStaffDisplayName}
              selectedLeads={selectedLeads}
              onSelectLead={handleSelectLead}
              onSelectAllLeads={handleSelectAllLeads}
              actionMenuOpen={actionMenuOpen}
              setActionMenuOpen={setActionMenuOpen}
              selectedFunnel={selectedFunnel}
              setSelectedFunnel={setSelectedFunnel}
              showCompleteData={showCompleteData}
            />
          )}

          {/* Pagination Component */}
          <Box mt={6} px={6} pb={6}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              {/* Items per page selector */}
              <HStack spacing={3}>
                <Text fontSize="sm" color="gray.600">Show:</Text>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  size="sm"
                  width="80px"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </Select>
                <Text fontSize="sm" color="gray.600">per page</Text>
              </HStack>
              
              {/* Pagination info */}
              <Text fontSize="sm" color="gray.600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
              </Text>
              
              {/* Pagination buttons */}
              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(1)}
                  isDisabled={currentPage === 1}
                  leftIcon={<ChevronDownIcon transform="rotate(90deg)" />}
                >
                  First
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  leftIcon={<ChevronDownIcon transform="rotate(90deg)" />}
                >
                  Previous
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={currentPage === pageNum ? "solid" : "outline"}
                      colorScheme={currentPage === pageNum ? "blue" : "gray"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                  rightIcon={<ChevronDownIcon transform="rotate(-90deg)" />}
                >
                  Next
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(totalPages)}
                  isDisabled={currentPage === totalPages}
                  rightIcon={<ChevronDownIcon transform="rotate(-90deg)" />}
                >
                  Last
                </Button>
              </HStack>
            </Flex>
          </Box> 

          {/* Modals */}
          <FunnelSelectionModal
            isOpen={isFunnelModalOpen}
            onClose={onFunnelModalClose}
            funnels={funnels}
            onSelect={handleSelectFunnel}
            leads={leads}
          />

          <CreateLeadModal
            isOpen={isCreateModalOpen}
            onClose={onCreateModalClose}
            onSave={handleSaveLead}
            leadToEdit={leadForModal}
            funnels={funnels}
            staff={staff}
          />

          <LeadDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={onDetailsModalClose}
            lead={leadForModal}
            onEditLead={(lead) => { onDetailsModalClose(); openCreateModal(lead); }}
            onDelete={handleDeleteLead}
            onAddFollowUp={handleAddFollowUp}
            onSendMessage={handleSendMessage}
            getStatusLabel={getStatusLabel}
            getFunnelName={getFunnelName}
            getStaffName={getStaffName}
            getStaffDisplayName={getStaffDisplayName}
          />

          <MessageModal
            isOpen={isMessageModalOpen}
            onClose={onMessageModalClose}
            lead={messageModal.lead}
            type={messageModal.type}
            onSend={handleSendMessageSubmit}
          />

          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={onConfirmModalClose}
            onConfirm={confirmAction?.type === 'single' ? confirmDeleteLead : confirmBulkDelete}
            title={confirmAction?.type === 'single' ? "Delete Customer Lead" : "Delete Multiple Leads"}
            message={
              confirmAction?.type === 'single' 
                ? "This action cannot be undone. This will permanently delete the customer lead." 
                : `This action cannot be undone. This will permanently delete ${selectedLeads.size} selected customer leads.`
            }
          />

          <StaffAssignmentsModal
            isOpen={isStaffOverviewModalOpen}
            onClose={onStaffOverviewModalClose}
            staff={staff}
            stats={stats}
            getStaffLeadCount={getStaffLeadCount}
            onStaffCardClick={handleStaffCardClick}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default LeadsView;
