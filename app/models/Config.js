'use strict';

const packageJS = require('../helpers/pack');
const typeData = require('./typedata/TypeData');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConfigSchema = new Schema({
    id_config: typeData.stringUniq,
    taxes: typeData.number,
    newProductInDay: typeData.number,
}, {
    collection: 'Config'
});

ConfigSchema.methods.takeData = function (object) {
    let thisObject = object.toJSON();

    
    return thisObject;
}

module.exports = mongoose.model('Config', ConfigSchema);
