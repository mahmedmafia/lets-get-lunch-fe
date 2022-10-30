Cypress.Commands.add("clearDB", () => {

  cy.request("DELETE", "http://localhost:3000/api/test");

})
