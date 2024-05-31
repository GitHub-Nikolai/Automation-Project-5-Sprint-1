import { faker } from "@faker-js/faker";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).should(
        "be.visible"
      );

      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

      cy.get('input[name="title"]').type("TEST_TITLE");
      cy.get('input[name="title"]').should("have.value", "TEST_TITLE");
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should(
      "not.be.visible"
    );

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
            cy.get('[data-testid="icon:story"]').should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains("TEST_TITLE")
      .within(() => {
        cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
        cy.get('[data-testid="icon:story"]').should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).should(
        "be.visible"
      );
      cy.get('button[type="submit"]').click();

      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });

  it("Test Case 1: Custom Issue Creation", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).should(
        "be.visible"
      );
      cy.get('input[name="title"]').type("Bug");
      cy.get(".ql-editor").type("My bug description");
      cy.get(".ql-editor").should("have.text", "My bug description");
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:bug"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:bug"]').should("be.visible");
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
      cy.get('[data-testid="icon:story"]').should("be.visible");
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
      cy.get('[data-testid="icon:story"]').should("be.visible");
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");
      cy.contains("Issue has been successfully created.").should("be.visible");
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");
    });
  });

  it("Test Case 2: Random Data Plugin Issue Creation", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      const randomIssueDescription = faker.lorem.sentence(5);
      const randomIssueTitle = faker.lorem.word();

      cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).should(
        "be.visible"
      );
      cy.get('input[name="title"]').type("randomIssueTitle");
      cy.get(".ql-editor").type("randomIssueDescription");
      cy.get(".ql-editor").should("have.text", "randomIssueDescription");
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:bug"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:bug"]').should("be.visible");
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="avatar:Baby Yoda"]').should("be.visible");
      cy.get('[data-testid="icon:story"]').should("be.visible");
      //icon:story not sure

      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");
      cy.contains("Issue has been successfully created.").should("be.visible");
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");
    });
  });
});
