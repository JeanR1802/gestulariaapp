// app/[slug]/page.tsx
// This page handles public site rendering for subdomains
import { getTenantBySlug } from '@/lib/tenant';
import { renderBlocksToHTML } from '@/app/lib/render-blocks-to-html';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicSitePage({ params }: PageProps) {
  const { slug } = await params;
  
  console.log('[PUBLIC SITE PAGE] Rendering for slug:', slug);
  
  try {
    // Get tenant data directly from database instead of HTTP fetch
    const tenant = await getTenantBySlug(slug);
    console.log('[PUBLIC SITE PAGE] Tenant found:', !!tenant);
    
    if (!tenant) {
      console.error('[PUBLIC SITE PAGE] Tenant not found for slug:', slug);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Site Not Found</h1>
            <p className="text-gray-600">The site &quot;{slug}&quot; could not be found.</p>
          </div>
        </div>
      );
    }

    const page = tenant.pages.find((p: { slug: string; published?: boolean }) => p.slug === '/' && p.published) || tenant.pages[0];
    console.log('[PUBLIC SITE PAGE] Page found:', !!page, 'has content:', !!page?.content);
    
    if (!page || !page.content) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Site Under Construction</h1>
            <p className="text-gray-600">This site is being built. Check back soon!</p>
          </div>
        </div>
      );
    }

    try {
      const blocks = JSON.parse(page.content);
      console.log('[PUBLIC SITE PAGE] Blocks parsed:', Array.isArray(blocks), 'count:', blocks?.length);
      
      if (Array.isArray(blocks)) {
        // Generate full HTML document
        const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
        const cssUrl = `${basePath}/_next/static/css/tailwind.css`;
        const blockBehaviorsUrl = `${basePath}/block-behaviors.js`;
        const faviconUrl = `${basePath}/lgo.png`;

        const fullHtml = await renderBlocksToHTML(blocks, { cssUrl, blockBehaviorsUrl, faviconUrl });
        console.log('[PUBLIC SITE PAGE] HTML generated, length:', fullHtml?.length);
        
        return (
          <div 
            dangerouslySetInnerHTML={{ __html: fullHtml }}
            suppressHydrationWarning
          />
        );
      }
    } catch (parseError) {
      console.error('[PUBLIC SITE PAGE] Error parsing/rendering blocks:', parseError);
      // Fall through to fallback HTML
    }
    
    // Fallback: serve existing page.content embedded in a simple HTML shell
    const fallbackHtml = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${page.title || tenant.name}</title><meta name="description" content="${tenant.description || ''}"><script src="https://cdn.tailwindcss.com"></script>${tenant.config && tenant.config.customCSS ? `<style>${tenant.config.customCSS}</style>` : ''}</head><body>${page.content}</body></html>`;
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: fallbackHtml }}
        suppressHydrationWarning
      />
    );
  } catch (error) {
    console.error('[PUBLIC SITE PAGE] Error rendering site:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Error Loading Site</h1>
          <p className="text-gray-600 mb-4">An error occurred while loading this site.</p>
          <p className="text-sm text-gray-500">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}
