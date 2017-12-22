var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var InfoSchema = new mongoose.Schema({ 
	createdDate: { type : Date, default: Date.now }, 		//ngay bao tour
    salesman: {type: Schema.Types.ObjectId, ref: "User"}, 	//Sale
    companyName: String,                                    //Ten cong ty
    represent: String,                                      //Nguoi dai dien
    position: String,                                       //Chuc vu
    address: String,                                        //Dia chi
    taxCode: String,                                        //MST
    phoneNumber: String,                                    //Dien thoai
    account: String,                                        //Tai khoan
    departureTime: Date,                                    //Thoi gian khoi hanh
    numberAdult: Number,                                    //So nguoi lon
    numberChild_Half: Number,                               //So tre em 1/2
    numberChild_Free: Number,                               //So tre em free
    total: Number,                                          //Tong tien
    note: String,											//Ghi chu
    modifiedDate: { type : Date, default: Date.now },	
    ticket: {type: Schema.Types.ObjectId, ref: "Ticket"},	
});

mongoose.model("Info", InfoSchema);
module.exports = mongoose.model("Info");