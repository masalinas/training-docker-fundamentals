# teaching-guide Specification

## Purpose
Defines the structure and comprehensive technical content of the instructor guide document (GUIA_DEL_DOCENTE.md) for delivering the 20-hour Docker Fundamentals course.

## Requirements

### Requirement: Documento de guía docente complementario en Markdown
The project SHALL provide a standalone Markdown document named `GUIA_DEL_DOCENTE.md` located in the repository root, serving as a comprehensive flight manual for the instructor during class delivery.

#### Scenario: Existencia del manual docente
- **WHEN** the documentation generation or build process finishes
- **THEN** `GUIA_DEL_DOCENTE.md` SHALL exist in the repository root and be fully formatted in GitHub-Flavored Markdown.

### Requirement: Planificación temporal y cronograma día a día
The teaching guide SHALL organize the 20 course hours into 4 distinct days of 5 hours each, indicating time allocations for theory blocks, breaks, and hands-on exercises.

#### Scenario: Cronograma pedagógico de 4 días
- **WHEN** an instructor reviews the course schedule in `GUIA_DEL_DOCENTE.md`
- **THEN** the guide SHALL present an hour-by-hour agenda for Day 1 (Module 1), Day 2 (Modules 2 & 3), Day 3 (Module 4), and Day 4 (Module 5), detailing theory duration, break intervals, and lab allocations.

### Requirement: Guion slide a slide con notas y preguntas de aula
The teaching guide SHALL transcribe each slide title and provide the verbatim speaker notes, deep-dive technical explanations, and audience engagement questions corresponding to `Docker_Fundamentals_20H.pptx`.

#### Scenario: Seguimiento en segunda pantalla
- **WHEN** an instructor uses `GUIA_DEL_DOCENTE.md` during live presentation delivery
- **THEN** every slide in the presentation SHALL have a corresponding section in the guide with exact slide title, summary bullets, deep-dive explanations, and classroom interaction prompts.

### Requirement: Laboratorios prácticos completos con guía de troubleshooting
The teaching guide SHALL specify at least 5 hands-on labs with complete source files, execution commands, and a troubleshooting section detailing common student errors and solutions.

#### Scenario: Ejecución guiada de laboratorios
- **WHEN** students execute any of the 5 course labs (Lab 1: Docker CLI y Dockerfile; Lab 2: Custom Bridge Networks; Lab 3: Volumes y Bind Mounts; Lab 4: Cloud Registry y CaaS; Lab 5: Kubernetes Pods y Deployments)
- **THEN** the guide SHALL provide step-by-step verification commands, expected terminal outputs, and resolution steps for frequent issues (e.g. port collision, permission denied, DNS misconfiguration).
