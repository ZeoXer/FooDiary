var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB = require('./src/config/db');

var signupRouter = require('./src/routes/signup');
var logjnRouter = require('./src/routes/login');
var updatePasswordRouter = require('./src/routes/password')
var createUserRouter = require('./src/routes/createUser')
var healthyRoutes = require('./src/routes/healthy');

var app = express();

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/healthy', healthyRoutes);
app.use('/api/auth/signup', signupRouter)
app.use('/api/auth/login', logjnRouter)
app.use('/api/user/updatePassword', updatePasswordRouter);
app.use('/api/user/createUser', createUserRouter);

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