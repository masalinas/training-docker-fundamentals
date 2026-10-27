'use strict';
/**
 * m2_m3.js — Módulos 2 y 3 (Día 2): Redes en Docker y Persistencia / Volúmenes.
 * Genera 23 diapositivas técnicas (diapositivas 23 a 45 de la presentación general).
 */
const H = require('./layout_helpers');
const D = require('./diagrams');

const {
  COL, CX, CY, CW, CH,
  slide, divider,
  card, cardsRow, cardsGrid, code, table, steps, stat, callout
} = H;

function buildModule2And3(pres) {
  // ─── Diapositiva 23: Separador Módulo 2 · Redes en Docker ───
  divider(pres, {
    mod: 2,
    title: 'GESTIÓN DE REDES EN DOCKER',
    subtitle: 'Arquitectura de Red: veth pairs, Linux Bridge, DNS interno, iptables NAT, Host, None, Overlay y Macvlan.\nPrimera mitad de la Jornada 2 · 2.5 Horas Lectivas',
    hours: '2.5 HORAS LECTIVAS',
    topics: [
      { icon: 'FaNetworkWired', text: 'Anatomía de Red: veth pairs, switch virtual docker0 y namespaces.' },
      { icon: 'FaExclamationTriangle', text: 'Bridge por defecto vs Redes personalizadas (User-Defined DNS).' },
      { icon: 'FaExchangeAlt', text: 'Mapeo de puertos, reglas iptables DNAT y docker-proxy.' },
      { icon: 'FaServer', text: 'Drivers avanzados: Host (rendimiento), None (offline) y Macvlan (LAN física).' },
      { icon: 'FaTools', text: 'Laboratorio 2: Interconexión de microservicios y resolución por nombre.' }
    ],
    notes: {
      obj: 'Introducir los principios de conectividad en contenedores y presentar la agenda del Módulo 2.',
      guion: [
        'Cada contenedor dispone de su propio Network Namespace con interfaces y tablas de enrutamiento privadas.',
        'Docker conecta el contenedor al host mediante cables virtuales denominados pares veth (virtual ethernet).',
        'Analizaremos por qué la red bridge por defecto carece de resolución DNS y por qué las redes personalizadas son obligatorias en microservicios.'
      ],
      preguntas: '¿Cómo puede un contenedor hablar con otro en la misma máquina si cada uno tiene su propia IP privada?',
      lab: 'Listar las redes predeterminadas con `docker network ls` e inspeccionar el bridge inicial.'
    }
  });

  // ─── Diapositiva 24: Anatomía de la Red en Docker (Diagrama) ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Arquitectura de Red',
      title: 'Anatomía de la Red en Docker: veth pairs, Linux Bridge e iptables',
      notes: {
        obj: 'Hacer entender visualmente cómo se conectan los contenedores al host usando pares veth y conmutación L2.',
        guion: [
          'La llamada del kernel `ip link add veth0 type veth peer name veth1` crea un cable virtual bidireccional.',
          'Un extremo se traslada al Network Namespace del contenedor y se renombra a `eth0`. El otro se conecta al puente `docker0` del host.',
          'El puente `docker0` opera como un switch Ethernet de nivel 2 (L2) conmutando paquetes entre las interfaces conectadas.',
          'El acceso a Internet se realiza mediante reglas iptables MASQUERADE (NAT) sobre la tarjeta física `eth0` del anfitrión.'
        ],
        preguntas: '¿Puede un contenedor capturar el tráfico de otro si no están en la misma subred ni comparten bridge?',
        lab: 'Inspeccionar el bridge en el host con `ip addr show docker0` y listar las interfaces veth activas con `ip link show type veth`.'
      }
    });

    D.virtualNetworkBridgeDiagram(s, { x: CX, y: CY, w: CW, h: CH });
  }

  // ─── Diapositiva 25: El Bridge por Defecto vs Limitaciones ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Red Bridge',
      title: 'La Red Bridge por Defecto y sus Limitaciones Críticas',
      notes: {
        obj: 'Advertir sobre la trampa común de usar la red bridge por defecto y la ausencia de servidor DNS automático.',
        guion: [
          'Por defecto, todo contenedor sin flag `--network` se conecta a `bridge` (habitualmente subred 172.17.0.0/16).',
          'En el bridge por defecto NO hay resolución DNS automática: `ping backend` fallará irremediablemente.',
          'Forzar comunicación por IPs fijas es un antipatrón grave: al reiniciar un contenedor su IP puede cambiar.',
          'El flag legacy `--link` está obsoleto desde Docker 1.9 y jamás debe emplearse en proyectos modernos.'
        ],
        preguntas: '¿Por qué conectar una base de datos y un backend en la red bridge por defecto es una fuente garantizada de incidencias?',
        lab: 'Comprobar el fallo de DNS en la red bridge por defecto arrancando dos contenedores e intentando hacer ping por nombre.'
      }
    });

    cardsRow(s, [
      {
        title: 'Características de la Red Bridge por Defecto',
        icon: 'FaNetworkWired',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Conexión Automática:', text: 'Red asignada si se omite el parámetro `--network` en `docker run`.' },
          { lead: 'Rango de Subred:', text: 'Típicamente `172.17.0.0/16`, con la IP `172.17.0.1` asignada al host como gateway.' },
          { lead: 'Salida a Internet (NAT):', text: 'Docker inyecta reglas `iptables MASQUERADE` para permitir tráfico saliente.' },
          { lead: 'Asignación Dinámica:', text: 'IPs asignadas de forma secuencial según el orden de arranque de los contenedores.' }
        ]
      },
      {
        title: 'Limitación Crítica: Sin Resolución DNS',
        icon: 'FaExclamationTriangle',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: '¡Sin DNS Integrado!:', text: 'Dos contenedores en el bridge por defecto NO pueden comunicarse por su nombre.' },
          { lead: 'Fragilidad por IPs:', text: 'Si un servicio se reinicia y cambia de `172.17.0.2` a `172.17.0.3`, la app colapsa.' },
          { lead: 'Deprecación de `--link`:', text: 'El antiguo mecanismo de inyección en `/etc/hosts` está formalmente en desuso.' },
          { lead: 'Solución Profesional:', text: 'Crear siempre redes personalizadas (*User-Defined Bridges*).' }
        ]
      }
    ], { y: CY, h: 3.5 });

    callout(s, {
      x: CX, y: CY + 3.75, w: CW, h: 1.05,
      kind: 'warn',
      lead: 'TRAMPA EN PRODUCCIÓN:',
      text: 'Nunca desplegar microservicios en la red bridge predeterminada. La falta de DNS obliga a acoplar direcciones IP volátiles que se rompen con cada reinicio o actualización de contenedor.'
    });
  }

  // ─── Diapositiva 26: Redes Bridge Personalizadas ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'User-Defined Bridges',
      title: 'Redes Personalizadas: Resolución DNS Automática y Aislamiento',
      notes: {
        obj: 'Demostrar el uso de redes creadas por el usuario con resolución de nombres DNS automática mediante el servidor embebido 127.0.0.11.',
        guion: [
          'En las redes personalizadas, Docker levanta un resolver DNS embebido en 127.0.0.11.',
          'Si un contenedor consulta por el nombre de otro en la misma red, Docker devuelve instantáneamente su IP actual.',
          'Si la consulta es por un dominio externo (google.com), la reenvía a los servidores DNS configurados en el host.',
          'Permite aislamiento estricto: contenedores en redes distintas no pueden enviarse paquetes entre sí aunque estén en el mismo host.'
        ],
        preguntas: '¿Qué sucede si conectamos un contenedor simultáneamente a dos redes personalizadas distintas? (Doble interfaz y acceso a ambos entornos).',
        lab: 'Crear una red personalizada con `docker network create red-interna` y verificar la resolución de nombres con ping.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Ventajas de User-Defined Bridges',
      icon: 'FaGlobe',
      tone: 'light',
      bullets: [
        { lead: 'DNS Embebido (`127.0.0.11`):', text: 'Resolución automática y dinámica del nombre del contenedor a su IP activa.' },
        { lead: 'Aislamiento Estricto:', text: 'Servicios en redes diferentes no tienen visibilidad mutua, reforzando la seguridad.' },
        { lead: 'Conexión en Caliente:', text: 'Conectar o desconectar contenedores en tiempo de ejecución sin reinicios (`docker network connect`).' },
        { lead: 'Alias de Red:', text: 'Asignar nombres secundarios a servicios para balanceo o nombres canónicos (`--network-alias`).' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'CREACIÓN Y RESOLUCIÓN EN RED PERSONALIZADA',
      code: [
        '# 1. Crear red personalizada para el backend',
        '$ docker network create red-aplicacion',
        '',
        '# 2. Levantar base de datos conectada a la red',
        '$ docker run -d --name db-postgres \\',
        '    --network red-aplicacion \\',
        '    -e POSTGRES_PASSWORD=secreto \\',
        '    postgres:16-alpine',
        '',
        '# 3. Levantar cliente en la misma red y resolver por nombre',
        '$ docker run --rm --network red-aplicacion alpine \\',
        '    ping -c 2 db-postgres',
        'PING db-postgres (172.19.0.2): 56 data bytes',
        '64 bytes from 172.19.0.2: seq=0 ttl=64 time=0.075 ms',
        '',
        '# ¡El DNS embebido resuelve por nombre sin tocar /etc/hosts!'
      ].join('\n')
    });
  }

  // ─── Diapositiva 27: Publicación y Mapeo de Puertos ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Port Mapping',
      title: 'Mapeo de Puertos: Abriendo el Contenedor al Mundo',
      notes: {
        obj: 'Explicar con precisión técnica cómo el tráfico entrante llega desde el exterior al contenedor vía iptables DNAT y docker-proxy.',
        guion: [
          'Diferenciar `-p` (mapeo explícito) de `-P` (mapeo efímero a puertos aleatorios altos 32768-60999).',
          'Al omitir la IP del host (`-p 8080:80`), Docker vincula a 0.0.0.0 (todas las interfaces, incluyendo Internet público).',
          'Para desarrollo local seguro, especificar siempre `-p 127.0.0.1:8080:80`.',
          'En el kernel de Linux, Docker añade reglas en la cadena PREROUTING de la tabla nat (DNAT) y arranca el demonio docker-proxy.'
        ],
        preguntas: '¿Por qué en Ubuntu las reglas de Docker pueden saltarse las restricciones de UFW si no se configura explícitamente iptables=false?',
        lab: 'Inspeccionar el mapeo activo con `docker port mi-contenedor`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Mapeo Explícito vs Efímero',
      icon: 'FaRandom',
      tone: 'light',
      bullets: [
        { lead: 'Mapeo Explícito (`-p`):', text: 'Vincula un puerto fijo del host al contenedor (ej. `-p 8080:80` o `-p 127.0.0.1:8080:80`).' },
        { lead: 'Mapeo Efímero (`-P`):', text: 'Asigna puertos aleatorios altos (32768-60999) para todas las directivas `EXPOSE`.' },
        { lead: 'Riesgo de Exposición (`0.0.0.0`):', text: 'Omitir la IP local expone el puerto a cualquier red física o Internet.' },
        { lead: 'Mapeo UDP:', text: 'Por defecto mapea TCP. Para tráfico UDP se debe indicar `-p 53:53/udp`.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: 3.4,
      label: 'MECANISMO INTERNO: IPTABLES DNAT',
      code: [
        '# Inspeccionar las reglas generadas en la tabla NAT',
        '$ sudo iptables -t nat -L DOCKER -n -v',
        '',
        'Chain DOCKER (2 references)',
        'pkts bytes target prot opt source   destination',
        '  22  1320 DNAT   tcp  --  0.0.0.0  0.0.0.0 \\',
        '  tcp dpt:8080 to:172.19.0.2:80',
        '',
        '# Proceso docker-proxy (Reenvío TCP en loopback):',
        '$ ps -ef | grep docker-proxy',
        'root ... docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 8080'
      ].join('\n')
    });

    callout(s, {
      x: CX + 5.9, y: CY + 3.65, w: CW - 5.9, h: 1.15,
      kind: 'warn',
      lead: 'AVISO DE SEGURIDAD:',
      text: 'En servidores de desarrollo, usar `-p 127.0.0.1:puerto:puerto`. El uso desatento de `-p puerto:puerto` abre el servicio a toda la red corporativa o pública sin pasar por UFW.'
    });
  }

  // ─── Diapositiva 28: Modo de Red Host ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Modo Host',
      title: 'Modo de Red Host: Rendimiento Máximo sin Aislamiento',
      notes: {
        obj: 'Evaluar el trade-off de rendimiento frente a seguridad del modo `--network host`.',
        guion: [
          'Al omitir CLONE_NEWNET, el contenedor comparte íntegramente la pila de red del anfitrión.',
          'Cero penalización de NAT: no hay veth, ni bridge ni overhead de iptables.',
          'Los flags `-p` se ignoran por completo: si el servicio escucha en el 80, estará directamente en el 80 del host.',
          'Riesgo: colisión de puertos si dos contenedores escuchan en el mismo puerto y pérdida de aislamiento L2.'
        ],
        preguntas: '¿Por qué en Docker Desktop para Mac o Windows `--network host` no se conecta a la tarjeta física del Mac/PC sino a la VM Linux oculta?',
        lab: 'Inspeccionar las interfaces en modo host con `docker run --rm --network host alpine ip addr`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Características de `--network host`',
        icon: 'FaBolt',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Sin Namespace de Red:', text: 'El proceso utiliza directamente la pila TCP/IP, interfaces y rutas del host.' },
          { lead: 'Cero Overhead de NAT:', text: 'Sin pares veth, sin conmutador bridge y sin consumo de CPU en iptables.' },
          { lead: 'Mapeo Innecesario:', text: 'Los flags `-p` y `-P` se ignoran; el servicio abre puertos directamente en el host.' },
          { lead: 'Comportamiento en Desktop:', text: 'En Mac/Windows se asocia a la máquina virtual oculta, no a macOS/Windows real.' }
        ]
      },
      {
        title: 'Riesgos y Casos de Uso Válidos',
        icon: 'FaExclamationTriangle',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Colisión de Puertos:', text: 'Dos contenedores no pueden escuchar en el mismo puerto (`Address already in use`).' },
          { lead: 'Pérdida de Aislamiento:', text: 'El contenedor tiene acceso a todos los servicios que escuchen en `localhost` del host.' },
          { lead: 'Monitorización de Red:', text: 'Ideal para agentes de métricas (Prometheus `node-exporter`, capturadores de tráfico).' },
          { lead: 'Tráfico de Alta Velocidad:', text: 'Transmisión multimedia UDP/WebRTC o proxies de extrema concurrencia.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 29: Modo de Red None ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Modo None',
      title: 'Modo de Red None: Aislamiento Total y Entornos Air-Gapped',
      notes: {
        obj: 'Presentar el modo none como herramienta de máxima contención para procesamiento seguro y aislado.',
        guion: [
          'El contenedor tiene su propio Network Namespace, pero únicamente se configura la interfaz loopback `127.0.0.1`.',
          'Sin tarjetas externas, sin gateway y sin acceso a Internet ni a la red local.',
          'Si un atacante logra ejecución remota de código, le resulta imposible descargar herramientas ni exfiltrar datos por red.',
          'Los datos se ingresan y extraen exclusivamente mediante volúmenes montados en disco.'
        ],
        preguntas: '¿Para qué casos de uso en el sector bancario o médico es imprescindible usar contenedores sin conectividad de red?',
        lab: 'Comprobar las interfaces disponibles en modo none con `docker run --rm --network none alpine ifconfig`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Aislamiento Estricto (`--network none`)',
        icon: 'FaLock',
        tone: 'light',
        accent: COL.NAVY,
        bullets: [
          { lead: 'Desconexión Absoluta:', text: 'Únicamente dispone de la interfaz de bucle invertido local (`lo` / `127.0.0.1`).' },
          { lead: 'Sin Tráfico Externo:', text: 'Imposible enviar o recibir tramas fuera del contenedor; sin ruta por defecto.' },
          { lead: 'Inmunidad frente a Exfiltración:', text: 'Código potencialmente comprometido no puede conectar con servidores externos C2.' },
          { lead: 'Configuración Manual:', text: 'Permite a orquestadores inyectar interfaces de red personalizadas a posteriori.' }
        ]
      },
      {
        title: 'Casos de Uso en Producción',
        icon: 'FaKey',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Procesamiento Confidencial:', text: 'Transformación de expedientes médicos, nóminas o registros protegidos por GDPR.' },
          { lead: 'Operaciones Criptográficas:', text: 'Generación de llaves maestras PGP, firma de artefactos o monederos fríos.' },
          { lead: 'Sandboxing de Código:', text: 'Ejecución aislada de scripts no confiables subidos por clientes sin riesgo de propagación.' },
          { lead: 'Inspección Forense:', text: 'Análisis estático de binarios sospechosos en entornos cerrados (air-gapped).' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 30: Redes Overlay (Multi-Host) ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Redes Overlay',
      title: 'Redes Overlay: Conectando Contenedores a Través de Múltiples Hosts',
      notes: {
        obj: 'Introducir el concepto de redes overlay y encapsulación VXLAN para preparar a los alumnos para la orquestación distribuida.',
        guion: [
          'La red bridge solo conecta contenedores en el mismo servidor. En un clúster necesitamos comunicación multi-host.',
          'Overlay utiliza VXLAN (puerto 4789 UDP) para encapsular las tramas Ethernet del contenedor dentro de paquetes IP estándar.',
          'Permite cifrado nativo de tráfico mediante túneles IPsec con `--opt encrypted`.',
          'Es el controlador predeterminado en Docker Swarm y la base de los plugins CNI en Kubernetes (Flannel, Calico).'
        ],
        preguntas: '¿Qué sobrecarga de bytes añade la cabecera VXLAN (50 bytes) y por qué obliga a ajustar el MTU de red a 1450 en lugar de 1500?',
        lab: 'Comprobar que crear una red overlay requiere inicializar Swarm o disponer de un almacén de claves distribuido.'
      }
    });

    cardsRow(s, [
      {
        title: 'Encapsulación VXLAN (L2 sobre L3)',
        icon: 'FaStream',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Reto Multi-Host:', text: 'Comunicar contenedores ubicados en diferentes servidores físicos sin ruteo manual.' },
          { lead: 'Túneles VXLAN:', text: 'Encapsula tramas Ethernet L2 en paquetes UDP estándar (puerto 4789) sobre la red física.' },
          { lead: 'Cifrado IPsec Nativo:', text: 'Soporte de cifrado en tránsito transparente con la opción `--opt encrypted`.' },
          { lead: 'Descubrimiento Distribuido:', text: 'El plan de control sincroniza las IPs y nombres entre todos los nodos del clúster.' }
        ]
      },
      {
        title: 'Ámbitos de Aplicación y Orquestación',
        icon: 'FaCloud',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Docker Swarm:', text: 'Driver nativo por defecto para interconectar réplicas de servicios distribuidos.' },
          { lead: 'Kubernetes (CNI):', text: 'Base conceptual de plugins de red como Calico, Flannel o Cilium (con eBPF).' },
          { lead: 'Independencia Física:', text: 'Los servicios se ven en una subred privada virtual común (ej. `10.0.0.0/24`).' },
          { lead: 'Control Plane Distribuido:', text: 'Utiliza protocolos gossip y consenso Raft para propagar rutas sin cuello de botella.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 31: Macvlan y Plugins de Red ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Macvlan & CNI',
      title: 'Macvlan y Complementos de Red: Integración en LAN Física',
      notes: {
        obj: 'Explicar cuándo utilizar Macvlan para integrar contenedores directamente en la LAN de la empresa y cómo los plugins amplían las funciones de red.',
        guion: [
          'En Macvlan cada contenedor obtiene una dirección MAC propia y una IP asignada por el router físico de la red corporativa.',
          'Aparece como un servidor físico más en el switch L2 sin pasar por NAT ni docker-proxy.',
          'Crucial para migración de aplicaciones legacy que no toleran NAT o requieren inspección de tráfico en firewalls físicos.',
          'Plugins avanzados (Calico, Cilium) permiten aplicar políticas de red por software e inspección con eBPF.'
        ],
        preguntas: '¿Por qué en nubes como AWS o Azure el modo Macvlan suele estar bloqueado por el proveedor de cloud? (Prevención de spoofing de MACs).',
        lab: 'Examinar los plugins instalados y la ayuda de plugins con `docker plugin ls`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Driver Macvlan (IP en la LAN Física)',
        icon: 'FaServer',
        tone: 'light',
        bullets: [
          { lead: 'Dirección MAC Propia:', text: 'Cada contenedor tiene su propia MAC y solicita IP directa al router/DHCP de la LAN.' },
          { lead: 'Sin NAT ni Port Mapping:', text: 'Aparece en la red física como un equipo más conectado directamente al switch.' },
          { lead: 'Migración Legacy:', text: 'Ideal para software antiguo que rechaza NAT o requiere puertos estándar sin mapeo.' },
          { lead: 'Modo Promiscuo:', text: 'La tarjeta física del host debe soportar modo promiscuo para cursar tráfico multi-MAC.' }
        ]
      },
      {
        title: 'Complementos de Red y Plugins CNI',
        icon: 'FaCogs',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Ecosistema Extensible:', text: 'Instalación de controladores de terceros mediante `docker plugin install`.' },
          { lead: 'Calico / Cilium:', text: 'Añaden políticas de seguridad por software (Network Policies) y filtrado eBPF.' },
          { lead: 'Cifrado WireGuard:', text: 'Encriptación punto a punto de todo el tráfico entre contenedores sin configuración manual.' },
          { lead: 'Enrutamiento BGP:', text: 'Propagación directa de rutas de contenedores hacia los routers troncales del datacenter.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 32: Laboratorio 2 ───
  {
    const s = slide(pres, {
      mod: 2,
      badge: 'Práctica Guiada',
      title: 'Laboratorio 2: Redes Personalizadas y DNS Embebido',
      lab: true,
      notes: {
        obj: 'Asegurar que los alumnos dominen la creación de redes bridge personalizadas y la resolución de nombres antes de pasar a almacenamiento.',
        guion: [
          'Guiar a los alumnos en la creación de `mi-red-app` y el despliegue de una base de datos Redis junto a un cliente Alpine.',
          'Comprobar que el ping al nombre del contenedor funciona inmediatamente.',
          'Crear una segunda red aislada para evidenciar que el aislamiento por diseño bloquea el tráfico no autorizado.',
          'Conectar en caliente con `docker network connect` y verificar la conectividad múltiple.'
        ],
        preguntas: '¿Alguien puede explicar por qué el ping funcionó con el nombre "cache-redis" sin editar /etc/hosts?',
        lab: [
          '1. Inspeccionar bridge por defecto: `docker network inspect bridge`.',
          '2. Crear red: `docker network create --driver bridge mi-red-app`.',
          '3. Arrancar Redis en la red: `docker run -d --name cache-redis --network mi-red-app redis:alpine`.',
          '4. Probar DNS: `docker run --rm --network mi-red-app alpine ping -c 2 cache-redis`.',
          '5. Crear red aislada y verificar bloqueo entre redes.',
          '6. Conexión en caliente: `docker network connect mi-red-app contenedor-externo`.',
          '7. Limpieza final con `docker rm -f` y `docker network rm`.'
        ]
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Objetivos del Laboratorio 2',
      icon: 'FaTools',
      tone: 'light',
      accent: COL.CORAL,
      bullets: [
        { lead: 'Paso 1 · Inspección:', text: 'Analizar la red bridge por defecto y constatar la ausencia de DNS interno.' },
        { lead: 'Paso 2 · Red Propia:', text: 'Crear `mi-red-app` utilizando el driver estándar bridge.' },
        { lead: 'Paso 3 · Servicio Cache:', text: 'Desplegar un contenedor Redis asociado directamente a la red creada.' },
        { lead: 'Paso 4 · Verificación DNS:', text: 'Invocar un contenedor cliente y hacer ping al hostname `cache-redis`.' },
        { lead: 'Paso 5 · Aislamiento:', text: 'Comprobar que contenedores en redes distintas no pueden comunicarse.' },
        { lead: 'Paso 6 · En Caliente:', text: 'Vincular un contenedor a dos redes a la vez con `docker network connect`.' },
        { lead: 'Paso 7 · Limpieza:', text: 'Eliminar los contenedores y destruir las redes creadas.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'RESOLUCIÓN DEL LABORATORIO 2',
      code: [
        '# 1. Crear red de trabajo personalizada',
        '$ docker network create --driver bridge mi-red-app',
        '',
        '# 2. Desplegar Redis en segundo plano',
        '$ docker run -d --name cache-redis --network mi-red-app redis:alpine',
        '',
        '# 3. Probar resolución DNS embebida por nombre',
        '$ docker run --rm --network mi-red-app alpine ping -c 2 cache-redis',
        '',
        '# 4. Crear red independiente de auditoría',
        '$ docker network create red-auditoria',
        '$ docker run -d --name app-aislada --network red-auditoria alpine sleep 3600',
        '',
        '# 5. Conectar en caliente el contenedor a la primera red',
        '$ docker network connect mi-red-app app-aislada',
        '$ docker exec app-aislada ping -c 2 cache-redis',
        '',
        '# 6. Limpieza ordenada',
        '$ docker rm -f cache-redis app-aislada',
        '$ docker network rm mi-red-app red-auditoria'
      ].join('\n')
    });
  }

  // ─── Diapositiva 33: Separador Módulo 3 · Almacenamiento y Volúmenes ───
  divider(pres, {
    mod: 3,
    title: 'ALMACENAMIENTO Y VOLÚMENES',
    subtitle: 'Persistencia de Datos: Storage Drivers (Overlay2), Named Volumes, Bind Mounts, Tmpfs, Backups y Migraciones.\nSegunda mitad de la Jornada 2 · 2.5 Horas Lectivas',
    hours: '2.5 HORAS LECTIVAS',
    topics: [
      { icon: 'FaHdd', text: 'Efímero vs Persistente: Desacoplar almacenamiento de cómputo.' },
      { icon: 'FaLayerGroup', text: 'Overlay2 a fondo: lowerdir, upperdir, merged y ficheros whiteout.' },
      { icon: 'FaDatabase', text: 'Los 3 mecanismos: Named Volumes, Bind Mounts y Tmpfs en RAM.' },
      { icon: 'FaSave', text: 'Estrategias de Backup, Restauración y Migración de Volúmenes.' },
      { icon: 'FaTools', text: 'Laboratorio 3: Persistencia de BD y Hot-Reloading en desarrollo.' }
    ],
    notes: {
      obj: 'Introducir la necesidad de persistencia de datos y desmontar el mito de que "Docker no sirve para bases de datos".',
      guion: [
        'Los datos almacenados en la capa del contenedor se pierden al destruirlo con `docker rm`.',
        'Los volúmenes montan sistemas de archivos que omiten el storage driver, ofreciendo rendimiento nativo de E/S.',
        'Exploraremos las tres opciones: Named Volumes (producción), Bind Mounts (desarrollo ágil) y Tmpfs (memoria volátil segura).'
      ],
      preguntas: '¿Qué pasa con los registros de una base de datos MySQL si actualizamos la versión de la imagen y recreamos el contenedor?',
      lab: 'Listar volúmenes locales con `docker volume ls` y comprobar el driver de almacenamiento con `docker info`.'
    }
  });

  // ─── Diapositiva 34: El Reto de la Persistencia ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Persistencia',
      title: 'El Reto de los Datos: Naturaleza Efímera vs Persistencia Crítica',
      notes: {
        obj: 'Hacer entender que los contenedores son efímeros pero los datos deben ser sagrados e independientes.',
        guion: [
          'La capa Copy-on-Write de Overlay2 es excelente para binarios estáticos pero ineficiente para motores de base de datos con escrituras continuas.',
          'Destruir un contenedor sin volúmenes elimina de forma irrecuperable toda la información generada.',
          'La solución profesional consiste en desacoplar el cómputo (contenedor desechable) del almacenamiento (volumen permanente).'
        ],
        preguntas: '¿Por qué no es recomendable escribir terabytes de logs o datos de base de datos en la capa de escritura del contenedor?',
        lab: 'Comprobar el driver de almacenamiento activo en el sistema con `docker info | grep -i "Storage Driver"`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Naturaleza Efímera del Contenedor',
        icon: 'FaExclamationTriangle',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Contenedores Desechables:', text: 'Deben poder destruirse, actualizarse y recrearse sin temor a perder información.' },
          { lead: 'Sobrecarga de Copy-on-Write:', text: 'La capa R/W añade penalizaciones de rendimiento en escrituras aleatorias masivas.' },
          { lead: 'Pérdida Irrecuperable:', text: 'Ejecutar `docker rm -f` destruye la capa superior y sus datos para siempre.' },
          { lead: 'Dificultad de Backup:', text: 'Extraer copias de seguridad desde capas internas del driver es complejo y propenso a fallos.' }
        ]
      },
      {
        title: 'Solución: Desacoplamiento de Datos',
        icon: 'FaDatabase',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Cómputo vs Almacenamiento:', text: 'Los datos residen en estructuras de almacenamiento ajenas al ciclo del contenedor.' },
          { lead: 'Rendimiento Nativo de E/S:', text: 'Los volúmenes omiten Overlay2 y escriben a la velocidad de disco nativa del host.' },
          { lead: 'Compartición Concurrente:', text: 'Múltiples contenedores pueden montar el mismo volumen simultáneamente.' },
          { lead: 'Persistencia Garantizada:', text: 'Si el contenedor colapsa o se borra, los datos permanecen completamente a salvo.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 35: Capas y Overlay2 a Fondo ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Overlay2 Internals',
      title: 'Overlay2 a Fondo: La Magia del Union File System',
      notes: {
        obj: 'Explicar técnicamente los 4 directorios de Overlay2 (lowerdir, upperdir, workdir, merged) y los ficheros whiteout.',
        guion: [
          '`lowerdir`: capas de solo lectura de la imagen apiladas.',
          '`upperdir`: capa de lectura/escritura del contenedor.',
          '`workdir`: directorio interno de Linux para preparar copias atómicas.',
          '`merged`: punto de montaje unificado que ve el contenedor en `/`.',
          'Si el contenedor borra un archivo de la imagen base, Overlay2 crea un archivo especial "whiteout" (character device 0,0) que lo enmascara en la vista merged.'
        ],
        preguntas: 'Si borras un archivo de 2GB de la imagen base dentro del contenedor, ¿se reduce el espacio ocupado en disco? (¡No, solo se crea un whiteout!).',
        lab: 'Inspeccionar los directorios exactos con `docker inspect -f "{{json .GraphDriver.Data}}" mi-contenedor`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Los 4 Directorios de Overlay2',
      icon: 'FaLayerGroup',
      tone: 'light',
      bullets: [
        { lead: 'lowerdir:', text: 'Colección de capas de solo lectura apiladas provenientes de la imagen OCI.' },
        { lead: 'upperdir:', text: 'Directorio de lectura/escritura exclusivo del contenedor para modificaciones y nuevos ficheros.' },
        { lead: 'workdir:', text: 'Directorio interno de trabajo del kernel para preparar copias atómicas antes del commit.' },
        { lead: 'merged:', text: 'Punto de montaje `/` unificado que percibe el proceso del contenedor.' },
        { lead: 'Ficheros Whiteout:', text: 'Dispositivos de caracteres (0,0) creados en el upperdir para ocultar archivos borrados.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'INSPECCIÓN DEL GRAPHDRIVER EN DISCO',
      code: [
        '# Inspeccionar los directorios asignados por Overlay2',
        '$ docker inspect -f \'{{json .GraphDriver.Data}}\' mi-app',
        '{',
        '  "LowerDir": "/var/lib/docker/overlay2/abc.../diff:...",',
        '  "MergedDir": "/var/lib/docker/overlay2/def.../merged",',
        '  "UpperDir": "/var/lib/docker/overlay2/def.../diff",',
        '  "WorkDir": "/var/lib/docker/overlay2/def.../work"',
        '}',
        '',
        '# ¿Qué ocurre al borrar un fichero de la imagen?',
        '# Overlay2 genera un whiteout en Upperdir que oculta',
        '# el inodo de Lowerdir sin liberar el espacio en disco.',
        '$ ls -l /var/lib/docker/overlay2/def.../diff/fichero_borrado',
        'c--------- 1 root root 0, 0 oct 27 10:00 fichero_borrado'
      ].join('\n')
    });
  }

  // ─── Diapositiva 36: Los Tres Mecanismos de Persistencia ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Mecanismos de Persistencia',
      title: 'Los Tres Mecanismos de Persistencia: Volumes, Binds y Tmpfs',
      notes: {
        obj: 'Presentar la comparativa canónica entre Named Volumes, Bind Mounts y Tmpfs.',
        guion: [
          'Named Volumes: administrados por Docker en `/var/lib/docker/volumes/`, aislados de usuarios comunes y óptimos para producción.',
          'Bind Mounts: vinculan cualquier ruta arbitraria del host hacia el contenedor, ideales para desarrollo local con recarga en caliente.',
          'Tmpfs Mounts: montajes volátiles en memoria RAM, ideales para secretos, tokens temporales y rendimiento extremo sin rastro en disco.'
        ],
        preguntas: '¿Cuál de los tres mecanismos elegirías para guardar el código fuente mientras programas en tu portátil con VS Code?',
        lab: 'Crear un volumen con `docker volume create test-vol` e inspeccionar sus propiedades.'
      }
    });

    cardsRow(s, [
      {
        title: 'Named Volumes',
        icon: 'FaHdd',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Ubicación:', text: '`/var/lib/docker/volumes/`.' },
          { lead: 'Gestión:', text: 'Administrado íntegramente por el motor Docker.' },
          { lead: 'Seguridad:', text: 'Aislado de manipulaciones indebidas en el host.' },
          { lead: 'Soporte Cloud:', text: 'Compatible con plugins de red (NFS, AWS EBS).' },
          { lead: 'Uso Canónico:', text: 'Bases de datos y almacenamiento en producción.' }
        ]
      },
      {
        title: 'Bind Mounts',
        icon: 'FaFolderOpen',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Ubicación:', text: 'Cualquier directorio o archivo del host (`/ruta`).' },
          { lead: 'Gestión:', text: 'Dependiente de la estructura de ficheros del host.' },
          { lead: 'Edición en Vivo:', text: 'El host y el contenedor comparten acceso simultáneo.' },
          { lead: 'Riesgos:', text: 'Desalineación de permisos numéricos UID/GID.' },
          { lead: 'Uso Canónico:', text: 'Desarrollo local con recarga en caliente (hot-reload).' }
        ]
      },
      {
        title: 'Tmpfs Mounts',
        icon: 'FaMemory',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Ubicación:', text: 'Memoria RAM del sistema anfitrión.' },
          { lead: 'Gestión:', text: 'No escribe jamás bloques en disco físico.' },
          { lead: 'Velocidad:', text: 'Rendimiento de E/S máximo a velocidad de memoria.' },
          { lead: 'Volatilidad:', text: 'Se destruye totalmente al parar el contenedor.' },
          { lead: 'Uso Canónico:', text: 'Secretos temporales, tokens OAuth y cachés volátiles.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 37: Volúmenes con Nombre (Named Volumes) ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Named Volumes',
      title: 'Volúmenes con Nombre (Named Volumes): Estándar de Producción',
      notes: {
        obj: 'Demostrar que destruir el contenedor no elimina los datos si residen en un Named Volume.',
        guion: [
          'Los Named Volumes poseen ciclo de vida independiente: `docker rm` no los toca.',
          'Inicialización automática: si montas un volumen vacío sobre un directorio de la imagen que ya contiene archivos (ej. `/var/lib/postgresql/data`), Docker copia esos archivos al volumen.',
          'Recomendar la sintaxis moderna `--mount` frente al flag clásico `-v` por ser explícita y auto-documentada.',
          'Uso de `docker volume prune` para eliminar volúmenes huérfanos que no estén atados a ningún contenedor activo.'
        ],
        preguntas: '¿Qué ocurre si dos contenedores montan el mismo Named Volume a la vez? (Ambos pueden escribir, ojo con bloqueos en la aplicación).',
        lab: 'Crear un volumen, escribir un archivo desde un contenedor efímero y leerlo desde otro contenedor distinto.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Ciclo de Vida de los Volúmenes',
      icon: 'FaSave',
      tone: 'light',
      bullets: [
        { lead: 'Independencia Total:', text: 'Los volúmenes sobreviven al borrado de cualquier contenedor que los monte.' },
        { lead: 'Poblado Automático:', text: 'Docker copia los archivos preexistentes de la imagen hacia el volumen nuevo en el primer arranque.' },
        { lead: 'Sintaxis Explícita `--mount`:', text: 'Mayor legibilidad y diferenciación entre volúmenes, binds y tmpfs.' },
        { lead: 'Higiene del Sistema:', text: 'Comando `docker volume prune` para liberar volúmenes que han quedado huérfanos.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'DEMOSTRACIÓN DE PERSISTENCIA REAL',
      code: [
        '# 1. Crear volumen explícito para PostgreSQL',
        '$ docker volume create pgdata',
        '',
        '# 2. Desplegar BD montando el volumen con sintaxis moderna',
        '$ docker run -d --name db-postgres \\',
        '    --mount source=pgdata,target=/var/lib/postgresql/data \\',
        '    -e POSTGRES_PASSWORD=secreto postgres:16-alpine',
        '',
        '# 3. Destruir forzosamente el contenedor',
        '$ docker rm -f db-postgres',
        '',
        '# 4. Recrear el contenedor a partir de una versión superior',
        '$ docker run -d --name db-postgres-nuevo \\',
        '    --mount source=pgdata,target=/var/lib/postgresql/data \\',
        '    postgres:16-alpine',
        '',
        '# ¡Todas las tablas y datos continúan intactos en pgdata!'
      ].join('\n')
    });
  }

  // ─── Diapositiva 38: Montajes de Enlace (Bind Mounts) ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Bind Mounts',
      title: 'Bind Mounts: Desarrollo Ágil y Riesgos de Permisos UID/GID',
      notes: {
        obj: 'Enseñar el uso adecuado de Bind Mounts en desarrollo y prevenir el dolor de cabeza clásico de permisos UID/GID desalineados.',
        guion: [
          'Permite montar una carpeta del host dentro del contenedor para hot-reloading (editar en VS Code y ver el cambio sin reconstruir la imagen).',
          'Atención: montar una carpeta vacía del host sobre una carpeta con archivos en el contenedor oculta los archivos del contenedor.',
          'Problema de permisos: si el contenedor corre como root (UID 0), creará archivos en el host pertenecientes a root que el desarrollador no podrá editar sin sudo.',
          'Solución: pasar el UID del usuario actual con `--user "$(id -u):$(id -g)"` y usar `:ro` para montajes de sólo lectura.'
        ],
        preguntas: '¿A cuántos os ha pasado crear archivos desde Docker y luego no poder editarlos ni borrarlos en vuestro host?',
        lab: 'Montar el directorio actual con Bind Mount en modo lectura: `docker run --rm -v "$(pwd):/app:ro" alpine ls /app`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'La Herramienta del Desarrollador',
      icon: 'FaCode',
      tone: 'light',
      bullets: [
        { lead: 'Edición en Vivo (Hot-Reload):', text: 'Modificar código en el IDE del host y comprobar cambios sin reconstruir la imagen.' },
        { lead: 'Rutas Absolutas Obligatorias:', text: 'Requiere indicar rutas completas del host (`$(pwd)/src:/app/src`).' },
        { lead: 'Riesgo de Ocultación:', text: 'Montar un directorio vacío oculta los archivos preexistentes en esa ruta del contenedor.' },
        { lead: 'Modo Solo Lectura (`:ro`):', text: 'Buena práctica para proteger configuraciones críticas y evitar escrituras no deseadas.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'USO SEGURO Y RESOLUCIÓN DE PERMISOS',
      code: [
        '# 1. Montaje para desarrollo web con recarga en caliente',
        '$ docker run -d --name web-dev \\',
        '    -p 3000:3000 \\',
        '    -v "$(pwd)/src:/app/src:ro" \\',
        '    node:20-alpine npm run dev',
        '',
        '# 2. Solución al problema de permisos UID/GID:',
        '# Si el contenedor corre como UID 0, los archivos creados',
        '# pertenecerán a root en el host. Pasar el UID propio:',
        '$ docker run --user "$(id -u):$(id -g)" \\',
        '    -v "$(pwd):/workspace" mi-compilador make',
        '',
        '# 3. Sintaxis explícita con --mount en solo lectura:',
        '$ docker run --mount type=bind,source=/etc/ssl,target=/certs,readonly nginx'
      ].join('\n')
    });
  }

  // ─── Diapositiva 39: Montajes Tmpfs ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Tmpfs Mounts',
      title: 'Tmpfs Mounts: Almacenamiento en Memoria RAM para Secretos',
      notes: {
        obj: 'Instruir en el uso de tmpfs para optimizar el rendimiento y la seguridad de datos volátiles y credenciales.',
        guion: [
          'Los ficheros residen exclusivamente en la memoria RAM del host; jamás se escriben en disco físico.',
          'Al detener el contenedor, los datos desaparecen al instante sin dejar fragmentos recuperables en el sistema de archivos.',
          'Ideal para certificados TLS temporales, llaves privadas, tokens OAuth o carpetas de caché de alta rotación.',
          'Es fundamental limitar el tamaño con `tmpfs-size=64m` para evitar que un proceso llene la memoria RAM del host.'
        ],
        preguntas: '¿Por qué es una pésima práctica dejar tokens de API o claves privadas en el sistema de archivos del contenedor en lugar de tmpfs?',
        lab: 'Montar una carpeta en memoria RAM y verificar el tipo de filesystem con `docker run --rm --tmpfs /ram_dir alpine df -T /ram_dir`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Almacenamiento Volátil de Alta Seguridad',
      icon: 'FaMemory',
      tone: 'light',
      accent: COL.CORAL,
      bullets: [
        { lead: 'Directo a Memoria RAM:', text: 'Los archivos se escriben en memoria sin tocar jamás los discos SSD/NVMe del servidor.' },
        { lead: 'Cero Huella Forense:', text: 'Al parar el contenedor los datos desaparecen sin dejar fragmentos en disco.' },
        { lead: 'Custodia de Secretos:', text: 'Óptimo para certificados efímeros, llaves privadas y tokens de autenticación.' },
        { lead: 'Límites Estrictos:', text: 'Configurar `tmpfs-size` para evitar que un contenedor desbocado agote la memoria del host.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'MONTAJE TMPFS EN TERMINAL',
      code: [
        '# 1. Montar directorio seguro en RAM con límite de 64MB',
        '$ docker run -d --name app-segura \\',
        '    --tmpfs /app/secrets:rw,noexec,nosuid,size=64m \\',
        '    nginx:alpine',
        '',
        '# 2. Comprobar que está respaldado por memoria',
        '$ docker exec app-segura df -h /app/secrets',
        'Filesystem  Size  Used  Avail  Use%  Mounted on',
        'tmpfs       64M      0    64M    0%  /app/secrets',
        '',
        '# 3. Sintaxis formal mediante --mount:',
        '$ docker run --mount type=tmpfs,destination=/app/cache,\\',
        '    tmpfs-size=128m,tmpfs-mode=1777 mi-app'
      ].join('\n')
    });
  }

  // ─── Diapositiva 40: Contenedores de Volúmenes de Datos (Histórico) ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Perspectiva Histórica',
      title: 'Contenedores de Volúmenes de Datos: Perspectiva y Desuso',
      notes: {
        obj: 'Explicar el punto del temario oficial "Contenedores de volúmenes de datos" contextualizándolo históricamente.',
        guion: [
          'En las primeras versiones de Docker (2013-2014) no existía el comando `docker volume` ni los Named Volumes.',
          'Se utilizaba el patrón Data Volume Container: un contenedor en estado Exited que servía de "ancla" para compartir carpetas vía `--volumes-from`.',
          'Con la llegada de Docker 1.9 en 2015, los volúmenes pasaron a ser ciudadanos de primera clase gestionables de forma independiente.',
          'Hoy este patrón está completamente en desuso y no debe aplicarse en nuevos despliegues.'
        ],
        preguntas: '¿Por qué mantener un contenedor en estado Exited solo para sujetar una carpeta era una solución poco elegante y frágil?',
        lab: 'Probar el comando histórico con `docker create -v /datos --name data-holder alpine` y entender su funcionamiento legacy.'
      }
    });

    cardsRow(s, [
      {
        title: 'El Patrón `--volumes-from` (2014)',
        icon: 'FaBook',
        tone: 'light',
        bullets: [
          { lead: 'El Problema en 2014:', text: 'En versiones tempranas de Docker no existían comandos de gestión para volúmenes.' },
          { lead: 'Contenedor Centinela:', text: 'Se creaba un contenedor tonto que definía volúmenes y permanecía detenido (`Exited`).' },
          { lead: 'Uso de `--volumes-from`:', text: 'Otros contenedores montaban sus datos haciendo referencia al contenedor detenido.' },
          { lead: 'Fragilidad:', text: 'Si alguien ejecutaba `docker rm -v` sobre el centinela, los datos se eliminaban sin aviso.' }
        ]
      },
      {
        title: 'Por Qué Hoy Está en Desuso',
        icon: 'FaCheckCircle',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Llegada de Docker 1.9:', text: 'Se introdujo el subsistema nativo completo `docker volume`.' },
          { lead: 'Ciudadanos de Primera Clase:', text: 'Los volúmenes tienen nombre, ciclo de vida e inventario propio e independiente.' },
          { lead: 'Drivers y Plugins Modernos:', text: 'Permiten conectarse a almacenamiento en red (NFS, AWS EBS), imposible con el patrón viejo.' },
          { lead: 'Conclusión:', text: 'Comprenderlo para código legacy, pero utilizar exclusivamente Named Volumes en proyectos nuevos.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 41: Drivers de Almacenamiento Remoto ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Almacenamiento Remoto',
      title: 'Drivers de Almacenamiento Remoto: NFS, SAN y Cloud',
      notes: {
        obj: 'Mostrar cómo los volúmenes de Docker pueden conectarse a almacenamiento en red corporativo y discos elásticos en la nube.',
        guion: [
          'Un volumen local está atado físicamente al disco del servidor donde corre dockerd.',
          'El driver `local` nativo de Docker permite pasar opciones del comando `mount` de Linux para montar recursos compartidos NFS o CIFS.',
          'Plugins de nube permiten atar volúmenes a discos persistentes gestionados (AWS EBS, Azure Files, Google Persistent Disk).',
          'Si un contenedor se mueve de nodo en un clúster, puede reconectarse al mismo volumen remoto sin pérdida de estado.'
        ],
        preguntas: '¿Qué precauciones de latencia de red debemos tener si una base de datos escribe intensivamente en un volumen NFS montado remotamente?',
        lab: 'Inspeccionar la ayuda de drivers de volumen con `docker volume create --help`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Almacenamiento Distribuido y de Red',
      icon: 'FaCloud',
      tone: 'light',
      bullets: [
        { lead: 'Más Allá del Disco Local:', text: 'Permite que los datos sigan al contenedor si se desplaza entre diferentes nodos.' },
        { lead: 'Driver Local con Opciones:', text: 'El driver `local` puede invocar llamadas `mount` para NFS, CIFS o SSHFS.' },
        { lead: 'Integración Cloud:', text: 'Plugins especializados para montar discos elásticos en AWS, Azure y Google Cloud.' },
        { lead: 'Alta Disponibilidad:', text: 'Permite desacoplar el ciclo de vida del servidor físico del almacenamiento de datos.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'MONTAJE DE VOLUMEN NFS EN DOCKER',
      code: [
        '# 1. Crear volumen Docker respaldado por un servidor NFS',
        '$ docker volume create --driver local \\',
        '    --opt type=nfs \\',
        '    --opt o=addr=192.168.1.100,rw,noatime,rsize=8192 \\',
        '    --opt device=:/srv/nfs/datos_compartidos \\',
        '    volumen-nfs',
        '',
        '# 2. Montar el volumen en cualquier contenedor',
        '$ docker run -d --name app-nfs \\',
        '    -v volumen-nfs:/app/storage \\',
        '    mi-aplicacion:1.0',
        '',
        '# Si el contenedor se traslada a otro servidor físico,',
        '# montará exactamente el mismo volumen NFS con los mismos datos.'
      ].join('\n')
    });
  }

  // ─── Diapositiva 42: Backup, Restauración y Migración ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Backups y Migración',
      title: 'Estrategias de Backup, Restauración y Migración de Volúmenes',
      notes: {
        obj: 'Proporcionar la receta canónica para hacer copias de seguridad reproducibles de volúmenes sin detener el motor Docker.',
        guion: [
          'No se debe copiar a mano `/var/lib/docker/volumes` con el contenedor escribiendo en él (riesgo de corrupción).',
          'Patrón contenedor de backup: un contenedor efímero Alpine monta el volumen en solo lectura (`:ro`) y un directorio del host donde genera un `.tar.gz`.',
          'La restauración realiza el proceso inverso descomprimiendo el archivo tar dentro de un volumen nuevo.',
          'Esta técnica es integrable en scripts de cron o pipelines de CI/CD para automatizar respaldos periódicos.'
        ],
        preguntas: '¿Por qué montar el volumen en modo :ro durante la copia de seguridad es vital para la integridad del archivo tar?',
        lab: 'Crear un volumen de prueba, generar un backup en tar con Alpine y restaurarlo en un segundo volumen.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'El Patrón Contenedor de Backup',
      icon: 'FaSave',
      tone: 'light',
      accent: COL.COBALT,
      bullets: [
        { lead: 'Sin Parar el Motor:', text: 'No requiere acceso root directo a `/var/lib/docker` ni reiniciar servicios.' },
        { lead: 'Contenedor Efímero (`--rm`):', text: 'Un contenedor Alpine monta el volumen en solo lectura y la carpeta de backups.' },
        { lead: 'Automatizable en Cron:', text: 'Se ejecuta en una sola línea de terminal ideal para tareas programadas de madrugada.' },
        { lead: 'Migración entre Servidores:', text: 'El archivo `.tar.gz` resultante puede enviarse por scp o rsync a otro host y restaurarse.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'COMANDOS DE BACKUP Y RESTAURACIÓN',
      code: [
        '# 1. BACKUP: Empaquetar el volumen "pgdata" en un tar comprimido',
        '$ docker run --rm \\',
        '    -v pgdata:/volumen_origen:ro \\',
        '    -v $(pwd)/backups:/backup_destino \\',
        '    alpine tar czf /backup_destino/pgdata_$(date +%F).tar.gz \\',
        '           -C /volumen_origen .',
        '',
        '# 2. RESTAURACIÓN: Descomprimir en un volumen nuevo',
        '$ docker volume create pgdata_recuperado',
        '$ docker run --rm \\',
        '    -v pgdata_recuperado:/volumen_destino \\',
        '    -v $(pwd)/backups:/backup_destino \\',
        '    alpine tar xzf /backup_destino/pgdata_2026-10-27.tar.gz \\',
        '           -C /volumen_destino'
      ].join('\n')
    });
  }

  // ─── Diapositiva 43: Buenas Prácticas de Persistencia ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Buenas Prácticas',
      title: 'Buenas Prácticas en Gestión de Persistencia y Antipatrones',
      notes: {
        obj: 'Fijar buenas prácticas estrictas y alertar sobre los errores más costosos en la gestión del almacenamiento en producción.',
        guion: [
          'Jamás usar `docker commit` para "guardar datos": destruye la reproducibilidad y crea imágenes infladas imposibles de auditar.',
          'No usar bind mounts con rutas absolutas de portátiles en entornos de producción.',
          'Separar discos: montar `/var/lib/docker` en un volumen o partición LVM separada para que un desbordamiento de almacenamiento no colapse el host.',
          'Programar limpiezas periódicas con `docker volume prune` para no acumular volúmenes huérfanos.'
        ],
        preguntas: '¿Por qué la directiva VOLUME en el Dockerfile puede generar decenas de volúmenes huérfanos sin que nos demos cuenta?',
        lab: 'Inspeccionar volúmenes huérfanos con `docker volume ls -q -f dangling=true`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Reglas de Oro en Producción',
        icon: 'FaCheckCircle',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Datos Fuera del Contenedor:', text: 'Toda información persistente debe residir en Named Volumes o Bind Mounts.' },
          { lead: 'Nombres Descriptivos:', text: 'Nombrar siempre los volúmenes explícitamente para evitar volúmenes anónimos.' },
          { lead: 'Partición Separada en Host:', text: 'Montar `/var/lib/docker` en un disco o LVM dedicado para no saturar `/` del host.' },
          { lead: 'Auditoría con Labels:', text: 'Etiquetar volúmenes (`--label env=prod`) para facilitar políticas de retención.' }
        ]
      },
      {
        title: 'Antipatrones a Erradicar',
        icon: 'FaTimes',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Antipatrón `docker commit`:', text: 'Hacer commits manuales para guardar estado destruye la reproducibilidad del Dockerfile.' },
          { lead: 'Rutas Absolutas de Portátil:', text: 'Subir rutas de tipo `/Users/juan/...` a producción rompe el despliegue.' },
          { lead: 'Descuido de Permisos:', text: 'Olvidar comprobar si el usuario no root del contenedor tiene permisos de escritura en el volumen.' },
          { lead: 'Volúmenes Huérfanos Acumulados:', text: 'No realizar mantenimiento de `docker volume prune`, saturando el almacenamiento.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 44: Laboratorio 3 ───
  {
    const s = slide(pres, {
      mod: 3,
      badge: 'Práctica Guiada',
      title: 'Laboratorio 3: Persistencia de BD y Hot-Reloading en Desarrollo',
      lab: true,
      notes: {
        obj: 'Dar 60-75 minutos a los alumnos para experimentar el contraste real entre persistencia en base de datos y desarrollo ágil con Bind Mount.',
        guion: [
          'Parte A: Desplegar PostgreSQL con un Named Volume, crear una tabla e insertar datos, destruir el contenedor y comprobar que los datos sobreviven en un contenedor nuevo.',
          'Parte B: Configurar un Bind Mount hacia una aplicación web y comprobar que al editar un archivo en el host los cambios se ven en vivo sin hacer rebuild.',
          'Supervisar posibles problemas de permisos en el host.'
        ],
        preguntas: '¿Quién ha podido destruir el contenedor de PostgreSQL y volver a ver sus datos en el contenedor nuevo?',
        lab: [
          '1. Crear volumen: `docker volume create db_datos`.',
          '2. Arrancar PostgreSQL: `docker run -d --name pg-test -v db_datos:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secreto postgres:16-alpine`.',
          '3. Crear tabla e insertar registros con psql.',
          '4. Destruir contenedor: `docker rm -f pg-test`.',
          '5. Recrear contenedor con la misma versión o superior y verificar que los datos persisten.',
          '6. Parte B: Arrancar Nginx montando código HTML con `-v $(pwd)/src:/usr/share/nginx/html:ro`.',
          '7. Modificar HTML en el editor del host y verificar recarga instantánea con curl.'
        ]
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Objetivos del Laboratorio 3',
      icon: 'FaTools',
      tone: 'light',
      accent: COL.CORAL,
      bullets: [
        { lead: 'Parte A · Persistencia BD:', text: 'Crear Named Volume `db_datos` y arrancar PostgreSQL.' },
        { lead: 'Paso 2 · Inserción:', text: 'Crear una tabla de usuarios e insertar registros de prueba con psql.' },
        { lead: 'Paso 3 · Desastre Simulado:', text: 'Eliminar el contenedor forzosamente con `docker rm -f`.' },
        { lead: 'Paso 4 · Comprobación:', text: 'Levantar un nuevo contenedor y verificar que las tablas siguen íntegras.' },
        { lead: 'Parte B · Hot-Reloading:', text: 'Montar código del host en Nginx con Bind Mount en solo lectura.' },
        { lead: 'Paso 6 · Edición en Vivo:', text: 'Editar el código en el host y comprobar la actualización instantánea sin rebuild.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'RESOLUCIÓN DEL LABORATORIO 3',
      code: [
        '# PARTE A: Persistencia con Named Volume',
        '$ docker volume create db_datos',
        '$ docker run -d --name db-test -v db_datos:/var/lib/postgresql/data \\',
        '    -e POSTGRES_PASSWORD=secreto postgres:16-alpine',
        '$ docker exec -i db-test psql -U postgres -c \\',
        '    "CREATE TABLE alumnos (id int, nombre text); INSERT INTO alumnos VALUES (1, \'Ana\');"',
        '$ docker rm -f db-test',
        '$ docker run -d --name db-recuperada -v db_datos:/var/lib/postgresql/data \\',
        '    -e POSTGRES_PASSWORD=secreto postgres:16-alpine',
        '$ docker exec -i db-recuperada psql -U postgres -c "SELECT * FROM alumnos;"',
        '',
        '# PARTE B: Desarrollo Ágil con Bind Mount',
        '$ mkdir -p ~/web-dev && echo "<h1>Version 1.0</h1>" > ~/web-dev/index.html',
        '$ docker run -d --name dev-nginx -p 8080:80 -v ~/web-dev:/usr/share/nginx/html:ro nginx:alpine',
        '$ curl http://localhost:8080',
        '$ echo "<h1>Version 2.0 (En Vivo)</h1>" > ~/web-dev/index.html',
        '$ curl http://localhost:8080  # ¡Cambio instantáneo!'
      ].join('\n')
    });
  }

  // ─── Diapositiva 45: Resumen de la Jornada 2 y Cierre ───
  divider(pres, {
    mod: 3,
    title: 'RESUMEN DE LA JORNADA 2',
    subtitle: 'Conceptos consolidados: Redes (Bridge, Host, None, Overlay, DNS interno, iptables) y Persistencia (Overlay2, Volumes, Binds, Tmpfs).\nPróxima Jornada: Módulo 4 (Contenedores en Cloud y Orquestación con Docker Compose).',
    hours: 'CONCLUSIÓN DÍA 2',
    topics: [
      { icon: 'FaCheckCircle', text: 'Redes: El DNS embebido 127.0.0.11 hace obligatorias las redes personalizadas.' },
      { icon: 'FaCheckCircle', text: 'Mapeo de Puertos: iptables DNAT y docker-proxy para acceso exterior.' },
      { icon: 'FaCheckCircle', text: 'Persistencia: Desacoplar almacenamiento de cómputo para datos de producción.' },
      { icon: 'FaCheckCircle', text: 'Named Volumes vs Bind Mounts vs Tmpfs: Casos de uso y directrices claras.' },
      { icon: 'FaCheckCircle', text: 'Laboratorios 2 y 3 completados con éxito por los alumnos.' }
    ],
    notes: {
      obj: 'Cerrar la Jornada 2 resolviendo dudas finales sobre redes y almacenamiento y anticipar el salto al Cloud y Compose del Día 3.',
      guion: [
        'Hacer balance de los conocimientos adquiridos en las primeras 10 horas del curso.',
        'Los alumnos ya dominan cómo se aíslan los procesos, cómo se compilan imágenes con Dockerfile, cómo se comunican por red y cómo persisten los datos.',
        'Anticipar que mañana abordaremos la orquestación multicontenedor con Docker Compose y los servicios de contenedores en la nube (Azure, AWS, GCP).'
      ],
      preguntas: '¿Tenéis clara la diferencia de uso entre un Named Volume y un Bind Mount en un proyecto real?',
      lab: 'Limpiar recursos huérfanos con `docker system prune -f` antes de cerrar la sesión formativa.'
    }
  });
}

module.exports = { buildModule2And3 };
