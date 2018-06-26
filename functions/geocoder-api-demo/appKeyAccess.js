function appKeyAccess() {
    'use strict';
    const awsSdk = require('aws-sdk');

    function getKeys(callback) {
        const endpoint = "https://secretsmanager.us-east-1.amazonaws.com";
        const region = "us-east-1";
        const secretName = "here.com/geocoder/demo";
        let secret;

        const secretsManager = new awsSdk.SecretsManager({
            endpoint: endpoint,
            region: region
        });

        secretsManager.getSecretValue({ SecretId: secretName }, function (getSecretError, getSecretData) {
            if (getSecretError) {
                if (getSecretError.code === 'ResourceNotFoundException') {
                    console.log("The requested secret " + secretName + " was not found");
                } else if (getSecretError.code === 'InvalidRequestException') {
                    console.log("The request was invalid due to: " + getSecretError.message);
                } else if (getSecretError.code === 'InvalidParameterException') {
                    console.log("The request had invalid params: " + getSecretError.message);
                }

                callback(getSecretError, null);
            }
            else {
                if (getSecretData.SecretString !== "") {
                    secret = getSecretData.SecretString;

                    try {
                        const apiKeys = JSON.parse(secret);
                        callback(null, apiKeys);
                    } catch (jsonParseError) {
                        callback(jsonParseError, null);
                    }

                } else {
                    callback(new Error('No application secrets or keys were found.'), null);
                }
            }
        });
    }

    return {
        getKeys: getKeys
    };
}

module.exports = appKeyAccess;