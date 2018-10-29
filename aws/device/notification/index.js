const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

}