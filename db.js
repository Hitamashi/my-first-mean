var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://user_rw:rwpassword@ds243055.mlab.com:43055/mydb', { useMongoClient: true });