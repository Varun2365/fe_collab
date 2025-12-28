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
  const [isHoverMode, setIsHoverMode] = useState(false);
  
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
      if (event.detail) {
        // Track hover mode state
        if (event.detail.hoverMode !== undefined) {
          setIsHoverMode(event.detail.hoverMode);
        }
        
        // In hover mode, always keep margin at 80px (collapsed width)
        // In normal mode, update margin based on sidebar width
        if (event.detail.hoverMode) {
          setSidebarWidth('80px');
        } else if (event.detail.width) {
          setSidebarWidth(event.detail.width);
        }
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
        ml={isMobile ? 0 : (isHoverMode ? '0' : sidebarWidth)}
        minH="100vh"
        bg={bgColor}
        transition="margin-left 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
        w={isMobile ? "100%" : (isHoverMode ? "100%" : `calc(100% - ${sidebarWidth})`)}
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
