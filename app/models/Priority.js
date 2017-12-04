'use strict';

const Config = require('../../config/');
const bcrypt = require('bcrypt');
const packageJS = require('../helpers/pack');
const typeData = require('./typedata/TypeData');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PrioritySchema = new Schema({
    name: typeData.stringLength(500),
    user: typeData.ref('User'),
    priority: typeData.ref('Priority'),
    location: typeData.stringLength(273),
    timeStart: typeData.date,
}, {
    collection: 'Priority'
});

PrioritySchema.methods.takeData = function (object) {
    let thisObject = object.toJSON();

    return thisObject;
}

module.exports = mongoose.model('Priority', PrioritySchema);
