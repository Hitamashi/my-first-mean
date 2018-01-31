var express = require('express');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/'; 

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.json());


app.use(express.static(__dirname +'/public'));

app.use('/home', express.static(__dirname +'/public/index.html'));

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var TicketController = require(__root + 'api/ticket/TicketRoutes');
app.use('/api/tickets', TicketController);

var FileController = require(__root + 'api/file/FileRoutes');
app.use('/api/file', FileController);

var UserController = require(__root + 'api/user/UserRoutes');
app.use('/api/users', UserController);

var AuthController = require(__root + 'api/auth/AuthController');
app.use('/api/auth', AuthController);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

module.exports = app;