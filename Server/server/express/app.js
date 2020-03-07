let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let userRouter = require('./routes/apis/v1/User');
// var testRouter = require('./routes/test');

let app = express();

let cookieEncryptionToken = require('./.secret.js').cookieEncryptionToken;
let sessionEncryptionToken = require('./.secret.js').sessionEncryptionToken;
let frontendAddress = require('./.secret.js').frontendAddress;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieEncryptionToken));
app.use(express.static(path.join(__dirname, 'public')));

// Cross-domain settings
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", frontendAddress);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.use(session({
  name: 'xmdsmdsj.login',
  secret: sessionEncryptionToken,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 24, httpOnly: true }
}));

app.use('/', indexRouter);
app.use('/v1/User', userRouter);
// app.use('/test/', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
