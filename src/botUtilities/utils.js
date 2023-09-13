const dbUtils = require('../dataAccess/dbUtilities')
const mssql = require('mssql')
const {botStoredProcedures, botRuntimeConfigs, botVariables} = require('../internal/config')
const botActivities = require('../botUtilities/botActivities')
const userQueue = require('./userQueue')



module.exports.makeAgentAvailable = async(agentDetails, conversationReference) =>{
    // u can skip this as we have user info and we can update agent status while authentication
    const inputParams = [
        {name:'agent_email',dtype: mssql.NVarChar, value: agentDetails['email']}
    ]

    const result = await dbUtils.executeStoredProcedure(inputParams, botStoredProcedures.makeAgentAvailable)
    botRuntimeConfigs.availableAgents[conversationReference.conversation.id] = {}
    botRuntimeConfigs.availableAgents[conversationReference.conversation.id]['conversationRef'] = conversationReference
    botRuntimeConfigs.availableAgents[conversationReference.conversation.id]['personalDetails'] = agentDetails
    botRuntimeConfigs.availableAgents[conversationReference.conversation.id]['personalDetails']['type'] = botVariables.agent
    botRuntimeConfigs.availableAgents[conversationReference.conversation.id]['status'] = botVariables.status.available

}


module.exports.makeAgentUnavailable = async(conversationId) =>{
    email = botRuntimeConfigs.availableAgents[conversationId][botVariables.personalDetails][botVariables.agentEmail] 
    const inputParams = [
        {name:'agent_email', dtype: mssql.NVarChar, value: email}
    ]
    await dbUtils.executeStoredProcedure(inputParams, botStoredProcedures.makeAgentUnavailable)
    //remove agent from available agent list
    delete botRuntimeConfigs.availableAgents[conversationId]

    //do not disconnect users if agent is in b/w chat ---- later or show warning
}


module.exports.connectCustomerAgent = async (conversationReference, departmentToConnectWith) => {
    for(let availableAgent in botRuntimeConfigs.availableAgents){
        //botRuntimeConfigs.availableAgents
        let currAvailableAgent = botRuntimeConfigs.availableAgents[availableAgent]
        if(currAvailableAgent[botVariables.personalDetails][botVariables.department] == departmentToConnectWith && currAvailableAgent['status'] === botVariables.status.available){
            botRuntimeConfigs.botConversationReference[conversationReference.conversation.id]['connectedTo'] = currAvailableAgent['conversationRef'].conversation.id            
            botRuntimeConfigs.botConversationReference[currAvailableAgent['conversationRef'].conversation.id]['connectedTo'] = conversationReference.conversation.id
            await this.updateAgentStatus(currAvailableAgent['conversationRef'].conversation.id, botVariables.status.livechat)
            await botActivities.sendMessage( conversationReference, "You are connected with Agent")
            await botActivities.sendMessage(currAvailableAgent['conversationRef'], "You are connected with Customer")
            // await botActivities.sendMessage( botRuntimeConfigs.botConversationReference[currAvailableAgent['conversationRef']], "You are connected with Customer")
            return true;
        }
    }
    // if botRuntimeConfigs.userQueue[userQueue.addUserInQueue(conversationReference, departmentToConnectWith)]

    if(!botRuntimeConfigs.userQueue[conversationReference.conversation.id]){
        userQueue.addUserInQueue(conversationReference, departmentToConnectWith)
        await botActivities.sendMessage(conversationReference, "All agent are busy right now will connect with you shortly")
    }
    return false;

    // no agent make user wait in Queue //
    // check if user alreadt in Queue if yes then not to add it again
    // check for available agent and whether any client is available or not.
}


module.exports.updateAgentStatus = async(conversationId, statusToUpdate) => {
    //remove agent from available agent list
    botRuntimeConfigs.availableAgents[conversationId]['status'] = statusToUpdate
    return true;
}


module.exports.disconnectAgentCustomer = async(conversationReference)=>{
    conversationId = conversationReference.conversation.id
    disconnectTriggeredBy = botRuntimeConfigs.botConversationReference[conversationId][botVariables.personalDetails]['type']
    // disconnect triggered by agent side
    if(disconnectTriggeredBy === botVariables.agent){
        currConnectedCustomer = botRuntimeConfigs.botConversationReference[conversationReference.conversation.id]['connectedTo']
        await botActivities.sendMessage(botRuntimeConfigs.botConversationReference[currConnectedCustomer]['conversationRef'], "You are disconnected. Agent trigger disconnect event")
        this.updateAgentStatus(conversationId, botVariables.status.available)
        delete botRuntimeConfigs.botConversationReference[currConnectedCustomer] //delete disconnected user conversation reference
        delete botRuntimeConfigs.botConversationReference[conversationId]['connectedTo'] // delete connectedTo key from agent 
    }

    // disconnect triggered by customer side 
    else{
        conversationId = conversationReference.conversation.id
        connectedAgent = botRuntimeConfigs.botConversationReference[conversationId]['connectedTo']
        await botActivities.sendMessage(botRuntimeConfigs.botConversationReference[connectedAgent]['conversationRef'], "You are disconnected. Customer trigger disconnect event")
        this.updateAgentStatus(connectedAgent, botVariables.status.available)
        delete botRuntimeConfigs.botConversationReference[conversationId]
        delete botRuntimeConfigs.botConversationReference[connectedAgent]['connectedTo']
        
    }
}


module.exports.transferCustomer = async(agentConversationId, customerConversationId , departmentToTransfer)=>{
    delete botRuntimeConfigs.botConversationReference[agentConversationId]['connectedTo']
    delete botRuntimeConfigs.botConversationReference[customerConversationId]['connectedTo']
    this.updateAgentStatus(agentConversationId, botVariables.status.available)
    this.connectCustomerAgent(botRuntimeConfigs.botConversationReference[customerConversationId]['conversationRef'], departmentToTransfer)
    return true;
}


