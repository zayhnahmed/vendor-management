---
description: Load the full API reference and request/response schemas for the vendor management backend. Use this whenever working on API integration, service files, form payloads, or validating field names against the real backend.
---

# Vendor Management API Reference

**Base URL:** `http://192.168.20.49:3000/api`  
All requests go through the `apiInterceptor` which prepends the base URL.  
Auth token is attached by `authInterceptor` via `Authorization: Bearer <access_token>`.

---

## Authentication (`/auth`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/auth/login` | Returns `access_token`, `refresh_token`, `requiresPasswordChange`, `isFirstLogin`, `user` |
| POST | `/auth/logout` | Body: `{ refresh_token }` |
| POST | `/auth/refresh` | Body: `{ refresh_token }` → new tokens |
| GET | `/auth/profile` | Current user profile |
| POST | `/auth/change-password` | Body: `ChangePasswordDto` |

### LoginDto
```
email*        string($email)
password*     string
```

### RefreshTokenDto
```
refresh_token*   string
```

### ChangePasswordDto
```
currentPassword*   string
newPassword*       string  (min 6 chars, pattern: /^(?=.*[A-Za-z])(?=.*\d)/)
confirmPassword*   string  (min 6 chars)
```

### Login Response Shape
```json
{
  "success": true,
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "requiresPasswordChange": false,
  "isFirstLogin": false,
  "user": { "id": "uuid", "email": "...", "name": "...", "organizationId": "org-id" }
}
```

---

## Dashboard (`/dashboard`)

| Method | Endpoint |
|---|---|
| GET | `/dashboard/buyer` |
| GET | `/dashboard/vendor` |
| GET | `/dashboard/super-admin` |

---

## Organizations (`/organizations`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/organizations` | Public self-service registration (no auth) |
| GET | `/organizations` | Super admin only. Query: `?limit&page&search&status` |
| GET | `/organizations/current` | Current user's org context |
| GET | `/organizations/profile` | Public-facing org profile |
| PUT | `/organizations/profile` | Update org profile (org admin only) |
| GET | `/organizations/{id}` | |
| PUT | `/organizations/{id}` | |
| PATCH | `/organizations/{id}/status` | Super admin lifecycle |
| GET | `/organizations/{id}/children` | |
| GET | `/organizations/{id}/hierarchy` | |

### CreateOrganizationDto
```
name*                string
legalName            string
taxId                string
registrationNumber   string
country              string
address              string
website              string($uri)
subdomain            string  (pattern: /^[a-z0-9-]+$/)
```

### CreateRegistrationDto  (public self-registration)
```
organizationName*   string
legalName           string
taxId               string
registrationNumber  string
country             string
address             string
website             string($uri)
subdomain           string
adminName*          string
adminEmail*         string($email)
adminPhone          string
adminPassword*      string
isPublic            boolean
```

### UpdateOrganizationProfileDto
```
name          string
logoUrl       string($uri)
description   string
supplyNote    string
needNote      string
isPublic      boolean
```

### UpdateOrganizationDto
```
name                string
legalName           string
taxId               string
registrationNumber  string
country             string
address             string
website             string($uri)
logoUrl             string($uri)
subdomain           string
settings            object
metadata            object
```

---

## Super Admin (`/super-admin`)

| Method | Endpoint |
|---|---|
| GET | `/super-admin/organizations/pending` |
| PATCH | `/super-admin/organizations/{id}/approve` |
| PATCH | `/super-admin/organizations/{id}/suspend` |
| PATCH | `/super-admin/organizations/{id}/revoke` |

---

## Users (`/users`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/users` | Create user (requires `user:manage`) |
| GET | `/users` | List org users |
| GET | `/users/profile` | Own profile |
| PUT | `/users/profile` | Update own profile |
| GET | `/users/roles` | Available roles for org |
| GET | `/users/check-email?email=` | |
| GET | `/users/{userId}` | |
| PATCH | `/users/{userId}` | |
| DELETE | `/users/{userId}` | Soft delete / deactivate |

### CreateUserDto
```
email*     string($email)
name*      string
phone      string
roleIds*   string[]
```

### UpdateUserProfileDto
```
name          string
profilePic    string($uri)
designation   string
phone         string
```

### UpdateUserDto
```
name      string
phone     string
status    string  (ACTIVE | INACTIVE | LOCKED)
roleIds   string[]
```

---

## Enrollment (`/enrollment`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/enrollment/buyer/request` | |
| POST | `/enrollment/vendor/request` | Body: `{ materialIds, documents }` |
| GET | `/enrollment/status` | |
| GET | `/enrollment/pending` | Super admin only |
| PATCH | `/enrollment/{typeLinkId}/approve` | |
| PATCH | `/enrollment/{typeLinkId}/reject` | Body: `{ reason }` |

---

## Connections (`/connections`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/connections/request` | Body: `SendConnectionRequestDto` |
| GET | `/connections` | Query: `?type=BUYER_OF\|VENDOR_OF\|PARTNER` |
| GET | `/connections/pending/incoming` | |
| GET | `/connections/pending/outgoing` | |
| PATCH | `/connections/{requestId}/accept` | |
| PATCH | `/connections/{requestId}/reject` | Body: `RejectConnectionRequestDto` |
| DELETE | `/connections/{connectionId}` | |

### SendConnectionRequestDto
```
targetOrgId*       string($uuid)
relationshipType*  string  (BUYER_OF | VENDOR_OF | PARTNER)
message            string
```

### RejectConnectionRequestDto
```
reason   string
```

---

## Discovery (`/discover`)

| Method | Endpoint | Query Params |
|---|---|---|
| GET | `/discover/buyers` | `?search&country&page&limit` |
| GET | `/discover/buyers/{id}` | |
| GET | `/discover/vendors` | `?search&country&page&limit` |
| GET | `/discover/vendors/{id}` | |

---

## Materials (`/materials`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/materials` | |
| GET | `/materials` | Query: `?material_type=BUY\|SELL\|BOTH&search` |
| GET | `/materials/buy` | |
| GET | `/materials/sell` | |
| GET | `/materials/{id}` | |
| PUT | `/materials/{id}` | |
| DELETE | `/materials/{id}` | |

### CreateMaterialDto
```
material_number*   string   (e.g. MAT-001)
description*       string
base_unit          string   (e.g. EA)
material_group     string
material_type      string   (BUY | SELL | BOTH)
weight             number
dimensions         string
category_id        string($uuid)
```

### UpdateMaterialDto
```
description     string
material_type   string  (BUY | SELL | BOTH)
base_unit       string
material_group  string
```

---

## Vendor Material Management (`/vendor-materials`)

| Method | Endpoint |
|---|---|
| POST | `/vendor-materials/global` |
| GET | `/vendor-materials/global` |
| PATCH | `/vendor-materials/global/{id}` |
| DELETE | `/vendor-materials/global/{id}` |
| GET | `/vendor-materials/relationships/{relationshipId}/buyer-catalog` |
| GET | `/vendor-materials/relationships/{relationshipId}/capabilities` |
| POST | `/vendor-materials/relationships/{relationshipId}/mappings` |
| PATCH | `/vendor-materials/relationships/{relationshipId}/mappings/{mappingId}` |
| DELETE | `/vendor-materials/relationships/{relationshipId}/mappings/{mappingId}` |

### AddGlobalMaterialDto
```
materialId*   string($uuid)
```

### UpdateGlobalMaterialDto
```
status   string  (ACTIVE | INACTIVE)
```

### AddBuyerMaterialDto
```
globalMaterialId*   string($uuid)
leadTimeDays        number
minOrderQty         number
priceNote           string
```

### UpdateBuyerMaterialDto
```
leadTimeDays   number
minOrderQty    number
priceNote      string
isActive       boolean
```

---

## Vendor Onboarding (`/vendor-onboarding`)

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/vendor-onboarding/pending-tasks` | Returns list with `relationshipId` |
| GET | `/vendor-onboarding/relationships/{relationshipId}/status` | |
| POST | `/vendor-onboarding/relationships/{relationshipId}/step1` | General Info |
| POST | `/vendor-onboarding/relationships/{relationshipId}/step2` | Financial Info |
| POST | `/vendor-onboarding/relationships/{relationshipId}/step3` | Compliance & Certs |
| POST | `/vendor-onboarding/relationships/{relationshipId}/submit` | Submit for approval |
| PATCH | `/vendor-onboarding/relationships/{relationshipId}/approve` | Buyer approves |
| PATCH | `/vendor-onboarding/relationships/{relationshipId}/reject` | |

### Step1GeneralInfoDto
```
companyLegalName*        string
tradeName                string
companyRegistrationNumber string
yearOfEstablishment      number
countryOfRegistration*   string
companyWebsite           string
entityType*              string  (PRIVATE | PUBLIC | GOVERNMENT | NON_PROFIT)
businessType*            string[]
registeredAddress*       string
operationalAddress       string
isOperationalSame        boolean  (default: false)
primaryContactName*      string
primaryContactEmail*     string($email)
primaryContactPhone*     string
designation*             string
alternateContactName     string
alternateContactPhone    string
```

### Step2FinancialInfoDto
```
bankName*                string
bankCode*                string
accountHolderName*       string
accountNumber*           string
iban                     string  (optional)
bankCountry*             string
currency*                string
taxRegistrationNumber*   string
vatGstNumber             string  (optional)
taxCertificateUploadId   string($uuid)  (optional)
annualTurnover*          number
yearsInBusiness*         number
```

### CertificationDto
```
name*              string   (e.g. ISO 9001)
issuing_body       string   (e.g. BSI)
issue_date         string   (e.g. 2023-01-01)
expiry_date        string   (e.g. 2026-01-01)
document_upload_id string   (upload ID from /upload/single)
```

### Step3ComplianceDto
```
compliesWithLaborLaws*   boolean
hasHSEPolicy*            boolean
hasLegalIssues*          boolean
legalIssuesExplanation   string
hasAntiBriberyPolicy*    boolean
sustainabilityPractices  string[]
certifications           CertificationDto[]
```

---

## RFQ Management (`/rfqs`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/rfqs` | Buyer creates draft |
| GET | `/rfqs?role=buyer\|vendor` | |
| GET | `/rfqs/vendor` | Simplified vendor view |
| GET | `/rfqs/{id}?role=` | |
| PATCH | `/rfqs/{id}` | Update draft |
| POST | `/rfqs/{id}/distribute` | Body: `DistributeRfqDto` |
| POST | `/rfqs/{id}/quotes` | Vendor submits quote |
| GET | `/rfqs/{id}/quotes` | Buyer views all quotes |
| POST | `/rfqs/{id}/award` | Body: `{ quoteId }` |
| POST | `/rfqs/{id}/cancel` | |
| POST | `/rfqs/{id}/viewed` | Vendor marks viewed |

### RfqItemDto
```
materialId*     string   (Material ID from buyer catalog)
quantity*       number
unit            string   (e.g. EA, KG)
specifications  string
metadata        object
```

### CreateRfqDto
```
title*                string
description           string
currency              string  (default: SAR)
deliveryDeadline      string  (e.g. 2026-06-30)
submissionDeadline    string  (e.g. 2026-05-01)
termsAndConditions    string
items*                RfqItemDto[]
metadata              object
```

### UpdateRfqDto
```
title               string
description         string
status              string  (DRAFT | OPEN | CLOSED | AWARDED | CANCELLED)
submissionDeadline  string
deliveryDeadline    string
termsAndConditions  string
metadata            object
```

### DistributeRfqDto
```
vendorOrgIds*   string($uuid)[]
```

### QuoteItemDto
```
rfqItemId*   string
unitPrice*   number
notes        string
metadata     object
```

### SubmitQuoteDto
```
items*         QuoteItemDto[]
leadTimeDays   number
validUntil     string  (ISO date)
notes          string
metadata       object
```

---

## Purchase Orders (`/purchase-orders`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/purchase-orders/from-rfq` | Body: `CreatePoFromRfqDto` |
| POST | `/purchase-orders/manual` | Body: `CreateManualPoDto` |
| GET | `/purchase-orders?role=buyer\|vendor&status=` | |
| GET | `/purchase-orders/{id}?role=` | |
| PATCH | `/purchase-orders/{id}` | Body: `UpdatePoDto` |
| POST | `/purchase-orders/{id}/issue` | |
| POST | `/purchase-orders/{id}/acknowledge` | |
| POST | `/purchase-orders/{id}/shipments` | Body: `CreateShipmentDto` |
| POST | `/purchase-orders/{id}/deliver` | |
| POST | `/purchase-orders/{id}/cancel?role=` | |
| PATCH | `/purchase-orders/{id}/items/{itemId}/delivery` | Partial delivery |

### CreatePoFromRfqDto
```
rfqId*             string($uuid)
quoteId*           string($uuid)
deliveryDeadline   string
shippingAddress    string
billingAddress     string
notes              string
metadata           object
```

### CreatePoItemDto
```
materialId*   string($uuid)
quantity*     number  (min: 0)
unitPrice*    number  (min: 0)
unit          string
metadata      object
```

### CreateManualPoDto
```
vendorOrgId*       string($uuid)
items*             CreatePoItemDto[]
deliveryDeadline   string
shippingAddress    string
billingAddress     string
notes              string
metadata           object
```

### UpdatePoDto
```
status             string  (DRAFT | ISSUED | ACKNOWLEDGED | SHIPPED | DELIVERED | CANCELLED | INVOICED)
deliveryDeadline   string
shippingAddress    string
billingAddress     string
notes              string
metadata           object
```

### CreateShipmentDto
```
trackingNumber      string
carrier             string
estimatedDelivery   string
notes               string
metadata            object
```

---

## Invoices (`/invoices`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/invoices` | Vendor creates for delivered PO |
| GET | `/invoices?role=buyer\|vendor&status=` | |
| GET | `/invoices/{id}?role=` | |
| PATCH | `/invoices/{id}` | Body: `UpdateInvoiceDto` |
| POST | `/invoices/{id}/pay` | Buyer marks paid |
| POST | `/invoices/{id}/cancel` | |

### CreateInvoiceDto
```
purchaseOrderId*   string($uuid)
amount*            number  (min: 0)
currency           string  (default: SAR)
dueDate            string
notes              string
metadata           object
```

### UpdateInvoiceDto
```
status     string  (PENDING | PAID | CANCELLED | OVERDUE)
amount     number
dueDate    string
notes      string
metadata   object
```

---

## File Upload (`/upload`)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/upload/single` | Multipart: `file` + optional `folder`. Returns `{ uploadId, fileUrl }` |
| GET | `/upload/{id}` | Metadata |
| DELETE | `/upload/{id}` | |

## Public File Upload (no auth)

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/public/upload/registration` | Multipart: `file` + optional `purpose` |

## File Access (`/files`)

| Method | Endpoint |
|---|---|
| GET | `/files/{id}` |
| GET | `/files/{id}/download` |
| GET | `/files/{id}/metadata` |
| GET | `/public/files/{id}` |
| GET | `/public/files/{id}/info` |

---

## Workflows (`/workflows`)

| Method | Endpoint |
|---|---|
| POST | `/workflows/definitions` |
| GET | `/workflows/definitions?entityType=` |
| PATCH | `/workflows/definitions/{id}` |
| GET | `/workflows/instances/{id}` |
| GET | `/workflows/instances/entity/{entityType}/{entityId}` |
| POST | `/workflows/instances/{id}/cancel` |
| GET | `/workflows/my-tasks` |
| POST | `/workflows/steps/{stepId}/transition` |
| POST | `/workflows/steps/{stepId}/reassign` |
| POST | `/workflows/seed-templates` |

### TransitionStepDto
```
action*   string  (APPROVE | REJECT | DELEGATE | REASSIGN | COMMENT | CANCEL)
comment   string
data      object
```

### CreateWorkflowDefinitionDto
```
name*          string
description    string
entityType*    string
steps*         WorkflowStepDefinitionDto[]
isTemplate     boolean  (default: true)
```

### WorkflowStepDefinitionDto
```
name*           string
order*          number
assigneeType*   string  (ROLE | USER)
assigneeId      string
condition       object
```

---

## Key Rules

- Fields marked `*` are **required**
- All IDs are UUIDs unless noted otherwise
- File uploads return `{ uploadId, fileUrl }` — store `uploadId` to reference in DTOs
- `role=buyer` or `role=vendor` query param controls response shape on shared endpoints
- Onboarding uses `relationshipId` (from `/vendor-onboarding/pending-tasks`) scoped to a buyer-vendor relationship
