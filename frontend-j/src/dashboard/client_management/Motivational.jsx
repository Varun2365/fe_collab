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
  Image,
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiDownload,
  FiEye,
  FiTrendingUp,
  FiStar,
  FiFileText,
} from 'react-icons/fi';

const Motivational = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStory, setSelectedStory] = useState(null);

  const successStories = [
    {
      id: 1,
      client: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      title: 'Lost 5kg in 3 Months',
      description: 'Transformed my lifestyle completely with consistent workouts and proper nutrition.',
      weightLost: 5,
      duration: '3 months',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      date: '2024-03-20',
    },
    {
      id: 2,
      client: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      title: 'Gained Strength & Confidence',
      description: 'Built lean muscle and improved my overall health and confidence.',
      weightLost: 3,
      duration: '4 months',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      date: '2024-03-15',
    },
    {
      id: 3,
      client: 'David Brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      title: 'Complete Lifestyle Transformation',
      description: 'Changed my entire approach to fitness and nutrition, lost 8kg and gained energy.',
      weightLost: 8,
      duration: '5 months',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      date: '2024-03-10',
    },
  ];

  const certificates = [
    {
      id: 1,
      client: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      achievement: '5kg Weight Loss Milestone',
      date: '2024-03-20',
      status: 'issued',
    },
    {
      id: 2,
      client: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      achievement: '30 Day Streak Achievement',
      date: '2024-03-19',
      status: 'issued',
    },
    {
      id: 3,
      client: 'David Brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      achievement: 'Level 6 Achievement',
      date: '2024-03-18',
      status: 'pending',
    },
  ];

  const handleViewStory = (story) => {
    setSelectedStory(story);
    onOpen();
  };

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6} mb={8}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={2}>
            Motivational Features
          </Text>
          <Text color="gray.600" fontSize="sm" fontWeight="500">
            Success stories and transformation certificates to inspire your clients
          </Text>
        </Box>

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
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{successStories.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Success Stories</Text>
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
                  <Icon as={FiFileText} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{certificates.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Certificates</Text>
            </CardBody>
          </Card>

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
                  <Icon as={FiTrendingUp} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">16kg</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Weight Lost</Text>
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
                  <Icon as={FiStar} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">12</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Months Combined</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      <Tabs>
        <TabList>
          <Tab fontWeight="700">Success Stories</Tab>
          <Tab fontWeight="700">Certificates</Tab>
        </TabList>

        <TabPanels>
          {/* Success Stories */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {successStories.map((story) => (
                <motion.div key={story.id} whileHover={{ scale: 1.02, y: -4 }}>
                  <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)" overflow="hidden">
                    <Box position="relative" h="200px" overflow="hidden">
                      <Image src={story.image} alt={story.title} w="100%" h="100%" objectFit="cover" />
                      <Box
                        position="absolute"
                        bottom={3}
                        left={3}
                        right={3}
                        bg="rgba(0, 0, 0, 0.6)"
                        backdropFilter="blur(10px)"
                        borderRadius="lg"
                        px={3}
                        py={2}
                      >
                        <Badge
                          bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                          color="white"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                        >
                          -{story.weightLost}kg Lost
                        </Badge>
                      </Box>
                    </Box>
                    <CardBody p={5}>
                      <HStack spacing={3} mb={3}>
                        <Avatar size="sm" name={story.client} src={story.avatar} />
                        <Box flex={1}>
                          <Text fontWeight="800" color="gray.900">{story.client}</Text>
                          <Text fontSize="xs" color="gray.500">{story.date}</Text>
                        </Box>
                      </HStack>
                      <Text fontSize="lg" fontWeight="800" color="gray.900" mb={2}>
                        {story.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                        {story.description}
                      </Text>
                      <HStack justify="space-between" mb={4}>
                        <Text fontSize="xs" color="gray.500">Duration: {story.duration}</Text>
                        <Badge bg="#667eea" color="white" borderRadius="full" px={2.5} py={1} fontSize="xs" fontWeight="700">
                          Featured
                        </Badge>
                      </HStack>
                      <Button
                        leftIcon={<FiEye />}
                        w="full"
                        bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
                        borderRadius="xl"
                        fontWeight="700"
                        onClick={() => handleViewStory(story)}
                      >
                        View Full Story
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Certificates */}
          <TabPanel>
            <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontWeight="700" color="gray.700">Client</Th>
                      <Th fontWeight="700" color="gray.700">Achievement</Th>
                      <Th fontWeight="700" color="gray.700">Date</Th>
                      <Th fontWeight="700" color="gray.700">Status</Th>
                      <Th fontWeight="700" color="gray.700">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {certificates.map((cert) => (
                      <Tr key={cert.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name={cert.client} src={cert.avatar} />
                            <Text fontWeight="700" color="gray.900">{cert.client}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontWeight="600" color="gray.700">{cert.achievement}</Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.600">{cert.date}</Text>
                        </Td>
                        <Td>
                          <Badge
                            bg={cert.status === 'issued' ? '#10B981' : '#F59E0B'}
                            color="white"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="700"
                          >
                            {cert.status}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              leftIcon={<FiDownload />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              borderRadius="lg"
                            >
                              Download
                            </Button>
                            {cert.status === 'pending' && (
                              <Button
                                size="sm"
                                bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                                color="white"
                                _hover={{ bgGradient: 'linear(135deg, #059669 0%, #10B981 100%)' }}
                                borderRadius="lg"
                                fontWeight="700"
                              >
                                Issue
                              </Button>
                            )}
                          </HStack>
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

      {/* Story Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <Text fontSize="2xl" fontWeight="800">{selectedStory?.title}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedStory && (
              <VStack align="stretch" spacing={4}>
                <Box h="300px" borderRadius="xl" overflow="hidden">
                  <Image src={selectedStory.image} alt={selectedStory.title} w="100%" h="100%" objectFit="cover" />
                </Box>
                <HStack spacing={3}>
                  <Avatar size="md" name={selectedStory.client} src={selectedStory.avatar} />
                  <Box>
                    <Text fontWeight="800" color="gray.900">{selectedStory.client}</Text>
                    <Text fontSize="sm" color="gray.500">{selectedStory.date}</Text>
                  </Box>
                </HStack>
                <Text fontSize="md" color="gray.700" lineHeight="tall">
                  {selectedStory.description}
                </Text>
                <HStack spacing={4}>
                  <Badge bgGradient="linear(135deg, #10B981 0%, #059669 100%)" color="white" borderRadius="full" px={4} py={2} fontSize="sm" fontWeight="700">
                    Lost {selectedStory.weightLost}kg
                  </Badge>
                  <Badge bg="#667eea" color="white" borderRadius="full" px={4} py={2} fontSize="sm" fontWeight="700">
                    {selectedStory.duration}
                  </Badge>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Motivational;

