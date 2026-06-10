# FoodLink - Development Roadmap

## Project Status

### Completed

- [x] JWT Authentication
- [x] Spring Security Configuration
- [x] Role-Based Authorization
- [x] React Authentication Flow
- [x] Protected Routes

Roles:

```text
DONOR
NGO
DELIVERY
ADMIN
```

---

# PHASE 1 - PROJECT FOUNDATION

## Task 1: Create MongoDB Collections

### Collections

```text
users                ✅
donations
assignments
feedbacks
notifications
delivery_locations
```

### Models

```java
User
Donation
Assignment
Feedback
Notification
DeliveryLocation
```

### Goal

Create all entities and repositories before starting business logic.

---

## Task 2: Setup Backend Structure

### Package Structure

```text
controller
service
repository
dto
mapper
exception
config
security
websocket
```

### Modules

```text
auth
donation
ngo
delivery
feedback
notification
```

### Goal

Establish clean architecture.

---

# PHASE 2 - DONOR MODULE

## Task 3: Create Donation API

### Backend

```http
POST /api/donations
```

### Fields

```text
Food Name
Food Type
Quantity
Description
Pickup Address
Expiry Time
```

### Status

```text
PENDING
```

### Goal

Donor can create food donation.

---

## Task 4: Create Donation Page

### Route

```text
/donor/create-donation
```

### Features

```text
Food Form
Validation
Submit Donation
Success Message
```

### Goal

Donation saved successfully.

---

## Task 5: My Donations API

### Backend

```http
GET /api/donations/my
```

### Goal

Fetch donations created by logged-in donor.

---

## Task 6: My Donations Page

### Route

```text
/donor/my-donations
```

### Table Columns

```text
Food Name
Quantity
Status
Created Date
```

### Goal

Donor can see all donations.

---

## Task 7: Donation Details

### Backend

```http
GET /api/donations/{id}
```

### Route

```text
/donor/donations/:id
```

### Goal

View complete donation information.

---

# PHASE 3 - NGO MODULE

## Task 8: NGO Dashboard API

### Backend

```http
GET /api/ngo/dashboard
```

### Response

```json
{
  "pending": 20,
  "approved": 15,
  "delivered": 80
}
```

### Goal

Show NGO statistics.

---

## Task 9: NGO Dashboard Page

### Route

```text
/ngo/dashboard
```

### Cards

```text
Pending Donations
Approved Donations
Delivered Donations
```

---

## Task 10: Pending Donations API

### Backend

```http
GET /api/ngo/donations/pending
```

### Goal

List all pending donations.

---

## Task 11: Pending Donations Page

### Table

```text
Food Name
Quantity
Address
Donor
Actions
```

### Actions

```text
Approve
Reject
```

---

## Task 12: Approve Donation

### Backend

```http
PATCH /api/ngo/donations/{id}/approve
```

### Status Flow

```text
PENDING → APPROVED
```

---

## Task 13: Reject Donation

### Backend

```http
PATCH /api/ngo/donations/{id}/reject
```

### Status Flow

```text
PENDING → REJECTED
```

---

# PHASE 4 - DELIVERY MODULE

## Task 14: Delivery Partner Entity

### Fields

```text
Name
Phone
Vehicle Type
Vehicle Number
Availability
```

### Goal

Store delivery personnel data.

---

## Task 15: Delivery Partner CRUD

### APIs

```http
POST /api/delivery-partners

GET /api/delivery-partners

PUT /api/delivery-partners/{id}

DELETE /api/delivery-partners/{id}
```

---

## Task 16: Assignment Entity

### Fields

```java
id
donationId
deliveryPartnerId
assignedAt
status
```

### Goal

Track delivery assignments.

---

## Task 17: Assign Delivery Partner

### Backend

```http
PATCH /api/ngo/donations/{id}/assign
```

### Request

```json
{
  "deliveryPartnerId":"123"
}
```

### Status Flow

```text
APPROVED → ASSIGNED
```

---

## Task 18: Delivery Dashboard API

### Backend

```http
GET /api/delivery/tasks
```

---

## Task 19: Delivery Dashboard Page

### Route

```text
/delivery/dashboard
```

### Cards

```text
Assigned Tasks
Completed Tasks
Pending Tasks
```

---

## Task 20: Pickup API

### Backend

```http
PATCH /api/delivery/tasks/{id}/pickup
```

### Status Flow

```text
ASSIGNED → PICKED_UP
```

---

## Task 21: Deliver API

### Backend

```http
PATCH /api/delivery/tasks/{id}/deliver
```

### Status Flow

```text
PICKED_UP → DELIVERED
```

---

# PHASE 5 - GOOGLE MAPS INTEGRATION

## Task 22: Add Coordinates to Donation

### Fields

```java
pickupLat
pickupLng

ngoLat
ngoLng
```

### Goal

Store map coordinates.

---

## Task 23: Enable Google APIs

### Required APIs

```text
Maps JavaScript API

Geocoding API

Directions API

Places API (Optional)
```

---

## Task 24: Address to Coordinates

### Flow

```text
Pickup Address
↓
Geocoding API
↓
Latitude & Longitude
↓
Save in MongoDB
```

### Goal

Convert addresses into coordinates.

---

## Task 25: Show Donor Location

### Page

```text
Donation Details
```

### Map

```text
📍 Pickup Location
```

---

## Task 26: Show Route

### Route

```text
Donor
↓
NGO
```

### Use

```text
Directions API
```

---

## Task 27: NGO Nearby Search

### Goal

Assign nearest NGO.

### Formula

```text
Haversine Distance
```

---

# PHASE 6 - LIVE DELIVERY TRACKING

## Task 28: Delivery Location Collection

### Fields

```java
deliveryPartnerId

latitude

longitude

updatedAt
```

---

## Task 29: Driver GPS Tracking

### Frontend

```javascript
navigator.geolocation.getCurrentPosition()
```

### Frequency

```text
Every 10 Seconds
```

---

## Task 30: Update Driver Location API

### Backend

```http
POST /api/location/update
```

### Request

```json
{
  "deliveryPartnerId":"123",
  "latitude":12.9716,
  "longitude":77.5946
}
```

---

## Task 31: Tracking API

### Backend

```http
GET /api/tracking/{donationId}
```

### Goal

Return current delivery location.

---

## Task 32: Tracking Page

### Route

```text
/track/:donationId
```

### Show

```text
🚚 Delivery Partner

📍 Donor

🏢 NGO

Road Route
```

---

# PHASE 7 - FEEDBACK MODULE

## Task 33: Feedback Entity

### Fields

```java
rating

comment

donationId

userId
```

---

## Task 34: Submit Feedback

### Backend

```http
POST /api/feedback
```

### Goal

Allow donor to rate service.

---

## Task 35: View Feedback

### Backend

```http
GET /api/feedback/{donationId}
```

---

# PHASE 8 - NOTIFICATIONS

## Task 36: Notification Entity

### Fields

```java
userId

title

message

read

createdAt
```

---

## Task 37: Create Notification Service

### Events

```text
Donation Approved

Donation Rejected

Delivery Assigned

Food Picked Up

Food Delivered
```

---

## Task 38: Notification APIs

### Backend

```http
GET /api/notifications

PATCH /api/notifications/{id}/read
```

---

# PHASE 9 - ANALYTICS

## Task 39: Analytics API

### Backend

```http
GET /api/admin/analytics
```

### Response

```json
{
  "totalDonations":150,
  "pending":20,
  "approved":40,
  "delivered":80,
  "rejected":10
}
```

---

## Task 40: Analytics Dashboard

### Charts

```text
Monthly Donations

Status Distribution

Food Categories

NGO Activity

Delivery Performance
```

### Library

```bash
npm install recharts
```

---

# PHASE 10 - FILE UPLOADS

## Task 41: Food Image Upload

### Options

```text
Cloudinary (Recommended)

AWS S3
```

### Store

```text
imageUrl
```

inside Donation.

---

## Task 42: Image Preview

### Pages

```text
Donation Card

Donation Details
```

---

# PHASE 11 - VALIDATION

## Task 43: Backend Validation

### Use

```java
@NotBlank

@NotNull

@Valid

@Email

@Size
```

---

## Task 44: Frontend Validation

### Use

```bash
react-hook-form

zod
```

---

# PHASE 12 - API DOCUMENTATION

## Task 45: Swagger

### Dependency

```xml
springdoc-openapi-starter-webmvc-ui
```

### URL

```text
/swagger-ui.html
```

---

# PHASE 13 - DEPLOYMENT

## Task 46: MongoDB Atlas

### Goal

Move database to cloud.

---

## Task 47: Deploy Backend

### Options

```text
Render

Railway

AWS EC2
```

---

## Task 48: Deploy Frontend

### Options

```text
Vercel

Netlify
```

---

# FINAL MVP CHECKLIST

## Authentication

- [x] JWT Authentication
- [x] Authorization
- [x] Protected Routes

## Donor

- [ ] Create Donation
- [ ] View Donations
- [ ] Donation Details

## NGO

- [ ] View Pending Donations
- [ ] Approve Donation
- [ ] Reject Donation
- [ ] Assign Delivery Partner

## Delivery

- [ ] Delivery Dashboard
- [ ] Pickup Task
- [ ] Deliver Task

## Maps

- [ ] Geocoding
- [ ] Route Visualization
- [ ] NGO Mapping

## Tracking

- [ ] GPS Tracking
- [ ] Live Location Updates

## Feedback

- [ ] Ratings
- [ ] Comments

## Notifications

- [ ] Event Notifications

## Analytics

- [ ] Dashboard Metrics
- [ ] Charts

## Deployment

- [ ] Backend Live
- [ ] Frontend Live
- [ ] MongoDB Atlas Connected

---

# Recommended Build Order

```text
1. Donation Entity
2. Create Donation API
3. My Donations Page
4. NGO Dashboard
5. Approve Donation
6. Reject Donation
7. Delivery Partner Entity
8. Assignment Entity
9. Assign Delivery Partner
10. Delivery Dashboard
11. Pickup Flow
12. Delivery Flow
13. Google Maps
14. Route Visualization
15. GPS Tracking
16. Tracking Page
17. Feedback
18. Notifications
19. Analytics
20. File Upload
21. Deployment
```

Goal: Have a working MVP completed by Step 12, then build Maps, Tracking, Analytics, and Deployment as enhancement features.