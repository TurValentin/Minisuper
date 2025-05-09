const express = require("express");
const app = express();
const productosRoutes = require("./routes/productos");

app.use(express.json());
app.use("/productos", productosRoutes);

app.listen(7050, () => {
  console.log("Servidor corriendo en puerto 7050");
});
