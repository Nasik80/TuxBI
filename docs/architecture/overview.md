# TuxBI architecture overview

## Scope of 0.1A through 0.1E

Version 0.1A establishes a desktop application boundary and 0.1B–0.1D add CSV, JSON, and `.xlsx` imports. Version 0.1E adds native Parquet schema and preview reading. All sources produce the same typed dataset metadata and bounded preview. These milestones do not include persistence, analytics, database access, visualization libraries, or telemetry.

## Major layers

### Tauri desktop host

Tauri supplies the native Linux window and application lifecycle. The Rust host is deliberately small: it creates the application and exposes no custom commands. Its capability file grants only Tauri core defaults to the single main window; filesystem, shell, network, and plugin permissions are not added preemptively.

Tauri launches the Vite development server during desktop development and loads the built frontend assets for production builds. The frontend is therefore independent of native implementation details until it needs a deliberate, typed native command.

### React frontend

React owns the application shell: sidebar, toolbar, workspace, properties inspector, status bar, keyboard shortcuts, and theme presentation. Components are grouped by UI responsibility instead of being combined in `App.tsx`. TypeScript defines shared concepts such as the active workspace and theme.

The frontend currently uses a small reducer and React context. This provides a central, testable state boundary without adding a state-management framework before there is enough application complexity to justify one.

### Styling

CSS custom properties provide light and dark design tokens. Component-specific CSS files keep layout and visual rules close to the component that uses them, while `src/styles/global.css` holds global resets and token definitions. This approach keeps the initial dependency footprint small and makes a future design-system evolution straightforward.

## Frontend and desktop boundary

The browser-facing code should not assume direct access to the operating system. Native features are introduced through narrowly scoped Tauri commands only when a milestone requires them. Every command should have typed inputs and outputs, validation at the native boundary, and the smallest capability/permission scope that supports its use case.

In 0.1D the boundary exposes `read_xlsx_file(path)` for local workbook bytes. In 0.1E, `read_parquet_preview(path)` uses the Rust Parquet/Arrow reader to return schema, metadata row count, and at most 200 preview rows. CSV and JSON commands continue to read UTF-8 text. Raw contents never leave the local application.

### Data-source abstraction

`DataSource`, `Dataset`, `DatasetColumn`, `DataType`, and `DatasetMetadata` are small typed concepts shared by all importers and the UI. The source kind is currently `csv`, `json`, `excel`, or `parquet`, but the dataset and column contracts do not depend on any one syntax. A dataset stores its source identity, optional worksheet, schema, total row/column counts, optional delimiter metadata, and at most 200 preview rows. Parquet complex fields fall back to safe text representations through Arrow display formatting.

## Future data engine direction

DuckDB is a planned future local data and analytics engine, but it is not part of 0.1E. When introduced, it should sit behind a dedicated data-service boundary rather than be coupled to React components. UI views should consume typed application services and metadata, not direct database handles or SQL construction.

Visualization libraries are similarly deferred until the visualization milestone. The report workspace is currently an empty, stable layout surface intended to host those future components.

## Architectural principles

- Keep native permissions and commands minimal and intentional.
- Keep React components focused, composable, and accessible.
- Preserve a local-first design with no telemetry by default.
- Prefer typed interfaces at every cross-layer boundary.
- Add dependencies only when a current milestone requires them.
- Maintain independent visual language, assets, and implementation.
