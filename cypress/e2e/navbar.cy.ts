describe('navbar', () => {
  beforeEach(() => {
    cy.visit('/');
  })
  describe('a user who is not logged in', () => {
    it('should show a link to signup', () => {
      cy.get('[data-test=signup]').click().url().should('include', '/signup');
    })
    it('should show a link to login', () => {
      cy.get('[data-test=login]').click().url().should('include', '/login');
    })
    it('should redirect base url when navbar-brand clicked', () => {
      cy.get('.navbar-brand').click().url().should('include', '/');
    })
  })
  describe('a user who is logged In ', () => {
    beforeEach(() => {
      cy.clearDB();
      cy.signup();
    });
    it('should show a link to logout', () => {
      cy.get('[data-test=logout]').should('have.text', 'Logout').click().url().should('include', '');
    })
    it('should redirect to dashborad url when navbar-brand clicked', () => {
      cy.get('.navbar-brand').click().url().should('include', '/dashboard');
    })
  })
})
