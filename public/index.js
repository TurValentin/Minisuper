document.addEventListener("DOMContentLoaded", () => {
  // con esto muestro el campo de elegir el id si hace falta
  document.getElementById("endpoint-select").addEventListener("change", (e) => {
    const idContainer = document.getElementById("id-container");
    idContainer.style.display =
      e.target.value === "/productos/" ? "block" : "none";
  });

  window.hacerConsulta = async function () {
    const metodo = document.getElementById("metodo").value;
    const endpointBase = document.getElementById("endpoint-select").value;
    const idProducto = document.getElementById("id-producto").value;
    const resultado = document.getElementById("resultado");

    let endpoint = endpointBase;
    if (endpointBase === "/productos/" && idProducto) {
      endpoint = `/productos/${idProducto}`;
    }

    let opcionesFetch = { method: metodo };

    // aca si es post o put se agrega el body
    if (metodo === "POST" || metodo === "PUT") {
      const nombreInput = document.getElementById("nombre-producto");
      const precioInput = document.getElementById("precio");
      const proveedorInput = document.getElementById("proveedor");
      const categoriaInput = document.getElementById("categoria");

      if (!nombreInput || !precioInput || !proveedorInput || !categoriaInput) {
        resultado.innerHTML = `<div class="error"> ERROR.Campos del formulario no disponibles</div>`;
        return;
      }

      const datosProducto = {
        nombre: nombreInput.value, //
        precio: parseFloat(precioInput.value),
        id_proveedor: parseInt(proveedorInput.value),
        id_cat: parseInt(categoriaInput.value),
      };

      // se valida que esten completos los campos
      if (!datosProducto.nombre || isNaN(datosProducto.precio)) {
        resultado.innerHTML = `<div class="error"> ERROR.Faltan datos obligatorios para ${metodo}</div>`;
        return;
      }

      opcionesFetch.headers = {
        "Content-Type": "application/json",
      };
      opcionesFetch.body = JSON.stringify(datosProducto);
    }

    // Si no se pone el num del id tira error
    if (
      metodo === "DELETE" &&
      (!idProducto || endpointBase !== "/productos/")
    ) {
      resultado.innerHTML = `<div class="error">⚠️ Debes especificar un ID para eliminar</div>`;
      return;
    }

    try {
      resultado.textContent = "Cargando...";
      const res = await fetch(
        `http://localhost:3000${endpoint}`,
        opcionesFetch
      );

      if (res.status === 204) {
        resultado.innerHTML = `<div class="success"> Se elimino el producto.</div>`;
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      resultado.innerHTML = Array.isArray(data)
        ? crearTablaHTML(data)
        : `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      resultado.innerHTML = `<div class="error"> ${error.message}</div>`;
    }
  };

  //Creo la tabla donde aparecen los productos
  function crearTablaHTML(datos) {
    return `
      <table class="tabla-datos">
        <thead>
          <tr>
            ${Object.keys(datos[0])
              .map((key) => `<th>${key}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${datos
            .map(
              (item) => `
            <tr>
              ${Object.values(item)
                .map((val) => `<td>${val}</td>`)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }
});
