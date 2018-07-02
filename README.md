# Here Technologies API

This code sample demonstrates use of AWS Lambda to call Here Geocoder API, works with data in S3.

## geocoder-api-demo
AWS Lambda which will take a JSON file uploaded to a S3 bucket, parse it into an API call to Here.com's Geocoder API, update the file with a latitude and longitude, and save the file to a new S3 location.

Required Roles for the lambda to execute are:
 - AmazonS3FullAccess
 - custom JSON:
 ```JSON
 
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": "logs:*",
                "Resource": "*"
            },
            {
                "Sid": "VisualEditor1",
                "Effect": "Allow",
                "Action": "secretsmanager:GetSecretValue",
                "Resource": "arn:aws:secretsmanager:<SecretsRegion>:<SecretsAccount>:secret:<SecretName>"
            }
        ]
    }
```
