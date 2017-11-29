var mongoose = require("mongoose");  
var UserRoleSchema = new mongoose.Schema({  
	_id: String,
	name: String,
	description: String
});
mongoose.model("UserRole", UserRoleSchema);

module.exports = mongoose.model("UserRole");