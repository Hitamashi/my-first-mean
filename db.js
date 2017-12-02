var mongoose = require('mongoose');
var connectionString = process.env.MYSITE_MONGO || 'mongodb://user_rw:rwpassword@ds243055.mlab.com:43055/mydb';
mongoose.Promise = global.Promise;
mongoose.connect(connectionString, { useMongoClient: true });