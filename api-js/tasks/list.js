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

const queryTasks = async (params) => {
  try {
    const result = await dynamoDb.query(params).promise();

    const tasks = result.Items
      .sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt))
      .map(t => ({ ...t, status: t.taskstatus }));

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

  let params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
    },
  };

  const status = event.queryStringParameters?.status;
  if (status) {
    params = {
      TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
      IndexName: 'TaskStatusIndex',
      KeyConditionExpression: "#userId = :userId and #status = :status",
      ExpressionAttributeNames: {
        '#userId': 'userId',
        '#status': 'taskstatus'
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":userId": event.queryStringParameters.user,
      },
    };
  }

  return await queryTasks(params);
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
    IndexName: 'TaskProjectIndex',
    KeyConditionExpression: "#userId = :userId and #project = :project",
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#project': 'project'
    },
    ExpressionAttributeValues: {
      ":userId": event.queryStringParameters.user,
      ":project": event.pathParameters.projectId,
    },
  };

  return await queryTasks(params);
}
