var fs = require('fs');
var _ = require('underscore');
var path = require('path');

var dir = 'D:/Downloads/各种绅士与高能GIF';
var files = _.filter(fs.readdirSync(dir), function (name) {
    return path.extname(name) === '.jpg';
});

_(files).each(function (file) {
    var p = path.join(dir, file)
    fs.renameSync(p, p.replace('.jpg', '.gif'));
});

