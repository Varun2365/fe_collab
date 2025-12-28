import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  AvatarBadge,
  IconButton,
  VStack,
  HStack,
  Divider,
  Badge,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Switch,
  FormControl,
  FormLabel,
  Button,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiSend,
  FiCheck,
  FiInbox,
  FiFileText,
  FiUsers,
  FiBarChart2,
  FiMail,
  FiMessageCircle,
  FiSettings,
  FiChevronDown,
} from 'react-icons/fi';

// Dummy data for conversations
const dummyConversations = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+1 234 567 8900',
    lastMessage: 'Hey, thanks for the update!',
    timestamp: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    phone: '+1 234 567 8901',
    lastMessage: 'Can we schedule a call tomorrow?',
    timestamp: '9:15 AM',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    phone: '+1 234 567 8902',
    lastMessage: 'The project looks great!',
    timestamp: 'Yesterday',
    unreadCount: 1,
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'Emily Davis',
    phone: '+1 234 567 8903',
    lastMessage: 'I will send the files shortly.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    name: 'David Brown',
    phone: '+1 234 567 8904',
    lastMessage: 'Thanks for your help!',
    timestamp: '2 days ago',
    unreadCount: 0,
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    phone: '+1 234 567 8905',
    lastMessage: 'Looking forward to our meeting.',
    timestamp: '2 days ago',
    unreadCount: 3,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: 7,
    name: 'Robert Taylor',
    phone: '+1 234 567 8906',
    lastMessage: 'The deadline is next week.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    phone: '+1 234 567 8907',
    lastMessage: 'Perfect! See you then.',
    timestamp: '3 days ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];

// Dummy messages for selected conversation
const getDummyMessages = (conversationId) => {
  const messages = {
    1: [
      { id: 1, text: 'Hey, how are you?', sender: 'them', time: '9:15 AM', status: 'read' },
      { id: 2, text: "I'm doing great, thanks for asking!", sender: 'me', time: '9:20 AM', status: 'read' },
      { id: 3, text: 'That sounds wonderful!', sender: 'them', time: '9:22 AM', status: 'read' },
      { id: 4, text: 'Hey, thanks for the update!', sender: 'them', time: '10:30 AM', status: 'read' },
    ],
    2: [
      { id: 1, text: 'Hi Sarah!', sender: 'me', time: '8:00 AM', status: 'read' },
      { id: 2, text: 'Can we schedule a call tomorrow?', sender: 'them', time: '9:15 AM', status: 'read' },
    ],
    3: [
      { id: 1, text: 'The project looks great!', sender: 'them', time: 'Yesterday 3:45 PM', status: 'read' },
      { id: 2, text: 'Thank you! I appreciate the feedback.', sender: 'me', time: 'Yesterday 4:00 PM', status: 'read' },
    ],
  };
  return messages[conversationId] || [
    { id: 1, text: 'Start of conversation', sender: 'system', time: 'Now', status: 'read' },
  ];
};

const MessagingDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(dummyConversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(getDummyMessages(1));
  const [sidebarWidth, setSidebarWidth] = useState('320px');
  const [activeTab, setActiveTab] = useState(0);
  const [messagingMode, setMessagingMode] = useState('whatsapp'); // 'whatsapp' or 'email'
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    appPassword: '',
    fromEmail: '',
  });

  const whatsappTabNames = ['Inbox', 'Templates', 'Contacts', 'Credits Usage Analytics'];
  const whatsappTabIcons = [FiInbox, FiFileText, FiUsers, FiBarChart2];
  
  const emailTabNames = ['Inbox', 'Settings', 'Contacts', 'Analytics'];
  const emailTabIcons = [FiInbox, FiSettings, FiUsers, FiBarChart2];

  const tabNames = messagingMode === 'whatsapp' ? whatsappTabNames : emailTabNames;
  const tabIcons = messagingMode === 'whatsapp' ? whatsappTabIcons : emailTabIcons;

  const bgColor = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('#f7f8fa', 'gray.900');
  const chatBg = useColorModeValue('#e5ddd5', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  
  // Professional color scheme
  const primaryBlue = useColorModeValue('#0084ff', '#0084ff');
  const primaryGreen = useColorModeValue('#128C7E', '#128C7E'); // Darker WhatsApp green
  const accentColor = messagingMode === 'whatsapp' ? primaryGreen : primaryBlue;
  const sentMessageBg = useColorModeValue('#dcf8c6', '#2b5278');
  const receivedMessageBg = useColorModeValue('white', '#2a2f35');
  const activeChatBg = useColorModeValue('#f0f2f5', '#2a2f35');
  const accentGreen = useColorModeValue('#128C7E', '#128C7E'); // Darker WhatsApp green

  const filteredConversations = dummyConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.phone.includes(searchQuery)
  );

  useEffect(() => {
    setMessages(getDummyMessages(selectedConversation.id));
    // Auto-focus input when conversation changes
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      if (event.detail && event.detail.width) {
        setSidebarWidth(event.detail.width);
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    // Set initial sidebar width by checking the actual sidebar element
    const checkSidebarWidth = () => {
      // Try to find sidebar by common selectors
      const sidebar = document.querySelector('aside') || 
                      document.querySelector('[role="complementary"]') ||
                      Array.from(document.querySelectorAll('*')).find(el => {
                        const style = window.getComputedStyle(el);
                        return style.position === 'fixed' && 
                               style.left === '0px' && 
                               (style.width === '320px' || style.width === '80px' || style.width === '300px' || style.width === '280px');
                      });
      
      if (sidebar) {
        const computedWidth = window.getComputedStyle(sidebar).width;
        if (computedWidth && computedWidth !== '0px') {
          setSidebarWidth(computedWidth);
        }
      } else {
        // Fallback to default
        setSidebarWidth('320px');
      }
    };

    // Check immediately and after a short delay to ensure DOM is ready
    checkSidebarWidth();
    const timeoutId = setTimeout(checkSidebarWidth, 100);

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Keep focus on input after sending
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 10);

    // Simulate read status after a delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box 
      h="100vh" 
      w={{ base: "100vw", md: `calc(100vw - ${sidebarWidth})` }}
      left={{ base: 0, md: sidebarWidth }}
      display="flex" 
      flexDirection="column" 
      bg={sidebarBg} 
      position="fixed" 
      top={0} 
      zIndex={1000}
      overflow="hidden"
      transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Flex flex={1} overflow="hidden">
        {/* Left Sidebar - Conversations List */}
        <Box
          w="30%"
          minW="300px"
          bg={bgColor}
          borderRight="1px solid"
          borderColor={borderColor}
          display="flex"
          flexDirection="column"
        >
          {/* Tabs Section */}
          <Tabs 
            index={activeTab} 
            onChange={setActiveTab}
            variant="unstyled"
            display="flex"
            flexDirection="column"
            flex={1}
            overflow="hidden"
          >
            {/* Heading Section */}
            <Box
              p={6}
              pb={4}
              borderBottom="1px solid"
              borderColor={borderColor}
              bg={bgColor}
            >
              <HStack justify="space-between" mb={4}>
                <Text fontSize="2xl" fontWeight="700" color={textColor} letterSpacing="-0.02em">
                  {tabNames[activeTab]}
          </Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FiChevronDown size={14} />}
                    w="180px"
                    size="sm"
                    bg={bgColor}
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{ 
                      bg: hoverBg,
                      borderColor: accentColor,
                      transform: 'translateY(-1px)',
                    }}
                    _active={{ 
                      bg: hoverBg,
                      borderColor: accentColor,
                    }}
                    _focus={{ 
                      borderColor: accentColor,
                      boxShadow: `0 0 0 1px ${accentColor}`,
                    }}
                    transition="all 0.2s"
                    fontWeight="600"
                    fontSize="sm"
                    color={textColor}
                  >
                    <HStack spacing={2} justify="center">
                      {messagingMode === 'whatsapp' ? (
                        <>
                          <FiMessageCircle size={16} color={accentColor} />
                          <Text>WhatsApp</Text>
                        </>
                      ) : (
                        <>
                          <FiMail size={16} color={accentColor} />
                          <Text>Email</Text>
                        </>
                      )}
                    </HStack>
                  </MenuButton>
                  <MenuList
                    bg={bgColor}
                    border="1px solid"
                    borderColor={borderColor}
                    boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    minW="180px"
                    py={1}
                    animation="slideDown 0.2s ease-out"
                    sx={{
                      '@keyframes slideDown': {
                        from: {
                          opacity: 0,
                          transform: 'translateY(-10px)',
                        },
                        to: {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    <MenuItem
                      icon={<FiMessageCircle size={16} color={messagingMode === 'whatsapp' ? accentColor : mutedText} />}
            onClick={() => {
                        setMessagingMode('whatsapp');
                        setActiveTab(0);
                      }}
                      bg={messagingMode === 'whatsapp' ? activeChatBg : 'transparent'}
                      color={messagingMode === 'whatsapp' ? accentColor : textColor}
                      fontWeight={messagingMode === 'whatsapp' ? '600' : '500'}
                      _hover={{
                        bg: activeChatBg,
                        transform: 'translateX(4px)',
                      }}
                      transition="all 0.2s"
                    >
                      WhatsApp
                    </MenuItem>
                    <MenuItem
                      icon={<FiMail size={16} color={messagingMode === 'email' ? accentColor : mutedText} />}
                      onClick={() => {
                        setMessagingMode('email');
                        setActiveTab(0);
                      }}
                      bg={messagingMode === 'email' ? activeChatBg : 'transparent'}
                      color={messagingMode === 'email' ? accentColor : textColor}
                      fontWeight={messagingMode === 'email' ? '600' : '500'}
                      _hover={{
                        bg: activeChatBg,
                        transform: 'translateX(4px)',
                      }}
                      transition="all 0.2s"
                    >
                      Email
                    </MenuItem>
                  </MenuList>
                </Menu>
      </HStack>

              {/* Underline Tab Bar */}
              <TabList border="none" gap={2}>
                <Tab 
                  fontSize="xs" 
                  fontWeight="600" 
                  px={3} 
                  py={2}
                  _selected={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
                  borderBottom="2px solid transparent"
                  color={mutedText}
                  _hover={{ color: textColor }}
                  transition="all 0.2s"
                >
                  <HStack spacing={1.5}>
                    <FiInbox size={14} />
                    <Text>Inbox</Text>
                  </HStack>
                </Tab>
                {messagingMode === 'whatsapp' ? (
                  <Tab 
                    fontSize="xs" 
                    fontWeight="600" 
                    px={3} 
                    py={2}
                    _selected={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
                    borderBottom="2px solid transparent"
                    color={mutedText}
                    _hover={{ color: textColor }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={1.5}>
                      <FiFileText size={14} />
                      <Text>Templates</Text>
                    </HStack>
                  </Tab>
                ) : (
                  <Tab 
                    fontSize="xs" 
                    fontWeight="600" 
                    px={3} 
                    py={2}
                    _selected={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
                    borderBottom="2px solid transparent"
                    color={mutedText}
                    _hover={{ color: textColor }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={1.5}>
                      <FiSettings size={14} />
                      <Text>Settings</Text>
                    </HStack>
                  </Tab>
                )}
                <Tab 
                  fontSize="xs" 
                  fontWeight="600" 
                  px={3} 
                  py={2}
                  _selected={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
                  borderBottom="2px solid transparent"
                  color={mutedText}
                  _hover={{ color: textColor }}
                  transition="all 0.2s"
                >
                  <HStack spacing={1.5}>
                    <FiUsers size={14} />
                    <Text>Contacts</Text>
                  </HStack>
                </Tab>
                <Tab 
                  fontSize="xs" 
                  fontWeight="600" 
                  px={3} 
                  py={2}
                  _selected={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
                  borderBottom="2px solid transparent"
                  color={mutedText}
                  _hover={{ color: textColor }}
                  transition="all 0.2s"
                >
                  <HStack spacing={1.5}>
                    <FiBarChart2 size={14} />
                    <Text>{messagingMode === 'whatsapp' ? 'Credits' : 'Analytics'}</Text>
                  </HStack>
                </Tab>
        </TabList>
            </Box>

            <TabPanels flex={1} overflow="hidden" display="flex" flexDirection="column">
              {/* Inbox Tab */}
              <TabPanel p={0} flex={1} display="flex" flexDirection="column" overflow="hidden">
                <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiSearch color="gray" />
                    </InputLeftElement>
                    <Input
                      placeholder={messagingMode === 'whatsapp' ? 'Search conversations' : 'Search emails'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      bg={hoverBg}
                      border="none"
                      borderRadius="lg"
                      _focus={{ bg: bgColor, border: '1px solid', borderColor: accentColor }}
                      fontSize="sm"
                    />
                  </InputGroup>
                </Box>
                <Box 
                  flex={1} 
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
                      borderRadius: '10px',
                      transition: 'background 0.2s',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
                    },
                  }}
                >
                  {messagingMode === 'whatsapp' ? (
                    filteredConversations.map((conversation) => (
                    <Box
                      key={conversation.id}
                      p={3}
                      cursor="pointer"
                      bg={selectedConversation.id === conversation.id ? activeChatBg : 'transparent'}
                      _hover={{ bg: activeChatBg }}
                      borderBottom="1px solid"
                      borderColor={borderColor}
                      onClick={() => setSelectedConversation(conversation)}
                      transition="background 0.2s"
                      borderLeft={selectedConversation.id === conversation.id ? '3px solid' : '3px solid transparent'}
                      borderLeftColor={selectedConversation.id === conversation.id ? accentColor : 'transparent'}
                    >
                      <HStack spacing={3}>
                        <Avatar size="md" src={conversation.avatar} name={conversation.name} border={selectedConversation.id === conversation.id ? `2px solid ${accentColor}` : 'none'}>
                          {conversation.isOnline && (
                            <AvatarBadge boxSize="1em" bg={accentGreen} border="2px solid" borderColor={bgColor} />
                          )}
                        </Avatar>
                        <Flex flex={1} direction="column" minW={0}>
                          <HStack justify="space-between" mb={1}>
                            <Text
                              fontSize="sm"
                              fontWeight={selectedConversation.id === conversation.id ? '600' : '500'}
                              color={textColor}
                              noOfLines={1}
                            >
                              {conversation.name}
                            </Text>
                            <Text fontSize="xs" color={mutedText}>
                              {conversation.timestamp}
                            </Text>
                    </HStack>
                          <HStack justify="space-between">
                            <Text
                              fontSize="xs"
                              color={mutedText}
                              noOfLines={1}
                              flex={1}
                            >
                              {conversation.lastMessage}
                      </Text>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                bg={accentColor}
                                color="white"
                                borderRadius="full"
                                minW="20px"
                                h="20px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="xs"
                                fontWeight="600"
                                boxShadow={messagingMode === 'whatsapp' ? '0 2px 4px rgba(37, 211, 102, 0.3)' : '0 2px 4px rgba(0, 132, 255, 0.3)'}
                              >
                                {conversation.unreadCount}
                      </Badge>
                            )}
                    </HStack>
                        </Flex>
                      </HStack>
                    </Box>
                    ))
                  ) : (
                    // Email conversations
                    filteredConversations.map((conversation) => (
                      <Box
                        key={conversation.id}
                        p={3}
                        cursor="pointer"
                        bg={selectedConversation.id === conversation.id ? activeChatBg : 'transparent'}
                        _hover={{ bg: activeChatBg }}
                        borderBottom="1px solid"
                        borderColor={borderColor}
                        onClick={() => setSelectedConversation(conversation)}
                        transition="background 0.2s"
                        borderLeft={selectedConversation.id === conversation.id ? '3px solid' : '3px solid transparent'}
                        borderLeftColor={selectedConversation.id === conversation.id ? accentColor : 'transparent'}
                      >
                        <HStack spacing={3}>
                          <Avatar size="md" src={conversation.avatar} name={conversation.name} border={selectedConversation.id === conversation.id ? `2px solid ${accentColor}` : 'none'}>
                            <AvatarBadge boxSize="0.8em" bg={messagingMode === 'whatsapp' ? accentColor : primaryBlue} border="2px solid" borderColor={bgColor} />
                          </Avatar>
                          <Flex flex={1} direction="column" minW={0}>
                            <HStack justify="space-between" mb={1}>
                              <Text
                                fontSize="sm"
                                fontWeight={selectedConversation.id === conversation.id ? '600' : '500'}
                                color={textColor}
                                noOfLines={1}
                              >
                                {conversation.name}
                      </Text>
                              <Text fontSize="xs" color={mutedText}>
                                {conversation.timestamp}
                      </Text>
                    </HStack>
                            <HStack justify="space-between">
                              <Text
                                fontSize="xs"
                                color={mutedText}
                                noOfLines={1}
                                flex={1}
                              >
                                {conversation.lastMessage}
                      </Text>
                              {conversation.unreadCount > 0 && (
                                <Badge
                                  bg={primaryBlue}
                                  color="white"
                                  borderRadius="full"
                                  minW="20px"
                                  h="20px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  fontSize="xs"
                                  fontWeight="600"
                                  boxShadow="0 2px 4px rgba(0, 132, 255, 0.3)"
                                >
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                    </HStack>
                          </Flex>
                        </HStack>
                      </Box>
                    ))
                  )}
                </Box>
          </TabPanel>

              {/* Templates Tab (WhatsApp) / Settings Tab (Email) */}
              {messagingMode === 'whatsapp' ? (
                <TabPanel 
                  p={4} 
                  flex={1} 
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
                      borderRadius: '10px',
                      transition: 'background 0.2s',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
                    },
                  }}
                >
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="md" fontWeight="600" color={textColor}>
                      Message Templates
                    </Text>
                    <Text fontSize="sm" color={mutedText}>
                      Manage your WhatsApp message templates
                    </Text>
                    <Divider />
                    <VStack spacing={3} align="stretch">
                      {[
                        { name: 'Welcome Message', status: 'Approved', category: 'UTILITY' },
                        { name: 'Order Confirmation', status: 'Approved', category: 'UTILITY' },
                        { name: 'Payment Reminder', status: 'Pending', category: 'MARKETING' },
                        { name: 'Appointment Reminder', status: 'Approved', category: 'UTILITY' },
                      ].map((template, idx) => (
                        <Box
                          key={idx}
                          p={3}
                          bg={hoverBg}
                          borderRadius="md"
                          border="1px solid"
                          borderColor={borderColor}
                        >
                          <HStack justify="space-between" mb={2}>
                            <Text fontSize="sm" fontWeight="600" color={textColor}>
                              {template.name}
                            </Text>
                            <Badge
                              colorScheme={template.status === 'Approved' ? 'green' : 'orange'}
                              fontSize="xs"
                            >
                              {template.status}
                            </Badge>
                          </HStack>
                          <Text fontSize="xs" color={mutedText}>
                            Category: {template.category}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
                </TabPanel>
              ) : (
                <TabPanel 
                  p={4} 
                  flex={1} 
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
                      borderRadius: '10px',
                      transition: 'background 0.2s',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
                    },
                  }}
                >
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontSize="md" fontWeight="600" color={textColor} mb={2}>
                        Email Configuration
                      </Text>
                      <Text fontSize="sm" color={mutedText}>
                        Configure SMTP settings and app passwords for email messaging
                      </Text>
                    </Box>
                    <Divider />
                    <Box bg={hoverBg} p={6} borderRadius="lg" border="1px solid" borderColor={borderColor}>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                            SMTP Host
                          </FormLabel>
                          <Input
                            placeholder="smtp.gmail.com"
                            value={emailSettings.smtpHost}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                            bg={bgColor}
                            borderColor={borderColor}
                            _focus={{ borderColor: primaryBlue }}
                          />
                      </FormControl>
                      <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                            SMTP Port
                          </FormLabel>
                          <Input
                            type="number"
                            placeholder="587"
                            value={emailSettings.smtpPort}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                            bg={bgColor}
                            borderColor={borderColor}
                            _focus={{ borderColor: primaryBlue }}
                          />
                      </FormControl>
                      <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                            SMTP Username / Email
                          </FormLabel>
                        <Input
                            type="email"
                            placeholder="your-email@gmail.com"
                            value={emailSettings.smtpUser}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                            bg={bgColor}
                            borderColor={borderColor}
                            _focus={{ borderColor: primaryBlue }}
                        />
                      </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                            SMTP Password / App Password
                          </FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter your app password"
                            value={emailSettings.smtpPassword}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                            bg={bgColor}
                            borderColor={borderColor}
                            _focus={{ borderColor: primaryBlue }}
                          />
                          <Text fontSize="xs" color={mutedText} mt={1}>
                            For Gmail, use an App Password instead of your regular password
                          </Text>
                      </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                            From Email Address
                          </FormLabel>
                        <Input
                            type="email"
                            placeholder="noreply@yourdomain.com"
                            value={emailSettings.fromEmail}
                            onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                            bg={bgColor}
                            borderColor={borderColor}
                            _focus={{ borderColor: primaryBlue }}
                        />
                      </FormControl>
                        <HStack spacing={3} pt={2}>
                      <Button
                            colorScheme="blue"
                            onClick={() => {
                              // Handle save email settings
                              console.log('Saving email settings:', emailSettings);
                            }}
                          >
                            Save Settings
                      </Button>
                      <Button
                        variant="outline"
                            onClick={() => {
                              // Handle test email
                              console.log('Testing email configuration');
                            }}
                          >
                            Test Connection
                      </Button>
                    </HStack>
                      </VStack>
                    </Box>
                                  </VStack>
                </TabPanel>
              )}

              {/* Contacts Tab */}
              <TabPanel 
                p={4} 
                flex={1} 
                overflowY="auto"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
                    borderRadius: '10px',
                    transition: 'background 0.2s',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
                  },
                }}
              >
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="md" fontWeight="600" color={textColor}>
                      Contacts
                      </Text>
                    <IconButton
                      icon={<FiMoreVertical />}
                      variant="ghost"
                          size="sm"
                      aria-label="More options"
                    />
                      </HStack>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiSearch color="gray" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search contacts"
                      bg={hoverBg}
                      border="none"
                      borderRadius="lg"
                      _focus={{ bg: bgColor, border: '1px solid', borderColor: accentColor }}
                      fontSize="sm"
                    />
                  </InputGroup>
                  <Divider />
                  <VStack spacing={2} align="stretch">
                    {dummyConversations.map((contact) => (
                      <Box
                        key={contact.id}
                        p={3}
                        cursor="pointer"
                        bg={hoverBg}
                        borderRadius="md"
                        _hover={{ bg: activeChatBg }}
                      >
                        <HStack spacing={3}>
                          <Avatar size="sm" src={contact.avatar} name={contact.name}>
                            {contact.isOnline && (
                              <AvatarBadge boxSize="0.8em" bg={accentGreen} border="2px solid" borderColor={bgColor} />
                            )}
                          </Avatar>
                          <Flex flex={1} direction="column">
                            <Text fontSize="sm" fontWeight="500" color={textColor}>
                              {contact.name}
                            </Text>
                            <Text fontSize="xs" color={mutedText}>
                              {contact.phone}
                            </Text>
                          </Flex>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
          </TabPanel>

              {/* Credits Usage Analytics Tab */}
              <TabPanel 
                p={4} 
                flex={1} 
                overflowY="auto"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
                    borderRadius: '10px',
                    transition: 'background 0.2s',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
                  },
                }}
              >
                <VStack spacing={6} align="stretch">
                  <Text fontSize="md" fontWeight="600" color={textColor}>
                    Credits Usage Analytics
                    </Text>
                  <Text fontSize="sm" color={mutedText}>
                    Monitor your Meta WhatsApp API usage and costs
                    </Text>
                  <Divider />
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat bg={hoverBg} p={4} borderRadius="md">
                      <StatLabel fontSize="xs" color={mutedText}>Total Credits</StatLabel>
                      <StatNumber fontSize="2xl" color={textColor}>10,000</StatNumber>
                      <StatHelpText fontSize="xs">Available credits</StatHelpText>
                    </Stat>
                    <Stat bg={hoverBg} p={4} borderRadius="md">
                      <StatLabel fontSize="xs" color={mutedText}>Used This Month</StatLabel>
                      <StatNumber fontSize="2xl" color={messagingMode === 'whatsapp' ? accentColor : primaryBlue}>3,245</StatNumber>
                      <StatHelpText fontSize="xs">32.45% of total</StatHelpText>
                    </Stat>
                    <Stat bg={hoverBg} p={4} borderRadius="md">
                      <StatLabel fontSize="xs" color={mutedText}>Messages Sent</StatLabel>
                      <StatNumber fontSize="2xl" color={textColor}>8,432</StatNumber>
                      <StatHelpText fontSize="xs">Last 30 days</StatHelpText>
                    </Stat>
                    <Stat bg={hoverBg} p={4} borderRadius="md">
                      <StatLabel fontSize="xs" color={mutedText}>Avg Cost/Message</StatLabel>
                      <StatNumber fontSize="2xl" color={textColor}>$0.004</StatNumber>
                      <StatHelpText fontSize="xs">Per message</StatHelpText>
                    </Stat>
                  </SimpleGrid>
                  <Box bg={hoverBg} p={4} borderRadius="md">
                    <Text fontSize="sm" fontWeight="600" color={textColor} mb={3}>
                      Usage Breakdown
                    </Text>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="xs" color={mutedText}>Text Messages</Text>
                          <Text fontSize="xs" fontWeight="600" color={textColor}>2,145 (65%)</Text>
                        </HStack>
                        <Progress value={65} colorScheme="blue" size="sm" borderRadius="full" />
                  </Box>
                      <Box>
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="xs" color={mutedText}>Media Messages</Text>
                          <Text fontSize="xs" fontWeight="600" color={textColor}>850 (26%)</Text>
                </HStack>
                        <Progress value={26} colorScheme="green" size="sm" borderRadius="full" />
                  </Box>
                      <Box>
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="xs" color={mutedText}>Template Messages</Text>
                          <Text fontSize="xs" fontWeight="600" color={textColor}>250 (9%)</Text>
                        </HStack>
                        <Progress value={9} colorScheme="purple" size="sm" borderRadius="full" />
                  </Box>
                    </VStack>
                  </Box>
                  <Button
                    bg={accentColor}
                    color="white"
                    size="lg"
                    w="full"
                    fontWeight="600"
                    borderRadius="lg"
                    _hover={{
                      bg: messagingMode === 'whatsapp' ? '#0f7a6d' : '#0066cc',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                    _active={{
                      transform: 'translateY(0)',
                    }}
                    transition="all 0.2s"
                    onClick={() => {
                      // Handle buy more credits
                      console.log('Buy more credits clicked');
                    }}
                  >
                    Buy More Credits
                  </Button>
                </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
                    </Box>

        {/* Right Side - Chat Area */}
        <Box flex={1} display="flex" flexDirection="column" bg={chatBg}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <Box
                p={4}
                bg={useColorModeValue('#f0f2f5', '#2a2f35')}
                borderBottom="1px solid"
                borderColor={borderColor}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
              >
                <HStack spacing={3}>
                  <Avatar size="md" src={selectedConversation.avatar} name={selectedConversation.name}>
                    {selectedConversation.isOnline && (
                      <AvatarBadge boxSize="1em" bg={accentGreen} border="2px solid" borderColor={bgColor} />
                    )}
                  </Avatar>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="md" fontWeight="600" color={textColor}>
                      {selectedConversation.name}
                                  </Text>
                    <HStack spacing={1}>
                      <Box w="8px" h="8px" borderRadius="full" bg={selectedConversation.isOnline ? (messagingMode === 'whatsapp' ? accentGreen : primaryBlue) : mutedText} />
                      <Text fontSize="xs" color={mutedText}>
                        {selectedConversation.isOnline ? 'Online' : 'Offline'}
                                    </Text>
                    </HStack>
                                  </VStack>
                </HStack>
                                  <IconButton
                  icon={<FiMoreVertical />}
                  variant="ghost"
                                    size="sm"
                  aria-label="More options"
                />
                    </Box>

              {/* Messages Area */}
              <Box
                flex={1}
                overflowY="auto"
                p={4}
                bg={chatBg}
                position="relative"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: useColorModeValue('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
                    borderRadius: '10px',
                    transition: 'background 0.2s',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
                  },
                }}
              >
                <VStack spacing={3} align="stretch" position="relative" zIndex={1} style={{ isolation: 'isolate' }}>
                  {messages.map((message) => {
                    const isMe = message.sender === 'me';
                    const isSystem = message.sender === 'system';

                    if (isSystem) {
                      return (
                        <Text
                          key={message.id}
                          textAlign="center"
                          fontSize="xs"
                          color={mutedText}
                          py={2}
                        >
                          {message.text}
                      </Text>
                      );
                    }

                    return (
                      <Flex
                        key={message.id}
                        justify={isMe ? 'flex-end' : 'flex-start'}
                        align="flex-end"
                      >
                        <Box
                          maxW="65%"
                          px={4}
                          py={2.5}
                          borderRadius={isMe ? "7px 7px 0 7px" : "7px 7px 7px 0"}
                          bg={isMe ? sentMessageBg : receivedMessageBg}
                          boxShadow="0 1px 2px rgba(0, 0, 0, 0.1)"
                          position="relative"
                          border={isMe ? 'none' : `1px solid ${borderColor}`}
                        >
                          <Text fontSize="sm" color={textColor} mb={1.5} lineHeight="1.4">
                            {message.text}
                    </Text>
                          <HStack spacing={1.5} justify="flex-end" mt={1}>
                            <Text fontSize="xs" color={mutedText} fontWeight="500">
                              {message.time}
                    </Text>
                            {isMe && (
                              <Box color={message.status === 'read' ? accentColor : mutedText} display="flex" alignItems="center">
                                {message.status === 'read' ? (
                                  <HStack spacing={-1.5}>
                                    <FiCheck size={14} />
                                    <FiCheck size={14} />
                </HStack>
                                ) : (
                                  <FiCheck size={14} />
                                )}
                  </Box>
                )}
                          </HStack>
                        </Box>
                      </Flex>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </VStack>
              </Box>

              {/* Message Input Area */}
              <Box
                p={4}
                bg={useColorModeValue('#f0f2f5', '#2a2f35')}
                borderTop="1px solid"
                borderColor={borderColor}
                boxShadow="0 -1px 3px rgba(0, 0, 0, 0.1)"
              >
                <HStack spacing={2}>
                  <IconButton
                    icon={<FiPaperclip />}
                    variant="ghost"
                    size="md"
                    aria-label="Attach file"
                  />
                    <Input
                    ref={messageInputRef}
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    bg={hoverBg}
                    border="none"
                    borderRadius="full"
                    _focus={{ bg: bgColor, border: '1px solid', borderColor: accentColor }}
                    fontSize="sm"
                  />
                  <IconButton
                    icon={<FiSmile />}
                    variant="ghost"
                    size="md"
                    aria-label="Emoji"
                    color={mutedText}
                    _hover={{ bg: hoverBg, color: textColor }}
                  />
                  <IconButton
                    icon={<FiSend />}
                    bg={accentColor}
                    color="white"
                    size="md"
                    aria-label="Send message"
              onClick={handleSendMessage}
                    isDisabled={!messageInput.trim()}
                    borderRadius="full"
                    _hover={{ bg: messagingMode === 'whatsapp' ? '#1fa855' : '#0066cc' }}
                    _active={{ bg: messagingMode === 'whatsapp' ? '#1a8f48' : '#0052a3' }}
                    _disabled={{ bg: 'gray.300', cursor: 'not-allowed' }}
                    transition="all 0.2s"
                  />
                </HStack>
              </Box>
            </>
          ) : (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={chatBg}
            >
              <VStack spacing={4}>
                <Text fontSize="xl" color={mutedText} fontWeight="500">
                  Select a conversation to start messaging
                </Text>
                <Text fontSize="sm" color={mutedText}>
                  Choose a contact from the list to view messages
                </Text>
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default MessagingDashboard;
