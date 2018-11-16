const AWS = require("aws-sdk");
const https = require('https');
const querystring = require('querystring');

AWS.config.update({
  region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {

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
        return;
      }

      const lineId = data['Item'].line_id;

      pushMessage("最適な温度になりました", lineId);

      callback(null, {
        "statusCode": 200
      });
    }
  });

  callback(null, 'Success!');
};

function pushMessage(message, lineId){
  const ChannelAccessToken = process.env['CHANNEL_ACCESS_TOKEN'];

  const postData = JSON.stringify({
    "messages": [{
    "type": "text",
    "text": message
    }],
    "to": lineId
  });

  const options = {
    hostname: 'api.line.me',
    path: '/v2/bot/message/push',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': 'Bearer ' + ChannelAccessToken
    },
    method: 'POST',
  };

  //APIリクエスト
  const req = https.request(options, function(res){
    res.setEncoding('utf8');
    res.on('data', function (body) {
      console.log(body);
    });
  }).on('error', function(e) {
    console.log(e);
  });

  req.on('error', function(e) {
    const message = "通知に失敗しました. LINEから次のエラーが返りました: " + e.message;
    console.error(message);
  });

  req.write(postData);
  req.on('data', function (body) {
    console.log(body);
  });
  req.end();
}

function getErrorObj(context, message){
  return {
    "status_code" : 400,
    "request_id" : context.awsRequestId,
    "message" : message
  };
}
