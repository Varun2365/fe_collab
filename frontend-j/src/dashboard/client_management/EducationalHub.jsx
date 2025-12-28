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
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Icon,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiBook,
  FiFileText,
  FiDownload,
  FiEye,
  FiTrendingUp,
  FiUsers,
  FiClock,
} from 'react-icons/fi';

const EducationalHub = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const recipes = [
    {
      id: 1,
      title: 'High Protein Chicken Bowl',
      category: 'Meal Prep',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      calories: 450,
      protein: 35,
      prepTime: '30 min',
      views: 150,
    },
    {
      id: 2,
      title: 'Green Smoothie Power',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
      calories: 250,
      protein: 15,
      prepTime: '10 min',
      views: 200,
    },
    {
      id: 3,
      title: 'Quinoa Salad Delight',
      category: 'Lunch',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      calories: 320,
      protein: 12,
      prepTime: '20 min',
      views: 180,
    },
  ];

  const guides = [
    {
      id: 1,
      title: 'Nutrition Fundamentals',
      category: 'Nutrition',
      type: 'PDF',
      pages: 24,
      downloads: 45,
      icon: FiFileText,
    },
    {
      id: 2,
      title: 'Workout Form Guide',
      category: 'Training',
      type: 'PDF',
      pages: 18,
      downloads: 38,
      icon: FiFileText,
    },
    {
      id: 3,
      title: 'Meal Planning Basics',
      category: 'Nutrition',
      type: 'PDF',
      pages: 15,
      downloads: 52,
      icon: FiFileText,
    },
  ];

  const resources = [
    {
      id: 1,
      title: 'Macro Calculator',
      category: 'Tools',
      description: 'Calculate your daily macronutrient needs',
      icon: FiTrendingUp,
    },
    {
      id: 2,
      title: 'BMI Calculator',
      category: 'Tools',
      description: 'Check your Body Mass Index',
      icon: FiTrendingUp,
    },
  ];

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6} mb={8}>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={2}>
            Educational Hub
          </Text>
          <Text color="gray.600" fontSize="sm" fontWeight="500">
            Recipes, nutrition guides, and educational resources for your clients
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
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
                  <Icon as={FiBook} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{recipes.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Recipes</Text>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
            <CardBody p={5}>
              <HStack justify="space-between" mb={3}>
                <Box
                  w="48px"
                  h="48px"
                  bgGradient="linear(135deg, #3B82F6 0%, #2563EB 100%)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiFileText} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{guides.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Guides</Text>
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
                  <Icon as={FiTrendingUp} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{resources.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Tools</Text>
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
                  <Icon as={FiUsers} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">135</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Downloads</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)" mb={6}>
        <CardBody p={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search recipes, guides, or resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="xl"
              border="2px solid"
              borderColor="gray.200"
              _focus={{ borderColor: '#667eea' }}
            />
          </InputGroup>
        </CardBody>
      </Card>

      <Tabs>
        <TabList>
          <Tab fontWeight="700">Recipes</Tab>
          <Tab fontWeight="700">Guides</Tab>
          <Tab fontWeight="700">Resources</Tab>
        </TabList>

        <TabPanels>
          {/* Recipes */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {recipes.map((recipe) => (
                <motion.div key={recipe.id} whileHover={{ scale: 1.02, y: -4 }}>
                  <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)" overflow="hidden">
                    <Box position="relative" h="200px" overflow="hidden">
                      <Image src={recipe.image} alt={recipe.title} w="100%" h="100%" objectFit="cover" />
                      <Box position="absolute" top={3} right={3}>
                        <Badge bg="rgba(0, 0, 0, 0.6)" color="white" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">
                          {recipe.calories} cal
                        </Badge>
                      </Box>
                    </Box>
                    <CardBody p={5}>
                      <Badge
                        bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                        color="white"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="700"
                        mb={3}
                      >
                        {recipe.category}
                      </Badge>
                      <Text fontSize="lg" fontWeight="800" color="gray.900" mb={3}>
                        {recipe.title}
                      </Text>
                      <HStack justify="space-between" mb={4}>
                        <HStack>
                          <Icon as={FiClock} color="gray.500" boxSize={4} />
                          <Text fontSize="xs" color="gray.600">{recipe.prepTime}</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.600" fontWeight="600">{recipe.protein}g protein</Text>
                      </HStack>
                      <Button
                        leftIcon={<FiEye />}
                        w="full"
                        bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
                        borderRadius="xl"
                        fontWeight="700"
                      >
                        View Recipe
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Guides */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {guides.map((guide) => (
                <motion.div key={guide.id} whileHover={{ scale: 1.02, y: -4 }}>
                  <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
                    <CardBody p={6}>
                      <Box
                        w="64px"
                        h="64px"
                        bgGradient="linear(135deg, #3B82F6 0%, #2563EB 100%)"
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb={4}
                      >
                        <Icon as={guide.icon} boxSize={8} color="white" />
                      </Box>
                      <Badge
                        bg="#3B82F6"
                        color="white"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="700"
                        mb={3}
                      >
                        {guide.category}
                      </Badge>
                      <Text fontSize="lg" fontWeight="800" color="gray.900" mb={3}>
                        {guide.title}
                      </Text>
                      <HStack justify="space-between" mb={4}>
                        <Text fontSize="sm" color="gray.600">{guide.pages} pages</Text>
                        <Text fontSize="sm" color="gray.600">{guide.downloads} downloads</Text>
                      </HStack>
                      <Button
                        leftIcon={<FiDownload />}
                        w="full"
                        bgGradient="linear(135deg, #3B82F6 0%, #2563EB 100%)"
                        color="white"
                        _hover={{ bgGradient: 'linear(135deg, #2563EB 0%, #3B82F6 100%)' }}
                        borderRadius="xl"
                        fontWeight="700"
                      >
                        Download PDF
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Resources */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {resources.map((resource) => (
                <motion.div key={resource.id} whileHover={{ scale: 1.02, y: -4 }}>
                  <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)">
                    <CardBody p={6}>
                      <HStack spacing={4}>
                        <Box
                          w="64px"
                          h="64px"
                          bgGradient="linear(135deg, #F59E0B 0%, #D97706 100%)"
                          borderRadius="xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={resource.icon} boxSize={8} color="white" />
                        </Box>
                        <Box flex={1}>
                          <Badge
                            bg="#F59E0B"
                            color="white"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="700"
                            mb={2}
                          >
                            {resource.category}
                          </Badge>
                          <Text fontSize="lg" fontWeight="800" color="gray.900" mb={1}>
                            {resource.title}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {resource.description}
                          </Text>
                        </Box>
                        <Button
                          bgGradient="linear(135deg, #F59E0B 0%, #D97706 100%)"
                          color="white"
                          _hover={{ bgGradient: 'linear(135deg, #D97706 0%, #F59E0B 100%)' }}
                          borderRadius="xl"
                          fontWeight="700"
                        >
                          Use Tool
                        </Button>
                      </HStack>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EducationalHub;

