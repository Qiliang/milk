var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.query = function (req, res) {
    var from_date = db.toDateString(req.query.from_date),
        to_date = db.toDateString(req.query.to_date);

    Q.all([db.all('select sum(count) count,shop_name,name,price,proxy_name from outs_view where create_at>=$from and create_at<=$to group by shop_name,proxy_name,name', {$from: from_date, $to: to_date})
            , db.all('select sum(money) money,shop_name,good_name,proxy_name from proxyins_view where create_at>=$from and create_at<=$to group by shop_name,proxy_name,good_name', {$from: from_date, $to: to_date})
        ]).spread(function (outs, proxyins) {
            var result = [];
            _(outs).each(function (item) {
                var in_item = _(proxyins).find(function (p) {
                    return p.name === item.good_name && p.shop_name === item.shop_name && p.proxy_name === item.proxy_name;
                });
                in_item = in_item ? in_item : {money: 0};
                result.push({proxy_name: item.proxy_name, shop_name: item.shop_name, good_name: item.name, count: item.count, amount: item.count * item.price, in_amount: in_item.money})
            });
            _(proxyins).each(function (item) {
                var exsits_item = _(result).find(function (p) {
                    return p.good_name === item.good_name && p.shop_name === item.shop_name && p.proxy_name === item.proxy_name;
                });
                if (!exsits_item)
                    result.push({proxy_name: item.proxy_name, shop_name: item.shop_name, good_name: item.good_name, count: 0, amount: 0, in_amount: item.money})
            });
            res.send(result);
        }).catch(function (err) {
            res.send(500, err);
        }).done();

};