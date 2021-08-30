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
    TableName: `${process.env.DYNAMODB_TABLE}-PrioritisedCategories`,
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
    const categoryIds = result.Items.map(item => item.categoryId);
    console.log(categoryIds);

    const categoryParams = {
      RequestItems: {
        [`${process.env.DYNAMODB_TABLE}-Categories`]: {
          Keys: categoryIds.map(id => ({ userId: 'kavish', id })),
        },
      },
    };

    const categoriesResult = await dynamoDb.batchGet(categoryParams).promise();

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify(categoriesResult['Responses'][`${process.env.DYNAMODB_TABLE}-Categories`]),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t get the Categories. ' + error.message,
    };
  }
}
