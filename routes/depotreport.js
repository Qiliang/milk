var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.query = function (req, res) {
    var from_date = db.toDateString(req.query.from_date),
        to_date = db.toDateString(req.query.to_date),
        proxy_name = req.query.proxy_name;
    var condition = '';
    if (proxy_name) {
        condition = " proxy_name='" + proxy_name + "' and"
    }

    Q.all([db.all('select sum(count) count,shop_name,name,price,depot_name,proxy_name from depotouts_view where ' + condition + ' supplement=$supplement and create_at>=$from and create_at<=$to group by shop_name,depot_name,proxy_name', {$supplement: 0, $from: from_date, $to: to_date})
            , db.all('select sum(money) money,shop_name,proxy_name from proxyins_view where ' + condition + ' create_at>=$from and create_at<=$to group by shop_name,proxy_name', {$from: from_date, $to: to_date})
            , db.all('select * from depots_view')
        ]).spread(function (outs, proxyins, depots) {
            var result = [];
            _(outs).each(function (item) {
                var in_item = _(proxyins).find(function (p) {
                    return  p.shop_name === item.shop_name && p.proxy_name === item.proxy_name;
                });
                in_item = in_item ? in_item : {money: 0};
                result.push({depot_name: item.depot_name, proxy_name: item.proxy_name, shop_name: item.shop_name, count: item.count, amount: item.count * item.price, in_amount: in_item.money})
            });
            _(proxyins).each(function (item) {
                var exsits_item = _(result).find(function (p) {
                    return p.shop_name === item.shop_name && p.proxy_name === item.proxy_name;
                });
                if (!exsits_item) {
                    var depot = _.find(depots, function (depot) {
                        return depot.proxy_name === item.proxy_name;
                    });
                    result.push({depot_name: depot.name, proxy_name: item.proxy_name, shop_name: item.shop_name, count: 0, amount: 0, in_amount: item.money})
                }
            });
            res.send(result);
        }).catch(function (err) {
            res.send(500, err);
        }).done();

};
