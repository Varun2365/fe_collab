import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Avatar,
  Icon,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiDownload,
  FiCalendar,
  FiActivity,
  FiTarget,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PersonalProgressTracking = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Load clients from localStorage on mount
  useEffect(() => {
    const savedClients = localStorage.getItem('fitnessClients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Initialize with sample data
      const initialClients = [
        {
          id: 1,
          name: 'Alex Johnson',
          email: 'alex@example.com',
          phone: '+1 234-567-8900',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          status: 'active',
          currentWeight: 75,
          targetWeight: 70,
          height: 175,
          weightLost: 5,
          bmi: 24.2,
          bodyFat: 18.5,
          joinDate: '2024-01-15',
          lastCheckIn: '2024-03-20',
          adherence: 87,
          totalWorkouts: 45,
          totalMeals: 180,
          weightHistory: [
            { date: '2024-01-15', weight: 80 },
            { date: '2024-02-01', weight: 78 },
            { date: '2024-02-15', weight: 77 },
            { date: '2024-03-01', weight: 76 },
            { date: '2024-03-15', weight: 75 },
            { date: '2024-03-20', weight: 75 },
          ],
          measurements: [
            { date: '2024-01-15', chest: 100, waist: 85, hips: 95, arms: 32 },
            { date: '2024-02-15', chest: 98, waist: 82, hips: 93, arms: 31 },
            { date: '2024-03-15', chest: 96, waist: 80, hips: 91, arms: 30 },
          ],
        },
        {
          id: 2,
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          phone: '+1 234-567-8901',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          status: 'active',
          currentWeight: 68,
          targetWeight: 65,
          height: 165,
          weightLost: 3,
          bmi: 22.8,
          bodyFat: 22.1,
          joinDate: '2024-02-01',
          lastCheckIn: '2024-03-19',
          adherence: 92,
          totalWorkouts: 52,
          totalMeals: 195,
          weightHistory: [
            { date: '2024-02-01', weight: 71 },
            { date: '2024-02-15', weight: 70 },
            { date: '2024-03-01', weight: 69 },
            { date: '2024-03-15', weight: 68 },
            { date: '2024-03-19', weight: 68 },
          ],
          measurements: [
            { date: '2024-02-01', chest: 90, waist: 75, hips: 95, arms: 28 },
            { date: '2024-03-01', chest: 89, waist: 73, hips: 93, arms: 27 },
            { date: '2024-03-15', chest: 88, waist: 72, hips: 92, arms: 27 },
          ],
        },
      ];
      setClients(initialClients);
      localStorage.setItem('fitnessClients', JSON.stringify(initialClients));
    }
  }, []);

  // Save to localStorage whenever clients change
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('fitnessClients', JSON.stringify(clients));
    }
  }, [clients]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const handleAddClient = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      currentWeight: '',
      targetWeight: '',
      height: '',
      joinDate: new Date().toISOString().split('T')[0],
    });
    setSelectedClient(null);
    onOpen();
  };

  const handleEditClient = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      currentWeight: client.currentWeight,
      targetWeight: client.targetWeight,
      height: client.height,
      joinDate: client.joinDate,
    });
    setSelectedClient(client);
    onEditOpen();
  };

  const handleSaveClient = () => {
    if (!formData.name || !formData.email || !formData.currentWeight || !formData.targetWeight || !formData.height) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const currentWeight = parseFloat(formData.currentWeight);
    const targetWeight = parseFloat(formData.targetWeight);
    const height = parseFloat(formData.height);
    const initialWeight = selectedClient?.weightHistory?.[0]?.weight || currentWeight;
    const weightLost = initialWeight - currentWeight;
    const bmi = calculateBMI(currentWeight, height);

    if (selectedClient) {
      // Update existing client
      const updatedClients = clients.map(client => {
        if (client.id === selectedClient.id) {
          return {
            ...client,
            ...formData,
            currentWeight,
            targetWeight,
            height,
            weightLost: Math.max(0, weightLost),
            bmi: parseFloat(bmi),
            weightHistory: client.weightHistory || [],
            measurements: client.measurements || [],
          };
        }
        return client;
      });
      setClients(updatedClients);
      toast({
        title: 'Client Updated',
        description: `${formData.name} has been updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
    } else {
      // Add new client
      const newClient = {
        id: Date.now(),
        ...formData,
        currentWeight,
        targetWeight,
        height,
        weightLost: 0,
        bmi: parseFloat(bmi),
        bodyFat: 20,
        status: 'active',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=667eea&color=fff`,
        lastCheckIn: new Date().toISOString().split('T')[0],
        adherence: 0,
        totalWorkouts: 0,
        totalMeals: 0,
        weightHistory: [{ date: new Date().toISOString().split('T')[0], weight: currentWeight }],
        measurements: [],
      };
      setClients([...clients, newClient]);
      toast({
        title: 'Client Added',
        description: `${formData.name} has been added successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      currentWeight: '',
      targetWeight: '',
      height: '',
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (window.confirm(`Are you sure you want to delete ${client?.name}?`)) {
      setClients(clients.filter(c => c.id !== clientId));
      toast({
        title: 'Client Deleted',
        description: `${client?.name} has been deleted`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddWeightEntry = (clientId, weight) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const newEntry = {
          date: new Date().toISOString().split('T')[0],
          weight: parseFloat(weight),
        };
        const updatedHistory = [...(client.weightHistory || []), newEntry].sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        const initialWeight = updatedHistory[0]?.weight || weight;
        const currentWeight = updatedHistory[updatedHistory.length - 1]?.weight || weight;
        return {
          ...client,
          currentWeight,
          weightLost: initialWeight - currentWeight,
          weightHistory: updatedHistory,
          lastCheckIn: new Date().toISOString().split('T')[0],
        };
      }
      return client;
    });
    setClients(updatedClients);
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    onDetailOpen();
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalWeightLost = clients.reduce((sum, c) => sum + (c.weightLost || 0), 0);
  const avgAdherence = clients.length > 0 
    ? Math.round(clients.reduce((sum, c) => sum + (c.adherence || 0), 0) / clients.length)
    : 0;

  // Prepare chart data
  const getWeightChartData = (client) => {
    if (!client?.weightHistory || client.weightHistory.length === 0) return [];
    return client.weightHistory.map((entry, index) => ({
      week: `Week ${index + 1}`,
      date: entry.date,
      weight: entry.weight,
      target: client.targetWeight,
    }));
  };

  const getMeasurementChartData = (client) => {
    if (!client?.measurements || client.measurements.length === 0) return [];
    return client.measurements.map((entry, index) => ({
      date: `Month ${index + 1}`,
      chest: entry.chest,
      waist: entry.waist,
      hips: entry.hips,
      arms: entry.arms,
    }));
  };

  return (
    <Box p={6}>
      {/* Header */}
      <VStack align="stretch" spacing={6} mb={8}>
        <HStack justify="space-between">
          <Box>
            <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={2}>
              Personal Progress Tracking
            </Text>
            <Text color="gray.600" fontSize="sm" fontWeight="500">
              Monitor and track all your clients' fitness progress
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button
              leftIcon={<FiDownload />}
              variant="outline"
              borderRadius="xl"
              fontWeight="700"
            >
              Export Report
            </Button>
            <Button
              leftIcon={<FiPlus />}
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
              borderRadius="xl"
              fontWeight="700"
              onClick={handleAddClient}
            >
              Add Client
            </Button>
          </HStack>
        </HStack>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <motion.div whileHover={{ scale: 1.02, y: -4 }}>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={5}>
                <HStack justify="space-between" mb={3}>
                  <Box
                    w="48px"
                    h="48px"
                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiActivity} boxSize={6} color="white" />
                  </Box>
                  <Badge bg="#10B981" color="white" borderRadius="full" px={2.5} py={1} fontSize="xs" fontWeight="700">
                    {activeClients} Active
                  </Badge>
                </HStack>
                <Text fontSize="2xl" fontWeight="800" color="gray.900">{totalClients}</Text>
                <Text fontSize="sm" color="gray.600" fontWeight="600">Total Clients</Text>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }}>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={5}>
                <HStack justify="space-between" mb={3}>
                  <Box
                    w="48px"
                    h="48px"
                    bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiTrendingDown} boxSize={6} color="white" />
                  </Box>
                  <Icon as={FiTrendingDown} boxSize={5} color="#10B981" />
                </HStack>
                <Text fontSize="2xl" fontWeight="800" color="gray.900">{totalWeightLost.toFixed(1)}kg</Text>
                <Text fontSize="sm" color="gray.600" fontWeight="600">Total Weight Lost</Text>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }}>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={5}>
                <HStack justify="space-between" mb={3}>
                  <Box
                    w="48px"
                    h="48px"
                    bgGradient="linear(135deg, #F59E0B 0%, #D97706 100%)"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiTarget} boxSize={6} color="white" />
                  </Box>
                  <Icon as={FiTrendingUp} boxSize={5} color="#F59E0B" />
                </HStack>
                <Text fontSize="2xl" fontWeight="800" color="gray.900">{avgAdherence}%</Text>
                <Text fontSize="sm" color="gray.600" fontWeight="600">Avg Adherence</Text>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }}>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={5}>
                <HStack justify="space-between" mb={3}>
                  <Box
                    w="48px"
                    h="48px"
                    bgGradient="linear(135deg, #3B82F6 0%, #2563EB 100%)"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiCalendar} boxSize={6} color="white" />
                  </Box>
                  <Badge bg="#EF4444" color="white" borderRadius="full" px={2.5} py={1} fontSize="xs" fontWeight="700">
                    {clients.filter(c => {
                      const lastCheckIn = new Date(c.lastCheckIn);
                      const today = new Date();
                      const diffDays = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
                      return diffDays <= 1;
                    }).length} Today
                  </Badge>
                </HStack>
                <Text fontSize="2xl" fontWeight="800" color="gray.900">
                  {clients.reduce((sum, c) => sum + (c.totalWorkouts || 0), 0)}
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="600">Total Workouts</Text>
              </CardBody>
            </Card>
          </motion.div>
        </SimpleGrid>
      </VStack>

      {/* Filters and Search */}
      <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)" mb={6}>
        <CardBody p={4}>
          <HStack spacing={4}>
            <InputGroup flex={1} maxW="400px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="xl"
                border="2px solid"
                borderColor="gray.200"
                _focus={{ borderColor: '#667eea' }}
              />
            </InputGroup>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              maxW="200px"
              borderRadius="xl"
              border="2px solid"
              borderColor="gray.200"
              _focus={{ borderColor: '#667eea' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </HStack>
        </CardBody>
      </Card>

      {/* Clients Table */}
      <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
        <CardBody p={0}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th fontWeight="700" color="gray.700" py={4}>Client</Th>
                  <Th fontWeight="700" color="gray.700">Weight Progress</Th>
                  <Th fontWeight="700" color="gray.700">BMI / Body Fat</Th>
                  <Th fontWeight="700" color="gray.700">Adherence</Th>
                  <Th fontWeight="700" color="gray.700">Last Check-in</Th>
                  <Th fontWeight="700" color="gray.700">Status</Th>
                  <Th fontWeight="700" color="gray.700">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredClients.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={8}>
                      <Text color="gray.500">No clients found. Add your first client!</Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredClients.map((client) => (
                    <Tr key={client.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                      <Td>
                        <HStack spacing={3}>
                          <Avatar size="sm" name={client.name} src={client.avatar} />
                          <Box>
                            <Text fontWeight="700" color="gray.900">{client.name}</Text>
                            <Text fontSize="xs" color="gray.500">{client.email}</Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <Text fontWeight="700" color="gray.900">{client.currentWeight}kg</Text>
                            <Text fontSize="sm" color="gray.500">→ {client.targetWeight}kg</Text>
                          </HStack>
                          {client.weightLost > 0 && (
                            <HStack spacing={2}>
                              <Icon as={FiTrendingDown} color="#10B981" boxSize={4} />
                              <Text fontSize="xs" color="#10B981" fontWeight="600">-{client.weightLost.toFixed(1)}kg</Text>
                            </HStack>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600" color="gray.900">BMI: {client.bmi}</Text>
                          <Text fontSize="xs" color="gray.500">Body Fat: {client.bodyFat}%</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={2} w="120px">
                          <Progress
                            value={client.adherence}
                            colorScheme={client.adherence >= 80 ? 'green' : client.adherence >= 60 ? 'yellow' : 'red'}
                            size="sm"
                            borderRadius="full"
                            w="full"
                          />
                          <Text fontSize="sm" fontWeight="700" color="gray.900">{client.adherence}%</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" fontWeight="600" color="gray.700">{client.lastCheckIn}</Text>
                      </Td>
                      <Td>
                        <Badge
                          bg={client.status === 'active' ? '#10B981' : '#EF4444'}
                          color="white"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                        >
                          {client.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            leftIcon={<FiEye />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleViewDetails(client)}
                            borderRadius="lg"
                          >
                            View
                          </Button>
                          <Menu>
                            <MenuButton
                              as={Button}
                              size="sm"
                              variant="ghost"
                              borderRadius="lg"
                            >
                              <Icon as={FiMoreVertical} />
                            </MenuButton>
                            <MenuList>
                              <MenuItem icon={<FiEdit2 />} onClick={() => handleEditClient(client)}>
                                Edit
                              </MenuItem>
                              <MenuItem icon={<FiTrash2 />} color="red" onClick={() => handleDeleteClient(client.id)}>
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      {/* Add/Edit Client Modal */}
      <Modal isOpen={isOpen || isEditOpen} onClose={selectedClient ? onEditClose : onClose} size="2xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            {selectedClient ? 'Edit Client' : 'Add New Client'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter client name"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  borderRadius="lg"
                />
              </FormControl>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Current Weight (kg)</FormLabel>
                  <NumberInput
                    value={formData.currentWeight}
                    onChange={(value) => setFormData({ ...formData, currentWeight: value })}
                    min={0}
                    precision={1}
                  >
                    <NumberInputField borderRadius="lg" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Target Weight (kg)</FormLabel>
                  <NumberInput
                    value={formData.targetWeight}
                    onChange={(value) => setFormData({ ...formData, targetWeight: value })}
                    min={0}
                    precision={1}
                  >
                    <NumberInputField borderRadius="lg" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>Height (cm)</FormLabel>
                <NumberInput
                  value={formData.height}
                  onChange={(value) => setFormData({ ...formData, height: value })}
                  min={0}
                  precision={1}
                >
                  <NumberInputField borderRadius="lg" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Join Date</FormLabel>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  borderRadius="lg"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={selectedClient ? onEditClose : onClose}>
              Cancel
            </Button>
            <Button
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
              onClick={handleSaveClient}
              borderRadius="xl"
            >
              {selectedClient ? 'Update' : 'Add'} Client
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Client Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="6xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack spacing={3}>
              <Avatar size="md" name={selectedClient?.name} src={selectedClient?.avatar} />
              <Box>
                <Text fontSize="xl" fontWeight="800">{selectedClient?.name}</Text>
                <Text fontSize="sm" color="gray.500">{selectedClient?.email}</Text>
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedClient && (
              <Tabs>
                <TabList>
                  <Tab fontWeight="700">Weight Progress</Tab>
                  <Tab fontWeight="700">Body Measurements</Tab>
                  <Tab fontWeight="700">Add Weight Entry</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    {selectedClient.weightHistory && selectedClient.weightHistory.length > 0 ? (
                      <Box h="300px" mt={4}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={getWeightChartData(selectedClient)}>
                            <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="week" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} fill="url(#colorWeight)" />
                            <Line type="monotone" dataKey="target" stroke="#667eea" strokeWidth={2} strokeDasharray="5 5" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Text color="gray.500" mt={4}>No weight history available</Text>
                    )}
                  </TabPanel>

                  <TabPanel>
                    {selectedClient.measurements && selectedClient.measurements.length > 0 ? (
                      <Box h="300px" mt={4}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getMeasurementChartData(selectedClient)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="date" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="chest" fill="#667eea" />
                            <Bar dataKey="waist" fill="#10B981" />
                            <Bar dataKey="hips" fill="#F59E0B" />
                            <Bar dataKey="arms" fill="#EC4899" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Text color="gray.500" mt={4}>No measurement data available</Text>
                    )}
                  </TabPanel>

                  <TabPanel>
                    <VStack align="stretch" spacing={4} mt={4}>
                      <FormControl>
                        <FormLabel>Weight (kg)</FormLabel>
                        <NumberInput
                          id="newWeight"
                          min={0}
                          precision={1}
                        >
                          <NumberInputField borderRadius="lg" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                      <Button
                        bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
                        onClick={() => {
                          const input = document.getElementById('newWeight');
                          if (input && input.value) {
                            handleAddWeightEntry(selectedClient.id, input.value);
                            input.value = '';
                            toast({
                              title: 'Weight Entry Added',
                              description: 'New weight entry has been recorded',
                              status: 'success',
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                        }}
                        borderRadius="xl"
                      >
                        Add Weight Entry
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PersonalProgressTracking;
