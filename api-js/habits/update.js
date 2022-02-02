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

module.exports.update = async (event) => {
  const timestamp  = new Date().getTime();
  const data = JSON.parse(event.body);

  if (!data || data.name === '' || (data.name && data.name.trim() === '')) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t update the habit. Invalid fields passed in',
    };
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Habits`,
    Key: {
      userId: 'kavish',
      habitId: event.pathParameters.habitId,
    },
    UpdateExpression: 'SET ',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    ReturnValues: 'ALL_NEW',
  };

  const allowedFields = ['name', 'skipsPerWeekAllowed'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null) {
      params.UpdateExpression += `#${field} = :${field},`;
      params.ExpressionAttributeNames[`#${field}`] = field;
      params.ExpressionAttributeValues[`:${field}`] = data[field];

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
      body: 'Couldn\'t update the habit. ' + error.message,
    };
  };
}
