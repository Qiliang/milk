var fs = require('fs');
var Q = require('Q');
var _ = require('underscore');
var path = require('path');

var readdir = Q.nfbind(fs.readdir);
var stat = Q.nfbind(fs.stat);

Array.prototype.pushall = function (dir, arr) {
    var me = this;
    _(arr).each(function (item) {
        me.push(path.join(dir, item));
    });
}

var readchildren = function (dir) {
    var result = [];
    var basename = path.basename(dir);
    var files = _.filter(fs.readdirSync(dir), function (name) {
        return path.extname(name) === '.js' || path.extname(name) === '';
    });
    result.pushall(basename, files);
    _(files).each(function (name) {
        var file = path.join(dir, name)
        var stats = fs.statSync(file);
        if (stats.isDirectory())
            result.pushall(basename, readchildren(file));
    });
    return result;
}

exports.all = function (req, res) {
    var files = readchildren(path.join(req.app.get('public'), 'app'));
    res.send(files);
};

exports.views = function (req, res) {
    var files = _(readchildren(path.join(req.app.get('public'), 'app', 'view'))).map(function (file) {
        return '"invoicing.view.' + path.basename(file, '.js') + '"';
    });

    res.send('window.ext_views=[' + files + ']');
};

exports.models = function (req, res) {
    var files = _(readchildren(path.join(req.app.get('public'), 'app', 'model'))).map(function (file) {
        return '"invoicing.model.' + path.basename(file, '.js') + '"';
    });
    res.send('window.ext_models=[' + files + ']');
};

exports.stores = function (req, res) {
    var files = _(readchildren(path.join(req.app.get('public'), 'app', 'store'))).map(function (file) {
        return '"invoicing.store.' + path.basename(file, '.js') + '"';
    });
    res.send('window.ext_stores=[' + files + ']');
};