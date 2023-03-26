# ThesisMicroserviceTemplate

A microservice template, written as part of a master's thesis. The template
implements a simple user data service that saves personal data in key-value
pairs.

## Dependencies

All direct dependencies and their justifications are listed below.

### General

- `@prisma/client`: type-safe query builder generation
- `express`: the web framework for handling REST requests
- `jsonwebtoken`: implementation of the JWT standard's functions
- `prisma`: database tools, including code generation and migration

### Development

- `@types` packages: TypeScript type declarations for JavaScript packages
  - `@types/express`
  - `@types/jest`
  - `@types/jsonwebtoken`
  - `@types/node`
  - `@types/supertest`
- `@typescript-eslint` packages: TypeScript support and rules for ESLint
  - `@typescript-eslint/eslint-plugin`: rules for TypeScript linting
  - `@typescript-eslint/parser`: alternative parser that understands TypeScript
- `eslint`: static code analysis
- `jest`: testing framework for JavaScript
- `nodemon`: automatic server restart on changes
- `supertest`: complementing API testing library
- `ts-jest`: support for running Jest tests written in TypeScript
- `typescript`: support for static typing in JavaScript

## Environment variables

The Docker Compose services use environment files (`.env.database` and
`.env.backend`) to fetch environment variables. The required variables for each
service are listed below.

Example files are included in the repository. They work with production mode
right away. For development mode, make sure the connection string is corrected
(`database:5432` -> `localhost:5000` with default containerized database).

### Database

- `POSTGRES_DB`: name of the used PostgreSQL database
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password

### Backend

- `PRISMA_DB_URL`: connection string used by Prisma
  - `connection_limit`: (optional): connection pool limit
  - `pool_timeout`: (optional): the time every connection remains open
- `PRIVATE_TOKEN`: secret that verifies a JWT token

## Running development

The easiest way to run the service in development mode is to start the database
in a container and the backend locally. When changes to TS files are made, the
backend will live reload them. In case of Prisma files (database changes), the
backend needs to be manually restarted.

```sh
docker-compose up database    # Start the containerized database
cp .example-env.backend .env  # Create and modify settings for backend
npm install                   # Install dependencies
npm run devBuild              # (Leave running) Generate and transpile code
npm run devServe              # (Leave running) Run the backend service
```

## Running production

Running the service in production mode is really straight-forward. Just create
environment files with desired settings and start the containers.

```sh
cp .example-env.database .env.database  # Create settings for database
cp .example-env.backend .env.backend    # Create settings for backend
docker-compose up                       # Run the whole service
```

## API documentation

Documentation is written in the OpenAPI 3.0 format. It can be found in `api-doc.yml`.
