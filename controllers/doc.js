/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */
 
exports.index = function (req, res){
    var username, article = req.params.article;
    if(req.session !== undefined && req.session.user !== undefined) {
        username = req.session.user;
    }
    if (article === 'index') {
        article = 'what-is-harvest';
    }
    res.render('doc',
        {
            title: 'Harvest.io', 
            user: username,
            article: article
        }
    );
}

exports.ajax = function (req, res){
    var article = req.params.article;
    if (article === 'index') {
        article = 'what-is-harvest';
    }
    res.render('doc/' + article);
}