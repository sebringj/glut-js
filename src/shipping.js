'use strict';

let api = require('./api');

let shipping = {
	methods: function() {
		return api._get('/shipping/methods');
	},
	rates: function(obj) {
		return api._post('/shipping/rates', obj);
	}
};

module.exports = shipping;
