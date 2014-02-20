var db = require('../utilties/db');
var _ = require('underscore');

exports.check = function (req, res) {
    db.get("select * from users where name=$name and password=$password", db.args(req.body)).done(function (row) {
        if (row)
            res.send(row);
        else
            res.send(401);
    }, function (err) {
        res.send(500, err);
    });

};
