import React, { useState, useEffect } from 'react';
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiPlay,
  FiUsers,
  FiBook,
  FiVideo,
  FiTrendingUp,
  FiClock,
  FiEye,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiX,
} from 'react-icons/fi';

const CoachingDeliverySystem = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    category: 'Fat Loss',
    description: '',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  });
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    duration: '',
    videoUrl: '',
    courseId: null,
  });

  // Load data from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem('fitnessCourses');
    const savedVideos = localStorage.getItem('fitnessVideos');
    
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      const initialCourses = [
        {
          id: 1,
          title: 'Fat Loss Mastery Program',
          category: 'Fat Loss',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
          totalVideos: 3,
          totalDuration: '1 hour',
          enrolledClients: 15,
          completionRate: 78,
          difficulty: 'Beginner',
          description: 'Complete guide to sustainable fat loss with nutrition and exercise.',
        },
        {
          id: 2,
          title: 'Muscle Gain Transformation',
          category: 'Muscle Gain',
          thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
          totalVideos: 2,
          totalDuration: '45 min',
          enrolledClients: 12,
          completionRate: 65,
          difficulty: 'Intermediate',
          description: 'Build lean muscle mass with proven training and nutrition strategies.',
        },
      ];
      setCourses(initialCourses);
      localStorage.setItem('fitnessCourses', JSON.stringify(initialCourses));
    }

    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    } else {
      const initialVideos = [
        { id: 1, courseId: 1, title: 'Introduction to Fat Loss', duration: '15:30', videoUrl: '', views: 150 },
        { id: 2, courseId: 1, title: 'Nutrition Fundamentals', duration: '22:45', videoUrl: '', views: 145 },
        { id: 3, courseId: 1, title: 'HIIT Workout Session', duration: '30:00', videoUrl: '', views: 138 },
        { id: 4, courseId: 2, title: 'Muscle Building Basics', duration: '25:20', videoUrl: '', views: 120 },
        { id: 5, courseId: 2, title: 'Progressive Overload', duration: '20:00', videoUrl: '', views: 110 },
      ];
      setVideos(initialVideos);
      localStorage.setItem('fitnessVideos', JSON.stringify(initialVideos));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('fitnessCourses', JSON.stringify(courses));
    }
  }, [courses]);

  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('fitnessVideos', JSON.stringify(videos));
    }
  }, [videos]);

  const calculateTotalDuration = (courseVideos) => {
    if (!courseVideos || courseVideos.length === 0) return '0 min';
    const totalMinutes = courseVideos.reduce((sum, video) => {
      const [minutes, seconds] = video.duration.split(':').map(Number);
      return sum + minutes + (seconds / 60);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const handleAddCourse = () => {
    setCourseFormData({
      title: '',
      category: 'Fat Loss',
      description: '',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    });
    setSelectedCourse(null);
    onOpen();
  };

  const handleEditCourse = (course) => {
    setCourseFormData({
      title: course.title,
      category: course.category,
      description: course.description,
      difficulty: course.difficulty,
      thumbnail: course.thumbnail,
    });
    setSelectedCourse(course);
    onEditOpen();
  };

  const handleSaveCourse = () => {
    if (!courseFormData.title || !courseFormData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const courseVideos = videos.filter(v => v.courseId === selectedCourse?.id);
    const totalDuration = calculateTotalDuration(courseVideos);

    if (selectedCourse) {
      // Update existing course
      const updatedCourses = courses.map(course => {
        if (course.id === selectedCourse.id) {
          const updatedVideos = videos.filter(v => v.courseId === course.id);
          return {
            ...course,
            ...courseFormData,
            totalVideos: updatedVideos.length,
            totalDuration,
          };
        }
        return course;
      });
      setCourses(updatedCourses);
      toast({
        title: 'Course Updated',
        description: `${courseFormData.title} has been updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
    } else {
      // Add new course
      const newCourse = {
        id: Date.now(),
        ...courseFormData,
        totalVideos: 0,
        totalDuration: '0 min',
        enrolledClients: 0,
        completionRate: 0,
      };
      setCourses([...courses, newCourse]);
      toast({
        title: 'Course Created',
        description: `${courseFormData.title} has been created successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
    setCourseFormData({
      title: '',
      category: 'Fat Loss',
      description: '',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    });
  };

  const handleDeleteCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (window.confirm(`Are you sure you want to delete "${course?.title}"? This will also delete all videos in this course.`)) {
      setCourses(courses.filter(c => c.id !== courseId));
      setVideos(videos.filter(v => v.courseId !== courseId));
      toast({
        title: 'Course Deleted',
        description: `${course?.title} has been deleted`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddVideo = (courseId) => {
    setVideoFormData({
      title: '',
      duration: '',
      videoUrl: '',
      courseId: courseId,
    });
    setSelectedVideo(null);
    onVideoOpen();
  };

  const handleEditVideo = (video) => {
    setVideoFormData({
      title: video.title,
      duration: video.duration,
      videoUrl: video.videoUrl || '',
      courseId: video.courseId,
    });
    setSelectedVideo(video);
    onVideoOpen();
  };

  const handleSaveVideo = () => {
    if (!videoFormData.title || !videoFormData.duration) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate duration format (MM:SS or HH:MM:SS)
    const durationRegex = /^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/;
    if (!durationRegex.test(videoFormData.duration)) {
      toast({
        title: 'Invalid Duration',
        description: 'Please use format MM:SS or HH:MM:SS',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedVideo) {
      // Update existing video
      const updatedVideos = videos.map(video => {
        if (video.id === selectedVideo.id) {
          return {
            ...video,
            ...videoFormData,
          };
        }
        return video;
      });
      setVideos(updatedVideos);
      
      // Update course total duration
      const course = courses.find(c => c.id === videoFormData.courseId);
      if (course) {
        const courseVideos = updatedVideos.filter(v => v.courseId === course.id);
        const totalDuration = calculateTotalDuration(courseVideos);
        setCourses(courses.map(c => 
          c.id === course.id 
            ? { ...c, totalVideos: courseVideos.length, totalDuration }
            : c
        ));
      }
      
      toast({
        title: 'Video Updated',
        description: `${videoFormData.title} has been updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Add new video
      const newVideo = {
        id: Date.now(),
        ...videoFormData,
        views: 0,
      };
      setVideos([...videos, newVideo]);
      
      // Update course total videos and duration
      const course = courses.find(c => c.id === videoFormData.courseId);
      if (course) {
        const courseVideos = [...videos, newVideo].filter(v => v.courseId === course.id);
        const totalDuration = calculateTotalDuration(courseVideos);
        setCourses(courses.map(c => 
          c.id === course.id 
            ? { ...c, totalVideos: courseVideos.length, totalDuration }
            : c
        ));
      }
      
      toast({
        title: 'Video Added',
        description: `${videoFormData.title} has been added successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onVideoClose();
    setVideoFormData({
      title: '',
      duration: '',
      videoUrl: '',
      courseId: null,
    });
  };

  const handleDeleteVideo = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (window.confirm(`Are you sure you want to delete "${video?.title}"?`)) {
      const course = courses.find(c => c.id === video.courseId);
      setVideos(videos.filter(v => v.id !== videoId));
      
      // Update course total videos and duration
      if (course) {
        const courseVideos = videos.filter(v => v.courseId === course.id && v.id !== videoId);
        const totalDuration = calculateTotalDuration(courseVideos);
        setCourses(courses.map(c => 
          c.id === course.id 
            ? { ...c, totalVideos: courseVideos.length, totalDuration }
            : c
        ));
      }
      
      toast({
        title: 'Video Deleted',
        description: `${video?.title} has been deleted`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    onDetailOpen();
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const courseVideos = selectedCourse ? videos.filter(v => v.courseId === selectedCourse.id) : [];
  const totalVideos = videos.length;
  const avgCompletion = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.completionRate, 0) / courses.length)
    : 0;

  return (
    <Box p={6}>
      {/* Header */}
      <VStack align="stretch" spacing={6} mb={8}>
        <HStack justify="space-between">
          <Box>
            <Text fontSize="2xl" fontWeight="800" color="gray.900" mb={2}>
              Coaching Delivery System
            </Text>
            <Text color="gray.600" fontSize="sm" fontWeight="500">
              Manage courses, videos, and track client learning progress
            </Text>
          </Box>
          <Button
            leftIcon={<FiVideo />}
            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
            borderRadius="xl"
            fontWeight="700"
            onClick={handleAddCourse}
          >
            Create New Course
          </Button>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
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
                  <Icon as={FiBook} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{courses.length}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Courses</Text>
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
                  <Icon as={FiVideo} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{totalVideos}</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Total Videos</Text>
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
                  <Icon as={FiUsers} boxSize={6} color="white" />
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="800" color="gray.900">
                {courses.reduce((sum, c) => sum + c.enrolledClients, 0)}
              </Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Active Learners</Text>
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
              <Text fontSize="2xl" fontWeight="800" color="gray.900">{avgCompletion}%</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="600">Avg Completion</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>

      {/* Search */}
      <Card bg="white" borderRadius="xl" boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)" mb={6}>
        <CardBody p={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search courses..."
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

      {/* Courses Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        {filteredCourses.length === 0 ? (
          <Box gridColumn="1 / -1" textAlign="center" py={8}>
            <Text color="gray.500" fontSize="lg">No courses found. Create your first course!</Text>
          </Box>
        ) : (
          filteredCourses.map((course) => (
            <motion.div key={course.id} whileHover={{ scale: 1.02, y: -4 }}>
              <Card
                bg="white"
                borderRadius="xl"
                boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
                overflow="hidden"
                position="relative"
              >
                <Box position="relative" h="200px" overflow="hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                  <Box
                    position="absolute"
                    top={3}
                    right={3}
                    bg="rgba(0, 0, 0, 0.6)"
                    backdropFilter="blur(10px)"
                    borderRadius="lg"
                    px={3}
                    py={1}
                  >
                    <Badge color="white" fontSize="xs" fontWeight="700">
                      {course.difficulty}
                    </Badge>
                  </Box>
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
                    <HStack justify="space-between">
                      <HStack spacing={2}>
                        <Icon as={FiVideo} color="white" boxSize={4} />
                        <Text color="white" fontSize="xs" fontWeight="600">{course.totalVideos} videos</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon as={FiClock} color="white" boxSize={4} />
                        <Text color="white" fontSize="xs" fontWeight="600">{course.totalDuration}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                  <Menu>
                    <MenuButton
                      as={Button}
                      position="absolute"
                      top={3}
                      left={3}
                      size="sm"
                      variant="ghost"
                      bg="rgba(0, 0, 0, 0.6)"
                      color="white"
                      _hover={{ bg: 'rgba(0, 0, 0, 0.8)' }}
                      borderRadius="lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon as={FiMoreVertical} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<FiEdit2 />} onClick={(e) => {
                        e.stopPropagation();
                        handleEditCourse(course);
                      }}>
                        Edit Course
                      </MenuItem>
                      <MenuItem icon={<FiVideo />} onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                        handleAddVideo(course.id);
                      }}>
                        Add Video
                      </MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }}>
                        Delete Course
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
                <CardBody p={5}>
                  <Badge
                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="700"
                    mb={3}
                  >
                    {course.category}
                  </Badge>
                  <Text fontSize="lg" fontWeight="800" color="gray.900" mb={2}>
                    {course.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                    {course.description}
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.500" fontWeight="600">
                        {course.enrolledClients} enrolled
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="600">
                        {course.completionRate}% completion
                      </Text>
                    </HStack>
                    <Progress
                      value={course.completionRate}
                      colorScheme="green"
                      size="sm"
                      borderRadius="full"
                    />
                  </VStack>
                  <Button
                    w="full"
                    mt={4}
                    leftIcon={<FiEye />}
                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
                    borderRadius="xl"
                    fontWeight="700"
                    onClick={() => handleViewCourse(course)}
                  >
                    View Details
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </SimpleGrid>

      {/* Add/Edit Course Modal */}
      <Modal isOpen={isOpen || isEditOpen} onClose={selectedCourse ? onEditClose : onClose} size="2xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            {selectedCourse ? 'Edit Course' : 'Create New Course'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Course Title</FormLabel>
                <Input
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  placeholder="Enter course title"
                  borderRadius="lg"
                />
              </FormControl>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    borderRadius="lg"
                  >
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Women's Health">Women's Health</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Training">Training</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    value={courseFormData.difficulty}
                    onChange={(e) => setCourseFormData({ ...courseFormData, difficulty: e.target.value })}
                    borderRadius="lg"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={4}
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Thumbnail URL</FormLabel>
                <Input
                  value={courseFormData.thumbnail}
                  onChange={(e) => setCourseFormData({ ...courseFormData, thumbnail: e.target.value })}
                  placeholder="Enter thumbnail image URL"
                  borderRadius="lg"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={selectedCourse ? onEditClose : onClose}>
              Cancel
            </Button>
            <Button
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
              onClick={handleSaveCourse}
              borderRadius="xl"
            >
              {selectedCourse ? 'Update' : 'Create'} Course
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Video Modal */}
      <Modal isOpen={isVideoOpen} onClose={onVideoClose} size="xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            {selectedVideo ? 'Edit Video' : 'Add New Video'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Video Title</FormLabel>
                <Input
                  value={videoFormData.title}
                  onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                  placeholder="Enter video title"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Duration (MM:SS or HH:MM:SS)</FormLabel>
                <Input
                  value={videoFormData.duration}
                  onChange={(e) => setVideoFormData({ ...videoFormData, duration: e.target.value })}
                  placeholder="e.g., 15:30 or 1:15:30"
                  borderRadius="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Video URL (Optional)</FormLabel>
                <Input
                  value={videoFormData.videoUrl}
                  onChange={(e) => setVideoFormData({ ...videoFormData, videoUrl: e.target.value })}
                  placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                  borderRadius="lg"
                />
              </FormControl>
              {!selectedVideo && (
                <FormControl isRequired>
                  <FormLabel>Course</FormLabel>
                  <Select
                    value={videoFormData.courseId || ''}
                    onChange={(e) => setVideoFormData({ ...videoFormData, courseId: parseInt(e.target.value) })}
                    borderRadius="lg"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onVideoClose}>
              Cancel
            </Button>
            <Button
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              _hover={{ bgGradient: 'linear(135deg, #764ba2 0%, #667eea 100%)' }}
              onClick={handleSaveVideo}
              borderRadius="xl"
            >
              {selectedVideo ? 'Update' : 'Add'} Video
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Course Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="4xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack justify="space-between">
              <Text fontSize="2xl" fontWeight="800">{selectedCourse?.title}</Text>
              <Button
                leftIcon={<FiPlus />}
                size="sm"
                bgGradient="linear(135deg, #10B981 0%, #059669 100%)"
                color="white"
                _hover={{ bgGradient: 'linear(135deg, #059669 0%, #10B981 100%)' }}
                onClick={() => handleAddVideo(selectedCourse?.id)}
              >
                Add Video
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedCourse && (
              <Tabs>
                <TabList>
                  <Tab fontWeight="700">Overview</Tab>
                  <Tab fontWeight="700">Videos ({courseVideos.length})</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack align="stretch" spacing={4} mt={4}>
                      <Text fontWeight="700" color="gray.900">{selectedCourse.description}</Text>
                      <SimpleGrid columns={2} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Total Videos</Text>
                          <Text fontSize="xl" fontWeight="800">{selectedCourse.totalVideos}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Total Duration</Text>
                          <Text fontSize="xl" fontWeight="800">{selectedCourse.totalDuration}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Enrolled Clients</Text>
                          <Text fontSize="xl" fontWeight="800">{selectedCourse.enrolledClients}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Completion Rate</Text>
                          <Text fontSize="xl" fontWeight="800">{selectedCourse.completionRate}%</Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack align="stretch" spacing={3} mt={4}>
                      {courseVideos.length === 0 ? (
                        <Box textAlign="center" py={8}>
                          <Text color="gray.500">No videos in this course. Add your first video!</Text>
                        </Box>
                      ) : (
                        courseVideos.map((video) => (
                          <Card key={video.id} bg="gray.50" borderRadius="lg">
                            <CardBody p={4}>
                              <HStack justify="space-between">
                                <HStack spacing={3} flex={1}>
                                  <Box
                                    w="40px"
                                    h="40px"
                                    bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                                    borderRadius="lg"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Icon as={FiPlay} color="white" boxSize={5} />
                                  </Box>
                                  <Box flex={1}>
                                    <Text fontWeight="700" color="gray.900">{video.title}</Text>
                                    <Text fontSize="xs" color="gray.500">{video.duration} • {video.views} views</Text>
                                  </Box>
                                </HStack>
                                <HStack spacing={2}>
                                  <Button
                                    size="sm"
                                    leftIcon={<FiEdit2 />}
                                    variant="ghost"
                                    onClick={() => handleEditVideo(video)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    leftIcon={<FiTrash2 />}
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => handleDeleteVideo(video.id)}
                                  >
                                    Delete
                                  </Button>
                                </HStack>
                              </HStack>
                            </CardBody>
                          </Card>
                        ))
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CoachingDeliverySystem;
