var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.all = function (req, res) {
    var shop = req.query.shop,
        category = req.query.category,
        from_date = req.query.from_date ? db.toDateString(req.query.from_date) : '1983-11-30',
        to_date = req.query.to_date ? db.toDateString(req.query.to_date) : '2033-11-30';
    var start = parseInt(req.query.start),
        limit = parseInt(req.query.limit),
        sort = _(JSON.parse(req.query.sort)).first();

    var order = ' order by ' + sort.property + ' ' + sort.direction;
    var pager = ' limit ' + start + ',' + limit;
    var where = ' where create_at>="' + from_date + '" and create_at<="' + to_date + '" ';
    if (category) {
        where += ' and category="' + category + '"';
    }
    if (shop) {
        where += ' and shop_name="' + shop + '"';
    }
    db.all('select * from depotouts_view ' + where + order).done(function (rows) {
        res.send(rows);
    }, function (err) {
        res.send(500, err);
    });

};
var insert_stmt = " insert into outs(supplement,proxy,comment,count,shop_name,good_id,create_at,modifier,depot_id) values($supplement,$proxy,$comment,$count,$shop_name,$good_id,$create_at,$modifier,$depot_id)";
exports.add = function (req, res) {
    if (_.isArray(req.body)) {
        var batch = _(req.body).map(function (item) {
            return db.run(insert_stmt, db.args(item));
        });
        Q.all(batch).spread(function (text) {
            res.send(text);
        }).catch(function (err) {
                res.send(500, err);
            });
    } else {
        db.run(insert_stmt, db.args(req.body)).done(function (text) {
            res.send(text);
        }, function (err) {
            res.send(500, err);
        });
    }
};


exports.update = function (req, res) {

    db.run(" update outs set depot_id=$depot_id,supplement=$supplement,proxy=$proxy,comment=$comment,count=$count,shop_name=$shop_name,good_id=$good_id,create_at=$create_at,modifier=$modifier where id=$id", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

var delete_stmt = " delete from outs where id=$id";
exports.delete = function (req, res) {
    if (_.isArray(req.body)) {
        var batch = _(req.body).map(function (item) {
            return db.run(delete_stmt, item.id);
        });
        Q.all(batch).spread(function (text) {
            res.send(text);
        }).catch(function (err) {
                res.send(500, err);
            });
    } else {
        db.run(delete_stmt, req.param('id')).done(function (text) {
            res.send(text);
        }, function (err) {
            res.send(500, err);
        });
    }
};
