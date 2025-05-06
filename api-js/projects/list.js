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
    TableName: `${process.env.DYNAMODB_TABLE}-Projects`,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "complete <> :complete",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
      ":complete": true,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    const projects = result.Items.sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt))

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(projects),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Projects. ' + error.message,
    };
  }
}

module.exports.listCategory = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Projects`,
    IndexName: 'CategoryProjectIndex',
    KeyConditionExpression: "category = :category",
    ExpressionAttributeValues: {
      ":category": event.pathParameters.categoryId,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    const projects = result.Items.sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt))

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(projects),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Projects. ' + error.message,
    };
  }
}
