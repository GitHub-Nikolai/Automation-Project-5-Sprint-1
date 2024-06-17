import IssueDetailModal from "../../pages/IssueDetailModal.js";
import NewIssueModal from "../../pages/NewIssueModal.js";

describe("Issue time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");

        NewIssueModal.createIssue(
          NewIssueModal.issueDescription1,
          NewIssueModal.issueTitle1,
          NewIssueModal.issueTypeStory,
          NewIssueModal.iconStory,
          NewIssueModal.optionBabyYoda,
          NewIssueModal.optionPickleRick
        );

        cy.url()
          .should("eq", `${Cypress.env("baseUrl")}project/board`)
          .then((url) => {
            cy.visit(url + "/board");
            cy.contains(NewIssueModal.issueTitle1).click();
          });
      });
  });

  it("Should add, edit and remove estimated time successfully", () => {
    IssueDetailModal.addEstimatedTime(10);
    IssueDetailModal.ensureEstimatedTimeIsSaved(10);
    IssueDetailModal.editEstimatedTime(10, 20);
    IssueDetailModal.ensureEstimatedTimeIsSaved(20);
    IssueDetailModal.removeEstimatedTime(20);
    IssueDetailModal.ensureEstimatedTimeIsEmpty();
  });

  it("Should log time and remove logged time successfully", () => {
    IssueDetailModal.addLoggedTime(2, 5);
    IssueDetailModal.ensureTimeWasLogged(2, 5);
    IssueDetailModal.removeLoggedTime();
    IssueDetailModal.ensureNoTimeIsLogged();
  });
});
