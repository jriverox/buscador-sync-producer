
require("dotenv").config();

const config = {
    port: 3000,
    batchSize: 15000,
    mongodb: {
        PE: {
            connectionString: process.env.MONGODB_PE,
            database: "BelcorpPeru"
        },
        CL: {
            connectionString: process.env.MONGODB_CL,
            database: "BelcorpChile"
        },        
        PA: {
            connectionString: process.env.MONGODB_PA,
            database: "BelcorpPanama"
        },
        CO: {
            connectionString: process.env.MONGODB_CO,
            database: "BelcorpColombia"
        },        
        CR: {
            connectionString: process.env.MONGODB_CR,
            database: "costaricadb"
        }
    },
    sqs:{
        region: "us-east-1",
        accountId: process.env.AWS_ACCOUNT_ID,
        personalizationQueue: "buscador_sync_queue"
    },
    elasticLogging: {
        endpoint: "https://search-qas-atd-f5uoi2tmrjd2i7rtdhfglnr7le.us-west-2.es.amazonaws.com",
        pattern: "dev-buscador-sync2-",
        type: "LogEvent",
        enabledInfo: true,
        enabledError: true,
        application: "Producer"
    }

};

module.exports = config;