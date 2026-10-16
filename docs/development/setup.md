# Development setup

## Prerequisites

TuxBI is currently developed for Linux. Install:

- Node.js 22 or later and npm
- Rust stable and Cargo
- Linux packages required by Tauri/WebKitGTK, including a WebKitGTK 4.1 development package, GTK 3 development files, `libayatana-appindicator3-dev`, `librsvg2-dev`, and `patchelf`

Package names differ by distribution. Consult the current [Tauri Linux prerequisites](https://v2.tauri.app/start/prerequisites/) for the package names appropriate to your distribution.

## Install dependencies

From the repository root:

```bash
npm install
```

The first native build also downloads Rust crates into Cargo's local cache.

## Frontend development

Start Vite's browser development server:

```bash
npm run dev
```

It runs on `http://localhost:1420` to match the Tauri development configuration.

## Desktop development

Run the Tauri desktop application with hot reload:

```bash
npm run tauri dev
```

The first run may take longer because Rust dependencies are compiled. CSV, JSON, Excel, and Parquet import do not require a database service, external API, or telemetry configuration.

## Quality commands

```bash
npm run lint
npm run format:check
npm test
npm run build
```

`npm run build` type-checks the frontend and produces the Vite asset bundle. To create a distributable package once Linux prerequisites are present:

```bash
npm run tauri build
```

## Linux notes

- Use a Wayland or X11 desktop session; Tauri uses the system WebKitGTK runtime.
- WebKitGTK development headers are required to compile the native host, even though the UI itself is built with React.
- Keep Rust and Node current, but use the lockfile in CI and team development for repeatable dependency resolution.
- TuxBI keeps imported CSV, JSON, Excel, and Parquet data in the running application only; 0.1E does not persist projects or upload files.
