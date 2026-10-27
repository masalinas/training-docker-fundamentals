'use strict';
/**
 * diagrams.js — Diagramas de arquitectura nativos para el curso Docker Fundamentals.
 *
 * Implementa 5 diagramas técnicos vectoriales editables construidos con primitivas de pptxgenjs:
 *   1. dockerEngineArchitecture: Cliente CLI → REST dockerd → containerd → runc → Kernel Linux.
 *   2. kernelIsolationDiagram: Namespaces (visibilidad) + Cgroups (recursos) + Pivot_root.
 *   3. overlay2StorageDiagram: Capas OCI de sólo lectura + Upperdir Read-Write + Merged View (CoW).
 *   4. virtualNetworkBridgeDiagram: Host eth0 + iptables NAT + bridge docker0 + veth pair + contenedor eth0.
 *   5. kubernetesClusterArchitecture: Control Plane (API server, etcd, scheduler, c-m) + Worker Nodes (kubelet, kube-proxy, pods).
 */
const Hh = require('./layout_helpers');
const { COL, SHAPE, box, line, rect, text, iconCircle, pill } = Hh;

/**
 * Diagrama 1: Arquitectura del Motor Docker y Estándares OCI.
 */
function dockerEngineArchitecture(slide, { x, y, w, h }) {
  // Contenedor general del diagrama
  rect(slide, { x, y, w, h, fill: COL.WHITE, radius: 0.12, shadowOn: true, line: COL.LINE });

  // 1. Cliente CLI
  const clW = 2.4, clH = 1.0;
  rect(slide, { x: x + 0.5, y: y + 0.6, w: clW, h: clH, fill: COL.ICE, radius: 0.1, line: COL.COBALT });
  iconCircle(slide, 'FaTerminal', x + 0.65, y + 0.8, 0.6, { fill: COL.COBALT, color: COL.WHITE });
  text(slide, 'Docker Client (CLI)', { x: x + 1.35, y: y + 0.75, w: clW - 0.9, h: 0.35, size: 13, bold: true, color: COL.NAVY, check: false });
  text(slide, 'docker run · build · push', { x: x + 1.35, y: y + 1.1, w: clW - 0.9, h: 0.35, size: 10.5, color: COL.MUTED, check: false });

  // Flecha REST API / Socket Unix
  const arrY = y + 1.1;
  line(slide, x + 0.5 + clW, arrY, x + 3.8, arrY, { color: COL.CYAN, width: 2.5, arrow: 'both' });
  text(slide, 'REST API / Unix Socket\n/var/run/docker.sock', {
    x: x + 0.5 + clW + 0.05, y: arrY - 0.45, w: 3.8 - (x + 0.5 + clW) - 0.1, h: 0.4,
    size: 9.5, bold: true, color: COL.COBALT, align: 'center', check: false
  });

  // 2. Docker Host Daemon (dockerd)
  const dkW = 4.2, dkH = 3.6;
  rect(slide, { x: x + 3.8, y: y + 0.4, w: dkW, h: dkH, fill: 'EEF2F6', radius: 0.1, line: COL.NAVY });
  pill(slide, 'DOCKER HOST (dockerd)', { x: x + 4.0, y: y + 0.55, w: 2.6, h: 0.3, fill: COL.NAVY, color: COL.WHITE, size: 10 });

  // Componentes dentro de dockerd
  const subH = 0.55;
  box(slide, { x: x + 4.1, y: y + 1.05, w: 3.6, h: subH, text: 'Gestión de Imágenes, Redes y Volúmenes', fill: COL.COBALT, color: COL.WHITE, size: 11 });
  box(slide, { x: x + 4.1, y: y + 1.75, w: 3.6, h: subH, text: 'BuildKit (Motor de compilación multi-stage)', fill: COL.COBALT, color: COL.WHITE, size: 11 });

  // Conector a containerd
  line(slide, x + 5.9, y + 2.3, x + 5.9, y + 2.65, { color: COL.CYAN, width: 2, arrow: 'end' });
  text(slide, 'gRPC', { x: x + 6.0, y: y + 2.38, w: 0.8, h: 0.25, size: 9, bold: true, color: COL.COBALT, check: false });

  // containerd
  rect(slide, { x: x + 4.1, y: y + 2.65, w: 3.6, h: 1.15, fill: COL.ICE, radius: 0.08, line: COL.COBALT });
  text(slide, 'containerd (CRI / OCI Supervisor)', { x: x + 4.2, y: y + 2.75, w: 3.4, h: 0.3, size: 11, bold: true, color: COL.NAVY, check: false });
  box(slide, { x: x + 4.3, y: y + 3.12, w: 3.2, h: 0.5, text: 'runc (OCI Runtime Estándar)', fill: COL.CYAN, color: COL.NAVY, size: 11, bold: true });

  // 3. Linux Kernel & Contenedores a la derecha
  const krX = x + 8.4, krW = w - 8.9;
  line(slide, x + 7.5, y + 3.37, krX, y + 3.37, { color: COL.CORAL, width: 2, arrow: 'end' });
  text(slide, 'fork / clone', { x: x + 7.45, y: y + 3.08, w: 0.9, h: 0.25, size: 9, bold: true, color: COL.CORAL, check: false });

  rect(slide, { x: krX, y: y + 0.4, w: krW, h: dkH, fill: COL.WARNBG, radius: 0.1, line: COL.CORAL });
  pill(slide, 'LINUX KERNEL ISOLATION', { x: krX + 0.2, y: y + 0.55, w: 2.5, h: 0.3, fill: COL.CORAL, color: COL.WHITE, size: 10 });

  const kParts = [
    ['Namespaces (PID, NET, MNT, IPC, UTS, USER)', COL.WHITE, COL.NAVY],
    ['Cgroups v2 (Límites CPU, Memoria, IO, PIDs)', COL.WHITE, COL.NAVY],
    ['Securit y: Seccomp, AppArmor, Capabilities', COL.WHITE, COL.NAVY],
    ['Overlay2 Union Filesystem (chroot / pivot_root)', COL.WHITE, COL.NAVY],
  ];
  kParts.forEach(([txt, f, c], idx) => {
    box(slide, {
      x: krX + 0.2, y: y + 1.05 + idx * 0.68, w: krW - 0.4, h: 0.55,
      text: txt, fill: f, color: c, size: 10.5, line: COL.LINE
    });
  });
}

/**
 * Diagrama 2: Aislamiento del Kernel (Namespaces vs Control Groups).
 */
function kernelIsolationDiagram(slide, { x, y, w, h }) {
  rect(slide, { x, y, w, h, fill: COL.WHITE, radius: 0.12, shadowOn: true, line: COL.LINE });

  const colW = (w - 0.9) / 2;

  // Columna Izquierda: Namespaces (¿Qué puede ver el proceso?)
  const nx = x + 0.3, ny = y + 0.4;
  rect(slide, { x: nx, y: ny, w: colW, h: h - 0.8, fill: COL.ICE, radius: 0.1, line: COL.COBALT });
  iconCircle(slide, 'FaMicrochip', nx + 0.2, ny + 0.2, 0.55, { fill: COL.COBALT, color: COL.WHITE });
  text(slide, 'NAMESPACES (Visibilidad / Aislamiento)', { x: nx + 0.85, y: ny + 0.2, w: colW - 1.0, h: 0.35, size: 14, bold: true, color: COL.NAVY, check: false });
  text(slide, 'Determinan lo que un proceso puede VER en el sistema', { x: nx + 0.85, y: ny + 0.55, w: colW - 1.0, h: 0.3, size: 11, color: COL.MUTED, check: false });

  const nsList = [
    ['PID', 'Aísla el árbol de procesos (el contenedor tiene su propio PID 1).'],
    ['NET', 'Aísla interfaces de red, tablas de enrutamiento y puertos TCP/UDP.'],
    ['MNT', 'Aísla puntos de montaje de sistemas de archivos (raíz aislada).'],
    ['IPC', 'Aísla colas de mensajes POSIX y segmentos de memoria compartida.'],
    ['UTS', 'Aísla nombre de host (hostname) y dominio NIS independiente.'],
    ['USER', 'Mapea UID/GID del contenedor a usuarios sin privilegios del host.']
  ];
  nsList.forEach(([k, desc], i) => {
    const rowY = ny + 1.0 + i * 0.52;
    box(slide, { x: nx + 0.2, y: rowY, w: 0.9, h: 0.42, text: k, fill: COL.COBALT, color: COL.WHITE, size: 11, bold: true });
    text(slide, desc, { x: nx + 1.2, y: rowY, w: colW - 1.35, h: 0.42, size: 10.5, color: COL.TEXT, valign: 'middle', check: false });
  });

  // Columna Derecha: Cgroups (¿Cuánto puede consumir el proceso?)
  const cx = nx + colW + 0.3;
  rect(slide, { x: cx, y: ny, w: colW, h: h - 0.8, fill: COL.WARNBG, radius: 0.1, line: COL.CORAL });
  iconCircle(slide, 'FaMemory', cx + 0.2, ny + 0.2, 0.55, { fill: COL.CORAL, color: COL.WHITE });
  text(slide, 'CONTROL GROUPS / CGROUPS (Límites)', { x: cx + 0.85, y: ny + 0.2, w: colW - 1.0, h: 0.35, size: 14, bold: true, color: 'A8431F', check: false });
  text(slide, 'Determinan lo que un proceso puede USAR de hardware', { x: cx + 0.85, y: ny + 0.55, w: colW - 1.0, h: 0.3, size: 11, color: COL.MUTED, check: false });

  const cgList = [
    ['CPU Quota', 'Limita cuotas de ciclos CPU por periodo (--cpus="1.5").'],
    ['RAM Limit', 'Límite estricto de memoria (--memory="512m"); dispara OOM Killer.'],
    ['BlkIO / Disk', 'Control de ancho de banda y operaciones de E/S por segundo en disco.'],
    ['PIDs Limit', 'Límite de subprocesos (--pids-limit=100) para evitar fork-bombs.'],
    ['Network Pri', 'Priorización de tráfico de red y etiquetado con net_cls / net_prio.']
  ];
  cgList.forEach(([k, desc], i) => {
    const rowY = ny + 1.0 + i * 0.58;
    box(slide, { x: cx + 0.2, y: rowY, w: 1.25, h: 0.46, text: k, fill: COL.CORAL, color: COL.WHITE, size: 11, bold: true });
    text(slide, desc, { x: cx + 1.55, y: rowY, w: colW - 1.7, h: 0.46, size: 10.5, color: COL.TEXT, valign: 'middle', check: false });
  });
}

/**
 * Diagrama 3: Arquitectura de Almacenamiento Overlay2 (UnionFS y Copy-on-Write).
 */
function overlay2StorageDiagram(slide, { x, y, w, h }) {
  rect(slide, { x, y, w, h, fill: COL.WHITE, radius: 0.12, shadowOn: true, line: COL.LINE });

  // Columna Izquierda: Pila de Capas
  const stackW = 5.8;
  text(slide, 'PILA DE CAPAS OVERLAY2 (Estructura en Disco)', { x: x + 0.3, y: y + 0.3, w: stackW, h: 0.35, size: 13, bold: true, color: COL.NAVY, check: false });

  // Capa Contenedor Read-Write (Upperdir)
  const cy = y + 0.8;
  rect(slide, { x: x + 0.3, y: cy, w: stackW, h: 0.8, fill: COL.WARNBG, radius: 0.08, line: COL.CORAL });
  box(slide, { x: x + 0.45, y: cy + 0.12, w: 1.8, h: 0.55, text: 'UPPERDIR (R/W)', fill: COL.CORAL, color: COL.WHITE, size: 11, bold: true });
  text(slide, 'Capa de contenedor: ficheros creados, modificados o borrados (whiteout). Se destruye con el contenedor.', {
    x: x + 2.35, y: cy + 0.08, w: stackW - 2.45, h: 0.65, size: 10, color: COL.TEXT, valign: 'middle', check: false
  });

  // Capas de Imagen Read-Only (Lowerdir)
  const imgLayers = [
    ['CAPA 3 (R/O)', 'COPY . /app & ENTRYPOINT (Ficheros de aplicación y binarios)', 'DDE7F3', COL.COBALT],
    ['CAPA 2 (R/O)', 'RUN npm install / pip install (Dependencias y librerías del runtime)', 'DDE7F3', COL.COBALT],
    ['CAPA 1 (R/O)', 'FROM node:20-alpine (Base OS minimalista, libmusl, shell /bin/sh)', 'DDE7F3', COL.NAVY]
  ];
  imgLayers.forEach(([lbl, desc, bg, txtCol], i) => {
    const ly = cy + 0.95 + i * 0.72;
    rect(slide, { x: x + 0.3, y: ly, w: stackW, h: 0.62, fill: bg, radius: 0.08, line: COL.LINE });
    box(slide, { x: x + 0.45, y: ly + 0.08, w: 1.8, h: 0.46, text: lbl, fill: txtCol, color: COL.WHITE, size: 10.5, bold: true });
    text(slide, desc, { x: x + 2.35, y: ly + 0.05, w: stackW - 2.45, h: 0.52, size: 10, color: COL.TEXT, valign: 'middle', check: false });
  });

  // Columna Derecha: Vista Unificada (Merged View) y Mecánica CoW
  const mx = x + stackW + 0.8, mw = w - stackW - 1.1;

  // Flecha de unión
  line(slide, x + stackW + 0.3, y + 2.1, mx - 0.1, y + 2.1, { color: COL.CYAN, width: 2.5, arrow: 'end' });
  text(slide, 'OverlayFS\nUnion Mount', { x: x + stackW + 0.15, y: y + 1.45, w: 0.65, h: 0.6, size: 9, bold: true, color: COL.COBALT, align: 'center', check: false });

  // Caja Merged View
  rect(slide, { x: mx, y: y + 0.8, w: mw, h: 1.6, fill: COL.ICE, radius: 0.1, line: COL.COBALT });
  iconCircle(slide, 'FaFolderOpen', mx + 0.25, y + 1.0, 0.55, { fill: COL.COBALT, color: COL.WHITE });
  text(slide, 'MERGED VIEW (Vista Unificada)', { x: mx + 0.9, y: y + 0.95, w: mw - 1.0, h: 0.35, size: 13, bold: true, color: COL.NAVY, check: false });
  text(slide, 'Punto de montaje `/` que ve el proceso dentro del contenedor. Las capas de sólo lectura se superponen; si un fichero existe en el Upperdir, enmascara al del Lowerdir.', {
    x: mx + 0.25, y: y + 1.55, w: mw - 0.5, h: 0.75, size: 10.5, color: COL.TEXT, check: false
  });

  // Caja Copy-on-Write
  rect(slide, { x: mx, y: y + 2.65, w: mw, h: 1.4, fill: COL.WARNBG, radius: 0.1, line: COL.CORAL });
  iconCircle(slide, 'FaExchangeAlt', mx + 0.25, y + 2.85, 0.55, { fill: COL.CORAL, color: COL.WHITE });
  text(slide, 'MECÁNICA COPY-ON-WRITE (CoW)', { x: mx + 0.9, y: y + 2.8, w: mw - 1.0, h: 0.35, size: 13, bold: true, color: 'A8431F', check: false });
  text(slide, '• LECTURA: Acceso directo ultra rápido a la capa inferior.\n• ESCRITURA: Al modificar un archivo existente, el kernel lo duplica primero a Upperdir y luego aplica el cambio.\n• BORRADO: Se genera un marcador whiteout en Upperdir.', {
    x: mx + 0.25, y: y + 3.35, w: mw - 0.5, h: 0.65, size: 10, color: COL.TEXT, check: false
  });
}

/**
 * Diagrama 4: Red Virtual Bridge, Veth Pairs y NAT iptables.
 */
function virtualNetworkBridgeDiagram(slide, { x, y, w, h }) {
  rect(slide, { x, y, w, h, fill: COL.WHITE, radius: 0.12, shadowOn: true, line: COL.LINE });

  // 1. Red Física Host (eth0)
  const hx = x + 0.3, hy = y + 0.4, hw = 2.6, hh = h - 0.8;
  rect(slide, { x: hx, y: hy, w: hw, h: hh, fill: COL.ICE, radius: 0.1, line: COL.COBALT });
  text(slide, 'HOST NET NAMESPACE', { x: hx + 0.15, y: hy + 0.15, w: hw - 0.3, h: 0.3, size: 12, bold: true, color: COL.NAVY, align: 'center', check: false });

  box(slide, { x: hx + 0.25, y: hy + 0.65, w: hw - 0.5, h: 0.65, text: 'Interfaz Física\neth0 (192.168.1.50)', fill: COL.COBALT, color: COL.WHITE, size: 11 });
  box(slide, { x: hx + 0.25, y: hy + 1.55, w: hw - 0.5, h: 0.95, text: 'iptables NAT Engine\nPREROUTING: DNAT\nPOSTROUTING: MASQ', fill: COL.NAVY, color: COL.WHITE, size: 10.5 });
  box(slide, { x: hx + 0.25, y: hy + 2.75, w: hw - 0.5, h: 0.65, text: 'docker-proxy\n(:8080 → :80)', fill: COL.CYAN, color: COL.NAVY, size: 11, bold: true });

  // 2. Linux Bridge (docker0)
  const bx = hx + hw + 0.6, bw = 2.4;
  line(slide, hx + hw, hy + 2.0, bx, hy + 2.0, { color: COL.CORAL, width: 2.5, arrow: 'both' });

  rect(slide, { x: bx, y: hy + 0.5, w: bw, h: hh - 1.0, fill: 'EEF2F6', radius: 0.1, line: COL.COBALT });
  iconCircle(slide, 'FaNetworkWired', bx + (bw - 0.6) / 2, hy + 0.75, 0.6, { fill: COL.COBALT, color: COL.WHITE });
  text(slide, 'LINUX BRIDGE\ndocker0\n172.17.0.1/16', {
    x: bx + 0.1, y: hy + 1.45, w: bw - 0.2, h: 0.8, size: 12, bold: true, color: COL.NAVY, align: 'center', check: false
  });
  text(slide, 'Switch L2 virtual que conmuta tramas Ethernet entre los veth conectados.', {
    x: bx + 0.15, y: hy + 2.4, w: bw - 0.3, h: 0.8, size: 10, color: COL.MUTED, align: 'center', check: false
  });

  // 3. Contenedores a la derecha con veth pairs
  const cx = bx + bw + 0.7, cw = w - (cx - x) - 0.4;
  const cList = [
    ['Contenedor Web (Nginx)', 'veth9a1', '172.17.0.2', '80/tcp'],
    ['Contenedor API (Node)', 'veth3b8', '172.17.0.3', '3000/tcp']
  ];

  cList.forEach(([title, veth, ip, port], idx) => {
    const cty = hy + 0.3 + idx * 1.95;
    rect(slide, { x: cx, y: cty, w: cw, h: 1.65, fill: COL.WARNBG, radius: 0.1, line: COL.CORAL });

    // Cable veth
    line(slide, bx + bw, cty + 0.8, cx, cty + 0.8, { color: COL.CYAN, width: 2, arrow: 'both' });
    text(slide, veth, { x: bx + bw + 0.05, y: cty + 0.5, w: cx - (bx + bw) - 0.1, h: 0.25, size: 9, bold: true, color: COL.COBALT, align: 'center', check: false });

    // Contenido del contenedor
    iconCircle(slide, 'FaDocker', cx + 0.2, cty + 0.2, 0.5, { fill: COL.CORAL, color: COL.WHITE });
    text(slide, title, { x: cx + 0.8, y: cty + 0.18, w: cw - 0.9, h: 0.35, size: 12, bold: true, color: 'A8431F', check: false });
    box(slide, { x: cx + 0.2, y: cty + 0.8, w: cw - 0.4, h: 0.65, text: `eth0: ${ip}\nPuerto de escucha: ${port}`, fill: COL.WHITE, color: COL.NAVY, size: 10.5, line: COL.LINE });
  });
}

/**
 * Diagrama 5: Arquitectura de Clúster Kubernetes (Control Plane vs Worker Nodes).
 */
function kubernetesClusterArchitecture(slide, { x, y, w, h }) {
  rect(slide, { x, y, w, h, fill: COL.WHITE, radius: 0.12, shadowOn: true, line: COL.LINE });

  // Control Plane (Izquierda)
  const cpW = 4.6;
  rect(slide, { x: x + 0.3, y: y + 0.4, w: cpW, h: h - 0.8, fill: COL.ICE, radius: 0.1, line: COL.COBALT });
  pill(slide, 'CONTROL PLANE (MASTER)', { x: x + 0.5, y: y + 0.6, w: 2.8, h: 0.3, fill: COL.NAVY, color: COL.WHITE, size: 10 });

  const cpComps = [
    ['FaGlobe', 'kube-apiserver', 'Punto central de control y puerta de entrada REST API.'],
    ['FaDatabase', 'etcd datastore', 'Base de datos clave-valor distribuida con el estado del clúster.'],
    ['FaRandom', 'kube-scheduler', 'Asigna Pods pendientes a nodos según recursos y afinidad.'],
    ['FaCogs', 'kube-controller-mgr', 'Ejecuta bucles de control: Node, ReplicaSet, Endpoints.']
  ];
  cpComps.forEach(([ic, name, desc], idx) => {
    const rowY = y + 1.1 + idx * 0.72;
    rect(slide, { x: x + 0.5, y: rowY, w: cpW - 0.4, h: 0.62, fill: COL.WHITE, radius: 0.08, line: COL.LINE });
    iconCircle(slide, ic, x + 0.65, rowY + 0.08, 0.45, { fill: COL.COBALT, color: COL.WHITE });
    text(slide, name, { x: x + 1.2, y: rowY + 0.05, w: cpW - 1.25, h: 0.26, size: 11, bold: true, color: COL.NAVY, check: false });
    text(slide, desc, { x: x + 1.2, y: rowY + 0.3, w: cpW - 1.25, h: 0.28, size: 9.5, color: COL.MUTED, check: false });
  });

  // Conector central de red
  const midX = x + cpW + 0.5;
  line(slide, x + cpW + 0.3, y + 2.3, midX + 0.4, y + 2.3, { color: COL.CYAN, width: 2.5, arrow: 'both' });
  text(slide, 'TLS Mutual\ngRPC', { x: x + cpW + 0.3, y: y + 1.85, w: 0.6, h: 0.4, size: 9, bold: true, color: COL.COBALT, align: 'center', check: false });

  // Worker Nodes (Derecha)
  const wnX = midX + 0.4, wnW = w - (wnX - x) - 0.3;
  rect(slide, { x: wnX, y: y + 0.4, w: wnW, h: h - 0.8, fill: 'EEF2F6', radius: 0.1, line: COL.NAVY });
  pill(slide, 'WORKER NODES (DATA PLANE)', { x: wnX + 0.2, y: y + 0.6, w: 3.0, h: 0.3, fill: COL.COBALT, color: COL.WHITE, size: 10 });

  // Agentes del Worker Node
  const nodeH = (h - 2.0) / 2;
  for (let n = 1; n <= 2; n++) {
    const ny = y + 1.1 + (n - 1) * (nodeH + 0.25);
    rect(slide, { x: wnX + 0.2, y: ny, w: wnW - 0.4, h: nodeH, fill: COL.WHITE, radius: 0.08, line: COL.LINE });
    text(slide, `Worker Node 0${n}`, { x: wnX + 0.35, y: ny + 0.1, w: 2.2, h: 0.25, size: 11.5, bold: true, color: COL.NAVY, check: false });

    // kubelet + kube-proxy
    box(slide, { x: wnX + 0.35, y: ny + 0.42, w: 1.5, h: 0.42, text: 'kubelet', fill: COL.COBALT, color: COL.WHITE, size: 10, bold: true });
    box(slide, { x: wnX + 1.95, y: ny + 0.42, w: 1.5, h: 0.42, text: 'kube-proxy', fill: COL.CYAN, color: COL.NAVY, size: 10, bold: true });

    // Pods dentro del nodo
    const podW = (wnW - 0.4 - 3.8) / 2;
    for (let p = 1; p <= 2; p++) {
      const px = wnX + 3.6 + (p - 1) * (podW + 0.15);
      rect(slide, { x: px, y: ny + 0.2, w: podW, h: nodeH - 0.35, fill: COL.WARNBG, radius: 0.06, line: COL.CORAL });
      text(slide, `Pod ${p}`, { x: px + 0.05, y: ny + 0.25, w: podW - 0.1, h: 0.2, size: 9.5, bold: true, color: 'A8431F', align: 'center', check: false });
      box(slide, { x: px + 0.08, y: ny + 0.5, w: podW - 0.16, h: 0.4, text: 'Container', fill: COL.CORAL, color: COL.WHITE, size: 8.5 });
    }
  }
}

module.exports = {
  dockerEngineArchitecture,
  kernelIsolationDiagram,
  overlay2StorageDiagram,
  virtualNetworkBridgeDiagram,
  kubernetesClusterArchitecture,
};
