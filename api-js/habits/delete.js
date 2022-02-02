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
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-Habits`,
    Key: {
      userId: 'kavish',
      habitId: event.pathParameters.habitId,
    },
  };

  const getMarksParams = {
    TableName: `${process.env.DYNAMODB_TABLE}-HabitMarks`,
    KeyConditionExpression: 'habitId = :habitId',
    ExpressionAttributeValues: {
      ':habitId': event.pathParameters.habitId,
    },
  };

  try {
    const result = await dynamoDb.query(getMarksParams).promise();
    const deleteMarksParams = {
      RequestItems: {
        [`${process.env.DYNAMODB_TABLE}-HabitMarks`]: result.Items.map(mark => ({
          DeleteRequest: {
            Key: {
              habitId: mark.habitId,
              markDate: mark.markDate
            }
          }
        }))
      }
    };

    if (result.Items && result.Items.length > 0) await dynamoDb.batchWrite(deleteMarksParams).promise();
    await dynamoDb.delete(params).promise();

    return {
      statusCode: 204,
      headers: getHeaders(),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t delete the habit. ' + error.message,
    };
  }
}
