const {createDbConnection} = require("../dataAccess/dbConnection")
const { botStoredProcedures } = require('../internal/config')

module.exports.authenticateAgent = async(agentEmail, agentPassword)=>{
    const sqlDbConnection = await createDbConnection()
    const request =  sqlDbConnection.request()
    request.input('agentEmail', agentEmail)
    request.input('agentPassword', agentPassword)
    const result = await request.execute(botStoredProcedures.getAgentDetails)
    //if agent exists then make agent Available
    result.recordsets[0][0] && Object.keys(result.recordsets[0][0]).length ?  result['userExists'] = true: result['userExists'] = false
    return result
}
