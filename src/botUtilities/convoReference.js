require('dotenv').config
const { ActivityTypes,  TurnContext } = require('botbuilder');
const {botRuntimeConfigs} = require('../internal/config')



// module.exports.createCoversationReference = async(userDetail, context, botAdapter) => {

//     const conversationReference =  TurnContext.getConversationReference(context.activity);

//     // console.log(conversationReference.user.id)
//     // conversationReference.user.name = userDetail['email']

//     // const userConversationReference = {
//     //     user: { id:  conversationReference.user.id}, 
//     //     conversation: { id: conversationReference.conversation.id }, 
//     //     serviceUrl: conversationReference.serviceUrl,
//     // };

//     // const userContext = new TurnContext(botAdapter, { conversation: { id: conversationReference.conversation.id } });

//     // const userContext =  new TurnContext(botAdapter, userConversationReference)

    
//     await botAdapter.continueConversationAsync("f3bb96bb-4632-4582-92e1-9d99fa3825dc",conversationReference, async (sendContext) => {
//         await sendContext.sendActivity("THis is working in continue conversation")
//     })

//     // await userContext.sendActivity("THis is working out")

//     // const message = {
//     //     type: ActivityTypes.Message,
//     //     text: 'Hello, this is a message from the bot.',
//     // };
    
//     // // Send the message to the specific conversation ID
//     // userContext.sendActivity(message).then(() => {
//     //     // Message sent successfully
//     // }).catch((err) => {
//     //     console.error(err);
//     //     // Handle any errors that occur during message sending
//     // });
// }


module.exports.createCoversationReference = async(personalDetails, conversationReference, botAdapter) => {

    botRuntimeConfigs.botConversationReference[conversationReference.conversation.id] = {}
    botRuntimeConfigs.botConversationReference[conversationReference.conversation.id]['conversationRef'] = conversationReference
    botRuntimeConfigs.botConversationReference[conversationReference.conversation.id]['personalDetails'] = personalDetails
    
}