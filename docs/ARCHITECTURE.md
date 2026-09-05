# Architecture

## System Overview

Japan Travel Planner is a modular monolith with a React client, a Spring Boot REST API, and PostgreSQL. The repository keeps frontend and backend development independent while producing one deployable container.

```text
Browser
  ├─ React UI and client-side routing
  └─ /api requests and session cookies
             │
       Spring Boot
  ├─ controllers and request validation
  ├─ Spring Security, CSRF, and rate limiting
  ├─ services and ownership rules
  └─ JPA repositories
             │
         PostgreSQL
       Flyway migrations
```

## Frontend

`frontend/src/pages` contains route-level screens. Components are grouped by feature under `frontend/src/components`; hooks coordinate API-backed state; `frontend/src/api/api.js` is the HTTP boundary. English and Japanese resources live in `frontend/src/i18n/locales`, while shared design tokens and feature styles live in `frontend/src/styles`.

React Router owns browser navigation. In production, `SpaController` forwards known client routes to `index.html`, preserving direct links and refreshes without interfering with `/api` or static assets.

## Backend

Controllers translate HTTP requests into application operations. Services enforce authentication, resource ownership, validation, duplication, and template behavior. Repositories isolate persistence through Spring Data JPA, and DTOs keep entities out of the public API contract.

Authentication uses server-side HTTP sessions. Mutating requests require a CSRF token. Passwords are BCrypt-hashed, account-scoped endpoints verify ownership, and login attempts are limited independently by username and client IP.

## Data and Migrations

PostgreSQL is the system of record. Hibernate uses `ddl-auto=validate`; it never changes production tables. Flyway applies ordered migrations from `backend/src/main/resources/db/migration` during startup. Applied migrations are immutable—schema changes require the next versioned file.

## Deployment Shape

The root `Dockerfile` builds React first, copies its output into Spring Boot static resources, packages the JAR, and runs it as a non-root user. The browser and API therefore share an origin, simplifying cookies, CSRF, and CORS. Railway provides the application service, injected `PORT`, public domain, and a private PostgreSQL service.

## Deliberate Constraints

- Costs are stored and totaled only in JPY; exchange-rate ambiguity is intentionally avoided.
- User-entered names, notes, and locations remain in their original language.
- Map links use encoded queries and external map URLs, so no paid maps API or location tracking is required.
- Image uploads are deferred to keep storage, moderation, lifecycle, and cost concerns outside the current portfolio scope.
