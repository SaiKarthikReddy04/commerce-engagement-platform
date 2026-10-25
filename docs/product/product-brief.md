# Product Brief: Event-Driven B2B/B2C Commerce and Customer Engagement Platform

**Date:** 2026-10-25  
**Status:** Draft  
**Stack:** React · Node.js/Express · MongoDB · (Kafka & Redis in later phases)

---

## 1. Problem Statement

Mid-market and growing businesses need a unified commerce platform that serves both individual consumers (B2C) and organizational buyers (B2B) without running two separate systems. Existing solutions force a choice: consumer-friendly storefronts that lack organizational purchasing controls, or enterprise procurement tools that alienate individual shoppers.

This platform closes that gap with a single product catalog, checkout flow, and account model that adapts its rules based on who is buying—an individual shopper or a member of a purchasing organization. Customer engagement features (referrals, loyalty) are planned for a later phase once the core commerce flow is proven.

### Intended Users

- **Direct consumers** browsing and buying for themselves.
- **Business buyers** purchasing on behalf of their organization under spending policies and approval workflows.
- **Organization approvers** who review and authorize purchases that exceed a buyer's limits.
- **Platform administrators** who manage the catalog, pricing tiers, organizations, and platform-wide settings.

---

## 2. User Roles and Permissions

| Role | Can do | Cannot do |
|---|---|---|
| **B2C Shopper** | Browse, add to cart, checkout with personal payment, view own orders | Access any organization data or admin tools |
| **B2B Organization Buyer** | Everything a shopper can, plus: purchase under org billing, see org-negotiated pricing, submit orders for approval when above their spending limit | Approve their own orders, manage org settings, see other orgs' data |
| **B2B Organization Approver** | Everything a buyer can, plus: approve/reject pending orders, view org order history, manage org buyers | Alter org contracts or pricing tiers, access admin tools |
| **Platform Admin** | Full catalog and pricing management, create/manage organizations and their contracts, view all orders, manage platform users | (Unrestricted within the platform) |

### Organization Data Isolation

Every data query scoped to an organization **must** filter by `organizationId`. No API endpoint may return data belonging to one organization to a user of another. This is enforced at the data-access layer, not just at the controller level, so that new endpoints inherit isolation by default.

---

## 3. Core User Journeys

### 3.1 Shopping (B2C and B2B)

1. Shopper browses the catalog (search, filter by category/attribute).
2. Views product detail, selects variant (size, color, etc.).
3. Adds item to cart; cart persists across sessions for authenticated users.
4. At checkout, enters or selects a shipping address and payment method.
5. **B2B variation:** Buyer selects their organization's billing account. If the order total exceeds the buyer's individual spending limit, the order enters a "pending approval" state instead of being placed immediately.
6. Order confirmation is displayed; order-placed event is emitted.

### 3.2 Organization Purchasing & Approval

1. Approver sees a pending order in the approval queue (in-app).
2. Reviews line items, total, and the requesting buyer.
3. Approves or rejects with an optional note.
4. On approval, the order proceeds to payment capture and fulfillment. On rejection, the buyer is notified in-app and may edit and resubmit.

### 3.3 Order Management

1. Shopper or buyer views order list with status filters (processing, shipped, delivered, cancelled).
2. Can request cancellation before shipment.
3. Admin can update order status (e.g., mark shipped, add tracking number).
4. Status changes emit events via in-process pub/sub for downstream consumers (notifications, analytics, inventory in later phases).

---

## 4. Feature Phasing

### MVP (Phase 1)

| Area | Features |
|---|---|
| **Catalog** | Products with variants, categories, images, and search. Admin CRUD for all catalog entities. |
| **Accounts & Roles** | Email/password registration and login, JWT sessions, role-based access control. B2B organization creation, member invitation, buyer/approver role assignment. |
| **Cart & Checkout** | Persistent cart for authenticated users, address management, test payment flow (gateway sandbox / test tokens—no real card data). |
| **Orders** | Place, view, cancel (pre-shipment), admin status updates. |
| **B2B Approval** | Per-buyer spending limits. Orders exceeding the limit enter "pending approval" for an org approver. Approve/reject with notes. |
| **Admin** | Catalog management, organization management, order management dashboard. |

### Phase 2 — Engagement & Infrastructure

| Area | Features |
|---|---|
| **Referrals** | Link generation, sign-up tracking, first-purchase conversion, configurable rewards. |
| **Loyalty** | Earn on purchase, redeem at checkout, append-only points ledger, hold period. |
| **Event Bus** | Kafka integration for order events, inventory sync, notification dispatch. |
| **Caching** | Redis for sessions, catalog queries, and cart. |
| **Notifications** | Email and in-app notification service consuming order/approval/referral events. |
| **Inventory** | Stock tracking, low-stock alerts, backorder handling. |
| **Reporting** | Sales, referral, and loyalty dashboards for admins. |

### Phase 3 and Beyond

| Area | Features |
|---|---|
| **Advanced Pricing** | Volume discounts, org-specific contracted pricing tiers, promotional engine |
| **Multi-currency & i18n** | Localized catalog, currency conversion |
| **Shipping Integration** | Carrier rate calculation, label generation |
| **Advanced Loyalty** | Tiered membership, bonus multipliers, partner earn/burn |
| **Mobile App** | React Native companion |

---

## 5. Key Business Rules

1. **Server-side price validation.** The cart total displayed on the client is advisory. The API **must** recompute every line-item price, discount, and tax at order submission time using the current catalog and rules. Any discrepancy between the client-submitted total and the server-computed total rejects the order with a clear error rather than silently accepting a manipulated price.

2. **Spending-limit enforcement.** When a B2B buyer's order total (after discounts) exceeds their individual spending limit, the system must route the order to approval. The limit check is performed server-side at order creation; the client may disable the "Place Order" button as a UX convenience but that is not a security control.

3. **Approval authority.** Only users with the approver (or admin) role within the same organization may approve an order. An approver cannot approve their own orders if they also hold the buyer role—a second approver or admin must act.

4. **Test-only payment in MVP.** Phase 1 uses the payment gateway's sandbox/test mode exclusively. No real payment instruments are processed until the integration is promoted to production with appropriate controls.

### Rules Deferred to Phase 2 (Referrals & Loyalty)

The following business rules apply when the referral and loyalty features ship:

5. **Loyalty point integrity.** Points are never decremented directly; every change is an append to the ledger. Redeemable balance is a server-side calculation (sum of earned minus redeemed minus expired, filtered by hold period). The client displays this balance but cannot set it.

6. **Referral anti-abuse.** A user cannot refer themselves (same email). Referral rewards are granted only after the referee's first qualifying order is marked delivered (or after a configurable grace period), not at sign-up alone.

---

## 6. Security Requirements

| Requirement | Detail |
|---|---|
| **No raw card data** | The platform never receives, transmits, or stores raw credit/debit card numbers. Phase 1 uses the payment gateway's sandbox/test mode exclusively. When promoted to production, all payment flows use the gateway's tokenization (e.g., Stripe Elements / PaymentIntents) so that card data goes directly from the browser to the gateway. |
| **Authentication** | Passwords hashed with bcrypt (cost ≥ 12). JWT access tokens (short-lived, ~15 min) plus refresh tokens (httpOnly cookie, rotated on use). |
| **Authorization** | Middleware enforces role checks on every protected route. Organization-scoped endpoints additionally verify the user belongs to that organization. |
| **Tenant isolation** | See §2. All org-scoped database queries include `organizationId`. Integration tests verify that cross-org data leakage is impossible for every resource type. |
| **Input validation** | Every API endpoint validates and sanitizes input (e.g., via Joi or Zod schemas) before any processing. |
| **Rate limiting** | Auth endpoints (login, register, password reset) are rate-limited to prevent brute-force attacks. General API rate limiting is applied per user/IP. |
| **HTTPS only** | All traffic is served over TLS. HSTS headers are set. |
| **Secrets management** | API keys, database credentials, and JWT secrets are loaded from environment variables, never committed to source control. |

---

## 7. Non-Functional Requirements

### Reliability
- **Provisional** API availability target: 99.9% uptime. This target requires validation through a defined load-test plan before it is treated as an SLA.
- Idempotent order-creation endpoint (client-generated idempotency key) to prevent duplicate orders on retry.
- Graceful degradation: non-critical subsystems (e.g., future loyalty or referral services) must not block checkout if they are temporarily unavailable.

### Performance
- **Provisional** catalog search target: ≤ 200 ms (p95) for up to 50,000 SKUs. To be validated by load test.
- **Provisional** checkout (order creation) target: ≤ 500 ms (p95) excluding external payment gateway latency. To be validated by load test.
- MongoDB indexes are designed and reviewed for every query pattern before launch.

### Observability
- Structured JSON logging with correlation IDs propagated across services/requests.
- Health-check endpoints (`/healthz`, `/readyz`) for the API and any background workers.
- Key business metrics exposed: orders placed, approval turnaround time, checkout conversion rate.
- Error tracking integrated (e.g., Sentry) with alerting on elevated error rates.

### Accessibility
- Web app meets WCAG 2.1 AA.
- All interactive elements are keyboard-navigable.
- Color contrast ratios meet AA minimums; information is not conveyed by color alone.
- Screen-reader-friendly: semantic HTML, ARIA labels where needed, logical focus order.

---

## 8. Out of Scope for First Release

The following are explicitly **not** included in Phase 1:

- **Referral program.** Link generation, tracking, and rewards are Phase 2.
- **Loyalty program.** Points earning, redemption, and ledger are Phase 2.
- **Handling or storing real card data.** PCI DSS compliance for raw card handling is out of scope; the platform uses the payment gateway's sandbox/test mode in Phase 1 and gateway-side tokenization when promoted to production.
- **Kafka event bus.** Phase 1 uses synchronous in-process event emission (e.g., Node.js EventEmitter or a simple pub/sub module). Kafka is introduced in Phase 2.
- **Redis caching.** Phase 1 relies on MongoDB queries and in-memory caching where needed. Redis is introduced in Phase 2.
- **Inventory management.** Products are assumed in-stock. Stock tracking, backorders, and low-stock alerts are Phase 2.
- **Email/SMS notifications.** Phase 1 surfaces status changes in-app only. Transactional email is Phase 2.
- **Reporting and analytics dashboards.**
- **Multi-currency and internationalization.**
- **Shipping carrier integration and rate calculation.**
- **Mobile native application.**
- **Social login (OAuth with Google, Apple, etc.).**
- **Advanced promotional/coupon engine.**
- **Analytics dashboards and reporting beyond basic admin views.**
- **Marketplace / multi-vendor support.** The platform operates as a single-seller system.

---

## 9. Technical Architecture Summary

```
┌─────────────┐       ┌──────────────────────────────────┐
│  React SPA  │◄─────►│  Node.js / Express API (modular) │
│  (Vite)     │ HTTPS │  ┌────────┐ ┌────────┐ ┌──────┐ │
└─────────────┘       │  │Catalog │ │Orders  │ │Auth  │ │
                      │  │Module  │ │Module  │ │Module│ │
                      │  └────────┘ └────────┘ └──────┘ │
                      │  ┌────────┐ ┌────────┐          │
                      │  │Org     │ │Cart    │          │
                      │  │Module  │ │Module  │          │
                      │  └────────┘ └────────┘          │
                      └──────────────┬───────────────────┘
                                     │
                              ┌──────▼──────┐
                              │   MongoDB   │
                              └─────────────┘

Phase 2 additions:  + Kafka  + Redis  + Loyalty Module  + Referral Module
```

Each domain (catalog, orders, auth, org, cart) is a separate Express Router module with its own models, services, and validation schemas, sharing a common middleware layer for auth, error handling, and request logging. Loyalty and referral modules are added in Phase 2.
