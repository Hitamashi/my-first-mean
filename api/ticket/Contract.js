var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ContractSchema = new mongoose.Schema({
	contractNumber: String,										//So HD  		
    admin: {type: Schema.Types.ObjectId, ref: "User"}, 			//Admin
    contractFile: {type: Schema.Types.ObjectId, ref:"File"}, 	//File chuong trinh
    noteAdmin: String,
    
    status: {type:String, default: 'NEW', enum:['NEW','ACCEPTED', 'REJECTED']},		//Confirm boi ke toan
    accountant: {type: Schema.Types.ObjectId, ref: "User"},		//Ke toan
    noteAccountant: String,

    denyReason: String,

    createdDate: { type : Date, default: Date.now },
    modifiedDate: { type : Date, default: Date.now },
    ticket: {type: Schema.Types.ObjectId, ref: "Ticket"},	
});

mongoose.model("Contract", ContractSchema);
module.exports = mongoose.model("Contract");