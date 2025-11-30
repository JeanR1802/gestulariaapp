/**
 * Script de diagnóstico para debuggear el renderizado del sitio público
 * 
 * Ejecutar con: node test-public-site-debug.js
 * 
 * Este script simula lo que hace el GET route de /api/site/[slug]
 * y muestra exactamente qué datos se están procesando.
 */

const { getTenantBySlug } = require('./lib/tenant');

async function testPublicSiteRendering() {
  console.log('🔍 === INICIANDO DIAGNÓSTICO DE SITIO PÚBLICO ===\n');

  // Cambiar este slug por el que estés probando
  const testSlug = 'mitienda'; // CAMBIAR ESTO por tu slug de prueba

  console.log(`1️⃣ Buscando tenant con slug: "${testSlug}"`);
  const tenant = await getTenantBySlug(testSlug);
  
  if (!tenant) {
    console.log('❌ Tenant NO encontrado');
    return;
  }

  console.log('✅ Tenant encontrado:', {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    pagesCount: tenant.pages?.length || 0
  });

  console.log('\n2️⃣ Buscando página principal (slug="/" y published=true)');
  const page = tenant.pages.find((p) => p.slug === '/' && p.published) || tenant.pages[0];
  
  if (!page) {
    console.log('❌ Página NO encontrada');
    return;
  }

  console.log('✅ Página encontrada:', {
    title: page.title,
    slug: page.slug,
    published: page.published,
    hasContent: !!page.content,
    contentLength: page.content?.length || 0
  });

  if (!page.content) {
    console.log('❌ La página NO tiene contenido (page.content está vacío)');
    return;
  }

  console.log('\n3️⃣ Parseando contenido como JSON');
  let blocks;
  try {
    blocks = JSON.parse(page.content);
    console.log('✅ Contenido parseado correctamente');
    console.log('   Es array:', Array.isArray(blocks));
    console.log('   Cantidad de elementos:', Array.isArray(blocks) ? blocks.length : 'N/A');
  } catch (e) {
    console.log('❌ Error al parsear JSON:', e.message);
    console.log('   Contenido (primeros 200 caracteres):', page.content.substring(0, 200));
    return;
  }

  if (!Array.isArray(blocks)) {
    console.log('❌ El contenido parseado NO es un array');
    console.log('   Tipo:', typeof blocks);
    console.log('   Valor:', blocks);
    return;
  }

  if (blocks.length === 0) {
    console.log('⚠️  El array de bloques está VACÍO');
    return;
  }

  console.log('\n4️⃣ Analizando bloques individuales');
  blocks.forEach((block, index) => {
    console.log(`\n   Bloque ${index + 1}/${blocks.length}:`);
    console.log('   - ID:', block.id || '(sin id)');
    console.log('   - Tipo:', block.type || '(sin tipo)');
    console.log('   - Tiene data:', !!block.data);
    
    if (block.type === 'header') {
      console.log('   - Header variant:', block.data?.variant || '(sin variant)');
      console.log('   - Header mode:', block.data?.headerMode || '(sin headerMode)');
      console.log('   - Logo text:', block.data?.logoText || '(sin logoText)');
      
      if (block.data?.variant === 'custom') {
        console.log('   - Custom elements:', block.data?.customElements?.length || 0);
        if (block.data?.customElements) {
          block.data.customElements.forEach((el, i) => {
            console.log(`     ${i + 1}. ${el.type} en zona ${el.data?.zone || 'unknown'}`);
          });
        }
      }
    }

    if (!block.data) {
      console.log('   ⚠️  Este bloque NO tiene datos y no será renderizado');
    }
  });

  console.log('\n5️⃣ Simulando renderizado');
  const { renderBlocksToHTML } = require('./app/lib/render-blocks-to-html');
  
  try {
    const html = await renderBlocksToHTML(blocks, { cssUrl: '/_next/static/css/tailwind.css' });
    console.log('✅ HTML generado correctamente');
    console.log('   Longitud:', html.length, 'caracteres');
    console.log('   Primeros 300 caracteres:');
    console.log('   ', html.substring(0, 300));
    console.log('\n   Últimos 200 caracteres:');
    console.log('   ', html.substring(html.length - 200));
  } catch (e) {
    console.log('❌ Error al renderizar HTML:', e.message);
    console.log('   Stack:', e.stack);
  }

  console.log('\n\n🔍 === DIAGNÓSTICO COMPLETADO ===');
}

// Ejecutar
testPublicSiteRendering().catch(console.error);
