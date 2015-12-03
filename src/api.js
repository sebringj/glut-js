'use strict';

let request = require('superagent');
let querystring = require('querystring');
let _ = require('lodash');
let config = require('./config');

function getQs(options) {
	if (!options)
		return '';
	let qs = querystring.stringify(options);
	if (qs) return '?' + qs;
	return '';
}

function getRequest(url, options, verb) {
	let useQs = ['get', 'del'].indexOf(verb) > -1 ? true : false;
	let qs = useQs ? getQs(options) : '';
	let baseUrl = _.get(config, 'api');
	if (!baseUrl) throw 'config.api url must be defined';
	let newUrl = baseUrl + url + qs;
	let promise = new Promise(function(resolve, reject) {
		let req = request[verb](newUrl);
		if (!useQs)
			req = req.set('Content-Type', 'application/json').send(options);
		req.end(function(err, res) {
			if (err) {
				reject(err);
				return;
			}
			try {
				let json = JSON.parse(res.text);
				resolve(json);
			} catch(ex) {
				reject(ex);
			}
		});
	});
	return promise;
}

let api = {
	_get: function(url, options) {
		return getRequest(url, options, 'get');
	},
	_post: function(url, options) {
		return getRequest(url, options, 'post');
	},
	_put: function(url, options) {
		return getRequest(url, options, 'put');
	},
	_del: function(url, options) {
		return getRequest(url, options, 'del');
	}
};

module.exports = api;
