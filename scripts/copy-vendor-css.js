#!/usr/bin/env node

/**
 * Script para copiar CSS de vendor desde node_modules a src/styles/vendor
 * Ejecutar con: node scripts/copy-vendor-css.js
 */

const fs = require('fs');
const path = require('path');

const vendorCss = [
  {
    from: path.join(__dirname, '../node_modules/react-widgets/styles.css'),
    to: path.join(__dirname, '../src/styles/vendor/react-widgets.css'),
  },
  {
    from: path.join(
      __dirname,
      '../node_modules/suneditor/dist/css/suneditor.min.css'
    ),
    to: path.join(__dirname, '../src/styles/vendor/suneditor.css'),
  },
  {
    // Swiper puede tener diferentes rutas según la versión
    from: [
      path.join(__dirname, '../node_modules/swiper/css/swiper.min.css'),
      path.join(__dirname, '../node_modules/swiper/css/swiper.css'),
      path.join(__dirname, '../node_modules/swiper/swiper.min.css'),
    ],
    to: path.join(__dirname, '../src/styles/vendor/swiper.css'),
  },
  {
    from: path.join(
      __dirname,
      '../node_modules/swiper/modules/navigation/navigation.min.css'
    ),
    to: path.join(__dirname, '../src/styles/vendor/swiper-navigation.css'),
  },
  {
    from: path.join(
      __dirname,
      '../node_modules/swiper/modules/pagination/pagination.min.css'
    ),
    to: path.join(__dirname, '../src/styles/vendor/swiper-pagination.css'),
  },
  {
    from: path.join(
      __dirname,
      '../node_modules/swiper/modules/scrollbar/scrollbar.min.css'
    ),
    to: path.join(__dirname, '../src/styles/vendor/swiper-scrollbar.css'),
  },
];

// Asegurar que el directorio existe
const vendorDir = path.join(__dirname, '../src/styles/vendor');
if (!fs.existsSync(vendorDir)) {
  fs.mkdirSync(vendorDir, { recursive: true });
}

console.log('Copiando CSS de vendor...');

vendorCss.forEach(({ from, to }) => {
  let sourceFile = null;

  // Si from es un array, buscar el primer archivo que exista
  if (Array.isArray(from)) {
    sourceFile = from.find((f) => fs.existsSync(f));
  } else {
    sourceFile = fs.existsSync(from) ? from : null;
  }

  if (sourceFile) {
    fs.copyFileSync(sourceFile, to);
    console.log(
      `✓ Copiado: ${path.basename(sourceFile)} → ${path.relative(
        process.cwd(),
        to
      )}`
    );
  } else {
    const filesToCheck = Array.isArray(from) ? from : [from];
    console.warn(
      `⚠ No encontrado: ${filesToCheck
        .map((f) => path.basename(f))
        .join(' o ')}`
    );
    console.warn(`  Intentó buscar en: ${filesToCheck[0]}`);

    // Crear un archivo vacío para evitar errores de módulo no encontrado
    fs.writeFileSync(
      to,
      '/* Archivo CSS de vendor - copiar manualmente desde node_modules */\n'
    );
    console.warn(
      `  ⚠ Creado archivo vacío: ${path.relative(process.cwd(), to)}`
    );
  }
});

console.log(
  '\n¡Completado! Los CSS de vendor han sido copiados a src/styles/vendor/'
);
