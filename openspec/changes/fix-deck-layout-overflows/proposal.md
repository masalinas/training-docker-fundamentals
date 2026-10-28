# Proposal

## Why

Durante la revisión visual detallada del mazo de diapositivas (`Docker_Fundamentals_20H.pptx` y `Docker_Fundamentals_20H.pdf`), se identificaron desbordamientos y recortes de texto en 8 diapositivas clave (Slides 14, 32, 38, 44, 58, 73, 76 y 81). 
Estos errores de maquetación se deben a dimensiones insuficientes de las cajas contenedoras, anchos de columna desbalanceados en las consolas derechas (5.83" con `wrap: false`) y alturas limitadas en tarjetas secuenciales y de cierre. Corregir estos desbordamientos de inmediato es imprescindible para asegurar la máxima legibilidad y calidad editorial en proyección e impresión del curso.

## What Changes

- **Slide 14 (`steps`)**: Reestructurar la geometría interna del componente de pasos (`steps`) en `presentacion/src/layout_helpers.js` para compactar el título y dar un 53% más de altura vertical al cuerpo del texto (`h` útil pasa de 0.75" a 1.15"+), ajustando la tipografía para que la etapa "Created" y el resto de estados del ciclo de vida no se corten.
- **Slides 32, 38, 44, 58, 73 y 76 (`code` / Consola en columna derecha)**:
  - Rebalancear la distribución de columnas de 50/50 (`5.6"` vs `5.83"`) a ~40/60 (`4.8"` para la tarjeta izquierda y `6.63"` para la caja de consola/código derecha).
  - Enriquecer el helper `code()` para permitir ajuste fino de tamaño de fuente (`size: 10` o `10.5` cuando los snippets lo requieran) y asegurar que comandos largos y manifiestos YAML (como rutas de Artifact Registry, comandos de montajes o sentencias SQL) no se corten contra el margen derecho.
  - Formatear con saltos de línea explícitos (`\`) y comentarios ordenados las líneas que excedían el límite horizontal.
- **Slide 81 (`closing`)**:
  - Ampliar la altura de las 4 tarjetas de resumen diario en `closing()` de `h: 3.5"` a `h: 4.3"`, aprovechando el espacio vertical vacío (1.1") antes del pie de página.
  - Incrementar la altura del bloque de texto descriptivo de `1.35"` a `2.3"` y ajustar la fuente a `12.5pt` para que las 7-8 líneas de resumen de cada día (Días 1, 2, 3 y 4) quepan con holgura.
- **Regeneración de Entregables**:
  - Recompilar `Docker_Fundamentals_20H.pptx` y reexportar `Docker_Fundamentals_20H.pdf` mediante `node presentacion/src/build.js`, verificando que las 8 diapositivas muestren el texto completo sin recortes.

## Capabilities

### New Capabilities
*(Ninguna)*

### Modified Capabilities
- `deck-generator`: Incorpora requerimientos estrictos de control de desbordamiento horizontal y vertical en los componentes de consola de comandos (`code`), secuencias de pasos (`steps`) y resúmenes de cierre (`closing`), garantizando visibilidad íntegra del texto en formato 16:9.

## Impact

- **Código modificado**:
  - `presentacion/src/layout_helpers.js`: Ajustes geométricos en `steps()`, `code()` y `closing()`.
  - `presentacion/src/m1.js`: Refinamiento del layout en Slide 14.
  - `presentacion/src/m2_m3.js`: Rebalanceo de columnas y formateo de comandos en Slides 32, 38 y 44.
  - `presentacion/src/m4.js`: Rebalanceo de columnas y formateo de comandos en Slide 58.
  - `presentacion/src/m5.js`: Rebalanceo de columnas y formateo de comandos en Slides 73 y 76.
- **Artefactos binarios generados**: `Docker_Fundamentals_20H.pptx` y `Docker_Fundamentals_20H.pdf`.
- **Compatibilidad**: 100% compatible con los 5 módulos, 81 diapositivas y las notas de orador existentes.
