# ToDoList Serverless

AWS Lambda, DynamoDB and Serverless Framework multi environment backend

## Create a user for Serverless

Create user `todolist-serverless` with `Programmatic access`, go to `Managed policies` and attach `AdministratorAccess`

## Remove a stage from AWS console

1. Go to `API Gateway` > `Custom domain names` > `API mappings` and remove the stage that you want to remove
2. Go to `S3` and delete the bucket of that stage: `todolist-serverless-STAGE-serverlessdeploymentbuck-SOMETHING`
3. Go to `CloudFormation` and delete the stack of the stage that you will delete: `todolist-serverless-STAGE`
4. Go to `DynamoDB` > `Tables` and remove the table: `todolist-serverless-STAGE-todo` (all data will be lost)

## Usage

You can create, retrieve, update, or delete todos with the following commands:

### Create a Todo

```bash
curl -X POST https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos --data '{ "text": "Learn Serverless" }'
```

Example Result:

```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### List all Todos

```bash
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos
```

Example output:

```bash
[{"text":"Deploy my first service","id":"ac90feaa11e6-9ede-afdfa051af86","checked":true,"updatedAt":1479139961304},{"text":"Learn Serverless","id":"206793aa11e6-9ede-afdfa051af86","createdAt":1479139943241,"checked":false,"updatedAt":1479139943241}]%
```

### Get one Todo

```bash
# Replace the <id> part with a real id from your todos table
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos/<id>
```

Example Result:

```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### Update a Todo

```bash
# Replace the <id> part with a real id from your todos table
curl -X PUT https://XXXXXXX.execute-api.us-east-1.amazonaws.com/todos/<id> --data '{ "text": "Learn Serverless", "checked": true }'
```

Example Result:

```bash
{"text":"Learn Serverless","id":"ee6490d0-aa11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":true,"updatedAt":1479138570824}%
```

https://www.serverless.com/blog/serverless-api-gateway-domain/
