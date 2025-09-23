# Documentación General del Proyecto: Editor y Constructor Web Modular

## 1. Descripción General del Sistema

Este proyecto es un editor y constructor web modular orientado a la creación y gestión de sitios web de manera visual y flexible. Permite a los usuarios construir páginas web mediante bloques y componentes reutilizables, gestionando la estructura, el contenido y el diseño desde una interfaz centralizada. El sistema está diseñado para ser multi-tenant (SaaS), permitiendo la administración de múltiples sitios y usuarios.

**Objetivo:**
- Facilitar la creación de sitios web personalizados sin necesidad de programar.
- Permitir la extensión y personalización mediante módulos y bloques reutilizables.
- Mantener una arquitectura escalable y mantenible.

**Funcionamiento general:**
- El usuario edita páginas usando un editor visual basado en bloques.
- Los cambios se procesan y almacenan mediante una API.
- El dashboard permite la gestión de sitios, usuarios y bloques.
- El renderizado final transforma la estructura modular en HTML listo para producción.

## 2. Estructura de Carpetas y Archivos

```
saas-multitenant/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   │   ├── ai/
│   │   │   ├── generate-block/route.js
│   │   │   ├── generate-page-content/route.js
│   │   │   ├── generate-text/route.js
│   │   │   └── list-models/route.js
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── register/route.js
│   │   │   └── verify/route.js
│   │   ├── site/
│   │   │   └── [slug]/route.js
│   │   └── tenants/
│   │       ├── route.js
│   │       ├── [id]/route.js
│   │       └── create/route.js
│   ├── components/
│   │   ├── editor/
│   │   │   ├── BlockRenderer.tsx
│   │   │   ├── blocks/
│   │   │   │   ├── BlockWrapper.tsx
│   │   │   │   ├── CardsBlock.tsx
│   │   │   │   ├── CatalogBlock.tsx
│   │   │   │   ├── CtaBlock.tsx
│   │   │   │   ├── FaqBlock.tsx
│   │   │   │   ├── FeaturedProductBlock.tsx
│   │   │   │   ├── FooterBlock.tsx
│   │   │   │   ├── HeaderBlock.tsx
│   │   │   │   ├── HeroBlock.tsx
│   │   │   │   ├── ImageBlock.tsx
│   │   │   │   ├── InputField.tsx
│   │   │   │   ├── PricingBlock.tsx
│   │   │   │   ├── StackBlock.tsx
│   │   │   │   ├── TeamBlock.tsx
│   │   │   │   ├── TestimonialBlock.tsx
│   │   │   │   ├── TextBlock.tsx
│   │   │   │   ├── Cards/
│   │   │   │   │   └── CardsPreviews.tsx  # Previsualización de CardsBlock
│   │   │   │   ├── Catalog/
│   │   │   │   │   └── CatalogPreviews.tsx
│   │   │   │   ├── Cta/
│   │   │   │   │   └── CtaPreviews.tsx
│   │   │   │   ├── Faq/
│   │   │   │   │   └── FaqPreviews.tsx
│   │   │   │   ├── FeaturedProduct/
│   │   │   │   │   └── FeaturedProductPreviews.tsx
│   │   │   │   ├── Footer/
│   │   │   │   │   └── FooterPreviews.tsx
│   │   │   │   ├── Header/
│   │   │   │   ├── Hero/
│   │   │   │   ├── Image/
│   │   │   │   ├── Pricing/
│   │   │   │   ├── Stack/
│   │   │   │   ├── Team/
│   │   │   │   ├── Testimonial/
│   │   │   │   └── Text/
│   │   │   ├── controls/
│   │   │   │   ├── ButtonColorPalette.tsx
│   │   │   │   ├── ColorPalette.tsx
│   │   │   │   ├── ColorPicker.tsx
│   │   │   │   ├── FloatingToolbar.tsx
│   │   │   │   ├── InlineEditorPanel.tsx
│   │   │   │   ├── MobileBlockEditorModal.tsx
│   │   │   │   ├── TextColorPalette.tsx
│   │   │   │   └── ThemePanel.tsx
│   │   ├── contexts/
│   │   │   └── PreviewModeContext.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── sites/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── lib/
│   │   │   └── render-blocks-to-html.js
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── components/
│   │   ├── SitePreview.tsx
│   │   ├── Layout/
│   │   │   └── DashboardSidebar.tsx
│   │   └── ui/
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── textarea.tsx
│   └── lib/
│       ├── auth.js
│       ├── block-editor-utils.js
│       ├── database.js
│       ├── tenant.js
│       └── utils.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── cls
├── components.json
├── DOCUMENTATION.md
├── eslint.config.mjs
├── git
├── middleware.js
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── setIsVisible(true)
├── setScrollY(window.scrollY)
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── void
├── window.removeEventListener('scroll'
```

## 3. Conexión entre Archivos

### a) Dependencias y relaciones
- **Editor visual:**
  - `BlockRenderer.tsx` importa y utiliza los bloques de `/blocks/` (ej: `CardsBlock.tsx`, `CatalogBlock.tsx`).
  - Cada bloque puede tener su archivo de previsualización en una subcarpeta (ej: `/blocks/Cards/CardsPreviews.tsx` para `CardsBlock.tsx`).
  - Los controles de `/controls/` se usan para modificar propiedades de los bloques.
- **Dashboard:**
  - Usa componentes de UI y consume datos de la API (`/api/tenants/`, `/api/site/`).
- **API:**
  - Los endpoints de `/api/` gestionan autenticación, sitios, tenants y generación de contenido con IA.
  - Usan utilidades de `/lib/` para lógica de negocio y acceso a base de datos.
- **Utilidades:**
  - `/lib/` contiene funciones compartidas usadas por la API, el editor y el dashboard.
- **Componentes UI:**
  - Reutilizados en todo el sistema para inputs, labels, layouts y vistas previas.

### b) Flujo de datos y eventos
1. El usuario edita una página en el editor visual.
2. El editor usa `BlockRenderer.tsx` para renderizar bloques según su tipo.
3. Los controles permiten modificar propiedades de los bloques.
4. Los cambios se envían a la API (`/api/site/`), que usa utilidades de `/lib/` para guardar en la base de datos.
5. El dashboard y otras vistas consumen los datos actualizados desde la API.
6. El renderizado final se realiza usando `render-blocks-to-html.js` para transformar la estructura modular en HTML.

### c) Ejemplo de conexión
- `/blocks/CardsBlock.tsx` define la lógica y estructura del bloque "Cards".
- `/blocks/Cards/CardsPreviews.tsx` muestra previsualizaciones de ese bloque en el editor.
- `BlockRenderer.tsx` decide qué bloque renderizar y puede mostrar la previsualización correspondiente.
- Los cambios en el bloque se propagan a través del editor y la API hasta el almacenamiento y renderizado final.

## 4. Patrones de Diseño y Convenciones

- **Modularidad:** Cada bloque, control y componente es independiente y reutilizable.
- **Separación de lógica y UI:**
  - Lógica y utilidades en `/lib/`.
  - UI y presentación en `/components/`.
- **Nomenclatura:**
  - Bloques: `NombreBlock.tsx` (ej: `CardsBlock.tsx`).
  - Previsualizaciones: `/blocks/Nombre/NombrePreviews.tsx`.
  - Controles: `/controls/NombreControl.tsx`.
- **Componentes funcionales en React/Next.js.**
- **Uso de rutas API para backend (Next.js API Routes).**
- **Convención de carpetas:**
  - `/blocks/` para tipos de bloques.
  - `/controls/` para herramientas de edición.
  - `/lib/` para utilidades y lógica compartida.

## 5. Notas Importantes

- **Impacto global:**
  - Cambios en `/lib/` pueden afectar toda la aplicación (API, editor, dashboard).
  - Cambios en `BlockRenderer.tsx` afectan el renderizado de todos los bloques.
  - Cambios en archivos de la API pueden romper la comunicación con el frontend.
- **Recomendaciones para agregar/cambiar bloques:**
  - Seguir la convención de nombres y estructura de carpetas.
  - Crear un archivo de previsualización en la subcarpeta correspondiente.
  - Probar los cambios en entorno de desarrollo antes de desplegar.
  - Revisar dependencias e imports para evitar romper el flujo de datos.
- **Mantenimiento:**
  - Mantener nombres descriptivos y consistentes.
  - Documentar nuevos bloques y utilidades.

## 6. Ejemplo de Conexión y Flujo

```
Usuario edita una página → Editor visual (BlockRenderer.tsx) renderiza bloques → Controles modifican propiedades → Cambios enviados a API (/api/site/) → Utilidades de /lib/ procesan y guardan datos → Dashboard y vistas consumen datos actualizados → Renderizado final con render-blocks-to-html.js
```

---

Esta documentación es la guía oficial para entender la estructura, dependencias y mejores prácticas del sistema. Actualízala conforme evolucione el proyecto.
