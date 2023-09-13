require('dotenv').config()
const {MessageFactory, CardFactory} = require("botbuilder")
const {botRuntimeConfigs} = require('../internal/config')


module.exports.sendAdaptiveCard = async(conversationReference , adaptiveCard)=>{
    await botRuntimeConfigs.botAdapter.continueConversationAsync(process.env.BOT_ID, conversationReference, async (sendContext) => {
        await sendContext.sendActivity(MessageFactory.attachment(CardFactory.adaptiveCard(adaptiveCard)))
    })
}

module.exports.sendMessage = async(conversationReference, message) =>{
    await botRuntimeConfigs.botAdapter.continueConversationAsync(process.env.BOT_ID, conversationReference, async (sendContext) => {
        await sendContext.sendActivity(message)
    })
}

module.exports.sendEvent = async(conversationReference, eventName) =>{
    await botRuntimeConfigs.botAdapter.continueConversationAsync(process.env.BOT_ID, conversationReference, async (sendContext) => {
        await sendContext.sendActivity({
            type: 'event',
            name: eventName
        })
    })
}