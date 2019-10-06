"use strict";

const config = require("../config");
const PersonalizationRepository = require("../infrastructure/repositories/personalizationRepository");
const SynchronizationTask = require("../models/synchronizationTask");
const repository = new PersonalizationRepository();
const queueManager = require("../infrastructure/queueManager");
const logManager = require("../infrastructure/logging/logManager");

module.exports = class PersonalizationService{
    async createJob(syncPersonalizationRequest){
        try {
            const hrstart = process.hrtime();
            let totalRows = await repository.getCount(syncPersonalizationRequest.country,
                syncPersonalizationRequest.campaign,
                syncPersonalizationRequest.personalizationType);
            let parameters = "";
            if(totalRows > 0){
                const totalPages = totalRows > config.batchSize ? Math.ceil(totalRows / config.batchSize) : 1;
    
                console.log("totalPages: ", totalPages, " totalRows:", totalRows );
                parameters = `${syncPersonalizationRequest.correlationId} / totalPages: ${totalPages} / totalRows: ${totalRows}`;
                logManager.logInfo("PersonalizationService", "createJob", parameters, "Proceso iniciado.", 0, syncPersonalizationRequest.country, totalRows);
                let tasks = [];
                let batchCount = 0;

                for (let page = 0; page < totalPages; page++) {
                    const task = new SynchronizationTask(
                        syncPersonalizationRequest.country,
                        syncPersonalizationRequest.campaign,
                        syncPersonalizationRequest.personalizationType,
                        totalRows,
                        page,
                        config.batchSize,
                        syncPersonalizationRequest.correlationId
                    );
                    tasks.push(task);
                    batchCount++;
                    if((batchCount == 10) || (page == totalPages - 1)){                    
                        const response = await queueManager.sendBatch(tasks);
                        console.log("enviando", tasks.length);
                        tasks = [];
                        batchCount = 0;
                    }
                }
            }
            const hrend = process.hrtime(hrstart);
            const executionTimeInMS = (hrend[0] + hrend[1] / 1e6);
            logManager.logInfo("PersonalizationService", "createJob", parameters, "Proceso terminado.", executionTimeInMS, syncPersonalizationRequest.country, totalRows);
        } catch (error) {
            logManager.logError("PersonalizationService", "createJob", syncPersonalizationRequest.correlationId, error.message, syncPersonalizationRequest.country, error, "", "");
        }
    }    
}