# BWIFT-Based Banking Frontend

White-label banking website frontend for the DemocracyCraft network. Each bank gets its own deployed instance with a fully customizable landing page, theme, and player/admin dashboard, all configured through a WYSIWYG editor. No code knowledge required for bank administrators.

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **React Router v7** for client-side routing
- **@tanstack/react-query** for server state
- **Zod** for runtime schema validation
- **@dnd-kit** for drag-and-drop (WYSIWYG editor)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start dev server (runs with mock data, no backend needed)
npm run dev
```

Open `http://localhost:5173` to see the landing page with mock data for Reveille National Bank.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

See [`.env.example`](.env.example) for all available variables.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_MOCK_MODE` | `true` | Enable mock data fallback (no backend needed) |
| `VITE_API_URL` | `http://localhost:3001/api` | Backend API base URL |
| `VITE_BANK_ID` | `demo-bank-001` | Bank identifier for this deployment |

## Architecture

### Module System

The landing page is built from a configurable array of **modules** (hero, features, FAQ, testimonials, etc.). Each module has:
- A React render component
- A Zod config schema
- Default values
- An admin editor form (Phase 8)

Banks customize their landing page by toggling, reordering, and editing modules through the admin WYSIWYG editor.

### Theme System

Themes use **oklch** color variables that map directly to shadcn/ui's CSS variable architecture. A `ThemeProvider` injects CSS variables at runtime based on the bank's saved config. Ships with 4 presets (Dark Fintech, Dark Gold, Light Professional, Light Minimal) and supports full customization.

### Data Service Layer

All API calls go through `data-service.ts`, which wraps each call with environment-based behavior:
- **Mock mode** (`VITE_MOCK_MODE=true`): Tries the API, silently falls back to mock data on failure
- **Production** (`VITE_MOCK_MODE=false`): API only, errors propagate to the UI

### Authentication

Discord SSO is the only auth method. The flow is backend-mediated — the frontend redirects to the backend, which handles the OAuth2 dance and returns a JWT. In mock mode, a "Dev Login" button bypasses Discord entirely.

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui (auto-generated)
│   ├── layouts/         # Public layout, dashboard layout
│   ├── landing/         # Landing page module components
│   │   └── modules/     # Hero, features, FAQ, footer, etc.
│   ├── providers/       # AuthProvider, SiteConfigProvider
│   └── shared/          # Reusable components
├── hooks/               # usePageTitle, useSiteConfig, etc.
├── lib/
│   ├── auth/            # Discord OAuth, session/token storage
│   ├── config/          # Module registry, Zod schemas, defaults
│   ├── data/            # API client, data service, mock data, types
│   └── theme/           # Presets, CSS var mapping, types
└── routes/              # Page components (landing, login, dashboard)
```

## Documentation

- [API Endpoints](docs/API_ENDPOINTS.md) — Backend contract for the Python/FastAPI server
- [Contributing](CONTRIBUTING.md) — Branch naming, workflow, and code standards

## Development Phases

| Phase | Status |
|-------|--------|
| Project Setup & Foundation | Done |
| Data Layer & Types | Done |
| Theme System | Done |
| Module System & Landing Page | Done |
| Authentication (Discord SSO) | Done |
| Dashboard Shell & Account Switching | Next |
| Player Dashboard | Planned |
| WYSIWYG Site Editor (Admin) | Planned |
| Theme Configurator (Admin) | Planned |
| Polish & Production | Planned |
