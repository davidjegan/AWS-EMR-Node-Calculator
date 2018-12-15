var aws = require('aws-sdk');
var config = {
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  endpoint: "dynamodb.us-east-1.amazonaws.com",
  region: "us-east-1"
};
aws.config.update(config);
var dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});
exports.handler = function(event, context, callback) {
    dynamodb.scan({TableName: 'your-table-name'}, (err, data) => {
        callback(null, data['Items']);
    });
};