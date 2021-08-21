'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = async (event) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const experience = requestBody.experience;

  if(typeof fullname !== 'string' || typeof email !== 'string' || typeof experience !== 'number'){
    console.error('Validation failed ::: wrong data type');
    return new Error('Couldn\'t submit candidate because of validation error');
  }

  try {
    const res = await submitCandidateP(candidateInfo(fullname, email, experience));
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Successfully submitted candidate with email ${email}`,
      candinateId: res.id
    })
  };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to submit candidate with email ${email}`
      })
    }
  }
};

async function submitCandidateP(candidate){
  console.log('Submitting candidate');
  const candidateInfo = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: candidate,
  };
  const response = await dynamoDb.put(candidateInfo);
  return response;
};

function candidateInfo(fullname, email, experience){
  const timestamp = new Date().getTime();
  return{
    id: uuid.v1(),
    fullname: fullname,
    email: email,
    experience: experience,
    submittedAt: timestamp,
    updateedAt: timestamp
  };
};





