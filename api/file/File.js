var mongoose = require('mongoose'); 
var p = require('path');

var FileSchema = new mongoose.Schema({  
  	name: String,
  	path: String,
  	createdDate: { type : Date, default: Date.now }

});

FileSchema.virtual('fullPath').get(function () {
  return p.join(this.path, this.id.toString());
});

mongoose.model('File', FileSchema);

module.exports = mongoose.model('File');