const AWS = require("aws-sdk");

exports.handler = async (event, context, callback) => {

    // パラメータチェック
    if(event['temperature'] == undefined || event['temperature'] == undefined){
        callback(JSON.stringify(getErrorObj(context, getErrorMessageParameterNotFound())));
    }

    if(typeof event['temperature'] != 'number'){
        callback(JSON.stringify(getErrorObj(context, getErrorMessageParameterNotNumber())));
    }

    const responseObj = {
        // 実際はDBからユーザ設定を取得する
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