/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */
'use strict'
module.exports = function(app) {
	var mongoose = require('mongoose'),
		logger = app.get('logger');

	var connection = mongoose.createConnection(app.get('config').mongodb);
	connection.on('error', function (err) {
		logger.error(err);
	})

	return connection;
}