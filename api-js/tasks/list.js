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

const queryTasks = async (params, userId=null) => {
  try {
    const result = await dynamoDb.query(params).promise();

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(result.Items.sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt)).filter(t => !t.complete && (!userId || t.userId === userId))),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Tasks. ' + error.message,
    };
  }
}

module.exports.list = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
    },
  };

  return await queryTasks(params);
}

module.exports.listActive = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "active = :active",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
      ":active": true,
    },
  };

  return await queryTasks(params);
}

module.exports.listQueued = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "queued = :queued",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
      ":queued": true,
    },
  };

  return await queryTasks(params);
}

module.exports.listCategory = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    IndexName: 'CategoryTaskIndex',
    KeyConditionExpression: "category = :category",
    ExpressionAttributeValues: {
      ":category": event.pathParameters.categoryId,
    },
  };

  return await queryTasks(params);
}

module.exports.listProject = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    IndexName: 'ProjectTaskIndex',
    KeyConditionExpression: "#project = :project",
    ExpressionAttributeNames: {
      '#project': 'project'
    },
    ExpressionAttributeValues: {
        ":project": event.pathParameters.projectId,
    },
  };

  return await queryTasks(params, event.queryStringParameters.user);
}
