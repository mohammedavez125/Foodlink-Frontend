# FoodLink Frontend

FoodLink Frontend is a React web app for the FoodLink food donation platform. It connects to the Spring Boot backend API for donor and NGO registration, JWT login, Google OAuth2 login, profile management, and the donation workflow from creation to completion.

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Axios
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- Base UI / local UI components
- Sonner toast notifications
- Lucide React icons

## Backend Requirement

Run the FoodLink backend before using the frontend.

Default backend URL:

```text
http://localhost:8080
```

The backend CORS configuration should allow:

```text
http://localhost:5173
```

## Project Structure

```text
frontend/
|-- package.json
|-- vite.config.ts
|-- tsr.config.json
|-- README.md
|-- public/
|   |-- favicon.svg
|   |-- icons.svg
|   `-- placeholder.svg
`-- src/
    |-- main.tsx
    |-- App.tsx
    |-- routeTree.gen.ts
    |-- api/
    |   `-- client.ts
    |-- auth/
    |   |-- authStore.ts
    |   |-- permissions.ts
    |   |-- requireAuth.ts
    |   |-- requirePermission.ts
    |   `-- roles.ts
    |-- components/
    |   |-- common/
    |   |-- layout/
    |   |-- ui/
    |   |-- login-form.tsx
    |   |-- signup-form.tsx
    |   `-- Navbar.tsx
    |-- features/
    |   |-- donation/
    |   |   |-- api/
    |   |   |-- components/
    |   |   |-- hooks/
    |   |   |-- pages/
    |   |   `-- schemas/
    |   |-- donor/
    |   |   |-- api/
    |   |   |-- hooks/
    |   |   |-- pages/
    |   |   `-- schemas/
    |   `-- ngo/
    |       |-- api/
    |       |-- hooks/
    |       |-- pages/
    |       `-- schemas/
    |-- pages/
    |-- routes/
    |-- services/
    |   |-- openapi/
    |   |   `-- generated.ts
    |   |-- api-error.ts
    |   |-- query-client.ts
    |   `-- query-keys.ts
    |-- types/
    `-- utils/
```

## Main Packages

- `src/routes`: File-based TanStack Router routes.
- `src/auth`: JWT persistence, role normalization, auth guards, and permission helpers.
- `src/api`: Shared Axios client and request/response interceptors.
- `src/services/openapi/generated.ts`: TypeScript API contract types generated from the backend OpenAPI shape.
- `src/features/donation`: Donation API wrappers, query hooks, forms, tables, and pages.
- `src/features/donor`: Donor profile API wrappers, hooks, schemas, and pages.
- `src/features/ngo`: NGO profile API wrappers, hooks, schemas, and pages.
- `src/components/ui`: Shared reusable UI primitives.
- `src/components/layout`: Donor and NGO app layouts.

## API Types

Backend DTO and enum types are kept in:

```text
src/services/openapi/generated.ts
```

The frontend currently uses these generated types for:

- `FoodCategory`
- `DonationStatus`
- `DonorType`
- `RoleName`
- `CreateDonationRequest`
- `UpdateDonationRequest`
- `AcceptDonationRequest`
- `DonationResponse`
- `UpdateDonorProfileRequest`
- `DonorProfileResponse`
- `UpdateNgoProfileRequest`
- `NgoProfileResponse`
- `AuthRequestDto`
- `LoginResponseDto`

Update this file whenever backend request or response DTOs change.

## Configuration

The shared Axios client reads the backend URL from:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Create a local `.env` file if you need a custom backend URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Note: the login and signup forms currently call `http://localhost:8080` directly for `/auth/login`, `/auth/signup/donor`, `/auth/signup/ngo`, and `/oauth2/authorization/google`. Keep the backend on port `8080`, or update those form URLs if the backend runs elsewhere.

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build the app |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Routes

| Path | Access | Description |
| --- | --- | --- |
| `/home` | Public | Public home page |
| `/about` | Public | About page |
| `/login` | Public | Username/password login and Google OAuth entry |
| `/signup` | Public | Donor or NGO registration |
| `/login/callback` | Public | OAuth callback handling |
| `/donor/dashboard` | Authenticated donor | Donor dashboard |
| `/donor/profile` | Authenticated donor | View and update donor profile |
| `/donor/donations` | Authenticated donor | List donor's donations |
| `/donor/donations/create` | Authenticated donor | Create a donation |
| `/donor/donations/$donationId/edit` | Authenticated donor | Edit an available donation |
| `/donor/history` | Authenticated donor | Completed donor donation history |
| `/ngo/dashboard` | Authenticated NGO | NGO dashboard |
| `/ngo/profile` | Authenticated NGO | View and update NGO profile |
| `/ngo/donations/browse` | Authenticated NGO | Browse available donations |
| `/ngo/donations/accepted` | Authenticated NGO | View accepted donations |
| `/ngo/history` | Authenticated NGO | Completed NGO donation history |
| `/donations/$id` | Authenticated donor or NGO | Donation details |

## Authentication

The app supports:

- Local username/password login through `POST /auth/login`.
- Donor signup through `POST /auth/signup/donor`.
- NGO signup through `POST /auth/signup/ngo`.
- Google OAuth2 login through `/oauth2/authorization/google`.
- JWT storage in `localStorage` under the `foodlink-auth` key.
- Automatic `Authorization: Bearer <token>` headers through the shared Axios client.
- Automatic logout when a protected Axios request returns `401` for an authenticated request.

After login, users are redirected by role:

| Role | Redirect |
| --- | --- |
| `DONOR` | `/donor/dashboard` |
| `NGO` | `/ngo/dashboard` |
| Other roles | `/home` |

## Backend APIs Used

### Auth

| Method | Path | Used By |
| --- | --- | --- |
| `POST` | `/auth/login` | Login form |
| `POST` | `/auth/signup/donor` | Signup form |
| `POST` | `/auth/signup/ngo` | Signup form |
| `GET` | `/oauth2/authorization/google` | Google login button |

### Donor Profile

| Method | Path | Used By |
| --- | --- | --- |
| `GET` | `/donor/profile/get-my-profile` | Donor profile page |
| `PUT` | `/donor/profile/update-my-profile` | Donor profile form |

### NGO Profile

| Method | Path | Used By |
| --- | --- | --- |
| `GET` | `/ngo/profile/get-my-profile` | NGO profile page |
| `PUT` | `/ngo/profile/update-my-profile` | NGO profile form |

### Donations

| Method | Path | Used By |
| --- | --- | --- |
| `POST` | `/donations/create-donation` | Donor create donation page |
| `PUT` | `/donations/{donationId}` | Donor edit donation page |
| `DELETE` | `/donations/delete-donation/{donationId}` | Donor donations table |
| `GET` | `/donations/my-donations` | Donor donations and details |
| `GET` | `/donations/available-donations` | NGO browse donations |
| `GET` | `/donations/my-accepted-donations` | NGO accepted donations |
| `GET` | `/donations/history/donor` | Donor history |
| `GET` | `/donations/history/ngo` | NGO history |
| `POST` | `/donations/{donationId}/accept` | NGO accept donation action |
| `PATCH` | `/donations/{donationId}/dispatch` | Donor dispatch action |
| `PATCH` | `/donations/{donationId}/receive` | NGO receive action |
| `PATCH` | `/donations/{donationId}/complete` | NGO complete action |

## Donation Workflow

```text
Donor creates donation
  |
  v
AVAILABLE
  |
  v
NGO accepts donation
  |
  v
ACCEPTED
  |
  v
Donor dispatches donation
  |
  v
DISPATCHED
  |
  v
NGO marks donation received
  |
  v
RECEIVED
  |
  v
NGO completes donation
  |
  v
COMPLETED
```

Other backend statuses represented in the frontend types:

```text
EXPIRED
CANCELLED
```

## Supported Enums

Food categories:

```text
VEG
NON_VEG
MIXED
BAKERY
FRUITS
BEVERAGES
```

Donor types:

```text
INDIVIDUAL
RESTAURANT
HOTEL
CATERING_SERVICE
VOLUNTEER_GROUP
```

Roles:

```text
ADMIN
DONOR
NGO
```

## Common Development Flow

1. Start the Spring Boot backend on `http://localhost:8080`.
2. Confirm MongoDB, roles, permissions, and OAuth settings are configured in the backend.
3. Install frontend dependencies with `npm install`.
4. Start the frontend with `npm run dev`.
5. Open `http://localhost:5173`.
6. Register as a donor or NGO from `/signup`.
7. Login from `/login`.
8. Use the donor or NGO dashboard to manage profiles and donations.

## Notes

- `src/routeTree.gen.ts` is generated by TanStack Router and should not be edited manually.
- `src/services/openapi/generated.ts` should track backend DTO changes.
- Protected app routes call `requireAuth()` and redirect unauthenticated users to `/login`.
- Role checks use normalized role names, so values such as `ROLE_DONOR` are treated as `DONOR`.
- Keep real backend secrets in the backend environment, not in this frontend repository.
