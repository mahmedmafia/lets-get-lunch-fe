describe('dashborad',()=>{
  before(() => {
    Cypress.config("baseUrl", "http://localhost:4200");
  });
  it('should navigate away from dashboard if not logged in',()=>{
    cy.visit('dashboard').url().should('include','/');
  })
})
