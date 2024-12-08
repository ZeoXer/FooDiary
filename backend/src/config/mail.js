const AWS = require('aws-sdk');
require('dotenv').config();

const sesClient = new AWS.SES({
    apiVersion: '2012-10-17',
    region: 'ap-southeast-2',
    accessKeyId: process.env.Mail_AccessKeyId,
    secretAccessKey: process.env.Mail_SecretAccessKey
});

module.exports = { sesClient };