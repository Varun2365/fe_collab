// D:\PRJ_YCT_Final\controllers\marketingV1Controller.js

const asyncHandler = require('../middleware/async');
const CoachMarketingCredentials = require('../schema/CoachMarketingCredentials');
const { AdCampaign, AdSet, AdCreative, Ad } = require('../schema');
const CoachStaffService = require('../services/coachStaffService');
const marketingV1Service = require('../services/marketingV1Service');
const aiMarketingService = require('../services/aiMarketingService');

// ===== CREDENTIALS MANAGEMENT =====

// @desc    Get Meta API setup steps
// @route   GET /api/marketing/v1/credentials/meta/setup-steps
// @access  Private (Coaches)
exports.getMetaSetupSteps = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            title: '📋 STEP-BY-STEP GUIDE TO GET META API CREDENTIALS:',
            steps: [
                {
                    step: 1,
                    title: '🔧 Create Facebook App',
                    instructions: [
                        'Go to https://developers.facebook.com/',
                        'Click "My Apps" → "Create App"',
                        'Choose "Business" as app type',
                        'Fill in app details:',
                        '  - App Name: Your business name',
                        '  - App Contact Email: Your email',
                        '  - Business Manager Account: Select your business',
                        'Click "Create App"'
                    ]
                },
                {
                    step: 2,
                    title: '🔑 Get App ID and App Secret',
                    instructions: [
                        'In your app dashboard, go to "Settings" → "Basic"',
                        'Copy "App ID" (this is your appId)',
                        'Click "Show" next to App Secret and copy it (this is your appSecret)'
                    ]
                },
                {
                    step: 3,
                    title: '🎯 Get Access Token',
                    instructions: [
                        'Go to "Tools" → "Graph API Explorer"',
                        'Select your app from dropdown',
                        'Click "Generate Access Token"',
                        'Select these permissions:',
                        '  - ads_management',
                        '  - pages_manage_posts',
                        '  - pages_read_engagement',
                        '  - instagram_basic',
                        '  - instagram_content_publish',
                        'Click "Generate Access Token"',
                        'Copy the token (this is your accessToken)'
                    ]
                },
                {
                    step: 4,
                    title: '🏢 Get Business Account ID',
                    instructions: [
                        'Go to https://business.facebook.com/',
                        'Select your Business Manager',
                        'Go to "Business Settings" → "Business Info"',
                        'Copy "Business Manager ID" (this is your businessAccountId)'
                    ]
                },
                {
                    step: 5,
                    title: '💰 Get Ad Account ID',
                    instructions: [
                        'In Business Manager, go to "Ad Accounts"',
                        'Click on your ad account',
                        'Copy the account ID (format: act_123456789)',
                        'This is your adAccountId'
                    ]
                },
                {
                    step: 6,
                    title: '📄 Get Facebook Page ID',
                    instructions: [
                        'Go to your Facebook Page',
                        'Click "Settings" → "Page Info"',
                        'Scroll down to find "Page ID"',
                        'Copy the ID (this is your facebookPageId)'
                    ]
                },
                {
                    step: 7,
                    title: '📸 Get Instagram Account ID',
                    instructions: [
                        'Go to https://business.facebook.com/',
                        'Go to "Business Settings" → "Instagram Accounts"',
                        'Click on your Instagram account',
                        'Copy the Instagram Account ID (this is your instagramAccountId)'
                    ]
                }
            ],
            importantNotes: [
                'Access tokens expire! You\'ll need to refresh them periodically',
                'Make sure your Facebook app is approved for production use',
                'Test with a small budget first',
                'Keep all credentials secure and never share them publicly'
            ],
            verification: 'After setup, use the "Verify Meta API Credentials" endpoint to test your configuration.',
            requiredFields: [
                'accessToken - Your Meta API access token',
                'appId - Your Facebook App ID',
                'appSecret - Your Facebook App Secret',
                'businessAccountId - Your Business Manager ID (optional)',
                'adAccountId - Your Ad Account ID (optional)',
                'facebookPageId - Your Facebook Page ID (optional)',
                'instagramAccountId - Your Instagram Account ID (optional)'
            ]
        }
    });
});

// @desc    Get OpenAI setup steps
// @route   GET /api/marketing/v1/credentials/openai/setup-steps
// @access  Private (Coaches)
exports.getOpenAISetupSteps = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            title: '📋 STEP-BY-STEP GUIDE TO GET OPENAI API KEY:',
            steps: [
                {
                    step: 1,
                    title: '🔧 Create OpenAI Account',
                    instructions: [
                        'Go to https://platform.openai.com/',
                        'Click "Sign Up" or "Log In"',
                        'Complete account verification (email + phone)',
                        'Add payment method (required for API usage)'
                    ]
                },
                {
                    step: 2,
                    title: '🔑 Get API Key',
                    instructions: [
                        'Log into your OpenAI account',
                        'Go to https://platform.openai.com/api-keys',
                        'Click "Create new secret key"',
                        'Give it a name (e.g., "Marketing V1 API")',
                        'Copy the key immediately (you won\'t see it again!)',
                        'This is your apiKey (starts with sk-)'
                    ]
                },
                {
                    step: 3,
                    title: '💰 Add Credits',
                    instructions: [
                        'Go to https://platform.openai.com/account/billing',
                        'Click "Add credits" or "Set up billing"',
                        'Add at least $5-10 for testing',
                        'Monitor usage in the dashboard'
                    ]
                },
                {
                    step: 4,
                    title: '⚙️ Choose Model Preference',
                    instructions: [
                        'Available models:',
                        '  - gpt-4 (Recommended) - Most capable, best for complex tasks',
                        '  - gpt-3.5-turbo - Faster and cheaper, good for simple tasks',
                        '  - gpt-4-turbo-preview - Latest GPT-4 with improvements'
                    ]
                },
                {
                    step: 5,
                    title: '📊 Monitor Usage',
                    instructions: [
                        'Go to https://platform.openai.com/usage',
                        'Set up usage limits to avoid unexpected charges',
                        'Monitor your API calls and costs'
                    ]
                }
            ],
            importantNotes: [
                'API keys are sensitive - never share them publicly',
                'Each API call costs money (typically $0.01-0.10 per request)',
                'Set usage limits to control costs',
                'Keys don\'t expire but can be revoked',
                'Keep your key secure and rotate it periodically'
            ],
            costEstimation: {
                'GPT-4': '~$0.03 per 1K tokens',
                'GPT-3.5-turbo': '~$0.002 per 1K tokens',
                'Typical ad copy generation': '$0.01-0.05 per request',
                'Campaign optimization': '$0.05-0.20 per request'
            },
            verification: 'After setup, use the "Verify OpenAI Credentials" endpoint to test your configuration.',
            requiredFields: [
                'apiKey - Your OpenAI API key (starts with sk-)',
                'modelPreference - AI model to use (gpt-4, gpt-3.5-turbo, gpt-4-turbo-preview)'
            ]
        }
    });
});

// @desc    Setup Meta API credentials for coach
// @route   POST /api/marketing/v1/credentials/meta
// @access  Private (Coaches/Staff with permission)
exports.setupMetaCredentials = asyncHandler(async (req, res) => {
    // Get coach ID using unified service (handles both coach and staff)
    const coachId = CoachStaffService.getCoachIdForQuery(req);
    const userContext = CoachStaffService.getUserContext(req);
    
    // Log staff action if applicable
    CoachStaffService.logStaffAction(req, 'manage', 'marketing', 'setup_meta', { coachId });
    const { 
        accessToken, 
        appId, 
        appSecret, 
        businessAccountId, 
        adAccountId, 
        facebookPageId, 
        instagramAccountId 
    } = req.body;

    if (!accessToken || !appId || !appSecret) {
        return res.status(400).json({
            success: false,
            message: 'Access token, App ID, and App Secret are required. Use GET /api/marketing/v1/credentials/meta/setup-steps to get detailed setup instructions.'
        });
    }

    const result = await marketingV1Service.setupMetaCredentials(coachId, {
        accessToken,
        appId,
        appSecret,
        businessAccountId,
        adAccountId,
        facebookPageId,
        instagramAccountId
    });

    res.status(200).json({
        success: true,
        message: 'Meta credentials setup successfully',
        data: result
    });
});

// @desc    Verify Meta API credentials
// @route   POST /api/marketing/v1/credentials/meta/verify
// @access  Private (Coaches)
exports.verifyMetaCredentials = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    
    const result = await marketingV1Service.verifyMetaCredentials(coachId);
    
    res.status(200).json({
        success: true,
        message: result.isValid ? 'Meta credentials are valid' : 'Meta credentials are invalid',
        data: result
    });
});

// @desc    Get Meta account information
// @route   GET /api/marketing/v1/credentials/meta/account-info
// @access  Private (Coaches)
exports.getMetaAccountInfo = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    
    const accountInfo = await marketingV1Service.getMetaAccountInfo(coachId);
    
    res.status(200).json({
        success: true,
        data: accountInfo
    });
});

// @desc    Initiate Meta OAuth flow
// @route   POST /api/marketing/v1/credentials/meta/oauth/initiate
// @access  Private (Coaches/Staff with permission)
exports.initiateMetaOAuth = asyncHandler(async (req, res) => {
    const coachId = CoachStaffService.getCoachIdForQuery(req);
    const userContext = CoachStaffService.getUserContext(req);
    
    // Log staff action if applicable
    CoachStaffService.logStaffAction(req, 'manage', 'marketing', 'initiate_meta_oauth', { coachId });
    
    // Generate OAuth URL
        const META_APP_ID = process.env.META_APP_ID;
        const META_APP_SECRET = process.env.META_APP_SECRET;
        
        if (!META_APP_ID || !META_APP_SECRET || META_APP_ID === 'YOUR_META_APP_ID' || META_APP_SECRET === 'YOUR_META_APP_SECRET') {
            return res.status(500).json({
                success: false,
                message: 'Meta OAuth is not configured. Please set META_APP_ID and META_APP_SECRET environment variables.',
                error: 'OAUTH_NOT_CONFIGURED'
            });
        }
        
        const state = Buffer.from(JSON.stringify({ coachId, timestamp: Date.now() })).toString('base64');
        
        // Build proper redirect URI based on environment
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const baseUrl = isDevelopment 
            ? `http://localhost:8080`
            : `https://api.funnelseye.com`;
        const callbackUri = `${baseUrl}/api/marketing/v1/credentials/meta/oauth/callback`;
        
        const scopes = [
            'ads_management',
            'ads_read',
            'business_management',
            'pages_read_engagement',
            'pages_manage_posts',
            'instagram_basic',
            'instagram_content_publish'
        ].join(',');
        
        const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
            `client_id=${META_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(callbackUri)}` +
            `&scope=${encodeURIComponent(scopes)}` +
            `&state=${encodeURIComponent(state)}` +
            `&response_type=code`;
    
    res.status(200).json({
        success: true,
        data: {
            authUrl,
            state
        }
    });
});

// @desc    Handle Meta OAuth callback
// @route   POST /api/marketing/v1/credentials/meta/oauth/callback
// @access  Private (Coaches/Staff with permission)
exports.handleMetaOAuthCallback = asyncHandler(async (req, res) => {
    const coachId = CoachStaffService.getCoachIdForQuery(req);
    const userContext = CoachStaffService.getUserContext(req);
    
    // Log staff action if applicable
    CoachStaffService.logStaffAction(req, 'manage', 'marketing', 'handle_meta_oauth_callback', { coachId });
    
    // OAuth callback can come as GET (from browser redirect) or POST
    const { code, state } = req.method === 'GET' ? req.query : req.body;
    
    if (!code || !state) {
        return res.status(400).json({
            success: false,
            message: 'Authorization code and state are required'
        });
    }
    
    try {
        // Verify state
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        if (decodedState.coachId !== coachId) {
            return res.status(403).json({
                success: false,
                message: 'Invalid state parameter'
            });
        }
        
        const META_APP_ID = process.env.META_APP_ID;
        const META_APP_SECRET = process.env.META_APP_SECRET;
        
        if (!META_APP_ID || !META_APP_SECRET || META_APP_ID === 'YOUR_META_APP_ID' || META_APP_SECRET === 'YOUR_META_APP_SECRET') {
            return res.status(500).json({
                success: false,
                message: 'Meta OAuth is not configured. Please set META_APP_ID and META_APP_SECRET environment variables.',
                error: 'OAUTH_NOT_CONFIGURED'
            });
        }
        
        // Build proper redirect URI based on environment
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const baseUrl = isDevelopment 
            ? `http://localhost:8080`
            : `https://api.funnelseye.com`;
        const redirectUri = `${baseUrl}/api/marketing/v1/credentials/meta/oauth/callback`;
        
        // Exchange code for access token
        const axios = require('axios');
        const tokenResponse = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
            params: {
                client_id: META_APP_ID,
                client_secret: META_APP_SECRET,
                redirect_uri: redirectUri,
                code: code
            }
        });
        
        const accessToken = tokenResponse.data.access_token;
        
        // Get long-lived token (optional, but recommended)
        const longLivedTokenResponse = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: META_APP_ID,
                client_secret: META_APP_SECRET,
                fb_exchange_token: accessToken
            }
        });
        
        const longLivedToken = longLivedTokenResponse.data.access_token || accessToken;
        
        // Get user's ad accounts
        const accountsResponse = await axios.get(`https://graph.facebook.com/v19.0/me/adaccounts`, {
            params: {
                access_token: longLivedToken,
                fields: 'id,name,account_id'
            }
        });
        
        const adAccounts = accountsResponse.data.data || [];
        const adAccountId = adAccounts.length > 0 ? adAccounts[0].id : null;
        
        // Get business accounts
        const businessResponse = await axios.get(`https://graph.facebook.com/v19.0/me/businesses`, {
            params: {
                access_token: longLivedToken
            }
        });
        
        const businesses = businessResponse.data.data || [];
        const businessAccountId = businesses.length > 0 ? businesses[0].id : null;
        
        // Save credentials using existing service
        const result = await marketingV1Service.setupMetaCredentials(coachId, {
            accessToken: longLivedToken,
            appId: META_APP_ID,
            appSecret: META_APP_SECRET, // Store for reference, but OAuth doesn't require it
            businessAccountId,
            adAccountId: adAccountId ? adAccountId.replace('act_', '') : null,
            facebookPageId: null, // Can be fetched separately if needed
            instagramAccountId: null // Can be fetched separately if needed
        });
        
        res.status(200).json({
            success: true,
            message: 'Meta account connected successfully via OAuth',
            data: {
                ...result,
                oauthConnected: true
            }
        });
    } catch (error) {
        console.error('Meta OAuth callback error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to complete OAuth flow',
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// @desc    Setup OpenAI credentials for AI features
// @route   POST /api/marketing/v1/credentials/openai
// @access  Private (Coaches)
exports.setupOpenAICredentials = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { apiKey, modelPreference = 'gpt-4' } = req.body;

    if (!apiKey) {
        return res.status(400).json({
            success: false,
            message: 'OpenAI API key is required. Use GET /api/marketing/v1/credentials/openai/setup-steps to get detailed setup instructions.'
        });
    }

    const result = await marketingV1Service.setupOpenAICredentials(coachId, {
        apiKey,
        modelPreference
    });

    res.status(200).json({
        success: true,
        message: 'OpenAI credentials setup successfully',
        data: result
    });
});

// @desc    Get currency preference
// @route   GET /api/marketing/v1/preferences/currency
// @access  Private (Coaches/Staff with permission)
exports.getCurrencyPreference = asyncHandler(async (req, res) => {
    const coachId = CoachStaffService.getCoachIdForQuery(req);
    const userContext = CoachStaffService.getUserContext(req);
    
    // Log staff action if applicable
    CoachStaffService.logStaffAction(req, 'read', 'marketing', 'get_currency_preference', { coachId });
    
    try {
        const CoachMarketingCredentials = require('../schema/CoachMarketingCredentials');
        const credentials = await CoachMarketingCredentials.findOne({ coachId });
        
        const currency = credentials?.preferences?.currency || 'USD';
        
        res.status(200).json({
            success: true,
            data: { currency }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch currency preference',
            error: error.message
        });
    }
});

// @desc    Save currency preference
// @route   POST /api/marketing/v1/preferences/currency
// @access  Private (Coaches/Staff with permission)
exports.saveCurrencyPreference = asyncHandler(async (req, res) => {
    const coachId = CoachStaffService.getCoachIdForQuery(req);
    const userContext = CoachStaffService.getUserContext(req);
    
    // Log staff action if applicable
    CoachStaffService.logStaffAction(req, 'manage', 'marketing', 'save_currency_preference', { coachId });
    
    const { currency } = req.body;
    
    if (!currency) {
        return res.status(400).json({
            success: false,
            message: 'Currency is required'
        });
    }
    
    const validCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];
    if (!validCurrencies.includes(currency)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid currency code'
        });
    }
    
    try {
        const CoachMarketingCredentials = require('../schema/CoachMarketingCredentials');
        const credentials = await CoachMarketingCredentials.findOneAndUpdate(
            { coachId },
            {
                $set: {
                    'preferences.currency': currency,
                    'preferences.updatedAt': new Date()
                }
            },
            { upsert: true, new: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Currency preference saved successfully',
            data: { currency: credentials.preferences?.currency || currency }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to save currency preference',
            error: error.message
        });
    }
});

// @desc    Get marketing credentials status
// @route   GET /api/marketing/v1/credentials/status
// @access  Private (Coaches)
exports.getCredentialsStatus = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    
    const status = await marketingV1Service.getCredentialsStatus(coachId);
    
    res.status(200).json({
        success: true,
        data: status
    });
});

// ===== CAMPAIGN ANALYSIS & MANAGEMENT =====

// @desc    Get comprehensive campaign analysis
// @route   GET /api/marketing/v1/campaigns/analysis
// @access  Private (Coaches)
exports.getCampaignAnalysis = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { 
        dateRange = '30d', 
        campaignIds = [], 
        includeInsights = true,
        includeRecommendations = true 
    } = req.query;

    const analysis = await marketingV1Service.getCampaignAnalysis(coachId, {
        dateRange,
        campaignIds: campaignIds.length > 0 ? campaignIds.split(',') : [],
        includeInsights,
        includeRecommendations
    });

    res.status(200).json({
        success: true,
        data: analysis
    });
});

// @desc    Get detailed campaign insights
// @route   GET /api/marketing/v1/campaigns/:campaignId/insights
// @access  Private (Coaches/Staff with permission)
exports.getCampaignInsights = asyncHandler(async (req, res) => {
    // Get coach ID using unified service (handles both coach and staff)
    const coachId = CoachStaffService.getCoachIdForQuery(req);
    const userContext = CoachStaffService.getUserContext(req);
    
    // Log staff action if applicable
    CoachStaffService.logStaffAction(req, 'read', 'marketing', 'campaign_insights', { coachId, campaignId: req.params.campaignId });
    const { campaignId } = req.params;
    const { 
        dateRange = '30d',
        breakdown = 'daily',
        includeDemographics = true,
        includePlacements = true
    } = req.query;

    const insights = await marketingV1Service.getCampaignInsights(coachId, campaignId, {
        dateRange,
        breakdown,
        includeDemographics,
        includePlacements
    });

    res.status(200).json({
        success: true,
        data: insights
    });
});

// @desc    Get campaign performance metrics
// @route   GET /api/marketing/v1/campaigns/:campaignId/metrics
// @access  Private (Coaches)
exports.getCampaignMetrics = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { 
        dateRange = '30d',
        metrics = 'impressions,clicks,spend,ctr,cpc,cpm,conversions'
    } = req.query;

    const metricsData = await marketingV1Service.getCampaignMetrics(coachId, campaignId, {
        dateRange,
        metrics: metrics.split(',')
    });

    res.status(200).json({
        success: true,
        data: metricsData
    });
});

// @desc    Get campaign audience insights
// @route   GET /api/marketing/v1/campaigns/:campaignId/audience-insights
// @access  Private (Coaches)
exports.getCampaignAudienceInsights = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { dateRange = '30d' } = req.query;

    const audienceInsights = await marketingV1Service.getCampaignAudienceInsights(coachId, campaignId, {
        dateRange
    });

    res.status(200).json({
        success: true,
        data: audienceInsights
    });
});

// @desc    Get campaign optimization recommendations
// @route   GET /api/marketing/v1/campaigns/:campaignId/recommendations
// @access  Private (Coaches)
exports.getCampaignRecommendations = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { includeAIRecommendations = true } = req.query;

    const recommendations = await marketingV1Service.getCampaignRecommendations(coachId, campaignId, {
        includeAIRecommendations
    });

    res.status(200).json({
        success: true,
        data: recommendations
    });
});

// ===== CAMPAIGN CREATION & MANAGEMENT =====

// @desc    Create new campaign with AI assistance
// @route   POST /api/marketing/v1/campaigns/create
// @access  Private (Coaches)
exports.createCampaign = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const {
        name,
        objective,
        budget,
        targetAudience,
        productInfo,
        useAI = true,
        autoOptimize = false,
        schedule = null
    } = req.body;

    if (!name || !objective || !budget || !targetAudience) {
        return res.status(400).json({
            success: false,
            message: 'Name, objective, budget, and target audience are required'
        });
    }

    // Check subscription limits for campaign creation - MUST happen before any campaign creation
    const SubscriptionLimitsMiddleware = require('../middleware/subscriptionLimits');
    const limitCheck = await SubscriptionLimitsMiddleware.checkCampaignLimit(coachId);
    
    if (!limitCheck.allowed) {
        const { sendLimitError } = require('../utils/subscriptionLimitErrors');
        const logger = require('../utils/logger');
        logger.warn(`[MarketingV1Controller] Campaign creation blocked for coach ${coachId}: ${limitCheck.reason}`);
        return sendLimitError(
            res, 
            'CAMPAIGN', 
            limitCheck.reason || 'Campaign limit reached', 
            limitCheck.currentCount || 0, 
            limitCheck.maxLimit || 0, 
            limitCheck.upgradeRequired !== false
        );
    }

    const campaign = await marketingV1Service.createCampaign(coachId, {
        name,
        objective,
        budget,
        targetAudience,
        productInfo,
        useAI,
        autoOptimize,
        schedule
    });

    res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaign
    });
});

// @desc    Update campaign settings
// @route   PUT /api/marketing/v1/campaigns/:campaignId
// @access  Private (Coaches)
exports.updateCampaign = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const updateData = req.body;

    const campaign = await marketingV1Service.updateCampaign(coachId, campaignId, updateData);

    res.status(200).json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaign
    });
});

// @desc    Pause campaign
// @route   POST /api/marketing/v1/campaigns/:campaignId/pause
// @access  Private (Coaches)
exports.pauseCampaign = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;

    const result = await marketingV1Service.pauseCampaign(coachId, campaignId);

    res.status(200).json({
        success: true,
        message: 'Campaign paused successfully',
        data: result
    });
});

// @desc    Resume campaign
// @route   POST /api/marketing/v1/campaigns/:campaignId/resume
// @access  Private (Coaches)
exports.resumeCampaign = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;

    const result = await marketingV1Service.resumeCampaign(coachId, campaignId);

    res.status(200).json({
        success: true,
        message: 'Campaign resumed successfully',
        data: result
    });
});

// @desc    Delete campaign
// @route   DELETE /api/marketing/v1/campaigns/:campaignId
// @access  Private (Coaches)
exports.deleteCampaign = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;

    await marketingV1Service.deleteCampaign(coachId, campaignId);

    res.status(200).json({
        success: true,
        message: 'Campaign deleted successfully'
    });
});

// @desc    Duplicate campaign
// @route   POST /api/marketing/v1/campaigns/:campaignId/duplicate
// @access  Private (Coaches)
exports.duplicateCampaign = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { newName, modifications = {} } = req.body;

    const duplicatedCampaign = await marketingV1Service.duplicateCampaign(coachId, campaignId, {
        newName,
        modifications
    });

    res.status(201).json({
        success: true,
        message: 'Campaign duplicated successfully',
        data: duplicatedCampaign
    });
});

// ===== AI-POWERED FEATURES =====

// @desc    Generate AI-powered ad copy
// @route   POST /api/marketing/v1/ai/generate-copy
// @access  Private (Coaches)
exports.generateAICopy = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const {
        productInfo,
        targetAudience,
        campaignObjective,
        tone = 'professional',
        length = 'medium',
        includeCallToAction = true
    } = req.body;

    if (!productInfo || !targetAudience || !campaignObjective) {
        return res.status(400).json({
            success: false,
            message: 'Product info, target audience, and campaign objective are required'
        });
    }

    const aiCopy = await aiMarketingService.generateAdCopy(coachId, {
        productInfo,
        targetAudience,
        campaignObjective,
        tone,
        length,
        includeCallToAction
    });

    res.status(200).json({
        success: true,
        data: aiCopy
    });
});

// @desc    Generate AI-powered targeting recommendations
// @route   POST /api/marketing/v1/ai/targeting-recommendations
// @access  Private (Coaches)
exports.generateAITargeting = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const {
        targetAudience,
        budget,
        objective,
        productInfo,
        excludeAudiences = []
    } = req.body;

    if (!targetAudience || !budget || !objective) {
        return res.status(400).json({
            success: false,
            message: 'Target audience, budget, and objective are required'
        });
    }

    const targetingRecommendations = await aiMarketingService.generateTargetingRecommendations(coachId, {
        targetAudience,
        budget,
        objective,
        productInfo,
        excludeAudiences
    });

    res.status(200).json({
        success: true,
        data: targetingRecommendations
    });
});

// @desc    Generate AI-powered campaign optimization suggestions
// @route   POST /api/marketing/v1/ai/optimize-campaign
// @access  Private (Coaches)
exports.optimizeCampaignWithAI = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { 
        optimizationType = 'performance',
        includeBudgetOptimization = true,
        includeAudienceOptimization = true,
        includeCreativeOptimization = true
    } = req.body;

    const optimizationSuggestions = await aiMarketingService.optimizeCampaign(coachId, campaignId, {
        optimizationType,
        includeBudgetOptimization,
        includeAudienceOptimization,
        includeCreativeOptimization
    });

    res.status(200).json({
        success: true,
        data: optimizationSuggestions
    });
});

// @desc    Generate AI-powered creative variations
// @route   POST /api/marketing/v1/ai/generate-creatives
// @access  Private (Coaches)
exports.generateAICreatives = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const {
        baseCreative,
        productInfo,
        targetAudience,
        variations = 3,
        includeImages = false,
        includeVideos = false
    } = req.body;

    if (!baseCreative || !productInfo || !targetAudience) {
        return res.status(400).json({
            success: false,
            message: 'Base creative, product info, and target audience are required'
        });
    }

    const creativeVariations = await aiMarketingService.generateCreativeVariations(coachId, {
        baseCreative,
        productInfo,
        targetAudience,
        variations,
        includeImages,
        includeVideos
    });

    res.status(200).json({
        success: true,
        data: creativeVariations
    });
});

// @desc    Get AI-powered performance insights
// @route   GET /api/marketing/v1/ai/performance-insights/:campaignId
// @access  Private (Coaches)
exports.getAIPerformanceInsights = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { 
        dateRange = '30d',
        includePredictions = true,
        includeTrends = true,
        includeAnomalies = true
    } = req.query;

    const insights = await aiMarketingService.getPerformanceInsights(coachId, campaignId, {
        dateRange,
        includePredictions,
        includeTrends,
        includeAnomalies
    });

    res.status(200).json({
        success: true,
        data: insights
    });
});

// @desc    Generate AI-powered marketing strategy
// @route   POST /api/marketing/v1/ai/generate-strategy
// @access  Private (Coaches)
exports.generateAIStrategy = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const {
        businessInfo,
        goals,
        budget,
        timeline,
        targetAudience,
        competitors = []
    } = req.body;

    if (!businessInfo || !goals || !budget || !targetAudience) {
        return res.status(400).json({
            success: false,
            message: 'Business info, goals, budget, and target audience are required'
        });
    }

    const strategy = await aiMarketingService.generateMarketingStrategy(coachId, {
        businessInfo,
        goals,
        budget,
        timeline,
        targetAudience,
        competitors
    });

    res.status(200).json({
        success: true,
        data: strategy
    });
});

// ===== DASHBOARD & ANALYTICS =====

// @desc    Get marketing dashboard data
// @route   GET /api/marketing/v1/dashboard
// @access  Private (Coaches/Staff with permission)
exports.getMarketingDashboard = asyncHandler(async (req, res) => {
    // Get coach ID using unified service (handles both coach and staff)
    const coachId = CoachStaffService.getCoachIdForQuery(req);
    const userContext = CoachStaffService.getUserContext(req);
    
    // Log staff action if applicable
    CoachStaffService.logStaffAction(req, 'read', 'marketing', 'get_dashboard', { coachId });
    
    const { 
        dateRange = '30d',
        includeAIInsights = 'true',
        includeRecommendations = 'true'
    } = req.query;

    try {
        const dashboardData = await marketingV1Service.getMarketingDashboard(coachId, {
            dateRange,
            includeAIInsights: includeAIInsights === 'true',
            includeRecommendations: includeRecommendations === 'true'
        });

        res.status(200).json({
            success: true,
            data: dashboardData,
            userContext: {
                isStaff: userContext.isStaff,
                permissions: userContext.permissions
            }
        });
    } catch (error) {
        console.error('Error getting marketing dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get marketing dashboard',
            error: error.message
        });
    }
});

// @desc    Get campaign performance summary
// @route   GET /api/marketing/v1/campaigns/performance-summary
// @access  Private (Coaches)
exports.getCampaignPerformanceSummary = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { 
        dateRange = '30d',
        campaignIds = [],
        includeComparisons = true
    } = req.query;

    const summary = await marketingV1Service.getCampaignPerformanceSummary(coachId, {
        dateRange,
        campaignIds: campaignIds.length > 0 ? campaignIds.split(',') : [],
        includeComparisons
    });

    res.status(200).json({
        success: true,
        data: summary
    });
});

// @desc    Export campaign data
// @route   GET /api/marketing/v1/campaigns/export
// @access  Private (Coaches)
exports.exportCampaignData = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { 
        format = 'csv',
        dateRange = '30d',
        campaignIds = [],
        includeInsights = true
    } = req.query;

    const exportData = await marketingV1Service.exportCampaignData(coachId, {
        format,
        dateRange,
        campaignIds: campaignIds.length > 0 ? campaignIds.split(',') : [],
        includeInsights
    });

    res.status(200).json({
        success: true,
        data: exportData
    });
});

// ===== AUTOMATION & SCHEDULING =====

// @desc    Schedule campaign
// @route   POST /api/marketing/v1/campaigns/:campaignId/schedule
// @access  Private (Coaches)
exports.scheduleCampaign = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { 
        startDate,
        endDate,
        timezone = 'UTC',
        budgetSchedule = null
    } = req.body;

    if (!startDate) {
        return res.status(400).json({
            success: false,
            message: 'Start date is required'
        });
    }

    const scheduledCampaign = await marketingV1Service.scheduleCampaign(coachId, campaignId, {
        startDate,
        endDate,
        timezone,
        budgetSchedule
    });

    res.status(200).json({
        success: true,
        message: 'Campaign scheduled successfully',
        data: scheduledCampaign
    });
});

// @desc    Set up campaign automation rules
// @route   POST /api/marketing/v1/campaigns/:campaignId/automation
// @access  Private (Coaches)
exports.setupCampaignAutomation = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;
    const { 
        rules,
        notifications = true,
        autoOptimize = false
    } = req.body;

    if (!rules || !Array.isArray(rules) || rules.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Automation rules are required'
        });
    }

    const automation = await marketingV1Service.setupCampaignAutomation(coachId, campaignId, {
        rules,
        notifications,
        autoOptimize
    });

    res.status(200).json({
        success: true,
        message: 'Campaign automation setup successfully',
        data: automation
    });
});

// @desc    Get automation status
// @route   GET /api/marketing/v1/campaigns/:campaignId/automation/status
// @access  Private (Coaches)
exports.getAutomationStatus = asyncHandler(async (req, res) => {
    const coachId = req.coachId;
    const { campaignId } = req.params;

    const automationStatus = await marketingV1Service.getAutomationStatus(coachId, campaignId);

    res.status(200).json({
        success: true,
        data: automationStatus
    });
});
