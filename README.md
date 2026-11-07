# Commerce Engagement Platform

A full-stack B2B/B2C commerce platform built with the MERN stack. Shoppers can browse products, manage a cart, and place orders. Organizations can manage team members and review orders that require approval.

## Demo

https://github.com/user-attachments/assets/7c807e27-7cca-490b-b20d-cd4856de2e48

## Features

- Product catalog with search, category filters, sorting, and pagination
- Product details, stock availability, and admin product management
- Authenticated shopping cart and checkout
- Order history and order details
- JWT authentication with role-based access control
- Organization creation, member management, and B2B order approval
- Inventory updates when orders are placed, rejected, or fail payment
- React storefront with GSAP scroll-driven home-page animations

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, Redux Toolkit, RTK Query, Tailwind CSS |
| Animation | GSAP, ScrollTrigger, Lenis |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, role-based authorization |
| Caching | Redis integration in progress; local service setup and verification remain |
| Messaging | Kafka planned |

## Project structure

    commerce-engagement-platform/
    ├── apps/
    │   ├── api/                  # Express API
    │   │   └── src/
    │   │       ├── common/       # Shared middleware and utilities
    │   │       ├── config/       # Database and service configuration
    │   │       ├── infrastructure/ # Cache and external-service adapters
    │   │       └── modules/      # Auth, catalog, cart, orders, payments, organizations
    │   └── web/                  # React + Vite storefront
    │       └── src/
    │           ├── app/          # Application setup and Redux store
    │           ├── features/     # Feature pages, API calls, and state
    │           ├── lib/          # Shared client utilities
    │           └── services/     # Shared API configuration
    ├── docs/                     # Product and architecture documentation
    ├── e2e/                      # End-to-end testing area
    └── packages/                 # Shared packages

## Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB connection string
- Redis for local cache testing

## Run locally

Run the API and storefront in separate PowerShell terminals.

### Start the API

    Set-Location .\apps\api
    npm.cmd install
    npm.cmd run dev

Configure the API environment variables in `apps/api/.env` according to the settings read by the files in `apps/api/src/config/`. Keep credentials and secrets out of Git.

Check API health at `http://127.0.0.1:4000/api/v1/health`.

### Start the storefront

    Set-Location .\apps\web
    npm.cmd install
    npm.cmd run dev

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API overview

API routes are versioned under `/api/v1`.

| Area | Example endpoints | Access |
|---|---|---|
| Health | `GET /health` | Public |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` | Public or authenticated |
| Products | `GET /products`, `GET /products/:productId` | Public |
| Product administration | `POST /products`, `PATCH /products/:productId`, `DELETE /products/:productId` | Platform admin |
| Admin catalog | `GET /products/admin` | Platform admin |
| Cart | `GET /cart`, `/cart/items` | Authenticated |
| Orders | `POST /orders`, `GET /orders`, `GET /orders/:orderId` | Authenticated |
| Payment simulation | `POST /payments/:orderId/simulate` | Order owner; development use |
| Organizations | `/organizations` and `/organizations/:organizationId/members` | Authenticated; organization roles apply |
| Order approvals | `/organizations/:organizationId/orders/pending-approval` and `/organizations/:organizationId/orders/:orderId/review` | Organization admin or approver |

For request formats and validation rules, refer to the route and validation files under `apps/api/src/modules/`.

## Order and inventory workflow

When an order is placed, the API checks product availability and updates inventory as part of the order workflow. Organization orders may require approval before payment. Rejected orders and simulated payment failures cancel the order and restore reserved stock.

Payments are simulated for development. The application does not process real payments.

## Project status

- **Implemented:** authentication, product catalog and administration, cart, checkout, order history, simulated payments, organization memberships, and approval workflows.
- **In progress:** starting and verifying the Redis service locally.
- **Planned:** Kafka-based event processing.

## Security

- Store secrets in local environment files and never commit them.
- The payment simulation is for development only.
- The API validates product prices, quantities, permissions, and stock; the frontend is not the source of truth.

## License

No license has been added yet.