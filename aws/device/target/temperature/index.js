const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const table = "shikuhack";

    // クエリパラメータはGatewayで保証
    const coasterMac = event['coaster_mac'];

    // キーだけなら他の方法がよい
    const params = {
        TableName: table,
        Key: {
            "coaster_mac": coasterMac
        }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, getErrorObj(context, "Internal Server Error."));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            callback(null, {
                "statusCode": 200,
                headers: {},
                body: JSON.stringify(data["Item"])
            });
        }
    });

}

function getErrorObj(context, message){
    return {
        "statusCode" : 400,
        "requestId" : context.awsRequestId,
        "message" : message
    };
}