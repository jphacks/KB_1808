const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2" // DynamoDBのリージョン
});

exports.handler = (event, context, callback) => {
  const temperature = event['temperature'];
  const error = event['error'];
  const params = {
    TableName: "hakuhuck", // DynamoDBのテーブル名
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