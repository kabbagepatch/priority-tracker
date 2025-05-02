'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const getHeaders = (contentType) => (contentType ? {
  'Content-Type': contentType,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
} : {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
});

module.exports.list = async (event) => {
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Categories`,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(result.Items),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Categories. ' + error.message,
    };
  }
}
