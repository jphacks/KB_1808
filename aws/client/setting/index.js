const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const tableName = "shikuhack";

  // パラメータはGatewayで保証済み
  const temperature = event['temperature'];
  const error = event['error'];

  const params = {
    TableName: tableName,
    Item: {
      "uuid": "0001", //　今回は固定
      "setting": {
        "temperature" : temperature,
        "error" : error
      }
    }
  }

  // DynamoDBへのPut処理実行
  dynamoDB.put(params).promise().then((data) => {
    console.log("Put Success");
    callback(JSON.stringify({
        "statusCode" : 200
      }));
  }).catch((err) => {
    console.log(err);
    callback(JSON.stringify({
        "statusCode" : 400
      }));
  });

}