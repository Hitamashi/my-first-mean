var mongoose = require("mongoose");

var User = require("../user/User");

var ProgramSchema = new mongoose.Schema({  		
    operator: {type: Schema.Types.ObjectId, ref: "User"}, 	//Dieu hanh
    price: Number,									        //Gia tour
    programFile: {type: Schema.Types.ObjectId, ref:"File"}, //File chuong trinh
    stay: String,                                           //Luu tru
    transport: String,                                      //Phuong tien
    note: String,											//Ghi chu
    confirmByOperator: {type:Boolean, default: false},	    //Confirm by operator
    createdDate: { type : Date, default: Date.now },
    modifiedDate: { type : Date, default: Date.now },		
});

mongoose.model("Resquest", ProgramSchema);
module.exports = mongoose.model("Resquest");