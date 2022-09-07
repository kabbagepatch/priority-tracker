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

module.exports.list = async (event) => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-PrioritisedProjects`,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": 'kavish',
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    if (!result.Items || !result.Items.length) {
      return {
        statusCode: 200,
        headers: getHeaders(),
        body: JSON.stringify([]),
      }
    }
    const projectIds = result.Items.map(item => item.projectId);

    const projectParams = {
      RequestItems: {
        [`${process.env.DYNAMODB_TABLE}-Projects`]: {
          Keys: projectIds.map(id => ({ userId: 'kavish', id })),
        },
      },
    };

    const categoriesResult = await dynamoDb.batchGet(projectParams).promise();

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(categoriesResult['Responses'][`${process.env.DYNAMODB_TABLE}-Projects`]),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Projects. ' + error.message,
    };
  }
}
