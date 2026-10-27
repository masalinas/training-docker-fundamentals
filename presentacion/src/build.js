'use strict';
/**
 * build.js — Orquestador de ensamblado, corrección XML y exportación a PDF para
 * el curso "Docker Fundamentals" (20 Horas · 81 Diapositivas).
 *
 * Pasos que ejecuta:
 *   1. Detección dinámica y precarga de iconos vectoriales react-icons/fa vía sharp a 300 DPI.
 *   2. Inicialización de presentación pptxgenjs en formato panorámico 16:9 (LAYOUT_WIDE, 13.333" x 7.5").
 *   3. Compilación secuencial de los 5 módulos: m1 (22 slides), m2_m3 (23 slides), m4 (18 slides), m5 (18 slides).
 *   4. Post-procesamiento con JSZip para eliminar etiquetas <a:pPr> duplicadas en los XML de diapositivas.
 *   5. Generación de Docker_Fundamentals_20H.pptx.
 *   6. Exportación headless a Docker_Fundamentals_20H.pdf mediante LibreOffice.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const JSZip = require('jszip');
const H = require('./layout_helpers');
const D = require('./diagrams');

const MODULE_NAMES = (process.env.MODS || 'm1,m2_m3,m4,m5').split(',');
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const OUT_PPTX = process.env.OUT || path.join(ROOT_DIR, 'Docker_Fundamentals_20H.pptx');
const OUT_PDF = OUT_PPTX.replace(/\.pptx$/, '.pdf');

(async () => {
  console.log('================================================================');
  console.log('   COMPILADOR DE PRESENTACIÓN: DOCKER FUNDAMENTALS (20 HORAS)   ');
  console.log('================================================================\n');

  // 1. Detección y precarga automática de iconos referenciados en el código fuente
  console.log('1. Escaneando iconos react-icons/fa utilizados en el proyecto...');
  const files = ['layout_helpers.js', 'diagrams.js', ...MODULE_NAMES.map((m) => `${m}.js`)];
  const iconSet = new Set();
  for (const f of files) {
    const p = path.join(__dirname, f);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf8');
    for (const match of content.matchAll(/\bFa[A-Z][A-Za-z0-9]+\b/g)) {
      iconSet.add(match[0]);
    }
  }
  const icons = Array.from(iconSet).sort();
  console.log(`   Detectados ${icons.length} iconos vectoriales únicos. Rasterizando a 300 DPI...`);
  await H.preloadIcons(icons);
  console.log('   ✓ Iconos vectoriales precargados y cacheados en memoria.\n');

  // 2. Inicialización de la presentación con pptxgenjs
  console.log('2. Configurando lienzo y metadatos de presentación (16:9 Panorámico)...');
  H.state.n = (parseInt(process.env.START || '1', 10) || 1) - 1;
  const pres = new H.pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.333" x 7.5" (16:9)
  pres.title = 'Curso Docker Fundamentals (20 Horas)';
  pres.subject = 'Docker Fundamentals y Cloud Native';
  pres.author = 'Formación Técnica Oficial Docker';
  pres.company = 'Docker Training';

  // 3. Compilación secuencial de módulos
  console.log('3. Generando diapositivas por módulo...');
  for (const modName of MODULE_NAMES) {
    const modPath = path.join(__dirname, `${modName}.js`);
    if (!fs.existsSync(modPath)) {
      console.warn(`   ⚠ Aviso: Módulo no encontrado: ${modName}.js`);
      continue;
    }
    const beforeCount = H.state.n;
    const mod = require(modPath);
    const builderFn = typeof mod === 'function' ? mod : Object.values(mod).find((fn) => typeof fn === 'function');
    if (!builderFn) {
      throw new Error(`No se encontró función constructora en ${modName}.js`);
    }
    await builderFn(pres, H, D);
    const modCount = H.state.n - beforeCount;
    console.log(`   ✓ ${modName}.js: ${modCount} diapositivas (Total acumulado: ${H.state.n})`);
  }

  // 4. Limpieza XML y post-procesamiento con JSZip
  console.log('\n4. Post-procesando estructura OpenXML con JSZip...');
  const rawBuffer = await pres.write({ outputType: 'nodebuffer' });
  const zip = await JSZip.loadAsync(rawBuffer);

  // pptxgenjs emite un <a:pPr> por cada run; en párrafos con varios runs eso genera pPr duplicados
  // que violan la validación estricta del esquema XML en algunas versiones de PowerPoint.
  const PPR_REGEX = /<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g;
  const slideFiles = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));

  for (const slideName of slideFiles) {
    const xml = await zip.file(slideName).async('string');
    const fixedXml = xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (m, inner) => {
      let first = true;
      const body = inner.replace(PPR_REGEX, (pp) => {
        if (first && inner.trimStart().startsWith('<a:pPr')) {
          first = false;
          return pp;
        }
        return '';
      });
      return `<a:p>${body}</a:p>`;
    });
    zip.file(slideName, fixedXml);
  }

  // 5. Guardado del archivo PPTX final
  const cleanBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(OUT_PPTX, cleanBuffer);
  console.log(`   ✓ Presentación guardada: ${OUT_PPTX} (${H.state.n} diapositivas)`);

  if (H.state.warnings.length) {
    console.log(`\n⚠ ${H.state.warnings.length} avisos de maquetación registrados:`);
    H.state.warnings.slice(0, 10).forEach((w) => console.log('   - ' + w));
    if (H.state.warnings.length > 10) {
      console.log(`   ... y ${H.state.warnings.length - 10} avisos adicionales.`);
    }
  } else {
    console.log('   ✓ Sin advertencias de desbordamiento de texto.');
  }

  // 6. Conversión a PDF mediante LibreOffice headless
  console.log('\n5. Exportando a formato PDF con LibreOffice headless...');
  try {
    const outDir = path.dirname(OUT_PPTX);
    execSync(`soffice --headless --convert-to pdf "${OUT_PPTX}" --outdir "${outDir}"`, {
      stdio: 'pipe',
      timeout: 60000,
    });
    if (fs.existsSync(OUT_PDF)) {
      const stats = fs.statSync(OUT_PDF);
      console.log(`   ✓ PDF exportado exitosamente: ${OUT_PDF} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      console.warn('   ⚠ No se localizó el archivo PDF exportado tras ejecutar soffice.');
    }
  } catch (err) {
    console.error('   ✖ Error exportando a PDF con LibreOffice:', err.message);
  }

  console.log('\n================================================================');
  console.log('               PROCESO DE GENERACIÓN COMPLETADO                 ');
  console.log('================================================================');
})().catch((err) => {
  console.error('\n✖ Error fatal durante la generación:', err);
  process.exit(1);
});
