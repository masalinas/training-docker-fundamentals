"""
module1.py - Módulo 1 / Día 1: Introducción a Docker, Arquitectura, Seguridad, Imágenes y Dockerfile.
Genera 22 diapositivas técnicas con esquemas visuales y notas de orador completas.
"""

from pptx.util import Inches, Pt
from generator.theme import (
    add_title_slide, add_header, add_card, add_bullet_list, add_code_block,
    add_speaker_notes, add_background, get_blank_layout,
    COLOR_PRIMARY_DARK, COLOR_PRIMARY_BLUE, COLOR_ACCENT_CYAN,
    COLOR_BG_LIGHT, COLOR_CARD_BG, COLOR_CARD_BG_ALT, COLOR_CARD_BORDER,
    COLOR_ALERT_BG, COLOR_ALERT_BORDER, COLOR_ALERT_TEXT,
    COLOR_SUCCESS_BG, COLOR_SUCCESS_BORDER
)
from generator.diagrams import (
    draw_container_vs_vm, draw_engine_architecture, draw_kernel_isolation_box, draw_overlay_storage
)


def build_module1(prs):
    """Construye las 22 diapositivas del Módulo 1 (Día 1)."""
    slides = []

    # Slide 1: Portada del Módulo 1
    s1 = add_title_slide(
        prs,
        title="DOCKER FUNDAMENTALS",
        subtitle="Módulo 1: Introducción, Arquitectura del Motor, Seguridad e Imágenes\nJornada 1 de 4 (5 Horas Lectivas)",
        module_tag="DÍA 1 • FUNDAMENTOS DE CONTENEDORES",
        notes_data={
            "objective": "Dar la bienvenida a los alumnos, presentar los objetivos del curso (20 horas lectivas en 4 días) y contextualizar el papel de Docker como estándar de facto en desarrollo y operaciones.",
            "under_the_hood": "Docker nació en 2013 como un proyecto open source de dotCloud basado en LXC (LinuX Containers). Más tarde evolucionó creando libcontainer y donando las especificaciones OCI (Open Container Initiative).",
            "classroom_prompt": "¿Cuántos de vosotros habéis sufrido el famoso problema de 'en mi máquina sí funciona'? ¿Qué causaba esa discrepancia?",
            "live_demo": "docker version && docker info"
        }
    )
    slides.append(s1)

    # Slide 2: El Reto del Software Moderno
    blank = get_blank_layout(prs)
    s2 = prs.slides.add_slide(blank)
    add_background(s2)
    add_header(s2, "El Reto del Despliegue: Del Monolito a la Matriz Matricial", "Módulo 1 • Contexto")
    c1 = add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Matriz del Infierno (N x M)")
    add_bullet_list(c1.text_frame, [
        "Diversidad de Lenguajes: Node.js, Python, Java, Go, .NET con diferentes versiones de runtime en el mismo servidor.",
        "Dependencias de Sistema: Librerías compartidas (glibc, OpenSSL) que generan conflictos catastróficos entre servicios.",
        "Entornos Heterogéneos: Discrepancias constantes entre portátil local, servidor de pruebas (QA) y clúster de producción.",
        "Deriva de Configuración: Modificaciones manuales no documentadas en máquinas virtuales ('servidores copo de nieve')."
    ])
    c2 = add_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "La Solución de Contenedores")
    add_bullet_list(c2.text_frame, [
        "Inmutabilidad: Empaquetar la aplicación junto con todo su entorno exacto de ejecución en un artefacto autocontenido.",
        "Portabilidad Absoluta: La garantía del contenedor: si arranca en el equipo del desarrollador, se ejecutará idénticamente en la nube.",
        "Arranque en Milisegundos: Al no tener que arrancar un sistema operativo completo, un contenedor inicia como un proceso normal.",
        "Densidad de Carga: Ejecución de cientos de microservicios en el mismo hardware sin la sobrecarga de RAM de múltiples VMs."
    ])
    add_speaker_notes(
        s2,
        objective="Hacer entender al alumno por qué la industria migró masivamente de máquinas virtuales a contenedores.",
        under_the_hood="La metáfora del contenedor marítimo estándar (ISO 668) inventado por Malcolm McLean en 1956: no importa lo que haya dentro (coches, comida) ni cómo se transporte (barco, tren, camión); las grúas operan con la misma interfaz.",
        classroom_prompt="¿Cuánto tarda en arrancar una VM de vSphere o AWS comparado con un proceso en Linux?",
        live_demo="time docker run --rm alpine echo 'Arranque en milisegundos'"
    )
    slides.append(s2)

    # Slide 3: Máquinas Virtuales vs Contenedores
    s3 = prs.slides.add_slide(blank)
    add_background(s3)
    add_header(s3, "Máquinas Virtuales vs Contenedores: Arquitectura Interna", "Módulo 1 • Fundamentos")
    draw_container_vs_vm(s3, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    add_speaker_notes(
        s3,
        objective="Desmitificar el mito de que 'un contenedor es una máquina virtual ligera'. Explicar la diferencia entre emular hardware y compartir el kernel.",
        under_the_hood="Un hipervisor tipo 1 (bare-metal) o tipo 2 virtualiza instrucciones de CPU, tablas de páginas de memoria (SLAT/EPT) y dispositivos de E/S. Un contenedor solo utiliza syscalls directamente sobre el kernel del sistema operativo anfitrión.",
        classroom_prompt="Si ejecutas 'uname -r' dentro de un contenedor Debian y luego en el host Ubuntu, ¿qué versión de kernel ves y por qué?",
        live_demo="uname -r && docker run --rm debian uname -r"
    )
    slides.append(s3)

    # Slide 4: ¿Qué es realmente un contenedor en Linux?
    s4 = prs.slides.add_slide(blank)
    add_background(s4)
    add_header(s4, "¿Qué es un Contenedor? El Secreto del Kernel", "Módulo 1 • Arquitectura de Bajo Nivel")
    c_left = add_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Verdad Técnica")
    add_bullet_list(c_left.text_frame, [
        "No existe la 'entidad contenedor': En el código fuente del kernel de Linux no hay ninguna estructura de datos llamada 'container'.",
        "Un proceso ordinario: Un contenedor es un proceso estándar de Linux (`task_struct`) al que se le han aplicado restricciones de visibilidad y recursos.",
        "Los Tres Pilares del Kernel: Namespaces (visión aislada), Cgroups (cuotas de recursos) y LSM/Capabilities (seguridad).",
        "Coste Cero de Virtualización: La CPU ejecuta las instrucciones del contenedor nativamente en Ring 3 (espacio de usuario)."
    ])
    add_code_block(s4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Ver el proceso del contenedor desde el Host",
        "$ docker run -d --name web-demo nginx",
        "7f8a9b2c...",
        "",
        "# Inspeccionar el PID en el host",
        "$ docker inspect -f '{{.State.Pid}}' web-demo",
        "42150",
        "",
        "# Comprobar que en el host es un proceso normal",
        "$ ps -ef | grep 42150",
        "root 42150 42100 0 10:15 ? 00:00:00 nginx: master",
        "",
        "# Comprobar que dentro del contenedor se ve como PID 1",
        "$ docker exec web-demo ps -ef",
        "UID  PID  PPID  C STIME TTY   TIME CMD",
        "root   1     0  0 10:15 ? 00:00:00 nginx: master"
    ], "Comprobación de Procesos")
    add_speaker_notes(
        s4,
        objective="Demostrar con el comando ps en el host que el contenedor es solo un proceso regular de Linux protegido por el kernel.",
        under_the_hood="Cada proceso en Linux tiene un directorio en /proc/<PID>/ns/ donde residen enlaces simbólicos a sus namespaces activos (pid, net, ipc, mnt, uts, user). Al comparar los enlaces del host con los del proceso del contenedor, vemos que apuntan a IDs de inodo distintos.",
        classroom_prompt="Si mato con 'kill -9 42150' el proceso en el host, ¿qué le ocurrirá al contenedor web-demo?",
        live_demo="docker run -d --name web-test nginx && docker inspect -f '{{.State.Pid}}' web-test && ps -fp $(docker inspect -f '{{.State.Pid}}' web-test)"
    )
    slides.append(s4)

    # Slide 5: Arquitectura del Motor Docker
    s5 = prs.slides.add_slide(blank)
    add_background(s5)
    add_header(s5, "Arquitectura del Motor Docker: Desacoplamiento OCI", "Módulo 1 • Motor Docker")
    draw_engine_architecture(s5, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    add_speaker_notes(
        s5,
        objective="Explicar las capas internas de Docker y la transición histórica de un daemon monolítico a una arquitectura modular estandarizada (OCI).",
        under_the_hood="En las versiones tempranas de Docker, si el daemon dockerd se caía, todos los contenedores morían. Gracias a containerd y containerd-shim, hoy los contenedores sobreviven si el daemon se reinicia (Live Restore).",
        classroom_prompt="¿Qué componente es el que realmente ejecuta la llamada clone() del kernel para arrancar el proceso? (runc)",
        live_demo="ps -ef | grep -E 'dockerd|containerd|containerd-shim'"
    )
    slides.append(s5)

    # Slide 6: Docker-Engine vs Docker.io
    s6 = prs.slides.add_slide(blank)
    add_background(s6)
    add_header(s6, "Docker-Engine vs Docker.io: Paquetes y Distribuciones", "Módulo 1 • Instalación")
    c1 = add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Docker-CE / Docker-Engine (Oficial)")
    add_bullet_list(c1.text_frame, [
        "Origen: Repositorios oficiales mantenidos directamente por Docker Inc.",
        "Versiones Actualizadas: Incluye las últimas mejoras de runtime, compatibilidad OCI, Docker Buildx y Compose v2 integrado.",
        "Paquetes Clave: `docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-buildx-plugin`, `docker-compose-plugin`.",
        "Uso Recomendado: Entornos de producción empresariales y servidores de desarrollo profesional."
    ])
    c2 = add_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Docker.io (Distribuciones Linux)")
    add_bullet_list(c2.text_frame, [
        "Origen: Mantenido por empaquetadores de distribuciones (Debian, Ubuntu) en sus repositorios `apt` estándar.",
        "Versiones Desfasadas: Suele incluir versiones antiguas congeladas para asegurar estabilidad con la versión de la distribución.",
        "Ausencia de Plugins Modernos: A menudo carece de Buildx moderno o el comando `docker compose` unificado.",
        "Riesgos de Compatibilidad: Problemas con sintaxis de Compose moderna o drivers de almacenamiento recientes."
    ])
    add_speaker_notes(
        s6,
        objective="Aclarar una de las confusiones más comunes de los alumnos al instalar Docker en Linux mediante 'apt install docker.io'.",
        under_the_hood="Ubuntu y Debian usan nombres de paquete separados para evitar conflictos de marcas y licencias. Siempre se debe configurar el repositorio oficial upstream con su clave GPG para tener versiones auditadas.",
        classroom_prompt="¿Qué comando usáis habitualmente para instalar Docker en vuestras máquinas Linux?",
        live_demo="apt-cache policy docker-ce docker.io 2>/dev/null || which docker"
    )
    slides.append(s6)

    # Slide 7: Filosofía de Seguridad en Contenedores
    s7 = prs.slides.add_slide(blank)
    add_background(s7)
    add_header(s7, "Filosofía de Seguridad: Defensa en Profundidad", "Módulo 1 • Seguridad")
    draw_kernel_isolation_box(s7, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    add_speaker_notes(
        s7,
        objective="Presentar el modelo de seguridad en capas: aislamiento de visibilidad (namespaces), contención de recursos (cgroups) y minimización de privilegios.",
        under_the_hood="La directiva de seguridad por defecto de Docker aplica un perfil Seccomp con más de 300 syscalls bloqueadas (como reboot, mount, swapon, ioperm) para evitar que un proceso comprometido ataque el kernel.",
        classroom_prompt="Si un atacante consigue root dentro de un contenedor por defecto, ¿es root automáticamente del servidor físico? ¿Por qué sí o por qué no?",
        live_demo="docker run --rm alpine id && docker run --rm alpine sh -c 'reboot || true'"
    )
    slides.append(s7)

    # Slide 8: Linux Namespaces en Detalle
    s8 = prs.slides.add_slide(blank)
    add_background(s8)
    add_header(s8, "Linux Namespaces: Creando la Ilusión de Máquina Privada", "Módulo 1 • Seguridad")
    card_table = add_card(s8, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Los 6 Namespaces Fundamentales del Kernel")
    add_bullet_list(card_table.text_frame, [
        "PID Namespace: Proporciona un árbol de procesos privado. El proceso de entrada del contenedor se convierte en el PID 1, ajeno al resto de procesos del host.",
        "NET Namespace: Proporciona una pila de red completa (loopback privada, interfaz veth propia, tabla de enrutamiento y reglas iptables individuales).",
        "MNT (Mount) Namespace: Aísla la jerarquía del sistema de archivos. Cada contenedor ve su propio rootfs `/` generado por el Union File System.",
        "IPC Namespace: Impide la comunicación por memoria compartida (POSIX/SysV) o semáforos entre procesos de contenedores distintos.",
        "UTS Namespace: Permite que el contenedor tenga su propio hostname y nombre de dominio sin alterar el nombre del servidor anfitrión.",
        "USER Namespace: Asigna el usuario UID 0 (root) dentro del contenedor a un UID no privilegiado (ej. 100000) en el host (Base de Rootless Docker)."
    ], space_after=Pt(12))
    add_speaker_notes(
        s8,
        objective="Detallar los 6 namespaces de Linux y explicar cómo cada uno se encarga de un aspecto diferente del aislamiento.",
        under_the_hood="La syscall clone(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWIPC | CLONE_NEWUTS) es la invocada por runc al crear el proceso.",
        classroom_prompt="¿Por qué es crucial que el contenedor tenga su propio PID 1? ¿Qué responsabilidad tiene el PID 1 con los procesos huérfanos (zombies)?",
        live_demo="docker run --rm alpine hostname && hostname"
    )
    slides.append(s8)

    # Slide 9: Cgroups v1 vs v2 y Control de Recursos
    s9 = prs.slides.add_slide(blank)
    add_background(s9)
    add_header(s9, "Control Groups (Cgroups): Límites y Medición", "Módulo 1 • Seguridad")
    c1 = add_card(s9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Protección de Recursos en el Host")
    add_bullet_list(c1.text_frame, [
        "Evitar Ataques DoS / Vecino Ruidoso: Un contenedor con un bucle infinito o fuga de memoria no debe colapsar el servidor entero.",
        "Límites de Memoria (`--memory`): Control estricto de RAM. Si el contenedor excede su límite, el kernel OOM Killer termina el proceso del contenedor, no el host.",
        "Cuotas de CPU (`--cpus`): Asignación de periodos de CPU mediante el CFS (Completely Fair Scheduler) de Linux.",
        "Cgroups v2 (Moderno): Jerarquía unificada de control en `/sys/fs/cgroup/`, mejor gestión de memoria y presión de E/S (PSI)."
    ])
    add_code_block(s9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Limitar contenedor a 512MB de RAM y 1.5 CPUs",
        "$ docker run -d --name app-limitada \\",
        "    --memory=\"512m\" \\",
        "    --cpus=\"1.5\" \\",
        "    --pids-limit=100 \\",
        "    nginx",
        "",
        "# Monitorizar métricas en tiempo real",
        "$ docker stats app-limitada",
        "CONTAINER ID   NAME            CPU %   MEM USAGE / LIMIT",
        "8a1b2c3d4e     app-limitada    0.05%   4.2MiB / 512MiB",
        "",
        "# Inspeccionar cgroups directamente en Linux",
        "$ cat /sys/fs/cgroup/docker/<ID>/memory.max",
        "536870912"
    ], "Aplicación de Límites")
    add_speaker_notes(
        s9,
        objective="Instruir a los alumnos en el uso de límites de CPU, memoria y PIDs como buena práctica innegociable en producción.",
        under_the_hood="Explicar el OOM Killer (Out Of Memory Killer): el kernel asigna una puntuación oom_score a cada proceso. Al configurar límites de cgroup, el kernel calcula la puntuación dentro del cgroup del contenedor.",
        classroom_prompt="¿Qué ocurre si un contenedor no tiene configurado ningún límite de memoria y sufre una fuga masiva de memoria?",
        live_demo="docker run -d --name mem-test --memory=128m nginx && docker stats --no-stream mem-test && docker rm -f mem-test"
    )
    slides.append(s9)

    # Slide 10: Capabilities de Linux y Rootless Docker
    s10 = prs.slides.add_slide(blank)
    add_background(s10)
    add_header(s10, "Capabilities de Linux y Modo Rootless", "Módulo 1 • Seguridad")
    c1 = add_card(s10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "El Principio de Mínimo Privilegio")
    add_bullet_list(c1.text_frame, [
        "Fraccionando el poder de Root: Linux divide los privilegios de superusuario en ~40 'capabilities' independientes (ej. `CAP_NET_ADMIN`, `CAP_SYS_ADMIN`, `CAP_CHOWN`).",
        "Capabilities por Defecto en Docker: Docker arranca contenedores eliminando capabilities peligrosas (`CAP_SYS_ADMIN`, `CAP_SYS_RAWIO`).",
        "Antipatrón `--privileged`: Proporciona acceso ilimitado a todos los dispositivos del host. ¡Prohibido en producción!",
        "Rootless Docker: Ejecución de dockerd y contenedores completamente bajo una cuenta de usuario sin privilegios en el host."
    ])
    add_code_block(s10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Buenas prácticas: Despojar todas las capabilities",
        "# y conceder únicamente las indispensables",
        "$ docker run -d --name web-secure \\",
        "    --cap-drop=ALL \\",
        "    --cap-add=NET_BIND_SERVICE \\",
        "    nginx",
        "",
        "# Comprobar que no se pueden modificar interfaces",
        "$ docker exec web-secure ip link add dummy0 type dummy",
        "RTNETLINK answers: Operation not permitted",
        "",
        "# Peligro extremo (Antipatrón):",
        "$ docker run --privileged ... # NUNCA EN PRODUCCIÓN"
    ], "Gestión de Capabilities")
    add_speaker_notes(
        s10,
        objective="Enseñar a blindar la ejecución de contenedores eliminando permisos innecesarios y desaconsejando el uso de --privileged.",
        under_the_hood="--privileged no solo otorga todas las capabilities, sino que desactiva los filtros Seccomp, levanta las restricciones de AppArmor/SELinux y expone todos los nodos de /dev del host.",
        classroom_prompt="¿Por qué un servidor web como Nginx en puerto 80 necesita CAP_NET_BIND_SERVICE si se ejecuta como usuario no-root?",
        live_demo="docker run --rm --cap-drop=ALL alpine ping -c 1 8.8.8.8 || true"
    )
    slides.append(s10)

    # Slide 11: ¿Qué es una Imagen en Docker?
    s11 = prs.slides.add_slide(blank)
    add_background(s11)
    add_header(s11, "¿Qué es una Imagen en Docker? La Plantilla Inmutable", "Módulo 1 • Imágenes")
    c1 = add_card(s11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Definición y Propiedades")
    add_bullet_list(c1.text_frame, [
        "Plantilla de Solo Lectura: Archivo binario empaquetado que contiene el código, runtime, librerías del sistema y variables de entorno necesarias para ejecutar una aplicación.",
        "Inmutabilidad Estricta: Una vez creada, una imagen jamás se modifica; para hacer cambios se genera una nueva versión.",
        "Identificador Criptográfico (Digest): Cada capa e imagen se identifica por su hash SHA-256 (`sha256:7b9a...`), garantizando integridad frente a manipulaciones.",
        "Especificación OCI Image Format: Estándar abierto gobernado por la Linux Foundation, compatible con Podman, CRI-O, Containerd y Docker."
    ])
    c2 = add_card(s11, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Anatomía de una Referencia de Imagen")
    add_bullet_list(c2.text_frame, [
        "Estructura Estándar: `[registry]/[namespace]/[repositorio]:[tag]`.",
        "Ejemplo Completo: `docker.io/library/nginx:1.25-alpine`.",
        "Valores por Defecto: Si no se indica registry, se asume `docker.io` (Docker Hub); si no se indica tag, se asume `:latest`.",
        "Peligro del tag `:latest`: No significa necesariamente 'última versión estable', sino la etiqueta por defecto asignada al último build. En producción, fijar siempre versiones semánticas (ej. `:1.25.3-alpine`)."
    ])
    add_speaker_notes(
        s11,
        objective="Fijar el concepto fundamental de imagen como plantilla estática de solo lectura y el peligro del tag :latest.",
        under_the_hood="Una imagen OCI se compone de un Image Manifest (JSON con referencias a los blobs de capas y configuración) y una serie de tarballs comprimidos con gzip o zstd que contienen el diff de cada capa.",
        classroom_prompt="Si descargo 'python:3.11' hoy y vuelvo a descargarlo dentro de 6 meses, ¿tendré exactamente los mismos bytes si la imagen fue actualizada?",
        live_demo="docker inspect --format='{{.RepoDigests}}' nginx:alpine"
    )
    slides.append(s11)

    # Slide 12: Características de una Imagen: Arquitectura de Capas
    s12 = prs.slides.add_slide(blank)
    add_background(s12)
    add_header(s12, "Características de una Imagen: Capas y Caché", "Módulo 1 • Imágenes")
    draw_overlay_storage(s12, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    add_speaker_notes(
        s12,
        objective="Explicar cómo se apilan las capas de solo lectura y por qué múltiples contenedores comparten las mismas capas sin duplicar espacio en disco.",
        under_the_hood="Cada capa es un diff del sistema de archivos. El driver Overlay2 combina los directorios lowerdir (capas de imagen) con el upperdir (capa del contenedor) presentándolo como un único árbol de directorios merged.",
        classroom_prompt="Si 10 contenedores arrancan desde la misma imagen de 500MB, ¿cuánto espacio real en disco ocupan las imágenes base?",
        live_demo="docker image history nginx:alpine"
    )
    slides.append(s12)

    # Slide 13: ¿Qué es un Contenedor en Docker?
    s13 = prs.slides.add_slide(blank)
    add_background(s13)
    add_header(s13, "¿Qué es un Contenedor? La Instancia Viva", "Módulo 1 • Contenedores")
    c1 = add_card(s13, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Relación Clase - Objeto")
    add_bullet_list(c1.text_frame, [
        "Analogía de Programación: La imagen es la **Clase** (definición inmutable); el contenedor es el **Objeto** (instancia viva en memoria).",
        "Añadido de Capa R/W: Al instanciar un contenedor, Docker añade una capa de lectura/escritura muy fina en la parte superior.",
        "Mecanismo Copy-on-Write (CoW): Si el contenedor modifica un archivo de la imagen, el driver copia el archivo a la capa superior antes de modificarlo.",
        "Naturaleza Efímera: Al eliminar el contenedor (`docker rm`), su capa R/W se destruye por completo; la imagen original permanece intacta."
    ])
    add_code_block(s13, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# 1. Instanciar un contenedor a partir de Ubuntu",
        "$ docker run -it --name prueba-cow ubuntu bash",
        "",
        "# 2. Modificar un archivo del sistema",
        "root@abc123:/# echo \"modificado\" >> /etc/issue",
        "",
        "# 3. Salir y ver los cambios en la capa R/W",
        "$ docker diff prueba-cow",
        "C /etc",
        "C /etc/issue    # C = Changed (Copiado a R/W)",
        "A /root/.bash_history  # A = Added",
        "",
        "# 4. La imagen base jamás se altera",
        "$ docker run --rm ubuntu cat /etc/issue"
    ], "Demostración de Copy-on-Write")
    add_speaker_notes(
        s13,
        objective="Hacer entender la diferencia entre estado persistente y capa efímera Copy-on-Write usando docker diff.",
        under_the_hood="Overlay2 utiliza la operación de kernel copy_up cuando un proceso abre en modo escritura (O_WRONLY o O_RDWR) un archivo existente en lowerdir.",
        classroom_prompt="¿Qué penalización de rendimiento tiene modificar por primera vez un archivo de 10GB que reside en una capa de la imagen?",
        live_demo="docker run -d --name c1 nginx && docker diff c1 && docker rm -f c1"
    )
    slides.append(s13)

    # Slide 14: Ciclo de Vida y Estados de un Contenedor
    s14 = prs.slides.add_slide(blank)
    add_background(s14)
    add_header(s14, "Ciclo de Vida y Máquina de Estados del Contenedor", "Módulo 1 • Contenedores")
    c1 = add_card(s14, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Estados Principales")
    add_bullet_list(c1.text_frame, [
        "Created (`docker create`): Se prepara el sistema de archivos y configuración, pero el proceso aún no arranca.",
        "Running (`docker run / start`): El proceso principal (PID 1) está activo en el kernel consumiendo CPU y memoria.",
        "Paused (`docker pause`): Se congelan los procesos usando el cgroup freezer sin liberar memoria RAM.",
        "Exited / Stopped (`docker stop`): Se envía señal SIGTERM (10s de gracia) y luego SIGKILL. El proceso finaliza.",
        "Dead: Estado de error irrecuperable por bloqueo de kernel o fallo en desmontaje de volúmenes."
    ])
    c2 = add_card(s14, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Gestión de Señales UNIX en PID 1")
    add_bullet_list(c2.text_frame, [
        "Parada Limpia (`SIGTERM` - señal 15): Docker notifica al contenedor que debe cerrar conexiones, guardar estado y terminar.",
        "Parada Forzosa (`SIGKILL` - señal 9): Si no finaliza en el periodo de gracia (por defecto 10s), el kernel mata el proceso.",
        "El Problema del Manejador en PID 1: En Linux, el PID 1 ignora por defecto señales si la aplicación no registra un handler explícito.",
        "Herramienta `--init`: Inyecta un gestor init ultraligero (`tini`) para reenviar señales y recolectar procesos zombies."
    ])
    add_speaker_notes(
        s14,
        objective="Enseñar los estados del contenedor y la importancia crítica de cómo el proceso PID 1 gestiona las señales de apagado limpio.",
        under_the_hood="Al ejecutar docker stop, dockerd invoca a containerd para enviar SIGTERM. Tras el timeout (--time), envía SIGKILL. Si la app está empaquetada como script de bash sin 'exec', bash absorbe la señal y la app no se apaga limpiamente.",
        classroom_prompt="¿Por qué a veces 'docker stop' tarda exactamente 10 segundos en parar un contenedor?",
        live_demo="docker create --name c_state alpine && docker ps -a | grep c_state && docker rm c_state"
    )
    slides.append(s14)

    # Slide 15: Comandos Esenciales de Gestión
    s15 = prs.slides.add_slide(blank)
    add_background(s15)
    add_header(s15, "Comandos Esenciales de Operación en el Aula", "Módulo 1 • Operación CLI")
    add_code_block(s15, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), [
        "# Ejecutar en segundo plano con puerto y nombre",
        "$ docker run -d --name mi-nginx -p 8080:80 nginx",
        "",
        "# Listar contenedores activos y todos (incluidos parados)",
        "$ docker ps",
        "$ docker ps -a",
        "",
        "# Ver logs en tiempo real (seguimiento continuo)",
        "$ docker logs -f --tail 50 mi-nginx",
        "",
        "# Ejecutar un comando interactivo dentro del contenedor",
        "$ docker exec -it mi-nginx bash",
        "",
        "# Inspeccionar configuración completa en JSON",
        "$ docker inspect mi-nginx | grep -i IPAddress"
    ], "Comandos de Contenedor")
    add_code_block(s15, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Descargar una imagen desde Docker Hub",
        "$ docker pull redis:7-alpine",
        "",
        "# Listar imágenes locales y su tamaño",
        "$ docker images",
        "",
        "# Detener y eliminar un contenedor",
        "$ docker stop mi-nginx",
        "$ docker rm mi-nginx",
        "",
        "# Limpieza global del sistema (espacio en disco)",
        "$ docker system df",
        "$ docker system prune -af --volumes",
        "# Elimina contenedores parados, redes y capas huérfanas"
    ], "Gestión de Imágenes y Limpieza")
    add_speaker_notes(
        s15,
        objective="Familiarizar a los alumnos con los comandos que utilizarán el 90% del tiempo en la terminal.",
        under_the_hood="Docker 1.13 introdujo la sintaxis estructurada por objetos: docker container run, docker image ls, docker volume ls, docker network ls. Ambos formatos siguen vigentes.",
        classroom_prompt="¿Cuál es la diferencia entre 'docker run' y 'docker start'?",
        live_demo="docker run -d --name demo-cli -p 8080:80 nginx:alpine && curl -I http://localhost:8080 && docker rm -f demo-cli"
    )
    slides.append(s15)

    # Slide 16: Creación de Imágenes mediante Dockerfile
    s16 = prs.slides.add_slide(blank)
    add_background(s16)
    add_header(s16, "Automatizando la Creación: El Dockerfile", "Módulo 1 • Dockerfile")
    c1 = add_card(s16, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Infraestructura como Código (IaC)")
    add_bullet_list(c1.text_frame, [
        "Fichero Declarativo: Archivo de texto plano con instrucciones secuenciales que definen paso a paso cómo construir una imagen.",
        "Reproducibilidad Total: El Dockerfile se almacena en Git junto al código fuente de la aplicación, permitiendo auditoría y control de versiones.",
        "Construcción Paso a Paso: Cada instrucción (`RUN`, `COPY`, `ADD`) genera una nueva capa intermedia en el sistema de almacenamiento.",
        "Motor BuildKit: El compilador moderno de Docker que ejecuta análisis de dependencias y paraleliza capas independientes."
    ])
    add_code_block(s16, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Dockerfile de ejemplo para aplicación Node.js",
        "FROM node:20-alpine",
        "",
        "# Definir directorio de trabajo en el contenedor",
        "WORKDIR /usr/src/app",
        "",
        "# Copiar dependencias y compilar",
        "COPY package*.json ./",
        "RUN npm ci --only=production",
        "",
        "# Copiar código fuente",
        "COPY . .",
        "",
        "# Exponer puerto y usuario sin privilegios",
        "USER node",
        "EXPOSE 3000",
        "",
        "# Comando de arranque",
        "CMD [\"node\", \"server.js\"]"
    ], "Estructura de un Dockerfile")
    add_speaker_notes(
        s16,
        objective="Introducir la sintaxis y filosofía del Dockerfile como receta auditable y reproducible.",
        under_the_hood="BuildKit utiliza un formato intermedio llamado LLB (Low-Level Builder), similar a LLVM en compiladores, permitiendo cachear operaciones y resolver grafos acíclicos dirigidos (DAGs) de construcción.",
        classroom_prompt="¿Por qué copiamos package.json antes que el resto de archivos de la aplicación?",
        live_demo="DOCKER_BUILDKIT=1 docker build --help | head -n 10"
    )
    slides.append(s16)

    # Slide 17: Instrucciones Clave en Dockerfile
    s17 = prs.slides.add_slide(blank)
    add_background(s17)
    add_header(s17, "Directivas Fundamentales de Dockerfile", "Módulo 1 • Dockerfile")
    c1 = add_card(s17, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Directivas de Entorno y Sistema")
    add_bullet_list(c1.text_frame, [
        "`FROM <imagen>:<tag>`: Establece la imagen base. Debe ser la primera instrucción obligatoria.",
        "`WORKDIR /ruta`: Establece el directorio de trabajo para todas las instrucciones siguientes (evita usar múltiples `cd`).",
        "`COPY <origen> <destino>`: Copia archivos y carpetas locales del host al sistema de archivos de la imagen.",
        "`ENV CLAVE=VALOR`: Define variables de entorno que persisten tanto durante el build como al arrancar el contenedor.",
        "`EXPOSE <puerto>`: Documenta qué puerto escucha el servicio (metadato informativo, no abre el puerto en el host)."
    ])
    c2 = add_card(s17, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "CMD vs ENTRYPOINT")
    add_bullet_list(c2.text_frame, [
        "`RUN <comando>`: Ejecuta comandos durante la fase de construcción (ej. `apt-get install`) y crea una nueva capa.",
        "`ENTRYPOINT [\"ejecutable\"]`: Define el comando fijo inamovible que siempre se ejecutará al iniciar el contenedor.",
        "`CMD [\"param1\", \"param2\"]`: Parámetros por defecto que se pasan a ENTRYPOINT o comando por defecto anulable.",
        "Sintaxis Exec (Recomendada): Siempre usar corchetes y comillas dobles `[\"prog\", \"arg\"]` para que se ejecute directamente como PID 1 sin invocar una subshell `/bin/sh -c`."
    ])
    add_speaker_notes(
        s17,
        objective="Clarificar la diferencia vital entre RUN (momento build) y CMD/ENTRYPOINT (momento ejecución), y la diferencia entre la forma exec y shell.",
        under_the_hood="La forma shell 'CMD node app.js' arranca '/bin/sh -c node app.js'. En este caso el PID 1 es sh, lo que impide que las señales SIGTERM lleguen a node.",
        classroom_prompt="¿Cuál es la diferencia entre EXPOSE 80 en el Dockerfile y -p 8080:80 en docker run?",
        live_demo="docker run --rm alpine sh -c 'echo Formato shell vs exec'"
    )
    slides.append(s17)

    # Slide 18: Buenas Prácticas y Optimización de Caché
    s18 = prs.slides.add_slide(blank)
    add_background(s18)
    add_header(s18, "Buenas Prácticas: Optimización de Capas y Caché", "Módulo 1 • Optimización")
    c1 = add_card(s18, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Aprovechamiento de la Caché de Build")
    add_bullet_list(c1.text_frame, [
        "De lo Menos Cambiante a lo Más Frecuente: Colocar las instrucciones que rara vez cambian (OS, runtimes, dependencias) al inicio del Dockerfile.",
        "Invalidación en Cascada: En cuanto una capa cambia (ej. un `COPY . .`), todas las capas posteriores invalidan su caché y se reconstruyen.",
        "Uso de `.dockerignore`: Excluir carpetas pesadas (`node_modules`, `.git`, temporales) para no inflar el build context ni invalidar caché accidentalmente.",
        "Encadenar Comandos RUN: Concatenar `RUN apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*` en una única capa para no almacenar caché de paquetes."
    ])
    add_code_block(s18, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# ANTIPATRÓN (Invalida caché en cada cambio de código):",
        "COPY . .",
        "RUN npm install  # ¡Se ejecuta siempre, muy lento!",
        "",
        "# BUENA PRÁCTICA (Aprovecha caché de dependencias):",
        "COPY package*.json ./",
        "RUN npm ci       # Solo se ejecuta si cambia package.json",
        "COPY . .         # Si solo cambia el código, usa caché previa",
        "",
        "# Ejemplo de limpieza de paquetes en una sola capa:",
        "RUN apt-get update && apt-get install -y --no-install-recommends \\",
        "    curl \\",
        "    ca-certificates \\",
        " && rm -rf /var/lib/apt/lists/*"
    ], "Comparativa de Patrones")
    add_speaker_notes(
        s18,
        objective="Hacer entender que el orden de las instrucciones en el Dockerfile determina directamente la velocidad del pipeline de CI/CD.",
        under_the_hood="Docker calcula un checksum SHA de los archivos copiados en cada instrucción COPY. Si el hash coincide con la caché local, omite la ejecución del paso.",
        classroom_prompt="Si en un RUN haces 'apt-get update' y en otro RUN separado haces 'apt-get install', ¿qué problema de caché puede ocurrir con el tiempo?",
        live_demo="docker build --help | grep cache"
    )
    slides.append(s18)

    # Slide 19: Multi-Stage Builds (Construcción Multietapa)
    s19 = prs.slides.add_slide(blank)
    add_background(s19)
    add_header(s19, "Multi-Stage Builds: Seguridad y Mínimo Tamaño", "Módulo 1 • Optimización")
    c1 = add_card(s19, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "¿Por qué Multi-Stage?")
    add_bullet_list(c1.text_frame, [
        "Separar Compilación de Ejecución: Un entorno de build necesita compiladores (gcc, go, maven, npm, SDKs completos) que pesan gigabytes.",
        "Producción Limpia: En producción solo necesitamos el artefacto binario y el runtime mínimo indispensable.",
        "Reducción Drástica de Vulnerabilidades: Al no incluir compiladores ni herramientas de build en la imagen final, reducimos los CVEs al mínimo.",
        "Imágenes Distroless y Alpine: Crear imágenes finales con tamaños de 5MB a 30MB en lugar de 1.5GB."
    ])
    add_code_block(s19, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# ETAPA 1: Compilación (Builder)",
        "FROM golang:1.22-alpine AS builder",
        "WORKDIR /app",
        "COPY . .",
        "RUN CGO_ENABLED=0 go build -ldflags=\"-s -w\" -o mi-app",
        "",
        "# ETAPA 2: Runtime de Producción (Final)",
        "FROM alpine:3.19",
        "WORKDIR /app",
        "# Copiar ÚNICAMENTE el binario de la etapa anterior",
        "COPY --from=builder /app/mi-app .",
        "USER guest",
        "EXPOSE 8080",
        "CMD [\"./mi-app\"]",
        "# Resultado: De una imagen de 800MB a una de solo 12MB"
    ], "Ejemplo Multi-Stage")
    add_speaker_notes(
        s19,
        objective="Presentar los Multi-Stage Builds como el estándar profesional obligatorio para construir imágenes listas para producción.",
        under_the_hood="Antes de Multi-stage (introducido en Docker 17.05), los ingenieros tenían que usar scripts complejos de shell que montaban volúmenes de build y luego copiaban los artefactos a otro Dockerfile (Builder Pattern).",
        classroom_prompt="¿Por qué dejar herramientas como gcc, git o curl en una imagen de producción facilita el trabajo a un atacante que consiga inyección remota de comandos?",
        live_demo="docker build -t test-multistage - <<EOF\nFROM alpine AS b\nRUN echo hi > /hi\nFROM scratch\nCOPY --from=b /hi /hi\nEOF\ndocker image ls test-multistage"
    )
    slides.append(s19)

    # Slide 20: Introducción a Microservicios con Docker
    s20 = prs.slides.add_slide(blank)
    add_background(s20)
    add_header(s20, "Docker y la Arquitectura de Microservicios", "Módulo 1 • Arquitectura")
    c1 = add_card(s20, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Regla de Oro: Un Proceso por Contenedor")
    add_bullet_list(c1.text_frame, [
        "Desacoplamiento Funcional: No intentar meter Apache, PHP y MySQL en el mismo contenedor como si fuera un servidor VPS tradicional.",
        "Ciclos de Vida Independientes: Cada microservicio debe poder escalarse, actualizarse o reiniciarse sin afectar al resto.",
        "Facilidad de Diagnóstico: Cuando un contenedor falla, sus logs (`docker logs`) reflejan únicamente la salida de ese servicio específico.",
        "Superficie de Fallo Acotada: Si el microservicio de pagos tiene un memory leak, el microservicio de catálogo de productos continúa funcionando intacto."
    ])
    c2 = add_card(s20, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Retos Emergentes")
    add_bullet_list(c2.text_frame, [
        "Comunicación entre Servicios: ¿Cómo hablan entre sí los microservicios sin acoplar direcciones IP fijas? (Respuesta: Redes en Módulo 2).",
        "Persistencia de Datos: Si los contenedores son efímeros, ¿dónde guardamos los datos de base de datos? (Respuesta: Volúmenes en Módulo 3).",
        "Despliegue Multi-Contenedor: Arrancar 15 servicios con `docker run` individual es inviable. Se requiere orquestación (Docker Compose y Kubernetes en Módulo 5).",
        "Observabilidad: Monitorización centralizada de logs, métricas y trazas distribuidas."
    ])
    add_speaker_notes(
        s20,
        objective="Establecer las bases arquitectónicas de microservicios y anticipar los problemas que resolveremos en los Módulos 2 (Redes) y 3 (Volúmenes).",
        under_the_hood="El antipatrón de usar systemd dentro de un contenedor: intentar arrancar un init completo obliga a conceder capabilities elevadas y rompe la monitorización de salud de procesos de Docker.",
        classroom_prompt="¿Qué ventajas e inconvenientes tiene separar una tienda online en 4 contenedores (frontend, backend, redis, postgres) vs un solo monolito?",
        live_demo="docker ps"
    )
    slides.append(s20)

    # Slide 21: Laboratorio Práctico 1
    s21 = prs.slides.add_slide(blank)
    add_background(s21)
    add_header(s21, "Laboratorio 1: Ciclo de Vida y Creación de Imágenes", "Día 1 • Práctica")
    card_lab = add_card(s21, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Objetivos y Pasos del Ejercicio Práctico")
    add_bullet_list(card_lab.text_frame, [
        "Paso 1: Verificar el entorno local y versiones (`docker version`, `docker info`).",
        "Paso 2: Descargar e interactuar con imágenes base (`docker run -it alpine sh`, explorar `uname -a` y procesos).",
        "Paso 3: Crear una aplicación web sencilla en Python/Flask o Node.js y redactar su `Dockerfile` optimizado.",
        "Paso 4: Construir la imagen con tag semántico (`docker build -t mi-app:1.0 .`).",
        "Paso 5: Arrancar el contenedor publicando el puerto hacia el host (`docker run -d -p 8080:5000 --name web mi-app:1.0`).",
        "Paso 6: Probar la aplicación con `curl http://localhost:8080`, inspeccionar logs con `docker logs -f` y comprobar el consumo de recursos con `docker stats`.",
        "Paso 7: Detener y limpiar recursos (`docker stop`, `docker rm`)."
    ], space_after=Pt(10))
    add_speaker_notes(
        s21,
        objective="Guiar a los alumnos en su primer laboratorio práctico guiado de 60-75 minutos para afianzar todos los comandos vistos en la jornada 1.",
        under_the_hood="Estar atento a los errores comunes de los alumnos: olvidar el punto final en 'docker build -t app .', puertos ya ocupados en el host (ej. 80 o 8080 ocupado por otro servicio), y permisos en Docker socket si no añadieron su usuario al grupo docker.",
        classroom_prompt="¿Quién ha tenido un fallo al compilar por olvidar el punto final del build context?",
        live_demo="mkdir -p /tmp/lab1 && echo 'FROM nginx:alpine\nRUN echo \"<h1>Lab 1 Exitoso</h1>\" > /usr/share/nginx/html/index.html' > /tmp/lab1/Dockerfile && docker build -t lab1:1.0 /tmp/lab1 && docker run -d --name lab1-demo -p 8888:80 lab1:1.0 && curl http://localhost:8888 && docker rm -f lab1-demo"
    )
    slides.append(s21)

    # Slide 22: Resumen del Día 1 y Cierre
    s22 = add_title_slide(
        prs,
        title="RESUMEN DE LA JORNADA 1",
        subtitle="Conceptos consolidados: Kernel de Linux, Namespaces, Cgroups, Imágenes OCI, Dockerfile y Ciclo de Vida.\nPróxima Jornada: Módulo 2 (Redes a fondo) y Módulo 3 (Persistencia y Volúmenes).",
        module_tag="DÍA 1 • CONCLUSIÓN",
        notes_data={
            "objective": "Recapitular los aprendizajes de las 5 horas del Día 1, resolver dudas abiertas y hacer el puente pedagógico hacia el Día 2.",
            "under_the_hood": "Recordar a los alumnos que mañana veremos cómo se comunican estos contenedores entre sí mediante redes bridge y cómo resolvemos el reto de la persistencia de datos.",
            "classroom_prompt": "¿Cuál ha sido el concepto técnico que más os ha sorprendido hoy sobre cómo funcionan realmente los contenedores?",
            "live_demo": "docker ps -a"
        }
    )
    slides.append(s22)

    return slides
