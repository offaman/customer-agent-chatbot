const { botRuntimeConfigs, botVariables } = require("../internal/config")
const dbUtilities = require('../botUtilities/utils')


module.exports.addUserInQueue = async(conversationReference, departmentToConnectWith)=>{
    userConversationId = conversationReference.conversation.id
    botRuntimeConfigs.userQueue[userConversationId] ? botRuntimeConfigs.userQueue[userConversationId] : botRuntimeConfigs.userQueue[userConversationId]= {}
    botRuntimeConfigs.userQueue[userConversationId]['conversationRef'] = conversationReference
    botRuntimeConfigs.userQueue[userConversationId]['personalDetails'] = botVariables.constUserDetails
    botRuntimeConfigs.userQueue[userConversationId]['personalDetails']['type'] = botVariables.user
    botRuntimeConfigs.userQueue[userConversationId]['departmentToConnectWith'] = departmentToConnectWith

    if(!botVariables.isQueueTriggered){
        botVariables.isQueueTriggered = true 
        await this.connectQueueUsers();
    }

    return true;
}


module.exports.removeUserFromQueue = (conversationId) =>{
    console.log("User removed from Queue -- " , conversationId)
    delete botRuntimeConfigs.userQueue[conversationId]
}


module.exports.connectQueueUsers = async() =>{
    for(let user in botRuntimeConfigs.userQueue){
        userRequestedDepartment = botRuntimeConfigs.userQueue[user]['departmentToConnectWith']
        // console.log(botRuntimeConfigs.userQueue[user]['conversationRef'])
        // console.log(await dbUtilities.connectCustomerAgent(botRuntimeConfigs.userQueue[user]['conversationRef'], userRequestedDepartment))
        await dbUtilities.connectCustomerAgent(botRuntimeConfigs.userQueue[user]['conversationRef'], userRequestedDepartment) ? this.removeUserFromQueue(user) : 1
    }
    Object.keys(botRuntimeConfigs.userQueue).length ? setTimeout(await this.connectQueueUsers, 5000) : botVariables.isQueueTriggered = false
}