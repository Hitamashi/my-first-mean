var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProgramSchema = new mongoose.Schema({  		
    operator: {type: Schema.Types.ObjectId, ref: "User"}, 	//Dieu hanh
    price: Number,									        //Gia tour
    programFile: {type: Schema.Types.ObjectId, ref:"File"}, //File chuong trinh
    stay: String,                                           //Luu tru
    transport: String,                                      //Phuong tien
    note: String,											//Ghi chu
    
    createdDate: { type : Date, default: Date.now },
    modifiedDate: { type : Date, default: Date.now },	
    ticket: {type: Schema.Types.ObjectId, ref: "Ticket"},
    denyReason: String,	
});

mongoose.model("Program", ProgramSchema);
module.exports = mongoose.model("Program");