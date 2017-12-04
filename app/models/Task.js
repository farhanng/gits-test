'use strict';

const Config = require('../../config/');
const bcrypt = require('bcrypt');
const packageJS = require('../helpers/pack');
const typeData = require('./typedata/TypeData');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: typeData.stringLength(500),
    user: typeData.ref('User'),
    priority: typeData.numberLength(2),
    location: typeData.stringLength(273),
    timeStart: typeData.date,
}, {
    collection: 'Task'
});

TaskSchema.methods.takeData = function (object) {
    let thisObject = object.toJSON();

    return thisObject;
}

module.exports = mongoose.model('Task', TaskSchema);
