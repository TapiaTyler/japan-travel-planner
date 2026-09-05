# Repository Guidelines

## Project Structure

The React/Vite client lives in `frontend/`. Route-level screens belong in `src/pages`, reusable UI in `src/components`, server calls in `src/api`, and shared logic in `src/hooks` or `src/utils`. Keep feature CSS in `src/styles` and translations in `src/i18n/locales`.

The Java 21/Spring Boot API lives in `backend/`. Follow the existing `controller` → `service` → `repository` boundary; use DTOs for API contracts and entities only for persistence. Add PostgreSQL changes as new files under `backend/src/main/resources/db/migration`. Never edit an applied Flyway migration.

## Build and Test Commands

From `frontend/`:

- `npm run dev` starts Vite locally.
- `npm run lint` checks ESLint rules.
- `npm test` runs the Vitest suite once.
- `npm run build` creates the production client.

From `backend/`, run `.\mvnw.cmd test` on Windows or `./mvnw test` elsewhere. From the repository root, `docker build -t japan-travel-planner .` verifies the production image.

## Style and Naming

Match the surrounding formatting: four spaces in JavaScript and Java, semicolons in JavaScript, and one public Java type per file. Use `PascalCase` for React components and Java classes, `camelCase` for functions and variables, and descriptive hook names beginning with `use`. Keep components focused and move non-rendering behavior into hooks or utilities. Add all user-facing copy to both `en.json` and `ja.json`.

## Testing

Place frontend tests beside their source using `*.test.js` or `*.test.jsx`. Backend tests mirror production packages under `backend/src/test/java`. Cover behavior and failure paths, especially authentication, ownership, filters, routing, and data transformations. Run both suites before opening a pull request.

## Commits and Pull Requests

Use concise imperative commit subjects, such as `Add Railway deployment configuration`. Keep commits scoped to one coherent change. Pull requests should explain the user-facing result, list verification performed, link relevant issues, and include desktop/mobile screenshots for visual changes. Call out migrations, configuration changes, and follow-up work explicitly. Never commit credentials, `.env` files, IDE metadata, or generated build output.
