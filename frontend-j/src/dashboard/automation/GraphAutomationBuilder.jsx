import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
} from '@chakra-ui/react';
import {
  FiZap,
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
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiMail,
  FiList,
  FiTrendingUp,
  FiTag,
  FiMessageSquare,
  FiClock,
  FiFilter,
  FiBell,
  FiFileText,
  FiLink,
  FiShare2,
  FiCreditCard,
  FiShoppingCart,
  FiBarChart2,
} from 'react-icons/fi';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getCoachId, getToken } from '../../utils/authUtils';
import MessageSequenceBuilder from './MessageSequenceBuilder';

const API_BASE_URL = 'https://api.funnelseye.com/api';

// Custom Node Components
const TriggerNode = ({ data, selected }) => {
  return (
    <Box
      bg="blue.50"
      border="2px"
      borderColor={selected ? 'blue.500' : 'blue.200'}
      borderRadius="lg"
      p={4}
      minW="200px"
      boxShadow={selected ? 'lg' : 'md'}
      transition="all 0.2s"
    >
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <VStack spacing={2} align="start">
        <HStack>
          <FiZap color="#3182CE" />
          <Text fontWeight="bold" fontSize="sm" color="blue.700">
            {data.label || 'Trigger'}
          </Text>
        </HStack>
        <Badge colorScheme="blue" size="sm">
          {data.nodeType || 'Event'}
        </Badge>
        {data.description && (
          <Text fontSize="xs" color="gray.600" noOfLines={2}>
            {data.description}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

const ActionNode = ({ data, selected }) => {
  const getActionColor = (type) => {
    const colors = {
      send_whatsapp_message: 'green',
      send_email_message: 'blue',
      send_sms_message: 'purple',
      create_task: 'orange',
      update_lead_status: 'teal',
      add_lead_tag: 'pink',
      default: 'gray',
    };
    return colors[type] || colors.default;
  };

  const colorScheme = getActionColor(data.nodeType);

  return (
    <Box
      bg={`${colorScheme}.50`}
      border="2px"
      borderColor={selected ? `${colorScheme}.500` : `${colorScheme}.200`}
      borderRadius="lg"
      p={4}
      minW="200px"
      boxShadow={selected ? 'lg' : 'md'}
      transition="all 0.2s"
    >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <VStack spacing={2} align="start">
        <HStack>
          <FiPlay color={`var(--chakra-colors-${colorScheme}-500)`} />
          <Text fontWeight="bold" fontSize="sm" color={`${colorScheme}.700`}>
            {data.label || 'Action'}
          </Text>
        </HStack>
        <Badge colorScheme={colorScheme} size="sm">
          {data.nodeType || 'Action'}
        </Badge>
        {data.description && (
          <Text fontSize="xs" color="gray.600" noOfLines={2}>
            {data.description}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

const DelayNode = ({ data, selected }) => {
  return (
    <Box
      bg="orange.50"
      border="2px"
      borderColor={selected ? 'orange.500' : 'orange.200'}
      borderRadius="lg"
      p={4}
      minW="200px"
      boxShadow={selected ? 'lg' : 'md'}
      transition="all 0.2s"
    >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <VStack spacing={2} align="start">
        <HStack>
          <FiPause color="#DD6B20" />
          <Text fontWeight="bold" fontSize="sm" color="orange.700">
            {data.label || 'Delay'}
          </Text>
        </HStack>
        <Badge colorScheme="orange" size="sm">
          Wait {data.delay || 0}s
        </Badge>
      </VStack>
    </Box>
  );
};

const ConditionNode = ({ data, selected }) => {
  return (
    <Box
      bg="purple.50"
      border="2px"
      borderColor={selected ? 'purple.500' : 'purple.200'}
      borderRadius="lg"
      p={4}
      minW="200px"
      boxShadow={selected ? 'lg' : 'md'}
      transition="all 0.2s"
    >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ background: '#10b981', top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ background: '#ef4444', top: '70%' }}
      />
      <VStack spacing={2} align="start">
        <HStack>
          <FiSettings color="#805AD5" />
          <Text fontWeight="bold" fontSize="sm" color="purple.700">
            {data.label || 'Condition'}
          </Text>
        </HStack>
        <Badge colorScheme="purple" size="sm">
          If/Else
        </Badge>
      </VStack>
    </Box>
  );
};

const SequenceNode = ({ data, selected }) => {
  const steps = data.sequenceSteps || [];
  return (
    <Box
      bg="pink.50"
      border="2px"
      borderColor={selected ? 'pink.500' : 'pink.200'}
      borderRadius="lg"
      p={4}
      minW="220px"
      boxShadow={selected ? 'lg' : 'md'}
      transition="all 0.2s"
    >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
      <VStack spacing={2} align="start">
        <HStack>
          <FiMessageSquare color="#B83280" />
          <Text fontWeight="bold" fontSize="sm" color="pink.700">
            {data.label || 'Message Sequence'}
          </Text>
        </HStack>
        <Badge colorScheme="pink" size="sm">
          {steps.length} {steps.length === 1 ? 'Step' : 'Steps'}
        </Badge>
        {steps.slice(0, 2).map((step, index) => (
          <Text key={index} fontSize="xs" color="gray.600" noOfLines={1}>
            {step.title || `Step ${index + 1}`} • {step.delayAmount || 0} {step.delayUnit || 'minutes'}
          </Text>
        ))}
        {steps.length > 2 && (
          <Text fontSize="xs" color="gray.500">+{steps.length - 2} more</Text>
        )}
      </VStack>
    </Box>
  );
};

// Node types mapping
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  delay: DelayNode,
  condition: ConditionNode,
  sequence: SequenceNode,
};

// Inner ReactFlow component that has access to useReactFlow hook
const ReactFlowInner = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick, nodeTypes, rule, onViewportReady }) => {
  const reactFlowInstance = useReactFlow();
  
  // Store reference to reactFlowInstance in parent
  useEffect(() => {
    if (reactFlowInstance && onViewportReady) {
      onViewportReady(reactFlowInstance);
    }
  }, [reactFlowInstance, onViewportReady]);

  // Restore viewport when rule is loaded
  useEffect(() => {
    if (rule?.viewport && reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.setViewport({
          x: rule.viewport.x || 0,
          y: rule.viewport.y || 0,
          zoom: rule.viewport.zoom || 1,
        });
      }, 100);
    }
  }, [rule, reactFlowInstance]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView={!rule?.viewport}
      defaultViewport={rule?.viewport ? { x: rule.viewport.x, y: rule.viewport.y, zoom: rule.viewport.zoom } : undefined}
      attributionPosition="bottom-left"
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};

// Main Component
const shouldHideBillingTrigger = (event) => {
  const value =
    typeof event === 'string'
      ? event
      : event?.value || event?.label || event?.name || '';
  if (!value) return false;
  const normalized = value.toLowerCase();
  return (
    normalized.includes('invoice') ||
    normalized.includes('subscription') ||
    normalized.includes('refund')
  );
};

const GraphAutomationBuilder = ({ rule, onSave, onClose, eventsActions, builderResources }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [ruleName, setRuleName] = useState(rule?.name || '');
  const [ruleDescription, setRuleDescription] = useState(rule?.description || '');
  const [isActive, setIsActive] = useState(rule?.isActive !== false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  const { isOpen: isNodeConfigOpen, onOpen: onNodeConfigOpen, onClose: onNodeConfigClose } = useDisclosure();
  const { isOpen: isNodePaletteOpen, onOpen: onNodePaletteOpen, onClose: onNodePaletteClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  const toast = useToast();
  const authState = useSelector((state) => state.auth);
  const token = getToken(authState);
  const coachId = getCoachId(authState);

  // Initialize nodes and edges from rule
  useEffect(() => {
    if (rule && (rule.workflowType === 'graph' || (rule.nodes && rule.nodes.length > 0))) {
      if (rule.nodes && rule.nodes.length > 0) {
        const initialNodes = rule.nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position || { x: 0, y: 0 },
          data: {
            ...(node.data || {}),
            label: node.label || node.data?.label || node.nodeType || 'Node',
            nodeType: node.nodeType || node.data?.nodeType || '',
            config: node.config || node.data?.config || {},
            description: node.description || node.data?.description || '',
          },
        }));
        setNodes(initialNodes);
      }
      if (rule.edges && rule.edges.length > 0) {
        const initialEdges = rule.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null,
          type: edge.type || 'smoothstep',
          animated: edge.animated || false,
          label: edge.label || '',
        }));
        setEdges(initialEdges);
      }
    } else if (rule && rule.workflowType === 'legacy') {
      // Convert legacy rule to graph format
      const triggerNode = {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 250 },
        data: {
          label: 'Trigger',
          nodeType: rule.triggerEvent,
          description: `Triggers on: ${rule.triggerEvent}`,
        },
      };
      
      const actionNodes = (rule.actions || []).map((action, index) => ({
        id: `action-${index + 1}`,
        type: 'action',
        position: { x: 400 + index * 300, y: 250 },
        data: {
          label: action.type,
          nodeType: action.type,
          config: action.config,
        },
      }));

      const newEdges = actionNodes.map((node, index) => ({
        id: `edge-${index}`,
        source: index === 0 ? 'trigger-1' : `action-${index}`,
        target: node.id,
        type: 'smoothstep',
      }));

      setNodes([triggerNode, ...actionNodes]);
      setEdges(newEdges);
    }
  }, [rule]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: false,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    onNodeConfigOpen();
  }, [onNodeConfigOpen]);

  const addNode = useCallback((nodeType, nodeData) => {
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 400 + 100,
      },
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

  const handleSave = async () => {
    if (!ruleName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a rule name',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one node to the workflow',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const hasTrigger = nodes.some((n) => n.type === 'trigger');
    const hasAction = nodes.some((n) => n.type === 'action');

    if (!hasTrigger) {
      toast({
        title: 'Error',
        description: 'Workflow must have at least one trigger node',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (!hasAction) {
      toast({
        title: 'Error',
        description: 'Workflow must have at least one action node',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate workflow
    try {
      const validationResponse = await axios.post(
        `${API_BASE_URL}/automation-rules/validate-graph`,
        { nodes, edges },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!validationResponse.data.valid) {
        toast({
          title: 'Validation Errors',
          description: validationResponse.data.errors.join(', '),
          status: 'error',
          duration: 5000,
        });
        return;
      }

      if (validationResponse.data.warnings.length > 0) {
        console.warn('Validation warnings:', validationResponse.data.warnings);
      }
    } catch (error) {
      console.error('Validation error:', error);
      // Continue anyway if validation endpoint fails
    }

    // Get current viewport from ReactFlow
    const currentViewport = reactFlowInstance ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 };

    // Prepare workflow data - ensure all required fields are present
    const workflowData = {
      name: ruleName.trim(),
      description: ruleDescription?.trim() || '',
      workflowType: 'graph',
      nodes: nodes.map((node) => {
        const nodeData = {
          id: node.id,
          type: node.type,
          nodeType: node.data?.nodeType || node.data?.type || '',
          label: node.data?.label || node.data?.nodeType || 'Node',
          position: node.position || { x: 0, y: 0 },
          data: {
            label: node.data?.label || node.data?.nodeType || 'Node',
            nodeType: node.data?.nodeType || node.data?.type || '',
            description: node.data?.description || '',
            ...(node.data || {}),
          },
          config: node.data?.config || {},
        };
        return nodeData;
      }),
      edges: edges.map((edge) => ({
        id: edge.id || `edge-${Date.now()}-${Math.random()}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null,
        type: edge.type || 'smoothstep',
        animated: edge.animated || false,
        label: edge.label || '',
      })),
      viewport: {
        x: currentViewport.x || 0,
        y: currentViewport.y || 0,
        zoom: currentViewport.zoom || 1,
      },
      isActive: isActive !== undefined ? isActive : true,
      coachId: coachId || rule?.coachId,
    };

    if (onSave) {
      onSave(workflowData);
    }
  };

  const nodeCategories = useMemo(() => {
    if (!eventsActions) return { triggers: [], actions: [] };
    
    const triggers = (eventsActions.events || []).filter(
      (event) => !shouldHideBillingTrigger(event)
    );
    const actions = eventsActions.actions || [];
    
    return { triggers, actions };
  }, [eventsActions]);

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

  // Filter nodes based on search query
  const filteredTriggers = useMemo(() => {
    if (!searchQuery.trim()) return nodeCategories.triggers;
    const query = searchQuery.toLowerCase();
    return nodeCategories.triggers.filter(event => {
      const label = typeof event === 'string' ? event : event.label || event.value || '';
      return label.toLowerCase().includes(query);
    });
  }, [nodeCategories.triggers, searchQuery]);

  const filteredActions = useMemo(() => {
    if (!searchQuery.trim()) return nodeCategories.actions;
    const query = searchQuery.toLowerCase();
    return nodeCategories.actions.filter(action => {
      const label = typeof action === 'string' ? action : action.label || action.value || '';
      return label.toLowerCase().includes(query);
    });
  }, [nodeCategories.actions, searchQuery]);

  return (
    <Box w="100%" h="100vh" bg="gray.50" position="relative" display="flex" flexDirection="column">
      {/* Top Toolbar */}
      <Box
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        p={4}
        zIndex={10}
        boxShadow="sm"
        flexShrink={0}
      >
        <HStack justify="space-between" align="center">
          <HStack spacing={4} flex={1}>
            <Input
              placeholder="Rule Name"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              maxW="300px"
              size="md"
            />
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              size="sm"
              onClick={onNodePaletteOpen}
            >
              Add Node
            </Button>
            <Button
              leftIcon={<FiSettings />}
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedNode) {
                  onNodeConfigOpen();
                }
              }}
              isDisabled={!selectedNode}
            >
              Configure
            </Button>
          </HStack>
          <HStack spacing={2}>
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              leftIcon={<FiSave />}
              colorScheme="green"
              size="sm"
              onClick={handleSave}
            >
              Save Workflow
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* React Flow Canvas */}
      <Box flex={1} position="relative" minH={0}>
        <ReactFlowProvider>
          <ReactFlowInner
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            rule={rule}
            onViewportReady={setReactFlowInstance}
          />
        </ReactFlowProvider>
      </Box>

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
                  <SimpleGrid columns={1} spacing={3}>
                    {filteredTriggers.length === 0 ? (
                      <Text color="gray.500" textAlign="center" py={8}>
                        No triggers found matching "{searchQuery}"
                      </Text>
                    ) : (
                      filteredTriggers.map((event, index) => {
                        const eventLabel = typeof event === 'string' ? event : event.label || event.value;
                        const eventValue = typeof event === 'string' ? event : event.value || event.label;
                        const TriggerIcon = getTriggerIcon(eventValue);
                        return (
                          <Card
                            key={index}
                            cursor="pointer"
                            onClick={() => {
                              addNode('trigger', event);
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
                            <HStack spacing={3}>
                              <Box
                                p={2}
                                borderRadius="md"
                                bg="blue.50"
                                color="blue.600"
                              >
                                <TriggerIcon size={18} />
                              </Box>
                              <Text fontSize="sm" fontWeight="600" color="gray.700">
                                {eventLabel}
                              </Text>
                            </HStack>
                          </Card>
                        );
                      })
                    )}
                  </SimpleGrid>
                </TabPanel>

                {/* Actions Tab */}
                <TabPanel px={0} pt={4}>
                  <SimpleGrid columns={1} spacing={3}>
                    {filteredActions.length === 0 ? (
                      <Text color="gray.500" textAlign="center" py={8}>
                        No actions found matching "{searchQuery}"
                      </Text>
                    ) : (
                      filteredActions.map((action, index) => {
                        const actionLabel = typeof action === 'string' ? action : action.label || action.value;
                        const actionValue = typeof action === 'string' ? action : action.value || action.label;
                        const ActionIcon = getActionIcon(actionValue);
                        return (
                          <Card
                            key={index}
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
                            <HStack spacing={3}>
                              <Box
                                p={2}
                                borderRadius="md"
                                bg="green.50"
                                color="green.600"
                              >
                                <ActionIcon size={18} />
                              </Box>
                              <Text fontSize="sm" fontWeight="600" color="gray.700">
                                {actionLabel}
                              </Text>
                            </HStack>
                          </Card>
                        );
                      })
                    )}
                  </SimpleGrid>
                </TabPanel>

                {/* Flow Control Tab */}
                <TabPanel px={0} pt={4}>
                  <SimpleGrid columns={1} spacing={3}>
                    {(() => {
                      const flowControlItems = [
                        { label: 'Delay', type: 'delay', icon: FiClock, color: 'orange', data: { label: 'Delay', delay: 0 } },
                        { label: 'Condition', type: 'condition', icon: FiFilter, color: 'purple', data: { label: 'Condition' } },
                        { label: 'Message Sequence', type: 'sequence', icon: FiMessageSquare, color: 'pink', data: { label: 'Message Sequence', sequenceSteps: [] } },
                      ];
                      
                      const filtered = flowControlItems.filter(item => 
                        !searchQuery.trim() || item.label.toLowerCase().includes(searchQuery.toLowerCase())
                      );

                      if (filtered.length === 0) {
                        return (
                          <Text color="gray.500" textAlign="center" py={8}>
                            No flow control items found matching "{searchQuery}"
                          </Text>
                        );
                      }

                      return filtered.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <Card
                            key={index}
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
                            <HStack spacing={3}>
                              <Box
                                p={2}
                                borderRadius="md"
                                bg={`${item.color}.50`}
                                color={`${item.color}.600`}
                              >
                                <IconComponent size={18} />
                              </Box>
                              <Text fontSize="sm" fontWeight="600" color="gray.700">
                                {item.label}
                              </Text>
                            </HStack>
                          </Card>
                        );
                      });
                    })()}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Node Configuration Drawer */}
      <Drawer isOpen={isNodeConfigOpen} placement="right" onClose={onNodeConfigClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Configure: {selectedNode?.data?.label || 'Node'}
          </DrawerHeader>
          <DrawerBody>
            {selectedNode && (
              <NodeConfigurationPanel
                node={selectedNode}
                onUpdate={updateNodeConfig}
                onDelete={() => {
                  deleteNode(selectedNode.id);
                  onNodeConfigClose();
                }}
                builderResources={builderResources}
                allNodes={nodes}
                onClose={onNodeConfigClose}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

// Node Configuration Panel Component
const NodeConfigurationPanel = ({ node, onUpdate, onDelete, builderResources, allNodes, onClose }) => {
  const [config, setConfig] = useState(node.data.config || {});
  const [label, setLabel] = useState(node.data.label || '');
  const [sequenceSteps, setSequenceSteps] = useState(node.data.sequenceSteps || []);

  useEffect(() => {
    setConfig(node.data.config || {});
    setLabel(node.data.label || '');
    setSequenceSteps(node.data.sequenceSteps || []);
  }, [node]);

  // Find trigger node to get trigger event
  const triggerNode = allNodes?.find(n => n.type === 'trigger');
  const triggerEvent = triggerNode?.data?.nodeType || '';

  const handleSave = () => {
    const finalLabel = label.trim() || node.data.label || node.data.nodeType || 'Node';
    const payload = { label: finalLabel, config };
    if (node.type === 'sequence') {
      payload.sequenceSteps = sequenceSteps;
    }
    onUpdate(payload);
    // Close drawer after saving
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 500); // Small delay to show success message
    }
  };

  const renderConfigFields = () => {
    const nodeType = node.data.nodeType;
    
    switch (node.type) {
      case 'trigger':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Trigger Event</FormLabel>
              <Text fontSize="sm" color="gray.600">
                {nodeType}
              </Text>
            </FormControl>
          </VStack>
        );

      case 'action':
        return (
          <ActionConfigFields
            actionType={nodeType}
            config={config}
            onChange={setConfig}
            builderResources={builderResources}
            triggerEvent={triggerEvent}
          />
        );

      case 'delay':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Delay (seconds)</FormLabel>
              <NumberInput
                value={config.delay || 0}
                onChange={(value) => setConfig({ ...config, delay: parseInt(value) || 0 })}
                min={0}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </VStack>
        );

      case 'condition':
        return (
          <VStack spacing={4} align="stretch">
            <Alert status="info">
              <AlertIcon />
              Condition configuration coming soon
            </Alert>
          </VStack>
        );

      case 'sequence':
        return (
          <VStack spacing={4} align="stretch">
            <MessageSequenceBuilder
              sequences={sequenceSteps}
              onChange={setSequenceSteps}
            />
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Node Label</FormLabel>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter node label"
        />
      </FormControl>

      <Divider />

      {renderConfigFields()}

      <Divider />

      <HStack spacing={2}>
        <Button
          leftIcon={<FiTrash2 />}
          colorScheme="red"
          variant="outline"
          onClick={onDelete}
          flex={1}
        >
          Delete Node
        </Button>
        <Button
          leftIcon={<FiCheck />}
          colorScheme="green"
          onClick={handleSave}
          flex={1}
        >
          Save Changes
        </Button>
      </HStack>
    </VStack>
  );
};

// Action Configuration Fields Component
const ActionConfigFields = ({ actionType, config, onChange, builderResources, triggerEvent }) => {
  const [showVariables, setShowVariables] = useState(false);
  const [variableSuggestions, setVariableSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  // Get available variables based on trigger event
  const getAvailableVariables = (event) => {
    const generalVariables = [
      { path: '{{currentDate}}', description: 'Current date (YYYY-MM-DD)' },
      { path: '{{currentTime}}', description: 'Current time (HH:MM:SS)' },
      { path: '{{currentDateTime}}', description: 'Current date and time' },
      { path: '{{timestamp}}', description: 'Unix timestamp' }
    ];

    const leadVariables = [
      { path: '{{lead.name}}', description: 'Lead full name' },
      { path: '{{lead.firstName}}', description: 'Lead first name' },
      { path: '{{lead.lastName}}', description: 'Lead last name' },
      { path: '{{lead.email}}', description: 'Lead email address' },
      { path: '{{lead.phone}}', description: 'Lead phone number' },
      { path: '{{lead.status}}', description: 'Lead status' },
      { path: '{{lead.temperature}}', description: 'Lead temperature (Hot/Warm/Cold)' },
      { path: '{{lead.source}}', description: 'Lead source' },
      { path: '{{lead.score}}', description: 'Lead score' }
    ];

    let eventVariables = [...generalVariables];
    if (event && event.includes('lead')) {
      eventVariables = [...eventVariables, ...leadVariables];
    }
    return eventVariables;
  };

  const availableVariables = getAvailableVariables(triggerEvent);

  const updateField = (field, value) => {
    onChange({ ...config, [field]: value });
  };

  const insertVariable = (variable, fieldName) => {
    const currentValue = config[fieldName] || '';
    const textarea = document.getElementById(`action-config-${fieldName}`);
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
      updateField(fieldName, newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
      updateField(fieldName, currentValue + variable);
    }
    setShowVariables(false);
  };

  const handleVariableInput = (fieldName, value) => {
    updateField(fieldName, value);
    if (value.includes('{{')) {
      const searchTerm = value.substring(value.lastIndexOf('{{') + 2).toLowerCase();
      const filtered = availableVariables.filter(v =>
        v.path.toLowerCase().includes(searchTerm) ||
        v.description.toLowerCase().includes(searchTerm)
      );
      setVariableSuggestions(filtered);
      setActiveField(fieldName);
      setShowVariables(true);
    } else {
      setShowVariables(false);
    }
  };

  const VariableHelper = ({ fieldName }) => (
    <Box>
      {showVariables && activeField === fieldName && (
        <Box mt={2} p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
          <Text fontSize="xs" fontWeight="bold" mb={2}>Available Variables:</Text>
          <VStack align="stretch" spacing={1} maxH="200px" overflowY="auto">
            {(variableSuggestions.length > 0 ? variableSuggestions : availableVariables).map((v, i) => (
              <Button
                key={i}
                size="xs"
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => insertVariable(v.path, fieldName)}
                leftIcon={<Code fontSize="xs" />}
              >
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" fontWeight="bold">{v.path}</Text>
                  <Text fontSize="xs" color="gray.600">{v.description}</Text>
                </VStack>
              </Button>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );

  switch (actionType) {
    case 'add_note_to_lead':
      return (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>
              Note Content
              <Tooltip label="Click info icon to see available variables">
                <IconButton
                  icon={<FiInfo />}
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => setShowVariables(!showVariables)}
                />
              </Tooltip>
            </FormLabel>
            <Textarea
              id={`action-config-note`}
              value={config.note || ''}
              onChange={(e) => handleVariableInput('note', e.target.value)}
              placeholder="Enter note content. Use {{lead.name}} for dynamic values"
              rows={4}
            />
            <VariableHelper fieldName="note" />
          </FormControl>
          <FormControl>
            <FormLabel>Note Type</FormLabel>
            <Select
              value={config.noteType || 'general'}
              onChange={(e) => updateField('noteType', e.target.value)}
            >
              <option value="general">General</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="followup">Follow-up</option>
              <option value="important">Important</option>
            </Select>
          </FormControl>
        </VStack>
      );

    case 'create_task':
      return (
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Task Name</FormLabel>
            <Input
              id={`action-config-name`}
              value={config.name || ''}
              onChange={(e) => handleVariableInput('name', e.target.value)}
              placeholder="e.g., Follow up with {{lead.name}}"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              id={`action-config-description`}
              value={config.description || ''}
              onChange={(e) => handleVariableInput('description', e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </FormControl>
          <SimpleGrid columns={2} spacing={4}>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select
                value={config.priority || 'MEDIUM'}
                onChange={(e) => updateField('priority', e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Stage</FormLabel>
              <Select
                value={config.stage || 'LEAD_GENERATION'}
                onChange={(e) => updateField('stage', e.target.value)}
              >
                <option value="LEAD_GENERATION">Lead Generation</option>
                <option value="LEAD_QUALIFICATION">Lead Qualification</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="CLOSING">Closing</option>
                <option value="ONBOARDING">Onboarding</option>
              </Select>
            </FormControl>
          </SimpleGrid>
          <FormControl>
            <FormLabel>Assign To</FormLabel>
            <Select
              value={config.assignedTo || ''}
              onChange={(e) => updateField('assignedTo', e.target.value)}
              placeholder="Select staff (optional, defaults to coach)"
            >
              <option value="">Coach (Me)</option>
              {(builderResources?.staff || []).map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Due Date Offset (days)</FormLabel>
            <NumberInput
              value={config.dueDateOffset || 7}
              onChange={(value) => updateField('dueDateOffset', parseInt(value) || 7)}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>Days from now (e.g., 7 = 7 days from trigger)</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Estimated Hours</FormLabel>
            <NumberInput
              value={config.estimatedHours || 1}
              onChange={(value) => updateField('estimatedHours', parseFloat(value) || 1)}
              min={0.5}
              step={0.5}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </VStack>
      );

    case 'send_whatsapp_message':
    case 'send_sms_message':
      return (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Message Template</FormLabel>
            <Select
              value={config.templateId || ''}
              onChange={(e) => updateField('templateId', e.target.value)}
              placeholder="Select template (optional)"
            >
              <option value="">Custom Message</option>
              {(builderResources?.messageTemplates || [])
                .filter(t => t.type === (actionType === 'send_whatsapp_message' ? 'whatsapp' : 'sms'))
                .map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>
              Message
              <Tooltip label="Click info icon to see available variables">
                <IconButton
                  icon={<FiInfo />}
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => setShowVariables(!showVariables)}
                />
              </Tooltip>
            </FormLabel>
            <Textarea
              id={`action-config-message`}
              value={config.message || ''}
              onChange={(e) => handleVariableInput('message', e.target.value)}
              placeholder="Enter message. Use {{lead.name}} for dynamic values"
              rows={6}
            />
            <VariableHelper fieldName="message" />
          </FormControl>
        </VStack>
      );

    case 'send_email_message':
      return (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email Template</FormLabel>
            <Select
              value={config.templateId || ''}
              onChange={(e) => updateField('templateId', e.target.value)}
              placeholder="Select template (optional)"
            >
              <option value="">Custom Email</option>
              {(builderResources?.messageTemplates || [])
                .filter(t => t.type === 'email')
                .map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Subject</FormLabel>
            <Input
              id={`action-config-subject`}
              value={config.subject || ''}
              onChange={(e) => handleVariableInput('subject', e.target.value)}
              placeholder="Email subject"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>
              Body
              <Tooltip label="Click info icon to see available variables">
                <IconButton
                  icon={<FiInfo />}
                  size="xs"
                  variant="ghost"
                  ml={2}
                  onClick={() => setShowVariables(!showVariables)}
                />
              </Tooltip>
            </FormLabel>
            <Textarea
              id={`action-config-body`}
              value={config.body || ''}
              onChange={(e) => handleVariableInput('body', e.target.value)}
              placeholder="Email body. Use {{lead.name}} for dynamic values"
              rows={8}
            />
            <VariableHelper fieldName="body" />
          </FormControl>
        </VStack>
      );

    case 'assign_lead_to_staff':
      return (
        <FormControl isRequired>
          <FormLabel>Assign To Staff</FormLabel>
          <Select
            value={config.staffId || ''}
            onChange={(e) => updateField('staffId', e.target.value)}
            placeholder="Select staff member"
          >
            {(builderResources?.staff || []).map(staff => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </Select>
        </FormControl>
      );

    case 'update_lead_status':
      return (
        <FormControl isRequired>
          <FormLabel>New Status</FormLabel>
          <Select
            value={config.status || ''}
            onChange={(e) => updateField('status', e.target.value)}
            placeholder="Select status"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed">Closed</option>
            <option value="Lost">Lost</option>
          </Select>
        </FormControl>
      );

    case 'add_lead_tag':
      return (
        <FormControl isRequired>
          <FormLabel>Tag Name</FormLabel>
          <Input
            value={config.tag || ''}
            onChange={(e) => updateField('tag', e.target.value)}
            placeholder="Enter tag name"
          />
        </FormControl>
      );

    case 'update_lead_score':
      return (
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Score</FormLabel>
            <NumberInput
              value={config.score || 0}
              onChange={(value) => updateField('score', parseInt(value) || 0)}
              min={0}
              max={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>Reason</FormLabel>
            <Input
              value={config.reason || ''}
              onChange={(e) => updateField('reason', e.target.value)}
              placeholder="Reason for score update"
            />
          </FormControl>
        </VStack>
      );

    case 'add_to_funnel':
    case 'move_to_funnel_stage':
      return (
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Funnel</FormLabel>
            <Select
              value={config.funnelId || ''}
              onChange={(e) => {
                updateField('funnelId', e.target.value);
                updateField('stageId', ''); // Reset stage when funnel changes
              }}
              placeholder="Select funnel"
            >
              {(builderResources?.funnels || []).map(funnel => (
                <option key={funnel.id} value={funnel.id}>
                  {funnel.name}
                </option>
              ))}
            </Select>
          </FormControl>
          {config.funnelId && (
            <FormControl isRequired>
              <FormLabel>Stage</FormLabel>
              <Select
                value={config.stageId || ''}
                onChange={(e) => updateField('stageId', e.target.value)}
                placeholder="Select stage"
              >
                {(builderResources?.funnels || [])
                  .find(f => f.id === config.funnelId)
                  ?.stages?.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
          )}
        </VStack>
      );

    case 'wait_delay':
      return (
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Delay (Days)</FormLabel>
            <NumberInput
              value={config.delayDays || 0}
              onChange={(value) => updateField('delayDays', parseInt(value) || 0)}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>Delay (Hours)</FormLabel>
            <NumberInput
              value={config.delayHours || 0}
              onChange={(value) => updateField('delayHours', parseInt(value) || 0)}
              min={0}
              max={23}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>Delay (Minutes)</FormLabel>
            <NumberInput
              value={config.delayMinutes || 0}
              onChange={(value) => updateField('delayMinutes', parseInt(value) || 0)}
              min={0}
              max={59}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </VStack>
      );

    default:
      return (
        <Alert status="info">
          <AlertIcon />
          Configuration for this action type will be available soon.
        </Alert>
      );
  }
};

export default GraphAutomationBuilder;

