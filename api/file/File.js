var mongoose = require('mongoose'); 
 
var FileSchema = new mongoose.Schema({  
  	name: String,
  	path: String,
  	createdDate: { type : Date, default: Date.now }

});
mongoose.model('File', FileSchema);

module.exports = mongoose.model('File');