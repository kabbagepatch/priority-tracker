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
      body: JSON.stringify(result.Attributes),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t update the Task. ' + error.message,
    };
  };
}

module.exports.active = async (event) => {
  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    Key: {
      userId: event.queryStringParameters.user,
      id: event.pathParameters.id,
    },
    UpdateExpression: "SET #active = :active,",
    ExpressionAttributeNames: {
      '#active': 'active',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':active': data.status === false ? false : true,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  };

  if (data.status !== false) {
    for (const field of ['complete', 'queued']) {
      params.UpdateExpression += `#${field} = :${field},`;
      params.ExpressionAttributeNames[`#${field}`] = field;
      params.ExpressionAttributeValues[`:${field}`] = false;
    }
  }

  params.UpdateExpression += '#updatedAt = :updatedAt';

  return await updateTask(params);
}

module.exports.queued = async (event) => {
  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    Key: {
      userId: event.queryStringParameters.user,
      id: event.pathParameters.id,
    },
    UpdateExpression: "SET #queued = :queued,",
    ExpressionAttributeNames: {
      '#queued': 'queued',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':queued': data.status === false ? false : true,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  };

  if (data.status !== false) {
    for (const field of ['complete', 'active']) {
      params.UpdateExpression += `#${field} = :${field},`;
      params.ExpressionAttributeNames[`#${field}`] = field;
      params.ExpressionAttributeValues[`:${field}`] = false;
    }
  }

  params.UpdateExpression += '#updatedAt = :updatedAt';

  return await updateTask(params);
}

module.exports.complete = async (event) => {
  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Tasks`,
    Key: {
      userId: event.queryStringParameters.user,
      id: event.pathParameters.id,
    },
    UpdateExpression: "SET #complete = :complete,",
    ExpressionAttributeNames: {
      '#complete': 'complete',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':complete': data.status === false ? false : true,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  };

  if (data.status !== false) {
    for (const field of ['queued', 'active']) {
      params.UpdateExpression += `#${field} = :${field},`;
      params.ExpressionAttributeNames[`#${field}`] = field;
      params.ExpressionAttributeValues[`:${field}`] = false;
    }
  }

  params.UpdateExpression += '#updatedAt = :updatedAt';

  return await updateTask(params);
}
