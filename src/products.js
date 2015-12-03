'use strict';

let api = require('./api');

let products = {
	list: function(options) {
		return api._get('/products', options);
	},
	one: function(options) {
		let id = options._id || options.id;
		return api._get('/products/' + id);
	}
};

module.exports = products;
