var path = require('path');
var webpack = require('webpack');

var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
	},
	plugins: [	
	new UglifyJsPlugin({
		include: /\.min\.js$/,
		uglifyOptions: {
			ecma: 6,
			output: {
				comments: false,
				beautify: false,
			},
			compress: {},
			warnings: false,
			sourceMap: true,
			minimize: true,
		}
	}),
	],
};