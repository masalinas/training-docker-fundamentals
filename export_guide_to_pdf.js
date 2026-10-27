'use strict';
/**
 * export_guide_to_pdf.js — Exportador de GUIA_DEL_DOCENTE.md a PDF de alta resolución.
 *
 * Utiliza:
 *   - marked: Renderizado de Markdown con GitHub Flavored Markdown (tablas, viñetas, saltos).
 *   - highlight.js: Resaltado sintáctico de fragmentos Bash, Dockerfile, YAML y SQL.
 *   - playwright: Motor Chromium headless para generación de PDF con formato A4, encabezados y numeración.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');
const { chromium } = require('playwright');

const ROOT_DIR = __dirname;
const MD_PATH = path.join(ROOT_DIR, 'GUIA_DEL_DOCENTE.md');
const PDF_PATH = path.join(ROOT_DIR, 'GUIA_DEL_DOCENTE.pdf');

// Configuración de marked con highlight.js
marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    code({ text, lang }) {
      const language = (lang && hljs.getLanguage(lang)) ? lang : 'bash';
      let highlighted = '';
      try {
        highlighted = hljs.highlight(text, { language }).value;
      } catch (e) {
        highlighted = text;
      }
      return `<div class="code-wrapper"><div class="code-badge">${language.toUpperCase()}</div><pre><code class="hljs ${language}">${highlighted}</code></pre></div>`;
    },
    table(header, body) {
      return `<div class="table-container"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    }
  }
});

(async () => {
  console.log('================================================================');
  console.log('       EXPORTANDO GUÍA DOCENTE: MARKDOWN -> PDF PROFESIONAL     ');
  console.log('================================================================\n');

  if (!fs.existsSync(MD_PATH)) {
    throw new Error(`No se encontró el archivo Markdown en: ${MD_PATH}`);
  }

  console.log(`1. Leyendo contenido de ${path.basename(MD_PATH)}...`);
  const rawMd = fs.readFileSync(MD_PATH, 'utf8');

  console.log('2. Procesando y transformando sintaxis Markdown a HTML...');
  // Pre-procesar diapositivas para encapsularlas en tarjetas de página con page-break-inside: avoid
  let processedMd = rawMd;

  // Renderizar a HTML
  const bodyHtml = marked.parse(processedMd);

  // Plantilla HTML completa con CSS optimizado para impresión A4
  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Guía del Docente · Curso Docker Fundamentals (20 Horas)</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 14mm 14mm 14mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 9pt;
      line-height: 1.5;
      color: #1F2933;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }

    /* Portada de la Guía */
    .cover-page {
      background: linear-gradient(135deg, #081528 0%, #0B2545 100%);
      color: #FFFFFF;
      padding: 40px 35px;
      border-radius: 8px;
      margin-bottom: 25px;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 85vh;
    }

    .cover-tag {
      display: inline-block;
      background-color: #0DB7ED;
      color: #0B2545;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 4px 12px;
      border-radius: 12px;
      margin-bottom: 20px;
      text-transform: uppercase;
      align-self: flex-start;
    }

    .cover-title {
      font-size: 28pt;
      font-weight: 800;
      line-height: 1.2;
      color: #FFFFFF;
      margin: 0 0 15px 0;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #8DA9C4;
      line-height: 1.4;
      margin: 0 0 30px 0;
      border-left: 3px solid #0DB7ED;
      padding-left: 14px;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 18px;
      margin-top: 20px;
    }

    .cover-meta-item {
      display: flex;
      flex-direction: column;
    }

    .cover-meta-label {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8DA9C4;
      margin-bottom: 3px;
    }

    .cover-meta-value {
      font-size: 10pt;
      font-weight: 600;
      color: #FFFFFF;
    }

    /* Tipografía General */
    h1 {
      font-size: 18pt;
      font-weight: 700;
      color: #0B2545;
      border-bottom: 2px solid #0DB7ED;
      padding-bottom: 6px;
      margin-top: 30px;
      margin-bottom: 15px;
      page-break-after: avoid;
    }

    h2 {
      font-size: 14pt;
      font-weight: 700;
      color: #0B2545;
      border-bottom: 1.5px solid #E2E8F0;
      padding-bottom: 5px;
      margin-top: 24px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #134074;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0B2545;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-top: 0;
      margin-bottom: 8px;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 10px;
      padding-left: 20px;
    }

    li {
      margin-bottom: 4px;
    }

    blockquote {
      background-color: #E8EEF5;
      border-left: 4px solid #0DB7ED;
      margin: 12px 0;
      padding: 10px 14px;
      border-radius: 4px;
      color: #0B2545;
      font-size: 9pt;
    }

    blockquote p:last-child {
      margin-bottom: 0;
    }

    /* Tablas Técnicas */
    .table-container {
      margin: 12px 0;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      background-color: #FFFFFF;
    }

    th {
      background-color: #0B2545;
      color: #FFFFFF;
      font-weight: 600;
      text-align: left;
      padding: 6px 10px;
      border: 1px solid #0B2545;
    }

    td {
      padding: 6px 10px;
      border: 1px solid #D0D7DE;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #F8F9FA;
    }

    /* Bloques de Código */
    .code-wrapper {
      position: relative;
      margin: 10px 0;
      border-radius: 6px;
      overflow: hidden;
      background-color: #1E293B;
      page-break-inside: avoid;
    }

    .code-badge {
      position: absolute;
      top: 4px;
      right: 8px;
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 1px;
      color: #0DB7ED;
      background: rgba(13, 183, 237, 0.15);
      padding: 2px 6px;
      border-radius: 3px;
    }

    pre {
      margin: 0;
      padding: 10px 12px;
      overflow-x: auto;
      background-color: #1E293B;
    }

    code {
      font-family: "Consolas", "Courier New", monospace;
      font-size: 8.5pt;
    }

    pre code {
      color: #E2E8F0;
      line-height: 1.4;
    }

    p code, li code {
      background-color: #E8EEF5;
      color: #0B2545;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 8pt;
      border: 1px solid #D0D7DE;
    }

    /* Resaltado de Sintaxis (hljs) */
    .hljs-comment { color: #64748B; font-style: italic; }
    .hljs-keyword { color: #38BDF8; font-weight: bold; }
    .hljs-string { color: #F59E0B; }
    .hljs-number { color: #EC4899; }
    .hljs-title, .hljs-function { color: #A78BFA; }

    /* Separadores y Tarjetas */
    hr {
      border: none;
      border-top: 1px solid #E2E8F0;
      margin: 18px 0;
    }

    /* Control de Paginación */
    .page-break {
      page-break-after: always;
    }

    /* Estilo para las secciones de diapositivas */
    h3[id^="diapositiva-"] {
      background: #E8EEF5;
      color: #0B2545;
      padding: 5px 10px;
      border-left: 4px solid #134074;
      border-radius: 2px;
      margin-top: 22px;
      page-break-after: avoid;
    }
  </style>
</head>
<body>

  <!-- Portada Corporativa -->
  <div class="cover-page">
    <div class="cover-tag">DOCUMENTO OFICIAL · GUÍA DEL DOCENTE</div>
    <h1 class="cover-title">DOCKER FUNDAMENTALS</h1>
    <div class="cover-subtitle">Manual de Vuelo del Instructor para 4 Jornadas de 5 Horas Lectivas (20 Horas Totales)</div>

    <div class="cover-meta-grid">
      <div class="cover-meta-item">
        <span class="cover-meta-label">Curso Técnico</span>
        <span class="cover-meta-value">Docker Fundamentals (4 Días x 5 Horas)</span>
      </div>
      <div class="cover-meta-item">
        <span class="cover-meta-label">Material de Diapositivas</span>
        <span class="cover-meta-value">81 Slides Panorámicas 16:9 con Notas Integradas</span>
      </div>
      <div class="cover-meta-item">
        <span class="cover-meta-label">Metodología Formativa</span>
        <span class="cover-meta-value">50% Exposición Teórica • 50% Laboratorios Prácticos</span>
      </div>
      <div class="cover-meta-item">
        <span class="cover-meta-label">Laboratorios Incluidos</span>
        <span class="cover-meta-value">5 Talleres Guiados con Troubleshooting</span>
      </div>
    </div>
  </div>

  <!-- Contenido íntegro de la guía docente -->
  <div class="content-body">
    ${bodyHtml}
  </div>

</body>
</html>`;

  console.log('3. Levantando motor Chromium headless vía Google Chrome...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  console.log('4. Cargando documento HTML y aplicando estilos de impresión...');
  await page.setContent(fullHtml, { waitUntil: 'networkidle' });

  console.log(`5. Generando archivo PDF A4 en: ${path.basename(PDF_PATH)}...`);
  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      bottom: '16mm',
      left: '14mm',
      right: '14mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 7.5pt; color: #8DA9C4; width: 100%; text-align: right; padding-right: 14mm; font-family: -apple-system, sans-serif;">
        Curso Docker Fundamentals (20 Horas) · Guía del Docente
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 7.5pt; color: #8DA9C4; width: 100%; display: flex; justify-content: space-between; padding-left: 14mm; padding-right: 14mm; font-family: -apple-system, sans-serif;">
        <span>Documento Confidencial de Formación</span>
        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
      </div>
    `
  });

  await browser.close();

  const stats = fs.statSync(PDF_PATH);
  console.log(`\n✓ GUÍA DOCENTE EXPORTADA EXITOSAMENTE:`);
  console.log(`  Ruta: ${PDF_PATH}`);
  console.log(`  Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log('================================================================');
})().catch((err) => {
  console.error('\n✖ Error exportando la Guía Docente a PDF:', err);
  process.exit(1);
});
