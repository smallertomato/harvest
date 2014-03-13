/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */

/*jshint node:true*/
'use strict'
var mongoose = require('mongoose')

var schema = mongoose.Schema({
    name: String,
    group: String,
    subgroup: String,
    creator : String,
    authors: Array,
    ctime: Number,

    utime: Number,
    description: String,
    simple_url: String,
    ie: String,
    code : String,
    available: String,
    type: String
});

mongoose.model('template', schema)

module.exports = function (connection) {
    return (connection || mongoose).model('template')
}
