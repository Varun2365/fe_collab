import React from 'react';
import {
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Avatar,
  Text,
  HStack,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  BellIcon, 
  ChevronDownIcon,
  SettingsIcon,
} from '@chakra-ui/icons';

const Topbar = () => {
  return (
    <Box
      bg="white"
      px={8}
      py={4}
      borderBottom="1px solid"
      borderColor="gray.100"
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
      backdropFilter="blur(20px)"
    >
      <Flex justify="space-between" align="center">
        {/* Search Bar */}
        <InputGroup maxW="450px">
          <InputLeftElement pointerEvents="none" h="full">
            <SearchIcon color="gray.400" boxSize={4} />
          </InputLeftElement>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              placeholder="Search anything..."
              bg="gray.50"
              border="2px solid"
              borderColor="transparent"
              borderRadius="xl"
              h="44px"
              fontSize="sm"
              fontWeight="500"
              _hover={{
                borderColor: "gray.200",
                bg: "white",
              }}
              _focus={{
                bg: "white",
                borderColor: "#667eea",
                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)"
              }}
              transition="all 0.3s"
            />
          </motion.div>
        </InputGroup>

        {/* Right Side */}
        <HStack spacing={3}>
          {/* Notifications */}
          <Tooltip label="Notifications" placement="bottom" hasArrow>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Box position="relative">
                <IconButton
                  icon={<BellIcon />}
                  variant="ghost"
                  borderRadius="xl"
                  size="md"
                  aria-label="Notifications"
                  _hover={{ 
                    bg: "gray.100",
                    color: "#667eea"
                  }}
                  transition="all 0.2s"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Badge
                    position="absolute"
                    top="4px"
                    right="4px"
                    bgGradient="linear(135deg, #EF4444 0%, #DC2626 100%)"
                    color="white"
                    borderRadius="full"
                    w="8px"
                    h="8px"
                    border="2px solid white"
                    boxShadow="0 2px 8px rgba(239, 68, 68, 0.4)"
                  />
                </motion.div>
              </Box>
            </motion.div>
          </Tooltip>

          {/* Settings */}
          <Tooltip label="Settings" placement="bottom" hasArrow>
            <motion.div
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <IconButton
                icon={<SettingsIcon />}
                variant="ghost"
                borderRadius="xl"
                size="md"
                aria-label="Settings"
                _hover={{ 
                  bg: "gray.100",
                  color: "#667eea"
                }}
                transition="all 0.2s"
              />
            </motion.div>
          </Tooltip>

          {/* User Menu */}
          <Menu>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MenuButton
                as={Button}
                variant="ghost"
                borderRadius="xl"
                p={2}
                h="auto"
                _hover={{ bg: "gray.100" }}
                transition="all 0.2s"
              >
                <HStack spacing={3}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar
                      size="sm"
                      name="Fitness Warrior"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      border="2px solid"
                      borderColor="#667eea"
                      boxShadow="0 4px 12px rgba(102, 126, 234, 0.3)"
                    />
                  </motion.div>
                  <Box textAlign="left" display={{ base: 'none', md: 'block' }}>
                    <Text fontSize="sm" fontWeight="700" color="gray.900">
                      Fitness Warrior
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="600">
                      Level 5 • 2,450 XP
                    </Text>
                  </Box>
                  <ChevronDownIcon color="gray.400" boxSize={4} />
                </HStack>
              </MenuButton>
            </motion.div>
            <MenuList 
              borderRadius="xl" 
              border="1px solid" 
              borderColor="gray.200" 
              boxShadow="0 8px 24px rgba(0, 0, 0, 0.12)"
              p={2}
            >
              <MenuItem borderRadius="lg" _hover={{ bg: "gray.50" }} fontWeight="600">Profile</MenuItem>
              <MenuItem borderRadius="lg" _hover={{ bg: "gray.50" }} fontWeight="600">Settings</MenuItem>
              <MenuItem borderRadius="lg" _hover={{ bg: "red.50", color: "red.600" }} fontWeight="600">Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Topbar;
