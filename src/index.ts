import { APIGatewayProxyHandler } from "aws-lambda"

export const list: APIGatewayProxyHandler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: `Hello from ${process.env.CURRENT_SLS_STAGE}`,
  })
}
