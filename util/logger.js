/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */


var winston = require("winston");

var logger = new winston.Logger();

switch(((process.env.NODE_ENV) || '').toLowerCase()){
    case 'production':
        production = true
        loglevel ='warn'
        logger.add(winston.transports.File,
            {filename: __dirname + '/production.log'
                ,handleExceptions: true
                ,exitOnError: false
                ,level: 'warn'
                ,label: 'harvest'
            });
        break
    case 'test':
        // Don't set up the logger overrides
        break
    case 'development':
        loglevel = 'debug'
        logger.add(winston.transports.Console,
            {colorize: true
                ,timestamp: true
                ,label: 'harvest'
            });
        break
    default:
        loglevel = 'info'
        logger.add(winston.transports.Console,
            {colorize: true
                ,timestamp: true
                ,level: loglevel
                ,label: 'harvest'
            });
        break
}

logger.setLevels(winston.config.syslog.levels);

module.exports = logger;