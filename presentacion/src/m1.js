'use strict';
/**
 * m1.js — Módulo 1 (Día 1): Introducción a Contenedores, Arquitectura, Seguridad, Imágenes y Dockerfile.
 * Genera 22 diapositivas con el sistema de diseño corporativo de alta fidelidad.
 */
const H = require('./layout_helpers');
const D = require('./diagrams');

const {
  COL, CX, CY, CW, CH,
  slide, titleSlide, divider, closing,
  card, cardsRow, cardsGrid, code, table, steps, stat, callout
} = H;

function buildModule1(pres) {
  // ─── Diapositiva 1: Portada Principal del Curso ───
  titleSlide(pres, {
    title: 'DOCKER FUNDAMENTALS',
    subtitle: 'Módulo 1: Introducción a Contenedores, Arquitectura del Motor, Seguridad e Imágenes\nJornada 1 de 4 · 5 Horas Lectivas (20h totales)',
    tag: 'CURSO TÉCNICO OFICIAL · 20 HORAS',
    notes: {
      obj: 'Dar la bienvenida a los alumnos, presentar la estructura formativa de 20 horas (4 días de 5 horas) y contextualizar el papel de Docker como estándar industrial de facto.',
      guion: [
        'Docker revolucionó la industria en 2013 al estandarizar el empaquetado de aplicaciones basándose en capacidades preexistentes del kernel de Linux (LXC, cgroups, namespaces).',
        'Evolucionó creando libcontainer y donando las especificaciones centrales a la Open Container Initiative (OCI), lo que garantiza portabilidad absoluta entre entornos.',
        'Durante esta primera jornada de 5 horas dominaremos los fundamentos internos, la arquitectura del motor, el modelo de aislamiento del kernel y la creación profesional de imágenes mediante Dockerfile.'
      ],
      preguntas: '¿Cuántos de vosotros habéis sufrido el síndrome de "en mi máquina funciona pero en producción falla"? ¿Qué discrepancias de entorno solían originarlo?',
      lab: 'Comprobación de conectividad y entorno local: ejecutar `docker version` y `docker info` para verificar que el socket del motor responde sin requerir sudo.'
    }
  });

  // ─── Diapositiva 2: El Reto del Despliegue de Software ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Contexto e Historia',
      title: 'El Reto del Despliegue: Del Monolito a la Matriz Matricial',
      notes: {
        obj: 'Hacer entender al alumno por qué la industria migró de servidores físicos y máquinas virtuales a contenedores.',
        guion: [
          'Analizar la "Matriz del Infierno": N aplicaciones desarrolladas con distintas versiones de Python, Node.js o Java, desplegadas sobre M entornos físicos, virtuales y en la nube.',
          'La metáfora del contenedor marítimo estándar (ISO 668 de 1956): no importa el contenido ni el medio de transporte; la interfaz de carga y manipulación es universal.',
          'El contenedor proporciona inmutabilidad: el artefacto generado por el desarrollador es bit a bit el mismo que se ejecuta en producción.'
        ],
        preguntas: '¿Cuánto tiempo tarda vuestra organización en preparar un nuevo entorno para un desarrollador o desplegar un parche urgente en producción?',
        lab: 'Ejecutar `time docker run --rm alpine echo "Arranque en milisegundos"` para observar la velocidad de inicio de un proceso contenedorizado.'
      }
    });

    cardsRow(s, [
      {
        title: 'La Matriz del Infierno (N x M)',
        icon: 'FaExclamationTriangle',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Diversidad de Runtimes:', text: 'Coexistencia forzada de Node.js, Python, Java y Go con versiones en conflicto.' },
          { lead: 'Librerías Compartidas:', text: 'Dependencias del sistema (glibc, OpenSSL) que rompen servicios al actualizar el host.' },
          { lead: 'Entornos Heterogéneos:', text: 'Discrepancias críticas entre el portátil local, el servidor de QA y producción.' },
          { lead: 'Deriva de Configuración:', text: 'Modificaciones manuales no documentadas en servidores ("servidores copo de nieve").' }
        ]
      },
      {
        title: 'La Solución de Contenedores',
        icon: 'FaDocker',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Inmutabilidad:', text: 'La aplicación se empaqueta junto a todo su entorno de ejecución exacto y probado.' },
          { lead: 'Portabilidad Absoluta:', text: 'Garantía OCI: si arranca en local, arrancará de forma idéntica en cualquier nube.' },
          { lead: 'Arranque en Milisegundos:', text: 'Sin arranque de sistema operativo virtual; inicia como un proceso nativo del host.' },
          { lead: 'Alta Densidad:', text: 'Cientos de microservicios en el mismo hardware sin sobrecarga de hipervisores redundantes.' }
        ]
      }
    ], { y: CY, h: 3.6 });

    callout(s, {
      x: CX, y: CY + 3.8, w: CW, h: 1.0,
      kind: 'tip',
      lead: 'PRINCIPIO CLAVE:',
      text: 'Un contenedor no virtualiza hardware ni emula instrucciones de CPU. Es un proceso aislado ejecutado directamente sobre el kernel de Linux compartiendo sus recursos con coste cero de emulación.'
    });
  }

  // ─── Diapositiva 3: Máquinas Virtuales vs Contenedores ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Arquitectura Comparada',
      title: 'Máquinas Virtuales vs Contenedores: Arquitectura Interna',
      notes: {
        obj: 'Desmitificar que un contenedor es una máquina virtual ligera. Comparar la virtualización por hipervisor frente al aislamiento a nivel de sistema operativo.',
        guion: [
          'Las máquinas virtuales introducen un Hipervisor (Tipo 1 o Tipo 2) que emula controladores de hardware, tablas de páginas y tarjetas de red virtuales.',
          'Cada VM carga un kernel completo en memoria RAM (500MB a 2GB de overhead por máquina solo para el sistema operativo huésped).',
          'Los contenedores comparten un único kernel de Linux en el host. La CPU ejecuta las instrucciones del contenedor nativamente en Ring 3 (espacio de usuario).'
        ],
        preguntas: 'Si ejecutamos "uname -r" dentro de un contenedor Debian y luego en el host anfitrión Ubuntu, ¿qué versión vemos y por qué?',
        lab: 'Comprobar en la terminal: `uname -r && docker run --rm debian uname -r`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Máquinas Virtuales (Hardware)',
        icon: 'FaServer',
        tone: 'light',
        bullets: [
          { lead: 'Nivel de Abstracción:', text: 'Emulación de hardware físico mediante hipervisor (KVM, ESXi, Hyper-V).' },
          { lead: 'Sobrecarga de SO:', text: 'Cada VM requiere su propio kernel, módulos y demonios del sistema completo.' },
          { lead: 'Uso de Memoria:', text: 'Consumo base de gigabytes por instancia antes de arrancar la aplicación.' },
          { lead: 'Tiempo de Arranque:', text: 'Minutos (proceso completo de POST de BIOS virtual, inicio de kernel y systemd).' },
          { lead: 'Aislamiento:', text: 'Fuerte aislamiento asistido por hardware (VT-x, AMD-V, SLAT).' }
        ]
      },
      {
        title: 'Contenedores (Sistema Operativo)',
        icon: 'FaCubes',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Nivel de Abstracción:', text: 'Aislamiento a nivel de procesos mediante primitivas nativas del kernel Linux.' },
          { lead: 'Kernel Compartido:', text: 'Todos los contenedores utilizan el kernel del host sin kernels huéspedes.' },
          { lead: 'Uso de Memoria:', text: 'Megabytes despreciables de sobrecarga; solo consume la memoria de la aplicación.' },
          { lead: 'Tiempo de Arranque:', text: 'Milisegundos (equivalente a invocar un fork/clone de un proceso nativo).' },
          { lead: 'Aislamiento:', text: 'Aislamiento lógico vía Namespaces, Control Groups y perfiles Seccomp/AppArmor.' }
        ]
      }
    ], { y: CY, h: 4.8 });
  }

  // ─── Diapositiva 4: ¿Qué es realmente un contenedor en Linux? ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Bajo el Capó',
      title: '¿Qué es un Contenedor? El Secreto del Kernel de Linux',
      notes: {
        obj: 'Demostrar que en el código fuente de Linux no existe el objeto "contenedor"; es solo un proceso regular con restricciones de visibilidad y cuotas.',
        guion: [
          'Explicar la estructura de datos `task_struct` en el código fuente de Linux.',
          'Cada proceso tiene en `/proc/<PID>/ns/` enlaces simbólicos a sus namespaces activos.',
          'Con `ps -ef` en el host vemos exactamente el mismo proceso que dentro del contenedor se ve como PID 1.',
          'Si enviamos un `kill -9` al PID en el host, el contenedor muere instantáneamente porque es el mismo proceso.'
        ],
        preguntas: 'Si un contenedor es solo un proceso, ¿qué ocurre si un atacante escapa del contenedor? ¿En qué usuario aterriza?',
        lab: 'Lanzar un Nginx en segundo plano, inspeccionar su PID con `docker inspect` y buscarlo en el árbol de procesos del sistema anfitrión.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'La Verdad Técnica sobre Contenedores',
      icon: 'FaMicrochip',
      tone: 'light',
      bullets: [
        { lead: 'No hay entidad contenedor:', text: 'En el código fuente del kernel no existe ninguna estructura llamada "container".' },
        { lead: 'Proceso Ordinario:', text: 'Un contenedor es un proceso estándar de Linux (`task_struct`) con visibilidad y recursos limitados.' },
        { lead: 'Los Tres Pilares:', text: 'Namespaces (lo que ve), Cgroups (lo que consume) y Capabilities/LSM (lo que puede ejecutar).' },
        { lead: 'Rendimiento Nativo:', text: 'La CPU ejecuta las instrucciones del contenedor en Ring 3 con acceso directo al bus de memoria.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'COMPROBACIÓN DE PROCESOS EN HOST Y CONTENEDOR',
      code: [
        '# 1. Arrancar un contenedor web en segundo plano',
        '$ docker run -d --name web-demo nginx:alpine',
        '7f8a9b2c3d4e...',
        '',
        '# 2. Obtener el PID asignado por el host',
        '$ docker inspect -f \'{{.State.Pid}}\' web-demo',
        '42150',
        '',
        '# 3. Comprobar que en el host es un proceso normal',
        '$ ps -fp 42150',
        'UID    PID   PPID  CMD',
        'root  42150 42100  nginx: master process /usr/sbin/nginx',
        '',
        '# 4. Comprobar que dentro del contenedor se ve como PID 1',
        '$ docker exec web-demo ps -ef',
        'UID   PID  PPID  CMD',
        'root    1     0  nginx: master process /usr/sbin/nginx'
      ].join('\n')
    });
  }

  // ─── Diapositiva 5: Arquitectura del Motor Docker ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Arquitectura Interna',
      title: 'Arquitectura del Motor Docker: Desacoplamiento OCI',
      notes: {
        obj: 'Explicar las capas internas del motor y la transición de un daemon monolítico a una arquitectura modular conforme a estándares OCI.',
        guion: [
          'Históricamente, si el daemon dockerd se detenía o actualizaba, todos los contenedores en ejecución morían.',
          'Hoy en día dockerd delega en containerd (gestor del ciclo de vida) y este en runc (ejecutable OCI que hace los clone() y namespaces).',
          'Gracias a containerd-shim y la opción Live Restore, el daemon puede reiniciarse o actualizarse sin interrumpir el tráfico de los contenedores.'
        ],
        preguntas: '¿Qué estándar gobierna el formato de imágenes y el runtime de ejecución? (Open Container Initiative - OCI).',
        lab: 'Inspeccionar los procesos del motor con `ps -ef | grep -E "dockerd|containerd|containerd-shim"`.'
      }
    });

    D.dockerEngineArchitecture(s, { x: CX, y: CY, w: CW, h: CH });
  }

  // ─── Diapositiva 6: Docker-Engine vs Docker.io ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Instalación y Paquetería',
      title: 'Docker-Engine vs Docker.io: Paquetes y Distribuciones',
      notes: {
        obj: 'Aclarar una de las confusiones más comunes en Linux: la diferencia entre el paquete oficial de Docker Inc y el empaquetado por las distribuciones.',
        guion: [
          'El paquete "docker.io" de los repositorios de Ubuntu/Debian suele estar meses o años desfasado y no incluye los plugins modernos.',
          'El paquete oficial "docker-ce" (Community Edition) proporciona las últimas actualizaciones de seguridad, Buildx y Docker Compose v2.',
          'Siempre se debe añadir el repositorio oficial de Docker (`download.docker.com`) con su clave GPG para servidores de desarrollo y producción.'
        ],
        preguntas: '¿Qué problemas pueden ocurrir si ejecutamos un fichero docker-compose.yml moderno sobre una versión antigua de docker.io?',
        lab: 'Verificar la procedencia del paquete instalado con `apt-cache policy docker-ce docker.io`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Docker-CE / Docker-Engine (Oficial)',
        icon: 'FaDocker',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Origen Oficial:', text: 'Mantenido directamente por Docker Inc en repositorios dedicados para Debian/Ubuntu/RHEL.' },
          { lead: 'Versiones Al Día:', text: 'Incluye los últimos parches de seguridad del kernel, mejoras de OCI y rendimiento.' },
          { lead: 'Plugins Modernos:', text: 'Paquetes `docker-buildx-plugin` y `docker-compose-plugin` (v2 integrado en el CLI).' },
          { lead: 'Estándar Profesional:', text: 'La opción recomendada para entornos de desarrollo corporativo y producción.' }
        ]
      },
      {
        title: 'Docker.io (Distribuciones Linux)',
        icon: 'FaExclamationTriangle',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Origen Distribución:', text: 'Mantenido por los empaquetadores de Debian/Ubuntu para compatibilidad estática.' },
          { lead: 'Versiones Congeladas:', text: 'Suele incluir versiones antiguas con vulnerabilidades corregidas tardíamente.' },
          { lead: 'Sin Plugins Nativos:', text: 'Carece habitualmente de Buildx avanzado y requiere el viejo script de Compose v1.' },
          { lead: 'Riesgos de Compatibilidad:', text: 'Fallo al interpretar directivas de build modernas y drivers de red recientes.' }
        ]
      }
    ], { y: CY, h: 3.5 });

    callout(s, {
      x: CX, y: CY + 3.75, w: CW, h: 1.05,
      kind: 'warn',
      lead: 'AVISO DE INSTALACIÓN:',
      text: 'Evitar `apt-get install docker.io`. En entornos corporativos configurar siempre el repositorio oficial `https://download.docker.com/linux/ubuntu` con clave GPG e instalar el paquete `docker-ce`.'
    });
  }

  // ─── Diapositiva 7: Filosofía de Seguridad y Defensa en Profundidad ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Seguridad',
      title: 'Filosofía de Seguridad: Defensa en Profundidad',
      notes: {
        obj: 'Presentar el modelo de seguridad en capas: aislamiento de visibilidad (namespaces), contención de recursos (cgroups) y minimización de privilegios.',
        guion: [
          'El modelo de seguridad de Docker no depende de una única barrera sino de capas concéntricas defensivas.',
          'Por defecto, Docker aplica un perfil Seccomp con más de 300 syscalls bloqueadas (como reboot, mount, swapon, ioperm).',
          'Incluso si un atacante obtiene root en el contenedor, el kernel le prohíbe realizar operaciones que afecten al anfitrión.'
        ],
        preguntas: 'Si un atacante consigue ser root en un contenedor por defecto, ¿puede reiniciar el servidor físico con el comando reboot?',
        lab: 'Probar a ejecutar reboot dentro de un contenedor: `docker run --rm alpine reboot` y observar el error Operation not permitted.'
      }
    });

    D.kernelIsolationDiagram(s, { x: CX, y: CY, w: CW, h: CH });
  }

  // ─── Diapositiva 8: Linux Namespaces en Detalle ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Aislamiento del Kernel',
      title: 'Linux Namespaces: Creando la Ilusión de Máquina Privada',
      notes: {
        obj: 'Detallar los 6 namespaces del kernel de Linux y cómo cada uno proporciona aislamiento a una dimensión del sistema operativo.',
        guion: [
          'Explicar cómo la syscall clone() combina las flags CLONE_NEW* para crear el proceso.',
          'PID: árbol de procesos propio; NET: interfaces virtuales y puertos; MNT: puntos de montaje; IPC: memoria compartida; UTS: hostname; USER: asignación de UID.',
          'El User Namespace es la clave del modo Rootless, permitiendo que el root dentro del contenedor sea un UID no privilegiado (ej. 100000) en el host.'
        ],
        preguntas: '¿Por qué es fundamental que cada contenedor tenga su propio UTS namespace? (Permite nombres de host independientes).',
        lab: 'Verificar el hostname aislado: `hostname && docker run --rm alpine hostname`.'
      }
    });

    cardsGrid(s, [
      {
        title: 'PID Namespace (Procesos)',
        icon: 'FaMicrochip',
        body: 'Aísla el árbol de procesos. El proceso del contenedor se convierte en PID 1 dentro de su espacio, sin ver ni poder enviar señales a los procesos del host.'
      },
      {
        title: 'NET Namespace (Red)',
        icon: 'FaNetworkWired',
        body: 'Aísla interfaces de red (lo, eth0), tablas de enrutamiento y puertos TCP/UDP. Dos contenedores pueden escuchar en el puerto 80 sin colisionar.'
      },
      {
        title: 'MNT Namespace (Montajes)',
        icon: 'FaFolderOpen',
        body: 'Aísla la jerarquía de directorios. Cada contenedor tiene su propia raíz `/` provista por el UnionFS sin acceso al sistema de archivos del anfitrión.'
      },
      {
        title: 'IPC Namespace (Memoria)',
        icon: 'FaExchangeAlt',
        body: 'Aísla colas de mensajes POSIX, semáforos SysV y segmentos de memoria compartida, impidiendo que procesos de diferentes contenedores se comuniquen indebidamente.'
      },
      {
        title: 'UTS Namespace (Host & Dominio)',
        icon: 'FaDesktop',
        body: 'Permite definir un hostname y nombre de dominio NIS independiente para cada contenedor sin alterar la configuración del servidor host.'
      },
      {
        title: 'USER Namespace (Usuarios)',
        icon: 'FaUserShield',
        body: 'Mapea el UID 0 (root) del contenedor a un usuario sin privilegios en el host (ej. UID 100000), base fundamental de la arquitectura Rootless.'
      }
    ], { cols: 3, y: CY, h: CH });
  }

  // ─── Diapositiva 9: Control Groups (Cgroups) y Control de Recursos ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Contención de Recursos',
      title: 'Control Groups (Cgroups): Límites y Protección del Host',
      notes: {
        obj: 'Instruir a los alumnos en el uso de límites de CPU, memoria y PIDs como buena práctica obligatoria en producción.',
        guion: [
          'El problema del "vecino ruidoso" (noisy neighbor): un contenedor con un bucle infinito o una fuga de memoria puede tirar el servidor entero.',
          'Cgroups v2 introduce una jerarquía unificada en `/sys/fs/cgroup` con métricas de presión de recursos (PSI).',
          'Si un contenedor supera su límite `--memory`, el kernel OOM Killer liquida el proceso del contenedor pero el host permanece intacto.'
        ],
        preguntas: '¿Qué ocurre en un servidor sin límites si un microservicio experimenta una fuga de memoria (memory leak) incontrolada?',
        lab: 'Arrancar un contenedor con límite de memoria y observar las métricas con `docker stats --no-stream`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Protección Frente al "Vecino Ruidoso"',
      icon: 'FaMemory',
      tone: 'light',
      bullets: [
        { lead: 'Contención DoS:', text: 'Evita que un proceso desbocado colapse el hardware compartido del servidor.' },
        { lead: 'Límite de RAM (`--memory`):', text: 'Tope estricto de memoria física. Si se excede, el OOM Killer actúa localmente.' },
        { lead: 'Cuotas de CPU (`--cpus`):', text: 'Asignación de periodos de CPU mediante el CFS (Completely Fair Scheduler).' },
        { lead: 'Límite de PIDs (`--pids-limit`):', text: 'Inmunidad total frente a ataques de bomba de bifurcación (fork-bombs).' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'APLICACIÓN DE LÍMITES EN DOCKER CLI',
      code: [
        '# Arrancar contenedor con límites estrictos de hardware',
        '$ docker run -d --name app-limitada \\',
        '    --memory="512m" \\',
        '    --cpus="1.5" \\',
        '    --pids-limit=100 \\',
        '    nginx:alpine',
        '',
        '# Monitorizar consumo de recursos en tiempo real',
        '$ docker stats --no-stream app-limitada',
        'NAME           CPU %   MEM USAGE / LIMIT   MEM %',
        'app-limitada   0.02%   4.1MiB / 512MiB     0.80%',
        '',
        '# Inspeccionar el valor exacto en el kernel (Cgroups v2)',
        '$ cat /sys/fs/cgroup/system.slice/docker-.../memory.max',
        '536870912'
      ].join('\n')
    });
  }

  // ─── Diapositiva 10: Capabilities de Linux y Modo Rootless ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Seguridad Avanzada',
      title: 'Capabilities de Linux y Modo Rootless: Mínimo Privilegio',
      notes: {
        obj: 'Enseñar a blindar la ejecución de contenedores eliminando permisos innecesarios y prohibir el uso de `--privileged`.',
        guion: [
          'Linux divide el poder tradicional de root en unas 40 capabilities independientes (CAP_NET_BIND_SERVICE, CAP_CHOWN, CAP_KILL).',
          'Por defecto Docker retira capabilities peligrosas como CAP_SYS_ADMIN.',
          'El flag `--privileged` es el antipatrón más peligroso: desactiva Seccomp, AppArmor y concede acceso directo a todos los dispositivos del host.',
          'La mejor práctica es `--cap-drop=ALL` y añadir únicamente las indispensables.'
        ],
        preguntas: '¿Por qué un servidor web en un puerto bajo (<1024) necesita CAP_NET_BIND_SERVICE si se ejecuta como usuario no root?',
        lab: 'Comprobar el bloqueo de red con `--cap-drop=ALL`: `docker run --rm --cap-drop=ALL alpine ping -c 1 8.8.8.8`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Principio de Mínimo Privilegio',
      icon: 'FaLock',
      tone: 'light',
      bullets: [
        { lead: 'Fraccionar a Root:', text: 'Sustituir el poder absoluto de UID 0 por capacidades granulares del kernel.' },
        { lead: 'Eliminar Riesgos:', text: 'Retirar capabilities para impedir montaje de discos, acceso a memoria física o manipulación de red.' },
        { lead: 'Antipatrón `--privileged`:', text: '¡Prohibido en producción! Desactiva todos los filtros de seguridad del host.' },
        { lead: 'Modo Rootless:', text: 'Ejecutar el daemon dockerd íntegramente bajo un usuario sin privilegios en el host.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: 3.4,
      label: 'GESTIÓN PROFESIONAL DE CAPABILITIES',
      code: [
        '# Buena práctica: Retirar todo y conceder lo mínimo',
        '$ docker run -d --name web-secure \\',
        '    --cap-drop=ALL \\',
        '    --cap-add=NET_BIND_SERVICE \\',
        '    nginx:alpine',
        '',
        '# Comprobar que no puede alterar interfaces de red',
        '$ docker exec web-secure ip link add dummy0 type dummy',
        'RTNETLINK answers: Operation not permitted'
      ].join('\n')
    });

    callout(s, {
      x: CX + 5.9, y: CY + 3.65, w: CW - 5.9, h: 1.15,
      kind: 'warn',
      lead: 'ALERTA DE SEGURIDAD:',
      text: 'El uso de `docker run --privileged` otorga todas las capabilities, deshabilita AppArmor y mapea todos los dispositivos de `/dev`. Constituye una brecha de escape del contenedor directa.'
    });
  }

  // ─── Diapositiva 11: ¿Qué es una Imagen en Docker? ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Imágenes OCI',
      title: '¿Qué es una Imagen en Docker? La Plantilla Inmutable',
      notes: {
        obj: 'Fijar el concepto de imagen como plantilla estática de solo lectura y alertar sobre los riesgos de usar el tag :latest en producción.',
        guion: [
          'Una imagen es un archivo binario empaquetado que contiene el código, el runtime, librerías y metadatos.',
          'Es estrictamente inmutable: una vez compilada, jamás se altera; se genera una nueva versión con nuevo digest SHA-256.',
          'Estructura de referencia: [registry]/[namespace]/[repositorio]:[tag].',
          'El tag :latest no significa "última versión estable", sino la etiqueta por defecto al hacer build. En producción siempre usar versiones semánticas fijas.'
        ],
        preguntas: 'Si descargamos "node:20" hoy y dentro de 6 meses volvemos a hacer pull, ¿tendremos los mismos bytes si el autor actualizó la imagen?',
        lab: 'Inspeccionar el hash criptográfico único: `docker inspect --format="{{.RepoDigests}}" nginx:alpine`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Propiedades de una Imagen OCI',
        icon: 'FaLayerGroup',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Plantilla de Solo Lectura:', text: 'Contiene el código, runtime, dependencias del sistema y configuración.' },
          { lead: 'Inmutabilidad Estricta:', text: 'Una imagen nunca se modifica; los cambios generan una nueva imagen versionada.' },
          { lead: 'Identificador Criptográfico:', text: 'Cada capa e imagen se referencia mediante un hash SHA-256 incorruptible.' },
          { lead: 'Estándar Abierto OCI:', text: 'Compatible entre Docker, Podman, Containerd, CRI-O y plataformas cloud.' }
        ]
      },
      {
        title: 'Anatomía de Referencia de Imagen',
        icon: 'FaBook',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Formato Completo:', text: '`[registry]/[namespace]/[repositorio]:[tag]`' },
          { lead: 'Ejemplo Real:', text: '`docker.io/library/nginx:1.25.3-alpine`' },
          { lead: 'Valores por Defecto:', text: 'Registry por defecto: Docker Hub. Tag por defecto: `:latest`.' },
          { lead: 'Peligro de `:latest`:', text: '¡Antipatrón en producción! Puede introducir cambios incompatibles sin previo aviso.' }
        ]
      }
    ], { y: CY, h: 3.5 });

    callout(s, {
      x: CX, y: CY + 3.75, w: CW, h: 1.05,
      kind: 'warn',
      lead: 'REGLA DE PRODUCCIÓN:',
      text: 'Nunca desplegar imágenes con el tag `:latest`. Utilizar siempre etiquetas inmutables con control de versiones semántico (ej. `node:20.11.1-alpine3.19`) o referenciar directamente por Digest SHA-256.'
    });
  }

  // ─── Diapositiva 12: Arquitectura de Capas y Almacenamiento Overlay2 ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Almacenamiento',
      title: 'Características de una Imagen: Capas y Caché Overlay2',
      notes: {
        obj: 'Explicar cómo se apilan las capas de solo lectura y por qué múltiples contenedores comparten las mismas capas sin duplicar espacio en disco.',
        guion: [
          'Cada instrucción en un Dockerfile genera una capa inmutable que representa un diff del sistema de archivos.',
          'Overlay2 combina los directorios lowerdir (capas de imagen) con el upperdir (capa del contenedor) presentándolo como un único árbol merged.',
          'Múltiples contenedores basados en la misma imagen consumen 0 bytes adicionales para la imagen base.'
        ],
        preguntas: 'Si 100 contenedores arrancan desde una imagen de 1GB, ¿cuánto espacio real en disco ocupan las capas base en el servidor?',
        lab: 'Inspeccionar el historial de capas de una imagen: `docker image history nginx:alpine`.'
      }
    });

    D.overlay2StorageDiagram(s, { x: CX, y: CY, w: CW, h: CH });
  }

  // ─── Diapositiva 13: ¿Qué es un Contenedor en Docker? ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Contenedores',
      title: '¿Qué es un Contenedor? La Instancia Viva y Copy-on-Write',
      notes: {
        obj: 'Hacer entender la relación Clase-Objeto y cómo funciona la capa efímera de lectura/escritura mediante Copy-on-Write.',
        guion: [
          'Analogía de programación: la Imagen es la Clase (definición inmutable); el Contenedor es el Objeto instanciado en memoria.',
          'Al instanciar un contenedor, Docker añade una delgada capa R/W en la parte superior.',
          'Si el contenedor modifica un fichero de la imagen, el kernel hace un copy_up hacia la capa superior antes de escribir.',
          'Con `docker diff` podemos auditar en tiempo real qué ficheros han sido modificados (C), añadidos (A) o borrados (D).'
        ],
        preguntas: '¿Qué penalización de rendimiento tiene modificar por primera vez un archivo de 5GB que reside en una capa de la imagen?',
        lab: 'Modificar un archivo en un contenedor y auditar los cambios con `docker diff`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'La Relación Clase - Objeto',
      icon: 'FaCube',
      tone: 'light',
      bullets: [
        { lead: 'Clase vs Instancia:', text: 'La imagen es la definición estática inmutable; el contenedor es la instancia viva.' },
        { lead: 'Capa Superior R/W:', text: 'Fina capa de lectura/escritura asociada exclusivamente al contenedor específico.' },
        { lead: 'Copy-on-Write (CoW):', text: 'Los archivos originales jamás se tocan; se duplican a la capa superior solo al modificarse.' },
        { lead: 'Naturaleza Efímera:', text: 'Al eliminar el contenedor (`docker rm`), su capa R/W se destruye; la imagen no cambia.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'DEMOSTRACIÓN DE COPY-ON-WRITE CON DOCKER DIFF',
      code: [
        '# 1. Arrancar un contenedor interactivo',
        '$ docker run -it --name demo-cow ubuntu:22.04 bash',
        '',
        '# 2. Modificar un archivo del sistema dentro del contenedor',
        'root@a1b2c3d4:/# echo "Host modificado" >> /etc/issue',
        'root@a1b2c3d4:/# exit',
        '',
        '# 3. Auditar la capa de lectura/escritura desde el host',
        '$ docker diff demo-cow',
        'C /etc',
        'C /etc/issue           # C = Changed (Copiado a R/W)',
        'A /root/.bash_history  # A = Added',
        '',
        '# 4. Comprobar que la imagen base original está intacta',
        '$ docker run --rm ubuntu:22.04 cat /etc/issue'
      ].join('\n')
    });
  }

  // ─── Diapositiva 14: Ciclo de Vida y Estados de un Contenedor ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Ciclo de Vida',
      title: 'Ciclo de Vida y Máquina de Estados del Contenedor',
      notes: {
        obj: 'Enseñar los estados del contenedor y la importancia crítica de cómo el proceso PID 1 gestiona las señales de apagado limpio (SIGTERM vs SIGKILL).',
        guion: [
          'Recorrer los estados: Created, Running, Paused, Stopped (Exited) y Dead.',
          'Al parar un contenedor (`docker stop`), se envía primero una señal SIGTERM (señal 15) para permitir cierre limpio.',
          'Si la aplicación no finaliza en el periodo de gracia (por defecto 10 segundos), el daemon envía SIGKILL (señal 9).',
          'En Linux el PID 1 ignora por defecto señales si la aplicación no registra un manejador explícito; de ahí la importancia del flag `--init`.'
        ],
        preguntas: '¿Por qué a veces "docker stop" tarda exactamente 10 segundos en detener un contenedor de Node.js o Python?',
        lab: 'Crear un contenedor en estado Created con `docker create`, verificar con `docker ps -a` y arrancarlo con `docker start`.'
      }
    });

    steps(s, [
      {
        title: 'Created',
        body: 'Se prepara el sistema de archivos Overlay2 y la configuración de red, pero el proceso PID 1 aún no ha arrancado en el kernel.'
      },
      {
        title: 'Running',
        body: 'El proceso principal está activo consumiendo ciclos de CPU y RAM bajo sus respectivos namespaces y cgroups.'
      },
      {
        title: 'Paused',
        body: 'El kernel congela los procesos mediante el cgroup freezer sin liberar la memoria RAM asignada.'
      },
      {
        title: 'Stopped',
        body: 'El proceso finaliza tras recibir SIGTERM o SIGKILL. El sistema de archivos R/W persiste en disco hasta hacer `docker rm`.'
      }
    ], { y: CY, h: 2.55, size: 11.5 });

    cardsRow(s, [
      {
        title: 'Parada Limpia (SIGTERM · Señal 15)',
        icon: 'FaCheckCircle',
        tone: 'tint',
        bullets: [
          { lead: 'Notificación de Cierre:', text: 'Docker avisa a la aplicación para que cierre conexiones a base de datos y vacíe buffers.' },
          { lead: 'Periodo de Gracia:', text: '10 segundos por defecto (configurable con `--time` o directiva `STOPSIGNAL`).' }
        ]
      },
      {
        title: 'Parada Forzosa (SIGKILL · Señal 9)',
        icon: 'FaExclamationTriangle',
        tone: 'tint',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Terminación Inmediata:', text: 'El kernel aborta el proceso sin posibilidad de captura ni limpieza de recursos.' },
          { lead: 'Mitigación con `--init`:', text: 'Inyectar un mini-init (`tini`) para propagar señales y cosechar procesos zombies.' }
        ]
      }
    ], { y: CY + 2.8, h: 2.05 });
  }

  // ─── Diapositiva 15: Comandos Esenciales de Gestión ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Operación CLI',
      title: 'Comandos Esenciales de Operación en el Aula',
      notes: {
        obj: 'Familiarizar a los alumnos con los comandos de terminal que utilizarán el 90% del tiempo durante el curso.',
        guion: [
          'Explicar la diferencia entre la sintaxis tradicional (`docker run`, `docker ps`) y la sintaxis estructurada por objetos (`docker container run`, `docker image ls`).',
          'Destacar los flags obligatorios: `-d` (segundo plano / detached), `-p` (publicación de puertos), `--name` (nombre explícito).',
          'Enseñar el uso de `docker system df` y `docker system prune -af` para liberar espacio en disco en servidores de desarrollo.'
        ],
        preguntas: '¿Cuál es la diferencia entre "docker stop" y "docker rm -f"? ¿Por qué no deberíamos abusar de -f?',
        lab: 'Lanzar un contenedor Nginx publicando el puerto 8080:80, probar con curl y verificar logs con `docker logs -f`.'
      }
    });

    code(s, {
      x: CX, y: CY, w: 5.9, h: CH,
      label: 'GESTIÓN DE CONTENEDORES',
      code: [
        '# Ejecutar en segundo plano con puerto y nombre',
        '$ docker run -d --name mi-nginx -p 8080:80 nginx:alpine',
        '',
        '# Listar contenedores activos y todos (incluidos parados)',
        '$ docker ps',
        '$ docker ps -a',
        '',
        '# Ver logs en tiempo real (seguimiento continuo)',
        '$ docker logs -f --tail 50 mi-nginx',
        '',
        '# Ejecutar una terminal interactiva dentro del contenedor',
        '$ docker exec -it mi-nginx sh',
        '',
        '# Inspeccionar metadatos y dirección IP',
        '$ docker inspect -f \'{{.NetworkSettings.IPAddress}}\' mi-nginx'
      ].join('\n')
    });

    code(s, {
      x: CX + 6.2, y: CY, w: CW - 6.2, h: CH,
      label: 'GESTIÓN DE IMÁGENES Y LIMPIEZA',
      code: [
        '# Descargar una imagen desde Docker Hub',
        '$ docker pull redis:7-alpine',
        '',
        '# Listar imágenes locales y su tamaño en disco',
        '$ docker images',
        '',
        '# Detener y eliminar un contenedor',
        '$ docker stop mi-nginx',
        '$ docker rm mi-nginx',
        '',
        '# Diagnóstico del espacio en disco ocupado',
        '$ docker system df',
        '',
        '# Limpieza profunda de recursos huérfanos',
        '$ docker system prune -af --volumes'
      ].join('\n')
    });
  }

  // ─── Diapositiva 16: Creación de Imágenes mediante Dockerfile ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Dockerfile',
      title: 'Automatizando la Creación: El Dockerfile',
      notes: {
        obj: 'Introducir la sintaxis y filosofía del Dockerfile como receta auditable y reproducible bajo Infraestructura como Código.',
        guion: [
          'Un Dockerfile es un archivo declarativo de texto plano con instrucciones secuenciales.',
          'Se almacena en el repositorio Git junto al código fuente, permitiendo trazabilidad y CI/CD automatizado.',
          'El motor moderno BuildKit analiza las dependencias del Dockerfile y puede paralelizar ramas de compilación independientes.',
          'Repasar la anatomía básica: FROM, WORKDIR, COPY, RUN, USER, EXPOSE y CMD.'
        ],
        preguntas: '¿Por qué copiamos package.json antes que el resto de archivos de la aplicación? (Aprovechamiento de caché).',
        lab: 'Inspeccionar la ayuda de BuildKit: `DOCKER_BUILDKIT=1 docker build --help`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Infraestructura como Código (IaC)',
      icon: 'FaFileCode',
      tone: 'light',
      bullets: [
        { lead: 'Fichero Declarativo:', text: 'Instrucciones secuenciales legibles que describen paso a paso cómo construir la imagen.' },
        { lead: 'Versionado en Git:', text: 'El Dockerfile vive junto al código fuente, garantizando auditoría y trazabilidad histórica.' },
        { lead: 'Compilador BuildKit:', text: 'Motor moderno que analiza dependencias y ejecuta etapas independientes en paralelo.' },
        { lead: 'Reproducibilidad Total:', text: 'Cualquier miembro del equipo compilará exactamente el mismo artefacto binario.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'DOCKERFILE PROFESIONAL PARA NODE.JS',
      code: [
        '# 1. Imagen base oficial y minimalista',
        'FROM node:20-alpine',
        '',
        '# 2. Establecer directorio de trabajo seguro',
        'WORKDIR /usr/src/app',
        '',
        '# 3. Copiar dependencias y compilar (Caché optimizada)',
        'COPY package*.json ./',
        'RUN npm ci --only=production',
        '',
        '# 4. Copiar código fuente de la aplicación',
        'COPY . .',
        '',
        '# 5. Ejecutar como usuario sin privilegios y documentar puerto',
        'USER node',
        'EXPOSE 3000',
        '',
        '# 6. Comando de arranque en formato Exec',
        'CMD ["node", "server.js"]'
      ].join('\n')
    });
  }

  // ─── Diapositiva 17: Directivas Fundamentales de Dockerfile ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Directivas Dockerfile',
      title: 'Directivas Fundamentales: Entorno, Ejecución y CMD vs ENTRYPOINT',
      notes: {
        obj: 'Clarificar la diferencia vital entre RUN (momento build) y CMD/ENTRYPOINT (momento ejecución), y la diferencia entre la forma exec y shell.',
        guion: [
          'RUN ejecuta comandos durante la creación de la imagen y genera una nueva capa inmutable en el sistema de archivos.',
          'ENTRYPOINT define el ejecutable inamovible que siempre corre al arrancar el contenedor.',
          'CMD define argumentos por defecto que se pasan a ENTRYPOINT, o el comando ejecutable por defecto si no hay ENTRYPOINT.',
          'Sintaxis Exec obligatoria: ["prog", "arg"] ejecuta directamente como PID 1. La sintaxis shell `CMD prog` arranca `/bin/sh -c` como PID 1 impidiendo la recepción de señales.'
        ],
        preguntas: '¿Cuál es la diferencia entre EXPOSE 80 en el Dockerfile y -p 8080:80 en docker run?',
        lab: 'Probar la ejecución de comandos en formato shell vs exec con `docker run --rm alpine sh -c "echo Formato shell"`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Directivas de Entorno y Sistema',
        icon: 'FaSlidersH',
        tone: 'light',
        bullets: [
          { lead: 'FROM <imagen>:<tag>:', text: 'Establece la imagen base obligatoria (primera instrucción).' },
          { lead: 'WORKDIR /ruta:', text: 'Define el directorio de trabajo activo (evita encadenar múltiples `cd`).' },
          { lead: 'COPY <src> <dest>:', text: 'Copia ficheros locales del host hacia la imagen de forma transparente.' },
          { lead: 'ENV CLAVE=VALOR:', text: 'Define variables de entorno persistentes durante el build y en runtime.' },
          { lead: 'EXPOSE <puerto>:', text: 'Metadato informativo que documenta los puertos que escucha la aplicación.' }
        ]
      },
      {
        title: 'RUN vs ENTRYPOINT vs CMD',
        icon: 'FaRocket',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'RUN (Momento Build):', text: 'Instala paquetes y compila código, creando una nueva capa inmutable en disco.' },
          { lead: 'ENTRYPOINT ["ejecutable"]:', text: 'Define el comando fijo que siempre se ejecutará al iniciar el contenedor.' },
          { lead: 'CMD ["arg1", "arg2"]:', text: 'Proporciona argumentos por defecto al ENTRYPOINT (anulables desde el CLI).' },
          { lead: 'Sintaxis Exec Obligatoria:', text: 'Siempre usar formato JSON con corchetes `["prog", "arg"]` para ser PID 1.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 18: Buenas Prácticas y Optimización de Caché ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Optimización de Caché',
      title: 'Buenas Prácticas: Optimización de Capas y Caché de Build',
      notes: {
        obj: 'Hacer entender que el orden de las instrucciones en el Dockerfile determina directamente la velocidad del pipeline de CI/CD.',
        guion: [
          'Regla de oro: colocar las instrucciones que menos cambian al principio del Dockerfile y las que más cambian al final.',
          'Invalidación en cascada: en cuanto una capa cambia (un `COPY . .`), todas las instrucciones posteriores rompen caché y se recompilan.',
          'Uso estricto de `.dockerignore` para no subir `node_modules` ni `.git` al contexto de build.',
          'Encadenar `apt-get update && apt-get install && rm -rf /var/lib/apt/lists/*` en un solo RUN para no almacenar cachés de paquetes.'
        ],
        preguntas: 'Si en un RUN haces apt-get update y en otro RUN haces apt-get install, ¿qué problema de caché ocurrirá cuando pasen los meses?',
        lab: 'Inspeccionar cómo BuildKit muestra `CACHED` en la terminal durante reconstrucciones consecutivas.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Estrategias de Optimización',
      icon: 'FaCogs',
      tone: 'light',
      bullets: [
        { lead: 'De Menos a Más Cambiante:', text: 'Ordenar dependencias del sistema primero y código fuente después.' },
        { lead: 'Invalidación en Cascada:', text: 'Cualquier modificación en una capa invalida la caché de todas las subsiguientes.' },
        { lead: 'Uso de `.dockerignore`:', text: 'Excluir `node_modules`, `.git` y temporales del build context de compilación.' },
        { lead: 'Encadenar Comandos RUN:', text: 'Actualizar paquetes, instalar y limpiar cachés en una única capa atómica.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'ANTIPATRÓN VS BUENA PRÁCTICA',
      code: [
        '# ANTIPATRÓN (Rompe caché en cada cambio de código):',
        'COPY . .',
        'RUN npm install   # ¡Se ejecuta siempre, muy lento!',
        '',
        '# BUENA PRÁCTICA (Caché inteligente de librerías):',
        'COPY package*.json ./',
        'RUN npm ci        # Solo se ejecuta si cambia package.json',
        'COPY . .          # Si solo cambia código, usa caché previa',
        '',
        '# Ejemplo de limpieza de paquetes en una sola capa:',
        'RUN apt-get update && apt-get install -y --no-install-recommends \\',
        '    curl \\',
        '    ca-certificates \\',
        ' && rm -rf /var/lib/apt/lists/*'
      ].join('\n')
    });
  }

  // ─── Diapositiva 19: Multi-Stage Builds ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Multi-Stage',
      title: 'Multi-Stage Builds: Seguridad y Mínimo Tamaño en Producción',
      notes: {
        obj: 'Presentar los Multi-Stage Builds como el estándar profesional obligatorio para construir imágenes listas para producción.',
        guion: [
          'Separar el entorno de compilación (builder) del runtime final de producción.',
          'La etapa builder contiene compiladores pesados (gcc, Go, Maven, Node completo) que pesan cientos de megabytes.',
          'La etapa final utiliza una imagen minimalista (Alpine, Distroless o Scratch) y solo copia el binario compilado mediante `COPY --from=builder`.',
          'Reduce el tamaño de 800MB a 15MB y elimina más del 95% de los CVEs al no contener herramientas de desarrollo explotables.'
        ],
        preguntas: '¿Por qué dejar herramientas como gcc, git o curl en una imagen de producción facilita el trabajo a un atacante que logre ejecutar comandos remotos?',
        lab: 'Construir una imagen con multi-stage en Go o Node y comparar su tamaño final con `docker images`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Ventajas del Patrón Multi-Stage',
      icon: 'FaShieldAlt',
      tone: 'light',
      accent: COL.COBALT,
      bullets: [
        { lead: 'Separación Compilación/Runtime:', text: 'SDKs pesados y compiladores se quedan exclusivamente en la fase de build.' },
        { lead: 'Producción Ultraligera:', text: 'Imágenes finales de 5MB a 30MB en lugar de artefactos de más de 1GB.' },
        { lead: 'Minimización de CVEs:', text: 'Al eliminar gestores de paquetes y shells del entorno final, la superficie se reduce a cero.' },
        { lead: 'Builds Paralelos en BuildKit:', text: 'El motor compila etapas independientes de forma simultánea.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'DOCKERFILE MULTI-STAGE PROFESIONAL (GOLANG)',
      code: [
        '# ETAPA 1: Entorno de Compilación (Builder)',
        'FROM golang:1.22-alpine AS builder',
        'WORKDIR /app',
        'COPY go.mod go.sum ./',
        'RUN go mod download',
        'COPY . .',
        'RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o mi-app',
        '',
        '# ETAPA 2: Runtime de Producción (Final)',
        'FROM alpine:3.19',
        'WORKDIR /app',
        '# Copiar ÚNICAMENTE el binario de la etapa anterior',
        'COPY --from=builder /app/mi-app .',
        'USER guest',
        'EXPOSE 8080',
        'CMD ["./mi-app"]',
        '# Resultado: De 850MB a solo 12MB de imagen final'
      ].join('\n')
    });
  }

  // ─── Diapositiva 20: Introducción a Microservicios con Docker ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Arquitectura',
      title: 'Docker y la Arquitectura de Microservicios: Un Proceso por Contenedor',
      notes: {
        obj: 'Establecer las bases arquitectónicas de microservicios y anticipar los problemas que resolveremos en los Módulos 2 (Redes) y 3 (Almacenamiento).',
        guion: [
          'La regla de oro: un proceso principal por contenedor. No empaquetar Apache, PHP y MySQL en la misma imagen.',
          'Permite escalado independiente: si el frontend se satura, escalamos solo los contenedores frontend sin duplicar la base de datos.',
          'Aislamiento de fallos: si un microservicio experimenta una fuga de memoria, no tumba el resto de componentes.',
          'Plantea los retos que resolveremos a continuación: ¿Cómo se comunican entre sí? (Redes). ¿Dónde guardan datos persistentes? (Volúmenes).'
        ],
        preguntas: '¿Qué problemas presenta usar systemd dentro de un contenedor para arrancar varios demonios a la vez?',
        lab: 'Inspeccionar cómo varios contenedores independientes aparecen en la lista de `docker ps`.'
      }
    });

    cardsRow(s, [
      {
        title: 'La Regla de Oro: Un Proceso por Contenedor',
        icon: 'FaCubes',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Desacoplamiento Funcional:', text: 'No empaquetar servidor web, API y base de datos en el mismo contenedor.' },
          { lead: 'Escalado Horizontal Selectivo:', text: 'Escalar únicamente los servicios con alta demanda sin duplicar el resto.' },
          { lead: 'Diagnóstico Aislado:', text: 'Los logs (`docker logs`) reflejan exclusivamente la salida del servicio en cuestión.' },
          { lead: 'Aislamiento de Fallos:', text: 'Un colapso en el módulo de pagos no detiene el catálogo de navegación.' }
        ]
      },
      {
        title: 'Retos que Resolveremos en el Curso',
        icon: 'FaProjectDiagram',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Comunicación entre Servicios:', text: '¿Cómo hablan entre sí sin acoplar IPs fijas? (Módulo 2 · Redes Bridge y DNS).' },
          { lead: 'Persistencia de Datos:', text: 'Si el contenedor es efímero, ¿dónde guardamos datos? (Módulo 3 · Volúmenes).' },
          { lead: 'Orquestación Multicontenedor:', text: 'Coordinar 15 servicios con un solo comando (Módulo 4 · Docker Compose).' },
          { lead: 'Producción y Alta Disponibilidad:', text: 'Despliegues en clúster y balanceo de carga (Módulo 5 · Kubernetes).' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 21: Laboratorio Práctico 1 ───
  {
    const s = slide(pres, {
      mod: 1,
      badge: 'Práctica Guiada',
      title: 'Laboratorio 1: Ciclo de Vida y Creación de Imágenes',
      lab: true,
      notes: {
        obj: 'Guiar a los alumnos en su primer laboratorio práctico de 60-75 minutos para afianzar todos los conceptos y comandos vistos en la jornada 1.',
        guion: [
          'Los alumnos seguirán los 7 pasos en sus terminales.',
          'Puntos críticos a vigilar: el punto final en `docker build -t mi-app:1.0 .` (el build context) y los posibles conflictos de puertos en el host.',
          'Verificar que todos consiguen invocar `curl http://localhost:8080` y comprobar las métricas de `docker stats`.'
        ],
        preguntas: '¿Quién ha experimentado un fallo al compilar por olvidar el punto final del build context? ¿Por qué es necesario ese punto?',
        lab: [
          '1. Verificar instalación: `docker version` y `docker info`.',
          '2. Explorar contenedor interactivo: `docker run -it alpine sh`.',
          '3. Crear Dockerfile para app web e incluir `.dockerignore`.',
          '4. Construir imagen: `docker build -t lab1-app:1.0 .`.',
          '5. Ejecutar contenedor: `docker run -d -p 8080:80 --name web lab1-app:1.0`.',
          '6. Verificar con `curl http://localhost:8080` y revisar `docker logs web`.',
          '7. Limpieza ordenada con `docker stop web` y `docker rm web`.'
        ]
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Objetivos y Pasos del Laboratorio',
      icon: 'FaTools',
      tone: 'light',
      accent: COL.CORAL,
      bullets: [
        { lead: 'Paso 1 · Verificación:', text: 'Comprobar el entorno con `docker version` y `docker info`.' },
        { lead: 'Paso 2 · Exploración:', text: 'Ejecutar contenedor interactivo Alpine e inspeccionar procesos del kernel.' },
        { lead: 'Paso 3 · Dockerfile:', text: 'Redactar una receta optimizada para una aplicación web con capas ordenadas.' },
        { lead: 'Paso 4 · Build:', text: 'Compilar la imagen con etiqueta semántica inmutable `lab1-app:1.0`.' },
        { lead: 'Paso 5 · Despliegue:', text: 'Instanciar el contenedor en segundo plano publicando el puerto hacia el host.' },
        { lead: 'Paso 6 · Auditoría:', text: 'Comprobar conectividad con `curl`, monitorizar `docker stats` y `docker logs`.' },
        { lead: 'Paso 7 · Limpieza:', text: 'Parar y eliminar el contenedor verificando la liberación de recursos.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'COMANDOS DE RESOLUCIÓN DEL LABORATORIO 1',
      code: [
        '# 1. Crear espacio de trabajo y Dockerfile de prueba',
        '$ mkdir -p ~/lab1 && cd ~/lab1',
        '$ cat <<EOF > Dockerfile',
        'FROM nginx:alpine',
        'COPY index.html /usr/share/nginx/html/index.html',
        'EXPOSE 80',
        'CMD ["nginx", "-g", "daemon off;"]',
        'EOF',
        '',
        '# 2. Crear archivo HTML simple',
        '$ echo "<h1>Laboratorio 1 Completado</h1>" > index.html',
        '',
        '# 3. Compilar la imagen con etiqueta semántica',
        '$ docker build -t lab1-app:1.0 .',
        '',
        '# 4. Arrancar contenedor en segundo plano con puerto',
        '$ docker run -d --name lab1-web -p 8080:80 lab1-app:1.0',
        '',
        '# 5. Probar conectividad y revisar logs',
        '$ curl -I http://localhost:8080',
        '$ docker logs lab1-web',
        '',
        '# 6. Limpieza final',
        '$ docker rm -f lab1-web'
      ].join('\n')
    });
  }

  // ─── Diapositiva 22: Resumen del Día 1 y Cierre ───
  divider(pres, {
    mod: 1,
    title: 'RESUMEN DE LA JORNADA 1',
    subtitle: 'Conceptos consolidados: Arquitectura del Motor, Namespaces, Cgroups, OCI, Dockerfile y Ciclo de Vida.\nPróxima Jornada: Módulo 2 (Redes a fondo) y Módulo 3 (Almacenamiento y Volúmenes).',
    hours: 'CONCLUSIÓN DÍA 1',
    topics: [
      { icon: 'FaCheckCircle', text: 'Kernel de Linux: Namespaces (visibilidad) y Cgroups (recursos).' },
      { icon: 'FaCheckCircle', text: 'Arquitectura OCI: Desacoplamiento dockerd, containerd y runc.' },
      { icon: 'FaCheckCircle', text: 'Imágenes y Almacenamiento: Capas inmutables y Copy-on-Write en Overlay2.' },
      { icon: 'FaCheckCircle', text: 'Dockerfile Profesional: BuildKit, optimización de caché y Multi-Stage.' },
      { icon: 'FaCheckCircle', text: 'Laboratorio 1 completado con éxito por los alumnos.' }
    ],
    notes: {
      obj: 'Recapitular los aprendizajes de las 5 horas del Día 1, resolver dudas abiertas y hacer el puente pedagógico hacia el Día 2.',
      guion: [
        'Hacer un repaso rápido de los conceptos clave aprendidos: un contenedor es un proceso de Linux protegido por namespaces y limitado por cgroups.',
        'Recordar que mañana entraremos en el Módulo 2 (Redes: bridge, host, overlay, DNS integrado e iptables) y Módulo 3 (Persistencia de datos: volúmenes vs bind mounts vs tmpfs).',
        'Atender preguntas finales de los alumnos sobre el laboratorio.'
      ],
      preguntas: '¿Cuál ha sido el concepto técnico que más os ha sorprendido hoy sobre cómo funcionan realmente los contenedores?',
      lab: 'Verificar que todos los alumnos han limpiado sus contenedores de prueba con `docker ps -a` antes de cerrar la sesión.'
    }
  });
}

module.exports = { buildModule1 };
