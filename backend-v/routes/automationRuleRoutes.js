// D:\PRJ_YCT_Final\routes\automationRuleRoutes.js

const express = require('express');
const router = express.Router();
// --- CORRECTED: The import name must match the controller's export ---
const { createRule, getRules, getRuleById, updateRule, deleteRule, getEventsAndActions, getBuilderResources, validateGraphWorkflow, assignFunnel, getAnalytics, getRuleByFunnel } = require('../controllers/automationRuleController'); 

// Using unified authentication middleware
const { 
    unifiedCoachAuth, 
    requirePermission, 
    filterResourcesByPermission 
} = require('../middleware/unifiedCoachAuth');
const { updateLastActive } = require('../middleware/activityMiddleware'); // Your new middleware

// Public route for getting available events and actions (no authentication required)
router.get('/events-actions', getEventsAndActions); // Get all available events and actions

// Use router.use() to apply unified authentication and activity tracking middleware
// to ALL subsequent routes in this file.
router.use(unifiedCoachAuth(), updateLastActive, filterResourcesByPermission('automation'));

// Get builder resources (staff, funnels, templates) - needs auth
router.get('/builder-resources', requirePermission('automation:read'), getBuilderResources);

// Validate graph workflow - needs auth
router.post('/validate-graph', requirePermission('automation:read'), validateGraphWorkflow);

// Route to create a new automation rule
// This route is now protected, and it will update the user's lastActiveAt timestamp
router.post('/', requirePermission('automation:write'), createRule);

// You would add more routes here for GET, PUT, DELETE operations later:
router.get('/', requirePermission('automation:read'), getRules);
router.get('/:id', requirePermission('automation:read'), getRuleById);
router.put('/:id', requirePermission('automation:update'), updateRule);
router.delete('/:id', requirePermission('automation:delete'), deleteRule);

// Funnel assignment routes
router.put('/:id/assign-funnel', requirePermission('automation:update'), assignFunnel);
router.get('/funnel/:funnelId', requirePermission('automation:read'), getRuleByFunnel);

// Analytics route
router.get('/:id/analytics', requirePermission('automation:read'), getAnalytics);

module.exports = router;