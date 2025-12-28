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
  Button,
  useColorModeValue,
  Icon,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Divider,
} from '@chakra-ui/react';
import {
  MdPerson,
  MdDownload,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';

const Account = () => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="3xl" fontWeight="black" color="gray.800" mb={1}>
          Account Settings
        </Text>
        <Text color="gray.600" fontSize="lg">
          Manage your profile, privacy, and data
        </Text>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Profile Management */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={4}>
              Profile Management
            </Text>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Avatar size="lg" name="Fitness Warrior" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold">Fitness Warrior</Text>
                  <Text fontSize="xs" color="gray.500">Level 5 • 2,450 XP</Text>
                  <Button size="xs" colorScheme="blue" borderRadius="xl">Change Photo</Button>
                </VStack>
              </HStack>
              <Divider />
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input defaultValue="Fitness Warrior" borderRadius="lg" />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" defaultValue="warrior@fithub.com" borderRadius="lg" />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input type="tel" defaultValue="+1 234 567 8900" borderRadius="lg" />
              </FormControl>
              <Button colorScheme="blue" borderRadius="xl">Save Changes</Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Privacy Controls */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={4}>
              Privacy Controls
            </Text>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Profile Visibility</Text>
                  <Text fontSize="xs" color="gray.500">Show on leaderboard</Text>
                </Box>
                <Switch defaultChecked colorScheme="green" />
              </HStack>
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Progress Sharing</Text>
                  <Text fontSize="xs" color="gray.500">Allow sharing progress</Text>
                </Box>
                <Switch defaultChecked colorScheme="green" />
              </HStack>
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" fontWeight="bold">Data Analytics</Text>
                  <Text fontSize="xs" color="gray.500">Help improve app</Text>
                </Box>
                <Switch defaultChecked colorScheme="green" />
              </HStack>
              <Divider />
              <Button leftIcon={<MdLock />} colorScheme="red" variant="outline" borderRadius="xl">Change Password</Button>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Data Export */}
      <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
        <CardBody p={6}>
          <HStack justify="space-between" mb={4}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
                Data Export Options
              </Text>
              <Text fontSize="sm" color="gray.500">Download your fitness data</Text>
            </Box>
            <Icon as={MdDownload} boxSize={6} color="blue.500" />
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[
              { name: 'Progress Data', format: 'CSV', size: '2.5 MB' },
              { name: 'Meal Logs', format: 'JSON', size: '1.8 MB' },
              { name: 'Complete Backup', format: 'ZIP', size: '5.2 MB' },
            ].map((exportOption, idx) => (
              <Box key={idx} p={4} bg="gray.50" borderRadius="xl">
                <Text fontSize="sm" fontWeight="bold" mb={1}>{exportOption.name}</Text>
                <HStack mb={3}>
                  <Badge colorScheme="blue" borderRadius="full" fontSize="xs">{exportOption.format}</Badge>
                  <Text fontSize="xs" color="gray.500">{exportOption.size}</Text>
                </HStack>
                <Button size="sm" colorScheme="blue" w="full" borderRadius="xl" leftIcon={<MdDownload />}>Download</Button>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Account;

