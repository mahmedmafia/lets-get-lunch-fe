const userData = {
  username: 'user',
  password: 'password',
};
describe('login', () => {
  before(() => {
    cy.clearDB();
    cy.signup(userData.username, userData.password).get('[data-test=logout]').should('have.text','Logout').click();
  });
  it('should navigate to dashboard after valid credentails', () => {
    cy.visit('login')
      .get('#username')
      .type(userData.username)
      .get('#password')
      .type(userData.password)
      .get('[type=submit]').click().url().should('include', 'dashboard');
  });
  it('should display incorrect password err message if user entered wrong password', () => {
    cy.visit('login')
      .get('#username')
      .type(userData.username)
      .get('#password')
      .type('wrongpassword')
      .get('[type=submit]').click().get('.error').should('have.text', 'Incorrect password.');
  });
  it('should display user dosent exist err message if user entered wrong user credentials', () => {
    cy.visit('login')
      .get('#username')
      .type('notexistuser')
      .get('#password')
      .type('anypassword')
      .get('[type=submit]').click().get('.error').should('have.text', 'User could not be found.');
  });
});
