var path = require('path');
var webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	devtool: "source-map",
	entry: {
		"bundle" : './public/Scripts/webpack.js',
		"bundle.min" : './public/Scripts/webpack.js',
	},
	output: {
		path: path.join(__dirname, "/public/Scripts/dist/"),
		filename: '[name].js',     
	},
	externals:{
		"jquery": "jQuery",
		"angular": "angular"
	}
};