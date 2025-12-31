import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, testAction } from '../redux/authSlice';
import { fetchUserPermissions } from '../utils/fetchUserPermissions';
import swal from 'sweetalert';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
  HStack,
  Text,
  Heading,
  Flex,
  Checkbox,
  PinInput,
  PinInputField,
  useToast,
  Card,
  CardBody,
  Icon,
  Spinner,
  Stack,
  Center,
  ScaleFade,
  SlideFade,
  IconButton,
  Image,
} from '@chakra-ui/react';
import {
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaUserShield,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import loginHeroJpg from '../login.jpg';


import { API_BASE_URL as BASE_API_URL } from '../config/apiConfig';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle OTP request for unverified users
  const handleRequestOTP = async (email) => {
    setIsLoading(true);
    try {
      console.log('📧 Requesting OTP for email:', email);
      
      const response = await fetch(`${BASE_API_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('📧 OTP Response status:', response.status);
      
      // Handle non-JSON error responses
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.error('📧 Non-JSON response:', textResponse);
        data = { 
          success: false, 
          message: 'Server returned an invalid response. Please contact support.' 
        };
      }

      console.log('📧 OTP Response data:', data);

      if (response.ok && data.success) {
        toast({
          title: 'OTP Sent Successfully',
          description: 'Verification code has been sent to your email address.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        setShowOtpForm(true);
        setOtp('');
      } else {
        // Handle specific error cases
        let errorMessage = data.message || 'Failed to send OTP. Please try again.';
        
        if (response.status === 500) {
          errorMessage = 'Server error occurred. Please try again later or contact support.';
          console.error('📧 500 Error details:', data);
        } else if (response.status === 404) {
          errorMessage = 'User account not found. Please check your email address.';
        } else if (response.status === 403) {
          errorMessage = 'Access denied. This account may already be verified.';
        }
        
        toast({
          title: 'Error Sending OTP',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        
        console.error('📧 OTP Error:', {
          status: response.status,
          message: errorMessage,
          data: data
        });
      }
    } catch (error) {
      console.error('📧 OTP resend error:', error);
      toast({
        title: 'Connection Error',
        description: 'Network connection failed. Please check your connection and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle the final OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the complete 6-digit verification code.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input.email, otp: otp })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Email Verified Successfully',
          description: 'Redirecting to your dashboard...',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        const { user, token } = data;

        if (user.role === 'staff') {
          // Staff login - data goes to coach's redux (authSlice.jsx) same as coach
          console.log('🔐 Staff login - Dispatching loginSuccess with:', { user, token });
          console.log('🔐 Staff role:', user.role);
          console.log('🔐 Staff data:', user);
          console.log('🔐 Token:', token);
          
          // Staff ko bhi coach ke redux mein store karo
          dispatch(loginSuccess({ user, token }));
          
          // Fetch permissions if not present (for staff)
          if (user.role === 'staff' && (!user.permissions || user.permissions.length === 0)) {
            setTimeout(() => fetchUserPermissions(), 500);
          }
          
          // Staff ko coach ke dashboard pe redirect karo
          navigate('/dashboard');
        } else {
          // Coach/Admin login - data goes to redux/authSlice.jsx
          console.log('🔐 Coach/Admin login - Dispatching loginSuccess with:', { user, token });
          console.log('🔐 User role:', user.role);
          console.log('🔐 User data:', user);
          console.log('🔐 Token:', token);
          
          dispatch(loginSuccess({ user, token }));
          
          // Fetch permissions if not present (for staff)
          if (user.role === 'staff' && (!user.permissions || user.permissions.length === 0)) {
            setTimeout(() => fetchUserPermissions(), 500);
          }
          
          navigate('/dashboard');
        }
      } else {
        toast({
          title: 'Verification Failed',
          description: data.message || 'Invalid OTP. Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to verify OTP. Please check your connection.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please enter both email address and password.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Attempting login for:', input.email);
      
      const response = await fetch(`${BASE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
        }),
      });

      console.log('🔐 Login response status:', response.status);
      
      // Handle non-JSON error responses
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.error('🔐 Non-JSON response:', textResponse);
        
        // If it's a 403 error without JSON, handle specially
        if (response.status === 403) {
          data = { 
            success: false, 
            message: 'Email verification required. Please verify your email to continue.' 
          };
        } else {
          data = { 
            success: false, 
            message: 'Server returned an invalid response. Please try again later.' 
          };
        }
      }

      console.log('🔐 Login response data:', data);

      if (response.ok && data.success) {
        const { user, token } = data;

        if (!user.isVerified) {
          const result = await swal({
            title: 'Email Verification Required',
            text: 'Your email address needs to be verified. Would you like us to send a verification code?',
            icon: 'warning',
            buttons: {
              cancel: {
                text: 'Cancel',
                value: false,
                visible: true,
                className: 'swal-button--cancel',
              },
              confirm: {
                text: 'Send Code',
                value: true,
                visible: true,
                className: 'swal-button--confirm',
              },
            },
            dangerMode: false,
          });

          if (result) {
            await handleRequestOTP(input.email);
          }
          return;
        }

        if (user.role === 'staff') {
          // Staff login - data goes to coach's redux (authSlice.jsx) same as coach
          console.log('🔐 Staff login - Dispatching loginSuccess with:', { user, token });
          console.log('🔐 Staff role:', user.role);
          console.log('🔐 Staff data:', user);
          console.log('🔐 Token:', token);
          
          // Staff ko bhi coach ke redux mein store karo
          dispatch(loginSuccess({ user, token }));
          
          toast({
            title: `Welcome Back, ${user.name || 'Staff Member'}`,
            description: 'Redirecting to dashboard...',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
          // Staff ko coach ke dashboard pe redirect karo
          navigate('/dashboard');
        } else {
          // Coach/Admin login - data goes to redux/authSlice.jsx
          console.log('🔐 Coach/Admin login - Dispatching loginSuccess with:', { user, token });
          console.log('🔐 User role:', user.role);
          console.log('🔐 User data:', user);
          console.log('🔐 Token:', token);
          
          dispatch(loginSuccess({ user, token }));
          
          toast({
            title: `Welcome Back, ${user.name || 'User'}`,
            description: 'Redirecting to your dashboard...',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
          navigate('/dashboard');
        }

      } else {
        // Handle error responses
        console.log('🔐 Login failed:', response.status, data);
        
        // Check if it's a verification issue (403 or message contains verify keywords)
        const isVerificationIssue = 
          response.status === 403 || 
          (data.message && (
            data.message.toLowerCase().includes('verify') ||
            data.message.toLowerCase().includes('verification') ||
            data.message.toLowerCase().includes('not verified')
          ));
        
        if (isVerificationIssue) {
          console.log('🔐 Verification issue detected, prompting for OTP');
          
          const result = await swal({
            title: 'Email Verification Required',
            text: data.message || 'Your email address needs to be verified. Would you like us to send a verification code?',
            icon: 'warning',
            buttons: {
              cancel: { 
                text: 'Cancel', 
                value: false, 
                visible: true,
                className: 'swal-button--cancel' 
              },
              confirm: { 
                text: 'Send Code', 
                value: true, 
                visible: true,
                className: 'swal-button--confirm' 
              },
            },
            dangerMode: false,
          });

          if (result) {
            console.log('🔐 User chose to send OTP');
            await handleRequestOTP(input.email);
          } else {
            console.log('🔐 User cancelled OTP request');
          }
        } else {
          // Not a verification issue, show error
          let errorMessage = data.message || 'Invalid email address or password.';
          
          if (response.status === 401) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          } else if (response.status === 404) {
            errorMessage = 'Account not found. Please check your email address.';
          } else if (response.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          }
          
          console.error('🔐 Authentication error:', {
            status: response.status,
            message: errorMessage
          });
          
          toast({
            title: 'Authentication Failed',
            description: errorMessage,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('🔐 Login error (catch):', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="#eef2ff" py={0} px={0}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        bg="white"
        borderRadius={0}
        overflow="hidden"
        boxShadow="none"
        border="none"
        minH="100vh"
        mx="auto"
        w="100%"
      >
          <Box
            w={{ base: '100%', md: '50%' }}
            p={{ base: 8, md: 12 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            bgGradient="linear(to-b, #ffffff, #f5f7fb)"
            position="relative"
            overflow="hidden"
          >
            <Box position="absolute" top="-60px" left="-40px" w="200px" h="200px" bg="purple.100" opacity="0.18" filter="blur(10px)" borderRadius="full" />
            <Box position="absolute" top="35%" right="-80px" w="240px" h="240px" bg="blue.100" opacity="0.16" filter="blur(12px)" borderRadius="full" />
            <Box position="absolute" bottom="-80px" left="25%" w="220px" h="220px" bg="teal.50" opacity="0.16" filter="blur(14px)" borderRadius="full" />
            <VStack spacing={8} align="stretch" w="full" maxW="520px" mx="auto" justify="center" flex="1">
              <Heading size="lg" fontWeight="800" letterSpacing="-0.04em" color="#0f172a" lineHeight="1.2">
                {showOtpForm ? 'Verify your identity' : 'Welcome Back to FunnelsEye'}
              </Heading>

              <Box>
                {showOtpForm ? (
                  <SlideFade in={showOtpForm} offsetY="12px">
                    <VStack as="form" onSubmit={handleVerifyOTP} spacing={8}>
                      <Box textAlign="center" w="full">
                        <Flex
                          w="60px"
                          h="60px"
                          borderRadius="full"
                          bg="purple.50"
                          mb={6}
                          mx="auto"
                          align="center"
                          justify="center"
                        >
                          <Icon as={FaCheckCircle} boxSize={6} color="purple.600" />
                        </Flex>
                        
                        <Text fontSize="lg" fontWeight="600" color="#312e81" mb={8}>
                          Enter 6-Digit Verification Code
                        </Text>
                        
                        <HStack spacing={4} justify="center" mb={2}>
                          <PinInput
                            otp
                            size="lg"
                            value={otp}
                            onChange={setOtp}
                            placeholder="0"
                          >
                            {[...Array(6)].map((_, index) => (
                              <PinInputField 
                                key={index}
                                borderRadius="md" 
                                borderColor="purple.100"
                                border="2px solid"
                                _hover={{ borderColor: "purple.300" }}
                                _focus={{
                                  borderColor: "purple.600",
                                  boxShadow: "0 0 0 3px rgba(129, 140, 248, 0.6)"
                                }}
                                fontSize="xl"
                                fontWeight="600"
                                color="#312e81"
                                bg="white"
                                h="60px"
                                w="60px"
                              />
                            ))}
                          </PinInput>
                        </HStack>
                        
                        <Text fontSize="sm" color="gray.500" mb={8}>
                          Enter the 6-digit code sent to your email address
                        </Text>
                      </Box>

                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        bg="#4f46e5"
                        color="white"
                        _hover={{
                          bg: "#4338ca",
                          transform: "translateY(-1px)",
                          boxShadow: "0 15px 30px rgba(79, 70, 229, 0.35)"
                        }}
                        _active={{ transform: "translateY(0)" }}
                        isLoading={isLoading}
                        loadingText="Verifying..."
                        borderRadius="md"
                        fontSize="md"
                        fontWeight="600"
                        h="50px"
                        transition="all 0.2s ease"
                        boxShadow="0 2px 10px rgba(0,0,0,0.1)"
                      >
                        Verify & Continue
                      </Button>

                      <VStack spacing={4}>
                        <Button
                          variant="ghost"
                          colorScheme="purple"
                          onClick={() => handleRequestOTP(input.email)}
                          isDisabled={isLoading}
                          _hover={{ bg: "purple.50" }}
                          borderRadius="md"
                          fontWeight="500"
                        >
                          Resend Verification Code
                        </Button>
                        
                        <Button
                          variant="ghost"
                          leftIcon={<FaArrowLeft />}
                          onClick={() => {
                            setShowOtpForm(false);
                            setOtp('');
                          }}
                          color="#4338ca"
                          _hover={{ color: "#312e81", bg: "purple.50" }}
                          borderRadius="md"
                          fontWeight="500"
                        >
                          Back to Sign In
                        </Button>
                      </VStack>
                    </VStack>
                  </SlideFade>
                ) : (
                  <VStack as="form" onSubmit={handleLogin} spacing={6}>
                    <FormControl>
                      <FormLabel 
                        fontSize="sm" 
                        fontWeight="400" 
                        color="#0f172a"
                        mb={3}
                        textTransform="uppercase"
                        letterSpacing="0.05em"
                      >
                        Email Address
                      </FormLabel>
                      <InputGroup size="lg">
                        <InputLeftElement h="50px">
                          <Icon as={FaEnvelope} color="#6b7280" />
                        </InputLeftElement>
                        <Input
                          type="email"
                          name="email"
                          value={input.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "#a5b4fc" }}
                          _focus={{
                            borderColor: "#4f46e5",
                            boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.35)"
                          }}
                          bg="white"
                          fontSize="md"
                          fontWeight="300"
                          h="50px"
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <Flex justify="space-between" align="center" mb={3}>
                        <FormLabel 
                          fontSize="sm" 
                          fontWeight="400" 
                          color="#0f172a"
                          mb={0}
                          textTransform="uppercase"
                          letterSpacing="0.05em"
                        >
                          Password
                        </FormLabel>
                        <Text 
                          as={Link} 
                          to="/reset-password"
                          fontSize="sm" 
                          color="brand.600" 
                          fontWeight="500"
                          _hover={{ color: "brand.700", textDecoration: "underline" }}
                        >
                          Forgot Password?
                        </Text>
                      </Flex>
                      <InputGroup size="lg">
                        <InputLeftElement h="50px">
                          <Icon as={FaLock} color="#6b7280" />
                        </InputLeftElement>
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={input.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{ borderColor: "#a5b4fc" }}
                          _focus={{
                            borderColor: "#4f46e5",
                            boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.35)"
                          }}
                          bg="white"
                          fontSize="md"
                          fontWeight="300"
                          h="50px"
                          required
                        />
                        <InputRightElement h="50px">
                          <IconButton
                            variant="ghost"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                            onClick={() => setShowPassword(!showPassword)}
                            color="brand.600"
                            _hover={{ color: "brand.700", bg: "transparent" }}
                            size="sm"
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <Flex w="full" justify="space-between" align="center" py={1}>
                      <Checkbox 
                        colorScheme="brand" 
                        size="md"
                        fontWeight="500"
                        color="brand.600"
                      >
                        Remember me
                      </Checkbox>
                    </Flex>

                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      bg="brand.600"
                      color="white"
                      _hover={{
                        bg: "brand.700",
                        transform: "translateY(-1px)",
                        boxShadow: "0 15px 30px rgba(2, 132, 199, 0.35)"
                      }}
                      _active={{ transform: "translateY(0)" }}
                      isLoading={isLoading}
                      borderRadius="md"
                      fontSize="md"
                      fontWeight="600"
                      h="50px"
                      transition="all 0.2s ease"
                      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
                    >
                      {isLoading ? (
                        <HStack>
                          <Spinner size="sm" />
                          <Text>Signing In...</Text>
                        </HStack>
                      ) : (
                        'Log in'
                      )}
                    </Button>

                    <Box textAlign="center" pt={4}>
                      <Text color="gray.600" fontWeight="500">
                        Don't have an account?{' '}
                        <Text 
                          as={Link} 
                          to="/signup"
                          color="brand.600" 
                          fontWeight="600"
                          _hover={{ textDecoration: "underline", color: "brand.700" }}
                        >
                          Register here
                        </Text>
                      </Text>
                    </Box>
                  </VStack>
                )}
              </Box>
            </VStack>

          </Box>

          <Box
            w={{ base: '100%', md: '50%' }}
            minH={{ base: '260px', md: 'auto' }}
            bgImage={`url(${loginHeroJpg})`}
            bgSize="cover"
            bgPos="center"
            position="relative"
          >
          </Box>
      </Flex>


      <style jsx global>{`
        .swal-button--confirm {
          background-color: #1a202c !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .swal-button--confirm:hover {
          background-color: #2d3748 !important;
          transform: translateY(-1px) !important;
        }
        .swal-button--cancel {
          background-color: #e2e8f0 !important;
          color: #4a5568 !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .swal-button--cancel:hover {
          background-color: #cbd5e0 !important;
          transform: translateY(-1px) !important;
        }
        .swal-modal {
          border-radius: 16px !important;
          border: none !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        .swal-title {
          color: #1a202c !important;
          font-weight: 600 !important;
        }
        .swal-text {
          color: #4a5568 !important;
        }
      `}</style>
    </Box>
  );
};

export default Login;
