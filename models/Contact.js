const { Schema, model } = require('mongoose');

const Contact = new Schema({
  // unique - уникальное поле, required - обязательное поле
  name: { type: String, unique: true, required: true },
});

module.exports = model('Contact', Contact);
