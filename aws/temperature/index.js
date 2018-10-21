const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2" // DynamoDBのリージョン
});

exports.handler = async (event, context, callback) => {

    // パラメータチェック
    if(event['temperature'] == undefined || event['temperature'] == undefined){
        callback(JSON.stringify(getErrorObj(context, getErrorMessageParameterNotFound())));
    }

    if(typeof event['temperature'] != 'number'){
        callback(JSON.stringify(getErrorObj(context, getErrorMessageParameterNotNumber())));
    }

    // const params = {
    //     TableName: "temperature", // DynamoDBのテーブル名
    //     KeyConditionExpression: "#PartitionKey = :partition-key-data", // 取得するKey情報
    //     ExpressionAttributeNames: {
    //       "#PartitionKey": "uuid", // PartitionKeyのアトリビュート名
    //     },
    //     ExpressionAttributeValues: {
    //       ":partition-key-data": "0001", // 取得したいPartitionKey名
    //     },
    //     ScanIndexForward: false, // 昇順か降順か(デフォルトはtrue=昇順)
    //     Limit: 1 // 取得するデータ件数
    //   }
    
    //   // DynamoDBへのquery処理実行
    //   dynamoDB.query(params).promise().then((data) => {
    //     console.log(data);
        
    //     callback(response);
    //   }).catch((err) => {
    //     console.log(err);
    //     callback(err);
    //   });
    const responseObj = {
        "ratio" : getRatio(event['temperature'], 30, 40)
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(responseObj)
    };

    return response;
};

function getErrorObj(context, message){
    return {
        "statusCode" : 400,
        "requestId" : context.awsRequestId,
        "message" : message
    };
}

function getErrorMessageParameterNotFound(){
    return "Parameter ['temperature'] dosn't found.";
}

function getErrorMessageParameterNotNumber(){
    return "Parameter ['temperature'] isn't Number.";
}

function getRatio(temperature, width, target){

    if(temperature > width + target){
        return 100;
    }
    if(temperature < width - target){
        return 0;
    }
    return parseInt((temperature - target) / width * 100, 10);
}