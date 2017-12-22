var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var EstimationSchema = new mongoose.Schema({ 
	createdDate: { type : Date, default: Date.now },
    estimationFile: {type: Schema.Types.ObjectId, ref:"File"},  //File chuong trinh
    operator: {type: Schema.Types.ObjectId, ref: "User"}, 	//Dieu hanh
    modifiedDate: { type : Date, default: Date.now },		
    note: String,
    ticket: {type: Schema.Types.ObjectId, ref: "Ticket"}, 
});

mongoose.model("Estimation", EstimationSchema);
module.exports = mongoose.model("Estimation");