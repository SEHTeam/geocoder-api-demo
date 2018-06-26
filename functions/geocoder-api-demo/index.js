'use strict';

const apiHandler = require('./apiHandler')();
const s3Operations = require('./s3Operations')();

exports.handle = (event, context, callback) => {
    const s3Trigger = event.Records[0].s3;

    const s3Parameters = {};
    s3Parameters.sourceBucket = s3Trigger.bucket.name;
    s3Parameters.sourceKey = s3Trigger.object.key;
  
    const fileName = getS3Filename(s3Parameters);
    s3Parameters.destinationKey = `destinationFiles/${fileName}_withLatLong.json`;
  
    s3Operations.getObjectFromS3(s3Parameters, function (getError, getData) {
      if (getError) {
        callback(getError, null);
      } else {
  
        apiHandler.buildApiQuery(getData, function (buildQueryError, buildQueryData) {
          if (buildQueryError) {
            callback(buildQueryError);
          } else {
  
            apiHandler.callApi(buildQueryData, function (apiCallError, apiCallData) {
              if (apiCallError) {
                callback(apiCallError, null);
              } else {
                
                s3Operations.putObjectInS3(apiCallData, function (putError, putData) {
                  console.log('Final Error: ', putError);
                  console.log('Final Data: ', putData);
  
                  callback(putError, putData);
                });
              }
            });
          }
        });
      }
    });
  };
  
  function getS3Filename(s3Parameters) {
    const keyParts = s3Parameters.sourceKey.split('/');
    const numberOfKeyParts = keyParts.length;
    const fileNameAndExtension = keyParts[numberOfKeyParts - 1];
    return fileNameAndExtension.slice(0, -5);
  }