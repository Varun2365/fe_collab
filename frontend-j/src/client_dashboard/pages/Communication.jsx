import React, { useState } from 'react';
import {
  Box,
  Grid,
  Text,
  Card,
  CardBody,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Button,
  useColorModeValue,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
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
  Textarea,
  Select,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import {
  MdChat,
  MdCalendarToday,
  MdCheckCircle,
  MdSend,
  MdVideoCall,
  MdPhone,
  MdAccessTime,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { IconButton } from '@chakra-ui/react';

const Communication = () => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const { isOpen: isChatOpen, onOpen: onChatOpen, onClose: onChatClose } = useDisclosure();
  const { isOpen: isAppointmentOpen, onOpen: onAppointmentOpen, onClose: onAppointmentClose } = useDisclosure();
  const { isOpen: isCheckInOpen, onOpen: onCheckInOpen, onClose: onCheckInClose } = useDisclosure();
  const [message, setMessage] = useState('');

  const chatMessages = [
    { id: 1, sender: 'coach', message: 'Great job on your workout today! How are you feeling?', time: '2 hours ago', read: true },
    { id: 2, sender: 'coach', message: 'Remember to log your meals for better tracking.', time: '1 day ago', read: true },
    { id: 3, sender: 'coach', message: 'Your progress is amazing! Keep it up!', time: '2 days ago', read: false },
  ];

  const appointments = [
    { id: 1, date: '2024-03-20', time: '10:00 AM', type: 'Progress Review', method: 'Video Call', status: 'Scheduled' },
    { id: 2, date: '2024-03-15', time: '2:00 PM', type: 'Nutrition Consultation', method: 'Phone Call', status: 'Completed' },
    { id: 3, date: '2024-03-10', time: '11:00 AM', type: 'Workout Plan Discussion', method: 'WhatsApp', status: 'Completed' },
  ];

  const checkIns = [
    { id: 1, date: '2024-03-18', mood: '😊 Great', weight: '81.0 kg', notes: 'Feeling energetic today!' },
    { id: 2, date: '2024-03-17', mood: '😐 Okay', weight: '81.2 kg', notes: 'Had a good workout' },
    { id: 3, date: '2024-03-16', mood: '🔥 Energized', weight: '81.5 kg', notes: 'Motivated to continue!' },
  ];

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="3xl" fontWeight="black" color="gray.800" mb={1}>
          Communication Tools
        </Text>
        <Text color="gray.600" fontSize="lg">
          Chat with your coach, book appointments, and check in
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Button
          leftIcon={<MdChat />}
          colorScheme="blue"
          size="lg"
          h="100px"
          borderRadius="xl"
          onClick={onChatOpen}
          bgGradient="linear(135deg, blue.400, blue.600)"
          _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(66, 153, 225, 0.3)' }}
        >
          <VStack>
            <Text fontSize="lg" fontWeight="bold">1-Click Coach Chat</Text>
            <Badge colorScheme="red" borderRadius="full">3 New</Badge>
          </VStack>
        </Button>

        <Button
          leftIcon={<MdCalendarToday />}
          colorScheme="orange"
          size="lg"
          h="100px"
          borderRadius="xl"
          onClick={onAppointmentOpen}
          bgGradient="linear(135deg, orange.400, orange.600)"
          _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(237, 137, 54, 0.3)' }}
        >
          <VStack>
            <Text fontSize="lg" fontWeight="bold">Book Appointment</Text>
            <Text fontSize="xs">Schedule Progress Review</Text>
          </VStack>
        </Button>

        <Button
          leftIcon={<MdCheckCircle />}
          colorScheme="green"
          size="lg"
          h="100px"
          borderRadius="xl"
          onClick={onCheckInOpen}
          bgGradient="linear(135deg, green.400, green.600)"
          _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(72, 187, 120, 0.3)' }}
        >
          <VStack>
            <Text fontSize="lg" fontWeight="bold">Daily Check-in</Text>
            <Text fontSize="xs">Log your progress</Text>
          </VStack>
        </Button>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mb={6}>
        {/* Recent Messages */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Recent Messages
              </Text>
              <Button size="sm" onClick={onChatOpen}>View All</Button>
            </HStack>
            <VStack spacing={3} align="stretch">
              {chatMessages.map((msg) => (
                <Box key={msg.id} p={3} bg={msg.read ? 'gray.50' : 'blue.50'} borderRadius="lg" borderLeft={msg.read ? 'none' : '4px solid'} borderColor={msg.read ? 'transparent' : 'blue.500'}>
                  <HStack justify="space-between" mb={1}>
                    <HStack>
                      <Avatar size="sm" name="Coach" />
                      <Text fontSize="sm" fontWeight="bold">Coach</Text>
                    </HStack>
                    {!msg.read && <Badge colorScheme="blue" borderRadius="full" fontSize="xs">New</Badge>}
                  </HStack>
                  <Text fontSize="sm" color="gray.700" mb={1}>{msg.message}</Text>
                  <Text fontSize="xs" color="gray.500">{msg.time}</Text>
                </Box>
              ))}
            </VStack>
            <Button leftIcon={<FaWhatsapp />} colorScheme="green" w="full" mt={4} borderRadius="xl">
              WhatsApp Direct Message
            </Button>
          </CardBody>
        </Card>

        {/* Upcoming Appointments */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Appointments
              </Text>
              <Button size="sm" onClick={onAppointmentOpen}>Book New</Button>
            </HStack>
            <VStack spacing={3} align="stretch">
              {appointments.map((apt) => (
                <Box key={apt.id} p={4} bg="gray.50" borderRadius="lg">
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="bold">{apt.type}</Text>
                    <Badge colorScheme={apt.status === 'Scheduled' ? 'blue' : 'green'} borderRadius="full" fontSize="xs">
                      {apt.status}
                    </Badge>
                  </HStack>
                  <HStack mb={2}>
                    <Icon as={MdCalendarToday} color="gray.500" boxSize={4} />
                    <Text fontSize="xs" color="gray.600">{apt.date} at {apt.time}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={apt.method === 'Video Call' ? MdVideoCall : apt.method === 'Phone Call' ? MdPhone : FaWhatsapp} color="gray.500" boxSize={4} />
                    <Text fontSize="xs" color="gray.600">{apt.method}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Check-in History */}
      <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
        <CardBody p={6}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Check-in History
            </Text>
            <Button size="sm" onClick={onCheckInOpen}>New Check-in</Button>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {checkIns.map((checkIn) => (
              <Box key={checkIn.id} p={4} bg="gray.50" borderRadius="xl">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="bold">{checkIn.date}</Text>
                  <Text fontSize="2xl">{checkIn.mood}</Text>
                </HStack>
                <Text fontSize="xs" color="gray.600" mb={2}>Weight: {checkIn.weight}</Text>
                <Text fontSize="xs" color="gray.500">{checkIn.notes}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Chat Modal */}
      <Modal isOpen={isChatOpen} onClose={onChatClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" h="600px" display="flex" flexDirection="column">
          <ModalHeader>
            <HStack>
              <Avatar size="sm" name="Coach" />
              <Box>
                <Text fontWeight="bold">Coach</Text>
                <Text fontSize="xs" color="gray.500">Online</Text>
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody flex={1} overflowY="auto">
            <VStack spacing={3} align="stretch">
              {chatMessages.map((msg) => (
                <Box key={msg.id} alignSelf={msg.sender === 'coach' ? 'flex-start' : 'flex-end'}>
                  <Box p={3} bg={msg.sender === 'coach' ? 'gray.100' : 'blue.100'} borderRadius="lg" maxW="80%">
                    <Text fontSize="sm">{msg.message}</Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>{msg.time}</Text>
                  </Box>
                </Box>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <InputGroup>
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                borderRadius="xl"
              />
              <InputLeftElement>
                <IconButton icon={<MdSend />} colorScheme="blue" size="sm" borderRadius="xl" aria-label="Send" />
              </InputLeftElement>
            </InputGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Appointment Booking Modal */}
      <Modal isOpen={isAppointmentOpen} onClose={onAppointmentClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Book Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Appointment Type</FormLabel>
                <Select placeholder="Select type" borderRadius="lg">
                  <option>Progress Review</option>
                  <option>Nutrition Consultation</option>
                  <option>Workout Plan Discussion</option>
                  <option>General Check-in</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Select Date</FormLabel>
                <Input type="date" borderRadius="lg" />
              </FormControl>
              <FormControl>
                <FormLabel>Select Time</FormLabel>
                <Select placeholder="Choose time slot" borderRadius="lg">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Preferred Method</FormLabel>
                <Select placeholder="Select method" borderRadius="lg">
                  <option>Video Call (Zoom)</option>
                  <option>Phone Call</option>
                  <option>WhatsApp</option>
                  <option>In-Person</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAppointmentClose}>Cancel</Button>
            <Button colorScheme="orange" onClick={onAppointmentClose} borderRadius="xl">Book Appointment</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Check-in Modal */}
      <Modal isOpen={isCheckInOpen} onClose={onCheckInClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Daily Check-in</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>How are you feeling today?</FormLabel>
                <Select placeholder="Select mood" borderRadius="lg">
                  <option>😊 Great</option>
                  <option>😐 Okay</option>
                  <option>😔 Not Great</option>
                  <option>🔥 Energized</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Weight (kg)</FormLabel>
                <Input type="number" placeholder="81.0" borderRadius="lg" />
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea placeholder="How did your day go? Any challenges?" rows={4} borderRadius="lg" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCheckInClose}>Cancel</Button>
            <Button colorScheme="green" onClick={onCheckInClose} borderRadius="xl">Submit Check-in</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Communication;

