// PRJ_YCT_Final/workers/worker_rules_engine.js

const amqp = require('amqplib');
const mongoose = require('mongoose');

// Import models
const { Lead, Coach, AutomationRule, Appointment, Payment } = require('../schema');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EVENTS_EXCHANGE = 'funnelseye_events';
const ACTIONS_EXCHANGE = 'funnelseye_actions';
const SCHEDULED_ACTIONS_QUEUE = 'funnelseye_scheduled_actions';

// Export this function so it can be called by main.js
const initRulesEngineWorker = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/FunnelsEye');
        

        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertExchange(EVENTS_EXCHANGE, 'topic', { durable: true });
        await channel.assertExchange(ACTIONS_EXCHANGE, 'topic', { durable: true });
        
        // Assert the scheduled actions exchange (x-delayed-message)
        await channel.assertExchange('delayed_actions_exchange', 'x-delayed-message', {
            durable: true,
            arguments: { 'x-delayed-type': 'direct' }
        });

        // Assert the scheduled queue and bind it to the delayed exchange
        await channel.assertQueue(SCHEDULED_ACTIONS_QUEUE, { durable: true });
        await channel.bindQueue(SCHEDULED_ACTIONS_QUEUE, 'delayed_actions_exchange', SCHEDULED_ACTIONS_QUEUE);

        const { queue } = await channel.assertQueue('', { exclusive: true });
        channel.bindQueue(queue, EVENTS_EXCHANGE, '#');

    

        channel.consume(queue, async (msg) => {
            if (msg.content) {
                let eventPayload;
                try {
                    eventPayload = JSON.parse(msg.content.toString());
                    const eventName = msg.fields.routingKey;

                    console.log(`[Rules Engine] Received event: ${eventName}`);

                    // --- Determine the document to fetch based on event name ---
                    let relatedDoc;
                    let rules;

                    // Helper function to find rules (both legacy and graph-based)
                    const findMatchingRules = async (eventName) => {
                        // Find legacy rules
                        const legacyRules = await AutomationRule.find({ 
                            triggerEvent: eventName, 
                            isActive: true,
                            workflowType: { $ne: 'graph' } // Explicitly exclude graph workflows
                        });
                        
                        // Find graph-based rules where trigger node matches event
                        const graphRules = await AutomationRule.find({
                            isActive: true,
                            workflowType: 'graph',
                            'nodes': {
                                $elemMatch: {
                                    type: 'trigger',
                                    nodeType: eventName
                                }
                            }
                        });
                        
                        return [...legacyRules, ...graphRules];
                    };

                    // Extract related document ID from event payload
                    // Event payload structure: { eventName, payload: { leadId, leadData, coachId, ... } }
                    let relatedDocId = null;
                    
                    if (eventName.startsWith('lead_') || eventName.startsWith('funnel_') || eventName.startsWith('form_submitted') || eventName.startsWith('content_consumed')) {
                        relatedDocId = eventPayload.payload?.leadId || eventPayload.leadId || eventPayload.payload?.leadData?._id;
                        if (relatedDocId) {
                            relatedDoc = await Lead.findById(relatedDocId);
                        }
                        rules = await findMatchingRules(eventName);
                    } else if (eventName.startsWith('appointment_') || eventName.startsWith('task_')) {
                        relatedDocId = eventPayload.payload?.appointmentId || eventPayload.appointmentId || eventPayload.payload?.relatedDoc?.appointmentId;
                        if (relatedDocId) {
                            relatedDoc = await Appointment.findById(relatedDocId);
                        }
                        rules = await findMatchingRules(eventName);
                    } else if (eventName.startsWith('payment_') || eventName.startsWith('invoice_') || eventName.startsWith('subscription_') || eventName.startsWith('card_') || eventName.startsWith('payment.')) {
                        relatedDocId = eventPayload.payload?.paymentId || eventPayload.paymentId || eventPayload.payload?.transactionId;
                        if (relatedDocId) {
                            relatedDoc = await Payment.findById(relatedDocId);
                        }
                        rules = await findMatchingRules(eventName);
                    } else if (eventName === 'coach.inactive') {
                        relatedDocId = eventPayload.payload?.coachId || eventPayload.coachId;
                        if (relatedDocId) {
                            relatedDoc = await Coach.findById(relatedDocId);
                        }
                        rules = await findMatchingRules(eventName);
                    } else {
                        console.log(`[Rules Engine] Unhandled event type: ${eventName}. Skipping.`);
                        return channel.ack(msg);
                    }

                    if (!relatedDoc) {
                        console.error(`[Rules Engine] Related document for event '${eventName}' not found. Skipping rule processing.`);
                        return channel.ack(msg);
                    }

                    // Function to execute graph workflow
                    const executeGraphWorkflow = async (rule, eventPayload, relatedDoc, eventName) => {
                        if (!rule.nodes || !rule.edges || rule.nodes.length === 0) {
                            console.warn(`[Rules Engine] Graph workflow "${rule.name}" has no nodes or edges. Skipping.`);
                            return;
                        }

                        // Find trigger node
                        const triggerNode = rule.nodes.find(n => n.type === 'trigger' && n.nodeType === eventName);
                        if (!triggerNode) {
                            console.warn(`[Rules Engine] Graph workflow "${rule.name}" has no matching trigger node for event ${eventName}. Skipping.`);
                            return;
                        }

                        console.log(`[Rules Engine] Executing graph workflow: "${rule.name}" (ID: ${rule._id})`);

                        // Build adjacency list for graph traversal
                        const adjacencyList = {};
                        rule.edges.forEach(edge => {
                            if (!adjacencyList[edge.source]) {
                                adjacencyList[edge.source] = [];
                            }
                            adjacencyList[edge.source].push({
                                target: edge.target,
                                edge: edge
                            });
                        });

                        // Function to evaluate conditions
                        const evaluateConditions = (conditions, eventData) => {
                            if (!conditions || conditions.length === 0) return true;
                            // Simple condition evaluation - can be enhanced
                            return conditions.every(cond => {
                                const fieldValue = getNestedValue(eventData, cond.field);
                                switch (cond.operator) {
                                    case 'equals':
                                        return String(fieldValue) === String(cond.value);
                                    case 'not_equals':
                                        return String(fieldValue) !== String(cond.value);
                                    case 'contains':
                                        return String(fieldValue).toLowerCase().includes(String(cond.value).toLowerCase());
                                    default:
                                        return true;
                                }
                            });
                        };

                        // Helper to get nested value
                        const getNestedValue = (obj, path) => {
                            return path.split('.').reduce((current, prop) => {
                                return current && current[prop] !== undefined ? current[prop] : undefined;
                            }, obj);
                        };

                        // BFS traversal starting from trigger node
                        const visited = new Set();
                        const queue = [{ nodeId: triggerNode.id, delay: 0 }];

                        while (queue.length > 0) {
                            const { nodeId, delay } = queue.shift();
                            
                            if (visited.has(nodeId)) continue;
                            visited.add(nodeId);

                            const currentNode = rule.nodes.find(n => n.id === nodeId);
                            if (!currentNode) continue;

                            // Process current node
                            if (currentNode.type === 'action') {
                                // Extract config from multiple possible locations
                                const actionConfig = currentNode.config || currentNode.data?.config || currentNode.data || {};
                                const actionType = currentNode.nodeType;

                                console.log(`[Rules Engine] Executing action node: ${currentNode.label} (${actionType})`);
                                console.log(`[Rules Engine] Action config:`, JSON.stringify(actionConfig, null, 2));

                                // Ensure relatedDoc is a plain object (not Mongoose document)
                                const relatedDocPlain = relatedDoc.toObject ? relatedDoc.toObject() : relatedDoc;

                                // Build the payload with all necessary data
                                const fullActionPayload = {
                                    actionType: actionType,
                                    config: actionConfig,
                                    payload: {
                                        ...eventPayload,
                                        relatedDoc: relatedDocPlain,
                                        timestamp: new Date().toISOString(),
                                        ruleId: rule._id.toString(),
                                        coachId: rule.coachId?.toString() || relatedDoc?.coachId?.toString() || relatedDocPlain?.coachId?.toString()
                                    }
                                };

                                // Handle delay from delay nodes or action config
                                let totalDelay = delay;
                                if (actionConfig.delayMinutes) {
                                    totalDelay += actionConfig.delayMinutes * 60 * 1000;
                                } else if (actionConfig.delaySeconds) {
                                    totalDelay += actionConfig.delaySeconds * 1000;
                                }

                                if (totalDelay > 0) {
                                    channel.publish(
                                        'delayed_actions_exchange',
                                        SCHEDULED_ACTIONS_QUEUE,
                                        Buffer.from(JSON.stringify(fullActionPayload)),
                                        { headers: { 'x-delay': totalDelay } }
                                    );
                                    console.log(`[Rules Engine] Scheduled action "${actionType}" for event ${eventName} to run in ${totalDelay}ms.`);
                                } else {
                                    channel.publish(
                                        ACTIONS_EXCHANGE,
                                        actionType,
                                        Buffer.from(JSON.stringify(fullActionPayload))
                                    );
                                    console.log(`[Rules Engine] Dispatched immediate action "${actionType}" for event ${eventName}.`);
                                }
                            } else if (currentNode.type === 'delay') {
                                // Calculate delay from delay node
                                const delayConfig = currentNode.config || currentNode.data?.config || {};
                                const delayMs = (delayConfig.delayMinutes || 0) * 60 * 1000 +
                                               (delayConfig.delaySeconds || 0) * 1000 +
                                               (delayConfig.delayHours || 0) * 60 * 60 * 1000;
                                
                                // Add delay to next nodes
                                const nextNodes = adjacencyList[nodeId] || [];
                                nextNodes.forEach(({ target }) => {
                                    queue.push({ nodeId: target, delay: delay + delayMs });
                                });
                                continue;
                            } else if (currentNode.type === 'condition') {
                                // Evaluate condition
                                const conditionConfig = currentNode.data?.conditions || currentNode.config?.conditions || [];
                                const conditionMet = evaluateConditions(conditionConfig, {
                                    ...eventPayload,
                                    relatedDoc: relatedDoc
                                });

                                // Only follow edges if condition is met
                                if (conditionMet) {
                                    const nextNodes = adjacencyList[nodeId] || [];
                                    nextNodes.forEach(({ target }) => {
                                        queue.push({ nodeId: target, delay: delay });
                                    });
                                }
                                continue;
                            }

                            // For other node types or after processing action, continue to next nodes
                            const nextNodes = adjacencyList[nodeId] || [];
                            nextNodes.forEach(({ target }) => {
                                queue.push({ nodeId: target, delay: delay });
                            });
                        }
                    };

                    // Process each rule
                    for (const rule of rules) {
                        if (rule.workflowType === 'graph') {
                            // Execute graph workflow
                            await executeGraphWorkflow(rule, eventPayload, relatedDoc, eventName);
                        } else {
                            // Execute legacy workflow
                            for (const action of rule.actions) {
                                console.log(`[Rules Engine] Triggering action: ${action.type} for event: ${eventName}`);

                                // Build the payload with all relevant data
                                const fullActionPayload = {
                                    actionType: action.type,
                                    config: action.config,
                                    payload: {
                                        ...eventPayload, // Keep original event payload
                                        relatedDoc: relatedDoc, // Add the full document
                                        timestamp: new Date().toISOString(),
                                    }
                                };
                                
                                if (action.config.delayMinutes && action.config.delayMinutes > 0) {
                                    const delayInMilliseconds = action.config.delayMinutes * 60 * 1000;
                                    
                                    channel.publish(
                                        'delayed_actions_exchange',
                                        SCHEDULED_ACTIONS_QUEUE,
                                        Buffer.from(JSON.stringify(fullActionPayload)),
                                        { headers: { 'x-delay': delayInMilliseconds } }
                                    );
                                    
                                    console.log(`[Rules Engine] Scheduled action "${action.type}" for event ${eventName} to run in ${action.config.delayMinutes} minutes.`);
                                } else {
                                    channel.publish(
                                        ACTIONS_EXCHANGE,
                                        action.type,
                                        Buffer.from(JSON.stringify(fullActionPayload))
                                    );
                                    console.log(`[Rules Engine] Dispatched immediate action "${action.type}" for event ${eventName}.`);
                                }
                            }
                        }
                    }
                    channel.ack(msg);
                } catch (error) {
                    console.error('[Rules Engine] Error processing message:', error);
                    // Log the malformed message payload for debugging
                    console.error('Malformed message content:', eventPayload); 
                    channel.nack(msg);
                }
            }
        });
    } catch (error) {
        console.error('[Rules Engine] Failed to initialize worker:', error);
        setTimeout(initRulesEngineWorker, 5000);
    }
};

module.exports = initRulesEngineWorker;