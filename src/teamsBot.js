const { TeamsActivityHandler, CardFactory, TurnContext , ActivityTypes, MessageFactory, ActivityHandler} = require("botbuilder");
const { botRuntimeConfigs, userBotEvents, botVariables } = require("./internal/config")
const userAuth = require("./customerAgentManagement/agentAuthentication")
const agentAuthAdaptiveCard = require('./adaptiveCards/authenticationCard.json')
const botActivities = require('./botUtilities/botActivities')
const convoReference = require('./botUtilities/convoReference')
const botUtils = require('./botUtilities/utils')


class TeamsBot extends TeamsActivityHandler{
    constructor(){
        super();

        

        this.onConversationUpdate(async(context, next)=>{
            
            botRuntimeConfigs.botAdapter = context.adapter;
            await next();
        })

        this.onMembersAdded(async(context, next)=>{
            let conversationReference =  TurnContext.getConversationReference(context.activity);
            await botActivities.sendAdaptiveCard(conversationReference, agentAuthAdaptiveCard)
            await next();
        })

        this.onEvent(async(context, next)=>{
            await next();
        })

        this.onMessage(async(context, next)=>{
            
            //if user messages direct without dept info to connect with
            //
            const conversationReference =  TurnContext.getConversationReference(context.activity);
            
            const userData = context.activity.value ? context.activity.value : ""
            switch(userData.eventType){
                case (userBotEvents.isAgentEvent):
                    // botVariables.agentId = conversationReference.conversation.id
                    const dbresult = await userAuth.authenticateAgent(userData[botVariables.agentEmail], userData[botVariables.agentPassword])
                    dbresult[botVariables.userExists] ? (await convoReference.createCoversationReference(dbresult.recordsets[0][0], conversationReference , botRuntimeConfigs.botAdapter), 
                                                        await botUtils.makeAgentAvailable(dbresult.recordsets[0][0], conversationReference) )
                                                        : await botActivities.sendAdaptiveCard(conversationReference,  agentAuthAdaptiveCard)
                    break;

                case (userBotEvents.isCustomerEvent):
                    await convoReference.createCoversationReference(botVariables.constUserDetails, conversationReference, botRuntimeConfigs.botAdapter)
                    let msg  = "To which department you want to connect : HR, IT"
                    await botActivities.sendMessage(conversationReference, msg)
                    // botRuntimeConfigs.botConversationReference[conversationReference.conversation.id]['connectedTo'] = botVariables.agentId
                    // botRuntimeConfigs.botConversationReference[botVariables.agentId]['connectedTo'] = conversationReference.conversation.id 
                    break;     
                

                // if user is sending message without any creatConverstaionRef or any specific department.

                default:
                    // console.log(botRuntimeConfigs.availableAgents)
                    let incomingMessage = context.activity.text
                    incomingMessage.includes('tfr') ? incomingMessage = context.activity.text.split(" ")[0] : incomingMessage = context.activity.text
                    switch(incomingMessage){
                        case (botVariables.departments.HR):
                            await botUtils.connectCustomerAgent(conversationReference, incomingMessage)
                            break;
                        case (botVariables.departments.IT):
                            await botUtils.connectCustomerAgent(conversationReference, incomingMessage)
                            break;
                        case 'disconnect':
                            await botUtils.disconnectAgentCustomer(conversationReference)
                            break;
                        case 'tfr':
                            // transfer customer tfr to HR, IT
                            const agentConversationId = conversationReference.conversation.id
                            const customerConversationId = botRuntimeConfigs.botConversationReference[agentConversationId]['connectedTo']
                            const agentTextArray = context.activity.text.split(" ")
                            const departmentToTransferCustomer = agentTextArray[(agentTextArray.length) - 1]
                            botUtils.transferCustomer(agentConversationId, customerConversationId,departmentToTransferCustomer)
                            break;
                        default:
                            let message = context.activity.text
                            await botActivities.sendMessage(botRuntimeConfigs.botConversationReference[[botRuntimeConfigs.botConversationReference[conversationReference.conversation.id]['connectedTo']]]['conversationRef'], message)
                    }

            }

            await next();
        })
    }
}

module.exports.TeamsBot = TeamsBot;