import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Topbar from './topbar';
import Sidebar from './sidebar';
import DashboardOverview from './pages/DashboardOverview';
import ProgressTracking from './pages/ProgressTracking';
import Coaching from './pages/Coaching';
import Gamification from './pages/Gamification';
import Communication from './pages/Communication';
import EducationHub from './pages/EducationHub';
import ProgressAnalytics from './pages/ProgressAnalytics';
import AIAssistant from './pages/AIAssistant';
import Community from './pages/Community';
import Motivation from './pages/Motivation';
import Automation from './pages/Automation';
import Account from './pages/Account';
import Notifications from './pages/Notifications';

const Settings = () => <Box p={8}><Box fontSize="2xl" fontWeight="bold">Settings</Box><Box mt={4}>App settings coming soon...</Box></Box>;
const Help = () => <Box p={8}><Box fontSize="2xl" fontWeight="bold">Help & Support</Box><Box mt={4}>Help center coming soon...</Box></Box>;

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'progress':
        return <ProgressTracking />;
      case 'coaching':
        return <Coaching />;
      case 'gamification':
        return <Gamification />;
      case 'communication':
        return <Communication />;
      case 'automation':
        return <Automation />;
      case 'education':
        return <EducationHub />;
      case 'analytics':
        return <ProgressAnalytics />;
      case 'ai':
        return <AIAssistant />;
      case 'community':
        return <Community />;
      case 'motivation':
        return <Motivation />;
      case 'account':
        return <Account />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        return <DashboardOverview />;
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <Flex 
      h="100vh" 
      bg="linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 50%, #F8F9FA 100%)"
      backgroundSize="200% 200%"
      overflow="hidden"
      position="relative"
      sx={{
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-200px"
        right="-200px"
        w="600px"
        h="600px"
        bgGradient="radial(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(60px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-150px"
        left="-150px"
        w="500px"
        h="500px"
        bgGradient="radial(circle, rgba(118, 75, 162, 0.06) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(50px)"
        pointerEvents="none"
      />

      <Sidebar onNavigate={setActivePage} activePage={activePage} />
      
      <Box flex={1} overflow="hidden" position="relative" zIndex={1}>
        <Topbar />
        
        <Box 
          p={8} 
          overflowY="auto" 
          h="calc(100vh - 80px)"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '10px',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2, #667eea)',
              },
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
