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

const updateTask = async (params) => {
  try {
    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify({ ...result.Attributes, status: result.Attributes.taskstatus }),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Task update failed. ' + error.message,
    };
  };
}

module.exports.update = async (event) => {
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);

  const requiredFields = ['name', 'category'];
  requiredFields.forEach(field => {
    if (!data || data[field] === '' || (data[field] && data[field].trim() === '')) {
      return {
        statusCode: 400,
        headers: getHeaders('text/plain'),
        body: 'Task update failed. Invalid fields passed in',
      };
    }
  })

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    Key: {
      userId: event.queryStringParameters.user,
      id: event.pathParameters.id,
    },
    UpdateExpression: "SET ",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    ReturnValues: 'ALL_NEW',
  };

  const allowedFields = ['name', 'link', 'category', 'project', 'order', 'status'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null) {
      params.UpdateExpression += `#${field === 'status' ? 'taskstatus' : field} = :${field === 'status' ? 'taskstatus' : field},`;
      params.ExpressionAttributeNames[`#${field === 'status' ? 'taskstatus' : field}`] = field === 'status' ? 'taskstatus' : field;
      params.ExpressionAttributeValues[`:${field === 'status' ? 'taskstatus' : field}`] = data[field];

      if (field === 'name') {
        params.UpdateExpression += `#nameLC = :nameLC,`;
        params.ExpressionAttributeNames[`#nameLC`] = 'nameLC';
        params.ExpressionAttributeValues[`:nameLC`] = data[field].toLowerCase();
      }
    }
  });
  params.UpdateExpression += `#updatedAt = :updatedAt`;
  params.ExpressionAttributeNames['#updatedAt'] = 'updatedAt';
  params.ExpressionAttributeValues[':updatedAt'] = timestamp;

  return await updateTask(params);
}

module.exports.updateStatus = async (event) => {
  if (!event.queryStringParameters?.user) {
    return {
      statusCode: 401,
      headers: getHeaders(),
    }
  }

  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);
  if (!data || !data.status || !data.status.trim()) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Task update failed. No status passed in',
    };
  }
  if (['complete', 'active', 'queued', 'backlog'].indexOf(data.status) === -1) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Task update failed. Invalid status passed in',
    };
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    Key: {
      userId: event.queryStringParameters.user,
      id: event.pathParameters.id,
    },
    UpdateExpression: "SET #taskstatus = :taskstatus, #updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      '#taskstatus': 'taskstatus',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':taskstatus': data.status,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  };

  return await updateTask(params);
}
