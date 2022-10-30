Cypress.Commands.add("signup", (username, password) => {
  var username = username || 'user';
  var password = password || 'password';

  cy.visit('/signup').url()
    .url()
    .should("include", "/signup")
    .get("#username").type("user")
    .get("#password").type("password")
    .get('#BBQ').click()
    .get('form').submit().url().should('include', 'dashboard');

})
