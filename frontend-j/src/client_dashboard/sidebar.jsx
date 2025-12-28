import React from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  Button,
  Badge,
  Divider,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  MdDashboard,
  MdTrendingUp,
  MdVideoLibrary,
  MdEmojiEvents,
  MdChat,
  MdBook,
  MdPhotoCamera,
  MdSmartToy,
  MdGroups,
  MdPerson,
  MdNotifications,
  MdSettings,
  MdHelp,
} from 'react-icons/md';
import { FiZap, FiAward, FiPlus } from 'react-icons/fi';

const Sidebar = ({ onNavigate, activePage = 'dashboard' }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: MdDashboard, gradient: 'linear(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'progress', name: 'Progress', icon: MdTrendingUp, gradient: 'linear(135deg, #10B981 0%, #059669 100%)' },
    { id: 'coaching', name: 'Coaching', icon: MdVideoLibrary, gradient: 'linear(135deg, #8B5CF6 0%, #7C3AED 100%)', badge: 'New' },
    { id: 'gamification', name: 'Achievements', icon: MdEmojiEvents, gradient: 'linear(135deg, #F59E0B 0%, #D97706 100%)' },
    { id: 'communication', name: 'Messages', icon: MdChat, gradient: 'linear(135deg, #3B82F6 0%, #2563EB 100%)', badge: '3' },
    { id: 'automation', name: 'Automation', icon: FiZap, gradient: 'linear(135deg, #EC4899 0%, #DB2777 100%)' },
    { id: 'education', name: 'Education', icon: MdBook, gradient: 'linear(135deg, #F97316 0%, #EA580C 100%)' },
    { id: 'analytics', name: 'Analytics', icon: MdPhotoCamera, gradient: 'linear(135deg, #EC4899 0%, #DB2777 100%)' },
    { id: 'ai', name: 'AI Assistant', icon: MdSmartToy, gradient: 'linear(135deg, #8B5CF6 0%, #7C3AED 100%)', badge: '24/7' },
    { id: 'community', name: 'Community', icon: MdGroups, gradient: 'linear(135deg, #EC4899 0%, #DB2777 100%)', badge: '5' },
    { id: 'motivation', name: 'Stories', icon: FiAward, gradient: 'linear(135deg, #10B981 0%, #059669 100%)' },
  ];

  const bottomItems = [
    { id: 'account', name: 'Account', icon: MdPerson },
    { id: 'notifications', name: 'Notifications', icon: MdNotifications, badge: '3' },
    { id: 'settings', name: 'Settings', icon: MdSettings },
    { id: 'help', name: 'Help', icon: MdHelp },
  ];

  return (
    <Box
      w="280px"
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.100"
      position="relative"
      display="flex"
      flexDirection="column"
      boxShadow="2px 0 20px rgba(0, 0, 0, 0.03)"
    >
      {/* Animated Background Gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="200px"
        bgGradient="linear(180deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%)"
        pointerEvents="none"
      />

      {/* Logo Section */}
      <Box p={6} position="relative" zIndex={1}>
        <HStack spacing={3}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Box
              w="48px"
              h="48px"
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 8px 24px rgba(102, 126, 234, 0.3)"
            >
              <Text fontSize="xl" fontWeight="bold" color="white">F</Text>
            </Box>
          </motion.div>
          <Box>
            <Text fontSize="xl" fontWeight="800" color="gray.900" letterSpacing="-0.5px">
              FitHub
            </Text>
            <Text fontSize="xs" color="gray.500" fontWeight="600" letterSpacing="0.5px">
              FITNESS DASHBOARD
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Quick Action Button */}
      <Box px={4} pb={4} position="relative" zIndex={1}>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            leftIcon={<FiPlus />}
            w="full"
            h="48px"
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            borderRadius="xl"
            fontWeight="700"
            fontSize="sm"
            letterSpacing="0.3px"
            _hover={{
              bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            }}
            transition="all 0.3s"
            boxShadow="0 4px 16px rgba(102, 126, 234, 0.3)"
          >
            Log Activity
          </Button>
        </motion.div>
      </Box>

      {/* Main Menu */}
      <Box flex={1} overflowY="auto" px={3} position="relative" zIndex={1}>
        <VStack spacing={2} align="stretch">
          {menuItems.map((item, index) => {
            const isActive = activePage === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flex
                    align="center"
                    px={4}
                    py={3}
                    borderRadius="xl"
                    cursor="pointer"
                    bg={isActive ? 'white' : 'transparent'}
                    color={isActive ? 'gray.900' : 'gray.600'}
                    fontWeight={isActive ? '700' : '600'}
                    fontSize="sm"
                    position="relative"
                    boxShadow={isActive ? '0 4px 16px rgba(102, 126, 234, 0.15)' : 'none'}
                    _hover={{
                      bg: isActive ? 'white' : 'gray.50',
                      color: 'gray.900',
                    }}
                    transition="all 0.3s"
                    onClick={() => onNavigate && onNavigate(item.id)}
                  >
                    {isActive && (
                      <Box
                        position="absolute"
                        left={0}
                        top="50%"
                        transform="translateY(-50%)"
                        w="4px"
                        h="70%"
                        bgGradient={item.gradient}
                        borderRadius="0 4px 4px 0"
                        boxShadow={`0 0 12px ${item.gradient.includes('667eea') ? 'rgba(102, 126, 234, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`}
                      />
                    )}
                    <Box
                      w="36px"
                      h="36px"
                      bgGradient={isActive ? item.gradient : 'linear(135deg, #F3F4F6 0%, #E5E7EB 100%)'}
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={3}
                      boxShadow={isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'}
                    >
                      <Icon as={item.icon} boxSize={5} color={isActive ? 'white' : 'gray.600'} />
                    </Box>
                    <Text flex={1} letterSpacing="0.2px">{item.name}</Text>
                    {item.badge && (
                      <Badge
                        bgGradient={item.badge === 'New' ? 'linear(135deg, #EF4444 0%, #DC2626 100%)' : item.badge === '24/7' ? 'linear(135deg, #8B5CF6 0%, #7C3AED 100%)' : 'linear(135deg, #3B82F6 0%, #2563EB 100%)'}
                        color="white"
                        borderRadius="full"
                        fontSize="10px"
                        px={2}
                        py={0.5}
                        fontWeight="700"
                        boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Flex>
                </motion.div>
              </motion.div>
            );
          })}
        </VStack>
      </Box>

      <Divider opacity={0.3} />

      {/* Bottom Menu */}
      <Box px={3} py={4} position="relative" zIndex={1}>
        <VStack spacing={2} align="stretch">
          {bottomItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <Flex
                key={item.id}
                align="center"
                px={4}
                py={2.5}
                borderRadius="lg"
                cursor="pointer"
                color={isActive ? 'gray.900' : 'gray.600'}
                fontWeight={isActive ? '700' : '600'}
                fontSize="sm"
                _hover={{
                  bg: 'gray.50',
                  color: 'gray.900',
                }}
                transition="all 0.2s"
                onClick={() => onNavigate && onNavigate(item.id)}
              >
                <Icon as={item.icon} boxSize={5} mr={3} />
                <Text flex={1}>{item.name}</Text>
                {item.badge && (
                  <Badge
                    bgGradient="linear(135deg, #EF4444 0%, #DC2626 100%)"
                    color="white"
                    borderRadius="full"
                    fontSize="10px"
                    px={2}
                    py={0.5}
                    fontWeight="700"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Flex>
            );
          })}
        </VStack>
      </Box>

      {/* User Profile Card */}
      <Box p={4} borderTop="1px solid" borderColor="gray.100" position="relative" zIndex={1}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            p={3}
            bgGradient="linear(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
          >
            <HStack spacing={3}>
              <Avatar
                size="sm"
                name="Fitness Warrior"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                border="2px solid white"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
              />
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="700" color="gray.900">
                  Fitness Warrior
                </Text>
                <Text fontSize="xs" color="gray.500" fontWeight="600">
                  Level 5 • 2,450 XP
                </Text>
              </Box>
            </HStack>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Sidebar;
