"""
module5.py - Módulo 5 / Día 4: Introducción a la Orquestación y Kubernetes.
Genera 18 diapositivas técnicas con esquemas arquitectónicos y notas de orador completas.
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
from generator.diagrams import draw_k8s_architecture


def build_module5(prs):
    """Construye las 18 diapositivas del Día 4 (Módulo 5: Orquestación y Kubernetes)."""
    slides = []
    blank = get_blank_layout(prs)

    # Slide 1: Portada Día 4
    s1 = add_title_slide(
        prs,
        title="ORQUESTACIÓN Y KUBERNETES",
        subtitle="Módulo 5: ¿Qué es Orquestación?, Comparativa de Orquestadores y Arquitectura de Kubernetes\nJornada 4 de 4 (5 Horas Lectivas)",
        module_tag="DÍA 4 • ESCALABILIDAD Y RESILIENCIA",
        notes_data={
            "objective": "Dar la bienvenida a la última jornada del curso y presentar el salto de gestionar contenedores individuales a coordinar clústeres masivos.",
            "under_the_hood": "Docker Engine gestiona contenedores en un único host. La orquestación abstrae una flota de cientos o miles de servidores físicos para que el operador los vea y gestione como una única gran computadora homogénea.",
            "classroom_prompt": "Si tenéis 50 contenedores repartidos en 10 servidores y uno de los servidores se quema a las 3 de la madrugada, ¿quién reinicia los contenedores afectados?",
            "live_demo": "docker info | grep -i 'Swarm'"
        }
    )
    slides.append(s1)

    # Slide 2: ¿Por qué necesitamos Orquestación de Contenedores?
    s2 = prs.slides.add_slide(blank)
    add_background(s2)
    add_header(s2, "¿Por qué Orquestar? Los Límites de Docker Standalone", "Módulo 5 • Orquestación")
    c1 = add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Los Límites de un Solo Host")
    add_bullet_list(c1.text_frame, [
        "Punto Único de Fallo (SPOF): Si el servidor donde corre el daemon de Docker cae por avería de hardware o corte de luz, todos los servicios caen.",
        "Capacidad Limitada: Un único servidor físico tiene un tope finito de CPU y memoria RAM; no puede escalar indefinidamente (límite del escalado vertical).",
        "Sin Auto-Recuperación Multi-Servidor: La directiva `--restart always` solo reinicia el contenedor si el host sigue vivo; no puede moverlo a otra máquina.",
        "Gestión Manual Inviable: Desplegar y monitorizar manualmente 100 contenedores con `docker run` o Docker Compose en múltiples IPs se vuelve ingobernable."
    ])
    c2 = add_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "La Promesa del Orquestador")
    add_bullet_list(c2.text_frame, [
        "Abstracción del Clúster: Unifica decenas de servidores en un único grupo de recursos lógicos de cómputo, red y almacenamiento.",
        "Auto-Sanación (Self-Healing): Si un nodo físico muere, el orquestador detecta la pérdida y reprograma automáticamente los contenedores en nodos sanos.",
        "Balanceo de Carga y Enrutamiento: Distribución inteligente de peticiones entrantes entre todas las réplicas disponibles.",
        "Actualizaciones Progresivas (Rolling Updates): Actualización a nuevas versiones de código sin un solo segundo de parada de servicio."
    ])
    add_speaker_notes(
        s2,
        objective="Hacer reflexionar a los alumnos sobre el paso crítico de entornos de desarrollo a operaciones de producción 24/7.",
        under_the_hood="Un orquestador opera como un sistema operativo distribuido. Utiliza algoritmos de consenso (Raft, Paxos) para mantener un estado coherente entre todos los nodos del clúster ante particiones de red (Split-Brain).",
        classroom_prompt="¿Qué hacéis en vuestra empresa cuando hay que actualizar una versión en producción para que los usuarios no noten cortes?",
        live_demo="echo '¿Por qué necesitamos Orquestación?'"
    )
    slides.append(s2)

    # Slide 3: Capacidades Clave de un Orquestador
    s3 = prs.slides.add_slide(blank)
    add_background(s3)
    add_header(s3, "Las 5 Capacidades Clave de un Orquestador", "Módulo 5 • Orquestación")
    c1 = add_card(s3, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Pilares Funcionales de la Orquestación Moderna")
    add_bullet_list(c1.text_frame, [
        "1. Scheduling Inteligente: Evalúa requisitos de CPU, memoria, afinidad y tolerancia a fallos para decidir en qué servidor exacto debe ejecutarse cada contenedor.",
        "2. Auto-Sanación (Self-Healing): Monitoriza continuamente la salud de los procesos; si un contenedor falla en sus sondas de salud, lo destruye y levanta uno nuevo.",
        "3. Escalado Horizontal Dinámico (HPA): Aumenta o disminuye el número de réplicas del contenedor de forma automática en función de la métrica de CPU, memoria o tráfico.",
        "4. Descubrimiento de Servicios y Balanceo de Carga: Asigna una dirección IP virtual estable y un nombre DNS a cada conjunto de réplicas, balanceando el tráfico TCP/UDP.",
        "5. Despliegues y Rollbacks Automatizados: Despliega la versión nueva contenedor por contenedor; si detecta errores en las sondas, revierte el cambio al instante al estado anterior."
    ], space_after=Pt(14))
    add_speaker_notes(
        s3,
        objective="Fijar las 5 responsabilidades esenciales que cualquier orquestador (Swarm, K8s, Nomad) debe proporcionar por diseño.",
        under_the_hood="La reconciliación continua es el motor de todo orquestador: compara permanentemente el 'Desired State' (declarado en YAML) con el 'Actual State' (lo que corre en el kernel). Si difieren, ejecuta acciones correctivas inmediatas.",
        classroom_prompt="¿Qué ventaja tiene que el orquestador haga un rollback automático si una nueva versión falla el health check?",
        live_demo="echo 'Scheduling + Self-Healing + Auto-Scaling + Service Discovery + Rolling Updates'"
    )
    slides.append(s3)

    # Slide 4: Comparativa de Orquestadores
    s4 = prs.slides.add_slide(blank)
    add_background(s4)
    add_header(s4, "Comparativa de Orquestadores: Swarm vs K8s vs Nomad", "Módulo 5 • Orquestadores")
    c1 = add_card(s4, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0), "Docker Swarm")
    add_bullet_list(c1.text_frame, [
        "Filosofía: Simplicidad radical e integración nativa.",
        "Curva de Aprendizaje: Muy baja (reutiliza sintaxis de Docker Compose).",
        "Configuración: Se activa con `docker swarm init` en 10 segundos.",
        "Ecosistema: Limitado, desarrollo mantenido principalmente por Mirantis.",
        "Ideal para: Equipos pequeños y clústeres de tamaño modesto (1-15 nodos)."
    ], font_size=13)
    c2 = add_card(s4, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0), "Kubernetes (K8s)")
    add_bullet_list(c2.text_frame, [
        "Filosofía: Estándar industrial absoluto de la CNCF.",
        "Curva de Aprendizaje: Alta / Compleja (gran variedad de conceptos y APIs).",
        "Configuración: Complejo on-premise; simple en Cloud gestionado (EKS, AKS, GKE).",
        "Ecosistema: El mayor del mundo del software (Helm, ArgoCD, Istio, Prometheus).",
        "Ideal para: Cualquier empresa con arquitecturas de microservicios a escala."
    ], font_size=13)
    c3 = add_card(s4, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0), "HashiCorp Nomad")
    add_bullet_list(c3.text_frame, [
        "Filosofía: Orquestador flexible, ligero y declarativo.",
        "Flexibilidad de Cargas: No solo corre contenedores; corre binarios Java, ejecutables y VMs.",
        "Simplicidad Operativa: Un solo binario Go tanto para servidor como para cliente.",
        "Integración HashiCorp: Nativo con Consul (red/DNS) y Vault (secretos).",
        "Ideal para: Entornos híbridos que mezclan contenedores y aplicaciones legacy."
    ], font_size=13)
    add_speaker_notes(
        s4,
        objective="Presentar el punto oficial del temario 'Comparativa de Orquestadores' analizando los 3 principales contendientes del mercado.",
        under_the_hood="Kubernetes ganó la 'guerra de orquestadores' (2015-2018) frente a Docker Swarm y Apache Mesos gracias al respaldo masivo de Google, Red Hat, Microsoft, Amazon y la fundación CNCF.",
        classroom_prompt="¿Alguien en la sala ha usado Docker Swarm en el pasado? ¿Por qué la industria se volcó con Kubernetes?",
        live_demo="echo 'Docker Swarm vs Kubernetes vs HashiCorp Nomad'"
    )
    slides.append(s4)

    # Slide 5: Docker Swarm a Fondo
    s5 = prs.slides.add_slide(blank)
    add_background(s5)
    add_header(s5, "Docker Swarm: El Orquestador Integrado", "Módulo 5 • Swarm")
    c1 = add_card(s5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Arquitectura de Docker Swarm")
    add_bullet_list(c1.text_frame, [
        "Nativo en Docker Engine: No requiere instalar nada adicional; viene apagado por defecto dentro del daemon `dockerd`.",
        "Nodos Manager y Worker: Los Managers coordinan el clúster usando el algoritmo de consenso Raft (mínimo 3 o 5 para quórum); los Workers ejecutan tareas.",
        "Servicios (`docker service`): Reemplaza a `docker run` para definir réplicas deseadas (ej. `--replicas 5`).",
        "Ingress Routing Mesh: Los puertos publicados se exponen en TODOS los nodos del clúster; cualquier nodo redirige la conexión al contenedor adecuado."
    ])
    add_code_block(s5, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# 1. Inicializar el nodo actual como Manager",
        "$ docker swarm init",
        "Swarm initialized: current node is now a manager.",
        "",
        "# 2. Crear un servicio replicado de Nginx con 3 réplicas",
        "$ docker service create --name web-cluster \\",
        "    --replicas 3 \\",
        "    -p 80:80 \\",
        "    nginx:alpine",
        "",
        "# 3. Escalar el servicio en caliente",
        "$ docker service scale web-cluster=10",
        "",
        "# 4. Realizar actualización continua sin parada",
        "$ docker service update --image nginx:1.25 web-cluster",
        "",
        "# 5. Salir del modo Swarm",
        "$ docker swarm leave --force"
    ], "Comandos Básicos de Docker Swarm")
    add_speaker_notes(
        s5,
        objective="Enseñar a los alumnos a inicializar un clúster Swarm y comprobar cómo escala un servicio en segundos.",
        under_the_hood="SwarmKit utiliza gRPC con TLS mutuo (mTLS) generado automáticamente para encriptar toda la comunicación entre nodos. El Routing Mesh se apoya en IPVS (IP Virtual Server) en el kernel de Linux.",
        classroom_prompt="¿Por qué es recomendable tener un número impar de nodos Manager (3, 5, 7) en un clúster Raft? (Para evitar empates en la elección de líder).",
        live_demo="docker swarm init 2>/dev/null || echo 'Swarm ya activo' ; docker service ls ; docker swarm leave --force 2>/dev/null || true"
    )
    slides.append(s5)

    # Slide 6: Introducción a Kubernetes (K8s)
    s6 = prs.slides.add_slide(blank)
    add_background(s6)
    add_header(s6, "Introducción a Kubernetes: El Estándar de la Industria", "Módulo 5 • Kubernetes")
    c1 = add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Historia y Misión de K8s")
    add_bullet_list(c1.text_frame, [
        "Etimología: Del griego κυβερνήτης (*kubernētēs*), que significa 'timonel' o 'capitán de barco' (de ahí el logo del timón de 7 radios).",
        "Abreviatura 'K8s': Porque hay 8 letras entre la 'K' y la 's'.",
        "Herencia de Google Borg: Creado por ingenieros de Google en 2014 basándose en una década de experiencia gestionando Borg y Omega.",
        "Donación a la CNCF: Google donó el proyecto a la Cloud Native Computing Foundation (Linux Foundation) para garantizar gobernanza neutra.",
        "El Sistema Operativo de la Nube: Hoy es el sustrato universal soportado por todos los grandes proveedores tecnológicos del planeta."
    ])
    c2 = add_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Los Principios de Diseño de K8s")
    add_bullet_list(c2.text_frame, [
        "Enfoque Declarativo: Tú describes el **QUÉ** quieres (en archivos YAML); Kubernetes averigua el **CÓMO** conseguirlo y mantenerlo.",
        "Inmutabilidad de la Infraestructura: No se modifican contenedores en caliente; se reemplazan por nuevas instancias.",
        "Desacoplamiento Absoluto: Los componentes se comunican exclusivamente a través de la API REST central (`kube-apiserver`).",
        "Extensibilidad Extrema: Puedes ampliar Kubernetes con tus propios tipos de objetos mediante CRDs (Custom Resource Definitions) y Operadores."
    ])
    add_speaker_notes(
        s6,
        objective="Poner en contexto el origen, propósito e impacto de Kubernetes en el ecosistema tecnológico global.",
        under_the_hood="Kubernetes no es un sistema de despliegue pasivo; es un sistema de control de lazo cerrado (Closed-Loop Control System) inspirado en la teoría de control y robótica.",
        classroom_prompt="¿Cuál es la diferencia entre un enfoque imperativo ('haz esto ahora') y un enfoque declarativo ('este es el estado deseado')?",
        live_demo="echo 'Kubernetes: De Borg a la CNCF'"
    )
    slides.append(s6)

    # Slide 7: Arquitectura de Kubernetes: Visión Global
    s7 = prs.slides.add_slide(blank)
    add_background(s7)
    add_header(s7, "Arquitectura de Kubernetes: Control Plane y Workers", "Módulo 5 • Arquitectura K8s")
    draw_k8s_architecture(s7, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    add_speaker_notes(
        s7,
        objective="Explicar la división fundamental entre el cerebro del clúster (Control Plane) y los ejecutores de carga (Worker Nodes).",
        under_the_hood="En clústeres gestionados como AKS, EKS o GKE, el proveedor de nube asume el 100% de la gestión, alta disponibilidad y coste del Control Plane; el cliente solo paga por los Worker Nodes donde corren sus Pods.",
        classroom_prompt="¿Qué le ocurre a una aplicación web que ya está corriendo en un Worker Node si el Control Plane se cae temporalmente durante 10 minutos?",
        live_demo="echo 'Control Plane (Master) vs Worker Nodes'"
    )
    slides.append(s7)

    # Slide 8: Componentes del Control Plane (El Cerebro)
    s8 = prs.slides.add_slide(blank)
    add_background(s8)
    add_header(s8, "El Plano de Control (Control Plane) al Detalle", "Módulo 5 • Arquitectura K8s")
    c1 = add_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Componentes del Master")
    add_bullet_list(c1.text_frame, [
        "`kube-apiserver`: El único punto de entrada de todo el clúster. Expone la API REST, autentica a los usuarios y valida los esquemas JSON/YAML.",
        "`etcd`: Base de datos distribuida clave-valor altamente consistente (protocolo Raft). Es la ÚNICA fuente de la verdad donde se almacena todo el estado del clúster.",
        "`kube-scheduler`: Observa los Pods recién creados que no tienen nodo asignado y elige el mejor nodo según recursos libres, afinidad y restricciones.",
        "`kube-controller-manager`: Ejecuta los bucles de control (Node Controller, Deployment Controller, Endpoint Controller) que fuerzan al clúster a alcanzar el estado deseado."
    ])
    add_code_block(s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# ¿Cómo interactúa el administrador con el API Server?",
        "# Utiliza la herramienta oficial de línea de comandos: kubectl",
        "",
        "$ kubectl get nodes",
        "NAME             STATUS   ROLES           AGE   VERSION",
        "k8s-control-01   Ready    control-plane   30d   v1.29.2",
        "k8s-worker-01    Ready    <none>          30d   v1.29.2",
        "k8s-worker-02    Ready    <none>          30d   v1.29.2",
        "",
        "# Todo comando de kubectl es traducido a llamadas",
        "# HTTP REST hacia el kube-apiserver (puerto 6443):",
        "# GET /api/v1/nodes"
    ], "Interacción con el API Server")
    add_speaker_notes(
        s8,
        objective="Detallar los 4 componentes indispensables del Control Plane y su función específica.",
        under_the_hood="Ningún componente habla directamente con etcd excepto kube-apiserver. Todos los demás componentes (scheduler, controllers, kubelet) consultan y envían eventos a través del API server.",
        classroom_prompt="¿Por qué hacer copias de seguridad de etcd equivale a hacer una copia de seguridad de todo el clúster de Kubernetes?",
        live_demo="kubectl version --client 2>/dev/null || echo 'kubectl client check'"
    )
    slides.append(s8)

    # Slide 9: Componentes de los Worker Nodes (El Músculo)
    s9 = prs.slides.add_slide(blank)
    add_background(s9)
    add_header(s9, "Los Nodos de Trabajo (Worker Nodes) al Detalle", "Módulo 5 • Arquitectura K8s")
    c1 = add_card(s9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Componentes en cada Servidor Worker")
    add_bullet_list(c1.text_frame, [
        "`kubelet`: El agente principal del nodo. Se comunica con el API Server, recibe las especificaciones de los Pods (PodSpecs) y se asegura de que sus contenedores estén vivos y sanos.",
        "`kube-proxy`: El gestor de red del nodo. Mantiene las reglas de red e iptables/IPVS en el host para permitir que los Services balanceen tráfico hacia los Pods correctos.",
        "Container Runtime (CRI): El motor de bajo nivel responsable de descargar imágenes y ejecutar los contenedores reales (ej. `containerd` o `CRI-O`).",
        "Pods: La carga de trabajo real (tu aplicación Node.js, Python, PostgreSQL, etc.) ejecutándose dentro de contenedores."
    ])
    add_code_block(s9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# El flujo de ejecución en el Worker:",
        "# 1. kube-scheduler asigna Pod al nodo 'k8s-worker-01'",
        "# 2. kubelet en k8s-worker-01 detecta la asignación",
        "# 3. kubelet habla con containerd vía CRI (gRPC):",
        "#    - PullImage(mi-app:1.0)",
        "#    - CreateContainer()",
        "#    - StartContainer()",
        "# 4. kube-proxy actualiza reglas iptables en el nodo",
        "# 5. kubelet monitoriza periódicamente con liveness probes"
    ], "Flujo Interno del Worker")
    add_speaker_notes(
        s9,
        objective="Explicar cómo el kubelet y kube-proxy coordinan el runtime de contenedores en cada servidor físico.",
        under_the_hood="Desde Kubernetes 1.24 se eliminó 'dockershim'. Kubernetes ya no habla directamente con Docker Engine, sino con containerd o CRI-O mediante la interfaz estándar CRI (Container Runtime Interface).",
        classroom_prompt="¿Qué es el Container Runtime Interface (CRI) y por qué Kubernetes ya no depende exclusivamente de Docker?",
        live_demo="echo 'kubelet + kube-proxy + containerd'"
    )
    slides.append(s9)

    # Slide 10: El Modelo Declarativo y los Bucles de Reconciliación
    s10 = prs.slides.add_slide(blank)
    add_background(s10)
    add_header(s10, "El Bucle de Reconciliación: Magia Declarativa", "Módulo 5 • Conceptos K8s")
    c1 = add_card(s10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Filosofía del Bucle Infinito")
    add_bullet_list(c1.text_frame, [
        "Estado Deseado (Desired State): Lo que tú defines en los archivos `.yaml` (ej. 'Quiero 3 réplicas de la API').",
        "Estado Actual (Current State): Lo que realmente está corriendo en los servidores en este milisegundo.",
        "El Ciclo de Reconciliación: Los controladores de K8s ejecutan continuamente un bucle infinito: `OBSERVAR -> COMPARAR -> ACTUAR`.",
        "Resiliencia Continua: Si un contenedor muere por OOM o un kernel panic, el estado actual pasa a ser 2; el controlador detecta que 2 != 3 y arranca uno nuevo inmediatamente."
    ])
    add_code_block(s10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Pseudocódigo del bucle de reconciliación:",
        "while True:",
        "    desired_state = read_from_etcd()",
        "    current_state = inspect_actual_cluster()",
        "    ",
        "    if current_state != desired_state:",
        "        diff = calculate_difference(desired, current)",
        "        execute_remedy(diff) # Crear o matar Pods",
        "    ",
        "    sleep(poll_interval)",
        "",
        "# ¡Esto ocurre 24/7 sin intervención humana!"
    ], "Lógica de Reconciliación")
    add_speaker_notes(
        s10,
        objective="Hacer comprender el núcleo conceptual de Kubernetes: el bucle infinito de reconciliación declarativa.",
        under_the_hood="Kubernetes utiliza llamadas HTTP Watch sobre la API de etcd. Esto significa que los controladores no hacen polling constante, sino que se suscriben a flujos reactivos de eventos (Event-Driven Architecture).",
        classroom_prompt="Si matamos a mano un Pod con 'kubectl delete pod', ¿por qué aparece uno nuevo con otro nombre al cabo de 2 segundos?",
        live_demo="echo 'Bucle de Reconciliación: Observar -> Comparar -> Actuar'"
    )
    slides.append(s10)

    # Slide 11: Objeto 1: El Pod
    s11 = prs.slides.add_slide(blank)
    add_background(s11)
    add_header(s11, "Primitiva Fundamental 1: El Pod", "Módulo 5 • Objetos K8s")
    c1 = add_card(s11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Unidad Mínima de Cómputo")
    add_bullet_list(c1.text_frame, [
        "Kubernetes no ejecuta contenedores sueltos: La unidad básica de despliegue y escalado siempre es el **Pod**.",
        "Un grupo de 1 o más Contenedores: Habitualmente aloja un único contenedor principal de aplicación, pero puede alojar contenedores auxiliares ('Sidecars').",
        "Red Compartida: Todos los contenedores de un Pod comparten el mismo Network Namespace: tienen la misma IP y se comunican entre sí por `localhost`.",
        "Almacenamiento Compartido: Los volúmenes montados en el Pod son accesibles por todos los contenedores que residen en su interior."
    ])
    add_code_block(s11, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Manifiesto YAML de un Pod simple (pod.yaml)",
        "apiVersion: v1",
        "kind: Pod",
        "metadata:",
        "  name: mi-pod-web",
        "  labels:",
        "    app: frontend",
        "spec:",
        "  containers:",
        "  - name: nginx-server",
        "    image: nginx:alpine",
        "    ports:",
        "    - containerPort: 80",
        "    resources:",
        "      limits:",
        "        memory: \"128Mi\"",
        "        cpu: \"500m\""
    ], "Ejemplo de Pod en YAML")
    add_speaker_notes(
        s11,
        objective="Presentar el concepto de Pod y aclarar por qué K8s añade esta capa de abstracción sobre los contenedores.",
        under_the_hood="K8s crea un contenedor especial invisible llamado 'pause container' (o infra container) para cada Pod. Este contenedor sujeta los namespaces (NET, IPC) mientras los contenedores de usuario se inician y reinician a su alrededor.",
        classroom_prompt="¿En qué escenario tendría sentido colocar dos contenedores distintos dentro del mismo Pod? (Patrón Sidecar: ej. app principal + proxy de logging/mTLS).",
        live_demo="echo 'Pod: La unidad atómica de Kubernetes'"
    )
    slides.append(s11)

    # Slide 12: Objeto 2: ReplicaSet y Deployment
    s12 = prs.slides.add_slide(blank)
    add_background(s12)
    add_header(s12, "Primitiva Fundamental 2: Deployments y Réplicas", "Módulo 5 • Objetos K8s")
    c1 = add_card(s12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Gestión de Ciclo de Vida y Réplicas")
    add_bullet_list(c1.text_frame, [
        "Jamás Desplegar Pods Sueltos en Producción: Si un Pod suelto muere, nadie lo recrea. Siempre se gestionan mediante un **Deployment**.",
        "Controlador de Réplicas (ReplicaSet): Garantiza que siempre exista el número exacto de réplicas saludables especificadas en `spec.replicas`.",
        "Estrategia RollingUpdate: Actualiza los Pods de forma gradual (ej. 25% a la vez) asegurando que siempre hay réplicas sirviendo tráfico sin downtime.",
        "Rollback Instantáneo: Si la versión nueva falla, puedes volver a la versión anterior con un solo comando: `kubectl rollout undo deployment/mi-app`."
    ])
    add_code_block(s12, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Manifiesto YAML de un Deployment (deployment.yaml)",
        "apiVersion: apps/v1",
        "kind: Deployment",
        "metadata:",
        "  name: api-pedidos",
        "spec:",
        "  replicas: 3",
        "  selector:",
        "    matchLabels:",
        "      app: pedidos",
        "  template:",
        "    metadata:",
        "      labels:",
        "        app: pedidos",
        "    spec:",
        "      containers:",
        "      - name: api",
        "        image: mi-repo/pedidos:2.0",
        "        ports:",
        "        - containerPort: 3000"
    ], "Ejemplo de Deployment")
    add_speaker_notes(
        s12,
        objective="Enseñar a los alumnos por qué en producción siempre se crean Deployments y cómo gestionan las réplicas y rollouts.",
        under_the_hood="Un Deployment no crea Pods directamente: crea y gestiona ReplicaSets. Al hacer un update de imagen, crea un nuevo ReplicaSet y va incrementando sus réplicas a medida que reduce las del ReplicaSet anterior.",
        classroom_prompt="¿Qué comando de kubectl usarías para escalar las réplicas de 3 a 10 en tiempo de ejecución? (kubectl scale deployment api-pedidos --replicas=10).",
        live_demo="echo 'kubectl apply -f deployment.yaml'"
    )
    slides.append(s12)

    # Slide 13: Objeto 3: Services (Descubrimiento y Balanceo)
    s13 = prs.slides.add_slide(blank)
    add_background(s13)
    add_header(s13, "Primitiva Fundamental 3: Services y Balanceo L4", "Módulo 5 • Objetos K8s")
    c1 = add_card(s13, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Abstracción de Red Estable")
    add_bullet_list(c1.text_frame, [
        "El Problema: Los Pods son efímeros y sus IPs cambian constantemente cada vez que se reinician o escalan.",
        "La Solución (Service): Proporciona una IP virtual fija (ClusterIP) y un nombre DNS interno estable (`api-pedidos.default.svc.cluster.local`).",
        "Mecanismo de Selección por Labels: El Service utiliza `spec.selector` para encontrar dinámicamente qué Pods coinciden con la etiqueta.",
        "Tipos de Service: `ClusterIP` (solo interno), `NodePort` (abre puerto 30000-32767 en todos los nodos), `LoadBalancer` (provisiona un balanceador en AWS/Azure/GCP)."
    ])
    add_code_block(s13, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Manifiesto YAML de un Service (service.yaml)",
        "apiVersion: v1",
        "kind: Service",
        "metadata:",
        "  name: servicio-pedidos",
        "spec:",
        "  type: ClusterIP",
        "  selector:",
        "    app: pedidos    # Conecta con los Pods etiquetados",
        "  ports:",
        "  - port: 80         # Puerto del servicio",
        "    targetPort: 3000 # Puerto del contenedor",
        "",
        "# Cualquier Pod del clúster puede consumir la API",
        "# haciendo una petición HTTP simple a:",
        "# http://servicio-pedidos:80"
    ], "Ejemplo de Service en YAML")
    add_speaker_notes(
        s13,
        objective="Hacer entender que los Services resuelven el reto del descubrimiento de servicios y balanceo interno en Kubernetes.",
        under_the_hood="Los Services no son procesos reales; son reglas de iptables o IPVS gestionadas por kube-proxy que interceptan paquetes dirigidos a la ClusterIP y los reenvían a las IPs reales de los Pods (Endpoints).",
        classroom_prompt="Si tienes 5 réplicas de un Pod detrás de un Service, ¿cómo sabe el Service a qué Pods enviar tráfico si uno de ellos está caído? (Sondas ReadinessProbe).",
        live_demo="echo 'kubectl get svc'"
    )
    slides.append(s13)

    # Slide 14: ConfigMaps, Secrets y Persistencia en K8s
    s14 = prs.slides.add_slide(blank)
    add_background(s14)
    add_header(s14, "Configuración y Persistencia: ConfigMaps, Secrets y PVCs", "Módulo 5 • Objetos K8s")
    c1 = add_card(s14, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Configuración Externa")
    add_bullet_list(c1.text_frame, [
        "ConfigMaps: Almacenan pares clave-valor de configuración no sensible desacoplados de la imagen del contenedor.",
        "Secrets: Almacenan contraseñas, certificados y tokens codificados en Base64 (o cifrados con KMS/Vault).",
        "Inyección Flexible: Ambos objetos se pueden inyectar en los Pods como variables de entorno (`env`) o montados como archivos en carpetas de solo lectura.",
        "Inmutabilidad del Código: La misma imagen de contenedor se despliega en Desarrollo, Staging y Producción cambiando únicamente el ConfigMap."
    ])
    c2 = add_card(s14, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Persistencia: PVC y StorageClass")
    add_bullet_list(c2.text_frame, [
        "PersistentVolumeClaim (PVC): Petición formal de almacenamiento que realiza el Pod (ej. 'Necesito 50GB en modo ReadWriteOnce').",
        "PersistentVolume (PV): El disco físico real aprovisionado en la nube (AWS EBS, Azure Managed Disk, Ceph, NFS).",
        "StorageClass: Mecanismo de aprovisionamiento dinámico: si el Pod pide un PVC, K8s contacta con la API cloud y crea el disco al vuelo.",
        "StatefulSets: El controlador especializado para cargas de trabajo con estado persistente (bases de datos con réplicas primario/réplica ordenadas)."
    ])
    add_speaker_notes(
        s14,
        objective="Presentar cómo se gestiona la configuración externa (ConfigMaps/Secrets) y el almacenamiento persistente (PVC/PV) en Kubernetes.",
        under_the_hood="Por defecto en Kubernetes vainilla, los Secrets en etcd están en base64 sin cifrar a nivel de disco; en producción es obligatorio activar 'Encryption at Rest' con KMS en el kube-apiserver.",
        classroom_prompt="¿Por qué nunca debemos compilar contraseñas o URLs de bases de datos dentro de la imagen de Docker?",
        live_demo="echo 'ConfigMaps, Secrets y PersistentVolumeClaims'"
    )
    slides.append(s14)

    # Slide 15: De Docker a Kubernetes: La Transición
    s15 = prs.slides.add_slide(blank)
    add_background(s15)
    add_header(s15, "De Docker a Kubernetes: Diccionario de Conceptos", "Módulo 5 • Transición")
    c1 = add_card(s15, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Tabla de Equivalencias Conceptuales")
    add_bullet_list(c1.text_frame, [
        "`docker run -d ...`  -->  Kubernetes **Pod** (ejecución básica) o **Deployment** (ejecución gestionada).",
        "`docker build -t mi-app .`  -->  El proceso de build sigue siendo **100% idéntico** (las imágenes OCI se consumen directamente en K8s).",
        "`-p 8080:80` (Port mapping)  -->  Kubernetes **Service** (ClusterIP, NodePort o LoadBalancer con selector de etiquetas).",
        "`docker network create`  -->  **CNI Plugin** (red plana donde todos los Pods se ven entre sí por IP sin NAT) + **NetworkPolicies**.",
        "`-v mi_vol:/datos` (Named Volume)  -->  **PersistentVolumeClaim (PVC)** respaldado por un StorageClass del proveedor.",
        "`docker compose up`  -->  Colección de manifiestos YAML aplicados con `kubectl apply -f ./manifests/` o empaquetados con **Helm Charts**."
    ], space_after=Pt(12))
    add_speaker_notes(
        s15,
        objective="Hacer que los alumnos sientan que todo lo aprendido en los Módulos 1, 2, 3 y 4 se reutiliza y encaja perfectamente en Kubernetes.",
        under_the_hood="Herramientas como 'Kompose' permiten convertir automáticamente archivos docker-compose.yml en manifiestos de Kubernetes YAML.",
        classroom_prompt="¿Cuál de las equivalencias de la tabla os parece más intuitiva?",
        live_demo="echo 'Tabla de equivalencias Docker <-> Kubernetes'"
    )
    slides.append(s15)

    # Slide 16: Entornos Locales para Aprender K8s
    s16 = prs.slides.add_slide(blank)
    add_background(s16)
    add_header(s16, "Entornos Locales para Aprender Kubernetes", "Módulo 5 • Entornos")
    c1 = add_card(s16, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Opciones para Practicar en tu Portátil")
    add_bullet_list(c1.text_frame, [
        "Docker Desktop Kubernetes: La opción más fácil si usas Docker Desktop. Basta marcar una casilla en 'Settings > Kubernetes > Enable' y tienes un clúster de un nodo.",
        "Kind (Kubernetes in Docker): Ejecuta nodos de Kubernetes como contenedores Docker en tu host. Ultrarrápido, excelente para pruebas de CI/CD.",
        "Minikube: La herramienta histórica oficial de la comunidad K8s. Soporta múltiples hipervisores, drivers de Docker y addons (ingress, dashboard, métricas).",
        "K3s (de Rancher/SUSE): Distribución certificada ultraligera (<100MB) compilada en un solo binario, ideal para Edge, IoT y portátiles con recursos modestos."
    ])
    add_code_block(s16, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Arrancar un clúster con Kind en 30 segundos:",
        "$ kind create cluster --name curso-docker",
        "Creating cluster \"curso-docker\" ...",
        " ✓ Ensuring node image (kindest/node:v1.29.2)",
        " ✓ Preparing nodes",
        " ✓ Writing configuration",
        " ✓ Starting control-plane",
        "Set kubectl context to \"kind-curso-docker\"",
        "",
        "# Verificar conexión:",
        "$ kubectl cluster-info",
        "Kubernetes control plane is running at https://127.0.0.1:...",
        "",
        "# Destruir el clúster de prueba:",
        "$ kind delete cluster --name curso-docker"
    ], "Clúster con Kind")
    add_speaker_notes(
        s16,
        objective="Facilitar a los alumnos herramientas para que puedan continuar practicando Kubernetes en sus propios equipos sin coste cloud.",
        under_the_hood="Kind levanta un contenedor Docker con la imagen kindest/node que contiene systemd, containerd, kubelet y todos los binarios de K8s preinstalados.",
        classroom_prompt="¿Quién tiene Docker Desktop instalado en su máquina y ha probado a activar la casilla de Kubernetes?",
        live_demo="kind version 2>/dev/null || minikube version 2>/dev/null || echo 'Entornos locales para K8s'"
    )
    slides.append(s16)

    # Slide 17: Laboratorio 5: Despliegue en Kubernetes
    s17 = prs.slides.add_slide(blank)
    add_background(s17)
    add_header(s17, "Laboratorio 5: Despliegue de App en Kubernetes", "Día 4 • Taller Práctico")
    card_lab = add_card(s17, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Objetivos y Pasos del Ejercicio Práctico")
    add_bullet_list(card_lab.text_frame, [
        "Paso 1: Verificar el acceso al clúster local (`kubectl get nodes`, `kubectl cluster-info`).",
        "Paso 2: Redactar el manifiesto `deployment.yaml` para una aplicación web con 3 réplicas y límites de recursos de memoria y CPU.",
        "Paso 3: Aplicar el manifiesto declarativamente (`kubectl apply -f deployment.yaml`) y observar la creación concurrente de los Pods.",
        "Paso 4: Redactar y aplicar el manifiesto `service.yaml` exponiendo el puerto del servicio mediante `NodePort` o `ClusterIP`.",
        "Paso 5: Probar la conectividad y el balanceo de carga automático entre las 3 réplicas mediante peticiones repetidas.",
        "Paso 6: Simular la caída de un Pod con `kubectl delete pod <nombre>` y comprobar cómo el bucle de reconciliación levanta uno nuevo en segundos.",
        "Paso 7: Realizar un Rolling Update modificando la versión de la imagen en el Deployment y observar el proceso de actualización sin corte de servicio."
    ], space_after=Pt(10))
    add_speaker_notes(
        s17,
        objective="Taller integrador de 75-90 minutos donde los alumnos consolidan todo el viaje: desde el Dockerfile hasta el despliegue orquestado en K8s.",
        under_the_hood="Acompañar a los alumnos en el uso de 'kubectl get pods -w' (watch mode) para que vean en tiempo real la transición de estados de los contenedores durante el Rolling Update.",
        classroom_prompt="¿Habéis visto cómo al borrar el Pod, el ReplicaSet creó otro Pod sustituto inmediatamente?",
        live_demo="kubectl get pods 2>/dev/null || echo 'Demo K8s'"
    )
    slides.append(s17)

    # Slide 18: Conclusión del Curso y Próximos Pasos
    s18 = add_title_slide(
        prs,
        title="¡ENHORABUENA! CURSO COMPLETADO",
        subtitle="20 Horas Lectivas • Docker Fundamentals\nHas dominado: Motor OCI, Seguridad de Kernel, Redes, Persistencia, Cloud y Kubernetes.\n¡El camino hacia Cloud Native continúa!",
        module_tag="CIERRE DEL CURSO • CERTIFICACIÓN",
        notes_data={
            "objective": "Agradecer la participación y esfuerzo de los alumnos, felicitarles por completar las 20 horas formativas y proporcionar recursos de especialización.",
            "under_the_hood": "Recomendar los siguientes pasos en su carrera profesional: certificación CKA (Certified Kubernetes Administrator), CKAD (Certified Kubernetes Application Developer) y buenas prácticas de seguridad con Docker Scout / Trivy.",
            "classroom_prompt": "¿Cuáles son las 3 habilidades que os lleváis de este curso para aplicar inmediatamente en vuestro trabajo diario?",
            "live_demo": "echo 'Fin del curso Docker Fundamentals 20H'"
        }
    )
    slides.append(s18)

    return slides
