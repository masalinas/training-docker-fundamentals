# Spec Delta

## MODIFIED Requirements

### Requirement: Paleta cromática corporativa y diseño sin clichés
The presentation styling SHALL adopt the visual design system of `curso_sql_server_dba_20h.pdf`, incorporating circular icon badges (`react-icons/fa` via `sharp`), alarm and warning callouts (`kind: 'warn'` with `FaExclamationTriangle`, `kind: 'tip'`, `kind: 'info'`), soft-shadowed cards (`card`, `cardsRow`, `cardsGrid`), numbered step sequences with directional arrows, and module dividers with giant watermark numbers. Furthermore, all slide components (`steps`, `code`, `closing`, `card`) SHALL strictly enforce spatial boundaries and typography sizing so that neither horizontal commands nor multi-line card bodies suffer text truncation or clipping.

#### Scenario: Contraste y legibilidad para proyector
- **WHEN** content slides are rendered
- **THEN** slides SHALL feature circular icon badges next to headers or inside cards, warning alarm boxes for anti-patterns and critical pitfalls, and clean high-contrast cards over soft background (`#F8F9FA`).

#### Scenario: Divisores de módulo con marca de agua
- **WHEN** a module divider slide is rendered
- **THEN** the slide SHALL feature a dark deep background (`#081528`), a giant watermark number (120pt), module duration pill, title, and topic list with circular icons.

#### Scenario: Ausencia de recortes y control de desbordamiento
- **WHEN** slides containing step sequences (`steps`), right-column code consoles (`code`), or closing cards (`closing`) are compiled to PPTX and PDF
- **THEN** all text content (including terminal commands, YAML manifests, stage descriptions like "Created" and daily recap cards in Slide 81) SHALL render completely inside their respective bounding boxes without text truncation or clipping at the boundaries.
