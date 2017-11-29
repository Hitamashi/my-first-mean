var mongoose = require('mongoose');
var UserRole = require('./UserRole');

var UserSchema = new mongoose.Schema({  
  	name: String,
  	email: String,
  	password: String,
  	team: String,
  	roles: {
  		type: [ { type: String, ref:'UserRole',} ],
    	required: true,
    	default: "basic"
  	},
  	createdDate: { type : Date, default: Date.now },
  	modifiedDate: { type : Date, default: Date.now }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');