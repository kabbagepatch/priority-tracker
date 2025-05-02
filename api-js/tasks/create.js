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

  const requiredFields = ['name', 'category'];
  for (const field of requiredFields) {
    if (!data || !data[field] || !data[field].trim()) {
      return {
        statusCode: 400,
        headers: getHeaders('text/plain'),
        body: `Couldn\'t create the task without valid ${field}.`,
      };
    }
  };

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    Item: {
      userId: event.queryStringParameters.user,
      id: uuid.v1(),
      name: data.name,
      nameLC: data.name.toLowerCase(),
      link: data.link,
      taskstatus: data.status || 'backlog',
      category: data.category,
      project: data.project || 'none',
      order: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      headers: getHeaders(),
      body: JSON.stringify({ status: data.status, ...params.Item }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t create the Task. ' + error.message,
    };
  };
}
