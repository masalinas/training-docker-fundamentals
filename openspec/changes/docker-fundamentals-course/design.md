# Design: Arquitectura del Generador de Diapositivas y Guía Docente

## Context

Para impartir el curso de 20 horas de Docker Fundamentals en 4 sesiones de 5 horas, se requiere un conjunto de diapositivas (~75-85 slides) y una guía técnica de apoyo exhaustiva. El repositorio cuenta con Python 3 y `python-pptx` (versión 1.0.2) ya disponible. La generación debe ser automatizada y modular para permitir ajustes pedagógicos ágiles, garantizar un renderizado impecable en 16:9 y asegurar que cada diapositiva incorpore notas del orador enriquecidas con comandos y preguntas didácticas.

## Goals / Non-Goals

**Goals:**
- Producir un generador modular en Python que ensamble `Docker_Fundamentals_20H.pptx` mediante módulos independientes (`module1.py`, `module2_3.py`, `module4.py`, `module5.py`) gestionados por `generate_deck.py`.
- Implementar una biblioteca de componentes visuales (`theme.py` y `diagrams.py`) que construya tarjetas, tablas de parámetros, bloques de código en terminal simulada y diagramas de arquitectura usando formas nativas de PowerPoint.
- Garantizar que el 100% de las diapositivas de contenido tengan notas del orador estructuradas en: *Explicación técnica (bajo el capó)*, *Pregunta interactiva para el aula* y *Demostración / Comandos en vivo*.
- Redactar un manual docente integral (`GUIA_DEL_DOCENTE.md`) en Markdown con cronograma detallado de 4 días (5 horas/día), transcripción slide a slide y guía de los 5 laboratorios prácticos con soluciones y resolución de incidencias.

**Non-Goals:**
- No se creará una interfaz gráfica web para visualizar diapositivas; la salida es un archivo `.pptx` estándar de Office y un archivo Markdown.
- No se desplegarán recursos reales de pago en nubes públicas (AWS, Azure, GCP); los laboratorios de cloud se basan en simulación, emulación local o cuentas de capa gratuita gestionadas individualmente por los alumnos.

## Decisions

### Decisión 1: Arquitectura modular del generador en Python (`python-pptx`)
- **Elección**: Crear un paquete en `generator/` con scripts separados por día/módulo:
  - `generator/theme.py`: Definición de paleta cromática corporativa, tipografías, constantes de layout 16:9 (`13.333" x 7.5"`), creación de slides con cabeceras consistentes y formateo de notas.
  - `generator/diagrams.py`: Primitivas reutilizables para dibujar esquemas nativos (capas de imagen, namespaces del kernel, topología de red bridge/veth, arquitectura de Kubernetes).
  - `generator/module1.py`: Día 1 (~22 slides) - Intro, Arquitectura de motor, Seguridad del kernel, Imágenes, Dockerfile y Microservicios.
  - `generator/module2_3.py`: Día 2 (~24 slides) - Módulo 2 (Redes) y Módulo 3 (Almacenamiento y Volúmenes).
  - `generator/module4.py`: Día 3 (~18 slides) - Módulo 4 (Contenedores en Azure, AWS, GCP y evolución de Docker Cloud).
  - `generator/module5.py`: Día 4 (~18 slides) - Módulo 5 (Orquestación, Swarm vs K8s vs Nomad, Arquitectura K8s y Primitivas).
  - `generate_deck.py`: Script principal que orquesta la compilación y guarda el archivo en la raíz.
- **Alternativas consideradas**:
  - *Un único script monolítico de Python*: Descartado por ser difícil de mantener (~3000 líneas de código).
  - *Generación mediante `pptxgenjs` (Node)*: Descartado porque requiere instalar dependencias adicionales en npm, mientras que `python-pptx` ya está probado y disponible en el entorno local.

### Decisión 2: Paleta cromática corporativa y diseño sin clichés visuales
- **Elección**:
  - Colores primarios: Docker Deep Navy (`#0B1D3A`) y Moby Cyan/Blue (`#0DB7ED`).
  - Colores neutros: Slate oscuro (`#1E293B`) para texto principal y Gris suave (`#F8FAFC`) para tarjetas de contenido.
  - Fondo de diapositivas de contenido: Blanco (`#FFFFFF`) con tarjetas con fondo gris tenue (`#F1F5F9`) y bordes suaves (`#CBD5E1`).
  - Diapositivas de portada, separadores de módulo y cierre: Fondo azul oscuro (`#0B1D3A`) con tipografía blanca y acentos cian (estructura "sandwich").
  - Ausencia total de líneas decorativas bajo títulos o barras de acento laterales (antipatrones comunes de diapositivas generadas por IA).
- **Alternativas consideradas**:
  - *Fondos oscuros en todas las diapositivas*: Descartado porque dificulta la lectura prolongada en proyectores de aula durante 5 horas consecutivas.

### Decisión 3: Formato y estructura de notas del orador
- **Elección**: Inyectar notas en cada slide mediante `slide.notes_slide.notes_text_frame` con la siguiente plantilla estandarizada:
  ```text
  [OBJETIVO DE LA SLIDE]
  Resumen pedagógico del concepto clave.

  [BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
  Detalle profundo de kernel, llamadas al sistema o comportamiento interno.

  [DINÁMICA DE AULA / PREGUNTA DISPARADORA]
  Pregunta para sondear y despertar la participación de los alumnos.

  [DEMO EN VIVO / TERMINAL]
  Comandos exactos que el docente debe teclear en directo para ilustrar la diapositiva.
  ```

### Decisión 4: Estructura de la Guía Docente (`GUIA_DEL_DOCENTE.md`)
- **Elección**: Crear un documento Markdown estructurado en:
  1. Información general y prerrequisitos del curso.
  2. Cronograma maestro de 4 días × 5 horas (con bloques teóricos, tiempos de café y tiempos de laboratorio).
  3. Contenido íntegro diapositiva a diapositiva (título, contenido visible y notas del orador desarrolladas).
  4. Guía detallada de los 5 laboratorios prácticos:
     - Lab 1: Ciclo de vida de contenedores y construcción de app web con Dockerfile.
     - Lab 2: Redes personalizadas y descubrimiento de servicios por DNS integrado.
     - Lab 3: Persistencia con Named Volumes y entorno de desarrollo con Bind Mounts.
     - Lab 4: Empaquetado, etiquetado y despliegue en Container Registry / servicio CaaS.
     - Lab 5: Manifiestos de Kubernetes (Pod, Deployment, Service) y despliegue en clúster local.
  5. Matriz de solución de errores típicos de alumnos en cada laboratorio.

## Risks / Trade-offs

- **[Riesgo: Desbordamiento de texto en slides densas]** → *Mitigación*: Diseñar layouts con límites estrictos de caracteres por bloque (máximo 3-4 viñetas por tarjeta, fuente de cuerpo 14-16pt) y mover el exceso de detalle técnico a las notas del orador y a la guía docente.
- **[Riesgo: Obsolescencia de "Docker Cloud" en el temario oficial]** → *Mitigación*: Abordar "Docker Cloud" contextualizándolo históricamente (servicio descontinuado en mayo de 2018) y explicando la transición natural de la industria hacia Docker Hub, Docker Desktop y soluciones CaaS serverless modernas (Cloud Run, ACI, Fargate).
- **[Riesgo: Complejidad de Kubernetes en un curso introductorio (Día 4)]** → *Mitigación*: Mantener el Módulo 5 centrado en la arquitectura conceptual, el por qué de la orquestación y las primitivas fundamentales (Pod, Deployment, Service) evitando entrar en CRDs complejas o políticas de red avanzadas.

## Migration Plan

No aplica migración ya que es un proyecto de nueva creación en este repositorio. Los artefactos (`Docker_Fundamentals_20H.pptx` y `GUIA_DEL_DOCENTE.md`) se generarán directamente en la raíz mediante los scripts de `generator/`.
