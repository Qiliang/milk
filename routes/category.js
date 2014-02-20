var db = require('../utilties/db');

exports.all = function (req, res) {

    db.all('select * from category').done(function (rows) {
        console.log(rows);
        res.send(rows);
    });


};