# FoodLink - Smart Food Donation & Redistribution Platform

## Overview

FoodLink is a web-based platform designed to reduce food wastage and support hunger alleviation by connecting:

- Donors (Restaurants, Hotels, Individuals)
- NGOs
- Delivery Partners

The platform enables donors to post surplus food, NGOs to approve and manage donations, and delivery partners to collect and deliver food to beneficiaries.

---

# Tech Stack

## Frontend

- React
- TypeScript
- React Router
- Axios
- React Query (TanStack Query)
- Zustand
- React Hook Form
- Zod
- Material UI / TailwindCSS
- Socket.IO Client

## Backend

- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data MongoDB
- Lombok
- Spring Validation
- WebSocket (STOMP)
- Swagger OpenAPI

## Database

- MongoDB Atlas / Local MongoDB

---

# User Roles

## Donor

Can:

- Register/Login
- Create Donations
- View Donation Status
- Track Deliveries
- Submit Feedback

## NGO

Can:

- View Donations
- Approve Donations
- Reject Donations
- Assign Delivery Partners
- Track Deliveries
- View Analytics

## Delivery Partner

Can:

- View Assigned Tasks
- Accept Tasks
- Mark Pickup Complete
- Mark Delivery Complete

## Admin

Can:

- Manage Users
- Manage NGOs
- View Platform Analytics

---

# System Workflow

```text
Donor
  |
  v
Create Donation
  |
  v
Donation Status = PENDING
  |
  v
NGO Reviews Donation
  |
  +--> APPROVE
  |       |
  |       v
  |   Assign Delivery Partner
  |       |
  |       v
  |   PICKED_UP
  |       |
  |       v
  |   DELIVERED
  |
  +--> REJECT
```

---

# Project Structure

## Frontend

```text
src
│
├── api
│   ├── authApi.ts
│   ├── donationApi.ts
│   ├── ngoApi.ts
│   ├── deliveryApi.ts
│   └── feedbackApi.ts
│
├── pages
│   ├── auth
│   │   ├── login.tsx
│   │   └── Register.tsx
│   │
│   ├── donor
│   │   ├── Dashboard.tsx
│   │   ├── CreateDonation.tsx
│   │   ├── MyDonations.tsx
│   │   ├── DonationDetails.tsx
│   │   └── Profile.tsx
│   │
│   ├── ngo
│   │   ├── Dashboard.tsx
│   │   ├── Donations.tsx
│   │   ├── DonationDetails.tsx
│   │   ├── AssignDelivery.tsx
│   │   └── Analytics.tsx
│   │
│   ├── delivery
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── TaskDetails.tsx
│   │   └── Profile.tsx
│
├── components
│   ├── Navbar
│   ├── Sidebar
│   ├── DonationCard
│   ├── ProtectedRoute
│   ├── StatusBadge
│   └── DashboardCard
│
├── hooks
│
├── routes
│
├── store
│
├── types
│
└── services
```

---

## Backend

```text
com.foodlink

├── auth
│   ├── controller
│   ├── service
│   ├── dto
│   └── repository
│
├── donation
│   ├── controller
│   ├── service
│   ├── dto
│   └── repository
│
├── ngo
│
├── delivery
│
├── feedback
│
├── notification
│
├── websocket
│
├── security
│
├── config
│
└── common
```

---

# MongoDB Collections

## users

```json
{
  "_id": "64abc123",

  "name": "John",

  "email": "john@gmail.com",

  "password": "hashed-password",

  "role": "DONOR",

  "phone": "9876543210",

  "address": "Bangalore",

  "createdAt": "2026-01-01T10:00"
}
```

---

## donations

```json
{
  "_id": "don123",

  "donorId": "user123",

  "foodName": "Rice",

  "foodType": "Cooked",

  "quantity": "50 Plates",

  "description": "Fresh food",

  "pickupAddress": "MG Road",

  "pickupLatitude": 12.9716,

  "pickupLongitude": 77.5946,

  "expiryTime": "2026-01-01T18:00",

  "status": "PENDING",

  "ngoId": null,

  "deliveryPartnerId": null,

  "createdAt": "2026-01-01T12:00"
}
```

---

## feedbacks

```json
{
  "_id": "fb123",

  "donationId": "don123",

  "userId": "user123",

  "rating": 5,

  "comment": "Excellent service"
}
```

---

# Enums

## Role

```java
public enum Role {

    DONOR,

    NGO,

    DELIVERY,

    ADMIN
}
```

---

## DonationStatus

```java
public enum DonationStatus {

    PENDING,

    APPROVED,

    ASSIGNED,

    PICKED_UP,

    DELIVERED,

    REJECTED
}
```

---

# Authentication APIs

## Register

### POST

```http
/api/auth/register
```

Request

```json
{
  "name":"John",

  "email":"john@gmail.com",

  "password":"123456",

  "role":"DONOR"
}
```

Response

```json
{
  "message":"User Registered Successfully"
}
```

---

## Login

### POST

```http
/api/auth/login
```

Request

```json
{
  "email":"john@gmail.com",

  "password":"123456"
}
```

Response

```json
{
  "token":"jwt-token",

  "role":"DONOR"
}
```

---

# Donor APIs

## Create Donation

### POST

```http
/api/donations
```

Request

```json
{
  "foodName":"Rice",

  "foodType":"Cooked",

  "quantity":"50 Plates",

  "description":"Fresh food",

  "pickupAddress":"Bangalore",

  "expiryTime":"2026-01-01T18:00"
}
```

---

## Get My Donations

### GET

```http
/api/donations/my
```

---

## Get Donation Details

### GET

```http
/api/donations/{id}
```

---

## Delete Donation

### DELETE

```http
/api/donations/{id}
```

Allowed only if:

```text
PENDING
```

---

# NGO APIs

## Get Pending Donations

### GET

```http
/api/ngo/donations/pending
```

---

## Approve Donation

### PATCH

```http
/api/ngo/donations/{id}/approve
```

Response

```json
{
  "message":"Donation Approved"
}
```

---

## Reject Donation

### PATCH

```http
/api/ngo/donations/{id}/reject
```

---

## Assign Delivery Partner

### PATCH

```http
/api/ngo/donations/{id}/assign
```

Request

```json
{
  "deliveryPartnerId":"abc123"
}
```

---

## NGO Dashboard Stats

### GET

```http
/api/ngo/dashboard
```

Response

```json
{
  "pending":20,

  "approved":10,

  "delivered":100
}
```

---

# Delivery APIs

## Assigned Tasks

### GET

```http
/api/delivery/tasks
```

---

## Mark Picked Up

### PATCH

```http
/api/delivery/tasks/{id}/pickup
```

Status

```text
ASSIGNED -> PICKED_UP
```

---

## Mark Delivered

### PATCH

```http
/api/delivery/tasks/{id}/deliver
```

Status

```text
PICKED_UP -> DELIVERED
```

---

# Feedback APIs

## Submit Feedback

### POST

```http
/api/feedback
```

Request

```json
{
  "donationId":"123",

  "rating":5,

  "comment":"Food delivered on time"
}
```

---

## Get Feedback

### GET

```http
/api/feedback/{donationId}
```

---

# Dashboard Requirements

## Donor Dashboard

Cards

```text
Total Donations
Pending Donations
Delivered Donations
Rejected Donations
```

Tables

```text
Recent Donations
Current Status
```

---

## NGO Dashboard

Cards

```text
Pending Donations
Approved Donations
Assigned Deliveries
Completed Deliveries
```

Tables

```text
Recent Donations
Delivery Assignments
```

---

## Delivery Dashboard

Cards

```text
Assigned Tasks
Completed Tasks
Pending Tasks
```

Tables

```text
Today's Tasks
```

---

# Real-Time Tracking

Use WebSocket

Dependencies

```xml
spring-boot-starter-websocket
```

Events

```text
DONATION_CREATED

DONATION_APPROVED

DELIVERY_ASSIGNED

PICKED_UP

DELIVERED
```

Frontend subscribes:

```typescript
/ws/tracking/{donationId}
```

---

# Analytics Module

NGO/Admin Dashboard

Metrics

```text
Total Donations

Total Food Saved

Meals Served

Successful Deliveries

Active NGOs

Active Delivery Partners
```

Suggested Charts

```text
Monthly Donations

Status Distribution

Food Category Distribution
```

Use

```bash
npm install recharts
```

---

# Notification Module

Notifications

```text
Donation Approved

Donation Rejected

Delivery Assigned

Food Picked Up

Food Delivered
```

Collection

```json
{
  "_id":"not123",

  "userId":"123",

  "title":"Donation Approved",

  "message":"Your donation has been approved",

  "read":false
}
```

---

# Future Enhancements

## AI Food Recommendation

Predict nearest NGO.

## Google Maps Integration

Display:

- Donor Location
- NGO Location
- Delivery Route

## QR Verification

Generate QR for pickup confirmation.

## Image Upload

Store images in:

- Cloudinary
- AWS S3

## Push Notifications

Using Firebase Cloud Messaging.

---

# Security

## JWT Authentication

Protected APIs:

```text
/api/donations/**
/api/ngo/**
/api/delivery/**
```

---

## Password Encryption

```java
BCryptPasswordEncoder
```

---

## Role Based Authorization

```java
DONOR

NGO

DELIVERY

ADMIN
```

---

# Development Timeline

## Phase 1

Authentication

- Register
- Login
- JWT
- Role Management

## Phase 2

Donations

- Create Donation
- View Donations
- Donation Details

## Phase 3

NGO Module

- Approve
- Reject
- Assign Delivery

## Phase 4

Delivery Module

- Pickup
- Deliver
- Tracking

## Phase 5

Feedback

- Ratings
- Comments

## Phase 6

Analytics

- Charts
- Reports

## Phase 7

WebSocket

- Real-Time Updates

---

# MVP Completion Checklist

## Authentication

- [x] Register
- [x] Login
- [x] JWT

## Donor

- [ ] Dashboard
- [ ] Create Donation
- [ ] My Donations
- [ ] Tracking

## NGO

- [ ] Approve Donation
- [ ] Reject Donation
- [ ] Assign Delivery

## Delivery

- [ ] Pickup Task
- [ ] Deliver Task

## Feedback

- [ ] Submit Feedback

## Analytics

- [ ] Dashboard Charts

## Real-Time Updates

- [ ] WebSocket Integration

---

# Expected Outcome

A scalable full-stack food donation platform that:

- Reduces food wastage
- Connects donors with NGOs
- Tracks food delivery in real time
- Provides analytics and transparency
- Supports the Zero Hunger initiativew#   F o o d l i n k - F r o n t e n d  
 