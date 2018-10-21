//CHANNEL_ACCESS_TOKENを設定
//LINE developerで登録をした、自分のCHANNEL_ACCESS_TOKENを入れて下さい
var CHANNEL_ACCESS_TOKEN = '3qEsdrwpZZj0fhuvSBl9FZ9AO0fXF2wuzjMi+QP56eVmNUJ5BTMJqTLIgVyvjPMAyj9qtka3LqrgDv/Q+lPtH/D+waAJB8D/lSv13xJo27pezLDcwY5VJ2P4UeUKAuwwBcFEyJsWvXNLPDPJu/nBhAdB04t89/1O/w1cDnyilFU='; 
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
var aws_endpoint = 'https://31j3bqwtu6.execute-api.us-west-2.amazonaws.com/hakuhuck/setting';


//ポストで送られてくるので、ポストデータ取得
//JSONをパースする
function doPost(e) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("シート1");
  var range_temp = sheet.getRange(1, 2);
  var range_tole = sheet.getRange(2, 2);
  
  var json = JSON.parse(e.postData.contents);
  //返信するためのトークン取得
  var reply_token= json.events[0].replyToken;
  
  var templetures = /温度:[0-9,.]+/;
  var tolerance = /通知範囲:[0-9,.]+/;
  
  
  //送られたLINEメッセージを取得
  var user_temprature;
  user_temprature = json.events[0].message.text.match(templetures)[0].replace('温度:',"");
  var user_tolerance;
  user_tolerance = json.events[0].message.text.match(tolerance)[0].replace('通知範囲:',"");
  
  
  var reply_messages;
  var messages;  
  
  if(typeof reply_token === 'undefined'){
    return;
  }   
  
  //返信する内容を作成
  reply_messages = ['設定しました\n設定はこちらで確認できます' + 'http://rurito0125technology.blogspot.com/',];
  // メッセージを返信
  messages = reply_messages.map(function (v) {
    return {'type': 'text','text': v};    
  });  
  
  range_temp.setValue(user_temprature);
  range_tole.setValue(user_tolerance);
  
  UrlFetchApp.fetch(aws_endpoint,{
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'method': 'post',
    'payload': JSON.stringify({
      "temperature" : user_temprature,
      "error" : user_tolerance,
    }),
  });
  
  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token, 
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}