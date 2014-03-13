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
    subgroup: Array
});

mongoose.model('meta', schema)

module.exports = function (connection) {
	return (connection || mongoose).model('meta')
}