/**
 * Module dependencies.
 */
//var process=require('process');
var express = require('express');
var routes = require('./routes');
var goods = require('./routes/goods');
var category = require('./routes/category');
var shops = require('./routes/shops');
var depots = require('./routes/depots');
var proxies = require('./routes/proxies');
var proxyins = require('./routes/proxyins');
var ins = require('./routes/ins');
var auth = require('./routes/auth');
var outs = require('./routes/outs');
var depotouts = require('./routes/depotouts');
var depotins = require('./routes/depotins');
var stock = require('./routes/stock');
var depotstock = require('./routes/depotstock');
var surplus = require('./routes/surplus');
var depotreport = require('./routes/depotreport');
var proxyreport = require('./routes/proxyreport');
var users = require('./routes/users');
var download = require('./routes/download');
var bootstrap = require('./routes/bootstrap');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('public', path.join(__dirname, 'public'));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/bootstrap', bootstrap.all);
app.get('/bootstrap/views', bootstrap.views);
app.get('/bootstrap/models', bootstrap.models);
app.get('/bootstrap/stores', bootstrap.stores);

app.get('/goods', goods.all);
app.post('/goods', goods.add);
app.put('/goods', goods.update);
app.delete('/goods', goods.delete);

app.get('/shops', shops.all);
app.post('/shops', shops.add);
app.put('/shops/:id', shops.update);
app.delete('/shops/:id', shops.delete);

app.get('/depots', depots.all);
app.post('/depots', depots.add);
app.put('/depots', depots.update);
app.delete('/depots', depots.delete);

app.get('/proxies', proxies.all);
app.post('/proxies/:id', proxies.add);
app.put('/proxies/:id', proxies.update);
app.delete('/proxies/:id', proxies.delete);
app.get('/proxies/:id/credit', proxies.credit);

app.get('/proxyins', proxyins.all);
app.post('/proxyins', proxyins.add);
app.put('/proxyins/:id', proxyins.update);
app.delete('/proxyins/:id', proxyins.delete);

app.get('/ins', ins.all);
app.post('/ins', ins.add);
app.put('/ins/:id', ins.update);
app.delete('/ins/:id', ins.delete);

app.get('/outs', outs.all);
app.post('/outs', outs.add);
app.put('/outs/:_id', outs.update);
app.delete('/outs/:_id', outs.delete);


app.get('/depotouts', depotouts.all);
app.post('/depotouts', depotouts.add);
app.put('/depotouts/:id', depotouts.update);
app.delete('/depotouts/:id', depotouts.delete);

app.get('/depotins', depotins.all);
app.post('/depotins', depotins.add);
app.put('/depotins/:id', depotins.update);
app.delete('/depotins/:id', depotins.delete);

app.get('/stock', stock.query);
app.get('/depotstock', depotstock.query);
app.get('/surplus', surplus.query);
app.get('/proxyreport', proxyreport.query);
app.get('/depotreport', depotreport.query);
app.post('/download', download.save);
app.get('/download', download.do);
app.get('/category', category.all);
app.get('/users', users.all);
app.post('/users', users.add);
app.put('/users/:id', users.update);
app.delete('/users/:id', users.delete);
app.post('/auth', auth.check);

process.stdout.on('error', function (err) {
    if (err.code == "EPIPE") {
        process.exit(0);
    }
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function () {
    console.log('Express server listening on port ' + app.get('port'));
});
