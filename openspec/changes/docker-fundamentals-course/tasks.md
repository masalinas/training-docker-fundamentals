# Tasks

## 1. Infraestructura Base del Generador

- [ ] 1.1 Crear el módulo `generator/theme.py` con constantes de color Docker (Navy, Moby Blue, Slate, Soft Grey), tipografías seguras, dimensiones 16:9 (`13.333" x 7.5"`) y funciones para añadir slides con tarjetas y notas del orador estructuradas. Verificar ejecutando una prueba unitaria de creación de slide.
- [ ] 1.2 Implementar en `generator/diagrams.py` funciones para generar componentes visuales nativos (arquitectura de capas OCI, cajas de aislamiento de kernel namespaces/cgroups, flujo de red virtual veth/bridge y arquitectura K8s). Verificar generando un slide de prueba con diagrama de cajas.

## 2. Desarrollo de Módulos de Contenido del Deck (~75-85 Slides)

- [ ] 2.1 Desarrollar `generator/module1.py` para el Día 1 (~22 slides): Virtualización vs Contenedores, arquitectura del motor (dockerd, containerd, runc), seguridad en el kernel (namespaces, cgroups, rootless), ciclo de vida de imágenes/contenedores, Dockerfile y microservicios, incluyendo notas completas en cada slide. Verificar generando los slides del módulo 1.
- [ ] 2.2 Desarrollar `generator/module2_3.py` para el Día 2 (~24 slides): Módulo 2 de Redes (bridge default vs custom con DNS, host, overlay, macvlan, none, mapeo de puertos) y Módulo 3 de Almacenamiento (Overlay2 CoW, persistencia, Bind Mounts, Named Volumes, Data Volume Containers), con notas completas en cada slide. Verificar generando los slides de redes y almacenamiento.
- [ ] 2.3 Desarrollar `generator/module4.py` para el Día 3 (~18 slides): Contenedores en Cloud (Azure ACI/ACA/ACR, AWS ECS/Fargate/ECR, Google Cloud Run/Artifact Registry) y contextualización histórica de Docker Cloud hacia Docker Hub y Docker Desktop, con notas completas en cada slide. Verificar generando los slides de cloud.
- [ ] 2.4 Desarrollar `generator/module5.py` para el Día 4 (~18 slides): Introducción a la orquestación, comparativa (Swarm vs K8s vs Nomad), arquitectura de Kubernetes (Control Plane y Worker Nodes), objetos básicos (Pods, ReplicaSets, Deployments, Services) y diapositivas de resumen y cierre. Verificar generando los slides de Kubernetes y cierre.

## 3. Ensamblaje y Compilación del Slide Deck

- [ ] 3.1 Implementar el script orquestador `generate_deck.py` que importe y encadene la construcción de los 5 módulos en orden cronológico e inserte números de diapositiva. Verificar ejecutando el script y comprobando la generación de `Docker_Fundamentals_20H.pptx`.
- [ ] 3.2 Verificar que `Docker_Fundamentals_20H.pptx` cumpla con los requisitos especificados (entre 70 y 85 diapositivas, formato panorámico 16:9, notas del orador no vacías en cada diapositiva de contenido y sin errores de corrupción).

## 4. Redacción de la Guía Docente (`GUIA_DEL_DOCENTE.md`)

- [ ] 4.1 Redactar la introducción metodológica, requisitos de aula y el cronograma maestro estructurado en 4 días de 5 horas con bloques teóricos, tiempos de café y tiempos de laboratorio en `GUIA_DEL_DOCENTE.md`. Verificar completitud del cronograma.
- [ ] 4.2 Redactar el guion didáctico slide a slide para los 5 módulos en `GUIA_DEL_DOCENTE.md`, incluyendo transcripción de contenidos, explicaciones bajo el capó y preguntas interactivas para el aula.
- [ ] 4.3 Desarrollar la sección completa de laboratorios prácticos (Lab 1: Docker CLI y Dockerfile; Lab 2: Redes personalizadas y DNS; Lab 3: Volúmenes y persistencia; Lab 4: Registries Cloud y CaaS; Lab 5: Manifiestos de Kubernetes en clúster local) con enunciados, código fuente de ejemplo, comandos de terminal y guía de resolución de errores comunes (*troubleshooting*).

## 5. Control de Calidad Final y Validación

- [ ] 5.1 Ejecutar validación de coherencia entre los contenidos de las diapositivas (`Docker_Fundamentals_20H.pptx`) y la guía didáctica (`GUIA_DEL_DOCENTE.md`).
- [ ] 5.2 Ejecutar `openspec validate` sobre el cambio para garantizar la conformidad de todas las especificaciones y artefactos de planificación.
