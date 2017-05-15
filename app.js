var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfig = require('./configs/database');
var Agenda = require('agenda');
var agenda = new Agenda({db: {address: dbConfig.url}});
var session = require('express-session');
var mongoose = require('mongoose');
var init = require('./app/helpper/initlazied');
var oddoo=require('./app/controller/connectCmsOdoo');
mongoose.Promise = global.Promise;
mongoose.createConnection(dbConfig.url);

//aaaa
init();
agenda.define('check beer', function (job, done) {
    try {
        oddoo.checklistbeer(done);
    }
    catch(err) {
        console.log("check beer: "+err);
        done();
    }

});


agenda.on('ready', function () {
    agenda.every('11 * * * *', 'check beer');
    agenda.start();
});
var routes = require('./routes/index');
var apis = require('./routes/app');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'manager-ibiero',
    resave: true,
    saveUninitialized: true
}));
app.use('/', routes);
app.use('/api', apis);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next();
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: "Not found",
            error: {}
        });
    });
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: "not found",
        error: {}
    });
});
module.exports = app;
