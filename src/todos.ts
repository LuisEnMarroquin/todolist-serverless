import { DynamoDB } from "aws-sdk"
import { v4 as uuidv4 } from "uuid"
import { APIGatewayProxyHandler } from "aws-lambda"

const dynamoDb = new DynamoDB.DocumentClient()

export const create: APIGatewayProxyHandler = (event, context, callback) => {
  try {
    if (process.env.DYNAMO_TABLE_TODO === undefined) throw new Error("DYNAMO_TABLE_TODO is undefined")
    if (event.body == null) throw new Error("There is no body present in the request that client sent")

    const timestamp = Date.now()
    const data = JSON.parse(event.body)

    if (typeof data.text !== "string") {
      throw new Error("Couldn't create the todo item")
    }

    const params = {
      TableName: process.env.DYNAMO_TABLE_TODO,
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
      if (error) throw error

      console.log("context", context)
      console.log("result", result)

      callback(null, {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.Item),
      })
    })
  } catch (error) {
    console.error(error)
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the todo item",
    })
  }
}

export const read: APIGatewayProxyHandler = (event, context, callback) => {
  try {
    if (process.env.DYNAMO_TABLE_TODO === undefined) throw new Error("DYNAMO_TABLE_TODO is undefined")
    if (event.pathParameters?.id == null) throw new Error("There is no id present in the URL parameter")

    const params = {
      TableName: process.env.DYNAMO_TABLE_TODO,
      Key: {
        id: event.pathParameters.id,
      },
    }

    // fetch todo from the database
    dynamoDb.get(params, (error, result) => {
      if (error) throw error

      callback(null, {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.Item),
      })
    })
  } catch (error) {
    console.error(error)
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the todo item",
    })
  }
}

export const update: APIGatewayProxyHandler = (event, context, callback) => {
  try {
    if (process.env.DYNAMO_TABLE_TODO === undefined) throw new Error("DYNAMO_TABLE_TODO is undefined")
    if (event.body == null) throw new Error("There is no body present in the request that client sent")
    if (event.pathParameters?.id == null) throw new Error("There is no id present in the URL parameter")

    const timestamp = Date.now()
    const data = JSON.parse(event.body)

    if (typeof data.text !== "string" || typeof data.checked !== "boolean") {
      throw new Error("Couldn't update the todo item")
    }

    const params = {
      TableName: process.env.DYNAMO_TABLE_TODO,
      Key: {
        id: event.pathParameters.id,
      },
      ExpressionAttributeNames: {
        "#todo_text": "text",
      },
      ExpressionAttributeValues: {
        ":text": data.text,
        ":checked": data.checked,
        ":updatedAt": timestamp,
      },
      UpdateExpression: "SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
    }

    // update the todo in the database
    dynamoDb.update(params, (error, result) => {
      if (error) throw error

      callback(null, {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.Attributes),
      })
    })
  } catch (error) {
    console.error(error)
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the todo item",
    })
  }
}

export const list: APIGatewayProxyHandler = (event, context, callback) => {
  try {
    if (process.env.DYNAMO_TABLE_TODO === undefined) throw new Error("DYNAMO_TABLE_TODO is undefined")

    const params = {
      TableName: process.env.DYNAMO_TABLE_TODO,
    }

    // For production workloads you should design your tables and indexes so that your apps can use Query instead of Scan
    dynamoDb.scan(params, (error, result) => {
      if (error) throw error

      callback(null, {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.Items),
      })
    })
  } catch (error) {
    console.error(error)
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the todo items",
    })
  }
}
