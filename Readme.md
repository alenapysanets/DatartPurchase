# Datart E-shop Purchase Process Test

This Cypress test automates the process of simulating a customer purchase flow on the Datart e-shop, from logging in to completing an order. The test covers product selection, adding items to the cart, choosing delivery and payment options, and finalizing the purchase.

## Test Flow

1. **Login**: The script logs in an authorized customer using their email and password.
2. **Product Selection**: Two of the most expensive "TV" products are selected and added to the cart.
3. **Checkout**: The script proceeds through the checkout process, selecting a pickup location, payment method, and confirming the order.

## Prerequisites

Ensure that you have the following installed:

- Node.js
- Cypress

### Install and run Cypress

`npm install cypress --save-dev`

`npm run dev`

or

`pnpm install cypress --save-dev`

`pnpm run dev`

or

`npm install cypress --save-dev`

`npx cypress open`
