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
  Button,
  useColorModeValue,
  Icon,
  Avatar,
} from '@chakra-ui/react';
import {
  MdEmojiEvents,
  MdShare,
  MdDownload,
  MdStar,
} from 'react-icons/md';
import { IconButton } from '@chakra-ui/react';
import { FiAward } from 'react-icons/fi';

const Motivation = () => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  const successStories = [
    { id: 1, name: 'Sarah M.', result: 'Lost 15kg in 3 months', image: null, verified: true, story: 'Amazing transformation journey!' },
    { id: 2, name: 'Mike T.', result: 'Gained 8kg muscle', image: null, verified: true, story: 'Built strength and confidence' },
    { id: 3, name: 'Emma L.', result: 'Transformed lifestyle', image: null, verified: true, story: 'Complete lifestyle change' },
    { id: 4, name: 'John D.', result: 'Lost 10kg, gained energy', image: null, verified: true, story: 'Feeling better than ever' },
  ];

  const certificates = [
    { id: 1, title: 'First Milestone', date: '2024-03-15', achievement: 'Lost 4kg • 12 Day Streak', earned: true },
    { id: 2, title: 'Perfect Week', date: null, achievement: 'Complete 7 days perfectly', earned: false },
    { id: 3, title: 'Transformation Champion', date: null, achievement: 'Reach your goal weight', earned: false },
  ];

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="3xl" fontWeight="black" color="gray.800" mb={1}>
          Motivational Features
        </Text>
        <Text color="gray.600" fontSize="lg">
          Success stories and transformation certificates
        </Text>
      </Box>

      {/* Success Stories */}
      <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)" mb={6}>
        <CardBody p={6}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Success Stories
            </Text>
            <Button size="sm" variant="ghost" leftIcon={<MdShare />}>Share Your Story</Button>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {successStories.map((story) => (
              <Box key={story.id} p={4} bg="gray.50" borderRadius="xl">
                <HStack mb={3}>
                  <Avatar size="md" name={story.name} />
                  <Box flex={1}>
                    <HStack>
                      <Text fontSize="sm" fontWeight="bold">{story.name}</Text>
                      {story.verified && (
                        <Icon as={MdStar} color="yellow.400" boxSize={4} />
                      )}
                    </HStack>
                    <Text fontSize="xs" color="gray.600">{story.result}</Text>
                  </Box>
                  <IconButton icon={<MdShare />} size="sm" variant="ghost" aria-label="Share" />
                </HStack>
                <Text fontSize="xs" color="gray.700" mb={2}>{story.story}</Text>
                {story.verified && (
                  <Badge colorScheme="green" borderRadius="full" fontSize="xs">Verified Transformation</Badge>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Transformation Certificates */}
      <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
        <CardBody p={6}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Transformation Certificates
            </Text>
            <Badge colorScheme="gold" borderRadius="full">Earned: {certificates.filter(c => c.earned).length}</Badge>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {certificates.map((cert) => (
              <Box key={cert.id} p={6} bg={cert.earned ? 'linear-gradient(135deg, #F6E05E, #D69E2E)' : 'gray.100'} borderRadius="xl" textAlign="center" color={cert.earned ? 'gray.800' : 'gray.500'} minH="200px" display="flex" flexDirection="column" justifyContent="center">
                <Icon as={MdEmojiEvents} boxSize={12} mb={3} />
                <Text fontSize="lg" fontWeight="bold" mb={2}>{cert.title}</Text>
                <Text fontSize="xs" mb={4} opacity={0.8}>{cert.achievement}</Text>
                {cert.earned ? (
                  <>
                    <Text fontSize="xs" mb={4} opacity={0.7}>{cert.date}</Text>
                    <HStack justify="center" spacing={2}>
                      <Button size="sm" bg="white" color="gray.800" borderRadius="xl" leftIcon={<MdDownload />}>Download</Button>
                      <Button size="sm" bg="white" color="gray.800" borderRadius="xl" leftIcon={<MdShare />}>Share</Button>
                    </HStack>
                  </>
                ) : (
                  <Badge colorScheme="gray" borderRadius="full" fontSize="xs">Locked</Badge>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Motivation;

