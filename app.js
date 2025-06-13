const express = require("express");
const path = require("path");
const cors = require("cors");

const {
  getProductosConProveedores,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  getCategorias,
  getProveedores,
  getProductoPorId,
} = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Para parsear el json
app.use(express.static(path.join(__dirname, "public")));

//endpoints
app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/productos", async (req, res) => {
  try {
    const productos = await getProductosConProveedores();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/categorias", async (req, res) => {
  try {
    const categorias = await getCategorias();
    if (!categorias.length) throw new Error("No hay categorías");
    res.json(categorias);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.get("/proveedores", async (req, res) => {
  try {
    const proveedores = await getProveedores();
    if (!proveedores.length) throw new Error("No hay proveedores");
    res.json(proveedores);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.get("/productos/:id", async (req, res) => {
  try {
    const producto = await getProductoPorId(req.params.id);
    if (!producto.length) throw new Error("Producto no encontrado");
    res.json(producto[0]);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.post("/productos", async (req, res) => {
  console.log("POST /productos body:", req.body); // debug para controlar que se postee el prod

  try {
    const nuevoProducto = await crearProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error.message); // otro debug
    res.status(400).json({ error: error.message });
  }
});

app.put("/productos/:id", async (req, res) => {
  try {
    const productoActualizado = await actualizarProducto(
      req.params.id,
      req.body
    );
    res.json(productoActualizado);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.delete("/productos/:id", async (req, res) => {
  try {
    await eliminarProducto(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// para iniciar el server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
