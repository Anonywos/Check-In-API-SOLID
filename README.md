# Gym Check ins API SOLID

This project is part of the Node.js course assignments from the Rocketseat platform. The goal is to build an API following SOLID principles for a gym check-in application, allowing users to check in at a gym and view they check-in history. The API was built with Node.js, Fastify, TypeScript, PostgreSQL and Prisma.

The project includes automated tests written with Vitest and includes authentication using JSON Web Token (JWT) with refresh token. The migrations and database queries are handled with Prisma.

GymPass style app.

## 🚀 Technologies

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Prisma
- Zod
- Dotenv
- Vitest
- Supertest

## 🎯 Requirements

### Functional Requirements

- [X] should be able to sign up
- [X] should be able to sign in
- [X] should be able to get a profile of a logged-in user
- [X] should be able to get the number of check-ins made by the authenticated user
- [X] should be able to get the authenticated user's check-in history
- [X] should be able to let user search for nearby gyms (within 10km)
- [X] should be able to let user search for gyms by name
- [X] should be able to let user check in at a gym
- [X] should be able to validate a user's check-in
- [X] should be able to register a gym

### Business Rules

- [X] should not be able to sign up with a duplicate email
- [X] should not be able to allow a user check-in twice on the same day
- [X] should not be able to check in if user isn't near the gym (100m)
- [X] should not be able to validate a check-in before 20 minutes have passed since its creation
- [X] should not allow non-admin users to validate check-ins
- [X] should not allow non-admin users to register a gym

### Non-functional Requirements

- [X] the user's password must be encrypted
- [X] the aplication's data must be stored in a PostgreSQL database
- [X] every data list must be paginated with 20 items per page
- [X] the user must be identified by a JWT (JSON Web Token)

## 📚 What I learned

- Building REST APIs with Node.js, Fastify, and TypeScript following SOLID principles
- Applying SOLID principles to organize use cases, repositories, and services
- Creating routes and handling HTTP responses
- Validating request data with Zod
- Persisting data with PostgreSQL and Prisma
- Creating and running database migrations with Prisma
- Using JWT and refresh tokens to authenticate users
- Implementing role-based access control for admin-only features
- Writing automated tests with Vitest and Supertest
- Creating in-memory repositories to test use cases without depending on the database
- Handling geolocation and distance calculations
- Handling time-sensitive business rules
- Organizing a backend project with routes, middlewares, helpers, and database configuration
- Configuring a GitHub Actions CI workflow to run E2E tests automatically on pull requests
- Using a PostgreSQL service container in GitHub Actions to test the application in a CI environment


## 📌 API Routes

### Create user

POST /users

Example body:

{ "name": "John Doe", "email": "johndoe@email.com", "password": "123456" }

### Authentication

POST /sessions

Example body:

{ "email": "johndoe@email.com", "password": "123456" }

### Refresh Token

PATCH /token/refresh

### View user profile

* Requires authentication *

GET /me

### Create a gym

* Requires authentication and admin access *

POST /gyms

Example body:

{ "title": "gym", "description": "A gym with modern equipment and personal trainers.", "phone": "85999999999", "latitude": -5.08921, "longitude": -42.8016 }

OR

{ "title": "gym", "description": null, "phone": null, "latitude": -5.08921, "longitude": -42.8016 }

### Search for gyms

* Requires authentication *

GET /gyms/search

Query params: q (string) & page (number optional)

Exemple: /gyms/search?q=power&page=1

### Search for nearby gyms

* Requires authentication *

GET /gyms/nearby

Query params: latitude (number) & longitude (number)

Example: /gyms/nearby?latitude=-5.08921&longitude=-42.8016

### Create a check-in

* Requires authentication *

POST /gyms/:gymId/check-ins

### Validate a check-in

* Requires authentication and admin access *

PATCH /check-ins/:checkInId/validate

### View a user's check-in history

* Requires authentication *

GET /check-ins/history

Query params: page number optional

Example: /check-ins/history?page=1

### View check-in metrics

* Requires authentication *

GET /check-ins/metrics
