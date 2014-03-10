var _ = require('underscore');
var db = require('../utilties/db');
var Q = require('Q');

exports.query = function (req, res) {
    var from_date = db.toDateString(req.query.from_date),
        to_date = db.toDateString(req.query.to_date),
        category = req.query.category;

    Q.all([d_value(from_date, category), d_value(to_date, category, true), total_in(from_date, to_date, category), total_out(from_date, to_date, category)]).spread(function (from, to, in_stat, out_stat) {
        var result = [];
        _(to).each(function (item) {
            var from_item = _(from).find(function (p) {
                return p.id === item.id;
            });
            var in_item = get_good_count(item.id, in_stat);
            var out_item = get_good_count(item.id, out_stat);
            item.begin_count = from_item.d_value;
            item.total_count = item.d_value;
            item.out_count = out_item.count;
            item.in_count = in_item.count;
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

function where_category(category) {
    if (category)
        return 'and category="' + category + '"'
    return '';

}

function total_in(from_date, to_date, category) {
    var deferred = Q.defer();
    var where = ' and 1=1'
    db.all('select good_id, sum(count) count from ins_view where create_at>=$from_date and create_at<=$to_date ' + where_category(category) + ' group by good_id', {$from_date: from_date, $to_date: to_date}).done(function (rows) {
        deferred.resolve(rows);
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function total_out(from_date, to_date, category) {
    var deferred = Q.defer();
    db.all('select good_id, sum(count) count from outs_view where create_at>=$from_date and create_at<=$to_date ' + where_category(category) + ' group by good_id', {$from_date: from_date, $to_date: to_date}).done(function (rows) {
        deferred.resolve(rows);
    }, function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function d_value(to_date, category, included) {
    var deferred = Q.defer();
    var op = '<';
    if (included)op = '<=';
    Q.all([db.all('select * from goods where 1=1 ' + where_category(category) + ' order by substr(id,-7,7)'),
            db.all('select * from ins where create_at>date($to_date,"-1 year") order by create_at desc', {$to_date: to_date}),
            db.all('select good_id,sum(count) count from ins  where create_at' + op + '$to_date  group by good_id', {$to_date: to_date}),
            db.all('select good_id,sum(count) count from outs_view where create_at' + op + '$to_date  group by good_id', {$to_date: to_date})]
        ).spread(function (goods, ins_history, ins, outs) {
            var result = [];
            _(goods).each(function (good) {
                var out_item = get_good_count(good.id, outs);
                var in_item = get_good_count(good.id, ins);
                var d_value = in_item.count - out_item.count;
                result.push(_(good).extend({d_value: d_value, total_price: price(good.id, d_value, ins_history)}));
            });
            deferred.resolve(result);
        }).catch(function (err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

function price(good_id, d_value, ins) {
    var count = Math.abs(d_value);
    var price = 0;
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
    if (d_value >= 0)
        return price;
    else
        return price * -1;
}
