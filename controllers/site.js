/**
 * Harvest
 * Copyright(c) 2013 Chao Liu <chaoliu.neu@gmail.com>
 * MIT Licensed
 */

exports.index = function (req, res){
    var username;
    if ((req.session || {}).user !== undefined) {
        username = req.session.user;
    } else {
        username = "public";
    }
    res.render('index',
        {
            title: 'Harvest.io',
            user: username
        }
    );
}