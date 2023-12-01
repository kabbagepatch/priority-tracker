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

module.exports.add = async (event) => {
  const timestamp  = new Date().getTime();

  const getProjectParams = {
    TableName: `${process.env.DYNAMODB_TABLE}-Projects`,
    Key: {
      userId: event.queryStringParameters.user,
      id: event.pathParameters.projectId,
    },
  };

  try {
    const result = await dynamoDb.get(getProjectParams).promise();

    if (!result.Item) {
      return {
        statusCode: 401,
        headers: getHeaders('text/plain'),
        body: 'No project found for given id.',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Project. ' + error.message,
    };
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-PrioritisedProjects`,
    Item: {
      userId: event.queryStringParameters.user,
      projectId: event.pathParameters.projectId,
      createdAt: timestamp,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(params.Item),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t create the Priority. ' + error.message,
    };
  };
}
