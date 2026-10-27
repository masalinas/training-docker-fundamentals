# Spec Delta

## MODIFIED Requirements

### Requirement: Generación de presentación panorámica 16:9 estructurada
The slide deck generator SHALL produce a presentation file in Microsoft PowerPoint format (`.pptx`) using 16:9 widescreen layout (`13.333` inches width by `7.5` inches height) generated via Node.js and `pptxgenjs` with modular JavaScript components in `presentacion/src/`.

#### Scenario: Compilación exitosa del archivo de presentación
- **WHEN** the generation script `node presentacion/src/build.js` is executed
- **THEN** a valid presentation file named `Docker_Fundamentals_20H.pptx` is created in the repository root without errors.

#### Scenario: Relación de aspecto panorámica 16:9
- **WHEN** the generated `.pptx` file is inspected
- **THEN** the slide dimensions SHALL match the 16:9 widescreen format (13.333" x 7.5").

### Requirement: Paleta cromática corporativa y diseño sin clichés
The presentation styling SHALL adopt the visual design system of `curso_sql_server_dba_20h.pdf`, incorporating circular icon badges (`react-icons/fa` via `sharp`), alarm and warning callouts (`kind: 'warn'` with `FaExclamationTriangle`, `kind: 'tip'`, `kind: 'info'`), soft-shadowed cards (`card`, `cardsRow`, `cardsGrid`), numbered step sequences with directional arrows, and module dividers with giant watermark numbers.

#### Scenario: Contraste y legibilidad para proyector
- **WHEN** content slides are rendered
- **THEN** slides SHALL feature circular icon badges next to headers or inside cards, warning alarm boxes for anti-patterns and critical pitfalls, and clean high-contrast cards over soft background (`#F8F9FA`).

#### Scenario: Divisores de módulo con marca de agua
- **WHEN** a module divider slide is rendered
- **THEN** the slide SHALL feature a dark deep background (`#081528`), a giant watermark number (120pt), module duration pill, title, and topic list with circular icons.
