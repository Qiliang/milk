var _ = require('underscore');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var Q = require('Q');
var dbpath=path.join(__dirname.replace('utilties',''),'db.db3');
console.log(dbpath)
var db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE);


/*
 exports.all = function (sql) {
 var deferred = Q.defer();
 db.all(sql, function (err, rows) {
 if (err) {
 deferred.reject(new Error(err));
 } else {
 deferred.resolve(rows);
 }
 });
 return deferred.promise;
 }
 */
exports.all = Q.nbind(db.all, db);
exports.get = Q.nbind(db.get, db);
exports.each = Q.nbind(db.each, db);
exports.run = Q.nbind(db.run, db);

exports.args = function (obj) {
    var args = {};
    _.chain(obj).keys().each(function (key) {
        if (_(obj[key]).isArray()) {
            args['$' + key] = _(obj[key]).join(',')
        } else {
            if ('create_at' === key)
                args['$' + key] = obj[key].split('T')[0];
            else
                args['$' + key] = obj[key];
        }
    });
    return args;
};

exports.toDateString = function (date) {
    return new Date(date).toISOString().split('T')[0];
}
