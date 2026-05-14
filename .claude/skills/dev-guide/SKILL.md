---
description: Load the full frontend development guide for this multi-tenant SaaS procurement platform. Use this whenever working on new features, understanding module scope, checking permissions, understanding user flows, or deciding what pages/components to build next.
---

# Frontend Development Guide
## Multi-Tenant SaaS Procurement Platform
### Complete Architecture, Functional Modules & API Documentation

---

## 1. Introduction

The platform is a cloud-based, multi-tenant procurement network (similar to Ariba/Coupa). Organizations can register, enrol as buyer, vendor, or both, discover each other, establish connections, and execute the complete procure-to-pay cycle.

- **Registration & enrollment** – Org signs up, Super Admin approves.
- **Connection management** – Organisations send/receive connection requests.
- **Vendor onboarding** – Multi-step forms, buyer approval.
- **Material catalogue & mapping** – Buyer/vendor manage materials; vendor maps which materials they supply per buyer.
- **RFQ → Quote → Award** – Buyer creates RFQ, distributes to vendors, compares quotes, awards.
- **Purchase Orders & Invoicing** – Convert RFQ to PO, life-cycle management, invoicing and payment.
- **Dynamic workflows** – Configurable approval steps for enrollment and onboarding.
- **RBAC** – Role-based access control with fine-grained permissions.

Backend: NestJS (TypeScript), PostgreSQL, Prisma ORM, REST API.
Swagger UI: `http://192.168.20.49:3000/api/docs`

---

## 2. System Roles & Permissions

| Role | Description |
|---|---|
| **Super Admin** | Platform owner; approves organisations, enrollments, manages platform settings. Bypasses all permission checks. |
| **Organization Admin** | Full control inside an organisation (users, materials, RFQs, POs, etc.) |
| **Vendor Manager** | Manages vendor capabilities and quotes |
| **Viewer** | Read-only access to most modules |

- Permissions are assigned to roles; each endpoint requires a specific permission.
- JWT tokens contain granted permissions.
- `X-Organization-Id` header (org UUID) must be sent on all authenticated org-scoped requests.
- Super Admin does NOT need an org context.

---

## 3. User Flows — Pages Required

### 3.1 Authentication & Profile
- Login (email + password)
- Logout
- Change password
- Profile (view / update user details)

### 3.2 Organisation Management
- Registration (public)
- Super Admin approves organisation
- Organisation profile management
- User management
- Role & permission listing

### 3.3 Materials
- CRUD materials
- Filter by type and search

### 3.4 Enrollment
- Request buyer enrollment
- Request vendor enrollment
- Pending approvals
- Enrollment status tracking

### 3.5 Discovery & Connections
- Search buyers/vendors
- View organisation details
- Send connection requests
- Manage pending requests
- Active connection management

### 3.6 Vendor Onboarding
- 3-step onboarding forms
- Status and progress tracking
- Buyer approval/rejection

### 3.7 Vendor Material Mapping
- Global vendor catalogue
- Buyer-specific mapping
- Lead time and pricing notes

### 3.8 RFQ Management
- Create RFQ
- RFQ distribution
- Quote submission
- Quote comparison & award

### 3.9 Purchase Orders
- Create PO
- PO lifecycle management
- Shipment tracking
- Delivery confirmation
- PO cancellation

### 3.10 Invoicing
- Create invoice
- Invoice listing
- Payment marking
- Invoice cancellation

### 3.11 Workflows
- Workflow definition management
- Pending tasks
- Approve/reject transitions
- Workflow reassignment
- Workflow cancellation

### 3.12 Dashboard
- Buyer dashboard
- Vendor dashboard
- Super Admin dashboard

---

## 4. API Endpoints & Permissions

Base URL: `http://192.168.20.49:3000/api`

### 4.1 Authentication

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/auth/login` | Login | Public |
| POST | `/auth/refresh` | Refresh token | Public |
| GET | `/auth/profile` | Get current user | Authenticated |
| POST | `/auth/logout` | Logout | Authenticated |
| POST | `/auth/change-password` | Change password | Authenticated |

### 4.2 Organizations

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/registrations` | Register new organisation | Public |
| GET | `/organizations` | List all | super_admin |
| GET | `/organizations/current` | Current org context | Authenticated |
| GET | `/organizations/profile` | Get org profile | Authenticated |
| PUT | `/organizations/profile` | Update org profile | ORG_ADMIN |
| GET | `/organizations/:id` | Get org by ID | SUPER_ADMIN / ORG_ADMIN |
| PUT | `/organizations/:id` | Update org | SUPER_ADMIN / ORG_ADMIN |
| PATCH | `/organizations/:id/status` | Update org status | SUPER_ADMIN |

### 4.3 Users & Roles

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/users` | Create user in org | user:manage |
| GET | `/users` | List org users | user:manage |
| GET | `/users/profile` | Get current user profile | Authenticated |
| PUT | `/users/profile` | Update own profile | Authenticated |
| GET | `/users/roles` | Get available roles for org | Authenticated |
| GET | `/users/:userId` | Get user by ID | user:manage |
| PATCH | `/users/:userId` | Update user (incl. roles) | user:manage |
| DELETE | `/users/:userId` | Deactivate user | user:manage |

### 4.4 Materials

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/materials` | Create material | Authenticated |
| GET | `/materials` | List (filter by type/search) | Authenticated |
| GET | `/materials/buy` | Get BUY materials | Authenticated |
| GET | `/materials/sell` | Get SELL materials | Authenticated |
| GET | `/materials/:id` | Get material by ID | Authenticated |
| PUT | `/materials/:id` | Update material | Authenticated |
| DELETE | `/materials/:id` | Delete material | Authenticated |

### 4.5 Enrollment

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/enrollment/buyer/request` | Request buyer enrollment | Org Admin |
| POST | `/enrollment/vendor/request` | Request vendor enrollment | Org Admin |
| GET | `/enrollment/status` | Current org enrollment status | Authenticated |
| GET | `/enrollment/pending` | List pending | super_admin |
| PATCH | `/enrollment/:typeLinkId/approve` | Approve enrollment | super_admin |
| PATCH | `/enrollment/:typeLinkId/reject` | Reject enrollment | super_admin |

### 4.6 Discovery

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/discover/buyers` | Search buyers (with filters) | Authenticated |
| GET | `/discover/vendors` | Search vendors | Authenticated |
| GET | `/discover/buyers/:id` | Get buyer details | Authenticated |
| GET | `/discover/vendors/:id` | Get vendor details | Authenticated |

### 4.7 Connections

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/connections/request` | Send connection request | Authenticated |
| GET | `/connections/pending/incoming` | Incoming pending requests | Authenticated |
| GET | `/connections/pending/outgoing` | Outgoing pending requests | Authenticated |
| PATCH | `/connections/:requestId/accept` | Accept request | Authenticated |
| PATCH | `/connections/:requestId/reject` | Reject request | Authenticated |
| GET | `/connections` | List active connections (filter by type) | Authenticated |
| DELETE | `/connections/:connectionId` | Revoke connection | Authenticated |

### 4.8 Vendor Onboarding

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/vendor-onboarding/pending-tasks` | Vendor pending tasks | Authenticated |
| GET | `/vendor-onboarding/relationships/:id/status` | Get onboarding status | Authenticated |
| POST | `.../step1` | Submit Step 1 (General) | Authenticated |
| POST | `.../step2` | Submit Step 2 (Financial) | Authenticated |
| POST | `.../step3` | Submit Step 3 (Compliance) | Authenticated |
| POST | `.../submit` | Submit for approval | Authenticated |
| PATCH | `.../approve` | Buyer approves onboarding | vendor:approve |
| PATCH | `.../reject` | Buyer rejects onboarding | vendor:approve |

### 4.9 Vendor Materials

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/vendor-materials/global` | Add global material | vendor:manage |
| GET | `/vendor-materials/global` | List global materials | Authenticated |
| PATCH | `.../global/:id` | Update global material | vendor:manage |
| DELETE | `.../global/:id` | Remove global material | vendor:manage |
| GET | `.../relationships/:id/buyer-catalog` | View buyer catalog & suggestions | Authenticated |
| POST | `.../relationships/:id/mappings` | Map material to buyer | vendor:manage |
| PATCH | `.../mappings/:mappingId` | Update mapping | vendor:manage |
| DELETE | `.../mappings/:mappingId` | Remove mapping | vendor:manage |
| GET | `.../relationships/:id/capabilities` | Buyer views vendor capabilities | Authenticated |

### 4.10 RFQ

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/rfqs` | Create RFQ | Authenticated |
| GET | `/rfqs` | List RFQs (`?role=buyer\|vendor`) | Authenticated |
| GET | `/rfqs/vendor` | Vendor RFQ list (simplified) | Authenticated |
| GET | `/rfqs/:id` | RFQ detail (`?role=`) | Authenticated |
| PATCH | `/rfqs/:id` | Update RFQ (draft) | Authenticated |
| POST | `/rfqs/:id/distribute` | Distribute to vendors | Authenticated |
| POST | `/rfqs/:id/viewed` | Mark viewed (vendor) | Authenticated |
| POST | `/rfqs/:id/quotes` | Submit quote | Authenticated |
| GET | `/rfqs/:id/quotes` | Get all quotes | Authenticated |
| POST | `/rfqs/:id/award` | Award to vendor | Authenticated |
| POST | `/rfqs/:id/cancel` | Cancel RFQ | Authenticated |

### 4.11 Purchase Orders

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/purchase-orders/from-rfq` | Create from awarded RFQ | Authenticated |
| POST | `/purchase-orders/manual` | Create manual PO | Authenticated |
| GET | `/purchase-orders` | List POs (`?role=buyer\|vendor`) | Authenticated |
| GET | `/purchase-orders/:id` | PO detail (`?role=`) | Authenticated |
| PATCH | `/purchase-orders/:id` | Update PO | Authenticated |
| POST | `/purchase-orders/:id/issue` | Issue PO | Authenticated |
| POST | `/purchase-orders/:id/acknowledge` | Acknowledge (vendor) | Authenticated |
| POST | `/purchase-orders/:id/shipments` | Add shipment | Authenticated |
| POST | `/purchase-orders/:id/deliver` | Mark delivered | Authenticated |
| POST | `/purchase-orders/:id/cancel` | Cancel PO | Authenticated |
| PATCH | `/purchase-orders/:id/items/:itemId/delivery` | Record partial delivery | Authenticated |

### 4.12 Invoices

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/invoices` | Create invoice | Authenticated |
| GET | `/invoices` | List invoices (`?role=buyer\|vendor`) | Authenticated |
| GET | `/invoices/:id` | Invoice detail (`?role=`) | Authenticated |
| PATCH | `/invoices/:id` | Update invoice | Authenticated |
| POST | `/invoices/:id/pay` | Mark as paid | Authenticated |
| POST | `/invoices/:id/cancel` | Cancel invoice | Authenticated |

### 4.13 Workflows

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/workflows/definitions` | Create definition | workflow:manage |
| GET | `/workflows/definitions` | List definitions | Authenticated |
| PATCH | `/workflows/definitions/:id` | Update definition | workflow:manage |
| GET | `/workflows/instances/:id` | Get instance detail | Authenticated |
| GET | `/workflows/instances/entity/:type/:id` | Instances for an entity | Authenticated |
| GET | `/workflows/my-tasks` | Pending steps for user | Authenticated |
| POST | `/workflows/steps/:stepId/transition` | Approve/reject step | Authenticated |
| POST | `/workflows/steps/:stepId/reassign` | Reassign step | workflow:manage |
| POST | `/workflows/instances/:id/cancel` | Cancel workflow | workflow:manage |
| POST | `/workflows/seed-templates` | Seed default templates | super_admin |

### 4.14 Dashboard

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/dashboard/buyer` | Buyer summary | Authenticated |
| GET | `/dashboard/vendor` | Vendor summary | Authenticated |
| GET | `/dashboard/super-admin` | Platform summary | super_admin |

### 4.15 File Upload

| Method | Path | Description | Permission |
|---|---|---|---|
| POST | `/upload/single` | Upload file | Authenticated |
| POST | `/public/upload/registration` | Public upload (registration docs) | Public |
| GET | `/files/:id` | Download / view file | Authenticated |
| GET | `/files/:id/metadata` | File metadata | Authenticated |
| GET | `/files/:id/download` | Force download | Authenticated |
| GET | `/public/files/:id` | Public file access | Public |
| GET | `/public/files/:id/info` | Public file info | Public |

---

## 5. Important Development Notes

### Organisation Context
- All org-scoped endpoints require `X-Organization-Id` header (the org UUID).
- The frontend must always send this header for authenticated requests.
- Super Admin bypasses all org guards — does NOT need this header.

### Authentication Flow
- Login → store `access_token` + `refresh_token`
- Attach `access_token` in `Authorization: Bearer <token>` header
- On 401 → use `refresh_token` to get a new pair from `/auth/refresh`
- On refresh failure → redirect to login

### Pagination
All list endpoints return:
```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```
Use query params `?page=1&limit=10`.

### Error Handling
```json
{ "statusCode": 400, "message": "Validation error", "error": "Bad Request" }
```
Common status codes: `400` validation, `401` unauthorized, `403` forbidden/missing permission, `404` not found.

### File Uploads
- Use `multipart/form-data`
- Public registration docs → `/public/upload/registration`
- Authenticated files (tax certs, certifications) → `/upload/single`
- Response contains `uploadId` — store and pass to relevant DTO fields

### Real-time
Not yet implemented. Use polling or manual refresh for now.

---

## 6. Key Data Models

| Model | Description |
|---|---|
| Organization | Tenants; can have parent/child hierarchy |
| User | Belongs to one org; assigned roles via UserRole |
| Role | System or org-specific; linked to Permission |
| OrganizationTypeLink | Tracks buyer/vendor enrollment per org |
| OrganizationRelationship | Connections between orgs |
| VendorOnboarding | Per-relationship onboarding data |
| Material | Org's material catalogue (BUY/SELL/BOTH) |
| VendorGlobalMaterial | Vendor's approved supply materials |
| VendorBuyerMaterial | Per-buyer mapping with lead time, price |
| RFQ | Created by buyer; includes items, distributions, quotes |
| Quote | Submitted by vendor for an RFQ |
| PurchaseOrder | Created from RFQ or manually; linked to vendor |
| Invoice | Created by vendor against a delivered PO |
| WorkflowDefinition / Instance / Step | Dynamic approval flows |

---

## 7. Frontend Build Order (Recommended)

1. Authentication (login, token storage, refresh interceptor)
2. Organisation context (send `X-Organization-Id` on all requests)
3. Core pages: Dashboard, Materials, Enrollment
4. Transactional flows: Connections → Onboarding → RFQ → PO → Invoice
5. Workflow "My Tasks" widget
6. Super Admin panel last
