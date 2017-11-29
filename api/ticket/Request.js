var mongoose = require("mongoose");

var User = require("../user/User");

var RequestSchema = new mongoose.Schema({ 
	createdDate: { type : Date, default: Date.now }, 		//ngay bao tour
    salesman: {type: Schema.Types.ObjectId, ref: "User"}, 	//Sale
    destination: String,									//Dia diem
    numberDay: String,										//So ngay di (x ngay y dem)
    numberPeople: Number,									//So luong khach
    departureDate: Date,									//Ngay khoi hanh (Thoi gian di)
    nameClient: String,										//Ten doan khach
    description: String,									//Yeu cau khach
    note: String,											//Ghi chu
    result: {type: Boolean, default: false},				//Ket qua
    confirmBySale: {type:Boolean, default: false},			//Confirm by sale
    modifiedDate: { type : Date, default: Date.now },		
});

mongoose.model("Resquest", RequestSchema);
module.exports = mongoose.model("Resquest");