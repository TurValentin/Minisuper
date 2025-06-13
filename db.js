const { Database } = require("@sqlitecloud/drivers");
const { SQLITE_URL } = require("./config.js");

const db = new Database(SQLITE_URL);

async function getProductosConProveedores() {
  const query = `
    SELECT p.id, p.nombre AS producto, pr.nombre AS proveedor, p.precio
    FROM productos p
    JOIN proveedores pr ON p.id_proveedor = pr.id
  `;
  return await db.sql(query);
}

async function getCategorias() {
  return await db.sql("SELECT * FROM categorias");
}

async function getProveedores() {
  return await db.sql("SELECT id, nombre FROM proveedores");
}

async function getProductoPorId(id) {
  const query = `
    SELECT p.*, pr.nombre as proveedor, c.nombre as categoria 
    FROM productos p
    JOIN proveedores pr ON p.id_proveedor = pr.id
    JOIN categorias c ON p.id_cat = c.id
    WHERE p.id = ${id}
  `;
  return await db.sql(query);
}

async function crearProducto(datos) {
  const { nombre, precio, id_proveedor, id_cat } = datos;

  if (!nombre || !precio || !id_proveedor || !id_cat) {
    throw new Error("Faltan datos para crear el producto");
  }

  const query = `
    INSERT INTO productos (nombre, precio, id_proveedor, id_cat) 
    VALUES ('${nombre}', ${precio}, ${id_proveedor}, ${id_cat})
    RETURNING *;
  `;

  const result = await db.sql(query);
  return result[0]; // para devolver el producto que recien cree
}

async function actualizarProducto(id, datos) {
  const { nombre, precio, id_proveedor } = datos;

  const query = `
    UPDATE productos 
    SET nombre = '${nombre}', precio = ${precio}, id_proveedor = ${id_proveedor}
    WHERE id = ${id}
    RETURNING *;
  `;

  const result = await db.sql(query);
  if (result.length === 0) throw new Error("Producto no encontrado");
  return result[0];
}

async function eliminarProducto(id) {
  const query = `DELETE FROM productos WHERE id = ${id}`;
  await db.sql(query);
}
module.exports = {
  getProductosConProveedores,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  getCategorias,
  getProveedores,
  getProductoPorId,
};
