# TuxBI roadmap

TuxBI is an independent Linux-native Business Intelligence desktop application. This roadmap describes product direction, not a commitment to a specific delivery date. Features are introduced only when their supporting architecture is ready.

## Current milestone: 0.1B — CSV Import

0.1A — Foundation is complete. The current milestone adds local CSV selection, parsing, validation, type inference, dataset metadata, and bounded preview without visualization or transformation.

## 0.1 — Local data foundation

| Version  | Milestone                       | Focus                                                                            |
| -------- | ------------------------------- | -------------------------------------------------------------------------------- |
| **0.1A** | **Foundation (completed)**      | Desktop shell, component architecture, basic state, themes, tests, documentation |
| **0.1B** | **CSV Import (current)**        | Select and load local CSV files                                                  |
| 0.1C     | JSON Import                     | Select and load local JSON files                                                 |
| 0.1D     | Excel Import                    | Read supported spreadsheet formats                                               |
| 0.1E     | Parquet Import                  | Read local Parquet files                                                         |
| 0.1F     | Metadata and Statistics         | Schema, column metadata, and basic statistics                                    |
| 0.1G     | Data Preview                    | Inspect imported data safely and efficiently                                     |
| 0.1H     | `.tuxbi` Project Save/Load      | Local project persistence and restoration                                        |
| 0.1I     | Testing, Performance and Polish | Reliability, responsiveness, and UX refinement                                   |

## Core BI workflow

| Version | Milestone                         | Focus                                        |
| ------- | --------------------------------- | -------------------------------------------- |
| 0.2     | Visualization                     | Foundational visual components               |
| 0.3     | Report Canvas                     | Compose visuals into report pages            |
| 0.4     | Filters and Slicers               | Interactive report filtering                 |
| 0.5     | Data Transformation / TuxBI Query | Local transformation workflow                |
| 0.6     | Database Connectivity             | Connect to supported data sources            |
| 0.7     | Data Modeling                     | Relationships and semantic model foundations |
| 0.8     | Measures and Calculation Engine   | Reusable calculations and measures           |
| 0.9     | Advanced Visualizations           | Expanded visual analysis capabilities        |
| 1.0     | Core BI Release                   | A cohesive local-first BI workflow           |

## Later directions

| Version | Milestone                  | Focus                                         |
| ------- | -------------------------- | --------------------------------------------- |
| 1.1     | Advanced Analytics         | Deeper local analysis capabilities            |
| 1.2     | AI Dashboard Generation    | Assisted dashboard construction               |
| 1.3     | Natural Language Analytics | Conversational data exploration               |
| 1.4     | Local AI                   | Private, local AI-assisted workflows          |
| 1.5     | Advanced BI Semantics      | Richer semantic and governance features       |
| 1.6     | Enterprise Data Sources    | Expanded professional connectivity            |
| 1.7     | Collaboration and Server   | Team and server capabilities                  |
| 2.0     | TuxBI Platform             | Broader extensibility and platform foundation |

## Guardrails

- TuxBI will use independent code, visuals, branding, and assets.
- DuckDB is a planned future local engine, not a 0.1A dependency.
- Visualization libraries are deferred until the visualization milestone.
- Native permissions and external connectivity are added only when a present milestone needs them.
