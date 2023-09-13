require('dotenv').config()

const MSCredentials = {
    botId: process.env.BOT,
    botPassword: process.env.BOT_PASSWORD,
};

const botVariables = {
    agentEmail:'agentEmail',
    agentPassword: 'agentPassword',
    userExists : 'userExists',
    personalDetails : 'personalDetails',
    constUserDetails : {
        name: 'name',
        type : 'user'
    },
    user : 'user',
    agent : 'agent',
    departments : {
        HR : 'HR',
        IT : 'IT'
    },
    department : 'department',
    type: 'type',
    status : {
        livechat : 'livechat',
        available : 'available',
        unavailable : 'unavailable'
    },
    isQueueTriggered : false
}

const botStoredProcedures = {
    getAgentDetails : 'getAgentDetails',
    makeAgentAvailable : 'makeAgentAvailable',
    makeAgentUnavailable : 'makeAgentUnavailable'
}

const botRuntimeConfigs = {
    "botConversationReference" : {},
    "botAdapter": "",
    "availableAgents":{},
    "userQueue" : {}
}

const userBotEvents = {
    isAgentEvent: 'isAgentEvent',
    isCustomerEvent : 'isCustomerEvent'
}

module.exports = {  MSCredentials : MSCredentials,
                    botRuntimeConfigs : botRuntimeConfigs,
                    userBotEvents : userBotEvents,
                    botVariables : botVariables,
                    botStoredProcedures : botStoredProcedures   
};