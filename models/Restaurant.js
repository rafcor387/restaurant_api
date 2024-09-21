// models/Restaurant.js
const mongoose = require("mongoose");

const PlateSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  porcion: String,
});

const RestaurantSchema = new mongoose.Schema({
  nombre: String,
  sucursales: [String],
  platos: [PlateSchema],
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
