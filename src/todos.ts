import { DynamoDB } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

const dynamoDb = new DynamoDB.DocumentClient()

export const create = (event: any, context: any, callback: any) => {
  const timestamp = Date.now()
  const data = JSON.parse(event.body)
  if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    callback(new Error("Couldn't create the todo item."))
    return
  }

  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: {
      id: uuidv4(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  }

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error("Couldn't create the todo item."))
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    }
    callback(null, response)
  })
}

export const read = (event: any, context: any, callback: any) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  }

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't fetch the todo item.",
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    }
    callback(null, response)
  })
}

export const update = (event: any, context: any, callback: any) => {
  const timestamp = Date.now()
  const data = JSON.parse(event.body)

  // validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: "Couldn't update the todo item.",
    })
    return
  }

  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#todo_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  }

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't fetch the todo item.",
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    }
    callback(null, response)
  })
}

export const list = (event: any, context: any, callback: any) => {
  // fetch all todos from the database
  const params = {
    TableName: process.env.DYNAMO_TABLE,
  }
  // For production workloads you should design your tables and indexes so that your applications can use Query instead of Scan.
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't fetch the todo items.",
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    }
    callback(null, response)
  })
}
