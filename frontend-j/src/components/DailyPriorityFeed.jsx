import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Flex,
  Spinner,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import {
  FaBell,
  FaCalendar,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFire,
  FaArrowRight,
  FaFilter,
  FaSyncAlt,
  FaEye,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaTasks,
  FaChartLine,
} from 'react-icons/fa';
import { FiMoreVertical, FiRefreshCw } from 'react-icons/fi';

import { API_BASE_URL } from '../config/apiConfig';

const DailyPriorityFeed = ({ token, coachId, onItemClick }) => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  
  // State
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, appointments, followups, leads, alerts
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Priority colors
  const getPriorityColor = (priority) => {
    if (priority === 0) return 'red';
    if (priority <= 1.5) return 'orange';
    if (priority <= 2) return 'yellow';
    if (priority <= 3) return 'blue';
    return 'gray';
  };
  
  // Type icons
  const getTypeIcon = (type) => {
    const iconMap = {
      'Appointment': FaCalendar,
      'Overdue Follow-up': FaExclamationTriangle,
      'New Lead': FaUser,
      'Follow-up Today': FaClock,
      'New Hot Lead': FaFire,
      'Stale Lead - Re-engage': FaUser,
      'Recent Lead': FaUser,
    };
    return iconMap[type] || FaBell;
  };
  
  // Type colors
  const getTypeColor = (type) => {
    const colorMap = {
      'Appointment': 'purple',
      'Overdue Follow-up': 'red',
      'New Lead': 'green',
      'Follow-up Today': 'yellow',
      'New Hot Lead': 'orange',
      'Stale Lead - Re-engage': 'gray',
      'Recent Lead': 'blue',
    };
    return colorMap[type] || 'gray';
  };
  
  // Load feed data
  const loadFeed = async (isRefresh = false) => {
    if (!token || !coachId) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/coach/daily-feed`, {
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
          setFeedItems(data.data || []);
        } else {
          setFeedItems([]);
        }
      } else {
        console.error('Failed to load daily feed:', response.status);
        setFeedItems([]);
      }
    } catch (error) {
      console.error('Error loading daily feed:', error);
      setFeedItems([]);
      toast({
        title: 'Error',
        description: 'Failed to load daily priority feed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadFeed();
  }, [token, coachId]);
  
  // Filter items
  const filteredItems = feedItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'appointments') return item.type === 'Appointment';
    if (filter === 'followups') return item.type.includes('Follow-up');
    if (filter === 'leads') return item.type.includes('Lead');
    if (filter === 'alerts') return item.priority <= 1.5;
    return true;
  });
  
  // Group by priority
  const groupedItems = filteredItems.reduce((acc, item) => {
    const priorityGroup = item.priority <= 1.5 ? 'urgent' : 
                         item.priority <= 2 ? 'high' : 
                         item.priority <= 3 ? 'medium' : 'low';
    if (!acc[priorityGroup]) acc[priorityGroup] = [];
    acc[priorityGroup].push(item);
    return acc;
  }, {});
  
  // Handle item click
  const handleItemClick = (item, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSelectedItem(item);
    onOpen();
    // Don't call onItemClick here - let the modal handle navigation via action buttons
  };
  
  // Handle action
  const handleAction = (item, action) => {
    onClose();
    
    switch (action) {
      case 'view-lead':
        if (item.leadId) {
          navigate(`/dashboard/leads?leadId=${item.leadId}`);
        }
        break;
      case 'view-appointment':
        if (item.appointmentId) {
          navigate(`/dashboard/calendar?appointmentId=${item.appointmentId}`);
        }
        break;
      case 'create-task':
        navigate(`/dashboard/tasks?create=true&relatedLead=${item.leadId || ''}`);
        break;
      case 'send-message':
        if (item.leadId) {
          navigate(`/dashboard/inbox?leadId=${item.leadId}`);
        }
        break;
      default:
        break;
    }
  };
  
  // Format time
  const formatTime = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };
  
  if (loading) {
    return (
      <Card bg={cardBg} boxShadow="md" border="1px" borderColor={borderColor}>
        <CardBody>
          <Flex justify="center" align="center" py={8}>
            <Spinner size="lg" color="blue.500" />
          </Flex>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <>
      <Card bg={cardBg} boxShadow="lg" border="1px" borderColor={borderColor} borderRadius="xl">
        <CardHeader pb={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={FaBell} boxSize={6} color="orange.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  Daily Priority Feed
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  {filteredItems.length} items requiring attention
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={2}>
              <Menu>
                <MenuButton as={Button} size="sm" variant="outline" leftIcon={<FaFilter />}>
                  Filter
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setFilter('all')}>All Items</MenuItem>
                  <MenuItem onClick={() => setFilter('appointments')}>Appointments</MenuItem>
                  <MenuItem onClick={() => setFilter('followups')}>Follow-ups</MenuItem>
                  <MenuItem onClick={() => setFilter('leads')}>Leads</MenuItem>
                  <MenuItem onClick={() => setFilter('alerts')}>Alerts</MenuItem>
                </MenuList>
              </Menu>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={refreshing ? <Spinner size="xs" /> : <FiRefreshCw />}
                onClick={() => loadFeed(true)}
                isLoading={refreshing}
              >
                Refresh
              </Button>
            </HStack>
          </Flex>
        </CardHeader>
        
        <CardBody pt={0}>
          <Tabs colorScheme="orange" variant="enclosed">
            <TabList>
              <Tab>All ({filteredItems.length})</Tab>
              <Tab>Urgent ({groupedItems.urgent?.length || 0})</Tab>
              <Tab>High ({groupedItems.high?.length || 0})</Tab>
              <Tab>Medium ({groupedItems.medium?.length || 0})</Tab>
            </TabList>
            
            <TabPanels>
              {/* All Items Tab */}
              <TabPanel px={0} pt={4}>
                <VStack spacing={3} align="stretch" maxH="600px" overflowY="auto">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => {
                      const TypeIcon = getTypeIcon(item.type);
                      const typeColor = getTypeColor(item.type);
                      const priorityColor = getPriorityColor(item.priority);
                      
                      return (
                        <Box
                          key={index}
                          p={4}
                          borderRadius="lg"
                          border="1px"
                          borderColor={borderColor}
                          bg={cardBg}
                          _hover={{ 
                            bg: hoverBg, 
                            borderColor: `${typeColor}.300`,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                          transition="all 0.2s"
                          cursor="pointer"
                          onClick={(e) => handleItemClick(item, e)}
                        >
                          <HStack spacing={4} align="start">
                            <Box
                              p={2}
                              borderRadius="lg"
                              bg={`${typeColor}.100`}
                              color={`${typeColor}.600`}
                            >
                              <Icon as={TypeIcon} boxSize={5} />
                            </Box>
                            
                            <VStack align="start" spacing={1} flex={1}>
                              <HStack spacing={2}>
                                <Text fontWeight="bold" color={textColor} fontSize="sm">
                                  {item.title}
                                </Text>
                                <Badge colorScheme={priorityColor} size="sm">
                                  P{item.priority}
                                </Badge>
                                <Badge colorScheme={typeColor} variant="outline" size="sm">
                                  {item.type}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color={mutedTextColor}>
                                {item.description}
                              </Text>
                              {item.leadName && (
                                <HStack spacing={2} mt={1}>
                                  <Avatar size="xs" name={item.leadName} />
                                  <Text fontSize="xs" color={mutedTextColor}>
                                    {item.leadName}
                                  </Text>
                                </HStack>
                              )}
                              {(item.nextFollowUpAt || item.startTime || item.createdAt) && (
                                <Text fontSize="xs" color={mutedTextColor}>
                                  <Icon as={FaClock} boxSize={2} mr={1} />
                                  {formatTime(item.nextFollowUpAt || item.startTime || item.createdAt)}
                                </Text>
                              )}
                            </VStack>
                            
                            <Icon as={FaArrowRight} color={mutedTextColor} />
                          </HStack>
                        </Box>
                      );
                    })
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Icon as={FaCheckCircle} boxSize={12} color="green.300" mb={3} />
                      <Text color={mutedTextColor} fontWeight="semibold">
                        All caught up! No priority items.
                      </Text>
                      <Text fontSize="sm" color={mutedTextColor} mt={1}>
                        Great job staying on top of everything.
                      </Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
              
              {/* Urgent Tab */}
              <TabPanel px={0} pt={4}>
                <VStack spacing={3} align="stretch" maxH="600px" overflowY="auto">
                  {groupedItems.urgent?.length > 0 ? (
                    groupedItems.urgent.map((item, index) => {
                      const TypeIcon = getTypeIcon(item.type);
                      const typeColor = getTypeColor(item.type);
                      
                      return (
                        <Box
                          key={index}
                          p={4}
                          borderRadius="lg"
                          border="2px"
                          borderColor="red.300"
                          bg="red.50"
                          _hover={{ 
                            bg: 'red.100', 
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                          }}
                          transition="all 0.2s"
                          cursor="pointer"
                          onClick={(e) => handleItemClick(item, e)}
                        >
                          <HStack spacing={4} align="start">
                            <Box
                              p={2}
                              borderRadius="lg"
                              bg="red.200"
                              color="red.700"
                            >
                              <Icon as={TypeIcon} boxSize={5} />
                            </Box>
                            <VStack align="start" spacing={1} flex={1}>
                              <Text fontWeight="bold" color="red.800" fontSize="sm">
                                {item.title}
                              </Text>
                              <Text fontSize="xs" color="red.600">
                                {item.description}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                      );
                    })
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Text color={mutedTextColor}>No urgent items</Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
              
              {/* High Priority Tab */}
              <TabPanel px={0} pt={4}>
                <VStack spacing={3} align="stretch" maxH="600px" overflowY="auto">
                  {groupedItems.high?.map((item, index) => {
                    const TypeIcon = getTypeIcon(item.type);
                    const typeColor = getTypeColor(item.type);
                    
                    return (
                      <Box
                        key={index}
                        p={4}
                        borderRadius="lg"
                        border="1px"
                        borderColor={borderColor}
                        bg={cardBg}
                        _hover={{ 
                          bg: hoverBg,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <HStack spacing={4} align="start">
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg={`${typeColor}.100`}
                            color={`${typeColor}.600`}
                          >
                            <Icon as={TypeIcon} boxSize={5} />
                          </Box>
                          <VStack align="start" spacing={1} flex={1}>
                            <Text fontWeight="bold" color={textColor} fontSize="sm">
                              {item.title}
                            </Text>
                            <Text fontSize="xs" color={mutedTextColor}>
                              {item.description}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    );
                  }) || (
                    <Box textAlign="center" py={8}>
                      <Text color={mutedTextColor}>No high priority items</Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
              
              {/* Medium Priority Tab */}
              <TabPanel px={0} pt={4}>
                <VStack spacing={3} align="stretch" maxH="600px" overflowY="auto">
                  {groupedItems.medium?.map((item, index) => {
                    const TypeIcon = getTypeIcon(item.type);
                    const typeColor = getTypeColor(item.type);
                    
                    return (
                      <Box
                        key={index}
                        p={4}
                        borderRadius="lg"
                        border="1px"
                        borderColor={borderColor}
                        bg={cardBg}
                        _hover={{ 
                          bg: hoverBg,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <HStack spacing={4} align="start">
                          <Box
                            p={2}
                            borderRadius="lg"
                            bg={`${typeColor}.100`}
                            color={`${typeColor}.600`}
                          >
                            <Icon as={TypeIcon} boxSize={5} />
                          </Box>
                          <VStack align="start" spacing={1} flex={1}>
                            <Text fontWeight="bold" color={textColor} fontSize="sm">
                              {item.title}
                            </Text>
                            <Text fontSize="xs" color={mutedTextColor}>
                              {item.description}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    );
                  }) || (
                    <Box textAlign="center" py={8}>
                      <Text color={mutedTextColor}>No medium priority items</Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
      
      {/* Item Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedItem?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItem && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="sm" color={mutedTextColor} mb={1}>Type</Text>
                  <Badge colorScheme={getTypeColor(selectedItem.type)}>
                    {selectedItem.type}
                  </Badge>
                </Box>
                <Box>
                  <Text fontSize="sm" color={mutedTextColor} mb={1}>Priority</Text>
                  <Badge colorScheme={getPriorityColor(selectedItem.priority)}>
                    Priority {selectedItem.priority}
                  </Badge>
                </Box>
                <Box>
                  <Text fontSize="sm" color={mutedTextColor} mb={1}>Description</Text>
                  <Text color={textColor}>{selectedItem.description}</Text>
                </Box>
                {selectedItem.leadName && (
                  <Box>
                    <Text fontSize="sm" color={mutedTextColor} mb={1}>Lead</Text>
                    <Text color={textColor}>{selectedItem.leadName}</Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            {selectedItem?.leadId && (
              <Button
                colorScheme="blue"
                leftIcon={<FaEye />}
                onClick={() => handleAction(selectedItem, 'view-lead')}
              >
                View Lead
              </Button>
            )}
            {selectedItem?.appointmentId && (
              <Button
                colorScheme="purple"
                leftIcon={<FaCalendar />}
                onClick={() => handleAction(selectedItem, 'view-appointment')}
              >
                View Appointment
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DailyPriorityFeed;

