export const list = (event: any, context: any, callback: any) => {
  console.log("PROCESS", process.env)
  callback(null, {
    statusCode: 200,
    body: `Hello from ${process.env.CURRENT_SLS_STAGE}`,
  })
}
