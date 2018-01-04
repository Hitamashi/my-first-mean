var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FollowSchema = new mongoose.Schema({  		
    createdDate: { type : Date, default: Date.now },
    modifiedDate: { type : Date, default: Date.now },
    ticket: {type: Schema.Types.ObjectId, ref:"Ticket"},
    contractNumber: String,

    tourName: String,			//Ten tour
    startDate: Date,			//Ngay khoi hanh
    endDate: Date,				//Ngay ket thuc
    transport: String,			//Phuong tien
    note:String,				//Ghi chu

    listFile: {type: Schema.Types.ObjectId, ref:"File"},					//Danh sach
    reserveTransportFile: {type: Schema.Types.ObjectId, ref:"File"},		//Book xe
    reserveRestaurantFile: {type: Schema.Types.ObjectId, ref:"File"},		//Book nha hang
    reserveHotelFile: {type: Schema.Types.ObjectId, ref:"File"},			//Book khach san
    touristGuideFile: {type: Schema.Types.ObjectId, ref:"File"},			//HD huong dan vien
    galaFile: {type: Schema.Types.ObjectId, ref:"File"},					//Chuong trinh Gala
    passportFile: {type: Schema.Types.ObjectId, ref:"File"},				//Passport
    insuranceFile: {type: Schema.Types.ObjectId, ref:"File"},				//Bao hiem DL
    tourFile: {type: Schema.Types.ObjectId, ref:"File"},					//Điều tour

    total: {type:Number,default:0}, 									    //Tổng tiền
    receive: {type: [ {type: Number} ], default:[0,0,0,0,0] },			    //Các đợt thu
    receiveDate: {type: [ {type: Date} ], default:[null,null,null,null,null] }, //Ngay thu
    accountant: {type: Schema.Types.ObjectId, ref: "User"},
});

mongoose.model("Follow", FollowSchema);
module.exports = mongoose.model("Follow");