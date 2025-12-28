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
  Progress,
  Button,
  useColorModeValue,
  Icon,
  Avatar,
} from '@chakra-ui/react';
import {
  MdGroups,
  MdEmojiEvents,
  MdShare,
  MdPeople,
} from 'react-icons/md';

const Community = () => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');

  const programs = [
    { id: 1, name: '21-Day Transformation', participants: 245, progress: 65, daysLeft: 8, description: 'Complete transformation challenge' },
    { id: 2, name: '10-Day Marathon Sprint', participants: 189, progress: 40, daysLeft: 4, description: 'Intensive 10-day challenge' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah M.', xp: 5420, avatar: null, isCurrentUser: false },
    { rank: 2, name: 'Mike T.', xp: 4890, avatar: null, isCurrentUser: false },
    { rank: 3, name: 'You', xp: 2450, avatar: null, isCurrentUser: true },
    { rank: 4, name: 'Emma L.', xp: 2100, avatar: null, isCurrentUser: false },
    { rank: 5, name: 'John D.', xp: 1980, avatar: null, isCurrentUser: false },
  ];

  const referralData = {
    referrals: 3,
    bonusXP: 1500,
    bonusMonths: 3,
    code: 'FITHUB2024',
  };

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="3xl" fontWeight="black" color="gray.800" mb={1}>
          Community & Social Programs
        </Text>
        <Text color="gray.600" fontSize="lg">
          Join challenges, compete on leaderboards, and earn referral bonuses
        </Text>
      </Box>

      {/* Community Programs */}
      <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)" mb={6}>
        <CardBody p={6}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Active Programs
            </Text>
            <Badge colorScheme="purple" borderRadius="full">Join Now</Badge>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {programs.map((program) => (
              <Box key={program.id} p={4} bg="gray.50" borderRadius="xl">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="bold">{program.name}</Text>
                  <Badge colorScheme="purple" borderRadius="full">{program.participants} participants</Badge>
                </HStack>
                <Text fontSize="xs" color="gray.600" mb={3}>{program.description}</Text>
                <Progress value={program.progress} colorScheme="purple" size="sm" borderRadius="full" mb={2} />
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="xs" color="gray.500">{program.progress}% Complete</Text>
                  <Text fontSize="xs" color="gray.500">{program.daysLeft} days left</Text>
                </HStack>
                <Button size="sm" colorScheme="purple" w="full" borderRadius="xl">Join Program</Button>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mb={6}>
        {/* Community Leaderboard */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Community Leaderboard
              </Text>
              <Badge colorScheme="yellow" borderRadius="full" px={2}>
                <Icon as={MdEmojiEvents} mr={1} /> Top Performers
              </Badge>
            </HStack>
            <VStack spacing={2} align="stretch">
              {leaderboard.map((user) => (
                <HStack 
                  key={user.rank} 
                  p={3} 
                  bg={user.isCurrentUser ? 'brand.50' : 'gray.50'} 
                  borderRadius="lg"
                  border={user.isCurrentUser ? '2px solid' : 'none'}
                  borderColor={user.isCurrentUser ? 'brand.400' : 'transparent'}
                >
                  <Text fontSize="lg" fontWeight="bold" color={user.rank <= 3 ? 'yellow.500' : 'gray.400'} w="30px">
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                  </Text>
                  <Avatar size="sm" name={user.name} />
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="bold">{user.name} {user.isCurrentUser && '(You)'}</Text>
                  </Box>
                  <Badge colorScheme="green" borderRadius="full">{user.xp} XP</Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Referral System */}
        <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
          <CardBody p={6}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Referral Bonus System
              </Text>
              <Badge colorScheme="green" borderRadius="full" px={2}>{referralData.referrals} Referrals</Badge>
            </HStack>
            <VStack spacing={4} align="stretch">
              <Box p={4} bg="linear-gradient(135deg, #48BB78, #38A169)" borderRadius="xl" color="white">
                <Text fontSize="xs" mb={1} opacity={0.9}>Your Referrals</Text>
                <Text fontSize="3xl" fontWeight="black">{referralData.referrals}</Text>
                <Text fontSize="xs" mt={2} opacity={0.9}>Active members</Text>
              </Box>
              <Box p={4} bg="linear-gradient(135deg, #ED8936, #DD6B20)" borderRadius="xl" color="white">
                <Text fontSize="xs" mb={1} opacity={0.9}>Bonus Earned</Text>
                <Text fontSize="2xl" fontWeight="black">{referralData.bonusXP} XP</Text>
                <Text fontSize="xs" mt={2} opacity={0.9}>+ {referralData.bonusMonths} months free</Text>
              </Box>
              <Box p={4} bg="linear-gradient(135deg, #4299E1, #3182CE)" borderRadius="xl" color="white">
                <Text fontSize="xs" mb={1} opacity={0.9}>Referral Code</Text>
                <Text fontSize="lg" fontWeight="bold" fontFamily="mono" mb={2}>{referralData.code}</Text>
                <Button size="xs" bg="rgba(255,255,255,0.3)" color="white" _hover={{ bg: 'rgba(255,255,255,0.4)' }} w="full">
                  Copy Code
                </Button>
              </Box>
              <Button leftIcon={<MdShare />} colorScheme="blue" borderRadius="xl">Share & Earn More</Button>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Progress Sharing */}
      <Card bg={cardBg} backdropFilter="blur(20px)" borderRadius="2xl" border="1px solid rgba(255, 255, 255, 0.2)">
        <CardBody p={6}>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Share Your Progress
            </Text>
            <Icon as={MdShare} boxSize={6} color="blue.500" />
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[
              { platform: 'Instagram', icon: '📷', color: 'pink' },
              { platform: 'Facebook', icon: '👥', color: 'blue' },
              { platform: 'WhatsApp', icon: '💬', color: 'green' },
            ].map((platform, idx) => (
              <Button key={idx} leftIcon={<Text>{platform.icon}</Text>} colorScheme={platform.color} size="lg" borderRadius="xl" h="60px">
                Share on {platform.platform}
              </Button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Community;

