"""
module4.py - Módulo 4 / Día 3: Contenedores en Cloud (Azure, AWS, GCP y evolución de Docker Cloud).
Genera 18 diapositivas técnicas con esquemas comparativos y notas completas.
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


def build_module4(prs):
    """Construye las 18 diapositivas del Día 3 (Módulo 4: Contenedores en Cloud)."""
    slides = []
    blank = get_blank_layout(prs)

    # Slide 1: Portada Día 3
    s1 = add_title_slide(
        prs,
        title="CONTENEDORES EN CLOUD",
        subtitle="Módulo 4: Containers en Azure, AWS, Google Cloud y Evolución de Docker Cloud\nJornada 3 de 4 (5 Horas Lectivas)",
        module_tag="DÍA 3 • DESPLIEGUE EN LA NUBE",
        notes_data={
            "objective": "Introducir el salto desde la máquina local del desarrollador hacia las grandes nubes públicas empresariales.",
            "under_the_hood": "Los proveedores de nube pública ejecutan hipervisores tipo 1 fuertemente customizados (ej. AWS Nitro, Azure Hyper-V) sobre los que despliegan máquinas virtuales aisladas (MicroVMs como Firecracker) para ofrecer ejecución serverless de contenedores con aislamiento multinquilino estricto.",
            "classroom_prompt": "¿Qué proveedores de nube pública utilizáis actualmente en vuestra empresa (AWS, Azure, GCP u on-premise)?",
            "live_demo": "docker info | grep -i 'Registry'"
        }
    )
    slides.append(s1)

    # Slide 2: El Paradigma Cloud: De IaaS a CaaS y Serverless
    s2 = prs.slides.add_slide(blank)
    add_background(s2)
    add_header(s2, "Evolución Cloud: De IaaS a CaaS y Serverless Containers", "Módulo 4 • Fundamentos Cloud")
    c1 = add_card(s2, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0), "IaaS (VMs Tradicionales)")
    add_bullet_list(c1.text_frame, [
        "Gestión de Infraestructura: Parchear el SO, gestionar kernels, configurar firewalls de red y agentes de seguridad.",
        "Sobrecarga de Operaciones: Escalar levantando nuevas VMs tarda minutos.",
        "Pago por Capacidad: Facturación continua 24/7 aunque la CPU esté al 1% de uso.",
        "Uso: Monolitos antiguos o cargas que requieren control extremo de hardware."
    ], font_size=13)
    c2 = add_card(s2, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0), "CaaS (Containers as a Service)")
    add_bullet_list(c2.text_frame, [
        "Control del Contenedor: El usuario entrega la imagen Docker; el proveedor gestiona el runtime.",
        "Orquestación Integrada: Servicios que manejan el ciclo de vida, balanceo y reinicio de contenedores.",
        "Escalado Ágil: Adición de réplicas en segundos en lugar de minutos.",
        "Ejemplos: Amazon ECS, Azure Container Apps, Google Cloud Run."
    ], font_size=13)
    c3 = add_card(s2, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0), "Serverless Containers")
    add_bullet_list(c3.text_frame, [
        "Cero Servidores que Administrar: Sin nodos, sin clusters que actualizar, sin capacidad ociosa.",
        "Escalado a Cero: Si no hay peticiones, el servicio escala a 0 réplicas y el coste es exactamente 0€.",
        "Pago por Consumo Exacto: Facturación al milisegundo por vCPU y GB consumidos.",
        "Modelo Predilecto: APIs REST, microservicios orientados a eventos y jobs batch."
    ], font_size=13)
    add_speaker_notes(
        s2,
        objective="Posicionar el concepto de CaaS y Serverless Containers frente a las VMs tradicionales de IaaS.",
        under_the_hood="En Serverless Containers no hay un host Linux permanente asignado al usuario. El proveedor crea dinámicamente un sandbox de ejecución rápido cuando entra una petición HTTP y lo suspende o apaga al terminar.",
        classroom_prompt="¿Cuánto dinero ahorra una empresa si una API interna de facturación que solo se usa de lunes a viernes escala a cero por las noches y fines de semana?",
        live_demo="echo 'De IaaS a Serverless Containers'"
    )
    slides.append(s2)

    # Slide 3: El Pipeline de Despliegue Cloud
    s3 = prs.slides.add_slide(blank)
    add_background(s3)
    add_header(s3, "El Ciclo de Vida Cloud: Build, Ship & Run", "Módulo 4 • Pipeline")
    c1 = add_card(s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "El Flujo Canónico del Contenedor")
    add_bullet_list(c1.text_frame, [
        "1. BUILD (Local o CI/CD): El desarrollador o el servidor de integración continua (GitHub Actions, GitLab CI, Azure DevOps) compila la imagen.",
        "2. TAG: Se etiqueta la imagen con la URL del registro privado y el commit SHA o versión semántica (`mi-registry.azurecr.io/app:v1.2.0`).",
        "3. SHIP (Push): Se sube la imagen al Container Registry mediante protocolos HTTPS autenticados con tokens seguros.",
        "4. RUN (Pull & Deploy): El servicio cloud descarga la imagen desde el registry privado y arranca el contenedor."
    ])
    add_code_block(s3, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Flujo típico en terminal:",
        "",
        "# 1. Autenticarse en el registro cloud",
        "$ az acr login --name miregistry    # Azure",
        "$ aws ecr get-login-password | ...  # AWS",
        "$ gcloud auth configure-docker      # GCP",
        "",
        "# 2. Etiquetar la imagen local con la ruta completa",
        "$ docker tag mi-app:latest \\",
        "    miregistry.azurecr.io/servicios/mi-app:1.2.0",
        "",
        "# 3. Enviar las capas al registro remoto",
        "$ docker push miregistry.azurecr.io/servicios/mi-app:1.2.0",
        "",
        "# 4. Desplegar en servicio serverless",
        "$ az container create ... --image miregistry...:1.2.0"
    ], "Comandos de Flujo Cloud")
    add_speaker_notes(
        s3,
        objective="Hacer entender que el Container Registry es el centro neurálgico que conecta el desarrollo con el despliegue cloud.",
        under_the_hood="Al hacer 'docker push', el cliente comprueba con el registry qué capas (por su SHA256) ya existen en el servidor remoto para subir únicamente las capas nuevas (subida diferencial optimizada).",
        classroom_prompt="¿Por qué nunca debemos usar credenciales de usuario/contraseña personales en un pipeline de CI/CD para hacer push?",
        live_demo="docker tag --help | head -n 8"
    )
    slides.append(s3)

    # Slide 4: Container Registries: Seguridad y Gobernanza
    s4 = prs.slides.add_slide(blank)
    add_background(s4)
    add_header(s4, "Container Registries: Seguridad, Escaneo y Gobernanza", "Módulo 4 • Registries")
    c1 = add_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Docker Hub vs Registries Cloud Gestionados")
    add_bullet_list(c1.text_frame, [
        "Docker Hub: El registro público central de la comunidad. Excelente para imágenes base oficiales (Ubuntu, Alpine, Node, Python), pero con límites de rate-limit (peticiones anónimas restringidas).",
        "Registries Privados Cloud (ACR, ECR, Artifact Registry): Almacenamiento privado dentro de la red del proveedor de nube sin límites de ancho de banda y con coste mínimo.",
        "Autenticación Nativa IAM: Acceso basado en identidades gestionadas y roles de nube (evita contraseñas estáticas en archivos de configuración).",
        "Geo-Replicación: Duplicación automática de imágenes en múltiples regiones geográficas para descargas ultrarrápidas y resiliencia."
    ])
    c2 = add_card(s4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Seguridad y Escaneo de Vulnerabilidades")
    add_bullet_list(c2.text_frame, [
        "Escaneo Automático de CVEs: Los registros analizan los paquetes del SO de la imagen (apt, apk, rpm) y alertan sobre vulnerabilidades conocidas (CVE-xxxx).",
        "Firma Criptográfica (Notary / Cosign): Garantía de que la imagen desplegada en producción fue firmada por el equipo de seguridad y no ha sido alterada.",
        "Políticas de Inmutabilidad de Tags: Impedir que un tag existente (ej. `:v1.0.0`) sea sobrescrito por un push malicioso o accidental.",
        "Políticas de Limpieza Automática (Lifecycle Rules): Eliminación programada de imágenes sin etiquetar (untagged) tras 30 días para ahorrar costes."
    ])
    add_speaker_notes(
        s4,
        objective="Profundizar en la seguridad de la cadena de suministro de software (Supply Chain Security) en los registries cloud.",
        under_the_hood="La especificación OCI Distribution Specification define la API HTTP estándar (/v2/<name>/manifests/<reference>) que implementan todos los registros cloud modernos.",
        classroom_prompt="¿Qué pasaría en producción si un atacante consigue sobrescribir la imagen 'backend:v2.0' en el registry con una versión que contiene malware?",
        live_demo="docker search --filter is-official=true nginx | head -n 5"
    )
    slides.append(s4)

    # Slide 5: Ecosistema de Contenedores en Microsoft Azure
    s5 = prs.slides.add_slide(blank)
    add_background(s5)
    add_header(s5, "Contenedores en Microsoft Azure: Panorámica de Servicios", "Módulo 4 • Azure")
    c1 = add_card(s5, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "El Catálogo de Soluciones de Contenedores de Azure")
    add_bullet_list(c1.text_frame, [
        "Azure Container Registry (ACR): Servicio gestionado de registro privado compatible con OCI, con cifrado en reposo, soporte de geo-replicación y control de acceso RBAC vía Microsoft Entra ID (Azure AD).",
        "Azure Container Instances (ACI): La forma más rápida y simple de ejecutar un contenedor en Azure sin aprovisionar máquinas virtuales ni clústeres. Ideal para jobs puntuales, tareas batch o despliegues simples.",
        "Azure Container Apps (ACA): Plataforma de aplicaciones serverless basada en Kubernetes gestionado, Envoy y KEDA (Kubernetes Event-driven Autoscaling). Pensada para microservicios con escalado automático.",
        "Azure App Service for Containers: Ejecución de aplicaciones web contenerizadas con certificados SSL automáticos, dominios personalizados, slots de despliegue y autenticación integrada.",
        "Azure Kubernetes Service (AKS): Servicio completo y gestionado de Kubernetes para despliegues empresariales de gran escala con control fino de infraestructura."
    ], space_after=Pt(12))
    add_speaker_notes(
        s5,
        objective="Mapear el catálogo completo de opciones de contenedores en Azure para que el alumno sepa qué herramienta usar según el caso de uso.",
        under_the_hood="Azure Container Instances ejecuta cada grupo de contenedores dentro de una frontera de hipervisor dedicada y aislada, garantizando que dos clientes no comparten el mismo kernel en la infraestructura física de Azure.",
        classroom_prompt="Si solo quieres levantar un script de Python que procese un archivo una vez al día durante 10 minutos, ¿qué servicio de Azure elegirías?",
        live_demo="echo 'Azure Container Registry (ACR) + ACI + ACA + AKS'"
    )
    slides.append(s5)

    # Slide 6: Azure Container Instances (ACI) a Fondo
    s6 = prs.slides.add_slide(blank)
    add_background(s6)
    add_header(s6, "Azure Container Instances (ACI): Contenedores sin Servidores", "Módulo 4 • Azure")
    c1 = add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Características Principales de ACI")
    add_bullet_list(c1.text_frame, [
        "Arranque Inmediato: Puesta en marcha en segundos sin esperas de aprovisionamiento de máquinas virtuales.",
        "Facturación por Segundos: Pago únicamente por la duración exacta de ejecución y los recursos asignados (vCPUs y GB de memoria).",
        "Aislamiento por Hipervisor: Seguridad multinquilino de nivel hipervisor; cada instancia corre en su propio sandbox de virtualización ligera.",
        "Dirección IP Pública y DNS: Asignación automática de IP pública y nombre de dominio FQDN (`<nombre>.eastus.azurecontainer.io`).",
        "Montaje de Volúmenes: Soporte nativo para montar carpetas compartidas de Azure Files mediante SMB/CIFS."
    ])
    add_code_block(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Desplegar un contenedor Nginx en Azure con Azure CLI",
        "$ az container create \\",
        "    --resource-group rg-formacion \\",
        "    --name mi-web-aci \\",
        "    --image mcr.microsoft.com/azuredocs/aci-helloworld \\",
        "    --dns-name-label curso-docker-demo \\",
        "    --ports 80 \\",
        "    --cpu 1 \\",
        "    --memory 1.5",
        "",
        "# Comprobar estado y ver FQDN asignado",
        "$ az container show --resource-group rg-formacion \\",
        "    --name mi-web-aci --query \"ipAddress.fqdn\"",
        "\"curso-docker-demo.eastus.azurecontainer.io\"",
        "",
        "# Destruir la instancia al finalizar",
        "$ az container delete --resource-group rg-formacion \\",
        "    --name mi-web-aci -y"
    ], "Despliegue con Azure CLI")
    add_speaker_notes(
        s6,
        objective="Enseñar a desplegar un contenedor público en Azure en menos de 2 minutos mediante Azure CLI.",
        under_the_hood="ACI soporta el concepto de 'Container Groups', similar a un Pod de Kubernetes: varios contenedores que comparten ciclo de vida, almacenamiento y la misma dirección IP.",
        classroom_prompt="¿Por qué ACI no es la mejor opción para un sistema complejo de 30 microservicios interconectados? (Para eso está ACA o AKS)",
        live_demo="echo 'az container create --help'"
    )
    slides.append(s6)

    # Slide 7: Azure Container Apps (ACA)
    s7 = prs.slides.add_slide(blank)
    add_background(s7)
    add_header(s7, "Azure Container Apps (ACA): Microservicios y KEDA", "Módulo 4 • Azure")
    c1 = add_card(s7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Plataforma Moderna de Microservicios")
    add_bullet_list(c1.text_frame, [
        "Kubernetes Invisible: Desarrollado sobre clústeres de AKS administrados por Microsoft; disfrutas de los beneficios de K8s sin gestionar manifests complejos.",
        "Escalado Orientado a Eventos (KEDA): Escala no solo por CPU/RAM, sino por número de peticiones HTTP concurrentes, mensajes en cola (RabbitMQ, Azure Service Bus) o eventos Kafka.",
        "Escalado a Cero: Apaga completamente los contenedores cuando no hay tráfico activo, minimizando costes.",
        "Descubrimiento de Servicios Integrado: Comunicación interna por DNS privado entre microservicios del mismo entorno.",
        "Soporte Nativo de Dapr: Integración opcional con Distributed Application Runtime para patrones de microservicios (pub/sub, state store)."
    ])
    c2 = add_card(s7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Casos de Uso Ideales para ACA")
    add_bullet_list(c2.text_frame, [
        "APIs Públicas y Privadas: Microservicios HTTP con balanceador de carga Envoy y certificados HTTPS automáticos.",
        "Procesadores de Colas en Segundo Plano: Workers que se activan solo cuando entran mensajes a procesar y se apagan al terminar.",
        "Despliegues Azules/Verdes (Blue/Green): Capacidad de dividir tráfico porcentual entre dos versiones distintas de la misma aplicación.",
        "Alternativa Práctica a Kubernetes: Para equipos que necesitan orquestación elástica sin la sobrecarga operativa de administrar un clúster K8s."
    ])
    add_speaker_notes(
        s7,
        objective="Presentar Azure Container Apps como el punto dulce actual de la industria entre la simpleza de ACI y la complejidad de AKS.",
        under_the_hood="ACA utiliza Dapr como sidecar opcional y Envoy proxy como ingress controller. La abstracción de KEDA monitoriza métricas externas para disparar el Horizontal Pod Autoscaler de K8s bajo cuerda.",
        classroom_prompt="¿Qué ventaja tiene escalar por el tamaño de una cola de mensajes en vez de por consumo de CPU?",
        live_demo="echo 'az containerapp --help'"
    )
    slides.append(s7)

    # Slide 8: Ecosistema de Contenedores en AWS
    s8 = prs.slides.add_slide(blank)
    add_background(s8)
    add_header(s8, "Contenedores en Amazon Web Services (AWS)", "Módulo 4 • AWS")
    c1 = add_card(s8, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Los Cuatro Pilares de Contenedores en AWS")
    add_bullet_list(c1.text_frame, [
        "Amazon ECR (Elastic Container Registry): Registro de contenedores totalmente administrado, cifrado con KMS, con escaneo de seguridad y replicación entre regiones.",
        "Amazon ECS (Elastic Container Service): El orquestador nativo de AWS, altamente optimizado, maduro y profundamente integrado con servicios como IAM, CloudWatch, Application Load Balancer y Route 53.",
        "AWS Fargate: Motor de cómputo serverless para Amazon ECS y Amazon EKS. Permite ejecutar contenedores sin tener que gestionar servidores EC2 subyacentes.",
        "Amazon EKS (Elastic Kubernetes Service): Servicio de Kubernetes certificado por la CNCF, altamente escalable y estándar en la industria para arquitecturas multi-cloud.",
        "AWS App Runner: Servicio serverless de despliegue directo desde código o contenedor para aplicaciones web y APIs con autoescalado automático."
    ], space_after=Pt(12))
    add_speaker_notes(
        s8,
        objective="Estructurar el catálogo de AWS para que el alumno entienda el papel de ECS frente a EKS y el cómputo Fargate.",
        under_the_hood="Amazon ECS utiliza internamente un agente de código abierto (amazon-ecs-agent) escrito en Go que corre en los nodos y habla directamente con el motor de Docker o containerd.",
        classroom_prompt="¿Quién en el aula ha trabajado con ECS o EKS en Amazon Web Services?",
        live_demo="echo 'Amazon ECR + ECS + Fargate + EKS'"
    )
    slides.append(s8)

    # Slide 9: Amazon ECS: EC2 Launch Type vs AWS Fargate
    s9 = prs.slides.add_slide(blank)
    add_background(s9)
    add_header(s9, "Amazon ECS: EC2 Launch Type vs AWS Fargate", "Módulo 4 • AWS")
    c1 = add_card(s9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Modelo EC2 Launch Type")
    add_bullet_list(c1.text_frame, [
        "Control Total de Servidores: Los contenedores se ejecutan sobre instancias EC2 que tú aprovisionas y administras.",
        "Responsabilidad Operativa: Debes parchear el SO de las instancias, actualizar el agente de ECS y monitorizar el espacio en disco.",
        "Aprovechamiento de Descuentos: Permite usar instancias reservadas, Savings Plans o instancias Spot (hasta un 90% de descuento para cargas interrumpibles).",
        "Tipos Especiales de Hardware: Obligatorio si necesitas GPUs dedicadas (entrenamiento IA), memoria extrema o tipos de CPU específicos."
    ])
    c2 = add_card(s9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Modelo AWS Fargate (Serverless)")
    add_bullet_list(c2.text_frame, [
        "Cero Instancias EC2: Defines tu tarea de contenedor con vCPU y memoria; AWS aprovisiona el entorno al vuelo.",
        "Aislamiento Estricto por Tarea: Cada tarea de Fargate corre en su propia máquina virtual aislada (tecnología Firecracker MicroVMs).",
        "Mantenimiento Cero: AWS gestiona los parches de seguridad del host, el kernel y el daemon de contenedores.",
        "Modelo Recomendado por AWS: Es la opción predeterminada para el 90% de las cargas de trabajo por su drástica reducción de horas de ingeniería de operaciones."
    ])
    add_speaker_notes(
        s9,
        objective="Contrastar los dos modelos de ejecución de ECS: pagar por servidores fijos (EC2) vs pagar por tarea en ejecución (Fargate).",
        under_the_hood="Firecracker es un hipervisor ligero de código abierto desarrollado por AWS en Rust basado en KVM que arranca MicroVMs en menos de 5ms consumiendo solo 5MB de memoria.",
        classroom_prompt="Si tu clúster de ECS tiene picos inesperados de tráfico en Black Friday, ¿cuál de los dos modelos escala más rápido?",
        live_demo="aws ecs list-clusters 2>/dev/null || echo 'AWS CLI configured check'"
    )
    slides.append(s9)

    # Slide 10: Amazon ECR y Ciclo de Seguridad
    s10 = prs.slides.add_slide(blank)
    add_background(s10)
    add_header(s10, "Amazon ECR: Seguridad y Políticas de Ciclo de Vida", "Módulo 4 • AWS")
    c1 = add_card(s10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Funcionalidades Clave de ECR")
    add_bullet_list(c1.text_frame, [
        "Autenticación Efímera IAM: Las contraseñas de Docker obtenidas con `get-login-password` caducan automáticamente tras 12 horas.",
        "Políticas de Repositorio (Resource Policies): Control granular de qué cuentas de AWS o roles IAM pueden hacer push o pull.",
        "Escaneo Continuo con Amazon Inspector: Detección automática en tiempo real de vulnerabilidades en paquetes del SO y dependencias de lenguaje (Python, Java, JS).",
        "Inmutabilidad de Tags: Protección contra sobrescritura accidental de imágenes de producción mediante configuración declarativa."
    ])
    add_code_block(s10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# 1. Obtener token de login de ECR y pasarlo a Docker",
        "$ aws ecr get-login-password --region eu-west-1 | \\",
        "    docker login --username AWS --password-stdin \\",
        "    123456789012.dkr.ecr.eu-west-1.amazonaws.com",
        "",
        "# 2. Crear repositorio privado",
        "$ aws ecr create-repository --repository-name app-backend \\",
        "    --image-tag-mutability IMMUTABLE \\",
        "    --image-scanning-configuration scanOnPush=true",
        "",
        "# 3. Subir la imagen",
        "$ docker push 123456789012.dkr.../app-backend:1.0"
    ], "Uso de Amazon ECR")
    add_speaker_notes(
        s10,
        objective="Instruir en el uso de Amazon ECR y las políticas de inmutabilidad y escaneo automático al hacer push.",
        under_the_hood="ECR almacena los datos de las capas de imagen directamente en Amazon S3 cifrados con claves KMS con una durabilidad del 99.999999999% (11 nueves).",
        classroom_prompt="¿Por qué la inmutabilidad de tags evita que un fallo humano en CI/CD rompa un despliegue previo?",
        live_demo="echo 'aws ecr get-login-password --help'"
    )
    slides.append(s10)

    # Slide 11: Ecosistema de Contenedores en Google Cloud (GCP)
    s11 = prs.slides.add_slide(blank)
    add_background(s11)
    add_header(s11, "Contenedores en Google Cloud Platform (GCP)", "Módulo 4 • Google Cloud")
    c1 = add_card(s11, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "La Cuna de Kubernetes y la Contenedorización Masiva")
    add_bullet_list(c1.text_frame, [
        "Pioneros en Contenedores: Google lleva más de 15 años ejecutando toda su infraestructura (Gmail, Search, YouTube) en contenedores mediante su sistema interno 'Borg' (el predecesor directo de Kubernetes).",
        "Google Artifact Registry: La evolución moderna de Google Container Registry (GCR). Soporta imágenes OCI, paquetes de software (npm, pip, maven) y escaneo de vulnerabilidades.",
        "Google Cloud Run: Plataforma serverless totalmente administrada que ejecuta contenedores invocables mediante peticiones HTTP o mensajes de Eventarc/PubSub.",
        "Google Kubernetes Engine (GKE): El servicio de Kubernetes administrado de referencia en el mercado, con soporte para GKE Autopilot (gestión serverless del plano de datos).",
        "Aislamiento gVisor: Tecnología de sandbox de kernel desarrollada por Google que intercepta syscalls para máxima seguridad multinquilino."
    ], space_after=Pt(12))
    add_speaker_notes(
        s11,
        objective="Resaltar la posición histórica de Google en el desarrollo de cgroups y Kubernetes y presentar Cloud Run y GKE.",
        under_the_hood="Google diseñó originalmente cgroups (llamados process containers en 2006) y los donó al kernel de Linux para poder ejecutar Borg en sus datacenters.",
        classroom_prompt="¿Sabías que Google arranca más de 4.000 millones de contenedores por semana en su infraestructura interna?",
        live_demo="echo 'Google Artifact Registry + Cloud Run + GKE'"
    )
    slides.append(s11)

    # Slide 12: Google Cloud Run a Fondo
    s12 = prs.slides.add_slide(blank)
    add_background(s12)
    add_header(s12, "Google Cloud Run: La Excelencia en Serverless Containers", "Módulo 4 • Google Cloud")
    c1 = add_card(s12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Por Qué Cloud Run Cambió las Reglas")
    add_bullet_list(c1.text_frame, [
        "Cualquier Lenguaje o Binario: A diferencia de AWS Lambda (restringido a ciertos runtimes), en Cloud Run puedes ejecutar cualquier código empaquetado en un contenedor Docker que escuche en `$PORT`.",
        "Concurrencia por Contenedor: Una única instancia puede atender hasta 1000 peticiones simultáneas, abaratando costes drásticamente frente a funciones serverless tradicionales.",
        "Escalado Instantáneo de 0 a 1000+: Reacciona en milisegundos a avalanchas repentinas de tráfico web.",
        "Dominio HTTPS y CDN Automático: Cada servicio recibe un subdominio `.run.app` con TLS gestionado y balanceo global Anycast de Google.",
        "Pago Exacto por Petición: Si no hay tráfico, el coste es cero."
    ])
    add_code_block(s12, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Desplegar un contenedor en Cloud Run con un solo comando",
        "$ gcloud run deploy mi-api-rest \\",
        "    --image gcr.io/cloudrun/hello \\",
        "    --platform managed \\",
        "    --region europe-west1 \\",
        "    --allow-unauthenticated \\",
        "    --port 8080 \\",
        "    --memory 512Mi \\",
        "    --min-instances 0 \\",
        "    --max-instances 10",
        "",
        "# URL lista para producción generada en segundos:",
        "# Service URL: https://mi-api-rest-xyz-ew.a.run.app"
    ], "Despliegue con gcloud CLI")
    add_speaker_notes(
        s12,
        objective="Demostrar la agilidad extrema de Google Cloud Run para desplegar contenedores sin preocuparse por servidores ni infraestructura.",
        under_the_hood="Cloud Run utiliza Knative Serving sobre clústeres de GKE optimizados y cajas de aislamiento gVisor para arrancar contenedores en frío en menos de un segundo.",
        classroom_prompt="¿Cuál es la diferencia entre AWS Lambda y Google Cloud Run? (Lambda ejecuta funciones; Cloud Run ejecuta cualquier contenedor estándar).",
        live_demo="echo 'gcloud run deploy --help'"
    )
    slides.append(s12)

    # Slide 13: Google Artifact Registry
    s13 = prs.slides.add_slide(blank)
    add_background(s13)
    add_header(s13, "Google Artifact Registry: Almacén Universal OCI", "Módulo 4 • Google Cloud")
    c1 = add_card(s13, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Evolución de Container Registry (GCR)")
    add_bullet_list(c1.text_frame, [
        "Soporte Multipaquete Unificado: Un único servicio para almacenar imágenes Docker OCI, paquetes npm, paquetes Python (PyPI), Java Maven y charts de Helm.",
        "Repositorios Regionales: Ubicación precisa de los artefactos en la misma región que tus servicios de Cloud Run o GKE para reducir la latencia de pull a milisegundos.",
        "Control de Acceso IAM: Integración granular con Cuentas de Servicio (Service Accounts) de Google Cloud.",
        "Vulnerability Scanning y Binary Authorization: Bloqueo automático del despliegue en GKE si la imagen no supera las políticas de seguridad corporativas."
    ])
    add_code_block(s13, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Configurar Docker para autenticarse con Artifact Registry",
        "$ gcloud auth configure-docker europe-west1-docker.pkg.dev",
        "",
        "# Etiquetar imagen con formato Artifact Registry",
        "$ docker tag mi-app:1.0 \\",
        "    europe-west1-docker.pkg.dev/mi-proyecto/repo-apps/mi-app:1.0",
        "",
        "# Enviar la imagen",
        "$ docker push \\",
        "    europe-west1-docker.pkg.dev/mi-proyecto/repo-apps/mi-app:1.0"
    ], "Flujo Artifact Registry")
    add_speaker_notes(
        s13,
        objective="Explicar la transición de GCR clásico (gcr.io) a Artifact Registry (*-docker.pkg.dev) en Google Cloud.",
        under_the_hood="Binary Authorization en Google Cloud valida firmas criptográficas generadas durante el pipeline de build para impedir que nadie pueda desplegar una imagen manual no auditada.",
        classroom_prompt="¿Por qué es beneficioso tener el registro de contenedores en la misma región que el clúster de cómputo? (Menor latencia de descarga y ahorro en costes de transferencia de red).",
        live_demo="gcloud artifacts repositories list 2>/dev/null || echo 'gcloud check'"
    )
    slides.append(s13)

    # Slide 14: Docker Cloud: Análisis Histórico y Evolución
    s14 = prs.slides.add_slide(blank)
    add_background(s14)
    add_header(s14, "Docker Cloud: Análisis Histórico y su Evolución", "Módulo 4 • Contexto Histórico")
    c1 = add_card(s14, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Qué fue 'Docker Cloud' (2015-2018)")
    add_bullet_list(c1.text_frame, [
        "Origen: Nació de la adquisición de la startup Tutum por parte de Docker Inc. en octubre de 2015.",
        "Propósito Original: Proporcionaba un panel web SaaS para gestionar, desplegar y escalar contenedores Docker conectando credenciales de AWS, Azure y DigitalOcean.",
        "Cierre Oficial: Docker Inc. anunció su retirada definitiva el 21 de mayo de 2018 tras el auge arrollador de Kubernetes y los servicios administrados de los gigantes cloud.",
        "¿Por qué aparece en el temario?: Es un vestigio histórico de programas formativos clásicos que todo instructor profesional debe contextualizar con rigor."
    ])
    c2 = add_card(s14, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Hacia Dónde Evolucionó Docker Inc.")
    add_bullet_list(c2.text_frame, [
        "Docker Hub Moderno: El registro público de referencia, con soporte de Builds automatizados y organizaciones.",
        "Docker Desktop & Extensions: Plataforma de productividad para desarrolladores (Mac, Windows, Linux) con extensiones de Kubernetes, Snyk, Portainer.",
        "Docker Scout: Herramienta moderna de análisis de la cadena de suministro de software, SBOM (Software Bill of Materials) y recomendaciones de remediación de CVEs.",
        "Enfoque Actual: Docker se enfoca en la 'experiencia del desarrollador' (DevX) mientras delega la infraestructura cloud a AWS, Azure y GCP."
    ])
    add_speaker_notes(
        s14,
        objective="Abordar el punto oficial del temario 'Docker Cloud' con total rigor histórico y profesionalidad.",
        under_the_hood="Tutum y Docker Cloud intentaron monetizar el hosting de contenedores antes de que AWS lanzara ECS/Fargate y Google lanzara Cloud Run. Docker Inc. reorientó su modelo de negocio hacia Docker Desktop comercial y suscripciones de Docker Hub.",
        classroom_prompt="¿Tiene sentido que una empresa intente competir en hosting contra AWS, Microsoft y Google a la vez?",
        live_demo="docker scout --help 2>/dev/null || docker --help"
    )
    slides.append(s14)

    # Slide 15: Tabla Comparativa: CaaS Serverless vs Kubernetes
    s15 = prs.slides.add_slide(blank)
    add_background(s15)
    add_header(s15, "¿Cuándo usar CaaS Serverless vs Kubernetes?", "Módulo 4 • Arquitectura")
    c1 = add_card(s15, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Elegir CaaS Serverless (Cloud Run, ACI, Fargate)")
    add_bullet_list(c1.text_frame, [
        "Equipos Pequeños / Startups: Cero personas dedicadas a administrar infraestructura, redes o parches de clúster.",
        "Cargas Web y APIs HTTP: Cargas de trabajo orientadas a peticiones que se benefician del escalado automático a cero.",
        "Procesamiento Batch / Eventos: Tareas que arrancan, procesan datos durante unos minutos y se apagan.",
        "Menor Tiempo al Mercado: Poner en producción una imagen en 5 minutos con un único comando de CLI.",
        "Presupuesto Reducido: No pagas por un plano de control fijo ni por nodos ociosos."
    ])
    c2 = add_card(s15, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Elegir Kubernetes Gestionado (AKS, EKS, GKE)")
    add_bullet_list(c2.text_frame, [
        "Topologías Complejas: Cientos de microservicios con dependencias complejas, mallas de servicios (Service Mesh como Istio/Linkerd).",
        "Control Fino de Red y Almacenamiento: Necesidad de definir políticas de red L3/L4 personalizadas, volúmenes de bloque y topologías multi-nodo avanzadas.",
        "Ecosistema CNCF: Uso de operadores de bases de datos, herramientas GitOps (ArgoCD, Flux) y observabilidad masiva.",
        "Multi-Cloud / Híbrido: Evitar vendor lock-in ejecutando la misma especificación de Kubernetes en cualquier nube y on-premise.",
        "Equipo Dedicado de Platform / DevOps: Capacidad para asumir la gestión del clúster y sus actualizaciones periódicas."
    ])
    add_speaker_notes(
        s15,
        objective="Ayudar a los alumnos a tomar decisiones técnicas y económicas fundamentadas en sus proyectos de empresa.",
        under_the_hood="Kubernetes añade una sobrecarga operativa y cognitiva notable. Para muchas aplicaciones, un servicio serverless como Cloud Run o ACA cubre el 100% de las necesidades con una fracción del coste operativo.",
        classroom_prompt="Si tu empresa solo tiene 3 desarrolladores y una API web, ¿recomendarías montar un clúster de Kubernetes?",
        live_demo="echo 'Comparativa Serverless Containers vs K8s'"
    )
    slides.append(s15)

    # Slide 16: Buenas Prácticas para Despliegues en la Nube
    s16 = prs.slides.add_slide(blank)
    add_background(s16)
    add_header(s16, "Buenas Prácticas para Contenedores en Producción Cloud", "Módulo 4 • Buenas Prácticas")
    c1 = add_card(s16, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Diseño y Operación Resiliente")
    add_bullet_list(c1.text_frame, [
        "Diseño 'Stateless' (Sin Estado): No guardar sesiones ni archivos en disco local; delegar el estado a bases de datos cloud (RDS, Cloud SQL, CosmosDB) y objetos (S3, GCS, Blob Storage).",
        "Configuración por Variables de Entorno: Cumplir el factor III de 'The Twelve-Factor App'. Inyectar configuración y secretos mediante los gestores de secretos de la nube (Secret Manager, Key Vault).",
        "Health Checks Nativos (`HEALTHCHECK`): Configurar sondas de liveness y readiness para que el orquestador cloud reinicie instancias que no responden.",
        "Logs en Salida Estándar (stdout/stderr): Escribir siempre los logs en stdout; el agente cloud los recolectará automáticamente hacia CloudWatch, Cloud Logging o Azure Monitor."
    ])
    c2 = add_card(s16, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Seguridad y Optimización", bg_color=COLOR_ALERT_BG, border_color=COLOR_ALERT_BORDER)
    add_bullet_list(c2.text_frame, [
        "Prohibido Hardcodear Secretos en la Imagen: Jamás escribir API keys o contraseñas en el Dockerfile o durante el build.",
        "Usuario No Root Obligatorio: Configurar directiva `USER appuser` para impedir escaladas de privilegios en el host cloud.",
        "Fijar Límites de Recursos: Declarar siempre CPU y memoria máximos en la definición de la tarea o servicio cloud.",
        "Monitorización de Costes y Autoescalado: Fijar un número máximo de instancias (`max-instances`) para evitar sorpresas desagradables en la factura mensual ante un ataque DoS."
    ])
    add_speaker_notes(
        s16,
        objective="Fijar las pautas de arquitectura cloud-native necesarias para que un contenedor sea estable y seguro en la nube.",
        under_the_hood="La directiva HEALTHCHECK en el Dockerfile es consultada por los balanceadores de carga para saber si deben enviar tráfico a ese contenedor o esperar a que termine de inicializarse.",
        classroom_prompt="¿Qué le ocurriría a tu factura de Cloud Run si no configuras un límite de max-instances y sufres un ataque DoS?",
        live_demo="docker run --rm alpine sh -c 'echo \"Logs directos a stdout y stderr\"'"
    )
    slides.append(s16)

    # Slide 17: Laboratorio 4: Etiquetado, Push a Registry y Despliegue Cloud
    s17 = prs.slides.add_slide(blank)
    add_background(s17)
    add_header(s17, "Laboratorio 4: Registries Cloud y Despliegue CaaS", "Día 3 • Práctica")
    card_lab = add_card(s17, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Objetivos y Pasos del Ejercicio Práctico")
    add_bullet_list(card_lab.text_frame, [
        "Paso 1: Configurar una cuenta en Docker Hub o registry privado del proveedor cloud (Azure ACR / AWS ECR / Google Artifact Registry).",
        "Paso 2: Autenticar el cliente local de Docker mediante terminal segura (`docker login` o credenciales CLI).",
        "Paso 3: Construir una versión 1.0.0 de nuestra API con tag semántico siguiendo la convención: `<registry>/<namespace>/<app>:<version>`.",
        "Paso 4: Ejecutar `docker push` y verificar en el panel web del registry la carga de capas y el hash SHA256 generado.",
        "Paso 5: Desplegar el contenedor en un servicio serverless (ej. Azure ACI, Google Cloud Run o simulación con entorno local) exponiendo el puerto público.",
        "Paso 6: Probar la URL pública asignada mediante navegador o `curl`.",
        "Paso 7: Realizar una modificación de código, subir la versión `1.0.1` y ejecutar una actualización sin caída de servicio (Zero Downtime)."
    ], space_after=Pt(10))
    add_speaker_notes(
        s17,
        objective="Guiar a los alumnos en el proceso completo de subir una imagen a un registro público/privado y desplegarla en un entorno cloud.",
        under_the_hood="En entornos formativos donde los alumnos no disponen de tarjeta de crédito para nubes públicas, este laboratorio se puede realizar de forma 100% gratuita usando Docker Hub público y servicios como Play with Docker, Render, o simulación con registry local 'docker run -d -p 5000:5000 registry:2'.",
        classroom_prompt="¿Quién ha conseguido hacer push de su imagen y verla listada en el registro remoto?",
        live_demo="docker run -d -p 5000:5000 --name registry-local registry:2 && docker tag nginx:alpine localhost:5000/mi-web:1.0 && docker push localhost:5000/mi-web:1.0 && curl http://localhost:5000/v2/_catalog && docker rm -f registry-local"
    )
    slides.append(s17)

    # Slide 18: Resumen del Día 3
    s18 = add_title_slide(
        prs,
        title="RESUMEN DE LA JORNADA 3",
        subtitle="Conceptos consolidados: CaaS, Serverless Containers, Azure (ACI, ACA, ACR), AWS (ECS, Fargate, ECR), Google Cloud (Cloud Run, Artifact Registry) y Registries OCI.\nPróxima Jornada: Módulo 5 (Orquestación a escala, Kubernetes y Taller Final Integrador).",
        module_tag="DÍA 3 • CONCLUSIÓN",
        notes_data={
            "objective": "Cerrar la Jornada 3 revisando cómo los contenedores conectan el desarrollo con la nube y preparar el escenario para Kubernetes en el Día 4.",
            "under_the_hood": "Recordar a los alumnos que mañana entraremos en el orquestador estándar de la industria (Kubernetes) para aprender cómo gestionar cientos de contenedores coordinados.",
            "classroom_prompt": "Entre ACI, Fargate y Cloud Run, ¿cuál os parece la alternativa más atractiva para vuestros proyectos inmediatos?",
            "live_demo": "docker images | head -n 5"
        }
    )
    slides.append(s18)

    return slides
