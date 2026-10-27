# Proposal: Refactorización Estética del Deck con pptxgenjs y Paridad Visual con SQL Server

## Why

El resultado visual del primer cambio (`docker-fundamentals-course`), implementado en Python (`python-pptx`), presenta un diseño con cajas básicas que no alcanza el nivel de sofisticación, dinamismo e impacto visual de la presentación de referencia [curso_sql_server_dba_20h.pdf](file:///home/miguel/git/training-sqlserver/curso_sql_server_dba_20h.pdf). 

La presentación de SQL Server fue creada mediante la skill `pptx` en Node.js (`pptxgenjs`), incorporando un sistema de diseño con iconos vectoriales en círculos (`react-icons` rasterizados con `sharp`), cajas de alerta/callout con iconos de alarma (`FaExclamationTriangle`), tarjetas con elevación suave, pasos numerados con flechas y divisores de módulo con marcas de agua gigantes. Se requiere refactorizar el generador de Docker a esta misma arquitectura de diseño para lograr una presentación con idéntica calidad estética y profesional.

## What Changes

- **Transición de Motor: De Python `python-pptx` a Node.js `pptxgenjs`**:
  - Creación de `presentacion/src/layout_helpers.js` con el sistema completo de componentes: `pill`, `iconCircle`, `card`, `cardSide`, `cardsRow`, `cardsGrid`, `callout` (`warn`, `tip`, `info`), `steps`, `stat`, `codeBlock`, `titleSlide`, `divider` y `closing`.
  - Integración de `react-icons` (FontAwesome `Fa*`) rasterizados a PNG con `sharp` y precargados en base64 para renderizado vectorial nítido sin dependencias de fuentes externas.
  - Implementación de `presentacion/src/diagrams.js` para los diagramas específicos de Docker (motor OCI, aislamiento de kernel con namespaces/cgroups, Overlay2, redes virtuales y Kubernetes Control Plane vs Workers).
  - Portabilidad de los 5 módulos formativos a módulos JavaScript (`m1.js`, `m2_m3.js`, `m4.js`, `m5.js`) conservando el 100% del contenido técnico y las notas pedagógicas estructuradas.
  - Implementación de `presentacion/src/build.js` que ensamble el mazo, limpie `<a:pPr>` redundantes con `JSZip` y guarde `Docker_Fundamentals_20H.pptx`.
  - Exportación automática a `Docker_Fundamentals_20H.pdf` manteniendo las 81 diapositivas.

## Capabilities

### New Capabilities
*(Ninguna)*

### Modified Capabilities
- `deck-generator`: Modifica el requisito de implementación técnica y estilística para generar la presentación mediante el motor `pptxgenjs` en Node.js, incorporando iconografía descriptiva circular (`react-icons`), cajas de alarma/callout estandarizadas, tarjetas elevadas, pasos secuenciales y divisores de módulo con marca de agua, con paridad de estilo con `curso_sql_server_dba_20h.pdf`.

## Impact

- **Dependencias**: Utiliza Node.js y los paquetes `pptxgenjs`, `react-icons`, `sharp`, `react`, `react-dom` y `jszip` (disponibles en el entorno de desarrollo).
- **Archivos regenerados**:
  - `Docker_Fundamentals_20H.pptx` (recompilado con la nueva estética).
  - `Docker_Fundamentals_20H.pdf` (exportado a partir de la nueva presentación).
  - Directorio `presentacion/src/` con todos los scripts de componentes y módulos.
- **Sin pérdida de contenido**: Se preservan los contenidos de los 5 módulos oficiales, los laboratorios y las notas del orador.
