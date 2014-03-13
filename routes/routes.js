/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */

var async = require('async'),
    request = require('request'),
    passport = require('cas_validate');

// Controllers
var site = require(__basename + '/controllers/site')
  , doc = require(__basename + '/controllers/doc')
  , template = require(__basename + '/controllers/template')
  , editor = require(__basename + '/controllers/editor');

// Expose routes
module.exports = function (app) {
    var config = app.get('config'),
        logger = app.get('logger');
    // user routes
    app.get('/username', passport.username)
    app.get('/login', passport.check_or_redirect(config.cas));
    app.get('/logout', passport.logout(config.cas))
  
    // doc routes
    app.get('/doc/ajax/:article', doc.ajax);
    app.get('/doc/:article', doc.index);

    // template routes
    app.get('/meta/:id', template.meta);
    app.get('/createform', template.createform);
    app.post('/create', template.create);
    app.get('/remove/:id?', template.remove);
    app.post('/metaedit/:id', template.metaedit);
    app.get('/manage/ajax/:group/:subgroup', template.manageAjax);
    app.get('/manage/:group/:subgroup', template.manage);

    // editor routes
    app.post('/saveCode/:id', editor.saveCode);
    app.all('/run', editor.run);
    app.get('/edit/:id?', editor.index);
    
    // public api
    app.get('/api/templates', template.apiTemplates);
    
    // home route
    app.get('/', site.index)

    /**
     * Generally, in origin page, there are some reletive links which should request to origin server.
     * However when we server the page in frame, the request will redirect to our server. We have no 
     * action to service the request. So we tricky add this.
     * @change 2014-03-04 close this feature
     */
    app.all('*', function (req, res){
        var url = req.cookies.url || req.session.url;
        logger.info("Proxy: " + req.cookies.proxy);
        // TODO: true is switch.
        if (false && url && req.cookies.proxy) {
            var parse = url.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i);  
            var result = {  
                'schema': parse[2],  
                'host': parse[3],  
                'path': parse[4],  
                'query': parse[5],  
                'anchor': parse[6]  
            };
            logger.info("Proxy: " + parse[2] + "://" + parse[3] + "/" + req.params[0])
            req.pipe(request(parse[2] + "://" + parse[3] + "/" + req.params[0])).pipe(res)
        } else {
            logger.info("'Sorry, we cannot find that! " + parse[2] + "://" + parse[3] + "/" + req.params[0])
            res.send(404, 'Sorry, we cannot find that!');
        }
    });
}
