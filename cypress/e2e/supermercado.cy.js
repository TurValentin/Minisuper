describe("API - Productos", () => {
  it("Debería obtener la lista de productos", () => {
    cy.request("http://localhost:3000/productos").then((response) => {
      // Se fija que sea 200 para poder continuar
      expect(response.status).to.eq(200);

      // aca se fija si es un array
      expect(response.body).to.be.an("array");

      // para ver que devuelve
      cy.log(JSON.stringify(response.body));
    });
  });
});

describe("API - Productos", () => {
  it("Debería crear un nuevo producto", () => {
    const producto = {
      nombre: "Pan dulce",
      precio: 900,
      id_proveedor: 1,
      id_cat: 2,
    };

    cy.request("POST", "http://localhost:3000/productos", producto).then(
      (response) => {
        expect(response.status).to.eq(201); // Para la creacion del prod
        expect(response.body).to.have.property("nombre", "Pan dulce");
        expect(response.body).to.have.property("precio", 900);
        expect(response.body).to.have.property("id_proveedor", 1);
        expect(response.body).to.have.property("id_cat", 2);
      }
    );
  });
});

describe("UI - Formulario interactivo", () => {
  it("Debería mostrar el formulario al seleccionar POST y enviar datos", () => {
    cy.visit("http://localhost:3000");

    // elije el metodo
    cy.get("#metodo").select("POST");

    // fijarse si se carga el form
    cy.get("#formulario-datos").should("be.visible");

    // Entra al endpoint prod
    cy.get("#endpoint-select").select("/productos");

    // ahora llena el form
    cy.get("#nombre-producto").type("Yerba");
    cy.get("#precio").type("850");
    cy.get("#proveedor").type("1");
    cy.get("#categoria").type("2");

    // y lo envia
    cy.contains("Enviar").click();

    // Verifica el reesultado
    cy.get("#resultado").should("not.have.text", "{}");
  });
});
