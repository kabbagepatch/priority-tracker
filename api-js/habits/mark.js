'use strict';

const { parse, isValid, format } = require('date-fns');
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

module.exports.mark = async (event) => {
  const data = JSON.parse(event.body);

  if (!data || !data.markDate || !data.markDate.trim()) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t mark a habit without a date.',
    };
  }

  const parsedDate = new Date(data.markDate);
  const isValidDate = isValid(parsedDate);
  if (!isValidDate) {
    return {
      statusCode: 400,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t mark a habit without valid date.',
    };
  }
  const formattedDate = format(parsedDate, 'yyyy-MM-dd');

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-HabitMarks`,
    Item: {
      habitId: event.pathParameters.habitId,
      markDate: formattedDate,
    },
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      headers: getHeaders(),
      body: JSON.stringify(params.Item),
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: getHeaders('text/plain'),
      body: 'Couldn\'t mark the habit. ' + error.message,
    };
  };
}
