var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.all = function (req, res) {

    Q.all([db.all('select * from outs'), db.all('select * from ins')]).spread(function (outs, ins) {
        var stat = stat_price(outs, ins);
        db.all('select * from proxies').done(function (rows) {
            _(rows).each(function (row) {
                if (_.isUndefined(stat[row.id])) {
                    row.remainder = 0;
                } else {
                    row.remainder = stat[row.id];
                }

            });
            res.send(rows);
        });
    });


};

exports.add = function (req, res) {
    delete req.body.id;
    db.run(" insert into proxies(name,credit) values($name,$credit)", db.args(req.body)).done(function (text) {
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

function stat_price(outs, ins) {
    var stat = {};
    _(outs).each(function (out) {
        if (_.isUndefined(stat[out.proxy]))stat[out.proxy] = 0;
        var out_price = price(out.count, ins);
        stat[out.proxy] += out_price;
    });
    return stat;
};

function price(d_value, ins) {
    var count = Math.abs(d_value);
    var price = 0;
    _.chain(ins).filter(function (in_item) {
        return in_item.count > 0;
    }).each(function (in_item) {
            if (count <= 0)return {};
            if (count > in_item.count) {
                price += in_item.count * in_item.price;
                count -= in_item.count;
                in_item.count = 0;
            } else {
                price += count * in_item.price;
                count = 0;
                in_item.count -= count;
            }
        });
    if (d_value >= 0)
        return price;
    else
        return price * -1;
}