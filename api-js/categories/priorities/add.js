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
  const data = JSON.parse(event.body);

  const getCategoryParams = {
    TableName: `${process.env.DYNAMODB_TABLE}-Categories`,
    Key: {
      userId: 'kavish',
      id: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDb.get(getCategoryParams).promise();

    if (!result.Item) {
      return {
        statusCode: 401,
        headers: getHeaders('text/plain'),
        body: 'No category found for given id.',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Category. ' + error.message,
    };
  }

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-PrioritisedCategories`,
    Item: {
      userId: 'kavish',
      categoryId: event.pathParameters.id,
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
