'use strict';

const AWS = require('aws-sdk');
const { parse, isValid, format } = require('date-fns');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const getHeaders = (contentType) => (contentType ? {
  'Content-Type': contentType,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
} : {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
});

module.exports.unmark = async (event) => {
  const data = JSON.parse(event.body);

  if (!data || !data.markDate || !data.markDate.trim()) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t unmark a habit without valid date.',
    };
  }

  const parsedDate = parse(data.markDate, 'P', new Date());
  const isValidDate = isValid(parsedDate);
  if (!isValidDate) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t unmark a habit without valid date.',
    };
  }
  const formattedDate = format(parsedDate, 'yyyy-MM-dd');

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-HabitMarks`,
    Key: {
      habitId: event.pathParameters.habitId,
      markDate: formattedDate,
    },
  };

  try {
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
      body: 'Couldn\'t unmark the habit. ' + error.message,
    };
  }
}
