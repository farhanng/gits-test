'use strict';

const config = require('../../config/');

const http = require('http');
const router = require('express').Router();
const web = require('./web');
const api = require('./api');
const test = require('./test');

// Craft response.
function craft(data, message, status) {
    const hasStatus = status || 200;

    const response = {
        meta: {
            code: hasStatus,
            message: message || http.STATUS_CODES[hasStatus],
        },
    };

    if (data != null) response.data = data;

    return response;
}

// Before routes
router.use((req, res, next) => {
    req.locale = req.session.locale || config.i18n.defaultLocale;
    req.accept = req.get('Accept') || '';
    req.api = req.xhr || req.accept.indexOf('html') < 0;

    // Base model only if request is not API.
    res.model = {
        user: req.user,
        locale: req.locale,
    };

    res.craft = craft;

    res.ok = (data, message, status) => {
        status = status || 200;
        res.status(status).send(craft(data, message, status));
    };

    res.sendError = (data, message, status) => {
        status = status || 400;
        console.log('');
        console.log(data);
        res.status(status).send(craft(data, message, status));
    };

    next();
});

// routes
router.use('/', web);
router.use('/api/v1', api);
router.use('/test', test);

// 404 handler
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use((err, req, res, next) => {
    /* eslint no-unused-vars: 0 */
    const errSplitted = err.stack.split('\n');
    console.error({
        message: errSplitted[0],
        location: errSplitted[1]
            .replace(config.appDir, '')
            .replace(/\\/g, '/')
            .trim(),
        url: req.originalUrl,
    });

    if (err.message === 'Invalid login data') {
        req.logout();
        return res.redirect('/');
    }

    const status = err.status || 500;

    /* Overriding request. Assume from API Request */
    req.api = true;

    if (req.api) {
        return res.status(status).send(craft(err.data, err.message, status));
    }

    const model = Object.assign({}, res.model, craft(err.data, err.message, status));
    return res.render('errors/error', model);
});

module.exports = router;
