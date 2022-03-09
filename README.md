# ToDoList Serverless

AWS Lambda, DynamoDB and Serverless Framework multi environment backend

## Create a user for Serverless

Create user `todolist-serverless` with `Programmatic access` and add `AdministratorAccess` managed policy

Add your credentials to GitHub Action Secrets (`AWS_KEY` and `AWS_SECRET`) and watch the magic happen!

## Add a custom domain to all envs

1. Issue a certificate for the domain in the same region of serverless project, in my case `us-east-2`
2. Go to `API Gateway` > `Custom domain names` > `Create`, fill it and choose `Regional` endpoint type
3. In the created domain there is `API Gateway domain name`, you'll need to point a `CNAME` record to it
4. Finally go to `API mappings` and create the mappings, in my case `main` and `prod` with stage `$default`

## Remove a stage from AWS console

1. Go to `API Gateway` > `Custom domain names` > `API mappings` and remove the stage that you want to remove
2. Go to `S3` and delete the bucket of the stage: `todolist-serverless-STAGE-serverlessdeploymentbuck-XXXXXX`
3. Go to `CloudFormation` and delete the stack of the stage that you will delete: `todolist-serverless-STAGE`
4. Go to `DynamoDB` > `Tables` and remove the table: `todolist-serverless-STAGE-todo` (all data will be lost)
