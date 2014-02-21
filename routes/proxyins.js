var db = require('../utilties/db');
var _ = require('underscore');

exports.all = function (req, res) {
    var shop_id = req.query.shop_id,
        proxy_id = req.query.proxy_id,
        from_date = req.query.from_date ? db.toDateString(req.query.from_date) : '1983-11-30',
        to_date = req.query.to_date ? db.toDateString(req.query.to_date) : '2033-11-30',
        sort = _(JSON.parse(req.query.sort)).first();

    var order = ' order by ' + sort.property + ' ' + sort.direction;
    var where = ' where create_at>="' + from_date + '" and create_at<="' + to_date + '" ';
    if (shop_id) {
        where += ' and shop_id="' + shop_id + '"';
    }
    if (proxy_id) {
        where += ' and proxy_id="' + proxy_id + '"';
    }


    db.all('select * from proxyins_view' + where + order).done(function (rows) {
        res.send(rows);
    });
};

exports.add = function (req, res) {
    db.run(" insert into proxyins(shop_id,good_id,proxy_id,money) values($shop_id,$good_id,$proxy_id,$money)", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.update = function (req, res) {
    res.end();
};

exports.delete = function (req, res) {
    db.run(" delete from proxyins where id=$id", req.param('id')).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });

};