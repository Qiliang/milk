var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.all = function (req, res) {
    var category = req.query.category,
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

    db.all('select * from ins_view ' + where + order).done(function (rows) {
        res.send(rows);
    }, function (err) {
        res.send(500, err);
    });

//    Q.all([db.all('select * from ins_view ' + where + order + pager), db.get('select count(*) count from ins_view' + where)]).spread(function (rows, total) {
//        res.send({total: total.count, items: rows});
//    }).catch(function (err) {
//            res.send(500, err);
//        }).done();

};


var insert_stmt = "insert into ins(comment,count,price,good_id,remainder,create_at,modifier,expiry) values($comment,$count,$price,$good_id,$remainder,$create_at,$modifier,$expiry)"
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
    if (req.param('id') === '0' && req.body.from && req.body.to) {
        var from = db.toDateString(req.body.from),
            to = db.toDateString(req.body.to);
        db.all('select id,price from goods where price is not null').then(function (result) {
            var batch = _(result).map(function (item) {
                return db.run('update ins set price=$price where good_id=$good_id and create_at>=$from and create_at<=$to'
                    , {$good_id: item.id, $price: item.price, $from: from, $to: to});
            });
            Q.all(batch).spread(function (text) {
                res.send(text);
            }).catch(function (err) {
                    res.send(500, err);
                });
        }).catch(function (err) {
                res.send(500, err)
            });
    }
    else if (req.body.from && req.body.to) {
        db.get('select price from goods where id=$id', {$id: req.param('id')}).then(function (result) {
            db.run('update ins set price=$price where good_id=$good_id and create_at>=$from and create_at<=$to',
                {$good_id: req.param('id'), $price: result.price, $from: db.toDateString(req.body.from), $to: db.toDateString(req.body.to)}).then(function () {
                    res.send('OK');
                }).catch(function (err) {
                    res.send(500, err)
                });
        }).catch(function (err) {
                res.send(500, err)
            });

    } else {
        db.run(" update ins set expiry=$=expiry,comment=$comment,count=$count,price=$price,good_id=$good_id,remainder=$remainder,create_at=$create_at,modifier=$modifier where id=$id", db.args(req.body)).done(function (text) {
            res.send(text);
        }, function (err) {
            res.send(500, err);
        });
    }


};
var delete_stmt = " delete from ins where id=$id"
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

