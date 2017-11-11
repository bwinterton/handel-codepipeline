/*
 * Copyright 2017 Brigham Young University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * This module exists because I haven't yet been able to figure out a way
 * to mock the AWS SDK when using Sinon and TypeScript. The 'aws-sdk-mock'
 * tool doesn't work in TypeScript, and I have yet to find out how to use
 * Sinon to mock the SDK when using promises.
 */

const AWS = require('aws-sdk');

exports.cloudFormation = {
    describeStacks: function(params) {
        const cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
        return cloudformation.describeStacks(params).promise();
    },
    waitFor: function(stackState, params) {
        const cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
        return cloudformation.waitFor(stackState, params).promise();
    },
    createStack: function(params) {
        const cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
        return cloudformation.createStack(params).promise();
    },
    deleteStack: function(params) {
        const cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
        return cloudformation.deleteStack(params).promise();
    }
}