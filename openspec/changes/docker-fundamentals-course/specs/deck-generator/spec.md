# Spec Delta

## Purpose

Provides an automated, modular Python generator to compile the 20-hour Docker Fundamentals technical slide deck (75-85 widescreen slides) with professional styling and embedded speaker notes.

## ADDED Requirements

### Requirement: Generación de presentación panorámica 16:9 estructurada
The slide deck generator SHALL produce a presentation file in Microsoft PowerPoint format (`.pptx`) using 16:9 widescreen layout (`13.333` inches width by `7.5` inches height or equivalent 16:9 ratio).

#### Scenario: Compilación exitosa del archivo de presentación
- **WHEN** the generation script `generate_deck.py` is executed
- **THEN** a valid presentation file named `Docker_Fundamentals_20H.pptx` is created in the repository root without errors.

#### Scenario: Relación de aspecto panorámica 16:9
- **WHEN** the generated `.pptx` file is inspected
- **THEN** the slide dimensions SHALL match the 16:9 widescreen format and avoid the legacy 4:3 aspect ratio.

### Requirement: Cobertura temática completa de los 5 módulos formativos
The slide deck SHALL contain between 70 and 85 slides distributed across the official 5 modules of the course and 4 instructional days.

#### Scenario: Validación de volumen y distribución de diapositivas
- **WHEN** the presentation slides are counted and categorized
- **THEN** the total slide count SHALL be between 70 and 85 slides, covering Module 1 (Intro, Architecture, Dockerfile, Security), Module 2 (Networks), Module 3 (Volumes and Storage), Module 4 (Cloud Containers: Azure, AWS, GCP, Docker Cloud evolution), and Module 5 (Orchestration and Kubernetes).

### Requirement: Paleta cromática corporativa y diseño sin clichés
The presentation styling SHALL use a high-contrast corporate palette based on Docker brand guidelines (Navy `#0B1D3A`, Moby Blue `#0DB7ED`, Slate `#1E293B`, Soft Grey `#F8FAFC`, Coral Alert `#EF4444`) with dark title/closing slides and light content slides. The generator SHALL NOT generate decorative accent lines directly under titles or single-side decorative borders.

#### Scenario: Contraste y legibilidad para proyector
- **WHEN** a content slide is rendered
- **THEN** the background SHALL be light (`#FFFFFF` or `#F8FAFC`) with dark high-contrast typography (`#1E293B` or `#0F172A`) and no decorative AI-style accent bars under headers.

### Requirement: Notas del orador exhaustivas en cada diapositiva
Every content slide generated in the deck SHALL include speaker notes (`notes_slide`) containing technical low-level explanations, interactive class questions, and live terminal demonstration commands.

#### Scenario: Presencia de notas pedagógicas y técnicas
- **WHEN** any slide in `Docker_Fundamentals_20H.pptx` is inspected for speaker notes
- **THEN** the slide SHALL contain non-empty speaker notes structured into: Explicación técnica (bajo el capó), Pregunta interactiva para el aula, y Demostración / Comandos en vivo.
