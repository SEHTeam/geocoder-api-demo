# Here Technologies API

This code sample demonstrates use of AWS Lambda to call Here Geocoder API, works with data in S3.

Shown below is the architecture of this code sample.  

![geocoder-and-aws](/images/geocoder-and-aws.png)

Notes: 
1) the file `appKeyAccess.js` (line 6) is set to use `us-east-1`, edit as per your location.
2) create an IAM S3 policy (R/W) using the two S3 bucket names for use with your scenario's Lambda instance.

## geocoder-api-demo
AWS Lambda which will take a JSON file uploaded to a S3 bucket, parse it into an API call to Here.com's Geocoder API, update the file with a latitude and longitude, and save the new output file result to a new S3 location.

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
