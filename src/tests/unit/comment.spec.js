describe('Comment Functionality', () => {
  beforeEach(() => {
    cy.visit('/'); // Adjust this based on your app's entry point
  });

  it('should allow a user to add a comment', () => {
    cy.get('.comment-input').type('This is a new comment');
    cy.get('.submit-btn').click();
    cy.contains('This is a new comment').should('exist');
  });

  it('should allow a user to upvote a comment', () => {
    cy.get('.comment-input').type('This is another comment');
    cy.get('.submit-btn').click();
    cy.contains('This is another comment').find('.upvote-btn').click();
    cy.contains('⬆ 1').should('exist'); // Adjust the selector based on your upvote display
  });

  it('should show replies when toggled', () => {
    cy.get('.comment-input').type('Comment with replies');
    cy.get('.submit-btn').click();
    cy.contains('Comment with replies').find('.reply-btn').click();
    cy.get('textarea').type('This is a reply');
    cy.get('.reply-submit-btn').click();
    
    cy.contains('This is a reply').should('exist';
  });
});
