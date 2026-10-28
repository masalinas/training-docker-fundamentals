'use strict';
/**
 * m5.js — Módulo 5 (Día 4): Introducción a la Orquestación y Kubernetes.
 * Genera 18 diapositivas técnicas (diapositivas 64 a 81 de la presentación general).
 */
const H = require('./layout_helpers');
const D = require('./diagrams');

const {
  COL, CX, CY, CW, CH,
  slide, divider, closing,
  card, cardsRow, cardsGrid, code, table, steps, stat, callout
} = H;

function buildModule5(pres) {
  // ─── Diapositiva 64: Separador Módulo 5 · Orquestación y Kubernetes ───
  divider(pres, {
    mod: 5,
    title: 'ORQUESTACIÓN Y KUBERNETES',
    subtitle: 'Módulo 5: ¿Por qué Orquestar?, Swarm vs K8s vs Nomad, Arquitectura K8s, Primitivas y Taller Integrador.\nJornada 4 de 4 · 5 Horas Lectivas (20h totales)',
    hours: '5 HORAS LECTIVAS',
    topics: [
      { icon: 'FaProjectDiagram', text: 'Límites de Docker Standalone y la necesidad de orquestación.' },
      { icon: 'FaExchangeAlt', text: 'Comparativa de Orquestadores: Docker Swarm vs K8s vs Nomad.' },
      { icon: 'FaSitemap', text: 'Arquitectura de Kubernetes: Control Plane y Worker Nodes.' },
      { icon: 'FaSyncAlt', text: 'El Modelo Declarativo y los Bucles de Reconciliación continua.' },
      { icon: 'FaCubes', text: 'Primitivas básicas de K8s: Pods, Deployments y Services.' },
      { icon: 'FaTools', text: 'Laboratorio 5: Despliegue, auto-recuperación y Rolling Update.' }
    ],
    notes: {
      obj: 'Dar la bienvenida a la última jornada del curso y presentar el salto de gestionar contenedores individuales a coordinar clústeres elásticos.',
      guion: [
        'Docker Engine gestiona contenedores en un único host. La orquestación abstrae una flota de decenas o cientos de servidores para que el operador los gestione como una única gran computadora lógica.',
        'Analizaremos cómo se resuelven los retos de alta disponibilidad, auto-recuperación (self-healing), balanceo de carga y actualizaciones continuas sin downtime.',
        'Desgranaremos la arquitectura interna de Kubernetes (K8s) y sus primitivas esenciales: Pods, Deployments y Services.'
      ],
      preguntas: 'Si tenéis 60 contenedores repartidos en 10 servidores y uno de ellos sufre una avería física a las 3 de la madrugada, ¿quién reinicia los servicios afectados?',
      lab: 'Verificar el estado del subsistema Swarm con `docker info | grep -i "Swarm"`.'
    }
  });

  // ─── Diapositiva 65: ¿Por qué Orquestar? Los Límites de Docker Standalone ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Orquestación',
      title: '¿Por qué Orquestar? Los Límites Críticos de Docker Standalone',
      notes: {
        obj: 'Hacer reflexionar a los alumnos sobre el paso crítico de entornos locales de desarrollo a operaciones de producción 24/7.',
        guion: [
          'En un único host hay un Punto Único de Fallo (SPOF): si el servidor cae, todos los contenedores mueren.',
          'Capacidad limitada: el servidor físico tiene un tope finito de CPU y RAM (límite del escalado vertical).',
          'La directiva `--restart always` solo reinicia el contenedor si el host sigue vivo; no puede moverlo a otra máquina.',
          'El orquestador unifica los servidores en un grupo de recursos lógicos y garantiza auto-sanación (self-healing).'
        ],
        preguntas: '¿Qué hacéis en vuestra empresa cuando hay que actualizar una versión en producción para que los clientes no sufran cortes?',
        lab: 'Reflexionar sobre la imposibilidad de hacer alta disponibilidad en un único host.'
      }
    });

    cardsRow(s, [
      {
        title: 'Los Límites de un Solo Host',
        icon: 'FaExclamationTriangle',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Punto Único de Fallo (SPOF):', text: 'Si el servidor cae por hardware o red, todos los servicios colapsan.' },
          { lead: 'Límite de Escalado Vertical:', text: 'Un único servidor tiene un tope físico de CPU y memoria RAM finita.' },
          { lead: 'Sin Auto-Recuperación Multi-Host:', text: '`--restart always` no puede mover el contenedor a otro servidor sano.' },
          { lead: 'Gestión Manual Inviable:', text: 'Monitorear y actualizar 100 contenedores manualmente en múltiples IPs es imposible.' }
        ]
      },
      {
        title: 'La Promesa del Orquestador',
        icon: 'FaProjectDiagram',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Abstracción de Clúster:', text: 'Unifica decenas de servidores en un único grupo lógico de cómputo y red.' },
          { lead: 'Auto-Sanación (Self-Healing):', text: 'Detecta la muerte de un nodo y reprograma los contenedores en nodos sanos.' },
          { lead: 'Balanceo de Carga L4/L7:', text: 'Distribución inteligente del tráfico entrante entre todas las réplicas activas.' },
          { lead: 'Rolling Updates sin Downtime:', text: 'Actualizaciones continuas contenedor a contenedor sin caída de servicio.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 66: Las 5 Capacidades Clave de un Orquestador ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Pilares de Orquestación',
      title: 'Las 5 Capacidades Clave de un Orquestador Moderno',
      notes: {
        obj: 'Fijar las 5 responsabilidades esenciales que cualquier orquestador (Swarm, K8s, Nomad) debe proporcionar por diseño.',
        guion: [
          '1. Scheduling inteligente: decide en qué nodo exacto colocar cada contenedor evaluando recursos libres, afinidad y tolerancia.',
          '2. Auto-Sanación: vigila las sondas de salud; si un proceso no responde, lo liquida y crea uno nuevo.',
          '3. Escalado horizontal automático: añade o retira réplicas según métricas de CPU, memoria o peticiones concurrentes.',
          '4. Descubrimiento de servicios y balanceo: asigna IP virtual estable y nombre DNS balanceando el tráfico.',
          '5. Rolling updates y rollbacks: actualiza versión a versión con vuelta atrás instantánea si hay errores.'
        ],
        preguntas: '¿Qué ventaja tiene que el orquestador haga un rollback automático si una nueva versión falla el health check?',
        lab: 'Analizar el ciclo de reconciliación continua entre el estado deseado y el estado real.'
      }
    });

    steps(s, [
      {
        title: '1. Scheduling',
        body: 'Evalúa requisitos de CPU, memoria, afinidad y restricciones para elegir el nodo óptimo donde arrancar cada contenedor.'
      },
      {
        title: '2. Auto-Sanación',
        body: 'Monitoriza continuamente sondas de liveness; destruye y recrea automáticamente contenedores bloqueados o caídos.'
      },
      {
        title: '3. Auto-Escalado',
        body: 'Aumenta o reduce el número de réplicas en caliente basándose en métricas de consumo de CPU, RAM o tráfico.'
      },
      {
        title: '4. Service Discovery',
        body: 'Proporciona una IP virtual fija y DNS interno estable, balanceando el tráfico de red entre las réplicas disponibles.'
      },
      {
        title: '5. Rolling Updates',
        body: 'Despliegues progresivos sin parada de servicio con capacidad de rollback inmediato si se detectan anomalías.'
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 67: Comparativa de Orquestadores: Swarm vs K8s vs Nomad ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Comparativa de Mercado',
      title: 'Comparativa de Orquestadores: Docker Swarm vs K8s vs HashiCorp Nomad',
      notes: {
        obj: 'Presentar la comparativa oficial de orquestadores analizando los 3 principales contendientes del mercado.',
        guion: [
          'Docker Swarm: máxima simplicidad, integrado en el motor Docker con sintaxis casi idéntica a Compose. Ideal para equipos pequeños (1 a 15 nodos).',
          'Kubernetes (K8s): el estándar indiscutible de la CNCF, con el mayor ecosistema del mundo pero alta curva de aprendizaje. Ideal para arquitecturas a gran escala.',
          'HashiCorp Nomad: orquestador ligero y flexible en un solo binario Go; puede ejecutar contenedores Docker, binarios Java y máquinas virtuales QEMU.'
        ],
        preguntas: '¿Alguien en la sala ha usado Docker Swarm en el pasado? ¿Por qué la industria se volcó mayoritariamente con Kubernetes?',
        lab: 'Comparar el esfuerzo de configuración de Swarm (`docker swarm init`) frente a un clúster K8s.'
      }
    });

    cardsRow(s, [
      {
        title: 'Docker Swarm',
        icon: 'FaDocker',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Filosofía:', text: 'Simplicidad radical e integración nativa en el motor Docker.' },
          { lead: 'Curva de Aprendizaje:', text: 'Muy baja (reutiliza la sintaxis conocida de Docker Compose).' },
          { lead: 'Despliegue:', text: 'Se inicializa en 10 segundos con `docker swarm init`.' },
          { lead: 'Ecosistema:', text: 'Modesto, desarrollo mantenido principalmente por Mirantis.' },
          { lead: 'Caso de Uso Ideal:', text: 'Equipos pequeños y clústeres medianos (1 a 15 servidores).' }
        ]
      },
      {
        title: 'Kubernetes (K8s)',
        icon: 'FaSitemap',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Filosofía:', text: 'Estándar industrial absoluto de la CNCF respaldado por la industria.' },
          { lead: 'Curva de Aprendizaje:', text: 'Alta / Compleja (gran variedad de APIs y objetos declarativos).' },
          { lead: 'Despliegue:', text: 'Complejo on-premise; simple en Cloud gestionado (AKS, EKS, GKE).' },
          { lead: 'Ecosistema:', text: 'El mayor del software mundial (Helm, ArgoCD, Istio, Prometheus).' },
          { lead: 'Caso de Uso Ideal:', text: 'Microservicios empresariales y arquitecturas a gran escala.' }
        ]
      },
      {
        title: 'HashiCorp Nomad',
        icon: 'FaCogs',
        tone: 'light',
        bullets: [
          { lead: 'Filosofía:', text: 'Orquestador flexible, ligero y declarativo en un solo binario Go.' },
          { lead: 'Flexibilidad de Cargas:', text: 'Corre contenedores Docker, binarios compilados y VMs QEMU.' },
          { lead: 'Simplicidad Operativa:', text: 'Sin dependencias externas; integra con Consul y Vault.' },
          { lead: 'Ecosistema:', text: 'Integración nativa con la suite de HashiCorp (Terraform).' },
          { lead: 'Caso de Uso Ideal:', text: 'Entornos híbridos que combinan contenedores con software legacy.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 68: Docker Swarm a Fondo ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Docker Swarm',
      title: 'Docker Swarm a Fondo: El Orquestador Integrado en el Motor',
      notes: {
        obj: 'Enseñar a inicializar un clúster Swarm y comprobar cómo escala un servicio en segundos sin software adicional.',
        guion: [
          'Swarm viene preinstalado dentro de dockerd; solo requiere activarlo con `docker swarm init`.',
          'Distingue dos roles: Managers (coordinan con algoritmo de consenso Raft) y Workers (ejecutan tareas).',
          'Sustituye `docker run` por `docker service create`, permitiendo indicar el número de réplicas deseadas.',
          'Ingress Routing Mesh: los puertos publicados se abren en todos los nodos del clúster; cualquier nodo redirige al contenedor adecuado mediante IPVS.'
        ],
        preguntas: '¿Por qué es recomendable tener un número impar de Managers (3, 5) en un clúster Raft? (Para evitar empates al elegir líder).',
        lab: 'Inicializar Swarm localmente con `docker swarm init`, crear un servicio Nginx de 3 réplicas y escalarlo a 5.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Arquitectura y Routing Mesh de Swarm',
      icon: 'FaNetworkWired',
      tone: 'light',
      bullets: [
        { lead: 'Nativo en Docker Engine:', text: 'Sin agentes externos; se activa con un único comando en el host.' },
        { lead: 'Nodos Manager y Worker:', text: 'Managers mantienen quórum Raft; Workers ejecutan contenedores.' },
        { lead: 'Servicios Replicados:', text: '`docker service` declara réplicas deseadas en lugar de contenedores sueltos.' },
        { lead: 'Ingress Routing Mesh:', text: 'Los puertos se publican en TODOS los nodos; el tráfico se rutea internamente vía IPVS.' },
        { lead: 'mTLS Automático:', text: 'Comunicaciones entre nodos cifradas con certificados TLS mutuos autogestionados.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'COMANDOS ESENCIALES DE DOCKER SWARM',
      code: [
        '# 1. Inicializar el nodo actual como Manager del clúster',
        '$ docker swarm init',
        'Swarm initialized: current node is now a manager.',
        '',
        '# 2. Desplegar servicio web replicado con 3 réplicas',
        '$ docker service create --name web-cluster \\',
        '    --replicas 3 \\',
        '    -p 80:80 \\',
        '    nginx:alpine',
        '',
        '# 3. Escalar el número de réplicas en caliente',
        '$ docker service scale web-cluster=6',
        '',
        '# 4. Actualización progresiva (Rolling Update)',
        '$ docker service update --image nginx:1.25-alpine web-cluster',
        '',
        '# 5. Salir del modo Swarm y restaurar modo standalone',
        '$ docker swarm leave --force'
      ].join('\n')
    });
  }

  // ─── Diapositiva 69: Introducción a Kubernetes (K8s) ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Kubernetes',
      title: 'Introducción a Kubernetes: El Timonel del Ecosistema Cloud Native',
      notes: {
        obj: 'Poner en contexto el origen, propósito e impacto de Kubernetes en la industria del software.',
        guion: [
          'Etimología: Del griego kubernētēs (timonel / capitán de barco), de ahí el logo del timón con 7 radios.',
          'Abreviatura K8s: 8 letras entre la K y la s.',
          'Nacido de Google Borg en 2014 y donado a la Cloud Native Computing Foundation (CNCF).',
          'Enfoque declarativo: describes el QUÉ quieres en archivos YAML; K8s averigua el CÓMO conseguirlo y mantenerlo 24/7.'
        ],
        preguntas: '¿Cuál es la diferencia entre un enfoque imperativo ("haz esto ahora") y uno declarativo ("este es el estado deseado")?',
        lab: 'Examinar el enfoque declarativo de los manifiestos YAML.'
      }
    });

    cardsRow(s, [
      {
        title: 'Historia y Misión de Kubernetes',
        icon: 'FaBook',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Herencia de Google Borg:', text: 'Diseñado por ingenieros de Google basándose en 10 años de experiencia interna.' },
          { lead: 'Donación a la CNCF:', text: 'Gobernanza comunitaria y abierta bajo el paraguas de la Linux Foundation.' },
          { lead: 'Sustrato Universal:', text: 'El sistema operativo distribuido de la nube soportado por todos los grandes clouds.' },
          { lead: 'Estándar OCI:', text: 'Ejecuta exactamente las mismas imágenes compiladas con Dockerfile sin modificaciones.' }
        ]
      },
      {
        title: 'Principios de Diseño de K8s',
        icon: 'FaProjectDiagram',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Modelo Declarativo:', text: 'Se declara el estado final deseado en ficheros YAML (no comandos imperativos).' },
          { lead: 'Inmutabilidad:', text: 'Los Pods no se parchean en caliente; se reemplazan por instancias nuevas.' },
          { lead: 'API-Driven Architecture:', text: 'Todos los componentes interactúan exclusivamente mediante llamadas REST al API Server.' },
          { lead: 'Extensibilidad con CRDs:', text: 'Capacidad de ampliar la plataforma con controladores y operadores a medida.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 70: Arquitectura de Kubernetes: Visión Global (Diagrama) ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Arquitectura K8s',
      title: 'Arquitectura de Kubernetes: Control Plane y Worker Nodes',
      notes: {
        obj: 'Explicar la división fundamental entre el cerebro del clúster (Control Plane) y los ejecutores de carga (Worker Nodes).',
        guion: [
          'El Control Plane (Master) toma decisiones globales: scheduling, detección de eventos, control de ciclo de vida.',
          'Los Worker Nodes ejecutan la carga de trabajo real (los Pods) gestionados por el kubelet y kube-proxy.',
          'En nubes públicas (EKS, AKS, GKE), el proveedor administra y garantiza la alta disponibilidad del Control Plane; el cliente solo paga por los Worker Nodes.',
          'Si el Control Plane cae temporalmente, las aplicaciones que ya están corriendo en los Worker Nodes siguen sirviendo tráfico sin interrupción.'
        ],
        preguntas: '¿Qué le ocurre a una web en un Worker Node si el Control Plane se detiene durante 5 minutos por mantenimiento?',
        lab: 'Inspeccionar los componentes del diagrama vectorial de arquitectura K8s.'
      }
    });

    D.kubernetesClusterArchitecture(s, { x: CX, y: CY, w: CW, h: CH });
  }

  // ─── Diapositiva 71: Componentes del Control Plane (El Cerebro) ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Control Plane',
      title: 'El Plano de Control (Control Plane) al Detalle',
      notes: {
        obj: 'Detallar los 4 componentes indispensables del Control Plane y su función específica.',
        guion: [
          'kube-apiserver: puerta de entrada REST central; autentica, autoriza y valida esquemas.',
          'etcd: almacén clave-valor distribuido consistente (Raft); es la ÚNICA fuente de la verdad del clúster.',
          'kube-scheduler: evalúa recursos libres, afinidades y restricciones para asignar Pods a nodos.',
          'kube-controller-manager: ejecuta bucles de control que fuerzan al clúster a alcanzar el estado deseado.'
        ],
        preguntas: '¿Por qué hacer copias de seguridad de etcd equivale a respaldar el 100% de la configuración del clúster de Kubernetes?',
        lab: 'Comprobar la versión del cliente de Kubernetes con `kubectl version --client`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Componentes del Master Node',
      icon: 'FaGlobe',
      tone: 'light',
      accent: COL.COBALT,
      bullets: [
        { lead: '`kube-apiserver`:', text: 'Puerta de entrada única al clúster. Expone la API REST, autentica usuarios y valida YAMLs.' },
        { lead: '`etcd datastore`:', text: 'Base de datos clave-valor distribuida (Raft). La única fuente de la verdad del estado del clúster.' },
        { lead: '`kube-scheduler`:', text: 'Detecta Pods recién creados sin nodo asignado y elige el servidor óptimo según recursos.' },
        { lead: '`kube-controller-manager`:', text: 'Ejecuta bucles de control (Node, Deployment, Endpoints) que fuerzan el estado deseado.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'INTERACCIÓN CON EL API SERVER VÍA KUBECTL',
      code: [
        '# Toda interacción con K8s se realiza vía el CLI kubectl',
        '# que emite llamadas REST seguras hacia kube-apiserver (:6443)',
        '',
        '# Listar nodos del clúster y sus roles',
        '$ kubectl get nodes',
        'NAME             STATUS   ROLES           AGE   VERSION',
        'k8s-control-01   Ready    control-plane   30d   v1.29.2',
        'k8s-worker-01    Ready    <none>          30d   v1.29.2',
        'k8s-worker-02    Ready    <none>          30d   v1.29.2',
        '',
        '# Obtener información del plano de control',
        '$ kubectl cluster-info',
        'Kubernetes control plane is running at https://127.0.0.1:6443',
        'CoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/...'
      ].join('\n')
    });
  }

  // ─── Diapositiva 72: Componentes de los Worker Nodes (El Músculo) ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Worker Nodes',
      title: 'Los Nodos de Trabajo (Worker Nodes) al Detalle',
      notes: {
        obj: 'Explicar cómo el kubelet y kube-proxy coordinan el runtime de contenedores en cada servidor físico.',
        guion: [
          'kubelet: el agente principal del nodo; habla con el API server, recibe PodSpecs y asegura que los contenedores estén sanos.',
          'kube-proxy: gestor de red del nodo; mantiene reglas de iptables o IPVS para que los Services balanceen el tráfico.',
          'Container Runtime (CRI): el motor de bajo nivel (containerd o CRI-O) que descarga imágenes y arranca los procesos.',
          'Desde K8s 1.24 se eliminó dockershim: Kubernetes habla con containerd vía gRPC mediante el estándar CRI.'
        ],
        preguntas: '¿Qué es el Container Runtime Interface (CRI) y por qué Kubernetes ya no depende exclusivamente de Docker Engine?',
        lab: 'Inspeccionar el proceso kubelet en un nodo de Kubernetes.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Componentes en cada Servidor Worker',
      icon: 'FaServer',
      tone: 'light',
      bullets: [
        { lead: '`kubelet`:', text: 'Agente supervisor del nodo. Recibe PodSpecs del API server y vigila que los contenedores corran.' },
        { lead: '`kube-proxy`:', text: 'Gestor de red local. Programa reglas iptables / IPVS para balancear peticiones hacia los Pods.' },
        { lead: 'Container Runtime (CRI):', text: 'Motor OCI de bajo nivel (`containerd` o `CRI-O`) que descarga imágenes y ejecuta procesos.' },
        { lead: 'Pods de Aplicación:', text: 'La carga de trabajo real (contenedores de Node, Python, bases de datos) corriendo en el host.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'FLUJO INTERNO EN EL WORKER NODE',
      code: [
        '# 1. kube-scheduler asigna un Pod a "k8s-worker-01"',
        '# 2. kubelet en worker-01 detecta la nueva asignación',
        '# 3. kubelet invoca a containerd vía gRPC (CRI):',
        '#    - PullImage(mi-api:1.0)',
        '#    - CreateContainer()',
        '#    - StartContainer()',
        '# 4. kube-proxy actualiza reglas iptables en el nodo',
        '# 5. kubelet ejecuta periódicamente las sondas de salud:',
        '#    - livenessProbe (¿Sigue vivo el proceso?)',
        '#    - readinessProbe (¿Puede recibir tráfico web?)'
      ].join('\n')
    });
  }

  // ─── Diapositiva 73: El Modelo Declarativo y los Bucles de Reconciliación ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Bucle de Control',
      title: 'El Bucle de Reconciliación: La Magia Declarativa de Kubernetes',
      notes: {
        obj: 'Hacer comprender el núcleo conceptual de Kubernetes: el bucle infinito de reconciliación declarativa.',
        guion: [
          'Estado deseado (Desired State): declarado en los manifiestos YAML (ej. "quiero 3 réplicas").',
          'Estado actual (Current State): lo que realmente está corriendo en el clúster en este instante.',
          'Bucle infinito: Observar -> Comparar -> Actuar.',
          'Si un contenedor muere por OOM, el estado pasa a 2; el controlador detecta que 2 != 3 y arranca uno nuevo inmediatamente.'
        ],
        preguntas: 'Si matamos a mano un Pod con "kubectl delete pod", ¿por qué aparece uno nuevo con otro nombre al cabo de 2 segundos?',
        lab: 'Analizar el pseudocódigo del reconciliador continuo en la diapositiva.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 4.8, h: CH,
      title: 'Filosofía del Bucle de Control Infinito',
      icon: 'FaSyncAlt',
      tone: 'light',
      bullets: [
        { lead: 'Estado Deseado (Desired):', text: 'Declaración explícita en archivos YAML almacenada en etcd (ej. 3 réplicas).' },
        { lead: 'Estado Actual (Current):', text: 'La realidad de los procesos en ejecución en los Worker Nodes del clúster.' },
        { lead: 'Bucle de Reconciliación:', text: 'Los controladores ejecutan continuamente el ciclo: `OBSERVAR -> COMPARAR -> ACTUAR`.' },
        { lead: 'Auto-Recuperación Automática:', text: 'Si un Pod muere o un nodo falla, K8s crea nuevas instancias hasta igualar el estado.' }
      ]
    });

    code(s, {
      x: CX + 5.1, y: CY, w: CW - 5.1, h: CH,
      size: 10,
      label: 'LÓGICA DEL RECONCILIADOR EN KUBERNETES',
      code: [
        '# Pseudocódigo conceptual del Controller Manager:',
        'while True:',
        '    # 1. Leer estado deseado vs estado actual',
        '    desired = read_from_etcd()       # spec.replicas = 3',
        '    current = inspect_active_pods()  # actual_pods = 2',
        '',
        '    # 2. Reconciliar si existe discrepancia',
        '    if current != desired:',
        '        diff = calculate_diff(desired, current)',
        '        execute_reconcile(diff)      # Crea 1 Pod nuevo',
        '',
        '    wait_for_watch_event()           # Arquitectura reactiva',
        '',
        '# ¡Bucle activo 24/7 sin intervención humana!'
      ].join('\n')
    });
  }

  // ─── Diapositiva 74: Objeto 1: El Pod ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Primitivas K8s',
      title: 'Primitiva Fundamental 1: El Pod (Unidad Atómica de Cómputo)',
      notes: {
        obj: 'Presentar el concepto de Pod y aclarar por qué Kubernetes añade esta capa de abstracción sobre los contenedores.',
        guion: [
          'Kubernetes no ejecuta contenedores sueltos: la unidad mínima siempre es el Pod.',
          'Un Pod agrupa 1 o más contenedores estrechamente acoplados que comparten red y almacenamiento.',
          'Todos los contenedores de un Pod tienen la misma IP y se comunican entre sí mediante `localhost`.',
          'Patrón Sidecar: un contenedor principal (la app) acompañado de un contenedor auxiliar (proxy de logs, agente de métricas o proxy mTLS de Istio).'
        ],
        preguntas: '¿En qué escenario tendría sentido colocar dos contenedores dentro del mismo Pod? (Patrón Sidecar).',
        lab: 'Inspeccionar la estructura del manifiesto YAML de un Pod simple.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'La Unidad Mínima de Cómputo',
      icon: 'FaCube',
      tone: 'light',
      bullets: [
        { lead: 'Sin Contenedores Sueltos:', text: 'Kubernetes gestiona, programa y escala Pods, nunca contenedores individuales.' },
        { lead: 'Grupo de Contenedores:', text: 'Aloja un contenedor principal y opcionalmente contenedores auxiliares (Sidecars).' },
        { lead: 'Red Compartida:', text: 'Misma dirección IP para todos los contenedores del Pod; comunicación por `localhost`.' },
        { lead: 'Almacenamiento Compartido:', text: 'Los volúmenes definidos en el Pod son accesibles por todos sus contenedores.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'MANIFIESTO YAML DE UN POD (POD.YAML)',
      code: [
        'apiVersion: v1',
        'kind: Pod',
        'metadata:',
        '  name: mi-pod-web',
        '  labels:',
        '    app: frontend',
        'spec:',
        '  containers:',
        '  - name: nginx-server',
        '    image: nginx:alpine',
        '    ports:',
        '    - containerPort: 80',
        '    resources:',
        '      limits:',
        '        memory: "128Mi"',
        '        cpu: "500m"'
      ].join('\n')
    });
  }

  // ─── Diapositiva 75: Objeto 2: Deployments y Réplicas ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Primitivas K8s',
      title: 'Primitiva Fundamental 2: Deployments, ReplicaSets y Rollouts',
      notes: {
        obj: 'Enseñar por qué en producción siempre se crean Deployments y cómo gestionan las réplicas y rollouts sin parada.',
        guion: [
          'Nunca desplegar Pods sueltos en producción: si un Pod suelto muere, nadie lo recrea.',
          'Un Deployment gestiona un ReplicaSet, garantizando que siempre existan N réplicas vivas.',
          'RollingUpdate: actualiza los Pods de forma gradual (ej. 25% a la vez), asegurando que siempre hay réplicas sirviendo tráfico.',
          'Rollback instantáneo: si la nueva versión falla, se revierte con `kubectl rollout undo deployment/mi-app`.'
        ],
        preguntas: '¿Qué comando usarías para escalar un Deployment de 3 a 10 réplicas en tiempo real? (`kubectl scale deployment api-pedidos --replicas=10`).',
        lab: 'Comprobar la sintaxis de un Deployment con selector de etiquetas (matchLabels).'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Gestión de Ciclo de Vida y Réplicas',
      icon: 'FaCubes',
      tone: 'light',
      accent: COL.COBALT,
      bullets: [
        { lead: 'Prohibido Pods Sueltos:', text: 'En producción los Pods siempre se encapsulan dentro de un **Deployment**.' },
        { lead: 'Controlador ReplicaSet:', text: 'Garantiza que siempre exista el número exacto de réplicas sanas (`spec.replicas`).' },
        { lead: 'Estrategia RollingUpdate:', text: 'Actualización progresiva pod a pod sin un solo segundo de corte de servicio.' },
        { lead: 'Rollback Inmediato:', text: 'Vuelta atrás instantánea con `kubectl rollout undo deployment/nombre`.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'MANIFIESTO YAML DE UN DEPLOYMENT',
      code: [
        'apiVersion: apps/v1',
        'kind: Deployment',
        'metadata:',
        '  name: api-pedidos',
        'spec:',
        '  replicas: 3',
        '  selector:',
        '    matchLabels:',
        '      app: pedidos',
        '  template:',
        '    metadata:',
        '      labels:',
        '        app: pedidos',
        '    spec:',
        '      containers:',
        '      - name: api',
        '        image: mi-repo/pedidos:2.0',
        '        ports:',
        '        - containerPort: 3000'
      ].join('\n')
    });
  }

  // ─── Diapositiva 76: Objeto 3: Services (Descubrimiento y Balanceo) ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Primitivas K8s',
      title: 'Primitiva Fundamental 3: Services y Balanceo de Carga L4',
      notes: {
        obj: 'Hacer entender que los Services resuelven el descubrimiento dinámico de servicios y balanceo interno en Kubernetes.',
        guion: [
          'Los Pods son efímeros y sus IPs cambian constantemente al recrearse o escalar.',
          'Un Service proporciona una IP virtual fija (ClusterIP) y un nombre DNS interno estable (`servicio-pedidos.default.svc.cluster.local`).',
          'Los selectores por etiquetas (`spec.selector`) vinculan dinámicamente el Service con los Pods que tengan `app: pedidos`.',
          'Tipos: ClusterIP (solo interno), NodePort (puerto 30000-32767 en nodos) y LoadBalancer (aprovisiona balanceador cloud).'
        ],
        preguntas: 'Si tienes 5 réplicas detrás de un Service, ¿cómo sabe el Service a cuáles enviar tráfico si una está iniciando? (Sondas readinessProbe).',
        lab: 'Inspeccionar cómo un Service expone puertos hacia los Pods de backend.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 4.8, h: CH,
      title: 'Abstracción de Red Estable',
      icon: 'FaNetworkWired',
      tone: 'light',
      bullets: [
        { lead: 'El Problema de las IPs Efímeras:', text: 'Los Pods nacen y mueren continuamente con IPs cambiantes.' },
        { lead: 'ClusterIP Fija y DNS:', text: 'El Service ofrece una IP virtual permanente y resolución por nombre interno.' },
        { lead: 'Selectores por Etiquetas:', text: 'Vinculación dinámica mediante labels (`app: pedidos`).' },
        { lead: 'Tipos Principales:', text: '`ClusterIP` (interno), `NodePort` (puerto en nodos), `LoadBalancer` (Cloud).' }
      ]
    });

    code(s, {
      x: CX + 5.1, y: CY, w: CW - 5.1, h: CH,
      size: 10,
      label: 'MANIFIESTO YAML DE UN SERVICE',
      code: [
        'apiVersion: v1',
        'kind: Service',
        'metadata:',
        '  name: servicio-pedidos',
        'spec:',
        '  type: ClusterIP',
        '  selector:',
        '    # Conecta con los Pods que tengan este label',
        '    app: pedidos',
        '  ports:',
        '  - port: 80         # Puerto de escucha del Service',
        '    targetPort: 3000 # Puerto real del contenedor',
        '',
        '# Consumible desde cualquier Pod mediante DNS interno:',
        '# http://servicio-pedidos:80'
      ].join('\n')
    });
  }

  // ─── Diapositiva 77: ConfigMaps, Secrets y Persistencia en K8s ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Configuración y Almacenamiento',
      title: 'Configuración y Persistencia: ConfigMaps, Secrets y PVCs',
      notes: {
        obj: 'Presentar cómo se gestiona la configuración externa (ConfigMaps/Secrets) y el almacenamiento persistente (PVC/PV) en Kubernetes.',
        guion: [
          'ConfigMaps: pares clave-valor desacoplados de la imagen para parámetros no sensibles.',
          'Secrets: credenciales, tokens y certificados codificados en base64 o cifrados con KMS.',
          'PersistentVolumeClaim (PVC): solicitud formal de almacenamiento que realiza el Pod (ej. 50GB en modo ReadWriteOnce).',
          'StorageClass: permite el aprovisionamiento dinámico en la nube (crea el disco EBS o Azure Disk al vuelo al pedir el PVC).'
        ],
        preguntas: '¿Por qué nunca debemos compilar contraseñas o URLs de bases de datos dentro de la imagen de Docker?',
        lab: 'Comprender el ciclo de inyección de configuración mediante variables o archivos montados.'
      }
    });

    cardsRow(s, [
      {
        title: 'ConfigMaps y Secrets (Configuración Externa)',
        icon: 'FaSlidersH',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'ConfigMaps:', text: 'Variables de entorno y ficheros de configuración desacoplados de la imagen.' },
          { lead: 'Secrets:', text: 'Almacenamiento de credenciales y certificados con cifrado en reposo KMS.' },
          { lead: 'Inyección Flexible:', text: 'Inyectables como variables de entorno (`env`) o montados como carpetas.' },
          { lead: 'Portabilidad:', text: 'La misma imagen corre en Dev, Staging y Prod cambiando solo el ConfigMap.' }
        ]
      },
      {
        title: 'Persistencia: PVCs, PVs y StorageClasses',
        icon: 'FaHdd',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'PersistentVolumeClaim (PVC):', text: 'Petición formal de almacenamiento declarada por el Pod (ej. 50GB).' },
          { lead: 'PersistentVolume (PV):', text: 'El volumen físico aprovisionado en disco de nube (EBS, Azure Disk).' },
          { lead: 'StorageClass Dinámica:', text: 'Crea el disco cloud al vuelo al detectar la creación de un nuevo PVC.' },
          { lead: 'StatefulSets:', text: 'Controlador especializado para bases de datos que requieren identidad fija.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 78: De Docker a Kubernetes: Diccionario de Conceptos ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Transición Tecnológica',
      title: 'De Docker a Kubernetes: Diccionario y Tabla de Equivalencias',
      notes: {
        obj: 'Hacer que los alumnos sientan que todo lo aprendido en los 4 días se reutiliza y encaja perfectamente en Kubernetes.',
        guion: [
          'Repasar cómo cada concepto de Docker tiene su homólogo en Kubernetes.',
          'Las imágenes creadas con Dockerfile son exactamente las mismas que se consumen en los Pods.',
          'Los puertos (-p) pasan a ser Services; los volúmenes (-v) pasan a ser PVCs; docker-compose pasa a ser manifiestos YAML o Helm Charts.',
          'Herramientas como Kompose permiten traducir automáticamente archivos docker-compose.yml a manifiestos de K8s.'
        ],
        preguntas: '¿Cuál de las equivalencias de la tabla os parece más intuitiva o reveladora?',
        lab: 'Examinar la correspondencia directa de conceptos entre Docker CLI y Kubernetes.'
      }
    });

    table(s, [
      ['Concepto en Docker Standalone / Compose', 'Homólogo en Kubernetes (K8s)', 'Función y Propósito Técnico'],
      ['docker run -d ...', 'Pod / Deployment', 'Instancia de proceso en ejecución (Pod) y controlador de réplicas.'],
      ['docker build -t mi-app .', 'Imagen OCI (Idéntica)', 'El proceso de build es 100% el mismo; K8s descarga la misma imagen.'],
      ['-p 8080:80 (Mapeo de puertos)', 'Service (ClusterIP / LoadBalancer)', 'Descubrimiento DNS y balanceo de tráfico hacia los Pods.'],
      ['docker network create ...', 'CNI Plugin + NetworkPolicy', 'Red plana de clúster donde todos los Pods tienen IP única.'],
      ['-v mi_vol:/var/lib/data', 'PersistentVolumeClaim (PVC)', 'Almacenamiento permanente gestionado por StorageClasses.'],
      ['docker compose up', 'kubectl apply -f / Helm Chart', 'Despliegue declarativo de la topología completa de servicios.']
    ], { colW: [3.8, 3.8, 4.5], size: 12 });
  }

  // ─── Diapositiva 79: Entornos Locales para Aprender K8s ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Entornos de Práctica',
      title: 'Entornos Locales para Practicar y Dominar Kubernetes',
      notes: {
        obj: 'Facilitar a los alumnos herramientas para que puedan continuar practicando Kubernetes en sus propios equipos sin coste cloud.',
        guion: [
          'Docker Desktop Kubernetes: la opción más sencilla si ya usan Docker Desktop (activar casilla en Settings).',
          'Kind (Kubernetes in Docker): ejecuta nodos de K8s como contenedores Docker en el host; ultrarrápido y estándar en CI/CD.',
          'Minikube: herramienta histórica oficial con soporte de addons (ingress, metrics-server, dashboard).',
          'K3s: distribución certificada ultraligera (<100MB) en un solo binario desarrollada por Rancher/SUSE.'
        ],
        preguntas: '¿Quién tiene Docker Desktop instalado en su máquina y ha probado a activar la casilla de Kubernetes?',
        lab: 'Probar la creación de un clúster local con Kind en 30 segundos.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Opciones para Practicar en tu Portátil',
      icon: 'FaDesktop',
      tone: 'light',
      bullets: [
        { lead: 'Docker Desktop K8s:', text: 'Activar en Settings > Kubernetes > Enable. Un clúster de 1 nodo listo en 1 minuto.' },
        { lead: 'Kind (K8s in Docker):', text: 'Corre nodos de K8s dentro de contenedores Docker en tu host. Excelente para CI/CD.' },
        { lead: 'Minikube:', text: 'Herramienta histórica oficial de la comunidad K8s con addons preconfigurados.' },
        { lead: 'K3s (Rancher/SUSE):', text: 'Distribución ultraligera (<100MB) en un solo binario Go para Edge y desarrollo.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'CLÚSTER CON KIND (KUBERNETES IN DOCKER)',
      code: [
        '# 1. Crear un clúster local de prueba en 30 segundos',
        '$ kind create cluster --name curso-docker',
        'Creating cluster "curso-docker" ...',
        ' ✓ Ensuring node image (kindest/node:v1.29.2)',
        ' ✓ Preparing nodes',
        ' ✓ Starting control-plane',
        'Set kubectl context to "kind-curso-docker"',
        '',
        '# 2. Verificar que el clúster responde',
        '$ kubectl get nodes',
        'NAME                         STATUS   ROLES           AGE',
        'curso-docker-control-plane   Ready    control-plane   45s',
        '',
        '# 3. Destruir el clúster al finalizar la práctica',
        '$ kind delete cluster --name curso-docker'
      ].join('\n')
    });
  }

  // ─── Diapositiva 80: Laboratorio 5: Despliegue en Kubernetes ───
  {
    const s = slide(pres, {
      mod: 5,
      badge: 'Taller Integrador Final',
      title: 'Laboratorio 5: Despliegue, Auto-Recuperación y Rolling Update en K8s',
      lab: true,
      notes: {
        obj: 'Taller integrador de 75-90 minutos donde los alumnos consolidan todo el viaje: desde el Dockerfile hasta el despliegue orquestado en K8s.',
        guion: [
          'Verificar el acceso al clúster local con `kubectl get nodes`.',
          'Redactar y aplicar `deployment.yaml` con 3 réplicas de Nginx con límites de memoria y CPU.',
          'Aplicar `service.yaml` exponiendo el puerto del servicio.',
          'Simular la muerte de un Pod eliminándolo a mano con `kubectl delete pod` y observar en tiempo real cómo el bucle de reconciliación crea uno nuevo en menos de 2 segundos.',
          'Ejecutar un Rolling Update modificando la imagen y comprobar que no hay corte de servicio con `kubectl rollout status`.'
        ],
        preguntas: '¿Habéis visto cómo al borrar el Pod, el ReplicaSet creó otro sustituto inmediatamente?',
        lab: [
          '1. Verificar clúster: `kubectl get nodes` y `kubectl cluster-info`.',
          '2. Redactar deployment.yaml con 3 réplicas y límites de recursos.',
          '3. Aplicar: `kubectl apply -f deployment.yaml` y observar con `kubectl get pods -w`.',
          '4. Redactar service.yaml y aplicar con `kubectl apply -f service.yaml`.',
          '5. Probar balanceo de carga interno hacia los Pods.',
          '6. Simular caída: `kubectl delete pod <nombre>` y comprobar auto-sanación instantánea.',
          '7. Ejecutar Rolling Update a una nueva versión y comprobar `kubectl rollout status`.'
        ]
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Objetivos del Taller Integrador',
      icon: 'FaTools',
      tone: 'light',
      accent: COL.CORAL,
      bullets: [
        { lead: 'Paso 1 · Verificación:', text: 'Comprobar acceso y salud de nodos con `kubectl get nodes`.' },
        { lead: 'Paso 2 · Manifiesto Deployment:', text: 'Declarar 3 réplicas con límites de memoria (`128Mi`) y CPU (`500m`).' },
        { lead: 'Paso 3 · Despliegue Declarativo:', text: 'Aplicar con `kubectl apply` y observar la creación simultánea de Pods.' },
        { lead: 'Paso 4 · Exposición con Service:', text: 'Publicar el servicio mediante un Service con balanceo de carga.' },
        { lead: 'Paso 5 · Prueba de Auto-Sanación:', text: 'Eliminar un Pod a mano y constatar que el reconciliador crea otro al instante.' },
        { lead: 'Paso 6 · Rolling Update:', text: 'Actualizar la versión de la imagen sin un solo segundo de corte de tráfico.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'RESOLUCIÓN DEL LABORATORIO 5 EN KUBERNETES',
      code: [
        '# 1. Aplicar Deployment y Service declarativamente',
        '$ kubectl apply -f deployment.yaml',
        '$ kubectl apply -f service.yaml',
        '',
        '# 2. Inspeccionar los Pods creados por el ReplicaSet',
        '$ kubectl get pods -l app=pedidos',
        'NAME                           READY   STATUS    RESTARTS',
        'api-pedidos-7c489f6d7b-4k2x8   1/1     Running   0',
        'api-pedidos-7c489f6d7b-9m5z1   1/1     Running   0',
        'api-pedidos-7c489f6d7b-r2w9p   1/1     Running   0',
        '',
        '# 3. Demostración de Auto-Sanación (Self-Healing)',
        '$ kubectl delete pod api-pedidos-7c489f6d7b-4k2x8',
        '# ¡El ReplicaSet crea un sustituto inmediatamente!',
        '',
        '# 4. Actualización progresiva en caliente (Rolling Update)',
        '$ kubectl set image deployment/api-pedidos api=nginx:1.25-alpine',
        '$ kubectl rollout status deployment/api-pedidos',
        'deployment "api-pedidos" successfully rolled out'
      ].join('\n')
    });
  }

  // ─── Diapositiva 81: Conclusión del Curso y Próximos Pasos ───
  closing(pres, {
    mod: 5,
    title: '¡ENHORABUENA! CURSO DOCKER FUNDAMENTALS COMPLETADO',
    points: [
      {
        icon: 'FaMicrochip',
        title: 'Día 1 · Motor y OCI',
        text: 'Aislamiento de kernel mediante Namespaces y Cgroups, arquitectura desacoplada containerd/runc, creación de imágenes OCI optimizadas y Multi-Stage builds.'
      },
      {
        icon: 'FaNetworkWired',
        title: 'Día 2 · Redes y Almacenamiento',
        text: 'Switch virtual docker0, pares veth, resolución DNS embebida 127.0.0.11, reglas iptables NAT, Overlay2 con Copy-on-Write y persistencia con Named Volumes.'
      },
      {
        icon: 'FaCloud',
        title: 'Día 3 · Despliegue en la Nube',
        text: 'Evolución a CaaS y Serverless Containers (Azure ACI/ACA, AWS Fargate, Google Cloud Run) y gobernanza de Container Registries privados con firmas e inmutabilidad.'
      },
      {
        icon: 'FaSitemap',
        title: 'Día 4 · Orquestación y K8s',
        text: 'Gestión distribuida, Swarm vs Nomad vs K8s, arquitectura Control Plane / Workers, bucles de reconciliación continua, Pods, Deployments y Services.'
      }
    ],
    notes: {
      obj: 'Agradecer la participación y esfuerzo de los alumnos, felicitarles por completar las 20 horas lectivas y orientar los siguientes pasos de su carrera Cloud Native.',
      guion: [
        'Felicitar al grupo por haber completado las 20 horas intensivas de Docker Fundamentals.',
        'Hacer balance: han recorrido desde el nivel más bajo del kernel Linux hasta la orquestación distribuida en Kubernetes y las nubes públicas.',
        'Recomendar certificaciones oficiales de la Linux Foundation y CNCF: CKA (Certified Kubernetes Administrator), CKAD (Certified Kubernetes Application Developer) y CKS (Certified Kubernetes Security Specialist).',
        'Ronda final de preguntas y cierre oficial del curso.'
      ],
      preguntas: '¿Cuáles son las 3 habilidades técnicas que os lleváis de este curso para aplicar inmediatamente a partir de mañana en vuestro trabajo?',
      lab: 'Verificar la limpieza final de entornos de laboratorio en las máquinas de los alumnos.'
    }
  });
}

module.exports = { buildModule5 };
