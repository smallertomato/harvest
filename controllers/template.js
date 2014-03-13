/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */

var path = require("path");

exports.meta = function (req, res){
    var id = req.params.id, username;
    if (!id) {
        res.send(500, { error: 'something blew up. param id is required!' });
    }

    req.app.get('model')('template').find({"_id": id}, function (err, docs) {
        if (err || !docs) {
            res.send(500, { error: 'something blew up' });
        } else {
            res.render('manage/metaedit',
                {
                    "template": docs[0]
                }
            );
        }
    })
}

exports.createform = function (req, res){
    req.app.get('model')('templateMeta').find({}, function (err, docs) {
        if (err) {
            res.send(500, { error: 'something blew up' });
        } else {
            res.render('manage/create',
                {
                    "groups" : docs
                }
            );
        }
    })
}

exports.create = function (req, res){
    var username;
    if(req.session !== undefined && req.session.user !== undefined) {
        username = req.session.user;
    } else {
        username = "public";
    }
    var template = {
        "creator": username,
        "name": req.body.name,
        "simple_url": escape(req.body.simple_url),
        "group": req.body.group,
        "subgroup": req.body.subgroup,
        "ie": req.body.ie,
        "type": req.body.pageType || "html",
        "utime": Date.now(),
        "ctime": Date.now(),
        "description": req.body.description,
        "available": (req.body.available && req.body.available === "on") ? "true" : "false"
    }
    if (req.body.authors && typeof req.body.authors === "string") {
        template.authors = req.body.authors.split(",");
    }
    // logger.debug(template);
    req.app.get('model')('template').create(template, function (err, doc) {
        if (err) {
            res.send(500, { error: 'something blew up' });
        } else {
            res.redirect("/manage/" + req.body.group + "/" + req.body.subgroup);
        }
    });
}

exports.metaedit = function (req, res){
    var id = req.params.id, username;
    if (!id) {
        res.send(500, { error: 'something blew up' });
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
            req.body.group = docs[0].group;
            req.body.subgroup = docs[0].subgroup;

            if (authors.indexOf(username) === -1 && admin.indexOf(username) === -1) {
                res.send(404, { error: 'you have no auth to do this! please contact ' + authors.join(",") + admin.join(",") });
            } else {
                var update = {
                    "name": req.body.name,
                    "type": req.body.pageType || "html",
                    "simple_url": escape(req.body.simple_url),
                    "description": req.body.description,
                    "ie": req.body.ie,
                    "available": (req.body.available && req.body.available === "on") ? "true" : "false"
                };
                if (req.body.authors && typeof req.body.authors === "string") {
                    updata_authors = req.body.authors.split(",");
                    update.authors = updata_authors;
                }
                update.utime = Date.now();
                // console.log(id, update);
                templateModel.findByIdAndUpdate(id, update, function(err){
                    if(err) {
                        res.send(500, { error: 'something blew up' });
                    } else {
                        res.redirect("/manage/" + req.body.group + "/" + req.body.subgroup);
                    }
                });
            }
        }
    })
}

exports.remove = function (req, res){
    var id = req.params.id || req.query.id, username;
    if (!id) {
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
                res.send({"code": 1, "msg": "<p>You have no auth to do this</p>"});
            } else {
                templateModel.findByIdAndRemove(id, function(err){
                    if(err) {
                        res.send(500, { error: 'something blew up' });
                    } else {
                        res.send({"code": 0, "msg": "<p>Success</p>"});
                    }
                });
            }
        }
    })
}

// templates manage
exports.manage = function (req, res){
    var username, group = req.params.group
        subgroup = req.params.subgroup;

    if(req.session !== undefined && req.session.user !== undefined) {
        username = req.session.user;
    } else {
        username = "public";
    }

    req.app.get('model')('template_meta').find({}, function (err, docs) {
        if (err) {
            res.send(500, { error: 'something blew up' });
        } else {
            // console.log(docs);
            res.render('manage',
                {
                    "title": 'Harvest.io', 
                    "user": username,
                    "group": group,
                    "subgroup": subgroup,
                    "groups" : docs
                }
            );
        }

    })
}

exports.manageAjax = function (req, res){
    var group = req.params.group
        subgroup = req.params.subgroup;

    req.app.get('model')('template').find({"group": group, "subgroup": subgroup},function (err, docs) {
        if (err) {
            res.send(500, { error: 'something blew up' });
        } else {
            // console.log(docs);
            res.render('manage/templates',
                {
                    "templates": docs
                }
            );
        }
    })
}

exports.apiTemplates = function (req, res){
    var selector = {};
    req.query.group ? selector.group = req.query.group : null;
    req.query.subgroup ? selector.subgroup = req.query.subgroup : null;

    req.app.get('model')('template').find(selector, {"code": false}, function (err, docs) {
        if (err) {
            res.send(500, { error: 'something blew up' });
        } else {
            // logger.info(docs);
            res.send(docs);
        }
    })
}
