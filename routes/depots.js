var db = require('../utilties/db');

exports.all = function (req, res) {
    db.all('select * from depots_view order by id').done(function (rows) {
        res.send(rows);
    });
};

exports.add = function (req, res) {
    db.run(" insert into depots(id,name,proxy_id,matching) values($id,$name,$proxy_id,$matching)", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.update = function (req, res) {
    delete req.body.proxy_name;
    db.run(" update depots set name=$name,matching=$matching,proxy_id=$proxy_id where id=$id", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.delete = function (req, res) {
    db.run(" delete from depots where id=$id", req.param('id')).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });

};