var express = require('express');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/'; 


app.use(express.static('./public'));

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

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