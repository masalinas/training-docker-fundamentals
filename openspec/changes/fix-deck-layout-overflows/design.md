# Design

## Context

El mazo de 81 diapositivas panorámicas (16:9, `13.333"` × `7.5"`) se construye mediante scripts modulares en Node.js apoyados en `pptxgenjs` y `layout_helpers.js`. Tras el refactor inicial, se detectaron recortes de texto en 8 diapositivas debido a tres patrones geométricos deficientes:
1. `steps()` en Slide 14: Asignación insuficiente de altura para el texto del cuerpo (`h: 0.75"`), provocando que la 4ª línea de la etapa "Created" quede cortada.
2. `card()` + `code()` en Slides 32, 38, 44, 58, 73 y 76: División 50/50 que deja a la consola derecha con solo `5.83"` de ancho y `wrap: false`, cortando comandos de >58 caracteres contra el margen derecho.
3. `closing()` en Slide 81: Tarjetas fijas de `3.5"` de altura que dejan 1.1" de espacio muerto antes del footer, con un contenedor de texto de solo `1.35"` a 14pt, cortando 2-3 líneas en los resúmenes de los días 1 a 4.

## Goals / Non-Goals

**Goals:**
- Eliminar el 100% de los desbordamientos y recortes horizontales y verticales en las 8 diapositivas reportadas.
- Mantener la integridad de los 5 módulos, las 81 diapositivas y las notas pedagógicas completas del orador.
- Preservar la estética corporativa Docker/Cloud Native (`#0B2545`, `#134074`, `#0DB7ED`, `#F8F9FA`).
- Producir entregables actualizados y validados: `Docker_Fundamentals_20H.pptx` y `Docker_Fundamentals_20H.pdf`.

**Non-Goals:**
- No se altera la estructura temática ni el orden de las 81 diapositivas.
- No se añade ningún nuevo paquete o dependencia npm externa.
- No se modifica la Guía Docente (`GUIA_DEL_DOCENTE.md` / `GUIA_DEL_DOCENTE.pdf`), ya que su contenido es plenamente coherente con los temarios.

## Decisions

### 1. Reestructuración geométrica interna de `steps()` (Slide 14)
- **Decisión**: En `layout_helpers.js:steps()`, reposicionar el título a `y + 0.8` con altura `0.35"` (en lugar de `0.65"`) e iniciar el cuerpo de texto en `y + 1.2` con altura `h - 1.35 = 1.15"` (en lugar de `0.75"`). Permitir parámetro de tamaño de fuente `size` ajustable (11.5pt o 12pt).
- **Alternativa descartada**: Agrandar la altura total de la fila de pasos a más de 3.2". Descartada porque invadiría la fila inferior de tarjetas de señales SIGTERM / SIGKILL en la Slide 14.

### 2. Rebalanceo asimétrico 40/60 para pares Card + Code (Slides 32, 38, 44, 58, 73 y 76)
- **Decisión**: Ajustar el ancho de la tarjeta izquierda a `w: 4.8"` (los bullet points encajan de manera óptima) y desplazar la consola de código a `x: CX + 5.1`, con ancho `w: CW - 5.1 = 6.63"`. Esto proporciona casi 1 pulgada adicional de ancho horizontal útil (~12 caracteres más por línea).
- **Decisión complementaria**: En `code()`, permitir tamaño de fuente adaptativo `size: 10` o `10.5` en snippets complejos, y formatear comandos largos con saltos de línea ordenados (`\`) y comentarios encima del comando en lugar de al final de la línea.
- **Alternativa descartada**: Forzar `wrap: true` indiscriminadamente en todo el bloque de código. Descartada porque en código bash o YAML los quiebres de línea automáticos sin indentación pueden dificultar la lectura y comprensión técnica para los alumnos.

### 3. Expansión vertical y tipografía adaptativa en `closing()` (Slide 81)
- **Decisión**: Expandir la altura de las 4 tarjetas de `h: 3.5"` a `h: 4.3"`, ubicándolas en `y: 2.2` y finalizando en `y: 6.5` (justo antes del pie de página en `y: 6.9`).
- **Decisión de contenido**: Disminuir el padding lateral a `0.18"` (ancho útil de texto `2.34"`), ajustar la tipografía del resumen a `12.5pt` y ampliar el contenedor de texto de `h: 1.35"` a `h: 2.4"`.
- **Alternativa descartada**: Resumir o recortar el texto pedagógico de los Días 1 a 4. Descartada porque el detalle conceptual de los 4 días es valioso y con el espacio vertical disponible cabe holgadamente.

## Risks / Trade-offs

- **[Riesgo]** El cambio en el ancho de la columna izquierda (4.8") en Slides 32, 38, etc. podría comprimir los bullet points.
  → **Mitigación**: Los bullet points de estas 6 diapositivas tienen entre 2 y 4 líneas cortas con textos directos; se verificará que ninguna viñeta se desborde verticalmente.
- **[Riesgo]** Posible desalineación visual si otras diapositivas mantienen anchos antiguos.
  → **Mitigación**: El rebalanceo se aplica de forma coherente en todas las diapositivas de tipología *Laboratorio / Manifiesto YAML* que requieran consola ancha.
