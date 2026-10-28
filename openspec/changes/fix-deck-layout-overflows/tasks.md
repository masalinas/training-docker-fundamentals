# Tasks

## 1. Ajustes Geométricos en Helpers de Maquetación

- [x] 1.1 Reestructurar la geometría de `steps()` en `presentacion/src/layout_helpers.js` para compactar el título (`y + 0.8`, `h: 0.35`) e incrementar la altura del cuerpo de texto a `h - 1.35 = 1.15"`, verificando que admita fuentes adaptativas (11.5pt a 12pt).
- [x] 1.2 Enriquecer `code()` en `presentacion/src/layout_helpers.js` para admitir anchos asimétricos configurables, márgenes útiles optimizados y tamaños de fuente adaptables (10pt a 11pt) sin recortes de borde.
- [x] 1.3 Refactorizar `closing()` en `presentacion/src/layout_helpers.js` expandiendo las 4 tarjetas de días a `h: 4.3"` (de `y: 2.2` a `y: 6.5`), padding `0.18"`, altura de texto `2.4"` y tipografía `12.5pt`.

## 2. Rebalanceo y Formateo en Módulos de Diapositivas

- [x] 2.1 Ajustar la Slide 14 en `presentacion/src/m1.js` con la nueva geometría de `steps()`, verificando que la descripción de la etapa "Created" y los demás estados no se corten.
- [x] 2.2 Rebalancear las columnas a 4.8" / 6.63" y formatear líneas de comandos y consultas SQL en Slides 32 (Lab 2), 38 (Bind Mounts) y 44 (Lab 3) en `presentacion/src/m2_m3.js`.
- [x] 2.3 Rebalancear las columnas a 4.8" / 6.63" y formatear tags regionales de Google Artifact Registry en la Slide 58 en `presentacion/src/m4.js`.
- [x] 2.4 Rebalancear las columnas a 4.8" / 6.63" y formatear comentarios y manifiestos YAML en Slides 73 (Reconciliador K8s) y 76 (Services K8s) en `presentacion/src/m5.js`, y verificar que Slide 81 consuma la nueva geometría de `closing()`.

## 3. Compilación, Exportación y Verificación Visual

- [x] 3.1 Ejecutar `node presentacion/src/build.js` y verificar la compilación exitosa de `Docker_Fundamentals_20H.pptx` (81 slides) y exportación a `Docker_Fundamentals_20H.pdf` sin errores.
- [x] 3.2 Validar la ausencia de desbordamientos y recortes en las 8 diapositivas clave (Slides 14, 32, 38, 44, 58, 73, 76 y 81).
