var app = require('./app');
var port = process.env.PORT || 3000;


app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});