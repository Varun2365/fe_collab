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
  FiAward,
  FiTrendingUp,
  FiTarget,
  FiUsers,
  FiStar,
  FiZap,
} from 'react-icons/fi';
import { MdLocalFireDepartment, MdEmojiEvents } from 'react-icons/md';

const Gamification = () => {
  // Sample Data
  const clients = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      xp: 2450,
      level: 5,
      streak: 12,
      badges: 8,
      rank: 1,
      alphaScore: 87,
    },
    {
      id: 2,
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      xp: 2200,
      level: 4,
      streak: 15,
      badges: 7,
      rank: 2,
      alphaScore: 92,
    },
    {
      id: 3,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      xp: 1800,
      level: 4,
      streak: 8,
      badges: 5,
      rank: 3,
      alphaScore: 78,
    },
    {
      id: 4,
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      xp: 1200,
      level: 3,
      streak: 5,
      badges: 3,
      rank: 4,
      alphaScore: 45,
    },
    {
      id: 5,
      name: 'David Brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      xp: 2800,
      level: 6,
      streak: 20,
      badges: 10,
      rank: 5,
      alphaScore: 95,
    },
  ];

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete first workout', icon: FiTarget, earned: 20, color: '#10B981' },
    { id: 2, name: 'Weight Warrior', description: 'Lost first 2 KGs', icon: FiTrendingUp, earned: 15, color: '#3B82F6' },
    { id: 3, name: 'Streak Master', description: '7 day streak', icon: MdLocalFireDepartment, earned: 18, color: '#F59E0B' },
    { id: 4, name: 'Nutrition Pro', description: 'Log 30 meals', icon: FiStar, earned: 12, color: '#8B5CF6' },
    { id: 5, name: 'Champion', description: 'Reach level 5', icon: MdEmojiEvents, earned: 8, color: '#EC4899' },
    { id: 6, name: 'Perfect Week', description: '100% adherence for a week', icon: FiZap, earned: 5, color: '#667eea' },
  ];

  const milestones = [
    { client: 'Alex Johnson', milestone: 'Lost 5kg!', date: '2024-03-20', xp: 200 },
    { client: 'Sarah Williams', milestone: '30 Day Streak!', date: '2024-03-19', xp: 300 },
    { client: 'David Brown', milestone: 'Reached Level 6!', date: '2024-03-18', xp: 500 },
  ];

  return (
    <Box p={6}>
      {/* Header */}
      <VStack align="stretch" spacing={6} mb={8}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={2}>
            Essential Gamification
          </Text>
          <Text color="gray.600" fontSize="sm" fontWeight="500">
            Track XP points, achievements, streaks, and leaderboards
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
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
                  <Icon as={FiAward} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">10,550</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total XP Earned</Text>
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
                  <Icon as={MdLocalFireDepartment} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">12</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Avg Streak Days</Text>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
            <CardBody p={5}>
              <HStack justify="space-between" mb={3}>
                <Box
                  w="48px"
                  h="48px"
                  bgGradient="linear(135deg, #8B5CF6 0%, #7C3AED 100%)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MdEmojiEvents} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">33</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Badges</Text>
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
                  <Icon as={FiUsers} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">5</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Active Players</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      <Tabs>
        <TabList>
          <Tab fontWeight="700">Leaderboard</Tab>
          <Tab fontWeight="700">Achievements</Tab>
          <Tab fontWeight="700">Milestones</Tab>
        </TabList>

        <TabPanels>
          {/* Leaderboard */}
          <TabPanel>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontWeight="700" color="gray.700">Rank</Th>
                      <Th fontWeight="700" color="gray.700">Client</Th>
                      <Th fontWeight="700" color="gray.700">Level</Th>
                      <Th fontWeight="700" color="gray.700">XP Points</Th>
                      <Th fontWeight="700" color="gray.700">Streak</Th>
                      <Th fontWeight="700" color="gray.700">Badges</Th>
                      <Th fontWeight="700" color="gray.700">Alpha Score</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {clients.map((client) => (
                      <Tr key={client.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <HStack spacing={2}>
                            {client.rank <= 3 && (
                              <Icon
                                as={MdEmojiEvents}
                                boxSize={5}
                                color={client.rank === 1 ? '#F59E0B' : client.rank === 2 ? '#94A3B8' : '#CD7F32'}
                              />
                            )}
                            <Text fontWeight="800" color="gray.900">#{client.rank}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name={client.name} src={client.avatar} />
                            <Text fontWeight="700" color="gray.900">{client.name}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge
                            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                            color="white"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="700"
                          >
                            Level {client.level}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontWeight="700" color="gray.900">{client.xp.toLocaleString()}</Text>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Icon as={MdLocalFireDepartment} color="#F59E0B" boxSize={4} />
                            <Text fontWeight="600" color="gray.700">{client.streak} days</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontWeight="600" color="gray.700">{client.badges}</Text>
                        </Td>
                        <Td>
                          <Progress
                            value={client.alphaScore}
                            colorScheme={client.alphaScore >= 80 ? 'green' : client.alphaScore >= 60 ? 'yellow' : 'red'}
                            size="sm"
                            borderRadius="full"
                            w="100px"
                          />
                          <Text fontSize="xs" color="gray.600" mt={1}>{client.alphaScore}%</Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Achievements */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {achievements.map((achievement) => (
                <motion.div key={achievement.id} whileHover={{ scale: 1.05, y: -4 }}>
                  <Card
                    bg="white"
                    borderRadius="xl"
                    boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
                    border="2px solid"
                    borderColor={achievement.color}
                  >
                    <CardBody p={6}>
                      <VStack spacing={4}>
                        <Box
                          w="64px"
                          h="64px"
                          bg={achievement.color}
                          borderRadius="xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow={`0 8px 24px ${achievement.color}40`}
                        >
                          <Icon as={achievement.icon} boxSize={8} color="white" />
                        </Box>
                        <VStack spacing={2}>
                          <Text fontSize="lg" fontWeight="800" color="gray.900">
                            {achievement.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600" textAlign="center">
                            {achievement.description}
                          </Text>
                        </VStack>
                        <Badge
                          bg={achievement.color}
                          color="white"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                        >
                          {achievement.earned} clients earned
                        </Badge>
                      </VStack>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Milestones */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
                    <CardBody p={5}>
                      <HStack justify="space-between">
                        <HStack spacing={4}>
                          <Box
                            w="56px"
                            h="56px"
                            bgGradient="linear(135deg, #F59E0B 0%, #D97706 100%)"
                            borderRadius="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon as={MdEmojiEvents} boxSize={7} color="white" />
                          </Box>
                          <Box>
                            <Text fontSize="lg" fontWeight="800" color="gray.900">
                              {milestone.client}
                            </Text>
                            <Text fontSize="sm" color="gray.600" fontWeight="600">
                              {milestone.milestone}
                            </Text>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                              {milestone.date}
                            </Text>
                          </Box>
                        </HStack>
                        <Badge
                          bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                          color="white"
                          borderRadius="full"
                          px={4}
                          py={2}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          +{milestone.xp} XP
                        </Badge>
                      </HStack>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Gamification;

