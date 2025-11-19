import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Stack,
  Button,
  IconButton,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Textarea,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import {
  FiSettings,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiBarChart2,
  FiSend,
  FiSearch,
  FiFilter,
  FiEye,
  FiDownload,
} from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getToken } from '../../utils/authUtils';

const API_BASE_URL = 'https://api.funnelseye.com/api';
const PAGE_SIZE = 25;

const StatCard = ({ label, value, helper, icon, accent = 'blue' }) => (
  <Card border="1px" borderColor="gray.100" boxShadow="sm">
    <CardBody>
      <HStack justify="space-between" align="flex-start">
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="sm" color="gray.500">
            {label}
          </Text>
          <Heading size="md">{value ?? '--'}</Heading>
          {helper && (
            <Text fontSize="xs" color="gray.400">
              {helper}
            </Text>
          )}
        </VStack>
        <Box
          p={2}
          borderRadius="md"
          bg={`${accent}.50`}
          color={`${accent}.500`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
      </HStack>
    </CardBody>
  </Card>
);

const statusColorMap = {
  sent: 'green',
  delivered: 'green',
  read: 'blue',
  failed: 'red',
  pending: 'orange',
};

const MessagingDashboard = () => {
  const toast = useToast();
  const token = useSelector((state) => getToken(state.auth));

  const [config, setConfig] = useState(null);
  const [configForm, setConfigForm] = useState({
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: '',
  });
  const [analytics, setAnalytics] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [messagesPage, setMessagesPage] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [messageFilters, setMessageFilters] = useState({
    status: 'all',
    messageType: 'all',
    senderType: 'all',
    startDate: '',
    endDate: '',
    search: '',
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [messageForm, setMessageForm] = useState({
    to: '',
    type: 'text',
    body: '',
    templateName: '',
    parameters: '',
    mediaUrl: '',
    mediaType: 'image',
  });

  const {
    isOpen: isConfigDrawerOpen,
    onOpen: openConfigDrawer,
    onClose: closeConfigDrawer,
  } = useDisclosure();
  const {
    isOpen: isSendModalOpen,
    onOpen: openSendModal,
    onClose: closeSendModal,
  } = useDisclosure();

  const axiosRequest = useCallback(
    (options) => {
      if (!token) return Promise.reject(new Error('Missing auth token'));
      return axios({
        baseURL: API_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        ...options,
      });
    },
    [token]
  );

  const fetchConfig = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axiosRequest({
        method: 'GET',
        url: '/central-messaging/v1/config',
      });
      setConfig(data?.data || data);
    } catch (error) {
      console.error('Config fetch failed', error);
      setConfig(null);
      if (error.response?.status !== 404) {
        setGlobalError(error.response?.data?.message || error.message || 'Failed to load configuration');
      }
    }
  }, [axiosRequest, token]);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    setLoadingOverview(true);
    try {
      const { data } = await axiosRequest({
        method: 'GET',
        url: '/central-messaging/v1/analytics',
      });
      setAnalytics(data?.data || data);
    } catch (error) {
      console.error('Analytics fetch failed', error);
      setGlobalError(error.response?.data?.message || error.message || 'Failed to load analytics');
    } finally {
      setLoadingOverview(false);
    }
  }, [axiosRequest, token]);

  const fetchMessages = useCallback(
    async (page = 1) => {
      if (!token) return;
      setLoadingMessages(true);
      try {
        const params = new URLSearchParams({
          limit: PAGE_SIZE.toString(),
          offset: ((page - 1) * PAGE_SIZE).toString(),
        });

        Object.entries(messageFilters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            params.append(key, value);
          }
        });

        const { data } = await axiosRequest({
          method: 'GET',
          url: `/central-messaging/v1/messages?${params.toString()}`,
        });

        const payload = data?.data || data;
        setMessages(payload?.messages || []);
        setMessagesTotal(payload?.total || payload?.count || 0);
        setMessagesPage(page);
      } catch (error) {
        console.error('Messages fetch failed', error);
        setGlobalError(error.response?.data?.message || error.message || 'Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    },
    [axiosRequest, messageFilters, token]
  );

  const fetchTemplates = useCallback(async () => {
    if (!token) return;
    setLoadingTemplates(true);
    try {
      const { data } = await axiosRequest({
        method: 'GET',
        url: '/central-messaging/v1/admin/whatsapp/templates',
      });
      setTemplates(data?.data || data || []);
    } catch (error) {
      console.error('Templates fetch failed', error);
      setGlobalError(error.response?.data?.message || error.message || 'Failed to load templates');
    } finally {
      setLoadingTemplates(false);
    }
  }, [axiosRequest, token]);

  const refreshActiveTab = useCallback(() => {
    if (!token) return;
    switch (activeTab) {
      case 'overview':
        fetchConfig();
        fetchAnalytics();
        break;
      case 'messages':
        fetchMessages(messagesPage);
        break;
      case 'templates':
        fetchTemplates();
        break;
      default:
        break;
    }
  }, [activeTab, fetchAnalytics, fetchConfig, fetchMessages, fetchTemplates, messagesPage, token]);

  useEffect(() => {
    if (!token) return;
    fetchConfig();
  }, [fetchConfig, token]);

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'overview') {
      fetchAnalytics();
    } else if (activeTab === 'messages') {
      fetchMessages(1);
    } else if (activeTab === 'templates') {
      fetchTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  const handleConfigSubmit = async () => {
    if (!token) return;
    setActionLoading(true);
    setGlobalError('');
    setSuccessMessage('');
    try {
      await axiosRequest({
        method: 'POST',
        url: '/central-messaging/v1/setup',
        data: config
          ? { ...configForm, isUpdate: true }
          : configForm,
      });
      setSuccessMessage(config ? 'Configuration updated successfully' : 'Configuration saved successfully');
      closeConfigDrawer();
      fetchConfig();
    } catch (error) {
      console.error('Config save failed', error);
      setGlobalError(error.response?.data?.message || error.message || 'Failed to save configuration');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTestConfig = async () => {
    if (!token) return;
    setActionLoading(true);
    setGlobalError('');
    setSuccessMessage('');
    try {
      await axiosRequest({
        method: 'POST',
        url: '/central-messaging/v1/test-config',
      });
      setSuccessMessage('WhatsApp configuration is working correctly');
    } catch (error) {
      console.error('Config test failed', error);
      setGlobalError(error.response?.data?.message || error.message || 'Configuration test failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!token) return;
    if (!messageForm.to.trim()) {
      toast({
        title: 'Recipient required',
        status: 'warning',
      });
      return;
    }
    if (messageForm.type === 'text' && !messageForm.body.trim()) {
      toast({
        title: 'Message body required',
        status: 'warning',
      });
      return;
    }
    if (messageForm.type === 'template' && !messageForm.templateName) {
      toast({
        title: 'Select a template',
        status: 'warning',
      });
      return;
    }
    if (messageForm.type === 'media' && !messageForm.mediaUrl.trim()) {
      toast({
        title: 'Media URL required',
        status: 'warning',
      });
      return;
    }

    setActionLoading(true);
    setGlobalError('');
    setSuccessMessage('');

    try {
      const payload = {
        to: messageForm.to.trim(),
      };

      if (messageForm.type === 'text') {
        payload.message = messageForm.body.trim();
      } else if (messageForm.type === 'template') {
        payload.templateName = messageForm.templateName;
        if (messageForm.parameters.trim()) {
          payload.parameters = messageForm.parameters.split(',').map((entry) => entry.trim()).filter(Boolean);
        }
      } else if (messageForm.type === 'media') {
        payload.mediaUrl = messageForm.mediaUrl.trim();
        payload.mediaType = messageForm.mediaType;
        if (messageForm.body.trim()) {
          payload.message = messageForm.body.trim();
        }
      }

      await axiosRequest({
        method: 'POST',
        url: '/central-messaging/v1/admin/send',
        data: payload,
      });

      setSuccessMessage('Message sent successfully');
      closeSendModal();
      setMessageForm({
        to: '',
        type: 'text',
        body: '',
        templateName: '',
        parameters: '',
        mediaUrl: '',
        mediaType: 'image',
      });
      fetchMessages(messagesPage);
    } catch (error) {
      console.error('Send message failed', error);
      setGlobalError(error.response?.data?.message || error.message || 'Failed to send message');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMessages = useMemo(() => messages || [], [messages]);

  const configStatus = config
    ? 'Configured'
    : 'Not Configured';

  const handleOpenConfig = () => {
    setConfigForm({
      phoneNumberId: config?.phoneNumberId || '',
      accessToken: '',
      businessAccountId: config?.businessAccountId || '',
    });
    openConfigDrawer();
  };

  const analyticsOverview = analytics?.overview || {};

  return (
    <Box>
      <HStack justify="space-between" mb={6} align="flex-start">
        <Box>
          <Heading size="lg">Central Messaging</Heading>
          <Text color="gray.500" mt={1}>
            Configure WhatsApp, review analytics, and send messages from a single workspace.
          </Text>
        </Box>
        <HStack spacing={3}>
          <Button
            variant="outline"
            leftIcon={<FiRefreshCw />}
            onClick={refreshActiveTab}
          >
            Refresh
          </Button>
          <Button
            leftIcon={<FiSend />}
            colorScheme="brand"
            onClick={() => {
              setSuccessMessage('');
              setGlobalError('');
              openSendModal();
            }}
          >
            Compose
          </Button>
        </HStack>
      </HStack>

      {(globalError || successMessage) && (
        <Stack spacing={3} mb={6}>
          {globalError && (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <AlertTitle mr={2}>Something went wrong</AlertTitle>
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert status="success" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
        </Stack>
      )}

      <Tabs
        variant="enclosed"
        colorScheme="brand"
        onChange={(index) => {
          const tabMap = ['overview', 'messages', 'templates'];
          setActiveTab(tabMap[index]);
        }}
      >
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Messages</Tab>
          <Tab>Templates</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Stack spacing={6}>
              <Card border="1px" borderColor="gray.100" boxShadow="sm">
                <CardHeader pb={3}>
                  <HStack justify="space-between">
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="md" fontWeight="600">
                        WhatsApp Configuration
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Manage your central WhatsApp credentials.
                      </Text>
                    </VStack>
                    <HStack spacing={2}>
                      {config && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<FiRefreshCw />}
                          isLoading={actionLoading}
                          onClick={handleTestConfig}
                        >
                          Test
                        </Button>
                      )}
                      <Button
                        size="sm"
                        leftIcon={<FiSettings />}
                        onClick={handleOpenConfig}
                      >
                        {config ? 'Update' : 'Configure'}
                      </Button>
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Stack spacing={2}>
                    <HStack>
                      <Text fontSize="sm" color="gray.500" minW="180px">
                        Status
                      </Text>
                      <Badge colorScheme={config ? 'green' : 'red'}>
                        {configStatus}
                      </Badge>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm" color="gray.500" minW="180px">
                        Phone Number ID
                      </Text>
                      <Text fontWeight="medium">
                        {config?.phoneNumberId || 'Not set'}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm" color="gray.500" minW="180px">
                        Business Account ID
                      </Text>
                      <Text fontWeight="medium">
                        {config?.businessAccountId || 'Not set'}
                      </Text>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>

              <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
                <StatCard
                  label="Total Messages"
                  value={analyticsOverview.totalMessages}
                  helper={`${analyticsOverview.sentMessages || 0} sent / ${analyticsOverview.deliveredMessages || 0} delivered`}
                  icon={<FiMessageSquare />}
                  accent="brand"
                />
                <StatCard
                  label="Delivery Rate"
                  value={analyticsOverview.deliveryRate ? `${analyticsOverview.deliveryRate}%` : '--'}
                  helper={`${analyticsOverview.readRate || 0}% read rate`}
                  icon={<FiBarChart2 />}
                  accent="green"
                />
                <StatCard
                  label="Failed Messages"
                  value={analyticsOverview.failedMessages}
                  helper={
                    analyticsOverview.totalMessages
                      ? `${(
                          (analyticsOverview.failedMessages / analyticsOverview.totalMessages) *
                          100
                        ).toFixed(1)}% of total`
                      : ''
                  }
                  icon={<FiXCircle />}
                  accent="red"
                />
                <StatCard
                  label="Credits Used"
                  value={analytics?.totalCreditsUsed}
                  helper="Total WhatsApp credits consumed"
                  icon={<FiCheckCircle />}
                  accent="purple"
                />
              </SimpleGrid>
            </Stack>
          </TabPanel>

          <TabPanel px={0}>
            <Stack spacing={6}>
              <Card border="1px" borderColor="gray.100" boxShadow="sm">
                <CardBody>
                  <Stack spacing={4}>
                    <HStack spacing={4} align="flex-end">
                      <FormControl maxW="200px">
                        <FormLabel fontSize="sm">Status</FormLabel>
                        <Select
                          value={messageFilters.status}
                          onChange={(e) =>
                            setMessageFilters((prev) => ({ ...prev, status: e.target.value }))
                          }
                        >
                          <option value="all">All</option>
                          <option value="sent">Sent</option>
                          <option value="delivered">Delivered</option>
                          <option value="read">Read</option>
                          <option value="failed">Failed</option>
                          <option value="pending">Pending</option>
                        </Select>
                      </FormControl>
                      <FormControl maxW="200px">
                        <FormLabel fontSize="sm">Message Type</FormLabel>
                        <Select
                          value={messageFilters.messageType}
                          onChange={(e) =>
                            setMessageFilters((prev) => ({ ...prev, messageType: e.target.value }))
                          }
                        >
                          <option value="all">All</option>
                          <option value="text">Text</option>
                          <option value="template">Template</option>
                          <option value="media">Media</option>
                        </Select>
                      </FormControl>
                      <FormControl maxW="200px">
                        <FormLabel fontSize="sm">Sender</FormLabel>
                        <Select
                          value={messageFilters.senderType}
                          onChange={(e) =>
                            setMessageFilters((prev) => ({ ...prev, senderType: e.target.value }))
                          }
                        >
                          <option value="all">All</option>
                          <option value="admin">Admin</option>
                          <option value="coach">Coach</option>
                          <option value="system">System</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Search</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiSearch color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="Name, number, content..."
                            value={messageFilters.search}
                            onChange={(e) =>
                              setMessageFilters((prev) => ({ ...prev, search: e.target.value }))
                            }
                          />
                        </InputGroup>
                      </FormControl>
                    </HStack>
                    <HStack spacing={4} align="flex-end">
                      <FormControl maxW="200px">
                        <FormLabel fontSize="sm">Start Date</FormLabel>
                        <Input
                          type="date"
                          value={messageFilters.startDate}
                          onChange={(e) =>
                            setMessageFilters((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                        />
                      </FormControl>
                      <FormControl maxW="200px">
                        <FormLabel fontSize="sm">End Date</FormLabel>
                        <Input
                          type="date"
                          value={messageFilters.endDate}
                          onChange={(e) =>
                            setMessageFilters((prev) => ({ ...prev, endDate: e.target.value }))
                          }
                        />
                      </FormControl>
                      <Button
                        leftIcon={<FiFilter />}
                        onClick={() => fetchMessages(1)}
                        isLoading={loadingMessages}
                      >
                        Apply
                      </Button>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>

              <Card border="1px" borderColor="gray.100" boxShadow="sm">
                <CardHeader pb={3}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="md" fontWeight="600">
                        Message History
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Latest WhatsApp activity across your workspace.
                      </Text>
                    </Box>
                    <HStack spacing={2}>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<FiRefreshCw />}
                        onClick={() => fetchMessages(messagesPage)}
                      >
                        Refresh
                      </Button>
                      <IconButton
                        aria-label="export"
                        variant="ghost"
                        icon={<FiDownload />}
                      />
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  {loadingMessages ? (
                    <Box py={20} textAlign="center">
                      <Spinner size="lg" color="brand.500" />
                    </Box>
                  ) : (
                    <Box overflowX="auto">
                      <Table size="md" variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Type</Th>
                            <Th>Snippet</Th>
                            <Th>Recipient</Th>
                            <Th>Status</Th>
                            <Th>Sent At</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredMessages.length === 0 ? (
                            <Tr>
                              <Td colSpan={6} textAlign="center" py={10} color="gray.500">
                                No messages match the selected filters.
                              </Td>
                            </Tr>
                          ) : (
                            filteredMessages.map((msg) => (
                              <Tr key={msg._id || msg.id}>
                                <Td textTransform="capitalize">{msg.messageType || 'text'}</Td>
                                <Td maxW="320px">
                                  <Text noOfLines={2}>
                                    {msg.content?.text ||
                                      msg.content?.templateName ||
                                      msg.content?.mediaUrl ||
                                      '—'}
                                  </Text>
                                </Td>
                                <Td>
                                  <VStack align="flex-start" spacing={0}>
                                    <Text fontWeight="600">{msg.recipientPhone || '—'}</Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {msg.recipientName || 'Unknown'}
                                    </Text>
                                  </VStack>
                                </Td>
                                <Td>
                                  <Badge colorScheme={statusColorMap[msg.status] || 'gray'}>
                                    {msg.status || 'queued'}
                                  </Badge>
                                </Td>
                                <Td>
                                  {msg.sentAt
                                    ? new Date(msg.sentAt).toLocaleString()
                                    : '—'}
                                </Td>
                                <Td>
                                  <IconButton
                                    aria-label="view"
                                    icon={<FiEye />}
                                    size="sm"
                                    variant="ghost"
                                  />
                                </Td>
                              </Tr>
                            ))
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  )}

                  {messagesTotal > PAGE_SIZE && (
                    <HStack justify="space-between" mt={4}>
                      <Text fontSize="sm" color="gray.500">
                        Showing {(messagesPage - 1) * PAGE_SIZE + 1}-
                        {Math.min(messagesPage * PAGE_SIZE, messagesTotal)} of {messagesTotal}
                      </Text>
                      <HStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchMessages(messagesPage - 1)}
                          disabled={messagesPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchMessages(messagesPage + 1)}
                          disabled={messagesPage * PAGE_SIZE >= messagesTotal}
                        >
                          Next
                        </Button>
                      </HStack>
                    </HStack>
                  )}
                </CardBody>
              </Card>
            </Stack>
          </TabPanel>

          <TabPanel px={0}>
            <Card border="1px" borderColor="gray.100" boxShadow="sm">
              <CardHeader pb={3}>
                <HStack justify="space-between">
                  <Box>
                    <Text fontSize="md" fontWeight="600">
                      Approved Templates
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Use approved WhatsApp templates for high-volume sends.
                    </Text>
                  </Box>
                  <Button size="sm" leftIcon={<FiRefreshCw />} onClick={fetchTemplates}>
                    Refresh
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                {loadingTemplates ? (
                  <Box py={16} textAlign="center">
                    <Spinner size="lg" color="brand.500" />
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Category</Th>
                          <Th>Language</Th>
                          <Th>Status</Th>
                          <Th>Updated</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {templates.length === 0 ? (
                          <Tr>
                            <Td colSpan={5} textAlign="center" py={10} color="gray.500">
                              No templates available yet.
                            </Td>
                          </Tr>
                        ) : (
                          templates.map((tpl) => (
                            <Tr key={tpl.id || tpl.name}>
                              <Td fontWeight="600">{tpl.name}</Td>
                              <Td>{tpl.category || '—'}</Td>
                              <Td textTransform="uppercase">{tpl.language || 'en'}</Td>
                              <Td>
                                <Badge colorScheme={statusColorMap[tpl.status] || 'gray'}>
                                  {tpl.status}
                                </Badge>
                              </Td>
                              <Td>
                                {tpl.updatedAt
                                  ? new Date(tpl.updatedAt).toLocaleDateString()
                                  : '—'}
                              </Td>
                            </Tr>
                          ))
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Drawer isOpen={isConfigDrawerOpen} placement="right" size="md" onClose={closeConfigDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            {config ? 'Update WhatsApp Configuration' : 'Configure WhatsApp'}
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Phone Number ID</FormLabel>
                <Input
                  value={configForm.phoneNumberId}
                  onChange={(e) => setConfigForm((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
                  placeholder="Enter WhatsApp Business Phone Number ID"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Access Token</FormLabel>
                <Input
                  type="password"
                  value={configForm.accessToken}
                  onChange={(e) => setConfigForm((prev) => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="Enter long-lived access token"
                />
                <FormHelperText>We never display stored tokens for security.</FormHelperText>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Business Account ID</FormLabel>
                <Input
                  value={configForm.businessAccountId}
                  onChange={(e) =>
                    setConfigForm((prev) => ({ ...prev, businessAccountId: e.target.value }))
                  }
                  placeholder="Enter WhatsApp Business Account ID"
                />
              </FormControl>
            </Stack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="ghost" mr={3} onClick={closeConfigDrawer}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleConfigSubmit}
              isLoading={actionLoading}
              isDisabled={
                !configForm.phoneNumberId || !configForm.accessToken || !configForm.businessAccountId
              }
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isSendModalOpen} onClose={closeSendModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send WhatsApp Message</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Recipient (E.164 format)</FormLabel>
                <Input
                  placeholder="+14155552671"
                  value={messageForm.to}
                  onChange={(e) => setMessageForm((prev) => ({ ...prev, to: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Message Type</FormLabel>
                <Select
                  value={messageForm.type}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMessageForm((prev) => ({
                      ...prev,
                      type: value,
                      templateName: value === 'template' ? prev.templateName : '',
                      mediaUrl: value === 'media' ? prev.mediaUrl : '',
                      body: value === 'text' ? prev.body : '',
                    }));
                  }}
                >
                  <option value="text">Text</option>
                  <option value="template">Template</option>
                  <option value="media">Media</option>
                </Select>
              </FormControl>

              {messageForm.type === 'text' && (
                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    placeholder="Write your message..."
                    rows={4}
                    value={messageForm.body}
                    onChange={(e) => setMessageForm((prev) => ({ ...prev, body: e.target.value }))}
                  />
                </FormControl>
              )}

              {messageForm.type === 'template' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Template</FormLabel>
                    <Select
                      placeholder="Select template"
                      value={messageForm.templateName}
                      onChange={(e) =>
                        setMessageForm((prev) => ({ ...prev, templateName: e.target.value }))
                      }
                    >
                      {templates.map((tpl) => (
                        <option key={tpl.id || tpl.name} value={tpl.name}>
                          {tpl.name} ({tpl.status})
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Parameters (comma separated)</FormLabel>
                    <Input
                      placeholder="John, 10am, Tuesday"
                      value={messageForm.parameters}
                      onChange={(e) =>
                        setMessageForm((prev) => ({ ...prev, parameters: e.target.value }))
                      }
                    />
                  </FormControl>
                </>
              )}

              {messageForm.type === 'media' && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Media URL</FormLabel>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={messageForm.mediaUrl}
                      onChange={(e) =>
                        setMessageForm((prev) => ({ ...prev, mediaUrl: e.target.value }))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Media Type</FormLabel>
                    <Select
                      value={messageForm.mediaType}
                      onChange={(e) =>
                        setMessageForm((prev) => ({ ...prev, mediaType: e.target.value }))
                      }
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="document">Document</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Caption (optional)</FormLabel>
                    <Textarea
                      placeholder="Add a caption..."
                      value={messageForm.body}
                      onChange={(e) =>
                        setMessageForm((prev) => ({ ...prev, body: e.target.value }))
                      }
                    />
                  </FormControl>
                </>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeSendModal}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSendMessage}
              isLoading={actionLoading}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MessagingDashboard;

