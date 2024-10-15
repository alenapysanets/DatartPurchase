// Prevent Cypress from failing the test due to uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  if (err.message.includes("Script error")) {
    // Ignore script errors and allow the test to continue
    return false;
  }
  return false;
});

// User login credentials
const login = "alena.lobko@gmail.com";
const password = "Olobko21";

describe("Datart e-shop Purchase Process", () => {
  // Before each test, visit the main page of the Datart e-shop
  beforeEach(() => {
    cy.visit("https://www.datart.cz/");
  });

  it("Logins authorized customer into the system, after this we select two most expensive products and proceeds to checkout", () => {
    // Accept cookies and proceed
    cy.contains("button", "Souhlasím a pokračovat").click();

    // Open login form and log in using predefined credentials
    cy.get(".head-login", { timeout: 5000 }).should("be.visible").click();
    cy.get("#frm-login").should("be.visible").type(login);
    cy.get("#frm-password").should("be.visible").type(password);
    cy.contains("button[class='btn btn-login']", "Přihlásit")
      .should("be.visible")
      .click();

    // Navigate to TV category
    cy.contains('span[class="link-name"]', "TV, foto,").click();
    cy.contains('span[class="category-tree-title"]', "Televize").click();

    // Intercept requests for products and cart actions
    cy.intercept("POST", "**/televize.html?do=changeOrder&order=4**").as(
      "getProducts",
    );
    cy.intercept("POST", "**/kosik?do=addProduct**").as("addToCart");

    // Sort by most expensive products
    cy.get('a[data-lb-name="Nejdražší"]', { timeout: 5000 })
      .should("be.visible")
      .click();

    cy.wait("@getProducts");

    // Filter products by availability "Ihned k odeslání"
    cy.get(
      'label[data-value="Ihned k odeslání"] input[type="checkbox"]',
    ).check();
    cy.get(
      'label[data-value="Ihned k odeslání"] input[type="checkbox"]',
    ).should("be.checked");

    // Add the two most expensive products to the cart
    for (let i = 0; i < 2; i++) {
      cy.get(".product-box", { timeout: 5000 }).eq(i).as("currentProduct");
      cy.get("@currentProduct")
        .find("button")
        .then(() => {
          cy.get("@currentProduct")
            .contains("button", "Vložit do košíku")
            .click();
          cy.wait("@addToCart");
          cy.get(".basket-product-add", { timeout: 10000 }).should(
            "be.visible",
          );
          // Close the confirmation modal
          cy.get(".modal-header", { timeout: 10000 })
            .should("be.visible")
            .find(".close", { timeout: 10000 })
            .should("be.visible")
            .click();
          cy.get(".basket-product-add", { timeout: 10000 }).should("not.exist");
          cy.wait(2000); // Short wait to ensure the modal is fully closed
        });
    }

    // Proceed to the cart
    cy.get(".head-cart.header-menu-item", { timeout: 5000 })
      .should("be.visible")
      .click();

    // Proceed with the checkout process
    cy.contains("a[class='btn btn-continue']", "Pokračovat »")
      .should("be.visible")
      .click();

    // Select delivery option - "RYCHLART – vyzvednutí na prodejně"
    cy.contains(
      "div[class='transport-title-item']",
      "RYCHLART – vyzvednutí na prodejně",
    )
      .should("be.visible")
      .click();

    // Select pickup location - "Praha 9 - Výdejna Horní Počernice"
    cy.get("#basket-pickup-select-region").select("Hlavní město Praha");
    cy.contains(
      "div[class='transport-title']",
      "Praha 9 - Výdejna Horní Počernice",
    )
      .should("be.visible")
      .click();

    // Select payment method - "Kartou online"
    cy.contains(".payment-title-item", "Kartou online")
      .should("be.visible")
      .click();

    // Proceed to payment
    cy.contains("a[class='btn btn-continue']", "Pokračovat »")
      .should("be.visible")
      .click();

    // Verify billing address is visible
    cy.contains("div[class='col-12 col-md-6']", "Fakturační adresy").should(
      "be.visible",
    );

    // Confirm billing details and proceed
    cy.contains("button[class='btn btn-continue']", "Pokračovat »")
      .should("be.visible")
      .click();

    // Verify order summary is displayed
    cy.contains("div[class='col-12']", "Shrnutí objednávky").should(
      "be.visible",
    );

    // Accept terms and conditions
    cy.get("#frm-confirm_terms_and_conditions").should("be.visible").click();

    // Complete the order
    cy.contains("button[class='btn btn-finish']", "Dokončit objednávku")
      .should("be.visible")
      .click();
  });
});
