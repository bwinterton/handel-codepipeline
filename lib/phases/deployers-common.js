const s3Calls = require('../aws/s3-calls');
const iamCalls = require('../aws/iam-calls');
const fs = require('fs');
const util = require('../util/util');
const uuid = require('uuid');

exports.uploadDirectoryToBucket = function(directoryToUpload, s3FileName, s3BucketName) {
    let zippedPath = `/tmp/${uuid()}.zip`;
    return util.zipDirectoryToFile(directoryToUpload, zippedPath)
        .then(() => {
            return s3Calls.uploadFile(s3BucketName, s3FileName, zippedPath)
                .then(s3ObjectInfo => {
                    fs.unlinkSync(zippedPath);
                    return s3ObjectInfo;
                });
        });
}

exports.createLambdaCodePipelineRole = function(accountId) {
    let roleName = 'HandelCodePipelineLambdaRole';
    return iamCalls.createRoleIfNotExists(roleName, 'lambda.amazonaws.com')
        .then(role => {
            let policyArn = `arn:aws:iam::${accountId}:policy/handel-codepipeline/${roleName}`;
            let policyDocument = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: [
                            "logs:*"
                        ],
                        Effect: "Allow",
                        Resource: "arn:aws:logs:*:*:*"
                    },
                    {
                        Action: [
                            "codepipeline:PutJobSuccessResult",
                            "codepipeline:PutJobFailureResult"
                        ],
                        Effect: "Allow",
                        Resource: "*"
                    }
                ]
            }
            return iamCalls.createPolicyIfNotExists(roleName, policyArn, policyDocument);
        })
        .then(policy => {
            return iamCalls.attachPolicyToRole(policy.Arn, roleName);
        })
        .then(policyAttachment => {
            return iamCalls.getRole(roleName);
        });
}
