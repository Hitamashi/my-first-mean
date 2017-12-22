var mongoose = require("mongoose");

var TicketStatusSchema = new mongoose.Schema({  
  	_id: Number,
  	name: String,
  	description: String,
});
mongoose.model("TicketState", TicketStatusSchema);

module.exports = mongoose.model("TicketState");