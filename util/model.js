/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */
'use strict'

module.exports = function(app) {
    var db = app.get('db');
    if (!db) {
        // reconnect
        db = require(__basename + '/util/database.js');
    }
    return function(name){
        var path = __basename + '/model/' + name + '.js'
        if (!name) {
            throw new Error('model name can not be empty!!');
            return false;
        }
        if (!db) {
            throw new Error('database connection lost!');
            return false;
        }
        return require(path)(db);
    };
};