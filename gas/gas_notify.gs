//�|�X�g�ő����Ă���̂ŁA�|�X�g�f�[�^�擾
//JSON���p�[�X����
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  //�ԐM���邽�߂̃g�[�N���擾  
  var status = json.status;
  if (typeof status ==='undefined'){  
    return;
  }

 //�ԐM������e���쐬
  var reply_messages;
  if(status === 100){
    reply_messages = '��߂����';
  }
  else if(status === 200 || status === 300){
    reply_messages = '�ʂ邭�Ȃ������';
  }
  else{
    return;
  }
    
  // ���b�Z�[�W��ԐM
  sendHttpPost(reply_messages);

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
function sendHttpPost(message){
  var token = 'RJLzO2qt1tFhPi827WCHNAI7IbEZAOd3JM3i099Ir0l';
  var options =
   {
     "method"  : "post",
     "payload" : "message=" + message,
     "headers" : {"Authorization" : "Bearer "+ token}

   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}