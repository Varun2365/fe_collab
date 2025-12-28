import React from 'react';
import {
  Box,
  Grid,
  Text,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  Switch,
  Button,
  useColorModeValue,
  Icon,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import {
  MdNotifications,
  MdEmail,
  MdWaterDrop,
  MdRestaurant,
  MdFitnessCenter,
  MdCheckCircle,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

const Notifications = () => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  const notificationSettings = [
    { id: 1, name: 'Water Reminders', icon: MdWaterDrop, whatsapp: true, email: true, push: true },
    { id: 2, name: 'Meal Reminders', icon: MdRestaurant, whatsapp: true, email: false, push: true },
    { id: 3, name: 'Exercise Reminders', icon: MdFitnessCenter, whatsapp: true, email: true, push: true },
    { id: 4, name: 'Check-in Reminders', icon: MdCheckCircle, whatsapp: false, email: true, push: true },
  ];

  const recentNotifications = [
    { id: 1, type: 'reminder', message: 'Time to log your water intake!', time: '2 min ago', icon: MdWaterDrop, color: 'cyan', read: false },
    { id: 2, type: 'achievement', message: 'You earned the "Week Warrior" badge!', time: '1 hour ago', icon: MdCheckCircle, color: 'yellow', read: false },
    { id: 3, type: 'coach', message: 'Your coach sent a message', time: '3 hours ago', icon: MdNotifications, color: 'blue', read: true },
    { id: 4, type: 'reminder', message: 'Don\'t forget your workout today', time: '5 hours ago', icon: MdFitnessCenter, color: 'purple', read: true },
  ];

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="3xl" fontWeight="black" color="gray.800" mb={1}>
          Notification Settings
        </Text>
        <Text color="gray.600" fontSize="lg">
          Manage your notification preferences
        </Text>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Notification Preferences */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={4}>
              Notification Preferences
            </Text>
            <VStack spacing={4} align="stretch">
              {notificationSettings.map((setting) => (
                <Box key={setting.id} p={4} bg="gray.50" borderRadius="xl">
                  <HStack mb={3}>
                    <Icon as={setting.icon} boxSize={5} color={`${setting.color}.500`} />
                    <Text fontSize="sm" fontWeight="bold" flex={1}>{setting.name}</Text>
                  </HStack>
                  <SimpleGrid columns={3} spacing={2}>
                    <HStack>
                      <Icon as={FaWhatsapp} color="green.500" boxSize={4} />
                      <Switch isChecked={setting.whatsapp} size="sm" colorScheme="green" />
                    </HStack>
                    <HStack>
                      <Icon as={MdEmail} color="blue.500" boxSize={4} />
                      <Switch isChecked={setting.email} size="sm" colorScheme="blue" />
                    </HStack>
                    <HStack>
                      <Icon as={MdNotifications} color="orange.500" boxSize={4} />
                      <Switch isChecked={setting.push} size="sm" colorScheme="orange" />
                    </HStack>
                  </SimpleGrid>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Recent Notifications */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Recent Notifications
              </Text>
              <Badge colorScheme="red" borderRadius="full">2 New</Badge>
            </HStack>
            <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
              {recentNotifications.map((notif) => (
                <HStack key={notif.id} p={3} bg={notif.read ? 'gray.50' : 'blue.50'} borderRadius="lg" _hover={{ bg: 'gray.100' }} cursor="pointer">
                  <Icon as={notif.icon} boxSize={5} color={`${notif.color}.500`} />
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium">{notif.message}</Text>
                    <Text fontSize="xs" color="gray.500">{notif.time}</Text>
                  </Box>
                  {!notif.read && <Badge colorScheme="red" borderRadius="full" w={2} h={2} />}
                </HStack>
              ))}
            </VStack>
            <Button size="sm" colorScheme="blue" w="full" mt={4} borderRadius="xl">View All</Button>
          </CardBody>
        </Card>
      </Grid>

      {/* Email Sequences */}
      <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
        <CardBody p={6}>
          <HStack mb={4}>
            <Icon as={MdEmail} boxSize={6} color="blue.500" />
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Email Sequences
            </Text>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[
              { name: 'Welcome Sequence', active: true, emails: 3 },
              { name: 'Weekly Reports', active: true, emails: 1 },
              { name: 'Reactivation', active: true, emails: 2 },
            ].map((seq, idx) => (
              <Box key={idx} p={4} bg="gray.50" borderRadius="xl">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="bold">{seq.name}</Text>
                  <Badge colorScheme={seq.active ? 'green' : 'gray'} borderRadius="full" fontSize="xs">{seq.active ? 'Active' : 'Inactive'}</Badge>
                </HStack>
                <Text fontSize="xs" color="gray.500" mb={3}>{seq.emails} emails in sequence</Text>
                <Switch isChecked={seq.active} colorScheme="green" />
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Notifications;

