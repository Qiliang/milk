var db = require('../utilties/db');

exports.all = function (req, res) {
    db.all('select * from proxies').done(function (rows) {
        res.send(rows);
    });
};

exports.add = function (req, res) {
    db.run(" insert into proxies(id,name,credit) values($id,$name,$credit)", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.update = function (req, res) {
    res.end();
};

exports.delete = function (req, res) {
    db.run(" delete from proxies where id=$id", req.param('id')).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });

};