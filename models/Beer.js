"use strict";
const mongoose = require('mongoose');

let label = "Beer";

let schema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, maxLength: 500},
  priceCts: {type: Number, default: 0, required: true},
  country: {type: String},
  alcoholPercent: {type: Number, required: true},
  vote: {type: Number, default: 0},
  created: {type: Date, default: Date.now()},
  updated: {type: Date, default: Date.now()}
});

let model = mongoose.model(label, schema);

let methods = {
  findById : (id) => {
    return model
      .findById(id);
  },
  find : (query) => {
    return model
      .find(query);
  },
  create : (schema) => {
    let tmp = new model(schema);
    return tmp
      .save();
  },
  update : (query, schema, options) => {
    schema.updated = Date.now();
    return model
      .findOneAndUpdate(query, schema, options);
  },
  remove : (query) => {
    return model
      .remove(query);
  },
  findOne : (query) => {
    return model
      .findOne(query);
  }
};

module.exports = {
  label: label,
  methods : methods
};