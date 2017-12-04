'use strict';

const OAuthServer = require('oauth2-server');
const BasicAuth = require('basic-auth');
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

const model = require('./oauth-model');

const oauth = new OAuthServer({
    model: model,
    grants: ['password', 'client_credentials', 'refresh_token'],
    debug: true,
    accessTokenLifeTime: 60 * 60 * 60,
    refreshTokenLifeTime: null,
});

function basic(options) {
    options = options || {};

    return function (req, res, next) {
        const request = new Request({
            headers: req.headers,
            method: req.method,
            query: req.query,
            body: req.body
        });

        const response = new Response(res);

        const credentials = BasicAuth(request);

        if (credentials == undefined) {
            return res.sendError('Missing Header Basic Authentication for Credentials', 'Missing Property', 400);
        }

        const client = model.getClient(credentials.name, credentials.pass);

        client.then((clientData) => {
            if (!clientData.client_id) {
                return res.sendError('Invalid client: client credentials are invalid', 'invalid_client', 400);
            }

            next();
        }).catch(ex => {

            next(ex);
        })

    }

}

function token(req, res, callback) {
    var request = new Request(req);
    var response = new Response(res);
    oauth
        .token(request, response)
        .then(function (token) {
            // Todo: remove unnecessary values in response
            token.user = token.user.toJSON();
            var token_j = token;
            delete token_j.client;
            delete token_j.user._id;
            delete token_j.user.forgotCode;
            delete token_j.user.password;
            delete token_j.user.verifyCode;
            delete token_j.accessToken;
            delete token_j.refreshToken;

            return callback(null,token_j);
        }).catch(function (err) {
            return callback(err,null);
        })
}

function authenticate(options) {
    options = options || {};

    return function (req, res, next) {
        const request = new Request({
            headers: {
                authorization: req.headers.authorization
            },
            method: req.method,
            query: req.query,
            body: req.body
        });

        const response = new Response(res);

        oauth.authenticate(request, response, options)
            .then(function (token) {
                // Request is authorized.
                req.token = token;
                req.user = token.user;
                next();
            })
            .catch(function (err) {
                // Request is not authorized.
                return res.sendError(err.message, 'Invalid Token', err.code || 500);
            });
    }
}

module.exports = {
    basic: basic,
    token: token,
    authenticate: authenticate
}
