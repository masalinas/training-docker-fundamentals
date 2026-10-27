# GUÍA DEL DOCENTE: CURSO DOCKER FUNDAMENTALS (20 HORAS)

> **Manual de Vuelo del Instructor para 4 Jornadas de 5 Horas Lectivas**
> Curso 100% en Español • Orientado a Desarrollo y Operaciones (DevOps)

---

## 1. Ficha Técnica y Objetivos del Curso

- **Título Oficial**: Docker Fundamentals
- **Duración Total**: 20 Horas lectivas
- **Estructura Temporal**: 4 Días a razón de 5 Horas/día
- **Metodología**: 50% Exposición Técnica Teórica y Arquitectura • 50% Práctica en Terminal y Laboratorios Guiados
- **Material Complementario**: Presentación de diapositivas `Docker_Fundamentals_20H.pptx` (81 slides panorámicas 16:9 con notas de orador integradas).

### Objetivos de Aprendizaje
Al finalizar las 20 horas lectivas, los alumnos serán capaces de:
1. Comprender con rigor el funcionamiento interno del motor Docker (`dockerd`, `containerd`, `runc`) y el aislamiento del kernel Linux (Namespaces y Cgroups).
2. Escribir `Dockerfiles` profesionales optimizados mediante multi-stage builds, aprovechamiento de la caché de capas y principio de mínimo privilegio.
3. Diseñar arquitecturas de red virtuales en Docker con resolución DNS automática y aislamiento seguro entre servicios.
4. Implementar estrategias de persistencia de datos fiables para bases de datos y entornos de desarrollo mediante Named Volumes y Bind Mounts.
5. Evaluar y desplegar contenedores en servicios de nube pública (Azure ACI/ACA, AWS ECS/Fargate, Google Cloud Run) y gestionar Registries privados seguros.
6. Comprender la necesidad de la orquestación a escala, la arquitectura de Kubernetes (Control Plane vs Workers) y desplegar aplicaciones multi-tier mediante manifiestos declarativos YAML.

---

## 2. Requisitos de Aula y Preparación del Entorno

### Requisitos de Hardware del Alumno
- Equipo portátil con Windows 10/11 Pro/Enterprise (con WSL2 activado), macOS (Apple Silicon M1/M2/M3 o Intel) o Linux (Ubuntu 22.04+, Fedora, Debian).
- Mínimo 8 GB de RAM (16 GB recomendado para el Día 4 con Kubernetes local).
- 20 GB de espacio libre en disco SSD.
- Conexión a Internet sin restricciones de puertos para descargar imágenes desde Docker Hub.

### Software Preinstalado
- **Docker Desktop** (última versión estable) o **Docker Engine** (en Linux nativo).
- **Git** y terminal de comandos (Bash, Zsh o PowerShell 7).
- **Visual Studio Code** con extensión oficial de Docker.
- **kubectl** y **Kind** o **Minikube** (para el Día 4, aunque se puede usar el Kubernetes integrado en Docker Desktop).

---

## 3. Cronograma Maestro Oficial: 4 Días × 5 Horas

Cada jornada lectiva de 5 horas se organiza con descansos programados para mantener la máxima atención de los alumnos:

```text
+--------------------------------------------------------------------------------+
|                     CRONOGRAMA DETALLADO (DÍAS 1 AL 4)                         |
+--------------------------------------------------------------------------------+
| 09:00 - 10:30 | Bloque Teórico 1: Conceptos, arquitectura y demostraciones CLI |
| 10:30 - 10:50 | Pausa Café / Descanso (20 minutos)                             |
| 10:50 - 12:15 | Bloque Teórico 2: Profundización técnica y patrones de diseño  |
| 12:15 - 13:30 | Laboratorio Práctico Guiado (Resolución individual y dudas)    |
| 13:30 - 14:00 | Puesta en común, preguntas clave y resumen de la jornada       |
+--------------------------------------------------------------------------------+
```

### Distribución de Contenidos por Días

#### DÍA 1 (5 Horas) • MÓDULO 1: Introducción a Docker, Arquitectura e Imágenes
- **09:00 - 10:30**: De la crisis del despliegue a los contenedores. Máquinas Virtuales vs Contenedores. Anatomía de bajo nivel: en Linux un contenedor es un proceso ordinario.
- **10:30 - 10:50**: *Descanso*.
- **10:50 - 12:15**: Arquitectura del motor (`dockerd`, `containerd`, `runc`). Filosofía de seguridad: Namespaces y Cgroups. Anatomía de imágenes OCI y capas inmutables. Sintaxis de `Dockerfile` y multi-stage builds.
- **12:15 - 13:30**: **Laboratorio 1**: Ciclo de vida de contenedores y creación de imagen optimizada con Dockerfile.
- **13:30 - 14:00**: Discusión de dudas, buenas prácticas de caché y cierre del Día 1.

#### DÍA 2 (5 Horas) • MÓDULOS 2 Y 3: Redes en Docker y Persistencia / Volúmenes
- **09:00 - 10:30**: Módulo 2 (Redes): veth pairs, conmutador `docker0`, bridge default vs custom con DNS embebido (`127.0.0.11`), mapeo de puertos (`-p` vs `-P`) e iptables DNAT. Modos `host`, `none`, `overlay` y `macvlan`.
- **10:30 - 10:50**: *Descanso*.
- **10:50 - 12:00**: Módulo 3 (Almacenamiento): Overlay2 a fondo (lowerdir, upperdir, workdir, merged), Copy-on-Write. Named Volumes vs Bind Mounts vs Tmpfs. El patrón histórico de Data Volume Containers.
- **12:00 - 13:30**: **Laboratorios 2 y 3**: Redes personalizadas con resolución de nombres DNS + Persistencia de base de datos y hot-reload de código.
- **13:30 - 14:00**: Estrategias de backup/restore de volúmenes con contenedores efímeros y cierre del Día 2.

#### DÍA 3 (5 Horas) • MÓDULO 4: Contenedores en Cloud y Ecosistema Cloud Native
- **09:00 - 10:30**: El paradigma Cloud: de IaaS a CaaS y Serverless Containers. Registries privados: seguridad, escaneo de CVEs y autenticación IAM. Ecosistema Microsoft Azure: ACR, ACI y Azure Container Apps (ACA).
- **10:30 - 10:50**: *Descanso*.
- **10:50 - 12:15**: Ecosistema AWS: ECR, ECS (EC2 launch type vs Fargate). Ecosistema Google Cloud: Artifact Registry y Google Cloud Run. Contextualización histórica de Docker Cloud hacia Docker Hub y Desktop.
- **12:15 - 13:30**: **Laboratorio 4**: Etiquetado semántico, autenticación en registry remoto, push de imagen y despliegue en servicio CaaS / emulación.
- **13:30 - 14:00**: Comparativa económica y técnica: ¿Cuándo usar Serverless Containers vs Kubernetes? Cierre del Día 3.

#### DÍA 4 (5 Horas) • MÓDULO 5: Orquestación y Kubernetes + Taller Integrador
- **09:00 - 10:30**: ¿Por qué orquestar? SPOF, self-healing, rolling updates. Comparativa: Swarm vs K8s vs Nomad. Docker Swarm en 10 minutos. Introducción a Kubernetes: origen en Google Borg y filosofía declarativa.
- **10:30 - 10:50**: *Descanso*.
- **10:50 - 12:00**: Arquitectura K8s: Control Plane (`kube-apiserver`, `etcd`, `scheduler`, `controller-manager`) y Workers (`kubelet`, `kube-proxy`, `containerd`). Objetos esenciales: Pods, Deployments y Services.
- **12:00 - 13:30**: **Laboratorio 5 (Taller Final Integrador)**: Despliegue de aplicación multi-tier en clúster local, simulación de fallo de Pod y Rolling Update.
- **13:30 - 14:00**: Resumen global del curso, roadmap de certificación profesional (CKA/CKAD) y entrega de certificados.

---

## 4. Guion Didáctico Slide a Slide

A continuación se transcribe cada una de las 81 diapositivas del curso, incluyendo su título, resumen de contenido y las notas del orador íntegras para guiar la exposición del docente en directo:

### Diapositiva 1: DÍA 1 • FUNDAMENTOS DE CONTENEDORES

**Referencia en archivo**: Diapositiva 1 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Dar la bienvenida a los alumnos, presentar los objetivos del curso (20 horas lectivas en 4 días) y contextualizar el papel de Docker como estándar de facto en desarrollo y operaciones.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Docker nació en 2013 como un proyecto open source de dotCloud basado en LXC (LinuX Containers). Más tarde evolucionó creando libcontainer y donando las especificaciones OCI (Open Container Initiative).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuántos de vosotros habéis sufrido el famoso problema de 'en mi máquina sí funciona'? ¿Qué causaba esa discrepancia?

[DEMO EN VIVO / COMANDOS]
docker version && docker info
```

---

### Diapositiva 2: MÓDULO 1 • CONTEXTO

**Referencia en archivo**: Diapositiva 2 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer entender al alumno por qué la industria migró masivamente de máquinas virtuales a contenedores.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La metáfora del contenedor marítimo estándar (ISO 668) inventado por Malcolm McLean en 1956: no importa lo que haya dentro (coches, comida) ni cómo se transporte (barco, tren, camión); las grúas operan con la misma interfaz.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuánto tarda en arrancar una VM de vSphere o AWS comparado con un proceso en Linux?

[DEMO EN VIVO / COMANDOS]
time docker run --rm alpine echo 'Arranque en milisegundos'
```

---

### Diapositiva 3: MÓDULO 1 • FUNDAMENTOS

**Referencia en archivo**: Diapositiva 3 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Desmitificar el mito de que 'un contenedor es una máquina virtual ligera'. Explicar la diferencia entre emular hardware y compartir el kernel.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Un hipervisor tipo 1 (bare-metal) o tipo 2 virtualiza instrucciones de CPU, tablas de páginas de memoria (SLAT/EPT) y dispositivos de E/S. Un contenedor solo utiliza syscalls directamente sobre el kernel del sistema operativo anfitrión.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si ejecutas 'uname -r' dentro de un contenedor Debian y luego en el host Ubuntu, ¿qué versión de kernel ves y por qué?

[DEMO EN VIVO / COMANDOS]
uname -r && docker run --rm debian uname -r
```

---

### Diapositiva 4: MÓDULO 1 • ARQUITECTURA DE BAJO NIVEL

**Referencia en archivo**: Diapositiva 4 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Demostrar con el comando ps en el host que el contenedor es solo un proceso regular de Linux protegido por el kernel.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Cada proceso en Linux tiene un directorio en /proc/<PID>/ns/ donde residen enlaces simbólicos a sus namespaces activos (pid, net, ipc, mnt, uts, user). Al comparar los enlaces del host con los del proceso del contenedor, vemos que apuntan a IDs de inodo distintos.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si mato con 'kill -9 42150' el proceso en el host, ¿qué le ocurrirá al contenedor web-demo?

[DEMO EN VIVO / COMANDOS]
docker run -d --name web-test nginx && docker inspect -f '{{.State.Pid}}' web-test && ps -fp $(docker inspect -f '{{.State.Pid}}' web-test)
```

---

### Diapositiva 5: MÓDULO 1 • MOTOR DOCKER

**Referencia en archivo**: Diapositiva 5 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar las capas internas de Docker y la transición histórica de un daemon monolítico a una arquitectura modular estandarizada (OCI).

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
En las versiones tempranas de Docker, si el daemon dockerd se caía, todos los contenedores morían. Gracias a containerd y containerd-shim, hoy los contenedores sobreviven si el daemon se reinicia (Live Restore).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué componente es el que realmente ejecuta la llamada clone() del kernel para arrancar el proceso? (runc)

[DEMO EN VIVO / COMANDOS]
ps -ef | grep -E 'dockerd|containerd|containerd-shim'
```

---

### Diapositiva 6: MÓDULO 1 • INSTALACIÓN

**Referencia en archivo**: Diapositiva 6 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Aclarar una de las confusiones más comunes de los alumnos al instalar Docker en Linux mediante 'apt install docker.io'.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Ubuntu y Debian usan nombres de paquete separados para evitar conflictos de marcas y licencias. Siempre se debe configurar el repositorio oficial upstream con su clave GPG para tener versiones auditadas.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué comando usáis habitualmente para instalar Docker en vuestras máquinas Linux?

[DEMO EN VIVO / COMANDOS]
apt-cache policy docker-ce docker.io 2>/dev/null || which docker
```

---

### Diapositiva 7: MÓDULO 1 • SEGURIDAD

**Referencia en archivo**: Diapositiva 7 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar el modelo de seguridad en capas: aislamiento de visibilidad (namespaces), contención de recursos (cgroups) y minimización de privilegios.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La directiva de seguridad por defecto de Docker aplica un perfil Seccomp con más de 300 syscalls bloqueadas (como reboot, mount, swapon, ioperm) para evitar que un proceso comprometido ataque el kernel.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si un atacante consigue root dentro de un contenedor por defecto, ¿es root automáticamente del servidor físico? ¿Por qué sí o por qué no?

[DEMO EN VIVO / COMANDOS]
docker run --rm alpine id && docker run --rm alpine sh -c 'reboot || true'
```

---

### Diapositiva 8: MÓDULO 1 • SEGURIDAD

**Referencia en archivo**: Diapositiva 8 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Detallar los 6 namespaces de Linux y explicar cómo cada uno se encarga de un aspecto diferente del aislamiento.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La syscall clone(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWIPC | CLONE_NEWUTS) es la invocada por runc al crear el proceso.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué es crucial que el contenedor tenga su propio PID 1? ¿Qué responsabilidad tiene el PID 1 con los procesos huérfanos (zombies)?

[DEMO EN VIVO / COMANDOS]
docker run --rm alpine hostname && hostname
```

---

### Diapositiva 9: MÓDULO 1 • SEGURIDAD

**Referencia en archivo**: Diapositiva 9 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Instruir a los alumnos en el uso de límites de CPU, memoria y PIDs como buena práctica innegociable en producción.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Explicar el OOM Killer (Out Of Memory Killer): el kernel asigna una puntuación oom_score a cada proceso. Al configurar límites de cgroup, el kernel calcula la puntuación dentro del cgroup del contenedor.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué ocurre si un contenedor no tiene configurado ningún límite de memoria y sufre una fuga masiva de memoria?

[DEMO EN VIVO / COMANDOS]
docker run -d --name mem-test --memory=128m nginx && docker stats --no-stream mem-test && docker rm -f mem-test
```

---

### Diapositiva 10: MÓDULO 1 • SEGURIDAD

**Referencia en archivo**: Diapositiva 10 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Enseñar a blindar la ejecución de contenedores eliminando permisos innecesarios y desaconsejando el uso de --privileged.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
--privileged no solo otorga todas las capabilities, sino que desactiva los filtros Seccomp, levanta las restricciones de AppArmor/SELinux y expone todos los nodos de /dev del host.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué un servidor web como Nginx en puerto 80 necesita CAP_NET_BIND_SERVICE si se ejecuta como usuario no-root?

[DEMO EN VIVO / COMANDOS]
docker run --rm --cap-drop=ALL alpine ping -c 1 8.8.8.8 || true
```

---

### Diapositiva 11: MÓDULO 1 • IMÁGENES

**Referencia en archivo**: Diapositiva 11 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Fijar el concepto fundamental de imagen como plantilla estática de solo lectura y el peligro del tag :latest.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Una imagen OCI se compone de un Image Manifest (JSON con referencias a los blobs de capas y configuración) y una serie de tarballs comprimidos con gzip o zstd que contienen el diff de cada capa.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si descargo 'python:3.11' hoy y vuelvo a descargarlo dentro de 6 meses, ¿tendré exactamente los mismos bytes si la imagen fue actualizada?

[DEMO EN VIVO / COMANDOS]
docker inspect --format='{{.RepoDigests}}' nginx:alpine
```

---

### Diapositiva 12: MÓDULO 1 • IMÁGENES

**Referencia en archivo**: Diapositiva 12 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar cómo se apilan las capas de solo lectura y por qué múltiples contenedores comparten las mismas capas sin duplicar espacio en disco.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Cada capa es un diff del sistema de archivos. El driver Overlay2 combina los directorios lowerdir (capas de imagen) con el upperdir (capa del contenedor) presentándolo como un único árbol de directorios merged.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si 10 contenedores arrancan desde la misma imagen de 500MB, ¿cuánto espacio real en disco ocupan las imágenes base?

[DEMO EN VIVO / COMANDOS]
docker image history nginx:alpine
```

---

### Diapositiva 13: MÓDULO 1 • CONTENEDORES

**Referencia en archivo**: Diapositiva 13 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer entender la diferencia entre estado persistente y capa efímera Copy-on-Write usando docker diff.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Overlay2 utiliza la operación de kernel copy_up cuando un proceso abre en modo escritura (O_WRONLY o O_RDWR) un archivo existente en lowerdir.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué penalización de rendimiento tiene modificar por primera vez un archivo de 10GB que reside en una capa de la imagen?

[DEMO EN VIVO / COMANDOS]
docker run -d --name c1 nginx && docker diff c1 && docker rm -f c1
```

---

### Diapositiva 14: MÓDULO 1 • CONTENEDORES

**Referencia en archivo**: Diapositiva 14 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Enseñar los estados del contenedor y la importancia crítica de cómo el proceso PID 1 gestiona las señales de apagado limpio.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Al ejecutar docker stop, dockerd invoca a containerd para enviar SIGTERM. Tras el timeout (--time), envía SIGKILL. Si la app está empaquetada como script de bash sin 'exec', bash absorbe la señal y la app no se apaga limpiamente.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué a veces 'docker stop' tarda exactamente 10 segundos en parar un contenedor?

[DEMO EN VIVO / COMANDOS]
docker create --name c_state alpine && docker ps -a | grep c_state && docker rm c_state
```

---

### Diapositiva 15: MÓDULO 1 • OPERACIÓN CLI

**Referencia en archivo**: Diapositiva 15 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Familiarizar a los alumnos con los comandos que utilizarán el 90% del tiempo en la terminal.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Docker 1.13 introdujo la sintaxis estructurada por objetos: docker container run, docker image ls, docker volume ls, docker network ls. Ambos formatos siguen vigentes.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuál es la diferencia entre 'docker run' y 'docker start'?

[DEMO EN VIVO / COMANDOS]
docker run -d --name demo-cli -p 8080:80 nginx:alpine && curl -I http://localhost:8080 && docker rm -f demo-cli
```

---

### Diapositiva 16: MÓDULO 1 • DOCKERFILE

**Referencia en archivo**: Diapositiva 16 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Introducir la sintaxis y filosofía del Dockerfile como receta auditable y reproducible.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
BuildKit utiliza un formato intermedio llamado LLB (Low-Level Builder), similar a LLVM en compiladores, permitiendo cachear operaciones y resolver grafos acíclicos dirigidos (DAGs) de construcción.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué copiamos package.json antes que el resto de archivos de la aplicación?

[DEMO EN VIVO / COMANDOS]
DOCKER_BUILDKIT=1 docker build --help | head -n 10
```

---

### Diapositiva 17: MÓDULO 1 • DOCKERFILE

**Referencia en archivo**: Diapositiva 17 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Clarificar la diferencia vital entre RUN (momento build) y CMD/ENTRYPOINT (momento ejecución), y la diferencia entre la forma exec y shell.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La forma shell 'CMD node app.js' arranca '/bin/sh -c node app.js'. En este caso el PID 1 es sh, lo que impide que las señales SIGTERM lleguen a node.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuál es la diferencia entre EXPOSE 80 en el Dockerfile y -p 8080:80 en docker run?

[DEMO EN VIVO / COMANDOS]
docker run --rm alpine sh -c 'echo Formato shell vs exec'
```

---

### Diapositiva 18: MÓDULO 1 • OPTIMIZACIÓN

**Referencia en archivo**: Diapositiva 18 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer entender que el orden de las instrucciones en el Dockerfile determina directamente la velocidad del pipeline de CI/CD.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Docker calcula un checksum SHA de los archivos copiados en cada instrucción COPY. Si el hash coincide con la caché local, omite la ejecución del paso.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si en un RUN haces 'apt-get update' y en otro RUN separado haces 'apt-get install', ¿qué problema de caché puede ocurrir con el tiempo?

[DEMO EN VIVO / COMANDOS]
docker build --help | grep cache
```

---

### Diapositiva 19: MÓDULO 1 • OPTIMIZACIÓN

**Referencia en archivo**: Diapositiva 19 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar los Multi-Stage Builds como el estándar profesional obligatorio para construir imágenes listas para producción.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Antes de Multi-stage (introducido en Docker 17.05), los ingenieros tenían que usar scripts complejos de shell que montaban volúmenes de build y luego copiaban los artefactos a otro Dockerfile (Builder Pattern).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué dejar herramientas como gcc, git o curl en una imagen de producción facilita el trabajo a un atacante que consiga inyección remota de comandos?

[DEMO EN VIVO / COMANDOS]
docker build -t test-multistage - <<EOF
FROM alpine AS b
RUN echo hi > /hi
FROM scratch
COPY --from=b /hi /hi
EOF
docker image ls test-multistage
```

---

### Diapositiva 20: MÓDULO 1 • ARQUITECTURA

**Referencia en archivo**: Diapositiva 20 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Establecer las bases arquitectónicas de microservicios y anticipar los problemas que resolveremos en los Módulos 2 (Redes) y 3 (Volúmenes).

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
El antipatrón de usar systemd dentro de un contenedor: intentar arrancar un init completo obliga a conceder capabilities elevadas y rompe la monitorización de salud de procesos de Docker.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué ventajas e inconvenientes tiene separar una tienda online en 4 contenedores (frontend, backend, redis, postgres) vs un solo monolito?

[DEMO EN VIVO / COMANDOS]
docker ps
```

---

### Diapositiva 21: DÍA 1 • PRÁCTICA

**Referencia en archivo**: Diapositiva 21 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Guiar a los alumnos en su primer laboratorio práctico guiado de 60-75 minutos para afianzar todos los comandos vistos en la jornada 1.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Estar atento a los errores comunes de los alumnos: olvidar el punto final en 'docker build -t app .', puertos ya ocupados en el host (ej. 80 o 8080 ocupado por otro servicio), y permisos en Docker socket si no añadieron su usuario al grupo docker.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Quién ha tenido un fallo al compilar por olvidar el punto final del build context?

[DEMO EN VIVO / COMANDOS]
mkdir -p /tmp/lab1 && echo 'FROM nginx:alpine
RUN echo "<h1>Lab 1 Exitoso</h1>" > /usr/share/nginx/html/index.html' > /tmp/lab1/Dockerfile && docker build -t lab1:1.0 /tmp/lab1 && docker run -d --name lab1-demo -p 8888:80 lab1:1.0 && curl http://localhost:8888 && docker rm -f lab1-demo
```

---

### Diapositiva 22: DÍA 1 • CONCLUSIÓN

**Referencia en archivo**: Diapositiva 22 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Recapitular los aprendizajes de las 5 horas del Día 1, resolver dudas abiertas y hacer el puente pedagógico hacia el Día 2.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Recordar a los alumnos que mañana veremos cómo se comunican estos contenedores entre sí mediante redes bridge y cómo resolvemos el reto de la persistencia de datos.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuál ha sido el concepto técnico que más os ha sorprendido hoy sobre cómo funcionan realmente los contenedores?

[DEMO EN VIVO / COMANDOS]
docker ps -a
```

---

### Diapositiva 23: DÍA 2 • COMUNICACIÓN Y ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 23 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar los dos pilares de la jornada: cómo se comunican los contenedores (redes) y cómo persisten sus datos (volúmenes).

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Ambos subsistemas se apoyan directamente en capacidades del kernel de Linux: NET namespaces e iptables para redes; OverlayFS/VFS y puntos de montaje para almacenamiento.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si los contenedores son efímeros por naturaleza, ¿cómo resolvemos el despliegue de una base de datos PostgreSQL o Redis sin perder información?

[DEMO EN VIVO / COMANDOS]
docker network ls && docker volume ls
```

---

### Diapositiva 24: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 24 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer entender visualmente cómo se conectan los contenedores al host usando pares veth como cables virtuales.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La llamada ip link add veth0 type veth peer name veth1 crea dos interfaces unidas. Luego ip link set veth1 netns <PID> mueve una de ellas al namespace del contenedor.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Puede un contenedor ver el tráfico de red de otro contenedor en el mismo host si no están en la misma subred?

[DEMO EN VIVO / COMANDOS]
docker network inspect bridge | grep -A 5 Subnet
```

---

### Diapositiva 25: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 25 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Advertir sobre la trampa común de usar la red bridge por defecto y no poder comunicar contenedores por nombre.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
En la red bridge por defecto, Docker inyecta los servidores DNS del host en /etc/resolv.conf. En cambio, en redes personalizadas inyecta la IP 127.0.0.11, que es el servidor DNS embedded de Docker.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué es una pésima práctica en producción conectar una base de datos y una API en la red bridge por defecto usando IPs fijas?

[DEMO EN VIVO / COMANDOS]
docker run -d --name c1 alpine sleep 3600 && docker run --rm alpine ping -c 1 c1 || echo 'FALLO DNS ESPERADO'
```

---

### Diapositiva 26: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 26 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Demostrar la resolución de nombres DNS automática en redes personalizadas como la forma estándar de interconectar microservicios.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Docker intercepta las consultas DNS al socket 127.0.0.11 en el puerto 53 UDP. Si la consulta es por un nombre de contenedor de la red, responde inmediatamente. Si es externa (ej. google.com), la reenvía al upstream DNS del host.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué sucede si conectamos un contenedor simultáneamente a dos redes personalizadas distintas?

[DEMO EN VIVO / COMANDOS]
docker network create demo-net && docker run -d --name srv --network demo-net nginx:alpine && docker run --rm --network demo-net alpine ping -c 1 srv && docker rm -f srv && docker network rm demo-net
```

---

### Diapositiva 27: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 27 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar con precisión cómo el tráfico llega desde el exterior al contenedor a través de iptables DNAT y docker-proxy.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La regla DNAT (Destination NAT) en la cadena PREROUTING altera la cabecera IP del paquete entrante: cambia la IP de destino del host por la IP interna del contenedor (172.18.0.2).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si tienes UFW o un firewall activo en Ubuntu, ¿sabías que Docker se salta las reglas de UFW por defecto al modificar iptables antes?

[DEMO EN VIVO / COMANDOS]
docker run -d --name web-p -p 8080:80 nginx:alpine && docker port web-p && docker rm -f web-p
```

---

### Diapositiva 28: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 28 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Evaluar el trade-off de rendimiento vs seguridad del modo host.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Al omitir CLONE_NEWNET en clone(), el proceso del contenedor ve las mismas interfaces que eth0 del host.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si arranco dos contenedores Nginx con '--network host' en la misma máquina, ¿qué ocurrirá con el segundo?

[DEMO EN VIVO / COMANDOS]
docker run --rm --network host alpine ip addr | head -n 8
```

---

### Diapositiva 29: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 29 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar el modo none como herramienta de máxima contención para procesamiento seguro y air-gapped.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
El contenedor tiene un netns asignado pero runc no añade ningún veth ni ruta de gateway por defecto en la tabla de enrutamiento.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cómo harías llegar los archivos a procesar a un contenedor con '--network none' si no tiene red? (Volúmenes)

[DEMO EN VIVO / COMANDOS]
docker run --rm --network none alpine ifconfig
```

---

### Diapositiva 30: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 30 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Introducir el concepto de redes overlay y VXLAN para preparar a los alumnos para la orquestación del Módulo 5.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
VXLAN (Virtual Extensible LAN, RFC 7348) añade una cabecera de 8 bytes con un VNI (VXLAN Network Identifier) de 24 bits, permitiendo hasta 16 millones de redes virtuales aisladas sobre una misma red física.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué sobrecarga de bytes añade la cabecera VXLAN en cada paquete y por qué afecta al MTU de la red?

[DEMO EN VIVO / COMANDOS]
docker network create -d overlay --attachable demo-overlay 2>/dev/null || echo 'Overlay requiere Swarm inicializado (docker swarm init)'
```

---

### Diapositiva 31: MÓDULO 2 • REDES

**Referencia en archivo**: Diapositiva 31 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar cuándo utilizar Macvlan (redes corporativas legacy) y cómo los plugins CNI amplían las capacidades de red.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
En Macvlan, el kernel crea subinterfaces virtuales asociadas a la interfaz física eth0. Por seguridad del kernel Linux, el host no puede comunicarse con los contenedores Macvlan por su interfaz física salvo que se cree un macvlan dummy en el propio host.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué en entornos cloud como AWS o Azure Macvlan suele estar bloqueado por el proveedor? (Prevención de spoofing de MACs)

[DEMO EN VIVO / COMANDOS]
docker network ls
```

---

### Diapositiva 32: DÍA 2 • PRÁCTICA

**Referencia en archivo**: Diapositiva 32 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Garantizar que todos los alumnos dominen la creación de redes y la resolución DNS entre contenedores antes de pasar a almacenamiento.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Insistir a los alumnos en que nunca dejen contenedores en la red por defecto bridge para proyectos de más de un servicio.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Alguien puede explicar por qué el ping funcionó directamente con el nombre 'cache-redis' sin configurar /etc/hosts?

[DEMO EN VIVO / COMANDOS]
docker network create lab2-net && docker run -d --name r1 --network lab2-net redis:alpine && docker run --rm --network lab2-net alpine ping -c 1 r1 && docker rm -f r1 && docker network rm lab2-net
```

---

### Diapositiva 33: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 33 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Introducir la necesidad de persistencia de datos y desmontar el mito de que 'Docker no sirve para bases de datos'.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Los datos que residen en la capa de contenedor se pierden al destruirlo. Los volúmenes montan sistemas de archivos que evitan el storage driver, ofreciendo rendimiento nativo.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué pasa con los clientes registrados en MySQL si actualizamos la versión de la imagen y borramos el contenedor viejo?

[DEMO EN VIVO / COMANDOS]
docker volume ls
```

---

### Diapositiva 34: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 34 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer entender que los contenedores son efímeros pero los datos deben ser sagrados y persistentes.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Overlay2 es fantástico para archivos estáticos de la imagen, pero tiene penalización en escrituras pesadas aleatorias (como un motor InnoDB de MySQL o WAL de PostgreSQL). Los volúmenes se montan como sistemas de archivos directos sin pasar por Overlay2.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué no es recomendable escribir terabytes de datos directamente en la capa de escritura del contenedor?

[DEMO EN VIVO / COMANDOS]
docker info | grep -i 'Storage Driver'
```

---

### Diapositiva 35: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 35 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar técnicamente el funcionamiento interno de Overlay2 y qué ocurre realmente en disco cuando se crea, edita o borra un archivo.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Un whiteout file en OverlayFS es un dispositivo de caracteres (character device) con número mayor 0 y menor 0. Al montar el filesystem, el kernel oculta cualquier entrada en lowerdir con ese mismo nombre.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si borras un archivo de 2GB de la imagen base dentro del contenedor, ¿se reduce el tamaño de la imagen en disco? (¡No, solo se crea un whiteout!)

[DEMO EN VIVO / COMANDOS]
docker run -d --name o2-demo alpine sleep 60 && docker inspect o2-demo | grep -A 5 GraphDriver && docker rm -f o2-demo
```

---

### Diapositiva 36: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 36 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar la tabla comparativa definitiva entre Named Volumes, Bind Mounts y Tmpfs.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Técnicamente, tanto Bind Mounts como Volumes utilizan la syscall mount() de Linux con flags MS_BIND. La diferencia radica en si la ruta origen es gestionada por el daemon de Docker o por el usuario.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuál de los 3 elegirías para guardar el código fuente de un proyecto React mientras programas en tu portátil?

[DEMO EN VIVO / COMANDOS]
docker volume create test-vol && docker volume inspect test-vol && docker volume rm test-vol
```

---

### Diapositiva 37: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 37 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Demostrar con el ejemplo práctico de una base de datos que destruir el contenedor no elimina los datos si residen en un Named Volume.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Los volúmenes residen en /var/lib/docker/volumes/<nombre>/_data. En sistemas Linux con permisos de root, es posible inspeccionar y hacer copias de seguridad de esa carpeta directamente con tar o rsync.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué sucede si dos contenedores montan el mismo Named Volume simultáneamente? (Ambos pueden escribir, pero ojo con bloqueos a nivel de app)

[DEMO EN VIVO / COMANDOS]
docker volume create v_demo && docker run --rm -v v_demo:/data alpine touch /data/saludos.txt && docker run --rm -v v_demo:/data alpine ls /data && docker volume rm v_demo
```

---

### Diapositiva 38: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 38 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Enseñar el uso adecuado de Bind Mounts en desarrollo y prevenir el dolor de cabeza clásico de permisos UID/GID desalineados.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
En Linux, el kernel comprueba los permisos numéricos de UID/GID. Si dentro del contenedor se crea un archivo con UID 0 (root), en el host pertenecerá a root, impidiendo que el desarrollador pueda editarlo sin sudo.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿A cuántos os ha pasado crear archivos desde Docker y luego no poder editarlos o borrarlos en vuestro editor en el host?

[DEMO EN VIVO / COMANDOS]
docker run --rm -v $(pwd):/host_dir alpine ls /host_dir
```

---

### Diapositiva 39: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 39 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Instruir en el uso de tmpfs para optimizar el rendimiento y la seguridad de datos volátiles.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Tmpfs es un sistema de archivos virtual de Linux respaldado por la memoria y swap del kernel. Utiliza la llamada mount -t tmpfs.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué es buena idea poner la carpeta /tmp de un contenedor en tmpfs si la app genera millones de archivos efímeros por hora?

[DEMO EN VIVO / COMANDOS]
docker run --rm --tmpfs /ram_dir alpine df -T /ram_dir
```

---

### Diapositiva 40: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 40 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar el punto del temario oficial 'Contenedores de volúmenes de datos' contextualizándolo históricamente.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Data Volume Containers usaban volúmenes anónimos asociados al metadata del contenedor en /var/lib/docker/containers/<id>/config.v2.json. Si alguien borraba el contenedor con 'docker rm -v', los datos desaparecían.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué mantener un contenedor en estado 'Exited' solo para sujetar una carpeta era una solución poco elegante?

[DEMO EN VIVO / COMANDOS]
docker create -v /datos --name data-holder alpine && docker run --rm --volumes-from data-holder alpine touch /datos/archivo && docker run --rm --volumes-from data-holder alpine ls /datos && docker rm -v data-holder
```

---

### Diapositiva 41: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 41 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Mostrar cómo los volúmenes de Docker pueden conectarse a almacenamiento en red corporativo.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
El driver 'local' de Docker incluye la capacidad de invocar llamadas mount del sistema con cualquier sistema de archivos soportado por el kernel del host (nfs, cifs, sshfs, btrfs, zfs).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué precauciones debemos tener con la latencia de red si una base de datos escribe en un volumen NFS montado remotamente?

[DEMO EN VIVO / COMANDOS]
docker volume create --help
```

---

### Diapositiva 42: MÓDULO 3 • ALMACENAMIENTO

**Referencia en archivo**: Diapositiva 42 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Proporcionar a los alumnos la receta canónica para hacer copias de seguridad fiables de volúmenes de Docker.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Montar el volumen origen en modo :ro (read-only) durante el backup evita que escrituras concurrentes puedan corromper el archivo tar en curso.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué es más limpio usar un contenedor efímero con tar que entrar por SSH como root y copiar los archivos a mano?

[DEMO EN VIVO / COMANDOS]
docker volume create v_bk && docker run --rm -v v_bk:/src alpine touch /src/datos.db && docker run --rm -v v_bk:/src -v /tmp:/dst alpine tar czf /dst/backup.tar.gz -C /src . && ls -lh /tmp/backup.tar.gz && docker volume rm v_bk
```

---

### Diapositiva 43: MÓDULO 3 • BUENAS PRÁCTICAS

**Referencia en archivo**: Diapositiva 43 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Fijar buenas prácticas estrictas y señalar los errores más costosos que cometen los equipos en producción.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La directiva VOLUME dentro del Dockerfile crea automáticamente un volumen anónimo cada vez que se ejecuta 'docker run' sin parámetros de volumen explícitos. Esto puede saturar /var/lib/docker/volumes rápidamente si no se gestiona.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué opináis de la práctica de hacer 'docker commit' en lugar de actualizar el Dockerfile?

[DEMO EN VIVO / COMANDOS]
docker volume ls -q -f dangling=true
```

---

### Diapositiva 44: DÍA 2 • PRÁCTICA

**Referencia en archivo**: Diapositiva 44 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Dar 60-75 minutos a los alumnos para experimentar el contraste real entre persistencia en base de datos y desarrollo ágil con Bind Mount.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Verificar que los alumnos entienden que el volumen 'db_datos' sobrevivió al borrado del contenedor y que el bind mount permite trabajar a velocidad nativa en local.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Quién ha podido destruir el contenedor de PostgreSQL y volver a ver sus tablas en el contenedor nuevo?

[DEMO EN VIVO / COMANDOS]
docker volume create lab3_demo && docker run --rm -v lab3_demo:/data alpine touch /data/ok && docker run --rm -v lab3_demo:/data alpine ls /data && docker volume rm lab3_demo
```

---

### Diapositiva 45: DÍA 2 • CONCLUSIÓN

**Referencia en archivo**: Diapositiva 45 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Cerrar la Jornada 2 resolviendo dudas finales sobre redes y almacenamiento y anticipar el salto al Cloud del Día 3.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Recordar a los alumnos que una vez que dominamos la ejecución local, la red y la persistencia, el siguiente paso natural es cómo se ejecutan estos mismos contenedores en infraestructuras Cloud.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Tenéis clara la diferencia de uso entre un Named Volume y un Bind Mount en un proyecto real?

[DEMO EN VIVO / COMANDOS]
docker ps && docker network ls && docker volume ls
```

---

### Diapositiva 46: DÍA 3 • DESPLIEGUE EN LA NUBE

**Referencia en archivo**: Diapositiva 46 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Introducir el salto desde la máquina local del desarrollador hacia las grandes nubes públicas empresariales.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Los proveedores de nube pública ejecutan hipervisores tipo 1 fuertemente customizados (ej. AWS Nitro, Azure Hyper-V) sobre los que despliegan máquinas virtuales aisladas (MicroVMs como Firecracker) para ofrecer ejecución serverless de contenedores con aislamiento multinquilino estricto.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué proveedores de nube pública utilizáis actualmente en vuestra empresa (AWS, Azure, GCP u on-premise)?

[DEMO EN VIVO / COMANDOS]
docker info | grep -i 'Registry'
```

---

### Diapositiva 47: MÓDULO 4 • FUNDAMENTOS CLOUD

**Referencia en archivo**: Diapositiva 47 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Posicionar el concepto de CaaS y Serverless Containers frente a las VMs tradicionales de IaaS.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
En Serverless Containers no hay un host Linux permanente asignado al usuario. El proveedor crea dinámicamente un sandbox de ejecución rápido cuando entra una petición HTTP y lo suspende o apaga al terminar.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuánto dinero ahorra una empresa si una API interna de facturación que solo se usa de lunes a viernes escala a cero por las noches y fines de semana?

[DEMO EN VIVO / COMANDOS]
echo 'De IaaS a Serverless Containers'
```

---

### Diapositiva 48: MÓDULO 4 • PIPELINE

**Referencia en archivo**: Diapositiva 48 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer entender que el Container Registry es el centro neurálgico que conecta el desarrollo con el despliegue cloud.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Al hacer 'docker push', el cliente comprueba con el registry qué capas (por su SHA256) ya existen en el servidor remoto para subir únicamente las capas nuevas (subida diferencial optimizada).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué nunca debemos usar credenciales de usuario/contraseña personales en un pipeline de CI/CD para hacer push?

[DEMO EN VIVO / COMANDOS]
docker tag --help | head -n 8
```

---

### Diapositiva 49: MÓDULO 4 • REGISTRIES

**Referencia en archivo**: Diapositiva 49 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Profundizar en la seguridad de la cadena de suministro de software (Supply Chain Security) en los registries cloud.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La especificación OCI Distribution Specification define la API HTTP estándar (/v2/<name>/manifests/<reference>) que implementan todos los registros cloud modernos.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué pasaría en producción si un atacante consigue sobrescribir la imagen 'backend:v2.0' en el registry con una versión que contiene malware?

[DEMO EN VIVO / COMANDOS]
docker search --filter is-official=true nginx | head -n 5
```

---

### Diapositiva 50: MÓDULO 4 • AZURE

**Referencia en archivo**: Diapositiva 50 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Mapear el catálogo completo de opciones de contenedores en Azure para que el alumno sepa qué herramienta usar según el caso de uso.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Azure Container Instances ejecuta cada grupo de contenedores dentro de una frontera de hipervisor dedicada y aislada, garantizando que dos clientes no comparten el mismo kernel en la infraestructura física de Azure.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si solo quieres levantar un script de Python que procese un archivo una vez al día durante 10 minutos, ¿qué servicio de Azure elegirías?

[DEMO EN VIVO / COMANDOS]
echo 'Azure Container Registry (ACR) + ACI + ACA + AKS'
```

---

### Diapositiva 51: MÓDULO 4 • AZURE

**Referencia en archivo**: Diapositiva 51 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Enseñar a desplegar un contenedor público en Azure en menos de 2 minutos mediante Azure CLI.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
ACI soporta el concepto de 'Container Groups', similar a un Pod de Kubernetes: varios contenedores que comparten ciclo de vida, almacenamiento y la misma dirección IP.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué ACI no es la mejor opción para un sistema complejo de 30 microservicios interconectados? (Para eso está ACA o AKS)

[DEMO EN VIVO / COMANDOS]
echo 'az container create --help'
```

---

### Diapositiva 52: MÓDULO 4 • AZURE

**Referencia en archivo**: Diapositiva 52 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar Azure Container Apps como el punto dulce actual de la industria entre la simpleza de ACI y la complejidad de AKS.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
ACA utiliza Dapr como sidecar opcional y Envoy proxy como ingress controller. La abstracción de KEDA monitoriza métricas externas para disparar el Horizontal Pod Autoscaler de K8s bajo cuerda.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué ventaja tiene escalar por el tamaño de una cola de mensajes en vez de por consumo de CPU?

[DEMO EN VIVO / COMANDOS]
echo 'az containerapp --help'
```

---

### Diapositiva 53: MÓDULO 4 • AWS

**Referencia en archivo**: Diapositiva 53 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Estructurar el catálogo de AWS para que el alumno entienda el papel de ECS frente a EKS y el cómputo Fargate.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Amazon ECS utiliza internamente un agente de código abierto (amazon-ecs-agent) escrito en Go que corre en los nodos y habla directamente con el motor de Docker o containerd.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Quién en el aula ha trabajado con ECS o EKS en Amazon Web Services?

[DEMO EN VIVO / COMANDOS]
echo 'Amazon ECR + ECS + Fargate + EKS'
```

---

### Diapositiva 54: MÓDULO 4 • AWS

**Referencia en archivo**: Diapositiva 54 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Contrastar los dos modelos de ejecución de ECS: pagar por servidores fijos (EC2) vs pagar por tarea en ejecución (Fargate).

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Firecracker es un hipervisor ligero de código abierto desarrollado por AWS en Rust basado en KVM que arranca MicroVMs en menos de 5ms consumiendo solo 5MB de memoria.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si tu clúster de ECS tiene picos inesperados de tráfico en Black Friday, ¿cuál de los dos modelos escala más rápido?

[DEMO EN VIVO / COMANDOS]
aws ecs list-clusters 2>/dev/null || echo 'AWS CLI configured check'
```

---

### Diapositiva 55: MÓDULO 4 • AWS

**Referencia en archivo**: Diapositiva 55 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Instruir en el uso de Amazon ECR y las políticas de inmutabilidad y escaneo automático al hacer push.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
ECR almacena los datos de las capas de imagen directamente en Amazon S3 cifrados con claves KMS con una durabilidad del 99.999999999% (11 nueves).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué la inmutabilidad de tags evita que un fallo humano en CI/CD rompa un despliegue previo?

[DEMO EN VIVO / COMANDOS]
echo 'aws ecr get-login-password --help'
```

---

### Diapositiva 56: MÓDULO 4 • GOOGLE CLOUD

**Referencia en archivo**: Diapositiva 56 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Resaltar la posición histórica de Google en el desarrollo de cgroups y Kubernetes y presentar Cloud Run y GKE.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Google diseñó originalmente cgroups (llamados process containers en 2006) y los donó al kernel de Linux para poder ejecutar Borg en sus datacenters.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Sabías que Google arranca más de 4.000 millones de contenedores por semana en su infraestructura interna?

[DEMO EN VIVO / COMANDOS]
echo 'Google Artifact Registry + Cloud Run + GKE'
```

---

### Diapositiva 57: MÓDULO 4 • GOOGLE CLOUD

**Referencia en archivo**: Diapositiva 57 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Demostrar la agilidad extrema de Google Cloud Run para desplegar contenedores sin preocuparse por servidores ni infraestructura.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Cloud Run utiliza Knative Serving sobre clústeres de GKE optimizados y cajas de aislamiento gVisor para arrancar contenedores en frío en menos de un segundo.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuál es la diferencia entre AWS Lambda y Google Cloud Run? (Lambda ejecuta funciones; Cloud Run ejecuta cualquier contenedor estándar).

[DEMO EN VIVO / COMANDOS]
echo 'gcloud run deploy --help'
```

---

### Diapositiva 58: MÓDULO 4 • GOOGLE CLOUD

**Referencia en archivo**: Diapositiva 58 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar la transición de GCR clásico (gcr.io) a Artifact Registry (*-docker.pkg.dev) en Google Cloud.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Binary Authorization en Google Cloud valida firmas criptográficas generadas durante el pipeline de build para impedir que nadie pueda desplegar una imagen manual no auditada.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué es beneficioso tener el registro de contenedores en la misma región que el clúster de cómputo? (Menor latencia de descarga y ahorro en costes de transferencia de red).

[DEMO EN VIVO / COMANDOS]
gcloud artifacts repositories list 2>/dev/null || echo 'gcloud check'
```

---

### Diapositiva 59: MÓDULO 4 • CONTEXTO HISTÓRICO

**Referencia en archivo**: Diapositiva 59 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Abordar el punto oficial del temario 'Docker Cloud' con total rigor histórico y profesionalidad.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Tutum y Docker Cloud intentaron monetizar el hosting de contenedores antes de que AWS lanzara ECS/Fargate y Google lanzara Cloud Run. Docker Inc. reorientó su modelo de negocio hacia Docker Desktop comercial y suscripciones de Docker Hub.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Tiene sentido que una empresa intente competir en hosting contra AWS, Microsoft y Google a la vez?

[DEMO EN VIVO / COMANDOS]
docker scout --help 2>/dev/null || docker --help
```

---

### Diapositiva 60: MÓDULO 4 • ARQUITECTURA

**Referencia en archivo**: Diapositiva 60 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Ayudar a los alumnos a tomar decisiones técnicas y económicas fundamentadas en sus proyectos de empresa.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Kubernetes añade una sobrecarga operativa y cognitiva notable. Para muchas aplicaciones, un servicio serverless como Cloud Run o ACA cubre el 100% de las necesidades con una fracción del coste operativo.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si tu empresa solo tiene 3 desarrolladores y una API web, ¿recomendarías montar un clúster de Kubernetes?

[DEMO EN VIVO / COMANDOS]
echo 'Comparativa Serverless Containers vs K8s'
```

---

### Diapositiva 61: MÓDULO 4 • BUENAS PRÁCTICAS

**Referencia en archivo**: Diapositiva 61 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Fijar las pautas de arquitectura cloud-native necesarias para que un contenedor sea estable y seguro en la nube.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La directiva HEALTHCHECK en el Dockerfile es consultada por los balanceadores de carga para saber si deben enviar tráfico a ese contenedor o esperar a que termine de inicializarse.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué le ocurriría a tu factura de Cloud Run si no configuras un límite de max-instances y sufres un ataque DoS?

[DEMO EN VIVO / COMANDOS]
docker run --rm alpine sh -c 'echo "Logs directos a stdout y stderr"'
```

---

### Diapositiva 62: DÍA 3 • PRÁCTICA

**Referencia en archivo**: Diapositiva 62 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Guiar a los alumnos en el proceso completo de subir una imagen a un registro público/privado y desplegarla en un entorno cloud.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
En entornos formativos donde los alumnos no disponen de tarjeta de crédito para nubes públicas, este laboratorio se puede realizar de forma 100% gratuita usando Docker Hub público y servicios como Play with Docker, Render, o simulación con registry local 'docker run -d -p 5000:5000 registry:2'.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Quién ha conseguido hacer push de su imagen y verla listada en el registro remoto?

[DEMO EN VIVO / COMANDOS]
docker run -d -p 5000:5000 --name registry-local registry:2 && docker tag nginx:alpine localhost:5000/mi-web:1.0 && docker push localhost:5000/mi-web:1.0 && curl http://localhost:5000/v2/_catalog && docker rm -f registry-local
```

---

### Diapositiva 63: DÍA 3 • CONCLUSIÓN

**Referencia en archivo**: Diapositiva 63 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Cerrar la Jornada 3 revisando cómo los contenedores conectan el desarrollo con la nube y preparar el escenario para Kubernetes en el Día 4.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Recordar a los alumnos que mañana entraremos en el orquestador estándar de la industria (Kubernetes) para aprender cómo gestionar cientos de contenedores coordinados.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Entre ACI, Fargate y Cloud Run, ¿cuál os parece la alternativa más atractiva para vuestros proyectos inmediatos?

[DEMO EN VIVO / COMANDOS]
docker images | head -n 5
```

---

### Diapositiva 64: DÍA 4 • ESCALABILIDAD Y RESILIENCIA

**Referencia en archivo**: Diapositiva 64 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Dar la bienvenida a la última jornada del curso y presentar el salto de gestionar contenedores individuales a coordinar clústeres masivos.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Docker Engine gestiona contenedores en un único host. La orquestación abstrae una flota de cientos o miles de servidores físicos para que el operador los vea y gestione como una única gran computadora homogénea.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si tenéis 50 contenedores repartidos en 10 servidores y uno de los servidores se quema a las 3 de la madrugada, ¿quién reinicia los contenedores afectados?

[DEMO EN VIVO / COMANDOS]
docker info | grep -i 'Swarm'
```

---

### Diapositiva 65: MÓDULO 5 • ORQUESTACIÓN

**Referencia en archivo**: Diapositiva 65 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer reflexionar a los alumnos sobre el paso crítico de entornos de desarrollo a operaciones de producción 24/7.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Un orquestador opera como un sistema operativo distribuido. Utiliza algoritmos de consenso (Raft, Paxos) para mantener un estado coherente entre todos los nodos del clúster ante particiones de red (Split-Brain).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué hacéis en vuestra empresa cuando hay que actualizar una versión en producción para que los usuarios no noten cortes?

[DEMO EN VIVO / COMANDOS]
echo '¿Por qué necesitamos Orquestación?'
```

---

### Diapositiva 66: MÓDULO 5 • ORQUESTACIÓN

**Referencia en archivo**: Diapositiva 66 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Fijar las 5 responsabilidades esenciales que cualquier orquestador (Swarm, K8s, Nomad) debe proporcionar por diseño.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
La reconciliación continua es el motor de todo orquestador: compara permanentemente el 'Desired State' (declarado en YAML) con el 'Actual State' (lo que corre en el kernel). Si difieren, ejecuta acciones correctivas inmediatas.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué ventaja tiene que el orquestador haga un rollback automático si una nueva versión falla el health check?

[DEMO EN VIVO / COMANDOS]
echo 'Scheduling + Self-Healing + Auto-Scaling + Service Discovery + Rolling Updates'
```

---

### Diapositiva 67: MÓDULO 5 • ORQUESTADORES

**Referencia en archivo**: Diapositiva 67 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar el punto oficial del temario 'Comparativa de Orquestadores' analizando los 3 principales contendientes del mercado.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Kubernetes ganó la 'guerra de orquestadores' (2015-2018) frente a Docker Swarm y Apache Mesos gracias al respaldo masivo de Google, Red Hat, Microsoft, Amazon y la fundación CNCF.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Alguien en la sala ha usado Docker Swarm en el pasado? ¿Por qué la industria se volcó con Kubernetes?

[DEMO EN VIVO / COMANDOS]
echo 'Docker Swarm vs Kubernetes vs HashiCorp Nomad'
```

---

### Diapositiva 68: MÓDULO 5 • SWARM

**Referencia en archivo**: Diapositiva 68 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Enseñar a los alumnos a inicializar un clúster Swarm y comprobar cómo escala un servicio en segundos.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
SwarmKit utiliza gRPC con TLS mutuo (mTLS) generado automáticamente para encriptar toda la comunicación entre nodos. El Routing Mesh se apoya en IPVS (IP Virtual Server) en el kernel de Linux.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué es recomendable tener un número impar de nodos Manager (3, 5, 7) en un clúster Raft? (Para evitar empates en la elección de líder).

[DEMO EN VIVO / COMANDOS]
docker swarm init 2>/dev/null || echo 'Swarm ya activo' ; docker service ls ; docker swarm leave --force 2>/dev/null || true
```

---

### Diapositiva 69: MÓDULO 5 • KUBERNETES

**Referencia en archivo**: Diapositiva 69 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Poner en contexto el origen, propósito e impacto de Kubernetes en el ecosistema tecnológico global.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Kubernetes no es un sistema de despliegue pasivo; es un sistema de control de lazo cerrado (Closed-Loop Control System) inspirado en la teoría de control y robótica.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuál es la diferencia entre un enfoque imperativo ('haz esto ahora') y un enfoque declarativo ('este es el estado deseado')?

[DEMO EN VIVO / COMANDOS]
echo 'Kubernetes: De Borg a la CNCF'
```

---

### Diapositiva 70: MÓDULO 5 • ARQUITECTURA K8S

**Referencia en archivo**: Diapositiva 70 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar la división fundamental entre el cerebro del clúster (Control Plane) y los ejecutores de carga (Worker Nodes).

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
En clústeres gestionados como AKS, EKS o GKE, el proveedor de nube asume el 100% de la gestión, alta disponibilidad y coste del Control Plane; el cliente solo paga por los Worker Nodes donde corren sus Pods.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué le ocurre a una aplicación web que ya está corriendo en un Worker Node si el Control Plane se cae temporalmente durante 10 minutos?

[DEMO EN VIVO / COMANDOS]
echo 'Control Plane (Master) vs Worker Nodes'
```

---

### Diapositiva 71: MÓDULO 5 • ARQUITECTURA K8S

**Referencia en archivo**: Diapositiva 71 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Detallar los 4 componentes indispensables del Control Plane y su función específica.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Ningún componente habla directamente con etcd excepto kube-apiserver. Todos los demás componentes (scheduler, controllers, kubelet) consultan y envían eventos a través del API server.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué hacer copias de seguridad de etcd equivale a hacer una copia de seguridad de todo el clúster de Kubernetes?

[DEMO EN VIVO / COMANDOS]
kubectl version --client 2>/dev/null || echo 'kubectl client check'
```

---

### Diapositiva 72: MÓDULO 5 • ARQUITECTURA K8S

**Referencia en archivo**: Diapositiva 72 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Explicar cómo el kubelet y kube-proxy coordinan el runtime de contenedores en cada servidor físico.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Desde Kubernetes 1.24 se eliminó 'dockershim'. Kubernetes ya no habla directamente con Docker Engine, sino con containerd o CRI-O mediante la interfaz estándar CRI (Container Runtime Interface).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué es el Container Runtime Interface (CRI) y por qué Kubernetes ya no depende exclusivamente de Docker?

[DEMO EN VIVO / COMANDOS]
echo 'kubelet + kube-proxy + containerd'
```

---

### Diapositiva 73: MÓDULO 5 • CONCEPTOS K8S

**Referencia en archivo**: Diapositiva 73 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer comprender el núcleo conceptual de Kubernetes: el bucle infinito de reconciliación declarativa.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Kubernetes utiliza llamadas HTTP Watch sobre la API de etcd. Esto significa que los controladores no hacen polling constante, sino que se suscriben a flujos reactivos de eventos (Event-Driven Architecture).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si matamos a mano un Pod con 'kubectl delete pod', ¿por qué aparece uno nuevo con otro nombre al cabo de 2 segundos?

[DEMO EN VIVO / COMANDOS]
echo 'Bucle de Reconciliación: Observar -> Comparar -> Actuar'
```

---

### Diapositiva 74: MÓDULO 5 • OBJETOS K8S

**Referencia en archivo**: Diapositiva 74 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar el concepto de Pod y aclarar por qué K8s añade esta capa de abstracción sobre los contenedores.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
K8s crea un contenedor especial invisible llamado 'pause container' (o infra container) para cada Pod. Este contenedor sujeta los namespaces (NET, IPC) mientras los contenedores de usuario se inician y reinician a su alrededor.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿En qué escenario tendría sentido colocar dos contenedores distintos dentro del mismo Pod? (Patrón Sidecar: ej. app principal + proxy de logging/mTLS).

[DEMO EN VIVO / COMANDOS]
echo 'Pod: La unidad atómica de Kubernetes'
```

---

### Diapositiva 75: MÓDULO 5 • OBJETOS K8S

**Referencia en archivo**: Diapositiva 75 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Enseñar a los alumnos por qué en producción siempre se crean Deployments y cómo gestionan las réplicas y rollouts.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Un Deployment no crea Pods directamente: crea y gestiona ReplicaSets. Al hacer un update de imagen, crea un nuevo ReplicaSet y va incrementando sus réplicas a medida que reduce las del ReplicaSet anterior.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Qué comando de kubectl usarías para escalar las réplicas de 3 a 10 en tiempo de ejecución? (kubectl scale deployment api-pedidos --replicas=10).

[DEMO EN VIVO / COMANDOS]
echo 'kubectl apply -f deployment.yaml'
```

---

### Diapositiva 76: MÓDULO 5 • OBJETOS K8S

**Referencia en archivo**: Diapositiva 76 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer entender que los Services resuelven el reto del descubrimiento de servicios y balanceo interno en Kubernetes.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Los Services no son procesos reales; son reglas de iptables o IPVS gestionadas por kube-proxy que interceptan paquetes dirigidos a la ClusterIP y los reenvían a las IPs reales de los Pods (Endpoints).

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
Si tienes 5 réplicas de un Pod detrás de un Service, ¿cómo sabe el Service a qué Pods enviar tráfico si uno de ellos está caído? (Sondas ReadinessProbe).

[DEMO EN VIVO / COMANDOS]
echo 'kubectl get svc'
```

---

### Diapositiva 77: MÓDULO 5 • OBJETOS K8S

**Referencia en archivo**: Diapositiva 77 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Presentar cómo se gestiona la configuración externa (ConfigMaps/Secrets) y el almacenamiento persistente (PVC/PV) en Kubernetes.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Por defecto en Kubernetes vainilla, los Secrets en etcd están en base64 sin cifrar a nivel de disco; en producción es obligatorio activar 'Encryption at Rest' con KMS en el kube-apiserver.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Por qué nunca debemos compilar contraseñas o URLs de bases de datos dentro de la imagen de Docker?

[DEMO EN VIVO / COMANDOS]
echo 'ConfigMaps, Secrets y PersistentVolumeClaims'
```

---

### Diapositiva 78: MÓDULO 5 • TRANSICIÓN

**Referencia en archivo**: Diapositiva 78 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Hacer que los alumnos sientan que todo lo aprendido en los Módulos 1, 2, 3 y 4 se reutiliza y encaja perfectamente en Kubernetes.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Herramientas como 'Kompose' permiten convertir automáticamente archivos docker-compose.yml en manifiestos de Kubernetes YAML.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuál de las equivalencias de la tabla os parece más intuitiva?

[DEMO EN VIVO / COMANDOS]
echo 'Tabla de equivalencias Docker <-> Kubernetes'
```

---

### Diapositiva 79: MÓDULO 5 • ENTORNOS

**Referencia en archivo**: Diapositiva 79 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Facilitar a los alumnos herramientas para que puedan continuar practicando Kubernetes en sus propios equipos sin coste cloud.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Kind levanta un contenedor Docker con la imagen kindest/node que contiene systemd, containerd, kubelet y todos los binarios de K8s preinstalados.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Quién tiene Docker Desktop instalado en su máquina y ha probado a activar la casilla de Kubernetes?

[DEMO EN VIVO / COMANDOS]
kind version 2>/dev/null || minikube version 2>/dev/null || echo 'Entornos locales para K8s'
```

---

### Diapositiva 80: DÍA 4 • TALLER PRÁCTICO

**Referencia en archivo**: Diapositiva 80 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Taller integrador de 75-90 minutos donde los alumnos consolidan todo el viaje: desde el Dockerfile hasta el despliegue orquestado en K8s.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Acompañar a los alumnos en el uso de 'kubectl get pods -w' (watch mode) para que vean en tiempo real la transición de estados de los contenedores durante el Rolling Update.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Habéis visto cómo al borrar el Pod, el ReplicaSet creó otro Pod sustituto inmediatamente?

[DEMO EN VIVO / COMANDOS]
kubectl get pods 2>/dev/null || echo 'Demo K8s'
```

---

### Diapositiva 81: CIERRE DEL CURSO • CERTIFICACIÓN

**Referencia en archivo**: Diapositiva 81 de 81

**Notas del Instructor (Guion de Clase):**
```text
[OBJETIVO DE LA SLIDE]
Agradecer la participación y esfuerzo de los alumnos, felicitarles por completar las 20 horas formativas y proporcionar recursos de especialización.

[BAJO EL CAPÓ - EXPLICACIÓN TÉCNICA]
Recomendar los siguientes pasos en su carrera profesional: certificación CKA (Certified Kubernetes Administrator), CKAD (Certified Kubernetes Application Developer) y buenas prácticas de seguridad con Docker Scout / Trivy.

[DINÁMICA DE AULA / PREGUNTA DISPARADORA]
¿Cuáles son las 3 habilidades que os lleváis de este curso para aplicar inmediatamente en vuestro trabajo diario?

[DEMO EN VIVO / COMANDOS]
echo 'Fin del curso Docker Fundamentals 20H'
```

---

## 5. Guía Integral de Laboratorios Prácticos

Esta sección contiene los enunciados completos, código fuente y solución paso a paso de los 5 laboratorios del curso, junto con una guía de troubleshooting para resolver los fallos típicos que experimentan los alumnos en el aula.

### Laboratorio 1 (Día 1): Ciclo de Vida de Contenedores y Creación de Imágenes con Dockerfile

**Duración estimada**: 60 - 75 minutos
**Objetivos**:
- Familiarizarse con los comandos de terminal esenciales (`docker run`, `docker ps`, `docker exec`, `docker logs`).
- Construir una imagen personalizada para un microservicio web en Node.js o Python.
- Comprobar la inmutabilidad de la imagen y el aislamiento del proceso.

#### Código del Proyecto de Laboratorio
Crear un directorio `lab1/` con los siguientes archivos:

`package.json`:
```json
{
  "name": "lab1-api",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

`server.js`:
```javascript
const express = require("express");
const app = express();
const os = require("os");
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    mensaje: "¡Hola desde mi primer contenedor Docker!",
    hostname: os.hostname(),
    tiempo_activo: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
```

`Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

`.dockerignore`:
```text
node_modules
.git
*.log
```

#### Comandos Paso a Paso para el Alumno
```bash
# 1. Construir la imagen con tag semántico
docker build -t mi-api:1.0 .

# 2. Verificar la imagen creada en el catálogo local
docker images | grep mi-api

# 3. Arrancar el contenedor en segundo plano publicando el puerto 3000 en el 8080 del host
docker run -d --name api-web -p 8080:3000 mi-api:1.0

# 4. Comprobar que está en ejecución
docker ps

# 5. Probar la respuesta HTTP
curl http://localhost:8080

# 6. Ver logs del contenedor
docker logs api-web

# 7. Inspeccionar el proceso dentro del contenedor
docker exec -it api-web ps -ef

# 8. Detener y limpiar recursos
docker stop api-web && docker rm api-web
```

#### Troubleshooting Lab 1: Errores Frecuentes y Solución
| Error / Síntoma | Causa Raíz | Solución Inmediata |
|---|---|---|
| `permission denied while trying to connect to the Docker daemon socket` | El usuario no pertenece al grupo `docker` en Linux. | Ejecutar `sudo usermod -aG docker $USER` y reiniciar sesión en la terminal. |
| `Bind for 0.0.0.0:8080 failed: port is already allocated` | El puerto 8080 está ocupado por otro servicio en el host. | Mapear a otro puerto libre: `docker run -d -p 8081:3000 ...` o parar el servicio conflictivo. |
| `docker build requires exactly 1 argument` | El alumno olvidó el punto `.` final que indica el build context. | Recordar que la sintaxis requiere un espacio y un punto al final: `docker build -t mi-api:1.0 .` |

### Laboratorio 2 (Día 2): Redes Personalizadas y Descubrimiento de Servicios por DNS

**Duración estimada**: 60 minutos
**Objetivos**:
- Crear redes puente personalizadas (*User-Defined Bridges*).
- Desplegar dos contenedores interconectados (Frontend web y Backend caché Redis).
- Verificar la resolución DNS interna automática mediante el resolvedor `127.0.0.11`.

#### Comandos Paso a Paso para el Alumno
```bash
# 1. Crear una red bridge personalizada
docker network create --driver bridge red-aplicacion

# 2. Verificar la subred asignada
docker network inspect red-aplicacion | grep -A 4 Subnet

# 3. Desplegar una instancia de Redis conectada a la red personalizada
docker run -d --name mi-redis --network red-aplicacion redis:7-alpine

# 4. Desplegar un cliente en la misma red y comprobar la resolución de nombres DNS
docker run --rm --network red-aplicacion alpine ping -c 3 mi-redis

# 5. Demostrar el aislamiento: Crear una segunda red desconectada
docker network create red-aislada
docker run --rm --network red-aislada alpine ping -w 2 mi-redis || echo 'Aislamiento comprobado: no hay ruta'

# 6. Conectar un contenedor en caliente a una red en ejecución
docker network connect red-aislada mi-redis
docker run --rm --network red-aislada alpine ping -c 2 mi-redis

# 7. Limpieza
docker rm -f mi-redis && docker network rm red-aplicacion red-aislada
```

#### Troubleshooting Lab 2: Errores Frecuentes y Solución
| Error / Síntoma | Causa Raíz | Solución Inmediata |
|---|---|---|
| `ping: bad address 'mi-redis'` | El alumno arrancó el contenedor en la red `bridge` por defecto en vez de en la red personalizada. | Verificar con `docker inspect <id>` a qué red está conectado el contenedor. En la red por defecto no hay DNS integrado. |
| `network with name red-aplicacion already exists` | La red ya fue creada en un intento anterior. | Utilizar la red existente o eliminarla antes con `docker network rm red-aplicacion`. |

### Laboratorio 3 (Día 2): Persistencia de Datos con Named Volumes y Hot-Reload con Bind Mounts

**Duración estimada**: 60 - 75 minutos
**Objetivos**:
- Desplegar un motor de base de datos relacional (PostgreSQL) garantizando persistencia ante la destrucción del contenedor.
- Configurar un Bind Mount para desarrollo con recarga en caliente de código en tiempo real.
- Implementar un script de backup y restauración con contenedores efímeros.

#### Comandos Paso a Paso para el Alumno
```bash
# PARTE A: PERSISTENCIA EN BASE DE DATOS
# 1. Crear volumen con nombre
docker volume create pg_datos

# 2. Arrancar PostgreSQL montando el volumen
docker run -d --name mi-postgres \
    -e POSTGRES_PASSWORD=secreto \
    --mount source=pg_datos,target=/var/lib/postgresql/data \
    postgres:16-alpine

# 3. Crear una tabla e insertar datos de prueba
docker exec -i mi-postgres psql -U postgres -c "CREATE TABLE clientes (id SERIAL PRIMARY KEY, nombre TEXT);"
docker exec -i mi-postgres psql -U postgres -c "INSERT INTO clientes (nombre) VALUES ('Empresa A'), ('Empresa B');"
docker exec -i mi-postgres psql -U postgres -c "SELECT * FROM clientes;"

# 4. SIMULAR DESASTRE: Destruir el contenedor por completo
docker rm -f mi-postgres

# 5. Recrear el contenedor con la misma o nueva versión montando el mismo volumen
docker run -d --name mi-postgres-recuperado \
    -e POSTGRES_PASSWORD=secreto \
    --mount source=pg_datos,target=/var/lib/postgresql/data \
    postgres:16-alpine

# 6. Comprobar que los registros sobrevivieron al 100%
docker exec -i mi-postgres-recuperado psql -U postgres -c "SELECT * FROM clientes;"

# PARTE B: BACKUP DEL VOLUMEN
# 7. Crear backup .tar.gz mediante contenedor efímero
mkdir -p backups
docker run --rm \
    -v pg_datos:/origen:ro \
    -v $(pwd)/backups:/destino \
    alpine tar czf /destino/backup_postgres.tar.gz -C /origen .
ls -lh backups/backup_postgres.tar.gz

# 8. Limpieza
docker rm -f mi-postgres-recuperado && docker volume rm pg_datos
```

#### Troubleshooting Lab 3: Errores Frecuentes y Solución
| Error / Síntoma | Causa Raíz | Solución Inmediata |
|---|---|---|
| `Permission denied` al escribir en la carpeta montada | El contenedor se ejecuta como usuario no-root y la carpeta en el host pertenece a root. | Pasar los permisos del usuario con `-u $(id -u):$(id -g)` o ejecutar `chown -R` sobre la carpeta del host. |
| La base de datos no guarda datos tras recrear el contenedor | El alumno montó una ruta errónea (ej. `/var/lib/mysql` en Postgres en vez de `/var/lib/postgresql/data`). | Consultar siempre la documentación de la imagen oficial en Docker Hub para saber cuál es el directorio exacto de datos. |

### Laboratorio 4 (Día 3): Etiquetado Semántico, Push a Registry y Despliegue en Cloud CaaS

**Duración estimada**: 60 - 75 minutos
**Objetivos**:
- Etiquetar imágenes siguiendo la nomenclatura OCI de registries remotos.
- Autenticarse de forma segura mediante terminal en Docker Hub o registro privado de nube.
- Realizar `docker push` y comprobar la subida diferencial de capas por SHA256.
- Desplegar en servicio serverless (ej. Azure ACI, Google Cloud Run o simulación con registry local).

#### Comandos Paso a Paso para el Alumno
```bash
# OPCIÓN A: REGISTRY LOCAL / SIMULACIÓN (Recomendada para aulas sin tarjeta cloud)
# 1. Levantar un registry privado local en puerto 5000
docker run -d -p 5000:5000 --name registry-local registry:2

# 2. Etiquetar la imagen local con la URL del registry
docker tag mi-api:1.0 localhost:5000/mi-organizacion/mi-api:1.0

# 3. Subir la imagen al registro
docker push localhost:5000/mi-organizacion/mi-api:1.0

# 4. Consultar la API del registro para verificar los catálogos almacenados
curl http://localhost:5000/v2/_catalog
curl http://localhost:5000/v2/mi-organizacion/mi-api/tags/list

# 5. Eliminar la imagen local para forzar su descarga desde el registry
docker rmi localhost:5000/mi-organizacion/mi-api:1.0
docker run -d --name api-desde-registry -p 9000:3000 localhost:5000/mi-organizacion/mi-api:1.0
curl http://localhost:9000

# 6. Limpieza
docker rm -f api-desde-registry registry-local
```

#### Troubleshooting Lab 4: Errores Frecuentes y Solución
| Error / Síntoma | Causa Raíz | Solución Inmediata |
|---|---|---|
| `denied: requested access to the resource is denied` | El alumno no ejecutó `docker login` o no tiene permisos de escritura en el repositorio remoto. | Comprobar credenciales ejecutando `docker login` e indicar el namespace correcto del usuario. |
| `http: server gave HTTP response to HTTPS client` | Docker exige HTTPS por defecto para todos los registros que no sean `localhost`. | Si se usa una IP externa no cifrada, añadir la IP a `insecure-registries` en `/etc/docker/daemon.json`. |

### Laboratorio 5 (Día 4 - Taller Integrador): Despliegue de App en Kubernetes

**Duración estimada**: 75 - 90 minutos
**Objetivos**:
- Traducir conceptos de Docker a manifiestos declarativos de Kubernetes.
- Desplegar un `Deployment` con 3 réplicas y límites de memoria/CPU.
- Exponer la aplicación mediante un `Service` y comprobar el balanceo de carga.
- Simular un fallo de un Pod y observar el self-healing en tiempo real.
- Ejecutar un Rolling Update a una nueva versión sin corte de servicio.

#### Manifiestos de Kubernetes para el Alumno
Crear una carpeta `k8s-lab/` con los siguientes archivos:

`deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-web
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "250m"
          requests:
            memory: "64Mi"
            cpu: "100m"
```

`service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: servicio-web
spec:
  type: NodePort
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
```

#### Comandos Paso a Paso para el Alumno
```bash
# 1. Verificar el clúster local de Kubernetes (Docker Desktop, Kind o Minikube)
kubectl get nodes

# 2. Aplicar el Deployment de forma declarativa
kubectl apply -f deployment.yaml

# 3. Observar las 3 réplicas levantándose
kubectl get pods -l app=web -o wide

# 4. Aplicar el Service para balancear tráfico
kubectl apply -f service.yaml
kubectl get svc servicio-web

# 5. Probar el acceso al servicio expuesto en el puerto 30080
curl http://localhost:30080

# 6. DEMOSTRACIÓN DE AUTO-SANACIÓN (Self-Healing)
# Obtener el nombre del primer Pod y eliminarlo
POD_A_ELIMINAR=$(kubectl get pods -l app=web -o jsonpath='{.items[0].metadata.name}')
kubectl delete pod $POD_A_ELIMINAR
# Comprobar inmediatamente: K8s ha creado uno nuevo al instante para mantener 3 réplicas
kubectl get pods -l app=web

# 7. DEMOSTRACIÓN DE ROLLING UPDATE (Actualización Continua)
kubectl set image deployment/app-web nginx=nginx:1.26-alpine
# Monitorizar el estado de la actualización progresiva
kubectl rollout status deployment/app-web

# 8. Limpieza final
kubectl delete -f service.yaml -f deployment.yaml
```

#### Troubleshooting Lab 5: Errores Frecuentes y Solución
| Error / Síntoma | Causa Raíz | Solución Inmediata |
|---|---|---|
| `The connection to the server localhost:8080 was refused` | `kubectl` no tiene el contexto apuntando a un clúster activo. | En Docker Desktop: activar la casilla 'Enable Kubernetes' en Settings y reiniciar. En Kind: ejecutar `kind create cluster`. |
| Pod en estado `ImagePullBackOff` o `ErrImagePull` | Nombre de la imagen o tag mal escrito, o imagen inexistente. | Ejecutar `kubectl describe pod <nombre>` para inspeccionar la sección de eventos y corregir el nombre de la imagen. |
| Pod en estado `CrashLoopBackOff` | El comando del contenedor falla al arrancar o se apaga inmediatamente. | Inspeccionar logs con `kubectl logs <nombre_pod>` para ver la traza del error de la aplicación. |

---

## 6. Glosario Técnico de Términos

- **CRI (Container Runtime Interface)**: API basada en gRPC que permite a Kubernetes interactuar con diferentes runtimes de contenedores (containerd, CRI-O) sin depender de Docker Engine.
- **Copy-on-Write (CoW)**: Estrategia de optimización donde los recursos compartidos se leen sin duplicación hasta que un proceso intenta modificarlos, momento en el que el kernel realiza una copia privada en la capa de lectura/escritura.
- **Cgroups (Control Groups)**: Característica del kernel de Linux que limita, contabiliza y aísla el uso de recursos físicos (CPU, memoria RAM, I/O de disco, red) de un grupo de procesos.
- **Docker Daemon (`dockerd`)**: Proceso persistente en segundo plano que gestiona los objetos de Docker (imágenes, contenedores, redes y volúmenes) y atiende peticiones de la API REST.
- **Namespaces**: Característica del kernel de Linux que aísla la visibilidad de recursos del sistema para un conjunto de procesos (PID, NET, MNT, IPC, UTS, USER).
- **OCI (Open Container Initiative)**: Proyecto de gobernanza abierta bajo la Linux Foundation que estandariza los formatos de imagen (`image-spec`) y de ejecución (`runtime-spec`) de contenedores.
- **Overlay2**: El storage driver predilecto de Docker para sistemas de archivos UnionFS en Linux, superponiendo capas inmutables (`lowerdir`) con la capa del contenedor (`upperdir`).
- **Pod**: La unidad de ejecución y despliegue más pequeña y básica en Kubernetes, compuesta por uno o varios contenedores que comparten red, almacenamiento e IP.
- **Rolling Update**: Estrategia de despliegue progresivo que reemplaza instancias de una aplicación versión por versión sin incurrir en caídas de servicio.
- **Self-Healing**: Capacidad autónoma del orquestador para monitorizar la salud de los procesos y recrear automáticamente instancias caídas o degradadas.

---
*Documento generado automáticamente por el compilador de Docker Fundamentals 20H.*