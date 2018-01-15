var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({ 
	createdDate: { type : Date, default: Date.now },
    user: {type: Schema.Types.ObjectId, ref: "User"},
    description: String,
    ticket: {type: Schema.Types.ObjectId, ref: "Ticket"},
});

mongoose.model("Comment", CommentSchema);
module.exports = mongoose.model("Comment");