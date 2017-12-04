'use strict';

const config = require('../../config');
const mongoose = require('mongoose');


module.exports = {
    getInstance() {
        var querymongoose = 'mongodb://' + config.mongodb.host + '/' + config.mongodb.dbname;
        //connect database
        return mongoose.connect(querymongoose);
    },
};
