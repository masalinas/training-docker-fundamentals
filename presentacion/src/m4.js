'use strict';
/**
 * m4.js — Módulo 4 (Día 3): Contenedores en Cloud (Azure, AWS, Google Cloud y evolución de Docker Cloud).
 * Genera 18 diapositivas técnicas (diapositivas 46 a 63 de la presentación general).
 */
const H = require('./layout_helpers');

const {
  COL, CX, CY, CW, CH,
  slide, divider,
  card, cardsRow, cardsGrid, code, table, steps, stat, callout
} = H;

function buildModule4(pres) {
  // ─── Diapositiva 46: Separador Módulo 4 · Contenedores en Cloud ───
  divider(pres, {
    mod: 4,
    title: 'CONTENEDORES EN LA NUBE',
    subtitle: 'Módulo 4: Containers en Azure, AWS, Google Cloud y Evolución de Docker Cloud\nJornada 3 de 4 · 5 Horas Lectivas (20h totales)',
    hours: '5 HORAS LECTIVAS',
    topics: [
      { icon: 'FaCloud', text: 'Evolución Cloud: De IaaS a CaaS y Serverless Containers.' },
      { icon: 'FaRocket', text: 'Pipeline de despliegue: Build, Ship (Registries OCI) y Run.' },
      { icon: 'FaServer', text: 'Microsoft Azure: ACR, Container Instances (ACI) y Apps (ACA).' },
      { icon: 'FaCubes', text: 'Amazon Web Services: ECR, ECS y cómputo Serverless con Fargate.' },
      { icon: 'FaGlobe', text: 'Google Cloud: Artifact Registry, Cloud Run y sandbox gVisor.' },
      { icon: 'FaTools', text: 'Laboratorio 4: Publicación en Registry y despliegue CaaS.' }
    ],
    notes: {
      obj: 'Introducir el salto desde la máquina local hacia las grandes nubes públicas empresariales y contextualizar el papel de CaaS.',
      guion: [
        'Los contenedores resolvieron la portabilidad en el equipo local; el siguiente paso es cómo ejecutarlos de forma elástica en la nube.',
        'Las nubes públicas ejecutan hipervisores tipo 1 customizados (AWS Nitro, Azure Hyper-V) y microVMs (Firecracker, gVisor) para aislar contenedores serverless con coste cero en reposo.',
        'Dominaremos las opciones de despliegue en Microsoft Azure, Amazon Web Services y Google Cloud, así como la gestión de Container Registries.'
      ],
      preguntas: '¿Qué proveedores de nube pública utilizáis actualmente en vuestra empresa (AWS, Azure, GCP u on-premise)?',
      lab: 'Verificar la configuración de registries de Docker con `docker info | grep -i "Registry"`.'
    }
  });

  // ─── Diapositiva 47: El Paradigma Cloud: De IaaS a CaaS y Serverless ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Fundamentos Cloud',
      title: 'Evolución Cloud: De IaaS a CaaS y Serverless Containers',
      notes: {
        obj: 'Posicionar los contenedores como servicio (CaaS) y serverless frente a las máquinas virtuales tradicionales de IaaS.',
        guion: [
          'IaaS requiere gestionar el sistema operativo, parches de seguridad, firewalls y pagar 24/7 aunque la CPU esté ociosa.',
          'CaaS permite al usuario entregar la imagen Docker; el proveedor gestiona el runtime y la orquestación.',
          'Serverless Containers (Cloud Run, ACI, Fargate) elimina por completo la gestión de servidores y escala a cero cuando no hay peticiones (coste 0€).'
        ],
        preguntas: '¿Cuánto dinero ahorra una empresa si una API interna que solo se usa en horario laboral escala a cero durante las noches y fines de semana?',
        lab: 'Reflexionar sobre los tiempos de arranque: minutos en IaaS vs segundos en Serverless Containers.'
      }
    });

    cardsRow(s, [
      {
        title: 'IaaS (VMs Tradicionales)',
        icon: 'FaServer',
        tone: 'light',
        bullets: [
          { lead: 'Gestión Completa:', text: 'Parchear el SO, gestionar kernels, configurar firewalls y agentes de seguridad.' },
          { lead: 'Arranque Lento:', text: 'Escalar levantando nuevas máquinas virtuales tarda varios minutos.' },
          { lead: 'Pago por Capacidad:', text: 'Facturación continua 24/7 aunque la CPU esté al 1% de uso.' },
          { lead: 'Uso Predilecto:', text: 'Monolitos heredados o aplicaciones con control estricto de drivers hardware.' }
        ]
      },
      {
        title: 'CaaS (Containers as a Service)',
        icon: 'FaCubes',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Control del Contenedor:', text: 'El desarrollador entrega la imagen Docker; el cloud gestiona el runtime.' },
          { lead: 'Orquestación Gestionada:', text: 'El proveedor maneja ciclo de vida, balanceo de carga y reinicios automáticos.' },
          { lead: 'Escalado Elástico:', text: 'Adición de réplicas en segundos respondiendo a la demanda de tráfico.' },
          { lead: 'Ejemplos Clave:', text: 'Amazon ECS, Azure Container Apps, Google Cloud Run.' }
        ]
      },
      {
        title: 'Serverless Containers',
        icon: 'FaBolt',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Cero Servidores:', text: 'Sin nodos que administrar, sin actualizaciones de clúster ni capacidad ociosa.' },
          { lead: 'Escalado a Cero:', text: 'Sin tráfico activo, las réplicas bajan a 0 y el coste económico es exactamente 0€.' },
          { lead: 'Pago por Consumo Exacto:', text: 'Facturación al milisegundo por vCPU y memoria RAM consumidas.' },
          { lead: 'Uso Predilecto:', text: 'APIs REST, microservicios orientados a eventos y tareas batch puntuales.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 48: El Pipeline de Despliegue Cloud ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Pipeline Cloud',
      title: 'El Ciclo de Vida Cloud: Build, Ship & Run',
      notes: {
        obj: 'Hacer entender que el Container Registry es el centro neurálgico que conecta el desarrollo con el despliegue cloud.',
        guion: [
          'El pipeline canónico: 1. Build (compilar la imagen local o en CI/CD); 2. Tag (etiquetar con la URL del registry); 3. Ship (push diferencial de capas); 4. Run (pull y ejecución en CaaS/K8s).',
          'Al hacer docker push, el cliente negocia con el registry mediante hashes SHA-256 para subir únicamente las capas no existentes.',
          'Nunca utilizar credenciales personales fijas en pipelines; emplear identidades federadas (OIDC) y tokens efímeros.'
        ],
        preguntas: '¿Por qué nunca debemos usar credenciales de usuario y contraseña personales en un pipeline de CI/CD para hacer push?',
        lab: 'Inspeccionar la ayuda de etiquetado con `docker tag --help`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'El Flujo Canónico del Contenedor',
      icon: 'FaStream',
      tone: 'light',
      bullets: [
        { lead: '1. BUILD (Compilación):', text: 'El desarrollador o el servidor de CI/CD (GitHub Actions, GitLab) genera la imagen.' },
        { lead: '2. TAG (Versionado):', text: 'Se etiqueta con la URL del registry privado y el tag semántico (`acr.io/app:1.2.0`).' },
        { lead: '3. SHIP (Publicación):', text: 'Se sube al Container Registry mediante protocolos HTTPS autenticados con tokens.' },
        { lead: '4. RUN (Despliegue):', text: 'El servicio cloud descarga la imagen desde el registry privado y levanta el servicio.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'COMANDOS DEL FLUJO CLOUD EN TERMINAL',
      code: [
        '# 1. Autenticación segura en el registro cloud',
        '$ az acr login --name miregistry          # Azure',
        '$ aws ecr get-login-password | docker... # AWS',
        '$ gcloud auth configure-docker            # GCP',
        '',
        '# 2. Etiquetar la imagen local con la ruta completa',
        '$ docker tag mi-app:latest \\',
        '    miregistry.azurecr.io/servicios/mi-app:1.2.0',
        '',
        '# 3. Enviar las capas diferenciales al registro remoto',
        '$ docker push miregistry.azurecr.io/servicios/mi-app:1.2.0',
        '',
        '# 4. Desplegar en servicio serverless gestionado',
        '$ az container create \\',
        '    --resource-group rg-prod \\',
        '    --name mi-api \\',
        '    --image miregistry.azurecr.io/servicios/mi-app:1.2.0'
      ].join('\n')
    });
  }

  // ─── Diapositiva 49: Container Registries: Seguridad y Gobernanza ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Registries OCI',
      title: 'Container Registries: Seguridad, Escaneo de Vulnerabilidades y Gobernanza',
      notes: {
        obj: 'Profundizar en la seguridad de la cadena de suministro de software (Supply Chain Security) en los registries cloud.',
        guion: [
          'Docker Hub es el gran repositorio público pero tiene límites de descarga anónima (rate-limit).',
          'Los registries privados cloud (ACR, ECR, Artifact Registry) se integran con IAM sin contraseñas estáticas.',
          'Escaneo automático de CVEs: detecta paquetes vulnerables del sistema operativo y dependencias.',
          'Inmutabilidad de tags: impide que un atacante sobrescriba una versión legítima (ej. :v1.0.0) con código malicioso.'
        ],
        preguntas: '¿Qué ocurriría en producción si un atacante consigue sobrescribir la imagen "backend:v2.0" en el registry con malware?',
        lab: 'Buscar imágenes oficiales seguras en Docker Hub con `docker search --filter is-official=true nginx`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Docker Hub vs Registries Cloud Gestionados',
        icon: 'FaDatabase',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Docker Hub Público:', text: 'Catálogo de imágenes oficiales de la comunidad, con limitaciones de rate-limit anónimo.' },
          { lead: 'Registries Privados Cloud:', text: 'ACR, ECR y Artifact Registry dentro de la red privada del proveedor de nube.' },
          { lead: 'Autenticación IAM Nativa:', text: 'Acceso por roles y Service Accounts (elimina contraseñas en texto plano).' },
          { lead: 'Geo-Replicación Global:', text: 'Imágenes sincronizadas entre datacenters para descargas en milisegundos.' }
        ]
      },
      {
        title: 'Seguridad y Escaneo de Vulnerabilidades',
        icon: 'FaShieldAlt',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Escaneo de CVEs en Push:', text: 'Análisis estático de paquetes del SO (apt, apk) alertando sobre fallos conocidos.' },
          { lead: 'Firma Digital (Cosign/Notary):', text: 'Garantía criptográfica de que la imagen fue generada por el pipeline oficial.' },
          { lead: 'Inmutabilidad de Tags:', text: 'Impedir la sobrescritura accidental o fraudulenta de versiones publicadas.' },
          { lead: 'Políticas de Ciclo de Vida:', text: 'Eliminación programada de imágenes huérfanas tras 30 días para reducir costes.' }
        ]
      }
    ], { y: CY, h: 3.5 });

    callout(s, {
      x: CX, y: CY + 3.75, w: CW, h: 1.05,
      kind: 'warn',
      lead: 'POLÍTICA CORPORATIVA:',
      text: 'Habilitar siempre la directiva "Immutable Tags" en el Container Registry empresarial. Evita que un build fallido o un atacante modifique una imagen ya validada en producción.'
    });
  }

  // ─── Diapositiva 50: Ecosistema de Contenedores en Microsoft Azure ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Microsoft Azure',
      title: 'Contenedores en Microsoft Azure: Panorámica de Servicios',
      notes: {
        obj: 'Mapear el catálogo completo de opciones de contenedores en Azure para que el alumno sepa qué herramienta usar según el caso de uso.',
        guion: [
          'Azure Container Registry (ACR): almacenamiento privado OCI con integración en Microsoft Entra ID.',
          'Azure Container Instances (ACI): la forma más rápida de ejecutar un contenedor aislado sin administrar VMs ni clústeres.',
          'Azure Container Apps (ACA): plataforma de microservicios serverless sobre Kubernetes gestionado con KEDA y Envoy.',
          'Azure App Service: ideal para aplicaciones web clásicas con dominios personalizados y certificados SSL automáticos.',
          'Azure Kubernetes Service (AKS): orquestación completa para despliegues a gran escala.'
        ],
        preguntas: 'Si solo quieres ejecutar un script de Python que procese un archivo por lotes durante 15 minutos al día, ¿qué servicio elegirías?',
        lab: 'Revisar la jerarquía de soluciones de cómputo en Azure.'
      }
    });

    cardsGrid(s, [
      {
        title: 'Azure Container Registry (ACR)',
        icon: 'FaDatabase',
        body: 'Registro privado OCI con soporte de geo-replicación, cifrado en reposo, escaneo con Microsoft Defender for Cloud y control RBAC mediante Entra ID.'
      },
      {
        title: 'Azure Container Instances (ACI)',
        icon: 'FaBolt',
        body: 'La solución más directa para arrancar contenedores en segundos sin gestionar clústeres. Facturación por segundos y aislamiento por hipervisor.'
      },
      {
        title: 'Azure Container Apps (ACA)',
        icon: 'FaCubes',
        body: 'Plataforma serverless construida sobre Kubernetes y KEDA. Escalado automático por peticiones HTTP o colas, soporte de microservicios y escalado a cero.'
      },
      {
        title: 'Azure App Service Containers',
        icon: 'FaGlobe',
        body: 'PaaS enfocado a aplicaciones web HTTP/HTTPS con dominios personalizados, certificados SSL gestionados, slots de staging y autenticación social integrada.'
      },
      {
        title: 'Azure Kubernetes Service (AKS)',
        icon: 'FaSitemap',
        body: 'Plataforma de Kubernetes administrada de nivel empresarial con integración en Azure CNI, nodos virtuales y gobierno corporativo avanzado.'
      },
      {
        title: 'Criterio de Elección',
        icon: 'FaCheckCircle',
        body: '• Tareas batch / Jobs: ACI\n• Microservicios / APIs: ACA\n• Webapps tradicionales: App Service\n• Clústeres complejos: AKS'
      }
    ], { cols: 3, y: CY, h: CH });
  }

  // ─── Diapositiva 51: Azure Container Instances (ACI) a Fondo ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Azure ACI',
      title: 'Azure Container Instances (ACI): Contenedores sin Servidores',
      notes: {
        obj: 'Enseñar a desplegar un contenedor público en Azure en menos de 2 minutos mediante Azure CLI.',
        guion: [
          'ACI proporciona arranque inmediato en segundos sin esperar el aprovisionamiento de máquinas virtuales.',
          'Facturación granular por segundos según vCPUs y memoria RAM reservadas.',
          'Aislamiento estricto de nivel hipervisor: cada instancia corre en su propio sandbox de virtualización ligera.',
          'Asignación automática de IP pública y nombre de dominio FQDN (`*.eastus.azurecontainer.io`).'
        ],
        preguntas: '¿Por qué ACI no es la mejor opción para un sistema complejo de 40 microservicios interconectados? (Para eso está ACA o AKS).',
        lab: 'Inspeccionar los parámetros de creación con `az container create --help`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Características Principales de ACI',
      icon: 'FaServer',
      tone: 'light',
      bullets: [
        { lead: 'Arranque Inmediato:', text: 'Puesta en marcha en segundos sin aprovisionamiento de VMs.' },
        { lead: 'Facturación por Segundos:', text: 'Pago exacto por el tiempo de ejecución y recursos (vCPU/RAM).' },
        { lead: 'Aislamiento por Hipervisor:', text: 'Seguridad multinquilino estricta; no comparte kernel con otros clientes.' },
        { lead: 'IP Pública y FQDN:', text: 'Generación automática de nombre DNS público accesible desde Internet.' },
        { lead: 'Montaje de Volúmenes:', text: 'Soporte nativo para carpetas compartidas de Azure Files mediante CIFS.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'DESPLIEGUE EN ACI MEDIANTE AZURE CLI',
      code: [
        '# 1. Desplegar contenedor web con FQDN público',
        '$ az container create \\',
        '    --resource-group rg-formacion \\',
        '    --name mi-web-aci \\',
        '    --image mcr.microsoft.com/azuredocs/aci-helloworld \\',
        '    --dns-name-label curso-docker-demo \\',
        '    --ports 80 \\',
        '    --cpu 1 \\',
        '    --memory 1.5',
        '',
        '# 2. Consultar el FQDN asignado',
        '$ az container show --resource-group rg-formacion \\',
        '    --name mi-web-aci --query "ipAddress.fqdn"',
        '"curso-docker-demo.eastus.azurecontainer.io"',
        '',
        '# 3. Eliminar la instancia al terminar la tarea',
        '$ az container delete --resource-group rg-formacion \\',
        '    --name mi-web-aci -y'
      ].join('\n')
    });
  }

  // ─── Diapositiva 52: Azure Container Apps (ACA) ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Azure ACA',
      title: 'Azure Container Apps (ACA): Microservicios y KEDA sin Complejidad',
      notes: {
        obj: 'Presentar Azure Container Apps como el punto dulce de la industria entre la simpleza de ACI y la complejidad de AKS.',
        guion: [
          'ACA ejecuta sobre clústeres de AKS administrados por Microsoft: disfrutas de Kubernetes sin gestionar manifests ni control planes.',
          'Escalado por eventos con KEDA: escala por peticiones HTTP concurrentes, mensajes en cola (RabbitMQ, Service Bus) o eventos Kafka.',
          'Escalado a cero: si no hay tráfico, apaga los contenedores y el coste se reduce a cero.',
          'Descubrimiento de servicios integrado con Envoy y soporte nativo de Dapr.'
        ],
        preguntas: '¿Qué ventaja tiene escalar por el número de mensajes en una cola en lugar de esperar a que la CPU se caliente al 80%?',
        lab: 'Inspeccionar los comandos de Azure Container Apps con `az containerapp --help`.'
      }
    });

    cardsRow(s, [
      {
        title: 'La Plataforma Moderna de Microservicios',
        icon: 'FaCubes',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Kubernetes Invisible:', text: 'Desarrollado sobre AKS; disfrutas de K8s sin lidiar con manifests complejos.' },
          { lead: 'Escalado KEDA:', text: 'Autoescalado por eventos: mensajes en cola (Service Bus, Kafka) o peticiones HTTP.' },
          { lead: 'Escalado a Cero:', text: 'Apagado total de réplicas en periodos de inactividad para reducir costes.' },
          { lead: 'Descubrimiento DNS:', text: 'Resolución de nombres interna entre microservicios del mismo entorno.' }
        ]
      },
      {
        title: 'Casos de Uso Ideales en Producción',
        icon: 'FaRocket',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'APIs Públicas y Privadas:', text: 'Enrutamiento Envoy integrado, certificados HTTPS y división de tráfico.' },
          { lead: 'Workers de Mensajería:', text: 'Procesadores en segundo plano que se activan al llegar mensajes a la cola.' },
          { lead: 'Despliegues Blue/Green:', text: 'División porcentual de tráfico entre versiones de forma transparente.' },
          { lead: 'Alternativa Práctica a K8s:', text: 'Para equipos que necesitan elasticidad sin gestionar nodos de clúster.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 53: Ecosistema de Contenedores en AWS ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Amazon AWS',
      title: 'Contenedores en Amazon Web Services (AWS): Catálogo Central',
      notes: {
        obj: 'Estructurar el catálogo de AWS para que el alumno entienda el papel de ECS frente a EKS y el cómputo Fargate.',
        guion: [
          'Amazon ECR: registro privado gestionado cifrado con KMS y escaneo continuo.',
          'Amazon ECS: el orquestador nativo de AWS, maduro, hiper-optimizado e integrado con IAM y CloudWatch.',
          'AWS Fargate: motor de cómputo serverless para ECS y EKS; permite correr tareas sin gestionar instancias EC2.',
          'Amazon EKS: servicio certificado de Kubernetes para arquitecturas estándar multi-cloud.',
          'AWS App Runner: despliegue serverless directo para aplicaciones web.'
        ],
        preguntas: '¿Quién en el aula ha trabajado con ECS o EKS en Amazon Web Services?',
        lab: 'Mapear la equivalencia entre servicios de Azure y AWS (ACR ↔ ECR, ACI/ACA ↔ ECS/Fargate, AKS ↔ EKS).'
      }
    });

    cardsGrid(s, [
      {
        title: 'Amazon ECR (Registry)',
        icon: 'FaDatabase',
        body: 'Registro de contenedores totalmente gestionado con cifrado KMS, replicación entre regiones de AWS y escaneo con Amazon Inspector.'
      },
      {
        title: 'Amazon ECS (Orquestador)',
        icon: 'FaCubes',
        body: 'Orquestador propietario nativo de AWS, maduro e integrado profundamente con IAM, VPC, Application Load Balancers y CloudWatch.'
      },
      {
        title: 'AWS Fargate (Cómputo Serverless)',
        icon: 'FaBolt',
        body: 'Motor de ejecución serverless para ECS y EKS. Ejecuta tareas aisladas sin necesidad de aprovisionar ni mantener instancias EC2.'
      },
      {
        title: 'Amazon EKS (Kubernetes)',
        icon: 'FaSitemap',
        body: 'Servicio gestionado de Kubernetes estándar de la CNCF, predilecto para organizaciones con estrategias multi-cloud o híbridas.'
      },
      {
        title: 'AWS App Runner',
        icon: 'FaRocket',
        body: 'Servicio serverless totalmente automatizado para desplegar APIs y aplicaciones web desde repositorio de código o imagen de ECR.'
      },
      {
        title: 'Guía de Decisión en AWS',
        icon: 'FaCheckCircle',
        body: '• ECS + Fargate: La combinación recomendada para el 90% de las empresas.\n• EKS: Cuando se requiere compatibilidad CNCF y tooling K8s.'
      }
    ], { cols: 3, y: CY, h: CH });
  }

  // ─── Diapositiva 54: Amazon ECS: EC2 Launch Type vs AWS Fargate ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'AWS ECS',
      title: 'Amazon ECS: EC2 Launch Type vs AWS Fargate Serverless',
      notes: {
        obj: 'Contrastar los dos modelos de ejecución de ECS: pagar por servidores fijos (EC2) frente a pagar por tarea en ejecución (Fargate).',
        guion: [
          'EC2 Launch Type: los contenedores corren en instancias EC2 que tú administras; requiere parchear el SO y monitorizar espacio.',
          'Permite aprovechar instancias reservadas y Spot (hasta 90% de descuento) o hardware especializado (GPUs).',
          'Fargate: defines la tarea con vCPU y memoria; AWS aprovisiona el entorno al vuelo en MicroVMs Firecracker aisladas.',
          'Fargate reduce drásticamente las horas de ingeniería de operaciones dedicadas al mantenimiento del cluster.'
        ],
        preguntas: 'Si tu clúster tiene picos repentinos e impredecibles de tráfico, ¿cuál de los dos modelos escala más rápido?',
        lab: 'Inspeccionar la tecnología Firecracker de microVMs en Rust desarrollada por AWS.'
      }
    });

    cardsRow(s, [
      {
        title: 'Modelo EC2 Launch Type (Servidores)',
        icon: 'FaServer',
        tone: 'light',
        bullets: [
          { lead: 'Control de Instancias:', text: 'Los contenedores corren sobre máquinas EC2 que tú aprovisionas y gestionas.' },
          { lead: 'Carga Operativa:', text: 'Responsabilidad de parchear el SO anfitrión, actualizar el agente ECS y vigilar discos.' },
          { lead: 'Ahorro con Spot:', text: 'Permite usar instancias Spot (hasta 90% de descuento para cargas tolerantes a fallos).' },
          { lead: 'Hardware Dedicado:', text: 'Obligatorio si se requieren GPUs para inferencia de IA o tipos de CPU muy concretos.' }
        ]
      },
      {
        title: 'Modelo AWS Fargate (Serverless)',
        icon: 'FaBolt',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Cero Instancias EC2:', text: 'Defines la tarea con vCPU y RAM; AWS aprovisiona el entorno al vuelo.' },
          { lead: 'MicroVMs Firecracker:', text: 'Cada tarea corre en su propio sandbox ligero de virtualización en Rust (<5ms de inicio).' },
          { lead: 'Mantenimiento Cero:', text: 'AWS gestiona los parches de seguridad del host, kernel y runtime OCI.' },
          { lead: 'Modelo Predilecto:', text: 'La opción recomendada por AWS para reducir drásticamente el coste de mantenimiento.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 55: Amazon ECR y Ciclo de Seguridad ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'AWS ECR',
      title: 'Amazon ECR: Autenticación IAM y Seguridad en Repositorios',
      notes: {
        obj: 'Instruir en el uso de Amazon ECR, las políticas de inmutabilidad y el escaneo de vulnerabilidades.',
        guion: [
          'La autenticación en ECR utiliza tokens temporales de 12 horas generados por `aws ecr get-login-password`.',
          'Las políticas de repositorio permiten autorizar qué cuentas de AWS o roles IAM pueden hacer push o pull.',
          'Escaneo continuo con Amazon Inspector: analiza paquetes del sistema operativo y dependencias de lenguajes de programación.',
          'Inmutabilidad de tags: asegura que nadie pueda sobrescribir una imagen de producción.'
        ],
        preguntas: '¿Por qué la inmutabilidad de tags evita que un error humano en el pipeline de CI/CD rompa un despliegue anterior?',
        lab: 'Revisar la sintaxis de login en ECR con token efímero.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Gobernanza y Seguridad en ECR',
      icon: 'FaShieldAlt',
      tone: 'light',
      bullets: [
        { lead: 'Autenticación Efímera IAM:', text: 'Las contraseñas generadas caducan a las 12 horas (sin secretos estáticos).' },
        { lead: 'Resource Policies:', text: 'Control granular de acceso entre diferentes cuentas de AWS o roles de servicio.' },
        { lead: 'Amazon Inspector:', text: 'Detección en tiempo real de vulnerabilidades conocidas (CVEs) en capas y librerías.' },
        { lead: 'Tags Inmutables:', text: 'Bloqueo declarativo para impedir la sobrescritura accidental de versiones publicadas.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'FLUJO DE OPERACIÓN EN AMAZON ECR',
      code: [
        '# 1. Obtener token de login de ECR y pasarlo al CLI de Docker',
        '$ aws ecr get-login-password --region eu-west-1 | \\',
        '    docker login --username AWS --password-stdin \\',
        '    123456789012.dkr.ecr.eu-west-1.amazonaws.com',
        '',
        '# 2. Crear repositorio privado con inmutabilidad y escaneo',
        '$ aws ecr create-repository \\',
        '    --repository-name app-backend \\',
        '    --image-tag-mutability IMMUTABLE \\',
        '    --image-scanning-configuration scanOnPush=true',
        '',
        '# 3. Etiquetar y subir la imagen al repositorio privado',
        '$ docker tag mi-api:1.0 \\',
        '    123456789012.dkr.ecr.eu-west-1.amazonaws.com/app-backend:1.0',
        '$ docker push \\',
        '    123456789012.dkr.ecr.eu-west-1.amazonaws.com/app-backend:1.0'
      ].join('\n')
    });
  }

  // ─── Diapositiva 56: Ecosistema de Contenedores en Google Cloud (GCP) ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Google Cloud',
      title: 'Contenedores en Google Cloud Platform (GCP): Cuna de Kubernetes',
      notes: {
        obj: 'Resaltar la posición histórica de Google en el desarrollo de cgroups y Kubernetes y presentar Cloud Run y GKE.',
        guion: [
          'Google lleva más de 15 años ejecutando todos sus servicios (Search, Gmail, YouTube) en contenedores mediante su sistema interno Borg.',
          'Google creó los cgroups en 2006 y los donó al kernel de Linux, y posteriormente creó y donó Kubernetes a la CNCF.',
          'Google Artifact Registry: almacén universal OCI para imágenes Docker, paquetes npm, PyPI, Maven y Helm.',
          'Google Cloud Run: plataforma serverless gestionada que ejecuta cualquier contenedor HTTP con escalado ultra rápido.',
          'Google Kubernetes Engine (GKE): el servicio de K8s administrado de referencia, con soporte de GKE Autopilot.'
        ],
        preguntas: '¿Sabías que Google arranca más de 4.000 millones de contenedores por semana en su infraestructura interna?',
        lab: 'Inspeccionar el catálogo de Artifact Registry y Cloud Run en Google Cloud.'
      }
    });

    cardsGrid(s, [
      {
        title: 'Pioneros Históricos',
        icon: 'FaBook',
        body: 'Google inventó los cgroups (process containers) en 2006 y desarrolló Borg, el precursor arquitectónico directo de Kubernetes.'
      },
      {
        title: 'Artifact Registry',
        icon: 'FaDatabase',
        body: 'Almacén universal OCI que unifica imágenes de Docker con paquetes de software (npm, pip, maven) y escaneo de vulnerabilidades.'
      },
      {
        title: 'Google Cloud Run',
        icon: 'FaBolt',
        body: 'Plataforma serverless totalmente gestionada para ejecutar contenedores que escalan de 0 a miles de instancias en milisegundos.'
      },
      {
        title: 'Google Kubernetes Engine (GKE)',
        icon: 'FaSitemap',
        body: 'El estándar de oro en Kubernetes administrado. Modalidad GKE Autopilot para plano de control y plano de datos serverless.'
      },
      {
        title: 'Sandbox gVisor',
        icon: 'FaShieldAlt',
        body: 'Núcleo de emulación en Ring 3 desarrollado por Google que intercepta las llamadas al sistema para máxima seguridad multinquilino.'
      },
      {
        title: 'Filosofía Cloud-Native',
        icon: 'FaCheckCircle',
        body: 'Google Cloud destaca por su integración nativa con estándares abiertos de la CNCF, evitando el vendor lock-in propietario.'
      }
    ], { cols: 3, y: CY, h: CH });
  }

  // ─── Diapositiva 57: Google Cloud Run a Fondo ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Google Cloud Run',
      title: 'Google Cloud Run: La Excelencia en Serverless Containers',
      notes: {
        obj: 'Demostrar la agilidad extrema de Google Cloud Run para desplegar contenedores sin preocuparse por servidores ni infraestructura.',
        guion: [
          'A diferencia de AWS Lambda (restringido a ciertos runtimes), en Cloud Run puedes ejecutar cualquier código empaquetado en un contenedor Docker que escuche en $PORT.',
          'Concurrencia por contenedor: una única instancia atiende hasta 1000 peticiones simultáneas, abaratando costes drásticamente.',
          'Escalado instantáneo de 0 a 1000+ réplicas en milisegundos ante picos de tráfico.',
          'Asigna automáticamente subdominio `.run.app` con TLS gestionado y balanceo global Anycast de Google.'
        ],
        preguntas: '¿Cuál es la diferencia entre AWS Lambda y Google Cloud Run? (Lambda ejecuta funciones; Cloud Run ejecuta cualquier contenedor estándar).',
        lab: 'Examinar los parámetros de despliegue con `gcloud run deploy --help`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Por Qué Cloud Run Cambió las Reglas',
      icon: 'FaRocket',
      tone: 'light',
      accent: COL.CYAN,
      bullets: [
        { lead: 'Cualquier Lenguaje o Binario:', text: 'Ejecuta cualquier imagen Docker que escuche peticiones en el puerto `$PORT`.' },
        { lead: 'Alta Concurrencia:', text: 'Una única instancia puede atender hasta 1000 peticiones simultáneas en memoria.' },
        { lead: 'Escalado Instantáneo:', text: 'Reacción en milisegundos ante avalanchas repentinas de tráfico web.' },
        { lead: 'Dominio HTTPS y CDN:', text: 'Subdominio automático `.run.app` con certificados TLS y red Anycast global.' },
        { lead: 'Pago por Petición Exacta:', text: 'Facturación al milisegundo; sin tráfico activo el coste es exactamente 0€.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'DESPLIEGUE EN CLOUD RUN CON GCLOUD CLI',
      code: [
        '# Desplegar un contenedor en Cloud Run con un único comando',
        '$ gcloud run deploy mi-api-rest \\',
        '    --image gcr.io/cloudrun/hello \\',
        '    --platform managed \\',
        '    --region europe-west1 \\',
        '    --allow-unauthenticated \\',
        '    --port 8080 \\',
        '    --memory 512Mi \\',
        '    --min-instances 0 \\',
        '    --max-instances 10',
        '',
        '# URL lista para producción generada en segundos:',
        '# Service URL: https://mi-api-rest-xyz-ew.a.run.app',
        '',
        '# Probar el servicio desplegado',
        '$ curl https://mi-api-rest-xyz-ew.a.run.app'
      ].join('\n')
    });
  }

  // ─── Diapositiva 58: Google Artifact Registry ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Artifact Registry',
      title: 'Google Artifact Registry: Almacén Universal OCI',
      notes: {
        obj: 'Explicar la transición de Container Registry (gcr.io) a Artifact Registry (*-docker.pkg.dev) en Google Cloud.',
        guion: [
          'Soporte multipaquete unificado: imágenes Docker OCI, paquetes npm, PyPI, Maven y charts de Helm en un solo lugar.',
          'Repositorios regionales: colocar las imágenes en la misma región que Cloud Run o GKE reduce la latencia de pull a milisegundos y elimina costes de transferencia de red.',
          'Binary Authorization: bloqueo automático del despliegue en GKE si la imagen no supera las políticas corporativas o carece de firma digital.'
        ],
        preguntas: '¿Por qué es beneficioso tener el registro de contenedores en la misma región que el clúster de cómputo? (Menor latencia y ahorro en tráfico).',
        lab: 'Configurar Docker para autenticarse con Artifact Registry mediante `gcloud auth configure-docker`.'
      }
    });

    card(s, {
      x: CX, y: CY, w: 4.8, h: CH,
      title: 'Evolución de GCR a Artifact Registry',
      icon: 'FaDatabase',
      tone: 'light',
      bullets: [
        { lead: 'Soporte Multipaquete:', text: 'Imágenes OCI, paquetes npm, Python (PyPI), Java Maven y charts Helm unificados.' },
        { lead: 'Repositorios Regionales:', text: 'Minimiza la latencia de pull ubicando imágenes junto a los clústeres de cómputo.' },
        { lead: 'Control de Acceso IAM:', text: 'Integración granular con Cuentas de Servicio (Service Accounts) de Google Cloud.' },
        { lead: 'Binary Authorization:', text: 'Impedir el despliegue en producción si la imagen no cuenta con firma auditada.' }
      ]
    });

    code(s, {
      x: CX + 5.1, y: CY, w: CW - 5.1, h: CH,
      size: 10,
      label: 'FLUJO EN GOOGLE ARTIFACT REGISTRY',
      code: [
        '# 1. Configurar credenciales de Docker para el Registry',
        '$ gcloud auth configure-docker \\',
        '    europe-west1-docker.pkg.dev',
        '',
        '# 2. Etiquetar la imagen local con el formato regional',
        '$ docker tag mi-app:1.0 \\',
        '    europe-west1-docker.pkg.dev/mi-proyecto/repo-apps/mi-app:1.0',
        '',
        '# 3. Subir la imagen al repositorio privado',
        '$ docker push \\',
        '    europe-west1-docker.pkg.dev/mi-proyecto/repo-apps/mi-app:1.0',
        '',
        '# 4. Desplegar directamente en Cloud Run',
        '$ gcloud run deploy mi-app \\',
        '    --image europe-west1-docker.pkg.dev/mi-proyecto/repo-apps/mi-app:1.0'
      ].join('\n')
    });
  }

  // ─── Diapositiva 59: Docker Cloud: Análisis Histórico y su Evolución ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Historia y Evolución',
      title: 'Docker Cloud: Análisis Histórico y Evolución hacia el Ecosistema Actual',
      notes: {
        obj: 'Abordar el punto oficial del temario "Docker Cloud" con total rigor histórico y profesionalidad.',
        guion: [
          'Docker Cloud nació de la adquisición de la startup Tutum por parte de Docker Inc en octubre de 2015.',
          'Ofrecía un panel SaaS para gestionar contenedores conectando credenciales de AWS, Azure y DigitalOcean.',
          'Fue retirado definitivamente el 21 de mayo de 2018 ante el dominio de Kubernetes y los servicios administrados de los gigantes cloud.',
          'Docker Inc reorientó su negocio hacia Docker Desktop comercial, Docker Hub y herramientas de análisis como Docker Scout.'
        ],
        preguntas: '¿Tiene sentido que una empresa intente competir en hosting contra AWS, Microsoft y Google a la vez?',
        lab: 'Inspeccionar las herramientas modernas de Docker como Docker Scout con `docker scout --help`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Qué fue "Docker Cloud" (2015-2018)',
        icon: 'FaBook',
        tone: 'light',
        bullets: [
          { lead: 'Origen:', text: 'Adquisición de la startup Tutum por parte de Docker Inc. en octubre de 2015.' },
          { lead: 'Propósito Original:', text: 'Panel web SaaS para desplegar y monitorizar contenedores sobre AWS, Azure y DigitalOcean.' },
          { lead: 'Cierre Oficial:', text: 'Retirado definitivamente en mayo de 2018 tras el auge arrollador de Kubernetes y CaaS cloud.' },
          { lead: '¿Por qué en el Temario?:', text: 'Vestigio histórico de temarios clásicos que debe ser aclarado con rigor por el docente.' }
        ]
      },
      {
        title: 'Hacia Dónde Evolucionó Docker Inc.',
        icon: 'FaRocket',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Docker Hub Moderno:', text: 'El registro público de referencia global con builds automatizados y organizaciones.' },
          { lead: 'Docker Desktop:', text: 'Plataforma de productividad para desarrolladores (Mac, Windows, Linux) con extensiones.' },
          { lead: 'Docker Scout:', text: 'Herramienta de análisis de la cadena de suministro, SBOM y remediación de CVEs.' },
          { lead: 'Enfoque Estratégico:', text: 'Liderar la "experiencia de desarrollo" (DevX) y delegar la infraestructura a la nube.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 60: ¿Cuándo usar CaaS Serverless vs Kubernetes? ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Criterios de Arquitectura',
      title: '¿Cuándo usar CaaS Serverless vs Kubernetes Gestionado?',
      notes: {
        obj: 'Ayudar a los alumnos a tomar decisiones técnicas y económicas fundamentadas en sus proyectos corporativos.',
        guion: [
          'Kubernetes añade una sobrecarga operativa y cognitiva notable: manifests YAML complejos, gestión de ingress, RBAC y upgrades.',
          'Para el 80% de los proyectos (APIs web, microservicios orientados a eventos, workers), un servicio serverless como Cloud Run o ACA cubre todas las necesidades con coste operativo mínimo.',
          'Kubernetes se justifica para topologías complejas con cientos de microservicios, service mesh (Istio), operadores avanzados y requisitos multi-cloud sin vendor lock-in.'
        ],
        preguntas: 'Si tu empresa solo tiene 4 desarrolladores y una API web, ¿recomendarías montar un clúster de Kubernetes desde cero?',
        lab: 'Evaluar el coste operativo y humano del clúster frente a servicios gestionados.'
      }
    });

    cardsRow(s, [
      {
        title: 'Elegir CaaS Serverless (Cloud Run, ACI, ACA, Fargate)',
        icon: 'FaBolt',
        tone: 'light',
        accent: COL.CYAN,
        bullets: [
          { lead: 'Equipos Reducidos:', text: 'Cero personas dedicadas a administrar infraestructura, redes o parches de clúster.' },
          { lead: 'Cargas Web y APIs HTTP:', text: 'Microservicios que se benefician directamente del escalado automático a cero.' },
          { lead: 'Procesamiento por Lotes:', text: 'Tareas que arrancan, procesan datos durante unos minutos y se apagan.' },
          { lead: 'Rápido Time-to-Market:', text: 'Poner en producción una imagen en 5 minutos con un único comando de CLI.' },
          { lead: 'Presupuesto Optimizado:', text: 'No pagas por planos de control fijos ni por máquinas virtuales ociosas.' }
        ]
      },
      {
        title: 'Elegir Kubernetes Gestionado (AKS, EKS, GKE)',
        icon: 'FaSitemap',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Topologías Complejas:', text: 'Cientos de microservicios interconectados, mallas de servicios (Istio/Linkerd).' },
          { lead: 'Control Fino de Red:', text: 'Políticas de red L3/L4 personalizadas, volúmenes de bloque y topologías multi-nodo.' },
          { lead: 'Ecosistema CNCF Extenso:', text: 'Operadores de bases de datos, herramientas GitOps (ArgoCD, Flux) y observabilidad.' },
          { lead: 'Estrategia Multi-Cloud:', text: 'Evitar vendor lock-in ejecutando los mismos manifests en cualquier nube y on-premise.' },
          { lead: 'Equipo DevOps Dedicado:', text: 'Capacidad humana para asumir la gestión del clúster y sus ciclos de actualización.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 61: Buenas Prácticas para Despliegues en la Nube ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Buenas Prácticas Cloud',
      title: 'Buenas Prácticas para Contenedores en Producción Cloud',
      notes: {
        obj: 'Fijar las pautas de arquitectura cloud-native necesarias para que un contenedor sea estable y seguro en la nube.',
        guion: [
          'Diseño Stateless: no guardar archivos en disco local; delegar en bases de datos gestionadas y almacenamiento de objetos (S3, GCS, Blob Storage).',
          'Configuración por variables de entorno (The Twelve-Factor App) e inyección de secretos mediante gestores dedicados (Key Vault, Secrets Manager).',
          'Configurar directiva HEALTHCHECK para que el balanceador cloud desvíe peticiones si el contenedor se cuelga.',
          'Escribir logs siempre en stdout/stderr para que los recolecte el agente de observabilidad de la nube.'
        ],
        preguntas: '¿Qué le ocurriría a tu factura de Cloud Run si no configuras un límite de max-instances y sufres un ataque DoS?',
        lab: 'Probar la salida estándar limpia con `docker run --rm alpine echo "Logs directos a stdout"`.'
      }
    });

    cardsRow(s, [
      {
        title: 'Diseño y Operación Resiliente',
        icon: 'FaCheckCircle',
        tone: 'light',
        accent: COL.COBALT,
        bullets: [
          { lead: 'Arquitectura Stateless:', text: 'No guardar estado local; delegar en bases de datos gestionadas y buckets de objetos.' },
          { lead: 'Variables de Entorno (12-Factor):', text: 'Inyectar configuración y secretos mediante gestores dedicados de la nube.' },
          { lead: 'Sondas de Salud (`HEALTHCHECK`):', text: 'Declarar verificaciones de salud para que el orquestador reinicie instancias caídas.' },
          { lead: 'Logs a stdout / stderr:', text: 'Salida directa a consola para su recolección automática en CloudWatch o Cloud Logging.' }
        ]
      },
      {
        title: 'Seguridad y Control de Costes',
        icon: 'FaLock',
        tone: 'light',
        accent: COL.CORAL,
        bullets: [
          { lead: 'Prohibido Secretos en Build:', text: 'Jamás escribir credenciales o llaves API en el Dockerfile ni durante el build.' },
          { lead: 'Usuario No-Root:', text: 'Declarar `USER appuser` en la imagen para mitigar riesgos de escape del contenedor.' },
          { lead: 'Límites de CPU y Memoria:', text: 'Declarar topes en cada servicio para evitar colapsos por consumo descontrolado.' },
          { lead: 'Límites de Autoescalado:', text: 'Fijar `max-instances` para prevenir sorpresas en la factura mensual ante ataques DoS.' }
        ]
      }
    ], { y: CY, h: CH });
  }

  // ─── Diapositiva 62: Laboratorio 4 ───
  {
    const s = slide(pres, {
      mod: 4,
      badge: 'Práctica Guiada',
      title: 'Laboratorio 4: Registries Cloud y Despliegue CaaS',
      lab: true,
      notes: {
        obj: 'Guiar a los alumnos en el proceso completo de subir una imagen a un registro público/privado y desplegarla en un entorno cloud.',
        guion: [
          'Los alumnos etiquetarán su imagen local con la URL del registry (Docker Hub, ACR, ECR o Artifact Registry).',
          'Autenticarse de forma segura mediante CLI.',
          'Ejecutar `docker push` y comprobar en el panel web la subida diferencial de capas y los digests SHA-256.',
          'Desplegar en un servicio serverless (o simulación local con registry v2 si no hay credenciales cloud).',
          'Actualizar el código a la versión 1.0.1 y desplegar sin caída de servicio.'
        ],
        preguntas: '¿Quién ha conseguido hacer push de su imagen y verla listada en el registro remoto?',
        lab: [
          '1. Autenticar Docker con el registry: `docker login` o CLI cloud.',
          '2. Etiquetar imagen con tag semántico: `docker tag mi-api:1.0 <registry>/<user>/mi-api:1.0`.',
          '3. Subir imagen: `docker push <registry>/<user>/mi-api:1.0`.',
          '4. Verificar en el panel web la carga de capas y el hash SHA256.',
          '5. Desplegar en servicio serverless CaaS (ACI, Cloud Run o simulación).',
          '6. Probar URL pública con curl.',
          '7. Modificar código, compilar versión 1.0.1 y actualizar sin caída de servicio.'
        ]
      }
    });

    card(s, {
      x: CX, y: CY, w: 5.6, h: CH,
      title: 'Objetivos del Laboratorio 4',
      icon: 'FaTools',
      tone: 'light',
      accent: COL.CORAL,
      bullets: [
        { lead: 'Paso 1 · Autenticación:', text: 'Conectar el cliente local de Docker al registry mediante credenciales seguras.' },
        { lead: 'Paso 2 · Etiquetado Canónico:', text: 'Generar la referencia completa `<registry>/<namespace>/<app>:<version>`.' },
        { lead: 'Paso 3 · Publicación (Push):', text: 'Subir las capas de la imagen y verificar la deduplicación en el servidor.' },
        { lead: 'Paso 4 · Auditoría Remota:', text: 'Comprobar en el panel web el digest SHA256 y el escaneo de vulnerabilidades.' },
        { lead: 'Paso 5 · Despliegue Cloud:', text: 'Instanciar el contenedor en un entorno CaaS (ACI / Cloud Run / Registry local).' },
        { lead: 'Paso 6 · Verificación Pública:', text: 'Probar el endpoint público asignado mediante navegador o `curl`.' },
        { lead: 'Paso 7 · Despliegue Continuo:', text: 'Publicar la versión 1.0.1 y actualizar el servicio sin pérdida de tráfico.' }
      ]
    });

    code(s, {
      x: CX + 5.9, y: CY, w: CW - 5.9, h: CH,
      label: 'RESOLUCIÓN DEL LABORATORIO 4 (REGISTRY & PUSH)',
      code: [
        '# 1. Simulación de Registry local v2 (o usar Docker Hub / Cloud)',
        '$ docker run -d -p 5000:5000 --name registry-local registry:2',
        '',
        '# 2. Compilar imagen de prueba con tag semántico',
        '$ docker build -t mi-api:1.0.0 .',
        '',
        '# 3. Etiquetar para el registro destino',
        '$ docker tag mi-api:1.0.0 localhost:5000/servicios/mi-api:1.0.0',
        '',
        '# 4. Enviar capas al registro remoto',
        '$ docker push localhost:5000/servicios/mi-api:1.0.0',
        '',
        '# 5. Auditar el catálogo del registro vía API REST OCI',
        '$ curl http://localhost:5000/v2/_catalog',
        '{"repositories":["servicios/mi-api"]}',
        '',
        '# 6. Desplegar contenedor descargando desde el registry',
        '$ docker run -d -p 8080:80 localhost:5000/servicios/mi-api:1.0.0',
        '$ curl -I http://localhost:8080'
      ].join('\n')
    });
  }

  // ─── Diapositiva 63: Resumen del Día 3 y Cierre ───
  divider(pres, {
    mod: 4,
    title: 'RESUMEN DE LA JORNADA 3',
    subtitle: 'Conceptos consolidados: CaaS, Serverless Containers, Azure (ACR, ACI, ACA), AWS (ECR, ECS, Fargate), Google Cloud (Cloud Run, Artifact Registry) y Registries OCI.\nPróxima Jornada: Módulo 5 (Orquestación a escala, Kubernetes y Taller Final Integrador).',
    hours: 'CONCLUSIÓN DÍA 3',
    topics: [
      { icon: 'FaCheckCircle', text: 'CaaS y Serverless: Ejecución elástica de contenedores con escalado a cero.' },
      { icon: 'FaCheckCircle', text: 'Registries OCI: Inmutabilidad de tags, escaneo de CVEs y autenticación IAM.' },
      { icon: 'FaCheckCircle', text: 'Nubes Públicas: Azure Container Apps, AWS Fargate y Google Cloud Run.' },
      { icon: 'FaCheckCircle', text: 'Criterio de Arquitectura: Cuándo utilizar CaaS Serverless vs clúster K8s.' },
      { icon: 'FaCheckCircle', text: 'Laboratorio 4 completado con éxito por los alumnos.' }
    ],
    notes: {
      obj: 'Cerrar la Jornada 3 revisando cómo los contenedores conectan el desarrollo con la nube y preparar el escenario para Kubernetes en el Día 4.',
      guion: [
        'Hacer balance de los avances: los alumnos dominan el ciclo de vida del contenedor en local y su despliegue elástico en las tres grandes nubes públicas.',
        'Anticipar la última jornada (Día 4): nos adentraremos en el Módulo 5, centrado en la seguridad avanzada en producción (CIS Docker Benchmark, Rootless, Seccomp) y la orquestación a gran escala con Docker Swarm y Kubernetes.',
        'Resolver dudas de los alumnos sobre las opciones cloud analizadas.'
      ],
      preguntas: 'Entre ACI, AWS Fargate y Google Cloud Run, ¿cuál os parece la alternativa más atractiva para vuestros proyectos inmediatos?',
      lab: 'Verificar que todos los contenedores de prueba del laboratorio 4 han sido detenidos y limpiados con `docker rm -f`.'
    }
  });
}

module.exports = { buildModule4 };
