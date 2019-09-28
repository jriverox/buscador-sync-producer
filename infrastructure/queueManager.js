const config = require("../config");
const AWS = require('aws-sdk'); 
AWS.config.update({region: config.sqs.region});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});


module.exports = {
    async send(synchronizationTask){
        const params = {
            MessageBody: JSON.stringify(synchronizationTask),
            QueueUrl: this.getQueueUrl()
        };

        const response = await sqs.sendMessage(params).promise();
        return response.MessageId;
    },
    getQueueUrl(){
        return `https://sqs.${config.sqs.region}.amazonaws.com/${config.sqs.accountId}/${config.sqs.personalizationQueue}`;
    },
    sendBatch(synchronizationTasks){
        return new Promise((resolve, reject) => {
            const messages = synchronizationTasks.map((task, i) => {
                return {
                    Id: `task-${i}`,
                    MessageBody: JSON.stringify(task),
                }
            });
    
            const params = {
                Entries: messages,
                QueueUrl: this.getQueueUrl()
            };
            //const response = await sqs.sendMessageBatch(params);
            sqs.sendMessageBatch(params, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
              });
        });
        //return response;
    },
    async receive(){
        const params = {
            QueueUrl: this.getQueueUrl(),
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 0,
            WaitTimeSeconds: 0
          };

        const data = await sqs.receiveMessage(params).promise();
        let synchronizationTask = null;
        if(data.Messages && data.Messages.length){
            synchronizationTask = JSON.parse(data.Messages[0].Body);
            synchronizationTask.receiptHandle = data.Messages[0].ReceiptHandle;
        }
        
        return synchronizationTask;
    },
    async delete(receiptHandle){
        const deleteParams = {
            QueueUrl: this.getQueueUrl(),
            ReceiptHandle: receiptHandle
          };
          await sqs.deleteMessage(deleteParams).promise();
    }
}