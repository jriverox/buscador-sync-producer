"use strict";

const config = require("../config");
const PersonalizationRepository = require("../infrastructure/repositories/personalizationRepository");
const SynchronizationTask = require("../models/synchronizationTask");
const repository = new PersonalizationRepository();
const queueManager = require("../infrastructure/queueManager");

module.exports = class PersonalizationService{
    async createJob(syncPersonalizationRequest){
        try {
            const hrstart = process.hrtime();
            let totalRows = await repository.getCount(syncPersonalizationRequest.country,
                syncPersonalizationRequest.campaign,
                syncPersonalizationRequest.personalizationType);
    
            if(totalRows > 0){
                const totalPages = totalRows > config.batchSize ? Math.ceil(totalRows / config.batchSize) : 1;
    
                console.log("totalPages: ", totalPages, " totalRows:", totalRows );
    
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
            console.log(`Ready, documents sended to queue: ${totalRows}, execution time: ${(hrend[0] + hrend[1] / 1e9).toFixed(2)} seconds`);            
        } catch (error) {
            console.log("Error:", error);
        }
    }    
}