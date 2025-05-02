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
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const getTasksParams = {
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

  const deleteProjectParams = {
    TableName: `${process.env.DYNAMODB_TABLE}-Projects`,
    Key: {
      userId: event.queryStringParameters.user,
      id: event.pathParameters.projectId,
    },
  };

  try {
    const result = await dynamoDb.query(getTasksParams).promise();
    const tasks = result.Items;
    for (const task of tasks) {
      const deleteTaskParams = {
        TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
        Key: {
          userId: event.queryStringParameters.user,
          id: task.id,
        },
      };
      await dynamoDb.delete(deleteTaskParams).promise();
    }

    await dynamoDb.delete(deleteProjectParams).promise();

    return {
      statusCode: 204,
      headers: getHeaders(),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t delete the Project. ' + error.message,
    };
  }
}
