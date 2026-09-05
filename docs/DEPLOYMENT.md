# Railway Deployment

The production topology is one full-stack application service plus one PostgreSQL service in the same Railway project. The root `Dockerfile` is detected automatically and serves both the React application and Spring API.

## Create the Project

1. Push the repository to GitHub and create a Railway project from that repository.
2. Add PostgreSQL from the project canvas. Keep the generated service name `Postgres`, or adjust the references below to match its name.
3. Open the application service's **Variables** tab and add:

   ```text
   DB_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   DB_USERNAME=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   SESSION_COOKIE_SECURE=true
   SESSION_COOKIE_SAME_SITE=lax
   CSRF_COOKIE_SECURE=true
   CSRF_COOKIE_SAME_SITE=Lax
   FORWARD_HEADERS_STRATEGY=FRAMEWORK
   ```

   Railway injects `PORT`; do not set it manually. No `VITE_API_BASE_URL` is needed because production requests use the same origin.

4. Generate a public domain for the application service.
5. In **Settings > Deploy > Healthcheck**, set the path to `/actuator/health`.
6. Deploy and confirm the healthcheck, public landing page, registration, login, direct trip-route refresh, and database writes.

## Database Rules

An empty Railway database is initialized automatically by Flyway. Do not set `SPRING_FLYWAY_BASELINE_ON_MIGRATE` for a new database. Flyway runs before Hibernate validation, and a failed migration prevents an unhealthy release from replacing the active deployment.

Before importing existing data, take a backup and review [Database Migrations](../backend/MIGRATIONS.md). Treat PostgreSQL credentials as service variables—never commit them. Configure recurring database backups before storing data you cannot recreate.

## Release Checklist

- Run frontend lint, tests, and production build.
- Run backend tests.
- Build the root Docker image locally when Docker is available.
- Review new Flyway migrations; never edit an applied migration.
- Check Railway deployment logs and `/actuator/health`.
- Smoke-test both languages, both themes, mobile layout, authentication, and print output.
- Review Railway usage and configure a spending alert or hard limit.

## Rollback

Application releases can be rolled back from Railway's deployment history. A code rollback does not reverse database migrations; use forward-only corrective migrations for schema or data changes.

## Railway References

- [Dockerfile deployments](https://docs.railway.com/builds/dockerfiles)
- [PostgreSQL service and variables](https://docs.railway.com/databases/postgresql)
- [Deployment healthchecks](https://docs.railway.com/deployments/healthchecks)
- [Usage limits and cost controls](https://docs.railway.com/pricing/cost-control)
