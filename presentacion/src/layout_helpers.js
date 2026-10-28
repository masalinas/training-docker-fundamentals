'use strict';
/**
 * layout_helpers.js — Sistema de diseño y maquetación para el curso
 * "Docker Fundamentals" (20 horas · 4 días x 5 horas).
 *
 * Implementa la skill `pptx` con pptxgenjs en formato 16:9 widescreen (13.333" x 7.5").
 * Proporciona paridad estética completa con la plantilla corporativa de referencia:
 *   - Paleta Docker & Cloud Native (Navy, Cobalt, Cyan, Coral, Ice, Deep).
 *   - Badges vectoriales circulares rasterizados con sharp a 300 DPI (react-icons/fa).
 *   - Cajas de alerta y advertencia (callout warn/tip/info).
 *   - Tarjetas elevadas con sombra suave (card, cardSide, cardsRow, cardsGrid).
 *   - Secuencias numeradas con flechas horizontales (steps).
 *   - Bloques de código con fondo oscuro de consola (code).
 *   - Divisores de módulo oscuros con marca de agua numérica de 120pt.
 *   - Notas del orador estructuradas pedagógicamente en cada diapositiva.
 */
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const FA = require('react-icons/fa');

const SHAPE = new pptxgen().ShapeType;

// ───────────────────────── Paleta, tipografía y lienzo 16:9 ─────────────────────────
const COL = {
  NAVY: '0B2545',     // Azul noche corporativo / títulos principales
  COBALT: '134074',   // Azul motor tecnológico / subtítulos y cabeceras de tarjetas
  CYAN: '0DB7ED',     // Docker Whale Blue / acento activo y píldoras
  CORAL: 'D95D39',    // Naranja coral / alertas, advertencias y laboratorios
  BG: 'F8F9FA',       // Fondo estándar de diapositiva (evita deslumbramiento)
  DEEP: '081528',     // Fondo oscuro para portada, separadores y cierre
  ICE: 'E8EEF5',      // Azul hielo para fondos tenues de tarjetas
  STEEL: '8DA9C4',    // Azul acero claro para pies y subtítulos sobre fondo oscuro
  TEXT: '1F2933',     // Texto oscuro de alto contraste
  MUTED: '5C6B7A',    // Texto secundario / metadatos
  LINE: 'D0D7DE',     // Bordes sutiles de tarjetas
  CODEBG: '1E293B',   // Fondo oscuro de consola para comandos y Dockerfile
  CODETEXT: 'E2E8F0', // Texto claro en bloques de código
  WHITE: 'FFFFFF',    // Blanco puro
  WARNBG: 'FDEDE8',   // Fondo suave para cajas de advertencia
  GREEN: '2A7F62',    // Verde éxito / mejores prácticas
  AMBER: 'E9A23B',    // Ámbar atención
};

const FONT = { head: 'Calibri', body: 'Calibri', code: 'Consolas' };
const W = 13.333;
const H = 7.5;
const MX = 0.6;          // Margen horizontal estándar
const CX = MX;           // Coordenada x inicial para contenido
const CW = W - 2 * MX;   // Ancho del área de contenido (12.133")
const CY = 1.75;         // Coordenada y inicial para contenido
const CH = 5.0;          // Alto del área de contenido (hasta y = 6.75")

const MODULES = {
  0: 'Docker Fundamentals · Presentación e Introducción',
  1: 'Módulo 1 · Introducción a Contenedores y Docker',
  2: 'Módulo 2 · Gestión de Redes en Docker',
  3: 'Módulo 3 · Almacenamiento y Volúmenes en Docker',
  4: 'Módulo 4 · Contenedores en la Nube y Docker Compose',
  5: 'Módulo 5 · Seguridad y Orquestación',
};

const state = { n: 0, slides: [], warnings: [], cur: null };

// ───────────────────────── Iconos (react-icons/fa → PNG base64) ─────────────────────────
const iconCache = new Map();
const ICON_COLORS = [COL.WHITE, COL.NAVY, COL.COBALT, COL.CORAL, COL.CYAN, COL.GREEN];

async function preloadIcons(names, colors = ICON_COLORS) {
  for (const name of names) {
    const Comp = FA[name];
    if (!Comp) throw new Error(`Icono react-icons/fa inexistente: ${name}`);
    for (const c of colors) {
      const key = `${name}|${c}`;
      if (iconCache.has(key)) continue;
      let svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { size: '256' }));
      svg = svg.replace(/currentColor/g, `#${c}`);
      const png = await sharp(Buffer.from(svg), { density: 300 })
        .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      iconCache.set(key, 'image/png;base64,' + png.toString('base64'));
    }
  }
}

function iconData(name, color = COL.WHITE) {
  const d = iconCache.get(`${name}|${color}`);
  if (!d) throw new Error(`Icono no precargado: ${name} (${color}). Comprueba preloadIcons().`);
  return d;
}

// ───────────────────────── Estimación de ajuste de texto y avisos ─────────────────────────
function lineCount(textStr, widthIn, sizePt, bold = false, factor) {
  const f = factor || (bold ? 0.53 : 0.5);
  const cpl = Math.max(1, Math.floor((widthIn * 72) / (sizePt * f)));
  let lines = 0;
  for (const para of String(textStr).split('\n')) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) { lines += 1; continue; }
    let cur = 0, l = 1;
    for (const w of words) {
      if (cur === 0) cur = w.length;
      else if (cur + 1 + w.length <= cpl) cur += 1 + w.length;
      else { l++; cur = w.length; }
    }
    lines += l;
  }
  return lines;
}

function textHeight(paras, widthIn) {
  let h = 0;
  for (const p of paras) {
    const l = lineCount(p.text, widthIn - (p.indent || 0), p.size, p.bold);
    h += (l * p.size * 1.2) / 72 + (p.after || 0) / 72;
  }
  return h;
}

function warn(label, need, have) {
  if (need > have + 0.05) {
    const n = state.cur ? state.cur.n : '?';
    state.warnings.push(`Diapositiva ${n} [${label}]: requiere ~${need.toFixed(2)}" y dispone de ${have.toFixed(2)}"`);
  }
}

// ───────────────────────── Notas estructuradas del orador ─────────────────────────
function toList(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v.map((s) => `- ${s}`).join('\n');
  return String(v);
}

function notes({ obj, guion, preguntas, lab }) {
  if (!obj || !guion || !preguntas) throw new Error('notes(): obj, guion y preguntas son obligatorios');
  let s = `🎯 Objetivo Pedagógico:\n${toList(obj)}\n\n📖 Guion y Explicación Técnica:\n${toList(guion)}\n\n💬 Puntos de Interacción / Preguntas:\n${toList(preguntas)}`;
  if (lab) s += `\n\n🛠️ Instrucciones de Laboratorio:\n${toList(lab)}`;
  return s;
}

// ───────────────────────── Primitivas de forma y sombras ─────────────────────────
function shadow() {
  return { type: 'outer', color: '000000', blur: 6, offset: 2, angle: 90, opacity: 0.12 };
}

function rect(slide, { x, y, w, h, fill, line: ln, radius = 0, shadowOn = false, transparency, shape }) {
  const o = { x, y, w, h, fill: fill ? { color: fill, transparency } : undefined };
  o.line = ln ? { color: ln, width: 0.75 } : { type: 'none' };
  if (radius > 0) { o.shape = SHAPE.roundRect; o.rectRadius = radius; }
  if (shape) o.shape = shape;
  if (shadowOn) o.shadow = shadow();
  slide.addShape(o.shape || SHAPE.rect, Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'shape')));
}

function line(slide, x1, y1, x2, y2, { color = COL.MUTED, width = 1.5, arrow, dash } = {}) {
  let swapped = false;
  if (y2 < y1) { [x1, x2] = [x2, x1]; [y1, y2] = [y2, y1]; swapped = true; }
  const o = { x: Math.min(x1, x2), y: y1, w: Math.abs(x2 - x1), h: y2 - y1, line: { color, width } };
  if (x2 < x1) o.flipH = true;
  if (dash) o.line.dashType = dash;
  const endsAt = arrow === 'both' ? 'both' : arrow === 'end' ? (swapped ? 'start' : 'end') : arrow === 'start' ? (swapped ? 'end' : 'start') : null;
  if (endsAt === 'end' || endsAt === 'both') o.line.endArrowType = 'triangle';
  if (endsAt === 'start' || endsAt === 'both') o.line.beginArrowType = 'triangle';
  slide.addShape(SHAPE.line, o);
}

function text(slide, str, { x, y, w, h, size = 14, color = COL.TEXT, bold = false, italic = false, align = 'left', valign = 'top', font = FONT.body, margin = 0, label = 'text', charSpacing, check = false } = {}) {
  if (check) warn(label, textHeight([{ text: Array.isArray(str) ? str.map((r) => r.text).join('') : str, size, bold }], w - (Array.isArray(margin) ? margin[1] + margin[3] : 2 * margin) / 72), h);
  slide.addText(str, { x, y, w, h, fontFace: font, fontSize: size, color, bold, italic, align, valign, margin, charSpacing });
}

function pill(slide, label, { x, y, w, h = 0.3, fill = COL.COBALT, color = COL.WHITE, size = 10 }) {
  slide.addText(label, {
    x, y, w, h,
    shape: SHAPE.roundRect,
    rectRadius: h / 2,
    fill: { color: fill },
    line: { type: 'none' },
    fontFace: FONT.body,
    fontSize: size,
    bold: true,
    color,
    align: 'center',
    valign: 'middle',
    margin: 0,
    charSpacing: 1
  });
}

function iconCircle(slide, name, x, y, d, { fill = COL.COBALT, color = COL.WHITE } = {}) {
  slide.addShape(SHAPE.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { type: 'none' } });
  const s = d * 0.52;
  slide.addImage({ data: iconData(name, color), x: x + (d - s) / 2, y: y + (d - s) / 2, w: s, h: s });
}

function box(slide, { x, y, w, h, text: t, fill = COL.COBALT, color = COL.WHITE, size = 13, bold = true, line: ln, radius = 0.08, align = 'center', valign = 'middle', font = FONT.body, shadowOn = false, check = true }) {
  if (check) warn(`box "${String(t).slice(0, 18)}"`, textHeight([{ text: String(t), size, bold }], w - 0.16), h);
  const o = {
    x, y, w, h,
    shape: radius > 0 ? SHAPE.roundRect : SHAPE.rect,
    fill: { color: fill },
    line: ln ? { color: ln, width: 1 } : { type: 'none' },
    fontFace: font,
    fontSize: size,
    bold,
    color,
    align,
    valign,
    margin: [0.04, 0.08, 0.04, 0.08]
  };
  if (radius > 0) o.rectRadius = radius;
  if (shadowOn) o.shadow = shadow();
  slide.addText(t, o);
}

// ───────────────────────── Registro de diapositivas y pies ─────────────────────────
function register(slideObj, meta) {
  state.n += 1;
  const rec = { n: state.n, ...meta };
  state.slides.push(rec);
  state.cur = rec;
  return rec;
}

function footer(slideObj, n, mod, dark = false) {
  const c = dark ? COL.STEEL : COL.MUTED;
  slideObj.addText('Curso Docker Fundamentals · 20 Horas (4 Días x 5h)', {
    x: MX, y: 7.0, w: 7, h: 0.3,
    fontFace: FONT.body, fontSize: 10, color: c, margin: 0, valign: 'middle'
  });
  slideObj.addText(`${MODULES[mod] ? MODULES[mod].split(' · ')[0] : ''}   |   ${n}`, {
    x: W - MX - 5, y: 7.0, w: 5, h: 0.3,
    fontFace: FONT.body, fontSize: 10, color: c, margin: 0, align: 'right', valign: 'middle'
  });
}

/**
 * Diapositiva de contenido estándar con cabecera (píldora badge + título 32pt) y pie.
 */
function slide(pres, { mod, badge, title, notes: nt, lab = false, bg = COL.BG }) {
  if (!nt) throw new Error(`slide "${title}": faltan notas del orador obligatorias`);
  const s = pres.addSlide();
  s.background = { color: bg };
  const rec = register(s, { mod, title, lab, kind: 'content' });
  const label = (lab ? 'LABORATORIO PRÁCTICO · ' : '') + String(badge || '').toUpperCase();
  const bw = Math.max(1.8, label.length * 0.095 + 0.6);
  pill(s, label, { x: MX, y: 0.38, w: bw, fill: lab ? COL.CORAL : COL.COBALT });
  s.addText(title, {
    x: MX, y: 0.78, w: CW, h: 0.78,
    fontFace: FONT.head, fontSize: 32, bold: true, color: COL.NAVY, margin: 0, valign: 'middle'
  });
  footer(s, rec.n, mod);
  s.addNotes(typeof nt === 'string' ? nt : notes(nt));
  return s;
}

/**
 * Diapositiva de portada (fondo oscuro DEEP con Docker whale / composiciones satélite).
 */
function titleSlide(pres, { title, subtitle, tag, notes: nt }) {
  const s = pres.addSlide();
  s.background = { color: COL.DEEP };
  const rec = register(s, { mod: 0, title, kind: 'title' });

  // Composición decorativa: círculos orbitales concéntricos y satélites
  s.addShape(SHAPE.ellipse, { x: 8.0, y: 0.9, w: 5.2, h: 5.2, fill: { color: COL.COBALT, transparency: 75 }, line: { type: 'none' } });
  s.addShape(SHAPE.ellipse, { x: 8.65, y: 1.55, w: 3.9, h: 3.9, fill: { color: COL.COBALT, transparency: 50 }, line: { type: 'none' } });
  iconCircle(s, 'FaDocker', 9.45, 2.35, 2.3, { fill: COL.CYAN, color: COL.NAVY });

  const sat = [
    ['FaCubes', 8.1, 1.25],
    ['FaNetworkWired', 12.0, 1.45],
    ['FaHdd', 8.4, 5.15],
    ['FaShieldAlt', 11.9, 5.05]
  ];
  sat.forEach(([iconName, x, y]) => iconCircle(s, iconName, x, y, 0.75, { fill: COL.NAVY, color: COL.CYAN }));

  pill(s, tag || 'CURSO TÉCNICO OFICIAL · 20 HORAS', { x: 0.8, y: 1.55, w: 3.6, h: 0.36, fill: COL.CYAN, color: COL.NAVY, size: 11 });
  s.addText(title, {
    x: 0.8, y: 2.15, w: 7.2, h: 2.3,
    fontFace: FONT.head, fontSize: 44, bold: true, color: COL.WHITE, margin: 0, valign: 'top'
  });
  s.addText(subtitle, {
    x: 0.8, y: 4.65, w: 7.0, h: 1.2,
    fontFace: FONT.body, fontSize: 18, color: COL.STEEL, margin: 0, valign: 'top'
  });

  footer(s, rec.n, 0, true);
  s.addNotes(typeof nt === 'string' ? nt : notes(nt));
  return s;
}

/**
 * Separador de módulo: Fondo oscuro DEEP, marca de agua de 120pt, píldora de horas y lista de temas con iconos.
 */
function divider(pres, { mod, title, subtitle, hours, topics, notes: nt }) {
  const s = pres.addSlide();
  s.background = { color: COL.DEEP };
  const rec = register(s, { mod, title, kind: 'divider' });

  // Marca de agua numérica gigante
  s.addText(String(mod).padStart(2, '0'), {
    x: 0.8, y: 0.8, w: 5.5, h: 2.1,
    fontFace: FONT.head, fontSize: 120, bold: true, color: '13335F', margin: 0, valign: 'top'
  });

  pill(s, `MÓDULO ${mod} · ${hours}`, { x: 0.8, y: 3.15, w: 3.0, h: 0.36, fill: COL.CYAN, color: COL.NAVY, size: 11 });
  s.addText(title, {
    x: 0.8, y: 3.7, w: 5.9, h: 1.7,
    fontFace: FONT.head, fontSize: 36, bold: true, color: COL.WHITE, margin: 0, valign: 'top'
  });
  s.addText(subtitle, {
    x: 0.8, y: 5.45, w: 5.9, h: 0.9,
    fontFace: FONT.body, fontSize: 16, color: COL.STEEL, margin: 0, valign: 'top'
  });

  const n = topics.length;
  const rowH = Math.min(0.85, 5.2 / n);
  const y0 = (H - rowH * n) / 2 - 0.1;
  topics.forEach((t, i) => {
    const y = y0 + i * rowH;
    s.addShape(SHAPE.roundRect, {
      x: 7.3, y: y + 0.05, w: 5.4, h: rowH - 0.12,
      rectRadius: 0.1, fill: { color: COL.WHITE, transparency: 92 }, line: { type: 'none' }
    });
    iconCircle(s, t.icon, 7.45, y + (rowH - 0.5) / 2, 0.5, { fill: COL.CYAN, color: COL.NAVY });
    s.addText(t.text, {
      x: 8.15, y: y + 0.05, w: 4.4, h: rowH - 0.12,
      fontFace: FONT.body, fontSize: 16, color: COL.WHITE, margin: 0, valign: 'middle'
    });
  });

  footer(s, rec.n, mod, true);
  s.addNotes(typeof nt === 'string' ? nt : notes(nt));
  return s;
}

/**
 * Diapositiva de cierre y resumen del curso.
 */
function closing(pres, { mod = 5, title, points, notes: nt }) {
  const s = pres.addSlide();
  s.background = { color: COL.DEEP };
  const rec = register(s, { mod, title, kind: 'closing' });

  s.addText(title, {
    x: 0.8, y: 0.65, w: 11.7, h: 0.9,
    fontFace: FONT.head, fontSize: 36, bold: true, color: COL.WHITE, margin: 0, valign: 'middle'
  });

  const n = points.length;
  const cw = (11.7 - (n - 1) * 0.28) / n;
  points.forEach((p, i) => {
    const x = 0.8 + i * (cw + 0.28);
    s.addShape(SHAPE.roundRect, {
      x, y: 1.85, w: cw, h: 4.75,
      rectRadius: 0.12, fill: { color: COL.WHITE, transparency: 90 }, line: { type: 'none' }
    });
    iconCircle(s, p.icon, x + 0.25, 2.1, 0.65, { fill: COL.CYAN, color: COL.NAVY });
    s.addText(p.title, {
      x: x + 0.22, y: 2.9, w: cw - 0.44, h: 0.65,
      fontFace: FONT.head, fontSize: 17, bold: true, color: COL.WHITE, margin: 0, valign: 'top'
    });
    s.addText(p.text, {
      x: x + 0.22, y: 3.65, w: cw - 0.44, h: 2.7,
      fontFace: FONT.body, fontSize: 12.5, color: 'DCE6F2', margin: 0, valign: 'top'
    });
  });

  footer(s, rec.n, mod, true);
  s.addNotes(typeof nt === 'string' ? nt : notes(nt));
  return s;
}

// ───────────────────────── Componentes de contenido ─────────────────────────
function bulletRuns(items, { size = 15, color = COL.TEXT, leadColor = COL.NAVY, after = 6 } = {}) {
  const runs = [];
  const paras = [];
  const push = (it, level) => {
    const lead = typeof it === 'object' && it.lead ? it.lead : null;
    const txt = typeof it === 'string' ? it : it.text || '';
    const sz = level ? size - 1 : size;
    const base = { bullet: { indent: level ? 14 : 16 }, indentLevel: level, paraSpaceAfter: after, fontFace: FONT.body, fontSize: sz, color };
    if (lead) {
      runs.push({ text: lead + ' ', options: { ...base, bold: true, color: leadColor } });
      runs.push({ text: txt, options: { fontFace: FONT.body, fontSize: sz, color, breakLine: true } });
    } else {
      runs.push({ text: txt, options: { ...base, breakLine: true } });
    }
    paras.push({ text: (lead ? lead + ' ' : '') + txt, size: sz, bold: false, after, indent: level ? 0.55 : 0.3 });
    if (typeof it === 'object' && it.sub) it.sub.forEach((s2) => push(s2, 1));
  };
  items.forEach((it) => push(it, 0));
  if (runs.length) {
    runs[runs.length - 1].options = { ...runs[runs.length - 1].options, breakLine: false };
  }
  return { runs, paras };
}

function bullets(slideObj, items, { x, y, w, h, size = 15, color = COL.TEXT, leadColor = COL.NAVY, after = 6, valign = 'top' }) {
  const { runs } = bulletRuns(items, { size, color, leadColor, after });
  slideObj.addText(runs, { x, y, w, h, margin: 0, valign });
}

/**
 * Tarjeta rectangular con elevación, sombra suave e icono superior o lateral opcional.
 */
function card(slideObj, { x, y, w, h, title, body, bullets: bl, icon, tone = 'light', size = 13, titleSize = 16, accent, side = false }) {
  if (side && icon) return cardSide(slideObj, { x, y, w, h, title, body, icon, tone, size, titleSize, accent });
  const dark = tone === 'dark';
  const fill = dark ? COL.COBALT : tone === 'tint' ? COL.ICE : COL.WHITE;
  rect(slideObj, { x, y, w, h, fill, radius: 0.12, shadowOn: tone === 'light', line: tone === 'light' ? COL.LINE : null });
  const tc = dark ? COL.WHITE : COL.NAVY;
  const bc = dark ? 'E6EEF8' : COL.TEXT;
  const pad = 0.25;
  let ty = y + pad;

  if (icon) {
    iconCircle(slideObj, icon, x + pad, ty, 0.55, { fill: accent || (dark ? COL.CYAN : COL.COBALT), color: dark ? COL.NAVY : COL.WHITE });
    slideObj.addText(title, {
      x: x + pad + 0.7, y: ty, w: w - 2 * pad - 0.7, h: 0.55,
      fontFace: FONT.head, fontSize: titleSize, bold: true, color: tc, margin: 0, valign: 'middle'
    });
    ty += 0.72;
  } else {
    const th = (lineCount(title, w - 2 * pad, titleSize, true) * titleSize * 1.2) / 72;
    slideObj.addText(title, {
      x: x + pad, y: ty, w: w - 2 * pad, h: th,
      fontFace: FONT.head, fontSize: titleSize, bold: true, color: tc, margin: 0, valign: 'top'
    });
    ty += th + 0.12;
  }

  const bh = y + h - ty - pad;
  if (bl) {
    bullets(slideObj, bl, { x: x + pad, y: ty, w: w - 2 * pad, h: bh, size, color: bc, leadColor: dark ? COL.CYAN : COL.NAVY, after: 4 });
  } else if (body) {
    slideObj.addText(body, {
      x: x + pad, y: ty, w: w - 2 * pad, h: bh,
      fontFace: FONT.body, fontSize: size, color: bc, margin: 0, valign: 'top'
    });
  }
}

/**
 * Tarjeta horizontal compacta (icono lateral izquierdo, título y cuerpo a la derecha).
 */
function cardSide(slideObj, { x, y, w, h, title, body, icon, tone, size = 13, titleSize = 16, accent }) {
  const dark = tone === 'dark';
  rect(slideObj, { x, y, w, h, fill: dark ? COL.COBALT : tone === 'tint' ? COL.ICE : COL.WHITE, radius: 0.12, shadowOn: tone === 'light', line: tone === 'light' ? COL.LINE : null });
  const pad = 0.22, d = 0.65;
  iconCircle(slideObj, icon, x + pad, y + (h - d) / 2, d, { fill: accent || (dark ? COL.CYAN : COL.COBALT), color: dark ? COL.NAVY : COL.WHITE });
  const tx = x + pad + d + 0.22, tw = w - pad * 2 - d - 0.22;
  slideObj.addText([
    { text: title, options: { bold: true, fontSize: titleSize, color: dark ? COL.WHITE : COL.NAVY, fontFace: FONT.head, breakLine: true } },
    { text: body, options: { fontSize: size, color: dark ? 'E6EEF8' : COL.TEXT, fontFace: FONT.body } }
  ], { x: tx, y: y + 0.1, w: tw, h: h - 0.2, margin: 0, valign: 'middle', paraSpaceAfter: 3 });
}

function cardsRow(slideObj, cards, { x = CX, y = CY, w = CW, h = CH, gap = 0.28, size = 13, titleSize = 16 } = {}) {
  const n = cards.length;
  const cw = (w - gap * (n - 1)) / n;
  cards.forEach((c, i) => card(slideObj, { size, titleSize, ...c, x: x + i * (cw + gap), y, w: cw, h }));
}

function cardsGrid(slideObj, cards, { cols = 2, x = CX, y = CY, w = CW, h = CH, gap = 0.28, size = 13, titleSize = 15 } = {}) {
  const rows = Math.ceil(cards.length / cols);
  const cw = (w - gap * (cols - 1)) / cols;
  const ch = (h - gap * (rows - 1)) / rows;
  cards.forEach((c, i) => card(slideObj, { size, titleSize, ...c, x: x + (i % cols) * (cw + gap), y: y + Math.floor(i / cols) * (ch + gap), w: cw, h: ch }));
}

/**
 * Bloque de código con fondo oscuro de consola (estilo terminal moderna).
 */
function code(slideObj, { x, y, w, h, code: src, label = 'BASH / DOCKER CLI', size = 10.5, dark = true, wrap = false }) {
  const bg = dark ? COL.CODEBG : COL.ICE;
  const ln = dark ? null : COL.LINE;
  rect(slideObj, { x, y, w, h, fill: bg, radius: 0.1, line: ln });

  // Píldora de encabezado de consola
  slideObj.addText(label, {
    x: x + 0.2, y: y + 0.1, w: Math.min(4.5, w - 0.4), h: 0.24,
    fontFace: FONT.body, fontSize: 9.5, bold: true, color: dark ? COL.CYAN : COL.COBALT, margin: 0, charSpacing: 1
  });

  const lines = src.replace(/\n+$/, '').split('\n');
  const runs = [];
  lines.forEach((l, idx) => {
    let col = dark ? COL.CODETEXT : COL.TEXT;
    let bld = false;
    if (l.trim().startsWith('#')) {
      col = dark ? '64748B' : '6B7280'; // Comentario
    } else if (
      l.trim().startsWith('docker ') ||
      l.trim().startsWith('FROM ') ||
      l.trim().startsWith('RUN ') ||
      l.trim().startsWith('COPY ') ||
      l.trim().startsWith('kubectl ') ||
      l.trim().startsWith('gcloud ')
    ) {
      col = dark ? '38BDF8' : '0284C7'; // Comando o instrucción
      bld = true;
    }
    runs.push({ text: l, options: { fontFace: FONT.code, fontSize: size, color: col, bold: bld, breakLine: idx < lines.length - 1 } });
  });

  slideObj.addText(runs, {
    x: x + 0.2, y: y + 0.38, w: w - 0.38, h: h - 0.44,
    margin: 0, valign: 'top', fontFace: FONT.code, fontSize: size, wrap: wrap
  });
}

/**
 * Tabla técnica con cabecera en Navy y filas alternas blanco/hielo.
 */
function table(slideObj, rows, { x = CX, y = CY, w = CW, colW, size = 12, headSize = 13, firstColBold = true, maxH = CH }) {
  const n = rows[0].length;
  const cw = colW || Array(n).fill(w / n);
  const sum = cw.reduce((a, b) => a + b, 0);
  const cws = cw.map((c) => (c * w) / sum);
  const hs = headSize || size;

  let total = 0;
  const rowH = rows.map((r, ri) => {
    const lines = Math.max(...r.map((c, ci) => lineCount(typeof c === 'string' ? c : c.text, cws[ci] - 0.24, ri === 0 ? hs : size, ri === 0 || (ci === 0 && firstColBold))));
    const hgt = (lines * (ri === 0 ? hs : size) * 1.2) / 72 + 0.18;
    total += hgt;
    return hgt;
  });

  const data = rows.map((r, ri) =>
    r.map((c, ci) => {
      const o = typeof c === 'string' ? { text: c } : c;
      const head = ri === 0;
      return {
        text: o.text,
        options: {
          fontFace: FONT.body,
          fontSize: head ? hs : size,
          bold: head || o.bold || (ci === 0 && firstColBold),
          color: head ? COL.WHITE : o.color || (ci === 0 && firstColBold ? COL.NAVY : COL.TEXT),
          fill: { color: head ? COL.NAVY : o.fill || (ri % 2 ? COL.WHITE : COL.ICE) },
          valign: 'middle',
          align: 'left',
          margin: [0.05, 0.12, 0.05, 0.12],
          border: { type: 'solid', color: COL.LINE, pt: 0.75 },
        },
      };
    })
  );

  slideObj.addTable(data, { x, y, w, colW: cws, rowH });
  return total;
}

/**
 * Secuencia de pasos numerados horizontales con flechas.
 */
function steps(slideObj, items, { x = CX, y = CY, w = CW, h = CH, dir = 'h', gap = 0.32, size = 12, accent = COL.COBALT } = {}) {
  const n = items.length;
  if (dir === 'h') {
    const cw = (w - gap * (n - 1)) / n;
    items.forEach((it, i) => {
      const cx = x + i * (cw + gap);
      rect(slideObj, { x: cx, y, w: cw, h, fill: COL.WHITE, radius: 0.12, shadowOn: true, line: COL.LINE });
      slideObj.addShape(SHAPE.ellipse, { x: cx + 0.2, y: y + 0.2, w: 0.48, h: 0.48, fill: { color: accent }, line: { type: 'none' } });
      slideObj.addText(String(i + 1), {
        x: cx + 0.2, y: y + 0.2, w: 0.48, h: 0.48,
        fontFace: FONT.head, fontSize: 16, bold: true, color: COL.WHITE, align: 'center', valign: 'middle', margin: 0
      });
      slideObj.addText(it.title, {
        x: cx + 0.2, y: y + 0.78, w: cw - 0.4, h: 0.38,
        fontFace: FONT.head, fontSize: 15, bold: true, color: COL.NAVY, margin: 0, valign: 'top'
      });
      slideObj.addText(it.body, {
        x: cx + 0.2, y: y + 1.22, w: cw - 0.4, h: h - 1.34,
        fontFace: FONT.body, fontSize: size, color: COL.TEXT, margin: 0, valign: 'top'
      });
      if (i < n - 1) {
        slideObj.addShape(SHAPE.rightArrow, {
          x: cx + cw + 0.04, y: y + 0.35, w: gap - 0.08, h: 0.26,
          fill: { color: COL.CYAN }, line: { type: 'none' }
        });
      }
    });
  }
}

/**
 * Cifra destacada o métrica de impacto.
 */
function stat(slideObj, { x, y, w, h, value, label, tone = 'light', valueSize = 42 }) {
  const dark = tone === 'dark';
  rect(slideObj, { x, y, w, h, fill: dark ? COL.NAVY : COL.WHITE, radius: 0.12, shadowOn: !dark, line: dark ? null : COL.LINE });
  slideObj.addText(value, {
    x: x + 0.2, y: y + 0.12, w: w - 0.4, h: h * 0.5,
    fontFace: FONT.head, fontSize: valueSize, bold: true, color: dark ? COL.WHITE : COL.CORAL, margin: 0, align: 'center', valign: 'middle'
  });
  slideObj.addText(label, {
    x: x + 0.2, y: y + h * 0.52, w: w - 0.4, h: h * 0.42,
    fontFace: FONT.body, fontSize: 12.5, color: dark ? 'DCE6F2' : COL.MUTED, margin: 0, align: 'center', valign: 'top'
  });
}

/**
 * Caja de alerta / callout (warn, tip, info) con icono de advertencia / bombilla.
 */
function callout(slideObj, { x, y, w, h, text: t, kind = 'tip', size = 13.5, lead }) {
  const warnK = kind === 'warn';
  rect(slideObj, { x, y, w, h, fill: warnK ? COL.WARNBG : COL.ICE, radius: 0.12 });
  const ic = warnK ? 'FaExclamationTriangle' : kind === 'info' ? 'FaCheckCircle' : 'FaLightbulb';
  const d = 0.5;
  iconCircle(slideObj, ic, x + 0.2, y + (h - d) / 2, d, { fill: warnK ? COL.CORAL : COL.COBALT, color: COL.WHITE });
  const runs = lead
    ? [{ text: lead + ' ', options: { bold: true, color: warnK ? 'A8431F' : COL.NAVY } }, { text: t, options: {} }]
    : [{ text: t, options: {} }];
  slideObj.addText(runs, {
    x: x + 0.88, y, w: w - 1.05, h,
    fontFace: FONT.body, fontSize: size, color: COL.TEXT, margin: 0, valign: 'middle'
  });
}

module.exports = {
  pptxgen, SHAPE, COL, FONT, W, H, MX, CX, CW, CY, CH, MODULES, state,
  preloadIcons, iconData, lineCount, textHeight, warn,
  notes, slide, titleSlide, divider, closing,
  rect, line, text, pill, iconCircle, box, bullets, card, cardSide, cardsRow, cardsGrid, code, table, steps, stat, callout,
};
