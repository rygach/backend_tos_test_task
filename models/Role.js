const { Schema, model } = require('mongoose');

const Role = new Schema({
  // unique - уникальное поле, required - обязательное поле
  value: { type: String, unique: true, default: 'USER' },
});

module.exports = model('Role', Role);
