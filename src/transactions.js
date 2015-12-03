'use strict';

let api = require('./api');

function validate(options) {
	// todo: validate options
}

module.exports = {
	transact: function(options) {
		return api._post('/transactions', options);
	}
};
