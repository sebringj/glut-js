'use strict';

let api = require('./api');

let payment = {
	methods: function() {
		return api._get('/payment/methods');
	}
};

module.exports = payment;
