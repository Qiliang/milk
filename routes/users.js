var db = require('../utilties/db');
var _ = require('underscore');


exports.all = function (req, res) {
    var sql = "select * from users";
    db.all(sql).done(function (rows) {
        console.log(rows);
        res.send(rows);
    });
};

exports.add = function (req, res) {
    db.run(" insert into users(name,password,roles) values($name,$password,$roles)", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.update = function (req, res) {
    db.run(" update users set name=$name, password=$password,roles=$roles where id=$id", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.delete = function (req, res) {
    db.run(" delete from users where id=$id", req.param('id')).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
}
