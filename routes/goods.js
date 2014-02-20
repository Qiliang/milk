var db = require('../utilties/db');

exports.all = function (req, res) {
    var category = req.query.category;
    var sql = "select * from goods";
    var orderBy = " order by substr(id,-7,7) ";
    if (category) {
        sql += " where category='" + category + "'";
    }
    db.all(sql + orderBy).done(function (rows) {
        console.log(rows);
        res.send(rows);
    });
};

exports.add = function (req, res) {

    delete req.body.createAt;
    db.run(" insert into goods(name,id,spec,unit,category,price,modifier) values($name,$id,$spec,$unit,$category,$price,$modifier)", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.update = function (req, res) {
    db.run(" update goods set name=$name,spec=$spec,unit=$unit,category=$category,price=$price,modifier=$modifier where id=$id", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.delete = function (req, res) {
    db.run(" delete from goods where id=$id", req.body.id).done(function (text) {
        res.send(text);
    });
};