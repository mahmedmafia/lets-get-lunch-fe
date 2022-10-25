describe("Signup", () => {

  before(() => {
    Cypress.config("baseUrl", "http://localhost:4200");
  });

  beforeEach(() => {
    cy.request("DELETE", "http://localhost:3000/api/test");
  });
  it("should navigate to dashboard with valid credentials", () => {
    cy.visit('/signup').url()
      .url()
      .should("include", "/signup")
      .get("#username").type("user")
      .get("#password").type("password")
      .get('#BBQ').click().get('#Burger').click().
      get('form').submit().url().should('include', 'dashboard');
  });
  it("should display an error with invalid credentials", () => {
    cy.visit('/signup').url()
      .url()
      .should("include", "/signup")
      .get("#username").type("user")
      .get("#password").type("shor")
      .get('form').submit()
      .get('.alert')
      .should('be.visible')
      .should('have.text', 'Your password must be at least 5 characters long.')
  });
  it("should display an error for a username that already exist", () => {
    const user={
      username:"test",
      password:'password',
    }
    cy.visit('/signup').url()
    .url()
    .should("include", "/signup")
    .get("#username").type(user.username)
    .get("#password").type("password")
    .get('form').submit().url().should('include', 'dashboard').visit('/signup').url()
    .url()
    .should("include", "/signup")
    .get("#username").type(user.username)
    .get("#password").type("differentpassword")
    .get('form').submit().get('.alert')
    .should('be.visible')
    .should('have.text', 'This user already exists.');
  });
});
