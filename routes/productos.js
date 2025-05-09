const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csv-parser");

let productos = [];

// Leer productos solo una vez al iniciar el servidor
fs.createReadStream("./data/productos.csv")
  .pipe(csv())
  .on("data", (data) => {
    productos.push({
      id: productos.length + 1, // Generar un id simple
      supermercado: data.supermercado,
      categoria: data.categoria,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: parseFloat(data.precio),
    });
  })
  .on("end", () => {
    console.log("Productos cargados.");
  });

// GET - Todos los productos
router.get("/", (req, res) => {
  res.status(200).json(productos);
});

// GET - Producto por ID
router.get("/:id", (req, res) => {
  const producto = productos.find((p) => p.id === parseInt(req.params.id));
  if (producto) res.status(200).json(producto);
  else res.status(404).json({ mensaje: "Producto no encontrado" });
});

// POST - Agregar producto
router.post("/", (req, res) => {
  const nuevo = {
    id: productos.length + 1,
    ...req.body,
  };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT - Actualizar producto
router.put("/:id", (req, res) => {
  const index = productos.findIndex((p) => p.id === parseInt(req.params.id));
  if (index !== -1) {
    productos[index] = { ...productos[index], ...req.body };
    res.status(200).json(productos[index]);
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

// DELETE - Eliminar producto
router.delete("/:id", (req, res) => {
  const index = productos.findIndex((p) => p.id === parseInt(req.params.id));
  if (index !== -1) {
    productos.splice(index, 1);
    res.status(200).json({ mensaje: "Producto eliminado" });
  } else {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
});

// GET - Filtrar por categoría
router.get("/categoria/:nombre", (req, res) => {
  const categoria = req.params.nombre.toLowerCase();
  const filtrados = productos.filter((p) =>
    p.categoria.toLowerCase().includes(categoria)
  );

  if (filtrados.length > 0) {
    res.status(200).json(filtrados);
  } else {
    res
      .status(404)
      .json({ mensaje: "No se encontraron productos en esa categoría" });
  }
});

// GET - Productos con precio menor a un valor
router.get("/menorprecio/:monto", (req, res) => {
  const monto = parseFloat(req.params.monto);
  const baratos = productos.filter((p) => p.precio < monto);

  if (baratos.length > 0) {
    res.status(200).json(baratos);
  } else {
    res.status(404).json({
      mensaje: "No se encontraron productos por debajo de ese precio",
    });
  }
});

module.exports = router;
