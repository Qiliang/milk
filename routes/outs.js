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
    db.all('select * from outs_view ' + where + order).done(function (rows) {
        res.send(rows);
    }, function (err) {
        res.send(500, err);
    });
//    Q.all([db.all('select * from outs_view ' + where + order + pager), db.get('select count(*) count from outs_view' + where)]).spread(function (rows, total) {
//        res.send({total: total.count, items: rows});
//    }).catch(function (err) {
//            res.send(500, err);
//        }).done();

};
var insert_stmt = " insert into outs(proxy,comment,count,shop_name,good_id,create_at,modifier) values($proxy,$comment,$count,$shop_name,$good_id,$create_at,$modifier)";
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

    db.run(" update outs set proxy=$proxy,comment=$comment,count=$count,shop_name=$shop_name,good_id=$good_id,create_at=$create_at,modifier=$modifier where id=$id", db.args(req.body)).done(function (text) {
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

exports.can = function (req, res) {
    var id = req.query.id,
        to_date = new Date(req.query.to_date);
    to_date.setHours(23);
    to_date.setMinutes(59);

    var where = 'where create_at<="' + to_date.toDateString() + '"';
    Q.all([db.all('select count(*) from ins ' + where), db.get('select count(*) count from outs' + where)]).spread(function (ins_count, outs_count) {
        res.send({limit: ins_count - outs_count});
    }).catch(function (err) {
            res.send(500, err);
        }).done();

};