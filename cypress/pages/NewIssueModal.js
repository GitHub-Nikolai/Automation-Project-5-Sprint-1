import { faker } from "@faker-js/faker";
class NewIssueModal {
  constructor() {
    this.issueCreateModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.confirmationModal = '[data-testid="modal:confirm"]';
    this.descriptionField = ".ql-editor";
    this.titleField = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.issueTypeStory = '[data-testid="select-option:Story"]';
    this.issueTypeBug = '[data-testid="select-option:Bug"]';
    this.issueTypeTask = '[data-testid="select-option:Task"]';
    this.priorityDropdown = '[data-testid="select:priority"]';
    this.priorityHighest = '[data-testid="select-option:Highest"]';
    this.priorityLow = '[data-testid="select-option:Low"]';
    this.reporterDropdown = '[data-testid="select:reporterId"]';
    this.assigneeDropdown = '[data-testid="form-field:userIds"]';
    this.optionBabyYoda = '[data-testid="select-option:Baby Yoda"]';
    this.optionPickleRick = '[data-testid="select-option:Pickle Rick"]';
    this.optionLordGaben = '[data-testid="select-option:Lord Gaben"]';
    this.buttonCreateIssue = 'button[type="submit"]';
    this.buttonCloseDetails = '[data-testid="icon:close"]';
    this.buttonDeleteIssue = '[data-testid="icon:trash"]';
    this.confirmDeleteButtonName = "Delete issue";
    this.cancelDeleteButtonName = "Cancel";
    this.issueCreatingSuccess = "Issue has been successfully created.";
    this.listBacklog = '[data-testid="board-list:backlog"]';
    this.listIssues = '[data-testid="list-issue"]';
    this.avatarBabyYoda = '[data-testid="avatar:Baby Yoda"]';
    this.avatarPickleRick = '[data-testid="avatar:Pickle Rick"]';
    this.avatarLordGaben = '[data-testid="avatar:Lord Gaben"]';
    this.iconStory = '[data-testid="icon:story"]';
    this.iconBug = '[data-testid="icon:bug"]';
    this.iconTask = '[data-testid="icon:task"]';
    this.formFieldTitle = '[data-testid="form-field:title"]';
    this.issueDescription1 = "TEST_DESCRIPTION";
    this.issueDescription2 = "My bug description";
    this.issueDescriptionR = faker.lorem.words();
    this.issueTitle1 = "TEST_TITLE";
    this.issueTitle2 = "Bug";
    this.issueTitleR = faker.lorem.word();
    this.deleteIssueTitle = "This is an issue of type: Task.";
    this.value5 = "5";
  }

  getIssueCreateModal() {
    return cy.get(this.issueCreateModal);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
    cy.get(this.descriptionField).should("have.text", description);
  }

  editTitle(title) {
    cy.get(this.titleField).type(title);
    cy.get(this.titleField).should("have.value", title);
  }

  selectIssueType(issueType, iconType) {
    cy.get(this.issueType).click();
    cy.get(issueType).wait(1000).trigger("mouseover").trigger("click");
    cy.get(iconType).should("be.visible");
  }

  selectReporter(reporter) {
    cy.get(this.reporterDropdown).click();
    cy.get(reporter).click();
  }

  selectAssignee(assignee) {
    cy.get(this.assigneeDropdown).click();
    cy.get(assignee).click();
  }

  selectPriority(priority) {
    cy.get(this.priorityDropdown).click();
    cy.get(priority).click();
  }

  createIssue(description, title, issueType, iconType, reporter, assignee) {
    this.getIssueCreateModal().within(() => {
      this.selectIssueType(issueType, iconType);
      this.editDescription(description);
      this.editTitle(title);
      this.selectReporter(reporter);
      this.selectAssignee(assignee);
      cy.get(this.buttonCreateIssue).click();
    });
  }

  createIssueMinimum(description, title) {
    this.getIssueCreateModal().within(() => {
      this.editDescription(description);
      this.editTitle(title);
      cy.get(this.buttonCreateIssue).click();
    });
  }

  ensureIssueIsCreated(number, title, avatarAssignee, iconType) {
    cy.get(this.issueCreateModal).should("not.exist");
    cy.reload();
    cy.contains(this.issueCreatingSuccess).should("not.exist");

    cy.get(this.listBacklog)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.listIssues)
          .should("have.length", number)
          .first()
          .find("p")
          .contains(title);
        cy.get(avatarAssignee).should("be.visible");
        cy.get(iconType).should("be.visible");
      });
  }

  ensureIssueIsCreatedNoAssignee(number, title, iconType) {
    cy.get(this.issueCreateModal).should("not.exist");
    cy.reload();
    cy.contains(this.issueCreatingSuccess).should("not.exist");

    cy.get(this.listBacklog)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.listIssues)
          .should("have.length", number)
          .first()
          .find("p")
          .contains(title);
        cy.get(iconType).should("be.visible");
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueCreateModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("be.visible");
  }

  clickDeleteButton() {
    cy.get(this.buttonDeleteIssue).click();
    cy.get(this.confirmationModal).should("be.visible");
  }

  confirmDeletion() {
    cy.get(this.confirmationModal).within(() => {
      cy.contains(this.confirmDeleteButtonName).click();
    });
    cy.get(this.confirmationModal).should("not.exist");
    cy.get(this.listBacklog).should("be.visible");
  }

  cancelDeletion() {
    cy.get(this.confirmationModal).within(() => {
      cy.contains(this.cancelDeleteButtonName).click();
    });
    cy.get(this.confirmationModal).should("not.exist");
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal)
      .should("be.visible")
      .within(() => {
        cy.get(this.buttonCloseDetails).first().click();
      });
    cy.get(this.issueDetailModal).should("not.exist");
  }

  ensureIssueIsDeleted(number, title) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();

    cy.get(this.listBacklog)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.listIssues)
          .should("have.length", number)
          .first()
          .find("p")
          .should("not.have.text", title);
      });
  }

  ensureIssueIsNotDeleted(number, title) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();

    cy.get(this.listBacklog)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.listIssues)
          .should("have.length", number)
          .first()
          .find("p")
          .contains(title);
      });
  }

  ensureIssueIsNotVisibleOnBoard(title) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(title).should("not.exist");
  }
}

export default new NewIssueModal();
