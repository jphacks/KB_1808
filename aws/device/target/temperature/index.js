const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const table = "shikuhack";

    // クエリパラメータはGatewayで保証
    const coasterMac = event['coaster_mac'];

    const params = {
        TableName: table,
        Key: {
            "coaster_mac": coasterMac
        }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(JSON.stringify(getErrorObj(context, "Internal Server Error.")));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            if(data['Item'] === undefined){
                callback(JSON.stringify(getErrorObj(context, "The coaster_mac doesn't register.")));
            }
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
        "status_code" : 400,
        "request_id" : context.awsRequestId,
        "message" : message
    };
}