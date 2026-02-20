# Contributing to BWIFT-Based Banking Frontend

## Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start dev server (mock mode — no backend needed)
npm run dev
```

The app runs at `http://localhost:5173` with mock data enabled by default.

## Branch Naming

All work happens on branches off `main`. Use the following prefixes:

| Prefix | Use for | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/dashboard-sidebar` |
| `bug/` | Bug fixes | `bug/login-redirect-loop` |
| `refactor/` | Code restructuring (no behavior change) | `refactor/extract-auth-hooks` |
| `chore/` | Tooling, deps, CI, config | `chore/update-eslint-config` |
| `docs/` | Documentation only | `docs/api-endpoints-update` |
| `style/` | Visual/CSS changes (no logic) | `style/landing-page-glass-effect` |

**Rules:**
- Branch names are lowercase, kebab-case
- Keep names short but descriptive
- Never push directly to `main`

## Workflow

1. Create a branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add <files>
   git commit -m "Add dashboard sidebar navigation"
   ```

3. Push and open a PR:
   ```bash
   git push -u origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub targeting `main`.

4. PR gets reviewed, approved, then merged (squash merge preferred).

## Commit Messages

Write clear, imperative commit messages:

```
Add account overview component
Fix transaction filter not clearing on page change
Update mock data with realistic transfer amounts
Remove unused auth callback timeout logic
```

**Don't:**
- `fixed stuff`
- `WIP`
- `asdfasdf`
- Prefix with `feat:`, `fix:`, etc. (we keep it simple)

## Code Standards

- **TypeScript strict mode** — no `any` types, ever
- **Explicit return types** on exported functions
- **Zod** for runtime validation at API boundaries
- **shadcn/ui** components preferred — don't build custom when shadcn has one
- Run `npm run build` before pushing to make sure types check

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/           # shadcn/ui (auto-generated, don't edit)
│   ├── layouts/      # Page layout wrappers
│   ├── landing/      # Landing page modules
│   ├── providers/    # Context providers (auth, site config)
│   └── shared/       # Shared components
├── hooks/            # Custom React hooks
├── lib/              # Non-React utilities
│   ├── auth/         # Auth helpers (Discord, session)
│   ├── config/       # Site config schemas, module registry
│   ├── data/         # API client, data service, mock data, types
│   └── theme/        # Theme presets, utils, types
└── routes/           # Route page components
```

## Environment Variables

See `.env.example` for all available variables. Key ones:

| Variable | Purpose |
|----------|---------|
| `VITE_MOCK_MODE` | `true` = mock data fallback, `false` = API only |
| `VITE_API_URL` | Backend API base URL |
| `VITE_BANK_ID` | Bank identifier for this deployment |

**Never commit `.env` files.** They're gitignored.

## Running Checks

```bash
npm run build    # TypeScript type check + production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```
