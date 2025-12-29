import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import {
  Box,
  Text,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  WarningIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { CloseIcon } from '@chakra-ui/icons';

/**
 * Custom toast hook with consistent styling across the app
 * All toasts will have:
 * - Fixed width: 400px
 * - Fixed height: auto (but consistent padding)
 * - Position: top-right
 * - Same styling as calendar section
 */
export const useCustomToast = () => {
  const toast = useToast();

  return useCallback((message, status = 'info', options = {}) => {
    const statusConfig = {
      success: {
        title: options.title || 'Success',
        bg: 'white',
        borderColor: 'green.200',
        iconColor: 'green.500',
        titleColor: 'green.700',
        textColor: 'gray.700',
        icon: CheckCircleIcon
      },
      error: {
        title: options.title || 'Error',
        bg: 'white',
        borderColor: 'red.200',
        iconColor: 'red.500',
        titleColor: 'red.700',
        textColor: 'gray.700',
        icon: WarningIcon
      },
      warning: {
        title: options.title || 'Warning',
        bg: 'white',
        borderColor: 'orange.200',
        iconColor: 'orange.500',
        titleColor: 'orange.700',
        textColor: 'gray.700',
        icon: WarningIcon
      },
      info: {
        title: options.title || 'Info',
        bg: 'white',
        borderColor: 'blue.200',
        iconColor: 'blue.500',
        titleColor: 'blue.700',
        textColor: 'gray.700',
        icon: InfoIcon
      }
    };

    const config = statusConfig[status] || statusConfig.info;
    const IconComponent = config.icon;

    toast({
      title: config.title,
      description: message,
      status,
      duration: options.duration || 4000,
      isClosable: true,
      position: 'top-right',
      variant: 'subtle',
      containerStyle: {
        maxWidth: '400px',
      },
      render: ({ title, description, onClose }) => (
        <Box
          bg={config.bg}
          border="1px solid"
          borderColor={config.borderColor}
          borderRadius="7px"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          p={4}
          display="flex"
          alignItems="flex-start"
          gap={3}
          minW="400px"
          maxW="400px"
          w="400px"
          minH="80px"
          h="auto"
        >
          <Box
            as={IconComponent}
            color={config.iconColor}
            boxSize={5}
            mt={0.5}
            flexShrink={0}
          />
          <VStack align="start" spacing={1} flex={1} minH="48px">
            <Text
              fontSize="sm"
              fontWeight="600"
              color={config.titleColor}
            >
              {title}
            </Text>
            <Text
              fontSize="sm"
              color={config.textColor}
              lineHeight="1.5"
              wordBreak="break-word"
            >
              {description}
            </Text>
          </VStack>
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            size="xs"
            variant="ghost"
            onClick={onClose}
            color="gray.400"
            _hover={{ color: 'gray.600', bg: 'gray.50' }}
            borderRadius="7px"
            flexShrink={0}
          />
        </Box>
      ),
    });
  }, [toast]);
};

