import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  IconButton,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
  useToast,
  Code,
  SimpleGrid,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputLeftElement,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
  Progress,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverArrow,
} from '@chakra-ui/react';
import {
  FiPlay,
  FiPause,
  FiSave,
  FiX,
  FiSettings,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiSearch,
  FiZap,
  FiMail,
  FiMessageSquare,
  FiCalendar,
  FiUser,
  FiClock,
  FiGitBranch,
  FiRepeat,
  FiFilter,
  FiDollarSign,
  FiCheckCircle,
  FiFileText,
  FiLink,
  FiShare2,
  FiCreditCard,
  FiShoppingCart,
  FiBarChart2,
  FiTag,
  FiTrendingUp,
  FiBell,
  FiList,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { getCoachId, getToken } from '../../utils/authUtils';
import { API_BASE_URL } from '../../config/apiConfig';
import automationRulesService from './automationRulesService';

// Custom Node Types
const TriggerNode = ({ data, selected }) => {
  return (
    <Card
      bg="green.50"
      border={`2px solid ${selected ? '#38A169' : '#9AE6B4'}`}
      borderRadius="lg"
      minW="200px"
      shadow={selected ? 'lg' : 'md'}
    >
      <CardBody p={3}>
        <VStack spacing={2} align="center">
          <Box p={2} bg="green.100" borderRadius="full">
            <FiZap size={16} color="#38A169" />
          </Box>
          <Text fontSize="sm" fontWeight="600" color="green.800" textAlign="center">
            {data.label}
          </Text>
          {data.description && (
            <Text fontSize="xs" color="green.600" textAlign="center">
              {data.description}
            </Text>
          )}
        </VStack>
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: '#38A169',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
      </CardBody>
    </Card>
  );
};

const ActionNode = ({ data, selected }) => {
  return (
    <Card
      bg="blue.50"
      border={`2px solid ${selected ? '#3182CE' : '#90CDF4'}`}
      borderRadius="lg"
      minW="200px"
      shadow={selected ? 'lg' : 'md'}
    >
      <CardBody p={3}>
        <VStack spacing={2} align="center">
          <Box p={2} bg="blue.100" borderRadius="full">
            {data.icon || <FiSettings size={16} color="#3182CE" />}
          </Box>
          <Text fontSize="sm" fontWeight="600" color="blue.800" textAlign="center">
            {data.label}
          </Text>
          {data.description && (
            <Text fontSize="xs" color="blue.600" textAlign="center">
              {data.description}
            </Text>
          )}
        </VStack>
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: '#3182CE',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: '#3182CE',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
      </CardBody>
    </Card>
  );
};

const DelayNode = ({ data, selected }) => {
  return (
    <Card
      bg="orange.50"
      border={`2px solid ${selected ? '#DD6B20' : '#FBD38D'}`}
      borderRadius="lg"
      minW="180px"
      shadow={selected ? 'lg' : 'md'}
    >
      <CardBody p={3}>
        <VStack spacing={2} align="center">
          <Box p={2} bg="orange.100" borderRadius="full">
            <FiClock size={16} color="#DD6B20" />
          </Box>
          <Text fontSize="sm" fontWeight="600" color="orange.800" textAlign="center">
            Delay
          </Text>
          <Text fontSize="xs" color="orange.600" textAlign="center">
            {data.delayMinutes || 0} minutes
          </Text>
        </VStack>
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: '#DD6B20',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: '#DD6B20',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
      </CardBody>
    </Card>
  );
};

const ConditionNode = ({ data, selected }) => {
  return (
    <Card
      bg="purple.50"
      border={`2px solid ${selected ? '#805AD5' : '#D6BCFA'}`}
      borderRadius="lg"
      minW="200px"
      shadow={selected ? 'lg' : 'md'}
    >
      <CardBody p={3}>
        <VStack spacing={2} align="center">
          <Box p={2} bg="purple.100" borderRadius="full">
            <FiFilter size={16} color="#805AD5" />
          </Box>
          <Text fontSize="sm" fontWeight="600" color="purple.800" textAlign="center">
            Condition
          </Text>
          <Text fontSize="xs" color="purple.600" textAlign="center">
            {data.conditionType || 'Custom'}
          </Text>
        </VStack>
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: '#805AD5',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: '#805AD5',
            width: '8px',
            height: '8px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="false"
          style={{
            background: '#E53E3E',
            width: '6px',
            height: '6px',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          style={{
            background: '#38A169',
            width: '6px',
            height: '6px',
            border: '2px solid white'
          }}
        />
      </CardBody>
    </Card>
  );
};

// Node types mapping
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  delay: DelayNode,
  condition: ConditionNode,
};

// Get icon for trigger event
const getTriggerIcon = (eventValue) => {
  const eventStr = typeof eventValue === 'string' ? eventValue : eventValue.value || eventValue.label || '';
  const eventLower = eventStr.toLowerCase();

  if (eventLower.includes('lead')) {
    if (eventLower.includes('created')) return FiUser;
    if (eventLower.includes('status')) return FiEdit;
    if (eventLower.includes('score')) return FiTrendingUp;
    return FiUser;
  }
  if (eventLower.includes('appointment')) return FiCalendar;
  if (eventLower.includes('payment')) return FiDollarSign;
  if (eventLower.includes('task')) return FiCheckCircle;
  if (eventLower.includes('form')) return FiFileText;
  if (eventLower.includes('funnel')) return FiBarChart2;
  if (eventLower.includes('content')) return FiMessageSquare;
  return FiZap;
};

// Get icon for action
const getActionIcon = (actionValue) => {
  const actionStr = typeof actionValue === 'string' ? actionValue : actionValue.value || actionValue.label || '';
  const actionLower = actionStr.toLowerCase();

  if (actionLower.includes('email') || actionLower.includes('send_email')) return FiMail;
  if (actionLower.includes('whatsapp') || actionLower.includes('sms') || actionLower.includes('message')) return FiMessageSquare;
  if (actionLower.includes('task') || actionLower.includes('create_task')) return FiList;
  if (actionLower.includes('lead')) {
    if (actionLower.includes('status')) return FiEdit;
    if (actionLower.includes('score')) return FiTrendingUp;
    if (actionLower.includes('tag')) return FiTag;
    if (actionLower.includes('note')) return FiFileText;
    return FiUser;
  }
  if (actionLower.includes('calendar') || actionLower.includes('event')) return FiCalendar;
  if (actionLower.includes('notification')) return FiBell;
  if (actionLower.includes('webhook')) return FiLink;
  if (actionLower.includes('automation') || actionLower.includes('trigger')) return FiZap;
  if (actionLower.includes('invoice') || actionLower.includes('payment')) return FiCreditCard;
  if (actionLower.includes('funnel')) return FiBarChart2;
  if (actionLower.includes('deal')) return FiShoppingCart;
  return FiPlay;
};

// Node Configuration Form Component
const NodeConfigForm = ({ node, onSave, onCancel }) => {
  const [config, setConfig] = useState(node.data || {});
  const toast = useToast();

  const handleSave = () => {
    onSave(config);
  };

  const renderConfigFields = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Trigger Event
              </FormLabel>
              <Select
                value={config.nodeType || ''}
                onChange={(e) => setConfig({ ...config, nodeType: e.target.value })}
                placeholder="Select when to trigger this automation"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              >
                {/* Lead & Customer Lifecycle */}
                <optgroup label="Lead & Customer Lifecycle">
                  <option value="lead_created">Lead Created</option>
                  <option value="lead_status_changed">Lead Status Changed</option>
                  <option value="lead_temperature_changed">Lead Temperature Changed</option>
                  <option value="lead_converted_to_client">Lead Converted to Client</option>
                  <option value="lead_updated">Lead Updated</option>
                  <option value="lead_tag_added">Lead Tag Added</option>
                  <option value="lead_tag_removed">Lead Tag Removed</option>
                </optgroup>

                {/* Funnel & Conversion */}
                <optgroup label="Funnel & Conversion">
                  <option value="form_submitted">Form Submitted</option>
                  <option value="funnel_stage_entered">Funnel Stage Entered</option>
                  <option value="funnel_stage_exited">Funnel Stage Exited</option>
                  <option value="funnel_completed">Funnel Completed</option>
                  <option value="funnel_page_viewed">Funnel Page Viewed</option>
                </optgroup>

                {/* Appointment & Calendar */}
                <optgroup label="Appointment & Calendar">
                  <option value="appointment_booked">Appointment Booked</option>
                  <option value="appointment_rescheduled">Appointment Rescheduled</option>
                  <option value="appointment_cancelled">Appointment Cancelled</option>
                  <option value="appointment_reminder_time">Appointment Reminder Time</option>
                  <option value="appointment_finished">Appointment Finished</option>
                  <option value="appointment_no_show">Appointment No Show</option>
                </optgroup>

                {/* Communication */}
                <optgroup label="Communication">
                  <option value="content_consumed">Content Consumed</option>
                  <option value="email_opened">Email Opened</option>
                  <option value="email_clicked">Email Clicked</option>
                  <option value="email_bounced">Email Bounced</option>
                  <option value="whatsapp_message_received">WhatsApp Message Received</option>
                  <option value="whatsapp_message_sent">WhatsApp Message Sent</option>
                  <option value="sms_received">SMS Received</option>
                  <option value="sms_sent">SMS Sent</option>
                </optgroup>

                {/* Task & System */}
                <optgroup label="Task & System">
                  <option value="task_created">Task Created</option>
                  <option value="task_completed">Task Completed</option>
                  <option value="task_overdue">Task Overdue</option>
                  <option value="task_assigned">Task Assigned</option>
                </optgroup>

                {/* Payment & Subscription */}
                <optgroup label="Payment & Subscription">
                  <option value="payment_successful">Payment Successful</option>
                  <option value="payment_failed">Payment Failed</option>
                  <option value="payment_link_clicked">Payment Link Clicked</option>
                  <option value="payment_abandoned">Payment Abandoned</option>
                  <option value="invoice_paid">Invoice Paid</option>
                  <option value="invoice_sent">Invoice Sent</option>
                  <option value="invoice_overdue">Invoice Overdue</option>
                  <option value="subscription_created">Subscription Created</option>
                  <option value="subscription_renewed">Subscription Renewed</option>
                  <option value="subscription_cancelled">Subscription Cancelled</option>
                  <option value="subscription_expired">Subscription Expired</option>
                  <option value="card_expired">Card Expired</option>
                  <option value="refund_issued">Refund Issued</option>
                </optgroup>
              </Select>
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                Choose what event will trigger this automation
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Custom Label (Optional)
              </FormLabel>
              <Input
                value={config.label || ''}
                onChange={(e) => setConfig({ ...config, label: e.target.value })}
                placeholder="e.g., New Lead Registration"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              />
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                Leave empty to use default label, or enter a custom name for this trigger
              </FormHelperText>
            </FormControl>
          </VStack>
        );

      case 'action':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Action Type
              </FormLabel>
              <Select
                value={config.nodeType || ''}
                onChange={(e) => setConfig({ ...config, nodeType: e.target.value })}
                placeholder="Select what action to perform"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              >
                {/* Lead Data & Funnel Actions */}
                <optgroup label="Lead Data & Funnel Actions">
                  <option value="update_lead_score">Update Lead Score</option>
                  <option value="add_lead_tag">Add Lead Tag</option>
                  <option value="remove_lead_tag">Remove Lead Tag</option>
                  <option value="add_to_funnel">Add to Funnel</option>
                  <option value="move_to_funnel_stage">Move to Funnel Stage</option>
                  <option value="remove_from_funnel">Remove from Funnel</option>
                  <option value="update_lead_field">Update Lead Field</option>
                  <option value="update_lead_status">Update Lead Status</option>
                  <option value="assign_lead_to_staff">Assign Lead to Staff</option>
                  <option value="create_deal">Create Deal</option>
                </optgroup>

                {/* Communication Actions */}
                <optgroup label="Communication Actions">
                  <option value="send_whatsapp_message">Send WhatsApp Message</option>
                  <option value="send_email_message">Send Email Message</option>
                  <option value="send_sms_message">Send SMS Message</option>
                  <option value="send_internal_notification">Send Internal Notification</option>
                  <option value="send_push_notification">Send Push Notification</option>
                  <option value="schedule_drip_sequence">Schedule Drip Sequence</option>
                </optgroup>

                {/* Task & Workflow Actions */}
                <optgroup label="Task & Workflow Actions">
                  <option value="create_task">Create Task</option>
                  <option value="create_multiple_tasks">Create Multiple Tasks</option>
                  <option value="create_calendar_event">Create Calendar Event</option>
                  <option value="add_note_to_lead">Add Note to Lead</option>
                  <option value="add_followup_date">Add Follow-up Date</option>
                </optgroup>

                {/* Zoom Integration Actions */}
                <optgroup label="Zoom Integration Actions">
                  <option value="create_zoom_meeting">Create Zoom Meeting</option>
                </optgroup>

                {/* Payment Actions */}
                <optgroup label="Payment Actions">
                  <option value="create_invoice">Create Invoice</option>
                  <option value="issue_refund">Issue Refund</option>
                </optgroup>

                {/* System Actions */}
                <optgroup label="System Actions">
                  <option value="call_webhook">Call Webhook</option>
                  <option value="trigger_another_automation">Trigger Another Automation</option>
                  <option value="wait_delay">Wait Delay</option>
                </optgroup>
              </Select>
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                Choose what action to perform when the trigger fires
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Custom Label (Optional)
              </FormLabel>
              <Input
                value={config.label || ''}
                onChange={(e) => setConfig({ ...config, label: e.target.value })}
                placeholder="e.g., Send Welcome Message"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              />
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                Leave empty to use default label, or enter a custom name for this action
              </FormHelperText>
            </FormControl>
          </VStack>
        );

      case 'delay':
        return (
          <VStack spacing={5} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Delay Duration
              </FormLabel>
              <SimpleGrid columns={3} spacing={3}>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.600">Hours</FormLabel>
                  <NumberInput
                    value={config.delayHours || 0}
                    onChange={(value) => setConfig({ ...config, delayHours: parseInt(value) || 0 })}
                    min={0}
                    max={23}
                  >
                    <NumberInputField
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                      borderRadius="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" color="gray.600">Minutes</FormLabel>
                  <NumberInput
                    value={config.delayMinutes || 0}
                    onChange={(value) => setConfig({ ...config, delayMinutes: parseInt(value) || 0 })}
                    min={0}
                    max={59}
                  >
                    <NumberInputField
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                      borderRadius="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" color="gray.600">Seconds</FormLabel>
                  <NumberInput
                    value={config.delaySeconds || 0}
                    onChange={(value) => setConfig({ ...config, delaySeconds: parseInt(value) || 0 })}
                    min={0}
                    max={59}
                  >
                    <NumberInputField
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                      borderRadius="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              <FormHelperText fontSize="xs" color="gray.500" mt={2}>
                The workflow will wait for the specified duration before proceeding to the next node
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Custom Label (Optional)
              </FormLabel>
              <Input
                value={config.label || ''}
                onChange={(e) => setConfig({ ...config, label: e.target.value })}
                placeholder="e.g., Wait 5 minutes"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              />
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                Leave empty to auto-generate label based on delay duration
              </FormHelperText>
            </FormControl>
          </VStack>
        );

      case 'condition':
        return (
          <VStack spacing={5} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Condition Type
              </FormLabel>
              <Select
                value={config.conditionType || 'Custom'}
                onChange={(e) => setConfig({ ...config, conditionType: e.target.value })}
                placeholder="Select condition type"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              >
                <option value="Custom">Custom Condition</option>
                <option value="Lead Score">Lead Score Check</option>
                <option value="Tag Check">Tag Check</option>
                <option value="Time Check">Time Check</option>
                <option value="Field Check">Field Value Check</option>
                <option value="Funnel Stage">Funnel Stage Check</option>
              </Select>
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                Choose what type of condition to evaluate
              </FormHelperText>
            </FormControl>

            {/* Conditional fields based on condition type */}
            {config.conditionType === 'Lead Score' && (
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                    Score Comparison
                  </FormLabel>
                  <Select
                    value={config.scoreOperator || 'greater_than'}
                    onChange={(e) => setConfig({ ...config, scoreOperator: e.target.value })}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                    borderRadius="md"
                  >
                    <option value="greater_than">Greater than</option>
                    <option value="less_than">Less than</option>
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not equals</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                    Score Value
                  </FormLabel>
                  <NumberInput
                    value={config.scoreValue || 50}
                    onChange={(value) => setConfig({ ...config, scoreValue: parseInt(value) || 50 })}
                    min={0}
                    max={100}
                  >
                    <NumberInputField
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                      borderRadius="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            )}

            {config.conditionType === 'Tag Check' && (
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Tag Name
                </FormLabel>
                <Input
                  value={config.tagName || ''}
                  onChange={(e) => setConfig({ ...config, tagName: e.target.value })}
                  placeholder="Enter tag name to check for"
                  bg="white"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'gray.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                  borderRadius="md"
                />
                <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                  Check if the lead has this tag (TRUE path) or doesn't have it (FALSE path)
                </FormHelperText>
              </FormControl>
            )}

            {config.conditionType === 'Field Check' && (
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                    Field Name
                  </FormLabel>
                  <Select
                    value={config.fieldName || ''}
                    onChange={(e) => setConfig({ ...config, fieldName: e.target.value })}
                    placeholder="Select field to check"
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                    borderRadius="md"
                  >
                    <option value="status">Status</option>
                    <option value="temperature">Temperature</option>
                    <option value="source">Source</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                    Comparison Operator
                  </FormLabel>
                  <Select
                    value={config.fieldOperator || 'equals'}
                    onChange={(e) => setConfig({ ...config, fieldOperator: e.target.value })}
                    bg="white"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                    borderRadius="md"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not equals</option>
                    <option value="contains">Contains</option>
                    <option value="not_contains">Does not contain</option>
                    <option value="is_empty">Is empty</option>
                    <option value="is_not_empty">Is not empty</option>
                  </Select>
                </FormControl>
                {(config.fieldOperator !== 'is_empty' && config.fieldOperator !== 'is_not_empty') && (
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                      Field Value
                    </FormLabel>
                    <Input
                      value={config.fieldValue || ''}
                      onChange={(e) => setConfig({ ...config, fieldValue: e.target.value })}
                      placeholder="Enter value to compare against"
                      bg="white"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'gray.300' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                      borderRadius="md"
                    />
                  </FormControl>
                )}
              </VStack>
            )}

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Custom Label (Optional)
              </FormLabel>
              <Input
                value={config.label || ''}
                onChange={(e) => setConfig({ ...config, label: e.target.value })}
                placeholder="e.g., Check Lead Score > 50"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              />
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                Leave empty to auto-generate label based on condition settings
              </FormHelperText>
            </FormControl>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontSize="xs" fontWeight="500">
                  Conditional Logic
                </Text>
                <Text fontSize="xs" color="gray.600">
                  TRUE path: Condition met, workflow continues to connected node
                  <br />
                  FALSE path: Condition not met, workflow follows alternative path
                </Text>
              </Box>
            </Alert>
          </VStack>
        );

      case 'sequence':
        return (
          <VStack spacing={5} align="stretch">
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Message sequences are configured in the node itself by double-clicking on the sequence node in the workflow canvas.
              </Text>
            </Alert>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Sequence Name
              </FormLabel>
              <Input
                value={config.label || ''}
                onChange={(e) => setConfig({ ...config, label: e.target.value })}
                placeholder="e.g., Welcome Sequence"
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                borderRadius="md"
              />
              <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                A descriptive name for this message sequence
              </FormHelperText>
            </FormControl>

            <Box
              p={4}
              bg="gray.50"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
            >
              <VStack spacing={3} align="start">
                <HStack spacing={2}>
                  <FiMessageSquare size={16} color="#B83280" />
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    Sequence Configuration
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.600">
                  To configure the sequence steps, messages, and timing:
                </Text>
                <VStack spacing={1} align="start" pl={4}>
                  <Text fontSize="xs" color="gray.600">• Double-click this sequence node in the workflow</Text>
                  <Text fontSize="xs" color="gray.600">• Add message steps with delays</Text>
                  <Text fontSize="xs" color="gray.600">• Choose channels (WhatsApp, Email, SMS)</Text>
                  <Text fontSize="xs" color="gray.600">• Configure message templates</Text>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        );

      default:
        return (
          <Text fontSize="sm" color="gray.600">
            No configuration options available for this node type.
          </Text>
        );
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {renderConfigFields()}

      <HStack spacing={3} justify="end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="blue" size="sm" onClick={handleSave}>
          Save Configuration
        </Button>
      </HStack>
    </VStack>
  );
};

// Main Graph Builder Component
const AutomationRulesGraphBuilder = ({ rule, onSave, onClose }) => {
  const navigate = useNavigate();
  const { ruleId } = useParams();
  const toast = useToast();
  const authState = useSelector((state) => state.auth);
  const token = authState?.token || localStorage.getItem('token');
  const coachId = useSelector(getCoachId);

  // Set token on service
  useEffect(() => {
    const tokenToUse = token || localStorage.getItem('token');
    if (tokenToUse) {
      automationRulesService.setToken(tokenToUse);
    }
    if (coachId) {
      automationRulesService.setCoachId(coachId);
    }
  }, [token, coachId]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [ruleName, setRuleName] = useState(rule?.name || '');
  const [isActive, setIsActive] = useState(rule?.isActive !== false);
  const [saving, setSaving] = useState(false);

  // Available components from backend
  const [eventsActions, setEventsActions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const { isOpen: isNodePaletteOpen, onOpen: onNodePaletteOpen, onClose: onNodePaletteClose } = useDisclosure();
  const { isOpen: isNodeConfigOpen, onOpen: onNodeConfigOpen, onClose: onNodeConfigClose } = useDisclosure();
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Load events and actions from backend
  useEffect(() => {
    const fetchEventsActions = async () => {
      try {
        const response = await automationRulesService.getEventsAndActions();

        // Handle both direct service response and axios response structure
        const rawEventsActions = response.data || response || { events: [], actions: [] };

        // Sanitize the data (filter out billing triggers if needed)
        const sanitizedData = {
          ...rawEventsActions,
          events: (rawEventsActions.events || []).filter((event) => {
            const value = typeof event === 'string'
              ? event
              : event?.value || event?.label || event?.name || '';
            if (!value) return true;
            const normalized = value.toLowerCase();
            // Filter out billing-related triggers
            return !(
              normalized.includes('invoice') ||
              normalized.includes('subscription') ||
              normalized.includes('refund') ||
              normalized.includes('card_expired')
            );
          }),
        };

        setEventsActions(sanitizedData);
      } catch (error) {
        console.error('Error fetching events and actions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available events and actions',
          status: 'error',
          duration: 3000,
        });

        // Fallback data if API fails
        setEventsActions({
          events: [
            {
              value: 'lead_created',
              label: 'Lead Created',
              category: 'Lead & Customer Lifecycle',
              description: 'Triggered when a new lead is created'
            },
            {
              value: 'lead_status_changed',
              label: 'Lead Status Changed',
              category: 'Lead & Customer Lifecycle',
              description: 'Triggered when a lead\'s status is updated'
            },
            {
              value: 'appointment_booked',
              label: 'Appointment Booked',
              category: 'Appointment & Calendar',
              description: 'Triggered when an appointment is booked'
            }
          ],
          actions: [
            {
              value: 'send_whatsapp_message',
              label: 'Send WhatsApp Message',
              category: 'Communication Actions',
              description: 'Send a WhatsApp message to a lead'
            },
            {
              value: 'send_email_message',
              label: 'Send Email Message',
              category: 'Communication Actions',
              description: 'Send an email message to a lead'
            },
            {
              value: 'add_lead_tag',
              label: 'Add Lead Tag',
              category: 'Lead Data & Funnel Actions',
              description: 'Add a tag to a lead'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventsActions();
  }, [toast]);

  // Load rule data if ruleId is provided (standalone page mode)
  useEffect(() => {
    const loadRuleData = async () => {
      if (ruleId && !rule) {
        try {
          const response = await automationRulesService.getSequenceById(ruleId);
          const ruleData = response.data;
          setRuleName(ruleData.name || '');
          setIsActive(ruleData.isActive !== false);
          if (ruleData.nodes) {
            setNodes(ruleData.nodes);
            setEdges(ruleData.edges || []);
          }
        } catch (error) {
          console.error('Error loading rule:', error);
          toast({
            title: 'Error',
            description: 'Failed to load automation rule',
            status: 'error',
            duration: 3000,
          });
          navigate('/automation-rules');
        }
      }
    };

    loadRuleData();
  }, [ruleId, rule, navigate, toast]);

  // Initialize nodes and edges if editing existing rule (drawer mode) or create default for new rules
  useEffect(() => {
    if (rule && rule.nodes) {
      setNodes(rule.nodes);
      setEdges(rule.edges || []);
      setRuleName(rule.name || '');
      setIsActive(rule.isActive !== false);
    } else if (!rule && !ruleId) {
      // Create default trigger node for new rules
      const defaultTriggerNode = {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 400, y: 50 },
        data: {
          label: 'Lead Created',
          nodeType: 'lead_created',
          description: 'Triggered when a new lead is created'
        }
      };
      setNodes([defaultTriggerNode]);
    }
  }, [rule, ruleId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow/data'));

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - event.target.getBoundingClientRect().left,
        y: event.clientY - event.target.getBoundingClientRect().top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const addNode = useCallback((nodeType, nodeData) => {
    const position = {
      x: Math.random() * 400 + 200,
      y: Math.random() * 400 + 100,
    };

    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: nodeData.label || nodeData.name || nodeType,
        nodeType: nodeData.value || nodeData.type || nodeType,
        description: nodeData.description || '',
        config: {},
        ...nodeData,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    onNodePaletteClose();
  }, [setNodes, onNodePaletteClose]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    onNodeConfigOpen();
  }, [onNodeConfigOpen]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      onNodeConfigClose();
    }
  }, [setNodes, setEdges, selectedNode, onNodeConfigClose]);

  const updateNodeConfig = useCallback((config) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...config,
              },
            }
          : node
      )
    );
    setSelectedNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        ...config,
      },
    }));

    // Show success message
    toast({
      title: 'Success',
      description: 'Node configuration saved',
      status: 'success',
      duration: 2000,
    });
  }, [selectedNode, setNodes, toast]);

  // Group triggers and actions by category
  const nodeCategories = useMemo(() => {
    if (!eventsActions) return { triggers: {}, actions: {} };

    const triggers = eventsActions.events || [];
    const actions = eventsActions.actions || [];

    // Group triggers by category
    const groupedTriggers = {};
    triggers.forEach(event => {
      const category = event.category || 'Other';
      if (!groupedTriggers[category]) {
        groupedTriggers[category] = [];
      }
      groupedTriggers[category].push(event);
    });

    // Group actions by category
    const groupedActions = {};
    actions.forEach(action => {
      const category = action.category || 'Other';
      if (!groupedActions[category]) {
        groupedActions[category] = [];
      }
      groupedActions[category].push(action);
    });

    return { triggers: groupedTriggers, actions: groupedActions };
  }, [eventsActions]);

  // Filter nodes based on search query
  const filteredTriggers = useMemo(() => {
    if (!searchQuery.trim()) return nodeCategories.triggers;
    const query = searchQuery.toLowerCase();
    const filtered = {};
    Object.keys(nodeCategories.triggers).forEach(category => {
      const categoryItems = nodeCategories.triggers[category].filter(event => {
      const label = typeof event === 'string' ? event : event.label || event.value || '';
        const desc = typeof event === 'string' ? '' : event.description || '';
        return label.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
    });
      if (categoryItems.length > 0) {
        filtered[category] = categoryItems;
      }
    });
    return filtered;
  }, [nodeCategories.triggers, searchQuery]);

  const filteredActions = useMemo(() => {
    if (!searchQuery.trim()) return nodeCategories.actions;
    const query = searchQuery.toLowerCase();
    const filtered = {};
    Object.keys(nodeCategories.actions).forEach(category => {
      const categoryItems = nodeCategories.actions[category].filter(action => {
      const label = typeof action === 'string' ? action : action.label || action.value || '';
        const desc = typeof action === 'string' ? '' : action.description || '';
        return label.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
    });
      if (categoryItems.length > 0) {
        filtered[category] = categoryItems;
      }
    });
    return filtered;
  }, [nodeCategories.actions, searchQuery]);

  const handleSave = async () => {
    if (!ruleName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a name for the automation rule',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate that there's at least one trigger and one action
    // const hasTrigger = nodes.some(node => node.type === 'trigger');
    const hasAction = nodes.some(node => node.type === 'action');

    if (!hasTrigger) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one trigger to your automation rule',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (!hasAction) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one action to your automation rule',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate that all nodes are properly configured
    const unconfiguredNodes = [];
    const validationErrors = [];

    nodes.forEach(node => {
      const nodeData = node.data || {};
      const nodeType = node.type;

      // Check basic configuration
      if (!nodeData.nodeType || nodeData.nodeType === '') {
        unconfiguredNodes.push(`${nodeType} node: missing node type`);
        return;
      }

      // Validate based on node type
      switch (nodeType) {
        case 'trigger':
          if (!nodeData.nodeType || nodeData.nodeType === '') {
            validationErrors.push(`Trigger node: Please select a trigger event`);
          }
          break;

        case 'action':
          if (!nodeData.nodeType || nodeData.nodeType === '') {
            validationErrors.push(`Action node: Please select an action type`);
          }
          break;

        case 'condition':
          if (!nodeData.conditionType || nodeData.conditionType === '') {
            validationErrors.push(`Condition node: Please select a condition type`);
          } else {
            // Validate condition-specific fields
            if (nodeData.conditionType === 'Lead Score') {
              if (!nodeData.scoreValue && nodeData.scoreValue !== 0) {
                validationErrors.push(`Condition node: Please set a score value for Lead Score condition`);
              }
            } else if (nodeData.conditionType === 'Tag Check') {
              if (!nodeData.tagName || nodeData.tagName.trim() === '') {
                validationErrors.push(`Condition node: Please enter a tag name for Tag Check condition`);
              }
            } else if (nodeData.conditionType === 'Field Check') {
              if (!nodeData.fieldName || nodeData.fieldName === '') {
                validationErrors.push(`Condition node: Please select a field name for Field Check condition`);
              }
              if (nodeData.fieldOperator !== 'is_empty' && nodeData.fieldOperator !== 'is_not_empty') {
                if (!nodeData.fieldValue || nodeData.fieldValue.trim() === '') {
                  validationErrors.push(`Condition node: Please enter a field value for Field Check condition`);
                }
              }
            }
          }
          break;

        case 'delay':
          const hasTime = (nodeData.delayHours && nodeData.delayHours > 0) ||
                         (nodeData.delayMinutes && nodeData.delayMinutes > 0) ||
                         (nodeData.delaySeconds && nodeData.delaySeconds > 0);
          if (!hasTime) {
            validationErrors.push(`Delay node: Please set a valid delay duration (hours, minutes, or seconds)`);
          }
          break;

        case 'sequence':
          if (!nodeData.label || nodeData.label.trim() === '') {
            validationErrors.push(`Sequence node: Please enter a sequence name`);
          }
          break;
      }
    });

    // Check if we have at least one trigger
    const hasTrigger = nodes.some(node => node.type === 'trigger');
    if (!hasTrigger) {
      validationErrors.push('Workflow must contain at least one trigger node');
    }

    // Check if we have at least one action
    const hasWorkflowAction = nodes.some(node => node.type === 'action' || node.type === 'sequence');
    if (!hasWorkflowAction) {
      validationErrors.push('Workflow must contain at least one action or sequence node');
    }

    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Error',
        description: (
          <VStack spacing={2} align="start" maxH="200px" overflowY="auto">
            <Text fontSize="sm">Please configure all nodes before saving:</Text>
            {validationErrors.map((error, index) => (
              <Text key={index} fontSize="xs" color="red.600">
                • {error}
              </Text>
            ))}
          </VStack>
        ),
        status: 'error',
        duration: 8000,
      });
      return;
    }

    setSaving(true);

    try {
      // Transform nodes to match backend schema
      const transformedNodes = nodes.map((node) => ({
        id: node.id,
        type: node.type,
        nodeType: node.data?.nodeType || node.data?.type || '',
        label: node.data?.label || node.data?.nodeType || 'Node',
        position: node.position || { x: 0, y: 0 },
        data: node.data || {},
        config: node.data?.config || {}
      }));

      const ruleData = {
        name: ruleName,
        coachId,
        isActive,
        workflowType: 'graph',
        nodes: transformedNodes,
        edges,
        viewport: { x: 0, y: 0, zoom: 1 }
      };

      if (onSave) {
        // Used as drawer/modal - call provided onSave function
        await onSave(ruleData);
      } else {
        // Used as standalone page - call API directly
        if (ruleId) {
          // Update existing rule
          await automationRulesService.updateSequence(ruleId, ruleData);
          toast({
            title: 'Success',
            description: 'Automation rule updated successfully',
            status: 'success',
            duration: 3000,
          });
        } else {
          // Create new rule
          await automationRulesService.createSequence(ruleData);
          toast({
            title: 'Success',
            description: 'Automation rule created successfully',
            status: 'success',
            duration: 3000,
          });
        }
        // Navigate back to automation rules list
        navigate('/automation-rules');
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to save automation rule',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        h="100vh"
        w="100vw"
        position="absolute"
        top={0}
        left={0}
        p={8}
        textAlign="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading automation builder...</Text>
        </VStack>
      </Box>
    );
  }

  // Render main content function
  const renderMainContent = () => {
    return (
    <Box
      minH="100vh"
      h="100vh"
      w="100vw"
      position="absolute"
      top={0}
      left={0}
      display="flex"
      flexDirection="column"
      bg="gray.50"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.200" bg="white">
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="md" color="gray.900">
              {rule ? 'Edit Automation Rule' : 'Create Automation Rule'}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Drag and drop components to build your automation workflow
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button
              leftIcon={<FiPlus />}
              variant="outline"
              size="sm"
              onClick={onNodePaletteOpen}
              colorScheme="blue"
            >
              Add Node
            </Button>
            <Button
              leftIcon={<FiSave />}
              colorScheme="blue"
              onClick={handleSave}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Rule
            </Button>
            <Button
              leftIcon={<FiX />}
              variant="ghost"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  navigate('/automation-rules');
                }
              }}
            >
              Cancel
            </Button>
          </HStack>
        </HStack>

        {/* Rule Settings */}
        <Box mt={4}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Rule Name</FormLabel>
              <Input
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="Enter rule name"
                size="sm"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Status</FormLabel>
              <Select
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                size="sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Main Content */}
      {/* React Flow Canvas */}
      <Box flex={1} h="100%" position="relative">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="top-right"
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </ReactFlowProvider>
        </Box>
      </Box>

    );
  };

  return (
    <>
      {/* Main Content */}
      {renderMainContent()}

      {/* Node Palette Drawer */}
      <Drawer
        isOpen={isNodePaletteOpen}
        placement="right"
        onClose={() => {
          onNodePaletteClose();
          setSearchQuery('');
          setActiveTab(0);
        }}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="bold">Add Node to Workflow</Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="md"
                />
              </InputGroup>
            </VStack>
          </DrawerHeader>
          <DrawerBody>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>Triggers</Tab>
                <Tab>Actions</Tab>
                <Tab>Flow Control</Tab>
              </TabList>

              <TabPanels>
                {/* Triggers Tab */}
                <TabPanel px={0} pt={4}>
                  <VStack spacing={2} align="stretch" maxH="calc(100vh - 300px)" overflowY="auto">
                    {Object.keys(filteredTriggers).length === 0 ? (
                      <Text color="gray.500" textAlign="center" py={8}>
                        No triggers found matching "{searchQuery}"
                      </Text>
                    ) : searchQuery.trim() ? (
                      // When searching, show all results in groups without accordion
                      Object.keys(filteredTriggers).map((category) => {
                        const simpleCategory = category
                          .replace('Lead & Customer Lifecycle', 'Leads')
                          .replace('Funnel & Conversion', 'Funnels')
                          .replace('Appointment & Calendar', 'Appointments')
                          .replace('Task & System', 'Tasks')
                          .replace('Payment & Subscription', 'Payments');

                        return (
                          <Box key={category} mb={4}>
                            <Text fontSize="xs" fontWeight="500" color="gray.500" textTransform="uppercase" mb={2} px={2}>
                              {simpleCategory}
                            </Text>
                            <VStack spacing={2} align="stretch">
                              {(filteredTriggers[category] || []).map((trigger, index) => {
                                const triggerLabel = typeof trigger === 'string' ? trigger : trigger.label || trigger.value;
                                const triggerValue = typeof trigger === 'string' ? trigger : trigger.value || trigger.label;
                                const triggerDesc = typeof trigger === 'string' ? '' : trigger.description || '';
                                const TriggerIcon = getTriggerIcon(triggerValue);
                                return (
                                  <Card
                                    key={`${category}-${index}`}
                                    cursor="pointer"
                                    onClick={() => {
                                      addNode('trigger', trigger);
                                      setSearchQuery('');
                                    }}
                                    _hover={{
                                      borderColor: 'blue.300',
                                      boxShadow: 'md',
                                      transform: 'translateY(-1px)'
                                    }}
                                    transition="all 0.2s"
                                    border="1px"
                                    borderColor="gray.200"
                                    bg="white"
                                    p={3}
                                  >
                                    <HStack spacing={3} align="start">
                                      <Box
                                        p={2}
                                        borderRadius="md"
                                        bg="blue.50"
                                        color="blue.600"
                                        flexShrink={0}
                                      >
                                        <TriggerIcon size={18} />
                                      </Box>
                                      <VStack align="start" spacing={0.5} flex={1}>
                                        <Text fontSize="sm" fontWeight="600" color="gray.700">
                                          {triggerLabel}
                                        </Text>
                                        {triggerDesc && (
                                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                            {triggerDesc}
                                          </Text>
                                        )}
                                      </VStack>
                                    </HStack>
                                  </Card>
                                );
                              })}
                            </VStack>
                          </Box>
                        );
                      })
                    ) : (
                      // When not searching, show accordion
                      <Accordion allowMultiple defaultIndex={[]}>
                        {Object.keys(filteredTriggers).map((category) => {
                          const simpleCategory = category
                            .replace('Lead & Customer Lifecycle', 'Leads')
                            .replace('Funnel & Conversion', 'Funnels')
                            .replace('Appointment & Calendar', 'Appointments')
                            .replace('Task & System', 'Tasks')
                            .replace('Payment & Subscription', 'Payments');

                          return (
                            <AccordionItem key={category} border="none" mb={2}>
                              <AccordionButton
                                px={2}
                                py={3}
                                bg="gray.50"
                                borderRadius="md"
                                minH="44px"
                                _hover={{ bg: 'gray.100' }}
                                _expanded={{ bg: 'blue.50', color: 'blue.700' }}
                              >
                                <Box flex="1" textAlign="left">
                                  <Text fontSize="xs" fontWeight="500" textTransform="uppercase">
                                    {simpleCategory}
                                  </Text>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel px={2} pt={2} pb={0}>
                                <VStack spacing={2} align="stretch">
                                  {(filteredTriggers[category] || []).map((trigger, index) => {
                                    const triggerLabel = typeof trigger === 'string' ? trigger : trigger.label || trigger.value;
                                    const triggerValue = typeof trigger === 'string' ? trigger : trigger.value || trigger.label;
                                    const triggerDesc = typeof trigger === 'string' ? '' : trigger.description || '';
                                    const TriggerIcon = getTriggerIcon(triggerValue);
                                    return (
                                      <Card
                                        key={`${category}-${index}`}
                                        cursor="pointer"
                                        onClick={() => {
                                          addNode('trigger', trigger);
                                          setSearchQuery('');
                                        }}
                                        _hover={{
                                          borderColor: 'blue.300',
                                          boxShadow: 'md',
                                          transform: 'translateY(-1px)'
                                        }}
                                        transition="all 0.2s"
                                        border="1px"
                                        borderColor="gray.200"
                                        bg="white"
                                        p={3}
                                      >
                                        <HStack spacing={3} align="start">
                                          <Box
                                            p={2}
                                            borderRadius="md"
                                            bg="blue.50"
                                            color="blue.600"
                                            flexShrink={0}
                                          >
                                            <TriggerIcon size={18} />
                                          </Box>
                                          <VStack align="start" spacing={0.5} flex={1}>
                                            <Text fontSize="sm" fontWeight="600" color="gray.700">
                                              {triggerLabel}
                                            </Text>
                                            {triggerDesc && (
                                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                                {triggerDesc}
                                              </Text>
                                            )}
                                          </VStack>
                                        </HStack>
                                      </Card>
                                    );
                                  })}
                                </VStack>
                              </AccordionPanel>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    )}
                  </VStack>
                </TabPanel>

                {/* Actions Tab */}
                <TabPanel px={0} pt={4}>
                  <VStack spacing={2} align="stretch" maxH="calc(100vh - 300px)" overflowY="auto">
                    {Object.keys(filteredActions).length === 0 ? (
                      <Text color="gray.500" textAlign="center" py={8}>
                        No actions found matching "{searchQuery}"
                      </Text>
                    ) : searchQuery.trim() ? (
                      // When searching, show all results in groups without accordion
                      Object.keys(filteredActions).map((category) => {
                        const simpleCategory = category
                          .replace('Lead Data & Funnel Actions', 'Lead Actions')
                          .replace('Communication Actions', 'Messages')
                          .replace('Task & Workflow Actions', 'Tasks')
                          .replace('Zoom Integration Actions', 'Zoom')
                          .replace('Payment Actions', 'Payments')
                          .replace('System Actions', 'System');

                        return (
                          <Box key={category} mb={4}>
                            <Text fontSize="xs" fontWeight="500" color="gray.500" textTransform="uppercase" mb={2} px={2}>
                              {simpleCategory}
                            </Text>
                            <VStack spacing={2} align="stretch">
                              {(filteredActions[category] || []).map((action, index) => {
                                const actionLabel = typeof action === 'string' ? action : action.label || action.value;
                                const actionValue = typeof action === 'string' ? action : action.value || action.label;
                                const actionDesc = typeof action === 'string' ? '' : action.description || '';
                                const ActionIcon = getActionIcon(actionValue);
                                return (
                                  <Card
                                    key={`${category}-${index}`}
                                    cursor="pointer"
                                    onClick={() => {
                                      addNode('action', action);
                                      setSearchQuery('');
                                    }}
                                    _hover={{
                                      borderColor: 'green.300',
                                      boxShadow: 'md',
                                      transform: 'translateY(-1px)'
                                    }}
                                    transition="all 0.2s"
                                    border="1px"
                                    borderColor="gray.200"
                                    bg="white"
                                    p={3}
                                  >
                                    <HStack spacing={3} align="start">
                                      <Box
                                        p={2}
                                        borderRadius="md"
                                        bg="green.50"
                                        color="green.600"
                                        flexShrink={0}
                                      >
                                        <ActionIcon size={18} />
                                      </Box>
                                      <VStack align="start" spacing={0.5} flex={1}>
                                        <Text fontSize="sm" fontWeight="600" color="gray.700">
                                          {actionLabel}
                                        </Text>
                                        {actionDesc && (
                                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                            {actionDesc}
                                          </Text>
                                        )}
                                      </VStack>
                                    </HStack>
                                  </Card>
                                );
                              })}
                            </VStack>
                          </Box>
                        );
                      })
                    ) : (
                      // When not searching, show accordion
                      <Accordion allowMultiple defaultIndex={[]}>
                        {Object.keys(filteredActions).map((category) => {
                          const simpleCategory = category
                            .replace('Lead Data & Funnel Actions', 'Lead Actions')
                            .replace('Communication Actions', 'Messages')
                            .replace('Task & Workflow Actions', 'Tasks')
                            .replace('Zoom Integration Actions', 'Zoom')
                            .replace('Payment Actions', 'Payments')
                            .replace('System Actions', 'System');

                          return (
                            <AccordionItem key={category} border="none" mb={2}>
                              <AccordionButton
                                px={2}
                                py={3}
                                bg="gray.50"
                                borderRadius="md"
                                minH="44px"
                                _hover={{ bg: 'gray.100' }}
                                _expanded={{ bg: 'green.50', color: 'green.700' }}
                              >
                                <Box flex="1" textAlign="left">
                                  <Text fontSize="xs" fontWeight="500" textTransform="uppercase">
                                    {simpleCategory}
                                  </Text>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel px={2} pt={2} pb={0}>
                                <VStack spacing={2} align="stretch">
                                  {(filteredActions[category] || []).map((action, index) => {
                                    const actionLabel = typeof action === 'string' ? action : action.label || action.value;
                                    const actionValue = typeof action === 'string' ? action : action.value || action.label;
                                    const actionDesc = typeof action === 'string' ? '' : action.description || '';
                                    const ActionIcon = getActionIcon(actionValue);
                                    return (
                                      <Card
                                        key={`${category}-${index}`}
                                        cursor="pointer"
                                        onClick={() => {
                                          addNode('action', action);
                                          setSearchQuery('');
                                        }}
                                        _hover={{
                                          borderColor: 'green.300',
                                          boxShadow: 'md',
                                          transform: 'translateY(-1px)'
                                        }}
                                        transition="all 0.2s"
                                        border="1px"
                                        borderColor="gray.200"
                                        bg="white"
                                        p={3}
                                      >
                                        <HStack spacing={3} align="start">
                                          <Box
                                            p={2}
                                            borderRadius="md"
                                            bg="green.50"
                                            color="green.600"
                                            flexShrink={0}
                                          >
                                            <ActionIcon size={18} />
                                          </Box>
                                          <VStack align="start" spacing={0.5} flex={1}>
                                            <Text fontSize="sm" fontWeight="600" color="gray.700">
                                              {actionLabel}
                                            </Text>
                                            {actionDesc && (
                                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                                {actionDesc}
                                              </Text>
                                            )}
                                          </VStack>
                                        </HStack>
                                      </Card>
                                    );
                                  })}
                                </VStack>
                              </AccordionPanel>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    )}
                  </VStack>
                </TabPanel>

                {/* Flow Control Tab */}
                <TabPanel px={0} pt={4}>
                  <VStack spacing={2} align="stretch" maxH="calc(100vh - 300px)" overflowY="auto">
                    {(() => {
                      const baseItems = {
                        'Flow Control': [
                          { label: 'Delay', type: 'delay', icon: FiClock, color: 'orange', data: { label: 'Delay', delayMinutes: 5 }, description: 'Wait for a specified amount of time before continuing' },
                          { label: 'Condition', type: 'condition', icon: FiFilter, color: 'purple', data: { label: 'Condition', conditionType: 'Custom' }, description: 'Branch workflow based on conditions (if/else)' },
                        ]
                      };

                      const flowControlItems = baseItems;

                      const filtered = {};
                      Object.keys(flowControlItems).forEach(category => {
                        const categoryItems = flowControlItems[category].filter(item =>
                          !searchQuery.trim() ||
                          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                        );
                        if (categoryItems.length > 0) {
                          filtered[category] = categoryItems;
                        }
                      });

                      if (Object.keys(filtered).length === 0) {
                        return (
                          <Text color="gray.500" textAlign="center" py={8}>
                            No flow control items found matching "{searchQuery}"
                          </Text>
                        );
                      }

                      return searchQuery.trim() ? (
                        // When searching, show all results in groups without accordion
                        Object.keys(filtered).map((category) => {
                          const simpleCategory = category.replace('Flow Control', 'Flow');
                          return (
                            <Box key={category} mb={4}>
                              <Text fontSize="xs" fontWeight="500" color="gray.500" textTransform="uppercase" mb={2} px={2}>
                                {simpleCategory}
                              </Text>
                              <VStack spacing={2} align="stretch">
                                {filtered[category].map((item, index) => {
                                  const IconComponent = item.icon;
                                  return (
                                    <Card
                                      key={`${category}-${index}`}
                                      cursor="pointer"
                                      onClick={() => {
                                        addNode(item.type, item.data);
                                        setSearchQuery('');
                                      }}
                                      _hover={{
                                        borderColor: `${item.color}.300`,
                                        boxShadow: 'md',
                                        transform: 'translateY(-1px)'
                                      }}
                                      transition="all 0.2s"
                                      border="1px"
                                      borderColor="gray.200"
                                      bg="white"
                                      p={3}
                                    >
                                      <HStack spacing={3} align="start">
                                        <Box
                                          p={2}
                                          borderRadius="md"
                                          bg={`${item.color}.50`}
                                          color={`${item.color}.600`}
                                          flexShrink={0}
                                        >
                                          <IconComponent size={18} />
                                        </Box>
                                        <VStack align="start" spacing={0.5} flex={1}>
                                          <Text fontSize="sm" fontWeight="600" color="gray.700">
                                            {item.label}
                                          </Text>
                                          {item.description && (
                                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                              {item.description}
                                            </Text>
                                          )}
                                        </VStack>
                                      </HStack>
                                    </Card>
                                  );
                                })}
                              </VStack>
                            </Box>
                          );
                        })
                      ) : (
                        // When not searching, show accordion
                        <Accordion allowMultiple defaultIndex={[]}>
                          {Object.keys(filtered).map((category) => {
                            const simpleCategory = category.replace('Flow Control', 'Flow');
                            return (
                              <AccordionItem key={category} border="none" mb={2}>
                                <AccordionButton
                                  px={2}
                                  py={3}
                                  bg="gray.50"
                                  borderRadius="md"
                                  minH="44px"
                                  _hover={{ bg: 'gray.100' }}
                                  _expanded={{ bg: 'purple.50', color: 'purple.700' }}
                                >
                                  <Box flex="1" textAlign="left">
                                    <Text fontSize="xs" fontWeight="500" textTransform="uppercase">
                                      {simpleCategory}
                                    </Text>
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel px={2} pt={2} pb={0}>
                                  <VStack spacing={2} align="stretch">
                                    {filtered[category].map((item, index) => {
                                      const IconComponent = item.icon;
                                      return (
                                        <Card
                                          key={`${category}-${index}`}
                                          cursor="pointer"
                                          onClick={() => {
                                            addNode(item.type, item.data);
                                            setSearchQuery('');
                                          }}
                                          _hover={{
                                            borderColor: `${item.color}.300`,
                                            boxShadow: 'md',
                                            transform: 'translateY(-1px)'
                                          }}
                                          transition="all 0.2s"
                                          border="1px"
                                          borderColor="gray.200"
                                          bg="white"
                                          p={3}
                                        >
                                          <HStack spacing={3} align="start">
                                            <Box
                                              p={2}
                                              borderRadius="md"
                                              bg={`${item.color}.50`}
                                              color={`${item.color}.600`}
                                              flexShrink={0}
                                            >
                                              <IconComponent size={18} />
                                            </Box>
                                            <VStack align="start" spacing={0.5} flex={1}>
                                              <Text fontSize="sm" fontWeight="600" color="gray.700">
                                                {item.label}
                                              </Text>
                                              {item.description && (
                                                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                                  {item.description}
                                                </Text>
                                              )}
                                            </VStack>
                                          </HStack>
                                        </Card>
                                      );
                                    })}
                                  </VStack>
                                </AccordionPanel>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      );
                    })()}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Node Configuration Drawer */}
      <Drawer
        isOpen={isNodeConfigOpen}
        placement="right"
        onClose={onNodeConfigClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack spacing={2}>
              <FiSettings />
              <Text>Configure Node</Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            {selectedNode && (
              <NodeConfigForm
                node={selectedNode}
                onSave={updateNodeConfig}
                onCancel={onNodeConfigClose}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

  </>
  );
};



export default AutomationRulesGraphBuilder;