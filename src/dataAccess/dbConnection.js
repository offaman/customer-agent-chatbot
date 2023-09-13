const mssql = require('mssql')
require('dotenv').config()

async function createDbConnection(){
  sqlConfig = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    server: "CBLLAP1976",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 3000,
    },
    options: {
        trustServerCertificate: true, 
    },
  };
  let connectionPool = await mssql.connect(sqlConfig);
  return connectionPool; 
}


module.exports = {createDbConnection : createDbConnection}