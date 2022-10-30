describe('dashborad',()=>{

  it('should navigate away from dashboard if not logged in',()=>{
    cy.visit('dashboard').url().should('include','/');
  })
})
