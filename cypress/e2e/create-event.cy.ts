describe('Event  create', () => {
  beforeEach(() => {
    cy.clearDB();
    cy.signup().get('[data-test=new-event]').click().url().should('contain', '/event');
  })


  it('should display a success message for a valid event', () => {
    cy
      .get('.alert-success').should('not.exist')
      // Add title and description
      .get('input[formControlName=title]').type('My title')
      .get('input[formControlName=description').type('My description')
      // Add location
      .get('input[formControlName=location]')
      .type('Atlanta').wait(1000).type('{downarrow}{enter}')
      // Click start time
      .get('input[formControlName=startTime]').click()
      // Click today in the calendar
      .get('.owl-dt-calendar-cell-today').click()
      // Click the "Set" button
      .get('.owl-dt-container-buttons button').last().wait(1000).click()
      // Click end time
      .get('input[formControlName=endTime]').click()
      // Click today in the calendar
      .get('.owl-dt-calendar-cell-today').click()
      // Increment time by an hour
      .get('[aria-label="Add a hour"]').click()
      // Click the "Set" button
      .get('.owl-dt-container-buttons button').last().wait(1000).click()
      // Update the radio button to "Yes"
      .get('#suggest-true').click()
      .get('button[type=submit]').click()
      .get('.alert-success').should('be.visible');
  });
  it('should display a error message for a valid event', () => {
      cy.server({method:'POST',status:500});
      cy.route('/api/events',{message:'Event could not be created!',statusCode:500});
      // Add title and description
      cy.get('input[formControlName=title]').type('My title')
      .get('input[formControlName=description').type('My description')
      // Add location
      .get('input[formControlName=location]')
      .type('Atlanta').wait(1000).type('{downarrow}{enter}')
      // Click start time
      .get('input[formControlName=startTime]').click()
      //select next month
      .get('[aria-label="Next month"]').click()
      // Click today in the calendar
      .get('.owl-dt-day-4').first().click()
      // Click the "Set" button
      .get('.owl-dt-container-buttons button').last().wait(1000).click()
      // Click end time
      .get('input[formControlName=endTime]').click()
      // Click today in the calendar
      .get('.owl-dt-calendar-cell-today').click()
      // Increment time by an hour
      .get('[aria-label="Minus a hour"]').click()
      // Click the "Set" button
      .get('.owl-dt-container-buttons button').last().wait(1000).click()
      // Update the radio button to "Yes"
      .get('#suggest-true').click()
      .get('button[type=submit]').click()
      .get('.alert-danger').should('be.visible').should('contain','Event could not be created!');
  });
})
