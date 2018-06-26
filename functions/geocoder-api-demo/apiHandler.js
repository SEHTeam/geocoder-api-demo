function sampleApiCall() {
    'use strict';

    const appKeyAccess = require('./appKeyAccess')();
    const https = require('https');

    function buildApiQuery(s3Params, callback) {
        const apiEndpoint = 'https://geocoder.cit.api.here.com/6.2/geocode.json';

        appKeyAccess.getKeys(function (getKeysError, getKeysData) {
            if (getKeysError) {
                callback(getKeysError, null);
            } else {
                const address = s3Params.s3FileData.address;
                const addressQuery = `${address.street.replace(' ', '+')}+${address.city.replace(' ', '+')}+${address.state}+${address.zip}`;
                const apiQueryUrl = `${apiEndpoint}?app_id=${getKeysData.app_id}&app_code=${getKeysData.app_code}&searchtext=${addressQuery}`;
                s3Params.apiQueryUrl = apiQueryUrl;
                callback(null, s3Params);
            }
        });
    }

    function callApi(s3Params, callback) {
        console.log('API Call: ', s3Params.apiQueryUrl);
        https.request(s3Params.apiQueryUrl, function (response) {
            response.setEncoding('utf8');

            response.on('data', function (geocoderData) {
                console.log('Request Data: ', geocoderData);
                let parsedResponse;

                try {
                    parsedResponse = JSON.parse(geocoderData);
                    const latLong = parsedResponse.Response.View[0].Result[0].Location.NavigationPosition[0];
                    console.log('Lat Long: ', latLong);

                    s3Params.s3FileData.latLong = latLong;

                    callback(null, s3Params);

                } catch (jsonParseError) {
                    console.log('Error parsing geocoder response: ', jsonParseError);
                    callback(jsonParseError, null);
                }
            });

            response.on('error', function (error) {
                console.log('Request Error: ', error);
                callback(error, null);
            });

        }).end();
    }

    return {
        buildApiQuery: buildApiQuery,
        callApi: callApi
    }
}

module.exports = sampleApiCall;