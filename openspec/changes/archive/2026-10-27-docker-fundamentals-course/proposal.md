# Proposal: Generación de Presentación Técnica y Guía Docente - Curso Docker Fundamentals (20 Horas)

## Why

Para impartir con máxima excelencia un curso técnico de 20 horas lectivas de "Docker Fundamentals" (distribuido en 4 jornadas de 5 horas), el instructor requiere tanto un material audiovisual de alto nivel (slide deck de ~75-85 diapositivas) como un manual de vuelo metodológico exhaustivo (`GUIA_DEL_DOCENTE.md`). 

Actualmente solo se dispone del temario base en PDF (`Dockers Fundamentals.pdf`). Se necesita materializar este temario en una presentación profesional con notas de orador técnicas y completas en cada diapositiva, apoyada por una guía docente que estructure tiempos, laboratorios prácticos y resolución de problemas comunes, garantizando una experiencia de aprendizaje fluida, dinámica y de rigor técnico.

## What Changes

- **Generador programático de diapositivas (`python-pptx`)**:
  - Creación de un paquete de scripts modular en Python para compilar la presentación `Docker_Fundamentals_20H.pptx`.
  - Formato panorámico 16:9 con paleta cromática profesional basada en la identidad oficial de Docker y estándares Cloud Native (Docker Navy `#0B1D3A`, Moby Blue `#0DB7ED`, Dark Slate `#1E293B`, Soft Grey `#F8FAFC`).
  - Cobertura completa de los 5 módulos del temario oficial repartidos en 4 días de clase (~75-85 diapositivas).
  - Inclusión obligatoria de notas del orador completas (`notes_slide`) en cada diapositiva: guion pedagógico a bajo nivel, preguntas de interacción para los alumnos y comandos de demostración en vivo.
  - Esquemas visuales nativos sin clichés de IA (evitando barras decorativas o líneas bajo títulos) para representar la arquitectura del motor (dockerd/containerd/runc), aislamiento del kernel (namespaces/cgroups), capas OCI y Copy-on-Write (overlay2), redes virtuales y topología de Kubernetes.

- **Guía Docente Exhaustiva (`GUIA_DEL_DOCENTE.md`)**:
  - Documento Markdown con el cronograma detallado de 4 días (5 horas/día) con descansos programados.
  - Transcripción y notas didácticas slide a slide para lectura o seguimiento en segunda pantalla.
  - Enunciados completos de los 5 laboratorios prácticos paso a paso con código fuente, comandos exactos de terminal y sección de solución de incidencias frecuentes (*troubleshooting*).

## Capabilities

### New Capabilities
- `deck-generator`: Scripts modulares en Python (`python-pptx`) y biblioteca de estilos/componentes para compilar automáticamente la presentación técnica `Docker_Fundamentals_20H.pptx` (16:9, ~75-85 diapositivas, 5 módulos, notas de orador integradas).
- `teaching-guide`: Guía docente integral `GUIA_DEL_DOCENTE.md` que detalla la metodología, cronograma hora a hora, contenido íntegro de diapositivas, notas del instructor y laboratorios prácticos con troubleshooting.

### Modified Capabilities
*(Ninguna; se trata de una suite formativa creada desde cero en este repositorio)*

## Impact

- **Código y Herramientas**: Requiere Python 3 y la biblioteca `python-pptx` (ya instalada en el entorno).
- **Archivos generados**:
  - `Docker_Fundamentals_20H.pptx` en la raíz del proyecto.
  - `GUIA_DEL_DOCENTE.md` en la raíz del proyecto.
  - Directorio de scripts `generator/` con módulos por cada día/módulo formativo y utilidades de renderizado de shapes y esquemas.
- **Riesgo**: Ninguno en sistemas de producción externos; trabajo confinado a material formativo y scripts de generación local.
