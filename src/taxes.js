'use strict';

let api = require('./api');

let taxes = {
	applicableSalesTax: function() {
		return api._get('/taxes/applicable-sales-tax');
	}
};

module.exports = taxes;
