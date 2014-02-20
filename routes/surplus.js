var _ = require('underscore');
var db = require('../utilties/db')
var Q = require('Q');

exports.query = function (req, res) {
    var category = req.query.category,
        from_date = db.toDateString(req.query.from_date),
        to_date = db.toDateString(req.query.to_date);

    Q.all([d_value(category, from_date), d_value(category, to_date, true), total_in(from_date, to_date), total_out(from_date, to_date)]).spread(function (from, to, in_stat, out_stat) {
        var result = [];
        _(to).each(function (item) {
            var from_item = _(from).find(function (p) {
                return p.id === item.id;
            });
            var in_item = get_good_count(item.id, in_stat);
            var out_item = get_good_count(item.id, out_stat);
            item.begin_count = from_item.d_value;
            item.begin_price = from_item.total_price;
            item.total_count = item.d_value;
            item.total_price = item.total_price;
            item.out_count = out_item.count;
            item.in_count = in_item.count;
            item.in_price = in_item.price;
            result.push(item)
        });
        res.send(result);
    }).catch(function (err) {
            res.send(500, err);
        }).done();

};

function get_good_count(good_id, stat) {
    var item = _(stat).find(function (p) {
        return p.good_id === good_id;
    });
    return item ? item : {count: 0};
}

function get_good_shop_count(good_id, shop_name, stat) {
    var item = _(stat).find(function (p) {
        return p.good_id === good_id && p.shop_name === shop_name;
    });
    return item ? item : {count: 0};
}

function total_in(from_date, to_date) {
    var deferred = Q.defer();
    db.all('select good_id, sum(count) count,sum(count*price) price from ins where create_at>=$from_date and create_at<=$to_date group by good_id', {$from_date: from_date, $to_date: to_date}).done(function (rows) {
        deferred.resolve(rows);
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function total_out(from_date, to_date) {
    var deferred = Q.defer();
    db.all('select good_id, sum(count) count from outs where create_at>=$from_date and create_at<=$to_date group by good_id', {$from_date: from_date, $to_date: to_date}).done(function (rows) {
        deferred.resolve(rows);
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function where_category(category) {
    if (category)
        return 'and category="' + category + '"'
    return '';

}

function d_value(category, to_date, included) {
    var deferred = Q.defer();
    var op = '<';
    if (included)op = '<=';
    Q.all([db.all('select * from goods where 1=1 ' + where_category(category) + ' order by substr(id,-7,7)'),
            db.all('select name from shops'),
            db.all('select * from ins where create_at>date($to_date,"-1 year") order by create_at desc', {$to_date: to_date}),
            db.all('select good_id,sum(count) count from ins  where create_at' + op + '$to_date group by good_id', {$to_date: to_date}),
            db.all('select good_id,sum(count) count from outs where create_at' + op + '$to_date group by good_id', {$to_date: to_date}),
            db.all('select good_id,shop_name,sum(count) count from outs where create_at' + op + '$to_date group by good_id,shop_name', {$to_date: to_date})]
        ).spread(function (goods, shops, ins_history, ins, outs, shop_outs) {
            var result = [];
            _(goods).each(function (good) {
                var in_item = get_good_count(good.id, ins);
                var out_item = get_good_count(good.id, outs);
                var d_value = in_item.count - out_item.count;
                var avg = avg_price(good.id, d_value, ins_history);
                _(shops).each(function (shop) {
                    var out_shop_item = get_good_shop_count(good.id, shop.name, shop_outs);
                    good[shop.name + '_count'] = out_shop_item.count;
                    good[shop.name + '_price'] = out_shop_item.count * avg;
                    _(good).extend({ _price: avg * d_value})
                });
                result.push(_(good).extend({d_value: d_value, avg_price: avg, total_price: avg * d_value}));
            });
            deferred.resolve(result);
        }).catch(function (err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

function avg_price(good_id, d_value, ins) {
    var count = Math.abs(d_value);
    var price = 0.0;
    _.chain(ins).filter(function (in_item) {
        return in_item.good_id === good_id
    }).each(function (in_item) {
            if (count <= 0)return {};
            if (count > in_item.count) {
                price += in_item.count * in_item.price;
                count -= in_item.count;
            } else {
                price += count * in_item.price;
                count = 0;
            }
        });
    if (price === 0)
        return 0
    return price / d_value;
}