'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()

global.dynamo = require('dynamodb');
global.AWS = dynamo.AWS;
global.Joi = require('joi');

AWS.config.loadFromPath('credentials.json');
var User = require('./models/user');
var Package = require('./models/package');

// var dynamoDB = new AWS.DynamoDB();
// dynamoDB.listTables(function (err, data) {
//     if (err) {
//         console.log('Error listing tables', err);
//     } else {
//         console.log('Tables in the database', data);
//     }
// })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//app.use(awsServerlessExpressMiddleware.eventContext())

app.post('/user', function (req, res) {
    let data = req.body;
    console.log(data);
    if (!data.userId || !data.guildId || (data.public !== 'yes' && data.public !== 'no') || !data.username) {
        return res.status(406).json({error: 'Insufficient data received', data: data});
    }
    let params = {
        userId: data.userId,
        orgId: data.guildId,
        public: data.public && data.public === 'yes' ? 'yes' : 'no',
        numberOfShips: 0,
        shipsIndex: 0,
        settings: {
            guildName: data.guildName ? data.guildName : '',
            userName: data.username,
        }
    };
    User.create(params, (error, result) => {
        if (error) {
            console.log(error, params);
            res.status(400).json({ error: 'Could not get user' });
        }
        else if (result) {
            res.json({success: 'user was created', user: result});
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

app.delete('/user/:user', function (req, res) {
    let userId = req.params.user;
    User.destroy(userId, {ReturnValues: 'ALL_OLD'}, (error, user) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not delete user' });
        }
        else {
            Package.query(userId).usingIndex('userIdIndex').exec((error, ships) => {
                if (error) {
                    console.log(error);
                    res.status(400).json({ error: 'Could not get list of users ships' });
                }
                else if (ships.Count) {
                    // TODO need to test this!!!
                    let shipsArray = [];
                    ships.forEach(ship => {
                        shipsArray.push({
                            DeleteRequest : {
                                Key : {
                                    'shipId' : ship.shipId    
                                }
                            }
                        })
                        console.log('Deleting ship', ship);
                    });
                    client = new AWS.DynamoDB.DocumentClient();
                    client.batchWrite(params, function(err, data) {
                        if (err) {
                            console.log('Batch delete unsuccessful ...');
                            console.log(err, err.stack); // an error occurred
                        } else {
                            console.log('Batch delete successful ...');
                            console.log(data); // successful response
                            res.json({ success: 'User have been deleted, some ships did not survive', user: user, ships: ships.Items });
                        }
                    });
                }
                else {
                    res.json({ success: 'User have been deleted, no ships were harmed', user: user, ships: [] });
                }
            });
        }
    });
});

app.get('/user/:user', function (req, res) {
    User.get(req.params.user, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get user' });
        }
        else if (result) {
            res.json({success: 'User found', user: result});
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

app.get('/users/:org', function (req, res) {
    let query = null;
    if (req.query.public) {
        query = User.query(req.params.org).usingIndex('orgIdIndex').where('public').eq(req.query.public);
    }
    else {
        query = User.query(req.params.org).usingIndex('orgIdIndex');
    }
    query.exec(function (error, result) {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get users of org' });
        }
        else if (result && result.Items) {
            res.json({success: 'Fetched users', users: result.Items});
        } else {
            res.status(404).json({ error: "Org not found" });
        }
    });
})

app.get('/packages/:whos/:filter?', function (req, res) {
    return res.json({success: 'Weeee', params: req.params});

    let query = null;
    if (req.query.public) {
        query = User.query(req.params.org).usingIndex('orgIdIndex').where('public').eq(req.query.public);
    }
    else {
        query = User.query(req.params.org).usingIndex('orgIdIndex');
    }
    query.exec(function (error, result) {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get users of org' });
        }
        else if (result && result.Items) {
            res.json({success: 'Fetched users', users: result.Items});
        } else {
            res.status(404).json({ error: "Org not found" });
        }
    });
})

// Export your express server so you can import it in the lambda function.
module.exports = app;
