/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */

/**
 * Global Setting.
 */
global.__basename = __dirname;
// Load configurations
var env = process.env.NODE_ENV || 'production'
  , config = require(__basename + '/config/global')[env];

/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    socketio = require('socket.io'),
    argv = require('optimist').argv,
    logger = require(__basename + '/util/logger');


var redis = require("redis"),
    redisClient = redis.createClient(config.redis.port, config.redis.host);
global.redis_client = redisClient;

// websocket clients & users
global.clients = [];
global.users = [];
global.admin = config.admin;

logger.debug('admins are ' , admin);

var port = argv.p || argv.port || 80;
var app = express();

app.set('config', config);
app.set('logger', logger);
var database = require(path.join(__basename, '/util/database.js'));
app.set('db', database);
app.set('model', require(path.join(__basename, '/util/model.js'))(app));

// express settings
require('./config/express')(app, express);
// Bootstrap routes
require('./routes/routes')(app);

var server = app.listen(port, function(){
    logger.info('Listening on port %d', server.address().port);
})

socketio.listen(server, {'log': false}).on('connection', function (client) {
    client.on('online', function (msg) {
        var data = JSON.parse(msg);
        if(!clients[data.user]) {
            users.unshift(data.user);
        }
        clients[data.user] = client;
    });
    client.on("disconnect", function() {
        for(var index in clients) {
            if(clients[index] == client) {
                users.splice(users.indexOf(index),1);
                delete clients[index];
                break;
            }
        }
    });
});