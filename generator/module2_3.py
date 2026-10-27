"""
module2_3.py - Módulos 2 y 3 / Día 2: Redes en Docker y Persistencia / Volúmenes.
Genera 24 diapositivas técnicas con esquemas visuales y notas completas.
"""

from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE
from generator.theme import (
    add_title_slide, add_header, add_card, add_bullet_list, add_code_block,
    add_speaker_notes, add_background, get_blank_layout,
    COLOR_PRIMARY_DARK, COLOR_PRIMARY_BLUE, COLOR_ACCENT_CYAN,
    COLOR_BG_LIGHT, COLOR_CARD_BG, COLOR_CARD_BG_ALT, COLOR_CARD_BORDER,
    COLOR_ALERT_BG, COLOR_ALERT_BORDER, COLOR_ALERT_TEXT,
    COLOR_SUCCESS_BG, COLOR_SUCCESS_BORDER
)


def build_module2_3(prs):
    """Construye las 24 diapositivas del Día 2 (Módulo 2 Redes + Módulo 3 Almacenamiento)."""
    slides = []
    blank = get_blank_layout(prs)

    # Slide 1: Portada Día 2
    s1 = add_title_slide(
        prs,
        title="REDES Y PERSISTENCIA",
        subtitle="Módulo 2: Redes en Docker • Módulo 3: Volúmenes y Persistencia\nJornada 2 de 4 (5 Horas Lectivas)",
        module_tag="DÍA 2 • COMUNICACIÓN Y ALMACENAMIENTO",
        notes_data={
            "objective": "Presentar los dos pilares de la jornada: cómo se comunican los contenedores (redes) y cómo persisten sus datos (volúmenes).",
            "under_the_hood": "Ambos subsistemas se apoyan directamente en capacidades del kernel de Linux: NET namespaces e iptables para redes; OverlayFS/VFS y puntos de montaje para almacenamiento.",
            "classroom_prompt": "Si los contenedores son efímeros por naturaleza, ¿cómo resolvemos el despliegue de una base de datos PostgreSQL o Redis sin perder información?",
            "live_demo": "docker network ls && docker volume ls"
        }
    )
    slides.append(s1)

    # Slide 2: Cómo funciona la Red en Linux y Docker
    s2 = prs.slides.add_slide(blank)
    add_background(s2)
    add_header(s2, "Anatomía de la Red en Docker: veth pairs y Linux Bridge", "Módulo 2 • Redes")
    c1 = add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "El Puente Virtual y los Pares Veth")
    add_bullet_list(c1.text_frame, [
        "Aislamiento de Red: Cada contenedor tiene su propia pila de red (su propia loopback `127.0.0.1`, interfaces y tabla de rutas).",
        "Pares de Interfaces Virtuales (`veth`): Docker crea un par de interfaces conectadas entre sí como si fueran un cable Ethernet virtual.",
        "Extremo A (Contenedor): Reside dentro del Network Namespace del contenedor y se renombra a `eth0`.",
        "Extremo B (Host): Reside en el host (ej. `veth4a91...`) y se conecta al conmutador virtual bridge (`docker0`).",
        "Puente `docker0`: Actúa como un switch Ethernet de nivel 2 (L2) que reenvía tramas entre contenedores del mismo host."
    ])
    add_code_block(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Comprobar el switch virtual docker0 en el host",
        "$ ip addr show docker0",
        "inet 172.17.0.1/16 scope global docker0",
        "",
        "# Arrancar un contenedor e inspeccionar su veth",
        "$ docker run -d --name test-net nginx:alpine",
        "",
        "# Listar los enlaces veth conectados al bridge",
        "$ ip link show type veth",
        "veth7a21@if8: <BROADCAST,MULTICAST,UP,LOWER_UP> ...",
        "",
        "# Ver la IP privada asignada al contenedor",
        "$ docker inspect -f '{{.NetworkSettings.IPAddress}}' test-net",
        "172.17.0.2"
    ], "Inspección de Interfaces de Red")
    add_speaker_notes(
        s2,
        objective="Hacer entender visualmente cómo se conectan los contenedores al host usando pares veth como cables virtuales.",
        under_the_hood="La llamada ip link add veth0 type veth peer name veth1 crea dos interfaces unidas. Luego ip link set veth1 netns <PID> mueve una de ellas al namespace del contenedor.",
        classroom_prompt="¿Puede un contenedor ver el tráfico de red de otro contenedor en el mismo host si no están en la misma subred?",
        live_demo="docker network inspect bridge | grep -A 5 Subnet"
    )
    slides.append(s2)

    # Slide 3: El Bridge por Defecto vs Limitaciones
    s3 = prs.slides.add_slide(blank)
    add_background(s3)
    add_header(s3, "La Red Bridge por Defecto y sus Limitaciones", "Módulo 2 • Redes")
    c1 = add_card(s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Características del Bridge por Defecto")
    add_bullet_list(c1.text_frame, [
        "Comportamiento Out-of-the-Box: Si no se especifica `--network`, los contenedores se conectan a `bridge`.",
        "Subred Típica: Habitualmente `172.17.0.0/16`. El host toma la IP `172.17.0.1` como gateway predeterminado.",
        "Acceso a Internet Saliente: Docker configura reglas `iptables MASQUERADE` (NAT) para que los contenedores puedan salir a Internet a través de la tarjeta física del host.",
        "Asignación DHCP Interna: Docker gestiona internamente la asignación secuencial de IPs dentro del rango."
    ])
    c2 = add_card(s3, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "La Gran Limitación: Sin Resolución DNS", bg_color=COLOR_ALERT_BG, border_color=COLOR_ALERT_BORDER)
    add_bullet_list(c2.text_frame, [
        "¡No hay DNS Integrado!: En la red bridge por defecto, dos contenedores NO pueden resolverse por su nombre (ej. `ping backend` fallará).",
        "Dependencia Frágil de IPs: Si un contenedor se reinicia y cambia de `172.17.0.2` a `172.17.0.3`, la aplicación se rompe.",
        "Legacy Links (`--link`): El mecanismo antiguo de inyectar variables en `/etc/hosts` está formalmente marcado como DEPRECATED.",
        "Solución Obligatoria: Crear redes personalizadas (*User-Defined Bridges*)."
    ])
    add_speaker_notes(
        s3,
        objective="Advertir sobre la trampa común de usar la red bridge por defecto y no poder comunicar contenedores por nombre.",
        under_the_hood="En la red bridge por defecto, Docker inyecta los servidores DNS del host en /etc/resolv.conf. En cambio, en redes personalizadas inyecta la IP 127.0.0.11, que es el servidor DNS embedded de Docker.",
        classroom_prompt="¿Por qué es una pésima práctica en producción conectar una base de datos y una API en la red bridge por defecto usando IPs fijas?",
        live_demo="docker run -d --name c1 alpine sleep 3600 && docker run --rm alpine ping -c 1 c1 || echo 'FALLO DNS ESPERADO'"
    )
    slides.append(s3)

    # Slide 4: Redes Bridge Personalizadas (User-Defined)
    s4 = prs.slides.add_slide(blank)
    add_background(s4)
    add_header(s4, "Redes Personalizadas: Resolución DNS Automática", "Módulo 2 • Redes")
    c1 = add_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Beneficios de User-Defined Bridges")
    add_bullet_list(c1.text_frame, [
        "Servidor DNS Embebido (`127.0.0.11`): Docker levanta un daemon DNS interno que resuelve automáticamente el nombre del contenedor a su IP actual.",
        "Aislamiento por Diseño: Contenedores en redes distintas no pueden comunicarse entre sí, incrementando la seguridad.",
        "Conexión en Caliente: Posibilidad de conectar o desconectar contenedores de una red en tiempo de ejecución sin reiniciarlos (`docker network connect`).",
        "Alias de Red: Posibilidad de asignar nombres secundarios a un contenedor (ej. `--network-alias db-principal`)."
    ])
    add_code_block(s4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# 1. Crear red personalizada para la aplicación",
        "$ docker network create red-interna",
        "",
        "# 2. Arrancar base de datos en dicha red",
        "$ docker run -d --name mi-postgres \\",
        "    --network red-interna \\",
        "    -e POSTGRES_PASSWORD=secreto postgres:alpine",
        "",
        "# 3. Arrancar API en la misma red y resolver por nombre",
        "$ docker run --rm --network red-interna alpine \\",
        "    ping -c 2 mi-postgres",
        "PING mi-postgres (172.19.0.2): 56 data bytes",
        "64 bytes from 172.19.0.2: seq=0 ttl=64 time=0.082 ms",
        "",
        "# ¡Resolución DNS automática funcionando!"
    ], "Ejemplo de DNS Automático")
    add_speaker_notes(
        s4,
        objective="Demostrar la resolución de nombres DNS automática en redes personalizadas como la forma estándar de interconectar microservicios.",
        under_the_hood="Docker intercepta las consultas DNS al socket 127.0.0.11 en el puerto 53 UDP. Si la consulta es por un nombre de contenedor de la red, responde inmediatamente. Si es externa (ej. google.com), la reenvía al upstream DNS del host.",
        classroom_prompt="¿Qué sucede si conectamos un contenedor simultáneamente a dos redes personalizadas distintas?",
        live_demo="docker network create demo-net && docker run -d --name srv --network demo-net nginx:alpine && docker run --rm --network demo-net alpine ping -c 1 srv && docker rm -f srv && docker network rm demo-net"
    )
    slides.append(s4)

    # Slide 5: Publicación y Mapeo de Puertos
    s5 = prs.slides.add_slide(blank)
    add_background(s5)
    add_header(s5, "Mapeo de Puertos: Abriendo el Contenedor al Mundo", "Módulo 2 • Redes")
    c1 = add_card(s5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Diferencia entre -p y -P")
    add_bullet_list(c1.text_frame, [
        "Mapeo Explícito (`-p [host_port]:[container_port]`): Vincula un puerto específico del host a un puerto del contenedor (ej. `-p 80:80` o `-p 127.0.0.1:8080:80`).",
        "Mapeo Efímero (`-P` mayúscula): Mapea todos los puertos definidos en las directivas `EXPOSE` del Dockerfile a puertos aleatorios del host (rango 32768-60999).",
        "Seguridad: Si omites la IP del host (`-p 8080:80`), Docker escuchará en `0.0.0.0` (todas las interfaces, incluyendo Internet público). Para entornos de desarrollo local, fijar `-p 127.0.0.1:8080:80`.",
        "Mapeo de Protocolos: Por defecto mapea TCP. Para UDP se debe especificar explícitamente `-p 53:53/udp`."
    ])
    add_code_block(s5, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# ¿Cómo implementa Docker el mapeo en Linux?",
        "# Inserta reglas en la tabla NAT de iptables:",
        "$ iptables -t nat -L DOCKER -n -v",
        "",
        "Chain DOCKER (2 references)",
        "pkts bytes target  prot opt in  out  source   destination",
        "  15   900 DNAT    tcp  --  *   *    0.0.0.0  0.0.0.0 \\",
        "  tcp dpt:8080 to:172.18.0.2:80",
        "",
        "# Demonio docker-proxy:",
        "# Para tráfico loopback, Docker utiliza un proceso",
        "# llamado docker-proxy para reenviar conexiones TCP."
    ], "Mecanismo Interno: iptables DNAT")
    add_speaker_notes(
        s5,
        objective="Explicar con precisión cómo el tráfico llega desde el exterior al contenedor a través de iptables DNAT y docker-proxy.",
        under_the_hood="La regla DNAT (Destination NAT) en la cadena PREROUTING altera la cabecera IP del paquete entrante: cambia la IP de destino del host por la IP interna del contenedor (172.18.0.2).",
        classroom_prompt="Si tienes UFW o un firewall activo en Ubuntu, ¿sabías que Docker se salta las reglas de UFW por defecto al modificar iptables antes?",
        live_demo="docker run -d --name web-p -p 8080:80 nginx:alpine && docker port web-p && docker rm -f web-p"
    )
    slides.append(s5)

    # Slide 6: Modo Host
    s6 = prs.slides.add_slide(blank)
    add_background(s6)
    add_header(s6, "Modo de Red Host: Rendimiento Máximo sin Aislamiento", "Módulo 2 • Redes")
    c1 = add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Características de `--network host`")
    add_bullet_list(c1.text_frame, [
        "Sin Network Namespace: El contenedor comparte directamente la pila de red del sistema operativo anfitrión.",
        "Cero Penalización de NAT: No hay `veth`, no hay puente `docker0` ni reglas de `iptables`. Máximo throughput y menor latencia posible.",
        "Mapeo Innecesario: Los flags `-p` y `-P` se ignoran. Si la aplicación escucha en el puerto 80, estará escuchando directamente en el puerto 80 del host.",
        "Limitación Crítica en Docker Desktop: En Windows y macOS, `--network host` se conecta a la máquina virtual oculta de Linux, no al Windows/macOS real."
    ])
    c2 = add_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Riesgos y Casos de Uso", bg_color=COLOR_ALERT_BG, border_color=COLOR_ALERT_BORDER)
    add_bullet_list(c2.text_frame, [
        "Colisión de Puertos: No es posible ejecutar dos contenedores en modo host escuchando en el mismo puerto (el segundo fallará con `Address already in use`).",
        "Pérdida de Aislamiento: El contenedor tiene acceso a todas las interfaces locales, incluyendo `localhost` del host y servicios sensibles.",
        "Casos de Uso Válidos: Sistemas de monitorización de red (Prometheus node-exporter), proxies de altísima concurrencia, transmisiones multimedia RTP/WebRTC en tiempo real.",
        "Recomendación General: Evitar en producción ordinaria salvo necesidad estricta de rendimiento extremo."
    ])
    add_speaker_notes(
        s6,
        objective="Evaluar el trade-off de rendimiento vs seguridad del modo host.",
        under_the_hood="Al omitir CLONE_NEWNET en clone(), el proceso del contenedor ve las mismas interfaces que eth0 del host.",
        classroom_prompt="Si arranco dos contenedores Nginx con '--network host' en la misma máquina, ¿qué ocurrirá con el segundo?",
        live_demo="docker run --rm --network host alpine ip addr | head -n 8"
    )
    slides.append(s6)

    # Slide 7: Modo None
    s7 = prs.slides.add_slide(blank)
    add_background(s7)
    add_header(s7, "Modo de Red None: Aislamiento Total Offline", "Módulo 2 • Redes")
    c1 = add_card(s7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Aislamiento Estricto (`--network none`)")
    add_bullet_list(c1.text_frame, [
        "Desconexión Total: El contenedor dispone de su propio Network Namespace, pero únicamente se configura la interfaz de bucle invertido (`lo` / `127.0.0.1`).",
        "Sin Puertos Externos: Imposible enviar o recibir paquetes fuera del contenedor; sin acceso a Internet ni a otros contenedores.",
        "Seguridad Máxima contra Filtraciones: Si el código es malicioso o vulnerable, no puede descargar payloads externos ni exfiltrar secretos por red.",
        "Configuración Manual Avanzada: Permite a herramientas externas de orquestación inyectar interfaces de red personalizadas a posteriori."
    ])
    c2 = add_card(s7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Casos de Uso Típicos")
    add_bullet_list(c2.text_frame, [
        "Procesamiento Batch Offline: Procesamiento de archivos confidenciales, transcripciones médicas o cálculo numérico sin salida a Internet.",
        "Generación y Firma Criptográfica: Módulos HSM de software, generación de claves PGP o carteras frías (air-gapped containers).",
        "Ejecución de Código No Confiable: Sandboxing de scripts subidos por usuarios finales sin riesgo de ataques hacia la infraestructura interna.",
        "Inspección Forense: Análisis de imágenes sospechosas sin permitir comunicación con centros de comando y control (C2)."
    ])
    add_speaker_notes(
        s7,
        objective="Presentar el modo none como herramienta de máxima contención para procesamiento seguro y air-gapped.",
        under_the_hood="El contenedor tiene un netns asignado pero runc no añade ningún veth ni ruta de gateway por defecto en la tabla de enrutamiento.",
        classroom_prompt="¿Cómo harías llegar los archivos a procesar a un contenedor con '--network none' si no tiene red? (Volúmenes)",
        live_demo="docker run --rm --network none alpine ifconfig"
    )
    slides.append(s7)

    # Slide 8: Redes Overlay (Multi-Host)
    s8 = prs.slides.add_slide(blank)
    add_background(s8)
    add_header(s8, "Redes Overlay: Conectando Contenedores en Varios Hosts", "Módulo 2 • Redes")
    c1 = add_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Superposición sobre Redes Físicas (VXLAN)")
    add_bullet_list(c1.text_frame, [
        "El Reto Multi-Host: La red bridge solo funciona en un único servidor. ¿Cómo comunicamos contenedores en servidores físicos diferentes?",
        "Encapsulación VXLAN: La red overlay encapsula las tramas Ethernet L2 de los contenedores dentro de paquetes UDP estándar (puerto 4789).",
        "Criptografía Opcional: Soporte nativo para cifrado IPsec en vuelo (`--opt encrypted`), protegiendo el tráfico entre nodos en la nube pública.",
        "Descubrimiento Distribuido: Docker propaga la tabla de enrutamiento y nombres de contenedores entre todos los nodos del clúster."
    ])
    c2 = add_card(s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Ámbitos de Aplicación")
    add_bullet_list(c2.text_frame, [
        "Docker Swarm: El driver `overlay` es el controlador nativo y estándar para desplegar servicios multi-nodo en Swarm.",
        "Kubernetes (K8s): Utiliza plugins CNI basados en tecnologías de overlay similares (Calico, Flannel VXLAN, Cilium con eBPF).",
        "Independencia de la Infraestructura: Los contenedores se comunican en una subred privada virtual (ej. `10.0.0.0/24`) con total abstracción de los switches físicos.",
        "Plan de Control Distribuido: Utiliza protocolos gossip y consensus (Raft) para sincronizar IPs y estado entre los servidores."
    ])
    add_speaker_notes(
        s8,
        objective="Introducir el concepto de redes overlay y VXLAN para preparar a los alumnos para la orquestación del Módulo 5.",
        under_the_hood="VXLAN (Virtual Extensible LAN, RFC 7348) añade una cabecera de 8 bytes con un VNI (VXLAN Network Identifier) de 24 bits, permitiendo hasta 16 millones de redes virtuales aisladas sobre una misma red física.",
        classroom_prompt="¿Qué sobrecarga de bytes añade la cabecera VXLAN en cada paquete y por qué afecta al MTU de la red?",
        live_demo="docker network create -d overlay --attachable demo-overlay 2>/dev/null || echo 'Overlay requiere Swarm inicializado (docker swarm init)'"
    )
    slides.append(s8)

    # Slide 9: Macvlan y Complementos de Red
    s9 = prs.slides.add_slide(blank)
    add_background(s9)
    add_header(s9, "Macvlan y Complementos de Red (Network Plugins)", "Módulo 2 • Redes")
    c1 = add_card(s9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Driver Macvlan: IP en la LAN Física")
    add_bullet_list(c1.text_frame, [
        "Presencia Física Directa: Cada contenedor obtiene una dirección MAC única e independiente y una IP asignada directamente por el router físico de la empresa.",
        "Sin NAT ni Port Mapping: El contenedor aparece como un servidor físico más conectado al switch de la red de la oficina o del centro de datos.",
        "Migración de Aplicaciones Legacy: Ideal para software antiguo que requiere comunicarse en subredes L2 específicas o que rechaza NAT.",
        "Requisito Modo Promiscuo: La tarjeta física del host debe soportar modo promiscuo para aceptar múltiples direcciones MAC."
    ])
    c2 = add_card(s9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Complementos de Red y CNI")
    add_bullet_list(c2.text_frame, [
        "Ecosistema Extensible: Docker permite instalar plugins de terceros vía `docker plugin install`.",
        "Drivers CNI (Container Network Interface): Estándar agnóstico de la CNCF para configurar interfaces de red en contenedores.",
        "Calico / Cilium: Plugins avanzados que incorporan políticas de seguridad por software (Network Policies), cifrado WireGuard y enrutamiento BGP.",
        "Weave Net / Flannel: Redes overlay de configuración rápida para entornos distribuidos."
    ])
    add_speaker_notes(
        s9,
        objective="Explicar cuándo utilizar Macvlan (redes corporativas legacy) y cómo los plugins CNI amplían las capacidades de red.",
        under_the_hood="En Macvlan, el kernel crea subinterfaces virtuales asociadas a la interfaz física eth0. Por seguridad del kernel Linux, el host no puede comunicarse con los contenedores Macvlan por su interfaz física salvo que se cree un macvlan dummy en el propio host.",
        classroom_prompt="¿Por qué en entornos cloud como AWS o Azure Macvlan suele estar bloqueado por el proveedor? (Prevención de spoofing de MACs)",
        live_demo="docker network ls"
    )
    slides.append(s9)

    # Slide 10: Laboratorio 2: Redes Personalizadas y DNS
    s10 = prs.slides.add_slide(blank)
    add_background(s10)
    add_header(s10, "Laboratorio 2: Redes Personalizadas y DNS Embebido", "Día 2 • Práctica")
    card_lab = add_card(s10, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Objetivos y Pasos del Ejercicio Práctico")
    add_bullet_list(card_lab.text_frame, [
        "Paso 1: Inspeccionar la red bridge por defecto (`docker network inspect bridge`) y comprobar que no resuelve nombres.",
        "Paso 2: Crear una red personalizada llamada `mi-red-app` (`docker network create --driver bridge mi-red-app`).",
        "Paso 3: Levantar un contenedor de base de datos Redis en `mi-red-app` (`docker run -d --name cache-redis --network mi-red-app redis:alpine`).",
        "Paso 4: Levantar un contenedor cliente en la misma red y comprobar la resolución de nombres DNS (`docker run --rm --network mi-red-app alpine ping -c 2 cache-redis`).",
        "Paso 5: Crear una segunda red `red-aislada` y verificar que los contenedores no pueden comunicarse entre redes distintas.",
        "Paso 6: Conectar en caliente un contenedor a dos redes mediante `docker network connect` y verificar la doble conectividad.",
        "Paso 7: Limpieza de redes y contenedores (`docker rm -f`, `docker network rm`)."
    ], space_after=Pt(10))
    add_speaker_notes(
        s10,
        objective="Garantizar que todos los alumnos dominen la creación de redes y la resolución DNS entre contenedores antes de pasar a almacenamiento.",
        under_the_hood="Insistir a los alumnos en que nunca dejen contenedores en la red por defecto bridge para proyectos de más de un servicio.",
        classroom_prompt="¿Alguien puede explicar por qué el ping funcionó directamente con el nombre 'cache-redis' sin configurar /etc/hosts?",
        live_demo="docker network create lab2-net && docker run -d --name r1 --network lab2-net redis:alpine && docker run --rm --network lab2-net alpine ping -c 1 r1 && docker rm -f r1 && docker network rm lab2-net"
    )
    slides.append(s10)

    # Slide 11: Separador Módulo 3: Almacenamiento y Persistencia
    s11 = add_title_slide(
        prs,
        title="MÓDULO 3: PERSISTENCIA Y VOLÚMENES",
        subtitle="Mecanismos de Persistencia: Storage Drivers (Overlay2), Bind Mounts, Named Volumes y Tmpfs\nSegunda mitad del Día 2 (2.5 Horas)",
        module_tag="MÓDULO 3 • ALMACENAMIENTO",
        notes_data={
            "objective": "Introducir la necesidad de persistencia de datos y desmontar el mito de que 'Docker no sirve para bases de datos'.",
            "under_the_hood": "Los datos que residen en la capa de contenedor se pierden al destruirlo. Los volúmenes montan sistemas de archivos que evitan el storage driver, ofreciendo rendimiento nativo.",
            "classroom_prompt": "¿Qué pasa con los clientes registrados en MySQL si actualizamos la versión de la imagen y borramos el contenedor viejo?",
            "live_demo": "docker volume ls"
        }
    )
    slides.append(s11)

    # Slide 12: El Reto de la Persistencia y Storage Drivers
    s12 = prs.slides.add_slide(blank)
    add_background(s12)
    add_header(s12, "El Reto de los Datos: Efímero vs Persistente", "Módulo 3 • Almacenamiento")
    c1 = add_card(s12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Naturaleza Efímera del Contenedor")
    add_bullet_list(c1.text_frame, [
        "Contenedores Desechables: Los contenedores deben poder pararse, destruirse y recrearse sin temor a perder información valiosa.",
        "La Capa R/W no es para Datos Críticos: La capa de escritura del contenedor añade sobrecarga de rendimiento por el mecanismo Copy-on-Write.",
        "Riesgo de Pérdida Accidental: Ejecutar `docker rm -f` elimina la capa R/W para siempre sin opción a recuperación.",
        "Dificultad de Backup: Es complejo extraer datos masivos desde las capas internas de un storage driver en producción."
    ])
    c2 = add_card(s12, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "La Solución: Datos Fuera del Ciclo de Vida")
    add_bullet_list(c2.text_frame, [
        "Desacoplamiento Almacenamiento-Cómputo: Los datos deben residir en volúmenes independientes del contenedor.",
        "Rendimiento de E/S Nativo: Los volúmenes omiten el Storage Driver y escriben directamente a la velocidad nativa del disco del host.",
        "Compartición de Datos: Varios contenedores pueden montar el mismo volumen de forma simultánea (ej. un contenedor escribe logs y otro los procesa).",
        "Persistencia Garantizada: Si el contenedor muere, los datos permanecen intactos en el almacenamiento."
    ])
    add_speaker_notes(
        s12,
        objective="Hacer entender que los contenedores son efímeros pero los datos deben ser sagrados y persistentes.",
        under_the_hood="Overlay2 es fantástico para archivos estáticos de la imagen, pero tiene penalización en escrituras pesadas aleatorias (como un motor InnoDB de MySQL o WAL de PostgreSQL). Los volúmenes se montan como sistemas de archivos directos sin pasar por Overlay2.",
        classroom_prompt="¿Por qué no es recomendable escribir terabytes de datos directamente en la capa de escritura del contenedor?",
        live_demo="docker info | grep -i 'Storage Driver'"
    )
    slides.append(s12)

    # Slide 13: Capas y Overlay2 a Fondo
    s13 = prs.slides.add_slide(blank)
    add_background(s13)
    add_header(s13, "Overlay2 a Fondo: La Magia del Union File System", "Módulo 3 • Almacenamiento")
    c1 = add_card(s13, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Los 4 Directorios Clave de Overlay2")
    add_bullet_list(c1.text_frame, [
        "`lowerdir`: Colección de directorios de solo lectura correspondientes a cada una de las capas de la imagen.",
        "`upperdir`: Directorio de lectura/escritura propio y exclusivo del contenedor activo.",
        "`workdir`: Directorio interno que utiliza Linux para preparar archivos antes de hacer la operación atómica de copia hacia el upperdir.",
        "`merged`: El punto de montaje unificado que ve el proceso del contenedor en `/`. Superpone el `upperdir` sobre los `lowerdir`."
    ])
    add_code_block(s13, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Inspeccionar los directorios de Overlay2 en un contenedor",
        "$ docker inspect -f '{{json .GraphDriver.Data}}' mi-contenedor",
        "{",
        "  \"LowerDir\": \"/var/lib/docker/overlay2/abc.../diff:...\",",
        "  \"MergedDir\": \"/var/lib/docker/overlay2/def.../merged\",",
        "  \"UpperDir\": \"/var/lib/docker/overlay2/def.../diff\",",
        "  \"WorkDir\": \"/var/lib/docker/overlay2/def.../work\"",
        "}",
        "",
        "# Cómo funciona la eliminación de un archivo:",
        "# Si el contenedor borra un archivo de la imagen base,",
        "# Overlay2 crea un archivo especial 'whiteout' (cdev 0,0)",
        "# en el upperdir que oculta el archivo del lowerdir."
    ], "Estructura de Grafos en Disco")
    add_speaker_notes(
        s13,
        objective="Explicar técnicamente el funcionamiento interno de Overlay2 y qué ocurre realmente en disco cuando se crea, edita o borra un archivo.",
        under_the_hood="Un whiteout file en OverlayFS es un dispositivo de caracteres (character device) con número mayor 0 y menor 0. Al montar el filesystem, el kernel oculta cualquier entrada en lowerdir con ese mismo nombre.",
        classroom_prompt="Si borras un archivo de 2GB de la imagen base dentro del contenedor, ¿se reduce el tamaño de la imagen en disco? (¡No, solo se crea un whiteout!)",
        live_demo="docker run -d --name o2-demo alpine sleep 60 && docker inspect o2-demo | grep -A 5 GraphDriver && docker rm -f o2-demo"
    )
    slides.append(s13)

    # Slide 14: Los Tres Mecanismos de Persistencia
    s14 = prs.slides.add_slide(blank)
    add_background(s14)
    add_header(s14, "Mecanismos de Persistencia: Volumes, Binds y Tmpfs", "Módulo 3 • Almacenamiento")
    c1 = add_card(s14, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0), "Named Volumes")
    add_bullet_list(c1.text_frame, [
        "Ubicación: `/var/lib/docker/volumes/`.",
        "Gestión: Completamente administrado por Docker.",
        "Seguridad: Aislado del acceso directo de usuarios del host.",
        "Drivers: Soporta plugins de cloud y almacenamiento en red.",
        "Recomendado: Bases de datos y almacenamiento en producción."
    ], font_size=13)
    c2 = add_card(s14, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0), "Bind Mounts")
    add_bullet_list(c2.text_frame, [
        "Ubicación: Cualquier ruta del host (ej. `/home/user/app`).",
        "Gestión: Dependiente del sistema de archivos del host.",
        "Acceso: El host y el contenedor leen y escriben a la vez.",
        "Riesgos: Dependencia de rutas fijas y permisos de UID/GID.",
        "Recomendado: Desarrollo local con recarga en caliente (hot-reload)."
    ], font_size=13)
    c3 = add_card(s14, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0), "Tmpfs Mounts")
    add_bullet_list(c3.text_frame, [
        "Ubicación: Memoria RAM del host.",
        "Gestión: No escribe jamás en el disco físico.",
        "Velocidad: Rendimiento ultrarrápido en lectura/escritura.",
        "Volatilidad: Se destruye por completo al parar el contenedor.",
        "Recomendado: Datos altamente sensibles, tokens y cachés volátiles."
    ], font_size=13)
    add_speaker_notes(
        s14,
        objective="Presentar la tabla comparativa definitiva entre Named Volumes, Bind Mounts y Tmpfs.",
        under_the_hood="Técnicamente, tanto Bind Mounts como Volumes utilizan la syscall mount() de Linux con flags MS_BIND. La diferencia radica en si la ruta origen es gestionada por el daemon de Docker o por el usuario.",
        classroom_prompt="¿Cuál de los 3 elegirías para guardar el código fuente de un proyecto React mientras programas en tu portátil?",
        live_demo="docker volume create test-vol && docker volume inspect test-vol && docker volume rm test-vol"
    )
    slides.append(s14)

    # Slide 15: Volúmenes con Nombre (Named Volumes)
    s15 = prs.slides.add_slide(blank)
    add_background(s15)
    add_header(s15, "Volúmenes con Nombre (Named Volumes): Estándar de Producción", "Módulo 3 • Almacenamiento")
    c1 = add_card(s15, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Ciclo de Vida de los Volúmenes")
    add_bullet_list(c1.text_frame, [
        "Independencia Total: Los volúmenes tienen su propio ciclo de vida; no se borran al eliminar el contenedor que los utilizaba.",
        "Inicialización Automática: Si montas un volumen vacío sobre un directorio del contenedor que ya tiene archivos (ej. `/var/lib/mysql`), Docker copia automáticamente esos archivos al volumen.",
        "Sintaxis Moderna `--mount`: Recomendada frente al flag clásico `-v` por ser explícita y menos propensa a errores.",
        "Limpieza de Volúmenes Huérfanos: `docker volume prune` elimina aquellos volúmenes que no están siendo usados por ningún contenedor."
    ])
    add_code_block(s15, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# 1. Crear volumen explícito para PostgreSQL",
        "$ docker volume create pgdata",
        "",
        "# 2. Arrancar PostgreSQL montando el volumen",
        "$ docker run -d --name db-postgres \\",
        "    --mount source=pgdata,target=/var/lib/postgresql/data \\",
        "    -e POSTGRES_PASSWORD=mi_pass postgres:16-alpine",
        "",
        "# 3. Destruir el contenedor simulando un desastre",
        "$ docker rm -f db-postgres",
        "",
        "# 4. Recrear el contenedor con una versión más moderna",
        "$ docker run -d --name db-postgres-nuevo \\",
        "    --mount source=pgdata,target=/var/lib/postgresql/data \\",
        "    postgres:16-alpine",
        "",
        "# ¡Todos los registros y tablas siguen intactos!"
    ], "Demostración de Persistencia")
    add_speaker_notes(
        s15,
        objective="Demostrar con el ejemplo práctico de una base de datos que destruir el contenedor no elimina los datos si residen en un Named Volume.",
        under_the_hood="Los volúmenes residen en /var/lib/docker/volumes/<nombre>/_data. En sistemas Linux con permisos de root, es posible inspeccionar y hacer copias de seguridad de esa carpeta directamente con tar o rsync.",
        classroom_prompt="¿Qué sucede si dos contenedores montan el mismo Named Volume simultáneamente? (Ambos pueden escribir, pero ojo con bloqueos a nivel de app)",
        live_demo="docker volume create v_demo && docker run --rm -v v_demo:/data alpine touch /data/saludos.txt && docker run --rm -v v_demo:/data alpine ls /data && docker volume rm v_demo"
    )
    slides.append(s15)

    # Slide 16: Montajes de Enlace (Bind Mounts)
    s16 = prs.slides.add_slide(blank)
    add_background(s16)
    add_header(s16, "Bind Mounts: Desarrollo Ágil y Riesgos de Permisos", "Módulo 3 • Almacenamiento")
    c1 = add_card(s16, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "La Herramienta del Desarrollador")
    add_bullet_list(c1.text_frame, [
        "Edición en Vivo (Hot-Reloading): Permite editar el código fuente en VS Code en el host y ver los cambios reflejados al instante dentro del contenedor sin reconstruir la imagen.",
        "Sintaxis con Ruta Absoluta: Requiere indicar la ruta completa del host (ej. `$(pwd):/app` o `type=bind,source=$(pwd),target=/app`).",
        "Sobrescritura de Directorios: CUIDADO: Montar una carpeta vacía del host sobre una carpeta con archivos del contenedor ocultará los archivos del contenedor.",
        "Modo Solo Lectura (`ro`): Excelente práctica de seguridad para archivos de configuración sensibles (`:ro` o `readonly`)."
    ])
    add_code_block(s16, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Montar código local para desarrollo con recarga",
        "$ docker run -d --name web-dev \\",
        "    -p 3000:3000 \\",
        "    -v \"$(pwd)/src:/app/src:ro\" \\",
        "    node:20-alpine npm run dev",
        "",
        "# El Gran Problema de Permisos en Linux:",
        "# Si el contenedor corre como root (UID 0), creará",
        "# archivos en tu host propiedad de root.",
        "# Solución: Pasar el UID del usuario actual:",
        "$ docker run --user \"$(id -u):$(id -g)\" ...",
        "",
        "# Sintaxis moderna explícita con --mount:",
        "$ docker run --mount type=bind,source=/etc/nginx/nginx.conf,\\",
        "target=/etc/nginx/nginx.conf,readonly nginx"
    ], "Uso Seguro de Bind Mounts")
    add_speaker_notes(
        s16,
        objective="Enseñar el uso adecuado de Bind Mounts en desarrollo y prevenir el dolor de cabeza clásico de permisos UID/GID desalineados.",
        under_the_hood="En Linux, el kernel comprueba los permisos numéricos de UID/GID. Si dentro del contenedor se crea un archivo con UID 0 (root), en el host pertenecerá a root, impidiendo que el desarrollador pueda editarlo sin sudo.",
        classroom_prompt="¿A cuántos os ha pasado crear archivos desde Docker y luego no poder editarlos o borrarlos en vuestro editor en el host?",
        live_demo="docker run --rm -v $(pwd):/host_dir alpine ls /host_dir"
    )
    slides.append(s16)

    # Slide 17: Montajes Tmpfs
    s17 = prs.slides.add_slide(blank)
    add_background(s17)
    add_header(s17, "Tmpfs Mounts: Almacenamiento en Memoria RAM", "Módulo 3 • Almacenamiento")
    c1 = add_card(s17, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Almacenamiento Volátil de Alto Rendimiento")
    add_bullet_list(c1.text_frame, [
        "Directo a la Memoria RAM: Los archivos se escriben exclusivamente en la memoria del host; jamás tocan los discos SSD/NVMe.",
        "Cero Rastro en Disco: Al detener el contenedor, los datos desaparecen instantáneamente sin dejar fragmentos recuperables en el sistema de archivos.",
        "Protección de Secretos en Memoria: Ideal para almacenar certificados temporales, tokens OAuth, llaves criptográficas privadas o credenciales de sesión.",
        "Límites de Tamaño (`tmpfs-size`): Es fundamental limitar el tamaño de tmpfs para evitar que un contenedor llene la RAM del host con archivos temporales."
    ])
    add_code_block(s17, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Montar /tmp en memoria RAM con límite de 64MB",
        "$ docker run -d --name app-segura \\",
        "    --tmpfs /app/secrets:rw,noexec,nosuid,size=64m \\",
        "    nginx",
        "",
        "# Comprobar que está montado como tmpfs",
        "$ docker exec app-segura df -h /app/secrets",
        "Filesystem  Size  Used  Avail  Use%  Mounted on",
        "tmpfs       64M      0    64M    0%  /app/secrets",
        "",
        "# Sintaxis con --mount:",
        "$ docker run --mount type=tmpfs,destination=/app/cache,\\",
        "    tmpfs-size=128m,tmpfs-mode=1777 mi-app"
    ], "Montaje Tmpfs en Terminal")
    add_speaker_notes(
        s17,
        objective="Instruir en el uso de tmpfs para optimizar el rendimiento y la seguridad de datos volátiles.",
        under_the_hood="Tmpfs es un sistema de archivos virtual de Linux respaldado por la memoria y swap del kernel. Utiliza la llamada mount -t tmpfs.",
        classroom_prompt="¿Por qué es buena idea poner la carpeta /tmp de un contenedor en tmpfs si la app genera millones de archivos efímeros por hora?",
        live_demo="docker run --rm --tmpfs /ram_dir alpine df -T /ram_dir"
    )
    slides.append(s17)

    # Slide 18: Contenedores de Volúmenes de Datos (Patrón Histórico)
    s18 = prs.slides.add_slide(blank)
    add_background(s18)
    add_header(s18, "Contenedores de Volúmenes de Datos: Perspectiva Histórica", "Módulo 3 • Almacenamiento")
    c1 = add_card(s18, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "El Patrón '--volumes-from' (Histórico)")
    add_bullet_list(c1.text_frame, [
        "El Problema en 2014: En las primeras versiones de Docker no existía el comando `docker volume create` ni existían Named Volumes.",
        "La Solución Ingeniosa: Crear un contenedor 'tonto' (Data Volume Container) que definía volúmenes y permanecía detenido (`Exited`).",
        "Consumo con `--volumes-from`: Otros contenedores montaban los volúmenes de ese contenedor detenido usando el flag `--volumes-from <nombre>`.",
        "Persistencia Compartida: Varios contenedores podían leer y escribir en los mismos datos mientras el contenedor base existiera."
    ])
    c2 = add_card(s18, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Por Qué Hoy Está en Desuso")
    add_bullet_list(c2.text_frame, [
        "Llegada de Docker 1.9 (2015): Se introdujo el subsistema completo de gestión de volúmenes (`docker volume`).",
        "Mayor Claridad y Desacoplamiento: Los volúmenes son ciudadanos de primera clase con nombre propio, sin necesidad de mantener contenedores fantasmas parados.",
        "Plugins de Almacenamiento Modernos: Los Named Volumes admiten drivers externos (NFS, AWS EBS, Azure Disk), algo inviable con el patrón antiguo.",
        "Conclusión del Temario: Se estudia para comprender código legacy o configuraciones antiguas, pero hoy se DEBE utilizar `docker volume`."
    ])
    add_speaker_notes(
        s18,
        objective="Explicar el punto del temario oficial 'Contenedores de volúmenes de datos' contextualizándolo históricamente.",
        under_the_hood="Data Volume Containers usaban volúmenes anónimos asociados al metadata del contenedor en /var/lib/docker/containers/<id>/config.v2.json. Si alguien borraba el contenedor con 'docker rm -v', los datos desaparecían.",
        classroom_prompt="¿Por qué mantener un contenedor en estado 'Exited' solo para sujetar una carpeta era una solución poco elegante?",
        live_demo="docker create -v /datos --name data-holder alpine && docker run --rm --volumes-from data-holder alpine touch /datos/archivo && docker run --rm --volumes-from data-holder alpine ls /datos && docker rm -v data-holder"
    )
    slides.append(s18)

    # Slide 19: Plugins y Drivers de Almacenamiento Remoto
    s19 = prs.slides.add_slide(blank)
    add_background(s19)
    add_header(s19, "Drivers de Almacenamiento Remoto y Red", "Módulo 3 • Almacenamiento")
    c1 = add_card(s19, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Almacenamiento Distribuido (Cloud y NAS)")
    add_bullet_list(c1.text_frame, [
        "El Límite del Almacenamiento Local: Un Named Volume local está atado al disco del servidor físico donde corre el daemon.",
        "Drivers de Volumen (`-d <driver>`): Permiten que Docker monte sistemas de archivos remotos directamente en el contenedor.",
        "Almacenamiento NFS / CIFS: Conectar carpetas compartidas de un NAS / SAN corporativo mediante el driver `local` nativo con opciones de red.",
        "Almacenamiento en Cloud: Plugins para montar volúmenes elásticos de nube (ej. AWS EBS, Azure Files, Google Cloud Persistent Disk)."
    ])
    add_code_block(s19, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# Ejemplo: Crear un volumen Docker respaldado por NFS",
        "$ docker volume create --driver local \\",
        "    --opt type=nfs \\",
        "    --opt o=addr=192.168.1.100,rw,noatime,rsize=8192 \\",
        "    --opt device=:/srv/nfs/datos_compartidos \\",
        "    volumen-nfs",
        "",
        "# Montar el volumen en cualquier contenedor",
        "$ docker run -d --name app-nfs \\",
        "    -v volumen-nfs:/app/storage \\",
        "    mi-aplicacion",
        "",
        "# Si el contenedor se traslada a otro nodo del clúster,",
        "# montará el mismo volumen NFS con los mismos datos."
    ], "Montaje de Almacenamiento NFS")
    add_speaker_notes(
        s19,
        objective="Mostrar cómo los volúmenes de Docker pueden conectarse a almacenamiento en red corporativo.",
        under_the_hood="El driver 'local' de Docker incluye la capacidad de invocar llamadas mount del sistema con cualquier sistema de archivos soportado por el kernel del host (nfs, cifs, sshfs, btrfs, zfs).",
        classroom_prompt="¿Qué precauciones debemos tener con la latencia de red si una base de datos escribe en un volumen NFS montado remotamente?",
        live_demo="docker volume create --help"
    )
    slides.append(s19)

    # Slide 20: Backup, Restauración y Migración de Volúmenes
    s20 = prs.slides.add_slide(blank)
    add_background(s20)
    add_header(s20, "Estrategias de Backup y Migración de Volúmenes", "Módulo 3 • Almacenamiento")
    c1 = add_card(s20, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "El Patrón Contenedor de Backup")
    add_bullet_list(c1.text_frame, [
        "Sin Parar el Motor: No es necesario acceder físicamente como root a `/var/lib/docker/volumes` ni detener el daemon.",
        "Contenedor Efímero de Backup: Se arranca un contenedor ligero (ej. `alpine`) que monta simultáneamente el Named Volume a respaldar y una carpeta del host donde guardar el `.tar.gz`.",
        "Automatización en Cron / CI: El proceso se empaqueta en una única línea de comando reproducible para tareas programadas de madrugada.",
        "Restauración Limpia: El proceso inverso descomprime el `.tar.gz` dentro de un volumen nuevo o existente."
    ])
    add_code_block(s20, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), [
        "# 1. BACKUP: Empaquetar el volumen 'pgdata' en un .tar.gz",
        "$ docker run --rm \\",
        "    -v pgdata:/volumen_origen:ro \\",
        "    -v $(pwd)/backups:/backup_destino \\",
        "    alpine tar czf /backup_destino/pgdata_$(date +%F).tar.gz \\",
        "           -C /volumen_origen .",
        "",
        "# 2. RESTAURAR: Descomprimir en un nuevo volumen",
        "$ docker volume create pgdata_recuperado",
        "$ docker run --rm \\",
        "    -v pgdata_recuperado:/volumen_destino \\",
        "    -v $(pwd)/backups:/backup_destino \\",
        "    alpine tar xzf /backup_destino/pgdata_2026-10-27.tar.gz \\",
        "           -C /volumen_destino"
    ], "Comandos de Backup y Restore")
    add_speaker_notes(
        s20,
        objective="Proporcionar a los alumnos la receta canónica para hacer copias de seguridad fiables de volúmenes de Docker.",
        under_the_hood="Montar el volumen origen en modo :ro (read-only) durante el backup evita que escrituras concurrentes puedan corromper el archivo tar en curso.",
        classroom_prompt="¿Por qué es más limpio usar un contenedor efímero con tar que entrar por SSH como root y copiar los archivos a mano?",
        live_demo="docker volume create v_bk && docker run --rm -v v_bk:/src alpine touch /src/datos.db && docker run --rm -v v_bk:/src -v /tmp:/dst alpine tar czf /dst/backup.tar.gz -C /src . && ls -lh /tmp/backup.tar.gz && docker volume rm v_bk"
    )
    slides.append(s20)

    # Slide 21: Buenas Prácticas de Persistencia
    s21 = prs.slides.add_slide(blank)
    add_background(s21)
    add_header(s21, "Buenas Prácticas en Gestión de Persistencia", "Módulo 3 • Buenas Prácticas")
    c1 = add_card(s21, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), "Reglas de Oro en Producción")
    add_bullet_list(c1.text_frame, [
        "Jamás Guardar Datos en Capas R/W: Todo dato que deba sobrevivir al contenedor debe residir en un Named Volume o Bind Mount.",
        "Nombres Significativos para Volúmenes: Evitar volúmenes anónimos huérfanos generados accidentalmente con flags `-v /ruta`.",
        "Separar Discos para Docker: En servidores Linux de producción, montar `/var/lib/docker` en una partición de disco o volumen LVM separado para que un contenedor desbocado no llene el root `/` del host.",
        "Etiquetado de Volúmenes: Usar labels en volúmenes (`--label env=prod`) para automatizar auditorías y políticas de retención."
    ])
    c2 = add_card(s21, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), "Antipatrones a Erradicar", bg_color=COLOR_ALERT_BG, border_color=COLOR_ALERT_BORDER)
    add_bullet_list(c2.text_frame, [
        "Antipatrón 'docker commit': Modificar un contenedor a mano y hacer `docker commit` para 'guardar los cambios' es el enemigo de la reproducibilidad.",
        "Bind Mounts con Rutas Absolutas de Portátil: Subir a producción Dockerfiles o Compose con rutas de tipo `/Users/juan/proyecto` o `C:\\Users\\...`.",
        "Ignorar el Permiso de Escritura: Olvidar comprobar si el usuario sin privilegios del contenedor (`USER app`) tiene permisos de escritura en la carpeta montada.",
        "Acumulación de Volúmenes Muertos: No programar limpiezas periódicas (`docker volume prune`), provocando el llenado silencioso de discos."
    ])
    add_speaker_notes(
        s21,
        objective="Fijar buenas prácticas estrictas y señalar los errores más costosos que cometen los equipos en producción.",
        under_the_hood="La directiva VOLUME dentro del Dockerfile crea automáticamente un volumen anónimo cada vez que se ejecuta 'docker run' sin parámetros de volumen explícitos. Esto puede saturar /var/lib/docker/volumes rápidamente si no se gestiona.",
        classroom_prompt="¿Qué opináis de la práctica de hacer 'docker commit' en lugar de actualizar el Dockerfile?",
        live_demo="docker volume ls -q -f dangling=true"
    )
    slides.append(s21)

    # Slide 22: Laboratorio 3: Persistencia con Volúmenes y Bind Mounts
    s22 = prs.slides.add_slide(blank)
    add_background(s22)
    add_header(s22, "Laboratorio 3: Persistencia de BD y Hot-Reloading", "Día 2 • Práctica")
    card_lab = add_card(s22, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0), "Objetivos y Pasos del Ejercicio Práctico")
    add_bullet_list(card_lab.text_frame, [
        "Parte A (Named Volume): Crear un Named Volume `db_datos` e iniciar una base de datos MariaDB/PostgreSQL.",
        "Paso 2: Conectarse a la base de datos vía CLI (`docker exec -it ...`), crear una tabla e insertar registros de prueba.",
        "Paso 3: Destruir intencionadamente el contenedor de base de datos (`docker rm -f`).",
        "Paso 4: Arrancar un contenedor nuevo con la misma versión o superior montando `db_datos` y verificar que los registros siguen intactos.",
        "Parte B (Bind Mount): Crear una aplicación web estática o API Node/Python en el host.",
        "Paso 6: Arrancar el contenedor montando el código con Bind Mount (`-v $(pwd)/src:/app:ro`).",
        "Paso 7: Modificar un archivo HTML/JS en el editor del host y comprobar con `curl` que el cambio se refleja inmediatamente en el navegador sin reconstruir la imagen."
    ], space_after=Pt(10))
    add_speaker_notes(
        s22,
        objective="Dar 60-75 minutos a los alumnos para experimentar el contraste real entre persistencia en base de datos y desarrollo ágil con Bind Mount.",
        under_the_hood="Verificar que los alumnos entienden que el volumen 'db_datos' sobrevivió al borrado del contenedor y que el bind mount permite trabajar a velocidad nativa en local.",
        classroom_prompt="¿Quién ha podido destruir el contenedor de PostgreSQL y volver a ver sus tablas en el contenedor nuevo?",
        live_demo="docker volume create lab3_demo && docker run --rm -v lab3_demo:/data alpine touch /data/ok && docker run --rm -v lab3_demo:/data alpine ls /data && docker volume rm lab3_demo"
    )
    slides.append(s22)

    # Slide 23: Resumen del Día 2
    s23 = add_title_slide(
        prs,
        title="RESUMEN DE LA JORNADA 2",
        subtitle="Conceptos consolidados: Drivers de red (Bridge, Host, None, Overlay, Macvlan), DNS interno, Overlay2, Named Volumes, Bind Mounts y Tmpfs.\nPróxima Jornada: Módulo 4 (Contenedores en Cloud: Azure, AWS, GCP y Registries).",
        module_tag="DÍA 2 • CONCLUSIÓN",
        notes_data={
            "objective": "Cerrar la Jornada 2 resolviendo dudas finales sobre redes y almacenamiento y anticipar el salto al Cloud del Día 3.",
            "under_the_hood": "Recordar a los alumnos que una vez que dominamos la ejecución local, la red y la persistencia, el siguiente paso natural es cómo se ejecutan estos mismos contenedores en infraestructuras Cloud.",
            "classroom_prompt": "¿Tenéis clara la diferencia de uso entre un Named Volume y un Bind Mount en un proyecto real?",
            "live_demo": "docker ps && docker network ls && docker volume ls"
        }
    )
    slides.append(s23)

    return slides
