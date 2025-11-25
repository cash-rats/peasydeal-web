# Repository Guidelines

## Project Structure & Module Organization
Peasydeal Web is a React Router app built with Remix primitives. Feature routes live under `app/routes`, shared UI is in `app/components`, and domain logic (services, libs, sessions, Redis helpers) sits inside `app/services`, `app/lib`, and `app/sessions`. Global styling and Tailwind layers live in `app/styles` with supporting configs in `tailwind.config.js` and `postcss.config.js`. Static assets ship from `public`, Storybook/Cosmos experiments belong in `playground` and `docs`, while integration tests live in `test` and end-to-end suites in `cypress`. Docker tooling is in `dockerfiles` and deployment manifests in `fly.toml` plus the `docker-compose.*` files.

## Build, Test, and Development Commands
- `npm run dev` – starts the React Router dev server on http://localhost:5173 with hot reloading.
- `npm run build` – produces the production bundle under `build/` (server + client assets).
- `npm start` – serves the compiled app via `react-router-serve` (requires a prior build).
- `npm run typecheck` – runs route type generation and the TypeScript compiler.
- `npm run lint` / `npm run format` – enforce ESLint + Prettier rules; run before every PR.
- `npm run test` – executes Vitest suites with the happy-dom environment.
- `npm run test:e2e:dev` – boots the dev server and opens Cypress for browser tests.

## Coding Style & Naming Conventions
Use TypeScript throughout with modern React patterns (hooks, function components). Components, layouts, and routes are `PascalCase` (`ListingCard.tsx`), hooks start with `use` (`useListingFilters.ts`), and utilities/services stay `camelCase`. Keep files in `app/routes` kebab-cased to mirror URL segments (e.g., `app/routes/listings.$id.tsx`). Two-space indentation, single quotes, and trailing commas are enforced by Prettier; do not hand-format. Tailwind classes belong in JSX, while reusable design tokens live in `app/styles` and `theme.ts`. Run `npm run lint` before committing to catch accessibility and import-order issues.

## Testing Guidelines
Write component and logic specs as `*.test.ts(x)` colocated with the source or under `test/`. Prefer Testing Library queries and avoid snapshots except for serialized data contracts. Measure coverage with `npm run test -- --coverage` (c8 is already available). Cypress specs go in `cypress/e2e` and should stub network calls via MSW when possible; `test:e2e:dev` already wires up the local server. Keep fixtures in `cypress/fixtures` or `mocks/`, and name scenarios after the user flow being protected.

## Commit & Pull Request Guidelines
Follow the existing short imperative style (`Upgrade react icon package`, `Remove debug log`). Each commit should focus on one concern and include any required schema or asset updates. PRs must describe the change, link to the tracking issue or ticket, call out environment variables or migrations, and attach screenshots/video for UI changes. Ensure CI-ready status by running `npm run lint`, `npm run typecheck`, and the relevant test suites locally. Avoid committing secrets—verify `.env*` stays excluded and document any new configuration in `docs/` or the PR body.

## Security & Configuration Tips
Environment contracts are declared in `remix.env.d.ts`; update it whenever you add a new variable so typegen can surface missing values. Local development expects AWS/Stripe/Contentful keys plus Redis credentials—use `.env.local` and never check it in. For containerized runs, align the variables defined in `docker-compose.staging.yaml`/`docker-compose.prod.yaml` and `fly.toml`. When touching `db.server.ts` or `redis.server.ts`, validate connectivity via `npm run dev` before submitting a PR.
