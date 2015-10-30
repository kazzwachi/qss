var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('express-flash');

var login = require('./lib/login');

var routes = require('./routes/route');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//session
app.use(session({
  secret:'swordfishmeguro',
  cookie:{maxAge: 60000},
  store: session.Memorystore,
  resave: true,
  saveUninitialized: false
}));

//flash message
app.use(flash());

//passport
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


var Account = require('./models/account');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//mongoose
mongoose.connect('mongodb://'+process.env.IP +'/qss');

//force Authentification
app.use(login);

//routes
app.use('/', routes);
app.use('/admin', admin);
app.use('/user',users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
