var createError = require('http-errors');
var express = require('express');
var path = require('path');
const http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var WebSocket = require('ws');
var { verifyToken } = require('./src/middlewares/verifyToken');
var connectDB = require('./src/config/db');
var { connectRedis } = require('./src/config/redis');
// var initializeDatabase = require('./src/database/initializeDatabase');

var authRouter = require('./src/routes/auth');    
var userRouter = require('./src/routes/user');    
var recordRouter = require('./src/routes/record'); 
var chatRouter = require('./src/routes/chat'); 
var healthyRouter = require('./src/routes/healthy'); 

var app = express();

connectDB();
connectRedis();

// initializeDatabase()

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRouter);    
app.use('/api/chat', verifyToken, chatRouter);  
app.use('/api/user', verifyToken, userRouter);    
app.use('/api/record', verifyToken, recordRouter); 
app.use('/api/healthy', healthyRouter); 

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