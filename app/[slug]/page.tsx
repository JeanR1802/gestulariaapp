// app/[slug]/page.tsx
// This page handles public site rendering for subdomains
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicSitePage({ params }: PageProps) {
  const { slug } = await params;
  
  console.log('[PUBLIC SITE PAGE] Rendering for slug:', slug);
  
  try {
    // Fetch the site data from the API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/site/${slug}`, {
      cache: 'no-store',
    });
    
    console.log('[PUBLIC SITE PAGE] API response status:', response.status);
    
    if (!response.ok) {
      console.error('[PUBLIC SITE PAGE] Failed to fetch site:', response.status);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Site Not Found</h1>
            <p className="text-gray-600">The site &quot;{slug}&quot; could not be found.</p>
          </div>
        </div>
      );
    }
    
    const html = await response.text();
    console.log('[PUBLIC SITE PAGE] Received HTML length:', html.length);
    
    // Return the HTML as a component
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    );
  } catch (error) {
    console.error('[PUBLIC SITE PAGE] Error rendering site:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Error Loading Site</h1>
          <p className="text-gray-600">An error occurred while loading this site.</p>
        </div>
      </div>
    );
  }
}
