'use strict';

let api = require('./api');

let products = {
  list: function(options) {
    return api._get('/products', options);
  },
  one: function(upc) {
    return api._get('/products?upc=' + upc);
  }
};

module.exports = products;
