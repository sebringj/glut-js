'use strict';

let _ = require('lodash');
let api = require('./api');
let emitter = require('event-emitter')({});

let storage = window.sessionStorage;

function serialize(cart) {
  storage.glutCart = JSON.stringify(cart);
}

function deserialize() {
  try {
    let tempCart = JSON.parse(storage.glutCart);
    if (Array.isArray(tempCart))
      return tempCart;
  } catch (ex) {}
  return [];
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

let fireOnInit = 'change'.split(' ');

module.exports = (function() {
  let cart = deserialize();
  return {
    reload: function() {
      cart = deserialize();
      emitter.emit('change');
    },
    inc: function(item) {
      if (typeof item === 'string')
        item = { upc: item };
      validateUpc(item.upc);
      let cartItem = find(cart, item.upc);
      if (cartItem)
        cartItem.quantity++;
      else
        throw 'glut.cart.inc() item does not exist';
      serialize(cart);
      emitter.emit('inc');
      emitter.emit('change');
    },
    dec: function(item) {
      if (typeof item === 'string')
        item = { upc: item };
      validateUpc(item.upc);
      let cartItem = find(cart, item.upc);
      if (cartItem) {
        cartItem.quantity--;
        if (cartItem.quantity <= 0)
          cart.splice(cartItem.index, 1);
      } else
        throw 'glut.cart.dec() item does not exist';
      serialize(cart);
      emitter.emit('dec');
      emitter.emit('change');
    },
    remove: function(item) {
      if (typeof item === 'string')
        item = { upc: item };
      validateUpc(item.upc);
      let cartItem = find(cart, item.upc);
      if (cartItem && cartItem.index > -1)
        cart.splice(cartItem.index, 1);
      serialize(cart);
      emitter.emit('remove');
      emitter.emit('change');
    },
    set: function(item, quantity) {
      validateUpc(item.upc);
      validateQuantity(quantity);
      let cartItem = find(cart, item.upc);
      if (cartItem)
        _.assign(cartItem, item, { quantity });
      else {
        item.quantity = quantity;
        cart.push(item);
      }
      serialize(cart);
      emitter.emit('set');
      emitter.emit('change');
    },
    find: function(upc) {
      validateUpc(upc);
      return find(cart, upc);
    },
    clear: function() {
      cart = [];
      serialize(cart);
      emitter.emit('clear');
      emitter.emit('change');
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
    subtotal: function() {
      let subtotal = 0;
      cart.forEach(function(item) {
        let qty = item.quantity || 0;
        let price = item.onSale ? item.salePrice : item.msrp;
        subtotal += qty * price;
      });
      return subtotal;
    },
    totalQuantity: function() {
      let qty = 0;
      for (let item of cart)
        qty += item.quantity;
      return qty;
    },
    on: function(evt, callback) {
      emitter.on(evt, callback);
      if (fireOnInit.indexOf(evt) > -1)
        emitter.emit(evt);
    },
    off: function(evt, callback) {
      emitter.off(evt, callback);
    },
    emit: function(evt) {
      emitter.emit(evt);
    }
  };
})();
