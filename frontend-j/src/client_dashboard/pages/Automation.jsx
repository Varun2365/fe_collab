import React from 'react';
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
  Switch,
  Button,
  useColorModeValue,
  Icon,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import {
  FiZap,
} from 'react-icons/fi';
import {
  MdEmail,
  MdNotifications,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

const Automation = () => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  const automations = [
    { id: 1, name: 'Welcome Sequence', type: 'Multi-Stage', status: true, description: '3-stage welcome emails for new users' },
    { id: 2, name: 'Milestone Triggers', type: 'Trigger', status: true, description: 'Celebrate achievements automatically' },
    { id: 3, name: 'Weekly Progress Reports', type: 'Email', status: true, description: 'Weekly email with progress summary' },
    { id: 4, name: 'Water Reminders', type: 'Reminder', status: true, description: 'Daily water intake reminders' },
    { id: 5, name: 'Meal Reminders', type: 'Reminder', status: true, description: 'Remind to log meals' },
    { id: 6, name: 'Exercise Reminders', type: 'Reminder', status: true, description: 'Workout time notifications' },
    { id: 7, name: 'Check-in Reminders', type: 'Reminder', status: false, description: 'Daily check-in prompts' },
    { id: 8, name: 'Reactivation Messages', type: 'Reactivation', status: true, description: 'Re-engage inactive users' },
  ];

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="3xl" fontWeight="black" color="gray.800" mb={1}>
          Automation Settings
        </Text>
        <Text color="gray.600" fontSize="lg">
          Manage automated messages, reminders, and sequences
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        {automations.map((auto) => (
          <Card key={auto.id} bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
            <CardBody p={6}>
              <HStack justify="space-between" mb={3}>
                <HStack>
                  <Icon as={FiZap} boxSize={5} color="purple.500" />
                  <Box>
                    <Text fontSize="sm" fontWeight="bold">{auto.name}</Text>
                    <Badge colorScheme="blue" borderRadius="full" fontSize="xs" variant="subtle">{auto.type}</Badge>
                  </Box>
                </HStack>
                <Switch isChecked={auto.status} colorScheme="green" />
              </HStack>
              <Text fontSize="xs" color="gray.600">{auto.description}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
        {/* Email Sequences */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <HStack mb={4}>
              <Icon as={MdEmail} boxSize={6} color="blue.500" />
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Email Sequences
              </Text>
            </HStack>
            <VStack spacing={3} align="stretch">
              {[
                { name: 'Welcome Sequence', stages: 3, active: true },
                { name: 'Progress Reports', stages: 1, active: true },
                { name: 'Reactivation', stages: 2, active: true },
              ].map((seq, idx) => (
                <HStack key={idx} p={3} bg="gray.50" borderRadius="lg" justify="space-between">
                  <Box>
                    <Text fontSize="sm" fontWeight="bold">{seq.name}</Text>
                    <Text fontSize="xs" color="gray.500">{seq.stages} stages</Text>
                  </Box>
                  <Badge colorScheme={seq.active ? 'green' : 'gray'} borderRadius="full">{seq.active ? 'Active' : 'Inactive'}</Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Notification Channels */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <HStack mb={4}>
              <Icon as={MdNotifications} boxSize={6} color="orange.500" />
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Notification Channels
              </Text>
            </HStack>
            <VStack spacing={3} align="stretch">
              {[
                { name: 'WhatsApp Reminders', icon: FaWhatsapp, active: true },
                { name: 'Email Sequences', icon: MdEmail, active: true },
                { name: 'Push Notifications', icon: MdNotifications, active: false },
              ].map((channel, idx) => (
                <HStack key={idx} p={3} bg="gray.50" borderRadius="lg" justify="space-between">
                  <HStack>
                    <Icon as={channel.icon} color="blue.500" />
                    <Text fontSize="sm" fontWeight="bold">{channel.name}</Text>
                  </HStack>
                  <Switch isChecked={channel.active} colorScheme="green" />
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default Automation;

