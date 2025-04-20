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

const queryTasks = async (params, getComplete=false, userId=null) => {
  try {
    const result = await dynamoDb.query(params).promise();

    const tasks = result.Items.filter(t => (getComplete || !t.complete) && (!userId || t.userId === userId)).sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt));

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(tasks),
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
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
    },
  };

  return await queryTasks(params, event.queryStringParameters.all == 'true');
}

module.exports.listActive = async (event) => {
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "active = :active",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
      ":active": true,
    },
  };

  return await queryTasks(params, event.queryStringParameters.all == 'true');
}

module.exports.listQueued = async (event) => {
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "queued = :queued",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
      ":queued": true,
    },
  };

  return await queryTasks(params, event.queryStringParameters.all == 'true');
}

module.exports.listCategory = async (event) => {
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    IndexName: 'CategoryTaskIndex',
    KeyConditionExpression: "category = :category",
    ExpressionAttributeValues: {
      ":category": event.pathParameters.categoryId,
    },
  };

  return await queryTasks(params, event.queryStringParameters.all == 'true', event.queryStringParameters.user);
}

module.exports.listProject = async (event) => {
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

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

  return await queryTasks(params, event.queryStringParameters.all == 'true', event.queryStringParameters.user);
}
