const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

// Obtener todos los restaurantes
router.get("/", async (req, res) => {
  try {
    const restaurantes = await Restaurant.find();
    res.json(restaurantes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Crear un nuevo restaurante
router.post("/", async (req, res) => {
  const { nombre, sucursales, platos } = req.body;
  try {
    const newRestaurant = new Restaurant({ nombre, sucursales, platos });
    const restaurant = await newRestaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Actualizar un restaurante
router.put("/:id", async (req, res) => {
  const { nombre, sucursales, platos } = req.body;
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ msg: "Restaurante no encontrado" });

    restaurant.nombre = nombre;
    restaurant.sucursales = sucursales;
    restaurant.platos = platos; // Puedes actualizar todos los platos

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Eliminar un restaurante
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurante no encontrado" });
    }
    await Restaurant.deleteOne({ _id: req.params.id });
    res.json({ msg: "Restaurante eliminado" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Añadir un plato a un restaurante específico
router.post("/:id/platos", async (req, res) => {
  const { nombre, descripcion, precio, porcion } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurante no encontrado" });
    }

    const newPlate = { nombre, descripcion, precio, porcion };
    restaurant.platos.push(newPlate);
    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    console.error("Error al agregar el plato:", err.message);
    res.status(500).send("Server Error");
  }
});

// Eliminar un plato específico de un restaurante
router.delete("/:id/platos/:platoId", async (req, res) => {
  const { id, platoId } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurante no encontrado" });
    }

    restaurant.platos.id(platoId).remove(); // Eliminar el plato por ID
    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
