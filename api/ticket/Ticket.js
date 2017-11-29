var mongoose = require("mongoose");

var Request = require("./Request");
var TicketStatus = require("./TicketStatus");

var TicketSchema = new mongoose.Schema({  
  	request: {type: Schema.Types.ObjectId, ref: "Request"},
    program: {type: Schema.Types.ObjectId, ref: "Program"},
    status: {type: Number, ref: "TicketStatus"},
  	createdDate: { type : Date, default: Date.now },
  	modifiedDate: { type : Date, default: Date.now }
});
mongoose.model("Ticket", TicketSchema);

module.exports = mongoose.model("Ticket");