# TuxBI

TuxBI is an independent, Linux-native business intelligence desktop application. It is being built around a familiar workflow—data, transformation, modeling, calculation, visualization, filtering, and reporting—while maintaining its own implementation and visual identity.

## Current release

**Version:** 0.1B (CSV import)

The current milestone adds local CSV import to the 0.1A desktop foundation. TuxBI detects delimiters, parses quoted UTF-8 records, infers basic column types, reports metadata, and provides a bounded scrollable preview. Files remain local; no CSV data is uploaded or sent to external services.

## Technology stack

- [Tauri 2](https://tauri.app/) for the Linux desktop container
- React 19 and TypeScript for the frontend
- Vite for development and frontend builds
- CSS custom properties and component-scoped styles for theming and maintainable UI styling
- Vitest for the initial test foundation

## Development

Prerequisites are detailed in [the setup guide](docs/development/setup.md).

```bash
npm install
npm run dev
```

Run the desktop app in development mode:

```bash
npm run tauri dev
```

Useful quality commands:

```bash
npm run lint
npm run format:check
npm test
npm run build
npm run tauri build
```

## Project structure

```text
src/
  components/     Desktop-shell UI split by responsibility
  hooks/          Reusable React behavior, including keyboard shortcuts
  state/          Small reducer/context application state foundation
  styles/         Shared tokens and global styles
  types/          Shared TypeScript domain types
  data/           CSV parsing, validation, and import boundary
  utils/          Framework-independent helpers
src-tauri/        Native Tauri host and minimal capability definition
tests/            Focused frontend behavior tests
docs/             Architecture, development, and product roadmap notes
```

## Roadmap

The active milestone is **0.1B — CSV Import**. See the complete [TuxBI roadmap](docs/roadmap/roadmap.md).

## Principles

- Independent design and implementation; no proprietary assets, branding, or copied interfaces.
- Local-first desktop software with no telemetry or external service dependency in the foundation.
- Small, typed, maintainable building blocks that leave room for future BI capabilities.
- Minimal desktop permissions; native functionality is added only when a milestone requires it.
