# Database Migrations

Flyway owns the PostgreSQL schema. Hibernate validates entity mappings but does not create or alter database objects.

Migration files live in `src/main/resources/db/migration` and run automatically when the Spring Boot application starts. Never modify a migration that has already been applied. Add the next numbered migration instead, such as `V2__add_trip_templates.sql`.

## Existing Local Database

The original schema was created by Hibernate before Flyway was introduced. Baseline it once before starting the application normally:

1. Keep a current schema or database backup.
2. In IntelliJ's Maven tool window, select **Reload All Maven Projects** so the Flyway starter is included in the backend runtime classpath.
3. Open **Run > Edit Configurations** and select the backend Spring Boot configuration.
4. Add this environment variable alongside the existing database variables:

   ```text
   SPRING_FLYWAY_BASELINE_ON_MIGRATE=true
   ```

5. Start the backend once. Flyway should create `flyway_schema_history` and record version 1 as the baseline without recreating existing tables.
6. In pgAdmin, verify the result:

   ```sql
   SELECT installed_rank, version, description, type, success
   FROM public.flyway_schema_history
   ORDER BY installed_rank;
   ```

7. Stop the backend, remove `SPRING_FLYWAY_BASELINE_ON_MIGRATE`, and start it again.

Do not leave baseline-on-migrate enabled. Its normal disabled state protects the application from silently accepting an unexpected non-empty schema.

## New Database

Do not set the baseline environment variable for an empty database. Flyway will execute `V1__baseline_schema.sql` and construct the complete application schema.
