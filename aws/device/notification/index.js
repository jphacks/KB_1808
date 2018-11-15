const AWS = require("aws-sdk");
const https = require('https');
const querystring = require('querystring');

AWS.config.update({
  region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {

  const ChannelAccessToken = process.env['CHANNEL_ACCESS_TOKEN'];
  const id = "U7b8ca61f99ffbc2e31a6e460614cc648";

  const postData = JSON.stringify({
    "messages": [{
    "type": "text",
    "text": "最適な温度になりました！"
    }],
    "to": id
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
  const req = https.request(options,  function(res){
    res.setEncoding('utf8');
    res.on('data', function (body) {
      console.log(body);
      context.succeed('handler complete');
    });
  }).on('error', function(e) {
    context.done('error', e);
    console.log(e);
  });

  req.on('error', function(e) {
    const message = "通知に失敗しました. LINEから次のエラーが返りました: " + e.message;
    console.error(message);
    context.fail(message);
  });

  req.write(postData);
  req.on('data', function (body) {
    console.log(body);
  });
  req.end();

  callback(null, 'Success!');
};
