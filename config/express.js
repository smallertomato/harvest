/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */

// Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.TZ = 'PRC';

module.exports = function (app, express) {
    var config = app.get('config'),
        redisStore = require('connect-redis')(express),
        path = require('path')
        passport = require('cas'),
        logger = app.get('logger');

    app.configure(function(){
        // should be placed before express.static
        app.use(express.compress({
            filter: function (req, res) {
              return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
            },
            level: 9
        }))
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride())
        app.use(express.static(path.join(__basename, 'public')));

        app.use(express.session({ store: new redisStore(config.redis), secret: 'keyboard cat' }));

        app.set('views', __basename + '/views');
        app.use(express.favicon());
        app.set('view engine', 'jade');
    })

    // production env config
    app.configure('production', function () {
        app.set('view cache', true);
        // uuap
        app.use(passport.json_ticket(config.cas));
        app.use(passport.check_or_redirect(config.cas));
        app.use(express.errorHandler());
        app.use(express.logger());
        logger.info('harvest run in production mode.');
    })
    // test env config
    app.configure('test', function () {
        app.set('view cache', false);
        logger.info('harvest run in test mode.');
    })
    // development env config
    app.configure('development', function () {
        app.set('view cache', false);
        // uuap
        app.use(passport.json_ticket(config.cas));
        app.use(passport.check_or_redirect(config.cas));

        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
        logger.info('harvest run in development mode.');
    })
}
