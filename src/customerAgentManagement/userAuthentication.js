const {createDbConnection} = require("../dataAccess/dbConnection")
const { botStoredProcedures } = require('../internal/config')


module.exports.authenticateUser = async(userEmail, agentPassword)=>{
    const sqlDbConnection = await createDbConnection()
    const request =  sqlDbConnection.request()
    request.input('agentEmail', agentEmail)
    request.input('agentPassword', agentPassword)
    const result = await request.execute(botStoredProcedures.getAgentDetails)
    result.recordsets[0][0] && Object.keys(result.recordsets[0][0]).length ?  result['userExists'] = true : result['userExists'] = false
    return result
}