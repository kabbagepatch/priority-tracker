'use strict';

const uuid = require('uuid');
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

module.exports.create = async (event) => {
  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);

  if (!data || !data.name || !data.name.trim()) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t create the habit without valid name.',
    };
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Habits`,
    Item: {
      userId: event.queryStringParameters.user,
      habitId: uuid.v1(),
      name: data.name,
      nameLC: data.name.toLowerCase(),
      skipsPerWeekAllowed: data.skipsPerWeekAllowed || 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      headers: getHeaders(),
      body: JSON.stringify(params.Item),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t create the habit. ' + error.message,
    };
  };
}
