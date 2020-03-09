const allow = {
    "principalId": "user",
    "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "execute-api:Invoke",
                "Effect": "Allow",
                "Resource": process.env.RESOURCE
            }
        ]
    }
}

function extractTokenFromHeader(e) {
    if (e.authorizationToken && e.authorizationToken.split(' ')[0] === 'Bearer') {
        return e.authorizationToken.split(' ')[1];
    } else {
        return e.authorizationToken;
    }
}

function validateToken(token, callback) {
    console.log('apiKey', process.env.TOKEN);
    if (process.env.TOKEN === undefined || process.env.TOKEN !== token) {
        callback("Unauthorized")
    } else {
        callback(null, allow)
    }
}

exports.handler = (event, context, callback) => {
    let token = extractTokenFromHeader(event) || '';
    validateToken(token, callback);
}