'use strict';
const mongoose = require('mongoose');

module.exports = {

    string: {
        type: String,
        default: null,
    },
    number: {
        type: Number,
        default: 0,
    },
    bool: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    stringUniq: {
        type: String,
        unique: true,
    },
    numberUniq: {
        type: Number,
        unique: true,
    },
    ref(col) {
        var ret = {
            type: mongoose.Schema.Types.ObjectId,
            ref: col.toString(),
        }
        return ret;
    },
    refUniq(col) {
        var ret = {
            type: mongoose.Schema.Types.ObjectId,
            ref: col.toString(),
            unique: true,
        }
        return ret;
    },
    refPhoto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
        default: null,
    },
    
    stringLength(length) {
        var long = Number(length);
        return {
            type: String,
            default: null,
            maxlength: long,
        }
    },
    
    stringUniqLength(length) {
        var long = Number(length);
        return {
            type: String,
            unique: true,
            maxlength: long,
        }
    },
    numberLength(length) {
        var long = Number(length);
        return {
            type: Number,
            default: 0,
            maxlength: long,
        }
    },

}
