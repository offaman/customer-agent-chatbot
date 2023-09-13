const { createDbConnection } = require('./dbConnection')

module.exports.executeStoredProcedure = async (inputParams, storedProcName) => {
    const sqlDbConnection = await createDbConnection();
    const request = sqlDbConnection.request()
    if (inputParams == undefined || inputParams == null) {
        return request.execute(storedProcName);
    }
    else {
        inputParams.forEach(elementContainingInfo => {
            let {name, dtype, value} = elementContainingInfo;
            request.input(name, dtype, value)
        });

        const result = (await request.execute(storedProcName))
        
        return {
            recordsets : result.recordsets[0],
            recordset : result.recordset,
            output : result.output
        }
    }
}