# Employee Manager — Payroll subgraph

Federated GraphQL subgraph (port **3001**) owned by the payroll domain. Extends `Employee` with compensation fields; data lives in the `employee_payroll` database.

## Setup

```bash
cp .env.example .env
bun install
# Create database (pick one):
#   psql -U postgres -h localhost -c "CREATE DATABASE employee_payroll;"
#   Docker: docker exec -it <postgres-container> psql -U postgres -c "CREATE DATABASE employee_payroll;"
#   Homebrew: brew install libpq && export PATH="$(brew --prefix libpq)/bin:$PATH" && createdb employee_payroll
bun run db:migrate
bun run db:seed
bun run dev
```

## Auth

Mock headers match the employees subgraph. Only **`admin`** may read `compensationSummary` and `lastPayStub` (see `src/auth/policy.ts`).

## Federation

Compose and run the gateway from [`employee-manager-router`](../employee-manager-router/README.md). Seed employee IDs must match rows in `employee-manager-be` (`11111111-…`, etc.).
