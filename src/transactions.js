'use strict';

let api = require('./api');
let _ = require('lodash');

let required = [
  'shippingMethod', 'payer', 'recipient', 'cvv2',
  'cardNumber', 'expMonth', 'expYear', 'products'
];

function transactionValid(options) {
  options = options || {};
  for (let item of required) {
    if (!_.has(options, item))
      return false;
  }
  return true;
}

module.exports = {
  transact: function(options) {
    console.log(options);
    if (transactionValid(options))
      return api._post('/transactions/charge', options);
    return Promise.reject({ message: required.join(', ') + ' are required.'});
  }
};
