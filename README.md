# buscador-sync-producer
This is an implementation of producer app. It exposes an rest endpoint with koa, receive a request and then put on a AWS sqs queue. The sencod component (buscador-sync-lambdaConsumer repo) is responsible to get a message queue and read mongodb and finally bulk data to elasticsearch

## Considerations:
the project use at least 2 environment variables, wtith AWS account where the sqs queue is, and endpoint with credentials of mongodb cluster.
AWS_ACCOUNT_ID=youraccountid_here
MONGODB_CR=your_cluster_url_here

You can create a .env file in the root with these variables.
