import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import MainLayout from './dashboard/MainLayout';
import DashboardView from './dashboard/DashboardView';
// import Funnels from './dashboard/Funnels';
import Team from './dashboard/Team';
import Portfolio from './dashboard/Portfolio';
import Leads from './dashboard/Leads';
import Settings from './dashboard/Settings';
import Profile from './dashboard/Profile';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Funnel1 from './dashboard/portfolio/index';
import Funnel_settings from './dashboard/portfolio/funnel1/index';
import Portfolio_page from './dashboard/portfolio/funnel1/portfolioedit.jsx';
import Staff from './dashboard/staff/index';
import Calendar from './dashboard/calendar/index';
import Inbox from './dashboard/setup/index.jsx';
import Ads from './dashboard/ads/index.jsx';
// Also trying backup in case index isn't working
// import Ads from './dashboard/ads/backup.jsx';
// import Funnels1 from './dashboard/Funnels.jsx';
import Mlm from './dashboard/mlm/index.jsx';
import Leads_couch from './dashboard/leads/couch/index.jsx';
import Leads_customar from './dashboard/leads/customar/index.jsx';
import Signup from './components/signup.jsx';
import { UnifiedStaffDashboard } from "./staff_dashboard";
import StaffMainLayout from "./staff_dashboard/StaffMainLayout";
import StaffAPITesting from "./staff_dashboard/StaffAPITesting";
import AuthStatusDebug from "./staff_dashboard/AuthStatusDebug";
import DashboardOverview from "./staff_dashboard/components/DashboardOverview";
import TaskManagement from "./staff_dashboard/components/TaskManagement";
import CalendarManagement from "./staff_dashboard/components/CalendarManagement";
import AppointmentManagement from "./staff_dashboard/components/AppointmentManagement";
import PerformanceAnalytics from "./staff_dashboard/components/PerformanceAnalytics";
import TeamLeaderboard from "./staff_dashboard/components/TeamLeaderboard";
import NotificationsCenter from "./staff_dashboard/components/NotificationsCenter";
import ProfileSettings from "./staff_dashboard/components/ProfileSettings";
import Profile_settings from "./dashboard/profile/index.jsx";
import WhatsAppSetup from './dashboard/settings/index.jsx';
import ZoomIntegrationComponent from './dashboard/settings/zoom.jsx';
import PaymentGateways from './dashboard/settings/payment.jsx';
import ClientDashboard from './client_dashboard/dashboard';
import SubscriptionManagement from './dashboard/subscription/index.jsx';
import CustomDomainManagement from './dashboard/dns/index.jsx';
import AutomationDashboard from './dashboard/automation/index.jsx';
import MessagingDashboard from './dashboard/messaging/index.jsx';
import Courses from './dashboard/courses/index.jsx';
import CourseEdit from './dashboard/courses/edit.jsx';
import TasksAndActivities from './dashboard/tasks/index.jsx';
import NotFound from './components/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
// Client Management Pages
import PersonalProgressTracking from './dashboard/client_management/PersonalProgressTracking';
import CoachingDeliverySystem from './dashboard/client_management/CoachingDeliverySystem';
import Gamification from './dashboard/client_management/Gamification';
import Communication from './dashboard/client_management/Communication';
import EducationalHub from './dashboard/client_management/EducationalHub';
import ProgressAnalytics from './dashboard/client_management/ProgressAnalytics';
import Community from './dashboard/client_management/Community';
import Motivational from './dashboard/client_management/Motivational';
function App() {
  return (
    <ErrorBoundary>
      <Box minH="100vh" bg="gray.50">
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Client Dashboard Route */}
        <Route path="/client_dashboard" element={<ClientDashboard />} />
        
        {/* Staff Dashboard Routes - DISABLED: Staff now uses main dashboard */}
        {/* <Route path="/staff_dashboard" element={<ProtectedRoute><StaffMainLayout><UnifiedStaffDashboard /></StaffMainLayout></ProtectedRoute>} />
        
        <Route path="/staff_dashboard/tasks" element={<ProtectedRoute><StaffMainLayout><TaskManagement /></StaffMainLayout></ProtectedRoute>} />
        <Route path="/staff_dashboard/calendar" element={<ProtectedRoute><StaffMainLayout><CalendarManagement /></StaffMainLayout></ProtectedRoute>} />
        <Route path="/staff_dashboard/appointments" element={<ProtectedRoute><StaffMainLayout><AppointmentManagement /></StaffMainLayout></ProtectedRoute>} />
        <Route path="/staff_dashboard/performance" element={<ProtectedRoute><StaffMainLayout><PerformanceAnalytics /></StaffMainLayout></ProtectedRoute>} />
        <Route path="/staff_dashboard/team" element={<ProtectedRoute><StaffMainLayout><TeamLeaderboard /></StaffMainLayout></ProtectedRoute>} />
        <Route path="/staff_dashboard/notifications" element={<ProtectedRoute><StaffMainLayout><NotificationsCenter /></StaffMainLayout></ProtectedRoute>} />
        <Route path="/staff_dashboard/profile" element={<ProtectedRoute><StaffMainLayout><ProfileSettings /></StaffMainLayout></ProtectedRoute>} />
        
        <Route path="/staff_api_testing" element={<ProtectedRoute><StaffMainLayout><StaffAPITesting /></StaffMainLayout></ProtectedRoute>} />
        
        <Route path="/auth_debug" element={<ProtectedRoute><StaffMainLayout><AuthStatusDebug /></StaffMainLayout></ProtectedRoute>} */}
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/Funnel_settings/:slug" element={<Funnel_settings />} />
          <Route path="funnels" element={<Funnel1 />} />
          <Route index element={<DashboardView />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="team" element={<Team />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="leads" element={<Leads />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="staff" element={<Staff />} />
          <Route path="calendar" element={<Calendar />} />
          {/* Redirect old typo route to correct one */}
          <Route path="calender" element={<Navigate to="/calendar" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="ads" element={<Ads />} />
          {/* <Route path="funnels1" element={<Funnels1 />} />   */}
          <Route path="leads_couch" element={<Leads_couch />} />
          <Route path="leads_customer" element={<Leads_customar />} />
          <Route path="mlm" element={<Mlm />} />
          <Route path="profile_settings" element={<Profile_settings />} />
          <Route path="whatsapp_setup" element={<WhatsAppSetup />} />
          <Route path="zoom_settings" element={<ZoomIntegrationComponent />} />
          <Route path="payment_gateways" element={<PaymentGateways />} />
          <Route path="subscription" element={<SubscriptionManagement />} />
          <Route path="dns" element={<CustomDomainManagement />} />
          <Route path="automation" element={<AutomationDashboard />} />
          <Route path="messaging" element={<MessagingDashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId/edit" element={<CourseEdit />} />
          <Route path="tasks" element={<TasksAndActivities />} />
          {/* Client Management Routes */}
          <Route path="client_management/personal_progress" element={<PersonalProgressTracking />} />
          <Route path="client_management/coaching_delivery" element={<CoachingDeliverySystem />} />
          <Route path="client_management/gamification" element={<Gamification />} />
          <Route path="client_management/communication" element={<Communication />} />
          <Route path="client_management/educational_hub" element={<EducationalHub />} />
          <Route path="client_management/progress_analytics" element={<ProgressAnalytics />} />
          <Route path="client_management/community" element={<Community />} />
          <Route path="client_management/motivational" element={<Motivational />} />
        </Route>

        {/* Standalone Portfolio Routes - No Sidebar/Topbar */}
        
        <Route path="funnel_edit/:id/:stageId" element={<ProtectedRoute><Portfolio_page /></ProtectedRoute>} />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </ErrorBoundary>
  );
}

export default App;