'use strict';

let _ = require('lodash');
let api = require('./api');

let storage = window.sessionStorage;

function serialize(cart) {
  storage.glutCart = JSON.stringify(cart);
}

function deserialize() {
  try {
    let tempCart = JSON.parse(storage.glutCart);
    if (Array.isArray(tempCart))
      return [];
  } catch (ex) {
    return [];
  }
}

function find(cart, upc) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].upc === upc) {
      cart[i].index = i;
      return cart[i];
    }
  }
  return undefined;
}

function validateUpc(upc) {
  if (typeof upc !== 'string')
    throw 'upc type invalid.';
}

function validateQuantity(quantity) {
  if (typeof quantity !== 'number')
    throw 'quantity type invalid.';
  if (quantity < 0)
    throw 'quantity value invalid.';
}

module.exports = (function() {
  let cart = deserialize();
  return {
    inc: function(item) {
      if (typeof item === 'string')
        item = {
          upc: item
        };
      validateUpc(item.upc);
      let cartItem = find(cart, item.upc);
      if (cartItem)
        cartItem.quantity++;
      else
        throw 'glut.cart.inc() item does not exist';
      serialize(cart);
    },
    dec: function(item) {
      if (typeof item === 'string')
        item = {
          upc: item
        };
      validateUpc(item.upc);
      let cartItem = find(cart, item.upc);
      if (cartItem) {
        cartItem.quantity--;
        if (cartItem.quantity <= 0)
          cart.splice(cartItem.index, 1);
      } else
        throw 'glut.cart.dec() item does not exist';
      serialize(cart);
    },
    remove: function(item) {
      if (typeof item === 'string')
        item = {
          upc: item
        };
      validateUpc(item.upc);
      let cartItem = find(cart, item.upc);
      if (cartItem && cartItem.index > -1)
        cart.splice(cartItem.index, 1);
      serialize(cart);
    },
    set: function(item) {
      validateUpc(item.upc);
      validateQuantity(item.quantity);
      let cartItem = find(cart, item.upc);
      if (cartItem)
        cartItem.quantity = item.quantity;
      else
        cart.push(item);
      serialize(cart);
    },
    find: function(upc) {
      validateUpc(upc);
      return find(cart, upc);
    },
    clear: function() {
      cart = [];
      serialize(cart);
    },
    list: function() {
      return _.clone(cart, true);
    },
    validate: function() {
      return api._post('/cart/validate', _.clone(cart, true));
    },
    toString: function() {
      return JSON.stringify(cart);
    },
    getSubtotal: function() {
      let subtotal = 0;
      cart.forEach(function(item) {
        let qty = item.quantity || 0;
        let msrp = item.msrp || 0;
        subtotal += qty * msrp;
      });
      return subtotal;
    }
  };
})();
