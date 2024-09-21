// routes/restaurantes.js
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
    const newRestaurant = new Restaurant({
      nombre,
      sucursales,
      platos,
    });

    const restaurant = await newRestaurant.save();
    res.json(restaurant);
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
    restaurant.platos = platos;

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Eliminar un restaurante
router.delete("/:id", async (req, res) => {
  try {
    // Verifica si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurante no encontrado" });
    }

    // Utilizar deleteOne para eliminar el restaurante
    await Restaurant.deleteOne({ _id: req.params.id });
    res.json({ msg: "Restaurante eliminado" });
  } catch (err) {
    console.error("Error en la operación DELETE:", err.message);
    res.status(500).send("Server Error");
  }
});

//otra cosa--------------------------------------------------------------------------
// Añadir un plato a una sucursal específica
router.post("/:id/platos", async (req, res) => {
  const { nombre, descripcion, precio, porcion, sucursal } = req.body;

  try {
    // Verifica si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    // Buscar el restaurante por ID
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurante no encontrado" });
    }

    // Verifica si la sucursal existe
    if (!restaurant.sucursales.includes(sucursal)) {
      return res.status(404).json({ msg: "Sucursal no encontrada" });
    }

    // Crear nuevo plato
    const newPlate = {
      nombre,
      descripcion,
      precio,
      porcion,
    };

    // Agregar el plato al restaurante
    restaurant.platos.push(newPlate);
    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    console.error("Error al agregar el plato:", err.message);
    res.status(500).send("Server Error");
  }
});
// Obtener los platos de una sucursal específica
router.get("/:id/platos/:sucursal", async (req, res) => {
  const { id, sucursal } = req.params;

  try {
    // Verifica si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido" });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurante no encontrado" });
    }

    // Verifica si la sucursal existe
    if (!restaurant.sucursales.includes(sucursal)) {
      return res.status(404).json({ msg: "Sucursal no encontrada" });
    }

    // Filtrar los platos por sucursal (asumiendo que cada plato tiene una propiedad de sucursal)
    // Nota: Asegúrate de que tu esquema de platos incluye una propiedad para la sucursal si aún no la tiene.
    const platos = restaurant.platos.filter(
      (plato) => plato.sucursal === sucursal
    );

    res.json(platos);
  } catch (err) {
    console.error("Error al obtener los platos:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
