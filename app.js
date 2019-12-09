const createError = require('http-errors');
const express = require('express');
var session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const secrectSession = require('./app/config/config').sessionSecret;
const indexRouter = require('./app/routes/index');
const adminRouter = require('./app/routes/admin');


var app = express();
app.use(session({
	secret: secrectSession,
	resave: true,
	saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true  }));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404))
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;
