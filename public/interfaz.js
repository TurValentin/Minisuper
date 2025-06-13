document.addEventListener("DOMContentLoaded", () => {
  // Verificar elementos clave
  const metodoSelect = document.getElementById("metodo");
  const formDatos = document.getElementById("formulario-datos");
  const endpointSelect = document.getElementById("endpoint-select");
  const idContainer = document.getElementById("id-container");

  // para mostrar o ocultar el form dependiendo del metodo
  if (metodoSelect && formDatos) {
    metodoSelect.addEventListener("change", function () {
      formDatos.style.display =
        this.value === "GET" || this.value === "DELETE" ? "none" : "block";
    });
  }

  // y este para mostrar o ocultar el campo de elegir id
  if (endpointSelect && idContainer) {
    endpointSelect.addEventListener("change", function () {
      idContainer.style.display =
        this.value === "/productos/" ? "block" : "none";
    });
  }
});
