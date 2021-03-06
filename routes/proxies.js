var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.all = function (req, res) {

    Q.all([db.all('select * from proxies'),
            db.get('select * from goods'),
            db.all('select sum(money) total,proxy_id from proxyins group by proxy_id'),
            db.all('select sum(count*price) total,proxy proxy_id from outs_view where supplement=$supplement group by proxy', {$supplement: 0})])
        .spread(function (rows, good, proxyins, outs) {
            _(rows).each(function (proxy) {
                proxy.credit_money = proxy.credit * good.price;
                proxy.remainder = 0;
                proxy.remainder_money = 0;
                proxy.remainder_money += getByProxy(proxyins, outs, proxy.id);
                proxy.remainder += proxy.remainder_money / good.price;

            });
            res.send(rows);
        });

};

function getByProxy(proxyins, outs, proxy_id) {
    var item_in = _(proxyins).find(function (item) {
        return item.proxy_id === proxy_id;
    });
    if (!item_in)item_in = {total: 0}
    var item_out = _(outs).find(function (item) {
        return item.proxy_id === proxy_id;
    });
    if (!item_out)item_out = {total: 0}

    return item_out.total - item_in.total;
}

exports.add = function (req, res) {
    delete req.body.id;
    db.run(" insert into proxies(name,credit) values($name,$credit)", db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.update = function (req, res) {
    db.run('update proxies set credit=$credit,name=$name where id=$id', db.args(req.body)).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });
};

exports.delete = function (req, res) {
    db.run(" delete from proxies where id=$id", req.param('id')).done(function (text) {
        res.send(text);
    }, function (err) {
        res.send(500, err);
    });

};

exports.credit = function (req, res) {
    var good_id = req.query.good_id,
        proxy_id = req.param('id'),
        count = req.query.count;

    Q.all([db.get('select * from proxies where id=$id', {$id: proxy_id}),
            db.all('select sum(money) total,proxy_id from proxyins group by proxy_id'),
            db.all('select sum(count*price) total,proxy proxy_id from outs_view where supplement=$supplement group by proxy', {$supplement: 0}),
            db.get('select * from goods')])
        .spread(function (proxy, proxyins, outs, good) {
            proxy.credit_money = proxy.credit * good.price;
            proxy.remainder = 0;
            proxy.remainder_money = 0;
            proxy.remainder_money += getByProxy(proxyins, outs, proxy.id);
            proxy.remainder += proxy.remainder_money / good.price;

            res.send(proxy);
        }).catch(function (err) {
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