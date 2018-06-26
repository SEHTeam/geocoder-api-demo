function s3Operations() {

  'use strict';

  const awsSdk = require('aws-sdk');
  const s3 = new awsSdk.S3();

  function getObjectFromS3(s3Params, callback) {
    const s3GetParams = {
      Bucket: s3Params.sourceBucket,
      Key: s3Params.sourceKey
    };

    s3.getObject(s3GetParams, function (getError, getData) {
      if (getError) {
        console.log(`Get S3 Object ${s3Params.Bucket}/${s3Params.Key} Error: ${getError}`);
        callback(getError, null);
      } else {
        try {
          const dataString = getData.Body.toString('ascii');
          s3Params.s3FileData = JSON.parse(dataString);

          callback(null, s3Params);
        } catch (jsonParseError) {
          console.log('JSON Parse Error: ', jsonParseError);
          callback(jsonParseError, null);
        }
      }
    });
  }

  function putObjectInS3(s3Params, callback) {
    const s3PutParams = {
      Body: JSON.stringify(s3Params.s3FileData, null, 4),
      Bucket: s3Params.sourceBucket,
      Key: s3Params.destinationKey
    };

    s3.putObject(s3PutParams, function (putError, putData) {
      if (putError) {
        console.log(`Put S3 Object ${s3Params.Bucket}/${s3Params.Key} Error: ${putError}`);
        callback(putError, null);
      } else {
        callback(null, putData);
      }
    });
  }

  return {
    getObjectFromS3: getObjectFromS3,
    putObjectInS3: putObjectInS3
  };
}

module.exports = s3Operations;