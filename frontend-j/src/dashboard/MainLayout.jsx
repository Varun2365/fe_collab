import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Flex, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { selectAuthStatus } from '../redux/authSlice';

const MainLayout = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const isAuthenticated = useSelector(selectAuthStatus);
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState('320px');
  
  // Check if we're on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Listen for sidebar collapse events
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      if (event.detail && event.detail.width) {
        setSidebarWidth(event.detail.width);
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Box minH="100vh" bg={bgColor} position="relative">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box
        position="relative"
        ml={isMobile ? 0 : sidebarWidth}
        minH="100vh"
        bg={bgColor}
        transition="margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        w={isMobile ? "100%" : `calc(100% - ${sidebarWidth})`}
        overflow="hidden"
      >
        <TopNav />
        <Box
          as="main"
          p={6}
          minH="calc(100vh - 80px)"
          overflowY="auto"
          bg={bgColor}
          position="relative"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
