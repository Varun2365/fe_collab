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
  Progress,
  Button,
  Icon,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  MdTrendingUp,
  MdLocalFireDepartment,
  MdWaterDrop,
  MdFitnessCenter,
  MdEmojiEvents,
  MdChat,
  MdCalendarToday,
} from 'react-icons/md';
import { FiAward, FiArrowUpRight } from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardOverview = () => {
  // Sample Data
  const weightData = [
    { date: 'Week 1', weight: 85 },
    { date: 'Week 2', weight: 84 },
    { date: 'Week 3', weight: 83 },
    { date: 'Week 4', weight: 82.5 },
    { date: 'Week 5', weight: 81.5 },
    { date: 'Week 6', weight: 81 },
  ];

  const dailyStats = [
    { 
      icon: MdTrendingUp, 
      gradient: 'linear(135deg, #3B82F6 0%, #2563EB 100%)',
      value: '8,420', 
      label: 'Steps', 
      progress: 84,
      goal: '10,000',
      change: '+12%'
    },
    { 
      icon: MdLocalFireDepartment, 
      gradient: 'linear(135deg, #F59E0B 0%, #D97706 100%)',
      value: '1,850', 
      label: 'Calories', 
      progress: 92,
      goal: '2,000',
      change: '+8%'
    },
    { 
      icon: MdWaterDrop, 
      gradient: 'linear(135deg, #06B6D4 0%, #0891B2 100%)',
      value: '6/8', 
      label: 'Water', 
      progress: 75,
      goal: '8 glasses',
      change: '+2'
    },
    { 
      icon: MdFitnessCenter, 
      gradient: 'linear(135deg, #8B5CF6 0%, #7C3AED 100%)',
      value: '1', 
      label: 'Workouts', 
      progress: 100,
      goal: '1 workout',
      change: '✓ Done'
    },
  ];

  const alphaScore = 87;
  const xpData = { current: 2450, nextLevel: 3000, level: 5, streak: 12 };

  return (
    <Box>
      {/* Welcome Header */}
      <Box mb={8}>
        <HStack justify="space-between" align="center" mb={6}>
          <Box>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Text 
                fontSize="3xl" 
                fontWeight="800" 
                bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                bgClip="text"
                mb={2}
                letterSpacing="-1px"
              >
                Welcome back, Warrior! 💪
              </Text>
              <Text color="gray.600" fontSize="md" fontWeight="600">
                Here's your fitness journey overview
              </Text>
            </motion.div>
          </Box>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card 
              bgGradient="linear(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
              borderRadius="2xl" 
              p={5} 
              border="1px solid"
              borderColor="rgba(102, 126, 234, 0.2)"
              boxShadow="0 8px 24px rgba(102, 126, 234, 0.15)"
            >
              <VStack spacing={3}>
                <Text fontSize="xs" color="gray.600" fontWeight="700" textTransform="uppercase" letterSpacing="1px">
                  Daily Alpha Score
                </Text>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <CircularProgress 
                    value={alphaScore} 
                    color="#667eea" 
                    size="90px" 
                    thickness="8px"
                    trackColor="rgba(102, 126, 234, 0.1)"
                  >
                    <CircularProgressLabel fontSize="xl" fontWeight="800" color="#667eea">
                      {alphaScore}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </motion.div>
                <Badge
                  bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                  color="white"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="700"
                  boxShadow="0 4px 12px rgba(16, 185, 129, 0.3)"
                >
                  Excellent Adherence
                </Badge>
              </VStack>
            </Card>
          </motion.div>
        </HStack>
      </Box>

      {/* Quick Stats - Creative Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5} mb={8}>
        {dailyStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card 
              bg="white"
              borderRadius="2xl" 
              border="1px solid"
              borderColor="gray.100"
              boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
              overflow="hidden"
              position="relative"
              _hover={{
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
              }}
              transition="all 0.3s"
            >
              {/* Gradient Top Bar */}
              <Box
                h="4px"
                bgGradient={stat.gradient}
                position="absolute"
                top={0}
                left={0}
                right={0}
              />
              
              <CardBody p={5}>
                <HStack justify="space-between" mb={4}>
                  <Box
                    w="48px"
                    h="48px"
                    bgGradient={stat.gradient}
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={`0 4px 16px ${stat.gradient.includes('3B82F6') ? 'rgba(59, 130, 246, 0.3)' : stat.gradient.includes('F59E0B') ? 'rgba(245, 158, 11, 0.3)' : stat.gradient.includes('06B6D4') ? 'rgba(6, 182, 212, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`}
                  >
                    <Icon as={stat.icon} boxSize={6} color="white" />
                  </Box>
                  <Badge
                    bgGradient={stat.gradient}
                    color="white"
                    borderRadius="full"
                    fontSize="10px"
                    px={2.5}
                    py={1}
                    fontWeight="700"
                  >
                    {stat.change}
                  </Badge>
                </HStack>
                
                <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={1}>
                  {stat.value}
                </Text>
                <Text fontSize="xs" color="gray.600" fontWeight="600" mb={3} letterSpacing="0.3px">
                  {stat.label} • Goal: {stat.goal}
                </Text>
                
                <Progress 
                  value={stat.progress} 
                  colorScheme={stat.gradient.includes('3B82F6') ? 'blue' : stat.gradient.includes('F59E0B') ? 'orange' : stat.gradient.includes('06B6D4') ? 'cyan' : 'purple'}
                  size="md" 
                  borderRadius="full"
                  bg="gray.100"
                  boxShadow="inset 0 2px 4px rgba(0, 0, 0, 0.06)"
                />
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={8}>
        {/* Weight Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card 
            bg="white"
            borderRadius="2xl" 
            border="1px solid"
            borderColor="gray.100"
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
            overflow="hidden"
          >
            <Box
              h="4px"
              bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
            />
            <CardBody p={6}>
              <HStack justify="space-between" mb={6}>
                <Box>
                  <Text fontSize="xl" fontWeight="800" color="gray.900" mb={1}>
                    Weight Progress
                  </Text>
                  <Text color="gray.600" fontSize="sm" fontWeight="600">
                    Last 6 weeks transformation
                  </Text>
                </Box>
                <Badge 
                  bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                  color="white"
                  borderRadius="full" 
                  px={4} 
                  py={1.5}
                  fontSize="sm"
                  fontWeight="700"
                  boxShadow="0 4px 12px rgba(16, 185, 129, 0.3)"
                >
                  -4kg Lost 🎉
                </Badge>
              </HStack>
              
              <Box h="280px">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} fontWeight="600" />
                    <YAxis stroke="#6B7280" fontSize={12} fontWeight="600" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                        fontWeight: '600',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorWeight)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </motion.div>

        {/* XP & Level */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card 
            bg="white"
            borderRadius="2xl" 
            border="1px solid"
            borderColor="gray.100"
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
            overflow="hidden"
          >
            <Box
              h="4px"
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            />
            <CardBody p={6}>
              <Text fontSize="xl" fontWeight="800" color="gray.900" mb={6}>
                Your Progress
              </Text>
              
              <Box 
                mb={6} 
                p={5} 
                bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)" 
                borderRadius="2xl" 
                color="white"
                boxShadow="0 8px 24px rgba(102, 126, 234, 0.3)"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-50px"
                  right="-50px"
                  w="150px"
                  h="150px"
                  bg="rgba(255, 255, 255, 0.1)"
                  borderRadius="full"
                  filter="blur(40px)"
                />
                <VStack spacing={3} position="relative" zIndex={1}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" fontWeight="700" opacity={0.9}>LEVEL {xpData.level}</Text>
                    <Badge bg="rgba(255,255,255,0.2)" color="white" borderRadius="full" px={2.5} py={1} fontSize="10px" fontWeight="700">
                      🔥 {xpData.streak} Day Streak
                    </Badge>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="900" letterSpacing="-1px">
                    {xpData.current} / {xpData.nextLevel} XP
                  </Text>
                  <Progress 
                    value={(xpData.current / xpData.nextLevel) * 100} 
                    colorScheme="whiteAlpha" 
                    size="lg" 
                    borderRadius="full"
                    bg="rgba(255,255,255,0.2)"
                    w="full"
                  />
                </VStack>
              </Box>

              <VStack spacing={2} align="stretch">
                <HStack 
                  p={4} 
                  bgGradient="linear(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)"
                  borderRadius="xl" 
                  justify="space-between" 
                  border="1px solid"
                  borderColor="rgba(245, 158, 11, 0.2)"
                  _hover={{ bg: 'rgba(245, 158, 11, 0.15)' }} 
                  transition="all 0.2s"
                >
                  <HStack>
                    <Icon as={FiAward} color="#F59E0B" boxSize={5} />
                    <Text fontSize="sm" fontWeight="700" color="gray.900">Lost First 2 KGs!</Text>
                  </HStack>
                  <Badge bgGradient="linear(135deg, #10B981 0%, #059669 100%)" color="white" borderRadius="full" fontSize="10px" px={2.5} py={1} fontWeight="700">
                    +200 XP
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </motion.div>
      </Grid>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card 
          bg="white"
          borderRadius="2xl" 
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
          overflow="hidden"
        >
          <Box
            h="4px"
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
          />
          <CardBody p={6}>
            <Text fontSize="xl" fontWeight="800" color="gray.900" mb={5}>
              Quick Actions
            </Text>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {[
                { icon: MdChat, gradient: 'linear(135deg, #3B82F6 0%, #2563EB 100%)', label: 'Chat Coach' },
                { icon: MdCalendarToday, gradient: 'linear(135deg, #F59E0B 0%, #D97706 100%)', label: 'Book Appointment' },
                { icon: MdFitnessCenter, gradient: 'linear(135deg, #8B5CF6 0%, #7C3AED 100%)', label: 'Log Workout' },
                { icon: MdEmojiEvents, gradient: 'linear(135deg, #10B981 0%, #059669 100%)', label: 'Achievements' },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    leftIcon={<action.icon />} 
                    rightIcon={<FiArrowUpRight />}
                    bgGradient={action.gradient}
                    color="white"
                    size="lg" 
                    borderRadius="xl"
                    w="full"
                    h="56px"
                    fontWeight="700"
                    fontSize="sm"
                    boxShadow={`0 4px 16px ${action.gradient.includes('3B82F6') ? 'rgba(59, 130, 246, 0.3)' : action.gradient.includes('F59E0B') ? 'rgba(245, 158, 11, 0.3)' : action.gradient.includes('8B5CF6') ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${action.gradient.includes('3B82F6') ? 'rgba(59, 130, 246, 0.4)' : action.gradient.includes('F59E0B') ? 'rgba(245, 158, 11, 0.4)' : action.gradient.includes('8B5CF6') ? 'rgba(139, 92, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                    }}
                    transition="all 0.3s"
                  >
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </motion.div>
    </Box>
  );
};

export default DashboardOverview;
