class IssueDetailModal {
  constructor() {
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.confirmationModal = '[data-testid="modal:confirm"]';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.getIssueDetailModal = () => cy.get(this.issueDetailModal);
    this.getLastInput = () => cy.get(this.lastInput);
    this.getFirstInput = () => cy.get(this.firstInput);
    this.getTimeTrackingModal = () => cy.get(this.timeTrackingModal);
    this.checkFirstInputPlaceholderIsNumber = () =>
      cy.get(this.firstInput).should("have.attr", "placeholder", "Number");
    this.checkLastInputPlaceholderIsNumber = () =>
      cy.get(this.lastInput).should("have.attr", "placeholder", "Number");
    this.addCommentName = "Add a comment...";
    this.commentTextArea = 'textarea[placeholder="Add a comment..."]';
    this.clickSaveButton = () =>
      cy.contains("button", "Save").click().should("not.exist");
    this.clickCancelButton = () =>
      cy.contains("button", "Cancel").click().should("not.exist");
    this.clickDeleteButton = () =>
      cy.contains("button", "Delete comment").click().should("not.exist");
    this.clickDoneButton = () =>
      cy.contains("button", "Done").click().should("not.exist");
    this.editButtonName = "Edit";
    this.deleteButtonName = "Delete";
    this.issueComment = '[data-testid="issue-comment"]';
    this.estimatedTimeName = "Original Estimate (hours)";
    this.iconStopwatch = '[data-testid="icon:stopwatch"]';
    this.iconClose = '[data-testid="icon:close"]';
    this.hoursEstimated = "h estimated";
    this.hoursLogged = "h logged";
    this.hoursRemaining = "h remaining";
    this.lastInput = "input:last";
    this.firstInput = "input:first";
    this.noTimeLoggedText = "No time logged";
    this.issueTitle = "TEST_TITLE";
  }

  createComment(comment) {
    this.getIssueDetailModal().within(() => {
      cy.contains(this.addCommentName).click();
      cy.get(this.commentTextArea).type(comment);
      this.clickSaveButton();
      cy.contains(this.addCommentName).should("exist");
    });
  }

  editComment(previousComment, newComment) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueComment)
        .first()
        .should("contain", previousComment)
        .contains(this.editButtonName)
        .click()
        .should("not.exist");

      cy.get(this.commentTextArea)
        .should("contain", previousComment)
        .clear()
        .type(newComment);

      this.clickSaveButton();
    });
  }

  deleteComment(newComment) {
    this.getIssueDetailModal()
      .find(this.issueComment)
      .should("contain", newComment)
      .contains(this.deleteButtonName)
      .click();

    cy.get(this.confirmationModal).should("be.visible");
    this.clickDeleteButton();
    cy.get(this.confirmationModal).should("not.exist");
  }

  ensureCommentIsVisible(comment) {
    cy.get(this.issueComment).should("contain", comment);
  }

  ensureEditedCommentIsVisible(comment) {
    cy.get(this.issueComment)
      .should("contain", this.editButtonName)
      .and("contain", comment);
  }

  ensureDeletedCommentIsNotVisible(comment) {
    this.getIssueDetailModal();
    cy.get(this.issueComment).contains(comment).should("not.exist");
  }

  addEstimatedTime(number) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconStopwatch)
        .next()
        .should("contain", this.noTimeLoggedText);
      this.getLastInput().type(number);
      cy.get(this.iconStopwatch)
        .next()
        .should("contain", `${number}${this.hoursEstimated}`);
    });
  }

  editEstimatedTime(previousNumber, newNumber) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconStopwatch)
        .next()
        .should("contain", `${previousNumber}${this.hoursEstimated}`);
      this.getLastInput().clear().type(newNumber);
      cy.get(this.iconStopwatch)
        .next()
        .should("contain", `${newNumber}${this.hoursEstimated}`);
    });
  }

  removeEstimatedTime(previousNumber) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconStopwatch)
        .next()
        .should("contain", `${previousNumber}${this.hoursEstimated}`);
      this.getLastInput().clear();
      this.checkLastInputPlaceholderIsNumber();
      cy.get(this.iconStopwatch)
        .next()
        .contains(this.hoursEstimated)
        .should("not.exist");
    });
  }

  ensureEstimatedTimeIsSaved(number) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconClose).should("be.visible").first().click();
    });
    this.getIssueDetailModal().should("not.exist");
    cy.reload();
    cy.contains(this.issueTitle).click();
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconStopwatch)
        .next()
        .should("contain", `${number}${this.hoursEstimated}`);
    });
  }

  ensureEstimatedTimeIsEmpty() {
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconClose).should("be.visible").first().click();
    });
    this.getIssueDetailModal().should("not.exist");
    cy.reload();
    cy.contains(this.issueTitle).click();
    this.getIssueDetailModal().within(() => {
      this.checkLastInputPlaceholderIsNumber();
    });
  }

  addLoggedTime(numberLogged, numberRemaining) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconStopwatch).click();
    });
    this.getTimeTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.get(this.iconStopwatch)
          .next()
          .should("contain", this.noTimeLoggedText);
        this.getFirstInput().type(numberLogged);
        this.getLastInput().type(numberRemaining);
        cy.get(this.iconStopwatch)
          .next()
          .should("contain", `${numberLogged}${this.hoursLogged}`)
          .and("contain", `${numberRemaining}${this.hoursRemaining}`);
        this.clickDoneButton();
        this.getTimeTrackingModal().should("not.exist");
      });
  }

  removeLoggedTime() {
    this.getIssueDetailModal().within(() => {
      cy.get(this.iconStopwatch).click();
    });
    this.getTimeTrackingModal()
      .should("be.visible")
      .within(() => {
        this.getFirstInput().clear();
        this.getLastInput().clear();
        this.checkFirstInputPlaceholderIsNumber();
        this.checkLastInputPlaceholderIsNumber();
        cy.get(this.iconStopwatch)
          .next()
          .should("contain", this.noTimeLoggedText);
        this.clickDoneButton();
        this.getTimeTrackingModal().should("not.exist");
      });
  }

  ensureTimeWasLogged(numberLogged, numberRemaining) {
    this.getIssueDetailModal()
      .should("be.visible")
      .within(() => {
        cy.contains(this.noTimeLoggedText).should("not.exist");
        cy.get(this.iconStopwatch)
          .next()
          .should("contain", `${numberLogged}${this.hoursLogged}`)
          .and("contain", `${numberRemaining}${this.hoursRemaining}`);
      });
  }

  ensureNoTimeIsLogged() {
    this.getIssueDetailModal()
      .should("be.visible")
      .within(() => {
        cy.contains(this.noTimeLoggedText).should("be.visible");
      });
  }
}

export default new IssueDetailModal();
