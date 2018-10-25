//ポストで送られてくるので、ポストデータ取得
//JSONをパースする
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  //返信するためのトークン取得  
  var status = json.status;
  if (typeof status ==='undefined'){  
    return;
  }

 //返信する内容を作成
  var reply_messages;
  if(status === 100){
    reply_messages = '冷めました';
  }
  else if(status === 200 || status === 300){
    reply_messages = '適温になりました';
  }
  else{
    return;
  }
    
  // メッセージを返信
  sendHttpPost(reply_messages);

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
function sendHttpPost(message){
  var token = '';
  var options =
   {
     "method"  : "post",
     "payload" : "message=" + message,
     "headers" : {"Authorization" : "Bearer "+ token}

   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}
