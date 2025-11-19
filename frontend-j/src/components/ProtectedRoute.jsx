import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectAuthStatus } from '../redux/authSlice';
import { Box, Spinner, Center, Text } from '@chakra-ui/react';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectAuthStatus);
  const staffToken = useSelector((state) => state.staff?.token);
  const staffIsAuthenticated = useSelector((state) => state.staff?.isAuthenticated);
  
  console.log('🔒 ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('🔒 ProtectedRoute - staffToken:', staffToken);
  console.log('🔒 ProtectedRoute - staffIsAuthenticated:', staffIsAuthenticated);
  
  // Check if either main auth or staff auth is valid
  const isAnyAuthenticated = isAuthenticated || !!staffToken || staffIsAuthenticated;

  console.log('🔒 ProtectedRoute - isAnyAuthenticated:', isAnyAuthenticated);

  if (isAuthenticated === null && !staffToken && !staffIsAuthenticated) {
    return (
      <Center minH="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="brand.500" mb={4} />
          <Text>Loading...</Text>
        </Box>
      </Center>
    );
  }

  if (!isAnyAuthenticated) {
    console.log('🔒 ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('🔒 ProtectedRoute - Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;
