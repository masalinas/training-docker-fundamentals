"""
diagrams.py - Primitivas visuales nativas de PowerPoint para diagramas de Docker y Kubernetes.
Dibuja componentes nativos (cajas, capas, flujos y conectores) evitando imágenes o clichés.
"""

from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from generator.theme import (
    COLOR_PRIMARY_DARK, COLOR_PRIMARY_BLUE, COLOR_ACCENT_CYAN,
    COLOR_TEXT_MAIN, COLOR_TEXT_MUTED, COLOR_TEXT_WHITE,
    COLOR_CARD_BG, COLOR_CARD_BG_ALT, COLOR_CARD_BORDER,
    COLOR_CODE_BG, COLOR_ALERT_BG, COLOR_ALERT_BORDER, COLOR_ALERT_TEXT,
    COLOR_SUCCESS_BG, COLOR_SUCCESS_BORDER,
    FONT_HEADING, FONT_BODY, FONT_CODE
)


def draw_container_vs_vm(slide, left, top, width, height):
    """Dibuja una comparativa lado a lado entre Máquina Virtual y Contenedor."""
    col_width = (width - Inches(0.4)) / 2

    # Columna 1: Máquina Virtual
    c1 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, col_width, height)
    c1.fill.solid()
    c1.fill.fore_color.rgb = COLOR_CARD_BG
    c1.line.color.rgb = COLOR_CARD_BORDER
    tf1 = c1.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "Máquina Virtual (Hipervisor)"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(15)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_MAIN

    layers_vm = [
        ("App A + Dependencias", COLOR_ALERT_BG, COLOR_ALERT_BORDER, COLOR_ALERT_TEXT),
        ("Guest OS (Kernel propio, drivers, libs: GBs)", COLOR_CARD_BG_ALT, COLOR_CARD_BORDER, COLOR_TEXT_MAIN),
        ("Hipervisor (Type 1 o 2: ESXi, KVM, Hyper-V)", COLOR_PRIMARY_DARK, COLOR_PRIMARY_DARK, COLOR_TEXT_WHITE),
        ("Hardware Servidor (CPU, RAM, Disco)", COLOR_CARD_BG_ALT, COLOR_CARD_BORDER, COLOR_TEXT_MUTED),
    ]
    layer_h = (height - Inches(1.0)) / len(layers_vm)
    cur_y = top + Inches(0.8)
    for title, bg, border, txt in layers_vm:
        box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left + Inches(0.2), cur_y, col_width - Inches(0.4), layer_h - Inches(0.1))
        box.fill.solid()
        box.fill.fore_color.rgb = bg
        box.line.color.rgb = border
        tf = box.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = title
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = txt
        cur_y += layer_h

    # Columna 2: Contenedor Docker
    c2_left = left + col_width + Inches(0.4)
    c2 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c2_left, top, col_width, height)
    c2.fill.solid()
    c2.fill.fore_color.rgb = COLOR_CARD_BG
    c2.line.color.rgb = COLOR_PRIMARY_BLUE
    c2.line.width = Pt(1.5)
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "Contenedor Docker (Aislamiento de Kernel)"
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(15)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_PRIMARY_BLUE

    layers_docker = [
        ("App A + Dependencias (Bin/Lib: MBs)", COLOR_SUCCESS_BG, COLOR_SUCCESS_BORDER, COLOR_TEXT_MAIN),
        ("Motor Docker (dockerd + containerd + runc)", COLOR_PRIMARY_BLUE, COLOR_PRIMARY_BLUE, COLOR_TEXT_WHITE),
        ("Kernel Linux Compartido (Namespaces + Cgroups)", COLOR_PRIMARY_DARK, COLOR_PRIMARY_DARK, COLOR_ACCENT_CYAN),
        ("Hardware Servidor (CPU, RAM, Disco)", COLOR_CARD_BG_ALT, COLOR_CARD_BORDER, COLOR_TEXT_MUTED),
    ]
    cur_y = top + Inches(0.8)
    for title, bg, border, txt in layers_docker:
        box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, c2_left + Inches(0.2), cur_y, col_width - Inches(0.4), layer_h - Inches(0.1))
        box.fill.solid()
        box.fill.fore_color.rgb = bg
        box.line.color.rgb = border
        tf = box.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = title
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = txt
        cur_y += layer_h


def draw_engine_architecture(slide, left, top, width, height):
    """Dibuja la arquitectura de desacoplamiento de Docker: CLI -> dockerd -> containerd -> runc."""
    steps = [
        ("Docker CLI", "Cliente de usuario\n(docker run / build)", COLOR_CARD_BG_ALT, COLOR_CARD_BORDER, COLOR_TEXT_MAIN),
        ("REST API / Socket", "/var/run/docker.sock\n(Llamadas gRPC/REST)", COLOR_CARD_BG, COLOR_PRIMARY_BLUE, COLOR_PRIMARY_BLUE),
        ("Docker Daemon", "dockerd\n(Auth, build, volúmenes, redes)", COLOR_PRIMARY_DARK, COLOR_PRIMARY_DARK, COLOR_TEXT_WHITE),
        ("Container Runtime", "containerd + containerd-shim\n(Ciclo de vida y gestión OCI)", COLOR_CARD_BG_ALT, COLOR_PRIMARY_BLUE, COLOR_TEXT_MAIN),
        ("OCI Low-Level", "runc\n(Crea procesos con cgroups/namespaces)", COLOR_SUCCESS_BG, COLOR_SUCCESS_BORDER, COLOR_TEXT_MAIN),
    ]
    box_w = width
    box_h = (height - Inches(0.8)) / len(steps)
    cur_y = top

    for i, (title, desc, bg, border, txt_color) in enumerate(steps):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, cur_y, box_w, box_h - Inches(0.12))
        box.fill.solid()
        box.fill.fore_color.rgb = bg
        box.line.color.rgb = border
        box.line.width = Pt(1)

        tf = box.text_frame
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.1)
        p0 = tf.paragraphs[0]
        p0.text = f"{i+1}. {title}"
        p0.font.name = FONT_HEADING
        p0.font.size = Pt(13)
        p0.font.bold = True
        p0.font.color.rgb = txt_color

        p1 = tf.add_paragraph()
        p1.text = desc
        p1.font.name = FONT_BODY
        p1.font.size = Pt(10)
        p1.font.color.rgb = COLOR_TEXT_MUTED

        cur_y += box_h


def draw_kernel_isolation_box(slide, left, top, width, height):
    """Dibuja el esquema de aislamiento del Kernel: Proceso central protegido por Namespaces y Cgroups."""
    # Caja envolvente: Host Kernel
    outer = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    outer.fill.solid()
    outer.fill.fore_color.rgb = COLOR_CARD_BG_ALT
    outer.line.color.rgb = COLOR_PRIMARY_BLUE
    outer.line.width = Pt(1.5)

    tf_out = outer.text_frame
    p_out = tf_out.paragraphs[0]
    p_out.text = "ESPACIO DE KERNEL LINUX DEL HOST"
    p_out.font.name = FONT_HEADING
    p_out.font.size = Pt(13)
    p_out.font.bold = True
    pout_color = COLOR_PRIMARY_DARK
    p_out.font.color.rgb = pout_color

    # Sub-bloque 1: Namespaces (Aislamiento de visión)
    ns_w = (width - Inches(0.6)) / 2
    ns_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left + Inches(0.2), top + Inches(0.7), ns_w, height - Inches(0.9))
    ns_box.fill.solid()
    ns_box.fill.fore_color.rgb = COLOR_CARD_BG
    ns_box.line.color.rgb = COLOR_CARD_BORDER
    tf_ns = ns_box.text_frame
    p_ns = tf_ns.paragraphs[0]
    p_ns.text = "NAMESPACES (¿Qué puede ver?)"
    p_ns.font.name = FONT_HEADING
    p_ns.font.size = Pt(12)
    p_ns.font.bold = True
    p_ns.font.color.rgb = COLOR_PRIMARY_BLUE

    ns_items = [
        "PID: Árbol de procesos privado (PID 1)",
        "NET: Interfaces de red y puertos propios",
        "MNT: Puntos de montaje aislados",
        "IPC: Memoria compartida y colas",
        "UTS: Hostname y dominio independiente",
        "USER: Mapeo de UIDs/GIDs (rootless)",
    ]
    for item in ns_items:
        p = tf_ns.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10)
        p.font.name = FONT_BODY
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Sub-bloque 2: Cgroups & Seguridad (Control de recursos)
    cg_left = left + Inches(0.4) + ns_w
    cg_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, cg_left, top + Inches(0.7), ns_w, height - Inches(0.9))
    cg_box.fill.solid()
    cg_box.fill.fore_color.rgb = COLOR_CARD_BG
    cg_box.line.color.rgb = COLOR_CARD_BORDER
    tf_cg = cg_box.text_frame
    p_cg = tf_cg.paragraphs[0]
    p_cg.text = "CGROUPS & SEC (¿Cuánto puede usar?)"
    p_cg.font.name = FONT_HEADING
    p_cg.font.size = Pt(12)
    p_cg.font.bold = True
    p_cg.font.color.rgb = COLOR_PRIMARY_BLUE

    cg_items = [
        "CPU: Límites (--cpus, shares, quotas)",
        "Memoria: Topes y prevención OOM Killer",
        "Block I/O: Ancho de banda de disco",
        "PIDs: Límite contra fork-bombs",
        "Capabilities: Restricción de llamadas root",
        "Seccomp & AppArmor: Filtro de syscalls",
    ]
    for item in cg_items:
        p = tf_cg.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10)
        p.font.name = FONT_BODY
        p.font.color.rgb = COLOR_TEXT_MAIN


def draw_overlay_storage(slide, left, top, width, height):
    """Dibuja la estructura de capas OCI y Overlay2 (Read-Only vs Container Layer Read-Write)."""
    layers = [
        ("Capa de Contenedor (Read/Write)", "Efímera. Copy-on-Write al modificar archivos.", COLOR_ALERT_BG, COLOR_ALERT_BORDER, COLOR_ALERT_TEXT),
        ("Capa 3: CMD / Dependencias de App", "Solo Lectura (Hash SHA256 inmutable)", COLOR_CARD_BG, COLOR_CARD_BORDER, COLOR_TEXT_MAIN),
        ("Capa 2: Runtime (ej. Node.js / Python)", "Solo Lectura (Compartida en caché)", COLOR_CARD_BG, COLOR_CARD_BORDER, COLOR_TEXT_MAIN),
        ("Capa 1: Imagen Base (ej. Ubuntu / Alpine)", "Solo Lectura (Kernel compartido)", COLOR_CARD_BG_ALT, COLOR_CARD_BORDER, COLOR_TEXT_MUTED),
    ]
    layer_h = (height - Inches(0.4)) / len(layers)
    cur_y = top

    for title, desc, bg, border, txt in layers:
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, cur_y, width, layer_h - Inches(0.1))
        box.fill.solid()
        box.fill.fore_color.rgb = bg
        box.line.color.rgb = border
        box.line.width = Pt(1)

        tf = box.text_frame
        tf.margin_left = Inches(0.2)
        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.name = FONT_HEADING
        p0.font.size = Pt(12)
        p0.font.bold = True
        p0.font.color.rgb = txt

        p1 = tf.add_paragraph()
        p1.text = desc
        p1.font.name = FONT_BODY
        p1.font.size = Pt(10)
        p1.font.color.rgb = COLOR_TEXT_MUTED
        cur_y += layer_h


def draw_k8s_architecture(slide, left, top, width, height):
    """Dibuja la arquitectura de Kubernetes: Control Plane y Worker Node."""
    col_w = (width - Inches(0.4)) / 2

    # Panel Control Plane
    cp = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, col_w, height)
    cp.fill.solid()
    cp.fill.fore_color.rgb = COLOR_PRIMARY_DARK
    cp.line.color.rgb = COLOR_ACCENT_CYAN
    tf_cp = cp.text_frame
    p_cp = tf_cp.paragraphs[0]
    p_cp.text = "CONTROL PLANE (Cerebro del Clúster)"
    p_cp.font.name = FONT_HEADING
    p_cp.font.size = Pt(13)
    p_cp.font.bold = True
    p_cp.font.color.rgb = COLOR_ACCENT_CYAN

    cp_components = [
        "kube-apiserver: Puerta de entrada REST API y validación",
        "etcd: Almacén clave-valor distribuido del estado",
        "kube-scheduler: Asigna Pods a Nodos según recursos",
        "kube-controller-manager: Bucles de reconciliación",
    ]
    for comp in cp_components:
        p = tf_cp.add_paragraph()
        p.text = "• " + comp
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_WHITE

    # Panel Worker Node
    wn_left = left + col_w + Inches(0.4)
    wn = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, wn_left, top, col_w, height)
    wn.fill.solid()
    wn.fill.fore_color.rgb = COLOR_CARD_BG
    wn.line.color.rgb = COLOR_PRIMARY_BLUE
    wn.line.width = Pt(1.5)
    tf_wn = wn.text_frame
    p_wn = tf_wn.paragraphs[0]
    p_wn.text = "WORKER NODE (Ejecución de Cargas)"
    p_wn.font.name = FONT_HEADING
    p_wn.font.size = Pt(13)
    p_wn.font.bold = True
    p_wn.font.color.rgb = COLOR_PRIMARY_BLUE

    wn_components = [
        "kubelet: Agente de nodo que reporta al API Server",
        "kube-proxy: Gestión de reglas de red y Service IPs",
        "Container Runtime: containerd / CRI-O",
        "Pods: Contenedores de la aplicación (Carga real)",
    ]
    for comp in wn_components:
        p = tf_wn.add_paragraph()
        p.text = "• " + comp
        p.font.name = FONT_BODY
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN
