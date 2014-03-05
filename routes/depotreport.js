var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.query = function (req, res) {
    var from_date = db.toDateString(req.query.from_date),
        to_date = db.toDateString(req.query.to_date);

    Q.all([db.all('select sum(count) count,shop_name,name,price,depot_name from depotouts_view where supplement=$supplement and create_at>=$from and create_at<=$to group by shop_name,depot_name', {$supplement: 0, $from: from_date, $to: to_date})
            //, db.all('select sum(money) money,shop_name,proxy_name from proxyins_view where create_at>=$from and create_at<=$to group by shop_name,proxy_name', {$from: from_date, $to: to_date})
        ]).spread(function (outs) {
            _(outs).each(function (item) {
                item.amount = item.count * item.price;
            });
            res.send(outs);
        }).catch(function (err) {
            res.send(500, err);
        }).done();

};