export const list = (event: any, context: any, callback: any) => {
  console.log('PROCESS', process.env)
  callback(null, {
    statusCode: 200,
    body: 'hi',
  })
}
