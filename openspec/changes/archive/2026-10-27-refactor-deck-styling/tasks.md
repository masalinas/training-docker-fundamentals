# Tasks

## 1. Configuración de Entorno y Sistema de Componentes

- [x] 1.1 Configurar `package.json` y dependencias de Node.js en el repositorio vinculando o instalando `pptxgenjs`, `react-icons`, `sharp`, `react`, `react-dom` y `jszip`, verificando ejecución de un script de prueba con `node -e`.
- [x] 1.2 Implementar `presentacion/src/layout_helpers.js` con la paleta de color Docker (`NAVY`, `COBALT`, `CYAN`, `CORAL`, `BG`, `DEEP`, `ICE`, `WARNBG`), generación y caché de badges de iconos vectoriales con `sharp`, tarjetas (`card`, `cardsRow`, `cardsGrid`, `cardSide`), cajas de alarma (`callout` con `kind: 'warn'`, `tip`, `info`), flujos secuenciales (`steps`), bloques de código (`codeBlock`) y plantillas (`titleSlide`, `divider`, `closing`).
- [x] 1.3 Implementar `presentacion/src/diagrams.js` con las funciones de diagramas arquitectónicos nativos de Docker: motor OCI y containerd, aislamiento del kernel (namespaces y cgroups), capas de almacenamiento Overlay2, red virtual bridge/veth/NAT y arquitectura de clúster Kubernetes.

## 2. Implementación Modular de Diapositivas

- [x] 2.1 Implementar `presentacion/src/m1.js` con las 22 diapositivas del Módulo 1 (portada, estructura del curso, evolución tecnológica, arquitectura Docker, ciclo de vida del contenedor, tabla CLI con flags, alarmas y Laboratorio 1) con notas estructuradas completas.
- [x] 2.2 Implementar `presentacion/src/m2_m3.js` con las 23 diapositivas de los Módulos 2 y 3 (anatomía de imágenes OCI, Dockerfile, caché y buenas prácticas, multi-stage build, arquitectura de almacenamiento Overlay2, volúmenes vs bind mounts, y Laboratorios 2 y 3) con notas estructuradas completas.
- [x] 2.3 Implementar `presentacion/src/m4.js` con las 18 diapositivas del Módulo 4 (redes Bridge, Host y Overlay, resolución DNS integrada, mapeo de puertos con iptables, especificación Docker Compose, orquestación multicontenedor y Laboratorio 4) con notas estructuradas completas.
- [x] 2.4 Implementar `presentacion/src/m5.js` con las 18 diapositivas del Módulo 5 (superficie de ataque, usuario rootless, CIS Docker Benchmark, capacidades Linux, orquestación a escala con Kubernetes y Swarm, Laboratorio 5, resumen y cierre del curso) con notas estructuradas completas.

## 3. Ensamblado, Generación y Exportación PDF

- [x] 3.1 Implementar `presentacion/src/build.js` que ensamble todos los módulos, aplique post-procesamiento con `jszip` para limpiar duplicidades XML `<a:pPr>`, genere `Docker_Fundamentals_20H.pptx` y ejecute la exportación a `Docker_Fundamentals_20H.pdf`.
- [x] 3.2 Ejecutar la compilación del mazo (`node presentacion/src/build.js`) y verificar que genera `Docker_Fundamentals_20H.pptx` con 81 diapositivas en formato 16:9 sin advertencias de corrupción.
- [x] 3.3 Exportar y validar `Docker_Fundamentals_20H.pdf`, comprobando la fidelidad visual, presencia de alarmas, badges circulares, tarjetas elevadas y paridad estilística con `curso_sql_server_dba_20h.pdf`.
- [x] 3.4 Verificar la coherencia integral entre las diapositivas y `GUIA_DEL_DOCENTE.md`, comprobando la cobertura de los 5 laboratorios y las notas del instructor.
