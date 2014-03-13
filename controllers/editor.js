/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */

var path = require("path"),
    util = require('util'),
    cheerio = require('cheerio'),
    request = require('request'),
    fs = require('fs'),
    crypto = require('crypto');

exports.saveCode = function (req, res){
    var id = req.params.id, username, code = req.params.code || req.body.code;
    if (!id || !code) {
        res.send(500, { error: 'something blew up' });
        return null;
    }

    if(req.session !== undefined && req.session.user !== undefined) {
        username = req.session.user;
    } else {
        username = "public";
    }
    var templateModel = req.app.get('model')('template');
    templateModel.find({"_id": id},function (err, docs) {
        if (err || !docs) {
            res.send(500, { error: 'something blew up' });
        } else {
            // check auth
            var authors = docs[0].authors;
            authors.push(docs[0].creator);
            if (authors.indexOf(username) === -1 && admin.indexOf(username) === -1) {
                res.send(404, { error: 'you have no auth to do this! please contact'});
            } else {
                templateModel.findByIdAndUpdate(id, {"code": escape(code)}, function(err){
                    if(err) {
                        res.send(500, { error: 'something blew up' });
                    } else {
                        redis_client.set(id, code);
                        res.send({"code": 0, "msg": "Success"});
                    }
                });
            }
        }
    });
}

exports.index = function(req, res){
    var username;
    if(req.session !== undefined && req.session.user !== undefined) {
        username = req.session.user;
    } else {
        username = "public";
    }
    if (!req.params.id) {
        res.render('editor.jade',
        {
            title: 'Harvest.io', 
            user: username,
            flag: true
        });
    } else {
        req.app.get('model')('template').find({"_id": req.params.id}, function (err, docs) {
            if (err) {
                res.send(500, { error: 'something blew up' });
            } else {
                if (!docs) {
                    res.send(500, { error: 'something blew up' });
                } else {
                    var code = docs[0].code,
                        url = docs[0].simple_url;
                    console.log(docs[0].simple_url);
                    res.render('editor.jade',
                        {
                            title: 'Harvest.io', 
                            user: username,
                            flag: false,
                            url: url,
                            code: code,
                            id: req.params.id
                        }
                    );
                }
            }
        });
    }
}

exports.run = function (req, res){ 
    var code = req.body.code,
        url = req.body.url || req.query.url,
        params = req.body.vars || req.query.vars,
        pageType = req.body.pageType || "html";

    if(params) {
        try {
            console.dir(params = JSON.parse(params));
        } catch(e) {
            params = {};
        }
    }
    var username;
    if(req.session !== undefined && req.session.user !== undefined) {
        username = req.session.user;
    } else {
        username = "public";
    }
    // sha1 key
    var shasum = crypto.createHash('sha1');
    shasum.update(url);
    var url_key = shasum.digest('hex');
    /*
    redis_client.get(url_key, function(err, reply){
        if (reply !== null) {
            var ret = parse(reply, code, username, params, pageType);
            res.set('Content-Type', 'text/html');
            res.send(ret.html);
        } else {
    */
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // cache in redis
                    // redis_client.set(url_key, body);
                    // redis_client.expire(url_key, 300);

                    var ret = parse(body, code, username, params, pageType);
                    res.set('Content-Type', 'text/html');
                    res.send(ret.html);
                } else {
                    res.send('<p>Get the page Failed! check your url</p>');		
                }
            });
    //    }
    // });
}

function saveProcessedFile(filename, data) {
    var path = 'data/after/';
    fs.writeFile(path + "Baidu", data, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    })
}

function parse(html, code, username, params, pageType) {
    // sandbox
    var sandbox = {};
    sandbox.log = function(log, command) {
        var command = command || "console.log";
        var item = {
            command: command,
            result: util.inspect(log, { showHidden: true, depth: null })
        };
        clients[username] && clients[username].send(JSON.stringify(item));
    };
    console.log(pageType);
    sandbox.params = params;
    if(pageType === "html") {
        // parse
        try {
            var $ = cheerio.load(html), ret = {},
                fn = new Function('$', 'sandbox', code);
            sandbox.originHtml = html; 
            ret.data = fn($, sandbox);
        } catch(e) {
            sandbox.log(e);
            console.log(e);
        }
        ret.html = $.html();      
    } else {
        try {
            var ret = {};
            sandbox.json = JSON.parse(html);
            var fn = new Function('sandbox', code);
            ret.data = fn(sandbox);
            ret.html = "hi";
        } catch(e) {
            ret.html = '{"Error": "Invalid Json!"}';
            console.log('{"Error": "Invalid Json!"}');
        }

        ret.html = html;
    }

    return ret;
}
