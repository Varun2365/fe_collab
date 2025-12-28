import React, { useState } from 'react';
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
  Avatar,
  Icon,
  Progress,
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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiGift,
  FiShare2,
  FiCalendar,
} from 'react-icons/fi';
import { MdEmojiEvents } from 'react-icons/md';

const Community = () => {
  const challenges = [
    {
      id: 1,
      title: '21-Day Transformation Challenge',
      duration: '21 days',
      participants: 15,
      startDate: '2024-03-01',
      endDate: '2024-03-21',
      status: 'active',
      prize: '$500',
    },
    {
      id: 2,
      title: '10-Day Marathon Sprint',
      duration: '10 days',
      participants: 8,
      startDate: '2024-03-15',
      endDate: '2024-03-25',
      status: 'active',
      prize: '$200',
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: 'David Brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      points: 2850,
      progress: 95,
    },
    {
      rank: 2,
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      points: 2650,
      progress: 88,
    },
    {
      rank: 3,
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      points: 2450,
      progress: 82,
    },
    {
      rank: 4,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      points: 2200,
      progress: 73,
    },
    {
      rank: 5,
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      points: 1800,
      progress: 60,
    },
  ];

  const referrals = [
    {
      id: 1,
      client: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      referrals: 3,
      bonus: '$150',
      status: 'active',
    },
    {
      id: 2,
      client: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      referrals: 2,
      bonus: '$100',
      status: 'active',
    },
  ];

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6} mb={8}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={2}>
            Community & Social Programs
          </Text>
          <Text color="gray.600" fontSize="sm" fontWeight="500">
            Manage challenges, leaderboards, and referral programs
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
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
                  <Icon as={FiTarget} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{challenges.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Active Challenges</Text>
            </CardBody>
          </Card>

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
                  <Icon as={FiUsers} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">23</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Participants</Text>
            </CardBody>
          </Card>

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
                  <Icon as={FiGift} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">5</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Referrals</Text>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
            <CardBody p={5}>
              <HStack justify="space-between" mb={3}>
                <Box
                  w="48px"
                  h="48px"
                  bgGradient="linear(135deg, #EC4899 0%, #DB2777 100%)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MdEmojiEvents} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">$700</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Prizes</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      <Tabs>
        <TabList>
          <Tab fontWeight="700">Challenges</Tab>
          <Tab fontWeight="700">Leaderboard</Tab>
          <Tab fontWeight="700">Referrals</Tab>
        </TabList>

        <TabPanels>
          {/* Challenges */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {challenges.map((challenge) => (
                <motion.div key={challenge.id} whileHover={{ scale: 1.02, y: -4 }}>
                  <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
                    <CardBody p={6}>
                      <HStack justify="space-between" mb={4}>
                        <Badge
                          bg={challenge.status === 'active' ? '#10B981' : '#EF4444'}
                          color="white"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                        >
                          {challenge.status}
                        </Badge>
                        <Badge
                          bgGradient="linear(135deg, #F59E0B 0%, #D97706 100%)"
                          color="white"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                        >
                          Prize: {challenge.prize}
                        </Badge>
                      </HStack>
                      <Text fontSize="xl" fontWeight="800" color="gray.900" mb={3}>
                        {challenge.title}
                      </Text>
                      <VStack align="stretch" spacing={3} mb={4}>
                        <HStack>
                          <Icon as={FiCalendar} color="gray.500" boxSize={4} />
                          <Text fontSize="sm" color="gray.600">
                            {challenge.startDate} - {challenge.endDate}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiUsers} color="gray.500" boxSize={4} />
                          <Text fontSize="sm" color="gray.600">
                            {challenge.participants} participants
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiTarget} color="gray.500" boxSize={4} />
                          <Text fontSize="sm" color="gray.600">
                            Duration: {challenge.duration}
                          </Text>
                        </HStack>
                      </VStack>
                      <Button
                        w="full"
                        bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
                        borderRadius="xl"
                        fontWeight="700"
                      >
                        View Details
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Leaderboard */}
          <TabPanel>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontWeight="700" color="gray.700">Rank</Th>
                      <Th fontWeight="700" color="gray.700">Client</Th>
                      <Th fontWeight="700" color="gray.700">Points</Th>
                      <Th fontWeight="700" color="gray.700">Progress</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {leaderboard.map((entry) => (
                      <Tr key={entry.rank} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <HStack spacing={2}>
                            {entry.rank <= 3 && (
                              <Icon
                                as={MdEmojiEvents}
                                boxSize={5}
                                color={entry.rank === 1 ? '#F59E0B' : entry.rank === 2 ? '#94A3B8' : '#CD7F32'}
                              />
                            )}
                            <Text fontWeight="800" color="gray.900" fontSize="lg">
                              #{entry.rank}
                            </Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name={entry.name} src={entry.avatar} />
                            <Text fontWeight="700" color="gray.900">{entry.name}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontWeight="800" color="gray.900" fontSize="lg">
                            {entry.points.toLocaleString()}
                          </Text>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1} w="150px">
                            <Progress
                              value={entry.progress}
                              colorScheme="green"
                              size="sm"
                              borderRadius="full"
                              w="full"
                            />
                            <Text fontSize="xs" color="gray.600">{entry.progress}%</Text>
                          </VStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Referrals */}
          <TabPanel>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontWeight="700" color="gray.700">Client</Th>
                      <Th fontWeight="700" color="gray.700">Referrals</Th>
                      <Th fontWeight="700" color="gray.700">Bonus Earned</Th>
                      <Th fontWeight="700" color="gray.700">Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {referrals.map((referral) => (
                      <Tr key={referral.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name={referral.client} src={referral.avatar} />
                            <Text fontWeight="700" color="gray.900">{referral.client}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontWeight="700" color="gray.900">{referral.referrals}</Text>
                        </Td>
                        <Td>
                          <Text fontWeight="800" color="gray.900" fontSize="lg">
                            {referral.bonus}
                          </Text>
                        </Td>
                        <Td>
                          <Badge
                            bg={referral.status === 'active' ? '#10B981' : '#EF4444'}
                            color="white"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="700"
                          >
                            {referral.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Community;

