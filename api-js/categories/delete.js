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

module.exports.delete = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Categories`,
    Key: {
      userId: 'kavish',
      id: event.pathParameters.categoryId,
    },
  };

  try {
    await dynamoDb.delete(params).promise();

    return {
      statusCode: 204,
      headers: getHeaders(),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t delete the Category. ' + error.message,
    };
  }
}
