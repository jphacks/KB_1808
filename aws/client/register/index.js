const AWS = require("aws-sdk");
const https = require('https');

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2" // DynamoDBのリージョン
});

/**
 * "@登録"がトリガー
 */
exports.handler = (event, context, callback) => {
  const tableName = "shikuhack";

  console.log("リクエストが来たよ");

  const clientMessage = getClientMessage(event);

  if(!clientMessage.match(/@register/)){
    console.log("登録じゃないよ");

    callback(null, {
      "statusCode" : 200
    });
    return;
  }

  console.log("登録だよ");

  const coasterMacData = getCoasterMac(clientMessage);
  const lineId = getUserId(event);

  // macアドレス確認
  if(coasterMacData === null){
    pushMessage("登録内容が不正です", lineId);
    callback(null, {
        "statusCode" : 200
      });
    return;
  }

  const coasterMac = coasterMacData[0];

  console.log(coasterMac);

  const params = {
    TableName: tableName,
    Item: {
      "coaster_mac": coasterMac,
      "line_id": lineId,
      // 初期値は固定
      "bank":[
        {
          "mode_id": 1,
          "temperature": 50,
        },
        {
          "mode_id": 2,
          "temperature": 50,
        },
        {
          "mode_id": 3,
          "temperature": 50,
        },
        {
          "mode_id": 4,
          "temperature": 50,
        },
        {
          "mode_id": 5,
          "temperature": 50,
        },
        {
          "mode_id": 6,
          "temperature": 50,
        },
        {
          "mode_id": 7,
          "temperature": 50,
        },
        {
          "mode_id": 8,
          "temperature": 50,
        }
      ]
    }
  }

  // DynamoDBへのPut処理実行
  dynamoDB.put(params).promise().then((data) => {
    console.log("Put Success");
    pushMessage("登録に成功しました", lineId);
    callback(null, {
        "statusCode" : 200
      });
  }).catch((err) => {
    console.log(err);
    pushMessage("登録に失敗しました", lineId);
    callback(null, {
        "statusCode" : 200
      });
  });

}

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

/**
 * eventからLINEから送られてきたメッセージを取得します
 *
 * @param {*} event
 */
function getClientMessage(event){
  const messageData = getMessageData(event);
  const clientMessage = messageData.message.text;
  return clientMessage;
}

/**
 * LINEから送られてきたメッセージからcoaster_macを取得します
 *
 * @param {String} clientMessage
 */
function getCoasterMac(clientMessage){
  const pattern = /[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+-[0-9a-fA-F]+/;
  return clientMessage.match(pattern);
}

/**
 * eventからUserIdを取得します。
 *
 * @param {*} event
 */
function getUserId(event){
  const messageData = getMessageData(event);
  const userId = messageData.source.userId;
  return userId;
}

function getMessageData(event){
  const eventData = JSON.parse(event.body);
  const messageData = eventData.events && eventData.events[0];
  return messageData;
}