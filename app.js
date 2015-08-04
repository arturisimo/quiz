//importar paquetes con los middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');

//importar routes
var routes = require('./routes/index');

//generar aplicacion
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

//asociar rutas a los gestores
app.use('/', routes);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, request, response, next) {
    response.status(err.status || 500);
    response.render('error', {
      title: "Error",
      description: "Ooops ha habido un fallo técnico!",
      file: 'error',
      message: err.message,
      error: err,
      classMenu: { index:false, quiz: false, author:false }
    });
  });
}

// production error handler
// no stacktraces leaked to user

app.use(function(err, request, response, next) {
  response.status(err.status || 500);
  response.render('error', {
      title: "Error",
      description: "Ooops ha habido un fallo técnico!",
      file: 'error',
      message: err.message,
      usuario_sesion: request.session.user,
      error: err,
      classMenu: { index:false, quiz: false, author:false }
  });
});


module.exports = app;
