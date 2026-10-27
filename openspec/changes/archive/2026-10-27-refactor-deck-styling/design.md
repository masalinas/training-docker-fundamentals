# Design: Refactorización Estética del Deck con pptxgenjs y Paridad Visual con SQL Server

## Context

El primer cambio (`docker-fundamentals-course`) implementó la presentación y guía docente del curso Docker Fundamentals (20 Horas, 81 diapositivas). Sin embargo, el generador inicial se basó en `python-pptx`, produciendo diapositivas con rectángulos planos y sin la sofisticación gráfica del material de referencia ([curso_sql_server_dba_20h.pdf](file:///home/miguel/git/training-sqlserver/curso_sql_server_dba_20h.pdf)).

El repositorio hermano `/home/miguel/git/training-sqlserver` cuenta con un sistema de diseño maduro en Node.js basado en `pptxgenjs`, `react-icons`, `sharp` y `jszip`, que proporciona tarjetas elevadas, badges circulares con iconos rasterizados en alta resolución, cajas de alerta (`callout`) con iconos de advertencia, diagramas arquitectónicos con conectores y divisores oscuros con marcas de agua gigantes. Este diseño adapta y transfiere dicha arquitectura a Docker Fundamentals.

## Goals / Non-Goals

**Goals:**
- Portar el generador de la presentación a Node.js (`pptxgenjs`) manteniendo exactamente las 81 diapositivas y todo el contenido técnico y pedagógico.
- Replicar el sistema visual de componentes de `curso_sql_server_dba_20h.pdf`:
  - Iconos vectoriales en círculos (`react-icons/fa` rasterizados mediante `sharp`).
  - Cajas de alarma/advertencia (`callout` con `kind: 'warn'`, `tip`, `info`).
  - Tarjetas con bordes sutiles y sombra suave (`card`, `cardsRow`, `cardsGrid`, `cardSide`).
  - Flujos secuenciales numerados con flechas horizontales (`steps`).
  - Divisores de módulo oscuros con marca de agua numérica de 120pt y píldora de duración.
  - Bloques de código con fondo oscuro de consola (`codeBlock`).
- Generar diagramas de arquitectura nativos con formas geométricas de `pptxgenjs` para los 5 módulos (Arquitectura Engine/OCI, Aislamiento Kernel namespaces/cgroups, Almacenamiento Overlay2, Redes virtuales y topología Kubernetes).
- Incorporar notas de orador completas y estructuradas (Objetivo, Guion, Interacción, Laboratorio) en cada una de las 81 diapositivas.
- Producir tanto `Docker_Fundamentals_20H.pptx` como `Docker_Fundamentals_20H.pdf`.

**Non-Goals:**
- No se modifica el temario de 5 módulos ni la distribución horaria de 20 horas (4 días x 5 horas).
- No se reescriben los laboratorios prácticos ya definidos en `GUIA_DEL_DOCENTE.md`, solo se garantiza coherencia con las diapositivas.
- No se utilizan capturas de pantalla estáticas ni imágenes de baja resolución; todos los diagramas e iconos se construyen mediante primitivas de PowerPoint y rasterización vectorial a 300 DPI.

## Decisions

### 1. Transición de Motor a Node.js (`pptxgenjs`) y rasterización con `sharp`
- **Decisión**: Utilizar Node.js con `pptxgenjs` y un pipeline de renderizado de iconos con `react-icons/fa` + `sharp`.
- **Razón**: `python-pptx` carece de abstracciones sencillas para badges circulares con iconos incrustados y requiere manipulación directa de XML complejo (`lxml`) para estilos avanzados. Con `pptxgenjs`, los componentes se componen como funciones reutilizables con coordenadas relativas, y los iconos vectoriales SVG de FontAwesome se transforman a PNG de 300 DPI en memoria mediante `sharp`.
- **Alternativa descartada**: Continuar con `python-pptx` y crear un motor de renderizado de SVGs auxiliar en Python (e.g. `cairosvg`). Descartada por mayor complejidad y falta de paridad con la base de código ya probada en SQL Server.

### 2. Paleta Cromática "Docker & Cloud Native"
- **Decisión**: Definir una paleta temática que conserve la elegancia corporativa de la referencia pero adaptada al ecosistema de contenedores:
  - `NAVY` (`#0B2545`): Azul noche profundo para cabeceras y títulos principales.
  - `COBALT` (`#134074`): Azul tecnológico para tarjetas de acento y subtítulos.
  - `CYAN` (`#0DB7ED`): Azul Whale característico de Docker para detalles, píldoras y badges activos.
  - `CORAL` (`#D95D39`): Naranja/coral para avisos de riesgo, trampas en producción y alarmas.
  - `BG` (`#F8F9FA`): Blanco roto / gris ultra claro para diapositivas de contenido (evita deslumbramiento en proyector).
  - `DEEP` (`#081528`): Azul oscuro casi negro para portada, divisores de módulo y cierre.
  - `ICE` (`#E8EEF5`): Azul hielo para tarjetas informativas secundarias.
  - `WARNBG` (`#FDEDE8`): Fondo tenue para cajas de alarma `kind: 'warn'`.
- **Razón**: Máximo contraste y legibilidad en entornos de proyección y pantallas compartidas, alineado con la identidad visual moderna de Docker y CNCF.

### 3. Modularización de la Presentación
- **Decisión**: Estructurar el código en `presentacion/src/`:
  - `layout_helpers.js`: Primitivas de diseño (`pill`, `iconCircle`, `card`, `cardSide`, `cardsRow`, `cardsGrid`, `callout`, `steps`, `stat`, `codeBlock`, `table`, `titleSlide`, `divider`, `closing`).
  - `diagrams.js`: Funciones generadoras de diagramas de arquitectura mediante formas vectoriales de `pptxgenjs`.
  - `m1.js`: Módulo 1 (22 diapositivas: Presentación, Arquitectura, Engine, CLI, Laboratorio 1).
  - `m2_m3.js`: Módulos 2 y 3 (23 diapositivas: Imágenes, Dockerfile, Multistage, Almacenamiento, Laboratorios 2 y 3).
  - `m4.js`: Módulo 4 (18 diapositivas: Redes, DNS, Docker Compose, Microservicios, Laboratorio 4).
  - `m5.js`: Módulo 5 (18 diapositivas: Seguridad, CIS Benchmark, Introducción a Kubernetes, Laboratorio 5 y Cierre).
  - `build.js`: Orquestador principal de generación, limpieza con `jszip` y llamada a exportación PDF.
- **Razón**: Permite mantener el código modular, legible, fácil de probar por módulos individuales y con aislamiento de dependencias.

### 4. Corrección XML y Pipeline de Exportación a PDF
- **Decisión**: Utilizar `jszip` en el paso final de `build.js` para inspeccionar `ppt/slides/slide*.xml` y limpiar duplicidades de `<a:pPr>` antes de guardar el archivo, seguido de invocación a LibreOffice en modo headless (`soffice --headless --convert-to pdf`).
- **Razón**: Evita advertencias de reparación de PowerPoint y garantiza un PDF final idéntico listo para entrega directa al instructor.

## Risks / Trade-offs

- **[Riesgo] Dependencias de Node.js en el entorno**: Si `node_modules` no estuvieran disponibles localmente en el repo de Docker.
  → **Mitigación**: Configurar `package.json` en la raíz y vincular con enlace simbólico o instalar usando las dependencias ya presentes en `/home/miguel/git/training-sqlserver/node_modules`.
- **[Riesgo] Sobrecarga de texto en diapositivas**: Al replicar las explicaciones técnicas, algunas diapositivas podrían saturarse.
  → **Mitigación**: Utilizar componentes de tarjeta con tipografía jerárquica (título de 12pt negrita, cuerpo de 10-11pt) y trasladar el detalle profundo a las notas del orador estructuradas.
- **[Riesgo] Tiempos de rasterización de iconos**: Generar cientos de iconos PNG puede ralentizar el build.
  → **Mitigación**: Implementar un mapa de caché en memoria en `build.js` / `layout_helpers.js` para rasterizar cada combinación única de (icono, color, tamaño) exactamente una sola vez.
