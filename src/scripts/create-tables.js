'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()


global.dynamo = require('dynamodb');
global.AWS = dynamo.AWS;
global.Joi = require('joi');

AWS.config.loadFromPath('../credentials.json');
var User = require('../models/user');
var Package = require('../models/package');

var dynamoDb = new AWS.DynamoDB();

// dynamoDb.deleteTable({TableName: 'users'}, function (err, data) {
//     if (err) {
//         console.log('Error listing tables', err);
//     } else {
//         console.log('Tables in the database', data);
//     }
// })

if (process.argv[2] === 'd') {
    User.deleteTable();
    Package.deleteTable();
}

if (process.argv[2] === 'c') {
    dynamo.createTables();
}

if (process.argv[2] === 'i') {
    var user = new User({ userId: 'ulrich', orgId: 'ufd', public: "yes" });
    user.save((err, res) => {
        if (err) {
            console.log('Failed to create ulrich', err);
        }
        else {
            console.log('Created user '+res.get('userId'));
        }
    });

    var user = new User({ userId: 'scott', orgId: 'ufd', public: "no" });
    user.save((err, res) => {
        if (err) {
            console.log('Failed to create ulrich', err);
        }
        else {
            console.log('Created user '+res.get('userId'));
        }
    });
}

if (process.argv[2] === 'l') {
    User.query('ufd').usingIndex('orgIdIndex').exec((err, res) => {
        if (err) {
            console.log('Failed to fetch users', err);
        }
        else {
            console.log('Users ', res, res.Items);
        }
    });
}

async function run() {

    // dynamoDb.listTables(function (err, data) {
    //     if (err) {
    //         console.log('Error listing tables', err);
    //     } else {
    //         console.log('Tables in the database', data);
    //     }
    // })

    // var user = new User({ userId: 'ulrich', orgId: 'ufd', public: "yes" });
    // await user.save();
    // console.log('created account in DynamoDB', user.get('userId'));

    // var user = new User({ userId: 'scott', orgId: 'ufd', public: "yes" });
    // await user.save();
    // console.log('created account in DynamoDB', user.get('userId'));

    // var users = await User.query('ufd').usingIndex('orgIdIndex').exec().promise();
    // console.log(users);
    // console.log(users[0].Items);
}

run();

//     if (err) {
//         console.log('Error creating tables', err);
//     } else {
//         console.log('table are now created and active');
//     }

// }