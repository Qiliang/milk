var fs = require('fs');
exports.save = function (req, res) {
    fs.writeFile(req.body.filename, req.body.data, function (err) {
        if (err) throw err;
        res.send(200);
    });
};
exports.do = function (req, res) {
    res.download(req.query.filename, function (err) {
        if (err) return console.error(err);
        fs.unlink(req.query.filename, function (err) {
            if (err) return console.error(err);
        });
    });
};