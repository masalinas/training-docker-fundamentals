# Curso: Docker Fundamentals (20 Horas Lectivas)

Material técnico y pedagógico completo para impartir el curso oficial de **Docker Fundamentals** (20 horas lectivas estructuradas en 4 jornadas de 5 horas).

## Contenido del Repositorio

- **Presentación Técnica (`Docker_Fundamentals_20H.pptx` y `Docker_Fundamentals_20H.pdf`)**:
  - 81 diapositivas en formato panorámico 16:9 con diseño corporativo Docker/Cloud Native.
  - Disponible tanto en archivo editable PowerPoint (`.pptx`) como exportado a documento vectorial listo para proyección/impresión (`.pdf`).
  - Notas del orador exhaustivas en cada diapositiva con explicaciones técnicas a bajo nivel, preguntas de interacción para dinamizar la clase y comandos de terminal en directo.
  - Esquemas y diagramas arquitectónicos nativos (motor OCI, aislamiento de kernel con namespaces/cgroups, redes virtuales y topología de Kubernetes).
- **Guía Docente (`GUIA_DEL_DOCENTE.md`)**:
  - Manual de vuelo del instructor con más de 1.200 líneas.
  - Ficha técnica, prerrequisitos y preparación del entorno de aula.
  - Cronograma oficial de 4 días × 5 horas (desglose horario, pausas café y bloques de laboratorio).
  - Guion didáctico slide a slide (del 1 al 81) con el contenido y notas íntegras.
  - 5 Laboratorios prácticos completos con código fuente, pasos de ejecución y matriz de *troubleshooting* con soluciones a errores frecuentes.
  - Glosario técnico de términos Cloud Native.

## Estructura del Curso (4 Días × 5 Horas)

1. **Día 1**: Módulo 1 • Introducción a Docker, Arquitectura del Motor (`dockerd`, `containerd`, `runc`), Seguridad del Kernel (Namespaces/Cgroups), Imágenes OCI, Dockerfile y Microservicios.
2. **Día 2**: Módulo 2 • Redes en Docker (`bridge`, `host`, `overlay`, `macvlan`, `none`, DNS embebido y puertos) + Módulo 3 • Persistencia y Volúmenes (`Overlay2` CoW, `Named Volumes`, `Bind Mounts` y `Tmpfs`).
3. **Día 3**: Módulo 4 • Contenedores en Cloud (Azure ACI/ACA/ACR, AWS ECS/Fargate/ECR, Google Cloud Run/Artifact Registry) y evolución histórica de Docker Cloud a Docker Hub/Desktop.
4. **Día 4**: Módulo 5 • Orquestación y Kubernetes (Comparativa Swarm vs K8s vs Nomad, arquitectura de Control Plane y Workers, Pods, Deployments, Services y Taller Final Integrador).

## Recompilación de Materiales

El proyecto incluye el generador programático en Python (`python-pptx`):

```bash
# Recompilar la presentación PPTX (81 diapositivas):
python3 generate_deck.py

# Recompilar la Guía Docente en Markdown:
python3 build_teaching_guide.py
```
