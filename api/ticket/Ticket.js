var mongoose = require("mongoose");

//var Request = require("./Request");
//var TicketStatus = require("./TicketStatus");
var Schema = mongoose.Schema;

var TicketSchema = new mongoose.Schema({  
  	request: {type: Schema.Types.ObjectId, ref: "Request"}, 			//form Yeu cau
    program: {type: Schema.Types.ObjectId, ref: "Program"},				//form Chuong trinh
    info: {type: Schema.Types.ObjectId, ref: "Info"},					//form Thong tin
    estimation: {type: Schema.Types.ObjectId, ref: "Estimation"},		//form Du toan
    contract: {type: Schema.Types.ObjectId, ref: "Contract"},			//form Hop dong
    follow: {type: Schema.Types.ObjectId, ref:"Follow"},

    status: {type: Number, ref: "TicketState"},
    user: {type: Schema.Types.ObjectId, ref: "User"},
  	createdDate: { type : Date, default: Date.now },
  	modifiedDate: { type : Date, default: Date.now },
  	finishDate: Date,
    isArchived: {type: Boolean, default: false},
    comments: {
      type: [{type: Schema.Types.ObjectId, ref: "Comment"}],
      default: []
    },
});
mongoose.model("Ticket", TicketSchema);

module.exports = mongoose.model("Ticket");