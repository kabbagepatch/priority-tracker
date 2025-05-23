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
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);

  if (!data || !data.name || !data.name.trim()) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t create the category without valid name.',
    };
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Categories`,
    Item: {
      userId: event.queryStringParameters.user,
      id: uuid.v1(),
      name: data.name,
      nameLC: data.name.toLowerCase(),
      description: data.description,
      color: data.color,
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
      body: 'Couldn\'t create the Category. ' + error.message,
    };
  };
}
