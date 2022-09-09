var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var initialRouter = require('./routes/initialRouter')
var companiesRouter = require('./routes/companiesRouter');
var employeeRouter = require('./routes/employeeRouter');
var appraisalRouter = require('./routes/appraisalsRouter');
var rewardsRouter = require('./routes/rewardsRoutes');
const {authMiddleWare, authMiddleWareForCompanyCreation} = require('./auth-middleware');
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/companies', authMiddleWareForCompanyCreation)
app.use('/api/companies', companiesRouter)
app.use('/',authMiddleWare)
app.use('/api/init', initialRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/appraisals', appraisalRouter)
app.use('/api/rewards', rewardsRouter)

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
